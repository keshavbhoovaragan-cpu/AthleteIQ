from fastapi import APIRouter
from app.services.database import get_db

router = APIRouter()

def grade(s): return "S" if s>=60 else "A" if s>=50 else "B" if s>=40 else "C" if s>=30 else "D"

@router.get("/")
async def get_rankings(season: str = "2024-25", pos: str = "All"):
    conn = get_db()
    rows = conn.execute("""
        SELECT p.id, p.name, p.position, ss.team, ss.pts, ss.ast, ss.reb,
               ss.stl, ss.blk, ss.fg_pct, ss.ft_pct, ss.tov, ss.gp, ss.fantasy_score
        FROM season_stats ss JOIN players p ON p.id = ss.player_id
        WHERE ss.season = ? ORDER BY ss.fantasy_score DESC
    """, (season,)).fetchall()
    conn.close()
    result = []
    for r in rows:
        p = dict(r)
        ppos = p.get("position","")
        if pos!="All":
            if pos=="G" and ppos not in ("G","G-F"): continue
            if pos=="F" and ppos not in ("F","G-F","F-C"): continue
            if pos=="C" and ppos not in ("C","F-C"): continue
            if pos not in ("All","G","F","C") and ppos!=pos: continue
        p["grade"] = grade(p["fantasy_score"] or 0)
        result.append(p)
    return {"players": result, "season": season, "available_seasons": ["2024-25","2023-24","2022-23","2021-22","2020-21"]}

@router.get("/leaders")
async def get_leaders(season: str = "2024-25", stat: str = "pts", pos: str = "All", limit: int = 15):
    valid = {"pts","ast","reb","stl","blk","fg_pct","fantasy_score"}
    if stat not in valid: stat = "pts"
    conn = get_db()
    rows = conn.execute(f"""
        SELECT p.id, p.name, p.position, ss.team, ss.{stat} as value,
               ss.pts, ss.ast, ss.reb, ss.stl, ss.blk, ss.fg_pct, ss.fantasy_score
        FROM season_stats ss JOIN players p ON p.id = ss.player_id
        WHERE ss.season = ? AND ss.{stat} IS NOT NULL ORDER BY ss.{stat} DESC LIMIT ?
    """, (season, limit+10)).fetchall()
    conn.close()
    result = []
    for r in rows:
        p = dict(r)
        ppos = p.get("position","")
        if pos!="All":
            if pos=="G" and ppos not in ("G","G-F"): continue
            if pos=="F" and ppos not in ("F","G-F","F-C"): continue
            if pos=="C" and ppos not in ("C","F-C"): continue
            if pos not in ("All","G","F","C") and ppos!=pos: continue
        if len(result) < limit: result.append(p)
    return {"leaders": result, "season": season, "stat": stat}

@router.get("/seasons")
async def get_seasons():
    return {"seasons": ["2024-25","2023-24","2022-23","2021-22","2020-21"]}
