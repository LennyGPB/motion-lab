// Timing de la voix (secondes). Phrases calées sur les silences, mots
// répartis à l'intérieur sur les attaques détectées dans le signal.

export const FPS = 30;
export const VO = 0.3; // doit matcher scripts/generate_sfx_viewz_b2b.py
export const DURATION = 32;
export const DURATION_FRAMES = DURATION * FPS;
export const T = (voiceSec: number) => Math.round((voiceSec + VO) * FPS);

export const W = {
  viewz: 0.05, cest: 0.63, le: 0.76, premier: 1.0, reseau: 1.41, social: 1.68, pour: 1.85, les: 2.0, danseurs: 2.09,
  on: 3.24, recherche: 3.38, des: 3.76, organisateurs: 3.9, evenements: 4.6, danse: 5.2, sur: 5.45, paris: 5.62,
  pour2: 5.9, devenir: 6.08, partenaires: 6.55,
  battles: 7.53, showcases: 8.17, cours: 8.7, sessions: 9.17, libres: 9.66,
  gratuit: 10.67, de: 10.95, preference: 11.12, mais: 11.71, on2: 11.85, est: 11.95, ouverts: 12.02, a: 12.4, tout: 12.5,
  ce: 13.27, quon: 13.4, apporte: 13.6,
  gestion: 14.46, des2: 14.87, places: 15.04, inscriptions: 15.4, et: 15.9, qr: 16.07, codes: 16.43, directement: 16.74, via: 17.44, viewz2: 17.7,
  et2: 18.7, une: 18.85, visibilite: 18.98, aupres: 19.72, de2: 20.0, toute: 20.09, la: 20.3, communaute: 20.45, danse2: 21.0,
  en: 21.74, echange: 21.9, on3: 22.64, demande: 22.75, exclusivite: 23.24, des3: 23.93, inscriptions2: 24.1, via2: 24.55, viewz3: 24.85,
  ecrivez: 25.73, nous: 26.1, en2: 26.3, dm: 26.42,
  viewz4: 27.14, est2: 27.55, disponible: 27.64, sur2: 28.41, app: 28.53, store: 28.69, et3: 28.82, google: 29.12, play: 29.61,
} as const;

/** Sections (temps voix). */
export const SC = {
  intro: [-0.3, 3.05],
  appel: [3.05, 7.4],
  formats: [7.4, 13.1],
  apport: [13.1, 21.55],
  echange: [21.55, 25.55],
  contact: [25.55, 27.0],
  end: [27.0, DURATION - VO],
} as const;

export const SECTION_NUM: Partial<Record<keyof typeof SC, { n: string; label: string }>> = {
  appel: { n: "01", label: "Appel à partenaires" },
  formats: { n: "02", label: "Formats d'événements" },
  apport: { n: "03", label: "Ce qu'on apporte" },
  echange: { n: "04", label: "En échange" },
  contact: { n: "05", label: "Contact" },
};

// Rythmique (s vidéo), cf. generate_sfx_viewz_b2b.py
const BEAT = 60 / 100;
const START = 3.24 + VO;
const DIP0 = 21.6 + VO;
const DIP1 = 25.6 + VO;
export const KICKS: number[] = (() => {
  const out: number[] = [];
  for (let k = 0; START + (k * BEAT) / 2 < 30.3; k += 2) {
    const tb = START + (k * BEAT) / 2;
    if (tb >= DIP0 && tb < DIP1) continue;
    out.push(Math.round(tb * FPS));
  }
  return out;
})();

export const kickPulse = (f: number) => {
  let best = 0;
  for (const k of KICKS) {
    if (k > f) break;
    best = Math.exp(-(f - k) / 5);
  }
  return best;
};
