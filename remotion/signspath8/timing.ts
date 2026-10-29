// Voix "repeat after me" recomposée avec 3 s de silence après chaque phrase
// (public/signspath/repeat/voice.wav). Temps en secondes dans cette voix ; même décalage VO que signspath.
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(35.8 * FPS);

export const W = {
  repeat0: 0.0, after: 0.44, me: 0.81, meEnd: 1.04,
  // 1
  i1: 4.21, am: 4.33, capable: 4.52, of: 5.19, keeping: 5.33, my1: 5.77, commitments: 5.92, end1: 6.74,
  // 2
  i2: 9.91, choose: 10.1, what: 10.71, repeat: 10.97, end2: 11.56,
  // 3
  every: 14.73, day: 15.03, i3: 15.68, move: 15.82, forward: 16.03, a: 16.62, little: 16.66, more: 17.04, end3: 17.48,
  // 4
  my4: 20.65, life4: 20.87, is: 21.3, built: 21.57, with: 21.97, method: 22.16, end4: 22.73,
  // 5
  i5: 25.9, deserve: 26.08, the: 26.71, life5: 26.82, im: 27.14, building: 27.28, end5: 27.76,
  // fin
  full: 30.93, guide: 31.19, at: 31.53, signs: 31.81, path: 32.17, dot: 32.52, com: 32.76, comEnd: 33.18,
} as const;

/** Affirmations : début de la phrase, fin de la phrase (la pause de 3 s suit). */
export const AFF = [
  { start: W.i1, end: W.end1 },
  { start: W.i2, end: W.end2 },
  { start: W.every, end: W.end3 },
  { start: W.my4, end: W.end4 },
  { start: W.i5, end: W.end5 },
] as const;
