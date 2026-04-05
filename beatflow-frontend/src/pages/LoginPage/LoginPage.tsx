import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Sparkles } from "lucide-react";
import { useAuthStore } from "../../app/store";
import { login } from "../../api/auth";
import TextInput from "../../components/ui/TextInput";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("demo@beatflow.org");
  const [password, setPassword] = useState("6e252R5F7ZW3");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({ email, password });
      setAuth({ accessToken: response.accessToken, email });
      navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlowTop} />
      <div style={styles.backgroundGlowBottom} />

      <div style={styles.container}>
        <div style={styles.authShell}>
          <div style={styles.brandPanel}>
            <div style={styles.logoCard}>
              <img
                src="/beatflow_logo.svg"
                alt="Beatflow"
                style={styles.logo}
              />
            </div>

            <div style={styles.brandContent}>
              <div style={styles.badgeRow}>
                <span style={styles.badge}>
                  <Sparkles size={14} />
                  Demo
                </span>
                <span style={styles.badgeSecondary}>
                  <LockKeyhole size={14} />
                  Secure login
                </span>
              </div>

              <h1 style={styles.title}>Welcome back to Beatflow</h1>
              <p style={styles.subtitle}>
                Sign in to explore the catalog, stream demo tracks, and continue
                building your music platform experience.
              </p>
            </div>
          </div>

          <div style={styles.formPanel}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Login</h2>
              <p style={styles.formSubtitle}>Access your account</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <TextInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </PrimaryButton>
            </form>

            {error && <p style={styles.error}>{error}</p>}

            <p style={styles.footer}>
              No account yet?{" "}
              <Link to="/register" style={styles.link}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    position: "relative",
    overflow: "hidden",
  },

  container: {
    width: "100%",
    maxWidth: 1180,
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

  authShell: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
    alignItems: "stretch",
  },

  brandPanel: {
    border: "1px solid rgba(255,255,255,0.06)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
    borderRadius: 28,
    padding: "clamp(20px, 4vw, 28px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
  },

  logoCard: {
    border: "1px solid rgba(255,255,255,0.06)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
    borderRadius: 24,
    padding: 16,
    boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
    marginBottom: 24,
  },

  logo: {
    width: "100%",
    height: "clamp(120px, 28vw, 180px)",
    objectFit: "contain",
    display: "block",
  },

  brandContent: {
    minWidth: 0,
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
    margin: "0 0 12px",
    fontSize: "clamp(30px, 6vw, 42px)",
    lineHeight: 1.05,
    letterSpacing: -1.2,
    color: "white",
  },

  subtitle: {
    margin: 0,
    maxWidth: 560,
    fontSize: 16,
    lineHeight: 1.65,
    color: "rgba(255,255,255,0.72)",
  },

  formPanel: {
    border: "1px solid rgba(255,255,255,0.06)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
    borderRadius: 28,
    padding: "clamp(20px, 4vw, 28px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
  },

  formHeader: {
    marginBottom: 18,
  },

  formTitle: {
    margin: "0 0 8px",
    fontSize: 28,
    color: "white",
  },

  formSubtitle: {
    margin: 0,
    fontSize: 14,
    color: "rgba(255,255,255,0.64)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  error: {
    color: "#f87171",
    marginTop: 12,
    fontSize: 14,
  },

  footer: {
    marginTop: 18,
    fontSize: 14,
    color: "rgba(255,255,255,0.72)",
  },

  link: {
    color: "#4ade80",
    textDecoration: "none",
    fontWeight: 600,
  },
};
