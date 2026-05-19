"use client";
import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/nav/NavBar";
import PlayerSearch from "@/components/dashboard/PlayerSearch";
import PlayerCard from "@/components/dashboard/PlayerCard";
import { Player } from "@/types/player";

const FEATURES = [
  { label:"NBA Leaders",  href:"/nba",      icon:"🏀", desc:"Top 50 scoring, assists, rebounds, steals & blocks — 2024-25 + all-time" },
  { label:"Rankings",     href:"/rankings", icon:"🏆", desc:"Top 30 players ranked by fantasy score — live from NBA.com" },
  { label:"Fantasy",      href:"/fantasy",  icon:"⚡", desc:"ESPN-style roster with position enforcement, draft values & projections" },
  { label:"Compare",      href:"/compare",  icon:"⚖️", desc:"Head-to-head radar charts and stat battles between any two players" },
];

export default function Home() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player|null>(null);
  return (
    <main style={{minHeight:"100vh",background:"#07070e"}}>
      <NavBar/>
      <div style={{position:"fixed",top:"10%",left:"20%",width:600,height:600,background:"radial-gradient(circle,rgba(96,165,250,0.04) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"40%",right:"10%",width:500,height:500,background:"radial-gradient(circle,rgba(167,139,250,0.03) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{maxWidth:920,margin:"0 auto",padding:"56px 24px 40px",position:"relative",zIndex:1}}>
        {!selectedPlayer ? (
          <>
            <div style={{textAlign:"center",marginBottom:52}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:"rgba(96,165,250,0.08)",border:"1px solid rgba(96,165,250,0.15)",marginBottom:24}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}}/>
                <span style={{fontSize:11,color:"rgba(96,165,250,0.9)",fontWeight:700,letterSpacing:"0.1em"}}>LIVE NBA DATA · 2024-25 SEASON</span>
              </div>
              <h1 style={{fontSize:60,fontWeight:900,lineHeight:1.05,marginBottom:20,letterSpacing:"-0.03em"}}>
                <span style={{background:"linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.7) 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>NBA Intelligence</span>
                <br/>
                <span style={{background:"linear-gradient(135deg,#60a5fa 0%,#a78bfa 50%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Reimagined.</span>
              </h1>
              <p style={{fontSize:17,color:"rgba(255,255,255,0.35)",maxWidth:520,margin:"0 auto 36px",lineHeight:1.7}}>
                Career stats, fantasy intelligence, ML predictions, and player comparisons — powered by live NBA data.
              </p>
              <PlayerSearch onSelect={setSelectedPlayer}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
              {FEATURES.map(f=>(
                <Link key={f.href} href={f.href} style={{display:"block",textDecoration:"none",background:"linear-gradient(135deg,rgba(255,255,255,0.035) 0%,rgba(255,255,255,0.015) 100%)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"24px 26px",transition:"all 0.2s",position:"relative",overflow:"hidden"}}
                  onMouseEnter={e=>{(e.currentTarget.style.borderColor="rgba(96,165,250,0.2)");(e.currentTarget.style.transform="translateY(-2px)");}}
                  onMouseLeave={e=>{(e.currentTarget.style.borderColor="rgba(255,255,255,0.06)");(e.currentTarget.style.transform="translateY(0)");}}>
                  <div style={{fontSize:28,marginBottom:12}}>{f.icon}</div>
                  <div style={{color:"#fff",fontWeight:800,fontSize:17,marginBottom:8,letterSpacing:"-0.01em"}}>{f.label}</div>
                  <div style={{color:"rgba(255,255,255,0.3)",fontSize:13,lineHeight:1.6}}>{f.desc}</div>
                  <div style={{position:"absolute",bottom:20,right:20,color:"rgba(255,255,255,0.15)",fontSize:18}}>→</div>
                </Link>
              ))}
            </div>
            <div style={{marginTop:40,display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
              {["Next.js 14","FastAPI","Python 3.11","TypeScript","Redis","nba_api","Recharts"].map(t=>(
                <span key={t} style={{fontSize:11,padding:"4px 12px",borderRadius:20,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.25)",fontWeight:600,letterSpacing:"0.05em"}}>{t}</span>
              ))}
            </div>
          </>
        ):(
          <div>
            <button onClick={()=>setSelectedPlayer(null)} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:20,padding:0}}
              onMouseEnter={e=>(e.currentTarget.style.color="#fff")}
              onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.3)")}>
              ← Back to search
            </button>
            <PlayerCard player={selectedPlayer}/>
          </div>
        )}
      </div>
    </main>
  );
}
