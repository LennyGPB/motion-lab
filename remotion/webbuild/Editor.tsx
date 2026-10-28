import { interpolate } from "remotion";
import { clamp, eInOut } from "../viewz/util";
import { CONFIG } from "./config";
import { SCHEDULE } from "./timing";

const C = CONFIG;
const MONO = "JetBrains Mono, Menlo, monospace";
const LINE_H = 46;
const VISIBLE = 9;

/** Coloration syntaxique simple (balises, attributs, chaînes, texte). */
const colorize = (s: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  const re = /(<\/?[A-Za-z][\w]*)|(\s[\w-]+)(?==)|("[^"]*"?)|(\/?>)|([^<"]+)/g;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s))) {
    const [tok] = m;
    const color = m[1] ? "#ff79c6" : m[2] ? "#8be9fd" : m[3] ? "#a6e3a1" : m[4] ? "#ff79c6" : "#e6e6f0";
    out.push(
      <span key={k++} style={{ color }}>
        {tok}
      </span>,
    );
  }
  return out;
};

/** Éditeur de code qui tape le HTML en direct. */
export const Editor: React.FC<{ f: number; w: number; h: number }> = ({ f, w, h }) => {
  const lines = SCHEDULE.lines;
  const cur = lines.reduce((acc, l, i) => (f >= l.start ? i : acc), -1);
  const scrollTarget = Math.max(0, cur - (VISIBLE - 2));
  // défilement doux
  let scroll = 0;
  lines.forEach((l, i) => {
    if (i - (VISIBLE - 2) > 0) scroll += interpolate(f, [l.start - 4, l.start + 2], [0, 1], { ...clamp, easing: eInOut });
  });
  void scrollTarget;
  const done = f >= SCHEDULE.typingEnd + 4;
  const caretOn = Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{ width: w, height: h, borderRadius: 26, background: "#141625", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.55)", position: "relative" }}>
      {/* barre de titre */}
      <div style={{ height: 58, display: "flex", alignItems: "center", gap: 10, padding: "0 22px", background: "#0f111d", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ marginLeft: 18, padding: "8px 16px", borderRadius: 8, background: "#141625", fontFamily: MONO, fontSize: 18, color: "#e6e6f0" }}>index.html</div>
        <div style={{ marginLeft: 8, fontFamily: MONO, fontSize: 18, color: "#6b6f8a" }}>styles.css</div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 17, color: done ? C.accent2 : "#8b8fa8" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: done ? C.accent2 : "#febc2e", boxShadow: done ? `0 0 10px ${C.accent2}` : undefined }} />
          {done ? "Build succeeded" : "Live preview"}
        </div>
      </div>
      {/* code */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 58, bottom: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 18 - scroll * LINE_H }}>
          {lines.map((l, i) => {
            if (f < l.start) return null;
            const total = l.text.length;
            const n = Math.round(interpolate(f, [l.start, l.end], [0, total], clamp));
            const active = i === cur && !done;
            return (
              <div key={i} style={{ height: LINE_H, display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 25, whiteSpace: "pre", background: active ? "rgba(108,92,255,0.12)" : undefined }}>
                <span style={{ width: 64, textAlign: "right", paddingRight: 22, color: active ? "#c9cbe0" : "#4b4f6b" }}>{i + 1}</span>
                <span>{"  ".repeat(l.indent ?? 0)}</span>
                {colorize(l.text.slice(0, n))}
                {active && caretOn ? <span style={{ display: "inline-block", width: 3, height: 30, background: C.accent2, marginLeft: 2 }} /> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
