import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new TypeError("Expected a #root element for the executive scorecard example.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
