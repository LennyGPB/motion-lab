import { interpolate } from "remotion";
import { C, SANS, SERIF, serifGradient } from "./theme";
import { T } from "./timing";
import { clamp, eIn, eOut } from "./util";

export type Kind = "sans" | "bold" | "serif" | "muted" | "caps";
export type Token = { t: string; at: number; kind?: Kind; size?: number };

type Props = {
  /** Frame absolue courante. */
  f: number;
  lines: Token[][];
  /** Frame absolue de sortie (blur-out). */
  exitAt?: number;
  top?: number;
  /** Taille de base (px) du sans-serif. */
  size?: number;
  lineGap?: number;
  style?: React.CSSProperties;
  dur?: number;
};

const styleFor = (kind: Kind, size: number): React.CSSProperties => {
  switch (kind) {
    case "serif":
      return { ...serifGradient, fontSize: size * 1.7, lineHeight: 1.05, filter: "drop-shadow(0 0 24px rgba(160,120,255,0.45))" };
    case "bold":
      return { fontFamily: SANS, fontWeight: 800, fontSize: size, color: C.white, letterSpacing: -1 };
    case "muted":
      return { fontFamily: SANS, fontWeight: 600, fontSize: size * 0.72, color: C.muted };
    case "caps":
      return { fontFamily: SANS, fontWeight: 700, fontSize: size * 0.42, color: C.muted, letterSpacing: "0.4em", textTransform: "uppercase" };
    default:
      return { fontFamily: SANS, fontWeight: 600, fontSize: size, color: C.white, letterSpacing: -0.5 };
  }
};

/** Texte révélé mot par mot (fondu + flou + glissement), synchronisé sur la voix. */
export const Words: React.FC<Props> = ({ f, lines, exitAt, top = 300, size = 84, lineGap = 6, style, dur = 9 }) => {
  const out = exitAt === undefined ? 0 : interpolate(f, [exitAt, exitAt + 10], [0, 1], { ...clamp, easing: eIn });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 40,
        right: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: lineGap,
        opacity: 1 - out,
        filter: out > 0 ? `blur(${out * 18}px)` : undefined,
        transform: `translateY(${-out * 40}px) scale(${1 + out * 0.06})`,
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", alignItems: "baseline", justifyContent: "center", columnGap: size * 0.26, flexWrap: "wrap" }}>
          {line.map((tok, i) => {
            const start = T(tok.at) - 2;
            const p = interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing: eOut });
            const kind = tok.kind ?? "sans";
            return (
              <span
                key={i}
                style={{
                  ...styleFor(kind, tok.size ?? size),
                  display: "inline-block",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 34}px) scale(${0.92 + 0.08 * p})`,
                  filter: `${styleFor(kind, size).filter ?? ""} blur(${(1 - p) * 14}px)`,
                  whiteSpace: "pre",
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

export { SERIF };
