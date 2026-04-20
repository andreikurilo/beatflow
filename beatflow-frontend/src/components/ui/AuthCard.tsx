import type { ReactNode } from "react";

type AuthCardProps = Readonly<{
  title: string;
  subtitle: string;
  children: ReactNode;
}>;

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #020617)",
    padding: 24,
    fontFamily: "Inter, sans-serif",
  },
  card: {
    width: 380,
    padding: 32,
    borderRadius: 16,
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    color: "white",
  },
  title: {
    margin: 0,
    marginBottom: 6,
  },
  subtitle: {
    marginTop: 0,
    marginBottom: 20,
    opacity: 0.75,
    fontSize: 14,
  },
};
