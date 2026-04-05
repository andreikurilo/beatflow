import { createClient } from "./baseClient";

export const catalogClient = createClient(import.meta.env.VITE_CATALOG_API);

export interface Track {
  id: string;
  title: string;
  durationSeconds: number;
  audioUrl: string;
  albumTitle: string;
  artistName: string;
}

export async function getTracks(): Promise<Track[]> {
  const res = await catalogClient.get("/api/tracks");
  return res.data;
}
