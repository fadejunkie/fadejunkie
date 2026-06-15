import { mutation } from "./_generated/server";

/**
 * seed.ts — Hutto Dealership vehicle inventory
 * Run with: npx convex run seed:run
 * Idempotent — wipes and re-seeds on every run.
 *
 * All Unsplash photo IDs verified in browser:
 *   Trucks:  photo-1551830820-330a71b99659 = Blue Ford F-150
 *            photo-1649793395985-967862a3b73f = Silver RAM 1500 at sunset
 *            photo-1559416523-140ddc3d238c = White Toyota crew cab
 *   SUVs:    photo-1563720223185-11003d516935 = Black Range Rover Sport
 *            photo-1533473359331-0135ef1b58bf = White Ford Explorer
 *            photo-1519641471654-76ce0107ad1b = White Honda SUV
 *            photo-1506015391300-4802dc74de2e = Black Jeep Wrangler
 *   Sedans:  photo-1674719645138-c3fd1aaf8307 = Black sedan on winding road
 *            photo-1546614042-7df3c24c9e5d   = Black BMW sedan
 *            photo-1541899481282-d53bffe3c35d = White modern sedan
 *            photo-1583121274602-3e2820c69888 = Blue Camaro (muscle car)
 *            photo-1494976388531-d1058494cdd8 = Dark Mustang (muscle car)
 */
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // Wipe existing data
    const existing = await ctx.db.query("products").collect();
    const existingCollections = await ctx.db.query("collections").collect();
    for (const p of existing) await ctx.db.delete(p._id);
    for (const c of existingCollections) await ctx.db.delete(c._id);

    // Collections
    const trucksId = await ctx.db.insert("collections", {
      name: "Trucks",
      slug: "trucks",
      description: "Work trucks and pickups",
      sortOrder: 1,
    });
    const suvsId = await ctx.db.insert("collections", {
      name: "SUVs",
      slug: "suvs",
      description: "Sport utility vehicles",
      sortOrder: 2,
    });
    const sedansId = await ctx.db.insert("collections", {
      name: "Sedans",
      slug: "sedans",
      description: "Cars and sedans",
      sortOrder: 3,
    });

    // ─── TRUCKS ────────────────────────────────────────────────────────────
    await ctx.db.insert("products", {
      name: "2021 Ford F-150 XLT",
      slug: "2021-ford-f150-xlt",
      description:
        "One of the best-selling trucks in America for good reason. This F-150 XLT has been well maintained with no accidents on record. Comes loaded with Ford's SYNC 3 infotainment, backup camera, trailer assist, and a tow rating up to 8,200 lbs. The 2.7L EcoBoost V6 delivers real power without sacrificing fuel economy. Clean Carfax. Ready to work.",
      price: 3499500,
      compareAtPrice: 3799900,
      collectionId: trucksId,
      images: [
        "https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&q=80",
        "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80",
      ],
      inStock: true,
      featured: true,
      sortOrder: 1,
      year: 2021,
      make: "Ford",
      model: "F-150",
      trim: "XLT",
      mileage: 28400,
      vin: "1FTFW1E84MFA12345",
      bodyType: "Truck",
      transmission: "Automatic",
      exteriorColor: "Agate Black",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2021 RAM 1500 Sport",
      slug: "2021-ram-1500-sport",
      description:
        "RAM's air suspension and coil-spring rear end make the 1500 the smoothest riding full-size truck on the market. This Sport trim adds blacked-out 20-inch wheels, a sport performance hood, and the 5.7L HEMI V8. Ram Box bed storage, 12-inch Uconnect, and a spray-in bedliner are already included. Single owner from Round Rock, no accidents, well maintained.",
      price: 3150000,
      compareAtPrice: 3450000,
      collectionId: trucksId,
      images: [
        "https://images.unsplash.com/photo-1649793395985-967862a3b73f?w=800&q=80",
        "https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&q=80",
      ],
      inStock: true,
      featured: true,
      sortOrder: 2,
      year: 2021,
      make: "RAM",
      model: "1500",
      trim: "Sport",
      mileage: 32400,
      vin: "1C6SRFFT2MN123456",
      bodyType: "Truck",
      transmission: "Automatic",
      exteriorColor: "Billet Silver Metallic",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2022 Toyota Tacoma TRD Off-Road",
      slug: "2022-toyota-tacoma-trd-off-road",
      description:
        "The Tacoma TRD Off-Road is built for Texas backcountry without giving up daily drivability. Crawl Control, Multi-Terrain Select, a locking rear differential, and Bilstein shocks make this truck capable on any surface. Inside you get a 9-inch touchscreen, JBL audio, and heated front seats. This one is barely broken in — you'll struggle to find a cleaner example at this price.",
      price: 3890000,
      collectionId: trucksId,
      images: [
        "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80",
        "https://images.unsplash.com/photo-1649793395985-967862a3b73f?w=800&q=80",
      ],
      inStock: true,
      featured: true,
      sortOrder: 3,
      year: 2022,
      make: "Toyota",
      model: "Tacoma",
      trim: "TRD Off-Road",
      mileage: 18500,
      vin: "3TMCZ5AN4NM123456",
      bodyType: "Truck",
      transmission: "Automatic",
      exteriorColor: "Army Green",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2019 RAM 1500 Big Horn",
      slug: "2019-ram-1500-big-horn",
      description:
        "RAM's air suspension and coil-spring rear end made the 1500 the smoothest riding full-size truck on the market. This Big Horn has the 5.7L HEMI V8, 8-speed automatic, and RAM's massive 12-inch Uconnect screen. Bed is clean, no rust, and the frame has been inspected. Excellent value for a HEMI truck with this mileage.",
      price: 2899500,
      compareAtPrice: 3199900,
      collectionId: trucksId,
      images: [
        "https://images.unsplash.com/photo-1649793395985-967862a3b73f?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 4,
      year: 2019,
      make: "RAM",
      model: "1500",
      trim: "Big Horn",
      mileage: 58200,
      vin: "1C6SRFFT0KN123456",
      bodyType: "Truck",
      transmission: "Automatic",
      exteriorColor: "Billet Silver",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2020 Ford F-150 Lariat",
      slug: "2020-ford-f150-lariat",
      description:
        "The Lariat is the sweet spot of the F-150 lineup — all the capability, more of the comfort. This one has the 5.0L V8, heated and cooled leather seats, B&O audio, and Ford's Pro Trailer Backup Assist. Blue exterior with chrome accents, tow package, and clean Carfax. Significantly below market on a truck that still drives like new.",
      price: 2699500,
      collectionId: trucksId,
      images: [
        "https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 5,
      year: 2020,
      make: "Ford",
      model: "F-150",
      trim: "Lariat",
      mileage: 39800,
      vin: "1FTFW1E83LFA12345",
      bodyType: "Truck",
      transmission: "Automatic",
      exteriorColor: "Velocity Blue",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2023 Toyota Tundra SR5",
      slug: "2023-toyota-tundra-sr5",
      description:
        "All-new generation Tundra with the twin-turbo V6 that outpulls the old V8. This SR5 comes with a 14-inch touchscreen, wireless Apple CarPlay, Toyota Safety Sense 2.5, and the Multi-Terrain Monitor. Tow rating: 12,000 lbs. If you need a full-size truck that will still be running strong in 200,000 miles, this is it. Nearly new — barely off the lot.",
      price: 4450000,
      compareAtPrice: 4850000,
      collectionId: trucksId,
      images: [
        "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80",
        "https://images.unsplash.com/photo-1649793395985-967862a3b73f?w=800&q=80",
      ],
      inStock: true,
      featured: true,
      sortOrder: 6,
      year: 2023,
      make: "Toyota",
      model: "Tundra",
      trim: "SR5",
      mileage: 11800,
      vin: "5TFJA5DB4PX123456",
      bodyType: "Truck",
      transmission: "Automatic",
      exteriorColor: "Lunar Rock",
      condition: "Used",
    });

    // ─── SUVs ───────────────────────────────────────────────────────────────
    await ctx.db.insert("products", {
      name: "2021 Honda Pilot EX-L",
      slug: "2021-honda-pilot-exl",
      description:
        "Honda's three-row flagship SUV at its best. The Pilot EX-L gets heated leather seating for 8, a 8-inch touchscreen with wireless Apple CarPlay, Honda Sensing suite, and a power moonroof. Renowned Honda reliability with the space to match — 83.9 cubic feet of cargo space with the second and third rows folded. One Texas owner, garage kept, looks and drives like new.",
      price: 3690000,
      compareAtPrice: 4100000,
      collectionId: suvsId,
      images: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
      ],
      inStock: true,
      featured: true,
      sortOrder: 7,
      year: 2021,
      make: "Honda",
      model: "Pilot",
      trim: "EX-L",
      mileage: 24300,
      vin: "5FNYF6H51MB123456",
      bodyType: "SUV",
      transmission: "Automatic",
      exteriorColor: "Platinum White Pearl",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2020 Ford Explorer XLT",
      slug: "2020-ford-explorer-xlt",
      description:
        "Back-to-rear-wheel-drive architecture made the 2020 Explorer a genuine driver's SUV. Three rows, 2.3L EcoBoost, Ford's SYNC 3 with 8-inch screen, standard Co-Pilot360 suite. This XLT has the optional tow package (5,600 lb rating) and has been dealer-serviced throughout. Great condition, no incidents reported. A smart family buy.",
      price: 2999500,
      collectionId: suvsId,
      images: [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 8,
      year: 2020,
      make: "Ford",
      model: "Explorer",
      trim: "XLT",
      mileage: 38700,
      vin: "1FMSK8DH4LGA12345",
      bodyType: "SUV",
      transmission: "Automatic",
      exteriorColor: "Star White",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2021 Land Rover Range Rover Sport HSE",
      slug: "2021-land-rover-range-rover-sport-hse",
      description:
        "The Range Rover Sport HSE is commanding in every sense. Supercharged 3.0L V6, adaptive suspension, Terrain Response 2 with All-Terrain Progress Control, and a panoramic sunroof. Inside: 10-inch Pivi Pro touchscreen, heated/cooled Windsor leather seats, 4-zone climate control, and Meridian audio. Inspected and certified — a luxury SUV at a fair used price.",
      price: 5490000,
      compareAtPrice: 6100000,
      collectionId: suvsId,
      images: [
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
      ],
      inStock: true,
      featured: true,
      sortOrder: 9,
      year: 2021,
      make: "Land Rover",
      model: "Range Rover Sport",
      trim: "HSE",
      mileage: 21400,
      vin: "SALWR2SE4MA123456",
      bodyType: "SUV",
      transmission: "Automatic",
      exteriorColor: "Santorini Black",
      condition: "Certified Pre-Owned",
    });

    await ctx.db.insert("products", {
      name: "2020 Jeep Wrangler Sport",
      slug: "2020-jeep-wrangler-sport",
      description:
        "The two-door Wrangler Sport is the purest expression of the icon. 3.6L Pentastar V6, Command-Trac 4WD with a 2.72:1 low-range ratio, and factory hardtop. Shorter wheelbase makes it more nimble on tight trails than the Unlimited, and it still runs confidently on the highway. Clean title, no rust, and mechanically sound. A capable Jeep ready for its next adventure.",
      price: 3199500,
      collectionId: suvsId,
      images: [
        "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 10,
      year: 2020,
      make: "Jeep",
      model: "Wrangler",
      trim: "Sport",
      mileage: 33100,
      vin: "1C4GJXAG0LW123456",
      bodyType: "SUV",
      transmission: "Automatic",
      exteriorColor: "Black",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2021 Jeep Wrangler Unlimited Sport",
      slug: "2021-jeep-wrangler-unlimited-sport",
      description:
        "The only vehicle you can take the roof off, fold the windshield down, and take through a river crossing on a Tuesday. This 4-door Unlimited Sport has the 3.6L Pentastar V6, manual 6-speed transmission, Jeep's Command-Trac 4WD, and factory hardtop. It drives well on the highway and is genuinely capable on trail. Easy to own, hard to find at this price.",
      price: 3999500,
      compareAtPrice: 4299900,
      collectionId: suvsId,
      images: [
        "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800&q=80",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
      ],
      inStock: false,
      featured: false,
      sortOrder: 11,
      year: 2021,
      make: "Jeep",
      model: "Wrangler",
      trim: "Unlimited Sport",
      mileage: 27600,
      vin: "1C4HJXDG3MW123456",
      bodyType: "SUV",
      transmission: "Manual",
      exteriorColor: "Bright White",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2022 Honda CR-V EX AWD",
      slug: "2022-honda-crv-ex-awd",
      description:
        "The CR-V EX AWD is Honda's most practical compact SUV. Turbocharged 1.5L engine, real-time AWD, a panoramic moonroof, Honda Sensing suite, and wireless Apple CarPlay. Seating for five with best-in-class cargo space and a hands-free power tailgate. This one has low miles and is in pristine condition — exactly what you'd expect from a one-owner Texas vehicle.",
      price: 2990000,
      collectionId: suvsId,
      images: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
        "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 12,
      year: 2022,
      make: "Honda",
      model: "CR-V",
      trim: "EX AWD",
      mileage: 18600,
      vin: "2HKRW2H59NH123456",
      bodyType: "SUV",
      transmission: "CVT",
      exteriorColor: "Platinum White Pearl",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2021 Ford Edge SEL AWD",
      slug: "2021-ford-edge-sel-awd",
      description:
        "The Edge SEL AWD is a strong two-row crossover that earns its keep every day. 2.0L EcoBoost, Ford's SYNC 3 with 8-inch touchscreen, standard Co-Pilot360 suite, heated front seats, and a power liftgate. White exterior, clean interior, and a service history that checks every box. Priced below KBB on a vehicle with a lot of miles left to give.",
      price: 2350000,
      compareAtPrice: 2650000,
      collectionId: suvsId,
      images: [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 13,
      year: 2021,
      make: "Ford",
      model: "Edge",
      trim: "SEL AWD",
      mileage: 44200,
      vin: "2FMPK4J91MBA12345",
      bodyType: "SUV",
      transmission: "Automatic",
      exteriorColor: "Oxford White",
      condition: "Used",
    });

    // ─── SEDANS / CARS ──────────────────────────────────────────────────────
    await ctx.db.insert("products", {
      name: "2020 Toyota Camry SE",
      slug: "2020-toyota-camry-se",
      description:
        "The Camry SE hits the sweet spot between sporty and sensible. Sport-tuned suspension, 2.5L Dynamic Force engine, Toyota Safety Sense 2.0, and an 8-inch touchscreen with wireless Apple CarPlay. The Camry's reputation for reliability is backed up by owner satisfaction scores that remain consistently near the top of its segment. This example is clean inside and out.",
      price: 2250000,
      compareAtPrice: 2550000,
      collectionId: sedansId,
      images: [
        "https://images.unsplash.com/photo-1674719645138-c3fd1aaf8307?w=800&q=80",
        "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 14,
      year: 2020,
      make: "Toyota",
      model: "Camry",
      trim: "SE",
      mileage: 41300,
      vin: "4T1B11HK0LU123456",
      bodyType: "Sedan",
      transmission: "Automatic",
      exteriorColor: "Midnight Black Metallic",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2022 Honda Civic Sport",
      slug: "2022-honda-civic-sport",
      description:
        "The 11th-generation Civic is the best one Honda has ever built — and that's saying something. The Sport trim gets a 1.5L turbocharged engine, a 9-inch Honda Sensing display, and a genuinely fun chassis. This example is in near-showroom condition. New tires, no accidents, one Texas owner. If you want a reliable, fun-to-drive compact at a fair price, this is it.",
      price: 2499500,
      collectionId: sedansId,
      images: [
        "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80",
        "https://images.unsplash.com/photo-1674719645138-c3fd1aaf8307?w=800&q=80",
      ],
      inStock: true,
      featured: true,
      sortOrder: 15,
      year: 2022,
      make: "Honda",
      model: "Civic",
      trim: "Sport",
      mileage: 15100,
      vin: "2HGFE2F57NH123456",
      bodyType: "Sedan",
      transmission: "CVT",
      exteriorColor: "Sonic Gray Pearl",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2021 Honda Accord Sport",
      slug: "2021-honda-accord-sport",
      description:
        "The Accord Sport rides larger than most family sedans and drives better than all of them. 1.5L turbocharged engine, 10-speed automatic, Honda Sensing suite, remote start, and heated front seats. The Sport trim adds a sport-tuned suspension and 19-inch wheels. This one has low miles for its age, clean title, and no issues. Honda's midsize benchmark at a discount.",
      price: 2650000,
      collectionId: sedansId,
      images: [
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 16,
      year: 2021,
      make: "Honda",
      model: "Accord",
      trim: "Sport",
      mileage: 28100,
      vin: "1HGCV1F37MA123456",
      bodyType: "Sedan",
      transmission: "Automatic",
      exteriorColor: "Lunar Silver Metallic",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2019 Nissan Altima SR AWD",
      slug: "2019-nissan-altima-sr",
      description:
        "The SR trim brings sport styling to a practical commuter. Variable compression turbocharged 2.0L engine, ProPilot Assist semi-autonomous driving, 8-inch touchscreen, Bose audio. The Altima's all-wheel drive option (standard on SR) sets it apart from most competitors in this class. High mileage, but Nissans can go the distance when they're maintained — and this one has been.",
      price: 1890000,
      collectionId: sedansId,
      images: [
        "https://images.unsplash.com/photo-1674719645138-c3fd1aaf8307?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 17,
      year: 2019,
      make: "Nissan",
      model: "Altima",
      trim: "SR AWD",
      mileage: 52600,
      vin: "1N4BL4EV0KC123456",
      bodyType: "Sedan",
      transmission: "CVT",
      exteriorColor: "Gun Metallic",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2020 Hyundai Sonata SEL",
      slug: "2020-hyundai-sonata-sel",
      description:
        "The 8th-generation Sonata was a design statement — and this SEL proves the interior matched it. 1.6L turbocharged engine, 10.25-inch curved touchscreen, wireless charging, a full suite of Hyundai SmartSense safety features, and Remote Smart Parking Assist. This example has been garage-kept in Round Rock and shows it. Sharp car at a fair price.",
      price: 2099500,
      compareAtPrice: 2350000,
      collectionId: sedansId,
      images: [
        "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80",
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 18,
      year: 2020,
      make: "Hyundai",
      model: "Sonata",
      trim: "SEL",
      mileage: 35400,
      vin: "5NPEH4J27LH123456",
      bodyType: "Sedan",
      transmission: "Automatic",
      exteriorColor: "Hampton Gray",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2022 Dodge Charger R/T",
      slug: "2022-dodge-charger-rt",
      description:
        "The last of the naturally-aspirated V8 muscle cars — and this R/T is the one to have. 5.7L HEMI V8 producing 370 HP, Brembo front brakes, sport-tuned suspension, and Uconnect 5 with a 10.1-inch screen. The Charger R/T is a legitimate performance car that seats five and fits in a normal garage. Low miles, no incidents, and it sounds exactly the way it should.",
      price: 3490000,
      collectionId: sedansId,
      images: [
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
        "https://images.unsplash.com/photo-1674719645138-c3fd1aaf8307?w=800&q=80",
      ],
      inStock: true,
      featured: true,
      sortOrder: 19,
      year: 2022,
      make: "Dodge",
      model: "Charger",
      trim: "R/T",
      mileage: 22000,
      vin: "2C3CDXCT0NH123456",
      bodyType: "Sedan",
      transmission: "Automatic",
      exteriorColor: "Pitch Black",
      condition: "Used",
    });

    await ctx.db.insert("products", {
      name: "2023 Toyota Camry XSE V6",
      slug: "2023-toyota-camry-xse",
      description:
        "The XSE is the Camry for people who think the Camry isn't exciting — they're wrong about the XSE. Sport-tuned suspension, V6 producing 301 HP, blacked-out exterior trim, heated/ventilated front seats, and JBL audio. This is nearly a new car, with factory warranty coverage remaining. A rare combination of daily reliability and genuine driving fun.",
      price: 3299500,
      compareAtPrice: 3650000,
      collectionId: sedansId,
      images: [
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
        "https://images.unsplash.com/photo-1674719645138-c3fd1aaf8307?w=800&q=80",
      ],
      inStock: true,
      featured: true,
      sortOrder: 20,
      year: 2023,
      make: "Toyota",
      model: "Camry",
      trim: "XSE V6",
      mileage: 9800,
      vin: "4T1KZ1AK5PU123456",
      bodyType: "Sedan",
      transmission: "Automatic",
      exteriorColor: "Midnight Black Metallic",
      condition: "Certified Pre-Owned",
    });

    return {
      success: true,
      message: "Seeded 3 collections (Trucks, SUVs, Sedans) and 20 vehicles.",
    };
  },
});
