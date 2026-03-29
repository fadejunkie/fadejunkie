"use client";

import DevBanner from "@/components/DevBanner";
import { Hero } from "@/components/hero";
import { StickyNav } from "@/components/StickyNav";
import { Cta13 } from "@/components/cta-13";
import { Footer2 } from "@/components/ui/shadcnblocks-com-footer2";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Manifesto } from "@/components/manifesto";
import { Testimonials } from "@/components/Testimonials";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Scissors,
  Compass,
  Users,
  User,
  Globe,
  GraduationCap,
  FolderOpen,
  Star,
  MapPin,
  ExternalLink,
} from "lucide-react";

/* ─── Design constants ────────────────────────────────────────── */
const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Animated counter ───────────────────────────────────────── */
function AnimatedStatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const valueWithoutPrefix = value.slice(prefix.length);

  const [displayed, setDisplayed] = useState<string>(prefix + "0");

  useEffect(() => {
    if (!isInView) return;
    if (valueWithoutPrefix === "0" || valueWithoutPrefix === "0+") {
      setDisplayed(value);
      return;
    }

    const match = valueWithoutPrefix.match(/([\d,.]+)([k+]*)/i);
    if (!match) { setDisplayed(value); return; }

    const raw = parseFloat(match[1].replace(/,/g, ""));
    const isK = /k/i.test(match[2]);
    const target = raw;

    const duration = 1900;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = eased * target;

      if (isK) {
        setDisplayed(prefix + current.toFixed(current >= 10 ? 0 : 1).replace(/\.0$/, "") + "k+");
      } else if (raw >= 1000) {
        setDisplayed(prefix + Math.round(current).toLocaleString() + "+");
      } else {
        setDisplayed(prefix + Math.round(current) + "+");
      }

      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, value, prefix, valueWithoutPrefix]);

  return <span ref={ref}>{displayed}</span>;
}

/* ─── Social proof stats ─────────────────────────────────────── */
const STATS = [
  { value: "2,400+", label: "Barbers" },
  { value: "18k+", label: "Flashcards studied" },
  { value: "340+", label: "Shop sites" },
  { value: "$0", label: "Monthly fee" },
] as const;

/* ─── Three paths data ───────────────────────────────────────── */
const PATHS = [
  {
    num: "01",
    name: "Student",
    tagline: "License first.",
    desc: "Flashcards, practice tests, and exam prep built for state board licensing. Study smarter between cuts.",
    href: "/signin?mode=signup",
    cta: "Start studying",
    Icon: GraduationCap,
    dark: false,
  },
  {
    num: "02",
    name: "Barber",
    tagline: "Your brand. Here.",
    desc: "Build your profile, launch your shop website, and connect with a community that understands what you do.",
    href: "/signin?mode=signup",
    cta: "Join free",
    Icon: Scissors,
    dark: true,
  },
  {
    num: "03",
    name: "Client",
    tagline: "Find someone who cares.",
    desc: "Browse the directory. Find a barber who takes this seriously. No guesswork, no bad haircuts.",
    href: "/directory",
    cta: "Browse directory",
    Icon: Compass,
    dark: false,
  },
] as const;

/* ─── Page ───────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
      {/* ── Dev banner ─────────────────────────────────────────── */}
      <DevBanner />

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <StickyNav
        logo={{ url: "/", title: "fadejunkie" }}
        menu={[
          { title: "Community", url: "/signin?mode=signup" },
          { title: "Tools", url: "/signin?mode=signup" },
          { title: "Directory", url: "/directory" },
        ]}
        auth={{
          login: { text: "Log in", url: "/signin" },
          signup: { text: "Join free", url: "/signin?mode=signup" },
        }}
      />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <Hero />

      {/* ── Social proof strip ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.02)",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <motion.div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "stretch",
          }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 1rem",
                textAlign: "center",
                borderLeft:
                  i > 0 ? "1px solid rgba(0,0,0,0.06)" : undefined,
              }}
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
            >
              <span
                style={{
                  fontFamily:
                    "var(--font-display), 'League Spartan', sans-serif",
                  fontSize: "clamp(1.25rem, 2.5vw, 2.25rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "var(--foreground)",
                  display: "block",
                }}
              >
                <AnimatedStatValue value={stat.value} />
              </span>
              <span
                style={{
                  fontFamily:
                    "var(--font-geist-mono), ui-monospace, monospace",
                  fontSize: "0.5625rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.4)",
                  marginTop: "0.3rem",
                  display: "block",
                }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Three Paths ────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--background)",
          padding: "var(--section-gap-lg) var(--container-px)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Section head */}
          <div style={{ marginBottom: "4rem" }}>
            <motion.p
              style={{
                fontFamily:
                  "var(--font-geist-mono), ui-monospace, monospace",
                fontSize: "0.625rem",
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.4)",
                marginBottom: "1rem",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease }}
            >
              Find your lane
            </motion.p>
            <motion.h2
              style={{
                fontFamily:
                  "var(--font-display), 'League Spartan', sans-serif",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                color: "var(--foreground)",
                textTransform: "lowercase",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease, delay: 0.06 }}
            >
              Three paths.
              <br />
              <span
                style={{
                  fontFamily:
                    "var(--font-body), 'Courier Prime', monospace",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "0.72em",
                  letterSpacing: "0.01em",
                  color: "rgba(0,0,0,0.45)",
                }}
              >
                One community.
              </span>
            </motion.h2>
          </div>

          {/* Path cards */}
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: "1rem",
            }}
            className="paths-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {PATHS.map((path) => (
              <motion.div
                key={path.name}
                variants={fadeUp}
                transition={{ duration: 0.5, ease }}
              >
                <Link
                  href={path.href}
                  className={`path-card${path.dark ? " dark-card" : ""}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    borderRadius: "var(--radius-2xl)",
                    padding: "2.25rem",
                    minHeight: 340,
                    backgroundColor: path.dark
                      ? "var(--foreground)"
                      : "var(--card)",
                    border: path.dark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid var(--border)",
                    boxShadow: path.dark
                      ? "0 24px 72px rgba(0,0,0,0.32), 0 8px 24px rgba(0,0,0,0.18)"
                      : "0 2px 16px rgba(0,0,0,0.05)",
                    textDecoration: "none",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  }}
                >
                  {/* Number */}
                  <span
                    style={{
                      fontFamily:
                        "var(--font-geist-mono), ui-monospace, monospace",
                      fontSize: "0.5625rem",
                      fontWeight: 500,
                      letterSpacing: "0.18em",
                      color: path.dark
                        ? "rgba(255,255,255,0.18)"
                        : "rgba(0,0,0,0.18)",
                    }}
                  >
                    {path.num}
                  </span>

                  {/* Center content */}
                  <div style={{ margin: "1.5rem 0" }}>
                    <path.Icon
                      style={{
                        width: 26,
                        height: 26,
                        color: path.dark
                          ? "rgba(255,255,255,0.28)"
                          : "rgba(0,0,0,0.3)",
                        strokeWidth: 1.5,
                        marginBottom: "1.25rem",
                      }}
                    />
                    <h3
                      style={{
                        fontFamily:
                          "var(--font-display), 'League Spartan', sans-serif",
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        color: path.dark ? "var(--background)" : "var(--foreground)",
                        marginBottom: "0.3rem",
                        textTransform: "lowercase",
                      }}
                    >
                      {path.name}
                    </h3>
                    <p
                      style={{
                        fontFamily:
                          "var(--font-geist-mono), ui-monospace, monospace",
                        fontSize: "0.5625rem",
                        fontWeight: 500,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: path.dark
                          ? "rgba(255,255,255,0.4)"
                          : "rgba(0,0,0,0.4)",
                        marginBottom: "0.875rem",
                      }}
                    >
                      {path.tagline}
                    </p>
                    <p
                      style={{
                        fontFamily:
                          "var(--font-body), 'Courier Prime', monospace",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        color: path.dark
                          ? "rgba(255,255,255,0.45)"
                          : "rgba(0,0,0,0.55)",
                        maxWidth: "22rem",
                      }}
                    >
                      {path.desc}
                    </p>
                  </div>

                  {/* CTA link */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontFamily:
                        "var(--font-sans), system-ui, sans-serif",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: path.dark
                        ? "rgba(255,255,255,0.7)"
                        : "var(--foreground)",
                    }}
                  >
                    {path.cta}
                    <ArrowRight style={{ width: 13, height: 13 }} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features — pure black section ───────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--foreground)",
          padding: "var(--section-gap-lg) var(--container-px)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Section head */}
          <div style={{ marginBottom: "4rem" }}>
            <motion.p
              style={{
                fontFamily:
                  "var(--font-geist-mono), ui-monospace, monospace",
                fontSize: "0.625rem",
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "1rem",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease }}
            >
              What&apos;s inside
            </motion.p>
            <motion.h2
              style={{
                fontFamily:
                  "var(--font-display), 'League Spartan', sans-serif",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                color: "var(--background)",
                textTransform: "lowercase",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease, delay: 0.06 }}
            >
              Built for
              <br />
              <span
                style={{
                  fontFamily:
                    "var(--font-body), 'Courier Prime', monospace",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "0.72em",
                  letterSpacing: "0.01em",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                the grind.
              </span>
            </motion.h2>
          </div>

          <BentoGrid className="grid-cols-1 sm:grid-cols-3 auto-rows-[16rem] gap-4">
            {/* Community Feed — hero card */}
            <BentoCard
              name="Community Feed"
              className="sm:col-span-2"
              variant="dark"
              Icon={Users}
              description="Post your work. Get real feedback from barbers who understand the craft. No fluff, no algorithm — just the community."
              href="/signin?mode=signup"
              cta="Join the conversation"
              background={
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                  {/* Mock feed posts */}
                  <div className="absolute inset-x-0 bottom-0 top-20 overflow-hidden px-5 pb-2">
                    {[
                      {
                        user: "E. Riviera",
                        preview:
                          "That bald fade detail on the temple tho 🔥",
                        time: "2m",
                      },
                      {
                        user: "K. Harris",
                        preview:
                          "Just passed boards. First client tomorrow.",
                        time: "14m",
                      },
                      {
                        user: "D. Fontaine",
                        preview:
                          "Anyone running Wahl or Andis for tapers?",
                        time: "31m",
                      },
                    ].map((post, i) => (
                      <div
                        key={i}
                        className="mb-2.5 rounded-xl p-3"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.09)",
                        }}
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <div
                            className="h-5 w-5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.11)",
                            }}
                          />
                          <span
                            style={{
                              fontFamily:
                                "var(--font-geist-mono), ui-monospace, monospace",
                              fontSize: 9,
                              color: "rgba(255,255,255,0.55)",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {post.user}
                          </span>
                          <span
                            style={{
                              fontFamily:
                                "var(--font-geist-mono), ui-monospace, monospace",
                              fontSize: 9,
                              color: "rgba(255,255,255,0.3)",
                              marginLeft: "auto",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {post.time}
                          </span>
                        </div>
                        <p
                          style={{
                            fontFamily:
                              "var(--font-body), 'Courier Prime', monospace",
                            fontSize: 11,
                            lineHeight: 1.5,
                            color: "rgba(255,255,255,0.45)",
                          }}
                        >
                          {post.preview}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              }
            />

            {/* Barber Profiles */}
            <BentoCard
              name="Barber Profiles"
              className="sm:col-span-1"
              variant="dark"
              Icon={User}
              description="Your portfolio, your way. Showcase cuts, list services, share your story."
              href="/signin?mode=signup"
              cta="Build yours"
              background={
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent">
                  {/* Mock profile card */}
                  <div
                    className="absolute inset-x-4 top-4 rounded-xl p-3.5"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div
                        className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.13)" }}
                      >
                        <span style={{ fontFamily: "var(--font-display), sans-serif", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "-0.01em" }}>AM</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.02em" }}>Andre Mitchell</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin style={{ width: 8, height: 8, color: "rgba(255,255,255,0.35)" }} />
                          <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Atlanta, GA</span>
                        </div>
                      </div>
                      <div className="ml-auto flex items-center gap-0.5">
                        <Star style={{ width: 8, height: 8, color: "rgba(255,255,255,0.55)", fill: "rgba(255,255,255,0.55)" }} />
                        <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 8, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em" }}>4.9</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {["Skin Fades", "Tapers", "Beard Work"].map(tag => (
                        <span key={tag} style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontSize: 7,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.45)",
                          backgroundColor: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          borderRadius: "2rem",
                          padding: "0.2rem 0.45rem",
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              }
            />

            {/* Shop Websites */}
            <BentoCard
              name="Shop Websites"
              className="sm:col-span-1"
              variant="dark"
              Icon={Globe}
              description="A clean, fast site for your shop. No drag-and-drop builders. No monthly fees."
              href="/signin?mode=signup"
              cta="Launch a site"
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent">
                  {/* Mock website browser chrome */}
                  <div
                    className="absolute inset-x-4 top-4 rounded-xl overflow-hidden"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    {/* Browser top bar */}
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-2"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      {[1,2,3].map(i => (
                        <div key={i} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.18)" }} />
                      ))}
                      <div
                        className="flex-1 h-3 rounded-sm mx-2 flex items-center justify-center"
                        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                      >
                        <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 6, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>cuts.by/morales</span>
                      </div>
                      <ExternalLink style={{ width: 7, height: 7, color: "rgba(255,255,255,0.28)" }} />
                    </div>
                    {/* Mock site content */}
                    <div className="p-3">
                      <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: 13, fontWeight: 800, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.80)", marginBottom: "0.5rem" }}>Morales Cuts</p>
                      <p style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 7, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>Brooklyn, NY · Walk-ins welcome</p>
                      <div
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
                        style={{ backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.14)" }}
                      >
                        <span style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: 8, color: "rgba(255,255,255,0.65)", letterSpacing: "-0.01em" }}>Book a cut</span>
                        <ArrowRight style={{ width: 7, height: 7, color: "rgba(255,255,255,0.45)" }} />
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Study Tools */}
            <BentoCard
              name="Study Tools"
              className="sm:col-span-1"
              variant="dark"
              Icon={BookOpen}
              description="Flashcards and exam prep built specifically for state board licensing."
              href="/signin?mode=signup"
              cta="Start studying"
              background={
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                  {/* Mock flashcard */}
                  <div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-xl px-4 py-3"
                    style={{
                      width: "82%",
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily:
                          "var(--font-geist-mono), ui-monospace, monospace",
                        fontSize: 8,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.4)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Q · 47 of 200
                    </p>
                    <p
                      style={{
                        fontFamily:
                          "var(--font-body), 'Courier Prime', monospace",
                        fontSize: 10,
                        lineHeight: 1.5,
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      What angle produces a bevel cut when held flat against
                      the scalp?
                    </p>
                    <div
                      style={{
                        marginTop: "0.625rem",
                        height: 2,
                        width: "100%",
                        borderRadius: 9999,
                        backgroundColor: "rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        style={{
                          height: 2,
                          borderRadius: 9999,
                          width: "23%",
                          backgroundColor: "var(--background)",
                          opacity: 0.4,
                        }}
                      />
                    </div>
                  </div>
                </div>
              }
            />

            {/* Resource Directory */}
            <BentoCard
              name="Resource Directory"
              className="sm:col-span-1"
              variant="dark"
              Icon={FolderOpen}
              description="Curated tools, products, and vendors — vetted by the community, not sponsored."
              href="/directory"
              cta="Explore"
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent">
                  {/* Mock directory rows */}
                  <div className="absolute inset-x-4 top-4 space-y-1.5">
                    {[
                      { cat: "Clippers", name: "Wahl Senior Cordless" },
                      { cat: "Styling", name: "Murray's Pomade" },
                      { cat: "Education", name: "Pivot Point Cosmetology" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, ease, delay: 0.1 * i }}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-geist-mono), monospace",
                            fontSize: 7,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.45)",
                            flexShrink: 0,
                            width: 48,
                          }}
                        >
                          {item.cat}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-body), 'Courier Prime', monospace",
                            fontSize: 10,
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          {item.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              }
            />
          </BentoGrid>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <Testimonials />

      {/* ── Manifesto ──────────────────────────────────────────── */}
      <Manifesto />

      {/* ── CTA ────────────────────────────────────────────────── */}
      <Cta13
        heading="Your chair is waiting."
        description="Free to join. Built for barbers who take this seriously."
        buttons={{
          primary: {
            text: "Create your account",
            url: "/signin?mode=signup",
          },
          secondary: {
            text: "Browse the directory",
            url: "/directory",
          },
        }}
      />

      {/* ── Footer ─────────────────────────────────────────────── */}
      <Footer2
        logo={{ url: "/", src: "", alt: "FadeJunkie", title: "fadejunkie" }}
        tagline="The barber community."
        menuItems={[
          {
            title: "Product",
            links: [
              { text: "Community", url: "/signin?mode=signup" },
              { text: "Tools", url: "/signin?mode=signup" },
              { text: "Directory", url: "/directory" },
              { text: "Profiles", url: "/signin?mode=signup" },
            ],
          },
          {
            title: "Resources",
            links: [
              { text: "Exam Prep", url: "/signin?mode=signup" },
              { text: "Flashcards", url: "/signin?mode=signup" },
              { text: "Shop Websites", url: "/signin?mode=signup" },
            ],
          },
          {
            title: "Company",
            links: [
              { text: "About", url: "/signin?mode=signup" },
              { text: "Contact", url: "mailto:hello@fadejunkie.com" },
            ],
          },
          {
            title: "Social",
            links: [
              { text: "Instagram", url: "https://instagram.com/fadejunkie" },
              { text: "Twitter", url: "https://twitter.com/fadejunkie" },
            ],
          },
        ]}
        copyright="© 2026 FadeJunkie. All rights reserved."
        bottomLinks={[
          { text: "Privacy Policy", url: "/privacy" },
          { text: "Terms of Service", url: "/terms" },
        ]}
      />

    </div>
  );
}
