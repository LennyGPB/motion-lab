// Pub Nova : partie lente et élégante, drop à 9 s, partie rythmée (120 BPM), fin posée.
export const FPS = 30;
export const DURATION_FRAMES = 22 * FPS; // doit matcher scripts/generate_sfx_nova.py
export const DROP = 270; // 9 s
export const BEAT = 15; // 120 BPM
export const END = 525; // 17,5 s

export const SC = {
  card: [0, 145],
  phone: [135, 272],
  notifs: [270, 362],
  chart: [360, 437],
  features: [435, 527],
  end: [525, DURATION_FRAMES],
} as const;

/** Pulsation sur le beat après le drop (0..1). */
export const beat = (f: number) => {
  if (f < DROP || f >= END) return f >= END ? Math.exp(-(f - END) / 10) : 0;
  return Math.exp(-((f - DROP) % BEAT) / 4);
};
