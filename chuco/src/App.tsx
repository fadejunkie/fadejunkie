// @ts-nocheck
import ChucoHub from "./ChucoHub";
import SitePreviewStandalone from "./SitePreviewStandalone";

export default function App() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  if (path === "/site-preview") return <SitePreviewStandalone />;
  return <ChucoHub />;
}
