// Calage sur la voix (alignement PocketSphinx), en frames à 30 fps.
export const FPS = 30;
export const VO = 3; // la voix démarre à la frame 3
const w = (s: number) => Math.round(s * FPS) + VO;

export const T = {
  day: w(0.0),
  two: w(0.32),
  im: w(1.09),
  creating: w(1.26),
  a: w(1.64),
  motion: w(1.69),
  graphic: w(2.16),
  for: w(2.56),
  a2: w(2.73),
  fictional: w(2.77),
  website: w(3.29),
  with: w(3.78),
  kinetik: w(3.93),
  in: w(4.56),
  literally: w(4.7),
  five: w(5.47),
  seconds: w(5.85),
  end: w(6.37),
};

export const DURATION_FRAMES = 240; // 8 s
