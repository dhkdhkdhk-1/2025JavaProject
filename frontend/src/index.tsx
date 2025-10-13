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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
