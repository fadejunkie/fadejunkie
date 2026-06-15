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
  name: "Hutto Dealership",
  tagline: "Your next vehicle is right here in Hutto.",
  domain: "huttodealership.anthonytatis.com",

  // Social
  instagram: "",
  tiktok: "",

  // Logo paths (place files in /public/brand/)
  logo: {
    symbol: "/brand/logo-symbol.png",      // icon/mark only
    symbolLight: "/brand/logo-symbol-light.png",
    wordmark: "/brand/logo-symbol-light.png",  // full name (use symbol as fallback)
    wordmarkLight: "/brand/logo-symbol-light.png",
    alt: "Hutto Dealership Logo",
  },

  // Palette — Light dealership design system
  colors: {
    // Legacy fields (kept for backward compat)
    primary: "#0d1b2a",
    primaryFg: "#ffffff",
    accent: "#1B3A6B",
    accentFg: "#ffffff",
    bg: "#ffffff",
    surface: "#f1f3f5",
    border: "#dee2e6",
    text: "#0d1b2a",
    textMuted: "#868e96",

    // Full token set
    canvas: "#ffffff",
    surfaceSoft: "#f8f9fa",
    surfaceCard: "#f1f3f5",
    surfaceElevated: "#ffffff",
    hairline: "#dee2e6",
    onDark: "#0d1b2a",
    bodyColor: "#495057",
    bodyStrong: "#212529",
    muted: "#868e96",
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
    heroHeadline: "Find Your Next Vehicle in Hutto",
    heroSubline: "Quality pre-owned vehicles for every budget. Browse our inventory and schedule a test drive today.",
    heroCta: "Browse Inventory",
  },
} as const;

export type Brand = typeof brand;
