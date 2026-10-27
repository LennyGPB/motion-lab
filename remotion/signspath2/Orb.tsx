import { Canvas } from "../signspath/Canvas";
import { hash } from "../signspath/util";

const N = 700;
const PTS = Array.from({ length: N }, (_, i) => ({
  a: hash(i) * Math.PI * 2,
  b: Math.acos(2 * hash(i + 0.5) - 1),
  r: Math.pow(hash(i * 2.3), 0.6),
  sp: 0.4 + hash(i * 3.1) * 1.2,
  s: 0.8 + hash(i * 4.7) * 2,
  hue: 255 + hash(i * 5.3) * 40,
}));

/**
 * Orbe de particules (le "rituel"). `power` 0..1.5 = intensité, `flicker` = vacillement.
 */
export const Orb: React.FC<{ cx: number; cy: number; R: number; power: number; flicker?: number }> = ({ cx, cy, R, power, flicker = 0 }) => (
  <Canvas
    draw={(ctx, f) => {
      const t = f / 30;
      const fl = flicker > 0 ? 1 - flicker * (0.5 + 0.5 * Math.sin(t * 23) * Math.sin(t * 7.3)) : 1;
      const pw = power * fl;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.4);
      g.addColorStop(0, `rgba(210,180,255,${0.45 * pw})`);
      g.addColorStop(0.35, `rgba(140,90,255,${0.18 * pw})`);
      g.addColorStop(1, "rgba(80,40,200,0)");
      ctx.fillStyle = g;
      ctx.fillRect(cx - R * 2.4, cy - R * 2.4, R * 4.8, R * 4.8);
      ctx.globalCompositeOperation = "lighter";
      for (const p of PTS) {
        const a = p.a + t * p.sp * 0.5;
        const rr = R * p.r * (0.92 + 0.08 * Math.sin(t * 2 + p.a));
        const x = cx + Math.sin(p.b) * Math.cos(a) * rr;
        const y = cy + Math.cos(p.b) * rr * 0.95;
        const z = Math.sin(p.b) * Math.sin(a);
        const alpha = (0.25 + 0.55 * (z + 1) / 2) * Math.min(1, pw);
        ctx.fillStyle = `hsla(${p.hue},85%,${72 + z * 12}%,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, p.s * (0.7 + 0.3 * pw), 0, Math.PI * 2);
        ctx.fill();
      }
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.45);
      core.addColorStop(0, `rgba(255,250,255,${0.9 * Math.min(1, pw)})`);
      core.addColorStop(1, "rgba(200,160,255,0)");
      ctx.fillStyle = core;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    }}
  />
);
