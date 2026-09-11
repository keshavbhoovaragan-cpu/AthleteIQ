from fastapi import APIRouter
from app.services.database import get_db
from app.services.nba_service import get_recent_games, calc_fantasy_score, safe_float, compute_streak_info

router = APIRouter()

@router.get("/{player_id}")
async def get_streak(player_id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM season_stats WHERE player_id=? ORDER BY season DESC LIMIT 1", (player_id,)).fetchone()
    conn.close()
    try:
        recent = get_recent_games(player_id)
    except Exception:
        recent = {"games": []}
    games = recent.get("games", [])
    if not games:
        return {"error": "No recent game data available for this player"}
    season_avg_fs = safe_float(row["fantasy_score"]) if row else sum(calc_fantasy_score(g) for g in games)/len(games)
    info = compute_streak_info(games, season_avg_fs)
    avg3 = sum(g["fantasy_score"] for g in games[:3])/len(games[:3]) if games[:3] else 0
    return {"games":games,"season_avg_fs":round(season_avg_fs,1),"last5_avg_fs":info["last5_avg_fs"],
            "last3_avg_fs":round(avg3,1),"diff_from_avg":info["diff_from_avg"],
            "streak_label":info["streak_label"],"color":info["color"]}
