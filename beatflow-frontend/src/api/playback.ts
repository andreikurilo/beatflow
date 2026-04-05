import { createClient } from "./baseClient";

export const playbackClient = createClient(import.meta.env.VITE_PLAYBACK_API);

export type StartPlaybackResponse = {
  streamUrl: string;
};

export async function startPlayback(
  trackId: string,
): Promise<StartPlaybackResponse> {
  const response = await playbackClient.post(`/api/playback/start/${trackId}`);

  return response.data;
}
