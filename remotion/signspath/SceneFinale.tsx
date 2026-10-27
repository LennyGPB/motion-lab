import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Canvas } from "./Canvas";
import { C, SANS, serifGradient } from "./theme";
import { SCENES, T, W } from "./timing";
import { clamp, eExpo, eInOut, eOut, hash, lerp, prog } from "./util";
import { Words } from "./Words";

const N = 2400;
const GOLD = Math.PI * (3 - Math.sqrt(5));
const PTS = Array.from({ length: N }, (_, i) => {
  const y = 1 - (i / (N - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const th = GOLD * i;
  return {
    sx: Math.cos(th) * r,
    sy: y,
    sz: Math.sin(th) * r,
    // position "chaos" de départ
    cx: hash(i * 1.37) * 1300 - 110,
    cy: hash(i * 2.71) * 2100 - 90,
    w: 0.5 + hash(i * 3.3) * 1.5,
    ph: hash(i * 4.9) * 6.28,
    delay: hash(i * 6.1) * 0.35,
    r: 0.9 + hash(i * 7.7) * 1.6,
  };
});

/** Timing de la finale (temps voix) — paramétrable pour réutiliser la scène. */
export type FinaleTiming = {
  manifest: number; with: number; method: number; not: number; by: number; chance: number;
  full: number; signs: number; path: number; dot: number; comEnd: number;
  /** début du passage au CTA (temps voix) */
  cta: number;
  /** frame vidéo de début de la séquence */
  from: number;
};
const DEFAULT_TIMING: FinaleTiming = {
  manifest: W.manifest, with: W.with, method: W.method, not: W.not, by: W.by, chance: W.chance,
  full: W.full, signs: W.signs, path: W.path, dot: W.dot, comEnd: W.comEnd, cta: 24.15, from: SCENES.finale.from,
};

/** Scènes 5 & 6 : sphère de particules qui s'ordonne ("with method") puis CTA signspath.com. */
export const SceneFinale: React.FC<{ timing?: FinaleTiming }> = ({ timing = DEFAULT_TIMING }) => {
  const W = timing;
  const URL_PARTS = [
    { txt: "signs", from: W.signs, to: W.path },
    { txt: "path", from: W.path, to: W.dot },
    { txt: ".com", from: W.dot, to: W.comEnd },
  ];
  const f = useCurrentFrame() + W.from;
  const flash = interpolate(f, [T(W.manifest - 0.16), T(W.manifest - 0.16) + 1, T(W.manifest + 0.24)], [0, 0.85, 0], clamp);
  const cta = prog(f, T(W.cta), T(W.cta) + 26, eInOut);

  // texte tapé de l'URL
  let typed = "";
  for (const part of URL_PARTS) {
    const n = Math.round(interpolate(f, [T(part.from), T(part.to) - 1], [0, part.txt.length], clamp));
    typed += part.txt.slice(0, n);
  }
  const dotIdx = typed.indexOf(".");
  const pillIn = prog(f, T(W.full) + 4, T(W.full) + 18, eExpo);
  const shine = prog(f, T(W.comEnd), T(W.comEnd) + 22, eInOut);
  const caret = f < T(W.comEnd) + 10 && Math.floor(f / 8) % 2 === 0;

  return (
    <AbsoluteFill>
      <Canvas
        draw={(ctx, fr) => {
          const fa = fr + W.from;
          const form = (d: number) => prog(fa, T(W.manifest) + d * 30, T(W.method) + 6 + d * 30, eInOut);
          const pulse = Math.exp(-Math.max(0, fa - T(W.chance)) / 8) * (fa >= T(W.chance) ? 1 : 0);
          const radius = lerp(360, 150, cta) * (1 + 0.06 * pulse);
          const cxs = 540;
          const cys = lerp(980, 600, cta);
          const ry = fa * 0.012;
          const rx = -0.35;
          const t = fa / 30;
          ctx.globalCompositeOperation = "lighter";
          for (let i = 0; i < N; i++) {
            const p = PTS[i];
            const k = form(p.delay);
            // rotation
            const x1 = p.sx * Math.cos(ry) + p.sz * Math.sin(ry);
            const z1 = -p.sx * Math.sin(ry) + p.sz * Math.cos(ry);
            const y2 = p.sy * Math.cos(rx) - z1 * Math.sin(rx);
            const z2 = p.sy * Math.sin(rx) + z1 * Math.cos(rx);
            const persp = 1 / (1.9 - z2 * 0.5);
            const wob = 1 + 0.03 * Math.sin(t * 2 + p.ph);
            const tx = cxs + x1 * radius * persp * 1.7 * wob;
            const ty = cys + y2 * radius * persp * 1.7 * wob;
            const ox = p.cx + 50 * Math.sin(t * p.w + p.ph);
            const oy = p.cy + 50 * Math.cos(t * p.w * 0.8 + p.ph);
            const x = lerp(ox, tx, k);
            const y = lerp(oy, ty, k);
            const depth = (z2 + 1) / 2;
            const a = lerp(0.35, 0.25 + 0.7 * depth, k) * prog(fa, W.from, W.from + 12);
            ctx.fillStyle = `hsla(${262 + depth * 18},85%,${70 + depth * 18}%,${a})`;
            ctx.beginPath();
            ctx.arc(x, y, p.r * lerp(1, 0.6 + depth * 0.7, k) * lerp(1, 0.75, cta), 0, Math.PI * 2);
            ctx.fill();
          }
          // halo de la sphère
          const g = ctx.createRadialGradient(cxs, cys, 0, cxs, cys, radius * 1.6);
          g.addColorStop(0, `rgba(160,120,255,${0.22 * form(0) + 0.2 * pulse})`);
          g.addColorStop(1, "rgba(160,120,255,0)");
          ctx.fillStyle = g;
          ctx.fillRect(cxs - radius * 1.6, cys - radius * 1.6, radius * 3.2, radius * 3.2);
        }}
      />

      <Words
        f={f}
        top={850}
        size={110}
        lineGap={0}
        exitAt={T(W.cta - 0.05)}
        lines={[
          [{ t: "Manifest", at: W.manifest, kind: "bold" }],
          [
            { t: "with", at: W.with, kind: "serif", size: 80 },
            { t: "method,", at: W.method, kind: "serif", size: 80 },
          ],
          [
            { t: "not", at: W.not, kind: "muted", size: 70 },
            { t: "by", at: W.by, kind: "muted", size: 70 },
            { t: "chance.", at: W.chance, kind: "bold", size: 50 },
          ],
        ]}
      />

      {/* CTA */}
      <Words f={f} top={930} size={58} lines={[[{ t: "Full guide at", at: W.full, kind: "muted", size: 72 }]]} />
      <div
        style={{
          position: "absolute",
          top: 1030,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: pillIn,
          transform: `scale(${lerp(0.85, 1, pillIn)})`,
          filter: pillIn < 1 ? `blur(${(1 - pillIn) * 12}px)` : undefined,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 800,
            height: 160,
            borderRadius: 999,
            background: "linear-gradient(160deg, rgba(255,255,255,0.16), rgba(190,170,255,0.05))",
            border: "1.5px solid rgba(225,215,255,0.35)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 80px rgba(139,92,246,0.45), 0 30px 80px rgba(5,0,20,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, color: C.white, letterSpacing: -1.5 }}>
            {dotIdx >= 0 ? typed.slice(0, dotIdx) : typed}
            {dotIdx >= 0 ? <span style={{ color: C.lilac }}>{typed.slice(dotIdx)}</span> : null}
            <span style={{ opacity: caret ? 0.9 : 0, color: C.lilac, fontWeight: 400, marginLeft: 4 }}>|</span>
          </span>
          {/* reflet qui balaie */}
          <div
            style={{
              position: "absolute",
              top: -40,
              bottom: -40,
              width: 140,
              left: lerp(-200, 900, shine),
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
              transform: "skewX(-20deg)",
              opacity: shine > 0 && shine < 1 ? 1 : 0,
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1250,
          width: "100%",
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: "0.5em",
          color: C.muted,
          opacity: prog(f, T(W.comEnd) + 4, T(W.comEnd) + 20),
          transform: `translateY(${(1 - prog(f, T(W.comEnd) + 4, T(W.comEnd) + 20, eOut)) * 20}px)`,
        }}
      >
        MANIFEST WITH METHOD
      </div>

      {/* Flash d'entrée */}
      <AbsoluteFill style={{ backgroundColor: "#efe8ff", opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

export { serifGradient };
