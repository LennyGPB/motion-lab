// Voix "ordinary Tuesday" — alignement forcé (PocketSphinx). Même décalage que signspath (VO = 0.25).
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(25.4 * FPS);

export const W = {
  imagine: 0.0, an: 0.62, ordinary: 0.8, tuesday: 1.44, in: 2.13, the: 2.25, life: 2.33, youre: 2.69, aiming: 2.81, for: 3.18, forEnd: 3.55,
  you: 4.0, wake: 4.2, up: 4.44, upEnd: 4.87,
  light: 5.12, fills: 5.49, the2: 6.04, room: 6.15, roomEnd: 6.55,
  you2: 6.85, know: 7.13, exactly: 7.28, what: 8.04, youre2: 8.22, doing: 8.33, with: 8.61, your: 8.76, day: 8.91, dayEnd: 9.26,
  no: 9.67, stress: 9.86, stressEnd: 10.5, no2: 10.64, doubt: 10.88, doubtEnd: 11.22,
  just: 11.7, your2: 11.98, life2: 12.08, lifeEnd: 12.6, the3: 12.79, way: 12.89, you3: 13.1, chose: 13.42, it: 13.76, itEnd: 13.92,
  write: 14.46, that: 14.77, day2: 14.99, day2End: 15.29, in2: 15.66, detail: 15.85, detailEnd: 16.44,
  in3: 16.77, the4: 16.86, present: 16.95, tense: 17.35, tenseEnd: 17.83,
  manifest: 18.3, with2: 18.89, method: 19.07, not: 19.84, by: 20.14, chance: 20.29,
  full: 21.26, guide: 21.5, at: 21.83, signs: 22.07, path: 22.43, dot: 22.74, com: 22.97, comEnd: 23.33,
} as const;

export const SC = {
  a: [-0.25, 3.92],
  b: [3.85, 6.72],
  c: [6.64, 9.42],
  d: [9.35, 11.45],
  e: [11.38, 14.3],
  f: [14.22, 18.02],
  finale: [17.95, 25.2],
} as const;
