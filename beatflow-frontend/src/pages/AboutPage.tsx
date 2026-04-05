import InfoPageLayout from "../components/ui/InfoPageLayout";

export default function AboutPage() {
  return (
    <InfoPageLayout
      title="About Beatflow"
      subtitle="A demo music streaming application built to showcase product design, backend architecture, and playback flow."
    >
      <Section title="What this is">
        <p>
          Beatflow is a demonstration project that simulates a modern music
          platform. It includes authentication, catalog browsing, controlled
          playback, and a custom frontend experience.
        </p>
      </Section>

      <Section title="What it demonstrates">
        <ul style={styles.list}>
          <li>Authentication with JWT-based API protection</li>
          <li>Catalog and playback services separation</li>
          <li>Streaming flow through a dedicated playback backend</li>
          <li>Custom frontend UI built as a product demo</li>
        </ul>
      </Section>

      <Section title="Purpose">
        <p>
          This project is intended for portfolio, learning, and product demo
          purposes. It is not presented as a commercial music platform.
        </p>
      </Section>
    </InfoPageLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.sectionBody}>{children}</div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 22,
    padding: 22,
    background: "rgba(255,255,255,0.02)",
  },

  sectionTitle: {
    margin: "0 0 12px",
    fontSize: 22,
    color: "white",
  },

  sectionBody: {
    fontSize: 15,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.78)",
  },

  list: {
    margin: 0,
    paddingLeft: 20,
    display: "grid",
    gap: 8,
  },
};
