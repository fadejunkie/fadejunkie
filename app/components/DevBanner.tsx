// Temporary development banner — remove when site launches
export default function DevBanner() {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 9999,
        backgroundColor: "#800000",
        color: "#fff4ea",
        textAlign: "center",
        padding: "0.5rem 1rem",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: "0.85rem",
        letterSpacing: "0.01em",
        lineHeight: 1.4,
      }}
    >
      We're building this in public — poke around and watch us grow in real time.
    </div>
  );
}
