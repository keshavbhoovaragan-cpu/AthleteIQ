"use client";
import { useState, useCallback } from "react";
import { searchPlayers } from "@/lib/api";
import { Player } from "@/types/player";
import { Search, X } from "lucide-react";

interface Props {
  onSelect: (player: Player) => void;
  selected: Player | null;
  accent: string;
  placeholder?: string;
}

export default function PlayerSearchInline({ onSelect, selected, accent, placeholder = "Search player..." }: Props) {
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

  if (selected) return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: `${accent}12`, border: `1px solid ${accent}40`, borderRadius: 12, padding: "10px 14px" }}>
      <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${selected.id}.png`} onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{ width: 36, height: 27, objectFit: "cover", objectPosition: "top", borderRadius: 6 }} />
      <span style={{ color: "#fff", fontWeight: 600, flex: 1 }}>{selected.first_name} {selected.last_name}</span>
      <button onClick={() => onSelect(null as any)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={16} /></button>
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px" }}>
        <Search size={16} color="rgba(255,255,255,0.25)" />
        <input type="text" value={query} onChange={e => handleSearch(e.target.value)} placeholder={placeholder}
          style={{ background: "transparent", flex: 1, outline: "none", color: "#fff", fontSize: 14 }} />
        {loading && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>...</span>}
      </div>
      {results.length > 0 && (
        <div style={{ position: "absolute", top: "100%", marginTop: 6, width: "100%", background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden", zIndex: 20 }}>
          {results.map(p => (
            <button key={p.id} onClick={() => { onSelect(p); setResults([]); setQuery(""); }}
              style={{ width: "100%", textAlign: "left", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.04)")}
              onMouseLeave={e=>(e.currentTarget.style.background="none")}>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{p.first_name} {p.last_name}</span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginLeft: "auto" }}>{p.position || "—"}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
