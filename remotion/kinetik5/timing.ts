// Calage sur la voix (alignement PocketSphinx + silences), en frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;

export const S = {
  what: 0, can: 0.22, kinetik: 0.41, do: 0.84,
  with: 1.66, kinetik2: 1.79, you: 2.49, get: 2.64, your: 2.84, own: 3.12, video: 3.44, studio: 3.81,
  love: 4.73, community: 4.97, creation: 5.42, adapt: 6.33, brand: 7.17, in: 7.51, three: 7.71, seconds: 8.06, done: 8.99,
  over: 9.73, n150: 9.94, motion: 10.99, templates: 11.38, ready: 11.98, you2: 12.55,
  fully: 12.99, customizable: 13.31, with2: 14.1, super: 14.39, editor: 15.22,
  selling: 16.01, physical: 16.31, products: 16.69, weve: 17.48, ready2: 17.78, motions: 18.22, that: 18.72,
  want: 19.32, brand2: 19.6, name: 19.96, animated: 20.19, kinetik3: 21.03, handles: 21.48, it: 21.91,
  need: 22.35, instagram: 22.54, posts: 23.1, the: 23.8, templates2: 23.85, ready3: 24.37, no: 24.96, more: 25.2, headaches: 25.47,
  same: 26.23, app: 26.73, store: 26.98, play: 27.43, store2: 27.66, screenshots: 27.92,
  new: 28.97, templates3: 29.16, drop: 29.64, every: 30.1, day: 30.45,
  and: 30.94, community2: 31.1, keeps: 31.66, growing: 32.03, thanks: 32.73, you3: 33.07,
  follow: 33.72, so: 34.18, miss: 34.8, thing: 35.05, end: 35.36,
} as const;

type K = keyof typeof S;
export const T = Object.fromEntries(Object.entries(S).map(([k, v]) => [k, w(v)])) as Record<K, number>;

export const CUT = {
  b: w(1.55),
  c: w(4.5),
  d: w(9.5),
  e: w(15.8),
  f: w(19.1),
  g: w(22.2),
  h: w(26.05),
  i: w(28.8),
  j: w(33.5),
};

export const DURATION_FRAMES = 1104; // 36,8 s
