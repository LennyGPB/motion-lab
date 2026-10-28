// =====================================================================
//  TEMPLATE "LANCEMENT" — tout se personnalise ici.
// =====================================================================

export type ScreenKind = "feed" | "stats" | "chat";

export const CONFIG = {
  /** Nom de l'app (affiché en très gros, en majuscules). */
  name: "APPNAME",
  /** Lettre/glyphe de l'icône (par défaut : 1re lettre du nom). */
  iconGlyph: "A",
  tagline: "La nouvelle app qui change tout.",
  /** Couleurs : fond, accent principal, accent secondaire. */
  bg: "#050507",
  accent: "#5b5bff",
  accent2: "#ff4fd8",
  /** Fonctionnalités : une entrée = un téléphone dans la rafale. */
  features: [
    { title: "RAPIDE", sub: "Tout en un geste.", screen: "feed" as ScreenKind },
    { title: "SIMPLE", sub: "Pensée pour vous.", screen: "stats" as ScreenKind },
    { title: "CONNECTÉE", sub: "Vos proches, en direct.", screen: "chat" as ScreenKind },
  ],
  /** Phrase sur le plan des 3 téléphones. */
  trioLine: ["TOUT.", "EN UNE APP."],
  /** Bandeau de sortie. */
  releaseLabel: "DISPONIBLE LE",
  releaseDate: "15 NOVEMBRE",
  releaseShort: "15.11",
  /** Fin. */
  cta: "Téléchargez-la gratuitement",
  stores: ["apple", "google"] as ("apple" | "google")[],
};
