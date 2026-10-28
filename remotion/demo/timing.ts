import { CONFIG } from "./config";

// Doit matcher scripts/generate_sfx_demo.py (END = 12 s, DUR = 16 s).
export const FPS = 30;
export const INTRO = 45;
export const STEP_LEN = 105;
export const OUTRO = INTRO + CONFIG.steps.length * STEP_LEN; // 360
export const END = OUTRO; // carte de fin
export const DURATION_FRAMES = END + 120;
export const stepStart = (i: number) => INTRO + i * STEP_LEN;
