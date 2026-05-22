from fastapi import APIRouter
from app.services.database import get_db
from app.services.nba_service import get_recent_games, calc_fantasy_score, safe_float

router = APIRouter()

@router.get("/{player_id}")
async def get_streak(player_id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM season_stats WHERE player_id=? ORDER BY season DESC LIMIT 1", (player_id,)).fetchone()
    conn.close()
    recent = get_recent_games(player_id)
    games = recent.get("games", [])
    if not games:
        return {"error": "No recent game data available for this player"}
    season_avg_fs = safe_float(row["fantasy_score"]) if row else sum(calc_fantasy_score(g) for g in games)/len(games)
    for g in games:
        g["fantasy_score"] = round(calc_fantasy_score(g), 1)
    last5 = games[:5]
    avg5 = sum(g["fantasy_score"] for g in last5)/len(last5) if last5 else 0
    avg3 = sum(g["fantasy_score"] for g in games[:3])/len(games[:3]) if games[:3] else 0
    diff5 = round(avg5-season_avg_fs, 1)
    if avg5>season_avg_fs*1.20: streak="🔥 On Fire"; color="#f59e0b"
    elif avg5>season_avg_fs*1.08: streak="📈 Hot"; color="#22c55e"
    elif avg5<season_avg_fs*0.80: streak="🥶 Ice Cold"; color="#60a5fa"
    elif avg5<season_avg_fs*0.92: streak="📉 Cold"; color="#93c5fd"
    else: streak="➡️ Neutral"; color="#9ca3af"
    return {"games":games,"season_avg_fs":round(season_avg_fs,1),"last5_avg_fs":round(avg5,1),
            "last3_avg_fs":round(avg3,1),"diff_from_avg":diff5,"streak_label":streak,"color":color}
