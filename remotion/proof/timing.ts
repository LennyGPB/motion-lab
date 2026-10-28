import { CONFIG } from "./config";

// 120 BPM (15 frames / beat). Must match scripts/generate_sfx_proof.py (START = 1.5 s, END = 14 s).
export const FPS = 30;
export const BEAT = 15;
export const STATS_START = 3 * BEAT;
export const STAT_LEN = 3 * BEAT;
export const REV_START = STATS_START + CONFIG.stats.length * STAT_LEN; // 180
export const REV_LEN = 4 * BEAT;
export const WALL = REV_START + CONFIG.reviews.length * REV_LEN; // 360
export const END = WALL + 4 * BEAT; // 420
export const DURATION_FRAMES = END + 8 * BEAT; // 540

export const beatPulse = (f: number) => {
  if (f < STATS_START) return 0;
  if (f >= END) return Math.exp(-(f - END) / 10);
  return Math.exp(-((f - STATS_START) % BEAT) / 4);
};
