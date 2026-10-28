import { CONFIG } from "./config";

// Doit matcher scripts/generate_sfx_probsol.py (SWITCH = 5 s, END = 15 s, DUR = 19 s).
export const FPS = 30;
export const SWITCH = 150; // bascule couleur
export const HERO = 165; // révélation téléphone
export const BEN_START = 300;
export const BEN_LEN = 50;
export const END = BEN_START + CONFIG.benefits.length * BEN_LEN; // 450
export const DURATION_FRAMES = END + 120;
