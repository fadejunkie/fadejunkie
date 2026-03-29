import SydneyHub, { DiscoveryPage } from "./SydneyHub";

const OPS_HOSTNAME = "sydneyspillman-ops.anthonytatis.com";

export default function App() {
  const hostname = window.location.hostname;
  const isOps = hostname === OPS_HOSTNAME || hostname === "localhost";
  const path = window.location.pathname;

  if (path === "/discovery") {
    return <DiscoveryPage />;
  }

  return <SydneyHub defaultView={isOps ? "internal" : "client"} opsMode={isOps} />;
}
