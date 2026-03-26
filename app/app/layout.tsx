import type { Metadata } from "next";
import { Geist_Mono, Geist, Courier_Prime, Bricolage_Grotesque, League_Spartan } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { cn } from "@/lib/utils";
import DevBanner from "@/components/DevBanner";

/* ── UI / Navigation font ─── */
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

/* ── Display / Headlines font ─── */
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/* ── Body / Typewriter font ─── */
const courierPrime = Courier_Prime({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

/* ── Heading font — League Spartan ─── */
const leagueSpartan = League_Spartan({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

/* ── Code / Label accent font ─── */
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
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          "font-sans",
          geist.variable,
          bricolage.variable,
          courierPrime.variable,
          geistMono.variable,
          leagueSpartan.variable,
        )}
      >
        <body>
          <DevBanner />
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
