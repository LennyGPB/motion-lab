// Tracé GPS (coordonnées dans une boîte 1000x1000), lissé en Catmull-Rom.
const CTRL: [number, number][] = [
  [170, 860], [260, 760], [250, 620], [360, 540], [520, 590], [640, 520], [660, 380], [780, 300], [860, 380], [830, 520], [720, 640], [760, 760], [640, 850], [470, 820], [330, 880],
];

const sample = (): [number, number][] => {
  const pts: [number, number][] = [];
  const P = [CTRL[0], ...CTRL, CTRL[CTRL.length - 1]];
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    for (let s = 0; s < 24; s++) {
      const t = s / 24;
      const t2 = t * t;
      const t3 = t2 * t;
      const c = (a: number, b: number, cc: number, d: number) =>
        0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      pts.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  pts.push(CTRL[CTRL.length - 1]);
  return pts;
};

export const ROUTE = sample();
const CUM = (() => {
  const c = [0];
  for (let i = 1; i < ROUTE.length; i++) c.push(c[i - 1] + Math.hypot(ROUTE[i][0] - ROUTE[i - 1][0], ROUTE[i][1] - ROUTE[i - 1][1]));
  return c;
})();
export const ROUTE_LEN = CUM[CUM.length - 1];

/** Chemin SVG jusqu'à la fraction p (0..1), à l'échelle k. */
export const routePath = (p: number, k = 1, ox = 0, oy = 0) => {
  const target = p * ROUTE_LEN;
  let d = `M ${ROUTE[0][0] * k + ox} ${ROUTE[0][1] * k + oy}`;
  for (let i = 1; i < ROUTE.length; i++) {
    if (CUM[i] > target) {
      const r = (target - CUM[i - 1]) / (CUM[i] - CUM[i - 1]);
      const x = ROUTE[i - 1][0] + (ROUTE[i][0] - ROUTE[i - 1][0]) * r;
      const y = ROUTE[i - 1][1] + (ROUTE[i][1] - ROUTE[i - 1][1]) * r;
      d += ` L ${x * k + ox} ${y * k + oy}`;
      break;
    }
    d += ` L ${ROUTE[i][0] * k + ox} ${ROUTE[i][1] * k + oy}`;
  }
  return d;
};

/** Point à la fraction p. */
export const routePoint = (p: number): [number, number] => {
  const target = Math.max(0, Math.min(1, p)) * ROUTE_LEN;
  for (let i = 1; i < ROUTE.length; i++) {
    if (CUM[i] >= target) {
      const r = (target - CUM[i - 1]) / (CUM[i] - CUM[i - 1] || 1);
      return [ROUTE[i - 1][0] + (ROUTE[i][0] - ROUTE[i - 1][0]) * r, ROUTE[i - 1][1] + (ROUTE[i][1] - ROUTE[i - 1][1]) * r];
    }
  }
  return ROUTE[ROUTE.length - 1];
};

// Rues stylisées (déterministes)
export const STREETS: [number, number, number, number][] = (() => {
  const out: [number, number, number, number][] = [];
  const h = (n: number) => {
    const x = Math.sin(n * 91.7 + 13.3) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let i = 0; i < 14; i++) {
    const y = 40 + i * 70 + h(i) * 30;
    out.push([-50, y, 1050, y + (h(i + 50) - 0.5) * 160]);
  }
  for (let i = 0; i < 12; i++) {
    const x = 30 + i * 85 + h(i + 9) * 30;
    out.push([x, -50, x + (h(i + 70) - 0.5) * 200, 1050]);
  }
  return out;
})();
