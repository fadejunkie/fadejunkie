<!-- execute -->
<!-- client: wizardryink -->
<!-- max-turns: 80 -->
<!-- depends-on: 09-ai-intake-engine -->

# Wizardry Ink — Owner Dashboard

## Agent
Primary: **Lobe** (UI) + **Convex Agent** (backend)

## Objective
Build Daisy's control center — the Tinder-style swipe interface for managing quotes, a booking pipeline view, and artist calendar overview.

## Deliverables
- Swipe card interface component
- Booking pipeline view
- Artist calendar overview
- Manual override controls

## Tasks
- [ ] Build Tinder-style swipe card interface for new quotes (`3-OWNER DASHBOARD-0`)
- [ ] Swipe right = approve + confirm, left = edit/reassign (`3-OWNER DASHBOARD-1`)
- [ ] Booking pipeline view (Inquiry → Quoted → Scheduled → Confirmed → Completed) (`3-OWNER DASHBOARD-2`)
- [ ] Artist calendar overview (who's booked, gaps, conflicts) (`3-OWNER DASHBOARD-3`)
- [ ] Manual override controls (edit quotes, reassign artists, adjust times) (`3-OWNER DASHBOARD-4`)

## Swipe Card UX
Each card shows:
- Client name + contact info
- Tattoo description + any reference images
- AI-generated price range
- Suggested artist (with style match score)
- Suggested time slot

**Swipe right** → Approve quote, confirm artist assignment, proceed to scheduling
**Swipe left** → Edit quote, reassign to different artist, or reject

Mobile-first design — Daisy will use this on her phone between clients.
