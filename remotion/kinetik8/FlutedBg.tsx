import { Canvas } from "../signspath/Canvas";

const LW = 180;
const LH = 320;
let low: HTMLCanvasElement | null = null;

/** Blobs de couleur qui dérivent lentement (fluide orange / violet sur noir). */
const BLOBS = [
  { c: "255,92,28", r: 0.38, x: 0.22, y: 0.12, ax: 0.22, ay: 0.12, sp: 0.011, ph: 0 },
  { c: "255,140,60", r: 0.3, x: 0.78, y: 0.42, ax: 0.2, ay: 0.18, sp: 0.009, ph: 2 },
  { c: "120,60,190", r: 0.42, x: 0.3, y: 0.62, ax: 0.25, ay: 0.15, sp: 0.007, ph: 4 },
  { c: "255,80,30", r: 0.34, x: 0.6, y: 0.88, ax: 0.2, ay: 0.1, sp: 0.012, ph: 1 },
  { c: "90,35,160", r: 0.36, x: 0.86, y: 0.16, ax: 0.15, ay: 0.12, sp: 0.01, ph: 3 },
  { c: "255,170,70", r: 0.22, x: 0.5, y: 0.34, ax: 0.3, ay: 0.2, sp: 0.014, ph: 5 },
  { c: "255,100,40", r: 0.26, x: 0.12, y: 0.78, ax: 0.12, ay: 0.14, sp: 0.013, ph: 6 },
  { c: "140,70,210", r: 0.28, x: 0.7, y: 0.66, ax: 0.18, ay: 0.12, sp: 0.008, ph: 7 },
];

/**
 * Fond « verre cannelé » : un fluide orange/violet dessiné en basse résolution,
 * puis redessiné en bandes verticales qui le réfractent (comme du verre strié).
 * `heat` (0..1) intensifie les couleurs, `speed` accélère le fluide.
 */
export const FlutedBg: React.FC<{ heat?: number; speed?: number; stripe?: number }> = ({ heat = 1, speed = 1, stripe = 16 }) => (
  <Canvas
    draw={(ctx, f, W, H) => {
      if (!low) {
        low = document.createElement("canvas");
        low.width = LW;
        low.height = LH;
      }
      const l = low.getContext("2d")!;
      const t = f * speed;
      l.globalCompositeOperation = "source-over";
      l.fillStyle = "#07030c";
      l.fillRect(0, 0, LW, LH);
      l.globalCompositeOperation = "screen";
      l.filter = "blur(5px)";
      // rubans de tissu : courbes épaisses qui ondulent
      for (const [i, b] of BLOBS.entries()) {
        l.beginPath();
        for (let k = 0; k <= 24; k++) {
          const y = (k / 24) * (LH + 60) - 30;
          const x = (b.x + b.ax * Math.sin(y * 0.02 + t * b.sp * 2 + b.ph) + 0.08 * Math.sin(y * 0.05 - t * b.sp * 3 + i)) * LW;
          if (k === 0) l.moveTo(x, y);
          else l.lineTo(x, y);
        }
        l.strokeStyle = `rgba(${b.c},${0.55 * heat})`;
        l.lineWidth = b.r * LW * (0.4 + 0.18 * Math.sin(t * 0.015 + b.ph));
        l.lineCap = "round";
        l.stroke();
      }
      // halos doux pour lier l'ensemble
      for (const b of BLOBS.slice(0, 4)) {
        const x = (b.x + b.ax * Math.sin(t * b.sp + b.ph)) * LW;
        const y = (b.y + b.ay * Math.cos(t * b.sp * 1.3 + b.ph)) * LH;
        const g = l.createRadialGradient(x, y, 0, x, y, b.r * LW);
        g.addColorStop(0, `rgba(${b.c},${0.18 * heat})`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        l.fillStyle = g;
        l.fillRect(0, 0, LW, LH);
      }
      l.filter = "none";
      // bandes de verre : chaque bande grossit une fine tranche du fluide, avec une ondulation
      ctx.imageSmoothingEnabled = true;
      const S = stripe;
      const RH = 96; // découpe verticale : la réfraction ondule le long de chaque cannelure
      for (let x = 0; x < W; x += S) {
        const u = (x + S / 2) / W;
        for (let y = 0; y < H; y += RH) {
          const v = y / H;
          const wob = Math.sin(u * 9 + v * 5 + t * 0.03) * 0.03 + Math.sin(u * 23 - v * 7 - t * 0.02) * 0.012;
          const sx = Math.max(0, Math.min(LW - 2, (u + wob) * LW));
          ctx.drawImage(low, sx - 0.9, (y / H) * LH, 1.8, (RH / H) * LH, x, y, S + 0.5, RH + 0.5);
        }
      }
      // relief des cannelures : bords sombres, crête claire
      const g = ctx.createLinearGradient(0, 0, S, 0);
      g.addColorStop(0, "rgba(0,0,0,0.7)");
      g.addColorStop(0.35, "rgba(255,255,255,0.06)");
      g.addColorStop(0.55, "rgba(255,235,210,0.14)");
      g.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = g;
      for (let x = 0; x < W; x += S) {
        ctx.save();
        ctx.translate(x, 0);
        ctx.fillRect(0, 0, S, H);
        ctx.restore();
      }
    }}
  />
);
