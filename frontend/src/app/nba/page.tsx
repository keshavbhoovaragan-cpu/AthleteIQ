"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";
import PageHeader from "@/components/ui/PageHeader";

const STAT_CATS = [
  {key:"pts",label:"Scoring", unit:"PPG"},
  {key:"ast",label:"Assists", unit:"APG"},
  {key:"reb",label:"Rebounds",unit:"RPG"},
  {key:"stl",label:"Steals",  unit:"SPG"},
  {key:"blk",label:"Blocks",  unit:"BPG"},
];

const CURRENT: Record<string,any[]> = {
  pts:[
    {id:1628983,name:"Shai Gilgeous-Alexander",team:"OKC",pos:"G",  value:32.7},
    {id:203507, name:"Giannis Antetokounmpo",  team:"MIL",pos:"F",  value:30.4},
    {id:1630162,name:"Anthony Edwards",         team:"MIN",pos:"G",  value:28.8},
    {id:1629029,name:"Luka Doncic",             team:"LAL",pos:"G-F",value:28.1},
    {id:1626164,name:"Devin Booker",            team:"PHX",pos:"G",  value:27.3},
    {id:201142, name:"Kevin Durant",            team:"PHX",pos:"F",  value:27.1},
    {id:1628369,name:"Jayson Tatum",            team:"BOS",pos:"F",  value:26.9},
    {id:201939, name:"Stephen Curry",           team:"GSW",pos:"G",  value:26.6},
    {id:203999, name:"Nikola Jokic",            team:"DEN",pos:"C",  value:26.4},
    {id:1628973,name:"Jalen Brunson",           team:"NYK",pos:"G",  value:25.9},
    {id:1641705,name:"Victor Wembanyama",        team:"SAS",pos:"C",  value:25.0},
    {id:1630595,name:"Cade Cunningham",          team:"DET",pos:"G",  value:24.5},
    {id:1626157,name:"Karl-Anthony Towns",       team:"NYK",pos:"C",  value:24.4},
    {id:1628378,name:"Donovan Mitchell",         team:"CLE",pos:"G",  value:24.9},
    {id:203081, name:"Damian Lillard",          team:"MIL",pos:"G",  value:24.3},
  ],
  ast:[
    {id:1629027,name:"Trae Young",              team:"ATL",pos:"G",  value:11.0},
    {id:1630169,name:"Tyrese Haliburton",        team:"IND",pos:"G",  value:10.9},
    {id:2544,   name:"LeBron James",            team:"LAL",pos:"F",  value:9.2},
    {id:203999, name:"Nikola Jokic",            team:"DEN",pos:"C",  value:9.0},
    {id:201935, name:"James Harden",            team:"LAC",pos:"G",  value:8.5},
    {id:1629029,name:"Luka Doncic",             team:"LAL",pos:"G-F",value:8.3},
    {id:1630595,name:"Cade Cunningham",          team:"DET",pos:"G",  value:8.4},
    {id:1628973,name:"Jalen Brunson",           team:"NYK",pos:"G",  value:7.7},
    {id:203081, name:"Damian Lillard",          team:"MIL",pos:"G",  value:7.4},
    {id:1629636,name:"Darius Garland",          team:"CLE",pos:"G",  value:6.9},
    {id:1628983,name:"Shai Gilgeous-Alexander", team:"OKC",pos:"G",  value:6.4},
    {id:1631094,name:"Paolo Banchero",          team:"ORL",pos:"F",  value:5.4},
    {id:203507, name:"Giannis Antetokounmpo",   team:"MIL",pos:"F",  value:5.4},
    {id:1628369,name:"Jayson Tatum",            team:"BOS",pos:"F",  value:5.3},
    {id:1627832,name:"Fred VanVleet",           team:"HOU",pos:"G",  value:6.3},
  ],
  reb:[
    {id:1627734,name:"Domantas Sabonis",         team:"SAC",pos:"C",  value:14.4},
    {id:203999, name:"Nikola Jokic",            team:"DEN",pos:"C",  value:12.9},
    {id:203497, name:"Rudy Gobert",             team:"MIN",pos:"C",  value:12.9},
    {id:203507, name:"Giannis Antetokounmpo",   team:"MIL",pos:"F",  value:11.9},
    {id:1641705,name:"Victor Wembanyama",        team:"SAS",pos:"C",  value:11.5},
    {id:203076, name:"Anthony Davis",           team:"DAL",pos:"F-C",value:11.1},
    {id:1628389,name:"Bam Adebayo",             team:"MIA",pos:"C",  value:10.4},
    {id:1628369,name:"Jayson Tatum",            team:"BOS",pos:"F",  value:10.0},
    {id:1630578,name:"Alperen Sengun",           team:"HOU",pos:"C",  value:9.4},
    {id:1630596,name:"Evan Mobley",             team:"CLE",pos:"F-C",value:9.4},
    {id:1631117,name:"Walker Kessler",           team:"UTA",pos:"C",  value:9.0},
    {id:203944, name:"Julius Randle",           team:"MIN",pos:"F",  value:9.7},
    {id:1629651,name:"Nic Claxton",             team:"BKN",pos:"C",  value:8.4},
    {id:1626157,name:"Karl-Anthony Towns",       team:"NYK",pos:"C",  value:8.3},
    {id:1629028,name:"Deandre Ayton",           team:"POR",pos:"C",  value:9.2},
  ],
  stl:[
    {id:1628983,name:"Shai Gilgeous-Alexander", team:"OKC",pos:"G",  value:2.0},
    {id:1627749,name:"Dejounte Murray",          team:"ATL",pos:"G",  value:2.0},
    {id:1628384,name:"OG Anunoby",              team:"NYK",pos:"F",  value:1.9},
    {id:1627832,name:"Fred VanVleet",           team:"HOU",pos:"G",  value:1.7},
    {id:1628378,name:"Donovan Mitchell",         team:"CLE",pos:"G",  value:1.7},
    {id:1629027,name:"Trae Young",              team:"ATL",pos:"G",  value:1.7},
    {id:202710, name:"Jimmy Butler",            team:"MIA",pos:"F",  value:1.6},
    {id:202695, name:"Kawhi Leonard",           team:"LAC",pos:"F",  value:1.6},
    {id:1630169,name:"Tyrese Haliburton",        team:"IND",pos:"G",  value:1.6},
    {id:1629029,name:"Luka Doncic",             team:"LAL",pos:"G-F",value:1.6},
    {id:1630595,name:"Cade Cunningham",          team:"DET",pos:"G",  value:1.6},
    {id:1628369,name:"Jayson Tatum",            team:"BOS",pos:"F",  value:1.4},
    {id:1630162,name:"Anthony Edwards",          team:"MIN",pos:"G",  value:1.4},
    {id:203999, name:"Nikola Jokic",            team:"DEN",pos:"C",  value:1.4},
    {id:2544,   name:"LeBron James",            team:"LAL",pos:"F",  value:1.3},
  ],
  blk:[
    {id:1641705,name:"Victor Wembanyama",        team:"SAS",pos:"C",  value:3.6},
    {id:1628991,name:"Jaren Jackson Jr.",        team:"MEM",pos:"F-C",value:2.5},
    {id:203076, name:"Anthony Davis",           team:"DAL",pos:"F-C",value:2.4},
    {id:1629651,name:"Nic Claxton",             team:"BKN",pos:"C",  value:2.3},
    {id:1631117,name:"Walker Kessler",           team:"UTA",pos:"C",  value:2.3},
    {id:1626167,name:"Myles Turner",            team:"IND",pos:"C",  value:2.2},
    {id:203497, name:"Rudy Gobert",             team:"MIN",pos:"C",  value:2.1},
    {id:201572, name:"Brook Lopez",             team:"MIL",pos:"C",  value:2.0},
    {id:1631096,name:"Chet Holmgren",           team:"OKC",pos:"C",  value:2.0},
    {id:1630578,name:"Alperen Sengun",           team:"HOU",pos:"C",  value:1.9},
    {id:1630596,name:"Evan Mobley",             team:"CLE",pos:"F-C",value:1.7},
    {id:1629655,name:"Daniel Gafford",          team:"DAL",pos:"C",  value:1.7},
    {id:201142, name:"Kevin Durant",            team:"PHX",pos:"F",  value:1.1},
    {id:1628389,name:"Bam Adebayo",             team:"MIA",pos:"C",  value:1.1},
    {id:201143, name:"Al Horford",              team:"BOS",pos:"C",  value:0.9},
  ],
};

const ALL_TIME: Record<string,any[]> = {
  pts:[
    {name:"Michael Jordan",     pos:"G",value:30.1,era:"1984-03"},
    {name:"Wilt Chamberlain",   pos:"C",value:30.1,era:"1959-73"},
    {name:"Kevin Durant",       pos:"F",value:27.3,era:"2007-"},
    {name:"LeBron James",       pos:"F",value:27.2,era:"2003-"},
    {name:"Elgin Baylor",       pos:"F",value:27.4,era:"1958-72"},
    {name:"Jerry West",         pos:"G",value:27.0,era:"1960-74"},
    {name:"Oscar Robertson",    pos:"G",value:25.7,era:"1960-74"},
    {name:"Kobe Bryant",        pos:"G",value:25.0,era:"1996-16"},
    {name:"Karl Malone",        pos:"F",value:25.0,era:"1985-04"},
    {name:"Dominique Wilkins",  pos:"F",value:24.8,era:"1982-99"},
    {name:"Allen Iverson",      pos:"G",value:26.7,era:"1996-10"},
    {name:"Kareem Abdul-Jabbar",pos:"C",value:24.6,era:"1969-89"},
    {name:"Carmelo Anthony",    pos:"F",value:22.5,era:"2003-22"},
    {name:"Bob Pettit",         pos:"F",value:26.4,era:"1954-65"},
    {name:"Dwyane Wade",        pos:"G",value:22.0,era:"2003-19"},
  ],
  ast:[
    {name:"Magic Johnson",      pos:"G",value:11.2,era:"1979-96"},
    {name:"John Stockton",      pos:"G",value:10.5,era:"1984-03"},
    {name:"Oscar Robertson",    pos:"G",value:9.5, era:"1960-74"},
    {name:"Isiah Thomas",       pos:"G",value:9.3, era:"1981-94"},
    {name:"Chris Paul",         pos:"G",value:9.4, era:"2005-"},
    {name:"Kevin Johnson",      pos:"G",value:9.1, era:"1987-00"},
    {name:"Jason Kidd",         pos:"G",value:8.7, era:"1994-13"},
    {name:"Steve Nash",         pos:"G",value:8.5, era:"1996-14"},
    {name:"Russell Westbrook",  pos:"G",value:8.5, era:"2008-"},
    {name:"Mark Jackson",       pos:"G",value:8.0, era:"1987-04"},
    {name:"Rajon Rondo",        pos:"G",value:8.0, era:"2006-21"},
    {name:"Rod Strickland",     pos:"G",value:7.3, era:"1988-05"},
    {name:"LeBron James",       pos:"F",value:7.4, era:"2003-"},
    {name:"Bob Cousy",          pos:"G",value:7.5, era:"1950-70"},
    {name:"Deron Williams",     pos:"G",value:8.0, era:"2005-16"},
  ],
  reb:[
    {name:"Wilt Chamberlain",   pos:"C",value:22.9,era:"1959-73"},
    {name:"Bill Russell",       pos:"C",value:22.5,era:"1956-69"},
    {name:"Bob Pettit",         pos:"F",value:16.2,era:"1954-65"},
    {name:"Jerry Lucas",        pos:"F",value:15.6,era:"1963-74"},
    {name:"Nate Thurmond",      pos:"C",value:15.0,era:"1963-77"},
    {name:"Walt Bellamy",       pos:"C",value:13.7,era:"1961-74"},
    {name:"Dave Cowens",        pos:"C",value:13.6,era:"1970-83"},
    {name:"Elgin Baylor",       pos:"F",value:13.5,era:"1958-72"},
    {name:"Bill Bridges",       pos:"F",value:13.4,era:"1962-75"},
    {name:"Dennis Rodman",      pos:"F",value:13.1,era:"1986-00"},
    {name:"Dwight Howard",      pos:"C",value:12.5,era:"2004-22"},
    {name:"Moses Malone",       pos:"C",value:12.2,era:"1974-95"},
    {name:"Kareem Abdul-Jabbar",pos:"C",value:11.2,era:"1969-89"},
    {name:"Charles Barkley",    pos:"F",value:11.7,era:"1984-00"},
    {name:"Tim Duncan",         pos:"F-C",value:10.8,era:"1997-16"},
  ],
  stl:[
    {name:"Alvin Robertson",    pos:"G",value:2.7, era:"1984-96"},
    {name:"Michael Jordan",     pos:"G",value:2.3, era:"1984-03"},
    {name:"John Stockton",      pos:"G",value:2.2, era:"1984-03"},
    {name:"Maurice Cheeks",     pos:"G",value:2.1, era:"1978-93"},
    {name:"Fat Lever",          pos:"G",value:2.1, era:"1982-94"},
    {name:"Chris Paul",         pos:"G",value:2.1, era:"2005-"},
    {name:"Scottie Pippen",     pos:"F",value:2.0, era:"1987-04"},
    {name:"Clyde Drexler",      pos:"G",value:2.0, era:"1983-98"},
    {name:"Magic Johnson",      pos:"G",value:1.9, era:"1979-96"},
    {name:"Jason Kidd",         pos:"G",value:1.9, era:"1994-13"},
    {name:"Gary Payton",        pos:"G",value:1.8, era:"1990-07"},
    {name:"Kawhi Leonard",      pos:"F",value:1.8, era:"2011-"},
    {name:"Larry Bird",         pos:"F",value:1.7, era:"1979-92"},
    {name:"LeBron James",       pos:"F",value:1.6, era:"2003-"},
    {name:"Jimmy Butler",       pos:"F",value:1.7, era:"2011-"},
  ],
  blk:[
    {name:"Mark Eaton",         pos:"C",value:3.5, era:"1982-93"},
    {name:"Manute Bol",         pos:"C",value:3.3, era:"1985-95"},
    {name:"Hakeem Olajuwon",    pos:"C",value:3.1, era:"1984-02"},
    {name:"David Robinson",     pos:"C",value:3.0, era:"1989-03"},
    {name:"Dikembe Mutombo",    pos:"C",value:2.8, era:"1991-09"},
    {name:"Alonzo Mourning",    pos:"C",value:2.8, era:"1992-08"},
    {name:"Tree Rollins",       pos:"C",value:2.6, era:"1977-95"},
    {name:"Kareem Abdul-Jabbar",pos:"C",value:2.6, era:"1969-89"},
    {name:"Jaren Jackson Jr.",  pos:"F-C",value:2.5,era:"2018-"},
    {name:"Patrick Ewing",      pos:"C",value:2.4, era:"1985-02"},
    {name:"Victor Wembanyama",  pos:"C",value:3.6, era:"2023-"},
    {name:"Serge Ibaka",        pos:"F-C",value:2.1,era:"2009-22"},
    {name:"Tim Duncan",         pos:"F-C",value:2.2,era:"1997-16"},
    {name:"Shaquille O'Neal",   pos:"C",value:2.3, era:"1992-11"},
    {name:"Dwight Howard",      pos:"C",value:2.2, era:"2004-22"},
  ],
};

const POS_FILTERS = ["All","G","F","C","G-F","F-C"];

export default function NBAPage() {
  const [activeStat, setActiveStat] = useState("pts");
  const [era, setEra] = useState<"current"|"alltime">("current");
  const [posFilter, setPosFilter] = useState("All");

  const posMatch=(pos:string)=>posFilter==="All"||pos===posFilter||pos.includes(posFilter);
  const rawData = era==="current" ? CURRENT[activeStat] : ALL_TIME[activeStat];
  const data = rawData.filter(p=>posMatch(p.pos));
  const maxVal = data.length ? Math.max(...data.map(p=>p.value)) : 1;
  const cat = STAT_CATS.find(s=>s.key===activeStat)!;
  const medalColor=(i:number)=>i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#cd7c4c":"var(--text-dim)";

  return (
    <main style={{minHeight:"100vh"}}>
      <NavBar/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"36px 24px",position:"relative",zIndex:1}}>
        <PageHeader eyebrow="2024-25 NBA Season" title="Statistical Leaders" titleGradient="blue" subtitle="Top 15 leaders per category — current season and all-time career averages"/>

        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {[["current","2024-25 Season"],["alltime","All-Time Career"]].map(([v,label])=>(
            <button key={v} onClick={()=>setEra(v as any)} style={{padding:"8px 20px",borderRadius:20,fontSize:13,fontWeight:700,cursor:"pointer",background:era===v?(v==="current"?"#60a5fa":"#a78bfa"):"var(--surface)",color:era===v?"#000":"var(--text-muted)",border:era===v?"none":"1px solid var(--border)",transition:"all 0.15s",fontFamily:"inherit"}}>{label}</button>
          ))}
        </div>

        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
          {STAT_CATS.map(s=>(
            <button key={s.key} onClick={()=>setActiveStat(s.key)} style={{padding:"7px 18px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",background:activeStat===s.key?"var(--surface-hover)":"transparent",color:activeStat===s.key?"var(--text)":"var(--text-muted)",border:activeStat===s.key?"1px solid var(--border-bright)":"1px solid transparent",transition:"all 0.15s",fontFamily:"inherit"}}>{s.label}</button>
          ))}
        </div>

        <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
          {POS_FILTERS.map(p=>(<button key={p} onClick={()=>setPosFilter(p)} className={posFilter===p?"pill active":"pill"}>{p}</button>))}
        </div>

        {/* Top 3 podium */}
        {data.length>=3&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.15fr 1fr",gap:8,marginBottom:16}}>
            {[data[1],data[0],data[2]].map((p,idx)=>{
              const realRank=idx===0?2:idx===1?1:3;
              const c=["#9ca3af","#f59e0b","#cd7c4c"][idx];
              const h=["140px","164px","124px"][idx];
              return(
                <div key={p.id||p.name} style={{background:`${c}08`,border:`1px solid ${c}25`,borderRadius:14,padding:"16px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:h,boxShadow:`0 0 24px ${c}10`}}>
                  <div style={{fontSize:18,marginBottom:6}}>{realRank===1?"🥇":realRank===2?"🥈":"🥉"}</div>
                  {p.id&&<img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:40,height:30,objectFit:"cover",objectPosition:"top",borderRadius:7,marginBottom:7}}/>}
                  <div style={{color:"var(--text)",fontWeight:800,fontSize:12,marginBottom:3,lineHeight:1.2}}>{p.name.split(" ").slice(-1)[0]}</div>
                  <div style={{fontSize:22,fontWeight:900,color:c,lineHeight:1}}>{p.value}</div>
                  <div style={{fontSize:9,color:"var(--text-dim)",marginTop:2}}>{cat.unit}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full list with bar charts */}
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.06)"}}>
          <div className="table-header">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontWeight:700,fontSize:13}}>{cat.label} Leaders</span>
              <span style={{fontSize:11,color:"var(--text-dim)"}}>· {data.length} players</span>
            </div>
            <span style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.06em"}}>{era==="alltime"?"ALL-TIME":"2024-25"} · {cat.unit}</span>
          </div>
          {data.map((p,i)=>(
            <div key={p.id||p.name} style={{display:"grid",gridTemplateColumns:"32px 44px 1fr 64px",alignItems:"center",gap:12,padding:"10px 20px",borderBottom:"1px solid rgba(255,255,255,0.028)",transition:"background 0.1s"}}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.018)")}
              onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
              <div style={{fontSize:13,fontWeight:800,color:medalColor(i),textAlign:"center"}}>{i+1}</div>
              <div style={{width:44,height:33,borderRadius:8,overflow:"hidden",flexShrink:0,background:"rgba(255,255,255,0.04)",border:"1px solid var(--border)"}}>
                {p.id?(
                  <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}}/>
                ):(
                  <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"var(--text-dim)",fontWeight:700}}>{p.name.split(" ").map((w:string)=>w[0]).join("").slice(0,2)}</div>
                )}
              </div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{color:"var(--text)",fontWeight:700,fontSize:13}}>{p.name}</span>
                  <span style={{fontSize:10,color:"var(--text-dim)"}}>{p.team||p.era}</span>
                  <span style={{fontSize:9,padding:"1px 5px",borderRadius:4,background:"rgba(255,255,255,0.05)",color:"var(--text-dim)",border:"1px solid var(--border)"}}>{p.pos}</span>
                </div>
                <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(p.value/maxVal)*100}%`,borderRadius:2,transition:"width 0.3s ease",background:i===0?"linear-gradient(90deg,#a78bfa,#f472b6)":i<3?"linear-gradient(90deg,#60a5fa,#a78bfa)":"rgba(255,255,255,0.2)"}}/>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:20,fontWeight:900,color:i===0?"#a78bfa":i<3?"#60a5fa":"var(--text)",letterSpacing:"-0.02em",lineHeight:1}}>{p.value}</div>
                <div style={{fontSize:9,color:"var(--text-dim)",marginTop:2}}>{cat.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
