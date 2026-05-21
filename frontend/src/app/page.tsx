"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "@/components/nav/NavBar";
import PlayerSearch from "@/components/dashboard/PlayerSearch";
import PlayerCard from "@/components/dashboard/PlayerCard";
import { Player } from "@/types/player";

const FEATURES = [
  { label:"NBA Leaders",    href:"/nba",       icon:"🏀", color:"#60a5fa", desc:"Top 50 scorers, rebounders, assisters — current + all-time" },
  { label:"Rankings",       href:"/rankings",  icon:"🏆", color:"#fbbf24", desc:"Top 30 ranked by fantasy score with position filters" },
  { label:"Fantasy",        href:"/fantasy",   icon:"⚡", color:"#a78bfa", desc:"ESPN-style roster with real NBA position enforcement" },
  { label:"Streak Detector",href:"/streaks",   icon:"🔥", color:"#fb923c", desc:"Hot/cold detection with interactive score timeline" },
  { label:"Trade Analyzer", href:"/trades",    icon:"⇄",  color:"#34d399", desc:"Head-to-head trade evaluation with instant recommendation" },
  { label:"Draft Board",    href:"/draft",     icon:"📋", color:"#818cf8", desc:"Draft rankings by value tier — build your pick board" },
  { label:"Injury Report",  href:"/injuries",  icon:"🏥", color:"#f87171", desc:"2024-25 injury tracker — Out, Questionable, Day-to-Day" },
  { label:"Analytics",      href:"/analytics", icon:"📊", color:"#f472b6", desc:"SQLite z-score analysis and SQL position breakdowns" },
  { label:"Compare",        href:"/compare",   icon:"⚖️", color:"#34d399", desc:"Radar charts and career trajectory head-to-head" },
];

const TICKER_ITEMS = [
  {name:"Nikola Jokic",   fs:"71.2",grade:"S",color:"#a78bfa"},
  {name:"SGA",            fs:"68.4",grade:"S",color:"#a78bfa"},
  {name:"Giannis",        fs:"67.1",grade:"S",color:"#a78bfa"},
  {name:"Wembanyama",     fs:"65.8",grade:"S",color:"#a78bfa"},
  {name:"Sabonis",        fs:"63.2",grade:"S",color:"#a78bfa"},
  {name:"Luka Doncic",    fs:"61.9",grade:"S",color:"#a78bfa"},
  {name:"Anthony Davis",  fs:"60.3",grade:"S",color:"#a78bfa"},
  {name:"LeBron James",   fs:"57.8",grade:"A",color:"#22c55e"},
  {name:"Haliburton",     fs:"57.2",grade:"A",color:"#22c55e"},
  {name:"Rudy Gobert",    fs:"56.4",grade:"A",color:"#22c55e"},
  {name:"Ant Edwards",    fs:"55.9",grade:"A",color:"#22c55e"},
  {name:"Trae Young",     fs:"55.1",grade:"A",color:"#22c55e"},
];

const STACK = [
  {label:"Next.js 14",color:"#60a5fa"},{label:"TypeScript",color:"#60a5fa"},
  {label:"FastAPI",color:"#34d399"},{label:"Python 3.11",color:"#34d399"},
  {label:"Rust",color:"#fb923c"},{label:"SQLite",color:"#fbbf24"},
  {label:"Redis",color:"#fbbf24"},{label:"nba_api",color:"#a78bfa"},
  {label:"Recharts",color:"#a78bfa"},{label:"Bash",color:"#f472b6"},
];

export default function Home() {
  const [sel, setSel] = useState<Player|null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(()=>setMounted(true),[]);

  return (
    <main style={{minHeight:"100vh",background:"var(--bg)",overflow:"hidden"}}>
      <NavBar/>
      <div className="orb" style={{width:900,height:900,top:"-20%",left:"-5%",background:"radial-gradient(circle,rgba(59,130,246,0.18) 0%,transparent 65%)",filter:"blur(40px)"}}/>
      <div className="orb" style={{width:700,height:700,top:"30%",right:"-10%",background:"radial-gradient(circle,rgba(139,92,246,0.14) 0%,transparent 65%)",filter:"blur(40px)"}}/>
      <div className="orb" style={{width:500,height:500,bottom:"0%",left:"30%",background:"radial-gradient(circle,rgba(236,72,153,0.1) 0%,transparent 65%)",filter:"blur(40px)"}}/>

      {/* Ticker */}
      <div style={{borderBottom:"1px solid var(--border)",background:"rgba(255,255,255,0.012)",overflow:"hidden",height:34,display:"flex",alignItems:"center",position:"relative",zIndex:2}}>
        <div style={{display:"flex",gap:0,animation:"ticker 35s linear infinite",whiteSpace:"nowrap",paddingLeft:"100%",alignItems:"center"}}>
          {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i)=>(
            <span key={i} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"0 28px",borderRight:"1px solid var(--border)"}}>
              <span style={{fontSize:10,color:"var(--text-dim)",fontWeight:600}}>{t.name}</span>
              <span style={{fontSize:11,fontWeight:800,color:t.color}}>{t.fs}</span>
              <span style={{fontSize:9,fontWeight:800,padding:"1px 5px",borderRadius:4,background:`${t.color}18`,color:t.color,border:`1px solid ${t.color}30`}}>{t.grade}</span>
            </span>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1020,margin:"0 auto",padding:"56px 24px 48px",position:"relative",zIndex:1}}>
        {!sel ? (
          <>
            <div style={{textAlign:"center",marginBottom:56}}>
              <div className={mounted?"fade-up":""} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:"rgba(96,165,250,0.07)",border:"1px solid rgba(96,165,250,0.14)",marginBottom:28,boxShadow:"0 0 20px rgba(96,165,250,0.08)"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"block",animation:"pulse-glow 2s infinite"}}/>
                <span style={{fontSize:10,color:"rgba(96,165,250,0.85)",fontWeight:700,letterSpacing:"0.14em"}}>LIVE · 2024-25 NBA · 9 FEATURES · RUST ENGINE</span>
              </div>
              <h1 className={mounted?"fade-up-2":""} style={{letterSpacing:"-0.045em",lineHeight:0.9,marginBottom:20}}>
                <span style={{display:"block",fontSize:"clamp(56px,8vw,88px)",fontWeight:900,background:"linear-gradient(180deg,#fff 0%,rgba(255,255,255,0.5) 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>NBA</span>
                <span style={{display:"block",fontSize:"clamp(56px,8vw,88px)",fontWeight:900}} className="shine-text">Intelligence.</span>
              </h1>
              <p className={mounted?"fade-up-3":""} style={{fontSize:16,color:"var(--text-muted)",maxWidth:460,margin:"0 auto 36px",lineHeight:1.8}}>
                Real-time stats, fantasy intelligence, trade analysis, streak detection, and SQL analytics — powered by live NBA.com data and a Rust engine processing <strong style={{color:"var(--text)"}}>1B calculations/sec</strong>.
              </p>
              <div style={{maxWidth:520,margin:"0 auto"}}>
                <PlayerSearch onSelect={setSel}/>
              </div>
            </div>

            {/* Stats strip */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:40,background:"var(--border)",borderRadius:12,overflow:"hidden",border:"1px solid var(--border)"}}>
              {[
                {label:"Players in database",value:"4,500+",color:"var(--blue)"},
                {label:"Rust engine speed",  value:"1B/sec", color:"var(--orange)"},
                {label:"Career history",      value:"78 yrs", color:"var(--purple)"},
                {label:"Features",            value:"9",      color:"var(--pink)"},
              ].map(({label,value,color})=>(
                <div key={label} style={{background:"var(--bg)",padding:"18px 20px",textAlign:"center"}}>
                  <div style={{fontSize:24,fontWeight:900,color,letterSpacing:"-0.02em",marginBottom:4,lineHeight:1}}>{value}</div>
                  <div style={{fontSize:11,color:"var(--text-dim)",letterSpacing:"0.04em"}}>{label}</div>
                </div>
              ))}
            </div>

            {/* Feature grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:36}}>
              {FEATURES.map((f,i)=>(
                <Link key={f.href} href={f.href} style={{textDecoration:"none"}}>
                  <div className="card" style={{padding:"20px 22px",cursor:"pointer",height:"100%",display:"flex",flexDirection:"column",gap:12}}
                    onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=`${f.color}45`;el.style.transform="translateY(-3px)";el.style.boxShadow=`inset 0 1px 0 rgba(255,255,255,0.1), 0 12px 40px ${f.color}12`;}}
                    onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="var(--border)";el.style.transform="translateY(0)";el.style.boxShadow="inset 0 1px 0 rgba(255,255,255,0.06)";}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                      <span style={{fontSize:24,lineHeight:1}}>{f.icon}</span>
                      <span style={{fontSize:11,color:`${f.color}55`,fontWeight:700,marginTop:4}}>→</span>
                    </div>
                    <div>
                      <div style={{color:"var(--text)",fontWeight:800,fontSize:14,marginBottom:5,letterSpacing:"-0.01em"}}>{f.label}</div>
                      <div style={{color:"var(--text-muted)",fontSize:12,lineHeight:1.65}}>{f.desc}</div>
                    </div>
                    <div style={{height:1,background:`linear-gradient(90deg,${f.color}30,transparent)`,marginTop:"auto"}}/>
                  </div>
                </Link>
              ))}
            </div>

            {/* Stack */}
            <div style={{display:"flex",flexDirection:"column",gap:14,alignItems:"center"}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
                {STACK.map(t=>(<span key={t.label} style={{fontSize:10,padding:"4px 11px",borderRadius:20,background:`${t.color}08`,border:`1px solid ${t.color}18`,color:`${t.color}70`,fontWeight:700,letterSpacing:"0.05em"}}>{t.label}</span>))}
              </div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.1)",letterSpacing:"0.12em",fontWeight:700}}>BUILT BY KESHAV BHOOVARAGAN · FULL-STACK ENGINEER · INFO RISK MANAGEMENT</div>
            </div>
          </>
        ):(
          <div>
            <button onClick={()=>setSel(null)} style={{background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer",fontSize:11,fontWeight:700,marginBottom:20,padding:0,letterSpacing:"0.07em",transition:"color 0.15s"}}
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
