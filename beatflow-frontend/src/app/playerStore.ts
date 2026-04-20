import { create } from "zustand";
import { startPlayback } from "../api/playback";

export interface QueueTrack {
  id: string;
  title: string;
  artistName: string;
}
interface PlayerState {
  queue: QueueTrack[];
  currentTrackId: string | null;
  currentTrackUrl: string | null;
  currentTrackTitle: string | null;
  currentArtistName: string | null;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  previousVolume: number;
  isShuffleEnabled: boolean;

  setQueue: (tracks: QueueTrack[]) => void;
  playTrack: (track: QueueTrack) => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  resume: () => void;
  pause: () => void;
  setProgress: (currentTime: number, duration: number) => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  reset: () => void;
}

async function resolveTrackPlayback(track: QueueTrack) {
  const response = await startPlayback(track.id);

  return {
    currentTrackId: track.id,
    currentTrackUrl: response.streamUrl,
    currentTrackTitle: track.title,
    currentArtistName: track.artistName,
    currentTime: 0,
    duration: 0,
    isPlaying: true,
  };
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentTrackId: null,
  currentTrackUrl: null,
  currentTrackTitle: null,
  currentArtistName: null,
  duration: 0,
  currentTime: 0,
  isPlaying: false,
  isShuffleEnabled: false,
  volume: 1,
  previousVolume: 1,

  toggleShuffle: () =>
    set((state) => ({
      isShuffleEnabled: !state.isShuffleEnabled,
    })),

  setQueue: (tracks) =>
    set(() => ({
      queue: tracks,
    })),

  playTrack: async (track) => {
    const nextState = await resolveTrackPlayback(track);
    set(() => nextState);
  },

  playNext: async () => {
    const { queue, currentTrackId, isShuffleEnabled } = get();
    if (!queue.length || !currentTrackId) return;

    const currentIndex = queue.findIndex((track) => track.id === currentTrackId);
    if (currentIndex === -1) return;

    let nextTrack: QueueTrack | undefined;

    if (isShuffleEnabled && queue.length > 1) {
      const candidates = queue.filter((track) => track.id !== currentTrackId);
      nextTrack = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      nextTrack = queue[currentIndex + 1];
    }

    if (!nextTrack) return;

    const nextState = await resolveTrackPlayback(nextTrack);
    set(() => nextState);
  },

  playPrevious: async () => {
    const { queue, currentTrackId, currentTime, isShuffleEnabled } = get();

    if (currentTime > 3) {
      set((state) => ({
        currentTime: 0,
        duration: state.duration,
      }));
      return;
    }

    if (!queue.length || !currentTrackId) return;

    const currentIndex = queue.findIndex((track) => track.id === currentTrackId);
    if (currentIndex === -1) return;

    let previousTrack: QueueTrack | undefined;

    if (isShuffleEnabled && queue.length > 1) {
      const candidates = queue.filter((track) => track.id !== currentTrackId);
      previousTrack = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      if (currentIndex <= 0) return;
      previousTrack = queue[currentIndex - 1];
    }

    if (!previousTrack) return;

    const nextState = await resolveTrackPlayback(previousTrack);
    set(() => nextState);
  },

  resume: () =>
    set(() => ({
      isPlaying: true,
    })),

  pause: () =>
    set(() => ({
      isPlaying: false,
    })),

  setProgress: (currentTime, duration) =>
    set(() => ({
      currentTime,
      duration,
    })),

  seek: (time) =>
    set((state) => ({
      currentTime: time,
      duration: state.duration,
    })),

  setVolume: (volume) =>
    set((state) => {
      const normalized = Math.max(0, Math.min(1, volume));
      return {
        volume: normalized,
        previousVolume: normalized > 0 ? normalized : state.previousVolume,
      };
    }),

  toggleMute: () =>
    set((state) => {
      if (state.volume === 0) {
        return {
          volume: state.previousVolume > 0 ? state.previousVolume : 1,
        };
      }

      return {
        previousVolume: state.volume,
        volume: 0,
      };
    }),


  reset: () =>
    set({
      queue: [],
      currentTrackId: null,
      currentTrackUrl: null,
      currentTrackTitle: null,
      currentArtistName: null,
      duration: 0,
      currentTime: 0,
      isPlaying: false,
      isShuffleEnabled: false,
      volume: 1,
      previousVolume: 1,
    }),
}));