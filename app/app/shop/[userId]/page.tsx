import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { notFound } from "next/navigation";
import ShopTemplate from "@/components/ShopTemplate";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function ShopPage({ params }: PageProps) {
  const { userId } = await params;

  let shop;
  try {
    shop = await fetchQuery(api.shops.getShopByUserId, {
      userId: userId as Id<"users">,
    });
  } catch {
    notFound();
  }

  if (!shop) notFound();

  return (
    <ShopTemplate
      shop={{
        shopName: shop.shopName,
        tagline: shop.tagline,
        address: shop.address,
        phone: shop.phone,
        hours: shop.hours,
        about: shop.about,
        logoUrl: shop.logoUrl,
        barberSlugs: shop.barberSlugs,
      }}
    />
  );
}
