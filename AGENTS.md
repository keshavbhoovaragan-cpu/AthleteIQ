# AGENTS.md — AthleteIQ

This file is the portable agent definition for this repo. It follows the
[AGENTS.md convention](https://agents.md) so any AI coding agent (Claude
Code, Cursor, Copilot, Codex, Aider, etc.) that reads `AGENTS.md` from the
repo root picks up the same context automatically — nothing here is
Claude-Code-specific. Claude Code additionally loads a thin wrapper at
`.claude/skills/athleteiq-agent/SKILL.md` that just points back here.

## What this project is

AthleteIQ is a full-stack NBA analytics platform: Next.js/TypeScript
frontend, FastAPI/Python backend, a Rust binary for batch fantasy scoring,
SQLite for analytics storage, Redis for caching, and `nba_api` for live NBA
data. See `README.md` for the full feature list, API reference, and
architecture rationale — don't duplicate that here, read it first.

## Repo layout

```
frontend/    Next.js 14 app router — one page per feature under src/app/*/page.tsx
backend/     FastAPI app — app/api/routes/*.py (routers), app/services/*.py (logic + DB), app/core/*.py (config/db/cache)
rust-engine/ Rust fantasy-scoring binary, called via subprocess from backend/app/services/rust_engine.py
scripts/     bash dev scripts (start, build, seed, backup)
railway.json Backend deploy config (Railway, Dockerfile-based)
vercel.json  Frontend deploy config (Vercel)
```

## Conventions to follow when changing code

- **Backend routes**: one router per resource in `app/api/routes/`, registered
  in `app/main.py` with an `/api/<resource>` prefix. Look at
  `app/api/routes/trades.py` or `rankings.py` before adding a new one — they
  set the pattern (plain `sqlite3.Row` access via `get_db()`, no ORM, small
  pure functions like `grade()` at module scope).
- **DB access**: always through `app.services.database.get_db()`
  (`sqlite3.Row` factory, WAL mode). Close the connection when done. Schema
  lives in `init_db()` in that same file.
- **Graceful degradation is a house style, not a one-off**: `rust_engine.py`
  falls back to a pure-Python scorer if the compiled binary isn't present.
  Any new integration that depends on an external binary/API/service should
  follow the same shape — check availability, fall back to something useful,
  log a warning, never hard-fail the request.
- **Frontend data fetching**: pages create a local axios instance with
  `baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"` (see
  any file under `frontend/src/app/*/page.tsx`), or use the shared helpers in
  `frontend/src/lib/api.ts`. Keep new pages consistent with whichever is
  already used nearby.
- **Fantasy grade scale** (used everywhere — don't invent a new one): S ≥60,
  A 50-59, B 40-49, C 30-39, D <30.

## AI-based Product Development Lifecycle (PDLC)

When an agent (human-directed or autonomous) makes a change in this repo, it
should move through these stages explicitly rather than jumping straight to
code:

1. **Plan** — Read this file and the specific files the change touches
   (relevant route + service on the backend, relevant page + component on the
   frontend). State the plan before writing code for anything non-trivial. If
   the request is ambiguous (which env, which deploy target, which data
   source), ask rather than guess.
2. **Implement** — Follow the conventions above. Prefer extending an existing
   route/service/page over introducing a new pattern. Keep the fallback
   philosophy for anything that depends on an external service (LLM API,
   Rust binary, NBA API, Redis).
3. **Verify** — Run/curl the changed endpoint locally
   (`uvicorn app.main:app --reload` + `curl localhost:8000/api/...`), and for
   frontend changes actually load the page in a browser, not just `tsc`/lint.
   `GET /api/health` reports DB row counts and Rust-binary availability —
   useful as a smoke test after any backend change.
4. **Deploy** — Backend deploys to **Railway** (Docker build defined by
   `backend/Dockerfile` + `railway.json`); frontend deploys to **Vercel**
   (`vercel.json`, currently empty/default config). These are two separate
   services with two separate URLs — a "live" AthleteIQ requires both to be
   up **and** the frontend's `NEXT_PUBLIC_API_URL` env var to point at the
   current Railway URL. Check both, not just Vercel, before calling something
   live.
5. **Monitor** — `/api/health` on the backend is the source of truth for
   backend health. A Railway URL returning
   `{"status":"error","code":404,"message":"Application not found"}` means
   the *service itself* is gone (deleted/renamed/unlinked), not that a route
   is missing — that's a deploy/infra problem, not a code problem.

## Data integrity notes

Two real bugs were found and fixed here that are worth knowing about before
adding anything that resolves players by name or ID:

- `nba_service.find_players()` matches against `nba_api`'s static player
  list, which stores names **with diacritics** ("Nikola Jokić", "Luka
  Dončić"). A naive substring match means searching the plain ASCII spelling
  anyone would actually type ("Jokic", "Doncic") returned nothing — this was
  live in the product, not just a new-feature bug. Fixed by normalizing both
  sides (strip diacritics, lowercase) before comparing — see `_normalize` in
  `nba_service.py`. Any new name-matching code should reuse `find_players`
  rather than rolling its own comparison.
- The hardcoded `INJURIES` seed list in `database.py` had two wrong
  `player_id`s (Joel Embiid and Lonzo Ball were paired with someone else's
  real NBA id) — almost certainly typed/guessed rather than looked up. Fixed
  by cross-checking every seeded id against `find_players()`. If you add more
  hardcoded player data anywhere (seed lists, fixtures, examples), verify the
  id against `find_players(name)` rather than typing one from memory — this
  is an easy, silent way to corrupt a join.

## Known issue (as of 2026-09-10)

`https://athleteiq-production-6bb5.up.railway.app` (the backend URL in
`frontend/.env.local` and, presumably, the Vercel project's env vars) returns
Railway's "Application not found" 404 — the Railway service is not currently
live. The Vercel frontend (`https://athlete-iq-jmk3.vercel.app`) returns 200,
but every page that calls the API will fail silently or show empty/error
states until the backend is redeployed/relinked and the frontend's
`NEXT_PUBLIC_API_URL` is updated to match. Don't report the app as "live" or
"working" without checking both.

## Agent roles in this repo

There are two distinct agent personas relevant to this project — don't
conflate them:

- **Engineering agent** (this file's primary audience): maintains the repo
  itself — features, bug fixes, deploy debugging, following the PDLC above.
- **Product agent**: an in-app AI feature, not a coding assistant. It answers
  user-facing fantasy-basketball questions ("who should I start", "is this a
  good trade") using live data from the SQLite DB, and can act — it calls a
  `go_to_page` tool to send the user straight to the right page (optionally
  pre-loaded with the right player via query params) instead of just
  describing where to look. Implemented in
  `backend/app/services/ai_agent.py` + `backend/app/api/routes/agent.py`
  (endpoint `POST /api/agent/ask`), surfaced globally via a floating widget
  at `frontend/src/components/agent/AgentWidget.tsx` (mounted once in
  `frontend/src/app/layout.tsx`, so it's on every page — there is no
  dedicated `/agent` page to navigate to). It follows the same fallback
  philosophy as the rest of the backend: if `ANTHROPIC_API_KEY` isn't set,
  it still returns a useful data-only answer instead of erroring, just
  without navigation (that needs the model). The `go_to_page` tool is
  constrained to a server-side allowlist (`_build_path` in `ai_agent.py`) —
  the model supplies a page name and player names, never a raw path, so it
  can't be steered into an arbitrary URL. Pages that support deep-linking
  (`/compare?a=&b=`, `/trades?give=&receive=`, `/streaks?player=`) resolve
  the name(s) via the existing player-search endpoint on mount. Any player
  name the tool returns is also checked against the real roster
  (`_validate_name`) before it's used — a hallucinated or misspelled name is
  dropped rather than turned into a broken deep link. It's multi-turn: the
  frontend sends the last few messages back as `history` on each request
  (capped at `MAX_HISTORY_MESSAGES` server-side) and persists the
  conversation in `sessionStorage` so a refresh doesn't lose it.
- **Watchlist**: a separate, non-agent feature — `frontend/src/app/watchlist/page.tsx`
  + `backend/app/api/routes/watchlist.py` (`GET /api/watchlist/check?players=`).
  Lets a user star players (stored client-side in `localStorage`, see
  `frontend/src/lib/watchlist.ts` — there's no server-side user account to
  attach a watchlist to) and polls for injury/streak changes, surfacing them
  in-app always and as a browser `Notification` when permission is granted.
  This is client-driven polling, not real server push — be accurate about
  that distinction if describing the feature; don't call it "push
  notifications" without qualifying it.

## Dev commands

```bash
# everything at once
chmod +x scripts/start.sh && ./scripts/start.sh

# backend only
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# frontend only
cd frontend && npm run dev

# rust engine
cd rust-engine && cargo build --release
```
