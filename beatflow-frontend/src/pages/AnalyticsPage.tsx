import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getTracks, type Track } from "../api/catalog";
import {
  getMyPlaybackHistory,
  type PlaybackHistoryItem,
} from "../api/analytics";

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString();
}

export default function AnalyticsPage() {
  const navigate = useNavigate();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [history, setHistory] = useState<PlaybackHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTracks(), getMyPlaybackHistory()])
      .then(([tracksData, historyData]) => {
        setTracks(tracksData);
        setHistory(historyData);
      })
      .finally(() => setLoading(false));
  }, []);

  const trackMap = useMemo(() => {
    return new Map(tracks.map((t) => [t.id, t]));
  }, [tracks]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={() => navigate("/")} style={styles.backButton}>
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 style={styles.title}>Playback Analytics</h1>
        </header>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : history.length === 0 ? (
          <div style={styles.loading}>No history yet</div>
        ) : (
          <div style={styles.list}>
            {history.map((item) => {
              const track = trackMap.get(item.trackId);

              return (
                <div key={item.id} style={styles.card}>
                  <div>
                    <div style={styles.trackTitle}>
                      {track?.title ?? item.trackId}
                    </div>
                    <div style={styles.meta}>
                      {track
                        ? `${track.artistName} • ${track.albumTitle}`
                        : "Unknown track"}
                    </div>
                  </div>

                  <div style={styles.side}>
                    <div style={styles.device}>{item.deviceId}</div>
                    <div style={styles.time}>{formatDate(item.startedAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 24,
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },
  title: {
    margin: 0,
    fontSize: 28,
  },
  loading: {
    color: "rgba(255,255,255,0.7)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  trackTitle: {
    fontWeight: 700,
    color: "white",
  },
  meta: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },
  side: {
    textAlign: "right",
  },
  device: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  time: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
};
