// Pub Atlas : cinématique, lumière chaude. 24 s.
export const FPS = 30;
export const DURATION_FRAMES = 24 * FPS; // doit matcher scripts/generate_sfx_atlas.py
export const BOOK = 540; // "Réservé" (18 s)
export const END = 595; // fin (19,83 s)

export const SC = {
  intro: [0, 140],
  arc: [135, 290],
  cards: [285, 465],
  phone: [460, 600],
  end: [595, DURATION_FRAMES],
} as const;
export const CARD_LEN = 60;
