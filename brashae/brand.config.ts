/**
 * brand.config.ts
 * ─────────────────────────────────────────────────────
 * Single source of truth for all client branding.
 * Clone this template, edit this file, and the entire
 * storefront automatically reflects the new brand.
 * ─────────────────────────────────────────────────────
 */

export const brand = {
  // Store identity
  name: "Brashae's Barber Beauty Supply",
  tagline: "Professional Tools for Professional Barbers",
  domain: "shop.brashaesbeautysupplytx.com",

  // Social
  instagram: "TheClipperConnect713",
  tiktok: "",
  facebook: "Brashae's Beauty Supply",
  twitter: "@Brashaes",

  // Logo paths (place files in /public/brand/)
  logo: {
    symbol: "/brand/logo-symbol.png",      // icon/mark only (B|B monogram)
    symbolLight: "/brand/logo-symbol-light.png",
    wordmark: "/brand/logo-wordmark.png",  // full name
    wordmarkLight: "/brand/logo-wordmark-light.png",
    alt: "Brashae's Barber Beauty Supply Logo",
  },

  // Palette — Black + Gold
  colors: {
    // Legacy fields (kept for backward compat)
    primary: "#000000",
    primaryFg: "#ffffff",
    accent: "#C9A84C",       // Brashae gold
    accentFg: "#000000",
    bg: "#000000",
    surface: "#111111",
    border: "#2a2a2a",
    text: "#ffffff",
    textMuted: "#7e7e7e",

    // Full token set
    canvas: "#000000",           // page floor
    surfaceSoft: "#0a0a0a",      // near-black panels
    surfaceCard: "#111111",      // cards, panels
    surfaceElevated: "#1c1c1c",  // modals, dropdowns
    hairline: "#2a2a2a",         // dividers, borders
    onDark: "#ffffff",           // headlines, primary text
    bodyColor: "#bbbbbb",        // body paragraphs
    bodyStrong: "#e6e6e6",       // lead paragraphs
    muted: "#7e7e7e",            // captions, footer links
    gold: "#C9A84C",             // Brashae brand gold
    goldLight: "#E8C96A",        // gold hover/highlight
    goldDim: "#8A6E2E",          // gold subtle/muted
  },

  // Typography weights
  typography: {
    displayWeight: 700,
    bodyWeight: 400,
  },

  // Typography (Google Fonts names)
  fonts: {
    display: "Inter",
    body: "Inter",
    mono: "JetBrains Mono",
  },

  // Shipping (USD cents)
  shipping: {
    flatRate: 800,        // $8.00 flat
    freeThreshold: 7500,  // free over $75
  },

  // Storefront copy
  copy: {
    heroHeadline: "Tools Built for the Craft",
    heroSubline: "Houston's home for professional barber supplies. Andis, Wahl, BaByliss PRO, JRL, and more.",
    heroCta: "Shop Now",
  },
} as const;

export type Brand = typeof brand;
