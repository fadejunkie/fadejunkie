# Arquero Co — Client Config

- **Client:** Arquero Co.
- **Primary channel:** WhatsApp (not email)
- **WhatsApp contact name:** "Arquero" (search this in WhatsApp Web chat list)
- **Email contacts:** TBD
- **Project data:**
  - `arquero/src/ArqueroHub.tsx` — Arquero phase data
  - `control-center/cc-crm.json` — CRM records
  - `control-center/cc-notes.json` — Activity notes
- **Hub:** arqueroco.anthonytatis.com
- **Tone:** Professional, energetic, milestone-driven

## WhatsApp Send Process

To send a message to Arquero, use Claude in Chrome browser automation:
1. Open `https://web.whatsapp.com/` in a new tab
2. Search for "Arquero" in chat list (should be near top)
3. Click into conversation
4. Type message in input box
5. **Show Anthony for approval before pressing Enter**
6. On approve → press Enter to send

See `memory/infra/whatsapp-browser.md` for full technical process.
