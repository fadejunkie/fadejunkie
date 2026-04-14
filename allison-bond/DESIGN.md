# Design System: Bond Agency
**Project:** Life Insurance Landing Page — Allison Bond

---

## 1. Visual Theme & Atmosphere

Quietly authoritative. The site carries the weight of something important — protecting families — without feeling heavy. Clean white space dominates, punctuated by a deep navy presence that communicates stability and trust. Gold accents appear sparingly but meaningfully, like a warm handshake from someone who has earned it. The overall mood is: *professional without being cold, personal without being casual.* Think a well-pressed suit paired with a genuine smile.

Density is low. Sections breathe. Nothing competes. The user should feel that Bond Agency has done the hard thinking so they don't have to.

---

## 2. Color Palette & Roles

| Name | Hex | Role |
|------|-----|------|
| **Midnight Authority** | `#1a2c4e` | Primary — navbars, hero backgrounds, primary CTAs, section anchors |
| **Warm Commission Gold** | `#c9a227` | Accent — highlights, underlines, icon fills, hover states, badge borders |
| **Polished Gold Hover** | `#e2b93b` | Accent hover state — buttons, links on hover |
| **Trust White** | `#ffffff` | Page background — infinite breathing room |
| **Whisper Card** | `#f8fafc` | Card backgrounds, alternate section fills — barely there warmth |
| **Rule Line** | `#e2e8f0` | Borders, dividers, input strokes — structure without weight |
| **Counsel Gray** | `#64748b` | Secondary text, labels, captions — present but subordinate |
| **Iron Ink** | `#0f172a` | Primary body text, headings — full presence |
| **Policy Green** | `#22c55e` | Success states — form confirmation, checkmarks, completed indicators |
| **Alert Ember** | `#ef4444` | Error states, required field indicators |

---

## 3. Typography Rules

**Headings:** Playfair Display — used for all section titles, hero headlines, and milestone names. Weight 700–900. Carries the gravitas of an institution. Letter spacing slightly tight (-0.5px to 0) to feel confident, not loose. Never used for body copy.

**Body + UI:** Inter — used for everything else: labels, descriptions, form text, navigation, tags. Weight 300–700 depending on hierarchy. Light (300) for long-form descriptions. Bold (700) for labels and UI chrome. Letter spacing often elevated (1–4px) for uppercase label text to create clarity and separation.

**Scale:** Hero headline at 40–52px. Section titles at 28–34px. Card titles at 14–16px. Labels at 9–11px uppercase with 2–4px letter spacing. Body at 12–14px, line height 1.7–1.9 for comfortable reading.

---

## 4. Component Stylings

**Buttons — Primary:** Midnight Authority background (#1a2c4e), white text. Generously padded (12px 32px). Slightly rounded corners (6px). Bold Inter, 12px, 1.5px letter spacing, uppercase. On hover: shifts toward gold or lightens navy. No border — color alone provides definition.

**Buttons — Secondary / Ghost:** Transparent background with a 1px Authority Navy or gold border. Navy or gold text. Same radius and padding as primary. Used for "Learn More," "View All," secondary CTAs.

**Cards:** Whisper Card background (#f8fafc), 1px Rule Line border (#e2e8f0), 8px corner radius (subtly rounded — safe and considered, not playful). Whisper-soft box-shadow (`0 1px 4px rgba(0,0,0,0.05)`) — elevation implied but never dramatic. Internal padding 20–24px.

**Service Icons / Badges:** Small circle or shield shapes in gold (#c9a227) or gold-tinted muted fill. Convey category without needing stock icons.

**Inputs / Forms:** Whisper Card or white background, 1px Rule Line border. 6px radius. 10–14px internal padding. On focus: border shifts to Authority Navy. Label text in gold uppercase, 9px, 3px letter spacing — reads like a form designed by someone who cares about the experience.

**Navigation:** Sticky at top. White or Navy background (dark hero = white nav, inverted on scroll). Logo left-aligned. Nav links spaced right, 11px uppercase Inter, 700 weight, Counsel Gray at rest, Commission Gold on active/hover. Phone number right-aligned in gold.

**Trust Badges / Testimonial Cards:** White card, 8px radius, soft shadow. Opening quote mark in Commission Gold, oversized (24–32px). Reviewer name in bold Iron Ink. Star ratings in Commission Gold if used.

---

## 5. Layout Principles

**Maximum content width:** 900–960px, centered. Full-bleed hero backgrounds, constrained content columns.

**Whitespace:** Generous vertical padding — 48–64px between sections. 24px internal padding on mobile. Sections breathe so the user never feels crowded.

**Hero:** Full-bleed navy-to-midnight gradient background. Content left-aligned within a ~560px column. Headline large. Sub-headline muted. Two CTAs side by side — primary (navy/white) and ghost (white outline).

**Services Grid:** 2-up or 3-up depending on viewport. Each card equal height. Gold accent line or icon top-left. Service name bold, description muted.

**About Section:** Split layout — photo/avatar placeholder left, text right (or stacked on mobile). Warm tone, first-person. Credentials listed below as small labeled chips.

**Lead Form:** Centered, max-width 480px. Single column. Labels above inputs. Submit button full width. Confirmation state replaces the form with a success card.

**Footer:** Midnight Authority background, light text. Three columns: Brand + tagline, Navigate links, Contact info. Copyright bar below divider.

---

## 6. Tone & Copy Voice

Warm, expert, protective. Never salesy. Copy leads with outcomes for the reader ("protect your family" not "buy a policy"). Short sentences. Active voice. First person where Allison speaks directly. Section labels are uppercase and terse. Headlines use Playfair Display and carry emotional weight — they're the one place the copy can be slightly poetic.

---

## 7. Design Anti-Patterns to Avoid

- No stock-photo clichés (handshake photos, suits pointing at charts)
- No red urgency tactics ("ACT NOW," countdown timers)
- No corporate insurance template aesthetics (blue gradients, shield logos everywhere)
- No wall-of-text copy — every paragraph max 3 lines
- No dark-on-dark or gold-on-gold — always ensure sufficient contrast
