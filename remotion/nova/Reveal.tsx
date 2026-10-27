import { interpolate } from "remotion";
import { clamp, eExpo, eOut } from "../viewz/util";

export type RTok = { t: string; at: number; style: React.CSSProperties };

/**
 * Révélation mot par mot.
 * - "soft" : lent et élégant (fondu + montée + flou)
 * - "punch" : rapide (échelle + flou court)
 */
export const Reveal: React.FC<{ f: number; lines: RTok[][]; mode?: "soft" | "punch"; exitAt?: number; align?: "left" | "center"; gap?: number }> = ({
  f,
  lines,
  mode = "soft",
  exitAt,
  align = "left",
  gap = 0.25,
}) => {
  const out = exitAt === undefined ? 0 : interpolate(f, [exitAt, exitAt + (mode === "soft" ? 14 : 6)], [0, 1], { ...clamp, easing: eOut });
  if (out >= 1) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "center", opacity: 1 - out, transform: `translateY(${-out * 30}px)`, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "left" ? "flex-start" : "center", fontSize: 0 }}>
          {line.map((tok, i) => {
            const d = mode === "soft" ? 22 : 7;
            const p = interpolate(f, [tok.at, tok.at + d], [0, 1], { ...clamp, easing: mode === "soft" ? eOut : eExpo });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  marginRight: i < line.length - 1 ? `${gap}em` : 0,
                  opacity: p,
                  transform: mode === "soft" ? `translateY(${(1 - p) * 26}px)` : `scale(${1.25 - 0.25 * p})`,
                  filter: p < 1 ? `blur(${(1 - p) * (mode === "soft" ? 12 : 8)}px)` : undefined,
                  ...tok.style,
                  ...(i < line.length - 1 ? { paddingRight: 0 } : {}),
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
