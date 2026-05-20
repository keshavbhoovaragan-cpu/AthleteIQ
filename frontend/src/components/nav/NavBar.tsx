"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {label:"Home",href:"/"},{label:"NBA",href:"/nba"},
  {label:"Rankings",href:"/rankings"},{label:"Fantasy",href:"/fantasy"},
  {label:"Streaks",href:"/streaks"},{label:"Trades",href:"/trades"},
  {label:"Draft",href:"/draft"},{label:"Injuries",href:"/injuries"},
  {label:"Analytics",href:"/analytics"},{label:"Compare",href:"/compare"},
];

export default function NavBar() {
  const path = usePathname();
  return (
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
      </nav>
      <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
        <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e",display:"block"}}/>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.18)",fontWeight:700,letterSpacing:"0.12em"}}>LIVE</span>
      </div>
    </header>
  );
}
