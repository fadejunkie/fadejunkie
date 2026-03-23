import ArqueroHub from "./ArqueroHub";

const OPS_HOSTNAME = "arqueroco-ops.anthonytatis.com";

export default function App() {
  const hostname = window.location.hostname;
  const isOps = hostname === OPS_HOSTNAME || hostname === "localhost";
  return <ArqueroHub defaultView={isOps ? "internal" : "client"} opsMode={isOps} />;
}
