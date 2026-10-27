import { continueRender, delayRender, staticFile } from "remotion";

export const C = {
  bgDeep: "#07031a",
  bgMid: "#1c0b4d",
  bgGlow: "#3b1d8f",
  violet: "#8b5cf6",
  lilac: "#b9a6ff",
  lilacSoft: "#cfc2ff",
  white: "#f6f3ff",
  muted: "#a99fd6",
};

export const SANS = "Manrope, Inter, sans-serif";
export const SERIF = "'Instrument Serif', Georgia, serif";

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("fonts");
  const fonts = [
    new FontFace("Manrope", `url(${staticFile("signspath/fonts/Manrope.woff2")})`, { weight: "200 800" }),
    new FontFace("Instrument Serif", `url(${staticFile("signspath/fonts/InstrumentSerif.woff2")})`, { style: "italic" }),
  ];
  Promise.all(fonts.map((f) => f.load()))
    .then((fs) => {
      fs.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};

// Dégradé "lilas" pour les mots en serif italique
export const serifGradient: React.CSSProperties = {
  fontFamily: SERIF,
  fontStyle: "italic",
  fontWeight: 400,
  background: `linear-gradient(180deg, ${C.lilacSoft} 10%, ${C.violet} 110%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  paddingRight: "0.12em",
};
