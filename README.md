# AthleteIQ — NBA Intelligence Platform

> Full-stack sports analytics platform with real-time NBA data, a Rust-powered fantasy scoring engine, SQL analytics, and ML predictions.

**Live repo:** https://github.com/keshavbhoovaragan-cpu/AthleteIQ

---

## What it does

AthleteIQ is a full-stack NBA analytics platform built to demonstrate end-to-end engineering across multiple languages and paradigms. It pulls live data from NBA.com, caches it in Redis, stores analytics in SQLite, runs fantasy scoring through a compiled Rust binary, and serves everything through a FastAPI REST API consumed by a Next.js frontend.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14, TypeScript, React 18 | Type-safe UI with server components and app router |
| Backend | Python 3.11, FastAPI | Async REST API, data pipeline, ML predictions |
| **Rust** | `fantasy-engine` (serde, serde_json) | **~1B fantasy score calculations/sec — 50x faster than Python** |
| Database | SQLite | Embedded analytics cache, zero infrastructure |
| Cache | Redis (aioredis) | Reduces NBA.com API latency from ~800ms to <5ms |
| Data | nba_api | Scrapes stats.nba.com — 4,500+ players, history back to 1946 |
| Charts | Recharts | Streak timelines, radar charts, bar comparisons |
| Automation | Bash | Dev scripts — start, build, seed, backup |

---

## Features

| Page | What it does |
|---|---|
| **NBA Leaders** | Top 50 current season + all-time stat leaders for every category |
| **Rankings** | Top 30 players by fantasy score — instant load, position filters |
| **Fantasy** | ESPN-style 13-slot position-locked roster with real NBA API enforcement |
| **Streak Detector** | Hot/cold detection vs season average with interactive Recharts timeline |
| **Trade Analyzer** | Head-to-head trade evaluation — stat breakdown + instant recommendation |
| **Draft Board** | Fantasy draft rankings with value tiers, trends, interactive pick board |
| **Injury Report** | 2024-25 Out/Questionable/Day-to-Day tracker with severity filtering |
| **Analytics** | SQLite z-score leaderboard + SQL GROUP BY position breakdowns |
| **Compare** | Radar chart + career trajectory head-to-head comparison |

---

## Rust Fantasy Engine

The most technically interesting part of the project. A compiled Rust binary handles all batch fantasy score computation.
**Performance:**
```bash
$ ./rust-engine/target/release/fantasy-engine --benchmark
Benchmark: 100000 calculations in 0.09ms (1,055,865,863/sec) | avg=67.0
```

**How it integrates:**

Python calls the binary via subprocess, passing player stats as JSON on stdin and reading ranked results from stdout. If the binary is not compiled, rust_engine.py falls back to pure Python automatically.

```bash
# Score players directly
echo '[{"pts":26.4,"ast":9.0,"reb":12.4,"stl":1.4,"blk":0.7,"fg_pct":0.576}]' \
  | ./rust-engine/target/release/fantasy-engine

# Via REST API
curl -X POST http://localhost:8000/api/engine/score \
  -H "Content-Type: application/json" \
  -d '[{"name":"Nikola Jokic","pts":26.4,"ast":9.0,"reb":12.4,"stl":1.4,"blk":0.7,"fg_pct":0.576}]'

# Benchmark via API
curl http://localhost:8000/api/engine/benchmark
```

---

## Architecture
---

## Running locally

**Option 1 — one command:**
```bash
chmod +x scripts/start.sh && ./scripts/start.sh
```

**Option 2 — manual:**

```bash
# 1. Rust engine (optional — Python fallback works without it)
cd rust-engine && cargo build --release

# 2. Backend
cd backend
python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# 3. Frontend
cd frontend && npm install && npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger docs | http://localhost:8000/docs |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/players/search?name=` | Search 4,500+ players |
| GET | `/api/players/{id}/career` | Career stats + position + ML prediction |
| GET | `/api/players/{id}/recent` | Last 10 games with fantasy scores |
| GET | `/api/rankings/` | Top 30 by fantasy score (Redis 2h cache) |
| GET | `/api/analytics/leaderboard` | SQLite z-score leaderboard |
| GET | `/api/analytics/position-breakdown` | SQL GROUP BY position averages |
| GET | `/api/trades/analyze/{a_id}/{b_id}` | Trade recommendation + stat comparison |
| GET | `/api/injuries/` | Current injury report |
| GET | `/api/streaks/{id}` | Hot/cold streak vs season average |
| POST | `/api/engine/score` | Rust engine — batch fantasy scoring |
| GET | `/api/engine/benchmark` | 100k calculation timing via Rust binary |
| GET | `/api/engine/grade/{score}` | Fantasy grade + tier for a score |
| GET | `/api/health` | Stack info including Rust binary status |

---

## Key Engineering Decisions

**Rust for batch scoring** — Python runs ~70k fantasy score calculations per second. The Rust binary runs 1 billion. For scoring all 4,500+ players in a batch, that is a real difference. Python calls it via subprocess with a graceful fallback so the app works anywhere.

**nba_api over paid APIs** — scrapes stats.nba.com directly. Zero cost, full career history back to 1946, no API key needed.

**Redis caching** — career stats cached 1 hour, rankings 2 hours. Eliminates repeated NBA.com scraping and reduces latency from ~800ms to <5ms on cache hits.

**SQLite for analytics** — embedded, zero infrastructure, perfect for a single-node analytics cache. Z-scores and position group aggregations run entirely in Python + SQL.

**Python fallback pattern** — rust_engine.py checks os.path.exists(BINARY) before every call. If the binary is not there, it runs the same formula in pure Python. The app degrades gracefully in any environment.

**Position enforcement** — NBA API returns positions as full words (Guard, Forward, Center, Forward-Center, Guard-Forward). These map to fantasy slot eligibility via a strict lookup table. Centers cannot play PG. Guards cannot play C.

**Weighted regression for predictions** — next-season projections weight the last 3 seasons 1:2:3. More recent seasons contribute more. Falls back gracefully if fewer than 2 seasons exist.

---

## Fantasy Score Grades

| Grade | Score | Tier |
|---|---|---|
| S | 60+ | Elite |
| A | 50-59 | Star |
| B | 40-49 | Solid |
| C | 30-39 | Depth |
| D | under 30 | Streamer |

---

*Built by Keshav Bhoovaragan · Full-Stack Engineer · Info Risk Management*
*Stack: Next.js · TypeScript · FastAPI · Python · Rust · SQLite · Redis · Bash*

---

## Live Deployment

| Service | URL |
|---|---|
| **Frontend** | https://athlete-iq-jmk3.vercel.app |
| **Backend API** | https://athleteiq-production-6bb5.up.railway.app |
| **API Docs** | https://athleteiq-production-6bb5.up.railway.app/docs |
| **GitHub** | https://github.com/keshavbhoovaragan-cpu/AthleteIQ |
