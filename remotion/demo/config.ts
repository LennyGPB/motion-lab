// =====================================================================
//  "PRODUCT DEMO WITH CURSOR" — everything is customised here.
// =====================================================================
import { chartXY, EXPORT_BTN, optionXY, PICKER, TOAST } from "./geometry";

export type Rect = [number, number, number, number]; // x, y, w, h (coordonnées app)
export type Pt = [number, number];
export type Effect = "range" | "point" | "export" | "none";

export type Step = {
  effect: Effect;
  /** Zooms de caméra (frame locale → zone à cadrer). */
  zooms: { at: number; rect: Rect }[];
  /** Clics du curseur (frame locale → point). */
  clicks: { at: number; pt: Pt }[];
  /** Bulle d'explication. */
  callout: { at: number; pt: Pt; title: string; text: string };
};

const P9 = chartXY(8);

export const CONFIG = {
  product: "ACME ANALYTICS",
  appName: "Acme",
  tagline: "Your data, finally clear.",
  cta: "Start free trial →",
  url: "acme.io",
  accent: "#5b6cff",
  accent2: "#22c9a6",
  wallpaper: ["#1b1f4b", "#5b3f9e", "#e07a8c"],
  headline: ["SEE IT", "IN ACTION."],
  outroLine: ["THAT'S IT.", "NO LEARNING CURVE."],
  /** Étapes de la démo (répétables). Une étape dure STEP_LEN frames. */
  steps: [
    {
      effect: "range",
      zooms: [
        { at: 0, rect: [900, 0, 600, 270] },
        { at: 56, rect: [250, 250, 900, 420] },
      ],
      clicks: [
        { at: 30, pt: [PICKER.x + PICKER.w / 2, PICKER.y + PICKER.h / 2] },
        { at: 50, pt: optionXY(2) },
      ],
      callout: { at: 62, pt: [700, 330], title: "Switch time ranges", text: "From 30 to 90 days, instantly." },
    },
    {
      effect: "point",
      zooms: [{ at: 0, rect: [P9[0] - 330, P9[1] - 170, 660, 380] }],
      clicks: [{ at: 30, pt: P9 }],
      callout: { at: 38, pt: P9, title: "Drill into any data point", text: "Click a point, get the full story." },
    },
    {
      effect: "export",
      zooms: [
        { at: 0, rect: [1080, 0, 480, 220] },
        { at: 44, rect: [1050, 780, 540, 300] },
      ],
      clicks: [{ at: 28, pt: [EXPORT_BTN.x + EXPORT_BTN.w / 2, EXPORT_BTN.y + EXPORT_BTN.h / 2] }],
      callout: { at: 52, pt: [TOAST.x + 70, TOAST.y + TOAST.h], title: "Export in one click", text: "PDF or CSV, ready to share." },
    },
  ] as Step[],
};
