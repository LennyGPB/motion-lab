// Timing de la voix (secondes). Phrases calées sur les silences, mots
// répartis à l'intérieur sur les attaques détectées dans le signal.

export const FPS = 30;
export const VO = 0.3; // doit matcher music_casting dans scripts/generate_sfx_viewz.py
export const DURATION = 22.3;
export const DURATION_FRAMES = Math.round(DURATION * FPS);
export const T = (voiceSec: number) => Math.round((voiceSec + VO) * FPS);

export const W = {
  viewz: 0.05, cest: 0.62, le: 0.78, premier: 0.95, reseau: 1.3, social: 1.65, pour: 1.96, les: 2.12, danseurs: 2.25, aEnd: 2.9,
  et: 3.25, on: 3.38, recherche: 3.5, un: 3.76, danseur: 3.9, experimente: 4.32, sur: 5.1, paris: 5.26,
  pour2: 5.55, creer: 5.71, du: 5.92, contenu: 6.05, avec: 6.5, nous: 6.85, bEnd: 7.07,
  videos: 7.35, interviews: 8.04, coulisses: 8.83, cEnd: 9.34,
  peu: 9.73, importe: 9.9, ton: 10.17, style: 10.4, dEnd: 10.71,
  hiphop: 10.87, afro: 11.38, contemporain: 11.78, krump: 12.57, ou: 12.85, autre: 12.99,
  si: 13.62, tas: 13.75, de: 13.9, experience: 14.07, et2: 14.64, que: 14.78, le2: 14.9, projet: 15.14, te: 15.45, parle: 15.74, eEnd: 16.2,
  ecris: 16.49, nous2: 16.8, en: 16.95, dm: 17.05, fEnd: 17.45,
  lapp: 17.78, est: 17.97, disponible: 18.1, sur2: 18.82, ios: 18.97, et3: 19.45, android: 19.59, gEnd: 20.3,
} as const;

export const SC = {
  intro: [-0.3, 3.08],
  casting: [3.08, 7.2],
  formats: [7.2, 9.55],
  styles: [9.55, 13.45],
  match: [13.45, 16.33],
  dm: [16.33, 17.62],
  finale: [17.62, DURATION - VO],
} as const;

// Grille rythmique de la prod (secondes vidéo)
const BEAT = 60 / 112;
const START = 0.32;
const BRK0 = 9.25 + VO;
const BRK1 = 9.73 + VO;
export const KICKS: number[] = (() => {
  const out: number[] = [];
  for (let k = 0; START + k * BEAT < 21.0; k++) {
    const bt = START + k * BEAT;
    if (bt >= BRK0 && bt < BRK1) continue;
    if (k % 4 === 0 || k % 4 === 2) out.push(Math.round(bt * FPS));
    if (k % 4 === 2) out.push(Math.round((bt + BEAT * 0.75) * FPS));
  }
  return out;
})();

export const kickPulse = (f: number) => {
  let best = 0;
  for (const k of KICKS) {
    if (k > f) break;
    best = Math.exp(-(f - k) / 4);
  }
  return best;
};

export const SLAMS = [
  { f: T(W.viewz), power: 1.2 },
  { f: T(W.premier), power: 0.4 },
  { f: T(W.experimente), power: 0.6 },
  { f: T(W.contenu), power: 0.4 },
  { f: T(W.videos), power: 0.5 },
  { f: T(W.interviews), power: 0.5 },
  { f: T(W.coulisses), power: 0.5 },
  { f: T(W.hiphop), power: 0.6 },
  { f: T(W.afro), power: 0.4 },
  { f: T(W.contemporain), power: 0.4 },
  { f: T(W.krump), power: 0.6 },
  { f: T(W.experience), power: 0.5 },
  { f: T(W.parle), power: 0.6 },
  { f: T(W.dm), power: 1 },
  { f: T(W.ios), power: 0.4 },
  { f: T(W.android), power: 0.5 },
];
