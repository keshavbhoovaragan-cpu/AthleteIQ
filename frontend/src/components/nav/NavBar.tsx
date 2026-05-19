"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label:"Home",     href:"/" },
  { label:"NBA",      href:"/nba" },
  { label:"Rankings", href:"/rankings" },
  { label:"Fantasy",  href:"/fantasy" },
  { label:"Compare",  href:"/compare" },
];

export default function NavBar() {
  const path = usePathname();
  return (
    <header style={{borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"0 28px",display:"flex",alignItems:"center",height:58,background:"rgba(7,7,14,0.95)",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:50}}>
      <Link href="/" style={{fontSize:19,fontWeight:900,textDecoration:"none",marginRight:40,background:"linear-gradient(135deg,#60a5fa 0%,#a78bfa 60%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.02em"}}>
        AthleteIQ
      </Link>
      <nav style={{display:"flex",gap:2,flex:1}}>
        {NAV.map(n=>{
          const active=path===n.href;
          return(
            <Link key={n.href} href={n.href} style={{padding:"6px 14px",borderRadius:8,fontSize:13,fontWeight:600,color:active?"#fff":"rgba(255,255,255,0.4)",textDecoration:"none",background:active?"rgba(96,165,250,0.1)":"transparent",border:active?"1px solid rgba(96,165,250,0.2)":"1px solid transparent",transition:"all 0.15s",letterSpacing:"0.01em"}}
              onMouseEnter={e=>{if(!active){(e.target as HTMLElement).style.color="#fff";(e.target as HTMLElement).style.background="rgba(255,255,255,0.05)";}}}
              onMouseLeave={e=>{if(!active){(e.target as HTMLElement).style.color="rgba(255,255,255,0.4)";(e.target as HTMLElement).style.background="transparent";}}}>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e"}}/>
        <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:"0.05em"}}>LIVE</span>
      </div>
    </header>
  );
}
