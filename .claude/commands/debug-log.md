---
description: Log a debugging win to persistent memory
allowed-tools: Read, Edit
---

A debugging session just resolved a non-obvious bug. Capture it now.

## Target file

`C:/Users/twani/.claude/projects/C--Users-twani-fadejunkie/memory/MEMORY.md` — section: **Lobe Task Debugging**

## Steps

1. Read the memory file to see what's already there.
2. From the recent conversation, identify: symptom, root cause, diagnostic, fix.
3. Check if it fits an existing subsection — if so, append to it. If it's a new pattern, add a `###` subsection.
4. If it involves a server/client shape mismatch, also update the **Known API shape gotchas** bullets under `## Control Center (CC)`.

## Entry format

```
### <Bug pattern name>
**Symptom:** what you see
**Cause:** what was wrong
**Diagnosis:** fastest way to confirm
**Fix:** what to do
```

For minor additions (config flag, one new gotcha), a single bullet in the relevant subsection is enough — don't over-engineer small things.

**Rules:** never duplicate existing entries, never remove existing entries, keep each entry to one short paragraph max, prioritize the diagnostic over the description.
