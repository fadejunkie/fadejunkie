# /browser-test — Browser Agent for Testing & Verification

Use Playwright to visually verify deployed projects, troubleshoot issues, and catch problems before delivery.

## When to Use

- **After deploying** any project — verify it looks correct live
- **After code changes** to a client tracker/dashboard — login and screenshot to confirm
- **When troubleshooting** a reported bug — screenshot the actual state
- **Before delivering** work to Anthony — visual QA pass
- **To check project status** — login and capture current dashboard state

## Browser Agent CLI

All commands run from the workspace root:

```bash
node browser-agent/agent.mjs <command> [args...]
```

### Commands

| Command | Description |
|---------|-------------|
| `check <project>` | Login + full-page dashboard screenshot |
| `screenshot <url>` | Navigate to any URL and screenshot (no login) |
| `login <project>` | Login to a registered project |
| `clean` | Delete screenshots older than 1 hour |
| `clean <ms>` | Delete screenshots older than N milliseconds |
| `list` | Show all registered projects |

### Registered Projects

| Key | Project | URL |
|-----|---------|-----|
| `wcorwin` | WCORWIN SEO Tracker | wcorwin.anthonytatis.com |
| `fadejunkie` | FadeJunkie | fadejunkie.com |

_(Add new projects in `browser-agent/agent.mjs` → `PROJECTS` object)_

## Output

- All commands output JSON to stdout: `{ ok, screenshots[], url, error? }`
- Screenshots saved to `browser-agent/shots/` with timestamps
- Screenshot paths are printed to stderr prefixed with 📸

## Rules

1. **Always disclose screenshot file paths** to the user
2. **Clean up** screenshots after confirming they're no longer needed — run `clean` at end of session
3. **Use headless mode** by default (no visible browser window)
4. **Compare before/after** — take a screenshot before changes and after to verify
5. **Never leave credentials in output** — the agent handles auth internally

## Workflow Example

After deploying WCORWIN changes:

```bash
# 1. Check the live site
node browser-agent/agent.mjs check wcorwin

# 2. Read the screenshot to verify
# (use Read tool on the screenshot path from output)

# 3. If issues found, fix and redeploy, then check again

# 4. Clean up when done
node browser-agent/agent.mjs clean
```

## Adding New Projects

Edit `browser-agent/agent.mjs` → `PROJECTS` object:

```js
newproject: {
  url: 'https://example.com',
  email: 'user@example.com',
  password: 'password',
  name: 'Project Name',
},
```

Then update this skill's Registered Projects table.

$ARGUMENTS
