interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  logo = {
    src: "https://www.shadcnblocks.com/images/block/block-1.svg",
    alt: "blocks for shadcn/ui",
    title: "Shadcnblocks.com",
    url: "https://www.shadcnblocks.com",
  },
  tagline = "Components made easy.",
  menuItems = [
    {
      title: "Product",
      links: [
        { text: "Overview", url: "#" },
        { text: "Pricing", url: "#" },
        { text: "Marketplace", url: "#" },
        { text: "Features", url: "#" },
        { text: "Integrations", url: "#" },
        { text: "Pricing", url: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "#" },
        { text: "Team", url: "#" },
        { text: "Blog", url: "#" },
        { text: "Careers", url: "#" },
        { text: "Contact", url: "#" },
        { text: "Privacy", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Help", url: "#" },
        { text: "Sales", url: "#" },
        { text: "Advertise", url: "#" },
      ],
    },
    {
      title: "Social",
      links: [
        { text: "Twitter", url: "#" },
        { text: "Instagram", url: "#" },
        { text: "LinkedIn", url: "#" },
      ],
    },
  ],
  copyright = "© 2024 Copyright. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: Footer2Props) => {
  return (
    <section
      className="py-16"
      style={{
        backgroundColor: "rgba(22,16,8,0.97)",
        borderTop: "1px solid rgba(255,244,234,0.06)",
      }}
    >
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <a href={logo.url} className="flex items-center gap-2">
                  {logo.src && (
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      title={logo.title}
                      className="h-10"
                    />
                  )}
                  <p
                    style={{
                      fontFamily: "var(--font-spectral), Georgia, serif",
                      fontSize: "1rem",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      color: "#fff4ea",
                    }}
                  >
                    {logo.title}
                  </p>
                </a>
              </div>
              <p className="mt-3" style={{ fontSize: "0.75rem", color: "rgba(255,244,234,0.38)", fontFamily: "var(--font-inter), sans-serif" }}>{tagline}</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3
                  className="mb-4 font-bold"
                  style={{
                    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(255,244,234,0.85)",
                  }}
                >
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href={link.url}
                        style={{
                          fontFamily: "var(--font-inter), -apple-system, sans-serif",
                          fontSize: "0.875rem",
                          color: "rgba(255,244,234,0.45)",
                          textDecoration: "none",
                          transition: "color 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,244,234,0.80)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,244,234,0.45)")}
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="mt-16 flex flex-col justify-between gap-4 pt-8 md:flex-row md:items-center"
            style={{ borderTop: "1px solid rgba(255,244,234,0.06)" }}
          >
            <p style={{ fontSize: "0.8125rem", color: "rgba(255,244,234,0.28)" }}>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a
                    href={link.url}
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(255,244,234,0.35)",
                      textDecoration: "underline",
                    }}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer2 };
