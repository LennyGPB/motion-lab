// =====================================================================
//  TEMPLATE "SOCIAL PROOF" — everything is customised here.
// =====================================================================

export const CONFIG = {
  name: "APPNAME",
  iconGlyph: "A",
  tagline: "Loved by people like you.",
  bg: "#0a0f1f",
  accent: "#5b8cff",
  star: "#ffc531",
  /** Opening line (2 lines). */
  hook: ["DON'T TAKE", "OUR WORD FOR IT."],
  /** Key figures: one entry = one giant counter scene. */
  stats: [
    { value: 2, decimals: 0, prefix: "", suffix: "M+", label: "DOWNLOADS", stars: false },
    { value: 4.8, decimals: 1, prefix: "", suffix: "", label: "AVERAGE RATING", stars: true },
    { value: 150, decimals: 0, prefix: "", suffix: "K", label: "5-STAR REVIEWS", stars: false },
  ],
  /** Reviews: one entry = one card. */
  reviews: [
    { stars: 5, quote: "Honestly the best app I've downloaded this year. It just works.", name: "Sarah", meta: "Verified user · iOS" },
    { stars: 5, quote: "Saves me so much time every single day. I can't go back.", name: "James", meta: "Verified user · Android" },
    { stars: 5, quote: "Clean, fast and genuinely useful. My whole team uses it now.", name: "Amina", meta: "Verified user · iOS" },
  ],
  /** Short quotes for the review wall. */
  wall: ["Love it!", "Game changer.", "So simple.", "5 stars, easily.", "Can't live without it.", "Perfect.", "Wow.", "Best in class.", "Highly recommend.", "Super fast.", "Beautiful app.", "Life saver."],
  wallLine: ["JOIN 2M+", "HAPPY USERS."],
  /** End card. */
  ratingBadge: "4.8 on the App Store",
  stores: ["apple", "google"] as ("apple" | "google")[],
};
