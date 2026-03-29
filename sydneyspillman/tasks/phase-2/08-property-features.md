<!-- execute -->
<!-- client: sydneyspillman -->
<!-- max-turns: 60 -->
<!-- dispatched-from: sydney-phase-2 -->
<!-- depends-on: 07-core-pages -->

# Property Features — Sydney Spillman & Associates

**Primary agent:** Lobe
**Support:** Convex Agent (if backend needed for dynamic listings)
**Mode:** Semi-auto (client asset blocker)

## Context

Core pages are built. Now we add property listing features. Note: task `2-PROPERTY FEATURES-0` is a **BLOCKER** — we need real property images and listing details from Sydney before we can populate real listings. However, we can build the feature infrastructure with placeholder data.

Read `sydneyspillman/context/sydney-project.md` for full project context.

## BLOCKER: Client Assets

Task `2-PROPERTY FEATURES-0` requires receiving property images and listing details from Sydney. Write an escalation to `dispatch/escalations/sydney-property-assets.md` if assets haven't been provided:

```
## Property Assets Needed

Property features infrastructure is built with placeholder data.
To populate with real listings, Sydney needs to provide:
- Property photos (high-res)
- Listing details (address, price, beds, baths, sqft, description)
- Category assignments (For Sale, Sold, Coming Soon)

Task key: 2-PROPERTY FEATURES-0 (blocker)
```

## Deliverables (build with placeholder data)

1. **Property listing cards** — photo, address, price, beds/baths/sqft
2. **Listing detail page template** — image gallery, description, features list, agent contact CTA
3. **Listing categories** — For Sale, Sold, Coming Soon (filter tabs or sections)
4. **Search/filter** — by price range, bedrooms, area/neighborhood

If Convex Agent support is needed for dynamic listing data, create a task brief for `convex-agent/inbox/` describing the schema needs.

## Convex Task Keys
- `2-PROPERTY FEATURES-0` — **BLOCKER** — receive property images/details (manual)
- `2-PROPERTY FEATURES-1` — Listing cards
- `2-PROPERTY FEATURES-2` — Detail page template
- `2-PROPERTY FEATURES-3` — Listing categories
- `2-PROPERTY FEATURES-4` — Search/filter

## Completion
Mark keys 1-4 when infrastructure is built with placeholders. Key 0 stays pending until real assets arrive.
