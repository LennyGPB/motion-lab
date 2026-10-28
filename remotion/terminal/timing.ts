import { CONFIG } from "./config";

// Doit matcher scripts/generate_sfx_terminal.py (WARP = 5.8 s, END = 15 s, DUR = 19 s).
export const FPS = 30;
export const TERM_IN = 14;
export const WARP = 174;
export const SHOW = WARP + 22;
export const EXPLODE = 372;
export const END = 450;
export const DURATION_FRAMES = 570;

const CHARS_PER_FRAME = 1.6;
/** Planning du terminal : frappe des commandes puis sorties ligne par ligne. */
export const TERM = (() => {
  let t = 34;
  return CONFIG.commands.map((c) => {
    const start = t;
    const end = start + Math.ceil(c.cmd.length / CHARS_PER_FRAME);
    let o = end + 5;
    const outs = c.out.map((l) => {
      const at = o;
      o += l.kind === "progress" ? 16 : l.kind === "spinner" ? 8 : 5;
      return { ...l, at };
    });
    t = o + 6;
    return { ...c, start, end, outs };
  });
})();
export const TYPING_END = TERM[TERM.length - 1].outs.slice(-1)[0].at;
