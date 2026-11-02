// Pub Kinetik « Pick your setting » (voix Derek) — alignement PocketSphinx + silences, frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  pick: 0, setting: 0.4, settingEnd: 0.93, showcase: 1.15, brand: 1.84, brandEnd: 2.4,
  generate: 2.76, motion: 3.31, design: 3.66, automatically: 4.06, in: 5.17, few: 5.75, clicks: 5.98, clicksEnd: 6.46,
  head: 6.93, kinetik: 7.2, app: 7.79, dot: 8.36, com: 8.62, and: 9.03, create: 9.23, studio: 9.55, quality: 10.07, videos: 10.44, yourself: 10.88, effortlessly: 11.81, effEnd: 12.55,
  the: 13.06, first: 13.1, five: 13.41, comment: 13.74, motion2: 14.16, get: 14.9, discount: 15.16, dms: 15.99, end: 16.65,
});
export const CUT = { b: w(1.05), c: w(2.6), d: w(6.7), e: w(9.0), f: w(12.8) };
export const DURATION_FRAMES = 552; // 18,4 s
