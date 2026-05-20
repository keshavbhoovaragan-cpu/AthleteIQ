"use client";
import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/nav/NavBar";
import PlayerSearch from "@/components/dashboard/PlayerSearch";
import PlayerCard from "@/components/dashboard/PlayerCard";
import { Player } from "@/types/player";

const FEATURES = [
  { label:"NBA Leaders",    href:"/nba",       icon:"🏀", color:"#60a5fa", desc:"Top 50 scorers, assisters, rebounders — current + all-time" },
  { label:"Rankings",       href:"/rankings",  icon:"🏆", color:"#f59e0b", desc:"Top 30 players ranked by fantasy score, filter by position" },
  { label:"Fantasy",        href:"/fantasy",   icon:"⚡", color:"#a78bfa", desc:"ESPN-style position-locked roster with real NBA API enforcement" },
  { label:"Streak Detector",href:"/streaks",   icon:"🔥", color:"#f97316", desc:"Hot/cold streak analysis with fantasy score timeline chart" },
  { label:"Trade Analyzer", href:"/trades",    icon:"⇄",  color:"#22c55e", desc:"Compare two players, get a trade recommendation with stat breakdown" },
  { label:"Draft Board",    href:"/draft",     icon:"📋", color:"#60a5fa", desc:"Fantasy draft rankings with value tiers, trends, and pick board" },
  { label:"Injury Report",  href:"/injuries",  icon:"🏥", color:"#ef4444", desc:"Live injury tracker — Out, Questionable, Day-to-Day statuses" },
  { label:"Analytics",      href:"/analytics", icon:"📊", color:"#f472b6", desc:"SQLite-cached stats, z-score analysis, SQL position breakdowns" },
  { label:"Compare",        href:"/compare",   icon:"⚖️", color:"#34d399", desc:"Head-to-head radar charts and career trajectory comparison" },
];

const STACK = [
  {label:"Next.js 14",color:"#60a5fa"},{label:"TypeScript",color:"#60a5fa"},
  {label:"FastAPI",color:"#34d399"},{label:"Python 3.11",color:"#34d399"},
  {label:"SQLite",color:"#f59e0b"},{label:"Redis",color:"#f59e0b"},
  {label:"nba_api",color:"#a78bfa"},{label:"Recharts",color:"#a78bfa"},
  {label:"REST API",color:"#f472b6"},{label:"Z-Score Analysis",color:"#f472b6"},
];

export default function Home() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player|null>(null);
  return (
    <main style={{minHeight:"100vh",background:"#07070e",overflow:"hidden"}}>
      <NavBar/>
      <div style={{position:"fixed",top:"5%",left:"15%",width:700,height:700,background:"radial-gradient(circle,rgba(96,165,250,0.035) 0%,transparent 65%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"50%",right:"5%",width:500,height:500,background:"radial-gradient(circle,rgba(167,139,250,0.025) 0%,transparent 65%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{maxWidth:980,margin:"0 auto",padding:"48px 24px",position:"relative",zIndex:1}}>
        {!selectedPlayer ? (
          <>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 16px",borderRadius:20,background:"rgba(96,165,250,0.07)",border:"1px solid rgba(96,165,250,0.12)",marginBottom:24}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 5px #22c55e"}}/>
                <span style={{fontSize:10,color:"rgba(96,165,250,0.85)",fontWeight:700,letterSpacing:"0.12em"}}>LIVE NBA DATA · 2024-25 · 9 FEATURES</span>
              </div>
              <h1 style={{fontSize:60,fontWeight:900,lineHeight:1.0,marginBottom:16,letterSpacing:"-0.035em"}}>
                <span style={{background:"linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.65) 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",display:"block"}}>NBA Intelligence</span>
                <span style={{background:"linear-gradient(135deg,#60a5fa 0%,#a78bfa 45%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",display:"block"}}>Platform.</span>
              </h1>
              <p style={{fontSize:15,color:"rgba(255,255,255,0.3)",maxWidth:540,margin:"0 auto 36px",lineHeight:1.8}}>Career stats, fantasy intelligence, ML predictions, trade analysis, streak detection, injury tracking, SQL analytics — powered by live NBA data.</p>
              <PlayerSearch onSelect={setSelectedPlayer}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
              {FEATURES.map(f=>(
                <Link key={f.href} href={f.href} style={{display:"block",textDecoration:"none",background:"linear-gradient(135deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.01) 100%)",border:"1px solid rgba(255,255,255,0.055)",borderRadius:14,padding:"18px 20px",transition:"all 0.18s",position:"relative",overflow:"hidden"}}
                  onMouseEnter={e=>{(e.currentTarget.style.borderColor=`${f.color}35`);(e.currentTarget.style.transform="translateY(-2px)");(e.currentTarget.style.boxShadow=`0 8px 32px ${f.color}08`);}}
                  onMouseLeave={e=>{(e.currentTarget.style.borderColor="rgba(255,255,255,0.055)");(e.currentTarget.style.transform="translateY(0)");(e.currentTarget.style.boxShadow="none");}}>
                  <div style={{fontSize:22,marginBottom:9}}>{f.icon}</div>
                  <div style={{color:"#fff",fontWeight:800,fontSize:14,marginBottom:6}}>{f.label}</div>
                  <div style={{color:"rgba(255,255,255,0.25)",fontSize:11,lineHeight:1.6}}>{f.desc}</div>
                  <div style={{position:"absolute",bottom:14,right:14,color:`${f.color}40`,fontSize:14}}>→</div>
                </Link>
              ))}
            </div>
            <div style={{marginTop:28,display:"flex",justifyContent:"center",gap:7,flexWrap:"wrap"}}>
              {STACK.map(t=>(<span key={t.label} style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:`${t.color}07`,border:`1px solid ${t.color}15`,color:`${t.color}65`,fontWeight:700,letterSpacing:"0.05em"}}>{t.label}</span>))}
            </div>
            <div style={{marginTop:20,textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.1)",letterSpacing:"0.06em"}}>BUILT BY KESHAV BHOOVARAGAN · FULL-STACK ENGINEER · INFO RISK MANAGEMENT</div>
          </>
        ):(
          <div>
            <button onClick={()=>setSelectedPlayer(null)} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:"rgba(255,255,255,0.25)",cursor:"pointer",fontSize:11,fontWeight:700,marginBottom:20,padding:0,letterSpacing:"0.06em"}} onMouseEnter={e=>(e.currentTarget.style.color="#fff")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.25)")}>← BACK TO SEARCH</button>
            <PlayerCard player={selectedPlayer}/>
          </div>
        )}
      </div>
    </main>
  );
}
