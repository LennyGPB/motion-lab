import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import { hash } from "../viewz/util";

/* Fond « nuages néon » : ciel étoilé + couches de nuages violets bombés, bord lumineux lavande/cyan,
   parallaxe entre les couches et flou de profondeur au premier plan. Rendu basse résolution agrandi. */
const GW = 270;
const GH = 480;
const K = 1080 / GW;
const LAYERS = 6;
const STARS = Array.from({ length: 160 }, (_, i) => ({ x: hash(i * 1.7) * 1080, y: hash(i * 3.3) * 1100, r: 0.8 + hash(i * 5.1) * 2.2, ph: hash(i * 7.7) * 6.28, c: hash(i * 9.1) }));

/** Bord haut de la couche k au point x (en px écran) : bosses « chou-fleur » (|sin| inversés). */
const edge = (k: number, x: number, t: number) => {
  const depth = k / (LAYERS - 1); // 0 = loin, 1 = près
  const base = 980 + depth * 860 + 50 * Math.sin(t * 0.15 + k);
  const sp = (0.25 + depth * 1.6) * 40; // parallaxe
  const X = x + t * sp + k * 400;
  const sc = 1 / (0.6 + depth * 1.4);
  let y = base;
  const puff = (v: number) => Math.sqrt(Math.abs(Math.sin(v)));
  y -= (230 - depth * 60) * puff(X * 0.0018 * sc + k);
  y -= 95 * puff(X * 0.0043 * sc + 2 * k + t * 0.05);
  y -= 38 * puff(X * 0.0095 * sc + 3 * k - t * 0.08);
  y -= 12 * puff(X * 0.02 * sc + k * 5);
  return y;
};

const EDGES = new Float32Array(LAYERS * GW);

export const CloudsBg: React.FC<{ t: number; rise?: number }> = ({ t, rise = 0 }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const sky = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    // ciel + étoiles en pleine résolution
    const s = sky.current?.getContext("2d");
    if (s) {
      const g = s.createLinearGradient(0, 0, 0, 1920);
      g.addColorStop(0, "#02010a");
      g.addColorStop(0.45, "#0a0420");
      g.addColorStop(0.75, "#1a0a40");
      s.fillStyle = g;
      s.fillRect(0, 0, 1080, 1920);
      for (const st of STARS) {
        const a = 0.35 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2 + st.ph));
        s.fillStyle = st.c > 0.7 ? `rgba(150,240,255,${a})` : `rgba(230,220,255,${a})`;
        s.beginPath();
        s.arc(st.x, st.y - rise * 0.3, st.r, 0, Math.PI * 2);
        s.fill();
      }
    }
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    for (let k = 0; k < LAYERS; k++) for (let i = 0; i < GW; i++) EDGES[k * GW + i] = edge(k, i * K, t) - rise * (0.4 + k * 0.15);
    const img = ctx.createImageData(GW, GH);
    const d = img.data;
    for (let j = 0; j < GH; j++) {
      const y = j * K;
      for (let i = 0; i < GW; i++) {
        const p = (j * GW + i) * 4;
        // couche la plus proche qui couvre ce pixel
        let k = LAYERS - 1;
        for (; k >= 0; k--) if (y > EDGES[k * GW + i]) break;
        if (k < 0) {
          // halo au-dessus du nuage le plus lointain
          const dy = EDGES[i] - y;
          const halo = Math.exp(-dy / 40);
          d[p] = 150 * halo;
          d[p + 1] = 110 * halo;
          d[p + 2] = 255 * halo;
          d[p + 3] = 255 * Math.min(1, halo * 1.2);
          continue;
        }
        const e = EDGES[k * GW + i];
        const depth = k / (LAYERS - 1);
        const into = y - e;
        // bord lumineux (lavande → cyan sur les couches lointaines)
        const rim = Math.exp(-into / (8 + depth * 14)) * (1 - 0.5 * depth);
        // texture « grumeleuse » interne
        const X = i * K + t * (10 + depth * 64);
        const bump = 0.5 + 0.25 * Math.sin(X * 0.03 + y * 0.022) * Math.sin(X * 0.017 - y * 0.035 + k) + 0.08 * Math.sin(X * 0.061 + y * 0.05 + k * 2);
        // ombre portée par la couche de devant
        let occ = 1;
        if (k < LAYERS - 1) {
          const ef = EDGES[(k + 1) * GW + i];
          occ = 1 - 0.55 * Math.exp(-Math.max(0, ef - y) / 60);
        }
        const fall = Math.exp(-into / 900);
        const body = (0.45 + 0.55 * bump) * fall * occ;
        let r = 30 + 62 * body + 14 * depth;
        let g = 10 + 22 * body;
        let b = 110 + 125 * body;
        const cy = depth < 0.5 ? 1 : 0.4; // cyan sur les crêtes lointaines
        r += rim * (180 - 120 * cy);
        g += rim * (150 + 60 * cy);
        b += rim * 120;
        d[p] = Math.min(255, r);
        d[p + 1] = Math.min(255, g);
        d[p + 2] = Math.min(255, b);
        d[p + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
  return (
    <AbsoluteFill>
      <canvas ref={sky} width={1080} height={1920} style={{ position: "absolute", inset: 0 }} />
      <canvas ref={ref} width={GW} height={GH} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, filter: "blur(2.5px) saturate(1.2)" }} />
      {/* flou de profondeur au premier plan */}
      <AbsoluteFill style={{ backdropFilter: "blur(10px)", WebkitMaskImage: "linear-gradient(180deg, transparent 72%, #000 92%)", maskImage: "linear-gradient(180deg, transparent 72%, #000 92%)" }} />
    </AbsoluteFill>
  );
};
