"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";
import { searchPlayers, getCareerStats } from "@/lib/api";
import { Player } from "@/types/player";

const ROSTER_SLOTS = [
  { slot:"PG",  label:"Point Guard",    color:"#60a5fa", eligible:["Guard","Forward-Guard","G","PG"] },
  { slot:"SG",  label:"Shooting Guard", color:"#60a5fa", eligible:["Guard","Forward-Guard","G","SG","PG"] },
  { slot:"SF",  label:"Small Forward",  color:"#34d399", eligible:["Forward","Guard-Forward","Forward-Center","F","SF","PF"] },
  { slot:"PF",  label:"Power Forward",  color:"#34d399", eligible:["Forward","Forward-Center","F","PF","SF"] },
  { slot:"C",   label:"Center",         color:"#f59e0b", eligible:["Center","Forward-Center","C"] },
  { slot:"G",   label:"Guard Flex",     color:"#a78bfa", eligible:["Guard","Forward-Guard","G","PG","SG"] },
  { slot:"F",   label:"Forward Flex",   color:"#a78bfa", eligible:["Forward","Guard-Forward","Forward-Center","F","SF","PF"] },
  { slot:"UTIL",label:"Utility",        color:"#e879f9", eligible:["Guard","Forward","Center","Forward-Center","Guard-Forward","Forward-Guard","G","F","C","PG","SG","SF","PF"] },
  { slot:"BN",  label:"Bench",          color:"rgba(255,255,255,0.3)", eligible:["Guard","Forward","Center","Forward-Center","Guard-Forward","Forward-Guard","G","F","C","PG","SG","SF","PF"] },
  { slot:"BN",  label:"Bench",          color:"rgba(255,255,255,0.3)", eligible:["Guard","Forward","Center","Forward-Center","Guard-Forward","Forward-Guard","G","F","C","PG","SG","SF","PF"] },
  { slot:"BN",  label:"Bench",          color:"rgba(255,255,255,0.3)", eligible:["Guard","Forward","Center","Forward-Center","Guard-Forward","Forward-Guard","G","F","C","PG","SG","SF","PF"] },
  { slot:"BN",  label:"Bench",          color:"rgba(255,255,255,0.3)", eligible:["Guard","Forward","Center","Forward-Center","Guard-Forward","Forward-Guard","G","F","C","PG","SG","SF","PF"] },
  { slot:"IL",  label:"Injured List",   color:"#ef4444", eligible:["Guard","Forward","Center","Forward-Center","Guard-Forward","Forward-Guard","G","F","C","PG","SG","SF","PF"] },
];

const canPlay = (playerPos: string, slotEligible: string[]): boolean => {
  if (!playerPos) return true;
  return slotEligible.some(e => playerPos.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(playerPos.toLowerCase()));
};

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
    setTimeout(()=>setToast(null),4000);
  };

  const search = async (q: string) => {
    setQuery(q);
    if (q.length<2){setResults([]);return;}
    try { const data=await searchPlayers(q); setResults(data.data||[]); } catch {setResults([]);}
  };

  const addPlayer = async (player: Player, slotIndex: number) => {
    if (roster.find(p=>p?.id===player.id)) { showToast(`${player.first_name} ${player.last_name} is already rostered.`,"error"); return; }
    setLoading(true);
    const career = await getCareerStats(player.id).catch(()=>null);
    const realPos = career?.position || player.position || "";
    const slot = ROSTER_SLOTS[slotIndex];
    if (!["BN","IL","UTIL"].includes(slot.slot) && realPos && !canPlay(realPos, slot.eligible)) {
      showToast(`${player.first_name} ${player.last_name} (${realPos}) cannot play ${slot.slot}`, "error");
      setLoading(false); return;
    }
    const latest = career?.seasons?.[career.seasons.length-1];
    const prediction = career?.prediction;
    const newRoster=[...roster];
    newRoster[slotIndex]={...player,position:realPos,latest,prediction};
    setRoster(newRoster);
    setResults([]); setQuery(""); setActiveSlot(null); setLoading(false);
    showToast(`${player.first_name} ${player.last_name} added to ${slot.slot}!`,"success");
  };

  const drop = (i: number) => {
    const newRoster=[...roster]; const p=newRoster[i]; newRoster[i]=null; setRoster(newRoster);
    if(p) showToast(`${p.first_name} ${p.last_name} dropped.`,"error");
  };

  const fsColor=(s:number)=>s>=60?"#a78bfa":s>=50?"#22c55e":s>=40?"#f59e0b":"#ef4444";
  const fsGrade=(s:number)=>s>=60?"S":s>=50?"A":s>=40?"B":s>=30?"C":"D";
  const draftVal=(fs:number)=>fs>=60?"1st Rd":fs>=52?"2nd Rd":fs>=45?"3rd Rd":fs>=38?"4-6th":fs>=28?"7-10th":"Late";
  const projRank=(fs:number)=>fs>=60?"Elite":fs>=50?"Star":fs>=40?"Solid":fs>=28?"Depth":"Streamer";
  const filled=roster.filter(Boolean);
  const starters=filled.slice(0,8);
  const avgFS=starters.length?(starters.reduce((a,p)=>a+(p.latest?.fantasy_score||0),0)/starters.length).toFixed(1):"—";
  const totalFS=filled.reduce((a,p)=>a+(p.latest?.fantasy_score||0),0).toFixed(1);

  return (
    <main style={{minHeight:"100vh",background:"#07070e"}}>
      <NavBar/>
      {toast&&(<div style={{position:"fixed",top:20,right:20,zIndex:200,padding:"14px 20px",borderRadius:14,background:toast.type==="error"?"rgba(239,68,68,0.12)":"rgba(34,197,94,0.12)",border:`1px solid ${toast.type==="error"?"rgba(239,68,68,0.35)":"rgba(34,197,94,0.35)"}`,color:toast.type==="error"?"#f87171":"#4ade80",fontSize:13,fontWeight:600,maxWidth:380,backdropFilter:"blur(12px)",boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
        {toast.type==="error"?"⚠ ":"✓ "}{toast.msg}
      </div>)}
      <div style={{maxWidth:1140,margin:"0 auto",padding:"32px 24px"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:28,flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontSize:11,color:"rgba(96,165,250,0.7)",letterSpacing:"0.15em",fontWeight:700,marginBottom:8}}>FANTASY BASKETBALL</div>
            <h1 style={{fontSize:36,fontWeight:900,lineHeight:1.1,marginBottom:6,background:"linear-gradient(135deg,#60a5fa 0%,#a78bfa 50%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>My Team</h1>
            <p style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>2024-25 NBA · Standard · Position-locked roster</p>
          </div>
          <div style={{display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:4,border:"1px solid rgba(255,255,255,0.06)"}}>
            {(["roster","stats"] as const).map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"7px 16px",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer",background:view===v?"rgba(96,165,250,0.15)":"transparent",color:view===v?"#60a5fa":"rgba(255,255,255,0.35)",border:"none",letterSpacing:"0.05em",textTransform:"uppercase"}}>{v}</button>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
          {[
            {label:"TOTAL SCORE",value:totalFS,color:"#60a5fa"},
            {label:"STARTER AVG",value:avgFS,color:Number(avgFS)>=50?"#22c55e":Number(avgFS)>=40?"#f59e0b":"#ef4444"},
            {label:"ROSTER",value:`${filled.length}/13`,color:"#a78bfa"},
            {label:"TEAM RATING",value:projRank(Number(avgFS)),color:"#f59e0b"},
          ].map(({label,value,color})=>(
            <div key={label} style={{background:"linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:"18px 20px"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",marginBottom:8,fontWeight:700}}>{label}</div>
              <div style={{fontSize:26,fontWeight:900,color,lineHeight:1}}>{value}</div>
            </div>
          ))}
        </div>

        {view==="roster"&&(
          <div style={{background:"linear-gradient(180deg,rgba(255,255,255,0.035) 0%,rgba(255,255,255,0.02) 100%)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,overflow:"hidden"}}>
            <div style={{padding:"16px 24px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.02)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e"}}/>
                <span style={{fontWeight:700,fontSize:14,letterSpacing:"0.02em"}}>Active Roster</span>
              </div>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.2)",letterSpacing:"0.05em"}}>POSITION ENFORCEMENT ACTIVE</span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                {["SLOT","PLAYER","POS","PTS","REB","AST","STL","BLK","FANT","GRD","DRAFT",""].map(h=>(
                  <th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:9,color:"rgba(255,255,255,0.2)",fontWeight:700,letterSpacing:"0.1em"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {ROSTER_SLOTS.map((s,i)=>{
                  const p=roster[i]; const isActive=activeSlot===i;
                  return(
                    <>
                      <tr key={`r${i}`} style={{borderBottom:"1px solid rgba(255,255,255,0.03)",background:isActive?"rgba(96,165,250,0.04)":"transparent",transition:"background 0.15s"}}
                        onMouseEnter={e=>{if(!isActive)(e.currentTarget.style.background="rgba(255,255,255,0.015)")}}
                        onMouseLeave={e=>{if(!isActive)(e.currentTarget.style.background="transparent")}}>
                        <td style={{padding:"13px 16px"}}>
                          <span style={{fontSize:10,fontWeight:800,padding:"4px 8px",borderRadius:6,background:`${s.color}15`,color:s.color,letterSpacing:"0.05em",border:`1px solid ${s.color}30`}}>{s.slot}</span>
                        </td>
                        <td style={{padding:"13px 16px",minWidth:190}}>
                          {p?(
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:36,height:27,objectFit:"cover",objectPosition:"top",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)"}}/>
                              <div>
                                <div style={{color:"#fff",fontWeight:700,fontSize:13}}>{p.first_name} {p.last_name}</div>
                                <div style={{color:"rgba(255,255,255,0.3)",fontSize:10,marginTop:1}}>{p.latest?.team||"—"}</div>
                              </div>
                            </div>
                          ):(
                            <button onClick={()=>{setActiveSlot(isActive?null:i);setQuery("");setResults([]);}}
                              style={{background:"none",border:"1px dashed rgba(255,255,255,0.08)",borderRadius:8,padding:"6px 14px",color:"rgba(255,255,255,0.2)",cursor:"pointer",fontSize:11,fontWeight:600,letterSpacing:"0.05em",transition:"all 0.15s"}}
                              onMouseEnter={e=>{(e.currentTarget.style.borderColor=s.color);(e.currentTarget.style.color=s.color);}}
                              onMouseLeave={e=>{(e.currentTarget.style.borderColor="rgba(255,255,255,0.08)");(e.currentTarget.style.color="rgba(255,255,255,0.2)");}}>
                              + {s.label}
                            </button>
                          )}
                        </td>
                        <td style={{padding:"13px 16px"}}>{p?.position&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.06)",fontWeight:600}}>{p.position}</span>}</td>
                        {["pts","reb","ast","stl","blk"].map(k=>(
                          <td key={k} style={{padding:"13px 16px",fontSize:13,fontWeight:500,color:p?"rgba(255,255,255,0.75)":"rgba(255,255,255,0.12)"}}>{p?.latest?.[k]||"—"}</td>
                        ))}
                        <td style={{padding:"13px 16px"}}>{p?<span style={{fontWeight:800,fontSize:15,color:fsColor(p.latest?.fantasy_score||0)}}>{p.latest?.fantasy_score||"—"}</span>:<span style={{color:"rgba(255,255,255,0.12)"}}>—</span>}</td>
                        <td style={{padding:"13px 16px"}}>{p?<span style={{fontWeight:900,fontSize:15,color:fsColor(p.latest?.fantasy_score||0)}}>{fsGrade(p.latest?.fantasy_score||0)}</span>:<span style={{color:"rgba(255,255,255,0.12)"}}>—</span>}</td>
                        <td style={{padding:"13px 16px"}}>{p?<span style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:"rgba(96,165,250,0.08)",color:"#60a5fa",fontWeight:700,border:"1px solid rgba(96,165,250,0.15)",whiteSpace:"nowrap"}}>{draftVal(p.latest?.fantasy_score||0)}</span>:<span style={{color:"rgba(255,255,255,0.12)"}}>—</span>}</td>
                        <td style={{padding:"13px 16px"}}>{p&&<button onClick={()=>drop(i)} style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",color:"#f87171",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:10,fontWeight:700,letterSpacing:"0.05em"}} onMouseEnter={e=>{(e.currentTarget.style.background="rgba(239,68,68,0.15)");}} onMouseLeave={e=>{(e.currentTarget.style.background="rgba(239,68,68,0.06)");}}>DROP</button>}</td>
                      </tr>
                      {isActive&&(
                        <tr key={`s${i}`} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                          <td colSpan={12} style={{padding:"16px 24px",background:"rgba(96,165,250,0.03)",borderLeft:`2px solid ${s.color}`}}>
                            <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:12}}>
                              Adding to <span style={{color:s.color,fontWeight:700}}>{s.slot} — {s.label}</span>
                              {loading&&<span style={{marginLeft:12,color:"rgba(255,255,255,0.4)"}}>Fetching player data...</span>}
                            </div>
                            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
                              <input autoFocus type="text" value={query} onChange={e=>search(e.target.value)} placeholder="Search NBA player..."
                                style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"10px 16px",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                              <button onClick={()=>{setActiveSlot(null);setResults([]);setQuery("");}} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,color:"rgba(255,255,255,0.4)",cursor:"pointer",padding:"8px 14px",fontSize:12,fontWeight:600}}>Cancel</button>
                            </div>
                            {results.length>0&&(
                              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:8}}>
                                {results.slice(0,9).map(r=>(
                                  <button key={r.id} onClick={()=>addPlayer(r,i)}
                                    style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"10px 14px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}
                                    onMouseEnter={e=>{(e.currentTarget.style.borderColor=s.color);(e.currentTarget.style.background=`${s.color}08`);}}
                                    onMouseLeave={e=>{(e.currentTarget.style.borderColor="rgba(255,255,255,0.07)");(e.currentTarget.style.background="rgba(255,255,255,0.03)");}}>
                                    <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${r.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:28,height:21,objectFit:"cover",objectPosition:"top",borderRadius:5}}/>
                                    <div>
                                      <div style={{color:"#fff",fontWeight:700,fontSize:12}}>{r.first_name} {r.last_name}</div>
                                      <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:1}}>Click to add</div>
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
          <div style={{background:"linear-gradient(180deg,rgba(255,255,255,0.035) 0%,rgba(255,255,255,0.02) 100%)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,overflow:"hidden"}}>
            <div style={{padding:"16px 24px",borderBottom:"1px solid rgba(255,255,255,0.05)",background:"rgba(255,255,255,0.02)"}}><span style={{fontWeight:700,fontSize:14}}>Team Analytics</span></div>
            {filled.length===0?(<div style={{padding:80,textAlign:"center",color:"rgba(255,255,255,0.15)",fontSize:15}}>Add players to your roster first</div>):(
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  {["PLAYER","POS","PTS","REB","AST","STL","BLK","FG%","FANTASY","GRADE","2025-26","DRAFT"].map(h=>(
                    <th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:9,color:"rgba(255,255,255,0.2)",fontWeight:700,letterSpacing:"0.1em"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[...filled].sort((a,b)=>(b.latest?.fantasy_score||0)-(a.latest?.fantasy_score||0)).map((p:any)=>(
                    <tr key={p.id} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                      <td style={{padding:"13px 16px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{width:36,height:27,objectFit:"cover",objectPosition:"top",borderRadius:8}}/>
                          <span style={{color:"#fff",fontWeight:700,fontSize:13}}>{p.first_name} {p.last_name}</span>
                        </div>
                      </td>
                      <td style={{padding:"13px 16px"}}>{p.position&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.06)",fontWeight:600}}>{p.position}</span>}</td>
                      {["pts","reb","ast","stl","blk"].map(k=>(<td key={k} style={{padding:"13px 16px",fontSize:13,color:"rgba(255,255,255,0.75)"}}>{p.latest?.[k]||"—"}</td>))}
                      <td style={{padding:"13px 16px",fontSize:13,color:"rgba(255,255,255,0.75)"}}>{p.latest?.fg_pct?`${(p.latest.fg_pct*100).toFixed(1)}%`:"—"}</td>
                      <td style={{padding:"13px 16px",fontWeight:800,fontSize:15,color:fsColor(p.latest?.fantasy_score||0)}}>{p.latest?.fantasy_score||"—"}</td>
                      <td style={{padding:"13px 16px",fontWeight:900,fontSize:15,color:fsColor(p.latest?.fantasy_score||0)}}>{fsGrade(p.latest?.fantasy_score||0)}</td>
                      <td style={{padding:"13px 16px",fontWeight:700,color:p.prediction?fsColor(p.prediction.fantasy_score):"rgba(255,255,255,0.2)"}}>{p.prediction?.fantasy_score||"—"}</td>
                      <td style={{padding:"13px 16px"}}><span style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:"rgba(96,165,250,0.08)",color:"#60a5fa",fontWeight:700,border:"1px solid rgba(96,165,250,0.15)"}}>{draftVal(p.latest?.fantasy_score||0)}</span></td>
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
