"use client";

import { Hero } from "@/components/hero";
import { Navbar1 } from "@/components/shadcnblocks-com-navbar1";
import { Cta13 } from "@/components/cta-13";
import { Footer2 } from "@/components/ui/shadcnblocks-com-footer2";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Manifesto } from "@/components/manifesto";
import { motion } from "framer-motion";
import Link from "next/link";
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

/* ─── Social proof stats ─────────────────────────────────────── */
const STATS = [
  { value: "2,400+", label: "Barbers" },
  { value: "18k+", label: "Flashcards studied" },
  { value: "340+", label: "Shop sites" },
  { value: "Free", label: "Always" },
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
    <div style={{ backgroundColor: "#fff4ea", minHeight: "100vh" }}>
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{
          backgroundColor: "rgba(255,244,234,0.88)",
          borderColor: "rgba(22,16,8,0.08)",
        }}
      >
        <Navbar1
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
      </div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <Hero />

      {/* ── Social proof strip ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "rgba(22,16,8,0.03)",
          borderTop: "1px solid rgba(22,16,8,0.08)",
          borderBottom: "1px solid rgba(22,16,8,0.08)",
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
                  i > 0 ? "1px solid rgba(22,16,8,0.07)" : undefined,
              }}
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
            >
              <span
                style={{
                  fontFamily:
                    "var(--font-spectral), Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "-0.015em",
                  color: "hsl(0, 0%, 8%)",
                  display: "block",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily:
                    "var(--font-geist-mono), ui-monospace, monospace",
                  fontSize: "0.5625rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "hsl(34, 22%, 44%)",
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
          backgroundColor: "#fff4ea",
          padding: "7rem clamp(1.5rem, 5vw, 6rem)",
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
                color: "hsl(34, 42%, 44%)",
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
                  "var(--font-spectral), Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "hsl(0, 0%, 8%)",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease, delay: 0.06 }}
            >
              Three paths.
              <br />
              <span style={{ fontStyle: "normal", fontWeight: 300 }}>
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
                  className="path-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    borderRadius: "1rem",
                    padding: "2.25rem",
                    minHeight: 300,
                    backgroundColor: path.dark
                      ? "rgba(22,16,8,0.97)"
                      : "rgba(255,255,255,0.7)",
                    border: path.dark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(22,16,8,0.08)",
                    boxShadow: path.dark
                      ? "none"
                      : "0 2px 16px rgba(22,16,8,0.06)",
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
                        ? "rgba(255,244,234,0.2)"
                        : "rgba(22,16,8,0.2)",
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
                          ? "rgba(255,244,234,0.3)"
                          : "hsl(34, 22%, 50%)",
                        strokeWidth: 1.5,
                        marginBottom: "1.25rem",
                      }}
                    />
                    <h3
                      style={{
                        fontFamily:
                          "var(--font-spectral), Georgia, 'Times New Roman', serif",
                        fontSize: "1.375rem",
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        color: path.dark ? "#fff4ea" : "hsl(0, 0%, 8%)",
                        marginBottom: "0.3rem",
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
                          ? "hsl(34, 42%, 44%)"
                          : "hsl(34, 42%, 44%)",
                        marginBottom: "0.875rem",
                      }}
                    >
                      {path.tagline}
                    </p>
                    <p
                      style={{
                        fontFamily:
                          "var(--font-inter), -apple-system, sans-serif",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        color: path.dark
                          ? "rgba(255,244,234,0.45)"
                          : "hsl(34, 18%, 38%)",
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
                        "var(--font-inter), -apple-system, sans-serif",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: path.dark
                        ? "rgba(255,244,234,0.5)"
                        : "hsl(34, 42%, 44%)",
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

      {/* ── Features — warm dark section ───────────────────────── */}
      <section
        style={{
          backgroundColor: "rgba(22,16,8,0.97)",
          padding: "7rem clamp(1.5rem, 5vw, 6rem)",
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
                color: "hsl(34, 42%, 44%)",
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
                  "var(--font-spectral), Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "#fff4ea",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease, delay: 0.06 }}
            >
              Built for
              <br />
              <span style={{ fontStyle: "italic" }}>the grind.</span>
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
                          backgroundColor: "rgba(255,244,234,0.03)",
                          border: "1px solid rgba(255,244,234,0.06)",
                        }}
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <div
                            className="h-5 w-5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: "rgba(255,244,234,0.08)",
                            }}
                          />
                          <span
                            style={{
                              fontFamily:
                                "var(--font-geist-mono), ui-monospace, monospace",
                              fontSize: 9,
                              color: "rgba(255,244,234,0.35)",
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
                              color: "rgba(255,244,234,0.18)",
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
                              "var(--font-inter), -apple-system, sans-serif",
                            fontSize: 11,
                            lineHeight: 1.5,
                            color: "rgba(255,244,234,0.22)",
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
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
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
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
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
                      backgroundColor: "rgba(255,244,234,0.03)",
                      border: "1px solid rgba(255,244,234,0.06)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily:
                          "var(--font-geist-mono), ui-monospace, monospace",
                        fontSize: 8,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,244,234,0.22)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Q · 47 of 200
                    </p>
                    <p
                      style={{
                        fontFamily:
                          "var(--font-inter), -apple-system, sans-serif",
                        fontSize: 10,
                        lineHeight: 1.5,
                        color: "rgba(255,244,234,0.35)",
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
                        backgroundColor: "rgba(255,244,234,0.06)",
                      }}
                    >
                      <div
                        style={{
                          height: 2,
                          borderRadius: 9999,
                          width: "23%",
                          backgroundColor: "hsl(34, 42%, 44%)",
                          opacity: 0.6,
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
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
              }
            />
          </BentoGrid>
        </div>
      </section>

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
              { text: "About", url: "#" },
              { text: "Contact", url: "#" },
            ],
          },
          {
            title: "Social",
            links: [
              { text: "Instagram", url: "#" },
              { text: "Twitter", url: "#" },
            ],
          },
        ]}
        copyright="© 2026 FadeJunkie. All rights reserved."
        bottomLinks={[
          { text: "Privacy Policy", url: "#" },
          { text: "Terms of Service", url: "#" },
        ]}
      />

      <style>{`
        /* ── Path card grid responsive ────────────── */
        .paths-grid {
          grid-template-columns: repeat(1, 1fr);
        }
        @media (min-width: 640px) {
          .paths-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        /* ── Path card hover ──────────────────────── */
        .path-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(22,16,8,0.1) !important;
        }

        /* ── Primary button (dark bg, cream text) ─── */
        .fj-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          background-color: hsl(0, 0%, 8%);
          color: #fff4ea;
          border-radius: 5rem;
          font-family: var(--font-inter), -apple-system, sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.15s ease, transform 0.15s ease;
          border: none;
          cursor: pointer;
          letter-spacing: -0.01em;
        }
        .fj-btn-primary:hover {
          background-color: hsl(0, 0%, 16%);
          transform: scale(1.02);
        }
        .fj-btn-primary:active {
          transform: scale(1.02) translateY(1px);
        }

        /* ── Cream button (on dark bg) ────────────── */
        .fj-btn-cream {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          background-color: #fff4ea;
          color: hsl(0, 0%, 8%);
          border-radius: 5rem;
          font-family: var(--font-inter), -apple-system, sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.15s ease, transform 0.15s ease;
          border: none;
          cursor: pointer;
          letter-spacing: -0.01em;
        }
        .fj-btn-cream:hover {
          background-color: hsl(34, 60%, 95%);
          transform: scale(1.02);
        }
        .fj-btn-cream:active {
          transform: scale(1.02) translateY(1px);
        }

        /* ── Text link (olive) ────────────────────── */
        .fj-btn-text {
          font-family: var(--font-inter), -apple-system, sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: hsl(34, 42%, 44%);
          text-decoration: none;
          transition: color 0.15s ease;
          letter-spacing: -0.01em;
        }
        .fj-btn-text:hover {
          color: hsl(0, 0%, 8%);
        }

        /* ── Text link (on dark bg) ───────────────── */
        .fj-btn-text-on-dark {
          font-family: var(--font-inter), -apple-system, sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255,244,234,0.45);
          text-decoration: none;
          transition: color 0.15s ease;
          letter-spacing: -0.01em;
        }
        .fj-btn-text-on-dark:hover {
          color: #fff4ea;
        }
      `}</style>
    </div>
  );
}
