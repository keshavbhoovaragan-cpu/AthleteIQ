from fastapi import APIRouter
import math
from app.services.database import get_db

router = APIRouter()

def grade(s): return "S" if s>=60 else "A" if s>=50 else "B" if s>=40 else "C" if s>=30 else "D"

@router.get("/leaderboard")
async def leaderboard(season: str = "2024-25"):
    conn = get_db()
    rows = conn.execute("""
        SELECT p.id as player_id, p.name, p.position, ss.team,
               ss.pts, ss.ast, ss.reb, ss.stl, ss.blk, ss.fg_pct, ss.fantasy_score
        FROM season_stats ss JOIN players p ON p.id = ss.player_id
        WHERE ss.season = ? ORDER BY ss.fantasy_score DESC
    """, (season,)).fetchall()
    conn.close()
    result = [dict(r) for r in rows]
    scores = [r["fantasy_score"] for r in result if r["fantasy_score"]]
    if scores:
        mean = sum(scores)/len(scores)
        std = math.sqrt(sum((x-mean)**2 for x in scores)/len(scores)) or 1
        for r in result:
            fs = r["fantasy_score"] or 0
            r["z_score"] = round((fs-mean)/std, 2)
            r["percentile"] = round(len([s for s in scores if s<=fs])/len(scores)*100)
            r["grade"] = grade(fs)
    return {"players": result, "season": season, "source": "SQLite + Python z-score analysis"}

@router.get("/position-breakdown")
async def position_breakdown(season: str = "2024-25"):
    conn = get_db()
    rows = conn.execute("""
        SELECT CASE WHEN p.position IN ('G','G-F') THEN 'Guards'
                    WHEN p.position IN ('F','G-F','F-C') THEN 'Forwards'
                    WHEN p.position IN ('C','F-C') THEN 'Centers' ELSE 'Other' END as pos_group,
               COUNT(*) as count,
               ROUND(AVG(ss.pts),1) as avg_pts, ROUND(AVG(ss.ast),1) as avg_ast,
               ROUND(AVG(ss.reb),1) as avg_reb, ROUND(AVG(ss.fantasy_score),1) as avg_fs
        FROM season_stats ss JOIN players p ON p.id = ss.player_id
        WHERE ss.season = ? GROUP BY pos_group ORDER BY avg_fs DESC
    """, (season,)).fetchall()
    conn.close()
    return {"groups": [dict(r) for r in rows], "source": "SQLite GROUP BY"}
