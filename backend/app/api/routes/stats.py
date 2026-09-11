from fastapi import APIRouter
from app.services.nba_service import get_career_stats, predict_next_season

router = APIRouter()

@router.get("/{player_id}/predict")
async def predict(player_id: int):
    try:
        data = get_career_stats(player_id)
    except Exception:
        data = {"seasons": []}
    seasons = data.get("seasons", [])
    prediction = predict_next_season(seasons)
    return {"player_id": player_id, "prediction": prediction}
