import type { Metadata } from "next";
import { Inter, Spectral, Geist_Mono, Geist } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { cn } from "@/lib/utils";
import DevBanner from "@/components/DevBanner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "fadejunkie — the barber community",
  description: "Connect with barbers, build your brand, and grow your business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
        <body className={`${inter.variable} ${spectral.variable} ${geistMono.variable}`}>
          <DevBanner />
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
