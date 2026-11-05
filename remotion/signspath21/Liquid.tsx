import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";

/* Fond « métal liquide violet » : champ de hauteur déformé (domain warping) rendu en basse
   résolution puis agrandi, avec ombrage diffus, reflets spéculaires et fines lignes brillantes. */
const GW = 216;
const GH = 384;
const S = 1080 / GW; // facteur d'agrandissement

const height = (x: number, y: number, t: number) => {
  const x1 = x + 0.9 * Math.sin(1.3 * y + t * 0.42) + 0.45 * Math.sin(2.1 * y - 1.7 * x + t * 0.31);
  const y1 = y + 0.9 * Math.sin(1.1 * x1 - t * 0.36) + 0.45 * Math.sin(1.9 * x1 + 0.8 * y + t * 0.27);
  const x2 = x1 + 0.35 * Math.sin(2.7 * y1 + t * 0.5);
  return Math.sin(x2 * 1.2 + y1 * 0.7) * Math.cos(y1 * 1.1 - x2 * 0.4) + 0.5 * Math.sin(2.3 * x2 - 1.6 * y1 + t * 0.2) + 0.25 * Math.sin(3.7 * y1 + 1.3 * x2 - t * 0.4);
};

const HBUF = new Float32Array((GW + 1) * (GH + 1));

export const LiquidBg: React.FC<{ t: number; zoom?: number; light?: number }> = ({ t, zoom = 1, light = 0 }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const sc = 0.0105 / zoom; // échelle monde par pixel de grille
    for (let j = 0; j <= GH; j++) {
      for (let i = 0; i <= GW; i++) {
        HBUF[j * (GW + 1) + i] = height((i - GW / 2) * sc * S * 0.5 + 0.3, (j - GH / 2) * sc * S * 0.5 - 0.2, t);
      }
    }
    const img = ctx.createImageData(GW, GH);
    const d = img.data;
    // lumière en haut à gauche qui tourne lentement
    const la = -2.2 + 0.4 * Math.sin(t * 0.2) + light;
    let Lx = Math.cos(la) * 0.6, Ly = Math.sin(la) * 0.6, Lz = 0.75;
    const ln = Math.hypot(Lx, Ly, Lz);
    Lx /= ln; Ly /= ln; Lz /= ln;
    let Hx = Lx, Hy = Ly, Hz = Lz + 1;
    const hn = Math.hypot(Hx, Hy, Hz);
    Hx /= hn; Hy /= hn; Hz /= hn;
    for (let j = 0; j < GH; j++) {
      for (let i = 0; i < GW; i++) {
        const k = j * (GW + 1) + i;
        const h = HBUF[k];
        const dx = (HBUF[k + 1] - h) * 9;
        const dy = (HBUF[k + GW + 1] - h) * 9;
        let nx = -dx, ny = -dy, nz = 1;
        const nn = Math.hypot(nx, ny, nz);
        nx /= nn; ny /= nn; nz /= nn;
        const diff = Math.max(0, nx * Lx + ny * Ly + nz * Lz);
        const spec = Math.pow(Math.max(0, nx * Hx + ny * Hy + nz * Hz), 38);
        const rim = Math.pow(1 - nz, 1.6);
        const band = Math.pow(Math.abs(Math.sin(h * 7.5 + t * 0.25)), 40);
        const dd = Math.pow(diff, 2.2);
        // sombre (#0b0320) → violet (#5b21b6) → lilas (#a78bfa)
        let r = 11 + dd * 80 + rim * 90;
        let g = 3 + dd * 30 + rim * 40;
        let b = 32 + dd * 150 + rim * 150;
        r += spec * 235 + band * 120 * diff;
        g += spec * 215 + band * 90 * diff;
        b += spec * 255 + band * 160 * diff;
        const p = (j * GW + i) * 4;
        d[p] = r > 255 ? 255 : r;
        d[p + 1] = g > 255 ? 255 : g;
        d[p + 2] = b > 255 ? 255 : b;
        d[p + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
  return (
    <AbsoluteFill>
      <canvas ref={ref} width={GW} height={GH} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, imageRendering: "auto", filter: "blur(2px) saturate(1.15)" }} />
    </AbsoluteFill>
  );
};
