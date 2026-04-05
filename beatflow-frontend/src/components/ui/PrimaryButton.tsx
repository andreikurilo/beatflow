import type { ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryButton(props: PrimaryButtonProps) {
  return (
    <button {...props} style={{ ...styles.button, ...props.style }}>
      {props.children}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    marginTop: 8,
    padding: "12px",
    borderRadius: 10,
    border: "none",
    background: "#22c55e",
    color: "black",
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
  },
};
