import { usePlayerStore } from "../app/playerStore";
import type { Track } from "../api/catalog";
import { useEffect, useRef } from "react";

type Props = Readonly<{ track: Track }>;

export default function TrackItem({ track }: Props) {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const isActive = currentTrackId === track.id;
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isActive]);

  const handlePlay = () =>
    void playTrack({
      id: track.id,
      title: track.title,
      artistName: track.artistName,
    });

  return (
    <button
      type="button"
      ref={ref}
      onClick={handlePlay}
      style={{
        ...styles.button,
        ...(isActive ? styles.buttonActive : null),
      }}
      aria-label={`Play ${track.title} by ${track.artistName}`}
      aria-pressed={isActive}
    >
      <div
        style={{
          ...styles.content,
          ...(isActive ? styles.contentActive : null),
        }}
      >
        <div>
          <div
            style={{
              ...styles.title,
              ...(isActive ? styles.titleActive : null),
            }}
          >
            {track.title}
          </div>

          <small
            style={{
              ...styles.meta,
              ...(isActive ? styles.metaActive : null),
            }}
          >
            {track.artistName} • {track.albumTitle}
          </small>

          {track.genres.length > 0 && (
            <div>
              <small
                style={{
                  ...styles.genres,
                  ...(isActive ? styles.genresActive : null),
                }}
              >
                {track.genres.join(", ")}
              </small>
            </div>
          )}
        </div>

        <div style={styles.rightSide}>
          {isActive && (
            <div
              style={{
                ...styles.playingBadge,
                ...(isPlaying ? styles.playingBadgeActive : null),
              }}
            >
              {isPlaying ? "Playing" : "Paused"}
            </div>
          )}

          <div
            style={{
              ...styles.duration,
              ...(isActive ? styles.durationActive : null),
            }}
          >
            {Math.floor(track.durationSeconds / 60)}:
            {(track.durationSeconds % 60).toString().padStart(2, "0")}
          </div>
        </div>
      </div>
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    width: "100%",
    display: "block",
    padding: 0,
    border: "none",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    color: "inherit",
    font: "inherit",
    outline: "none",
  },

  buttonActive: {
    background: "rgba(34,197,94,0.05)",
  },

  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid var(--border)",
    gap: 12,
    color: "white",
    transition: "background 160ms ease, border-color 160ms ease",
  },

  contentActive: {
    borderBottom: "1px solid rgba(34,197,94,0.35)",
    background:
      "linear-gradient(90deg, rgba(34,197,94,0.14), rgba(34,197,94,0.04))",
    boxShadow: "inset 3px 0 0 #22c55e",
  },

  title: {
    color: "white",
    fontWeight: 600,
  },

  titleActive: {
    color: "#dcfce7",
  },

  meta: {
    color: "rgba(255,255,255,0.72)",
  },

  metaActive: {
    color: "rgba(220,252,231,0.82)",
  },

  genres: {
    color: "rgba(255,255,255,0.58)",
  },

  genresActive: {
    color: "rgba(187,247,208,0.75)",
  },

  rightSide: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
    flexShrink: 0,
  },

  playingBadge: {
    minWidth: 62,
    textAlign: "center",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.75)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  playingBadgeActive: {
    background: "rgba(34,197,94,0.18)",
    color: "#bbf7d0",
    border: "1px solid rgba(34,197,94,0.35)",
  },

  duration: {
    flexShrink: 0,
    color: "rgba(255,255,255,0.82)",
  },

  durationActive: {
    color: "#dcfce7",
  },
};