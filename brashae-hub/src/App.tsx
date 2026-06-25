// @ts-nocheck
import BrashaeHub from "./BrashaeHub";
import BrashaeEcommPreview from "./BrashaeEcommPreview";

function MarketingSitePreview() {
  return (
    <iframe
      src="https://brashae-site.vercel.app"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
      title="Brashae's Website Preview"
    />
  );
}

function EcommPreview() {
  return (
    <iframe
      src="https://brashae-shop.vercel.app/shop"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
      title="Brashae's Ecomm Store Preview"
    />
  );
}

export default function App() {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  if (path === "/preview/ecomm") return <EcommPreview />;
  if (path === "/preview") return <MarketingSitePreview />;
  return <BrashaeHub />;
}
