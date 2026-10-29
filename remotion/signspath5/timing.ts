// Voix "5 minutes, eyes closed" — alignement forcé (PocketSphinx). Même décalage que signspath (VO = 0.25).
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(24 * FPS);

export const W = {
  five: 0.0, minutes: 0.41, minEnd: 0.99,
  eyes: 1.33, closed: 1.58, closedEnd: 2.13,
  thats: 2.48, all: 2.69, allEnd: 2.92,
  pick: 3.5, a: 3.72, single: 3.76, scene: 4.31, sceneEnd: 4.78,
  a2: 5.16, precise: 5.21, one: 5.84, oneEnd: 6.14, already: 6.33, real: 6.88, realEnd: 7.26,
  what: 7.97, do: 8.09, you: 8.2, see: 8.29, around: 8.53, you2: 8.85, seeEnd: 9.14,
  what2: 9.68, sounds: 9.81, do2: 10.25, you3: 10.34, hear: 10.46, hearEnd: 10.84,
  what3: 11.55, do3: 11.64, you4: 11.75, feel: 11.87, in: 12.29, your: 12.42, body: 12.56, bodyEnd: 13.01,
  stay: 13.77, there: 14.08, a3: 14.28, few: 14.31, seconds: 14.52, before: 15.01, opening: 15.32, your2: 15.72, eyes2: 15.85, eyesEnd: 16.34,
  manifest: 16.76, with: 17.39, method: 17.55, not: 18.37, by: 18.71, chance: 18.85,
  full: 19.72, guide: 20.06, at: 20.39, signs: 20.6, path: 20.97, dot: 21.31, com: 21.54, comEnd: 21.93,
} as const;

export const SC = {
  a: [-0.25, 3.32],
  b: [3.25, 7.5],
  c: [7.42, 13.4],
  d: [13.32, 16.48],
  finale: [16.42, 23.8],
} as const;
