// Pub Stride : tout est calé sur la grille rythmique (128 BPM).
export const FPS = 30;
export const BPM = 128;
export const BEAT_F = (60 / BPM) * FPS; // 14.0625 frames
/** Frame du temps n. */
export const B = (n: number) => Math.round(n * BEAT_F);
export const DURATION_FRAMES = Math.round((36 * 60) / BPM * FPS + 0.6 * FPS); // doit matcher generate_sfx_stride.py

// Scènes en temps (beats)
export const SC = {
  intro: [0, 4],
  gps: [4, 8],
  rings: [8, 12],
  phone1: [12, 16],
  stats: [16, 22],
  record: [22, 26],
  phone2: [26, 30],
  outro: [30, 40],
} as const;

/** 0..1, pic sur chaque temps (kick) jusqu'à l'outro. */
export const beatPulse = (f: number) => {
  const b = f / BEAT_F;
  if (b >= 30 && b < 30.02) return 1;
  if (b >= 30) return Math.exp(-(f - B(30)) / 8);
  const since = (b - Math.floor(b)) * BEAT_F;
  return Math.exp(-since / 4);
};
