// Voix "ritual" — alignement forcé (PocketSphinx). Même décalage que signspath (VO = 0.25)
// pour pouvoir réutiliser <Words> et la finale.
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(21.5 * FPS);

export const W = {
  your: 0.0, ritual: 0.21, doesnt: 0.61, last: 0.91, because: 1.33, its: 1.62, important: 1.76, impEnd: 2.54,
  it: 2.81, lasts: 2.97, because2: 3.57, its2: 3.86, tied: 4.03, to: 4.37, a: 4.51, specific: 4.54, moment: 5.27, momEnd: 5.87,
  not: 6.24, ill: 6.85, do: 7.0, it2: 7.15, sometime: 7.27, today: 7.78, todayEnd: 8.21,
  more: 8.59, like: 8.75, right: 9.4, after: 9.61, i: 9.88, close: 9.97, my: 10.24, laptop: 10.36, lapEnd: 10.91,
  three: 11.27, minutes: 11.59, every: 11.92, day: 12.35, beat: 12.73, one: 13.02, hour: 13.38, a2: 13.73, week: 13.78, weekEnd: 14.28,
  manifest: 14.55, with: 15.12, method: 15.27, not2: 16.09, by: 16.42, chance: 16.56,
  full: 17.49, guide: 17.75, at: 18.07, signs: 18.29, path: 18.67, dot: 18.99, com: 19.22, comEnd: 19.62,
} as const;

export const SC = {
  a: [-0.25, 2.72],
  b: [2.62, 6.08],
  c: [6.0, 8.42],
  d: [8.36, 11.12],
  e: [11.05, 14.42],
  finale: [14.36, 21.25],
} as const;
