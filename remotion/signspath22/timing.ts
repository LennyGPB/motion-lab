// Voix "la phrase qui bloque" (Zara) — alignement forcé (PocketSphinx) + silences. VO = 0.25.
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(29.1 * FPS);

export const W = {
  one: 0.0, sentence: 0.36, head: 1.0, blocking: 1.69, manifestation: 2.46, manEnd: 3.4,
  the: 3.92, signs: 4.01, app: 4.41, helps: 4.64, find: 5.01, and: 5.75, rewrite: 5.92, rwEnd: 6.6,
  im: 7.15, enough: 7.73, enEnd: 8.3, money: 8.75, hard: 9.19, meEnd: 10.05, it: 10.63, never: 10.73, works: 11.26, me3End: 12.05,
  your: 12.5, brain: 12.63, repeats: 12.91, every: 13.64, day: 13.99, without: 14.52, noticing: 15.06, notEnd: 15.6,
  replace: 16.11, belief: 16.83, actually: 17.5, accept: 18.15, accEnd: 18.7, im2: 19.23, capable: 19.37, learning: 20.43, learnEnd: 20.9,
  then: 21.28, repeat: 21.82, morning: 22.75, mornEnd: 23.2,
  signs2: 23.62, available: 24.53, ios: 25.26, android: 26.05, end: 26.58,
} as const;

export const SC = {
  a: [-0.25, 3.75],
  b: [3.7, 6.95],
  c: [6.9, 12.3],
  d: [12.25, 15.9],
  e: [15.85, 21.0],
  f: [20.95, 23.45],
  cta: [23.4, 29.0],
} as const;
