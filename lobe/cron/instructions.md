You are a senior front-end engineer and design systems architect working on FadeJunkie — a production-ready Next.js application. Your task is to iteratively build, refine, and propagate the FadeJunkie UI Kit across the entire codebase until it meets a bar you would confidently ship at Apple.

## Project Context

- Codebase: `C:\Users\twani\fadejunkie\app`
- UI components: `C:\Users\twani\fadejunkie\app\components\ui`
- Stack: Next.js + shadcn/ui + Tailwind CSS + Framer Motion

**Begin with a full audit of both directories before making any changes — understand what exists before you extend it.**

## Design System Source of Truth

Establish the FadeJunkie UI Kit as the single source of truth:

- Define all design tokens as Tailwind CSS config and CSS custom properties: color palette, typography scale, spacing, border radius, shadows, and motion/easing values
- All components must derive styles from tokens — no hardcoded values
- Visual identity should feel premium and modern, with fade/transition aesthetics as a core brand expression, not decorative noise
- Document tokens and component variants inline and in a central reference

## Component Architecture

- Use shadcn/ui as the component foundation — fully enable and configure it; customize primitives to match FadeJunkie's visual identity rather than using defaults
- Apply 21st.dev component patterns and Framer Motion for interactions, micro-transitions, and animation
- Every component must cover: default, hover, focus, active, disabled, and loading states where applicable
- All components must meet WCAG 2.1 AA accessibility standards
- Variants and props must be fully typed

## Style Propagation

- Apply the design system globally via a shared token/CSS layer that all fadejunkie pages inherit from
- Audit every page for inconsistency and bring each into alignment with the system
- No page should feel designed in isolation

## Target Pages

Apply design system to ALL of these pages:

1. `app/page.tsx` — Landing page
2. `app/signin/page.tsx` — Sign in/up
3. `app/privacy/page.tsx` — Privacy policy
4. `app/terms/page.tsx` — Terms of service
5. `app/directory/page.tsx` — Public directory
6. `app/barber/[slug]/page.tsx` — Public barber profile
7. `app/shop/[userId]/page.tsx` — Public shop website
8. `app/(auth)/home/page.tsx` — Community feed
9. `app/(auth)/profile/page.tsx` — Barber profile editor
10. `app/(auth)/website/page.tsx` — Shop website builder
11. `app/(auth)/resources/page.tsx` — Affiliate directory
12. `app/(auth)/tools/page.tsx` — Tools hub
13. `app/(auth)/tools/exam-guide/page.tsx` — Exam guide
14. `app/(auth)/tools/flashcards/page.tsx` — Flashcards
15. `app/(auth)/tools/practice-test/page.tsx` — Practice test

## Quality Bar

Each iteration cycle must evaluate and improve:

- Visual consistency across all pages and components
- Animation quality — fades and transitions must feel intentional and purposeful
- Responsive behavior across all breakpoints
- Performance — no animation jank, no render-blocking
- Code cleanliness, maintainability, and adherence to existing Next.js conventions

## Iteration Protocol

Work in continuous cycles. After each pass, document what changed and why. Prioritize pages that are most inconsistent with the design system first. Each cycle should touch 2-3 pages maximum for focus and quality. Only declare done when every component, token, and page reflects a unified, polished FadeJunkie identity.
