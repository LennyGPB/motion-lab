// Timing de la voix (secondes). Phrases calées sur les silences, mots répartis
// à l'intérieur sur les attaques détectées dans le signal.

export const FPS = 30;
export const VO = 0.3; // doit matcher scripts/generate_sfx_viewz.py
export const DURATION = 17.5;
export const DURATION_FRAMES = Math.round(DURATION * FPS);

export const T = (voiceSec: number) => Math.round((voiceSec + VO) * FPS);

export const W = {
  tu: 0.05, cherches: 0.18, des: 0.45, danseurs: 0.55, s1End: 1.03,
  on: 1.27, a: 1.4, cree: 1.5, lapp: 1.8, pour: 2.1, ca: 2.25, s2End: 2.62,
  trouve: 2.94, un: 3.15, partenaire: 3.31, dans: 3.75, ta: 3.91, ville: 4.02, s3End: 4.32,
  decouvre: 4.56, les: 5.1, spots: 5.3, et: 5.5, events: 5.6, autour: 5.98, de: 6.3, toi: 6.48, s4End: 6.85,
  vois: 7.12, qui: 7.32, danse: 7.47, maintenant: 7.9, s5End: 8.45,
  connecte: 8.72, toi2: 9.1, directement: 9.4, s6End: 10.05,
  viewz: 10.45, s7End: 10.99,
  la: 11.26, connexion: 11.4, entre: 11.95, danseurs2: 12.15, s8End: 12.87,
  disponible: 13.17, sur: 13.85, app: 14.02, store: 14.2, et2: 14.45, google: 14.58, play: 15.0, s9End: 15.26,
} as const;

/** Bornes des scènes (temps voix). */
export const SC = {
  intro: [-0.3, 1.2],
  app: [1.2, 2.86],
  partner: [2.86, 4.46],
  map: [4.46, 7.02],
  live: [7.02, 8.62],
  connect: [8.62, 10.3],
  finale: [10.3, 17.5 - VO],
} as const;

// Grille rythmique de la prod (secondes vidéo), cf. generate_sfx_viewz.py
const BEAT = 60 / 112;
const START = 1.25 + VO;
const BRK0 = 10.25 + VO;
const BRK1 = 11.2 + VO;
export const KICKS: number[] = (() => {
  const out: number[] = [];
  for (let k = 0; START + k * BEAT < 16.3; k++) {
    const bt = START + k * BEAT;
    if (bt >= BRK0 && bt < BRK1) continue;
    if (k % 4 === 0 || k % 4 === 2) out.push(Math.round(bt * FPS));
    if (k % 4 === 2) out.push(Math.round((bt + BEAT * 0.75) * FPS));
  }
  return out;
})();

/** 0..1, pic sur chaque kick puis décroissance. */
export const kickPulse = (f: number) => {
  let best = 0;
  for (const k of KICKS) {
    if (k > f) break;
    best = Math.exp(-(f - k) / 4);
  }
  return best;
};

/** Gros impacts (frames vidéo) : flash + secousse. */
export const SLAMS = [
  { f: T(W.danseurs), power: 1 },
  { f: T(W.lapp), power: 0.6 },
  { f: T(W.partenaire), power: 0.5 },
  { f: T(W.danse), power: 0.5 },
  { f: T(W.directement), power: 0.5 },
  { f: T(W.viewz), power: 1.2 },
];
