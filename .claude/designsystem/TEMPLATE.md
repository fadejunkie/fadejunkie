---
version: "1.0"
name: "{{BRAND_NAME}}"
description: "{{BRAND_DESCRIPTION}}"

colors:
  primary: "{{COLOR_PRIMARY}}"
  primary-hover: "{{COLOR_PRIMARY_HOVER}}"
  primary-press: "{{COLOR_PRIMARY_PRESS}}"
  primary-soft: "{{COLOR_PRIMARY_SOFT}}"
  on-primary: "{{COLOR_ON_PRIMARY}}"
  secondary: "{{COLOR_SECONDARY}}"
  on-secondary: "{{COLOR_ON_SECONDARY}}"
  accent: "{{COLOR_ACCENT}}"
  canvas: "{{COLOR_CANVAS}}"
  canvas-soft: "{{COLOR_CANVAS_SOFT}}"
  surface-1: "{{COLOR_SURFACE_1}}"
  surface-2: "{{COLOR_SURFACE_2}}"
  ink: "{{COLOR_INK}}"
  ink-secondary: "{{COLOR_INK_SECONDARY}}"
  ink-muted: "{{COLOR_INK_MUTED}}"
  hairline: "{{COLOR_HAIRLINE}}"
  semantic-success: "{{COLOR_SUCCESS}}"
  semantic-error: "{{COLOR_ERROR}}"
  semantic-warning: "{{COLOR_WARNING}}"
  semantic-info: "{{COLOR_INFO}}"

typography:
  display-xl:
    fontFamily: "{{FONT_DISPLAY}}"
    fontSize: "{{DISPLAY_XL_SIZE}}"
    fontWeight: "{{DISPLAY_XL_WEIGHT}}"
    lineHeight: "{{DISPLAY_XL_LH}}"
    letterSpacing: "{{DISPLAY_XL_LS}}"
  display-lg:
    fontFamily: "{{FONT_DISPLAY}}"
    fontSize: "{{DISPLAY_LG_SIZE}}"
    fontWeight: "{{DISPLAY_LG_WEIGHT}}"
    lineHeight: "{{DISPLAY_LG_LH}}"
    letterSpacing: "{{DISPLAY_LG_LS}}"
  display-md:
    fontFamily: "{{FONT_DISPLAY}}"
    fontSize: "{{DISPLAY_MD_SIZE}}"
    fontWeight: "{{DISPLAY_MD_WEIGHT}}"
    lineHeight: "{{DISPLAY_MD_LH}}"
    letterSpacing: "{{DISPLAY_MD_LS}}"
  heading-lg:
    fontFamily: "{{FONT_DISPLAY}}"
    fontSize: "{{HEADING_LG_SIZE}}"
    fontWeight: "{{HEADING_WEIGHT}}"
    lineHeight: "{{HEADING_LH}}"
    letterSpacing: "{{HEADING_LS}}"
  heading-md:
    fontFamily: "{{FONT_DISPLAY}}"
    fontSize: "{{HEADING_MD_SIZE}}"
    fontWeight: "{{HEADING_WEIGHT}}"
    lineHeight: "{{HEADING_LH}}"
    letterSpacing: "{{HEADING_LS}}"
  heading-sm:
    fontFamily: "{{FONT_DISPLAY}}"
    fontSize: "{{HEADING_SM_SIZE}}"
    fontWeight: "{{HEADING_WEIGHT}}"
    lineHeight: "{{HEADING_LH}}"
    letterSpacing: "{{HEADING_LS}}"
  body-lg:
    fontFamily: "{{FONT_BODY}}"
    fontSize: "{{BODY_LG_SIZE}}"
    fontWeight: "{{BODY_WEIGHT}}"
    lineHeight: "{{BODY_LH}}"
    letterSpacing: "{{BODY_LS}}"
  body-md:
    fontFamily: "{{FONT_BODY}}"
    fontSize: "{{BODY_MD_SIZE}}"
    fontWeight: "{{BODY_WEIGHT}}"
    lineHeight: "{{BODY_LH}}"
    letterSpacing: "{{BODY_LS}}"
  body-sm:
    fontFamily: "{{FONT_BODY}}"
    fontSize: "{{BODY_SM_SIZE}}"
    fontWeight: "{{BODY_WEIGHT}}"
    lineHeight: "{{BODY_LH}}"
    letterSpacing: "{{BODY_LS}}"
  caption:
    fontFamily: "{{FONT_BODY}}"
    fontSize: "{{CAPTION_SIZE}}"
    fontWeight: "{{CAPTION_WEIGHT}}"
    lineHeight: "{{CAPTION_LH}}"
    letterSpacing: "{{CAPTION_LS}}"
  button:
    fontFamily: "{{FONT_BODY}}"
    fontSize: "{{BUTTON_SIZE}}"
    fontWeight: "{{BUTTON_WEIGHT}}"
    lineHeight: "1.0"
    letterSpacing: "{{BUTTON_LS}}"
  eyebrow:
    fontFamily: "{{FONT_BODY}}"
    fontSize: "{{EYEBROW_SIZE}}"
    fontWeight: "{{EYEBROW_WEIGHT}}"
    lineHeight: "1.3"
    letterSpacing: "{{EYEBROW_LS}}"
    textTransform: "uppercase"

rounded:
  none: 0px
  xs: "{{RADIUS_XS}}"
  sm: "{{RADIUS_SM}}"
  md: "{{RADIUS_MD}}"
  lg: "{{RADIUS_LG}}"
  xl: "{{RADIUS_XL}}"
  pill: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  xxxl: 48px
  huge: 64px
  super: 96px

components:
  button-primary: "{{COMPONENT_BUTTON_PRIMARY}}"
  button-secondary: "{{COMPONENT_BUTTON_SECONDARY}}"
  button-ghost: "{{COMPONENT_BUTTON_GHOST}}"
  card-default: "{{COMPONENT_CARD}}"
  card-featured: "{{COMPONENT_CARD_FEATURED}}"
  nav-bar: "{{COMPONENT_NAV}}"
  input-text: "{{COMPONENT_INPUT}}"
  badge: "{{COMPONENT_BADGE}}"
---

# {{BRAND_NAME}} Design System

> **Client:** {{BRAND_NAME}} · **Slug:** {{CLIENT_SLUG}} · **Generated:** {{GENERATED_DATE}}
> **Brand Archetype:** {{BRAND_ARCHETYPE}} · **Personality:** {{BRAND_PERSONALITY}}

---

## Brand Identity

### Logo

{{LOGO_DESCRIPTION}}

**Logo files:**
- Symbol mark (dark): `{{LOGO_SYMBOL_DARK}}`
- Symbol mark (light): `{{LOGO_SYMBOL_LIGHT}}`
- Wordmark (dark): `{{LOGO_WORDMARK_DARK}}`
- Wordmark (light): `{{LOGO_WORDMARK_LIGHT}}`

**Logo clear zone:** Minimum padding equal to the cap-height of the wordmark on all sides. Never crowd the mark.

**Forbidden:** Stretching, recoloring outside approved palette, dropping shadow on mark, placing on low-contrast backgrounds.

---

## Colors

### Palette Overview

{{COLOR_PALETTE_NARRATIVE}}

### Primary & Brand

| Token | Hex | Role |
|---|---|---|
| `{colors.primary}` | `{{COLOR_PRIMARY}}` | Primary CTA, key links, brand voltage |
| `{colors.primary-hover}` | `{{COLOR_PRIMARY_HOVER}}` | Hover state on primary buttons |
| `{colors.primary-press}` | `{{COLOR_PRIMARY_PRESS}}` | Active/pressed state |
| `{colors.primary-soft}` | `{{COLOR_PRIMARY_SOFT}}` | Tinted backgrounds, selection states |
| `{colors.on-primary}` | `{{COLOR_ON_PRIMARY}}` | Text/icon on primary-filled surfaces |

### Secondary & Accent

| Token | Hex | Role |
|---|---|---|
| `{colors.secondary}` | `{{COLOR_SECONDARY}}` | Secondary actions, complementary voltage |
| `{colors.on-secondary}` | `{{COLOR_ON_SECONDARY}}` | Text on secondary surfaces |
| `{colors.accent}` | `{{COLOR_ACCENT}}` | Highlights, decorative moments, badges |

### Canvas & Surface

| Token | Hex | Role |
|---|---|---|
| `{colors.canvas}` | `{{COLOR_CANVAS}}` | Page background |
| `{colors.canvas-soft}` | `{{COLOR_CANVAS_SOFT}}` | Alternate section backgrounds |
| `{colors.surface-1}` | `{{COLOR_SURFACE_1}}` | Cards, panels, raised elements |
| `{colors.surface-2}` | `{{COLOR_SURFACE_2}}` | Nested cards, input backgrounds |

### Ink (Text)

| Token | Hex | Role |
|---|---|---|
| `{colors.ink}` | `{{COLOR_INK}}` | Primary body text |
| `{colors.ink-secondary}` | `{{COLOR_INK_SECONDARY}}` | Subheadings, label text |
| `{colors.ink-muted}` | `{{COLOR_INK_MUTED}}` | Captions, helper text, metadata |
| `{colors.hairline}` | `{{COLOR_HAIRLINE}}` | Borders, dividers, input strokes |

### Semantic

| Token | Role |
|---|---|
| `{colors.semantic-success}` | Confirmations, positive states |
| `{colors.semantic-error}` | Errors, destructive alerts |
| `{colors.semantic-warning}` | Warnings, pending states |
| `{colors.semantic-info}` | Info banners, neutral alerts |

### Usage Principles

{{COLOR_USAGE_PRINCIPLES}}

---

## Typography

### Font Stack

**Display:** `{{FONT_DISPLAY_FULL_STACK}}`
**Body:** `{{FONT_BODY_FULL_STACK}}`

{{TYPOGRAPHY_NARRATIVE}}

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | `{{DISPLAY_XL_SIZE}}` | `{{DISPLAY_XL_WEIGHT}}` | `{{DISPLAY_XL_LH}}` | `{{DISPLAY_XL_LS}}` | Hero headline |
| `{typography.display-lg}` | `{{DISPLAY_LG_SIZE}}` | `{{DISPLAY_LG_WEIGHT}}` | `{{DISPLAY_LG_LH}}` | `{{DISPLAY_LG_LS}}` | Section opener |
| `{typography.display-md}` | `{{DISPLAY_MD_SIZE}}` | `{{DISPLAY_MD_WEIGHT}}` | `{{DISPLAY_MD_LH}}` | `{{DISPLAY_MD_LS}}` | Card title |
| `{typography.heading-lg}` | `{{HEADING_LG_SIZE}}` | `{{HEADING_WEIGHT}}` | `{{HEADING_LH}}` | `{{HEADING_LS}}` | Section heading |
| `{typography.heading-md}` | `{{HEADING_MD_SIZE}}` | `{{HEADING_WEIGHT}}` | `{{HEADING_LH}}` | `{{HEADING_LS}}` | Sub-heading |
| `{typography.heading-sm}` | `{{HEADING_SM_SIZE}}` | `{{HEADING_WEIGHT}}` | `{{HEADING_LH}}` | `{{HEADING_LS}}` | Label, eyebrow |
| `{typography.body-lg}` | `{{BODY_LG_SIZE}}` | `{{BODY_WEIGHT}}` | `{{BODY_LH}}` | `{{BODY_LS}}` | Lead body text |
| `{typography.body-md}` | `{{BODY_MD_SIZE}}` | `{{BODY_WEIGHT}}` | `{{BODY_LH}}` | `{{BODY_LS}}` | Default body |
| `{typography.body-sm}` | `{{BODY_SM_SIZE}}` | `{{BODY_WEIGHT}}` | `{{BODY_LH}}` | `{{BODY_LS}}` | Secondary info |
| `{typography.caption}` | `{{CAPTION_SIZE}}` | `{{CAPTION_WEIGHT}}` | `{{CAPTION_LH}}` | `{{CAPTION_LS}}` | Helper text, meta |
| `{typography.button}` | `{{BUTTON_SIZE}}` | `{{BUTTON_WEIGHT}}` | `1.0` | `{{BUTTON_LS}}` | CTA labels |
| `{typography.eyebrow}` | `{{EYEBROW_SIZE}}` | `{{EYEBROW_WEIGHT}}` | `1.3` | `{{EYEBROW_LS}}` | Section labels (uppercase) |

### Typography Principles

{{TYPOGRAPHY_PRINCIPLES}}

---

## Layout

### Spacing System

**Base unit:** 8px. All spacing tokens are multiples of 4 or 8.

| Token | Value | Use |
|---|---|---|
| `{spacing.xxs}` | 2px | Micro gaps, inline icon spacing |
| `{spacing.xs}` | 4px | Tight internal spacing |
| `{spacing.sm}` | 8px | Base unit — default gap |
| `{spacing.md}` | 12px | Compact padding |
| `{spacing.lg}` | 16px | Standard padding, list gaps |
| `{spacing.xl}` | 24px | Card internal padding |
| `{spacing.xxl}` | 32px | Section sub-gaps |
| `{spacing.xxxl}` | 48px | Feature block spacing |
| `{spacing.huge}` | 64px | Section padding |
| `{spacing.super}` | 96px | Hero / major section gaps |

### Grid & Container

{{GRID_NARRATIVE}}

### Whitespace Philosophy

{{WHITESPACE_PHILOSOPHY}}

---

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 | Flat | Default surface |
| 1 | `{{SHADOW_1}}` | Card lift |
| 2 | `{{SHADOW_2}}` | Dropdown, modal |
| 3 | `{{SHADOW_3}}` | Tooltip, popover |

{{ELEVATION_NARRATIVE}}

---

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Technical / data-dense contexts |
| `{rounded.xs}` | `{{RADIUS_XS}}` | Tags, chips |
| `{rounded.sm}` | `{{RADIUS_SM}}` | Inputs, compact cards |
| `{rounded.md}` | `{{RADIUS_MD}}` | Cards, panels |
| `{rounded.lg}` | `{{RADIUS_LG}}` | Feature cards, modals |
| `{rounded.xl}` | `{{RADIUS_XL}}` | Large containers |
| `{rounded.pill}` | 9999px | Pill buttons, badges |

### Shape Personality

{{SHAPE_PERSONALITY}}

---

## Components

### Buttons

**`button-primary`** — primary CTA.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`
- Padding `{spacing.sm} {spacing.xl}` (8px 24px), rounded `{{BUTTON_RADIUS}}`
- Hover: `{colors.primary-hover}` · Pressed: `{colors.primary-press}`

**`button-secondary`** — secondary action.
- Background `{colors.canvas}`, text `{colors.primary}`, border `1px solid {colors.primary}`
- Same geometry as `button-primary`

**`button-ghost`** — low-hierarchy action.
- Background transparent, text `{colors.ink-secondary}`, border `1px solid {colors.hairline}`
- Hover: background `{colors.canvas-soft}`

### Cards

**`card-default`** — standard content card.
- Background `{colors.surface-1}`, padding `{spacing.xl}`, rounded `{rounded.md}`
- Border `1px solid {colors.hairline}`, Level 1 shadow

**`card-featured`** — highlighted/promotional card.
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.xl}`, rounded `{rounded.lg}`

### Navigation

**`nav-bar`** — top navigation.
- Background `{colors.canvas}`, height 64px, padding `0 {spacing.xl}`
- Logo left · nav links center · CTA right
- Sticky on scroll, adds Level 1 shadow when scrolled

### Forms

**`input-text`** — standard text input.
- Background `{colors.surface-2}`, text `{colors.ink}`, type `{typography.body-md}`
- Padding `{spacing.sm} {spacing.md}`, rounded `{rounded.sm}`, border `1px solid {colors.hairline}`
- Focus: border `{colors.primary}`, ring `2px {colors.primary-soft}`

**`label`** — form label.
- Type `{typography.body-sm}`, weight 500, color `{colors.ink-secondary}`, margin-bottom `{spacing.xs}`

### Badges & Tags

**`badge`** — status or category label.
- Background `{colors.primary-soft}`, text `{colors.primary}`, type `{typography.eyebrow}`
- Padding `{spacing.xs} {spacing.sm}`, rounded `{rounded.pill}`

### Signature Components

{{SIGNATURE_COMPONENTS}}

---

## Do's and Don'ts

### Do
{{DOS_LIST}}

### Don't
{{DONTS_LIST}}

---

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Wide | ≥ 1440px | Full layout, all columns |
| Desktop | 1024–1439px | Default max-width container |
| Tablet | 768–1023px | 2-column grids, simplified nav |
| Mobile | < 768px | Single column, hamburger nav, scaled type |

### Touch Targets
- Buttons: minimum 44×44px on mobile
- Nav links: minimum 44px tap height
- Form fields: minimum 44px height on mobile

### Type Scaling

| Token | Desktop | Tablet | Mobile |
|---|---|---|---|
| `display-xl` | `{{DISPLAY_XL_SIZE}}` | `{{DISPLAY_XL_TABLET}}` | `{{DISPLAY_XL_MOBILE}}` |
| `display-lg` | `{{DISPLAY_LG_SIZE}}` | `{{DISPLAY_LG_TABLET}}` | `{{DISPLAY_LG_MOBILE}}` |
| `display-md` | `{{DISPLAY_MD_SIZE}}` | `{{DISPLAY_MD_TABLET}}` | `{{DISPLAY_MD_MOBILE}}` |

### Collapsing Strategy

{{RESPONSIVE_STRATEGY}}

---

## Iteration Guide

1. Reference token names directly — `{colors.primary}`, `{typography.body-md}`, `{rounded.md}`.
2. New variants go as new component entries, never overwriting existing ones.
3. Color changes require updating BOTH the YAML frontmatter tokens AND the prose section.
4. `{rounded.pill}` is reserved for buttons and badge pills — don't apply to cards.
5. Maintain contrast: `{colors.ink}` on `{colors.canvas}` must pass WCAG AA (4.5:1 minimum).
6. Default body text is always `{typography.body-md}` — never go below `{typography.body-sm}` for readable prose.
7. Signature components are non-negotiable brand moments — preserve them in every iteration.
