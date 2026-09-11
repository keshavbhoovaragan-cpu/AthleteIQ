"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { getWatchlist } from "@/lib/watchlist";

const NAV = [
  {label:"Home",href:"/"},{label:"NBA",href:"/nba"},
  {label:"Rankings",href:"/rankings"},{label:"Fantasy",href:"/fantasy"},
  {label:"Streaks",href:"/streaks"},{label:"Trades",href:"/trades"},
  {label:"Draft",href:"/draft"},{label:"Injuries",href:"/injuries"},
  {label:"Analytics",href:"/analytics"},{label:"Compare",href:"/compare"},
];

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000" });

type ApiStatus = "checking" | "up" | "down";

export default function NavBar() {
  const path = usePathname();
  const [status, setStatus] = useState<ApiStatus>("checking");
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const check = () => {
      api.get("/api/health", { timeout: 6000 })
        .then(() => { if (!cancelled) setStatus("up"); })
        .catch(() => { if (!cancelled) setStatus("down"); });
    };
    check();
    const interval = setInterval(check, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const checkWatchlist = () => {
      const players = getWatchlist();
      if (players.length === 0) { setAlertCount(0); return; }
      api.get("/api/watchlist/check", { params: { players: players.join(",") }, timeout: 8000 })
        .then((r) => {
          if (cancelled) return;
          const alerts = r.data?.alerts || [];
          const active = alerts.filter((a: any) => a.injury || (a.streak && a.streak.streak_label !== "➡️ Neutral")).length;
          setAlertCount(active);
        })
        .catch(() => {});
    };
    checkWatchlist();
    const interval = setInterval(checkWatchlist, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const dotColor = status === "up" ? "#22c55e" : status === "down" ? "#ef4444" : "rgba(255,255,255,0.25)";
  const label = status === "up" ? "LIVE" : status === "down" ? "OFFLINE" : "CHECKING";

  return (
    <>
      <header style={{height:50,display:"flex",alignItems:"center",padding:"0 20px",background:"rgba(5,5,8,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"sticky",top:0,zIndex:50}}>
        <Link href="/" style={{fontSize:15,fontWeight:900,textDecoration:"none",marginRight:24,flexShrink:0,background:"linear-gradient(135deg,#60a5fa,#a78bfa,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.04em"}}>AthleteIQ</Link>
        <nav style={{display:"flex",gap:0,flex:1,overflowX:"auto",scrollbarWidth:"none" as any}}>
          {NAV.map(n=>{
            const a=path===n.href;
            return(
              <Link key={n.href} href={n.href} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,color:a?"#fff":"rgba(255,255,255,0.35)",textDecoration:"none",whiteSpace:"nowrap",flexShrink:0,background:a?"rgba(96,165,250,0.12)":"transparent",border:a?"1px solid rgba(96,165,250,0.2)":"1px solid transparent",transition:"all 0.12s"}}
                onMouseEnter={e=>{if(!a){(e.target as HTMLElement).style.color="#fff";(e.target as HTMLElement).style.background="rgba(255,255,255,0.05)";}}}
                onMouseLeave={e=>{if(!a){(e.target as HTMLElement).style.color="rgba(255,255,255,0.35)";(e.target as HTMLElement).style.background="transparent";}}}>
                {n.label}
              </Link>
            );
          })}
          <Link href="/watchlist" style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,color:path==="/watchlist"?"#fff":"rgba(255,255,255,0.35)",textDecoration:"none",whiteSpace:"nowrap",flexShrink:0,background:path==="/watchlist"?"rgba(96,165,250,0.12)":"transparent",border:path==="/watchlist"?"1px solid rgba(96,165,250,0.2)":"1px solid transparent",transition:"all 0.12s",display:"flex",alignItems:"center",gap:5}}>
            Watchlist
            {alertCount > 0 && (
              <span style={{background:"#ef4444",color:"#fff",borderRadius:10,fontSize:9,fontWeight:800,padding:"1px 6px",lineHeight:1.4}}>{alertCount}</span>
            )}
          </Link>
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}} title={status === "down" ? "Backend API is unreachable" : undefined}>
          <span style={{width:5,height:5,borderRadius:"50%",background:dotColor,boxShadow:status==="up"?`0 0 8px ${dotColor}`:"none",display:"block"}}/>
          <span style={{fontSize:9,color:status==="down"?"rgba(239,68,68,0.7)":"rgba(255,255,255,0.18)",fontWeight:700,letterSpacing:"0.12em"}}>{label}</span>
        </div>
      </header>
      {status === "down" && (
        <div style={{background:"rgba(239,68,68,0.1)",borderBottom:"1px solid rgba(239,68,68,0.25)",padding:"6px 20px",textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.6)",position:"sticky",top:50,zIndex:49}}>
          Backend API is currently unreachable — pages will show empty or stale data until it's back up.
        </div>
      )}
    </>
  );
}
