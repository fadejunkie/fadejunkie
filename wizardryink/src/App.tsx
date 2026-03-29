import WizardryHub from "./WizardryHub";

const OPS_HOSTNAME = "wizadry-ops.anthonytatis.com";

export default function App() {
  const hostname = window.location.hostname;
  const isOps = hostname === OPS_HOSTNAME || hostname === "localhost";

  return <WizardryHub defaultView={isOps ? "internal" : "client"} opsMode={isOps} />;
}
