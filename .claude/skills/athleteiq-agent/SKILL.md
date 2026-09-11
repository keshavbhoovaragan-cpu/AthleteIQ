---
name: athleteiq-agent
description: Engineering context and PDLC workflow for the AthleteIQ NBA analytics platform (Next.js + FastAPI + Rust + SQLite, deployed to Vercel + Railway). Use for any work in this repo — features, bug fixes, deploy/health checks, or the in-app AI assistant.
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
current known deploy issue (Railway backend down as of 2026-09-10 — verify
both `https://athlete-iq-jmk3.vercel.app` and the Railway API URL, not just
Vercel, before calling anything "live"), and the split between the
engineering agent (you, working on this repo) and the in-app product agent
(`POST /api/agent/ask`, the user-facing NBA-question assistant).

## Fast checks specific to this Claude Code session

```bash
# is the backend actually up right now?
curl -s https://athleteiq-production-6bb5.up.railway.app/api/health

# does the frontend env var match the live backend URL?
cat frontend/.env.local
```

If the health check 404s with `"Application not found"`, the Railway service
itself is down/unlinked — say so plainly rather than reporting the site as
live because Vercel returned 200.
