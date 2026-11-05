// Voix "promo app Signs" (Zara) — alignement forcé (PocketSphinx) + silences. VO = 0.25.
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(30 * FPS);

export const W = {
  your: 0.0, manifestation: 0.21, isnt: 1.19, working: 1.68, workEnd: 2.29,
  and: 2.72, its: 3.28, not0: 3.49, universe: 3.92, fault: 4.58, faultEnd: 5.02,
  wishing: 5.72, wishEnd: 6.34, youre2: 6.66, not1: 6.78, manifesting: 7.22, mEnd: 8.07,
  real: 8.47, manif2: 8.7, has: 9.49, three: 9.8, steps: 10.14, stepsEnd: 10.65,
  clear: 11.03, intention: 11.34, intEnd: 12.03, new: 12.27, belief: 12.51, and2: 13.04, one: 13.31, aligned: 13.73, action: 14.1, every: 14.6, day: 15.02, dayEnd: 15.26,
  most: 15.75, people: 16.0, skip: 16.3, last: 16.69, oneEnd: 17.29,
  signs: 17.69, builds: 18.21, all: 18.55, three2: 18.83, forYou: 19.13, youEnd: 19.75, under: 19.99, five: 20.19, minutes: 20.61, aDay: 20.92, dEnd: 21.29,
  manifest: 21.66, with: 22.21, method: 22.35, not: 23.08, by: 23.35, chance: 23.49, chanceEnd: 24.02,
  signs2: 24.36, signsEnd: 24.97, available: 25.12, ios: 25.86, android: 26.61, end: 27.16,
} as const;

export const SC = {
  a: [-0.25, 5.3],
  b: [5.25, 8.3],
  c: [8.25, 17.45],
  e: [17.4, 21.5],
  finale: [21.45, 29.9],
} as const;
