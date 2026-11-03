// Pub Kinetik « You're a dev, not a video editor » (voix Derek) — alignement PocketSphinx + silences, 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  youre: 0, dev: 0.3, not: 1.05, video: 1.32, editor: 1.78, edEnd: 2.26,
  and: 2.63, fine: 3.0, fineEnd: 3.49,
  with: 3.87, kinetik: 3.99, paste: 4.75, saas: 5.12, link: 5.48, pick: 6.0, template: 6.21, and2: 6.86, product: 7.07, video2: 7.49, ready: 8.15, readyEnd: 8.62,
  zero: 9.02, motion: 9.45, skills: 9.83, zero2: 10.53, after: 11.15, effects: 11.55, effEnd: 12.06,
  comment: 12.48, motion2: 12.85, the: 13.78, five: 14.15, get: 14.44, discount: 14.64, dms: 15.5, end: 16.17,
});
export const CUT = { b: w(2.4), c: w(3.72), d: w(8.8), e: w(12.25) };
export const DURATION_FRAMES = 537; // 17,9 s
