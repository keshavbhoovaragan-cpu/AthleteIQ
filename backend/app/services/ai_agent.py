import os, logging
from urllib.parse import quote
from app.services.database import get_db

logger = logging.getLogger(__name__)

MODEL = "claude-sonnet-5"
MAX_HISTORY_MESSAGES = 8  # last 4 user/assistant turns, keeps token usage bounded


# Every path the agent is allowed to send someone to — built here, server-side,
# from a fixed allowlist. The model only ever supplies a page name + player
# names; it never controls the raw path, so it can't be steered into sending
# someone to an arbitrary URL.
def _build_path(page: str, player_a: str | None, player_b: str | None) -> str | None:
    a = quote(player_a) if player_a else None
    b = quote(player_b) if player_b else None
    if page == "compare":
        return f"/compare?a={a}&b={b}" if a and b else "/compare" if a is None and b is None else None
    if page == "trades":
        return f"/trades?give={a}&receive={b}" if a and b else "/trades" if a is None and b is None else None
    if page == "streaks":
        return f"/streaks?player={a}" if a else "/streaks"
    if page in {"rankings", "injuries", "draft", "fantasy", "analytics", "nba"}:
        return f"/{page}"
    return None


def _validate_name(name: str | None, roster: set[str]) -> str | None:
    """Only let a name through to a navigation link if it's an exact match
    (case-insensitive) for a real player in our data. If the model hallucinates
    or mangles a name, drop it rather than send the user to a broken deep link."""
    if not name:
        return None
    lower = {r.lower(): r for r in roster}
    return lower.get(name.strip().lower())


NAVIGATE_TOOL = {
    "name": "go_to_page",
    "description": (
        "Take the user directly to a page in the AthleteIQ app instead of just describing where "
        "to look. Call this whenever the question maps naturally to one of these pages — e.g. "
        "'compare X and Y' -> compare, 'should I trade X for Y' -> trades, 'is X hot right now' -> "
        "streaks, 'who's injured' -> injuries, 'best players' -> rankings, 'draft board' -> draft, "
        "'build my roster' -> fantasy, 'leaderboards/z-scores' -> analytics, 'season stat leaders' "
        "-> nba. Always also answer the question in your normal text response."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "page": {
                "type": "string",
                "enum": ["compare", "trades", "streaks", "rankings", "injuries", "draft", "fantasy", "analytics", "nba"],
            },
            "player_a": {"type": "string", "description": "Exact player name from the roster below, if a specific player is relevant"},
            "player_b": {"type": "string", "description": "A second exact player name, for compare (player B) or trades (the player received)"},
        },
        "required": ["page"],
    },
}


def _client():
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        return None
    try:
        import anthropic
        return anthropic.Anthropic(api_key=key)
    except ImportError:
        logger.warning("anthropic package not installed; AI agent running in fallback mode")
        return None


def _build_context(season: str) -> tuple[str, set[str]]:
    """Returns (context text, set of exact roster names). Includes stats for
    the FULL roster, not just a top-N slice — a partial roster means the model
    has real data for some players and nothing for others, which is exactly
    the setup that invites it to fall back on training-data guesses for the
    ones missing from context. Keeping the whole (small) roster in context
    closes that gap."""
    conn = get_db()
    all_players = conn.execute("""
        SELECT p.name, p.position, ss.team, ss.pts, ss.ast, ss.reb, ss.stl, ss.blk,
               ss.fg_pct, ss.fantasy_score
        FROM season_stats ss JOIN players p ON p.id = ss.player_id
        WHERE ss.season = ? ORDER BY ss.fantasy_score DESC
    """, (season,)).fetchall()
    injuries = conn.execute("SELECT name, status, injury, return_est FROM injuries LIMIT 20").fetchall()
    conn.close()

    roster_names = {r["name"] for r in all_players}

    lines = [f"Full roster with stats, {season} season (sorted by fantasy score — this is ALL the data you have, there is no one else):"]
    for r in all_players:
        lines.append(
            f"- {r['name']} ({r['position']}, {r['team']}): {r['pts']} pts, {r['ast']} ast, "
            f"{r['reb']} reb, {r['stl']} stl, {r['blk']} blk, {r['fg_pct']} FG%, "
            f"fantasy score {r['fantasy_score']}"
        )
    if injuries:
        lines.append("\nCurrent injury report:")
        for r in injuries:
            lines.append(f"- {r['name']}: {r['status']} — {r['injury']} (return: {r['return_est'] or 'unknown'})")
            roster_names.add(r["name"])
    return "\n".join(lines), roster_names


def _fallback_answer(question: str, season: str) -> dict:
    conn = get_db()
    top = conn.execute("""
        SELECT p.name, ss.fantasy_score FROM season_stats ss
        JOIN players p ON p.id = ss.player_id
        WHERE ss.season = ? ORDER BY ss.fantasy_score DESC LIMIT 5
    """, (season,)).fetchall()
    conn.close()
    names = ", ".join(f"{r['name']} ({r['fantasy_score']})" for r in top) or "no data for this season"
    return {
        "answer": (
            "AI agent isn't configured (no ANTHROPIC_API_KEY set on the backend), so here's a "
            f"data-only answer instead of an outage: top 5 fantasy players in {season} are "
            f"{names}. Set ANTHROPIC_API_KEY to get full natural-language answers and page "
            "navigation for questions like this one."
        ),
        "navigate": None,
        "source": "fallback",
    }


def ask(question: str, season: str = "2024-25", history: list[dict] | None = None) -> dict:
    client = _client()
    if not client:
        return _fallback_answer(question, season)

    context, roster_names = _build_context(season)
    try:
        clean_history = [
            {"role": m["role"], "content": m["content"]}
            for m in (history or [])
            if isinstance(m, dict) and m.get("role") in ("user", "assistant") and isinstance(m.get("content"), str)
        ][-MAX_HISTORY_MESSAGES:]

        messages = clean_history + [{"role": "user", "content": question}]

        msg = client.messages.create(
            model=MODEL,
            max_tokens=600,
            system=(
                "You are the AthleteIQ fantasy basketball assistant. Answer using ONLY the roster "
                "and injury data provided below — it is the complete dataset, not a sample. Do not "
                "use outside/training-data knowledge about players, stats, trades, or injuries not "
                "listed here, even if you recognize the player — if someone isn't in the roster "
                "below, say plainly that you don't have their data instead of guessing from memory. "
                "Predictions (e.g. next-season projections) are model estimates, not certainties — "
                "phrase them that way. Be concise and cite fantasy scores/stats when relevant.\n\n"
                + context
            ),
            tools=[NAVIGATE_TOOL],
            messages=messages,
        )

        text = "\n".join(
            block.text.strip() for block in msg.content
            if getattr(block, "type", "") == "text" and block.text.strip()
        )

        navigate = None
        for block in msg.content:
            if getattr(block, "type", "") == "tool_use" and block.name == "go_to_page":
                player_a = _validate_name(block.input.get("player_a"), roster_names)
                player_b = _validate_name(block.input.get("player_b"), roster_names)
                navigate = _build_path(block.input.get("page"), player_a, player_b)
                break

        return {"answer": text or "Here you go.", "navigate": navigate, "source": "claude"}
    except Exception as e:
        logger.warning(f"AI agent call failed, falling back: {e}")
        return _fallback_answer(question, season)
