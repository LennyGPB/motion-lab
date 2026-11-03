// Voix "classic vs method" (confiance en soi) — alignement forcé (PocketSphinx) + silences. VO = 0.25.
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(28.7 * FPS);

export const W = {
  classic: 0.0, manifestation: 0.63, mEnd: 1.56,
  i: 2.06, want: 2.17, more: 2.45, self: 2.67, confidence: 2.98, confEnd: 3.79,
  manif2: 4.23, with: 5.1, method: 5.31, methEnd: 5.87,
  i2: 6.37, speak: 6.47, up: 6.83, meetings: 7.13, without: 7.78, fearing: 8.24, other: 8.67, peoples: 8.94, judgment: 9.34, judgEnd: 9.93,
  the: 10.44, first: 10.5, wish: 11.34, wishEnd: 11.89, the2: 12.27, second: 12.32, intention: 13.28, intEnd: 14.0,
  a: 14.43, specific: 14.47, situation: 15.05, sitEnd: 15.83, an: 16.26, action: 16.37, actionEnd: 16.98, a2: 17.41, result: 17.47, check: 18.34, checkEnd: 18.78,
  thats: 19.22, difference: 19.65, changes: 20.32, everything: 20.94, evEnd: 21.62,
  manifest: 22.08, with2: 22.65, method2: 22.8, not: 23.56, by: 23.83, chance: 23.98,
  full: 24.83, guide: 25.09, at: 25.42, signs: 25.63, path: 25.98, dot: 26.26, com: 26.49, comEnd: 26.85,
} as const;

export const SC = {
  compare: [-0.25, 14.2],
  d: [14.15, 19.05],
  e: [19.0, 21.75],
  finale: [21.7, 28.5],
} as const;
