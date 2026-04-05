import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldPlus, Sparkles } from "lucide-react";
import { register } from "../../api/auth";
import TextInput from "../../components/ui/TextInput";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({ email, password });
      navigate("/login");
    } catch {
      setError("Registration failed");
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
                  <ShieldPlus size={14} />
                  New account
                </span>
              </div>

              <h1 style={styles.title}>Create your Beatflow account</h1>
              <p style={styles.subtitle}>
                Join the demo experience, browse the catalog, and test the
                streaming flow from authentication to playback.
              </p>
            </div>
          </div>

          <div style={styles.formPanel}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Register</h2>
              <p style={styles.formSubtitle}>Create a new account</p>
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
                {isSubmitting ? "Creating account..." : "Register"}
              </PrimaryButton>
            </form>

            {error && <p style={styles.error}>{error}</p>}

            <p style={styles.footer}>
              Already have an account?{" "}
              <Link to="/login" style={styles.link}>
                Login
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
    padding: "32px 20px",
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
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 28,
    alignItems: "stretch",
  },

  brandPanel: {
    border: "1px solid rgba(255,255,255,0.06)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
    height: 180,
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
    fontSize: 42,
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
    padding: 28,
    boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
