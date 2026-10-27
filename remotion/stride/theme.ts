export const S = {
  bg: "#07080a",
  panel: "#111317",
  panel2: "#181b21",
  volt: "#d4ff3a",
  orange: "#ff5a1f",
  sky: "#3ad6ff",
  white: "#ffffff",
  muted: "#8b919c",
  line: "rgba(255,255,255,0.08)",
};
export const FONT = "Archivo, sans-serif";

/** Style "titre géant" : italique, très gras, condensé. */
export const mega = (size: number, color = S.white): React.CSSProperties => ({
  fontFamily: FONT,
  fontStyle: "italic",
  fontWeight: 900,
  fontStretch: "66%",
  fontSize: size,
  lineHeight: 0.86,
  letterSpacing: size * -0.01,
  textTransform: "uppercase",
  color,
  whiteSpace: "nowrap",
});
