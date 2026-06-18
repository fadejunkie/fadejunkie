import type { Metadata } from "next";
import { Rye, DM_Sans } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { brand } from "@/brand.config";

// Rye is the fallback display font until Space Cowboy (brand kit) is self-hosted.
// Drop space-cowboy.woff2 into public/fonts/ — globals.css picks it up via @font-face.
const ryeDisplay = Rye({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rye",
  display: "swap",
});

const dmSansBody = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${ryeDisplay.variable} ${dmSansBody.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased" style={{ background: "var(--canvas)", color: "var(--body)", fontFamily: "var(--font-body)", fontWeight: 400 }}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
