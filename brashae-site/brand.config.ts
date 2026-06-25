/**
 * brand.config.ts — Brashae's Barber Beauty Supply
 * Single source of truth for all content, copy, and data.
 * All pages pull from here — no hardcoded content in components.
 */

export const brand = {
  // ─── Identity ──────────────────────────────────────────────────────────────
  name: "Brashae's Barber Beauty Supply",
  shortName: "Brashae's",
  tagline: "Houston's Professional Beauty & Barber Supply",
  description:
    "Houston's home for professional barber supplies, beauty products, and salon services. Andis, Wahl, BaByliss PRO, JRL, and more.",
  domain: "brashaesbeautysupplytx.com",
  shopDomain: "shop.brashaesbeautysupplytx.com",
  address: "11902 S Gessner Rd, Houston, TX 77071",
  phone: "713-541-2279",
  email: "raimons_salon1@att.net",

  // ─── Social ─────────────────────────────────────────────────────────────────
  social: {
    instagram: "https://www.instagram.com/TheClipperConnect713/",
    facebook: "https://www.facebook.com/BrashaesBeautySupply",
    twitter: "https://twitter.com/Brashaes",
    booksy: "https://booksy.com",
    fresha: "https://www.fresha.com",
  },

  // ─── External links ─────────────────────────────────────────────────────────
  links: {
    shop: "https://brashae.anthonytatis.com/preview/ecomm",
    bookAppointment: "https://booksy.com",
    bookFresha: "https://www.fresha.com",
  },

  // ─── Colors ─────────────────────────────────────────────────────────────────
  colors: {
    canvas: "#000000",
    surfaceCard: "#111111",
    hairline: "#2a2a2a",
    gold: "#C9A84C",
    goldLight: "#E8C96A",
    goldDim: "#8A6E2E",
    onDark: "#ffffff",
    body: "#bbbbbb",
    muted: "#7e7e7e",
  },

  // ─── Storefront photos ───────────────────────────────────────────────────────
  storefront: {
    main: "/images/storefront/storefront-exterior-dusk-main.jpg",
    wide: "/images/storefront/storefront-exterior-dusk-wide.jpg",
    alt: "Brashae's Barber Beauty Supply — 11902 S Gessner Rd, Houston TX",
  },

  // ─── Logo paths ─────────────────────────────────────────────────────────────
  logo: {
    symbol: "/brand/logo-symbol.png",
    symbolLight: "/brand/logo-symbol-light.png",
    wordmark: "/brand/logo-wordmark.png",
    wordmarkLight: "/brand/logo-wordmark-light.png",
    alt: "Brashae's Barber Beauty Supply",
  },

  // ─── Hours ──────────────────────────────────────────────────────────────────
  hours: [
    { days: "Monday – Tuesday", hours: "10:00 AM – 6:00 PM" },
    { days: "Wednesday – Friday", hours: "8:00 AM – 7:00 PM" },
    { days: "Saturday", hours: "8:00 AM – 6:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ],

  // ─── Business divisions ─────────────────────────────────────────────────────
  divisions: [
    {
      id: "beauty-supply",
      title: "Beauty Supply Retail",
      subtitle: "Hair care for every texture",
      description:
        "From wash day essentials to styling staples — we carry the brands your hair deserves.",
      image: "/images/division-beauty-supply.jpg",
      cta: "Shop Beauty",
      href: "https://brashae.anthonytatis.com/preview/ecomm",
    },
    {
      id: "barber-supply",
      title: "Barber Supply",
      subtitle: "Professional tools, pro results",
      description:
        "Andis, Wahl, BaByliss PRO, JRL, Gamma+. The clippers, guards, and accessories serious barbers run.",
      image: "/images/division-barber-supply.jpg",
      cta: "Shop Barber Tools",
      href: "https://brashae.anthonytatis.com/preview/ecomm",
    },
    {
      id: "salon-services",
      title: "Salon Services",
      subtitle: "Braids, color, wigs, and more",
      description:
        "On-site salon services by professional stylists. Book a consultation or walk in — we're here.",
      image: "/images/division-salon-services.jpg",
      cta: "View Services",
      href: "/services",
    },
    {
      id: "pro-supply",
      title: "Pro Supply (B2B)",
      subtitle: "We deliver to salons",
      description:
        "Salon owners: let us handle restocking. Professional pricing, bulk orders, and direct delivery.",
      image: "/images/division-pro-supply.jpg",
      cta: "Learn More",
      href: "/pro",
    },
  ],

  // ─── Brands carried ─────────────────────────────────────────────────────────
  brands: [
    { name: "Andis", logo: "/images/brands/andis.png" },
    { name: "Wahl", logo: "/images/brands/wahl.png" },
    { name: "BaByliss PRO", logo: "/images/brands/babyliss.png" },
    { name: "JRL", logo: "/images/brands/jrl.png" },
    { name: "Gamma+", logo: "/images/brands/gamma.png" },
    { name: "Oster", logo: "/images/brands/oster.png" },
    { name: "CHI", logo: "/images/brands/chi.png" },
    { name: "Mizani", logo: "/images/brands/mizani.png" },
  ],

  // ─── Shop categories ────────────────────────────────────────────────────────
  shopCategories: [
    { name: "Hair Care", href: "/shop" },
    { name: "Barber Supplies", href: "/shop" },
    { name: "Wigs & Extensions", href: "/shop" },
    { name: "Styling Tools", href: "/shop" },
    { name: "Professional Products", href: "/shop" },
    { name: "New Arrivals", href: "/shop" },
    { name: "Monthly Specials", href: "/specials" },
    { name: "Clearance", href: "/shop" },
  ],

  // ─── Salon services ─────────────────────────────────────────────────────────
  serviceCategories: [
    {
      id: "braids",
      title: "Braids & Protective Styles",
      description: "All braid styles from box braids to knotless and beyond.",
      services: [
        { name: "Box Braids", duration: "3–5 hrs" },
        { name: "Knotless Braids", duration: "3–5 hrs" },
        { name: "Cornrows", duration: "1–2 hrs" },
        { name: "Senegalese Twists", duration: "3–4 hrs" },
        { name: "Locs & Loc Maintenance", duration: "Varies" },
      ],
    },
    {
      id: "wigs",
      title: "Wig Services",
      description:
        "Custom wig fittings, installs, and styling for a flawless, natural look.",
      services: [
        { name: "Wig Fitting & Consultation", duration: "45 min" },
        { name: "Wig Install (Lace Front)", duration: "1–2 hrs" },
        { name: "Wig Styling", duration: "1 hr" },
        { name: "Wig Customization", duration: "Varies" },
      ],
    },
    {
      id: "hair-replacement",
      title: "Hair Replacement",
      description:
        "Non-surgical hair replacement solutions for thinning, alopecia, and more.",
      services: [
        { name: "Hair Replacement Consultation", duration: "1 hr" },
        { name: "Non-Surgical Hair Replacement", duration: "Varies" },
        { name: "Maintenance Sessions", duration: "30–60 min" },
      ],
    },
    {
      id: "color",
      title: "Color Services",
      description: "From single-process color to full creative transformations.",
      services: [
        { name: "Single-Process Color", duration: "1.5–2 hrs" },
        { name: "Highlights / Balayage", duration: "2–3 hrs" },
        { name: "Corrective Coloring", duration: "Varies" },
        { name: "Toner & Gloss", duration: "45 min" },
      ],
    },
    {
      id: "chemical",
      title: "Chemical Services",
      description:
        "Relaxers, perms, and texturizers by licensed stylists who know your hair.",
      services: [
        { name: "Relaxer", duration: "1.5–2 hrs" },
        { name: "Permanent Wave", duration: "2–3 hrs" },
        { name: "Texturizer", duration: "1–1.5 hrs" },
        { name: "Keratin Treatment", duration: "2–3 hrs" },
      ],
    },
    {
      id: "barber",
      title: "Barber Services",
      description: "Fresh cuts, fades, lineups, and beard work on-site.",
      services: [
        { name: "Haircut & Style", duration: "45 min" },
        { name: "Fade", duration: "45 min" },
        { name: "Lineup & Edge-Up", duration: "30 min" },
        { name: "Beard Trim & Shape", duration: "30 min" },
        { name: "Hot Towel Shave", duration: "45 min" },
      ],
    },
  ],

  // ─── Team ───────────────────────────────────────────────────────────────────
  // Brashae's is a salon suite complex — Raimons owns the building/supply store.
  // Suite tenants are independent professionals. Full tenant list → brand.config suites array.
  team: [
    {
      name: "Raimons",
      role: "Owner & Master Stylist",
      bio: "With decades of experience in beauty and barbering, Raimons built Brashae's around one idea: professional results for every client, every time.",
      specialties: ["Color", "Wig Fittings", "Hair Replacement"],
      photo: "/images/team/raimons.jpg",
      bookingLink: "https://booksy.com",
    },
    {
      name: "Clarence H.",
      role: "Barber",
      bio: "Suite #2 — Cuttt Game",
      specialties: ["Cuts", "Fades", "Lineups"],
      photo: "/images/team/clarence-h-cuttt-game-suite2.jpg",
      bookingLink: null,
      phone: "832-417-5759",
    },
    {
      name: "Jamie W.",
      role: "Stylist",
      bio: "Suite #4 — J. Warren Styles",
      specialties: ["Styling"],
      photo: "/images/team/jamie-w-warren-styles-suite4.jpg",
      bookingLink: null,
      phone: "832-494-0530",
    },
    {
      name: "Donielle P.",
      role: "Stylist",
      bio: "Suite #5 & #6 — Donielle Hair",
      specialties: ["Hair"],
      photo: "/images/team/donielle-p-donielle-hair-suite5-6.jpg",
      bookingLink: null,
      phone: "713-705-2817",
    },
    {
      name: "Karen U.",
      role: "Stylist",
      bio: "Suite #11 — Studio 11",
      specialties: ["Styling"],
      photo: "/images/team/karen-u-studio11-suite11.jpg",
      bookingLink: null,
      phone: "713-899-7233",
    },
    {
      name: "Cassandra M.",
      role: "Stylist",
      bio: "Suite #17 & #24",
      specialties: ["Styling"],
      photo: "/images/team/cassandra-m-suite17-24.jpg",
      bookingLink: null,
      phone: "832-667-3077",
    },
    {
      name: "Marquita K.",
      role: "Stylist",
      bio: "Suite #19 — House of Purple Beauty",
      specialties: ["Hair"],
      photo: "/images/team/marquita-k-house-of-purple-beauty-suite19.jpg",
      bookingLink: null,
      phone: "832-746-4367",
    },
    {
      name: "Kreshonda B.",
      role: "Stylist",
      bio: "Suite #28 — Kre\"ation!",
      specialties: ["Styling"],
      photo: "/images/team/kreshonda-b-kreation-suite28.jpg",
      bookingLink: null,
      phone: "832-439-6770",
    },
    {
      name: "Darquis K.",
      role: "Barber",
      bio: "Suite #31 — Flawless Palace",
      specialties: ["Cuts", "Fades"],
      photo: "/images/team/darquis-k-flawless-palace-suite31.png",
      bookingLink: null,
      phone: "832-493-3970",
    },
    {
      name: "Valerie S.",
      role: "Stylist",
      bio: "Suite #40 — A Family Affair",
      specialties: ["Styling"],
      photo: "/images/team/valerie-s-a-family-affair-suite40.jpg",
      bookingLink: null,
      phone: "713-504-0760",
    },
  ],

  // ─── Testimonials ───────────────────────────────────────────────────────────
  testimonials: [
    {
      text: "Best barber supply in Houston. They have everything — Andis, Wahl, JRL — and the staff actually knows their stuff.",
      author: "Marcus T.",
      role: "Professional Barber",
    },
    {
      text: "Came in for a wig fitting and left with the most natural-looking install I've ever had. Raimons is a true professional.",
      author: "Jasmine R.",
      role: "Client",
    },
    {
      text: "We get our salon restocked through Brashae's. Fast delivery, professional pricing, always in stock.",
      author: "Sandra M.",
      role: "Salon Owner",
    },
  ],

  // ─── Monthly specials ───────────────────────────────────────────────────────
  specials: [
    {
      title: "Andis Master Cordless",
      description: "The barber's go-to. Cordless, powerful, precise.",
      originalPrice: 17999,
      salePrice: 14999,
      badge: "Hot Deal",
      image: "/images/specials/andis-master.jpg",
      href: "/shop",
    },
    {
      title: "Wig Fitting Consultation",
      description: "First-time consultation includes styling recommendation.",
      originalPrice: 7500,
      salePrice: 4999,
      badge: "New Client Special",
      image: "/images/specials/wig-consultation.jpg",
      href: "/services",
    },
    {
      title: "BaByliss FX870 Trimmer",
      description: "Rose gold. Surgically sharp. Built for detail work.",
      originalPrice: 12999,
      salePrice: 10999,
      badge: "Limited Time",
      image: "/images/specials/babyliss-fx870.jpg",
      href: "/shop",
    },
  ],

  // ─── Homepage copy ──────────────────────────────────────────────────────────
  copy: {
    heroHeadline: "Where Beauty Meets the Craft",
    heroSubline:
      "Houston's professional source for barber supplies, beauty products, and salon services. Everything you need — in one place.",
    heroPrimaryCta: "Shop Now",
    heroSecondaryCta: "Book Appointment",
    featuredBrandsHeading: "Brands We Carry",
    divisionsHeading: "Four Ways We Serve You",
    specialsHeading: "Monthly Specials",
    servicesHeading: "Salon Services",
    teamHeading: "Meet the Professionals",
    proHeadline: "We Deliver to Salons",
    proSubline:
      "Salon owners: stop running out. We deliver professional supplies directly to your shop — pro pricing, bulk orders, reliable restocking.",
    proCta: "Learn About Pro Supply",
    testimonialsHeading: "What Our Clients Say",
    instagramHeading: "Follow @TheClipperConnect713",
    locationHeading: "Find Us in Houston",

    // About page
    aboutHeadline: "Built for the Beauty Community",
    aboutStory: `Brashae's Barber Beauty Supply has been a cornerstone of Houston's beauty and barber community for years. What started as a local supply store has grown into a full-service destination — beauty supply, barber tools, on-site salon services, and B2B delivery for salon professionals.

Our team, led by Raimons, brings decades of hands-on experience in hair care, barbering, and salon operations. We don't just sell products — we use them. That's why barbers and stylists trust us.

Brashae's is the retail face of Raimon's Salon de Beauté, our professional salon arm with expertise in color, braids, wig fittings, and hair replacement. Together, we serve every client who walks through our doors — from the barber stocking up on clippers to the client looking for a fresh start.`,

    // Pro page
    proFeatures: [
      {
        title: "Convenience",
        description:
          "We deliver directly to your salon. No more runs to the supply store mid-week.",
        icon: "truck",
      },
      {
        title: "Pro Pricing",
        description:
          "Wholesale pricing on professional brands for qualifying salon accounts.",
        icon: "tag",
      },
      {
        title: "Reliable Restocking",
        description:
          "Set up a recurring order and never run out of your essentials again.",
        icon: "refresh",
      },
    ],
    proSteps: [
      { step: 1, title: "Call or Email", description: "Reach out to set up your salon account." },
      { step: 2, title: "Send Your List", description: "We'll source and price your regular supply list." },
      { step: 3, title: "We Deliver", description: "Direct delivery to your salon on your schedule." },
    ],
  },
} as const;

export type Brand = typeof brand;
export type Division = (typeof brand.divisions)[number];
export type ServiceCategory = (typeof brand.serviceCategories)[number];
export type TeamMember = (typeof brand.team)[number];
export type Testimonial = (typeof brand.testimonials)[number];
export type Special = (typeof brand.specials)[number];
