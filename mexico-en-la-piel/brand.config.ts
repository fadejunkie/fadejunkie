/**
 * brand.config.ts — Mexico En La Piel
 * ─────────────────────────────────────────────────────
 * Mexican heritage palette · handcrafted leather goods · San Antonio TX
 * ─────────────────────────────────────────────────────
 */

export const brand = {
  // Store identity
  name: "Mexico En La Piel",
  tagline: "Handcrafted in the Heart of Mexico.",
  domain: "mexicoenpieltx.com",

  // Social
  instagram: "mexico.enla.piel",
  tiktok: "",

  // Logo paths (files in /public/brand/)
  logo: {
    symbol: "/brand/logo-symbol.svg",
    symbolLight: "/brand/logo-symbol-light.svg",
    wordmark: "/brand/logo-wordmark.svg",
    full: "/brand/logo-full.svg",
    alt: "Mexico En La Piel Logo",
  },

  // Palette — Mexican heritage leather palette
  colors: {
    // Legacy aliases
    primary: "#5C1A0A",       // deep adobe red
    primaryFg: "#F5E6D3",     // warm parchment
    accent: "#C4882A",        // burnished gold
    accentFg: "#1A0A00",
    bg: "#F5E6D3",            // warm parchment
    surface: "#EDD9BE",
    border: "#C4882A",
    text: "#2A1205",
    textMuted: "#7A5C3F",

    // Full token set
    canvas: "#F5E6D3",          // page floor — sun-warmed parchment
    surfaceSoft: "#EDD9BE",     // alternate bands, footer
    surfaceCard: "#F9EEE0",     // cards, panels
    surfaceElevated: "#FFFFFF", // inputs, nested cards
    hairline: "#C4882A",        // dividers — burnished gold
    onDark: "#F5E6D3",          // text on dark surfaces
    bodyColor: "#2A1205",       // primary body — deep leather brown
    bodyStrong: "#1A0A00",      // subheadings, labels
    muted: "#7A5C3F",           // captions, helper text — warm brown
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
    freeThreshold: 10000, // free over $100
  },

  // Storefront copy
  copy: {
    heroHeadline: "Wear Mexico. Own It.",
    heroSubline: "Handcrafted leather goods from Mexico, Argentina, and Latin America — hand-tooled by artisans, built to last a lifetime.",
    heroCta: "Shop Now",
  },
} as const;

export type Brand = typeof brand;
