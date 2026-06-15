import { action, httpAction } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Creates a Stripe Checkout Session and returns the URL
export const createCheckoutSession = action({
  args: {
    sessionId: v.string(), // cart session ID
    successUrl: v.string(),
    cancelUrl: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-04-22.dahlia" as const,
    });

    const cartItems = await ctx.runQuery(api.cart.getCart, {
      sessionId: args.sessionId,
    });

    if (!cartItems.length) throw new Error("Cart is empty");

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.variant
            ? `${item.productName} — ${item.variant}`
            : item.productName,
          images: item.image ? [item.image] : [],
        },
        unit_amount: item.unitPrice,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: `${args.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: args.cancelUrl,
      metadata: { cartSessionId: args.sessionId },
    });

    return session.url!;
  },
});

// Stripe webhook — called by Stripe, verifies signature, marks order paid
export const stripeWebhook = httpAction(async (ctx, request) => {
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia" as const,
  });

  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response(`Webhook error: ${err}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    await ctx.runMutation(api.orders.markPaid, {
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
    });
    // Clear the cart
    if (session.metadata?.cartSessionId) {
      await ctx.runMutation(api.cart.clearCart, {
        sessionId: session.metadata.cartSessionId,
      });
    }
  }

  return new Response(null, { status: 200 });
});
