// Pub « Kinetik Resto » (voix Derek) — alignement PocketSphinx + silences, frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  own: 0, restaurant: 0.27, restEnd: 0.84,
  want: 1.22, ready: 1.47, post: 1.82, videos: 2.13, socials: 2.78, without: 3.45, giving: 4.11, evenings: 4.65, evEnd: 5.27,
  with: 5.7, kinetik: 5.81, app: 6.29, dot: 6.79, com: 7.06, comEnd: 7.55,
  every: 7.74, monday: 8.04, weekly: 8.74, pack: 9.17, waiting: 9.72, waitEnd: 10.24,
  menu: 10.64, signature: 11.37, dish: 12.01, happy: 12.66, hour: 13.14, hourEnd: 13.44,
  approve: 13.87, one: 14.3, click: 14.59, clickEnd: 14.99, post2: 15.31, postEnd: 15.75, thats: 16.08, thatsEnd: 16.54,
  got: 17.06, daily: 17.26, special: 17.58, show: 18.06, offEnd: 18.59,
  snap: 18.9, photo: 19.25, video2: 19.82, ready2: 20.5, minute: 21.05, minEnd: 21.46,
  menu2: 21.97, comes: 22.79, life: 23.12, tv: 23.67, screen: 24.09, dining: 24.68, room: 25.04, roomEnd: 25.35,
  kinetik2: 25.79, resto: 26.23, restoEnd: 26.83,
  socials2: 27.16, running: 27.94, you: 28.58, cooking: 29.07, cookEnd: 29.57,
  comment: 29.94, motion: 30.28, the: 31.18, five: 31.6, get: 31.99, discount: 32.19, dms: 32.98, end: 33.62,
});
export const CUT = { b: w(1.1), c: w(5.6), d: w(7.62), e: w(13.62), f: w(16.85), g: w(21.7), h: w(25.6), i: w(29.8) };
export const DURATION_FRAMES = 1062; // 35,4 s
