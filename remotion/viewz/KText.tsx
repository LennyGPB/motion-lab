import { interpolate } from "remotion";
import { FONT, hotText, V } from "./theme";
import { T } from "./timing";
import { clamp, eExpo, eIn, eOut, hash } from "./util";

export type Look = "white" | "hot" | "outline" | "muted";
export type Tok = { t: string; at: number; look?: Look };
export type Line = { tokens: Tok[]; size: number; anim?: "slam" | "rise"; stretch?: number; gap?: number };

const lookStyle = (look: Look): React.CSSProperties => {
  switch (look) {
    case "hot":
      return hotText;
    case "outline":
      return { color: "transparent", WebkitTextStroke: `3px ${V.lilac}` };
    case "muted":
      return { color: V.muted };
    default:
      return { color: V.white };
  }
};

/** Mot avec séparation RGB (copies magenta / cyan décalées). */
const Split: React.FC<{ text: string; look: Look; split: number; style: React.CSSProperties }> = ({ text, look, split, style }) => (
  <span style={{ position: "relative", display: "inline-block", ...style }}>
    {split > 0.3 ? (
      <>
        <span style={{ position: "absolute", left: -split, top: 0, color: "rgba(255,40,220,0.75)", mixBlendMode: "screen" }}>{text}</span>
        <span style={{ position: "absolute", left: split, top: 0, color: "rgba(80,200,255,0.6)", mixBlendMode: "screen" }}>{text}</span>
      </>
    ) : null}
    <span style={{ position: "relative", ...lookStyle(look) }}>{text}</span>
  </span>
);

type Props = { f: number; lines: Line[]; top: number; exitAt?: number; align?: "center" | "left"; glitch?: number };

/** Typo cinétique : mots qui claquent (slam) ou montent (rise), sortie en "whip". */
export const KText: React.FC<Props> = ({ f, lines, top, exitAt, align = "center", glitch = 0 }) => {
  const out = exitAt === undefined ? 0 : interpolate(f, [exitAt, exitAt + 7], [0, 1], { ...clamp, easing: eIn });
  if (out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 50,
        right: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        opacity: 1 - out,
        transform: `translateX(${-out * 260}px) skewX(${out * 18}deg)`,
        filter: out > 0 ? `blur(${out * 14}px)` : undefined,
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            columnGap: line.gap ?? line.size * 0.22,
            justifyContent: align === "center" ? "center" : "flex-start",
            lineHeight: 0.98,
            overflow: line.anim === "rise" ? "hidden" : "visible",
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          {line.tokens.map((tok, i) => {
            const st = T(tok.at) - 1;
            const look = tok.look ?? "white";
            const base: React.CSSProperties = {
              fontFamily: FONT,
              fontStyle: "italic",
              fontWeight: 900,
              fontStretch: `${line.stretch ?? 82}%`,
              fontSize: line.size,
              textTransform: "uppercase",
              letterSpacing: line.size * -0.02,
              whiteSpace: "pre",
              paddingRight: line.size * 0.06,
            };
            if (line.anim === "rise") {
              const p = interpolate(f, [st, st + 6], [0, 1], { ...clamp, easing: eOut });
              return (
                <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%)`, opacity: p > 0 ? 1 : 0 }}>
                  <Split text={tok.t} look={look} split={0} style={base} />
                </span>
              );
            }
            const p = interpolate(f, [st, st + 6], [0, 1], { ...clamp, easing: eExpo });
            const since = f - st;
            const split = since < 0 ? 0 : 16 * Math.exp(-since / 5) + glitch * 8 * hash(f * 3.1 + i);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: p,
                  transform: `scale(${2.4 - 1.4 * p}) translateY(${(1 - p) * -30}px)`,
                  filter: p < 1 ? `blur(${(1 - p) * 16}px)` : "drop-shadow(0 0 22px rgba(180,60,255,0.55))",
                }}
              >
                <Split text={tok.t} look={look} split={split} style={base} />
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
