from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RegisterRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(body: RegisterRequest):
    return {"message": "Registration coming soon"}

@router.post("/login")
async def login():
    return {"message": "Login coming soon"}
