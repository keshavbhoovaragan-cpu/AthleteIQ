from fastapi import APIRouter
from app.services.database import get_db
from app.services.nba_service import calc_fantasy_score, predict_next_season, safe_float

router = APIRouter()

def grade(s): return "S" if s>=60 else "A" if s>=50 else "B" if s>=40 else "C" if s>=30 else "D"

def get_player_from_db(player_id: int):
    conn = get_db()
    row = conn.execute("""
        SELECT ss.*, p.name, p.position FROM season_stats ss
        JOIN players p ON p.id = ss.player_id
        WHERE ss.player_id = ? ORDER BY ss.season DESC LIMIT 1
    """, (player_id,)).fetchone()
    rows = conn.execute("SELECT * FROM season_stats WHERE player_id=? ORDER BY season ASC", (player_id,)).fetchall()
    conn.close()
    if row and rows:
        return dict(row), [dict(r) for r in rows]
    return None, []

def trade_rec(a_fs, b_fs, a_pred, b_pred):
    diff = a_fs - b_fs
    pred_diff = (a_pred or a_fs) - (b_pred or b_fs)
    if diff > 8 and pred_diff > 5: return "Strong Accept","Player A is significantly better now and projected to stay ahead.","#22c55e"
    elif diff > 3: return "Accept","Player A edges out Player B in current value.","#86efac"
    elif diff < -8 and pred_diff < -5: return "Strong Decline","Player B is significantly better. Don't make this trade.","#ef4444"
    elif diff < -3: return "Decline","Player B has the edge in current fantasy value.","#fca5a5"
    else: return "Fair Trade","Both players have similar fantasy value. Consider age and schedule.","#f59e0b"

@router.get("/analyze/{player_a_id}/{player_b_id}")
async def analyze_trade(player_a_id: int, player_b_id: int):
    a_latest, a_seasons = get_player_from_db(player_a_id)
    b_latest, b_seasons = get_player_from_db(player_b_id)
    if not a_latest or not b_latest:
        return {"error": "Could not fetch stats. These players may not be in our database yet."}
    a_fs = safe_float(a_latest.get("fantasy_score")) or calc_fantasy_score(a_latest)
    b_fs = safe_float(b_latest.get("fantasy_score")) or calc_fantasy_score(b_latest)
    a_pred = predict_next_season(a_seasons) if len(a_seasons)>=2 else {"fantasy_score":a_fs}
    b_pred = predict_next_season(b_seasons) if len(b_seasons)>=2 else {"fantasy_score":b_fs}
    verdict,reason,color = trade_rec(a_fs,b_fs,a_pred.get("fantasy_score"),b_pred.get("fantasy_score"))
    cats=["pts","ast","reb","stl","blk","fg_pct"]
    a_wins=sum(1 for c in cats if safe_float(a_latest.get(c,0))>safe_float(b_latest.get(c,0)))
    return {
        "player_a":{**a_latest,"fantasy_score":a_fs,"grade":grade(a_fs),"prediction":a_pred},
        "player_b":{**b_latest,"fantasy_score":b_fs,"grade":grade(b_fs),"prediction":b_pred},
        "verdict":verdict,"reason":reason,"color":color,
        "category_wins":{"a":a_wins,"b":len(cats)-a_wins},
        "value_diff":round(a_fs-b_fs,1)
    }
