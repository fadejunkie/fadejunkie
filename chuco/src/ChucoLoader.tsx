import { useEffect, useRef, useState } from 'react';

interface ChucoLoaderProps {
  onComplete?: () => void;
}

/**
 * CHUCO Spotlight Loader
 *
 * A spotlight starts small and scans across each letter of the CHUCO logo
 * (C → H → U → C → O), then expands to full reveal before fading out.
 */
export default function ChucoLoader({ onComplete }: ChucoLoaderProps) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLImageElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const [hidden, setHidden]   = useState(false);
  const [exiting, setExiting] = useState(false);

  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
  function easeInOut(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
  function easeOut(t: number)   { return 1 - Math.pow(1 - t, 3); }
  function clamp(v: number, lo: number, hi: number) { return Math.min(Math.max(v, lo), hi); }
  function noise(t: number) {
    return Math.sin(t*3.1)*0.4 + Math.sin(t*7.3)*0.3 + Math.sin(t*13.7)*0.15;
  }

  useEffect(() => {
    const overlay = overlayRef.current;
    const logo    = logoRef.current;
    const wrap    = wrapRef.current;
    if (!overlay || !logo || !wrap) return;

    function setSpotlight(cx: number, cy: number, r: number, softness = 0.55) {
      const inner = r * (1 - softness);
      const outer = r;
      overlay!.style.background =
        `radial-gradient(circle at ${cx}px ${cy}px, ` +
        `transparent 0%, ` +
        `transparent ${inner}px, ` +
        `rgba(0,0,0,0.10) ${lerp(inner, outer, 0.3)}px, ` +
        `rgba(0,0,0,0.55) ${lerp(inner, outer, 0.6)}px, ` +
        `rgba(0,0,0,0.88) ${lerp(inner, outer, 0.85)}px, ` +
        `rgba(0,0,0,0.98) ${outer}px)`;
    }

    function startAnimation() {
      const rect   = wrap!.getBoundingClientRect();
      const ovRect = overlay!.getBoundingClientRect();

      const PAD  = 40;
      const OW   = ovRect.width;
      const OH   = ovRect.height;
      const ovCX = OW / 2;
      const ovCY = OH / 2;
      const logoH = rect.height;
      const logoW = rect.width;

      // Mascot sweep: erratic search across body (wings→torso→claws→chest), settle on face
      const letterPcts = [0.15, 0.72, 0.22, 0.65, 0.50];
      const scanY      = ovCY + logoH * 0.05;          // slightly below center (body level)
      const faceX      = PAD + 0.50 * logoW;           // face is horizontally centered
      const faceY      = 40  + 0.28 * logoH;           // face is ~28% from top of image
      const SCAN_R     = Math.min(logoH * 0.52, 80);
      const FULL_R     = Math.max(OW, OH) * 1.6;

      const SCAN_START = 220;
      const SCAN_DUR   = 4400;   // slower sweep (was 3150)
      const EXPAND_DUR = 1900;   // slower expand (was 1425)
      const HOLD_DUR   = 600;

      let startTime: number | null = null;
      let rafId: number;

      function tick(ts: number) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;

        if (elapsed < SCAN_START) {
          const flickerX = PAD + letterPcts[0] * logoW;
          const flickerR = SCAN_R * 0.12 * (0.5 + 0.5 * Math.sin(elapsed * 0.08));
          setSpotlight(flickerX, scanY, flickerR, 0.7);
          rafId = requestAnimationFrame(tick);
          return;
        }

        const scanElapsed = elapsed - SCAN_START;

        if (scanElapsed < SCAN_DUR) {
          const t         = scanElapsed / SCAN_DUR;
          const numLetters = letterPcts.length;
          const tScaled   = t * (numLetters - 1);
          const fromIdx   = Math.floor(clamp(tScaled, 0, numLetters - 2));
          const toIdx     = fromIdx + 1;
          const local     = easeInOut(clamp(tScaled - fromIdx, 0, 1));
          const fromX     = PAD + letterPcts[fromIdx] * logoW;
          const toX       = PAD + letterPcts[toIdx]   * logoW;
          const cx        = lerp(fromX, toX, local);
          // wobble fades to 0 as spotlight approaches face (last stop)
          const wobbleFade = Math.pow(1 - clamp(tScaled / (numLetters - 1), 0, 1), 1.8);
          const wobbleY    = noise(scanElapsed * 0.003) * logoH * 0.22 * wobbleFade;
          const wobbleX    = noise(scanElapsed * 0.0026 + 8) * logoW * 0.09 * wobbleFade;
          const cy         = scanY + wobbleY;
          const breathe    = 1 + 0.04 * Math.sin(scanElapsed * 0.005);
          setSpotlight(cx + wobbleX, cy, SCAN_R * breathe, 0.68);
          rafId = requestAnimationFrame(tick);
          return;
        }

        const expandElapsed = scanElapsed - SCAN_DUR;

        if (expandElapsed < EXPAND_DUR) {
          const t     = easeOut(expandElapsed / EXPAND_DUR);
          const lastX = PAD + letterPcts[letterPcts.length - 1] * logoW;
          const cx    = lerp(lastX, faceX, easeInOut(t));  // pull to face center
          const cy    = lerp(scanY,  faceY, easeInOut(t)); // pull up to face y
          const r     = lerp(SCAN_R, FULL_R, easeOut(t));
          setSpotlight(cx, cy, r, lerp(0.65, 0.30, t));    // softer start, snappier open
          rafId = requestAnimationFrame(tick);
          return;
        }

        // Full reveal
        overlay!.style.background = 'transparent';
        overlay!.style.display = 'none';

        setTimeout(() => {
          setExiting(true);
          setTimeout(() => {
            setHidden(true);
            onComplete?.();
          }, 560);
        }, HOLD_DUR);
      }

      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }

    if (logo.complete) {
      return startAnimation();
    } else {
      logo.addEventListener('load', startAnimation, { once: true });
    }
  }, []);

  if (hidden) return null;

  return (
    <>
      <style>{`
        @keyframes cl-fade-out {
          from { opacity: 1; }
          to   { opacity: 0; pointer-events: none; }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
        animation: exiting ? 'cl-fade-out 0.55s ease-in forwards' : 'none',
      }}>
        {/* Logo */}
        <div ref={wrapRef} style={{
          position: 'relative',
          width: 'min(560px, 82vw)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img
            ref={logoRef}
            src="/chuco-chrome-mascot.svg"
            alt="CHUCO"
            style={{ width: '100%', height: 'auto', display: 'block', position: 'relative', zIndex: 1 }}
          />
          {/* Spotlight overlay */}
          <div ref={overlayRef} style={{
            position: 'absolute',
            top: -40, left: -40, right: -40, bottom: -40,
            zIndex: 2,
            pointerEvents: 'none',
            background: '#000',
          }} />
        </div>

        {/* Cinematic vignette */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.92) 100%)',
        }} />
      </div>
    </>
  );
}
