from fastapi import APIRouter
from app.services.watchlist import check_players

router = APIRouter()

MAX_PLAYERS = 10


@router.get("/check")
async def check(players: str):
    names = [n.strip() for n in players.split(",") if n.strip()][:MAX_PLAYERS]
    if not names:
        return {"alerts": []}
    return {"alerts": check_players(names)}
