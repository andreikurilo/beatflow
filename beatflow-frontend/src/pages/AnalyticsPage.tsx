import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getMyPlaybackHistory,
  type PlaybackHistoryItem,
} from "../api/analytics";

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString();
}

const PAGE_SIZE = 10;

export default function AnalyticsPage() {
  const navigate = useNavigate();

  const [history, setHistory] = useState<PlaybackHistoryItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const historyPage = await getMyPlaybackHistory(0, PAGE_SIZE);

        setHistory(historyPage.content);
        setPage(historyPage.number);
        setHasMore(!historyPage.last);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  async function handleLoadMore() {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const historyPage = await getMyPlaybackHistory(nextPage, PAGE_SIZE);

      setHistory((prev) => [...prev, ...historyPage.content]);
      setPage(historyPage.number);
      setHasMore(!historyPage.last);
    } finally {
      setLoadingMore(false);
    }
  }

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
          <>
            <div style={styles.list}>
              {history.map((item) => {
                return (
                  <div key={item.id} style={styles.card}>
                    <div>
                      <div style={styles.trackTitle}>
                        {item.trackTitle ?? item.trackId}
                      </div>
                      <div style={styles.meta}>
                        {item.artistName && item.albumTitle
                          ? `${item.artistName} • ${item.albumTitle}`
                          : "Unknown track"}
                      </div>
                    </div>

                    <div style={styles.side}>
                      <div style={styles.device}>{item.deviceId}</div>
                      <div style={styles.time}>
                        {formatDate(item.startedAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div style={styles.loadMoreWrapper}>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={styles.loadMoreButton}
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
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
  loadMoreWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
  },
  loadMoreButton: {
    padding: "10px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },
};
