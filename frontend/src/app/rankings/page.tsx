"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/nav/NavBar";
import PageHeader from "@/components/ui/PageHeader";
import axios from "axios";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000" });
const SEASONS = ["2024-25","2023-24","2022-23","2021-22","2020-21"];
const POS_GROUPS = ["All","G","F","C","G-F","F-C"];
const SORT_OPTS = [{value:"fantasy_score",label:"Fantasy Score"},{value:"pts",label:"Points"},{value:"ast",label:"Assists"},{value:"reb",label:"Rebounds"},{value:"stl",label:"Steals"},{value:"blk",label:"Blocks"}];

export default function RankingsPage() {
  const [season, setSeason] = useState("2024-25");
  const [posFilter, setPosFilter] = useState("All");
  const [sortBy, setSortBy] = useState("fantasy_score");
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/api/rankings/", { params: { season, pos: posFilter } })
      .then(r => setPlayers(r.data.players || []))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, [season, posFilter]);

  const fsColor=(s:number)=>s>=60?"#a78bfa":s>=50?"#22c55e":s>=40?"#f59e0b":"#f87171";
  const fsGrade=(s:number)=>s>=60?"S":s>=50?"A":s>=40?"B":s>=30?"C":"D";
  const sorted=[...players].sort((a,b)=>(b[sortBy]||0)-(a[sortBy]||0));
  const maxFS=sorted.length?Math.max(...sorted.map(p=>p.fantasy_score||0)):1;

  return (
    <main style={{minHeight:"100vh"}}>
      <NavBar/>
      <div style={{maxWidth:1060,margin:"0 auto",padding:"36px 24px",position:"relative",zIndex:1}}>
        <PageHeader eyebrow="Fantasy Rankings" title="Player Rankings" titleGradient="warm" subtitle="Live from SQLite database — switch seasons, filter by position, sort by any stat"/>
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:10,color:"var(--text-dim)",fontWeight:700,letterSpacing:"0.1em",marginRight:4}}>SEASON</span>
          {SEASONS.map(s=>(<button key={s} onClick={()=>setSeason(s)} style={{padding:"5px 14px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",background:season===s?"#f59e0b":"var(--surface)",color:season===s?"#000":"var(--text-muted)",border:season===s?"1px solid #f59e0b":"1px solid var(--border)",transition:"all 0.15s",fontFamily:"inherit",boxShadow:season===s?"0 0 12px rgba(245,158,11,0.3)":"none"}}>
            {s}{s==="2024-25"&&<span style={{marginLeft:5,fontSize:9,padding:"1px 4px",borderRadius:3,background:"rgba(34,197,94,0.2)",color:"#22c55e",fontWeight:800}}>LIVE</span>}
          </button>))}
        </div>
        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {POS_GROUPS.map(g=>(<button key={g} onClick={()=>setPosFilter(g)} className={posFilter===g?"pill active":"pill"}>{g}</button>))}
          </div>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{marginLeft:"auto",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 12px",color:"var(--text)",fontSize:11,cursor:"pointer",fontFamily:"inherit",outline:"none"}}>
            {SORT_OPTS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.06)"}}>
          <div className="table-header">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontWeight:700,fontSize:13}}>{season} Rankings</span>
              {loading?<span style={{fontSize:11,color:"var(--text-dim)"}}>· loading...</span>:<span style={{fontSize:11,color:"var(--text-dim)"}}>· {sorted.length} players</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}}/>
              <span style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.06em"}}>SQLITE DATABASE</span>
            </div>
          </div>
          {loading?(
            <div style={{padding:"20px 0"}}>
              {Array.from({length:8}).map((_,i)=>(<div key={i} style={{display:"grid",gridTemplateColumns:"40px 50px 1fr 120px",gap:16,padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                {[30,44,undefined,80].map((w,j)=>(<div key={j} className="skeleton" style={{height:14,width:w||"80%"}}/>))}
              </div>))}
            </div>
          ):(
            <table className="data-table">
              <thead><tr>{["#","PLAYER","POS","TEAM","PTS","AST","REB","STL","BLK","FG%","FANTASY","GRD"].map(h=>(<th key={h}>{h}</th>))}</tr></thead>
              <tbody>
                {sorted.map((p,i)=>(
                  <tr key={p.id}>
                    <td style={{fontWeight:800,fontSize:14,color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#cd7c4c":"var(--text-dim)"}}>{i+1}</td>
                    <td><div style={{display:"flex",alignItems:"center",gap:10}}>
                      <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:36,height:27,objectFit:"cover",objectPosition:"top",borderRadius:7,border:"1px solid var(--border)",flexShrink:0}}/>
                      <span style={{color:"var(--text)",fontWeight:700,fontSize:13}}>{p.name}</span>
                    </div></td>
                    <td><span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"var(--surface-hover)",color:"var(--text-muted)",border:"1px solid var(--border)",fontWeight:700}}>{p.position}</span></td>
                    <td style={{fontSize:12,color:"var(--text-dim)",fontWeight:600}}>{p.team}</td>
                    <td style={{fontWeight:sortBy==="pts"?800:400,color:sortBy==="pts"?"var(--text)":"var(--text-muted)"}}>{p.pts}</td>
                    <td style={{fontWeight:sortBy==="ast"?800:400,color:sortBy==="ast"?"var(--text)":"var(--text-muted)"}}>{p.ast}</td>
                    <td style={{fontWeight:sortBy==="reb"?800:400,color:sortBy==="reb"?"var(--text)":"var(--text-muted)"}}>{p.reb}</td>
                    <td style={{fontWeight:sortBy==="stl"?800:400,color:sortBy==="stl"?"var(--text)":"var(--text-muted)"}}>{p.stl}</td>
                    <td style={{fontWeight:sortBy==="blk"?800:400,color:sortBy==="blk"?"var(--text)":"var(--text-muted)"}}>{p.blk}</td>
                    <td style={{color:"var(--text-muted)"}}>{((p.fg_pct||0)*100).toFixed(1)}%</td>
                    <td><div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{flex:1,height:3,background:"rgba(255,255,255,0.06)",borderRadius:2,minWidth:36}}>
                        <div style={{height:"100%",borderRadius:2,width:`${((p.fantasy_score||0)/maxFS)*100}%`,background:fsColor(p.fantasy_score||0)}}/>
                      </div>
                      <span style={{fontWeight:800,fontSize:14,color:fsColor(p.fantasy_score||0),minWidth:34}}>{p.fantasy_score}</span>
                    </div></td>
                    <td><span style={{fontWeight:900,fontSize:14,padding:"3px 9px",borderRadius:7,background:`${fsColor(p.fantasy_score||0)}15`,color:fsColor(p.fantasy_score||0),border:`1px solid ${fsColor(p.fantasy_score||0)}25`}}>{fsGrade(p.fantasy_score||0)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
