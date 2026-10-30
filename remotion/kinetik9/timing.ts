// Pub Kinetik « comment MOTION » (voix Derek) — alignement PocketSphinx + silences, frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  the: 0, first: 0.14, five: 0.49, people: 0.72, comment: 1.11, motion: 1.6, get: 2.41, discount: 2.66, on: 3.23, kinetik: 3.4, kEnd: 3.96,
  create: 4.42, motion2: 4.84, in: 5.25, two: 5.46, seconds: 5.77, from: 6.43, hundreds: 6.68, templates: 7.36, and: 7.81, effects: 7.91, effEnd: 8.44,
  edit: 8.9, videos: 9.25, however: 9.7, with: 10.65, super: 10.92, simple: 11.4, editor: 11.8, edEnd: 12.27,
  no: 12.7, more: 12.85, struggling: 13.04, get2: 13.74, motions: 14.02, motEnd: 14.67,
  ill: 15.06, dm: 15.2, first2: 15.64, five2: 16.03, with2: 16.37, discount2: 16.64, end: 17.18,
});
export const CUT = { b: w(4.2), c: w(8.6), d: w(12.45), e: w(14.85) };
export const DURATION_FRAMES = 567; // 18,9 s
