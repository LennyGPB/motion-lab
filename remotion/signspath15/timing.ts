// Voix "money belief" — alignement forcé (PocketSphinx) + silences. Même décalage que signspath (VO = 0.25).
export { T, VO } from "../signspath/timing";
export const FPS = 30;
export const DURATION_FRAMES = Math.round(36.9 * FPS);

export const W = {
  what: 0.0, sentence: 0.28, about: 0.76, money: 1.0, keeps: 1.48, coming: 1.8, back: 2.09, head: 2.55, headEnd: 2.94,
  money2: 3.58, grow: 4.11, trees: 4.43, treesEnd: 5.17, im: 5.46, meant: 5.87, rich: 6.48, richEnd: 6.96, people: 7.46, like: 7.69, dont: 8.24, make: 8.59, makeEnd: 9.02,
  you: 9.62, heard: 9.93, home: 10.37, as: 11.03, kid: 11.23, kidEnd: 11.66,
  heres: 12.2, nobody: 12.67, tells: 13.26, tellsEnd: 13.85, many: 14.24, financial: 14.61, blocks: 15.09, dont2: 15.58, come: 15.93, lack: 16.43, strategy: 16.77, strategyEnd: 17.4,
  they: 17.9, come2: 18.04, inherited: 18.62, belief: 19.2, youve: 19.62, never: 19.88, questioned: 20.33, qEnd: 20.98,
  and: 21.38, until: 21.53, see: 21.91, keep: 22.79, repeating: 23.07, every: 24.15, day: 24.53, dayEnd: 24.86,
  so: 25.34, take: 25.67, moment: 26.09, write: 26.86, comments: 27.37, commentsEnd: 28.0, then: 28.27, transform: 29.06, it: 29.65, itEnd: 29.76,
  manifest: 30.21, with: 30.8, method: 30.95, not: 31.71, by: 32.0, chance: 32.14,
  full: 33.01, guide: 33.26, at: 33.59, signs: 33.8, path: 34.14, dot: 34.42, com: 34.64, comEnd: 35.02,
} as const;

export const SC = {
  a: [-0.25, 3.25],
  b: [3.2, 9.3],
  c: [9.25, 11.9],
  d: [11.85, 17.6],
  e: [17.55, 21.1],
  f: [21.05, 25.1],
  g: [25.05, 30.0],
  finale: [29.95, 36.7],
} as const;
