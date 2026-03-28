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
