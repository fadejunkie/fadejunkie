import { query } from "./_generated/server";

export const stats = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const orders = await ctx.db.query("orders").collect();

    const totalProducts = products.length;
    const outOfStock = products.filter((p) => !p.inStock).length;
    const pendingOrders = orders.filter(
      (o) => o.status === "pending" || o.status === "paid"
    ).length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    return { totalProducts, outOfStock, pendingOrders, totalRevenue };
  },
});
