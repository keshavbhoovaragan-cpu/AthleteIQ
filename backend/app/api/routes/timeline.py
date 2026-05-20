from fastapi import APIRouter
from app.services.nba_service import get_career_stats, calc_fantasy_score, get_player_info
from app.core.cache import cache_get, cache_set

router = APIRouter()

@router.get("/{player_id}")
async def get_timeline(player_id: int):
    cache_key = f"timeline:{player_id}"
    cached = await cache_get(cache_key)
    if cached: return cached
    career = get_career_stats(player_id)
    info = get_player_info(player_id)
    seasons = career.get("seasons", [])
    timeline = []
    for s in seasons:
        fs = calc_fantasy_score(s)
        timeline.append({"season":s["season"],"team":s["team"],"gp":s["gp"],"pts":s["pts"],"ast":s["ast"],"reb":s["reb"],"stl":s["stl"],"blk":s["blk"],"fg_pct":s["fg_pct"],"fantasy_score":round(fs,1)})
    peak = max(timeline, key=lambda x: x["fantasy_score"]) if timeline else None
    avgs = {k:round(sum(s[k] for s in timeline)/len(timeline),1) for k in ["pts","ast","reb","stl","blk","fantasy_score"]} if timeline else {}
    result = {"timeline":timeline,"peak_season":peak,"career_averages":avgs,"position":info.get("position",""),"total_seasons":len(timeline)}
    await cache_set(cache_key, result, ttl=3600)
    return result
