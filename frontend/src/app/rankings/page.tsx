"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";
import PageHeader from "@/components/ui/PageHeader";

const SEASONS = ["2024-25","2023-24","2022-23","2021-22","2020-21"];

const ALL_SEASONS: Record<string, any[]> = {
  "2024-25": [
    {id:203999, name:"Nikola Jokic",            pos:"C",   team:"DEN", pts:26.4, ast:9.0,  reb:12.4, stl:1.4, blk:0.7, fg_pct:0.576, fantasy_score:71.2},
    {id:1628983,name:"Shai Gilgeous-Alexander", pos:"G",   team:"OKC", pts:32.7, ast:6.4,  reb:5.5,  stl:2.0, blk:0.8, fg_pct:0.535, fantasy_score:68.4},
    {id:203507, name:"Giannis Antetokounmpo",   pos:"F",   team:"MIL", pts:30.4, ast:5.4,  reb:11.9, stl:0.9, blk:0.7, fg_pct:0.611, fantasy_score:67.1},
    {id:1641705,name:"Victor Wembanyama",        pos:"C",   team:"SAS", pts:25.0, ast:3.1,  reb:11.5, stl:1.0, blk:3.6, fg_pct:0.483, fantasy_score:65.8},
    {id:1627734,name:"Domantas Sabonis",         pos:"C",   team:"SAC", pts:19.9, ast:8.3,  reb:14.4, stl:0.7, blk:0.6, fg_pct:0.618, fantasy_score:63.2},
    {id:1629029,name:"Luka Doncic",              pos:"G-F", team:"LAL", pts:28.1, ast:7.8,  reb:7.7,  stl:1.6, blk:0.5, fg_pct:0.477, fantasy_score:61.9},
    {id:203076, name:"Anthony Davis",            pos:"F-C", team:"DAL", pts:20.4, ast:2.8,  reb:11.1, stl:1.1, blk:2.4, fg_pct:0.564, fantasy_score:60.3},
    {id:2544,   name:"LeBron James",             pos:"F",   team:"LAL", pts:20.9, ast:9.2,  reb:6.1,  stl:1.3, blk:0.6, fg_pct:0.540, fantasy_score:57.8},
    {id:1630169,name:"Tyrese Haliburton",         pos:"G",   team:"IND", pts:23.4, ast:10.9, reb:4.4,  stl:1.6, blk:0.4, fg_pct:0.472, fantasy_score:57.2},
    {id:203497, name:"Rudy Gobert",              pos:"C",   team:"MIN", pts:14.0, ast:1.6,  reb:12.9, stl:0.5, blk:2.1, fg_pct:0.624, fantasy_score:56.4},
    {id:1630162,name:"Anthony Edwards",           pos:"G",   team:"MIN", pts:28.8, ast:3.7,  reb:5.0,  stl:1.4, blk:0.8, fg_pct:0.465, fantasy_score:55.9},
    {id:1629027,name:"Trae Young",               pos:"G",   team:"ATL", pts:23.1, ast:11.0, reb:3.0,  stl:1.7, blk:0.1, fg_pct:0.423, fantasy_score:55.1},
    {id:1628369,name:"Jayson Tatum",             pos:"F",   team:"BOS", pts:26.9, ast:5.3,  reb:10.0, stl:1.4, blk:0.2, fg_pct:0.471, fantasy_score:54.8},
    {id:1630578,name:"Alperen Sengun",            pos:"C",   team:"HOU", pts:21.1, ast:5.6,  reb:9.4,  stl:0.7, blk:1.9, fg_pct:0.556, fantasy_score:54.3},
    {id:1628973,name:"Jalen Brunson",            pos:"G",   team:"NYK", pts:25.9, ast:7.7,  reb:3.6,  stl:0.9, blk:0.2, fg_pct:0.481, fantasy_score:52.7},
  ],
  "2023-24": [
    {id:203999, name:"Nikola Jokic",            pos:"C",   team:"DEN", pts:26.4, ast:9.0,  reb:12.6, stl:1.4, blk:0.9, fg_pct:0.583, fantasy_score:72.1},
    {id:203507, name:"Giannis Antetokounmpo",   pos:"F",   team:"MIL", pts:30.4, ast:6.5,  reb:11.5, stl:1.2, blk:1.1, fg_pct:0.611, fantasy_score:69.3},
    {id:1628983,name:"Shai Gilgeous-Alexander", pos:"G",   team:"OKC", pts:30.1, ast:6.2,  reb:5.5,  stl:2.0, blk:1.0, fg_pct:0.535, fantasy_score:67.2},
    {id:1629029,name:"Luka Doncic",             pos:"G-F", team:"DAL", pts:33.9, ast:9.8,  reb:9.2,  stl:1.4, blk:0.5, fg_pct:0.487, fantasy_score:66.8},
    {id:1627734,name:"Domantas Sabonis",         pos:"C",   team:"SAC", pts:19.9, ast:8.1,  reb:13.5, stl:1.1, blk:0.5, fg_pct:0.601, fantasy_score:62.4},
    {id:203076, name:"Anthony Davis",            pos:"F-C", team:"LAL", pts:24.7, ast:3.5,  reb:12.6, stl:1.2, blk:2.3, fg_pct:0.562, fantasy_score:61.9},
    {id:1628369,name:"Jayson Tatum",             pos:"F",   team:"BOS", pts:26.9, ast:4.9,  reb:8.1,  stl:1.1, blk:0.6, fg_pct:0.471, fantasy_score:57.4},
    {id:2544,   name:"LeBron James",             pos:"F",   team:"LAL", pts:25.7, ast:8.3,  reb:7.3,  stl:1.3, blk:0.5, fg_pct:0.540, fantasy_score:57.1},
    {id:1630162,name:"Anthony Edwards",           pos:"G",   team:"MIN", pts:25.9, ast:5.1,  reb:5.4,  stl:1.3, blk:0.6, fg_pct:0.462, fantasy_score:54.8},
    {id:201939, name:"Stephen Curry",            pos:"G",   team:"GSW", pts:26.4, ast:5.1,  reb:4.5,  stl:0.9, blk:0.4, fg_pct:0.450, fantasy_score:52.1},
    {id:1628389,name:"Bam Adebayo",              pos:"C",   team:"MIA", pts:19.3, ast:3.6,  reb:10.4, stl:1.1, blk:0.9, fg_pct:0.539, fantasy_score:51.8},
    {id:1630169,name:"Tyrese Haliburton",         pos:"G",   team:"IND", pts:20.1, ast:10.9, reb:3.9,  stl:1.6, blk:0.4, fg_pct:0.474, fantasy_score:51.3},
    {id:203497, name:"Rudy Gobert",              pos:"C",   team:"MIN", pts:14.0, ast:1.6,  reb:12.9, stl:0.5, blk:2.2, fg_pct:0.624, fantasy_score:50.9},
    {id:1630596,name:"Evan Mobley",              pos:"F-C", team:"CLE", pts:15.7, ast:2.8,  reb:9.4,  stl:1.1, blk:1.6, fg_pct:0.551, fantasy_score:49.2},
    {id:1628991,name:"Jaren Jackson Jr.",         pos:"F-C", team:"MEM", pts:22.6, ast:2.0,  reb:6.9,  stl:0.9, blk:3.0, fg_pct:0.474, fantasy_score:50.1},
  ],
  "2022-23": [
    {id:203999, name:"Nikola Jokic",            pos:"C",   team:"DEN", pts:24.5, ast:9.8,  reb:11.8, stl:1.3, blk:0.7, fg_pct:0.632, fantasy_score:70.4},
    {id:1629029,name:"Luka Doncic",             pos:"G-F", team:"DAL", pts:32.4, ast:8.0,  reb:8.6,  stl:1.4, blk:0.5, fg_pct:0.496, fantasy_score:64.1},
    {id:203507, name:"Giannis Antetokounmpo",   pos:"F",   team:"MIL", pts:31.1, ast:5.7,  reb:11.8, stl:0.8, blk:0.8, fg_pct:0.553, fantasy_score:63.8},
    {id:201939, name:"Stephen Curry",           pos:"G",   team:"GSW", pts:29.4, ast:6.3,  reb:6.1,  stl:0.9, blk:0.4, fg_pct:0.491, fantasy_score:58.2},
    {id:2544,   name:"LeBron James",            pos:"F",   team:"LAL", pts:28.9, ast:6.8,  reb:8.3,  stl:1.6, blk:0.6, fg_pct:0.500, fantasy_score:57.9},
    {id:203076, name:"Anthony Davis",           pos:"F-C", team:"LAL", pts:25.9, ast:2.6,  reb:12.5, stl:1.1, blk:2.0, fg_pct:0.567, fantasy_score:57.3},
    {id:1628369,name:"Jayson Tatum",            pos:"F",   team:"BOS", pts:30.1, ast:4.6,  reb:8.8,  stl:1.1, blk:0.7, fg_pct:0.466, fantasy_score:56.8},
    {id:1628983,name:"Shai Gilgeous-Alexander", pos:"G",   team:"OKC", pts:31.4, ast:5.5,  reb:4.8,  stl:1.6, blk:1.0, fg_pct:0.510, fantasy_score:56.2},
    {id:1627734,name:"Domantas Sabonis",         pos:"C",   team:"SAC", pts:19.1, ast:7.3,  reb:12.3, stl:1.1, blk:0.5, fg_pct:0.598, fantasy_score:56.0},
    {id:1629027,name:"Trae Young",              pos:"G",   team:"ATL", pts:26.2, ast:10.2, reb:3.0,  stl:1.1, blk:0.2, fg_pct:0.428, fantasy_score:52.1},
    {id:1630169,name:"Tyrese Haliburton",        pos:"G",   team:"IND", pts:20.7, ast:10.4, reb:3.7,  stl:1.6, blk:0.5, fg_pct:0.490, fantasy_score:51.8},
    {id:1628378,name:"Donovan Mitchell",         pos:"G",   team:"CLE", pts:28.1, ast:4.4,  reb:4.4,  stl:1.5, blk:0.4, fg_pct:0.461, fantasy_score:51.3},
    {id:203497, name:"Rudy Gobert",             pos:"C",   team:"MIN", pts:13.4, ast:1.6,  reb:11.6, stl:0.9, blk:2.1, fg_pct:0.661, fantasy_score:50.8},
    {id:1630596,name:"Evan Mobley",             pos:"F-C", team:"CLE", pts:13.1, ast:2.4,  reb:8.3,  stl:0.8, blk:1.5, fg_pct:0.567, fantasy_score:47.2},
    {id:1628389,name:"Bam Adebayo",             pos:"C",   team:"MIA", pts:21.2, ast:3.2,  reb:10.0, stl:1.3, blk:0.7, fg_pct:0.524, fantasy_score:50.1},
  ],
  "2021-22": [
    {id:203999, name:"Nikola Jokic",            pos:"C",   team:"DEN", pts:27.1, ast:7.9,  reb:13.8, stl:1.5, blk:0.9, fg_pct:0.583, fantasy_score:72.8},
    {id:203507, name:"Giannis Antetokounmpo",   pos:"F",   team:"MIL", pts:29.9, ast:5.8,  reb:11.6, stl:1.1, blk:1.4, fg_pct:0.553, fantasy_score:63.1},
    {id:2544,   name:"LeBron James",            pos:"F",   team:"LAL", pts:30.3, ast:6.2,  reb:8.2,  stl:1.3, blk:1.1, fg_pct:0.526, fantasy_score:61.2},
    {id:1629029,name:"Luka Doncic",             pos:"G-F", team:"DAL", pts:28.4, ast:8.7,  reb:9.1,  stl:1.2, blk:0.5, fg_pct:0.457, fantasy_score:59.3},
    {id:203076, name:"Anthony Davis",           pos:"F-C", team:"LAL", pts:23.2, ast:3.1,  reb:9.9,  stl:1.2, blk:2.3, fg_pct:0.532, fantasy_score:55.4},
    {id:1627734,name:"Domantas Sabonis",         pos:"C",   team:"IND", pts:18.9, ast:5.8,  reb:12.1, stl:1.0, blk:0.5, fg_pct:0.581, fantasy_score:54.2},
    {id:1628369,name:"Jayson Tatum",            pos:"F",   team:"BOS", pts:26.9, ast:4.4,  reb:8.0,  stl:1.0, blk:0.7, fg_pct:0.453, fantasy_score:53.1},
    {id:1629027,name:"Trae Young",              pos:"G",   team:"ATL", pts:28.4, ast:9.7,  reb:3.7,  stl:0.8, blk:0.2, fg_pct:0.461, fantasy_score:53.2},
    {id:201935, name:"James Harden",            pos:"G",   team:"PHI", pts:22.0, ast:10.3, reb:7.7,  stl:1.3, blk:0.6, fg_pct:0.421, fantasy_score:52.8},
    {id:203497, name:"Rudy Gobert",             pos:"C",   team:"UTA", pts:15.6, ast:1.4,  reb:14.7, stl:0.8, blk:2.1, fg_pct:0.714, fantasy_score:56.3},
    {id:201939, name:"Stephen Curry",           pos:"G",   team:"GSW", pts:25.5, ast:6.3,  reb:5.2,  stl:1.3, blk:0.4, fg_pct:0.437, fantasy_score:52.4},
    {id:1628983,name:"Shai Gilgeous-Alexander", pos:"G",   team:"OKC", pts:24.5, ast:5.9,  reb:4.8,  stl:1.4, blk:0.9, fg_pct:0.452, fantasy_score:50.8},
    {id:1628378,name:"Donovan Mitchell",         pos:"G",   team:"UTA", pts:25.9, ast:5.3,  reb:4.2,  stl:1.5, blk:0.4, fg_pct:0.451, fantasy_score:49.8},
    {id:1628389,name:"Bam Adebayo",             pos:"C",   team:"MIA", pts:19.1, ast:3.4,  reb:10.1, stl:1.3, blk:0.8, fg_pct:0.537, fantasy_score:50.6},
    {id:203081, name:"Damian Lillard",           pos:"G",   team:"POR", pts:24.0, ast:7.3,  reb:4.1,  stl:0.9, blk:0.3, fg_pct:0.403, fantasy_score:47.2},
  ],
  "2020-21": [
    {id:203999, name:"Nikola Jokic",            pos:"C",   team:"DEN", pts:26.4, ast:8.3,  reb:10.8, stl:1.3, blk:0.7, fg_pct:0.565, fantasy_score:67.4},
    {id:203507, name:"Giannis Antetokounmpo",   pos:"F",   team:"MIL", pts:28.1, ast:6.1,  reb:11.0, stl:1.2, blk:1.2, fg_pct:0.569, fantasy_score:64.2},
    {id:201939, name:"Stephen Curry",           pos:"G",   team:"GSW", pts:32.0, ast:5.8,  reb:5.5,  stl:1.2, blk:0.4, fg_pct:0.482, fantasy_score:58.1},
    {id:1629029,name:"Luka Doncic",             pos:"G-F", team:"DAL", pts:27.7, ast:8.6,  reb:8.0,  stl:1.0, blk:0.5, fg_pct:0.479, fantasy_score:57.8},
    {id:2544,   name:"LeBron James",            pos:"F",   team:"LAL", pts:25.0, ast:7.7,  reb:7.7,  stl:1.1, blk:0.6, fg_pct:0.513, fantasy_score:55.2},
    {id:201935, name:"James Harden",            pos:"G",   team:"BKN", pts:24.6, ast:10.9, reb:8.5,  stl:1.1, blk:0.6, fg_pct:0.463, fantasy_score:55.8},
    {id:1627734,name:"Domantas Sabonis",         pos:"C",   team:"IND", pts:20.3, ast:6.7,  reb:12.0, stl:0.8, blk:0.6, fg_pct:0.538, fantasy_score:54.1},
    {id:203076, name:"Anthony Davis",           pos:"F-C", team:"LAL", pts:21.8, ast:3.1,  reb:7.9,  stl:1.3, blk:1.6, fg_pct:0.504, fantasy_score:51.8},
    {id:1628389,name:"Bam Adebayo",             pos:"C",   team:"MIA", pts:18.7, ast:5.4,  reb:9.0,  stl:1.5, blk:1.0, fg_pct:0.576, fantasy_score:52.3},
    {id:203497, name:"Rudy Gobert",             pos:"C",   team:"UTA", pts:14.3, ast:1.3,  reb:13.5, stl:0.7, blk:2.7, fg_pct:0.671, fantasy_score:55.4},
    {id:203081, name:"Damian Lillard",           pos:"G",   team:"POR", pts:28.8, ast:7.5,  reb:4.2,  stl:0.9, blk:0.3, fg_pct:0.455, fantasy_score:52.9},
    {id:1629027,name:"Trae Young",              pos:"G",   team:"ATL", pts:25.3, ast:9.4,  reb:3.9,  stl:0.8, blk:0.2, fg_pct:0.436, fantasy_score:50.1},
    {id:1628378,name:"Donovan Mitchell",         pos:"G",   team:"UTA", pts:26.4, ast:5.2,  reb:4.4,  stl:1.0, blk:0.3, fg_pct:0.432, fantasy_score:49.2},
    {id:1628369,name:"Jayson Tatum",            pos:"F",   team:"BOS", pts:26.4, ast:4.3,  reb:7.4,  stl:1.2, blk:0.6, fg_pct:0.459, fantasy_score:52.1},
    {id:1628983,name:"Shai Gilgeous-Alexander", pos:"G",   team:"OKC", pts:23.7, ast:4.7,  reb:4.6,  stl:1.9, blk:0.9, fg_pct:0.507, fantasy_score:50.6},
  ],
};

const POS_GROUPS=[{label:"All",fn:(_:string)=>true},{label:"G",fn:(p:string)=>p==="G"||p==="G-F"},{label:"F",fn:(p:string)=>p==="F"||p==="G-F"||p==="F-C"},{label:"C",fn:(p:string)=>p==="C"||p==="F-C"}];
const SORT_OPTS=[{value:"fantasy_score",label:"Fantasy Score"},{value:"pts",label:"Points"},{value:"ast",label:"Assists"},{value:"reb",label:"Rebounds"},{value:"stl",label:"Steals"},{value:"blk",label:"Blocks"}];

export default function RankingsPage() {
  const [season, setSeason] = useState("2024-25");
  const [posFilter, setPosFilter] = useState("All");
  const [sortBy, setSortBy] = useState("fantasy_score");

  const fsColor=(s:number)=>s>=60?"#a78bfa":s>=50?"#22c55e":s>=40?"#f59e0b":"#f87171";
  const fsGrade=(s:number)=>s>=60?"S":s>=50?"A":s>=40?"B":s>=30?"C":"D";
  const group=POS_GROUPS.find(g=>g.label===posFilter)||POS_GROUPS[0];
  const data=ALL_SEASONS[season]||ALL_SEASONS["2024-25"];
  const filtered=[...data].filter(p=>group.fn(p.pos)).sort((a,b)=>(b as any)[sortBy]-(a as any)[sortBy]);
  const maxFS=Math.max(...filtered.map(p=>p.fantasy_score));

  return (
    <main style={{minHeight:"100vh"}}>
      <NavBar/>
      <div style={{maxWidth:1060,margin:"0 auto",padding:"36px 24px",position:"relative",zIndex:1}}>
        <PageHeader eyebrow="Fantasy Rankings" title="Player Rankings" titleGradient="warm" subtitle="Top players ranked by fantasy score — switch seasons, filter by position, sort by any stat"/>

        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:10,color:"var(--text-dim)",fontWeight:700,letterSpacing:"0.1em",marginRight:4}}>SEASON</span>
          {SEASONS.map(s=>(
            <button key={s} onClick={()=>setSeason(s)} style={{padding:"5px 14px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",background:season===s?"#f59e0b":"var(--surface)",color:season===s?"#000":"var(--text-muted)",border:season===s?"1px solid #f59e0b":"1px solid var(--border)",transition:"all 0.15s",fontFamily:"inherit",boxShadow:season===s?"0 0 12px rgba(245,158,11,0.3)":"none"}}>
              {s}{s==="2024-25"&&<span style={{marginLeft:5,fontSize:9,padding:"1px 4px",borderRadius:3,background:"rgba(34,197,94,0.2)",color:"#22c55e",fontWeight:800}}>LIVE</span>}
            </button>
          ))}
        </div>

        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {POS_GROUPS.map(g=>(<button key={g.label} onClick={()=>setPosFilter(g.label)} className={posFilter===g.label?"pill active":"pill"}>{g.label}</button>))}
          </div>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{marginLeft:"auto",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 12px",color:"var(--text)",fontSize:11,cursor:"pointer",fontFamily:"inherit",outline:"none"}}>
            {SORT_OPTS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.06)"}}>
          <div className="table-header">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontWeight:700,fontSize:13}}>{season} Rankings</span>
              <span style={{fontSize:11,color:"var(--text-dim)"}}>· {filtered.length} players</span>
            </div>
            <span style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.06em"}}>SORTED BY {SORT_OPTS.find(o=>o.value===sortBy)?.label.toUpperCase()}</span>
          </div>
          <table className="data-table">
            <thead><tr>{["#","PLAYER","POS","TEAM","PTS","AST","REB","STL","BLK","FG%","FANTASY","GRD"].map(h=>(<th key={h}>{h}</th>))}</tr></thead>
            <tbody>
              {filtered.map((p,i)=>(
                <tr key={`${p.id}-${i}`}>
                  <td style={{fontWeight:800,fontSize:14,color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#cd7c4c":"var(--text-dim)"}}>{i+1}</td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:36,height:27,objectFit:"cover",objectPosition:"top",borderRadius:7,border:"1px solid var(--border)",flexShrink:0}}/>
                      <span style={{color:"var(--text)",fontWeight:700,fontSize:13}}>{p.name}</span>
                    </div>
                  </td>
                  <td><span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"var(--surface-hover)",color:"var(--text-muted)",border:"1px solid var(--border)",fontWeight:700}}>{p.pos}</span></td>
                  <td style={{fontSize:12,color:"var(--text-dim)",fontWeight:600}}>{p.team}</td>
                  <td style={{fontWeight:sortBy==="pts"?800:400,color:sortBy==="pts"?"var(--text)":"var(--text-muted)"}}>{p.pts}</td>
                  <td style={{fontWeight:sortBy==="ast"?800:400,color:sortBy==="ast"?"var(--text)":"var(--text-muted)"}}>{p.ast}</td>
                  <td style={{fontWeight:sortBy==="reb"?800:400,color:sortBy==="reb"?"var(--text)":"var(--text-muted)"}}>{p.reb}</td>
                  <td style={{fontWeight:sortBy==="stl"?800:400,color:sortBy==="stl"?"var(--text)":"var(--text-muted)"}}>{p.stl}</td>
                  <td style={{fontWeight:sortBy==="blk"?800:400,color:sortBy==="blk"?"var(--text)":"var(--text-muted)"}}>{p.blk}</td>
                  <td style={{color:"var(--text-muted)"}}>{(p.fg_pct*100).toFixed(1)}%</td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{flex:1,height:3,background:"rgba(255,255,255,0.06)",borderRadius:2,minWidth:36}}>
                        <div style={{height:"100%",borderRadius:2,width:`${(p.fantasy_score/maxFS)*100}%`,background:fsColor(p.fantasy_score)}}/>
                      </div>
                      <span style={{fontWeight:800,fontSize:14,color:fsColor(p.fantasy_score),minWidth:34}}>{p.fantasy_score}</span>
                    </div>
                  </td>
                  <td><span style={{fontWeight:900,fontSize:14,padding:"3px 9px",borderRadius:7,background:`${fsColor(p.fantasy_score)}15`,color:fsColor(p.fantasy_score),border:`1px solid ${fsColor(p.fantasy_score)}25`}}>{fsGrade(p.fantasy_score)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
