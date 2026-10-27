import { continueRender, delayRender, staticFile } from "remotion";

export const V = {
  black: "#050008",
  deep: "#12001f",
  violet: "#8a2be2",
  electric: "#b43cff",
  magenta: "#e040fb",
  pink: "#ff6ad5",
  lilac: "#e6c8ff",
  white: "#ffffff",
  muted: "#b9a3d1",
};

export const FONT = "Archivo, sans-serif";

let loaded = false;
export const loadViewzFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const h = delayRender("viewz-fonts");
  const fonts = [
    new FontFace("Archivo", `url(${staticFile("viewz/fonts/Archivo-normal.woff2")})`, { weight: "100 900", stretch: "62% 125%" }),
    new FontFace("Archivo", `url(${staticFile("viewz/fonts/Archivo-italic.woff2")})`, {
      weight: "100 900",
      stretch: "62% 125%",
      style: "italic",
    }),
  ];
  Promise.all(fonts.map((f) => f.load()))
    .then((fs) => {
      fs.forEach((f) => document.fonts.add(f));
      continueRender(h);
    })
    .catch((e) => {
      console.error(e);
      continueRender(h);
    });
};

/** Dégradé violet "chaud" pour les mots-clés. */
export const hotText: React.CSSProperties = {
  background: `linear-gradient(180deg, #ffffff 0%, ${V.lilac} 25%, ${V.electric} 65%, ${V.violet} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
