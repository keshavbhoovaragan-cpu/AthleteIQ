"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";

const TOP_30 = [
  {id:203999, first_name:"Nikola",      last_name:"Jokic",              pos:"C",   team:"DEN", pts:26.4, ast:9.0,  reb:12.4, stl:1.4, blk:0.7, fg_pct:0.576, fantasy_score:71.2},
  {id:1628983,first_name:"Shai",        last_name:"Gilgeous-Alexander", pos:"G",   team:"OKC", pts:32.7, ast:6.4,  reb:5.5,  stl:2.0, blk:0.8, fg_pct:0.535, fantasy_score:68.4},
  {id:203507, first_name:"Giannis",     last_name:"Antetokounmpo",      pos:"F",   team:"MIL", pts:30.4, ast:5.4,  reb:11.9, stl:0.9, blk:0.7, fg_pct:0.611, fantasy_score:67.1},
  {id:1641705,first_name:"Victor",      last_name:"Wembanyama",         pos:"C",   team:"SAS", pts:25.0, ast:3.1,  reb:11.5, stl:1.0, blk:3.6, fg_pct:0.483, fantasy_score:65.8},
  {id:1627734,first_name:"Domantas",    last_name:"Sabonis",            pos:"C",   team:"SAC", pts:19.9, ast:8.3,  reb:14.4, stl:0.7, blk:0.6, fg_pct:0.618, fantasy_score:63.2},
  {id:1629029,first_name:"Luka",        last_name:"Doncic",             pos:"G-F", team:"LAL", pts:28.1, ast:7.8,  reb:7.7,  stl:1.6, blk:0.5, fg_pct:0.477, fantasy_score:61.9},
  {id:203076, first_name:"Anthony",     last_name:"Davis",              pos:"F-C", team:"DAL", pts:20.4, ast:2.8,  reb:11.1, stl:1.1, blk:2.4, fg_pct:0.564, fantasy_score:60.3},
  {id:2544,   first_name:"LeBron",      last_name:"James",              pos:"F",   team:"LAL", pts:20.9, ast:9.2,  reb:6.1,  stl:1.3, blk:0.6, fg_pct:0.540, fantasy_score:57.8},
  {id:1630169,first_name:"Tyrese",      last_name:"Haliburton",         pos:"G",   team:"IND", pts:23.4, ast:10.9, reb:4.4,  stl:1.6, blk:0.4, fg_pct:0.472, fantasy_score:57.2},
  {id:203497, first_name:"Rudy",        last_name:"Gobert",             pos:"C",   team:"MIN", pts:14.0, ast:1.6,  reb:12.9, stl:0.5, blk:2.1, fg_pct:0.624, fantasy_score:56.4},
  {id:1630162,first_name:"Anthony",     last_name:"Edwards",            pos:"G",   team:"MIN", pts:28.8, ast:3.7,  reb:5.0,  stl:1.4, blk:0.8, fg_pct:0.465, fantasy_score:55.9},
  {id:1629027,first_name:"Trae",        last_name:"Young",              pos:"G",   team:"ATL", pts:23.1, ast:11.0, reb:3.0,  stl:1.7, blk:0.1, fg_pct:0.423, fantasy_score:55.1},
  {id:1628369,first_name:"Jayson",      last_name:"Tatum",              pos:"F",   team:"BOS", pts:26.9, ast:5.3,  reb:10.0, stl:1.4, blk:0.2, fg_pct:0.471, fantasy_score:54.8},
  {id:1630578,first_name:"Alperen",     last_name:"Sengun",             pos:"C",   team:"HOU", pts:21.1, ast:5.6,  reb:9.4,  stl:0.7, blk:1.9, fg_pct:0.556, fantasy_score:54.3},
  {id:1628973,first_name:"Jalen",       last_name:"Brunson",            pos:"G",   team:"NYK", pts:25.9, ast:7.7,  reb:3.6,  stl:0.9, blk:0.2, fg_pct:0.481, fantasy_score:52.7},
  {id:1626164,first_name:"Devin",       last_name:"Booker",             pos:"G",   team:"PHX", pts:27.3, ast:4.5,  reb:4.2,  stl:1.1, blk:0.3, fg_pct:0.488, fantasy_score:52.1},
  {id:1628378,first_name:"Donovan",     last_name:"Mitchell",           pos:"G",   team:"CLE", pts:24.9, ast:5.7,  reb:4.5,  stl:1.7, blk:0.3, fg_pct:0.463, fantasy_score:51.8},
  {id:1630595,first_name:"Cade",        last_name:"Cunningham",         pos:"G",   team:"DET", pts:24.5, ast:8.4,  reb:4.5,  stl:1.6, blk:0.4, fg_pct:0.432, fantasy_score:51.4},
  {id:1630596,first_name:"Evan",        last_name:"Mobley",             pos:"F-C", team:"CLE", pts:18.0, ast:3.2,  reb:9.4,  stl:0.8, blk:1.7, fg_pct:0.556, fantasy_score:51.1},
  {id:201142, first_name:"Kevin",       last_name:"Durant",             pos:"F",   team:"PHX", pts:27.1, ast:4.2,  reb:6.6,  stl:0.9, blk:1.1, fg_pct:0.528, fantasy_score:50.9},
  {id:1628389,first_name:"Bam",         last_name:"Adebayo",            pos:"C",   team:"MIA", pts:20.0, ast:4.8,  reb:10.4, stl:1.1, blk:1.1, fg_pct:0.538, fantasy_score:50.6},
  {id:203081, first_name:"Damian",      last_name:"Lillard",            pos:"G",   team:"MIL", pts:24.3, ast:7.4,  reb:4.4,  stl:0.9, blk:0.3, fg_pct:0.420, fantasy_score:48.9},
  {id:1626157,first_name:"Karl-Anthony",last_name:"Towns",              pos:"C",   team:"NYK", pts:24.4, ast:3.4,  reb:8.3,  stl:0.6, blk:0.8, fg_pct:0.512, fantasy_score:49.8},
  {id:1631094,first_name:"Paolo",       last_name:"Banchero",           pos:"F",   team:"ORL", pts:22.6, ast:5.4,  reb:6.4,  stl:1.2, blk:0.9, fg_pct:0.441, fantasy_score:49.3},
  {id:1628991,first_name:"Jaren",       last_name:"Jackson Jr.",        pos:"F-C", team:"MEM", pts:21.0, ast:2.0,  reb:5.8,  stl:0.9, blk:2.5, fg_pct:0.472, fantasy_score:49.1},
  {id:1629636,first_name:"Darius",      last_name:"Garland",            pos:"G",   team:"CLE", pts:21.1, ast:6.9,  reb:3.0,  stl:1.3, blk:0.3, fg_pct:0.458, fantasy_score:48.7},
  {id:201939, first_name:"Stephen",     last_name:"Curry",              pos:"G",   team:"GSW", pts:26.6, ast:4.7,  reb:3.6,  stl:1.1, blk:0.4, fg_pct:0.471, fantasy_score:48.4},
  {id:1629651,first_name:"Nic",         last_name:"Claxton",            pos:"C",   team:"BKN", pts:13.2, ast:2.0,  reb:8.4,  stl:0.7, blk:2.3, fg_pct:0.638, fantasy_score:48.1},
  {id:202695, first_name:"Kawhi",       last_name:"Leonard",            pos:"F",   team:"LAC", pts:14.1, ast:3.6,  reb:6.3,  stl:1.6, blk:0.5, fg_pct:0.497, fantasy_score:43.2},
  {id:1631117,first_name:"Walker",      last_name:"Kessler",            pos:"C",   team:"UTA", pts:10.3, ast:1.5,  reb:9.0,  stl:0.5, blk:2.3, fg_pct:0.712, fantasy_score:42.8},
];

const POS_GROUPS = [
  { label:"All",  fn:(_:string) => true },
  { label:"G",    fn:(p:string) => p==="G" || p==="G-F" },
  { label:"F",    fn:(p:string) => p==="F" || p==="G-F" || p==="F-C" },
  { label:"C",    fn:(p:string) => p==="C" || p==="F-C" },
  { label:"G-F",  fn:(p:string) => p==="G-F" },
  { label:"F-C",  fn:(p:string) => p==="F-C" },
];

const SORT_OPTS = [
  {value:"fantasy_score",label:"Fantasy Score"},{value:"pts",label:"Points"},
  {value:"ast",label:"Assists"},{value:"reb",label:"Rebounds"},
  {value:"stl",label:"Steals"},{value:"blk",label:"Blocks"},
];

export default function RankingsPage() {
  const [posFilter, setPosFilter] = useState("All");
  const [sortBy, setSortBy] = useState("fantasy_score");

  const fsColor=(s:number)=>s>=60?"#a78bfa":s>=50?"#22c55e":s>=40?"#f59e0b":"#ef4444";
  const fsGrade=(s:number)=>s>=60?"S":s>=50?"A":s>=40?"B":s>=30?"C":"D";
  const group=POS_GROUPS.find(g=>g.label===posFilter)||POS_GROUPS[0];
  const filtered=[...TOP_30].filter(p=>group.fn(p.pos)).sort((a,b)=>(b as any)[sortBy]-(a as any)[sortBy]);

  return (
    <main style={{minHeight:"100vh",background:"#07070e"}}>
      <NavBar/>
      <div style={{position:"fixed",top:"10%",right:"10%",width:500,height:500,background:"radial-gradient(circle,rgba(245,158,11,0.03) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{maxWidth:1060,margin:"0 auto",padding:"40px 24px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:10,color:"rgba(245,158,11,0.6)",letterSpacing:"0.2em",fontWeight:700,marginBottom:6}}>2024-25 NBA SEASON</div>
          <h1 style={{fontSize:34,fontWeight:900,lineHeight:1,letterSpacing:"-0.02em",marginBottom:6,background:"linear-gradient(135deg,#f59e0b 0%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Player Rankings</h1>
          <p style={{color:"rgba(255,255,255,0.28)",fontSize:13}}>Top 30 NBA players ranked by fantasy score · 2024-25 season averages</p>
        </div>
        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {POS_GROUPS.map(g=>(
              <button key={g.label} onClick={()=>setPosFilter(g.label)}
                style={{padding:"5px 13px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",background:posFilter===g.label?"#f59e0b":"rgba(255,255,255,0.04)",color:posFilter===g.label?"#000":"rgba(255,255,255,0.4)",border:posFilter===g.label?"1px solid #f59e0b":"1px solid rgba(255,255,255,0.07)",transition:"all 0.15s"}}>
                {g.label}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
            style={{marginLeft:"auto",background:"#111118",border:"1px solid rgba(255,255,255,0.08)",borderRadius:9,padding:"6px 12px",color:"#fff",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
            {SORT_OPTS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div style={{background:"linear-gradient(180deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.015) 100%)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,overflow:"hidden"}}>
          <div style={{padding:"13px 20px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.015)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontWeight:700,fontSize:13}}>{posFilter==="All"?"All Players":`${posFilter} Players`}</span>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>· {filtered.length} players</span>
            </div>
            <span style={{fontSize:10,color:"rgba(255,255,255,0.15)",letterSpacing:"0.06em"}}>SORTED BY {SORT_OPTS.find(o=>o.value===sortBy)?.label.toUpperCase()}</span>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              {["#","PLAYER","POS","TEAM","PTS","AST","REB","STL","BLK","FG%","FANTASY","GRADE"].map(h=>(
                <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,color:"rgba(255,255,255,0.18)",fontWeight:700,letterSpacing:"0.1em"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((p,i)=>(
                <tr key={p.id} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.012)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                  <td style={{padding:"12px 14px",fontWeight:800,fontSize:14,color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#cd7c4c":"rgba(255,255,255,0.2)"}}>{i+1}</td>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:36,height:27,objectFit:"cover",objectPosition:"top",borderRadius:7,border:"1px solid rgba(255,255,255,0.07)"}}/>
                      <span style={{color:"#fff",fontWeight:700,fontSize:13}}>{p.first_name} {p.last_name}</span>
                    </div>
                  </td>
                  <td style={{padding:"12px 14px"}}><span style={{fontSize:10,padding:"2px 8px",borderRadius:5,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.06)",fontWeight:700}}>{p.pos}</span></td>
                  <td style={{padding:"12px 14px",fontSize:12,color:"rgba(255,255,255,0.35)",fontWeight:600}}>{p.team}</td>
                  <td style={{padding:"12px 14px",fontSize:13,fontWeight:sortBy==="pts"?800:400,color:sortBy==="pts"?"#fff":"rgba(255,255,255,0.7)"}}>{p.pts}</td>
                  <td style={{padding:"12px 14px",fontSize:13,fontWeight:sortBy==="ast"?800:400,color:sortBy==="ast"?"#fff":"rgba(255,255,255,0.7)"}}>{p.ast}</td>
                  <td style={{padding:"12px 14px",fontSize:13,fontWeight:sortBy==="reb"?800:400,color:sortBy==="reb"?"#fff":"rgba(255,255,255,0.7)"}}>{p.reb}</td>
                  <td style={{padding:"12px 14px",fontSize:13,fontWeight:sortBy==="stl"?800:400,color:sortBy==="stl"?"#fff":"rgba(255,255,255,0.7)"}}>{p.stl}</td>
                  <td style={{padding:"12px 14px",fontSize:13,fontWeight:sortBy==="blk"?800:400,color:sortBy==="blk"?"#fff":"rgba(255,255,255,0.7)"}}>{p.blk}</td>
                  <td style={{padding:"12px 14px",fontSize:13,color:"rgba(255,255,255,0.7)"}}>{(p.fg_pct*100).toFixed(1)}%</td>
                  <td style={{padding:"12px 14px",fontWeight:800,fontSize:15,color:fsColor(p.fantasy_score)}}>{p.fantasy_score}</td>
                  <td style={{padding:"12px 14px"}}><span style={{fontWeight:900,fontSize:14,padding:"3px 9px",borderRadius:7,background:`${fsColor(p.fantasy_score)}12`,color:fsColor(p.fantasy_score),border:`1px solid ${fsColor(p.fantasy_score)}25`}}>{fsGrade(p.fantasy_score)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
