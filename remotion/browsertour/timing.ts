import { CONFIG } from "./config";

// Doit matcher scripts/generate_sfx_browsertour.py (END = 16 s, DUR = 20 s).
export const FPS = 30;
export const PAGE_START = 40;
export const PAGE_LEN = 120;
export const OVERVIEW = PAGE_START + CONFIG.pages.length * PAGE_LEN; // 400
export const END = OVERVIEW + 80; // 480
export const DURATION_FRAMES = END + 120;
