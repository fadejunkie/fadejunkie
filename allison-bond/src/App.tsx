import AllisonHub, { DiscoveryPage } from "./AllisonHub";

const OPS_HOSTNAME = "allisonbond-ops.anthonytatis.com";

export default function App() {
  const hostname = window.location.hostname;
  const isOps = hostname === OPS_HOSTNAME || hostname === "localhost";
  const path = window.location.pathname;

  if (path === "/discovery" || path === "/discovery/") {
    return <DiscoveryPage />;
  }

  return <AllisonHub defaultView={isOps ? "internal" : "client"} opsMode={isOps} />;
}
