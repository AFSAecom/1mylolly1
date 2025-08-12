import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { logger } from "@/lib/logger";

if (import.meta.env.DEV) {
  import("tempo-devtools").then(({ TempoDevtools }) => {
    TempoDevtools.init();
  });
}

// Force cache busting in development
if (import.meta.env.DEV) {
  logger.info("🔄 Development mode - Cache busting enabled");
  // Clear any existing caches
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }
}

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
