from fastapi import APIRouter, HTTPException
from app.services.nba_service import find_players, get_career_stats, get_recent_games, calc_fantasy_score, predict_next_season, get_player_info, safe_float
from app.services.database import get_db
from app.core.cache import cache_get, cache_set

router = APIRouter()

@router.get("/search")
async def search(name: str):
    if not name or len(name) < 2:
        raise HTTPException(status_code=400, detail="Name must be at least 2 characters")
    results = find_players(name)
    return {"data": results}

@router.get("/{player_id}/career")
async def career(player_id: int):
    cache_key = f"career:{player_id}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    conn = get_db()
    db_seasons = conn.execute("""
        SELECT ss.*, p.name, p.position
        FROM season_stats ss JOIN players p ON p.id = ss.player_id
        WHERE ss.player_id = ? ORDER BY ss.season ASC
    """, (player_id,)).fetchall()
    player_row = conn.execute("SELECT * FROM players WHERE id=?", (player_id,)).fetchone()
    conn.close()

    if db_seasons:
        seasons = []
        for row in db_seasons:
            s = dict(row)
            s["fantasy_score"] = safe_float(s.get("fantasy_score")) or calc_fantasy_score(s)
            seasons.append(s)
        prediction = predict_next_season(seasons)
        position = player_row["position"] if player_row else ""
        result = {"seasons": seasons, "prediction": prediction,
                  "total_seasons": len(seasons), "position": position, "jersey": "", "source": "sqlite"}
        await cache_set(cache_key, result, ttl=3600)
        return result

    try:
        data = get_career_stats(player_id)
        seasons = data.get("seasons", [])
        for s in seasons:
            s['fantasy_score'] = calc_fantasy_score(s)
        prediction = predict_next_season(seasons)
        info = get_player_info(player_id)
        result = {"seasons": seasons, "prediction": prediction,
                  "total_seasons": len(seasons), "position": info.get("position",""),
                  "jersey": info.get("jersey",""), "source": "nba_api"}
        await cache_set(cache_key, result, ttl=3600)
        return result
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Could not fetch player data: {str(e)}")

@router.get("/{player_id}/recent")
async def recent(player_id: int):
    cache_key = f"recent:{player_id}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    try:
        data = get_recent_games(player_id)
        for g in data.get("games", []):
            g['fantasy_score'] = calc_fantasy_score(g)
        await cache_set(cache_key, data, ttl=900)
        return data
    except Exception as e:
        return {"games": [], "error": str(e)}
