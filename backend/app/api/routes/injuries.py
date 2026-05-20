from fastapi import APIRouter

router = APIRouter()

INJURIES = [
    {"id":203082, "name":"Joel Embiid",       "team":"PHI","status":"Out",        "injury":"Knee",      "return_est":"TBD",       "severity":"high"},
    {"id":203114, "name":"Khris Middleton",   "team":"MIL","status":"Out",        "injury":"Knee",      "return_est":"Season",    "severity":"high"},
    {"id":1628978,"name":"Lonzo Ball",        "team":"CHI","status":"Out",        "injury":"Knee",      "return_est":"TBD",       "severity":"high"},
    {"id":203500, "name":"Steven Adams",      "team":"MEM","status":"Out",        "injury":"Knee",      "return_est":"Season",    "severity":"high"},
    {"id":1629627,"name":"Zion Williamson",   "team":"NOP","status":"Out",        "injury":"Hamstring", "return_est":"2-3 weeks", "severity":"high"},
    {"id":1628384,"name":"OG Anunoby",        "team":"NYK","status":"Out",        "injury":"Elbow",     "return_est":"TBD",       "severity":"high"},
    {"id":1629029,"name":"Luka Doncic",       "team":"LAL","status":"Questionable","injury":"Ankle",    "return_est":"Game-time", "severity":"medium"},
    {"id":202331, "name":"Paul George",       "team":"PHI","status":"Questionable","injury":"Knee",     "return_est":"Game-time", "severity":"medium"},
    {"id":202710, "name":"Jimmy Butler",      "team":"MIA","status":"Questionable","injury":"Knee",     "return_est":"Game-time", "severity":"medium"},
    {"id":1627826,"name":"Ivica Zubac",       "team":"LAC","status":"Day-to-Day", "injury":"Ankle",     "return_est":"1-2 days",  "severity":"low"},
    {"id":1628960,"name":"Grayson Allen",     "team":"PHX","status":"Day-to-Day", "injury":"Hip",       "return_est":"2-3 days",  "severity":"low"},
]

@router.get("/")
async def get_injuries():
    return {"injuries": INJURIES, "total": len(INJURIES)}

@router.get("/check/{player_id}")
async def check_player_injury(player_id: int):
    injury = next((i for i in INJURIES if i["id"] == player_id), None)
    return {"injured": injury is not None, "details": injury}
