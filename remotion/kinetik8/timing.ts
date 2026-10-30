// Pub Kinetik « agency » (voix Derek) — alignement PocketSphinx + silences, frames à 30 fps.
export const FPS = 30;
export const VO = 3;
export const w = (s: number) => Math.round(s * FPS) + VO;
const toFrames = <K extends string>(o: Record<K, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, w(v as number)])) as Record<K, number>;

export const T = toFrames({
  an: 0, agency: 0.16, wants: 0.67, two: 1.03, thousand: 1.34, dollars: 1.76, and: 2.22, three: 2.38, weeks: 2.79, for: 3.25, launch: 3.5, video: 3.88, videoEnd: 4.29,
  with: 4.78, kinetik: 4.91, you: 5.45, generate: 5.82, it: 6.28, in: 6.42, seconds: 6.59, and2: 7.37, tweak: 7.53, much: 8.17, want: 8.68, wantEnd: 8.98,
  pick: 9.47, from: 9.63, over: 9.83, hundred: 10.14, custom: 10.68, made: 11.13, templates: 11.37, tplEnd: 11.97,
  same: 12.31, pro: 12.61, look: 12.85, lookEnd: 13.2, no: 13.49, invoice: 13.85, end: 14.48,
});
export const CUT = { b: w(4.45), c: w(7.25), d: w(9.25), e: w(12.15) };
export const DURATION_FRAMES = 492; // 16,4 s
