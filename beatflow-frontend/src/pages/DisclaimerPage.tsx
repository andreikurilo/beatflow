import InfoPageLayout from "../components/ui/InfoPageLayout";

export default function DisclaimerPage() {
  return (
    <InfoPageLayout
      title="Disclaimer"
      subtitle="Important information about the purpose and limitations of this website."
    >
      <Section title="Demo status">
        <p>
          Beatflow is a demo application created for portfolio, engineering, and
          product presentation purposes. It is not a production music streaming
          service.
        </p>
      </Section>

      <Section title="Third-party assets">
        <p>
          Any third-party music, branding, or external asset references remain
          the property of their respective owners and are used only within the
          context of this demonstration.
        </p>
      </Section>

      <Section title="No ownership claim">
        <p>
          This project does not claim ownership over externally sourced audio
          unless explicitly stated. Music is used to demonstrate playback and
          catalog features.
        </p>
      </Section>

      <Section title="Contact / removal">
        <p>
          If you are a rights holder and believe any material should not appear
          in this demo, it should be removed or replaced in the published demo
          environment.
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
