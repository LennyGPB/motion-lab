// =====================================================================
//  "WORKS EVERYWHERE" — everything is customised here.
// =====================================================================

export const CONFIG = {
  product: "FLOW",
  iconGlyph: "F",
  tagline: "Your work, on every screen.",
  cta: "Download free",
  accent: "#7c5cff",
  accent2: "#00d4ff",
  /**
   * Écrans remplaçables (images dans public/, contenu jamais animé) :
   * desktop 16:10 (ex. 1600x1000), tablet 3:4 (ex. 1200x1600), phone ~9:19.5 (ex. 1179x2556).
   * null = écran générique.
   */
  screens: {
    desktop: null as string | null,
    tablet: null as string | null,
    phone: null as string | null,
  },
  captions: {
    intro: ["ONE APP.", "EVERY SCREEN."],
    desktop: "ON YOUR DESKTOP.",
    tablet: "ON YOUR TABLET.",
    phone: "IN YOUR POCKET.",
    family: ["WORKS", "EVERYWHERE."],
  },
  labels: ["Desktop", "Tablet", "Phone"],
  platforms: ["macOS", "Windows", "iOS", "Android", "Web"],
  stores: ["apple", "google"] as ("apple" | "google")[],
};
