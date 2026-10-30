// Deux pubs Kinetik (voix Derek) — alignement PocketSphinx + silences, frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

/* ---- pub 1 : « Need motion design…? » ---- */
export const P1 = toFrames({
  need: 0, motion: 0.28, design: 0.64, showcase: 1.15, project: 1.73, or: 2.27, brand: 2.34,
  and: 3.25, want: 3.42, fast: 3.7,
  without: 4.53, spending: 4.82, hours: 5.25, prompting: 5.72, ai: 6.14,
  head: 7.21, kinetik: 7.51, app: 8.05, dot: 8.51, com: 9.29,
  pick: 10.01, hundreds: 10.33, templates: 10.96, official: 11.65, or2: 12.28, made: 12.6, community: 13.07,
  paste: 14.17, website: 14.49, link: 14.91, or3: 15.22, brand2: 15.56, info: 15.88, infoEnd: 16.38,
  and2: 16.72, kinetik2: 16.85, handles: 17.34, rest: 17.92, end: 18.4,
});
export const P1CUT = { b: w(3.1), c: w(4.42), d: w(6.9), e: w(9.7), f: w(13.95), g: w(16.55) };
export const P1_FRAMES = 606; // 20,2 s

/* ---- pub 2 : « Going back and forth… » ---- */
export const P2 = toFrames({
  going: 0, back: 0.33, forth: 0.77, with: 1.07, claude: 1.21, fifty: 1.64, times: 2.16, get: 2.7, motion: 2.99,
  and: 3.89, burning: 4.03, through: 4.5, all: 4.7, credits: 5.19,
  the: 6.42, fix: 6.49,
  kinetik: 7.45, app: 7.93, dot: 8.44, com: 8.74,
  generate: 9.67, motion2: 10.17, from: 10.58, hundreds: 10.78, ready: 11.55, templates: 12.04,
  tweak: 13.03, however: 13.4, want: 13.95, with2: 14.28, super: 14.57, simple: 15.04, editor: 15.43,
  everything: 16.37, built: 16.84, save: 17.23, time: 17.62, and2: 18.4, money: 18.63, end: 19.05,
});
export const P2CUT = { b: w(3.72), c: w(6.15), d: w(7.2), e: w(9.45), f: w(12.82), g: w(16.12) };
export const P2_FRAMES = 624; // 20,8 s
