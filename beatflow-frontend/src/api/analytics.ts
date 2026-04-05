import { createClient } from "./baseClient";

export const analyticsClient = createClient(import.meta.env.VITE_ANALYTICS_API);

export interface PlaybackHistoryItem {
  id: string;
  sessionId: string;
  userId: string;
  trackId: string;
  deviceId: string;
  startedAt: string;
  createdAt: string;
}

export async function getMyPlaybackHistory(): Promise<PlaybackHistoryItem[]> {
  const res = await analyticsClient.get("/me/history");
  return res.data;
}
