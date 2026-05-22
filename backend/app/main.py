from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import players, stats, scouting, auth, rankings, analytics, trades, injuries, streaks, engine
from app.services.database import init_db, seed_rankings, seed_injuries, get_db

app = FastAPI(title="AthleteIQ API", version="4.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
async def startup():
    init_db()
    conn = get_db()
    count = conn.execute("SELECT COUNT(*) FROM season_stats").fetchone()[0]
    inj = conn.execute("SELECT COUNT(*) FROM injuries").fetchone()[0]
    conn.close()
    if count == 0:
        seed_rankings()
    if inj == 0:
        seed_injuries()

app.include_router(players.router,   prefix="/api/players",   tags=["players"])
app.include_router(stats.router,     prefix="/api/stats",     tags=["stats"])
app.include_router(scouting.router,  prefix="/api/scouting",  tags=["scouting"])
app.include_router(auth.router,      prefix="/api/auth",      tags=["auth"])
app.include_router(rankings.router,  prefix="/api/rankings",  tags=["rankings"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(trades.router,    prefix="/api/trades",    tags=["trades"])
app.include_router(injuries.router,  prefix="/api/injuries",  tags=["injuries"])
app.include_router(streaks.router,   prefix="/api/streaks",   tags=["streaks"])
app.include_router(engine.router,    prefix="/api/engine",    tags=["rust-engine"])

@app.get("/api/health")
async def health():
    from app.services.rust_engine import _find_binary
    conn = get_db()
    sc = conn.execute("SELECT COUNT(*) FROM season_stats").fetchone()[0]
    pc = conn.execute("SELECT COUNT(*) FROM players").fetchone()[0]
    ic = conn.execute("SELECT COUNT(*) FROM injuries").fetchone()[0]
    conn.close()
    return {"status":"ok","version":"4.0.0",
            "database":{"players":pc,"season_stats":sc,"injuries":ic},
            "rust_engine":bool(_find_binary())}
