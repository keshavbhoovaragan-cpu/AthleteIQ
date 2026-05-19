from fastapi import APIRouter, HTTPException
from app.services.nba_service import find_players, get_career_stats, get_recent_games, calc_fantasy_score, predict_next_season, get_player_info
from app.core.cache import cache_get, cache_set

router = APIRouter()

@router.get("/search")
async def search(name: str):
    if not name or len(name)<2: raise HTTPException(status_code=400, detail="Name too short")
    return {"data": find_players(name)}

@router.get("/{player_id}/career")
async def career(player_id: int):
    cache_key = f"career:{player_id}"
    cached = await cache_get(cache_key)
    if cached: return cached
    data = get_career_stats(player_id)
    seasons = data.get("seasons",[])
    for s in seasons: s['fantasy_score'] = calc_fantasy_score(s)
    prediction = predict_next_season(seasons)
    info = get_player_info(player_id)
    result = {"seasons":seasons,"prediction":prediction,"total_seasons":len(seasons),"position":info.get("position",""),"jersey":info.get("jersey","")}
    await cache_set(cache_key, result, ttl=3600)
    return result

@router.get("/{player_id}/recent")
async def recent(player_id: int):
    cache_key = f"recent:{player_id}"
    cached = await cache_get(cache_key)
    if cached: return cached
    data = get_recent_games(player_id)
    for g in data.get("games",[]): g['fantasy_score'] = calc_fantasy_score(g)
    await cache_set(cache_key, data, ttl=900)
    return data
