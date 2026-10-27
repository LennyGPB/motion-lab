import { interpolate } from "remotion";
import { FONT, hotText, V } from "../viewz/theme";
import { clamp, eIn, eOut } from "../viewz/util";
import { T } from "./timing";

export const MX = 80; // marge latérale

export type Kind = "light" | "bold" | "accent" | "muted";
export type PTok = { t: string; at: number; kind?: Kind };
export type PLine = { tokens: PTok[]; size: number; gap?: number };

const kindStyle = (k: Kind, size: number): React.CSSProperties => {
  switch (k) {
    case "accent":
      return { ...hotText, fontStyle: "italic", fontWeight: 900, fontStretch: "88%", paddingRight: size * 0.08, letterSpacing: size * -0.01 };
    case "bold":
      return { color: V.white, fontWeight: 800, letterSpacing: size * -0.02 };
    case "muted":
      return { color: V.muted, fontWeight: 400 };
    default:
      return { color: "rgba(255,255,255,0.88)", fontWeight: 300, letterSpacing: size * -0.01 };
  }
};

/** Texte "pro" : mots révélés par masque (montée), alignés à gauche. */
export const PText: React.FC<{ f: number; lines: PLine[]; top: number; exitAt?: number; align?: "left" | "center"; left?: number }> = ({
  f,
  lines,
  top,
  exitAt,
  align = "left",
  left = MX,
}) => {
  const out = exitAt === undefined ? 0 : interpolate(f, [exitAt, exitAt + 9], [0, 1], { ...clamp, easing: eIn });
  if (out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right: MX,
        opacity: 1 - out,
        transform: `translateY(${-out * 40}px)`,
        filter: out > 0 ? `blur(${out * 8}px)` : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "left" ? "flex-start" : "center",
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", columnGap: line.gap ?? line.size * 0.24, overflow: "hidden", paddingBottom: line.size * 0.08, paddingTop: line.size * 0.02 }}>
          {line.tokens.map((tok, i) => {
            const st = T(tok.at) - 2;
            const p = interpolate(f, [st, st + 10], [0, 1], { ...clamp, easing: eOut });
            const k = tok.kind ?? "light";
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontFamily: FONT,
                  fontSize: line.size,
                  lineHeight: 1.04,
                  whiteSpace: "pre",
                  transform: `translateY(${(1 - p) * 105}%)`,
                  opacity: p > 0 ? 1 : 0,
                  filter: k === "accent" && p >= 1 ? "drop-shadow(0 0 18px rgba(180,60,255,0.45))" : undefined,
                  ...kindStyle(k, line.size),
                }}
              >
                {tok.t}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Petit libellé de section (ex. "01 — Appel à partenaires"). */
export const Label: React.FC<{ f: number; at: number; n?: string; text: string; top: number; exitAt?: number }> = ({ f, at, n, text, top, exitAt }) => {
  const p = interpolate(f, [at, at + 12], [0, 1], { ...clamp, easing: eOut });
  const out = exitAt === undefined ? 0 : interpolate(f, [exitAt, exitAt + 8], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top, left: MX, display: "flex", alignItems: "center", gap: 18, opacity: p * (1 - out) }}>
      {n ? <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: V.electric, letterSpacing: 2 }}>{n}</span> : null}
      <div style={{ width: 60 * p, height: 2, background: `linear-gradient(90deg, ${V.electric}, ${V.pink})` }} />
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, color: V.lilac, letterSpacing: "0.28em", textTransform: "uppercase" }}>{text}</span>
    </div>
  );
};

/** Panneau verre sobre. */
export const Panel: React.FC<{ w: number; h?: number; children?: React.ReactNode; hot?: boolean; style?: React.CSSProperties; pad?: number }> = ({
  w,
  h,
  children,
  hot,
  style,
  pad = 36,
}) => (
  <div
    style={{
      width: w,
      height: h,
      padding: pad,
      boxSizing: "border-box",
      borderRadius: 30,
      background: hot
        ? "linear-gradient(150deg, rgba(190,70,255,0.32), rgba(110,20,200,0.22) 60%), rgba(20,4,36,0.86)"
        : "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 60%), rgba(12,3,22,0.82)",
      border: `1.5px solid ${hot ? "rgba(230,160,255,0.7)" : "rgba(210,170,255,0.22)"}`,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 30px 80px rgba(0,0,0,0.45)${hot ? ", 0 0 50px rgba(170,60,255,0.35)" : ""}`,
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

export const appear = (f: number, at: number, dur = 12) => interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: eOut });
