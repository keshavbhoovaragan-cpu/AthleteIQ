"use client";
import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/nav/NavBar";
import PlayerSearch from "@/components/dashboard/PlayerSearch";
import PlayerCard from "@/components/dashboard/PlayerCard";
import { Player } from "@/types/player";

const FEATURES = [
  { label:"NBA Leaders",    href:"/nba",       icon:"🏀", color:"#60a5fa", desc:"Top 50 scorers, rebounders, assisters — current + all-time" },
  { label:"Rankings",       href:"/rankings",  icon:"🏆", color:"#fbbf24", desc:"Top 30 ranked by fantasy score with position filters" },
  { label:"Fantasy",        href:"/fantasy",   icon:"⚡", color:"#a78bfa", desc:"ESPN-style roster with real NBA position enforcement" },
  { label:"Streak Detector",href:"/streaks",   icon:"🔥", color:"#fb923c", desc:"Hot/cold streak detection with interactive score timeline" },
  { label:"Trade Analyzer", href:"/trades",    icon:"⇄",  color:"#34d399", desc:"Head-to-head trade evaluation with instant recommendation" },
  { label:"Draft Board",    href:"/draft",     icon:"📋", color:"#60a5fa", desc:"Draft rankings by value tier — build your own pick board" },
  { label:"Injury Report",  href:"/injuries",  icon:"🏥", color:"#f87171", desc:"2024-25 injury tracker — Out, Questionable, Day-to-Day" },
  { label:"Analytics",      href:"/analytics", icon:"📊", color:"#f472b6", desc:"SQLite z-scores and SQL position group breakdowns" },
  { label:"Compare",        href:"/compare",   icon:"⚖️", color:"#34d399", desc:"Radar charts and career trajectory head-to-head" },
];

const TICKER = [
  "Jokic 71.2 FS","SGA 68.4 FS","Giannis 67.1 FS","Wemby 65.8 FS",
  "Sabonis 63.2 FS","Luka 61.9 FS","AD 60.3 FS","LeBron 57.8 FS",
  "Haliburton 57.2 FS","Gobert 56.4 FS","Ant 55.9 FS","Trae 55.1 FS",
];

export default function Home() {
  const [sel, setSel] = useState<Player|null>(null);

  return (
    <main style={{minHeight:"100vh",background:"var(--bg)",overflow:"hidden"}}>
      <NavBar/>

      {/* Ambient glows */}
      <div style={{position:"fixed",width:800,height:800,top:"-10%",left:"5%",background:"#3b82f6",borderRadius:"50%",filter:"blur(120px)",zIndex:0,opacity:0.07,pointerEvents:"none"}}/>
      <div style={{position:"fixed",width:600,height:600,top:"40%",right:"-5%",background:"#8b5cf6",borderRadius:"50%",filter:"blur(100px)",zIndex:0,opacity:0.06,pointerEvents:"none"}}/>

      {/* Ticker */}
      <div style={{borderBottom:"1px solid var(--border)",background:"rgba(255,255,255,0.015)",overflow:"hidden",height:30,display:"flex",alignItems:"center",position:"relative",zIndex:2}}>
        <div style={{display:"flex",gap:48,animation:"ticker 28s linear infinite",whiteSpace:"nowrap",paddingLeft:"100%"}}>
          {[...TICKER,...TICKER].map((t,i)=>(
            <span key={i} style={{fontSize:10,fontWeight:700,color:"var(--text-dim)",letterSpacing:"0.06em"}}>
              <span style={{color:"var(--blue)",marginRight:6}}>◆</span>{t}
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      </div>

      <div style={{maxWidth:1000,margin:"0 auto",padding:"48px 24px",position:"relative",zIndex:1}}>
        {!sel ? (
          <>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:20,background:"rgba(96,165,250,0.07)",border:"1px solid rgba(96,165,250,0.14)",marginBottom:22}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e",display:"block"}}/>
                <span style={{fontSize:10,color:"rgba(96,165,250,0.9)",fontWeight:700,letterSpacing:"0.14em"}}>LIVE · 2024-25 NBA · 9 FEATURES</span>
              </div>
              <h1 style={{fontSize:"clamp(52px,7vw,76px)",fontWeight:900,lineHeight:0.92,marginBottom:18,letterSpacing:"-0.04em"}}>
                <span style={{display:"block",background:"linear-gradient(180deg,#fff 0%,rgba(255,255,255,0.45) 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>NBA</span>
                <span style={{display:"block",background:"linear-gradient(135deg,#60a5fa 0%,#a78bfa 45%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Intelligence.</span>
              </h1>
              <p style={{fontSize:15,color:"var(--text-muted)",maxWidth:460,margin:"0 auto 32px",lineHeight:1.8}}>
                Real-time career stats, fantasy intelligence, ML predictions, trade analysis, and SQL analytics.
              </p>
              <div style={{maxWidth:500,margin:"0 auto"}}>
                <PlayerSearch onSelect={setSel}/>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {FEATURES.map(f=>(
                <Link key={f.href} href={f.href} style={{textDecoration:"none"}}>
                  <div className="card" style={{padding:"20px",height:"100%",display:"flex",flexDirection:"column",gap:10,cursor:"pointer"}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=`${f.color}40`;(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLElement).style.boxShadow=`0 10px 40px ${f.color}0d`;}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)";(e.currentTarget as HTMLElement).style.transform="translateY(0)";(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span style={{fontSize:22}}>{f.icon}</span>
                      <span style={{fontSize:14,color:`${f.color}45`,fontWeight:700}}>→</span>
                    </div>
                    <div>
                      <div style={{color:"var(--text)",fontWeight:800,fontSize:13,marginBottom:4}}>{f.label}</div>
                      <div style={{color:"var(--text-muted)",fontSize:11,lineHeight:1.65}}>{f.desc}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{marginTop:32,display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
                {["Next.js 14","TypeScript","FastAPI","Python 3.11","SQLite","Redis","nba_api","Recharts","REST API","Z-Score Analysis"].map(t=>(
                  <span key={t} style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.25)",fontWeight:600,letterSpacing:"0.03em"}}>{t}</span>
                ))}
              </div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.1)",letterSpacing:"0.1em",fontWeight:700}}>BUILT BY KESHAV BHOOVARAGAN · FULL-STACK ENGINEER</div>
            </div>
          </>
        ):(
          <div>
            <button onClick={()=>setSel(null)} style={{background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer",fontSize:11,fontWeight:700,marginBottom:18,padding:0,letterSpacing:"0.06em"}}
              onMouseEnter={e=>(e.currentTarget.style.color="var(--text)")} onMouseLeave={e=>(e.currentTarget.style.color="var(--text-muted)")}>
              ← BACK
            </button>
            <PlayerCard player={sel}/>
          </div>
        )}
      </div>
    </main>
  );
}
