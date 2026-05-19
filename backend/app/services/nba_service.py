import time
import math
from nba_api.stats.endpoints import playercareerstats, playergamelog, commonplayerinfo
from nba_api.stats.static import players

def find_players(name: str) -> list:
    results = [p for p in players.get_players() if name.lower() in p['full_name'].lower()][:10]
    return [{"id":p['id'],"first_name":p['first_name'],"last_name":p['last_name'],"full_name":p['full_name'],"is_active":p['is_active'],"position":""} for p in results]

def get_player_info(player_id: int) -> dict:
    try:
        time.sleep(0.3)
        info = commonplayerinfo.CommonPlayerInfo(player_id=player_id, timeout=10)
        df = info.get_data_frames()[0]
        if df.empty:
            return {}
        row = df.iloc[0]
        pos = str(row.get('POSITION', '') or '')
        jersey = str(row.get('JERSEY', '') or '')
        team = str(row.get('TEAM_ABBREVIATION', '') or '')
        return {"position": pos, "jersey": jersey, "team": team}
    except:
        return {}

def safe_float(val, default=0.0):
    try:
        f = float(val) if val is not None else default
        return default if (math.isnan(f) or math.isinf(f)) else f
    except:
        return default

def get_career_stats(player_id: int) -> dict:
    time.sleep(0.6)
    career = playercareerstats.PlayerCareerStats(player_id=player_id, timeout=15)
    df = career.get_data_frames()[0]
    if df.empty:
        return {"seasons": []}
    seasons = []
    for _, row in df.iterrows():
        gp = safe_float(row.get('GP', 0))
        if not gp:
            continue
        seasons.append({
            "season": str(row.get('SEASON_ID', '')),
            "team": str(row.get('TEAM_ABBREVIATION', '')),
            "gp": int(gp),
            "pts": round(safe_float(row.get('PTS', 0)) / gp, 1),
            "ast": round(safe_float(row.get('AST', 0)) / gp, 1),
            "reb": round(safe_float(row.get('REB', 0)) / gp, 1),
            "stl": round(safe_float(row.get('STL', 0)) / gp, 1),
            "blk": round(safe_float(row.get('BLK', 0)) / gp, 1),
            "fg_pct": round(safe_float(row.get('FG_PCT', 0)), 3),
            "fg3_pct": round(safe_float(row.get('FG3_PCT', 0)), 3),
            "ft_pct": round(safe_float(row.get('FT_PCT', 0)), 3),
            "min": round(safe_float(row.get('MIN', 0)) / gp, 1),
            "tov": round(safe_float(row.get('TOV', 0)) / gp, 1) if 'TOV' in row else 0,
        })
    return {"seasons": seasons}

def get_recent_games(player_id: int, season: str = "2024-25") -> dict:
    time.sleep(0.6)
    logs = playergamelog.PlayerGameLog(player_id=player_id, season=season, timeout=15)
    df = logs.get_data_frames()[0]
    if df.empty:
        return {"games": []}
    games = []
    for _, row in df.head(10).iterrows():
        games.append({
            "date": str(row.get('GAME_DATE', '')),
            "matchup": str(row.get('MATCHUP', '')),
            "wl": str(row.get('WL', '')),
            "pts": int(safe_float(row.get('PTS', 0))),
            "ast": int(safe_float(row.get('AST', 0))),
            "reb": int(safe_float(row.get('REB', 0))),
            "stl": int(safe_float(row.get('STL', 0))),
            "blk": int(safe_float(row.get('BLK', 0))),
            "fg_pct": round(safe_float(row.get('FG_PCT', 0)), 3),
            "min": str(row.get('MIN', '0')),
        })
    return {"games": games}

def calc_fantasy_score(s: dict) -> float:
    score = (safe_float(s.get('pts',0))*1.0 + safe_float(s.get('ast',0))*1.5 +
             safe_float(s.get('reb',0))*1.2 + safe_float(s.get('stl',0))*3.0 +
             safe_float(s.get('blk',0))*3.0 + safe_float(s.get('fg_pct',0))*10 +
             safe_float(s.get('ft_pct',0))*5 - safe_float(s.get('tov',0))*1.0)
    return round(min(safe_float(score), 99.9), 1)

def predict_next_season(seasons: list) -> dict:
    if len(seasons) < 2:
        return {}
    recent = seasons[-3:] if len(seasons) >= 3 else seasons
    weights = list(range(1, len(recent) + 1))
    def wavg(key):
        vals = [safe_float(s.get(key, 0)) * w for s, w in zip(recent, weights)]
        return round(sum(vals) / sum(weights), 1)
    pred = {k: wavg(k) for k in ['pts','ast','reb','stl','blk','fg_pct','ft_pct','tov']}
    pred['fantasy_score'] = calc_fantasy_score(pred)
    pred['confidence'] = 'high' if len(seasons) >= 5 else 'medium'
    return pred
