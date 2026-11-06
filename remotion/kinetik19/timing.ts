// Pub « One link » avec la mascotte (voix Derek) — alignement PocketSphinx + silences, frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  one: 0, link: 0.31, linkEnd: 0.69, thats: 1.01, all: 1.22, kinetik: 1.54, needs: 1.92, needsEnd: 2.45,
  paste: 2.8, website: 3.16, webEnd: 3.61, logo: 3.97, colors: 4.6, copy: 5.31, copyEnd: 5.87,
  your: 6.24, videos: 6.35, ready: 6.76, seconds: 7.2, secEnd: 7.97,
  tweak: 8.36, tweakEnd: 8.81, export: 9.01, post: 9.84, postEnd: 10.27,
  head: 10.73, kinetik2: 10.99, app: 11.57, dot: 12.17, com: 12.43, comEnd: 12.87,
  comment: 13.2, motion: 13.57, the: 14.46, five: 14.88, get: 15.18, discount: 15.39, dms: 16.21, end: 16.91,
});
export const CUT = { b: w(2.62), c: w(6.06), d: w(8.18), e: w(10.5), f: w(13.03) };
export const DURATION_FRAMES = 570; // 19 s
