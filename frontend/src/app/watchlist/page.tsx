"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import NavBar from "@/components/nav/NavBar";
import PageHeader from "@/components/ui/PageHeader";
import { searchPlayers } from "@/lib/api";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import axios from "axios";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000" });
const POLL_MS = 60000;

type Alert = {
  player: string;
  id?: number;
  found: boolean;
  injury: { status: string; injury: string; return_est: string; severity: string } | null;
  streak: { streak_label: string; color: string; last5_avg_fs: number; diff_from_avg: number } | null;
};

function signature(a: Alert): string {
  return `${a.injury?.status || ""}|${a.streak?.streak_label || ""}`;
}

export default function WatchlistPage() {
  const [watched, setWatched] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | "unsupported">("default");
  const lastSignatures = useRef<Record<string, string>>({});

  useEffect(() => {
    setWatched(getWatchlist());
    setNotifPermission(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  }, []);

  const poll = useCallback(async (players: string[], notify: boolean) => {
    if (players.length === 0) { setAlerts([]); return; }
    setLoading(true);
    const res = await api.get("/api/watchlist/check", { params: { players: players.join(",") } }).catch(() => null);
    const next: Alert[] = res?.data?.alerts || [];
    setAlerts(next);
    setLoading(false);

    if (notify && notifPermission === "granted") {
      for (const a of next) {
        const sig = signature(a);
        const prev = lastSignatures.current[a.player];
        if (prev !== undefined && prev !== sig && sig.trim() !== "|") {
          try {
            new Notification(`AthleteIQ — ${a.player}`, {
              body: [a.injury ? `${a.injury.status}: ${a.injury.injury}` : null, a.streak ? a.streak.streak_label : null]
                .filter(Boolean).join(" · "),
            });
          } catch {}
        }
        lastSignatures.current[a.player] = sig;
      }
    } else {
      for (const a of next) lastSignatures.current[a.player] = signature(a);
    }
  }, [notifPermission]);

  useEffect(() => {
    if (watched.length === 0) { setAlerts([]); return; }
    poll(watched, false); // first check on load/add just establishes the baseline, no notification spam
    const interval = setInterval(() => poll(watched, true), POLL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched.join(",")]);

  const search = async (v: string) => {
    setQ(v);
    if (v.length < 2) { setResults([]); return; }
    const res = await searchPlayers(v).catch(() => ({ data: [] }));
    setResults((res as any).data || []);
  };

  const add = (name: string) => {
    setWatched(addToWatchlist(name));
    setQ(""); setResults([]);
  };

  const remove = (name: string) => setWatched(removeFromWatchlist(name));

  const enableNotifications = async () => {
    if (typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
  };

  return (
    <main style={{ minHeight: "100vh" }}>
      <NavBar />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 24px", position: "relative", zIndex: 1 }}>
        <PageHeader eyebrow="Personal" title="Watchlist" titleGradient="purple" subtitle="Star players to get alerted here when their injury status or streak changes." />

        <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <input type="text" value={q} onChange={(e) => search(e.target.value)} placeholder="Search a player to watch..."
              style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 14px", color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
            {results.length > 0 && (
              <div style={{ position: "absolute", top: "100%", marginTop: 6, width: "100%", background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden", zIndex: 20 }}>
                {results.slice(0, 6).map((r) => (
                  <button key={r.id} onClick={() => add(r.full_name)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(167,139,250,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{r.first_name} {r.last_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {notifPermission !== "granted" && notifPermission !== "unsupported" && (
            <button onClick={enableNotifications}
              style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "10px 16px", color: "#a78bfa", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              Enable browser alerts
            </button>
          )}
        </div>

        {notifPermission === "granted" && (
          <div style={{ fontSize: 11, color: "rgba(34,197,94,0.7)", marginBottom: 20 }}>Browser alerts enabled — you'll get a notification when a watched player's status changes, while this tab is open.</div>
        )}
        {notifPermission !== "granted" && (
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 20 }}>Alerts always show below when you're on this page; enable browser alerts to also get notified while this tab is in the background.</div>
        )}

        {watched.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text-dim)", fontSize: 14 }}>Search above to start watching a player.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {watched.map((name) => {
              const a = alerts.find((x) => x.player.toLowerCase() === name.toLowerCase() || x.player.toLowerCase().includes(name.toLowerCase()));
              return (
                <div key={name} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 15 }}>{a?.player || name}</div>
                    {a && !a.found && <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Couldn't find this player in NBA data</div>}
                  </div>
                  {a?.injury && (
                    <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20, background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                      {a.injury.status} — {a.injury.injury}
                    </span>
                  )}
                  {a?.streak && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: a.streak.color }}>{a.streak.streak_label}</span>
                  )}
                  <button onClick={() => remove(name)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
              );
            })}
          </div>
        )}
        {loading && <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 12 }}>checking…</div>}
      </div>
    </main>
  );
}
