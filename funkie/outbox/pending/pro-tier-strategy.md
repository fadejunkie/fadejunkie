## Plan: FadeJunkie Pro Tier

> Date: 2026-03-15 | Status: Pending approval
> Strategic goal: Revenue Infrastructure — Pro tier defined → launched
> Q1 deadline: March 31 (16 days)

---

### The Problem

FadeJunkie has $0 revenue and 16 days left in Q1. Target: $100+ MRR. The platform has real features (profiles with gallery, shop websites, state board tools, community feed, 26-resource affiliate directory) but zero monetization. No payment processor, no tier field in the schema, no feature gates.

---

### 1. Pro Tier Feature Set — "FadeJunkie Pro" at $9/mo

**Free tier (stays as-is):**
- Community feed (read + post)
- Basic barber profile (name, bio, avatar, services, **3 gallery photos**)
- Shop website builder (all current fields)
- State board tools: exam guide (full), flashcards (all decks), practice test (**1 attempt/day**)
- Resource directory (browse + click)

**Pro tier ($9/mo):**

| # | Feature | Why it converts | Build estimate |
|---|---------|----------------|---------------|
| 1 | **Unlimited gallery** — free: 3 photos. Pro: unlimited | Barbers live and die by their portfolio. The gallery already works (`GalleryGrid.tsx` + `gallery` table). Just add a count check. This is the single strongest upgrade lever. | ~2 hrs |
| 2 | **Profile analytics** — view count on barber page + shop page, "X views this week" widget | Every barber asks "is anyone seeing my page?" No analytics exist in the codebase today — zero tables, zero tracking. High perceived value, low build cost. | ~4 hrs |
| 3 | **Priority directory listing** + Pro badge | Pro barbers sort to top of directory results. Subtle badge on profile cards. Social proof + visibility. The `locations` table has coordinates ready for a directory launch. | ~2 hrs |
| 4 | **Unlimited practice tests** — free: 1 attempt/day. Pro: unlimited + full score history | `testResults` table already tracks scores. Students cramming for Texas state board will pay $9 to remove the daily cap. Test infrastructure is solid (timed, flagging, configurable question counts). | ~3 hrs |
| 5 | **Booking widget** — styled CTA button on public barber + shop pages | `bookingUrl` field already exists on barbers. Currently just a link. Pro gets a prominent, styled booking button. This is what barbers actually pay for elsewhere. | ~2 hrs |

**Total: ~13 hours dev work. Ship in 5-7 working days.**

**NOT in v1:** custom domains, client management, full appointment scheduling, AI features. Those are Pro v2 — don't overscope.

---

### 2. Pricing

**$9/month** | **$79/year** (save $29, ~27% off)

**Why $9:**
- Competitors are expensive: Booksy $29.99/mo, Square Appointments $29/mo (team), StyleSeat takes 25-30% per booking
- $9 is impulse pricing — literally less than a haircut
- We're not competing on scheduling features. We're selling "your digital home" at a price nobody thinks twice about
- 12 Pro users = $108 MRR → hits Q1 target
- Annual option ($79) reduces churn and signals commitment

**Founding member offer:** First 10 Pro subscribers lock in $9/mo for life, even if price increases. Creates urgency for the launch window.

---

### 3. Technical Build Plan

#### Day 1-2: Stripe + Subscriptions
- Stripe Checkout integration (subscription mode)
- Stripe webhook handler via Convex HTTP action (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`)
- New `subscriptions` table: `userId, stripeCustomerId, stripeSubscriptionId, plan ("pro_monthly" | "pro_annual"), status ("active" | "canceled" | "past_due"), currentPeriodEnd, createdAt`
- `isProUser(userId)` query — single source of truth

#### Day 3: Feature Gates
- `useProStatus()` hook — `{ isPro, isLoading }`
- Gallery: count check in `addGalleryPhoto` mutation, upgrade prompt in `GalleryGrid.tsx` when free user hits 3
- Practice test: daily attempt check in test page, upgrade prompt when capped
- Directory: sort query puts Pro users first

#### Day 4: Upgrade Flow
- `/pro` page — benefits, monthly/annual toggle, "Subscribe" → Stripe Checkout
- Post-checkout redirect → `/pro?success=true` with confetti/confirmation
- Stripe Customer Portal link for subscription management
- Reusable `<UpgradePrompt />` component at each gate point

#### Day 5: Analytics + Polish
- New `profileViews` table: `profileType, profileId, timestamp`
- Track on `barber/[slug]` and `shop/[userId]` page loads
- "X views this week" widget on profile page (Pro only)
- `<ProBadge />` component — small, tasteful indicator

#### Day 6-7: QA + Ship
- Test with Stripe test cards (monthly + annual flows)
- Test gate points (gallery limit, test limit, upgrade prompts)
- Webhook reliability check
- Deploy

**Ship date: March 22.** Leaves 9 days for user acquisition before Q1 end.

---

### 4. First 10 Pro Users (March 22-31)

| Channel | Action | Expected yield |
|---------|--------|---------------|
| **State board tools** | Share flashcards + practice test links in Texas barber student FB groups, Reddit r/barber, barber school Discords. Free tool → sign up → see Pro features → convert. | 3-5 sign-ups |
| **Direct outreach** | Anthony DMs 20 barbers on Instagram with real followings. Pitch: "Your own barber portfolio page — free to build, $9/mo for unlimited gallery + analytics." Personalize with their work. | 2-3 conversions |
| **Demo profiles** | Create 3 killer demo profiles with full galleries. Show what Pro looks like. Link from landing page. | Social proof (indirect) |
| **Barber school partnerships** | Contact 3 Texas schools. Free student accounts, pitch Pro for instructors. Schools = distribution. | 1-2 conversions |
| **Founding member urgency** | "First 10 Pro members lock in $9/mo for life." Countdown on /pro page. | Accelerates all channels |

**Realistic target: 10-12 Pro users by March 31 = ~$100 MRR.**

---

### 5. Affiliate Model (Parallel Track)

The resources directory has 26 entries, many with `affiliate: true` already flagged. No tracking exists.

**Immediate actions (week of March 17):**

| Action | Revenue | Effort |
|--------|---------|--------|
| Sign up for Amazon Associates (barber tools/supplies) | $5-20/mo at scale | 1 hr |
| Add click tracking — new `resourceClicks` table: `resourceId, userId, timestamp` | Enables measurement | 2 hrs |
| Replace `offerUrl` with affiliate links where available (Booksy, Square have programs) | $10-50 per conversion | 2 hrs |
| Pitch 1 brand for sponsored "Featured" placement ($50-100/mo) — `featured` field already in schema | $50-100/mo | 3 hrs |

**Target: first affiliate commission by April 14.**

---

### 6. Schema Changes

```typescript
// New tables to add to convex/schema.ts
subscriptions: defineTable({
  userId: v.id("users"),
  stripeCustomerId: v.string(),
  stripeSubscriptionId: v.string(),
  plan: v.union(v.literal("pro_monthly"), v.literal("pro_annual")),
  status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due")),
  currentPeriodEnd: v.number(),
  createdAt: v.number(),
}).index("by_userId", ["userId"])
  .index("by_stripeCustomerId", ["stripeCustomerId"]),

profileViews: defineTable({
  profileType: v.union(v.literal("barber"), v.literal("shop")),
  profileId: v.string(),
  timestamp: v.number(),
}).index("by_profile", ["profileType", "profileId", "timestamp"]),

resourceClicks: defineTable({
  resourceId: v.id("resources"),
  userId: v.optional(v.id("users")),
  timestamp: v.number(),
}).index("by_resource", ["resourceId", "timestamp"]),
```

### 7. Files to Create/Change

| File | Change |
|------|--------|
| `convex/schema.ts` | Add 3 new tables (subscriptions, profileViews, resourceClicks) |
| `convex/subscriptions.ts` | **NEW** — isProUser query, createCheckoutSession, handleWebhook, getSubscription |
| `convex/analytics.ts` | **NEW** — trackProfileView, getProfileViews, trackResourceClick, getClickStats |
| `convex/http.ts` | **NEW** — Stripe webhook HTTP endpoint |
| `convex/gallery.ts` | Add photo count check in addGalleryPhoto (gate at 3 for free) |
| `convex/posts.ts` | No change (feed stays free) |
| `app/(auth)/pro/page.tsx` | **NEW** — Pro upgrade/pricing page |
| `app/(auth)/profile/page.tsx` | Add analytics widget (Pro only) |
| `app/(auth)/tools/practice-test/page.tsx` | Add daily attempt limit for free users |
| `app/barber/[slug]/page.tsx` | Add view tracking call |
| `app/shop/[userId]/page.tsx` | Add view tracking call |
| `components/ProBadge.tsx` | **NEW** — subtle Pro indicator |
| `components/UpgradePrompt.tsx` | **NEW** — reusable upgrade CTA |
| `lib/useProStatus.ts` | **NEW** — hook: isPro, isLoading |
| `app/pro/page.tsx` | **NEW** — public-facing Pro landing (unauthenticated) |

### Risks

1. **Stripe adds complexity** — webhook reliability, subscription state sync. Mitigation: use Stripe Customer Portal for all management (cancellation, payment updates), keep our logic to the minimum (create subscription, read status, handle 3 webhook events).

2. **Gating existing features could frustrate early users** — nobody's been limited before. Mitigation: the gallery limit (3 photos free) is generous enough to be useful. Practice test limit (1/day) is still functional for studying. Communicate the change as "we're launching Pro" not "we're taking away features."

3. **16 days for build + acquisition is tight** — 7 days build, 9 days acquisition. The build is scoped tight and grounded in existing infrastructure. Acquisition is the real risk — state board tool sharing is the highest-leverage, lowest-effort channel.

4. **No existing users to convert** — we're selling to new users AND asking them to pay. The state board tools are the Trojan horse: genuinely useful for free, upgrade for power users.

---

### Ready to Execute

Say `approve pro-tier-strategy` and I'll start with Stripe integration + subscriptions table.

Priority order: Stripe → gates → /pro page → analytics → badge → QA → ship.
