// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
// If no valid URL configured, use a dummy HTTPS URL — ConvexProvider will exist
// so hooks work, but queries will stay in "loading" state (returns undefined/null)
const resolvedUrl =
  convexUrl && convexUrl.startsWith("http")
    ? convexUrl
    : "https://chuco-hub.convex.cloud"; // placeholder — replaced when Convex cloud is set up

const convex = new ConvexReactClient(resolvedUrl);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
