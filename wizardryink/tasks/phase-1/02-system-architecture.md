<!-- execute -->
<!-- client: wizardryink -->
<!-- max-turns: 40 -->
<!-- depends-on: 01-client-intake -->

# Wizardry Ink — System Architecture

## Agent
Primary: **Convex Agent** (backend) + **Funkie** (strategy)

## Objective
Design the complete AI booking pipeline and owner dashboard architecture based on intake findings.

## Deliverables
1. `wizardryink/content/02-pipeline-architecture.md` — Full booking pipeline design
2. `wizardryink/content/02-dashboard-spec.md` — Owner dashboard specification

## Tasks
- [ ] Design AI booking pipeline: DM/web intake → quote → schedule → notify → confirm (`1-SYSTEM ARCHITECTURE-0`)
- [ ] Define quote engine logic: size, style, placement, color, complexity → price range (`1-SYSTEM ARCHITECTURE-1`)
- [ ] Map artist workflow: notification → end time edit → overlap prevention (`1-SYSTEM ARCHITECTURE-2`)
- [ ] Design owner dashboard: Tinder swipe-to-approve, booking pipeline view, artist calendar (`1-SYSTEM ARCHITECTURE-3`)

## Key Requirements
- Swipe right = approve quote + confirm artist assignment
- Swipe left = reject / edit quote / reassign artist
- End time editing by artists prevents overlapping bookings
- Pipeline stages: Inquiry → Quoted → Scheduled → Confirmed → Completed
