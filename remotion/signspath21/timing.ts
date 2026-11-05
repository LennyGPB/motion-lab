// Voix "scripting" (Zara) — alignement forcé (PocketSphinx) + silences. VO = 0.25.
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(28.6 * FPS);

export const W = {
  scripting: 0.0, is: 0.64, most: 0.88, underrated: 1.39, manifestation: 2.12, technique: 2.89, techEnd: 3.47,
  with: 3.9, signs: 4.12, app: 4.52, you: 4.84, practice: 5.17, every: 5.83, day: 6.18, in: 6.55, seconds: 6.77, secEnd: 7.4,
  write: 8.04, as: 8.36, already: 8.84, happened: 9.25, hapEnd: 9.88, present: 10.18, tense: 10.56, tenseEnd: 11.04, first: 11.24, person: 11.53, personEnd: 11.93,
  today: 12.53, i: 13.05, feel: 13.29, calm: 13.55, because: 14.18, finally: 14.74, finEnd: 15.4,
  signs2: 16.12, gives: 16.53, personalized: 16.91, prompt: 17.66, so: 18.1, never: 18.42, start: 18.85, blank: 19.33, page: 19.59, pageEnd: 20.09,
  your: 20.5, brain: 20.62, starts: 20.93, looking: 21.22, proof: 21.64, true: 22.42, trueEnd: 22.83,
  signs3: 23.22, app2: 23.63, available: 24.14, ios: 24.87, android: 25.62, end: 26.19,
} as const;

export const SC = {
  a: [-0.25, 3.7],
  b: [3.65, 7.8],
  c: [7.75, 12.2],
  d: [12.15, 15.95],
  e: [15.9, 20.3],
  f: [20.25, 23.0],
  cta: [22.95, 28.5],
} as const;
