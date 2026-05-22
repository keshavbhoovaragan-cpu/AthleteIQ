"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/nav/NavBar";
import PageHeader from "@/components/ui/PageHeader";
import axios from "axios";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000" });
const STATUS_COLORS: Record<string,string> = {"Out":"#f87171","Questionable":"#fbbf24","Day-to-Day":"#34d399"};

export default function InjuriesPage() {
  const [injuries, setInjuries] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/injuries/").then(r=>setInjuries(r.data.injuries||[])).catch(()=>setInjuries([])).finally(()=>setLoading(false));
  }, []);

  const filtered = filter==="All" ? injuries : injuries.filter(i=>i.status===filter);
  const counts = ["Out","Questionable","Day-to-Day"].reduce((a,s)=>({...a,[s]:injuries.filter(i=>i.status===s).length}),{} as Record<string,number>);

  return (
    <main style={{minHeight:"100vh"}}>
      <NavBar/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"36px 24px",position:"relative",zIndex:1}}>
        <PageHeader eyebrow="2024-25 Season" title="Injury Report" titleGradient="red" subtitle="Live from SQLite database — Out, Questionable, Day-to-Day"/>
        <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
          {["All","Out","Questionable","Day-to-Day"].map(f=>(<button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 16px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",background:filter===f?(STATUS_COLORS[f]||"#f87171"):"var(--surface)",color:filter===f?"#000":"var(--text-muted)",border:filter===f?`1px solid ${STATUS_COLORS[f]||"#f87171"}`:"1px solid var(--border)",transition:"all 0.15s",fontFamily:"inherit"}}>
            {f}{f!=="All"&&counts[f]!==undefined&&<span style={{marginLeft:5,opacity:0.8}}>({counts[f]})</span>}
          </button>))}
        </div>
        {loading?(
          <div style={{display:"grid",gap:10}}>{Array.from({length:5}).map((_,i)=>(<div key={i} className="skeleton" style={{height:70,borderRadius:14}}/>))}</div>
        ):(
          <div style={{display:"grid",gap:10}}>
            {filtered.map((p,i)=>(
              <div key={`${p.id}-${i}`} style={{background:p.severity==="high"?"rgba(248,113,113,0.06)":p.severity==="medium"?"rgba(251,191,36,0.06)":"rgba(52,211,153,0.06)",border:`1px solid ${STATUS_COLORS[p.status]||"var(--border)"}25`,borderRadius:14,padding:"16px 20px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:44,height:33,objectFit:"cover",objectPosition:"top",borderRadius:8,border:"1px solid var(--border)",flexShrink:0}}/>
                <div style={{flex:1,minWidth:140}}>
                  <div style={{color:"var(--text)",fontWeight:700,fontSize:15,marginBottom:2}}>{p.name}</div>
                  <div style={{fontSize:11,color:"var(--text-dim)"}}>{p.team} · {p.pos}</div>
                </div>
                <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:9,color:"var(--text-dim)",letterSpacing:"0.08em",marginBottom:3}}>STATUS</div>
                    <span style={{fontSize:12,fontWeight:800,padding:"3px 10px",borderRadius:20,background:`${STATUS_COLORS[p.status]}20`,color:STATUS_COLORS[p.status],border:`1px solid ${STATUS_COLORS[p.status]}40`}}>{p.status}</span>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:9,color:"var(--text-dim)",letterSpacing:"0.08em",marginBottom:3}}>INJURY</div>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--text-muted)"}}>{p.injury}</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:9,color:"var(--text-dim)",letterSpacing:"0.08em",marginBottom:3}}>RETURN</div>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--text-muted)"}}>{p.return_est}</div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length===0&&<div style={{padding:"48px 20px",textAlign:"center",color:"var(--text-dim)"}}>No players with this status</div>}
          </div>
        )}
        <div style={{marginTop:20,padding:"12px 16px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,fontSize:11,color:"var(--text-dim)",textAlign:"center"}}>⚠ Data stored in SQLite · Always verify with official team reports</div>
      </div>
    </main>
  );
}
