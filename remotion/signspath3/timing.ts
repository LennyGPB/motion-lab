// Voix "21 days" — alignement forcé (PocketSphinx). Même décalage que signspath (VO = 0.25).
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(24.4 * FPS);

export const W = {
  do: 0.0, this: 0.25, for: 0.5, twenty: 0.64, one: 1.03, days: 1.26, daysEnd: 1.82,
  no: 1.99, more: 2.2, moreEnd: 2.73, no2: 2.9, less: 3.1, lessEnd: 3.59,
  not: 3.8, when: 4.28, i: 4.61, have: 4.67, time: 4.89, timeEnd: 5.39,
  not2: 5.67, until: 6.13, it: 6.46, works: 6.53, worksEnd: 7.47,
  a: 7.64, clear: 7.69, duration: 8.08, is: 8.63, a2: 8.83, goal: 8.87, you: 9.23, can: 9.38, reach: 9.63, reachEnd: 10.09,
  a3: 10.43, vague: 10.56, one2: 10.9, is2: 11.4, a4: 11.54, quiet: 11.59, way: 12.11, to: 12.29, quit: 12.36, quitEnd: 12.87,
  pick: 13.45, your: 13.66, intention: 13.79, intEnd: 14.46, mark: 14.72, your2: 15.05, calendar: 15.14, calEnd: 15.78,
  and: 15.95, start: 16.11, today: 16.54, todayEnd: 17.09,
  manifest: 17.61, with: 18.15, method: 18.29, not3: 19.08, by: 19.33, chance: 19.49,
  full: 20.41, guide: 20.67, at: 21.0, signs: 21.24, path: 21.57, dot: 21.87, com: 22.08, comEnd: 22.43,
} as const;

export const SC = {
  a: [-0.25, 3.68],
  b: [3.6, 7.52],
  c: [7.45, 10.32],
  d: [10.25, 13.12],
  e: [13.05, 17.32],
  finale: [17.26, 24.2],
} as const;
