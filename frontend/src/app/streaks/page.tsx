"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";
import { searchPlayers } from "@/lib/api";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000" });

export default function StreaksPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const search = async (v: string) => {
    setQ(v);
    if (v.length<2){setResults([]);return;}
    const res = await searchPlayers(v).catch(()=>({data:[]}));
    setResults((res as any).data||[]);
  };

  const load = async (player: any) => {
    setSelected(player);setResults([]);setQ("");setLoading(true);
    const res = await api.get(`/api/streaks/${player.id}`).catch(()=>null);
    setData(res?.data||null);setLoading(false);
  };

  const chartData = data?.games?.slice().reverse().map((g:any,i:number)=>({
    game:i+1, fs:g.fantasy_score, pts:g.pts, date:g.date?.slice(0,5), matchup:g.matchup, wl:g.wl,
  }))||[];

  const CustomTooltip=({active,payload}:any)=>{
    if(!active||!payload?.length) return null;
    const d=payload[0].payload;
    return(
      <div style={{background:"#0f0f1a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"10px 14px"}}>
        <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,marginBottom:4}}>{d.matchup} {d.wl==="W"?"✓":"✗"}</div>
        <div style={{color:"#a78bfa",fontWeight:800,fontSize:18}}>{d.fs} FS</div>
        <div style={{color:"rgba(255,255,255,0.3)",fontSize:11}}>{d.date}</div>
      </div>
    );
  };

  return (
    <main style={{minHeight:"100vh",background:"transparent"}}>
      <NavBar/>
      <div style={{position:"fixed",top:"20%",right:"5%",width:400,height:400,background:"radial-gradient(circle,rgba(245,158,11,0.03) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:10,color:"rgba(245,158,11,0.6)",letterSpacing:"0.2em",fontWeight:700,marginBottom:6}}>PERFORMANCE ANALYTICS</div>
          <h1 style={{fontSize:34,fontWeight:900,lineHeight:1,letterSpacing:"-0.02em",marginBottom:6,background:"linear-gradient(135deg,#f59e0b 0%,#f97316 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Streak Detector</h1>
          <p style={{color:"rgba(255,255,255,0.28)",fontSize:13}}>Fantasy score timeline · Hot/cold streak detection vs season average</p>
        </div>
        <div style={{position:"relative",marginBottom:28}}>
          <input type="text" value={q} onChange={e=>search(e.target.value)} placeholder="Search any NBA player..."
            style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:12,padding:"13px 18px",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          {results.length>0&&(
            <div style={{position:"absolute",top:"100%",marginTop:6,width:"100%",background:"#0f0f1a",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,overflow:"hidden",zIndex:20}}>
              {results.slice(0,6).map(r=>(
                <button key={r.id} onClick={()=>load(r)}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 16px",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(245,158,11,0.06)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                  <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${r.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:28,height:21,objectFit:"cover",objectPosition:"top",borderRadius:5}}/>
                  <span style={{color:"#fff",fontWeight:600,fontSize:13}}>{r.first_name} {r.last_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {loading&&<div style={{textAlign:"center",padding:60,color:"rgba(255,255,255,0.3)",fontSize:14}}>Loading streak data...</div>}
        {data&&selected&&!loading&&(
          <div>
            <div style={{background:`${data.color}10`,border:`1px solid ${data.color}30`,borderRadius:16,padding:"20px 24px",marginBottom:20,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
              <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${selected.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:56,height:42,objectFit:"cover",objectPosition:"top",borderRadius:10}}/>
              <div style={{flex:1}}>
                <div style={{color:"#fff",fontWeight:800,fontSize:18,marginBottom:4}}>{selected.first_name} {selected.last_name}</div>
                <div style={{fontSize:22,fontWeight:900,color:data.color}}>{data.streak_label}</div>
              </div>
              <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                {[["Season Avg",data.season_avg_fs],["Last 5 Avg",data.last5_avg_fs],["Last 3 Avg",data.last3_avg_fs],["vs Avg",`${data.diff_from_avg>0?"+":""}${data.diff_from_avg}`]].map(([label,val])=>(
                  <div key={label as string} style={{textAlign:"center"}}>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em",marginBottom:4}}>{label}</div>
                    <div style={{fontSize:20,fontWeight:900,color:label==="vs Avg"?(data.diff_from_avg>0?"#22c55e":"#ef4444"):"#fff"}}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:"20px 16px",marginBottom:20}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:"0.08em",fontWeight:700,marginBottom:16,paddingLeft:8}}>FANTASY SCORE — LAST 10 GAMES</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{fill:"rgba(255,255,255,0.2)",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"rgba(255,255,255,0.2)",fontSize:10}} axisLine={false} tickLine={false} width={32}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <ReferenceLine y={data.season_avg_fs} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4"/>
                  <Line type="monotone" dataKey="fs" stroke={data.color} strokeWidth={2.5} dot={{fill:data.color,r:4}} activeDot={{r:6}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:"0.08em",fontWeight:700,marginBottom:12}}>LAST 5 GAMES</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
              {data.games?.slice(0,5).map((g:any,i:number)=>{
                const fs=g.fantasy_score||0;
                const c=fs>=data.season_avg_fs*1.1?"#22c55e":fs<=data.season_avg_fs*0.9?"#ef4444":"#f59e0b";
                return(
                  <div key={i} style={{background:`${c}08`,border:`1px solid ${c}20`,borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",marginBottom:6}}>{g.matchup?.slice(-3)}</div>
                    <div style={{fontSize:20,fontWeight:900,color:c}}>{fs}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",marginTop:4}}>FS</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginTop:4}}>{g.pts}pts {g.ast}ast {g.reb}reb</div>
                    <div style={{fontSize:10,color:g.wl==="W"?"#22c55e":"#ef4444",fontWeight:700,marginTop:4}}>{g.wl}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
