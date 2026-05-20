from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.services.rust_engine import score_players, benchmark, get_grade

router = APIRouter()

class PlayerInput(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    pts: float = 0
    ast: float = 0
    reb: float = 0
    stl: float = 0
    blk: float = 0
    fg_pct: float = 0
    ft_pct: Optional[float] = 0
    tov: Optional[float] = 0
    position: Optional[str] = None
    team: Optional[str] = None

@router.post("/score")
async def score(players: List[PlayerInput]):
    return {"players": score_players([p.dict() for p in players]), "engine": "rust"}

@router.get("/benchmark")
async def run_benchmark():
    return benchmark()

@router.get("/grade/{score}")
async def grade(score: float):
    return get_grade(score)
