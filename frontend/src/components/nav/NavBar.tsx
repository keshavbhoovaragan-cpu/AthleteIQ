"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label:"Home",      href:"/" },
  { label:"NBA",       href:"/nba" },
  { label:"Rankings",  href:"/rankings" },
  { label:"Fantasy",   href:"/fantasy" },
  { label:"Streaks",   href:"/streaks" },
  { label:"Trades",    href:"/trades" },
  { label:"Draft",     href:"/draft" },
  { label:"Injuries",  href:"/injuries" },
  { label:"Analytics", href:"/analytics" },
  { label:"Compare",   href:"/compare" },
];

export default function NavBar() {
  const path = usePathname();
  return (
    <header style={{borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"0 20px",display:"flex",alignItems:"center",height:54,background:"rgba(7,7,14,0.97)",backdropFilter:"blur(24px)",position:"sticky",top:0,zIndex:50}}>
      <Link href="/" style={{fontSize:17,fontWeight:900,textDecoration:"none",marginRight:24,background:"linear-gradient(135deg,#60a5fa 0%,#a78bfa 55%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.03em",flexShrink:0}}>AthleteIQ</Link>
      <nav style={{display:"flex",gap:1,flex:1,overflowX:"auto",scrollbarWidth:"none" as any}}>
        {NAV.map(n=>{
          const active=path===n.href;
          return(
            <Link key={n.href} href={n.href} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,color:active?"#fff":"rgba(255,255,255,0.35)",textDecoration:"none",background:active?"rgba(96,165,250,0.1)":"transparent",border:active?"1px solid rgba(96,165,250,0.18)":"1px solid transparent",transition:"all 0.12s",whiteSpace:"nowrap",flexShrink:0}}
              onMouseEnter={e=>{if(!active){(e.target as HTMLElement).style.color="#fff";(e.target as HTMLElement).style.background="rgba(255,255,255,0.05)";}}}
              onMouseLeave={e=>{if(!active){(e.target as HTMLElement).style.color="rgba(255,255,255,0.35)";(e.target as HTMLElement).style.background="transparent";}}}>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:8}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}}/>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontWeight:700,letterSpacing:"0.1em"}}>LIVE</span>
      </div>
    </header>
  );
}
