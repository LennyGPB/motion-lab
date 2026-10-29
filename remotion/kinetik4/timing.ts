// Calage sur la voix (alignement PocketSphinx + silences), en frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;

export const S = {
  your: 0, ready: 0.61, in: 0.92, two: 1.08, seconds: 1.37,
  but: 2.37, you: 2.64, want: 2.76, tweak: 2.98, it: 3.26,
  easy: 3.86,
  kinetik: 4.61, has: 4.99, super: 5.24, simple: 5.75, editor: 6.16,
  just: 6.91, ask: 7.11, kinetik2: 7.46, chat: 7.84, and: 8.31, handles: 8.52, edits: 9.0, for: 9.22,
  or: 10.05, change: 10.31, everything: 10.7, yourself: 11.04,
  every: 11.91, every2: 12.81, every3: 13.89,
  want2: 15.05, different: 15.24, vibe: 15.55, switch: 16.17, templates: 16.5, in2: 16.96, one: 17.11, click: 17.48,
  add: 18.22, voiceover: 18.4, pick: 19.27, music: 19.52, and2: 20.16, translate: 20.27, text: 20.88, into: 21.27, multiple: 21.48, languages: 22.02, autoEnd: 23.36,
  choose: 23.81, transitions: 24.15, and3: 24.81, effects: 24.91, effEnd: 25.4,
  then: 25.64, export: 25.84, for2: 26.39, tiktok: 26.53, instagram: 27.26, or2: 27.94, youtube: 28.06,
  in3: 28.94, mp4: 29.05, in4: 30.14, hd: 30.24, ready2: 31.17, post: 31.54, postEnd: 32.02,
} as const;

type K = keyof typeof S;
export const T = Object.fromEntries(Object.entries(S).map(([k, v]) => [k, w(v)])) as Record<K, number>;

export const CUT = {
  b: w(3.6),
  c: w(4.45),
  d: w(6.75),
  e: w(9.85),
  f: w(14.85),
  g: w(18.05),
  h: w(23.6),
  i: w(25.52),
  j: w(28.75),
  k: w(32.15),
};

export const DURATION_FRAMES = 1011; // 33,7 s
