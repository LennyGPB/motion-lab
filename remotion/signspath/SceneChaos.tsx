import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Canvas } from "./Canvas";
import { T, W } from "./timing";
import { clamp, eExpo, eIn, hash } from "./util";
import { Words } from "./Words";

const N = 1700;
const PTS = Array.from({ length: N }, (_, i) => {
  const ang = hash(i) * Math.PI * 2;
  const rad = Math.sqrt(hash(i + 0.5)) * 520;
  return {
    bx: 540 + Math.cos(ang) * rad,
    by: 1150 + Math.sin(ang) * rad * 1.05,
    a1: 40 + hash(i * 2.3) * 140,
    a2: 20 + hash(i * 3.7) * 70,
    w1: 1.6 + hash(i * 1.9) * 3.4,
    w2: 3 + hash(i * 6.1) * 5,
    p1: hash(i * 8.3) * 6.28,
    p2: hash(i * 2.9) * 6.28,
    r: 0.8 + hash(i * 4.4) * 2.2,
    hue: 250 + hash(i * 5.1) * 45,
    lig: 62 + hash(i * 7.3) * 25,
  };
});

/** Scène 1 : "You want to change everything at once? That's why nothing moves." */
export const SceneChaos: React.FC = () => {
  const f = useCurrentFrame(); // la scène démarre à 0 : frame locale = frame absolue
  const tFreeze = T(W.nothing);
  const exitStart = T(3.85);
  const exit = interpolate(f, [exitStart, T(4.15)], [0, 1], { ...clamp, easing: eIn });

  // Secousse au moment du gel
  const sinceFreeze = f - tFreeze;
  const shake = sinceFreeze >= 0 ? 14 * Math.exp(-sinceFreeze / 3) : 0;
  const sx = shake * Math.sin(sinceFreeze * 3.1);
  const sy = shake * Math.cos(sinceFreeze * 2.3);

  // Texte qui tremble pendant le chaos
  const jit = f < T(W.onceEnd) ? 3 : 0;
  const jx = jit * (hash(f * 1.7) - 0.5) * 2;
  const jy = jit * (hash(f * 2.9) - 0.5) * 2;

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${sx}px, ${sy}px) scale(${1 + exit * 0.35})`,
        filter: exit > 0 ? `blur(${exit * 24}px)` : undefined,
        opacity: 1 - exit,
      }}
    >
      <Canvas
        draw={(ctx, fr) => {
          const open = interpolate(fr, [0, 18], [0, 1], { ...clamp, easing: eExpo });
          const frozen = fr >= tFreeze;
          const tm = Math.min(fr, tFreeze) / 30;
          const gray = interpolate(fr, [tFreeze, tFreeze + 8], [0, 1], clamp);
          const vib = frozen ? 7 * Math.exp(-(fr - tFreeze) / 4) : 0;
          ctx.globalCompositeOperation = "lighter";
          const pos = (p: (typeof PTS)[number], t: number) => [
            540 + (p.bx - 540) * open + (p.a1 * Math.sin(t * p.w1 + p.p1) + p.a2 * Math.sin(t * p.w2 + p.p2)) * open,
            1150 + (p.by - 1150) * open + (p.a1 * Math.cos(t * p.w1 * 0.9 + p.p2) + p.a2 * Math.sin(t * p.w2 * 1.3 + p.p1)) * open,
          ];
          for (let i = 0; i < N; i++) {
            const p = PTS[i];
            const [x, y] = pos(p, tm);
            const sat = 80 * (1 - gray) + 10 * gray;
            const lig = p.lig * (1 - gray * 0.35);
            const alpha = (0.75 - gray * 0.1) * open;
            ctx.strokeStyle = ctx.fillStyle = `hsla(${p.hue},${sat}%,${lig}%,${alpha})`;
            if (!frozen) {
              const [px, py] = pos(p, tm - 0.07);
              ctx.lineWidth = p.r;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(x, y);
              ctx.stroke();
            } else {
              const vx = vib * Math.sin((fr - tFreeze) * 2.7 + i);
              ctx.beginPath();
              ctx.arc(x + vx, y, p.r * 1.3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }}
      />
      {/* Assombrissement au gel */}
      <AbsoluteFill
        style={{
          backgroundColor: "#05010f",
          opacity: interpolate(f, [tFreeze, tFreeze + 6], [0, 0.2], clamp),
        }}
      />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${jx}px, ${jy}px)` }}>
        <Words
          f={f}
          top={250}
          exitAt={T(2.25)}
          lines={[
            [
              { t: "You", at: W.you },
              { t: "want", at: W.want },
              { t: "to", at: W.to },
              { t: "change", at: W.change },
            ],
            [{ t: "everything", at: W.everything, kind: "serif" }],
            [
              { t: "at", at: W.at, kind: "bold" },
              { t: "once?", at: W.once, kind: "bold" },
            ],
          ]}
        />
      </div>
      <Words
        f={f}
        top={250}
        lines={[
          [
            { t: "That's", at: W.thats, kind: "muted" },
            { t: "why", at: W.why, kind: "muted" },
          ],
          [{ t: "nothing", at: W.nothing, kind: "serif" }],
          [{ t: "moves.", at: W.moves, kind: "bold" }],
        ]}
      />
    </AbsoluteFill>
  );
};
