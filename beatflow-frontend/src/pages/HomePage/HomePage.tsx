import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Music4, Sparkles } from "lucide-react";
import { useAuthStore } from "../../app/store";
import { usePlayerStore } from "../../app/playerStore";
import { logout } from "../../api/auth";
import { getTracks, type Track } from "../../api/catalog";
import TrackItem from "../../components/TrackItem";
import Footer from "../../components/Footer";

export default function HomePage() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const email = useAuthStore((s) => s.email);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const resetPlayer = usePlayerStore((s) => s.reset);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getTracks()
      .then((data) => {
        setTracks(data);
        setQueue(
          data.map((track) => ({
            id: track.id,
            title: track.title,
            artistName: track.artistName,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, [setQueue]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      resetPlayer();
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlowTop} />
      <div style={styles.backgroundGlowBottom} />

      <div style={styles.container}>
        <header
          style={{
            ...styles.header,
            ...(isMobile ? styles.headerMobile : null),
          }}
        >
          <div style={styles.brandBlock}>
            <div style={styles.logoCard}>
              <img
                src="/beatflow_logo.svg"
                alt="Beatflow"
                style={styles.logo}
              />
            </div>

            <div style={styles.heroText}>
              <div style={styles.badgeRow}>
                <span style={styles.badge}>
                  <Sparkles size={14} />
                  Vibes on
                </span>
                <span style={styles.badgeSecondary}>
                  <Music4 size={14} />
                  Demo catalog
                </span>
              </div>

              <h1 style={styles.title}>Your music, in motion.</h1>
              <p style={styles.subtitle}>
                Stream royalty-safe tracks, explore your catalog, and control
                playback in one clean interface.
              </p>
            </div>
          </div>

          <div
            style={{
              ...styles.accountBlock,
              ...(isMobile ? styles.accountBlockMobile : null),
            }}
          >
            <div
              style={{
                ...styles.userCard,
                ...(isMobile ? styles.userCardMobile : null),
              }}
            >
              {email ?? "Unknown user"}
            </div>

            <button
              onClick={() => navigate("/analytics")}
              style={styles.analyticsButton}
            >
              View History
            </button>
            <button onClick={handleLogout} style={styles.logoutButton}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main style={styles.mainGrid}>
          <section style={styles.libraryCard}>
            <div
              style={{
                ...styles.libraryHeader,
                ...(isMobile ? styles.libraryHeaderMobile : null),
              }}
            >
              <div>
                <h2 style={styles.sectionTitle}>Library</h2>
                <p style={styles.sectionSubtitle}>
                  {loading
                    ? "Loading tracks..."
                    : `${tracks.length} tracks available`}
                </p>
              </div>

              <div style={styles.libraryMeta}>
                <span style={styles.metaPill}>Beatflow Catalog</span>
              </div>
            </div>

            {loading ? (
              <div style={styles.loadingState}>Loading tracks...</div>
            ) : (
              <div style={styles.trackList}>
                {tracks.map((track) => (
                  <TrackItem key={track.id} track={track} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
      <div style={{ marginTop: 32 }}>
        <Footer />
      </div>

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "20px 16px 220px",
    position: "relative",
    overflow: "hidden",
  },

  container: {
    maxWidth: 1280,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
    width: "100%",
  },

  backgroundGlowTop: {
    position: "fixed",
    top: -120,
    left: -80,
    width: 420,
    height: 420,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(34,197,94,0.16), transparent 70%)",
    filter: "blur(20px)",
    pointerEvents: "none",
  },

  backgroundGlowBottom: {
    position: "fixed",
    right: -120,
    bottom: 100,
    width: 420,
    height: 420,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(59,130,246,0.14), transparent 70%)",
    filter: "blur(24px)",
    pointerEvents: "none",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
    marginBottom: 28,
  },

  headerMobile: {
    flexDirection: "column-reverse",
  },

  brandBlock: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 24,
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    width: "100%",
  },

  logoCard: {
    border: "1px solid rgba(255,255,255,0.06)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
    borderRadius: 24,
    padding: 16,
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
    minWidth: 0,
  },

  logo: {
    width: "100%",
    height: "clamp(100px, 24vw, 140px)",
    objectFit: "cover",
    display: "block",
  },

  heroText: {
    minWidth: 0,
    paddingTop: 8,
  },

  badgeRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    color: "#d1fae5",
    background: "rgba(34,197,94,0.12)",
    border: "1px solid rgba(34,197,94,0.22)",
  },

  badgeSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(255,255,255,0.8)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  title: {
    margin: "0 0 10px",
    fontSize: "clamp(30px, 6vw, 42px)",
    lineHeight: 1.05,
    letterSpacing: -1.2,
    color: "white",
  },

  subtitle: {
    margin: 0,
    maxWidth: 680,
    fontSize: 16,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.72)",
  },

  accountBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
    flexShrink: 0,
    marginTop: 8,
    width: "100%",
    maxWidth: 240,
  },

  accountBlockMobile: {
    maxWidth: "100%",
    alignItems: "stretch",
  },

  userCard: {
    padding: "10px 14px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    fontWeight: 600,
    width: "100%",
    boxSizing: "border-box",
    overflowWrap: "anywhere",
  },

  userCardMobile: {
    textAlign: "left",
  },
  analyticsButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    borderRadius: 14,
    border: "1px solid rgba(59,130,246,0.3)",
    background: "rgba(59,130,246,0.1)",
    color: "#bfdbfe",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    width: "100%",
  },
  logoutButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 18px",
    borderRadius: 16,
    border: "1px solid rgba(34,197,94,0.18)",
    background: "linear-gradient(180deg, #22c55e, #16a34a)",
    color: "#04110a",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(34,197,94,0.2)",
    flexShrink: 0,
    marginTop: 8,
    width: "100%",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 24,
  },

  libraryCard: {
    border: "1px solid rgba(255,255,255,0.06)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
  },

  libraryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    padding: "20px 22px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    flexWrap: "wrap",
  },

  libraryHeaderMobile: {
    alignItems: "flex-start",
  },

  sectionTitle: {
    margin: 0,
    fontSize: 22,
    color: "white",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    fontSize: 14,
    color: "rgba(255,255,255,0.62)",
  },

  libraryMeta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  metaPill: {
    padding: "8px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(255,255,255,0.82)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  loadingState: {
    padding: "28px 22px",
    color: "rgba(255,255,255,0.72)",
  },

  trackList: {
    overflow: "hidden",
  },
};
