"use client";
import { useState, useCallback } from "react";
import { searchPlayers } from "@/lib/api";
import { Player } from "@/types/player";

interface Props { onSelect: (player: Player) => void; }

export default function PlayerSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const data = await searchPlayers(q);
      setResults(data.data || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 16px" }}>
        <input type="text" value={query} onChange={e => handleSearch(e.target.value)}
          placeholder="Search any NBA player..."
          style={{ background: "transparent", flex: 1, outline: "none", color: "#fff", fontSize: 15 }} />
        {loading && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Searching...</span>}
      </div>
      {results.length > 0 && (
        <div style={{ position: "absolute", top: "100%", marginTop: 8, width: "100%", background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden", zIndex: 10 }}>
          {results.map((p) => (
            <button key={p.id} onClick={() => { onSelect(p); setResults([]); setQuery(""); }}
              style={{ width: "100%", textAlign: "left", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#fff" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {p.first_name[0]}{p.last_name[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.first_name} {p.last_name}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{p.position || "—"}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
