import logging
from app.services.database import get_db
from app.services.nba_service import find_players, get_recent_games, calc_fantasy_score, safe_float, compute_streak_info

logger = logging.getLogger(__name__)


def _resolve_player(name: str) -> dict | None:
    matches = find_players(name)
    if not matches:
        return None
    exact = next((m for m in matches if m["full_name"].lower() == name.lower()), None)
    return exact or matches[0]


def check_players(names: list[str]) -> list[dict]:
    conn = get_db()
    alerts = []
    for name in names:
        resolved = _resolve_player(name)
        if not resolved:
            alerts.append({"player": name, "found": False, "injury": None, "streak": None})
            continue

        pid = resolved["id"]
        injury_row = conn.execute(
            "SELECT status, injury, return_est, severity FROM injuries WHERE player_id=?", (pid,)
        ).fetchone()
        season_row = conn.execute(
            "SELECT fantasy_score FROM season_stats WHERE player_id=? ORDER BY season DESC LIMIT 1", (pid,)
        ).fetchone()

        streak = None
        try:
            recent = get_recent_games(pid)
            games = recent.get("games", [])
            if games:
                baseline = safe_float(season_row["fantasy_score"]) if season_row else (
                    sum(calc_fantasy_score(g) for g in games) / len(games)
                )
                streak = compute_streak_info(games, baseline)
        except Exception as e:
            logger.warning(f"watchlist streak check failed for {name}: {e}")

        alerts.append({
            "player": resolved["full_name"],
            "id": pid,
            "found": True,
            "injury": dict(injury_row) if injury_row else None,
            "streak": streak,
        })
    conn.close()
    return alerts
