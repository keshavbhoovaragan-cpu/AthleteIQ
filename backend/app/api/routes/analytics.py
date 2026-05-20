from fastapi import APIRouter
import sqlite3, os, time, math
from app.services.nba_service import get_career_stats, calc_fantasy_score

router = APIRouter()
DB_PATH = "/tmp/athleteiq_analytics.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""CREATE TABLE IF NOT EXISTS player_cache (
        player_id INTEGER PRIMARY KEY, name TEXT, position TEXT,
        pts REAL, ast REAL, reb REAL, stl REAL, blk REAL,
        fg_pct REAL, fantasy_score REAL, updated_at INTEGER)""")
    conn.commit(); conn.close()

init_db()

STAR_PLAYERS = [
    (2544,"LeBron James","F"),(1628983,"Shai Gilgeous-Alexander","G"),
    (203999,"Nikola Jokic","C"),(203507,"Giannis Antetokounmpo","F"),
    (201939,"Stephen Curry","G"),(1629029,"Luka Doncic","G-F"),
    (1641705,"Victor Wembanyama","C"),(1630169,"Tyrese Haliburton","G"),
    (1630162,"Anthony Edwards","G"),(1628369,"Jayson Tatum","F"),
]

@router.get("/leaderboard")
async def leaderboard():
    conn = get_db()
    rows = conn.execute("SELECT * FROM player_cache ORDER BY fantasy_score DESC").fetchall()
    now = int(time.time())
    if not rows or (rows and now - rows[0]["updated_at"] > 7200):
        for pid, name, pos in STAR_PLAYERS:
            try:
                career = get_career_stats(pid)
                seasons = career.get("seasons", [])
                if not seasons: continue
                latest = seasons[-1]
                fs = calc_fantasy_score(latest)
                conn.execute("INSERT OR REPLACE INTO player_cache VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                    (pid,name,pos,latest.get("pts",0),latest.get("ast",0),latest.get("reb",0),
                     latest.get("stl",0),latest.get("blk",0),latest.get("fg_pct",0),fs,now))
            except: continue
        conn.commit()
        rows = conn.execute("SELECT * FROM player_cache ORDER BY fantasy_score DESC").fetchall()
    result = [dict(r) for r in rows]
    conn.close()
    scores = [r["fantasy_score"] for r in result if r["fantasy_score"]]
    if scores:
        mean = sum(scores)/len(scores)
        std_dev = math.sqrt(sum((x-mean)**2 for x in scores)/len(scores))
        for r in result:
            z = (r["fantasy_score"]-mean)/std_dev if std_dev else 0
            r["z_score"] = round(z, 2)
            r["percentile"] = round(len([s for s in scores if s <= r["fantasy_score"]])/len(scores)*100)
    return {"players": result, "source": "SQLite + Python stats"}

@router.get("/position-breakdown")
async def position_breakdown():
    conn = get_db()
    rows = conn.execute("""SELECT
        CASE WHEN position IN ('G','PG','SG','G-F') THEN 'Guards'
             WHEN position IN ('F','SF','PF','F-C') THEN 'Forwards'
             WHEN position IN ('C','F-C') THEN 'Centers'
             ELSE 'Other' END as pos_group,
        COUNT(*) as count,
        ROUND(AVG(pts),1) as avg_pts, ROUND(AVG(ast),1) as avg_ast,
        ROUND(AVG(reb),1) as avg_reb, ROUND(AVG(fantasy_score),1) as avg_fs
        FROM player_cache GROUP BY pos_group ORDER BY avg_fs DESC""").fetchall()
    conn.close()
    return {"groups": [dict(r) for r in rows]}
