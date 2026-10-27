// Monde stylisé en points (projection équirectangulaire 2:1, coordonnées 0..1).
const LAND: [number, number, number, number][] = [
  [0.2, 0.3, 0.12, 0.13], [0.25, 0.44, 0.05, 0.07], [0.31, 0.64, 0.06, 0.15], [0.36, 0.12, 0.04, 0.04],
  [0.515, 0.27, 0.055, 0.06], [0.53, 0.55, 0.08, 0.16], [0.7, 0.29, 0.17, 0.12], [0.67, 0.44, 0.03, 0.06],
  [0.78, 0.47, 0.04, 0.05], [0.85, 0.7, 0.06, 0.05], [0.885, 0.33, 0.012, 0.045], [0.6, 0.38, 0.04, 0.05],
];
const h = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export const DOTS: [number, number][] = (() => {
  const out: [number, number][] = [];
  const NX = 120;
  const NY = 60;
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const x = (i + 0.5) / NX;
      const y = (j + 0.5) / NY;
      const inside = LAND.some(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1 - (h(i, j) - 0.5) * 0.5);
      if (inside) out.push([x, y]);
    }
  }
  return out;
})();
export const CITIES = {
  paris: { x: 0.505, y: 0.27, code: "CDG", name: "Paris" },
  kyoto: { x: 0.882, y: 0.335, code: "KIX", name: "Kyoto" },
};
