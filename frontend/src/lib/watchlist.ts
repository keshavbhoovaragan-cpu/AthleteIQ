const KEY = "athleteiq_watchlist";

export function getWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(list: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

export function addToWatchlist(name: string): string[] {
  const list = getWatchlist();
  if (!list.some((n) => n.toLowerCase() === name.toLowerCase())) list.push(name);
  save(list);
  return list;
}

export function removeFromWatchlist(name: string): string[] {
  const list = getWatchlist().filter((n) => n.toLowerCase() !== name.toLowerCase());
  save(list);
  return list;
}
