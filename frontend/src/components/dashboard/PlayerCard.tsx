"use client";
import { useEffect, useState } from "react";
import { getCareerStats, getRecentGames } from "@/lib/api";
import { Player } from "@/types/player";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

interface Props { player: Player; }

const TEAM_COLORS: Record<string, string> = {
  LAL:"#552583",GSW:"#1D428A",BOS:"#007A33",MIA:"#98002E",CHI:"#CE1141",
  NYK:"#F58426",BKN:"#000000",PHX:"#1D1160",DAL:"#00538C",MIL:"#00471B",
  DEN:"#0E2240",PHI:"#006BB6",CLE:"#860038",OKC:"#007AC1",MEM:"#5D76A9",
  ATL:"#E03A3E",SAC:"#5A2D81",POR:"#E03A3E",MIN:"#0C2340",NOP:"#0C2340",
  IND:"#002D62",WAS:"#002B5C",CHA:"#1D1160",ORL:"#0077C0",SAS:"#C4CED4",
  UTA:"#002B5C",TOR:"#CE1141",HOU:"#CE1141",DET:"#C8102E",LAC:"#C8102E",
};

export default function PlayerCard({ player }: Props) {
  const [career, setCareer] = useState<any>(null);
  const [recent, setRecent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview"|"career"|"recent"|"predict">("overview");
  const [statKey, setStatKey] = useState<"pts"|"ast"|"reb"|"fantasy_score">("pts");
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    setLoading(true); setCareer(null); setRecent(null); setImgErr(false);
    Promise.all([getCareerStats(player.id).catch(()=>null), getRecentGames(player.id).catch(()=>null)])
      .then(([c,r]) => { setCareer(c); setRecent(r); setLoading(false); });
  }, [player.id]);

  const latest = career?.seasons?.[career.seasons.length-1];
  const prediction = career?.prediction;
  const photoUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`;
  const currentTeam = latest?.team || "NBA";
  const teamColor = TEAM_COLORS[currentTeam] || "#3B82F6";
  const fsColor = (s:number) => s>=50?"#22c55e":s>=35?"#f59e0b":"#ef4444";
  const fsGrade = (s:number) => s>=60?"S":s>=50?"A":s>=40?"B":s>=30?"C":"D";

  const streak = () => {
    if (!recent?.games?.length || !latest) return null;
    const avg = recent.games.slice(0,5).reduce((a:number,g:any)=>a+g.pts,0)/Math.min(recent.games.length,5);
    const diff = avg - latest.pts;
    if (diff>3) return {label:"Hot streak",icon:"🔥",color:"#f97316"};
    if (diff<-3) return {label:"Cold streak",icon:"🥶",color:"#60a5fa"};
    return {label:"On pace",icon:"📊",color:"rgba(255,255,255,0.4)"};
  };

  if (loading) return (
    <div style={{ background:"#111118",border:"1px solid rgba(255,255,255,0.06)",borderRadius:20,padding:40,textAlign:"center",color:"rgba(255,255,255,0.3)",fontSize:14 }}>
      Loading career data... first load takes 5–10 seconds
    </div>
  );

  return (
    <div style={{ background:"#111118",border:"1px solid rgba(255,255,255,0.06)",borderRadius:20,overflow:"hidden" }}>
      <div style={{ padding:"24px",background:`linear-gradient(135deg,${teamColor}22,${teamColor}08)`,borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap" }}>
        <div style={{ flexShrink:0 }}>
          {!imgErr ? (
            <img src={photoUrl} onError={()=>setImgErr(true)} alt={player.first_name}
              style={{ width:88,height:66,objectFit:"cover",objectPosition:"top",borderRadius:12,border:`2px solid ${teamColor}44` }} />
          ) : (
            <div style={{ width:88,height:66,borderRadius:12,background:`linear-gradient(135deg,${teamColor}66,${teamColor}33)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,border:`2px solid ${teamColor}44` }}>
              {player.first_name[0]}{player.last_name[0]}
            </div>
          )}
        </div>
        <div style={{ flex:1,minWidth:200 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
            <h2 style={{ fontSize:22,fontWeight:800 }}>{player.first_name} {player.last_name}</h2>
            {streak() && <span style={{ fontSize:12,color:streak()?.color }}>{streak()?.icon} {streak()?.label}</span>}
          </div>
          <p style={{ color:"rgba(255,255,255,0.35)",fontSize:13,marginBottom:10 }}>{player.position||"—"} · {career?.total_seasons||0} seasons</p>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {career?.seasons && (() => {
              const teams:string[] = [];
              career.seasons.forEach((s:any)=>{ if(!teams.includes(s.team)) teams.push(s.team); });
              return teams.map((t,i)=>(
                <span key={t} style={{ fontSize:11,padding:"3px 9px",borderRadius:20,background:i===teams.length-1?`${teamColor}33`:"rgba(255,255,255,0.05)",color:i===teams.length-1?"#fff":"rgba(255,255,255,0.4)",border:i===teams.length-1?`1px solid ${teamColor}66`:"1px solid rgba(255,255,255,0.06)" }}>
                  {t}{i===teams.length-1?" ←":""}
                </span>
              ));
            })()}
          </div>
        </div>
        {latest && (
          <div style={{ textAlign:"center",flexShrink:0 }}>
            <div style={{ width:68,height:68,borderRadius:"50%",border:`3px solid ${fsColor(latest.fantasy_score)}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto 6px" }}>
              <span style={{ fontSize:20,fontWeight:800,color:fsColor(latest.fantasy_score),lineHeight:1 }}>{latest.fantasy_score}</span>
              <span style={{ fontSize:9,color:"rgba(255,255,255,0.3)" }}>FANT</span>
            </div>
            <span style={{ fontSize:20,fontWeight:800,color:fsColor(latest.fantasy_score) }}>{fsGrade(latest.fantasy_score)}</span>
          </div>
        )}
      </div>

      <div style={{ display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"0 24px",overflowX:"auto" }}>
        {(["overview","career","recent","predict"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"12px 18px",fontSize:13,fontWeight:500,background:"none",border:"none",cursor:"pointer",whiteSpace:"nowrap",color:tab===t?"#60a5fa":"rgba(255,255,255,0.3)",borderBottom:tab===t?"2px solid #60a5fa":"2px solid transparent" }}>
            {t==="predict"?"2025-26":t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ padding:24 }}>
        {tab==="overview" && latest && (
          <div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:20 }}>
              {[{l:"PTS",v:latest.pts},{l:"AST",v:latest.ast},{l:"REB",v:latest.reb},{l:"STL",v:latest.stl},{l:"BLK",v:latest.blk},{l:"FG%",v:`${((latest.fg_pct||0)*100).toFixed(1)}%`}].map(({l,v})=>(
                <div key={l} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"10px 8px",textAlign:"center" }}>
                  <div style={{ fontSize:18,fontWeight:700 }}>{v}</div>
                  <div style={{ fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={[{s:"Scoring",v:Math.min((latest.pts/35)*100,100)},{s:"Assists",v:Math.min((latest.ast/12)*100,100)},{s:"Rebounds",v:Math.min((latest.reb/15)*100,100)},{s:"Defense",v:Math.min(((latest.stl+latest.blk)/5)*100,100)},{s:"Shooting",v:Math.min((latest.fg_pct||0)*180,100)}]}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="s" tick={{ fill:"rgba(255,255,255,0.3)",fontSize:11 }} />
                <Radar dataKey="v" stroke={teamColor} fill={teamColor} fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab==="career" && career?.seasons && (
          <div>
            <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
              {(["pts","ast","reb","fantasy_score"] as const).map(k=>(
                <button key={k} onClick={()=>setStatKey(k)} style={{ padding:"5px 14px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",background:statKey===k?"#3B82F6":"rgba(255,255,255,0.06)",color:statKey===k?"#fff":"rgba(255,255,255,0.4)",border:"none" }}>
                  {k==="fantasy_score"?"Fantasy":k.toUpperCase()}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={career.seasons}>
                <XAxis dataKey="season" tick={{ fill:"rgba(255,255,255,0.2)",fontSize:10 }} tickLine={false} />
                <YAxis tick={{ fill:"rgba(255,255,255,0.2)",fontSize:10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10 }} labelStyle={{ color:"#fff" }} itemStyle={{ color:teamColor }} />
                <Line type="monotone" dataKey={statKey} stroke={teamColor} strokeWidth={2.5} dot={{ fill:teamColor,r:3 }} activeDot={{ r:6 }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop:16,overflowX:"auto" }}>
              <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
                <thead><tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                  {["Season","Team","GP","PTS","AST","REB","STL","BLK","FG%","Fantasy","Grade"].map(h=>(
                    <th key={h} style={{ padding:"8px",textAlign:"left",color:"rgba(255,255,255,0.3)",fontWeight:500 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[...career.seasons].reverse().map((s:any)=>(
                    <tr key={s.season} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding:"8px",color:"#fff",fontWeight:600 }}>{s.season}</td>
                      <td style={{ padding:"8px",color:"rgba(255,255,255,0.5)" }}>{s.team}</td>
                      <td style={{ padding:"8px" }}>{s.gp}</td>
                      <td style={{ padding:"8px" }}>{s.pts}</td>
                      <td style={{ padding:"8px" }}>{s.ast}</td>
                      <td style={{ padding:"8px" }}>{s.reb}</td>
                      <td style={{ padding:"8px" }}>{s.stl}</td>
                      <td style={{ padding:"8px" }}>{s.blk}</td>
                      <td style={{ padding:"8px" }}>{((s.fg_pct||0)*100).toFixed(1)}%</td>
                      <td style={{ padding:"8px",fontWeight:700,color:fsColor(s.fantasy_score) }}>{s.fantasy_score}</td>
                      <td style={{ padding:"8px",fontWeight:800,color:fsColor(s.fantasy_score) }}>{fsGrade(s.fantasy_score)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="recent" && (
          recent?.games?.length ? (
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {recent.games.map((g:any,i:number)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:"12px 16px" }}>
                  <div>
                    <span style={{ color:"#fff",fontWeight:600,fontSize:13 }}>{g.matchup}</span>
                    <span style={{ marginLeft:8,fontSize:11,fontWeight:700,color:g.wl==="W"?"#22c55e":"#ef4444" }}>{g.wl}</span>
                    <span style={{ marginLeft:8,fontSize:11,color:"rgba(255,255,255,0.25)" }}>{g.date}</span>
                  </div>
                  <div style={{ display:"flex",gap:16,alignItems:"center" }}>
                    {[{l:"PTS",v:g.pts},{l:"AST",v:g.ast},{l:"REB",v:g.reb}].map(({l,v})=>(
                      <span key={l}><span style={{ fontWeight:700 }}>{v}</span><span style={{ color:"rgba(255,255,255,0.25)",fontSize:11 }}> {l}</span></span>
                    ))}
                    <span style={{ fontWeight:700,fontSize:12,color:fsColor(g.fantasy_score),background:`${fsColor(g.fantasy_score)}18`,padding:"3px 8px",borderRadius:8 }}>{g.fantasy_score} FS</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <p style={{ color:"rgba(255,255,255,0.3)",fontSize:13 }}>No recent game data available.</p>
        )}

        {tab==="predict" && prediction && Object.keys(prediction).length ? (
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
              <span style={{ fontSize:13,color:"rgba(255,255,255,0.35)" }}>2025-26 projection via weighted career average</span>
              <span style={{ fontSize:11,padding:"3px 10px",borderRadius:20,background:prediction.confidence==="high"?"rgba(34,197,94,0.12)":"rgba(251,191,36,0.12)",color:prediction.confidence==="high"?"#22c55e":"#fbbf24" }}>{prediction.confidence} confidence</span>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16 }}>
              {[{l:"Projected PTS",v:prediction.pts,c:teamColor},{l:"Projected AST",v:prediction.ast,c:"#a78bfa"},{l:"Projected REB",v:prediction.reb,c:"#34d399"},{l:"Fantasy Score",v:prediction.fantasy_score,c:fsColor(prediction.fantasy_score)}].map(({l,v,c})=>(
                <div key={l} style={{ background:`${c}10`,border:`1px solid ${c}30`,borderRadius:14,padding:"16px 20px",textAlign:"center" }}>
                  <div style={{ fontSize:28,fontWeight:800,color:c }}>{v}</div>
                  <div style={{ fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        ) : <p style={{ color:"rgba(255,255,255,0.3)",fontSize:13 }}>Not enough data for prediction.</p>}
      </div>
    </div>
  );
}
