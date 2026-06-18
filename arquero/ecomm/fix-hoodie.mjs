import { ConvexHttpClient } from "convex/browser";
const client = new ConvexHttpClient("http://127.0.0.1:3210");

const products = await client.query("products:list", {});
console.log("Products:", products.map(p => p.name));
const hoodie = products.find(p => p.slug === "workshop-hoodie");
if (!hoodie) { console.log("Hoodie not found"); process.exit(1); }
console.log("Found:", hoodie._id);

await client.mutation("products:update", {
  id: hoodie._id,
  images: ["https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80"],
});
console.log("Hoodie image fixed.");
