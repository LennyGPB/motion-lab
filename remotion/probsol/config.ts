// =====================================================================
//  TEMPLATE "PROBLÈME → SOLUTION" — tout se personnalise ici.
// =====================================================================

export type PSScreen = "home" | "focus" | "done";
export type PSIcon = "grid" | "target" | "bolt" | "check" | "heart";

export const CONFIG = {
  name: "APPNAME",
  iconGlyph: "A",
  tagline: "La vie, en plus simple.",
  /** Couleurs de la partie "solution" (la partie problème est en noir et blanc). */
  accent: "#3d7bff",
  accent2: "#2ce6a6",
  /** Partie problème. */
  problemKicker: "LE PROBLÈME",
  problemLines: ["TROP D'APPS.", "TROP DE NOTIFS.", "ZÉRO TEMPS."],
  /** Notifications grises qui s'empilent (chaos). */
  noise: ["12 nouveaux messages", "Réunion dans 5 min", "Rappel : relance client", "Batterie faible", "Mot de passe expiré", "3 tâches en retard", "Nouvel e-mail", "Mise à jour requise"],
  /** Phrase juste avant la bascule couleur. */
  switchLine: "Et s'il existait plus simple ?",
  /** Révélation de la solution. */
  solutionKicker: "LA SOLUTION",
  solutionLine: "VOICI",
  heroScreen: "home" as PSScreen,
  /** Bénéfices : une entrée = une scène (écran du téléphone remplacé). */
  benefits: [
    { icon: "grid" as PSIcon, title: "TOUT AU MÊME ENDROIT", sub: "Vos outils réunis dans une seule app.", screen: "home" as PSScreen },
    { icon: "target" as PSIcon, title: "CONCENTREZ-VOUS", sub: "Moins de bruit, plus d'essentiel.", screen: "focus" as PSScreen },
    { icon: "bolt" as PSIcon, title: "GAGNEZ DU TEMPS", sub: "Chaque jour, sans effort.", screen: "done" as PSScreen },
  ],
  /** Fin. */
  cta: "Essayez gratuitement",
  stores: ["apple", "google"] as ("apple" | "google")[],
};
