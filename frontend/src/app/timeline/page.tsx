"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";
import { searchPlayers } from "@/lib/api";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const api = axios.create({ baseURL: "http://localhost:8000" });

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"#111118",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 14px"}}>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:5}}>{label}</div>
      {payload.map((p:any) => <div key={p.dataKey} style={{fontSize:13,fontWeight:700,color:p.color}}>{p.name}: {p.value}</div>)}
    </div>
  );
};

const STATS = [
  {key:"fantasy_score",label:"Fantasy Score",color:"#a78bfa"},
  {key:"pts",label:"Points",color:"#60a5fa"},
  {key:"ast",label:"Assists",color:"#34d399"},
  {key:"reb",label:"Rebounds",color:"#f59e0b"},
  {key:"stl",label:"Steals",color:"#f472b6"},
  {key:"blk",label:"Blocks",color:"#fb923c"},
];

export default function TimelinePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeStat, setActiveStat] = useState("fantasy_score");

  const search = async (q: string) => {
    setQuery(q);
    if(q.length<2){setResults([]);return;}
    const d = await searchPlayers(q).catch(()=>({data:[]}));
    setResults((d as any).data||[]);
  };

  const select = async (p: any) => {
    setSelected(p); setResults([]); setQuery(""); setLoading(true);
    try { const {data:d}=await api.get(`/api/timeline/${p.id}`); setData(d); }
    catch {} finally { setLoading(false); }
  };

  const activeDef = STATS.find(s=>s.key===activeStat)||STATS[0];
  const chartData = data?.timeline?.map((s:any)=>({...s,season:s.season.slice(-3)})) || [];

  return (
    <main style={{minHeight:"100vh",background:"#07070e"}}>
      <NavBar/>
      <div style={{position:"fixed",top:"15%",right:"10%",width:500,height:500,background:"radial-gradient(circle,rgba(167,139,250,0.03) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"40px 24px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:10,color:"rgba(167,139,250,0.6)",letterSpacing:"0.2em",fontWeight:700,marginBottom:6}}>CAREER PROGRESSION</div>
          <h1 style={{fontSize:34,fontWeight:900,lineHeight:1,letterSpacing:"-0.02em",marginBottom:6,background:"linear-gradient(135deg,#a78bfa 0%,#60a5fa 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Season Timeline</h1>
          <p style={{color:"rgba(255,255,255,0.28)",fontSize:13}}>Career stat progression — peaks, valleys, and development arcs</p>
        </div>
        <div style={{position:"relative",marginBottom:24}}>
          <input type="text" value={query} onChange={e=>search(e.target.value)} placeholder="Search any NBA player..."
            style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 18px",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          {results.length>0&&(
            <div style={{position:"absolute",top:"100%",marginTop:5,width:"100%",background:"#111118",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,overflow:"hidden",zIndex:10}}>
              {results.slice(0,6).map(r=>(
                <button key={r.id} onClick={()=>select(r)}
                  style={{width:"100%",textAlign:"left",padding:"11px 15px",background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:9,borderBottom:"1px solid rgba(255,255,255,0.04)"}}
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.04)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                  <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${r.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:26,height:19,objectFit:"cover",objectPosition:"top",borderRadius:4}}/>
                  {r.first_name} {r.last_name}
                </button>
              ))}
            </div>
          )}
        </div>
        {loading&&<div style={{textAlign:"center",padding:80,color:"rgba(255,255,255,0.3)"}}>Loading career data...</div>}
        {data&&selected&&!loading&&(
          <>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
              <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${selected.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:52,height:39,objectFit:"cover",objectPosition:"top",borderRadius:9,border:"1px solid rgba(255,255,255,0.08)"}}/>
              <div>
                <div style={{fontSize:20,fontWeight:900,color:"#fff"}}>{selected.first_name} {selected.last_name}</div>
                <div style={{color:"rgba(255,255,255,0.3)",fontSize:12}}>{data.position||"—"} · {data.total_seasons} seasons · Peak: {data.peak_season?.season} ({data.peak_season?.fantasy_score} FS)</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:7,marginBottom:16}}>
              {["pts","ast","reb","stl","blk","fantasy_score"].map(k=>(
                <div key={k} style={{background:"linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:11,padding:"11px",textAlign:"center"}}>
                  <div style={{fontSize:17,fontWeight:900,color:"#fff"}}>{data.career_averages?.[k]||"—"}</div>
                  <div style={{fontSize:8,color:"rgba(255,255,255,0.2)",letterSpacing:"0.1em",marginTop:2}}>{k.toUpperCase().replace("_SCORE"," FS")}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
              {STATS.map(s=>(
                <button key={s.key} onClick={()=>setActiveStat(s.key)}
                  style={{padding:"4px 12px",borderRadius:20,fontSize:10,fontWeight:700,cursor:"pointer",background:activeStat===s.key?`${s.color}18`:"rgba(255,255,255,0.04)",color:activeStat===s.key?s.color:"rgba(255,255,255,0.3)",border:activeStat===s.key?`1px solid ${s.color}40`:"1px solid rgba(255,255,255,0.06)",transition:"all 0.15s"}}>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{background:"linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:"20px 12px 12px"}}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{top:5,right:16,left:0,bottom:5}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                  <XAxis dataKey="season" tick={{fill:"rgba(255,255,255,0.22)",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"rgba(255,255,255,0.22)",fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Line type="monotone" dataKey={activeStat} name={activeDef.label} stroke={activeDef.color} strokeWidth={2.5} dot={{fill:activeDef.color,r:3}} activeDot={{r:5,fill:activeDef.color}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:"linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,overflow:"hidden",marginTop:12}}>
              <div style={{padding:"11px 16px",borderBottom:"1px solid rgba(255,255,255,0.05)",fontSize:11,fontWeight:700,background:"rgba(255,255,255,0.015)"}}>Season Log</div>
              <div style={{maxHeight:280,overflowY:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    {["SEASON","TEAM","GP","PTS","AST","REB","STL","BLK","FG%","FS"].map(h=>(
                      <th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:8,color:"rgba(255,255,255,0.18)",fontWeight:700,letterSpacing:"0.1em",position:"sticky",top:0,background:"#0d0d18"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[...data.timeline].reverse().map((s:any)=>(
                      <tr key={s.season} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.012)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                        <td style={{padding:"8px 12px",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.65)"}}>{s.season}</td>
                        <td style={{padding:"8px 12px",fontSize:11,color:"rgba(255,255,255,0.3)"}}>{s.team}</td>
                        <td style={{padding:"8px 12px",fontSize:11,color:"rgba(255,255,255,0.4)"}}>{s.gp}</td>
                        {["pts","ast","reb","stl","blk"].map(k=><td key={k} style={{padding:"8px 12px",fontSize:11,color:"rgba(255,255,255,0.55)"}}>{s[k]}</td>)}
                        <td style={{padding:"8px 12px",fontSize:11,color:"rgba(255,255,255,0.55)"}}>{(s.fg_pct*100).toFixed(1)}%</td>
                        <td style={{padding:"8px 12px",fontSize:12,fontWeight:800,color:s.fantasy_score>=60?"#a78bfa":s.fantasy_score>=50?"#22c55e":s.fantasy_score>=40?"#f59e0b":"#ef4444"}}>{s.fantasy_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {!selected&&!loading&&(
          <div style={{textAlign:"center",padding:80,color:"rgba(255,255,255,0.15)"}}>
            <div style={{fontSize:44,marginBottom:10}}>📈</div>
            <div style={{fontSize:14,marginBottom:4}}>Search any NBA player to see their career arc</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.1)"}}>Full career with interactive line charts</div>
          </div>
        )}
      </div>
    </main>
  );
}
