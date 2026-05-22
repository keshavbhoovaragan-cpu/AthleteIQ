"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";
import { searchPlayers, getCareerStats } from "@/lib/api";
import { Player } from "@/types/player";

const POSITION_SLOT_MAP: Record<string, string[]> = {
  "Guard":          ["PG","SG","G","UTIL","BN","IL"],
  "Forward":        ["SF","PF","F","UTIL","BN","IL"],
  "Center":         ["C","UTIL","BN","IL"],
  "Forward-Center": ["PF","C","F","UTIL","BN","IL"],
  "Guard-Forward":  ["SG","SF","G","F","UTIL","BN","IL"],
};

const canPlay = (playerPos: string, slotCode: string): boolean => {
  if (!playerPos) return true;
  const allowed = POSITION_SLOT_MAP[playerPos];
  if (!allowed) return slotCode === "UTIL" || slotCode === "BN" || slotCode === "IL";
  return allowed.includes(slotCode);
};

const ROSTER_SLOTS = [
  { slot:"PG",  label:"Point Guard",    color:"#60a5fa" },
  { slot:"SG",  label:"Shooting Guard", color:"#60a5fa" },
  { slot:"SF",  label:"Small Forward",  color:"#34d399" },
  { slot:"PF",  label:"Power Forward",  color:"#34d399" },
  { slot:"C",   label:"Center",         color:"#f59e0b" },
  { slot:"G",   label:"Guard Flex",     color:"#a78bfa" },
  { slot:"F",   label:"Forward Flex",   color:"#a78bfa" },
  { slot:"UTIL",label:"Utility",        color:"#e879f9" },
  { slot:"BN",  label:"Bench",          color:"rgba(255,255,255,0.25)" },
  { slot:"BN",  label:"Bench",          color:"rgba(255,255,255,0.25)" },
  { slot:"BN",  label:"Bench",          color:"rgba(255,255,255,0.25)" },
  { slot:"BN",  label:"Bench",          color:"rgba(255,255,255,0.25)" },
  { slot:"IL",  label:"Injured List",   color:"#ef4444" },
];

export default function FantasyPage() {
  const [roster, setRoster] = useState<(any|null)[]>(Array(13).fill(null));
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [activeSlot, setActiveSlot] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"roster"|"stats">("roster");
  const [toast, setToast] = useState<{msg:string,type:"error"|"success"}|null>(null);

  const showToast = (msg: string, type: "error"|"success" = "error") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 4000);
  };

  const search = async (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    try { const data = await searchPlayers(q); setResults(data.data||[]); }
    catch { setResults([]); }
  };

  const addPlayer = async (player: Player, slotIndex: number) => {
    if (roster.find(p => p?.id === player.id)) {
      showToast(`${player.first_name} ${player.last_name} is already on your roster.`, "error");
      return;
    }
    setLoading(true);
    const career = await getCareerStats(player.id).catch(() => null);
    const realPos: string = career?.position || "";
    const slot = ROSTER_SLOTS[slotIndex];
    if (!canPlay(realPos, slot.slot)) {
      showToast(`${player.first_name} ${player.last_name} plays ${realPos||"unknown"} — cannot fill ${slot.slot}`, "error");
      setLoading(false); return;
    }
    const latest = career?.seasons?.[career.seasons.length-1];
    const prediction = career?.prediction;
    const newRoster = [...roster];
    newRoster[slotIndex] = {...player, position: realPos, latest, prediction};
    setRoster(newRoster);
    setResults([]); setQuery(""); setActiveSlot(null); setLoading(false);
    showToast(`${player.first_name} ${player.last_name} → ${slot.slot}`, "success");
  };

  const drop = (i: number) => {
    const newRoster = [...roster]; const p = newRoster[i]; newRoster[i] = null; setRoster(newRoster);
    if (p) showToast(`Dropped ${p.first_name} ${p.last_name}`, "error");
  };

  const fsColor = (s:number) => s>=60?"#a78bfa":s>=50?"#22c55e":s>=40?"#f59e0b":"#ef4444";
  const fsGrade = (s:number) => s>=60?"S":s>=50?"A":s>=40?"B":s>=30?"C":"D";
  const draftVal = (fs:number) => fs>=60?"1st Rd":fs>=52?"2nd Rd":fs>=45?"3rd Rd":fs>=38?"4-6th":fs>=28?"7-10th":"Late";
  const projRank = (fs:number) => fs>=60?"Elite":fs>=50?"Star":fs>=40?"Solid":fs>=28?"Depth":"Streamer";
  const filled = roster.filter(Boolean);
  const starters = filled.slice(0,8);
  const avgFS = starters.length?(starters.reduce((a,p)=>a+(p.latest?.fantasy_score||0),0)/starters.length).toFixed(1):"—";
  const totalFS = filled.reduce((a,p)=>a+(p.latest?.fantasy_score||0),0).toFixed(1);
  const slotColor = (slot:string) => {
    if(slot==="BN") return {bg:"rgba(255,255,255,0.04)",fg:"rgba(255,255,255,0.3)"};
    if(slot==="IL") return {bg:"rgba(239,68,68,0.1)",fg:"#ef4444"};
    if(slot==="UTIL") return {bg:"rgba(232,121,249,0.1)",fg:"#e879f9"};
    if(slot==="G"||slot==="F") return {bg:"rgba(167,139,250,0.1)",fg:"#a78bfa"};
    if(slot==="C") return {bg:"rgba(245,158,11,0.1)",fg:"#f59e0b"};
    if(slot==="SF"||slot==="PF") return {bg:"rgba(52,211,153,0.1)",fg:"#34d399"};
    return {bg:"rgba(96,165,250,0.1)",fg:"#60a5fa"};
  };


  const exportCSV = () => {
    const headers = ['Slot','Player','Position','Team','PTS','REB','AST','STL','BLK','Fantasy Score','Grade'];
    const rows = ROSTER_SLOTS.map((s,i) => {
      const p = roster[i];
      if (!p) return [s.slot,'(empty)','','','','','','','','',''];
      const l = p.latest || {};
      const score = l.fantasy_score || 0;
      const grade = score>=60?'S':score>=50?'A':score>=40?'B':score>=30?'C':'D';
      return [s.slot,p.first_name+' '+p.last_name,p.position||'',l.team||'',l.pts||'',l.reb||'',l.ast||'',l.stl||'',l.blk||'',score,grade];
    });
    const csv = [headers,...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url; a.download='athleteiq-roster.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('Roster exported as CSV','success');
  };

  return (
    <main style={{minHeight:"100vh",background:"transparent"}}>
      <NavBar/>
      {toast&&(<div style={{position:"fixed",top:20,right:20,zIndex:999,padding:"13px 20px",borderRadius:12,background:toast.type==="error"?"rgba(239,68,68,0.13)":"rgba(34,197,94,0.13)",border:`1px solid ${toast.type==="error"?"rgba(239,68,68,0.4)":"rgba(34,197,94,0.4)"}`,color:toast.type==="error"?"#fca5a5":"#86efac",fontSize:13,fontWeight:600,backdropFilter:"blur(16px)",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",maxWidth:340}}>{toast.type==="error"?"⚠ ":"✓ "}{toast.msg}</div>)}
      <div style={{position:"fixed",top:"20%",left:"10%",width:500,height:500,background:"radial-gradient(circle,rgba(96,165,250,0.03) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{maxWidth:1160,margin:"0 auto",padding:"32px 24px",position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:28,flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontSize:10,color:"rgba(96,165,250,0.6)",letterSpacing:"0.2em",fontWeight:700,marginBottom:6}}>ESPN-STYLE · POSITION LOCKED</div>
            <h1 style={{fontSize:34,fontWeight:900,lineHeight:1,letterSpacing:"-0.02em",marginBottom:6,background:"linear-gradient(135deg,#60a5fa 0%,#a78bfa 50%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Fantasy Roster</h1>
            <p style={{color:"rgba(255,255,255,0.28)",fontSize:13}}>2024-25 · Standard scoring · Real NBA positions from NBA.com</p>
          </div>
          <div style={{display:"flex",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:3}}>
            <button onClick={exportCSV} disabled={filled.length===0} style={{padding:"7px 16px",borderRadius:10,fontSize:11,fontWeight:700,cursor:filled.length===0?"not-allowed":"pointer",background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",color:filled.length===0?"rgba(255,255,255,0.15)":"#34d399",letterSpacing:"0.06em",fontFamily:"inherit",opacity:filled.length===0?0.5:1}}>↓ CSV</button>
            <button onClick={exportCSV} disabled={filled.length===0} style={{padding:'7px 16px',borderRadius:10,fontSize:11,fontWeight:700,cursor:filled.length===0?'not-allowed':'pointer',background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)',color:filled.length===0?'rgba(255,255,255,0.15)':'#34d399',letterSpacing:'0.06em',fontFamily:'inherit',opacity:filled.length===0?0.5:1}}>↓ CSV</button>
            {(["roster","stats"] as const).map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"7px 18px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",background:view===v?"rgba(96,165,250,0.12)":"transparent",color:view===v?"#60a5fa":"rgba(255,255,255,0.3)",border:"none",letterSpacing:"0.08em",textTransform:"uppercase"}}>{v}</button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:24}}>
          {[{label:"TOTAL SCORE",value:totalFS,color:"#60a5fa"},{label:"STARTER AVG",value:avgFS,color:Number(avgFS)>=50?"#22c55e":Number(avgFS)>=40?"#f59e0b":"rgba(255,255,255,0.4)"},{label:"ROSTER",value:`${filled.length}/13`,color:"#a78bfa"},{label:"PROJ RANK",value:projRank(Number(avgFS)),color:"#f59e0b"}].map(({label,value,color})=>(
            <div key={label} style={{background:"linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"16px 18px"}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.12em",marginBottom:8,fontWeight:700}}>{label}</div>
              <div style={{fontSize:24,fontWeight:900,color,lineHeight:1}}>{value}</div>
            </div>
          ))}
        </div>
        {view==="roster"&&(
          <div style={{background:"linear-gradient(180deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.015) 100%)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,overflow:"hidden"}}>
            <div style={{padding:"14px 22px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.015)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}}/>
                <span style={{fontWeight:700,fontSize:13}}>Active Roster</span>
              </div>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:"0.08em"}}>🔒 CENTERS CANNOT PLAY GUARD · GUARDS CANNOT PLAY CENTER</span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                {["SLOT","PLAYER","POS","PTS","REB","AST","STL","BLK","FS","GRD","DRAFT",""].map(h=>(
                  <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,color:"rgba(255,255,255,0.18)",fontWeight:700,letterSpacing:"0.1em"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {ROSTER_SLOTS.map((s,i)=>{
                  const p=roster[i]; const isActive=activeSlot===i; const sc=slotColor(s.slot);
                  return(
                    <>
                      <tr key={`row-${i}`} style={{borderBottom:"1px solid rgba(255,255,255,0.03)",background:isActive?"rgba(96,165,250,0.03)":"transparent",transition:"background 0.1s"}}
                        onMouseEnter={e=>{if(!isActive)(e.currentTarget.style.background="rgba(255,255,255,0.012)")}}
                        onMouseLeave={e=>{if(!isActive)(e.currentTarget.style.background="transparent")}}>
                        <td style={{padding:"12px 14px"}}><span style={{fontSize:10,fontWeight:800,padding:"3px 9px",borderRadius:6,background:sc.bg,color:sc.fg,letterSpacing:"0.06em",border:`1px solid ${sc.fg}25`}}>{s.slot}</span></td>
                        <td style={{padding:"12px 14px",minWidth:185}}>
                          {p?(
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:34,height:25,objectFit:"cover",objectPosition:"top",borderRadius:7,border:"1px solid rgba(255,255,255,0.07)"}}/>
                              <div>
                                <div style={{color:"#fff",fontWeight:700,fontSize:13}}>{p.first_name} {p.last_name}</div>
                                <div style={{color:"rgba(255,255,255,0.28)",fontSize:10,marginTop:1}}>{p.latest?.team||"—"}</div>
                              </div>
                            </div>
                          ):(
                            <button onClick={()=>{setActiveSlot(isActive?null:i);setQuery("");setResults([]);}}
                              style={{background:"none",border:"1px dashed rgba(255,255,255,0.07)",borderRadius:8,padding:"5px 13px",color:"rgba(255,255,255,0.18)",cursor:"pointer",fontSize:11,fontWeight:600,transition:"all 0.15s"}}
                              onMouseEnter={e=>{(e.currentTarget.style.borderColor=s.color);(e.currentTarget.style.color=s.color)}}
                              onMouseLeave={e=>{(e.currentTarget.style.borderColor="rgba(255,255,255,0.07)");(e.currentTarget.style.color="rgba(255,255,255,0.18)")}}>
                              + {s.label}
                            </button>
                          )}
                        </td>
                        <td style={{padding:"12px 14px"}}>{p?.position&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.06)",fontWeight:600}}>{p.position}</span>}</td>
                        {["pts","reb","ast","stl","blk"].map(k=>(<td key={k} style={{padding:"12px 14px",fontSize:13,color:p?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.1)"}}>{p?.latest?.[k]||"—"}</td>))}
                        <td style={{padding:"12px 14px"}}>{p?<span style={{fontWeight:800,fontSize:14,color:fsColor(p.latest?.fantasy_score||0)}}>{p.latest?.fantasy_score||"—"}</span>:<span style={{color:"rgba(255,255,255,0.1)"}}>—</span>}</td>
                        <td style={{padding:"12px 14px"}}>{p?<span style={{fontWeight:900,fontSize:14,color:fsColor(p.latest?.fantasy_score||0)}}>{fsGrade(p.latest?.fantasy_score||0)}</span>:<span style={{color:"rgba(255,255,255,0.1)"}}>—</span>}</td>
                        <td style={{padding:"12px 14px"}}>{p?<span style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:"rgba(96,165,250,0.07)",color:"#60a5fa",fontWeight:700,border:"1px solid rgba(96,165,250,0.15)",whiteSpace:"nowrap"}}>{draftVal(p.latest?.fantasy_score||0)}</span>:<span style={{color:"rgba(255,255,255,0.1)"}}>—</span>}</td>
                        <td style={{padding:"12px 14px"}}>{p&&<button onClick={()=>drop(i)} style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",color:"#fca5a5",borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:10,fontWeight:700,letterSpacing:"0.05em",transition:"all 0.15s"}} onMouseEnter={e=>{(e.currentTarget.style.background="rgba(239,68,68,0.15)")}} onMouseLeave={e=>{(e.currentTarget.style.background="rgba(239,68,68,0.06)")}}>DROP</button>}</td>
                      </tr>
                      {isActive&&(
                        <tr key={`search-${i}`} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                          <td colSpan={12} style={{padding:"16px 22px",background:"rgba(96,165,250,0.02)",borderLeft:`2px solid ${s.color}`}}>
                            <div style={{fontSize:11,color:"rgba(255,255,255,0.28)",marginBottom:11}}>
                              Adding to <span style={{color:s.color,fontWeight:700}}>{s.slot} — {s.label}</span>
                              {" · "}<span style={{color:"rgba(255,255,255,0.18)"}}>Eligible: {Object.entries(POSITION_SLOT_MAP).filter(([,slots])=>slots.includes(s.slot)).map(([pos])=>pos).join(", ")||"Any"}</span>
                              {loading&&<span style={{marginLeft:12,color:"rgba(96,165,250,0.6)"}}>Verifying position...</span>}
                            </div>
                            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:11}}>
                              <input autoFocus type="text" value={query} onChange={e=>search(e.target.value)} placeholder="Search any NBA player..."
                                style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:9,padding:"10px 15px",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                              <button onClick={()=>{setActiveSlot(null);setResults([]);setQuery("");}} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"rgba(255,255,255,0.35)",cursor:"pointer",padding:"8px 13px",fontSize:11,fontWeight:700,letterSpacing:"0.05em"}}>CANCEL</button>
                            </div>
                            {results.length>0&&(
                              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:7}}>
                                {results.slice(0,9).map(r=>(
                                  <button key={r.id} onClick={()=>addPlayer(r,i)}
                                    style={{display:"flex",alignItems:"center",gap:9,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:11,padding:"10px 13px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}
                                    onMouseEnter={e=>{(e.currentTarget.style.borderColor=s.color);(e.currentTarget.style.background=`${s.color}0a`)}}
                                    onMouseLeave={e=>{(e.currentTarget.style.borderColor="rgba(255,255,255,0.06)");(e.currentTarget.style.background="rgba(255,255,255,0.03)")}}>
                                    <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${r.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:27,height:20,objectFit:"cover",objectPosition:"top",borderRadius:5}}/>
                                    <div>
                                      <div style={{color:"#fff",fontWeight:700,fontSize:12}}>{r.first_name} {r.last_name}</div>
                                      <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:1}}>Click to add →</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {view==="stats"&&(
          <div style={{background:"linear-gradient(180deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.015) 100%)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,overflow:"hidden"}}>
            <div style={{padding:"14px 22px",borderBottom:"1px solid rgba(255,255,255,0.05)",background:"rgba(255,255,255,0.015)"}}><span style={{fontWeight:700,fontSize:13}}>Team Analytics</span></div>
            {filled.length===0?(<div style={{padding:80,textAlign:"center",color:"rgba(255,255,255,0.15)",fontSize:14}}>Add players to your roster first</div>):(
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  {["PLAYER","POS","PTS","REB","AST","STL","BLK","FG%","FANTASY","GRADE","2025-26","DRAFT"].map(h=>(
                    <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,color:"rgba(255,255,255,0.18)",fontWeight:700,letterSpacing:"0.1em"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[...filled].sort((a,b)=>(b.latest?.fantasy_score||0)-(a.latest?.fantasy_score||0)).map((p:any)=>(
                    <tr key={p.id} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                      <td style={{padding:"12px 14px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:34,height:25,objectFit:"cover",objectPosition:"top",borderRadius:7}}/><span style={{color:"#fff",fontWeight:700,fontSize:13}}>{p.first_name} {p.last_name}</span></div></td>
                      <td style={{padding:"12px 14px"}}>{p.position&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.06)",fontWeight:600}}>{p.position}</span>}</td>
                      {["pts","reb","ast","stl","blk"].map(k=>(<td key={k} style={{padding:"12px 14px",fontSize:13,color:"rgba(255,255,255,0.7)"}}>{p.latest?.[k]||"—"}</td>))}
                      <td style={{padding:"12px 14px",fontSize:13,color:"rgba(255,255,255,0.7)"}}>{p.latest?.fg_pct?`${(p.latest.fg_pct*100).toFixed(1)}%`:"—"}</td>
                      <td style={{padding:"12px 14px",fontWeight:800,fontSize:14,color:fsColor(p.latest?.fantasy_score||0)}}>{p.latest?.fantasy_score||"—"}</td>
                      <td style={{padding:"12px 14px",fontWeight:900,fontSize:14,color:fsColor(p.latest?.fantasy_score||0)}}>{fsGrade(p.latest?.fantasy_score||0)}</td>
                      <td style={{padding:"12px 14px",fontWeight:700,color:p.prediction?fsColor(p.prediction.fantasy_score):"rgba(255,255,255,0.2)"}}>{p.prediction?.fantasy_score||"—"}</td>
                      <td style={{padding:"12px 14px"}}><span style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:"rgba(96,165,250,0.07)",color:"#60a5fa",fontWeight:700,border:"1px solid rgba(96,165,250,0.15)"}}>{draftVal(p.latest?.fantasy_score||0)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
