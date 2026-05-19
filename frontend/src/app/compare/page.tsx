"use client";
import NavBar from "@/components/nav/NavBar";
import { useState } from "react";
import PlayerSearchInline from "@/components/compare/PlayerSearchInline";
import CompareCard from "@/components/compare/CompareCard";
import { Player } from "@/types/player";

export default function ComparePage() {
  const [playerA, setPlayerA] = useState<Player | null>(null);
  const [playerB, setPlayerB] = useState<Player | null>(null);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <NavBar />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, background: "linear-gradient(135deg, #fff 60%, rgba(255,255,255,0.4))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Player Compare</h1>
        <p style={{ color: "rgba(255,255,255,0.35)", marginBottom: 32, fontSize: 15 }}>Head-to-head stats, career trajectories, and fantasy value comparison.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: 8 }}>PLAYER A</p>
            <PlayerSearchInline onSelect={setPlayerA} selected={playerA} accent="#60a5fa" />
          </div>
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: 8 }}>PLAYER B</p>
            <PlayerSearchInline onSelect={setPlayerB} selected={playerB} accent="#a78bfa" />
          </div>
        </div>
        {playerA && playerB ? <CompareCard playerA={playerA} playerB={playerB} /> : (
          <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.15)", fontSize: 15 }}>Search two players above to compare them</div>
        )}
      </div>
    </main>
  );
}
