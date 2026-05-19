import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

export const searchPlayers = async (name: string) => {
  const { data } = await api.get("/api/players/search", { params: { name } });
  return data;
};

export const getCareerStats = async (playerId: number) => {
  const { data } = await api.get(`/api/players/${playerId}/career`);
  return data;
};

export const getRecentGames = async (playerId: number) => {
  const { data } = await api.get(`/api/players/${playerId}/recent`);
  return data;
};

export const getRankings = async () => {
  const { data } = await api.get("/api/rankings");
  return data;
};
