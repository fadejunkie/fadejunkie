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
  name: "Arquero Co.",
  tagline: "Aim True. Weld True.",
  domain: "arqueroco.com",

  // Social
  instagram: "",
  tiktok: "",

  // Logo paths (place files in /public/brand/)
  logo: {
    symbol: "/brand/master-symbol.svg",        // icon/mark only (dark)
    symbolLight: "/brand/master-symbol-light.svg",
    wordmark: "/brand/master-logo-text.svg",   // wordmark (dark)
    wordmarkLight: "/brand/master-logo-text-light.svg",
    alt: "Arquero Co. Logo",
  },

  // Palette — Southwest Ranch design system
  colors: {
    // Legacy fields (kept for backward compat)
    primary: "#004AAD",
    primaryFg: "#FFEECE",
    accent: "#DAAC58",        // golden tan — accent moments
    accentFg: "#313131",
    bg: "#FFEECE",            // warm cream canvas
    surface: "#FFFFFF",
    border: "#DAAC58",        // golden tan dividers
    text: "#474444",          // dark charcoal
    textMuted: "#6189BE",     // steel blue muted

    // Full token set
    canvas: "#FFEECE",            // warm cream page floor
    surfaceSoft: "#F5E8D0",       // slightly deeper cream panels
    surfaceCard: "#FFFFFF",       // product cards
    surfaceElevated: "#FFF5E0",   // modals, dropdowns
    hairline: "#DAAC58",          // golden tan dividers
    onDark: "#FFEECE",            // text on dark/blue/maroon surfaces
    bodyColor: "#474444",         // body paragraphs — dark charcoal
    bodyStrong: "#313131",        // lead paragraphs, strong text
    muted: "#6189BE",             // steel blue — captions, footer links
  },

  // Typography weights
  typography: {
    displayWeight: 700,
    bodyWeight: 400,
  },

  // Typography (Google Fonts names)
  fonts: {
    display: "Space Cowboy",
    body: "DM Sans",
    mono: "DM Mono",
  },

  // Shipping (USD cents)
  shipping: {
    flatRate: 800,        // $8.00 flat
    freeThreshold: 7500,  // free over $75
  },

  // Storefront copy
  copy: {
    heroHeadline: "Aim True. Weld True.",
    heroSubline: "Western-crafted apparel for the modern tradesman.",
    heroCta: "Shop Now",
  },
} as const;

export type Brand = typeof brand;
