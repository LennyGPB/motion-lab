// Voix "how long" — alignement forcé (PocketSphinx) + silences. Même décalage que signspath (VO = 0.25).
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(27.8 * FPS);

export const W = {
  how: 0.0, long: 0.23, have: 0.46, manifesting: 0.83, manEnd: 1.66,
  few: 1.97, days: 2.23, daysEnd: 2.89, few2: 3.04, months: 3.28, monthsEnd: 3.9, years: 4.19, yearsEnd: 4.78,
  heres: 5.35, what: 5.66, nobody: 5.89, tells: 6.46, you: 6.79, youEnd: 7.07,
  its: 7.44, not: 7.65, the: 7.97, duration: 8.07, that: 8.69, matters: 8.82, mattersEnd: 9.4,
  its2: 9.56, clarity: 10.05, of: 10.67, intention: 10.89, and: 11.53, consistency: 11.77, of2: 12.7, practice: 12.92, practiceEnd: 13.6,
  three: 14.19, minutes: 14.39, every: 14.72, day: 15.11, beat: 15.46, one: 15.73, hour: 16.09, a: 16.44, week: 16.48, weekEnd: 16.87,
  tell: 17.39, me: 17.54, comments: 17.81, how2: 18.24, long2: 18.41, youve: 18.69, practicing: 19.05, and2: 19.73, what2: 19.91, changed: 20.05, changedEnd: 20.62,
  manifest: 21.08, with: 21.7, method: 21.82, not2: 22.62, by: 22.89, chance: 23.03,
  full: 23.86, guide: 24.11, at: 24.46, signs: 24.69, path: 25.03, dot: 25.33, com: 25.55, comEnd: 25.94,
} as const;

export const SC = {
  a: [-0.25, 4.95],
  b: [4.9, 9.48],
  c: [9.43, 13.75],
  d: [13.7, 17.0],
  e: [16.95, 20.75],
  finale: [20.7, 27.6],
} as const;
