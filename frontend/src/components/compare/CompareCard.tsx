"use client";
import { useEffect, useState } from "react";
import { getCareerStats } from "@/lib/api";
import { Player } from "@/types/player";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface Props { playerA: Player; playerB: Player; }

export default function CompareCard({ playerA, playerB }: Props) {
  const [careerA, setCareerA] = useState<any>(null);
  const [careerB, setCareerB] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getCareerStats(playerA.id).catch(()=>null), getCareerStats(playerB.id).catch(()=>null)])
      .then(([a, b]) => { setCareerA(a); setCareerB(b); setLoading(false); });
  }, [playerA.id, playerB.id]);

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>Loading comparison... (10-20 seconds)</div>;

  const latestA = careerA?.seasons?.[careerA.seasons.length-1];
  const latestB = careerB?.seasons?.[careerB.seasons.length-1];
  if (!latestA || !latestB) return <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)" }}>Could not load stats for one or both players.</div>;

  const stats = [
    { key: "pts", label: "Points" },
    { key: "ast", label: "Assists" },
    { key: "reb", label: "Rebounds" },
    { key: "stl", label: "Steals" },
    { key: "blk", label: "Blocks" },
    { key: "fg_pct", label: "FG%", format: (v: number) => `${(v*100).toFixed(1)}%` },
    { key: "fantasy_score", label: "Fantasy Score" },
  ];

  const radarData = [
    { s: "Scoring", a: Math.min((latestA.pts/35)*100,100), b: Math.min((latestB.pts/35)*100,100) },
    { s: "Assists", a: Math.min((latestA.ast/12)*100,100), b: Math.min((latestB.ast/12)*100,100) },
    { s: "Rebounds", a: Math.min((latestA.reb/15)*100,100), b: Math.min((latestB.reb/15)*100,100) },
    { s: "Defense", a: Math.min(((latestA.stl+latestA.blk)/5)*100,100), b: Math.min(((latestB.stl+latestB.blk)/5)*100,100) },
    { s: "Shooting", a: Math.min((latestA.fg_pct||0)*180,100), b: Math.min((latestB.fg_pct||0)*180,100) },
    { s: "Fantasy", a: Math.min((latestA.fantasy_score/80)*100,100), b: Math.min((latestB.fantasy_score/80)*100,100) },
  ];

  const winner = (a: number, b: number) => a > b ? "a" : b > a ? "b" : "tie";

  return (
    <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr" }}>
        {[{player:playerA,career:careerA,latest:latestA,color:"#60a5fa"},{player:playerB,career:careerB,latest:latestB,color:"#a78bfa"}].map((side,i) => (
          <div key={i} style={{ padding: "24px", background: `${side.color}08`, borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: i===1?"right":"left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexDirection: i===1?"row-reverse":"row" }}>
              <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${side.player.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{ width: 60, height: 45, objectFit: "cover", objectPosition: "top", borderRadius: 10, border: `2px solid ${side.color}40` }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{side.player.first_name} {side.player.last_name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{side.player.position} · {side.career?.total_seasons} seasons</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: side.color, marginTop: 4 }}>{side.latest?.fantasy_score} <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>Fantasy Score</span></div>
              </div>
            </div>
          </div>
        ))}
        <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: "rgba(255,255,255,0.15)" }}>VS</span>
        </div>
      </div>
      <div style={{ padding: 24, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis dataKey="s" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
            <Radar dataKey="a" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.15} strokeWidth={2} name={playerA.last_name} />
            <Radar dataKey="b" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.15} strokeWidth={2} name={playerB.last_name} />
          </RadarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "#60a5fa" }}>— {playerA.last_name}</span>
          <span style={{ fontSize: 12, color: "#a78bfa" }}>— {playerB.last_name}</span>
        </div>
      </div>
      <div>
        {stats.map(({ key, label, format }) => {
          const vA = latestA[key] || 0;
          const vB = latestB[key] || 0;
          const w = winner(vA, vB);
          const maxVal = Math.max(vA, vB) || 1;
          return (
            <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ height: 4, borderRadius: 2, background: w==="a"?"#60a5fa":"rgba(255,255,255,0.08)", width: `${(vA/maxVal)*100}%`, maxWidth: "100%", minWidth: 4 }} />
                <span style={{ fontSize: 15, fontWeight: w==="a"?700:400, color: w==="a"?"#fff":"rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{format ? format(vA) : vA}</span>
              </div>
              <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{label}</span>
              </div>
              <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
                <span style={{ fontSize: 15, fontWeight: w==="b"?700:400, color: w==="b"?"#fff":"rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{format ? format(vB) : vB}</span>
                <div style={{ height: 4, borderRadius: 2, background: w==="b"?"#a78bfa":"rgba(255,255,255,0.08)", width: `${(vB/maxVal)*100}%`, maxWidth: "100%", minWidth: 4 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
