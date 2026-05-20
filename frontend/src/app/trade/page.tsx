"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";
import { searchPlayers, getCareerStats } from "@/lib/api";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

export default function TradePage() {
  const [playerA, setPlayerA] = useState<any>(null);
  const [playerB, setPlayerB] = useState<any>(null);
  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");
  const [resultsA, setResultsA] = useState<any[]>([]);
  const [resultsB, setResultsB] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const searchA = async (q: string) => { setQueryA(q); if(q.length<2){setResultsA([]);return;} const d=await searchPlayers(q).catch(()=>({data:[]})); setResultsA((d as any).data||[]); };
  const searchB = async (q: string) => { setQueryB(q); if(q.length<2){setResultsB([]);return;} const d=await searchPlayers(q).catch(()=>({data:[]})); setResultsB((d as any).data||[]); };
  const selectA = async (p: any) => { const c=await getCareerStats(p.id).catch(()=>null); setPlayerA({...p,position:(c as any)?.position||""}); setResultsA([]); setQueryA(""); setAnalysis(null); };
  const selectB = async (p: any) => { const c=await getCareerStats(p.id).catch(()=>null); setPlayerB({...p,position:(c as any)?.position||""}); setResultsB([]); setQueryB(""); setAnalysis(null); };

  const analyze = async () => {
    if(!playerA||!playerB) return;
    setLoading(true);
    try { const {data}=await api.get(`/api/trade/${playerA.id}/${playerB.id}`); setAnalysis(data); }
    catch {} finally { setLoading(false); }
  };

  const fsColor=(s:number)=>s>=60?"#a78bfa":s>=50?"#22c55e":s>=40?"#f59e0b":"#ef4444";
  const trendIcon=(t:string)=>t==="rising"?"↑":t==="declining"?"↓":"→";
  const trendColor=(t:string)=>t==="rising"?"#22c55e":t==="declining"?"#ef4444":"#9ca3af";

  const StatBar=({label,a,b,max}:{label:string,a:number,b:number,max:number})=>(
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:13,fontWeight:700,color:a>b?"#fff":"rgba(255,255,255,0.4)"}}>{a}</span>
        <span style={{fontSize:10,color:"rgba(255,255,255,0.25)",letterSpacing:"0.05em"}}>{label}</span>
        <span style={{fontSize:13,fontWeight:700,color:b>a?"#fff":"rgba(255,255,255,0.4)"}}>{b}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
        <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden",transform:"scaleX(-1)"}}>
          <div style={{height:"100%",borderRadius:2,background:"#60a5fa",width:`${(a/max)*100}%`}}/>
        </div>
        <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:2,background:"#a78bfa",width:`${(b/max)*100}%`}}/>
        </div>
      </div>
    </div>
  );

  const PlayerPicker=({player,query,results,onSearch,onSelect,onClear,label,color}:any)=>(
    <div>
      <div style={{fontSize:10,color,letterSpacing:"0.1em",fontWeight:700,marginBottom:8}}>{label}</div>
      {player?(
        <div style={{background:`${color}08`,border:`1px solid ${color}25`,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
          <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:44,height:33,objectFit:"cover",objectPosition:"top",borderRadius:8}}/>
          <div style={{flex:1}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:14}}>{player.first_name} {player.last_name}</div>
            <div style={{color:"rgba(255,255,255,0.3)",fontSize:11,marginTop:2}}>{player.position||"—"}</div>
          </div>
          <button onClick={onClear} style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",cursor:"pointer",fontSize:18}}>×</button>
        </div>
      ):(
        <div style={{position:"relative"}}>
          <input type="text" value={query} onChange={e=>onSearch(e.target.value)} placeholder="Search player..."
            style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:11,padding:"11px 15px",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          {results.length>0&&(
            <div style={{position:"absolute",top:"100%",marginTop:5,width:"100%",background:"#111118",border:"1px solid rgba(255,255,255,0.08)",borderRadius:11,overflow:"hidden",zIndex:20}}>
              {results.slice(0,5).map((r:any)=>(
                <button key={r.id} onClick={()=>onSelect(r)}
                  style={{width:"100%",textAlign:"left",padding:"10px 14px",background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:9,borderBottom:"1px solid rgba(255,255,255,0.04)"}}
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.04)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                  <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${r.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:26,height:19,objectFit:"cover",objectPosition:"top",borderRadius:4}}/>
                  {r.first_name} {r.last_name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <main style={{minHeight:"100vh",background:"#07070e"}}>
      <NavBar/>
      <div style={{position:"fixed",top:"15%",left:"5%",width:400,height:400,background:"radial-gradient(circle,rgba(96,165,250,0.03) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"15%",right:"5%",width:400,height:400,background:"radial-gradient(circle,rgba(167,139,250,0.03) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{maxWidth:940,margin:"0 auto",padding:"40px 24px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:10,color:"rgba(52,211,153,0.6)",letterSpacing:"0.2em",fontWeight:700,marginBottom:6}}>FANTASY TRADE TOOL</div>
          <h1 style={{fontSize:34,fontWeight:900,lineHeight:1,letterSpacing:"-0.02em",marginBottom:6,background:"linear-gradient(135deg,#60a5fa 0%,#34d399 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Trade Analyzer</h1>
          <p style={{color:"rgba(255,255,255,0.28)",fontSize:13}}>Compare two players by current value, projection, consistency, and trend</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:16,alignItems:"start",marginBottom:20}}>
          <PlayerPicker player={playerA} query={queryA} results={resultsA} onSearch={searchA} onSelect={selectA} onClear={()=>{setPlayerA(null);setAnalysis(null);}} label="YOUR PLAYER" color="#60a5fa"/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",paddingTop:36}}>
            <div style={{fontSize:22,fontWeight:900,color:"rgba(255,255,255,0.12)"}}>⇄</div>
          </div>
          <PlayerPicker player={playerB} query={queryB} results={resultsB} onSearch={searchB} onSelect={selectB} onClear={()=>{setPlayerB(null);setAnalysis(null);}} label="TRADE TARGET" color="#a78bfa"/>
        </div>

        {playerA&&playerB&&!analysis&&(
          <div style={{textAlign:"center",marginBottom:20}}>
            <button onClick={analyze} disabled={loading}
              style={{background:"linear-gradient(135deg,#60a5fa,#a78bfa)",border:"none",borderRadius:11,padding:"12px 32px",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",letterSpacing:"0.05em",opacity:loading?0.6:1}}>
              {loading?"Analyzing...":"Analyze Trade →"}
            </button>
          </div>
        )}

        {analysis&&(
          <>
            <div style={{background:analysis.winner==="a"?"rgba(96,165,250,0.07)":analysis.winner==="b"?"rgba(167,139,250,0.07)":"rgba(245,158,11,0.07)",border:`1px solid ${analysis.winner==="a"?"rgba(96,165,250,0.2)":analysis.winner==="b"?"rgba(167,139,250,0.2)":"rgba(245,158,11,0.2)"}`,borderRadius:16,padding:"18px 22px",marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:900,marginBottom:5,color:analysis.winner==="a"?"#60a5fa":analysis.winner==="b"?"#a78bfa":"#f59e0b"}}>{analysis.verdict}</div>
              <div style={{color:"rgba(255,255,255,0.45)",fontSize:13,marginBottom:12}}>{analysis.recommendation}</div>
              <div style={{display:"flex",justifyContent:"center",gap:28}}>
                <div><div style={{fontSize:22,fontWeight:900,color:"#60a5fa"}}>{analysis.score_a}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.08em"}}>YOUR PLAYER</div></div>
                <div><div style={{fontSize:22,fontWeight:900,color:"#a78bfa"}}>{analysis.score_b}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.08em"}}>TRADE TARGET</div></div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              {[{p:analysis.player_a,i:0},{p:analysis.player_b,i:1}].map(({p,i})=>(
                <div key={i} style={{background:"linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))",border:`1px solid ${i===0?"rgba(96,165,250,0.12)":"rgba(167,139,250,0.12)"}`,borderRadius:14,padding:"18px"}}>
                  <div style={{fontSize:10,color:i===0?"#60a5fa":"#a78bfa",letterSpacing:"0.1em",fontWeight:700,marginBottom:12}}>{i===0?"YOUR PLAYER":"TRADE TARGET"}</div>
                  {[{label:"Fantasy Score",value:p.current_fs,color:fsColor(p.current_fs)},{label:"Projected FS",value:p.projected_fs,color:"rgba(255,255,255,0.55)"},{label:"Consistency",value:`${p.consistency}%`,color:"rgba(255,255,255,0.55)"},{label:"Trend",value:`${trendIcon(p.trend)} ${p.trend}`,color:trendColor(p.trend)}].map(({label,value,color})=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                      <span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>{label}</span>
                      <span style={{fontSize:13,fontWeight:700,color}}>{value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{background:"linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"18px 22px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
                <span style={{fontSize:12,color:"#60a5fa",fontWeight:700}}>{playerA.first_name} {playerA.last_name}</span>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:"0.05em"}}>STAT COMPARISON</span>
                <span style={{fontSize:12,color:"#a78bfa",fontWeight:700}}>{playerB.first_name} {playerB.last_name}</span>
              </div>
              <StatBar label="PTS" a={analysis.player_a.pts} b={analysis.player_b.pts} max={Math.max(analysis.player_a.pts,analysis.player_b.pts,1)}/>
              <StatBar label="AST" a={analysis.player_a.ast} b={analysis.player_b.ast} max={Math.max(analysis.player_a.ast,analysis.player_b.ast,1)}/>
              <StatBar label="REB" a={analysis.player_a.reb} b={analysis.player_b.reb} max={Math.max(analysis.player_a.reb,analysis.player_b.reb,1)}/>
              <StatBar label="STL" a={analysis.player_a.stl} b={analysis.player_b.stl} max={Math.max(analysis.player_a.stl,analysis.player_b.stl,1)}/>
              <StatBar label="BLK" a={analysis.player_a.blk} b={analysis.player_b.blk} max={Math.max(analysis.player_a.blk,analysis.player_b.blk,1)}/>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
