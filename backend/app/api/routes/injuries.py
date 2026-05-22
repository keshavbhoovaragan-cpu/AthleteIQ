from fastapi import APIRouter
from app.services.database import get_db

router = APIRouter()

@router.get("/")
async def get_injuries():
    conn = get_db()
    rows = conn.execute("""
        SELECT player_id as id, name, team, position as pos, status, injury, return_est, severity
        FROM injuries ORDER BY
            CASE severity WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
            CASE status WHEN 'Out' THEN 1 WHEN 'Questionable' THEN 2 ELSE 3 END
    """).fetchall()
    conn.close()
    return {"injuries": [dict(r) for r in rows], "total": len(rows)}

@router.get("/check/{player_id}")
async def check_injury(player_id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM injuries WHERE player_id=?", (player_id,)).fetchone()
    conn.close()
    return {"injured": row is not None, "details": dict(row) if row else None}
