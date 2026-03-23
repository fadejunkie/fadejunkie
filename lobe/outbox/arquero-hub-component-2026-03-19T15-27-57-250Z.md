# Result: arquero-hub-component

Timestamp: 2026-03-19T15-27-57-250Z
Session: no-session-1773934077250

---

All done. Here's the full summary:

---

**ArqueroHub.tsx created** — 613 lines, committed to `arquero/src/`.

**All 8 changes landed (10/10 checks passed):**

| # | Change | What |
|---|--------|------|
| 1 | Import block | `// @ts-nocheck` + `useQuery`/`useMutation`/`api` imports |
| 2 | Function signature | `defaultView` + `opsMode` props with TypeScript types |
| 3 | `useState` initializer | `useState<"internal"\|"client">(defaultView)` |
| 4 | Tasks state | `useQuery(api.arqueroTasks.getTasks)` + `useMutation(api.arqueroTasks.setTask)` |
| 5 | WorkflowPage render | `onToggle` callback wired to `setTaskMutation` |
| 6 | View toggle guard | `page==="workflow"&&opsMode&&(` |
| 7 | WorkflowPage signature | Typed props with `onToggle:(key:string)=>void` |
| 8 | Toggle function | Delegates to `onToggle(key)` instead of local `setTasks` |

Zero styling changes. UI is pixel-perfect identical to the original — only the data layer got swapped out.
