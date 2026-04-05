import { usePlayerStore } from "../app/playerStore";
import type { Track } from "../api/catalog";

export default function TrackItem({ track }: { track: Track }) {
  const playTrack = usePlayerStore((s) => s.playTrack);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
      }}
      onClick={() =>
        void playTrack({
          id: track.id,
          title: track.title,
          artistName: track.artistName,
        })
      }
    >
      <div>
        <div>{track.title}</div>
        <small>
          {track.artistName} • {track.albumTitle}
        </small>
      </div>

      <div>
        {Math.floor(track.durationSeconds / 60)}:
        {(track.durationSeconds % 60).toString().padStart(2, "0")}
      </div>
    </div>
  );
}
