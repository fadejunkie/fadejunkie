<!-- execute -->
<!-- client: wizardryink -->
<!-- max-turns: 60 -->

# Wizardry Ink — AI Intake Engine

## Agent
Primary: **Convex Agent**

## Objective
Build the AI-powered inbound inquiry processor that converts DMs and web form submissions into structured, quote-ready data.

## Deliverables
- Inquiry intake API (web form + future DM integration)
- Quote generation logic
- Artist auto-assignment algorithm
- Quote card data structure

## Tasks
- [ ] Build inbound inquiry processor (DM/web form → structured data) (`3-AI INTAKE ENGINE-0`)
- [ ] Train quote model: size, style, placement, color, complexity → price range (`3-AI INTAKE ENGINE-1`)
- [ ] Auto-assign artist based on style match + availability (`3-AI INTAKE ENGINE-2`)
- [ ] Generate quote card with all details for owner review (`3-AI INTAKE ENGINE-3`)

## Quote Card Fields
- Client name + contact
- Tattoo description + reference images
- Size, placement, color (B&W vs color), complexity score
- AI-generated price range (min–max)
- Suggested artist (based on style match)
- Suggested time slot (based on availability)
