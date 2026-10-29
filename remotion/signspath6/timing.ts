// Voix "In a year" — alignement forcé (PocketSphinx). Même décalage que signspath (VO = 0.25).
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(22.3 * FPS);

export const W = {
  in: 0.09, a: 0.22, year: 0.27, yearEnd: 0.79,
  youll: 0.98, be: 1.12, glad: 1.3, you: 1.68, started: 1.79, today: 2.17, todayEnd: 2.6,
  your: 3.0, future: 3.1, self: 3.5, is: 3.93, watching: 4.16, watchEnd: 4.77,
  theyre: 5.19, not: 5.28, asking: 5.45, you2: 5.89, to: 6.01, be2: 6.07, perfect: 6.2, perfEnd: 6.9,
  theyre2: 7.27, asking2: 7.35, you3: 7.81, to2: 8.07, start: 8.22, startEnd: 8.89,
  one: 9.18, intention: 9.44, intEnd: 10.17, one2: 10.33, technique: 10.64, techEnd: 11.22, one3: 11.47, specific: 11.84, day: 12.58, dayEnd: 12.95,
  and: 13.33, that: 13.43, day2: 13.68, day2End: 14.06, is2: 14.3, today2: 14.47, today2End: 14.94,
  manifest: 15.34, with: 15.94, method: 16.06, not2: 16.86, by: 17.15, chance: 17.28,
  full: 18.12, guide: 18.38, at: 18.71, signs: 18.92, path: 19.27, dot: 19.58, com: 19.8, comEnd: 20.19,
} as const;

export const SC = {
  a: [-0.25, 2.88],
  b: [2.8, 5.07],
  c: [5.0, 9.08],
  d: [9.0, 13.24],
  e: [13.16, 15.18],
  finale: [15.12, 22.1],
} as const;
