import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// ⚠️ TypeScript에서는 getElementById가 HTMLElement | null 반환 → 단언 필요
const rootElement = document.getElementById("root") as HTMLElement;

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
