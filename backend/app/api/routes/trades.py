from fastapi import APIRouter
from app.services.nba_service import get_career_stats, calc_fantasy_score, predict_next_season

router = APIRouter()

def grade(score):
    return "S" if score>=60 else "A" if score>=50 else "B" if score>=40 else "C" if score>=30 else "D"

def trade_recommendation(a_fs, b_fs, a_pred, b_pred):
    diff = a_fs - b_fs
    pred_diff = (a_pred or a_fs) - (b_pred or b_fs)
    if diff > 8 and pred_diff > 5:
        return "Strong Accept", "Player A is significantly better now and projected to stay ahead.", "#22c55e"
    elif diff > 3:
        return "Accept", "Player A edges out Player B in current value.", "#86efac"
    elif diff < -8 and pred_diff < -5:
        return "Strong Decline", "Player B is significantly better. Don't make this trade.", "#ef4444"
    elif diff < -3:
        return "Decline", "Player B has the edge. You'd be losing value.", "#fca5a5"
    else:
        return "Fair Trade", "Both players have similar fantasy value. Consider age and schedule.", "#f59e0b"

@router.get("/analyze/{player_a_id}/{player_b_id}")
async def analyze_trade(player_a_id: int, player_b_id: int):
    a_career = get_career_stats(player_a_id)
    b_career = get_career_stats(player_b_id)
    a_seasons = a_career.get("seasons", [])
    b_seasons = b_career.get("seasons", [])
    if not a_seasons or not b_seasons:
        return {"error": "Could not fetch career data"}
    a_latest = a_seasons[-1]
    b_latest = b_seasons[-1]
    a_fs = calc_fantasy_score(a_latest)
    b_fs = calc_fantasy_score(b_latest)
    a_pred = predict_next_season(a_seasons)
    b_pred = predict_next_season(b_seasons)
    verdict, reason, color = trade_recommendation(a_fs, b_fs, a_pred.get("fantasy_score"), b_pred.get("fantasy_score"))
    cats = ["pts","ast","reb","stl","blk","fg_pct"]
    a_wins = sum(1 for c in cats if a_latest.get(c,0) > b_latest.get(c,0))
    return {
        "player_a": {**a_latest, "fantasy_score": a_fs, "grade": grade(a_fs), "prediction": a_pred},
        "player_b": {**b_latest, "fantasy_score": b_fs, "grade": grade(b_fs), "prediction": b_pred},
        "verdict": verdict, "reason": reason, "color": color,
        "category_wins": {"a": a_wins, "b": len(cats)-a_wins},
        "value_diff": round(a_fs-b_fs, 1)
    }
