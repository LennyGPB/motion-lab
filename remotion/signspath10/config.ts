// Mantras SignsPath : une même phrase répétée 5 fois, 3 s de silence après chaque répétition.
// Temps (s) dans la voix recomposée (alignement PocketSphinx par répétition).
import type { Kind } from "../signspath/Words";

export type Rep = { start: number; end: number; words: number[] };
export type LineSpec = { t: string; w: number; kind?: Kind; size?: number }[];
export type Mantra = {
  id: string;
  title: string;
  duration: number;
  lines: LineSpec[];
  reps: Rep[];
  final: { full: number; at: number; signs: number; path: number; dot: number; comEnd: number };
  visual: "hypno" | "growth";
};

export const MONEY: Mantra = {
  id: "money",
  title: "money mantra",
  duration: 39.2,
  visual: "hypno",
  lines: [
    [{ t: "I manage", w: 0, kind: "bold" }, { t: "my money", w: 2, kind: "serif" }],
    [{ t: "with", w: 4, kind: "muted", size: 110 }, { t: "clarity,", w: 5, kind: "serif" }],
    [{ t: "and it", w: 6, kind: "muted", size: 110 }, { t: "flows", w: 8, kind: "serif" }],
    [{ t: "to me", w: 9, kind: "muted", size: 110 }, { t: "easily.", w: 11, kind: "serif" }],
  ],
  reps: [
    { start: 0.0, end: 3.76, words: [0.0, 0.14, 0.56, 0.68, 1.0, 1.16, 2.02, 2.2, 2.28, 2.8, 2.9, 3.3] },
    { start: 6.88, end: 10.62, words: [6.88, 7.03, 7.45, 7.56, 7.89, 8.03, 8.96, 9.06, 9.15, 9.66, 9.77, 10.09] },
    { start: 13.74, end: 17.45, words: [13.74, 13.87, 14.27, 14.41, 14.73, 14.86, 15.75, 15.89, 15.98, 16.47, 16.6, 17.0] },
    { start: 20.57, end: 24.25, words: [20.57, 20.7, 21.09, 21.23, 21.55, 21.7, 22.6, 22.72, 22.82, 23.32, 23.43, 23.83] },
    { start: 27.37, end: 31.04, words: [27.37, 27.51, 27.9, 28.03, 28.35, 28.5, 29.38, 29.51, 29.62, 30.11, 30.23, 30.59] },
  ],
  final: { full: 34.16, at: 34.83, signs: 35.11, path: 35.48, dot: 35.85, comEnd: 36.55 },
};

export const SKILL: Mantra = {
  id: "skill",
  title: "growth mantra",
  duration: 36.3,
  visual: "growth",
  lines: [
    [{ t: "I'm building", w: 0, kind: "bold" }],
    [{ t: "a skill", w: 2, kind: "serif" }],
    [{ t: "that earns me", w: 4, kind: "muted", size: 110 }],
    [{ t: "more", w: 7, kind: "bold" }, { t: "every month.", w: 8, kind: "serif" }],
  ],
  reps: [
    { start: 0.0, end: 3.24, words: [0.0, 0.22, 0.58, 0.63, 1.12, 1.31, 1.59, 1.71, 2.16, 2.72] },
    { start: 6.36, end: 9.5, words: [6.36, 6.58, 6.93, 6.97, 7.44, 7.63, 7.94, 8.06, 8.49, 9.01] },
    { start: 12.62, end: 15.72, words: [12.62, 12.81, 13.17, 13.21, 13.66, 13.85, 14.12, 14.24, 14.68, 15.2] },
    { start: 18.84, end: 21.96, words: [18.84, 19.04, 19.38, 19.42, 19.88, 20.07, 20.34, 20.46, 20.88, 21.41] },
    { start: 25.08, end: 28.13, words: [25.1, 25.3, 25.64, 25.68, 26.13, 26.32, 26.6, 26.72, 27.14, 27.67] },
  ],
  final: { full: 31.25, at: 31.88, signs: 32.14, path: 32.52, dot: 32.87, comEnd: 33.6 },
};
