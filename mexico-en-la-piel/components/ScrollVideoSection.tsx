"use client";

import { useEffect, useRef } from "react";

export function ScrollVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    // Set correct src before loading
    video.src = "/videos/mexico-hero.mp4";
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

        {/* No text overlay — branding is baked into the video end frame */}
      </div>
    </div>
  );
}
