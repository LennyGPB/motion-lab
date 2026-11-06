// Pub « I've never edited a video » avec la mascotte (voix Derek) — alignement PocketSphinx + silences, 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  ive: 0, never: 0.26, edited: 0.8, video: 1.25, life: 2.03, lifeEnd: 2.61,
  yet: 2.96, made: 3.42, this: 3.72, one: 3.95, seconds: 4.36, with: 5.05, kinetik: 5.17, kEnd: 5.7,
  if: 6.09, can: 6.35, do: 6.52, so: 7.04, can2: 7.35, you: 7.53, youEnd: 7.86,
  head: 8.28, kinetik2: 8.55, app: 9.15, dot: 9.34, com: 9.75, comEnd: 9.95,
  comment: 9.97, motion: 10.82, the: 11.97, five: 12.38, get: 12.72, discount: 12.93, dms: 13.68, end: 14.37,
});
export const CUT = { b: w(2.78), c: w(5.9), d: w(8.08), e: w(9.97) };
export const DURATION_FRAMES = 492; // 16,4 s
