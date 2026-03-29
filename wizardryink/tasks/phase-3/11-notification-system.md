<!-- execute -->
<!-- client: wizardryink -->
<!-- max-turns: 40 -->
<!-- depends-on: 10-calendar-scheduling -->

# Wizardry Ink — Notification System

## Agent
Primary: **Convex Agent**

## Objective
Build automated notification pipeline for artists, clients, and internal tracking.

## Deliverables
- Artist notification triggers
- Client confirmation flow
- Internal status tracking

## Tasks
- [ ] Artist notification on new booking assignment (push/email/SMS) (`3-NOTIFICATION SYSTEM-0`)
- [ ] Client confirmation notification (quote + scheduled time) (`3-NOTIFICATION SYSTEM-1`)
- [ ] Internal status updates (booked → confirmed → completed) (`3-NOTIFICATION SYSTEM-2`)

## Notification Flow
1. New inquiry → AI processes → Quote generated → **Daisy notified** (swipe card appears)
2. Daisy approves → **Artist notified** (new booking, edit end time)
3. Artist sets end time → **System validates** no overlap → **Client notified** (confirmed appointment)
4. Appointment complete → **Status updated** → Internal tracking
