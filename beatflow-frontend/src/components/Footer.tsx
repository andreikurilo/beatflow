import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.left}>
          <span style={styles.brand}>Beatflow</span>
          <span style={styles.separator}>•</span>
          <span style={styles.copy}>Demo project</span>
        </div>

        <div style={styles.links}>
          <Link to="/about" style={styles.link}>
            About
          </Link>
          <Link to="/credits" style={styles.link}>
            Credits
          </Link>
          <Link to="/disclaimer" style={styles.link}>
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    marginTop: 60,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    padding: "20px 0",
    background: "rgba(255,255,255,0.01)",
  },

  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    gap: 16,
    flexWrap: "wrap",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },

  brand: {
    fontWeight: 600,
    color: "rgba(255,255,255,0.85)",
  },

  separator: {
    opacity: 0.4,
  },

  copy: {
    opacity: 0.7,
  },

  links: {
    display: "flex",
    gap: 16,
  },

  link: {
    fontSize: 13,
    color: "#4ade80",
    textDecoration: "none",
    opacity: 0.9,
  },
};
