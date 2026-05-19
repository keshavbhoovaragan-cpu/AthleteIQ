from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import players, stats, scouting, auth, rankings

app = FastAPI(title="AthleteIQ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(players.router, prefix="/api/players", tags=["players"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])
app.include_router(scouting.router, prefix="/api/scouting", tags=["scouting"])
app.include_router(rankings.router, prefix="/api/rankings", tags=["rankings"])

@app.get("/api/health")
async def health():
    return {"status": "ok"}
