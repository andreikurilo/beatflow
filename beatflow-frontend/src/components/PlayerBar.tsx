import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePlayerStore } from "../app/playerStore";

function formatTime(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const iconButtonStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 999,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
};

const controlButtonStyle: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 999,
  border: "none",
  background: "white",
  color: "black",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

export default function PlayerBar() {
  const currentTrackTitle = usePlayerStore((s) => s.currentTrackTitle);
  const currentArtistName = usePlayerStore((s) => s.currentArtistName);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);
  const pause = usePlayerStore((s) => s.pause);
  const resume = usePlayerStore((s) => s.resume);
  const seek = usePlayerStore((s) => s.seek);
  const playNext = usePlayerStore((s) => s.playNext);
  const playPrevious = usePlayerStore((s) => s.playPrevious);

  if (!currentTrackTitle) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        borderTop: "1px solid var(--border)",
        background: "rgba(11, 15, 25, 0.94)",
        backdropFilter: "blur(18px)",
        padding: "14px 20px 18px",
        zIndex: 1000,
        boxShadow: "0 -10px 40px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.2fr 2fr 1fr",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div
          style={{
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.35), rgba(255,255,255,0.08))",
              border: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
            }}
          />

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: 15,
              }}
            >
              {currentTrackTitle}
            </div>
            <div
              style={{
                fontSize: 13,
                opacity: 0.72,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentArtistName}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              type="button"
              style={iconButtonStyle}
              aria-label="Previous"
              onClick={() => void playPrevious()}
            >
              <SkipBack size={18} />
            </button>

            <button
              type="button"
              onClick={() => {
                if (isPlaying) {
                  pause();
                } else {
                  resume();
                }
              }}
              style={controlButtonStyle}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={22} />
              ) : (
                <Play size={22} fill="black" />
              )}
            </button>

            <button
              type="button"
              style={iconButtonStyle}
              aria-label="Next"
              onClick={() => void playNext()}
            >
              <SkipForward size={18} />
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr 48px",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 12,
                opacity: 0.75,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#22c55e",
                cursor: "pointer",
              }}
            />

            <span
              style={{
                fontSize: 12,
                opacity: 0.75,
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={toggleMute}
            style={{
              ...iconButtonStyle,
              width: 36,
              height: 36,
              background: "transparent",
              border: "none",
            }}
            aria-label={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? (
              <VolumeX size={18} style={{ opacity: 0.7 }} />
            ) : (
              <Volume2 size={18} style={{ opacity: 0.7 }} />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{
              width: 110,
              accentColor: "#22c55e",
              cursor: "pointer",
            }}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
