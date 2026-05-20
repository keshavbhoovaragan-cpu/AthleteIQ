"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";

const DRAFT_BOARD = [
  {id:203999, name:"Nikola Jokic",            pos:"C",  team:"DEN",fs:71.2,round:1,pick:1, trend:"↑",value:"Elite"},
  {id:1628983,name:"Shai Gilgeous-Alexander", pos:"G",  team:"OKC",fs:68.4,round:1,pick:2, trend:"↑",value:"Elite"},
  {id:203507, name:"Giannis Antetokounmpo",   pos:"F",  team:"MIL",fs:67.1,round:1,pick:3, trend:"→",value:"Elite"},
  {id:1641705,name:"Victor Wembanyama",        pos:"C",  team:"SAS",fs:65.8,round:1,pick:4, trend:"↑",value:"Elite"},
  {id:1627734,name:"Domantas Sabonis",         pos:"C",  team:"SAC",fs:63.2,round:1,pick:5, trend:"→",value:"Elite"},
  {id:1629029,name:"Luka Doncic",             pos:"G-F",team:"LAL",fs:61.9,round:1,pick:6, trend:"↓",value:"Elite"},
  {id:203076, name:"Anthony Davis",           pos:"F-C",team:"DAL",fs:60.3,round:1,pick:7, trend:"↑",value:"Star"},
  {id:2544,   name:"LeBron James",            pos:"F",  team:"LAL",fs:57.8,round:1,pick:8, trend:"→",value:"Star"},
  {id:1630169,name:"Tyrese Haliburton",        pos:"G",  team:"IND",fs:57.2,round:1,pick:9, trend:"↑",value:"Star"},
  {id:203497, name:"Rudy Gobert",             pos:"C",  team:"MIN",fs:56.4,round:1,pick:10,trend:"→",value:"Star"},
  {id:1630162,name:"Anthony Edwards",          pos:"G",  team:"MIN",fs:55.9,round:2,pick:11,trend:"↑",value:"Star"},
  {id:1629027,name:"Trae Young",              pos:"G",  team:"ATL",fs:55.1,round:2,pick:12,trend:"→",value:"Star"},
  {id:1628369,name:"Jayson Tatum",            pos:"F",  team:"BOS",fs:54.8,round:2,pick:13,trend:"→",value:"Star"},
  {id:1630578,name:"Alperen Sengun",           pos:"C",  team:"HOU",fs:54.3,round:2,pick:14,trend:"↑",value:"Star"},
  {id:1628973,name:"Jalen Brunson",           pos:"G",  team:"NYK",fs:52.7,round:2,pick:15,trend:"→",value:"Star"},
  {id:1626164,name:"Devin Booker",            pos:"G",  team:"PHX",fs:52.1,round:2,pick:16,trend:"→",value:"Star"},
  {id:1628378,name:"Donovan Mitchell",         pos:"G",  team:"CLE",fs:51.8,round:2,pick:17,trend:"↑",value:"Solid"},
  {id:1630595,name:"Cade Cunningham",          pos:"G",  team:"DET",fs:51.4,round:2,pick:18,trend:"↑",value:"Solid"},
  {id:1630596,name:"Evan Mobley",             pos:"F-C",team:"CLE",fs:51.1,round:2,pick:19,trend:"↑",value:"Solid"},
  {id:201142, name:"Kevin Durant",            pos:"F",  team:"PHX",fs:50.9,round:2,pick:20,trend:"→",value:"Solid"},
  {id:1628389,name:"Bam Adebayo",             pos:"C",  team:"MIA",fs:50.6,round:3,pick:21,trend:"→",value:"Solid"},
  {id:203081, name:"Damian Lillard",          pos:"G",  team:"MIL",fs:48.9,round:3,pick:22,trend:"↓",value:"Solid"},
  {id:1626157,name:"Karl-Anthony Towns",       pos:"C",  team:"NYK",fs:49.8,round:3,pick:23,trend:"→",value:"Solid"},
  {id:1631094,name:"Paolo Banchero",          pos:"F",  team:"ORL",fs:49.3,round:3,pick:24,trend:"↑",value:"Solid"},
  {id:1628991,name:"Jaren Jackson Jr.",        pos:"F-C",team:"MEM",fs:49.1,round:3,pick:25,trend:"↑",value:"Solid"},
  {id:1629636,name:"Darius Garland",          pos:"G",  team:"CLE",fs:48.7,round:3,pick:26,trend:"→",value:"Solid"},
  {id:201939, name:"Stephen Curry",           pos:"G",  team:"GSW",fs:48.4,round:3,pick:27,trend:"↓",value:"Solid"},
  {id:1629651,name:"Nic Claxton",             pos:"C",  team:"BKN",fs:48.1,round:3,pick:28,trend:"→",value:"Solid"},
  {id:202695, name:"Kawhi Leonard",           pos:"F",  team:"LAC",fs:43.2,round:4,pick:29,trend:"↓",value:"Depth"},
  {id:1631117,name:"Walker Kessler",          pos:"C",  team:"UTA",fs:42.8,round:4,pick:30,trend:"↑",value:"Depth"},
];

const POS_F=["All","G","F","C","G-F","F-C"];
const VAL_F=["All","Elite","Star","Solid","Depth"];
const fsColor=(s:number)=>s>=60?"#a78bfa":s>=50?"#22c55e":s>=40?"#f59e0b":"#ef4444";
const valColor=(v:string)=>v==="Elite"?"#a78bfa":v==="Star"?"#22c55e":v==="Solid"?"#f59e0b":"#9ca3af";
const trendColor=(t:string)=>t==="↑"?"#22c55e":t==="↓"?"#ef4444":"#9ca3af";

export default function DraftPage() {
  const [posF,setPosF]=useState("All");
  const [valF,setValF]=useState("All");
  const [myPicks,setMyPicks]=useState<number[]>([]);

  const filtered=DRAFT_BOARD.filter(p=>(posF==="All"||p.pos===posF)&&(valF==="All"||p.value===valF));
  const toggle=(pick:number)=>setMyPicks(prev=>prev.includes(pick)?prev.filter(p=>p!==pick):[...prev,pick]);

  return (
    <main style={{minHeight:"100vh",background:"#07070e"}}>
      <NavBar/>
      <div style={{position:"fixed",bottom:"10%",right:"5%",width:400,height:400,background:"radial-gradient(circle,rgba(96,165,250,0.03) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{maxWidth:1060,margin:"0 auto",padding:"40px 24px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:10,color:"rgba(96,165,250,0.6)",letterSpacing:"0.2em",fontWeight:700,marginBottom:6}}>2024-25 SEASON</div>
          <h1 style={{fontSize:34,fontWeight:900,lineHeight:1,letterSpacing:"-0.02em",marginBottom:6,background:"linear-gradient(135deg,#60a5fa 0%,#a78bfa 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Draft Board</h1>
          <p style={{color:"rgba(255,255,255,0.28)",fontSize:13}}>Fantasy draft rankings · Click + PICK to add to your board · Filter by position and value tier</p>
        </div>

        {myPicks.length>0&&(
          <div style={{background:"rgba(96,165,250,0.06)",border:"1px solid rgba(96,165,250,0.15)",borderRadius:14,padding:"14px 18px",marginBottom:20}}>
            <div style={{fontSize:9,color:"rgba(96,165,250,0.6)",letterSpacing:"0.1em",fontWeight:700,marginBottom:10}}>MY DRAFT BOARD ({myPicks.length} players)</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {myPicks.map(pick=>{
                const p=DRAFT_BOARD.find(pl=>pl.pick===pick);
                if(!p) return null;
                return(
                  <div key={pick} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"5px 10px"}}>
                    <span style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:700}}>#{pick}</span>
                    <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:18,height:14,objectFit:"cover",objectPosition:"top",borderRadius:3}}/>
                    <span style={{fontSize:11,color:"#fff",fontWeight:600}}>{p.name.split(" ").pop()}</span>
                    <button onClick={()=>toggle(pick)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:12,padding:0}}>×</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {POS_F.map(f=>(<button key={f} onClick={()=>setPosF(f)} style={{padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",background:posF===f?"#60a5fa":"rgba(255,255,255,0.04)",color:posF===f?"#000":"rgba(255,255,255,0.4)",border:posF===f?"1px solid #60a5fa":"1px solid rgba(255,255,255,0.07)",transition:"all 0.15s"}}>{f}</button>))}
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {VAL_F.map(f=>(<button key={f} onClick={()=>setValF(f)} style={{padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",background:valF===f?valColor(f):"rgba(255,255,255,0.04)",color:valF===f?"#000":"rgba(255,255,255,0.4)",border:valF===f?`1px solid ${valColor(f)}`:"1px solid rgba(255,255,255,0.07)",transition:"all 0.15s"}}>{f}</button>))}
          </div>
          <div style={{marginLeft:"auto",fontSize:11,color:"rgba(255,255,255,0.25)",fontWeight:600}}>{filtered.length} players</div>
        </div>

        <div style={{background:"linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              {["PICK","PLAYER","POS","TEAM","FS","VALUE","TREND","RD",""].map(h=>(<th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,color:"rgba(255,255,255,0.18)",fontWeight:700,letterSpacing:"0.1em"}}>{h}</th>))}
            </tr></thead>
            <tbody>
              {filtered.map(p=>{
                const picked=myPicks.includes(p.pick);
                return(
                  <tr key={p.pick} style={{borderBottom:"1px solid rgba(255,255,255,0.03)",background:picked?"rgba(96,165,250,0.04)":"transparent",transition:"background 0.1s"}}
                    onMouseEnter={e=>{if(!picked)(e.currentTarget.style.background="rgba(255,255,255,0.012)")}}
                    onMouseLeave={e=>{if(!picked)(e.currentTarget.style.background="transparent")}}>
                    <td style={{padding:"11px 14px",fontWeight:800,fontSize:13,color:p.pick<=10?"#f59e0b":p.pick<=20?"#9ca3af":"rgba(255,255,255,0.25)"}}> #{p.pick}</td>
                    <td style={{padding:"11px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:32,height:24,objectFit:"cover",objectPosition:"top",borderRadius:6,border:"1px solid rgba(255,255,255,0.07)"}}/>
                        <span style={{color:"#fff",fontWeight:700,fontSize:13}}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{padding:"11px 14px"}}><span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.06)",fontWeight:700}}>{p.pos}</span></td>
                    <td style={{padding:"11px 14px",fontSize:12,color:"rgba(255,255,255,0.3)",fontWeight:600}}>{p.team}</td>
                    <td style={{padding:"11px 14px",fontWeight:800,fontSize:14,color:fsColor(p.fs)}}>{p.fs}</td>
                    <td style={{padding:"11px 14px"}}><span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:`${valColor(p.value)}15`,color:valColor(p.value),border:`1px solid ${valColor(p.value)}30`,fontWeight:700}}>{p.value}</span></td>
                    <td style={{padding:"11px 14px",fontSize:16,color:trendColor(p.trend),fontWeight:900}}>{p.trend}</td>
                    <td style={{padding:"11px 14px",fontSize:11,color:"rgba(255,255,255,0.25)",fontWeight:600}}>Rd {p.round}</td>
                    <td style={{padding:"11px 14px"}}>
                      <button onClick={()=>toggle(p.pick)} style={{background:picked?"rgba(96,165,250,0.12)":"rgba(255,255,255,0.04)",border:picked?"1px solid rgba(96,165,250,0.3)":"1px solid rgba(255,255,255,0.07)",color:picked?"#60a5fa":"rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:10,fontWeight:700,letterSpacing:"0.04em",transition:"all 0.15s"}}>
                        {picked?"✓ ADDED":"+ PICK"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
