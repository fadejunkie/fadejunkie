import SydneyHub, { DiscoveryPage, WebsitePage } from "./SydneyHub";

const OPS_HOSTNAME = "sydneyspillman-ops.anthonytatis.com";
const SITE_HOSTNAME = "sydney.anthonytatis.com";

export default function App() {
  const hostname = window.location.hostname;
  const isOps = hostname === OPS_HOSTNAME || hostname === "localhost";
  const isSite = hostname === SITE_HOSTNAME;
  const path = window.location.pathname;

  if (path === "/discovery" || path === "/discovery/") {
    return <DiscoveryPage />;
  }

  if (isSite) {
    return <WebsitePage />;
  }

  return <SydneyHub defaultView={isOps ? "internal" : "client"} opsMode={isOps} />;
}
