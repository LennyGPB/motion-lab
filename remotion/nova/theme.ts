export { loadFonts } from "../signspath/theme";

export const N = {
  bg: "#05060a",
  bg2: "#0b0e18",
  ink: "#f4f1ea",
  muted: "#8e91a2",
  gold: "#d4b37a",
  goldDeep: "#9c7b45",
  peri: "#6f7cff",
  violet: "#b28cff",
  teal: "#5ee6d0",
  green: "#5ee6a0",
  red: "#ff7a8a",
  line: "rgba(244,241,234,0.1)",
};
export const SANS = "Manrope, Inter, sans-serif";
export const SERIF = "'Instrument Serif', Georgia, serif";
export const AURORA = `linear-gradient(115deg, ${N.peri} 0%, ${N.violet} 45%, ${N.teal} 100%)`;

export const serif = (size: number): React.CSSProperties => ({ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: size, lineHeight: 1, letterSpacing: size * -0.01 });
export const sans = (size: number, weight = 500): React.CSSProperties => ({ fontFamily: SANS, fontWeight: weight, fontSize: size, lineHeight: 1.05, letterSpacing: size * -0.02 });
export const goldText: React.CSSProperties = {
  background: `linear-gradient(180deg, #fff3d9 0%, ${N.gold} 55%, ${N.goldDeep} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  paddingRight: "0.1em",
};
export const auroraText: React.CSSProperties = { background: AURORA, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", paddingRight: "0.1em" };
