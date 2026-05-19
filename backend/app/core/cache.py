import redis.asyncio as aioredis
from app.core.config import settings
import json
from typing import Any, Optional

redis_client = None

async def get_redis():
    global redis_client
    if redis_client is None:
        redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    return redis_client

async def cache_get(key: str) -> Optional[Any]:
    try:
        r = await get_redis()
        val = await r.get(key)
        return json.loads(val) if val else None
    except:
        return None

async def cache_set(key: str, value: Any, ttl: int = 300):
    try:
        r = await get_redis()
        await r.setex(key, ttl, json.dumps(value))
    except:
        pass
