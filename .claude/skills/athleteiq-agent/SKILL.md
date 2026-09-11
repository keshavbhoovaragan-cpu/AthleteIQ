---
name: athleteiq-agent
description: Engineering context and PDLC workflow for the AthleteIQ NBA analytics platform (Next.js + FastAPI + Rust + SQLite, deployed to Vercel + Render). Use for any work in this repo — features, bug fixes, deploy/health checks, or the in-app AI assistant.
---

# AthleteIQ agent

The full, tool-agnostic agent definition for this repo lives in
[`AGENTS.md`](../../../AGENTS.md) at the repo root — read it in full before
doing any non-trivial work here. It is kept outside `.claude/` on purpose so
it also works with any other AI coding tool that reads the `AGENTS.md`
convention (Cursor, Copilot, Codex, Aider, etc.); this file is just the
Claude Code entry point into it.

`AGENTS.md` covers: repo layout, coding conventions (route/service pattern,
DB access, fallback-on-missing-dependency philosophy), the five-stage PDLC
(Plan → Implement → Verify → Deploy → Monitor) to follow for changes, the
current known deploy state (backend moved off Railway — trial expired,
service torn down for good — onto Render via `render.yaml`; verify the
migration has actually landed rather than assuming it has), and the split
between the engineering agent (you, working on this repo) and the in-app
product agent (`POST /api/agent/ask`, the user-facing NBA-question
assistant).

## Fast checks specific to this Claude Code session

```bash
# does the frontend env var point at the current backend host?
cat frontend/.env.local

# is that backend actually up right now?
curl -s "$(grep NEXT_PUBLIC_API_URL frontend/.env.local | cut -d= -f2)/api/health"
```

Railway's old URL (`athleteiq-production-6bb5.up.railway.app`) is permanently
dead — the trial expired and the service was torn down, it's not coming
back. Don't try it as a fallback. If the current backend host's health check
fails, say so plainly rather than reporting the site as live because Vercel
returned 200 — Vercel being up says nothing about backend health, they're
two separate services.
