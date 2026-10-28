// Géométrie de l'app de démo (coordonnées internes, zone app 1600x1000 sous la barre de titre).
export const APP_W = 1600;
export const APP_H = 1000;
export const TITLE_H = 44;

export const CHART = { x: 300, y: 380, w: 790, h: 230 }; // zone de tracé du graphique
export const DATA_30 = [0.32, 0.38, 0.35, 0.45, 0.42, 0.5, 0.48, 0.55, 0.52, 0.6, 0.58, 0.64];
export const DATA_90 = [0.2, 0.28, 0.25, 0.4, 0.46, 0.44, 0.58, 0.62, 0.74, 0.7, 0.82, 0.9];

/** Position d'un point du graphique (données 90 jours). */
export const chartXY = (i: number, data = DATA_90): [number, number] => [CHART.x + (i / (data.length - 1)) * CHART.w, CHART.y + CHART.h - data[i] * CHART.h];

export const PICKER = { x: 1060, y: 20, w: 230, h: 44 };
export const OPTIONS = ["Last 7 days", "Last 30 days", "Last 90 days"];
export const optionXY = (k: number): [number, number] => [PICKER.x + PICKER.w / 2, 92 + k * 48];
export const EXPORT_BTN = { x: 1310, y: 20, w: 140, h: 44 };
export const TOAST = { x: 1130, y: 900, w: 440, h: 76 };
