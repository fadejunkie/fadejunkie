import WcorwinHub from "./WcorwinHub";

const OPS_HOSTNAME = "wcorwin-ops.anthonytatis.com";

export default function App() {
  const hostname = window.location.hostname;
  const isOps = hostname === OPS_HOSTNAME || hostname === "localhost";

  return <WcorwinHub defaultView={isOps ? "internal" : "client"} opsMode={isOps} />;
}
