// Voix "future self" (Zara) — alignement forcé (PocketSphinx) + silences. VO = 0.25.
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(22.5 * FPS);

export const W = {
  you: 0.0, dont: 0.18, attract: 0.39, what: 0.87, want: 1.14, wantEnd: 1.7,
  you2: 2.01, attract2: 2.19, who: 2.77, are: 3.21, areEnd: 3.65,
  thats: 4.16, future: 4.75, self: 5.18, matters: 5.53, more: 5.91, vision: 6.56, board: 6.9, boardEnd: 7.29,
  who2: 7.73, six: 8.53, months: 8.8, monthsEnd: 9.31, how: 9.53, think: 9.89, thinkEnd: 10.45, how2: 10.67, act: 11.01, actEnd: 11.5,
  signs: 11.96, helps: 12.41, define: 12.78, person: 13.42, and: 13.95, become: 14.25, them: 14.64, one: 15.24, ritual: 15.51, time: 16.25, timeEnd: 16.7,
  signs2: 17.12, available: 17.9, ios: 18.65, android: 19.39, end: 19.97,
} as const;

export const SC = {
  a: [-0.25, 3.95],
  b: [3.9, 7.5],
  c: [7.45, 11.75],
  d: [11.7, 16.9],
  cta: [16.85, 22.4],
} as const;
