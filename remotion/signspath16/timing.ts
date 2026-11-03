// Voix "exercise" — alignement forcé (PocketSphinx) + silences. Même décalage que signspath (VO = 0.25).
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(35.9 * FPS);

export const W = {
  do: 0.0, exercise: 0.35, me: 1.14, it: 1.6, takes: 1.79, one: 2.07, minute: 2.44, minEnd: 2.88,
  grab: 3.33, pen: 3.6, sheet: 4.2, paper: 4.54, paperEnd: 4.98,
  write: 5.51, down: 5.71, one2: 6.1, thing: 6.41, want: 6.77, right: 7.4, now: 7.72, nowEnd: 8.03,
  now2: 8.6, make: 9.19, precise: 9.52, add: 10.61, number: 10.79, or: 11.45, deadline: 11.67, dlEnd: 12.23,
  rewrite: 12.57, present: 13.55, tense: 14.03, as: 14.47, already: 15.13, true: 15.67, trueEnd: 16.02,
  there: 16.64, you: 17.21, just: 17.48, turned: 17.82, wish: 18.09, into: 18.53, intention: 19.01, intEnd: 19.66,
  read: 20.18, out: 20.46, loud: 20.63, three: 21.19, times: 21.57, timesEnd: 21.98,
  this: 22.53, exercise2: 22.75, beginning: 23.69, method0: 24.52, m0End: 24.99,
  the: 25.29, full0: 25.48, teaches: 26.14, eight: 27.19, areas: 27.61, life: 28.29, lifeEnd: 28.67,
  manifest: 29.11, with: 29.7, method: 29.85, not: 30.67, by: 30.95, chance: 31.1,
  full: 32.08, guide: 32.25, at: 32.6, signs: 32.83, path: 33.2, dot: 33.49, com: 33.72, comEnd: 34.05,
} as const;

export const SC = {
  a: [-0.25, 3.15],
  paper: [3.1, 22.35],
  d: [22.3, 28.85],
  finale: [28.8, 35.7],
} as const;

/** Les 5 étapes de l'exercice (pour l'indicateur et les sous-titres). */
export const STEPS = [
  { at: W.write, end: W.now2 },
  { at: W.now2, end: W.rewrite },
  { at: W.rewrite, end: W.there },
  { at: W.there, end: W.read },
  { at: W.read, end: W.this },
] as const;
