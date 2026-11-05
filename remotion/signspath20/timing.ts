// Voix "5 min matin / 5 min soir" (Zara) — alignement forcé (PocketSphinx) + silences. VO = 0.25.
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(23.5 * FPS);

export const W = {
  five: 0.0, minutes: 0.34, morning: 0.8, mEnd: 1.38, five2: 1.56, minutes2: 1.91, night: 2.31, nEnd: 2.75, thats: 2.95, it: 3.2, itEnd: 3.4,
  morning2: 3.88, set: 4.8, energy: 5.21, energyEnd: 5.87, repeat: 5.97, affirmation: 6.48, affEnd: 7.32, choose: 7.47, one: 7.84, aligned: 8.26, action: 8.71, actionEnd: 9.28,
  night2: 9.73, write: 10.65, sign: 11.12, noticed: 11.59, proof: 12.4, moving: 12.89, forward: 13.17, fEnd: 13.8, how: 13.98, felt: 14.25, feltEnd: 14.72,
  do: 15.17, every: 15.56, day: 15.89, and: 16.29, watch: 16.5, changes: 17.08, chEnd: 17.76,
  signs2: 18.07, available: 18.87, ios: 19.6, android: 20.37, end: 20.92,
} as const;

export const SC = {
  a: [-0.25, 3.65],
  b: [3.6, 9.5],
  c: [9.45, 14.95],
  d: [14.9, 17.9],
  cta: [17.85, 23.4],
} as const;
