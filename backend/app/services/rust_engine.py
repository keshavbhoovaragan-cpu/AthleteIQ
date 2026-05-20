"""
rust_engine.py — Python bridge to the Rust fantasy scoring binary.
Falls back to pure Python if the binary isn't compiled yet.
"""
import subprocess, json, os, logging, math
from typing import List, Dict, Any

logger = logging.getLogger(__name__)
BINARY = os.path.abspath(os.path.join(os.path.dirname(__file__),
    "../../../../rust-engine/target/release/fantasy-engine"))

def _python_fallback(players):
    def score(p):
        s = (p.get("pts",0)*1.0 + p.get("ast",0)*1.5 + p.get("reb",0)*1.2 +
             p.get("stl",0)*3.0 + p.get("blk",0)*3.0 + p.get("fg_pct",0)*10 +
             p.get("ft_pct",0)*5 - p.get("tov",0)*1.0)
        return round(min(max(s,0),99.9),1)
    def grade(s): return "S" if s>=60 else "A" if s>=50 else "B" if s>=40 else "C" if s>=30 else "D"
    def tier(s): return "Elite" if s>=60 else "Star" if s>=50 else "Solid" if s>=40 else "Depth" if s>=28 else "Streamer"
    scored = sorted([(score(p),p) for p in players], key=lambda x: x[0], reverse=True)
    scores = [s for s,_ in scored]
    mean = sum(scores)/len(scores) if scores else 0
    std = math.sqrt(sum((x-mean)**2 for x in scores)/len(scores)) if scores else 1
    return [{**p,"fantasy_score":fs,"grade":grade(fs),"tier":tier(fs),"rank":i+1,
             "percentile":round(len([s for s in scores if s<=fs])/len(scores)*100),
             "z_score":round((fs-mean)/std,2) if std else 0}
            for i,(fs,p) in enumerate(scored)]

def score_players(players):
    if not players: return []
    if not os.path.exists(BINARY):
        logger.info("Rust binary not found — Python fallback. Run: cd rust-engine && cargo build --release")
        return _python_fallback(players)
    try:
        result = subprocess.run([BINARY], input=json.dumps(players),
            capture_output=True, text=True, timeout=10)
        if result.returncode != 0:
            return _python_fallback(players)
        return json.loads(result.stdout)
    except Exception as e:
        logger.warning(f"Rust engine failed ({e}) — Python fallback")
        return _python_fallback(players)

def benchmark():
    if not os.path.exists(BINARY):
        return {"error":"Rust binary not compiled","hint":"cd rust-engine && cargo build --release"}
    r = subprocess.run([BINARY,"--benchmark"], capture_output=True, text=True)
    return {"output":r.stderr.strip(),"binary":BINARY}

def get_grade(score):
    if os.path.exists(BINARY):
        r = subprocess.run([BINARY,"--grade",str(score)], capture_output=True, text=True)
        if r.returncode==0: return json.loads(r.stdout)
    def grade(s): return "S" if s>=60 else "A" if s>=50 else "B" if s>=40 else "C" if s>=30 else "D"
    def tier(s): return "Elite" if s>=60 else "Star" if s>=50 else "Solid" if s>=40 else "Depth" if s>=28 else "Streamer"
    return {"score":score,"grade":grade(score),"tier":tier(score)}
