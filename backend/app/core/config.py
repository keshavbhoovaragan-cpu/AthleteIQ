import os

class Settings:
    API_TITLE: str = "AthleteIQ API"
    API_VERSION: str = "3.0.0"
    REDIS_URL: str = os.environ.get("REDIS_URL", "redis://localhost:6379")
    RUST_BINARY: str = os.environ.get("RUST_BINARY", "")
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "https://*.vercel.app",
        os.environ.get("FRONTEND_URL", ""),
    ]

settings = Settings()
