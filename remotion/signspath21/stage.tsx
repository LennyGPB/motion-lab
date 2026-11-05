import { AbsoluteFill } from "remotion";
import { T } from "../signspath/timing";
import { eExpo, eInOut, eOut, lerp, prog } from "../signspath/util";
import { LiquidBg } from "./Liquid";

/* Outils communs aux pubs Signs « métal liquide » : transitions 3D + fond. */
export type Kind = "flipY" | "flipX" | "dive" | "swing" | "none";
const enterT = (k: Kind, q: number) =>
  k === "flipY" ? `rotateY(${(1 - q) * 100}deg)` : k === "flipX" ? `rotateX(${(1 - q) * -90}deg)` : k === "dive" ? `translateZ(${(1 - q) * -2400}px)` : k === "swing" ? `rotateZ(${(1 - q) * -12}deg) rotateY(${(1 - q) * -70}deg) translateX(${(1 - q) * 300}px)` : "";
const exitT = (k: Kind, q: number) =>
  k === "flipY" ? `rotateY(${-q * 100}deg)` : k === "flipX" ? `rotateX(${q * 90}deg)` : k === "dive" ? `translateZ(${q * 1400}px)` : k === "swing" ? `rotateZ(${q * 12}deg) rotateY(${q * 70}deg) translateX(${-q * 300}px)` : "";

/** Scène en 3D : entrée/sortie en rotation autour d'un pivot placé derrière l'écran (effet cube). */
export const Stage3D: React.FC<{ f: number; range: readonly [number, number]; enter: Kind; exit: Kind; children: React.ReactNode }> = ({ f, range, enter, exit, children }) => {
  const a = T(range[0]);
  const b = T(range[1]);
  if (f < a - 8 || f > b + 4) return null;
  const qi = enter === "none" ? 1 : prog(f, a - 8, a + 10, eExpo);
  const qo = exit === "none" ? 0 : prog(f, b - 9, b + 2, eInOut);
  const origin = "50% 50% -640px";
  return (
    <AbsoluteFill style={{ perspective: 1500 }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transformOrigin: origin, transform: exitT(exit, qo), opacity: 1 - (exit === "dive" ? qo : qo * 0.4), filter: qo > 0.03 ? `blur(${qo * 12}px)` : undefined }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transformOrigin: origin, transform: enterT(enter, qi), opacity: Math.min(1, qi * 1.6), filter: qi < 0.97 ? `blur(${(1 - qi) * 14}px)` : undefined }}>{children}</AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Fond métal liquide qui accélère et zoome à chaque coupe + voile pour la lisibilité. */
export const LiquidBackdrop: React.FC<{ f: number; cuts: number[]; dim?: number }> = ({ f, cuts, dim = 0.62 }) => {
  const kick = cuts.reduce((s, c) => s + 1.6 * prog(f, T(c) - 10, T(c) + 10, eInOut), 0);
  const pulse = cuts.reduce((s, c) => s + Math.exp(-Math.abs(f - T(c)) / 7), 0);
  return (
    <AbsoluteFill>
      <LiquidBg t={f / 30 + kick} zoom={1 + 0.12 * Math.min(1, pulse)} light={0.6 * Math.sin(f / 90)} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 48%, rgba(8,2,22,${dim}), rgba(8,2,22,${dim * 0.5}) 70%, rgba(8,2,22,${dim * 0.25}))` }} />
    </AbsoluteFill>
  );
};

/** Texte tapé entre deux temps voix. */
export const typed = (f: number, txt: string, a: number, b: number) => txt.slice(0, Math.round(lerp(0, txt.length, prog(f, T(a), T(b), (x) => x))));
export const pop = (f: number, at: number, len = 12) => prog(f, T(at) - 2, T(at) + len, eOut);
