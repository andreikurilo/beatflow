import InfoPageLayout from "../components/ui/InfoPageLayout";

export default function CreditsPage() {
  return (
    <InfoPageLayout
      title="Credits & Music Sources"
      subtitle="Information about the audio assets and attribution used in this demo."
    >
      <Section title="Music sources">
        <p>
          This demo uses royalty-free music tracks for demonstration purposes.
          Some tracks were sourced from platforms such as Pixabay Music and are
          subject to their respective license terms.
        </p>
      </Section>

      <Section title="Attribution">
        <p>
          Track metadata, artist names, and source references are stored in the
          catalog layer of the application. The project does not claim ownership
          of third-party music assets unless explicitly stated.
        </p>
      </Section>

      <Section title="How to interpret this demo">
        <p>
          Beatflow demonstrates playback, catalog, and UI flows. It is not meant
          to redistribute or relicense third-party music content.
        </p>
      </Section>

      <Section title="Suggested source note">
        <p>
          Music used in this demo is included for portfolio and technical demo
          purposes only. Rights remain with the original authors and/or source
          platforms under their published license terms.
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
};
