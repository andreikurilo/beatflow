import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function TextInput(props: TextInputProps) {
  return <input {...props} style={{ ...styles.input, ...props.style }} />;
}

const styles: Record<string, React.CSSProperties> = {
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
};
