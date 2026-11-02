/**
 * Landing-only demo assets.
 * Never mix these into user story state / book assembly.
 *
 * Local generated demos are used as fallbacks when remote images fail;
 * keys mirror the design analysis Unsplash set.
 */
export const DEMO_PHOTOS = {
  beach: "/demo/couple-2.jpg",
  cafe: "/demo/couple-4.jpg",
  couple: "/demo/couple-1.jpg",
  walk: "/demo/couple-3.jpg",
  city: "/demo/couple-2.jpg",
  flowers: "/demo/couple-3.jpg",
} as const;

export const LANDING_DEMO_PHOTOS = [
  DEMO_PHOTOS.couple,
  DEMO_PHOTOS.cafe,
  DEMO_PHOTOS.flowers,
  DEMO_PHOTOS.city,
] as const;

export const LANDING_DEMO_COVER = {
  volume: 1,
  title: "OUR DAYS",
  names: "서윤 & 지호",
  period: "2024 — 2025",
  photos: [...LANDING_DEMO_PHOTOS],
} as const;
