import { CONFIG } from "./config";

// 120 BPM : un temps = 15 frames. Doit matcher scripts/generate_sfx_launch.py.
export const FPS = 30;
export const BEAT = 15;
export const DROP = 4 * BEAT; // logo (après 3-2-1 + 1 temps de suspension)
export const FEAT_START = 8 * BEAT;
export const FEAT_LEN = 3 * BEAT;
export const TRIO = FEAT_START + CONFIG.features.length * FEAT_LEN;
export const BANNER = TRIO + 3 * BEAT;
export const END = BANNER + 5 * BEAT;
export const DURATION_FRAMES = END + 7 * BEAT;

/** Pulsation sur le beat (après le drop, jusqu'à la fin). */
export const beatPulse = (f: number) => {
  if (f < DROP) return 0;
  if (f >= END) return Math.exp(-(f - END) / 10);
  return Math.exp(-((f - DROP) % BEAT) / 4);
};
