// Status toggle definitions — importable from both server and client
// Do NOT import Convex server modules here

export const USER_PATHS = [
  "barber",
  "student",
  "shop",
  "school",
  "vendor",
  "event_coordinator",
  "client",
] as const;

export type UserPath = (typeof USER_PATHS)[number];

export type StatusToggleConfig = {
  default_days: number;
  max_days: number;
};

export const STATUS_TOGGLES = {
  barber: {
    seeking_employment: { default_days: 14, max_days: 30 },
    seeking_booth_rental: { default_days: 14, max_days: 30 },
    now_accepting_clients: { default_days: 7, max_days: 14 },
    open_to_walk_ins: { default_days: 1, max_days: 3 },
    open_to_guest_spot: { default_days: 7, max_days: 14 },
    open_to_relocate: { default_days: 30, max_days: 60 },
  },
  student: {
    seeking_apprenticeship: { default_days: 30, max_days: 60 },
    seeking_shop_exposure: { default_days: 14, max_days: 30 },
    interviewing_schools: { default_days: 30, max_days: 60 },
    graduating_soon: { default_days: 60, max_days: 90 },
    looking_for_shop_placement: { default_days: 30, max_days: 60 },
  },
  shop: {
    hiring_barbers: { default_days: 30, max_days: 60 },
    booth_rental_available: { default_days: 30, max_days: 60 },
    seeking_apprentice: { default_days: 30, max_days: 60 },
    open_to_guest_barbers: { default_days: 14, max_days: 30 },
  },
  school: {
    accepting_new_students: { default_days: 60, max_days: 90 },
    looking_for_instructors: { default_days: 30, max_days: 60 },
    hosting_enrollment_tours: { default_days: 7, max_days: 14 },
  },
  vendor: {
    booking_demos: { default_days: 14, max_days: 30 },
    wholesale_available: { default_days: 30, max_days: 60 },
    seeking_shop_partnerships: { default_days: 30, max_days: 60 },
    new_product_launch: { default_days: 14, max_days: 30 },
  },
  event_coordinator: {
    booking_barbers: { default_days: 14, max_days: 30 },
    booking_educators: { default_days: 14, max_days: 30 },
    vendor_booths_available: { default_days: 30, max_days: 60 },
    event_registration_open: { default_days: 30, max_days: 60 },
  },
  client: {
    looking_for_a_barber: { default_days: 7, max_days: 14 },
    need_a_cut_today: { default_days: 1, max_days: 1 },
    new_to_area: { default_days: 30, max_days: 60 },
    looking_for_specialist: { default_days: 14, max_days: 30 },
  },
} as const satisfies Record<UserPath, Record<string, StatusToggleConfig>>;

// Union of all toggle keys across all paths
export type ToggleKey = {
  [P in UserPath]: keyof (typeof STATUS_TOGGLES)[P];
}[UserPath];

// Toggle keys for a specific path
export type ToggleKeyForPath<P extends UserPath> = keyof (typeof STATUS_TOGGLES)[P];

export const DEFAULTS = {
  expires: true,
  auto_archive: true,
  allow_manual_refresh: true,
} as const;

// ── Complementary Matching ──

export type ComplementaryPair = {
  a: { path: UserPath; toggleKey: string };
  b: { path: UserPath; toggleKey: string };
};

export const COMPLEMENTARY_PAIRS: ComplementaryPair[] = [
  // Students seeking apprenticeships ↔ Shops seeking apprentices
  { a: { path: "student", toggleKey: "seeking_apprenticeship" }, b: { path: "shop", toggleKey: "seeking_apprentice" } },
  // Students seeking apprenticeships ↔ Shops hiring barbers (broader match)
  { a: { path: "student", toggleKey: "seeking_apprenticeship" }, b: { path: "shop", toggleKey: "hiring_barbers" } },
  // Barbers seeking employment ↔ Shops hiring barbers
  { a: { path: "barber", toggleKey: "seeking_employment" }, b: { path: "shop", toggleKey: "hiring_barbers" } },
  // Barbers seeking booth rental ↔ Shops with booths available
  { a: { path: "barber", toggleKey: "seeking_booth_rental" }, b: { path: "shop", toggleKey: "booth_rental_available" } },
  // Barbers open to guest spots ↔ Shops open to guest barbers
  { a: { path: "barber", toggleKey: "open_to_guest_spot" }, b: { path: "shop", toggleKey: "open_to_guest_barbers" } },
  // Vendors booking demos ↔ Shops with booth rental available
  { a: { path: "vendor", toggleKey: "booking_demos" }, b: { path: "shop", toggleKey: "booth_rental_available" } },
  // Vendors seeking shop partnerships ↔ Shops hiring barbers
  { a: { path: "vendor", toggleKey: "seeking_shop_partnerships" }, b: { path: "shop", toggleKey: "hiring_barbers" } },
  // Event coordinators booking barbers ↔ Barbers seeking employment
  { a: { path: "event_coordinator", toggleKey: "booking_barbers" }, b: { path: "barber", toggleKey: "seeking_employment" } },
  // Event coordinators booking educators ↔ Schools looking for instructors
  { a: { path: "event_coordinator", toggleKey: "booking_educators" }, b: { path: "school", toggleKey: "looking_for_instructors" } },
  // Clients looking for a barber ↔ Barbers accepting clients
  { a: { path: "client", toggleKey: "looking_for_a_barber" }, b: { path: "barber", toggleKey: "now_accepting_clients" } },
  // Clients need a cut today ↔ Barbers open to walk-ins
  { a: { path: "client", toggleKey: "need_a_cut_today" }, b: { path: "barber", toggleKey: "open_to_walk_ins" } },
  // Students looking for shop placement ↔ Shops seeking apprentices
  { a: { path: "student", toggleKey: "looking_for_shop_placement" }, b: { path: "shop", toggleKey: "seeking_apprentice" } },
  // Students interviewing schools ↔ Schools accepting new students
  { a: { path: "student", toggleKey: "interviewing_schools" }, b: { path: "school", toggleKey: "accepting_new_students" } },
  // Clients looking for specialist ↔ Barbers accepting clients
  { a: { path: "client", toggleKey: "looking_for_specialist" }, b: { path: "barber", toggleKey: "now_accepting_clients" } },
  // Barbers open to relocate ↔ Shops hiring barbers
  { a: { path: "barber", toggleKey: "open_to_relocate" }, b: { path: "shop", toggleKey: "hiring_barbers" } },
];

/** Given a path + toggleKey, return all complementary targets (works both directions) */
export function getComplementsFor(
  path: UserPath,
  toggleKey: string
): { path: UserPath; toggleKey: string }[] {
  const results: { path: UserPath; toggleKey: string }[] = [];
  for (const pair of COMPLEMENTARY_PAIRS) {
    if (pair.a.path === path && pair.a.toggleKey === toggleKey) {
      results.push(pair.b);
    } else if (pair.b.path === path && pair.b.toggleKey === toggleKey) {
      results.push(pair.a);
    }
  }
  return results;
}

/** Get all toggle definitions for a given user path */
export function getTogglesForPath<P extends UserPath>(
  path: P
): (typeof STATUS_TOGGLES)[P] {
  return STATUS_TOGGLES[path];
}

/** Get config for a specific toggle on a specific path */
export function getToggleConfig(
  path: UserPath,
  key: string
): StatusToggleConfig | undefined {
  const pathToggles = STATUS_TOGGLES[path] as Record<string, StatusToggleConfig>;
  return pathToggles[key];
}
