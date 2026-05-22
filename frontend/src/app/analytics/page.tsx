"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/nav/NavBar";
import axios from "axios";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000" });

export default function AnalyticsPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"leaderboard"|"positions">("leaderboard");

  useEffect(()=>{
    Promise.all([
      api.get("/api/analytics/leaderboard").then(r=>setPlayers(r.data.players||[])),
      api.get("/api/analytics/position-breakdown").then(r=>setGroups(r.data.groups||[])),
    ]).finally(()=>setLoading(false));
  },[]);

  const fsColor=(s:number)=>s>=60?"#a78bfa":s>=50?"#22c55e":s>=40?"#f59e0b":"#ef4444";
  const fsGrade=(s:number)=>s>=60?"S":s>=50?"A":s>=40?"B":s>=30?"C":"D";
  const maxFS = players.length ? Math.max(...players.map(p=>p.fantasy_score)) : 1;

  return (
    <main style={{minHeight:"100vh",background:"transparent"}}>
      <NavBar/>
      <div style={{position:"fixed",top:"15%",right:"10%",width:500,height:500,background:"radial-gradient(circle,rgba(167,139,250,0.04) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{maxWidth:1080,margin:"0 auto",padding:"40px 24px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:32}}>
          <div style={{fontSize:10,color:"rgba(167,139,250,0.6)",letterSpacing:"0.2em",fontWeight:700,marginBottom:6}}>SQLITE · PYTHON STATS · Z-SCORES</div>
          <h1 style={{fontSize:34,fontWeight:900,lineHeight:1,letterSpacing:"-0.02em",marginBottom:6,background:"linear-gradient(135deg,#a78bfa 0%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Analytics Engine</h1>
          <p style={{color:"rgba(255,255,255,0.28)",fontSize:13}}>SQLite-cached stats · Statistical z-scores · Position group aggregations</p>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>
          {["Python 3.11","FastAPI","SQLite","Z-Score Analysis","SQL GROUP BY","REST API"].map(t=>(
            <span key={t} style={{fontSize:10,padding:"4px 10px",borderRadius:20,background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.15)",color:"rgba(167,139,250,0.7)",fontWeight:700,letterSpacing:"0.05em"}}>{t}</span>
          ))}
        </div>
        <div style={{display:"flex",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:3,marginBottom:24,width:"fit-content"}}>
          {([["leaderboard","📊 Leaderboard"],["positions","🏀 By Position"]] as const).map(([v,label])=>(
            <button key={v} onClick={()=>setTab(v)} style={{padding:"8px 20px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",background:tab===v?"rgba(167,139,250,0.12)":"transparent",color:tab===v?"#a78bfa":"rgba(255,255,255,0.3)",border:"none",letterSpacing:"0.03em"}}>{label}</button>
          ))}
        </div>
        {loading?(
          <div style={{textAlign:"center",padding:80,color:"rgba(255,255,255,0.2)"}}>
            <div style={{fontSize:14,marginBottom:6}}>Loading from SQLite cache...</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.12)"}}>First load fetches live from NBA.com — may take 30s</div>
          </div>
        ):tab==="leaderboard"?(
          <div style={{background:"linear-gradient(180deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.015) 100%)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,overflow:"hidden"}}>
            <div style={{padding:"14px 22px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.015)"}}>
              <span style={{fontWeight:700,fontSize:13}}>Fantasy Leaderboard</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:"0.05em"}}>CACHED IN SQLITE · Z-SCORES COMPUTED IN PYTHON</span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                {["#","PLAYER","POS","PTS","AST","REB","FANTASY","GRADE","Z-SCORE","PERCENTILE","BAR"].map(h=>(
                  <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,color:"rgba(255,255,255,0.18)",fontWeight:700,letterSpacing:"0.1em"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {players.map((p,i)=>(
                  <tr key={p.player_id} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}
                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.012)")}
                    onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                    <td style={{padding:"12px 14px",fontWeight:700,fontSize:13,color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#cd7c4c":"rgba(255,255,255,0.2)"}}>{i+1}</td>
                    <td style={{padding:"12px 14px"}}><div style={{display:"flex",alignItems:"center",gap:9}}><img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.player_id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:34,height:25,objectFit:"cover",objectPosition:"top",borderRadius:7}}/><span style={{color:"#fff",fontWeight:700,fontSize:13}}>{p.name}</span></div></td>
                    <td style={{padding:"12px 14px"}}><span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.06)",fontWeight:600}}>{p.position}</span></td>
                    <td style={{padding:"12px 14px",fontSize:13,color:"rgba(255,255,255,0.7)"}}>{p.pts}</td>
                    <td style={{padding:"12px 14px",fontSize:13,color:"rgba(255,255,255,0.7)"}}>{p.ast}</td>
                    <td style={{padding:"12px 14px",fontSize:13,color:"rgba(255,255,255,0.7)"}}>{p.reb}</td>
                    <td style={{padding:"12px 14px",fontWeight:800,fontSize:14,color:fsColor(p.fantasy_score)}}>{p.fantasy_score}</td>
                    <td style={{padding:"12px 14px",fontWeight:900,fontSize:14,color:fsColor(p.fantasy_score)}}>{fsGrade(p.fantasy_score)}</td>
                    <td style={{padding:"12px 14px"}}><span style={{fontSize:12,fontWeight:700,color:p.z_score>1?"#22c55e":p.z_score>0?"#60a5fa":p.z_score<-1?"#ef4444":"rgba(255,255,255,0.4)"}}>{p.z_score>0?"+":""}{p.z_score}σ</span></td>
                    <td style={{padding:"12px 14px"}}><span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)"}}>{p.percentile}th</span></td>
                    <td style={{padding:"12px 14px",minWidth:100}}>
                      <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:2,width:`${(p.fantasy_score/maxFS)*100}%`,background:`linear-gradient(90deg,${fsColor(p.fantasy_score)},${fsColor(p.fantasy_score)}88)`}}/>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {groups.map((g:any)=>(
              <div key={g.pos_group} style={{background:"linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:"22px 24px"}}>
                <div style={{fontSize:18,fontWeight:900,marginBottom:4,background:"linear-gradient(135deg,#a78bfa,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{g.pos_group}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginBottom:20}}>{g.count} players · SQL GROUP BY</div>
                {[["Avg PTS",g.avg_pts],["Avg AST",g.avg_ast],["Avg REB",g.avg_reb],["Avg Fantasy",g.avg_fs]].map(([label,val])=>(
                  <div key={label as string} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>{label}</span>
                    <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
