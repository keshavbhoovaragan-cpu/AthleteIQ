from fastapi import APIRouter
from app.core.cache import cache_get, cache_set
from app.services.nba_service import get_career_stats, calc_fantasy_score

router = APIRouter()

TOP_PLAYERS = [
    {"id":2544,   "first_name":"LeBron",      "last_name":"James",              "position":"F"},
    {"id":1628983,"first_name":"Shai",         "last_name":"Gilgeous-Alexander", "position":"G"},
    {"id":203999, "first_name":"Nikola",       "last_name":"Jokic",              "position":"C"},
    {"id":203507, "first_name":"Giannis",      "last_name":"Antetokounmpo",      "position":"F"},
    {"id":201939, "first_name":"Stephen",      "last_name":"Curry",              "position":"G"},
    {"id":1629029,"first_name":"Luka",         "last_name":"Doncic",             "position":"G-F"},
    {"id":1628369,"first_name":"Jayson",       "last_name":"Tatum",              "position":"F"},
    {"id":203076, "first_name":"Anthony",      "last_name":"Davis",              "position":"F-C"},
    {"id":1630162,"first_name":"Anthony",      "last_name":"Edwards",            "position":"G"},
    {"id":1641705,"first_name":"Victor",       "last_name":"Wembanyama",         "position":"C"},
    {"id":1630169,"first_name":"Tyrese",       "last_name":"Haliburton",         "position":"G"},
    {"id":1629027,"first_name":"Trae",         "last_name":"Young",              "position":"G"},
    {"id":1627734,"first_name":"Domantas",     "last_name":"Sabonis",            "position":"C"},
    {"id":1626164,"first_name":"Devin",        "last_name":"Booker",             "position":"G"},
    {"id":201142, "first_name":"Kevin",        "last_name":"Durant",             "position":"F"},
    {"id":203497, "first_name":"Rudy",         "last_name":"Gobert",             "position":"C"},
    {"id":1628991,"first_name":"Jaren",        "last_name":"Jackson Jr.",        "position":"F-C"},
    {"id":202695, "first_name":"Kawhi",        "last_name":"Leonard",            "position":"F"},
    {"id":203081, "first_name":"Damian",       "last_name":"Lillard",            "position":"G"},
    {"id":1626157,"first_name":"Karl-Anthony", "last_name":"Towns",              "position":"C"},
    {"id":1628389,"first_name":"Bam",          "last_name":"Adebayo",            "position":"C"},
    {"id":1628378,"first_name":"Donovan",      "last_name":"Mitchell",           "position":"G"},
    {"id":1630596,"first_name":"Evan",         "last_name":"Mobley",             "position":"F-C"},
    {"id":1630578,"first_name":"Alperen",      "last_name":"Sengun",             "position":"C"},
    {"id":1629636,"first_name":"Darius",       "last_name":"Garland",            "position":"G"},
    {"id":1628973,"first_name":"Jalen",        "last_name":"Brunson",            "position":"G"},
    {"id":1631094,"first_name":"Paolo",        "last_name":"Banchero",           "position":"F"},
    {"id":1630595,"first_name":"Cade",         "last_name":"Cunningham",         "position":"G"},
    {"id":1629651,"first_name":"Nic",          "last_name":"Claxton",            "position":"C"},
    {"id":1631117,"first_name":"Walker",       "last_name":"Kessler",            "position":"C"},
]

@router.get("/")
async def get_rankings():
    cache_key = "rankings:top30"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    results = []
    for p in TOP_PLAYERS:
        try:
            career = get_career_stats(p["id"])
            seasons = career.get("seasons", [])
            if not seasons:
                continue
            latest = seasons[-1]
            latest["fantasy_score"] = calc_fantasy_score(latest)
            results.append({**p,"team":latest.get("team","—"),"pts":latest.get("pts",0),"ast":latest.get("ast",0),"reb":latest.get("reb",0),"stl":latest.get("stl",0),"blk":latest.get("blk",0),"fg_pct":latest.get("fg_pct",0),"fantasy_score":latest.get("fantasy_score",0)})
        except:
            continue
    results.sort(key=lambda x: x["fantasy_score"], reverse=True)
    data = {"players": results}
    await cache_set(cache_key, data, ttl=7200)
    return data
