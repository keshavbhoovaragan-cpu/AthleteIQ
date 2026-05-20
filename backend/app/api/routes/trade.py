from fastapi import APIRouter
import math
from app.services.nba_service import get_career_stats, calc_fantasy_score, predict_next_season, get_player_info
from app.core.cache import cache_get, cache_set

router = APIRouter()

def value_score(career: dict) -> dict:
    seasons = career.get("seasons", [])
    if not seasons:
        return {"current_fs":0,"projected_fs":0,"trend":"unknown","consistency":0,"pts":0,"ast":0,"reb":0,"stl":0,"blk":0,"seasons_played":0}
    latest = seasons[-1]
    fs = calc_fantasy_score(latest)
    pred = predict_next_season(seasons)
    trend = "stable"
    if len(seasons) >= 2:
        prev = calc_fantasy_score(seasons[-2])
        diff = fs - prev
        if diff > 3: trend = "rising"
        elif diff < -3: trend = "declining"
    recent = seasons[-3:] if len(seasons) >= 3 else seasons
    scores = [calc_fantasy_score(s) for s in recent]
    mean = sum(scores) / len(scores)
    variance = sum((x - mean) ** 2 for x in scores) / len(scores)
    consistency = max(0, round(100 - math.sqrt(variance) * 5, 1))
    return {"current_fs":round(fs,1),"projected_fs":pred.get("fantasy_score",0),"trend":trend,"consistency":consistency,"pts":latest.get("pts",0),"ast":latest.get("ast",0),"reb":latest.get("reb",0),"stl":latest.get("stl",0),"blk":latest.get("blk",0),"seasons_played":len(seasons)}

@router.get("/{player_a_id}/{player_b_id}")
async def analyze_trade(player_a_id: int, player_b_id: int):
    cache_key = f"trade:{min(player_a_id,player_b_id)}:{max(player_a_id,player_b_id)}"
    cached = await cache_get(cache_key)
    if cached: return cached
    career_a = get_career_stats(player_a_id)
    info_a = get_player_info(player_a_id)
    career_b = get_career_stats(player_b_id)
    info_b = get_player_info(player_b_id)
    val_a = value_score(career_a)
    val_b = value_score(career_b)
    score_a = val_a["current_fs"] * 0.4 + val_a["projected_fs"] * 0.4 + val_a["consistency"] * 0.2
    score_b = val_b["current_fs"] * 0.4 + val_b["projected_fs"] * 0.4 + val_b["consistency"] * 0.2
    diff = score_a - score_b
    if abs(diff) < 3:
        verdict = "EVEN TRADE"; recommendation = "This is a fair trade. Both players have similar value."; winner = "neither"
    elif diff > 0:
        verdict = "TRADE A WINS"; recommendation = f"You get the better end. Player A has {round(diff,1)} more composite value points."; winner = "a"
    else:
        verdict = "TRADE B WINS"; recommendation = f"You're giving up more than you get. Player B has {round(abs(diff),1)} more composite value points."; winner = "b"
    result = {"player_a":{"id":player_a_id,"position":info_a.get("position",""),**val_a},"player_b":{"id":player_b_id,"position":info_b.get("position",""),**val_b},"verdict":verdict,"recommendation":recommendation,"winner":winner,"score_a":round(score_a,1),"score_b":round(score_b,1)}
    await cache_set(cache_key, result, ttl=3600)
    return result
