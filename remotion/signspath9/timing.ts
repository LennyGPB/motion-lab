// Voix "morning affirmations" recomposée avec 3 s de silence après chaque phrase
// (public/signspath/morning/voice.wav). Temps en secondes dans cette voix ; même décalage VO que signspath.
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(40.4 * FPS);

export const W = {
  say: 0.0, this: 0.31, out: 0.5, loud: 0.69, before: 1.06, you: 1.51, start0: 1.65, your0: 1.93, day0: 2.06, introEnd: 2.42,
  // 1
  today: 5.59, i1: 6.36, choose: 6.55, what1: 7.15, repeat: 7.4, end1: 7.99,
  // 2
  i2: 11.16, am: 11.25, capable: 11.46, of: 12.14, doing: 12.24, what2: 12.62, promised: 12.85, myself: 13.39, end2: 13.98,
  // 3
  every: 17.15, small: 17.5, step: 17.84, counts: 18.1, and3: 18.68, im: 18.9, taking: 19.02, one: 19.42, now: 19.63, end3: 20.06,
  // 4
  my: 23.23, intention: 23.37, is: 23.96, clear: 24.16, and4: 24.86, i4: 24.99, act: 25.15, in: 25.52, direction: 25.85, end4: 26.49,
  // 5
  i5: 29.66, start5: 29.75, this5: 30.11, day5: 30.33, with: 30.62, calm: 30.8, and5: 31.4, confidence: 31.62, end5: 32.48,
  // fin
  full: 35.65, guide: 35.91, at: 36.24, signs: 36.57, path: 36.86, dot: 37.17, com: 37.4, comEnd: 37.8,
} as const;

/** Affirmations : début de la phrase, fin de la phrase (la pause de 3 s suit). */
export const AFF = [
  { start: W.today, end: W.end1 },
  { start: W.i2, end: W.end2 },
  { start: W.every, end: W.end3 },
  { start: W.my, end: W.end4 },
  { start: W.i5, end: W.end5 },
] as const;
