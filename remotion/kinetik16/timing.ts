// Pub « Get it all in 3 seconds » (voix Derek) — alignement PocketSphinx + silences, frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  motion0: 0, design: 0.4, instagram: 1.19, tiktok: 1.88, posts: 2.32, video: 3.02, editing: 3.37, design2: 4.03, d2End: 4.59,
  get: 5.1, all: 5.4, three: 5.74, seconds: 6.08, with: 6.64, kinetik: 6.8, kEnd: 7.39,
  browse: 7.8, hundreds: 8.09, templates: 8.67, tEnd: 9.25, adapt: 9.36, brand: 10.1, snap: 10.66, snapEnd: 11.2,
  kinetik2: 11.51, handles: 11.98, rest: 12.48, restEnd: 12.91,
  head: 13.33, kinetik3: 13.6, app: 14.19, dot: 14.4, com: 14.85, comEnd: 15.05,
  comment: 15.08, motion: 15.98, the: 17.24, five: 17.67, get2: 18.05, discount: 18.26, dms: 19.08, end: 19.8,
});
export const CUT = { b: w(4.85), c: w(7.6), d: w(11.35), e: w(13.15), f: w(15.3) };
export const DURATION_FRAMES = 654; // 21,8 s
