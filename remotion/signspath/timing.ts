// Timing de la voix off (secondes), obtenu par alignement forcé (PocketSphinx)
// sur public/signspath/voice.mp3.

export const FPS = 30;
/** Décalage de la voix dans la vidéo (s). */
export const VO = 0.25;
export const DURATION = 29; // s
export const DURATION_FRAMES = DURATION * FPS;

/** Convertit un temps de la voix (s) en frame de la vidéo. */
export const T = (voiceSec: number) => Math.round((voiceSec + VO) * FPS);

export const W = {
  you: 0.0, want: 0.18, to: 0.36, change: 0.44, everything: 0.78, at: 1.43, once: 1.54, onceEnd: 2.21,
  thats: 2.46, why: 2.75, nothing: 2.88, moves: 3.21, movesEnd: 3.93,
  eight: 4.31, areas: 4.54, areasEnd: 5.21,
  money: 5.54, love: 6.29, career: 6.92, confidence: 7.55, body: 8.64, creativity: 9.41, lifestyle: 10.44,
  spirituality: 11.3, spiritualityEnd: 12.3,
  one1: 12.6, at2: 12.95, a: 13.12, time: 13.18, timeEnd: 13.71,
  pick: 14.06, the: 14.27, one2: 14.37, that: 14.57, matters: 14.69, most: 15.08, to2: 15.43, you2: 15.55,
  today: 16.06, todayEnd: 16.66,
  oneA: 17.04, intention: 17.31, oneB: 18.25, technique: 18.53, oneC: 19.39, specific: 19.75, day: 20.45,
  to3: 20.63, start: 20.72, startEnd: 21.24,
  manifest: 21.56, with: 22.2, method: 22.35, methodEnd: 23.01, not: 23.15, by: 23.44, chance: 23.57, chanceEnd: 24.13,
  full: 24.44, guide: 24.69, at3: 25.02, signs: 25.23, path: 25.59, dot: 25.92, com: 26.12, comEnd: 26.5,
} as const;

export const AREAS = [
  { key: "money", label: "money", at: W.money },
  { key: "love", label: "love", at: W.love },
  { key: "career", label: "career", at: W.career },
  { key: "confidence", label: "confidence", at: W.confidence },
  { key: "body", label: "body", at: W.body },
  { key: "creativity", label: "creativity", at: W.creativity },
  { key: "lifestyle", label: "lifestyle", at: W.lifestyle },
  { key: "spirituality", label: "spirituality", at: W.spirituality },
] as const;

/** Carte choisie à "Pick the one that matters most". */
export const PICKED = 3; // confidence

// Découpage des scènes (en frames vidéo)
export const SCENES = {
  chaos: { from: 0, to: T(4.15) },
  areas: { from: T(4.0), to: T(17.0) },
  steps: { from: T(16.85), to: T(21.5) },
  finale: { from: T(21.35), to: DURATION_FRAMES },
};
