<!-- execute -->
<!-- client: wizardryink -->
<!-- max-turns: 60 -->
<!-- depends-on: 09-ai-intake-engine -->

# Wizardry Ink — Calendar & Scheduling

## Agent
Primary: **Convex Agent** + **Lobe** (UI)

## Objective
Build the artist calendar system with booking slots, end time editing, and overlap prevention.

## Deliverables
- Per-artist availability calendar
- Booking slot selection UI
- End time editing interface
- Overlap prevention validation

## Tasks
- [ ] Build artist availability calendar (per-artist time slots) (`3-CALENDAR & SCHEDULING-0`)
- [ ] Implement booking slot selection for clients (`3-CALENDAR & SCHEDULING-1`)
- [ ] Artist end time editing interface (`3-CALENDAR & SCHEDULING-2`)
- [ ] Overlap prevention logic (validate against existing bookings) (`3-CALENDAR & SCHEDULING-3`)

## Critical Rule
Artists MUST edit end time before a booking is fully confirmed. This prevents overlapping appointments. The system should not allow confirmation until the assigned artist has set their end time.
