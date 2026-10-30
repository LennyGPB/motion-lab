// Voix "intention" — alignement forcé (PocketSphinx) + silences. Même décalage que signspath (VO = 0.25).
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(28.6 * FPS);

export const W = {
  whats: 0.0, your: 0.35, biggest: 0.48, intention: 0.96, right: 1.51, now: 1.67, nowEnd: 1.99,
  careful: 2.55, carefulEnd: 3.25,
  i: 3.66, want: 3.78, more: 4.03, money: 4.2, isnt: 4.84, an: 5.21, intention2: 5.32, int2End: 5.97,
  its: 6.24, a: 6.39, wish: 6.44, wishEnd: 6.96,
  a2: 7.49, real: 7.53, intention3: 7.89, has: 8.46, number: 8.73, a3: 9.2, deadline: 9.55, and: 10.21, path0: 10.46, pathEnd: 11.03,
  i2: 11.56, earn: 11.76, five: 11.96, euros: 12.57, more2: 12.94, per: 13.18, month: 13.36, within: 13.75, three: 14.04, months: 14.32, through: 14.77, skill: 15.04, developing: 15.51, devEnd: 16.08,
  thats: 16.52, difference: 16.99, diffEnd: 17.6,
  so: 18.0, write: 18.23, your2: 18.45, intention4: 18.56, comments: 19.15, but: 19.77, precise: 20.36, version: 21.06, versionEnd: 21.52,
  manifest: 22.01, with: 22.58, method: 22.74, not: 23.55, by: 23.78, chance: 23.92,
  full: 24.88, guide: 25.11, at: 25.44, signs: 25.67, path: 26.0, dot: 26.24, com: 26.44, comEnd: 26.78,
} as const;

export const SC = {
  a: [-0.25, 2.4],
  b: [2.35, 7.25],
  c: [7.2, 11.38],
  d: [11.33, 16.35],
  e: [16.3, 17.85],
  f: [17.8, 21.8],
  finale: [21.75, 28.4],
} as const;
