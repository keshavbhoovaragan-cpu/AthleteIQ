from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://athleteiq:athleteiq@localhost:5432/athleteiq"
    REDIS_URL: str = "redis://localhost:6379"
    BALLDONTLIE_API_KEY: str = "b6973a01-63fd-4638-9c22-7516f3188f37"
    ANTHROPIC_API_KEY: str = "your_anthropic_key_here"
    SECRET_KEY: str = "c0e4fb73b15d68701573e9584ad34a4940176153627e3f143b5bb1f69a5aa9e4"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]

    class Config:
        env_file = ".env"

settings = Settings()
