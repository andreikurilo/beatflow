import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type InfoPageLayoutProps = Readonly<{
  title: string;
  subtitle: string;
  children: ReactNode;
}>;

export default function InfoPageLayout({
  title,
  subtitle,
  children,
}: InfoPageLayoutProps) {
  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlowTop} />
      <div style={styles.backgroundGlowBottom} />

      <div style={styles.container}>
        <div style={styles.topBar}>
          <Link to="/" style={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Beatflow
          </Link>
        </div>

        <div style={styles.card}>
          <div style={styles.header}>
            <img src="/beatflow_logo.svg" alt="Beatflow" style={styles.logo} />

            <div>
              <h1 style={styles.title}>{title}</h1>
              <p style={styles.subtitle}>{subtitle}</p>
            </div>
          </div>

          <div style={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "28px 20px 80px",
    position: "relative",
    overflow: "hidden",
  },

  container: {
    maxWidth: 980,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
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
    bottom: -20,
    width: 420,
    height: 420,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(59,130,246,0.14), transparent 70%)",
    filter: "blur(24px)",
    pointerEvents: "none",
  },

  topBar: {
    marginBottom: 18,
  },

  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
    color: "#4ade80",
    fontWeight: 600,
    fontSize: 14,
  },

  card: {
    border: "1px solid rgba(255,255,255,0.06)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
  },

  header: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: 24,
    alignItems: "center",
    marginBottom: 28,
  },

  logo: {
    width: "100%",
    height: 120,
    objectFit: "contain",
    display: "block",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.06)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
    padding: 14,
  },

  title: {
    margin: "0 0 10px",
    fontSize: 38,
    lineHeight: 1.05,
    letterSpacing: -1,
    color: "white",
  },

  subtitle: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.72)",
  },

  content: {
    display: "grid",
    gap: 18,
  },
};
