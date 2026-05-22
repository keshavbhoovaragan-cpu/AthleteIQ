"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";
import { searchPlayers } from "@/lib/api";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

function PlayerPicker({ label, color, onSelect, selected }: any) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const search = async (v: string) => {
    setQ(v);
    if (v.length < 2) { setResults([]); return; }
    const data = await searchPlayers(v).catch(() => ({ data: [] }));
    setResults((data as any).data || []);
  };
  return (
    <div style={{flex:1}}>
      <div style={{fontSize:10,color,letterSpacing:"0.12em",fontWeight:700,marginBottom:8}}>{label}</div>
      {selected ? (
        <div style={{background:`${color}0a`,border:`1px solid ${color}25`,borderRadius:14,padding:"16px 18px",display:"flex",alignItems:"center",gap:12}}>
          <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${selected.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:48,height:36,objectFit:"cover",objectPosition:"top",borderRadius:8}}/>
          <div style={{flex:1}}><div style={{color:"#fff",fontWeight:700,fontSize:15}}>{selected.first_name} {selected.last_name}</div></div>
          <button onClick={()=>{onSelect(null);setQ("");setResults([]);}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:18}}>×</button>
        </div>
      ) : (
        <div style={{position:"relative"}}>
          <input type="text" value={q} onChange={e=>search(e.target.value)} placeholder="Search player..."
            style={{width:"100%",background:"rgba(255,255,255,0.04)",border:`1px solid ${color}30`,borderRadius:12,padding:"12px 16px",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          {results.length>0&&(
            <div style={{position:"absolute",top:"100%",marginTop:6,width:"100%",background:"#0f0f1a",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,overflow:"hidden",zIndex:20}}>
              {results.slice(0,6).map(r=>(
                <button key={r.id} onClick={()=>{onSelect(r);setResults([]);setQ("");}}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}
                  onMouseEnter={e=>(e.currentTarget.style.background=`${color}08`)}
                  onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                  <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${r.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:28,height:21,objectFit:"cover",objectPosition:"top",borderRadius:5}}/>
                  <span style={{color:"#fff",fontWeight:600,fontSize:13}}>{r.first_name} {r.last_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TradePage() {
  const [playerA, setPlayerA] = useState<any>(null);
  const [playerB, setPlayerB] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!playerA||!playerB) return;
    setLoading(true);
    const res = await api.get(`/api/trades/analyze/${playerA.id}/${playerB.id}`).catch(()=>null);
    setResult(res?.data||null); setLoading(false);
  };

  const fsColor=(s:number)=>s>=60?"#a78bfa":s>=50?"#22c55e":s>=40?"#f59e0b":"#ef4444";

  const StatRow=({label,a,b,format}:any)=>{
    const av=parseFloat(a)||0,bv=parseFloat(b)||0;
    const winner=av>bv?"a":bv>av?"b":"tie";
    return(
      <div style={{display:"grid",gridTemplateColumns:"1fr 120px 1fr",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <div style={{padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:4}}>
          {winner==="a"&&<span style={{fontSize:9,color:"#22c55e"}}>▲</span>}
          <span style={{fontSize:14,fontWeight:winner==="a"?800:400,color:winner==="a"?"#fff":"rgba(255,255,255,0.35)"}}>{format?format(av):av}</span>
        </div>
        <div style={{padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontWeight:700,letterSpacing:"0.06em"}}>{label}</span>
        </div>
        <div style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:14,fontWeight:winner==="b"?800:400,color:winner==="b"?"#fff":"rgba(255,255,255,0.35)"}}>{format?format(bv):bv}</span>
          {winner==="b"&&<span style={{fontSize:9,color:"#22c55e"}}>▲</span>}
        </div>
      </div>
    );
  };

  return (
    <main style={{minHeight:"100vh",background:"transparent"}}>
      <NavBar/>
      <div style={{position:"fixed",top:"20%",left:"5%",width:400,height:400,background:"radial-gradient(circle,rgba(34,197,94,0.03) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:32}}>
          <div style={{fontSize:10,color:"rgba(34,197,94,0.6)",letterSpacing:"0.2em",fontWeight:700,marginBottom:6}}>FANTASY TOOL</div>
          <h1 style={{fontSize:34,fontWeight:900,lineHeight:1,letterSpacing:"-0.02em",marginBottom:6,background:"linear-gradient(135deg,#22c55e 0%,#60a5fa 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Trade Analyzer</h1>
          <p style={{color:"rgba(255,255,255,0.28)",fontSize:13}}>Compare two players by fantasy value, get an instant trade recommendation</p>
        </div>
        <div style={{display:"flex",gap:16,alignItems:"flex-end",marginBottom:20,flexWrap:"wrap"}}>
          <PlayerPicker label="YOU GIVE" color="#60a5fa" onSelect={setPlayerA} selected={playerA}/>
          <div style={{fontSize:22,color:"rgba(255,255,255,0.15)",fontWeight:900,flexShrink:0,paddingBottom:12}}>⇄</div>
          <PlayerPicker label="YOU RECEIVE" color="#a78bfa" onSelect={setPlayerB} selected={playerB}/>
        </div>
        <button onClick={analyze} disabled={!playerA||!playerB||loading}
          style={{width:"100%",padding:"14px",borderRadius:12,border:"none",cursor:(!playerA||!playerB)?"not-allowed":"pointer",background:(!playerA||!playerB)?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#22c55e,#60a5fa)",color:(!playerA||!playerB)?"rgba(255,255,255,0.2)":"#fff",fontSize:14,fontWeight:800,letterSpacing:"0.05em",marginBottom:24,transition:"all 0.2s"}}>
          {loading ? (<span style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center"}}><span style={{width:16,height:16,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.2)",borderTopColor:"#22c55e",animation:"spin 0.8s linear infinite",display:"inline-block"}}/><span style={{color:"#22c55e"}}>ANALYZING...</span></span>) : "ANALYZE TRADE"}
        </button>
        {result&&!result.error&&(
          <div>
            <div style={{background:`${result.color}10`,border:`1px solid ${result.color}30`,borderRadius:16,padding:"20px 24px",marginBottom:20,textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:900,color:result.color,marginBottom:8}}>{result.verdict}</div>
              <div style={{color:"rgba(255,255,255,0.45)",fontSize:14}}>{result.reason}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.2)",marginTop:8}}>Value diff: <span style={{color:result.value_diff>0?"#22c55e":"#ef4444",fontWeight:700}}>{result.value_diff>0?"+":""}{result.value_diff} FS</span></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 80px 1fr",marginBottom:4}}>
              <div style={{padding:"14px 16px",textAlign:"right"}}>
                <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerA?.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:44,height:33,objectFit:"cover",objectPosition:"top",borderRadius:8,marginBottom:6}}/>
                <div style={{color:"#fff",fontWeight:700,fontSize:14}}>{playerA?.first_name} {playerA?.last_name}</div>
                <div style={{fontSize:22,fontWeight:900,color:fsColor(result.player_a.fantasy_score)}}>{result.player_a.fantasy_score}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"rgba(255,255,255,0.15)",fontWeight:700}}>VS</div>
              <div style={{padding:"14px 16px"}}>
                <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerB?.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:44,height:33,objectFit:"cover",objectPosition:"top",borderRadius:8,marginBottom:6}}/>
                <div style={{color:"#fff",fontWeight:700,fontSize:14}}>{playerB?.first_name} {playerB?.last_name}</div>
                <div style={{fontSize:22,fontWeight:900,color:fsColor(result.player_b.fantasy_score)}}>{result.player_b.fantasy_score}</div>
              </div>
            </div>
            <div style={{background:"linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,overflow:"hidden",marginBottom:16}}>
              <StatRow label="PTS" a={result.player_a.pts} b={result.player_b.pts}/>
              <StatRow label="AST" a={result.player_a.ast} b={result.player_b.ast}/>
              <StatRow label="REB" a={result.player_a.reb} b={result.player_b.reb}/>
              <StatRow label="STL" a={result.player_a.stl} b={result.player_b.stl}/>
              <StatRow label="BLK" a={result.player_a.blk} b={result.player_b.blk}/>
              <StatRow label="FG%" a={result.player_a.fg_pct} b={result.player_b.fg_pct} format={(v:number)=>`${(v*100).toFixed(1)}%`}/>
              <StatRow label="PROJ FS" a={result.player_a.prediction?.fantasy_score} b={result.player_b.prediction?.fantasy_score}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{background:"rgba(96,165,250,0.06)",border:"1px solid rgba(96,165,250,0.15)",borderRadius:12,padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:9,color:"rgba(96,165,250,0.6)",letterSpacing:"0.08em",marginBottom:4}}>CATEGORIES WON</div>
                <div style={{fontSize:28,fontWeight:900,color:"#60a5fa"}}>{result.category_wins.a}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{playerA?.last_name}</div>
              </div>
              <div style={{background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:12,padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:9,color:"rgba(167,139,250,0.6)",letterSpacing:"0.08em",marginBottom:4}}>CATEGORIES WON</div>
                <div style={{fontSize:28,fontWeight:900,color:"#a78bfa"}}>{result.category_wins.b}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{playerB?.last_name}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
