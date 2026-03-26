"use client";

import { useEffect, useState } from "react";
import { Navbar1 } from "@/components/shadcnblocks-com-navbar1";

interface StickyNavProps {
  logo: { url: string; title: string };
  menu: { title: string; url: string }[];
  auth: {
    login: { text: string; url: string };
    signup: { text: string; url: string };
  };
}

export function StickyNav({ logo, menu, auth }: StickyNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: scrolled
          ? "rgba(255,255,255,0.97)"
          : "rgba(255,255,255,0.90)",
        borderColor: scrolled
          ? "rgba(0,0,0,0.12)"
          : "rgba(0,0,0,0.07)",
        boxShadow: scrolled
          ? "0 1px 20px rgba(0,0,0,0.05)"
          : "none",
        transition:
          "background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      <Navbar1 logo={logo} menu={menu} auth={auth} />
    </div>
  );
}
