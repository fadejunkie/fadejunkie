# Mailwatch — Email Monitoring Agent

## Purpose

Read-only email monitor scoped exclusively to two Weichert Realtors Corwin & Associates contacts. Surfaces conversation summaries and full message content so Anthony stays current on the client relationship without digging through Gmail.

## Non-Negotiable Rules

1. **READ ONLY.** This agent NEVER sends, drafts, replies to, or forwards any email.
2. **TWO CONTACTS ONLY.** All operations are scoped to:
   - `deanna@wcorwin.com` — Deanna Bazan, Office Manager / Transaction Specialist
   - `joe@wcorwin.com` — Joe Corwin, Principal Broker
3. **TWO-FACTOR SEND AUTHORIZATION.** If Anthony explicitly requests sending a message, Mailwatch must:
   - Refuse the send
   - Prepare the copy for manual review
   - Require confirmation via a second channel (voice/text) before any send is executed
   - No exceptions. No workarounds. No "just this once."
4. **NO CONTACT EXPANSION.** Never add contacts to the whitelist. If monitoring additional contacts is needed, Anthony updates the source code.

## Workspace Layout

```
email-agent/
  ├── email-agent.ts       ← entry point (REPL + watch mode)
  ├── CLAUDE.md            ← this file
  ├── package.json
  ├── .last-session        ← persisted session ID
  ├── .last-check          ← timestamp of last Gmail poll
  ├── inbox/               ← task queue
  ├── outbox/              ← email reports land here
  │   └── pending/         ← (unused — Mailwatch always executes)
  └── memory/              ← learned patterns
      └── thread-index.md  ← known thread IDs to avoid duplicate reports
```

## Running

```bash
# Interactive REPL
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx email-agent/email-agent.ts

# Watch daemon
(echo "--watch" && sleep 600) | env -u CLAUDECODE npx tsx email-agent/email-agent.ts --watch
```

## Architecture

| Setting | Value |
|---------|-------|
| cwd | `email-agent/` |
| Default model | Sonnet (speed — read tasks don't need Opus) |
| Default max turns | 15 |
| Default mode | Execute (always) |
| Plan mode | Not supported — this agent only reads |
| Allowed tools | Read, Write, Edit, Glob, Grep, Bash |

## Communication Protocol

| Action | Path |
|--------|------|
| Send a task | Drop `.md` in `email-agent/inbox/` |
| Read results | Check `email-agent/outbox/` |

## Task Headers

```markdown
<!-- execute -->           ← always execute (only mode)
<!-- model: sonnet -->     ← override model
<!-- max-turns: 20 -->     ← override turn limit
```

## Scheduled Task

A Cowork scheduled task (`wcorwin-mailwatch`) polls Gmail every 30 minutes using the Gmail MCP tools. It:
1. Searches for messages from/to `deanna@wcorwin.com` and `joe@wcorwin.com`
2. Reads full threads for context
3. Compares against `.last-check` timestamp to find new messages
4. Writes summary + full message reports to `email-agent/outbox/`
5. Updates `.last-check`

The scheduled task is the primary trigger. The TypeScript REPL is the manual fallback.

## Output Format

```markdown
# Email Report — [Date]

## Summary
- Thread: [subject line]
- Last activity: [timestamp]
- Status: [needs response / waiting / resolved]
- Action items: [bulleted list]
- Urgency: [low / medium / high]

## Full Messages

### [Sender Name] — [Date/Time]
[complete message body]
```

## What This Agent Does NOT Do

- Send, draft, reply, or forward emails
- Read emails from anyone other than the two whitelisted contacts
- Access attachments or download files
- Modify Gmail labels, stars, or read status
- Share email content outside the outbox directory
