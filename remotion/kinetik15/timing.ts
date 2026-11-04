// Pub « Kinetik Resto 2 » (voix Derek) — alignement PocketSphinx + silences, frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  lunch: 0, service: 0.33, dinner: 1.07, service2: 1.44, orders: 2.12, your: 2.95, team: 3.16, teamEnd: 3.75,
  and: 4.19, top: 4.41, supposed: 5.28, post: 5.72, instagram: 6.2, every: 6.85, day: 7.06, dayEnd: 7.34,
  we: 7.88, know: 8.06, dont: 8.59, have: 8.81, time: 9.07, timeEnd: 9.52,
  so: 9.92, kinetik: 10.26, app: 10.88, dot: 11.1, com: 11.57, does: 12.07, forYou: 12.51, youEnd: 13.01,
  send: 13.48, photos: 13.95, menu: 14.83, menuEnd: 15.21, just: 15.52, once: 15.72, onceEnd: 16.17,
  then: 16.56, everyW: 16.88, week: 17.26, videos: 17.91, show: 18.33, own: 19.22, ownEnd: 19.49,
  thisW: 19.95, menu2: 20.36, dish: 21.14, moment: 21.56, next: 22.41, event: 22.68, eventEnd: 23.19,
  customers: 23.47, reviews: 24.08, revEnd: 24.69,
  all: 25.15, approve: 26.1, approveEnd: 26.62,
  kinetik2: 27.26, resto: 27.68, restoEnd: 28.25,
  restaurant: 28.68, video: 29.62, videoEnd: 30.1, everyW2: 30.38, weekEnd: 31.0, effortlessly: 31.34, effEnd: 32.08,
  comment: 32.59, motion: 32.93, the: 33.71, five: 34.13, get: 34.48, discount: 34.69, dms: 35.47, end: 36.15,
});
export const CUT = { b: w(4.0), c: w(7.6), d: w(9.75), e: w(13.25), f: w(16.4), g: w(19.7), h: w(25.0), i: w(26.95), j: w(32.4) };
export const DURATION_FRAMES = 1149; // 38,3 s
