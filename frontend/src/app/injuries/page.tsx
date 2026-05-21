"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";

const INJURIES = [
  {id:203082, name:"Joel Embiid",       team:"PHI",pos:"C",  status:"Out",        injury:"Knee",      return_est:"TBD",       severity:"high"},
  {id:203114, name:"Khris Middleton",   team:"MIL",pos:"F",  status:"Out",        injury:"Knee",      return_est:"Season",    severity:"high"},
  {id:1628978,name:"Lonzo Ball",        team:"CHI",pos:"G",  status:"Out",        injury:"Knee",      return_est:"TBD",       severity:"high"},
  {id:203500, name:"Steven Adams",      team:"MEM",pos:"C",  status:"Out",        injury:"Knee",      return_est:"Season",    severity:"high"},
  {id:1629627,name:"Zion Williamson",   team:"NOP",pos:"F",  status:"Out",        injury:"Hamstring", return_est:"2-3 weeks", severity:"high"},
  {id:1628384,name:"OG Anunoby",        team:"NYK",pos:"F",  status:"Out",        injury:"Elbow",     return_est:"TBD",       severity:"high"},
  {id:1629029,name:"Luka Doncic",       team:"LAL",pos:"G-F",status:"Questionable",injury:"Ankle",    return_est:"Game-time", severity:"medium"},
  {id:202331, name:"Paul George",       team:"PHI",pos:"F",  status:"Questionable",injury:"Knee",     return_est:"Game-time", severity:"medium"},
  {id:202710, name:"Jimmy Butler",      team:"MIA",pos:"F",  status:"Questionable",injury:"Knee",     return_est:"Game-time", severity:"medium"},
  {id:1629028,name:"Deandre Ayton",     team:"POR",pos:"C",  status:"Questionable",injury:"Back",     return_est:"Game-time", severity:"medium"},
  {id:1627826,name:"Ivica Zubac",       team:"LAC",pos:"C",  status:"Day-to-Day", injury:"Ankle",     return_est:"1-2 days",  severity:"low"},
  {id:1628960,name:"Grayson Allen",     team:"PHX",pos:"G",  status:"Day-to-Day", injury:"Hip",       return_est:"2-3 days",  severity:"low"},
];

const STATUS_COLORS: Record<string,string> = {"Out":"#ef4444","Questionable":"#f59e0b","Day-to-Day":"#22c55e"};

export default function InjuriesPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All","Out","Questionable","Day-to-Day"];
  const filtered = filter==="All"?INJURIES:INJURIES.filter(i=>i.status===filter);

  return (
    <main style={{minHeight:"100vh",background:"transparent"}}>
      <NavBar/>
      <div style={{position:"fixed",top:"15%",left:"5%",width:400,height:400,background:"radial-gradient(circle,rgba(239,68,68,0.03) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:10,color:"rgba(239,68,68,0.6)",letterSpacing:"0.2em",fontWeight:700,marginBottom:6}}>2024-25 SEASON</div>
          <h1 style={{fontSize:34,fontWeight:900,lineHeight:1,letterSpacing:"-0.02em",marginBottom:6,background:"linear-gradient(135deg,#ef4444 0%,#f97316 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Injury Report</h1>
          <p style={{color:"rgba(255,255,255,0.28)",fontSize:13}}>2024-25 NBA injury tracker · Flag injured players on your fantasy roster</p>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
          {filters.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 16px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",background:filter===f?(STATUS_COLORS[f]||"#ef4444"):"rgba(255,255,255,0.04)",color:filter===f?"#fff":"rgba(255,255,255,0.4)",border:filter===f?`1px solid ${STATUS_COLORS[f]||"#ef4444"}`:"1px solid rgba(255,255,255,0.07)",transition:"all 0.15s"}}>
              {f}{f!=="All"&&<span style={{marginLeft:4,opacity:0.7}}>({INJURIES.filter(i=>i.status===f).length})</span>}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gap:10}}>
          {filtered.map((p,i)=>(
            <div key={`${p.id}-${i}`} style={{background:p.severity==="high"?"rgba(239,68,68,0.06)":p.severity==="medium"?"rgba(245,158,11,0.06)":"rgba(34,197,94,0.06)",border:`1px solid ${STATUS_COLORS[p.status]}20`,borderRadius:14,padding:"16px 20px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
              <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:44,height:33,objectFit:"cover",objectPosition:"top",borderRadius:8,border:"1px solid rgba(255,255,255,0.07)",flexShrink:0}}/>
              <div style={{flex:1,minWidth:140}}>
                <div style={{color:"#fff",fontWeight:700,fontSize:15,marginBottom:2}}>{p.name}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{p.team} · {p.pos}</div>
              </div>
              <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.08em",marginBottom:3}}>STATUS</div>
                  <span style={{fontSize:12,fontWeight:800,padding:"3px 10px",borderRadius:20,background:`${STATUS_COLORS[p.status]}20`,color:STATUS_COLORS[p.status],border:`1px solid ${STATUS_COLORS[p.status]}40`}}>{p.status}</span>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.08em",marginBottom:3}}>INJURY</div>
                  <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.7)"}}>{p.injury}</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.08em",marginBottom:3}}>RETURN</div>
                  <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.7)"}}>{p.return_est}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:20,padding:"14px 18px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,fontSize:11,color:"rgba(255,255,255,0.2)",textAlign:"center"}}>⚠ Always verify with official team reports before lineup decisions</div>
      </div>
    </main>
  );
}
