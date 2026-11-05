// Pub « Full creative studio » (voix Derek) — alignement PocketSphinx + silences, frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  no: 0, time: 0.25, tEnd: 0.78, no2: 0.91, budget: 1.14, no3: 1.7, skills: 1.98, skEnd: 2.75,
  kinetik: 3.01, gives: 3.42, full: 3.92, creative: 4.33, studio: 4.74, stEnd: 5.39, ready: 5.52, seconds: 6.02, secEnd: 6.78,
  videos: 7.12, animated: 7.83, logos: 8.33, posts: 8.96, visuals: 9.61, visEnd: 10.33,
  everything: 10.71, adapts: 11.21, brand: 11.97, auto: 12.47, autoEnd: 13.35,
  head: 13.67, kinetik2: 13.95, app: 14.53, dot: 15.15, com: 15.43, comEnd: 15.89,
  comment: 16.16, motion: 16.58, the: 17.5, five: 17.88, get: 18.21, discount: 18.41, dms: 19.22, end: 19.88,
});
export const CUT = { b: w(2.88), c: w(6.95), d: w(10.5), e: w(13.5), f: w(16.0) };
export const DURATION_FRAMES = 657; // 21,9 s
