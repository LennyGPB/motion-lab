import { useLayoutEffect, useMemo, useRef } from "react";
import { useCurrentFrame } from "remotion";

const LW = 90;
const LH = 160;

// Palette "caméra thermique" violette : noir → violet profond → violet électrique → magenta → rose → blanc
const STOPS: [number, [number, number, number]][] = [
  [0.0, [3, 0, 6]],
  [0.18, [20, 2, 40]],
  [0.36, [52, 8, 112]],
  [0.52, [105, 25, 200]],
  [0.66, [170, 55, 255]],
  [0.78, [225, 70, 240]],
  [0.89, [255, 140, 225]],
  [1.0, [255, 245, 255]],
];
const LUT = (() => {
  const lut = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const v = i / 255;
    let k = 0;
    while (k < STOPS.length - 2 && v > STOPS[k + 1][0]) k++;
    const [a, ca] = STOPS[k];
    const [b, cb] = STOPS[k + 1];
    const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
    for (let c = 0; c < 3; c++) lut[i * 3 + c] = ca[c] + (cb[c] - ca[c]) * t;
  }
  return lut;
})();

const h3 = (x: number, y: number, z: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
const smooth = (t: number) => t * t * (3 - 2 * t);
const noise3 = (x: number, y: number, z: number) => {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => h3(xi + dx, yi + dy, zi + dz);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf),
    l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf,
  );
};

export type Heat = { x: number; y: number; r: number; a: number; ry?: number }; // en px vidéo (ry : étirement vertical)

type Props = {
  /** Intensité globale 0..1.5 */
  intensity: number;
  /** Sources de chaleur additionnelles (téléphone, logo...) */
  heats: Heat[];
  /** Amplitude de vibration (px) */
  vibrate: number;
};

/** Fond "caméra thermique" violet qui vibre. */
export const Thermal: React.FC<Props> = ({ intensity, heats, vibrate }) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const low = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = LW;
    c.height = LH;
    return c;
  }, []);

  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv || !low) return;
    const lctx = low.getContext("2d")!;
    const img = lctx.createImageData(LW, LH);
    const t = frame / 30;
    const sx = 1080 / LW;
    // sources ambiantes : silhouettes de chaleur qui dérivent
    // silhouettes de chaleur verticales (comme des corps qui dansent)
    const amb: Heat[] = [0, 1, 2, 3, 4, 5].map((i) => ({
      x: 540 + 470 * Math.sin(t * (0.21 + i * 0.06) + i * 1.7),
      y: 1000 + 700 * Math.sin(t * (0.15 + i * 0.04) + i * 2.3) + 40 * Math.sin(t * 7 + i),
      r: 120 + 40 * Math.sin(t * 0.8 + i),
      ry: 2.3,
      a: 0.34,
    }));
    const all = [...amb, ...heats];
    for (let y = 0; y < LH; y++) {
      for (let x = 0; x < LW; x++) {
        const px = x * sx;
        const py = y * sx;
        let v = 0.06;
        v += 0.4 * noise3(x * 0.06, y * 0.06 - t * 0.35, t * 0.4);
        v += 0.16 * noise3(x * 0.16 + 10, y * 0.16 + t * 0.6, t * 0.9);
        for (const hs of all) {
          const dx = px - hs.x;
          const dy = (py - hs.y) / (hs.ry ?? 1);
          v += hs.a * Math.exp(-(dx * dx + dy * dy) / (hs.r * hs.r));
        }
        v *= intensity;
        // contraste + paliers (rendu "caméra thermique")
        v = Math.pow(Math.max(0, v), 1.25) * 1.15;
        const q = Math.floor(v * 14) / 14;
        v = q * 0.65 + v * 0.35;
        // isothermes : fines lignes de contour
        const band = (v * 14) % 1;
        if (band < 0.08) v += 0.04;
        const i = Math.max(0, Math.min(255, Math.round(v * 255)));
        const o = (y * LW + x) * 4;
        img.data[o] = LUT[i * 3];
        img.data[o + 1] = LUT[i * 3 + 1];
        img.data[o + 2] = LUT[i * 3 + 2];
        img.data[o + 3] = 255;
      }
    }
    lctx.putImageData(img, 0, 0);
    const ctx = cv.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    // dessin par bandes horizontales décalées → la chaleur "vibre"
    const strips = 48;
    const sh = 1920 / strips;
    for (let s = 0; s < strips; s++) {
      const off = vibrate * (Math.sin(s * 0.9 + frame * 1.7) * 0.6 + (h3(s, frame, 3) - 0.5) * 0.8);
      ctx.drawImage(low, 0, (s * LH) / strips, LW, LH / strips, off - 8, s * sh, 1080 + 16, sh + 1);
    }
  });

  return <canvas ref={ref} width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(4px)", transform: "scale(1.01)" }} />;
};
