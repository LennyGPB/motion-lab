// =====================================================================
//  "BROWSER TOUR" — everything is customised here.
// =====================================================================

export type PageKind = "home" | "pricing" | "blog";

export const CONFIG = {
  brand: "Northstar",
  domain: "northstar.io",
  tagline: "A website your customers will love.",
  cta: "Visit northstar.io →",
  accent: "#ff6b3d",
  accent2: "#7c5cff",
  bg: ["#0d0b1a", "#1d1438"],
  intro: ["TAKE", "THE TOUR."],
  overview: ["EVERY PAGE.", "POLISHED."],
  /**
   * Pages (une entrée = une fenêtre). `image` : capture PLEINE HAUTEUR dans public/
   * (largeur conseillée 1440 px), elle défile dans la fenêtre. null = page générique.
   */
  pages: [
    { title: "Home", sub: "A first impression that converts.", path: "/", image: null as string | null, kind: "home" as PageKind },
    { title: "Pricing", sub: "Clear plans, zero friction.", path: "/pricing", image: null as string | null, kind: "pricing" as PageKind },
    { title: "Blog", sub: "Stories that bring traffic.", path: "/blog", image: null as string | null, kind: "blog" as PageKind },
  ],
};
