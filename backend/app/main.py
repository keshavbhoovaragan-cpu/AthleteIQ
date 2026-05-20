from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import players, stats, scouting, auth, rankings, analytics, trades, injuries, streaks

app = FastAPI(title="AthleteIQ API", version="3.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(players.router,   prefix="/api/players",   tags=["players"])
app.include_router(stats.router,     prefix="/api/stats",     tags=["stats"])
app.include_router(scouting.router,  prefix="/api/scouting",  tags=["scouting"])
app.include_router(auth.router,      prefix="/api/auth",      tags=["auth"])
app.include_router(rankings.router,  prefix="/api/rankings",  tags=["rankings"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(trades.router,    prefix="/api/trades",    tags=["trades"])
app.include_router(injuries.router,  prefix="/api/injuries",  tags=["injuries"])
app.include_router(streaks.router,   prefix="/api/streaks",   tags=["streaks"])

@app.get("/api/health")
async def health():
    return {"status":"ok","version":"3.0.0","features":9}
