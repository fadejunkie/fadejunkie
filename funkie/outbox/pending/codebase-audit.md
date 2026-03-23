## FadeJunkie — To-Do List

Full codebase audit completed 2026-03-10. Honest assessment, no padding.

---

### P0 — Broken / blocking

**1. No auth guard on protected routes**
The `(auth)/layout.tsx` is purely a UI wrapper — no auth check, no redirect. There is no `middleware.ts` in the project (the context file claims one exists, but it doesn't). Any unauthenticated user can navigate directly to `/home`, `/profile`, `/tools/*`, `/resources`, `/website` and see broken/empty pages instead of being redirected to `/signin`.
- **Files:** `app/(auth)/layout.tsx`, missing `middleware.ts`
- **Why it matters:** Core security gap. Users see broken UX instead of a login prompt.

**2. Tools hub doesn't link to any live tools**
The `/tools` page lists only two "Coming Soon" items (Sanitation Checklist, Client Intake Forms). The three tools that are actually live — Exam Guide, Flashcards, Practice Test — have no links from the tools hub. Users can only reach them through internal resource cards on `/resources` (Students tab). The sub-tool pages even have back-links to `/tools`, creating a dead-end loop.
- **Files:** `app/(auth)/tools/page.tsx`
- **Why it matters:** Live features are effectively hidden from users.

**3. Subdomain routing doesn't work**
The website builder tells users their shop is live at `{slug}.fadejunkie.com`, but there's no middleware to handle subdomain routing. The shop page exists at `/shop/[userId]` but nothing rewrites subdomain requests to it.
- **Files:** missing `middleware.ts`, `app/(auth)/website/page.tsx` (line 76)
- **Why it matters:** The primary shop website feature is broken in production.

---

### P1 — Incomplete features

**4. No delete for barber profiles or shops**
Users can create and update profiles/shops but cannot delete them. No `deleteBarberProfile` or `deleteShop` mutation exists. If added later, there's no cascade logic — deleting a barber would orphan their gallery photos, posts (barberId references), and any shop that includes their slug in `barberSlugs`.
- **Files:** `convex/barbers.ts`, `convex/shops.ts`, `convex/gallery.ts`
- **Why it matters:** Users are stuck with data they can't remove. GDPR-adjacent concern.

**5. No password reset flow**
Sign-in page has email+password auth but no "Forgot password?" link or reset mechanism. Users who forget their password are locked out permanently.
- **Files:** `app/signin/page.tsx`
- **Why it matters:** Basic auth table-stakes. Will generate support requests immediately.

**6. Sanitation Checklist and Client Intake Forms listed but unbuilt**
Tools page shows these two items with a "Soon" badge. No routes, no backend, no implementation. They sit there as promises.
- **Files:** `app/(auth)/tools/page.tsx`
- **Why it matters:** Sets expectations that aren't met. Either build them or remove them.

**7. Shop website builder has no logo upload**
The `ShopTemplate` component accepts `logoUrl` and the schema has `logoStorageId`/`logoUrl` fields, but the website builder form (`/website`) has no file upload for the shop logo. The logo field is read from the DB and passed through, but there's no way for users to set it.
- **Files:** `app/(auth)/website/page.tsx`, `convex/shops.ts`
- **Why it matters:** Shops render with no logo — looks incomplete.

**8. Shop website doesn't display barbers**
The `barberSlugs` field exists on shops and the form has it in the data model, but the website builder UI has no way to add/manage barber slugs. The field is always an empty array. The shop template likely has a barbers section that never populates.
- **Files:** `app/(auth)/website/page.tsx`, `components/ShopTemplate.tsx`
- **Why it matters:** Key feature of a shop page — showing who works there — is non-functional.

---

### P2 — UX gaps

**9. No error.tsx, loading.tsx, or not-found.tsx anywhere**
Zero Next.js error boundary files exist in the entire app. Any unhandled error in a route renders a raw Next.js error page. No streaming loading states. No custom 404.
- **Files:** Missing across all route segments
- **Why it matters:** Users see ugly framework errors instead of graceful fallbacks.

**10. Silent failure when saving test results**
Practice test page catches and swallows the save error: `.catch(() => {})`. If saving a test result fails, the user sees their score but it's silently lost. No retry, no warning.
- **Files:** `app/(auth)/tools/practice-test/page.tsx` (line 92)
- **Why it matters:** Users study and test, think their progress is saved, but it's not.

**11. Post creation has no auth redirect**
If an unauthenticated user somehow reaches `/home` (see P0 #1), the PostComposer renders and the Convex mutation will throw a server error with a raw "Not authenticated" message instead of redirecting to sign-in.
- **Files:** `components/PostComposer.tsx`, `app/(auth)/home/page.tsx`
- **Why it matters:** Cascading effect of the missing auth guard.

**12. No confirmation before post deletion**
`deletePost` fires immediately on click — no "Are you sure?" dialog. One mis-tap and the post is gone permanently.
- **Files:** `components/PostCard.tsx`
- **Why it matters:** Destructive action with no undo.

**13. Sign-in error messages are generic**
Auth errors show `err.message` which from Convex auth is often opaque ("Could not verify identity" or similar). No distinction between wrong password, account not found, or server error.
- **Files:** `app/signin/page.tsx` (line 31)
- **Why it matters:** Users can't troubleshoot their own login failures.

**14. No way to edit or delete a post**
Posts can be created and deleted, but not edited. There's no edit flow anywhere in the UI or backend.
- **Files:** `convex/posts.ts`, `components/PostCard.tsx`
- **Why it matters:** Users who make a typo must delete and re-post.

---

### P3 — Tech debt / nice to have

**15. `toggleLike` doesn't validate post existence**
The likes mutation checks auth but doesn't verify the referenced post exists before inserting. Can create orphan likes for deleted posts.
- **Files:** `convex/likes.ts`
- **Why it matters:** Data integrity — minor now, compounds over time.

**16. No index on `likes.by_userId`**
Common query pattern (get user's liked posts) would require a full table scan. Only `by_postId` and `by_postId_userId` indexes exist.
- **Files:** `convex/schema.ts` (lines 49-55)
- **Why it matters:** Performance degrades as likes table grows.

**17. Race condition on slug uniqueness**
`upsertBarberProfile` checks slug availability with a query then inserts — classic TOCTOU. Two users claiming the same slug simultaneously could both succeed. Convex transactions help but don't guarantee uniqueness without a DB-level constraint (which Convex doesn't support).
- **Files:** `convex/barbers.ts` (lines 65-71)
- **Why it matters:** Low probability but would cause data corruption. Consider an application-level lock.

**18. `resources.audiences` field is optional with legacy `audience` fallback**
The resources table has both `audience` (singular string, optional) and `audiences` (array, optional). The query code does a runtime fallback check. This dual-field situation adds complexity to every query.
- **Files:** `convex/schema.ts` (lines 75-76), `convex/resources.ts`
- **Why it matters:** Technical debt that makes resource queries fragile. Migrate fully to `audiences[]` and drop `audience`.

**19. Console.error calls left in production code**
Avatar upload and gallery upload catch blocks log to `console.error` but don't surface the error to the user in a meaningful way.
- **Files:** `app/(auth)/profile/page.tsx` (line 78), `components/GalleryGrid.tsx` (line 40)
- **Why it matters:** Errors are visible only in browser devtools, invisible to users.

**20. Seeder idempotency is fragile**
`seedFlashcards` checks `if (existing.length > 0)` to skip — any existing deck blocks all seeding. Should check by `source` field instead of total count. `seedRichResources` does a full table scan and matches by `businessName` — name changes create duplicates.
- **Files:** `convex/flashcards.ts`, `convex/resources.ts`
- **Why it matters:** Re-running seeders after partial data changes can produce duplicates or skip needed data.

**21. No storage cleanup on failed operations**
If a gallery photo or post image upload succeeds at the storage level but the subsequent DB write fails, the stored file becomes an orphan. No cleanup job exists.
- **Files:** `convex/gallery.ts`, `convex/posts.ts`
- **Why it matters:** Storage bloat over time with unreachable files.

**22. `examProgress.practicedCount` has a read-modify-write race**
Two simultaneous practice completions for the same service will both read the same count and increment to the same value, losing one increment.
- **Files:** `convex/examProgress.ts` (lines 32-36)
- **Why it matters:** Minor data accuracy issue for exam tracking. Low real-world probability.

---

### Summary

| Priority | Count | Theme |
|----------|-------|-------|
| P0 | 3 | Auth guard missing, live tools hidden, subdomain routing broken |
| P1 | 5 | Delete flows, password reset, incomplete shop builder |
| P2 | 6 | Error boundaries, silent failures, missing confirmations |
| P3 | 8 | Data integrity, indexes, tech debt cleanup |

**Recommended order of attack:** P0 items first (auth guard + middleware + tools page fix), then P1 #5 (password reset) and P1 #4 (delete flows). Everything else is incremental.
