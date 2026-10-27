import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Canvas } from "./Canvas";
import { GlassCard } from "./Card";
import { SCENES, T, W } from "./timing";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, lerp, prog } from "./util";
import { Words } from "./Words";

const STEPS = [
  { icon: "intention", label: "intention", at: W.oneA },
  { icon: "technique", label: "technique", at: W.oneB },
  { icon: "day", label: "day", at: W.oneC },
];

const FOV = 720;
const pathX = (z: number) => 0.55 * Math.sin(z * 0.22 + 0.4) - 0.55 * Math.sin(0.4) + 0.05 * z;

/** Scène 4 : "One intention. One technique. One specific day to start." + chemin de lumière. */
export const SceneSteps: React.FC = () => {
  const f = useCurrentFrame() + SCENES.steps.from;
  const enter = prog(f, SCENES.steps.from, SCENES.steps.from + 10, eOut);
  const ignite = T(W.start) - 2;
  const lift = prog(f, ignite, ignite + 16, eInOut);
  const exit = prog(f, T(21.22), T(21.5), eIn);

  return (
    <AbsoluteFill
      style={{
        opacity: enter * (1 - exit),
        transform: `scale(${lerp(1.08, 1, enter) * (1 + exit * 0.4)})`,
        filter: enter < 1 || exit > 0 ? `blur(${(1 - enter) * 16 + exit * 20}px)` : undefined,
      }}
    >
      {/* Sol + chemin de lumière */}
      <Canvas
        draw={(ctx, fr) => {
          const fa = fr + SCENES.steps.from;
          const ig = prog(fa, ignite, ignite + 40, eExpo);
          const horizon = lerp(1260, 1020, prog(fa, ignite, ignite + 24, eInOut));
          const speed = 0.012 + 0.09 * prog(fa, ignite, ignite + 30, eIn);
          let travel = 0;
          for (let k = SCENES.steps.from; k < fa; k++) travel += 0.012 + 0.09 * prog(k, ignite, ignite + 30, eIn);
          void speed;
          const gridA = prog(fa, SCENES.steps.from, SCENES.steps.from + 30) * (0.35 + 0.3 * ig);
          const proj = (x: number, z: number) => [540 + (x * FOV) / z, horizon + (520 * 1.0) / z];

          // horizon glow
          const g = ctx.createLinearGradient(0, horizon - 120, 0, horizon + 60);
          g.addColorStop(0, "rgba(120,80,255,0)");
          g.addColorStop(0.7, `rgba(140,100,255,${0.12 + 0.18 * ig})`);
          g.addColorStop(1, "rgba(120,80,255,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, horizon - 120, 1080, 180);

          // lignes du sol
          for (let n = 0; n < 40; n++) {
            const z = 0.6 + n * 0.55 - (travel % 0.55);
            const [, y] = proj(0, z);
            if (y > 1920) continue;
            const a = gridA * Math.min(1, 2.2 / z) * 0.5;
            ctx.strokeStyle = `rgba(170,140,255,${a})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(1080, y);
            ctx.stroke();
          }
          if (ig <= 0) return;

          // chemin
          const zNear = 0.55;
          const zHead = lerp(zNear, 26, ig);
          ctx.globalCompositeOperation = "lighter";
          const passes = [
            { w: 5, a: 0.05 },
            { w: 2.2, a: 0.14 },
            { w: 1, a: 0.55 },
          ];
          for (const pass of passes) {
            for (let z = zNear; z < zHead; z += 0.06) {
              const z2 = Math.min(z + 0.06, zHead);
              const hw1 = (0.16 * pass.w * FOV) / z / 2;
              const hw2 = (0.16 * pass.w * FOV) / z2 / 2;
              const [x1, y1] = proj(pathX(z), z);
              const [x2, y2] = proj(pathX(z2), z2);
              const stripe = 0.55 + 0.45 * (Math.sin((z + travel * 1.0) * 18) > 0 ? 1 : 0);
              const fade = Math.min(1, (zHead - z) / 1.5 + 0.25);
              ctx.fillStyle = `rgba(180,150,255,${pass.a * stripe * fade})`;
              ctx.beginPath();
              ctx.moveTo(x1 - hw1, y1);
              ctx.lineTo(x1 + hw1, y1);
              ctx.lineTo(x2 + hw2, y2);
              ctx.lineTo(x2 - hw2, y2);
              ctx.fill();
            }
          }
          // tête lumineuse
          const [hx, hy] = proj(pathX(zHead), zHead);
          const hr = 40 + 30 * (1 - ig);
          const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
          hg.addColorStop(0, "rgba(255,255,255,1)");
          hg.addColorStop(0.2, "rgba(220,200,255,0.8)");
          hg.addColorStop(1, "rgba(140,100,255,0)");
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(hx, hy, hr, 0, Math.PI * 2);
          ctx.fill();
          // bloom au premier plan
          const [bx, by] = proj(pathX(1.1), 1.1);
          const bloom = ctx.createRadialGradient(bx, by, 0, bx, by, 260);
          bloom.addColorStop(0, `rgba(255,245,255,${0.85 * ig})`);
          bloom.addColorStop(0.25, `rgba(200,170,255,${0.35 * ig})`);
          bloom.addColorStop(1, "rgba(120,80,255,0)");
          ctx.fillStyle = bloom;
          ctx.fillRect(bx - 260, by - 260, 520, 520);
        }}
      />

      {/* Trois cartes */}
      <AbsoluteFill style={{ perspective: 1600 }}>
        {STEPS.map((s, i) => {
          const p = prog(f, T(s.at) - 3, T(s.at) + 14, eBack);
          const a = interpolate(f, [T(s.at) - 3, T(s.at) + 4], [0, 1], clamp);
          const isLast = STEPS.findLastIndex((x) => f >= T(x.at) - 3) === i;
          const act = isLast ? prog(f, T(s.at), T(s.at) + 8) * (1 - lift) : 0;
          const x = 540 + (i - 1) * 320;
          const y = lerp(1000, 860, lift);
          const sc = lerp(1, 0.7, lift) * (1 + act * 0.06);
          return (
            <div
              key={s.icon}
              style={{
                position: "absolute",
                left: x - 145,
                top: y - 185,
                opacity: a,
                transform: `translateZ(${(1 - p) * -500}px) rotateY(${(1 - p) * 95}deg) scale(${sc})`,
              }}
            >
              <GlassCard icon={s.icon} label={s.label} kicker="one" active={act} w={290} h={370} />
            </div>
          );
        })}
      </AbsoluteFill>

      <Words
        f={f}
        top={230}
        size={74}
        lineGap={2}
        lines={[
          [
            { t: "One", at: W.oneA, kind: "muted" },
            { t: "intention.", at: W.intention, kind: "bold" },
          ],
          [
            { t: "One", at: W.oneB, kind: "muted" },
            { t: "technique.", at: W.technique, kind: "bold" },
          ],
          [
            { t: "One", at: W.oneC, kind: "muted" },
            { t: "specific", at: W.specific, kind: "serif", size: 58 },
            { t: "day", at: W.day, kind: "bold" },
          ],
          [
            { t: "to", at: W.to3, kind: "muted" },
            { t: "start.", at: W.start, kind: "serif", size: 70 },
          ],
        ]}
      />
    </AbsoluteFill>
  );
};
