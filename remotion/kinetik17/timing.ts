// Pub « All in one place » (voix Derek) — alignement PocketSphinx + silences, frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  capcut: 0, editing: 0.67, edEnd: 1.3, canva: 1.51, posts: 2.07, postsEnd: 2.8, after: 2.91, effects: 3.28, motion0: 3.71, motEnd: 4.3,
  and: 4.75, stuck: 5.17, middle: 5.66, midEnd: 6.2,
  with: 6.57, kinetik: 6.71, all: 7.6, one: 8.06, place: 8.31, placeEnd: 8.88,
  pick: 9.09, adapt: 9.65, export: 10.35, done: 11.19, doneEnd: 11.7,
  head: 12.11, kinetik2: 12.41, app: 12.97, dot: 13.54, com: 13.81, comEnd: 14.25,
  comment: 14.56, motion: 15.0, the: 15.87, five: 16.29, get: 16.65, discount: 16.87, dms: 17.62, end: 18.29,
});
export const CUT = { b: w(4.5), c: w(6.4), d: w(8.98), e: w(11.95), f: w(14.4) };
export const DURATION_FRAMES = 609; // 20,3 s
