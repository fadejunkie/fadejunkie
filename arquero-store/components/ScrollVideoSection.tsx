"use client";

import { useEffect, useRef } from "react";

export function ScrollVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const tagline = taglineRef.current;
    if (!container || !video) return;

    // Set correct src before loading — <source> child won't reload if changed after mount
    const isMobile = window.innerWidth < 768;
    video.src = isMobile
      ? "/videos/craft-macro-scrub-vertical.mp4"
      : "/videos/craft-macro-scrub.mp4";
    video.load();

    let scrollTriggerInstance: { kill: () => void } | null = null;
    let lockY = -1; // scroll position where we lock — -1 = not locked yet
    let touchStartY = 0;

    // Wheel handler — blocks scrolling back up past lock point
    const onWheel = (e: WheelEvent) => {
      if (lockY >= 0 && e.deltaY < 0 && window.scrollY <= lockY + 8) {
        e.preventDefault();
      }
    };

    // Touch handlers for mobile
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (lockY >= 0) {
        const dy = e.touches[0].clientY - touchStartY;
        if (dy > 0 && window.scrollY <= lockY + 8) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) resolve();
        else video.addEventListener("loadedmetadata", () => resolve(), { once: true });
      });

      video.currentTime = 0;
      video.pause();

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Scrub video
          if (video.duration) video.currentTime = p * video.duration;

          // Tagline: fade in at 80% → 100%
          if (tagline) {
            const op = Math.max(0, Math.min(1, (p - 0.8) / 0.2));
            tagline.style.opacity = String(op);
          }

          // Dispatch progress so Navbar can fade in
          window.dispatchEvent(new CustomEvent("scroll-video-progress", { detail: p }));
        },
        // When animation completes — lock the scroll position
        onLeave: () => {
          lockY = window.scrollY;
        },
        // If somehow re-entered from below, re-lock
        onEnterBack: () => {
          lockY = -1; // temporarily release so GSAP can scrub back
        },
      });
    };

    init();
    return () => {
      scrollTriggerInstance?.kill();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="scroll-video-container">
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: "translateZ(0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Tagline — fades in at end of scroll */}
        <div
          ref={taglineRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "64px 24px",
            opacity: 0,
            pointerEvents: "none",
            background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 50%, transparent 75%)",
          }}
        >
          <div style={{ display: "flex", gap: "4px", marginBottom: "18px" }}>
            <div style={{ width: "28px", height: "2px", background: "#1c69d3" }} />
            <div style={{ width: "28px", height: "2px", background: "#6f6f6f" }} />
            <div style={{ width: "28px", height: "2px", background: "#DAAC58" }} />
          </div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5.5vw, 64px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "3px",
              color: "#fff",
              textAlign: "center",
              lineHeight: 1.05,
              margin: "0 0 10px",
              textShadow: "0 2px 24px rgba(0,0,0,0.4)",
            }}
          >
            Aim True. Weld True.
          </p>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "13px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "2px",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Crafted for the modern tradesman
          </p>
        </div>
      </div>
    </div>
  );
}
