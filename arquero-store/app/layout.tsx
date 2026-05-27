import type { Metadata } from "next";
import { DM_Sans, Rye } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { brand } from "@/brand.config";

// DM Sans — body font
const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Rye — display fallback until space-cowboy.woff2 is dropped into public/fonts/
// Loaded as --font-rye; globals.css cascades: 'Space Cowboy', var(--font-rye), serif
const rye = Rye({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rye",
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
    <html lang="en" className={`h-full ${dmSans.variable} ${rye.variable}`} suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col antialiased"
        style={{
          background: "var(--canvas)",
          color: "var(--body)",
          fontFamily: "var(--font-body)",
        }}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
