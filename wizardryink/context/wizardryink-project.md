# Wizardry Ink Tattoo Studio — Master Project Context

> Inject this file into every agent task touching the Wizardry Ink engagement.

## Client Profile

- **Client:** Wizardry Ink Tattoo Studio
- **Owner:** Daisy (she/they)
- **Contact:** wizardryink23@gmail.com — (210) 596-6234
- **Location:** 4451 Walzem Road, San Antonio, TX 78218
- **Hours:** Mon/Tue/Thu/Fri/Sat 10am–8pm (Wed & Sun closed)
- **Identity:** Woman-owned, queer-run, neurodivergent-led
- **Tagline:** "A sanctuary for weird, wonderful people to thrive through ink and community"
- **Current site:** wizardryink.com (Squarespace 7.1)
- **Instagram:** @wizardry.ink
- **Facebook:** Wizardry Ink Tattoo Studio

## Artist Roster

| Artist | Role | Pronouns |
|--------|------|----------|
| Daisy | Owner / Lead Artist | she/they |
| Lee | Resident Artist | she/they |
| Al | Resident Artist | he/they |

## Engagement Details

- **Scope:** Website redesign + AI-powered booking system + owner dashboard
- **Phases:** 4 — Discovery & System Design, Website Redesign, AI Booking System + Dashboard, Integration/QA/Launch
- **Payment:** Tattoo trade (valued at $3,800)
- **Timeline:** ~4–5 weeks from kickoff
- **Domains:** wizadry.anthonytatis.com (client hub) + wizadry-ops.anthonytatis.com (ops hub)

## Project Scope

### Website Redesign
- Migrate off Squarespace to custom build
- Homepage, Artist portfolios, About, Gallery, Booking, FAQ, Contact, Events
- Mobile-first, inclusive aesthetic
- Preserve and amplify the studio's queer/neurodivergent identity
- SEO foundation for San Antonio tattoo market

### AI Booking System
- **Inbound intake:** AI processes DM/web inquiries into structured data
- **Quote generator:** Size, style, placement, color, complexity → price range
- **Calendar scheduling:** Per-artist availability, client slot selection
- **Artist notification:** Push/email/SMS on new booking assignment
- **End time editing:** Artist controls duration to prevent overlap
- **Overlap prevention:** Validate bookings against existing schedule
- **Internal confirmation:** Booked + quoted + no conflicts = confirmed

### Owner Dashboard (Daisy's Control Center)
- **Tinder-style swipe cards** for new quote approvals
  - Swipe right → approve quote + confirm artist
  - Swipe left → reject / edit quote / reassign artist
- Booking pipeline view (Inquiry → Quoted → Scheduled → Confirmed → Completed)
- Artist calendar overview (who's booked, gaps, conflicts)
- Manual override controls (edit quotes, reassign artists, adjust times)

## Convex Backend

- **Project ID:** `wizardry-ink`
- **Tables:** `wizardryTasks`, `wizardryAgreements`, `wizardryDeliverables`
- **Functions:** `wizardryTasks:getTasks`, `wizardryTasks:setTask`, `wizardryTasks:getAgreement`, `wizardryTasks:saveAgreement`
- **Task key format:** `{phaseId}-{MILESTONE TITLE}-{taskIndex}` (e.g., `1-CLIENT INTAKE-0`)

### Task Key Reference (60 tasks)

**Phase 1 — DISCOVERY & SYSTEM DESIGN (id: 1)**

| Milestone | Key | Task |
|-----------|-----|------|
| CLIENT INTAKE | `1-CLIENT INTAKE-0` | Kickoff call — business goals, brand audit, current workflow |
| CLIENT INTAKE | `1-CLIENT INTAKE-1` | Map current DM → booking flow (pain points, manual steps) |
| CLIENT INTAKE | `1-CLIENT INTAKE-2` | Document artist roster, specialties, and availability patterns |
| CLIENT INTAKE | `1-CLIENT INTAKE-3` | Identify integration points (Instagram DM, website, phone) |
| SYSTEM ARCHITECTURE | `1-SYSTEM ARCHITECTURE-0` | Design AI booking pipeline: intake → quote → schedule → notify → confirm |
| SYSTEM ARCHITECTURE | `1-SYSTEM ARCHITECTURE-1` | Define quote engine logic (size, style, placement, color → price range) |
| SYSTEM ARCHITECTURE | `1-SYSTEM ARCHITECTURE-2` | Map artist workflow: notification → end time edit → overlap prevention |
| SYSTEM ARCHITECTURE | `1-SYSTEM ARCHITECTURE-3` | Design owner dashboard: swipe-to-approve, pipeline view, calendar |
| TECH STACK | `1-TECH STACK-0` | Select and document tech stack decisions |
| TECH STACK | `1-TECH STACK-1` | Define API/integration requirements (Instagram, calendar, notifications) |
| TECH STACK | `1-TECH STACK-2` | Create system architecture diagram |

**Phase 2 — WEBSITE REDESIGN (id: 2)**

| Milestone | Key | Task |
|-----------|-----|------|
| SITE ARCHITECTURE | `2-SITE ARCHITECTURE-0` | Wireframe homepage, artist pages, booking flow |
| SITE ARCHITECTURE | `2-SITE ARCHITECTURE-1` | Define page structure: Home, Artists, About, Gallery, Booking, FAQ, Contact, Events |
| SITE ARCHITECTURE | `2-SITE ARCHITECTURE-2` | Mobile-first responsive design plan |
| HOMEPAGE | `2-HOMEPAGE-0` | Hero section — studio identity, book now CTA |
| HOMEPAGE | `2-HOMEPAGE-1` | Artist showcase — portfolio previews with links |
| HOMEPAGE | `2-HOMEPAGE-2` | Gallery section — recent work highlights |
| HOMEPAGE | `2-HOMEPAGE-3` | Testimonials + studio values section |
| ARTIST PAGES | `2-ARTIST PAGES-0` | Individual artist portfolio pages (Daisy, Lee, Al) |
| ARTIST PAGES | `2-ARTIST PAGES-1` | Artist bio, specialties, availability status |
| ARTIST PAGES | `2-ARTIST PAGES-2` | Portfolio gallery with style categories |
| CORE PAGES | `2-CORE PAGES-0` | About — studio story, mission, values, inclusive identity |
| CORE PAGES | `2-CORE PAGES-1` | Gallery — filterable portfolio grid |
| CORE PAGES | `2-CORE PAGES-2` | FAQ — pricing, process, aftercare, policies |
| CORE PAGES | `2-CORE PAGES-3` | Contact + Events pages |
| SEO FOUNDATION | `2-SEO FOUNDATION-0` | Keyword research — San Antonio tattoo terms |
| SEO FOUNDATION | `2-SEO FOUNDATION-1` | Title tags + meta descriptions for all pages |
| SEO FOUNDATION | `2-SEO FOUNDATION-2` | Image alt text for all portfolio/gallery images |
| SEO FOUNDATION | `2-SEO FOUNDATION-3` | Submit XML sitemap to GSC |

**Phase 3 — AI BOOKING SYSTEM + DASHBOARD (id: 3)**

| Milestone | Key | Task |
|-----------|-----|------|
| AI INTAKE ENGINE | `3-AI INTAKE ENGINE-0` | Build inbound inquiry processor (DM/web form → structured data) |
| AI INTAKE ENGINE | `3-AI INTAKE ENGINE-1` | Train quote model: size, style, placement, color, complexity → price range |
| AI INTAKE ENGINE | `3-AI INTAKE ENGINE-2` | Auto-assign artist based on style match + availability |
| AI INTAKE ENGINE | `3-AI INTAKE ENGINE-3` | Generate quote card with all details for owner review |
| CALENDAR & SCHEDULING | `3-CALENDAR & SCHEDULING-0` | Build artist availability calendar (per-artist time slots) |
| CALENDAR & SCHEDULING | `3-CALENDAR & SCHEDULING-1` | Implement booking slot selection for clients |
| CALENDAR & SCHEDULING | `3-CALENDAR & SCHEDULING-2` | Artist end time editing interface |
| CALENDAR & SCHEDULING | `3-CALENDAR & SCHEDULING-3` | Overlap prevention logic (validate against existing bookings) |
| NOTIFICATION SYSTEM | `3-NOTIFICATION SYSTEM-0` | Artist notification on new booking assignment |
| NOTIFICATION SYSTEM | `3-NOTIFICATION SYSTEM-1` | Client confirmation notification (quote + scheduled time) |
| NOTIFICATION SYSTEM | `3-NOTIFICATION SYSTEM-2` | Internal status updates (booked → confirmed → completed) |
| OWNER DASHBOARD | `3-OWNER DASHBOARD-0` | Build Tinder-style swipe card interface for new quotes |
| OWNER DASHBOARD | `3-OWNER DASHBOARD-1` | Swipe right = approve + confirm, left = edit/reassign |
| OWNER DASHBOARD | `3-OWNER DASHBOARD-2` | Booking pipeline view (Inquiry → Quoted → Scheduled → Confirmed → Completed) |
| OWNER DASHBOARD | `3-OWNER DASHBOARD-3` | Artist calendar overview (who's booked, gaps, conflicts) |
| OWNER DASHBOARD | `3-OWNER DASHBOARD-4` | Manual override controls (edit quotes, reassign, adjust times) |

**Phase 4 — INTEGRATION, QA & LAUNCH (id: 4)**

| Milestone | Key | Task |
|-----------|-----|------|
| SYSTEM INTEGRATION | `4-SYSTEM INTEGRATION-0` | Embed AI booking system into website |
| SYSTEM INTEGRATION | `4-SYSTEM INTEGRATION-1` | Connect DM intake to website inquiry form |
| SYSTEM INTEGRATION | `4-SYSTEM INTEGRATION-2` | End-to-end flow test: inquiry → quote → schedule → confirm |
| QUALITY ASSURANCE | `4-QUALITY ASSURANCE-0` | Cross-browser testing — Chrome, Safari, Firefox, Edge |
| QUALITY ASSURANCE | `4-QUALITY ASSURANCE-1` | Mobile responsive QA — iOS Safari, Android Chrome, tablet |
| QUALITY ASSURANCE | `4-QUALITY ASSURANCE-2` | Test booking flow end-to-end with real scenarios |
| QUALITY ASSURANCE | `4-QUALITY ASSURANCE-3` | Page speed audit + performance optimization |
| GO LIVE | `4-GO LIVE-0` | DNS cutover — point domain to hosting |
| GO LIVE | `4-GO LIVE-1` | Verify SSL certificate |
| GO LIVE | `4-GO LIVE-2` | Confirm all URLs resolve correctly |
| GO LIVE | `4-GO LIVE-3` | Verify live site + booking system operational |
| ANALYTICS & HANDOFF | `4-ANALYTICS & HANDOFF-0` | Create and configure GA4 property |
| ANALYTICS & HANDOFF | `4-ANALYTICS & HANDOFF-1` | Set up Google Search Console |
| ANALYTICS & HANDOFF | `4-ANALYTICS & HANDOFF-2` | Live training — dashboard, booking management, website editing |
| ANALYTICS & HANDOFF | `4-ANALYTICS & HANDOFF-3` | 48-hour post-launch check-in |

## File Paths

| File | Purpose |
|------|---------|
| `wizardryink/src/WizardryHub.tsx` | Monolithic hub UI |
| `wizardryink/convex/schema.ts` | Database schema |
| `wizardryink/convex/wizardryTasks.ts` | Task CRUD functions |
| `wizardryink/CLAUDE.md` | Project instructions |
| `wizardryink/context/wizardryink-project.md` | This file |
| `wizardryink/content/` | Agent deliverables |
| `wizardryink/tasks/` | Task templates for Dispatch routing |

## Current Status

- Agreement: Not yet signed
- Domain: wizardryink.com (owned by client, on Squarespace)
- Brand assets: Existing (needs audit/refresh for new site)
- Site: Current Squarespace site live (redesign pending)
- AI booking system: Not started
- All 60 Convex tasks: pending
