/**
 * brand.config.ts — Arquero Co.
 * ─────────────────────────────────────────────────────
 * Southwest Ranch palette · Space Cowboy display · DM Sans body
 * ─────────────────────────────────────────────────────
 */

export const brand = {
  // Store identity
  name: "Arquero Co.",
  tagline: "Aim True. Weld True.",
  domain: "arqueroco.com",

  // Social
  instagram: "arquerocoapparel",
  tiktok: "arquerocoapparel",

  // Logo paths (files in /public/brand/)
  logo: {
    symbol: "/brand/logo-symbol.svg",
    symbolLight: "/brand/logo-symbol-light.svg",
    wordmark: "/brand/logo-wordmark.svg",
    full: "/brand/logo-full.svg",
    alt: "Arquero Co. Logo",
  },

  // Palette — Southwest Ranch design system
  colors: {
    // Legacy aliases (kept for backward compat)
    primary: "#004AAD",
    primaryFg: "#FFEECE",
    accent: "#DAAC58",
    accentFg: "#313131",
    bg: "#FFEECE",
    surface: "#FFF5E0",
    border: "#DAAC58",
    text: "#474444",
    textMuted: "#7A6E5F",

    // Full Arquero token set
    canvas: "#FFEECE",          // page floor — warm cream, sun-faded parchment
    surfaceSoft: "#F5E8D0",     // alternate section bands, footer bg
    surfaceCard: "#FFF5E0",     // cards, panels, raised elements
    surfaceElevated: "#FFFFFF", // inputs, nested cards
    hairline: "#DAAC58",        // all dividers/borders — golden tan
    onDark: "#FFEECE",          // text on blue-filled surfaces
    bodyColor: "#474444",       // primary body text — dark charcoal
    bodyStrong: "#313131",      // subheadings, strong labels
    muted: "#7A6E5F",           // captions, helper text — warm brown-gray
  },

  // Typography weights
  typography: {
    displayWeight: 700,
    bodyWeight: 400,
  },

  // Fonts
  fonts: {
    display: "Space Cowboy",   // self-hosted — @font-face in globals.css, Rye fallback
    body: "DM Sans",
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
    heroSubline: "Premium apparel built for the modern tradesman. Earned on the job site. Worn everywhere else.",
    heroCta: "Shop Now",
  },
} as const;

export type Brand = typeof brand;
