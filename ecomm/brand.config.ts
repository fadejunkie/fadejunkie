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
  name: "Store Name",
  tagline: "Your tagline here",
  domain: "yourdomain.com",

  // Social
  instagram: "",
  tiktok: "",

  // Logo paths (place files in /public/brand/)
  logo: {
    symbol: "/brand/logo-symbol.png",      // icon/mark only
    symbolLight: "/brand/logo-symbol-light.png",
    wordmark: "/brand/logo-symbol-light.png",  // full name (use symbol as fallback)
    wordmarkLight: "/brand/logo-symbol-light.png",
    alt: "Store Name Logo",
  },

  // Palette — BMW M-inspired design system
  colors: {
    // Legacy fields (kept for backward compat)
    primary: "#000000",
    primaryFg: "#ffffff",
    accent: "#e22718",       // M red — tricolor accent stripe
    accentFg: "#ffffff",
    bg: "#000000",
    surface: "#1a1a1a",
    border: "#3c3c3c",
    text: "#ffffff",
    textMuted: "#7e7e7e",

    // Full BMW M token set
    canvas: "#000000",           // page floor
    surfaceSoft: "#0d0d0d",      // near-black panels
    surfaceCard: "#1a1a1a",      // cards, panels
    surfaceElevated: "#262626",  // modals, dropdowns
    hairline: "#3c3c3c",         // dividers, borders
    onDark: "#ffffff",           // headlines, primary text
    bodyColor: "#bbbbbb",        // body paragraphs
    bodyStrong: "#e6e6e6",       // lead paragraphs
    muted: "#7e7e7e",            // captions, footer links
  },

  // Typography weights
  typography: {
    displayWeight: 700,
    bodyWeight: 300,
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
    heroHeadline: "Wear What You Stand For",
    heroSubline: "Premium apparel built for those who take their craft seriously.",
    heroCta: "Shop Now",
  },
} as const;

export type Brand = typeof brand;
