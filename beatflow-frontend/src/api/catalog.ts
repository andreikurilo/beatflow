import { createClient } from "./baseClient";

export const catalogClient = createClient(import.meta.env.VITE_CATALOG_API);

export interface Track {
  id: string;
  title: string;
  durationSeconds: number;
  albumId: string;
  albumTitle: string;
  artistId: string;
  artistName: string;
  genres: string[];
}

export async function getTracks(): Promise<Track[]> {
  const res = await catalogClient.get("");
  return res.data;
}
