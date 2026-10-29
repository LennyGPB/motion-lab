// Voix "night affirmations" — alignement forcé (PocketSphinx) + silences. Même décalage que signspath (VO = 0.25).
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(29.5 * FPS);

export const W = {
  listen: 0.0, to: 0.37, this: 0.5, before: 0.85, you: 1.2, fall: 1.33, asleep: 1.54, asleepEnd: 2.18,
  i: 2.77, let: 2.89, go: 3.19, of: 3.43, this2: 3.6, day: 3.84, dayEnd: 4.3,
  i2: 4.78, did: 4.97, what: 5.16, could: 5.41, couldEnd: 5.82,
  my: 6.42, body: 6.54, rests: 6.93, restsEnd: 7.61, my2: 7.92, mind: 8.04, settles: 8.51, settlesEnd: 9.27,
  i3: 9.78, am: 9.93, becoming: 10.05, the: 10.61, person: 10.68, want: 11.33, be: 11.86, beEnd: 12.18,
  every: 12.76, day2: 13.07, i4: 13.65, keep: 13.74, promises: 14.18, to2: 14.77, myself: 14.88, a: 15.46, little: 15.59, more: 16.01, moreEnd: 16.43,
  what2: 16.94, repeat: 17.19, becomes: 17.86, my4: 18.48, reality: 18.64, realEnd: 19.31,
  i6: 19.82, fall2: 19.92, asleep2: 20.2, in: 20.6, peace: 20.75, peaceEnd: 21.36, and: 21.58, wake: 21.78, up: 22.1, ready: 22.32, move: 22.93, forward: 23.11, fwdEnd: 23.69,
  full: 24.21, guide: 24.5, at: 24.84, signs: 25.07, path: 25.44, dot: 25.8, com: 26.03, comEnd: 26.42,
} as const;

export const SC = {
  intro: [-0.25, 2.5],
  a1: [2.45, 6.2],
  a2: [6.15, 9.6],
  a3: [9.55, 12.6],
  a4: [12.55, 16.8],
  a5: [16.75, 19.7],
  a6: [19.65, 24.0],
  end: [23.95, 29.3],
} as const;
