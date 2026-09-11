"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000" });

const STORAGE_KEY = "athleteiq_agent_conversation";
const MAX_HISTORY_TURNS = 8; // sent to the backend as prior context, so follow-ups like "what about his assists" work

type Msg = { role: "user" | "assistant"; text: string; source?: string; navigate?: string | null };

const SUGGESTIONS = [
  "Compare Luka Doncic and Nikola Jokic",
  "Who's injured right now?",
  "Should I start Wembanyama this week?",
];

function loadConversation(): Msg[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function AgentWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(loadConversation());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages, loading]);

  const send = async (question: string) => {
    if (!question.trim() || loading) return;
    const history = messages
      .slice(-MAX_HISTORY_TURNS)
      .map((m) => ({ role: m.role, content: m.text }));
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    const res = await api.post("/api/agent/ask", { question, history }).catch(() => null);
    const answer = res?.data?.answer || res?.data?.error || "Couldn't reach the agent — the backend may be offline.";
    const source = res?.data?.source;
    const navigate = res?.data?.navigate as string | null | undefined;
    setMessages((m) => [...m, { role: "assistant", text: answer, source, navigate }]);
    setLoading(false);

    if (navigate) {
      setNavigatingTo(navigate);
      setTimeout(() => {
        router.push(navigate);
        setOpen(false);
        setNavigatingTo(null);
      }, 1100);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AthleteIQ agent" : "Ask AthleteIQ agent"}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 100,
          width: 52, height: 52, borderRadius: "50%", border: "none", cursor: "pointer",
          background: "linear-gradient(135deg,#a78bfa,#f472b6)",
          boxShadow: "0 8px 24px rgba(167,139,250,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, color: "#fff",
        }}
      >
        {open ? "×" : "✦"}
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: 88, right: 24, zIndex: 99,
          width: "min(360px, calc(100vw - 32px))", maxHeight: "min(520px, calc(100vh - 140px))",
          display: "flex", flexDirection: "column",
          background: "#0d0d14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)", overflow: "hidden",
        }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: "rgba(167,139,250,0.7)", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 2 }}>ATHLETEIQ AGENT</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Ask a question — it can take you straight to the right page.</div>
            </div>
            {messages.length > 0 && (
              <button onClick={clearConversation} title="Clear conversation"
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 11, flexShrink: 0, padding: 2 }}>
                clear
              </button>
            )}
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, minHeight: 120 }}>
            {messages.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    style={{ textAlign: "left", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 10, padding: "8px 12px", color: "rgba(255,255,255,0.65)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%" }}>
                <div style={{
                  background: m.role === "user" ? "rgba(96,165,250,0.14)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${m.role === "user" ? "rgba(96,165,250,0.25)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 12, padding: "9px 12px", color: "rgba(255,255,255,0.92)", fontSize: 12.5, lineHeight: 1.5, whiteSpace: "pre-wrap",
                }}>
                  {m.text}
                </div>
                {m.navigate && (
                  <div style={{ fontSize: 10, color: "rgba(167,139,250,0.7)", marginTop: 4, paddingLeft: 4 }}>
                    → taking you to {m.navigate}
                  </div>
                )}
                {m.source === "fallback" && (
                  <div style={{ fontSize: 10, color: "rgba(251,191,36,0.6)", marginTop: 4, paddingLeft: 4 }}>
                    data-only fallback — ANTHROPIC_API_KEY not configured
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>thinking…</div>}
            {navigatingTo && <div style={{ color: "rgba(167,139,250,0.7)", fontSize: 11 }}>navigating…</div>}
          </div>

          <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <input
              type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask anything…"
              style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 10, padding: "8px 12px", color: "#fff", fontSize: 12.5, outline: "none", fontFamily: "inherit" }}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()}
              style={{ background: "linear-gradient(135deg,#a78bfa,#f472b6)", border: "none", borderRadius: 10, padding: "0 14px", color: "#fff", fontWeight: 700, fontSize: 12, cursor: loading ? "default" : "pointer", opacity: loading || !input.trim() ? 0.5 : 1 }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
