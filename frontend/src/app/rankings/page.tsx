"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/nav/NavBar";
import { getRankings } from "@/lib/api";

const POS_GROUPS = [
  { label:"All",  match:(p:string)=>true },
  { label:"PG",   match:(p:string)=>p==="PG"||p==="G" },
  { label:"SG",   match:(p:string)=>p==="SG"||p==="G"||p==="G-F" },
  { label:"SF",   match:(p:string)=>p==="SF"||p==="F"||p==="G-F"||p==="F-C" },
  { label:"PF",   match:(p:string)=>p==="PF"||p==="F"||p==="F-C" },
  { label:"C",    match:(p:string)=>p==="C"||p==="F-C" },
  { label:"G",    match:(p:string)=>["PG","SG","G","G-F"].includes(p) },
  { label:"F",    match:(p:string)=>["SF","PF","F","G-F","F-C"].includes(p) },
];

const SORT_OPTS = [
  {value:"fantasy_score",label:"Fantasy Score"},
  {value:"pts",label:"Points"},
  {value:"ast",label:"Assists"},
  {value:"reb",label:"Rebounds"},
  {value:"stl",label:"Steals"},
  {value:"blk",label:"Blocks"},
];

export default function RankingsPage() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posFilter, setPosFilter] = useState("All");
  const [sortBy, setSortBy] = useState("fantasy_score");

  useEffect(()=>{
    getRankings().then(d=>{setRankings(d?.players||[]);setLoading(false);}).catch(()=>setLoading(false));
  },[]);

  const fsColor=(s:number)=>s>=60?"#a78bfa":s>=50?"#22c55e":s>=40?"#f59e0b":"#ef4444";
  const fsGrade=(s:number)=>s>=60?"S":s>=50?"A":s>=40?"B":s>=30?"C":"D";
  const group=POS_GROUPS.find(g=>g.label===posFilter)||POS_GROUPS[0];
  const filtered=rankings.filter(p=>group.match(p.position||"")).sort((a,b)=>(b[sortBy]||0)-(a[sortBy]||0));

  return (
    <main style={{minHeight:"100vh",background:"#0a0a0f"}}>
      <NavBar/>
      <div style={{maxWidth:1050,margin:"0 auto",padding:"40px 24px"}}>
        <h1 style={{fontSize:32,fontWeight:800,marginBottom:8,background:"linear-gradient(135deg,#fff 60%,rgba(255,255,255,0.4))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Player Rankings</h1>
        <p style={{color:"rgba(255,255,255,0.35)",marginBottom:24,fontSize:15}}>Top 30 NBA players ranked by fantasy score — live from NBA.com · 2024-25.</p>
        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {POS_GROUPS.map(g=>(
              <button key={g.label} onClick={()=>setPosFilter(g.label)}
                style={{padding:"5px 13px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",
                  background:posFilter===g.label?"#3B82F6":"rgba(255,255,255,0.05)",
                  color:posFilter===g.label?"#fff":"rgba(255,255,255,0.4)",
                  border:posFilter===g.label?"1px solid #3B82F6":"1px solid rgba(255,255,255,0.08)"}}>
                {g.label}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
            style={{marginLeft:"auto",background:"#111118",border:"1px solid rgba(255,255,255,0.08)",borderRadius:9,padding:"6px 12px",color:"#fff",fontSize:12,cursor:"pointer"}}>
            {SORT_OPTS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {loading?(
          <div style={{textAlign:"center",padding:80,color:"rgba(255,255,255,0.3)"}}>
            <div style={{fontSize:14,marginBottom:8}}>Loading rankings...</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.2)"}}>Fetching live stats from NBA.com</div>
          </div>
        ):filtered.length===0?(
          <div style={{textAlign:"center",padding:60,color:"rgba(255,255,255,0.3)",fontSize:14}}>No players match this position filter.</div>
        ):(
          <div style={{background:"#111118",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,overflow:"hidden"}}>
            <div style={{padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontWeight:700,fontSize:14}}>{posFilter==="All"?"All Players":`${posFilter} Rankings`}</span>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>· {filtered.length} players · {SORT_OPTS.find(o=>o.value===sortBy)?.label}</span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)"}}>
                {["#","Player","POS","Team","PTS","AST","REB","STL","BLK","FG%","Fantasy","Grade"].map(h=>(
                  <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:"0.05em"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((p,i)=>(
                  <tr key={p.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}
                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.025)")}
                    onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                    <td style={{padding:"12px 14px",fontWeight:700,fontSize:13,color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#cd7c4c":"rgba(255,255,255,0.25)"}}>{i+1}</td>
                    <td style={{padding:"12px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:36,height:27,objectFit:"cover",objectPosition:"top",borderRadius:6}}/>
                        <span style={{color:"#fff",fontWeight:600,fontSize:13}}>{p.first_name} {p.last_name}</span>
                      </div>
                    </td>
                    <td style={{padding:"12px 14px"}}><span style={{fontSize:11,padding:"2px 7px",borderRadius:5,background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.55)"}}>{p.position||"—"}</span></td>
                    <td style={{padding:"12px 14px",color:"rgba(255,255,255,0.4)",fontSize:12}}>{p.team}</td>
                    <td style={{padding:"12px 14px",fontWeight:sortBy==="pts"?700:400}}>{p.pts}</td>
                    <td style={{padding:"12px 14px",fontWeight:sortBy==="ast"?700:400}}>{p.ast}</td>
                    <td style={{padding:"12px 14px",fontWeight:sortBy==="reb"?700:400}}>{p.reb}</td>
                    <td style={{padding:"12px 14px",fontWeight:sortBy==="stl"?700:400}}>{p.stl}</td>
                    <td style={{padding:"12px 14px",fontWeight:sortBy==="blk"?700:400}}>{p.blk}</td>
                    <td style={{padding:"12px 14px"}}>{((p.fg_pct||0)*100).toFixed(1)}%</td>
                    <td style={{padding:"12px 14px",fontWeight:700,color:fsColor(p.fantasy_score)}}>{p.fantasy_score}</td>
                    <td style={{padding:"12px 14px"}}><span style={{fontWeight:800,fontSize:14,padding:"2px 8px",borderRadius:6,background:`${fsColor(p.fantasy_score)}15`,color:fsColor(p.fantasy_score)}}>{fsGrade(p.fantasy_score)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
