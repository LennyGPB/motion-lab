// Voix "manifestation ebook" — alignement forcé (PocketSphinx) + silences. Même décalage que signspath (VO = 0.25).
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(56.2 * FPS);

export const W = {
  want: 0.0, manifest: 0.36, but: 1.19, dont: 1.52, where: 1.85, start: 2.05, startEnd: 2.56,
  follow: 3.02, me: 3.27, and: 3.78, comment: 3.96, manifestation: 4.47, under: 5.45, video: 6.02, videoEnd: 6.6,
  ill: 6.94, send: 7.02, discount: 7.42, my: 8.0, ebookM: 8.12, ebook: 8.86, in: 9.36, private: 9.56, message: 10.0, msgEnd: 10.51,
  yes: 10.81, everyone: 11.65, comments: 12.32, commentsEnd: 12.96,
  this: 13.32, guide: 13.6, most: 14.23, people: 14.66, missing: 15.06, real: 15.97, method: 16.49, methodEnd: 17.0,
  you: 17.33, learn: 17.68, why: 17.88, intention: 18.04, and2: 18.66, repetition: 18.79, actually: 19.47, work: 20.2, workEnd: 20.65,
  you2: 20.92, discover: 21.16, three: 21.58, simple: 22.05, techniques: 22.46, the369: 23.42, scripting: 24.61, and3: 25.33, vision: 25.62, visionEnd: 26.24,
  you3: 26.47, eight: 27.13, areas: 27.56, life: 28.22,
  money: 28.99, love: 29.69, career: 30.33, confidence: 31.18, body: 32.2, creativity: 32.87, lifestyle: 33.91, spirituality: 34.88, spiritEnd: 35.77,
  and4: 36.03, move: 36.93, forward: 37.19, workbook: 37.78, write: 38.56, intentions: 39.2, one: 40.04, page: 40.39, time: 41.0, timeEnd: 41.4,
  no: 41.81, more: 42.05, hope: 42.28, without: 42.64, structure: 42.98, structEnd: 43.62, here: 43.97, practice: 44.67, day: 45.56, after: 45.96, day2: 46.38, dayEnd: 46.63,
  so: 47.1, follow2: 47.27, comment2: 48.18, manifestation2: 48.67, ill2: 49.88, discount2: 50.47, private2: 51.06, and5: 51.91, head: 52.31, over: 52.53,
  signs: 52.97, path: 53.38, dot: 53.71, com: 53.94, comEnd: 54.3,
} as const;

export const SC = {
  a: [-0.25, 2.85],
  b1: [2.8, 6.75],
  b2: [6.7, 10.65],
  b3: [10.6, 13.15],
  c: [13.1, 17.15],
  d: [17.1, 20.75],
  e: [20.7, 26.35],
  f: [26.3, 35.95],
  g: [35.9, 41.65],
  h: [41.6, 46.95],
  i: [46.9, 56.0],
} as const;

export const AREAS8 = [
  { key: "money", at: W.money },
  { key: "love", at: W.love },
  { key: "career", at: W.career },
  { key: "confidence", at: W.confidence },
  { key: "body", at: W.body },
  { key: "creativity", at: W.creativity },
  { key: "lifestyle", at: W.lifestyle },
  { key: "spirituality", at: W.spirituality },
] as const;
