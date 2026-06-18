import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { brand } from "@/brand.config";

const interDisplay = Inter({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const interBody = Inter({
  weight: "300",
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
    <html lang="en" className={`h-full ${interDisplay.variable} ${interBody.variable}`}>
      <body className="min-h-full flex flex-col antialiased" style={{ background: "var(--canvas)", color: "var(--on-dark)", fontFamily: "var(--font-body)", fontWeight: 300 }}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
