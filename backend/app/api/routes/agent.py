from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_agent import ask, _client

router = APIRouter()


class HistoryMessage(BaseModel):
    role: str
    content: str


class AskRequest(BaseModel):
    question: str
    season: str = "2024-25"
    history: list[HistoryMessage] = []


@router.post("/ask")
async def ask_agent(req: AskRequest):
    if not req.question or not req.question.strip():
        return {"error": "question is required"}
    history = [m.model_dump() for m in req.history]
    return ask(req.question.strip(), req.season, history)


@router.get("/status")
async def agent_status():
    return {"configured": _client() is not None}
