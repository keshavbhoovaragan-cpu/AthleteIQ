from fastapi import APIRouter

router = APIRouter()

@router.get("/{player_id}/report")
async def scouting_report(player_id: int, season: int = 2023):
    return {"player_id": player_id, "report": "Add your Anthropic API key to enable AI scouting reports.", "stats": {}}
