<!-- execute -->
<!-- client: wizardryink -->
<!-- max-turns: 40 -->
<!-- depends-on: 13-system-integration -->

# Wizardry Ink — Quality Assurance

## Agent
Primary: **Sentinel**

## Objective
Full QA across browsers, devices, and booking flow scenarios.

## Tasks
- [ ] Cross-browser testing — Chrome, Safari, Firefox, Edge (`4-QUALITY ASSURANCE-0`)
- [ ] Mobile responsive QA — iOS Safari, Android Chrome, tablet (`4-QUALITY ASSURANCE-1`)
- [ ] Test booking flow end-to-end with real scenarios (`4-QUALITY ASSURANCE-2`)
- [ ] Page speed audit + performance optimization (`4-QUALITY ASSURANCE-3`)

## Test Scenarios
1. New client submits inquiry via website form
2. AI generates quote, Daisy sees swipe card
3. Daisy swipes right (approve), artist gets notification
4. Artist sets end time, system validates no overlap
5. Client receives confirmation
6. Repeat with overlapping time slot to test prevention
