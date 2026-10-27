export { loadFonts } from "../signspath/theme";

export const A = {
  night: "#120a08",
  deep: "#1d100b",
  amber: "#ffb45a",
  sun: "#ffd27a",
  orange: "#ff7a3d",
  rose: "#ff5e7e",
  plum: "#5a2a4a",
  cream: "#fff1de",
  muted: "#c9a98c",
  green: "#7fe0a6",
};
export const SANS = "Manrope, Inter, sans-serif";
export const SERIF = "'Instrument Serif', Georgia, serif";
export const serif = (size: number): React.CSSProperties => ({ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: size, lineHeight: 1, letterSpacing: size * -0.01 });
export const sans = (size: number, weight = 500): React.CSSProperties => ({ fontFamily: SANS, fontWeight: weight, fontSize: size, lineHeight: 1.05, letterSpacing: size * -0.015 });
export const caps = (size: number): React.CSSProperties => ({ fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: "0.32em", textTransform: "uppercase" });
export const warmText: React.CSSProperties = {
  background: `linear-gradient(180deg, ${A.sun} 0%, ${A.orange} 60%, ${A.rose} 110%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  paddingRight: "0.1em",
};

/** Couleur du ciel selon l'heure (0 = aube, 1 = crépuscule). */
const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};
export const sky = (t: number) => ({
  top: t < 0.5 ? mix("#2a1610", "#3a1a22", t * 2) : mix("#3a1a22", "#1c1028", (t - 0.5) * 2),
  mid: t < 0.5 ? mix("#a8502a", "#c4553e", t * 2) : mix("#c4553e", "#6a2c4a", (t - 0.5) * 2),
  low: t < 0.5 ? mix("#ffb45a", "#ff8a4a", t * 2) : mix("#ff8a4a", "#ff6a6a", (t - 0.5) * 2),
});
