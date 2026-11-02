// Pub Kinetik « Paste your website link » (voix Derek) — alignement PocketSphinx + silences, frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  paste: 0, website: 0.47, link: 0.91, linkEnd: 1.25,
  kinetik: 1.68, grabs: 2.02, logo: 2.46, colors: 3.04, and: 3.68, copy: 3.95, copyEnd: 4.45,
  your: 4.75, video: 4.85, ready: 5.26, readyEnd: 5.64,
  no: 6.07, brief: 6.25, no2: 6.66, hassle: 7.08, on: 7.69, kinetik2: 7.94, app: 8.47, dot: 8.97, com: 9.24, comEnd: 9.67,
  comment: 10.11, motion: 10.52, the: 11.51, five: 11.89, get: 12.23, discount: 12.46, dms: 13.24, end: 13.9,
});
export const CUT = { b: w(1.5), c: w(4.6), d: w(5.95), e: w(7.6), f: w(10.0) };
export const DURATION_FRAMES = 468; // 15,6 s
