import type { PageResponse } from "../models/paging";
import { createClient } from "./baseClient";

export const analyticsClient = createClient(import.meta.env.VITE_ANALYTICS_API);

export interface PlaybackHistoryItem {
  id: string;
  sessionId: string;
  userId: string;
  trackId: string;
  trackTitle: string | null;
  artistName: string | null;
  albumTitle: string | null;
  deviceId: string;
  startedAt: string;
  createdAt: string;
}

export async function getMyPlaybackHistory(
  page = 0,
  size = 20,
): Promise<PageResponse<PlaybackHistoryItem>> {
  const res = await analyticsClient.get("/me/history", {
    params: { page, size },
  });
  return res.data;
}
