# Brashae's Barber Beauty Supply — Ecomm Store

**Client:** Brashae's Barber Beauty Supply | Raimons | Houston, TX  
**Stack:** Next.js 16 (App Router, TypeScript, Tailwind) + Convex + Stripe  
**Domain:** shop.brashaesbeautysupply.com  
**Palette:** Black + Gold (#C9A84C)  
**Convex:** Local dev deployment (cloud TBD before production)

## Commands

```bash
npm run dev          # Dev server (needs Convex running separately)
npx convex dev       # Convex local dev (run in parallel)
npm run build        # Production build
```

**Deploy:**
```bash
npx convex deploy -y
npm run build && npx vercel build --prod && npx vercel deploy --prebuilt --prod
```

## How to Brand for a Client

1. Copy this directory: `cp -r ~/fadejunkie/ecomm ~/fadejunkie/{clientslug}`
2. Run `cd ~/fadejunkie/{clientslug} && npx convex dev --once` → creates new isolated Convex deployment
3. Edit `brand.config.ts` — name, tagline, colors, logo paths, shipping thresholds
4. Drop logo files into `public/brand/` (4 files: symbol, symbol-light, wordmark, wordmark-light)
5. Set env vars in `.env.local`: `NEXT_PUBLIC_CONVEX_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
6. Add products via `/admin/products`
7. Deploy

## Architecture

```
app/
  page.tsx              ← Home (hero + featured products)
  shop/
    page.tsx            ← Product catalog (filterable by collection)
    [slug]/page.tsx     ← Product detail + add to cart
  cart/page.tsx         ← Cart with qty controls + checkout trigger
  order-confirmation/   ← Post-Stripe success page
  admin/
    page.tsx            ← Dashboard (stats + recent orders)
    products/page.tsx   ← CRUD: create/edit/delete products
    orders/page.tsx     ← Order management + status updates

convex/
  schema.ts             ← products, collections, orders, cartItems
  products.ts           ← list, getBySlug, getById, create, update, remove
  collections.ts        ← list, getBySlug, create, update, remove
  cart.ts               ← getCart, addItem, updateQty, removeItem, clearCart
  orders.ts             ← createOrder, markPaid, updateStatus, list, getByStripeSession
  stripe.ts             ← createCheckoutSession (action), stripeWebhook (httpAction)
  http.ts               ← routes POST /stripe/webhook

components/
  ConvexClientProvider  ← wraps app with ConvexProvider
  Navbar                ← sticky nav with cart count
  Footer                ← brand footer
  ProductCard           ← reusable product tile
  FeaturedProducts      ← homepage featured grid

brand.config.ts         ← ALL client-specific config lives here
lib/cart.ts             ← getCartSessionId(), formatPrice()
```

## Cart Architecture

Cart is anonymous — uses a UUID stored in `localStorage` as `cart_session_id`. No auth required. Items live in Convex `cartItems` table keyed by `sessionId`.

## Stripe Flow

1. Cart page calls `createCheckoutSession` Convex action
2. Action creates Stripe Checkout Session, returns URL
3. Client redirects to Stripe-hosted checkout
4. Stripe POSTs to `/api/stripe/webhook` (Convex HTTP action)
5. Webhook verifies signature, calls `orders.markPaid`, clears cart
6. Stripe redirects to `/order-confirmation?session_id=...`

## Required Env Vars

| Var | Where |
|-----|-------|
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local` |
| `STRIPE_SECRET_KEY` | Convex dashboard env |
| `STRIPE_WEBHOOK_SECRET` | Convex dashboard env |

**Note:** Stripe keys go in Convex dashboard env (not `.env.local`) because they're used inside Convex actions.

## Admin Access

`/admin` has no auth in v1. Protect in prod by adding a middleware check for `NEXT_PUBLIC_ADMIN_KEY` query param, or add Convex Auth later.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
