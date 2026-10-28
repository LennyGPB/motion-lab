import { CONFIG } from "./config";

// Doit matcher scripts/generate_sfx_webbuild.py (CLICK = 10 s, END = 12 s, DUR = 17 s).
export const FPS = 30;
export const CLICK = 300;
export const END = 360;
export const DURATION_FRAMES = 510;

export type Block = "nav" | "title" | "sub" | "buttons" | "image" | "features" | "logos";
export type CodeLine = { text: string; block: Block; indent?: number };

const C = CONFIG;
export const CODE: CodeLine[] = [
  { text: `<nav class="navbar">`, block: "nav" },
  { text: `<a class="logo">${C.brand}</a>`, block: "nav", indent: 1 },
  { text: `</nav>`, block: "nav" },
  { text: `<h1>${C.heroTitle.join(" ")}</h1>`, block: "title" },
  { text: `<p>${C.heroSub}</p>`, block: "sub" },
  { text: `<button class="primary">${C.primaryBtn}</button>`, block: "buttons" },
  { text: `<button>${C.secondaryBtn}</button>`, block: "buttons" },
  { text: `<img src="hero.png" alt="Hero" />`, block: "image" },
  { text: `<section class="features">`, block: "features" },
  { text: `<Feature /> <Feature /> <Feature />`, block: "features", indent: 1 },
  { text: `</section>`, block: "features" },
  { text: `<footer class="logos" />`, block: "logos" },
];

/** Planning de frappe : début/fin de chaque ligne, apparition de chaque bloc. */
const CHARS_PER_FRAME = 2.5;
const GAP = 3;
export const TYPE_START = 34;
export const SCHEDULE = (() => {
  let t = TYPE_START;
  const lines = CODE.map((l) => {
    const len = l.text.length + (l.indent ?? 0) * 2;
    const start = t;
    const end = start + Math.ceil(len / CHARS_PER_FRAME);
    t = end + GAP;
    return { ...l, start, end };
  });
  const pops: Record<Block, number> = { nav: 0, title: 0, sub: 0, buttons: 0, image: 0, features: 0, logos: 0 };
  lines.forEach((l) => (pops[l.block] = l.end + 1));
  return { lines, pops, typingEnd: t };
})();
