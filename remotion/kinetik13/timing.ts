// Pub Kinetik « Your launch is tomorrow » (voix Derek) — alignement PocketSphinx + silences, 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  your: 0, app: 0.22, ready: 0.7, readyEnd: 1.2, your2: 1.5, launch: 1.61, tomorrow: 2.28, tomEnd: 3.05,
  and: 3.41, still: 3.73, dont: 4.23, video: 4.68, videoEnd: 5.2,
  on: 5.76, kinetik: 5.9, app2: 6.35, dot: 6.85, com: 7.11,
  add: 7.72, logo: 8.04, and2: 8.46, screens: 8.57, scrEnd: 9.18,
  your3: 9.47, videos: 9.57, ready2: 10.04, seconds: 10.55, secEnd: 11.33,
  you: 11.74, built: 11.89, app3: 12.26, well: 12.79, handle: 13.04, promo: 13.42, promoEnd: 13.94,
  comment: 14.35, motion: 14.7, the: 15.57, five: 15.99, get: 16.29, discount: 16.5, dms: 17.3, end: 17.94,
});
export const CUT = { b: w(3.2), c: w(5.6), d: w(7.6), e: w(9.32), f: w(11.55), g: w(14.15) };
export const DURATION_FRAMES = 591; // 19,7 s
