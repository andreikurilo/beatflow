import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthBootstrap from "./app/AuthBootstrap";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthBootstrap>
      <App />
    </AuthBootstrap>
  </React.StrictMode>,
);
