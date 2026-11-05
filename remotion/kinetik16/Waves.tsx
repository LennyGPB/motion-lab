import React from "react";
import { AbsoluteFill } from "remotion";
import { Canvas } from "../signspath/Canvas";
import { hash } from "../viewz/util";

/* Fond « relief de lignes » : des centaines de lignes blanches déformées par un champ de hauteur 3D,
   teintées de bleu dans les creux, avec des tirets bleus qui défilent le long des lignes. */
export const BL = "#3b3bff";
export const BL2 = "#8a8aff";

const ROWS = 118;
const STEP = 12;
const DASH = Array.from({ length: ROWS }, (_, i) => [8 + hash(i * 3.1) * 50, 14 + hash(i * 5.3) * 90, 4 + hash(i * 7.9) * 30, 30 + hash(i * 1.7) * 120]);

/** h(x, y, t) : collines qui roulent + deux grosses bosses qui dérivent. */
const height = (x: number, y: number, t: number, amp: number) => {
  const b1x = 760 + 180 * Math.sin(t * 0.21), b1y = 1180 + 220 * Math.sin(t * 0.17 + 1);
  const b2x = 260 + 150 * Math.sin(t * 0.19 + 2), b2y = 520 + 180 * Math.sin(t * 0.23);
  const g1 = Math.exp(-((x - b1x) ** 2 + (y - b1y) ** 2) / (330 * 330));
  const g2 = Math.exp(-((x - b2x) ** 2 + (y - b2y) ** 2) / (280 * 280));
  return amp * (70 * Math.sin(x * 0.0045 + y * 0.0032 + t * 0.7) + 50 * Math.sin(x * 0.009 - y * 0.0041 + t * 0.45 + 1.3) + 26 * Math.sin(x * 0.017 + y * 0.006 - t * 0.9) - 230 * g1 - 190 * g2);
};

export const LineWaves: React.FC<{ t: number; amp?: number; flow?: number; warp?: number }> = ({ t, amp = 1, flow = 0, warp = 0 }) => (
  <Canvas
    draw={(ctx, _fr, W, H) => {
      ctx.fillStyle = "#03020a";
      ctx.fillRect(0, 0, W, H);
      const tilt = -0.32; // lignes légèrement en diagonale
      for (let r = 0; r < ROWS; r++) {
        const base = -380 + r * 22;
        const pts: [number, number, number][] = [];
        for (let x = -60; x <= W + 60; x += STEP) {
          const y0 = base + (x - 540) * tilt;
          const h = height(x, y0, t, amp);
          // « warp » : pincement vers le centre pendant les transitions
          const yy = y0 + h + warp * (y0 - 960) * 0.25 * Math.sin(x * 0.006 + t);
          const slope = height(x + 6, y0, t, amp) - h;
          pts.push([x, yy, slope]);
        }
        // trait blanc
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.strokeStyle = "rgba(240,240,255,0.92)";
        ctx.lineWidth = 4.2;
        ctx.setLineDash([]);
        ctx.stroke();
        // tirets bleus qui défilent
        ctx.strokeStyle = BL;
        ctx.lineWidth = 6;
        ctx.setLineDash(DASH[r]);
        ctx.lineDashOffset = -(t * 60 + flow) * (0.6 + hash(r * 2.3));
        ctx.stroke();
      }
      ctx.setLineDash([]);
      // teinte bleue dans les zones « à l'ombre » (source-atop = seulement sur les lignes)
      ctx.globalCompositeOperation = "source-atop";
      const blobs = [
        [300 + 120 * Math.sin(t * 0.3), 560 + 90 * Math.sin(t * 0.25), 520, 0.75],
        [820 + 100 * Math.sin(t * 0.27 + 2), 1300 + 140 * Math.sin(t * 0.2), 460, 0.55],
        [180, 1600 + 80 * Math.sin(t * 0.33), 420, 0.6],
        [900, 300, 380, 0.5],
      ];
      for (const [x, y, rad, a] of blobs) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(40,40,230,${a})`);
        g.addColorStop(1, "rgba(40,40,230,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
      // reflets lavande
      const g2 = ctx.createRadialGradient(560, 900, 0, 560, 900, 700);
      g2.addColorStop(0, "rgba(170,170,255,0.35)");
      g2.addColorStop(1, "rgba(170,170,255,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
    }}
  />
);

/** Fond complet : lignes + voile sombre pour la lisibilité du texte.
 *  `kick` = avance supplémentaire du temps (accélère sur les coupes), `warp` = pincement 0..1. */
export const WavesBg: React.FC<{ f: number; kick: number; warp: number; dim?: number }> = ({ f, kick, warp, dim = 0.55 }) => (
  <AbsoluteFill>
    <LineWaves t={f / 30 + kick} amp={1 + 0.25 * warp} flow={kick * 90} warp={warp} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(3,2,10,${dim}), rgba(3,2,10,${dim * 0.45}) 70%, rgba(3,2,10,${dim * 0.2}))` }} />
  </AbsoluteFill>
);
