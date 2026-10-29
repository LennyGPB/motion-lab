// Calage sur la voix (alignement PocketSphinx + silences), en frames à 30 fps.
export const FPS = 30;
export const VO = 3; // la voix démarre à la frame 3
export const w = (s: number) => Math.round(s * FPS) + VO;

export const S = {
  how: 0, do: 0.22, create: 0.42, a: 0.71, motion: 0.76, graphic: 1.21,
  in: 1.65, literally: 1.81, two: 2.39, seconds: 2.79, with: 3.38, kinetik: 3.51, kEnd: 3.97,
  head: 4.31, website: 4.61, and: 5.16, click: 5.32, create2: 5.79, video: 6.36, videoEnd: 6.81,
  then: 7.14, select: 7.43, create3: 8.01, motion2: 8.5, design: 8.86, designEnd: 9.25,
  choose: 9.6, template: 9.93, from: 10.33, over: 10.52, two2: 10.72, fifty: 11.39, options: 11.9, optEnd: 12.44,
  fill: 12.74, brand: 13.14, details: 13.43, detEnd: 13.97,
  choose2: 14.25, colors: 14.59, and2: 15.09, music: 15.26, musicEnd: 15.75,
  kinetik2: 16.0, syncs: 16.39, everything: 16.93, for: 17.41, youEnd: 17.84,
  done: 18.14, doneEnd: 18.61, your: 18.87, video2: 19.01, is: 19.43, ready: 19.53, readyEnd: 19.88,
  want: 20.23, customize: 20.43, it: 20.99, with2: 21.06, super: 21.31, simple: 21.72, editor: 22.09, editorEnd: 22.37,
  follow: 22.68, for2: 22.93, part: 23.07, two3: 23.32, ill: 23.89, show: 24.0, how2: 24.34, end: 24.66,
} as const;

type K = keyof typeof S;
export const T = Object.fromEntries(Object.entries(S).map(([k, v]) => [k, w(v)])) as Record<K, number>;

// coupures (transitions glitch)
export const CUT = {
  h2: w(1.6),
  h3: w(3.33),
  s1: w(4.15),
  s2: w(7.0),
  s3: w(9.45),
  s4: w(12.6),
  s5: w(14.12),
  s6: w(15.88),
  s7: w(18.0),
  s8: w(20.08),
  s9: w(22.55),
};

export const DURATION_FRAMES = 786; // 26,2 s
