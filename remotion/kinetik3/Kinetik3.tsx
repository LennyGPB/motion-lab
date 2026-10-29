import React from "react";
import { AbsoluteFill, Html5Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { CYAN, FONT, GridFloor, KinetikGlyph, LAV, SANS, Streaks, rgb } from "../kinetik2/parts";
import { CUT, DURATION_FRAMES, T, VO } from "./timing";

loadViewzFonts();
loadFonts();

const PURPLE = "#8b5cf6";
const CUTS = Object.values(CUT);
const HITS: [number, number][] = [
  [T.motion, 10],
  [T.two, 24],
  [T.kinetik, 14],
  [T.done, 30],
  [T.two3, 24],
];

/* ---------------- typo ---------------- */
const heavy = (size: number, color = "#fff", stretch = 90): React.CSSProperties => ({
  fontFamily: FONT,
  fontStyle: "italic",
  fontWeight: 900,
  fontStretch: `${stretch}%`,
  fontSize: size,
  lineHeight: 0.92,
  textTransform: "uppercase",
  color,
  whiteSpace: "nowrap",
  letterSpacing: "-0.02em",
});
const sans = (size: number, color = "#fff"): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1.05,
  color,
  whiteSpace: "nowrap",
  letterSpacing: "-0.02em",
});
const caps = (size = 28, color = CYAN): React.CSSProperties => ({ fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: "0.35em", color, textTransform: "uppercase" });

const Pop: React.FC<{ f: number; at: number; style: React.CSSProperties; children: React.ReactNode; glow?: string }> = ({ f, at, style, children, glow }) => {
  if (f < at) return <span style={{ ...style, display: "inline-block", opacity: 0 }}>{children}</span>;
  const q = prog(f, at, at + 7, eExpo);
  const ab = (1 - q) * 14;
  return (
    <span
      style={{
        ...style,
        display: "inline-block",
        opacity: prog(f, at, at + 2),
        transform: `scale(${lerp(1.45, 1, q)})`,
        filter: q < 0.97 ? `blur(${(1 - q) * 9}px)` : undefined,
        textShadow: [rgb(ab), glow ? `0 0 40px ${glow}` : undefined].filter(Boolean).join(", ") || undefined,
      }}
    >
      {children}
    </span>
  );
};

const exitStyle = (f: number, at: number, len = 4): React.CSSProperties => {
  const o = prog(f, at - len, at, eInOut);
  return { opacity: 1 - o, transform: `scale(${1 + o * 0.25}) translateX(${o * (hash(Math.floor(f)) - 0.5) * 60}px)`, filter: o > 0.02 ? `blur(${o * 14}px)` : undefined };
};

const Row: React.FC<{ top: number; gap?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ top, gap = 24, children, style }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "baseline", gap, ...style }}>{children}</div>
);

/* ---------------- écran 3D avec zoom + curseur ---------------- */
type Spot = { x: number; y: number }; // coordonnées normalisées dans la capture
const Cursor: React.FC<{ x: number; y: number; press: number }> = ({ x, y, press }) => (
  <svg width={70} height={70} viewBox="0 0 24 24" style={{ position: "absolute", left: x - 8, top: y - 6, transform: `scale(${1 - press * 0.18})`, transformOrigin: "8px 6px", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }}>
    <path d="M4 2 L4 19 L8.5 15 L11.5 21.5 L14.2 20.3 L11.3 14 L17 14 Z" fill="#fff" stroke="#111" strokeWidth={1.2} strokeLinejoin="round" />
  </svg>
);

const Screen: React.FC<{
  f: number;
  src: string;
  aspect: number;
  w: number;
  zoom: number;
  origin: Spot;
  cursor?: { from: Spot; to: Spot; t: number; clickAt: number } | null;
  highlight?: { x: number; y: number; w: number; h: number; on: number; r?: number } | null;
  children?: React.ReactNode;
}> = ({ f, src, aspect, w, zoom, origin, cursor, highlight, children }) => {
  const h = w / aspect;
  const map = (p: Spot) => ({ x: origin.x * w + (p.x - origin.x) * w * zoom, y: origin.y * h + (p.y - origin.y) * h * zoom });
  let cur: React.ReactNode = null;
  if (cursor) {
    const p = { x: lerp(cursor.from.x, cursor.to.x, cursor.t), y: lerp(cursor.from.y, cursor.to.y, cursor.t) };
    const m = map(p);
    const press = f >= cursor.clickAt - 2 && f < cursor.clickAt + 4 ? 1 : 0;
    const rp = f >= cursor.clickAt ? (f - cursor.clickAt) / 14 : -1;
    cur = (
      <>
        {rp >= 0 && rp < 1 ? <div style={{ position: "absolute", left: m.x - 20 - rp * 50, top: m.y - 20 - rp * 50, width: 40 + rp * 100, height: 40 + rp * 100, borderRadius: "50%", border: `4px solid ${CYAN}`, opacity: 1 - rp, boxShadow: `0 0 20px ${CYAN}` }} /> : null}
        <Cursor x={m.x} y={m.y} press={press} />
      </>
    );
  }
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 22, overflow: "hidden", border: "2px solid rgba(94,230,242,0.8)", boxShadow: "0 0 50px rgba(94,230,242,0.35), 0 40px 80px rgba(0,0,0,0.6)", background: "#08070b" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: `${origin.x * 100}% ${origin.y * 100}%` }}>
        <Img src={staticFile(`kinetik3/screens/${src}.jpg`)} style={{ width: w, height: h, display: "block" }} />
        {highlight && highlight.on > 0 ? (
          <div
            style={{
              position: "absolute",
              left: (highlight.x - highlight.w / 2) * w - 6,
              top: (highlight.y - highlight.h / 2) * h - 6,
              width: highlight.w * w + 12,
              height: highlight.h * h + 12,
              borderRadius: highlight.r ?? 999,
              border: `3px solid ${CYAN}`,
              boxShadow: `0 0 ${24 * highlight.on}px ${CYAN}, inset 0 0 ${16 * highlight.on}px rgba(94,230,242,0.5)`,
              opacity: highlight.on,
            }}
          />
        ) : null}
        {children}
      </div>
      {cur}
    </div>
  );
};

/** Conteneur 3D flottant : entrée depuis le fond, léger balancement, sortie floue. */
const Float3D: React.FC<{ f: number; a: number; b: number; cy: number; w: number; h: number; ry?: number; children: React.ReactNode }> = ({ f, a, b, cy, w, h, ry = -12, children }) => {
  const inQ = prog(f, a, a + 14, eExpo);
  const out = prog(f, b - 4, b, eInOut);
  return (
    <AbsoluteFill style={{ perspective: 1900, perspectiveOrigin: `50% ${cy}px` }}>
      <div
        style={{
          position: "absolute",
          left: 540 - w / 2,
          top: cy - h / 2,
          width: w,
          height: h,
          transformStyle: "preserve-3d",
          transform: `translate3d(0, ${(1 - inQ) * 220}px, ${lerp(-900, 0, inQ) + out * 600}px) rotateY(${lerp(ry * 2.6, ry, inQ) + Math.sin(f / 20) * 3}deg) rotateX(${8 + Math.sin(f / 26) * 2}deg)`,
          opacity: prog(f, a, a + 5) * (1 - out),
          filter: out > 0.02 ? `blur(${out * 12}px)` : undefined,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const StepTag: React.FC<{ f: number; a: number; n: number; label: string }> = ({ f, a, n, label }) => (
  <div style={{ position: "absolute", top: 1590, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: prog(f, a + 4, a + 10) }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 26px", borderRadius: 999, border: "1.5px solid rgba(94,230,242,0.5)", background: "rgba(5,20,26,0.7)" }}>
      <span style={{ ...caps(24), letterSpacing: "0.25em" }}>step {n}/5</span>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: CYAN }} />
      <span style={{ ...caps(24, "#fff"), letterSpacing: "0.2em" }}>{label}</span>
    </div>
  </div>
);

/* ================================================================== */
export const Kinetik3: React.FC = () => {
  const f = useCurrentFrame();
  const glitch = CUTS.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const shake = HITS.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const sx = (hash(f * 3) - 0.5) * shake;
  const sy = (hash(f * 3 + 1) - 0.5) * shake;
  const flash = Math.max(...[T.two, T.done, T.two3].map((h) => (f >= h ? Math.exp(-(f - h) / 2.2) : 0)), f >= T.kinetik ? 0.45 * Math.exp(-(f - T.kinetik) / 2) : 0);
  const purple = Math.max(prog(f, CUT.h3, CUT.h3 + 4) * (1 - prog(f, CUT.s1 - 3, CUT.s1)), prog(f, CUT.s6, CUT.s6 + 4) * (1 - prog(f, CUT.s7 - 3, CUT.s7)) * 0.7);
  const beat = f >= T.head && f < DURATION_FRAMES - 30 ? Math.exp(-((f - T.head) % 14.5) / 4) : 0;

  const scene = (a: number, b: number) => f >= a - 1 && f < b + 1;
  return (
    <AbsoluteFill style={{ background: "#03080a", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(40,170,185,${0.18 + beat * 0.07}) 0%, transparent 42%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 46%, rgba(130,90,255,0.45) 0%, rgba(60,30,140,0.25) 35%, transparent 70%)", opacity: purple }} />
      <GridFloor f={f} tint={purple > 0.5 ? "rgba(170,150,255,0.5)" : "rgba(94,230,242,0.42)"} />

      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        {scene(0, CUT.h2) && <Hook1 f={f} />}
        {scene(CUT.h2, CUT.h3) && <Hook2 f={f} />}
        {scene(CUT.h3, CUT.s1) && <Hook3 f={f} />}
        {scene(CUT.s1, CUT.s2) && <Step1 f={f} />}
        {scene(CUT.s2, CUT.s3) && <Step2 f={f} />}
        {scene(CUT.s3, CUT.s4) && <Step3 f={f} />}
        {scene(CUT.s4, CUT.s5) && <Step4 f={f} />}
        {scene(CUT.s5, CUT.s6) && <Step5 f={f} />}
        {scene(CUT.s6, CUT.s7) && <Sync f={f} />}
        {scene(CUT.s7, CUT.s8) && <Done f={f} />}
        {scene(CUT.s8, CUT.s9) && <Editor f={f} />}
        {f >= CUT.s9 - 1 && <Part2 f={f} />}
      </AbsoluteFill>

      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(0.85, flash) * 0.85, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grain3">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 30} />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain3)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 10, DURATION_FRAMES - 1, eInOut) }} />
      <Sounds />
    </AbsoluteFill>
  );
};

/* ---------------- accroche ---------------- */
const Hook1: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={exitStyle(f, CUT.h2)}>
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", ...caps(28), opacity: prog(f, 0, 8) }}>kinetik tutorial</div>
    <Row top={560} gap={22}>
      <Pop f={f} at={T.how} style={sans(104)}>How</Pop>
      <Pop f={f} at={T.do} style={sans(104)}>do you</Pop>
    </Row>
    <Row top={690} gap={22}>
      <Pop f={f} at={T.create} style={sans(104)}>create</Pop>
      <Pop f={f} at={T.a} style={sans(104)}>a</Pop>
    </Row>
    <Row top={850}>
      <Pop f={f} at={T.motion} style={heavy(215, CYAN, 80)} glow="rgba(94,230,242,0.5)">MOTION</Pop>
    </Row>
    <Row top={1080}>
      <Pop f={f} at={T.graphic} style={heavy(215, "#fff", 80)}>GRAPHIC</Pop>
    </Row>
  </AbsoluteFill>
);

const Hook2: React.FC<{ f: number }> = ({ f }) => {
  const R = 300;
  const C = 2 * Math.PI * R;
  const p = prog(f, CUT.h2, T.two, (x) => x);
  const two = f >= T.two;
  const pulse = two ? Math.exp(-(f - T.two) / 5) : 0;
  return (
    <AbsoluteFill style={exitStyle(f, CUT.h3)}>
      <Row top={250}>
        <Pop f={f} at={T.in} style={sans(110)}>in</Pop>
        <Pop f={f} at={T.literally} style={sans(110)}>literally</Pop>
      </Row>
      <div style={{ position: "absolute", left: 540 - R - 30, top: 1000 - R - 30, width: 2 * R + 60, height: 2 * R + 60, opacity: prog(f, CUT.h2, CUT.h2 + 5), transform: `scale(${lerp(0.7, 1, prog(f, CUT.h2, CUT.h2 + 10, eExpo)) * (1 + pulse * 0.08)}) rotate(-90deg)` }}>
        <svg width={2 * R + 60} height={2 * R + 60} viewBox={`${-R - 30} ${-R - 30} ${2 * R + 60} ${2 * R + 60}`}>
          <circle r={R} fill="none" stroke="rgba(94,230,242,0.13)" strokeWidth={22} />
          <circle r={R} fill="none" stroke={CYAN} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${C * (two ? 1 : p)} ${C}`} style={{ filter: `drop-shadow(0 0 ${14 + pulse * 30}px ${CYAN})` }} />
        </svg>
      </div>
      <div style={{ position: "absolute", top: 1000 - 330, left: 0, right: 0, textAlign: "center" }}>
        <Pop f={f} at={T.two} style={{ ...heavy(600, "#fff", 100), lineHeight: 1.1 }} glow="rgba(255,255,255,0.35)">2</Pop>
      </div>
      <Row top={1380}>
        <Pop f={f} at={T.seconds} style={heavy(200, CYAN, 90)} glow="rgba(94,230,242,0.55)">SECONDS</Pop>
      </Row>
    </AbsoluteFill>
  );
};

const KLogo: React.FC<{ f: number; at: number; size: number }> = ({ f, at, size }) => {
  const q = prog(f, at, at + 8, eExpo);
  const ab = (1 - q) * 18 + (f >= at ? 3 : 0);
  const ds = `drop-shadow(${-ab}px 0 0 rgba(255,40,90,0.6)) drop-shadow(${ab}px 0 0 rgba(40,240,255,0.6)) drop-shadow(0 0 28px rgba(170,140,255,0.75))`;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: size * 0.16, opacity: prog(f, at, at + 2), transform: `scale(${lerp(1.6, 1, q)})`, filter: q < 0.97 ? `blur(${(1 - q) * 12}px)` : undefined }}>
      <div style={{ filter: ds }}>
        <KinetikGlyph size={size} f={f} />
      </div>
      <span style={{ ...sans(size * 1.03), letterSpacing: "-0.04em", background: `linear-gradient(180deg, #ffffff 10%, ${LAV} 100%)`, WebkitBackgroundClip: "text", color: "transparent", filter: ds }}>Kinetik</span>
    </div>
  );
};

const Hook3: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={exitStyle(f, CUT.s1)}>
    <Row top={760}>
      <Pop f={f} at={T.with} style={sans(88, "#e4dcff")}>with</Pop>
    </Row>
    <div style={{ position: "absolute", top: 880, left: 0, right: 0 }}>
      <KLogo f={f} at={T.kinetik} size={170} />
    </div>
    <div style={{ position: "absolute", top: 1130, left: 0, right: 0, textAlign: "center", fontSize: 120, ...sans(120, LAV), opacity: prog(f, T.kinetik + 6, T.kinetik + 10) }}>?</div>
  </AbsoluteFill>
);

/* ---------------- étape 1 : le site ---------------- */
const SW = 980;
const Step1: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.s1;
  const btn = { x: 0.4235, y: 0.521 };
  const zoom = lerp(1, 2.3, prog(f, T.click, T.create2 + 4, eInOut));
  const t = prog(f, T.and, T.create2 - 2, eInOut);
  const swap = f >= T.and - 2;
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, swap ? CUT.s2 : T.and - 2, 3)}>
        {!swap ? (
          <>
            <Row top={170} gap={22}>
              <Pop f={f} at={T.head} style={sans(104)}>Head</Pop>
              <Pop f={f} at={T.head + 4} style={sans(104)}>to the</Pop>
            </Row>
            <Row top={310}>
              <Pop f={f} at={T.website} style={heavy(220, CYAN, 82)} glow="rgba(94,230,242,0.5)">WEBSITE</Pop>
            </Row>
          </>
        ) : (
          <>
            <Row top={170} gap={22}>
              <Pop f={f} at={T.and} style={sans(104)}>and</Pop>
              <Pop f={f} at={T.click} style={sans(104)}>click</Pop>
            </Row>
            <Row top={330}>
              <Pop f={f} at={T.create2} style={{ ...sans(76), padding: "22px 48px", borderRadius: 999, background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", boxShadow: "0 0 50px rgba(139,92,246,0.8)" }}>
                Create my video →
              </Pop>
            </Row>
          </>
        )}
      </div>
      <Float3D f={f} a={a} b={CUT.s2} cy={1110} w={SW} h={SW / 1.947}>
        <Screen
          f={f}
          src="website"
          aspect={1.947}
          w={SW}
          zoom={zoom}
          origin={btn}
          cursor={f >= T.and - 6 ? { from: { x: 0.78, y: 0.9 }, to: btn, t, clickAt: T.create2 + 2 } : null}
          highlight={{ x: btn.x, y: btn.y, w: 0.165, h: 0.077, on: prog(f, T.create2 + 2, T.create2 + 8) }}
        />
      </Float3D>
      <StepTag f={f} a={a} n={1} label="kinetik website" />
    </AbsoluteFill>
  );
};

/* ---------------- étape 2 : « Create my motion design » ---------------- */
const Step2: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.s2;
  const card = { x: 0.495, y: 0.66 };
  const zoom = lerp(1, 1.9, prog(f, T.select, T.motion2 + 4, eInOut));
  const t = prog(f, T.select, T.motion2 - 2, eInOut);
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, CUT.s3, 3)}>
        <Row top={170} gap={22}>
          <Pop f={f} at={T.then} style={sans(104)}>Then</Pop>
          <Pop f={f} at={T.select} style={sans(104)}>select</Pop>
        </Row>
        <Row top={310}>
          <Pop f={f} at={T.motion2} style={heavy(200, CYAN, 80)} glow="rgba(94,230,242,0.5)">MOTION</Pop>
        </Row>
        <Row top={490}>
          <Pop f={f} at={T.design} style={heavy(200, "#fff", 80)}>DESIGN</Pop>
        </Row>
      </div>
      <Float3D f={f} a={a} b={CUT.s3} cy={1150} w={SW} h={SW / 1.646} ry={12}>
        <Screen
          f={f}
          src="create"
          aspect={1.646}
          w={SW}
          zoom={zoom}
          origin={card}
          cursor={{ from: { x: 0.2, y: 0.95 }, to: { x: 0.53, y: 0.8 }, t, clickAt: T.motion2 + 2 }}
          highlight={{ x: 0.495, y: 0.67, w: 0.19, h: 0.46, on: prog(f, T.motion2 + 2, T.motion2 + 8), r: 30 }}
        />
      </Float3D>
      <StepTag f={f} a={a} n={2} label="motion design" />
    </AbsoluteFill>
  );
};

/* ---------------- étape 3 : 250 modèles ---------------- */
const PAL = [
  ["#7c3aed", "#c4b5ff"],
  ["#ff6b3d", "#ffd0b8"],
  ["#0ea5e9", "#5ee6f2"],
  ["#111827", "#5ee6f2"],
  ["#e11d48", "#fda4af"],
  ["#16a34a", "#bbf7d0"],
  ["#f5f5f4", "#7c3aed"],
  ["#facc15", "#111827"],
];
const WORDS = ["LAUNCH", "Flowly", "NEW", "Studio", "SALE", "Aa", "Ready?", "GO"];
const Thumb: React.FC<{ i: number; f: number; hi?: number }> = ({ i, f, hi = 0 }) => {
  const [bg, fg] = PAL[Math.floor(hash(i) * PAL.length)];
  const kind = Math.floor(hash(i + 7) * 4);
  const word = WORDS[Math.floor(hash(i + 3) * WORDS.length)];
  return (
    <div style={{ width: 170, height: 300, borderRadius: 22, background: `linear-gradient(160deg, ${bg}, #05040a 130%)`, border: `2px solid ${hi > 0 ? CYAN : "rgba(255,255,255,0.12)"}`, boxShadow: hi > 0 ? `0 0 ${40 * hi}px ${CYAN}` : "0 10px 30px rgba(0,0,0,0.5)", position: "relative", overflow: "hidden" }}>
      {kind === 0 ? <div style={{ position: "absolute", left: 14, bottom: 30, ...heavy(44, fg, 80) }}>{word}</div> : null}
      {kind === 1 ? (
        <div style={{ position: "absolute", left: 45, top: 40 + Math.sin(f / 10 + i) * 6, width: 80, height: 160, borderRadius: 16, border: `3px solid ${fg}`, background: "rgba(0,0,0,0.35)" }}>
          <div style={{ margin: "18px 12px", height: 10, borderRadius: 5, background: fg }} />
          <div style={{ margin: "0 12px", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.4)", width: 40 }} />
        </div>
      ) : null}
      {kind === 2 ? (
        <div style={{ position: "absolute", left: 35, top: 70, width: 100, height: 100, borderRadius: "50%", border: `6px solid ${fg}`, boxShadow: `0 0 20px ${fg}`, transform: `scale(${1 + 0.08 * Math.sin(f / 8 + i)})` }} />
      ) : null}
      {kind === 3 ? (
        <div style={{ position: "absolute", left: 22, bottom: 40, display: "flex", alignItems: "flex-end", gap: 8 }}>
          {[0, 1, 2, 3, 4].map((k) => (
            <div key={k} style={{ width: 18, height: 30 + 70 * Math.abs(Math.sin(f / 9 + i + k)), borderRadius: 5, background: fg }} />
          ))}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 14, top: 14, ...caps(12, "rgba(255,255,255,0.7)"), letterSpacing: "0.2em" }}>#{(i % 250) + 1}</div>
    </div>
  );
};
const Step3: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.s3;
  const n = Math.round(lerp(0, 250, prog(f, T.over, T.fifty + 6, eOut)));
  const pick = prog(f, T.options, T.optEnd + 6, eBack);
  const scroll = (f - a) * 7;
  const COLS = 6;
  const RH = 324;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 1000px", ...exitStyle(f, CUT.s4) }}>
        <div style={{ position: "absolute", left: 540 - (COLS * 194) / 2, top: 560, width: COLS * 194, height: 1500, transform: `rotateX(32deg) rotateZ(-10deg) translateZ(-120px)`, transformStyle: "preserve-3d", opacity: prog(f, a, a + 8), maskImage: "linear-gradient(180deg, transparent, #000 18%, #000 75%, transparent)", WebkitMaskImage: "linear-gradient(180deg, transparent, #000 18%, #000 75%, transparent)" }}>
          {Array.from({ length: COLS * 7 }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const y = ((row * RH - scroll * (col % 2 ? 1.2 : 1)) % (7 * RH) + 7 * RH) % (7 * RH) - RH;
            return (
              <div key={i} style={{ position: "absolute", left: col * 194, top: y, opacity: pick > 0 ? 1 - pick * 0.6 : 1 }}>
                <Thumb i={i + 11} f={f} />
              </div>
            );
          })}
        </div>
        {pick > 0 ? (
          <div style={{ position: "absolute", left: 540 - 170 * 0.9, top: 980 - 300 * 0.9, transform: `scale(${lerp(0.5, 1.8, pick)})`, opacity: Math.min(1, pick * 2) }}>
            <Thumb i={42} f={f} hi={pick} />
          </div>
        ) : null}
      </AbsoluteFill>
      <div style={exitStyle(f, CUT.s4, 3)}>
        <Row top={150} gap={22}>
          <Pop f={f} at={T.choose} style={sans(100)}>Choose</Pop>
          <Pop f={f} at={T.choose + 6} style={sans(100)}>your</Pop>
        </Row>
        <Row top={280}>
          <Pop f={f} at={T.template} style={heavy(210, CYAN, 80)} glow="rgba(94,230,242,0.5)">TEMPLATE</Pop>
        </Row>
        <div style={{ position: "absolute", top: 1380, left: 0, right: 0, textAlign: "center", opacity: prog(f, T.over - 2, T.over + 4) }}>
          <div style={{ ...sans(56, "rgba(255,255,255,0.8)") }}>from over</div>
          <div style={{ ...heavy(280, "#fff", 90), textShadow: `0 0 40px rgba(94,230,242,0.6)` }}>
            {n}
            <span style={{ color: CYAN }}>{n >= 250 ? "+" : ""}</span>
          </div>
          <div style={{ ...caps(34), marginTop: 10, opacity: prog(f, T.options, T.options + 6) }}>options</div>
        </div>
      </div>
      <StepTag f={f} a={a} n={3} label="template" />
    </AbsoluteFill>
  );
};

/* ---------------- étape 4 : marque ---------------- */
const Step4: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.s4;
  const field = { x: 0.1, y: 0.51 };
  const zoom = lerp(1, 1.65, prog(f, a + 6, T.brand + 6, eInOut));
  const typed = "Flowly".slice(0, Math.round(lerp(0, 6, prog(f, T.brand, T.detEnd - 4, (x) => x))));
  const W2 = SW;
  const H2 = W2 / 1.938;
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, CUT.s5, 3)}>
        <Row top={170} gap={22}>
          <Pop f={f} at={T.fill} style={sans(104)}>Fill in</Pop>
          <Pop f={f} at={T.fill + 7} style={sans(104)}>your</Pop>
        </Row>
        <Row top={310}>
          <Pop f={f} at={T.brand} style={heavy(210, CYAN, 80)} glow="rgba(94,230,242,0.5)">BRAND</Pop>
        </Row>
        <Row top={500}>
          <Pop f={f} at={T.details} style={heavy(210, "#fff", 80)}>DETAILS!</Pop>
        </Row>
      </div>
      <Float3D f={f} a={a} b={CUT.s5} cy={1180} w={W2} h={H2}>
        <Screen f={f} src="brand" aspect={1.938} w={W2} zoom={zoom} origin={field} highlight={{ x: 0.315, y: 0.51, w: 0.545, h: 0.085, on: prog(f, T.brand - 4, T.brand + 4), r: 14 }}>
          {f >= T.brand ? (
            <div style={{ position: "absolute", left: 0.047 * W2, top: 0.475 * H2, width: 0.53 * W2, height: 0.075 * H2, background: "#0f0f12", display: "flex", alignItems: "center", paddingLeft: 0.012 * W2, fontFamily: SANS, fontWeight: 600, fontSize: 0.0155 * W2, color: "#fff" }}>
              {typed}
              <span style={{ width: 2, height: "45%", marginLeft: 2, background: "#fff", opacity: Math.floor(f / 6) % 2 ? 1 : 0 }} />
            </div>
          ) : null}
        </Screen>
      </Float3D>
      <StepTag f={f} a={a} n={4} label="your brand" />
    </AbsoluteFill>
  );
};

/* ---------------- étape 5 : couleurs + musique ---------------- */
const Step5: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.s5;
  const sw = prog(f, T.music - 4, T.music + 8, eInOut);
  const cw = 900;
  const mw = 940;
  const czoom = lerp(1, 1.35, prog(f, T.colors - 4, T.colors + 10, eInOut));
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, CUT.s6, 3)}>
        <Row top={170} gap={22}>
          <Pop f={f} at={T.choose2} style={sans(104)}>Choose</Pop>
          <Pop f={f} at={T.choose2 + 6} style={sans(104)}>your</Pop>
        </Row>
        <Row top={310}>
          <Pop f={f} at={T.colors} style={heavy(210, CYAN, 80)} glow="rgba(94,230,242,0.5)">COLORS</Pop>
        </Row>
        <Row top={500}>
          <Pop f={f} at={T.music} style={heavy(210, "#fff", 80)}>&amp; MUSIC!</Pop>
        </Row>
      </div>
      <AbsoluteFill style={{ perspective: 1900, perspectiveOrigin: "50% 1150px", ...exitStyle(f, CUT.s6) }}>
        {/* couleurs */}
        <div style={{ position: "absolute", left: 540 - cw / 2, top: 1150 - cw / 1.779 / 2, transform: `translate3d(${lerp(0, -180, sw)}px, ${lerp((1 - prog(f, a, a + 14, eExpo)) * 260, -200, sw)}px, ${lerp(-900 * (1 - prog(f, a, a + 14, eExpo)), -500, sw)}px) rotateY(${lerp(-12, 18, sw) + Math.sin(f / 20) * 3}deg) rotateX(8deg)`, opacity: prog(f, a, a + 5) * (1 - 0.45 * sw), filter: sw > 0.05 ? `blur(${sw * 5}px)` : undefined }}>
          <Screen f={f} src="colors" aspect={1.779} w={cw} zoom={czoom} origin={{ x: 0.5, y: 0.6 }} highlight={{ x: 0.47, y: 0.66, w: 0.9, h: 0.33, on: prog(f, T.colors, T.colors + 8) * (1 - sw), r: 20 }} />
        </div>
        {/* musique */}
        {sw > 0 ? (
          <div style={{ position: "absolute", left: 540 - mw / 2, top: 1180 - mw / 1.675 / 2, transform: `translate3d(${lerp(700, 40, sw)}px, 60px, ${lerp(-300, 80, sw)}px) rotateY(${lerp(-40, -10, sw) + Math.sin(f / 20) * 3}deg) rotateX(8deg)`, opacity: Math.min(1, sw * 2) }}>
            <Screen f={f} src="music" aspect={1.675} w={mw} zoom={lerp(1, 1.5, sw)} origin={{ x: 0.32, y: 0.31 }} cursor={{ from: { x: 0.55, y: 0.6 }, to: { x: 0.3, y: 0.32 }, t: prog(f, T.music, T.music + 10, eInOut), clickAt: T.music + 11 }} highlight={{ x: 0.325, y: 0.313, w: 0.555, h: 0.09, on: prog(f, T.music + 11, T.music + 16), r: 18 }} />
          </div>
        ) : null}
      </AbsoluteFill>
      <StepTag f={f} a={a} n={5} label={sw > 0.5 ? "music" : "colors"} />
    </AbsoluteFill>
  );
};

/* ---------------- Kinetik synchronise tout ---------------- */
const Phone: React.FC<{ w: number; children?: React.ReactNode; glow?: number }> = ({ w, children, glow = 0.5 }) => (
  <div style={{ width: w, height: w * 1.95, borderRadius: w * 0.16, border: "6px solid #1d1b29", background: "#05040a", boxShadow: `0 0 0 2px rgba(196,181,255,0.5), 0 0 ${60 * glow}px rgba(139,92,246,${0.7 * glow}), 0 40px 80px rgba(0,0,0,0.6)`, position: "relative", overflow: "hidden" }}>
    {children}
    <div style={{ position: "absolute", top: 14, left: "50%", width: w * 0.3, height: 22, marginLeft: -w * 0.15, borderRadius: 11, background: "#000" }} />
  </div>
);
const MiniMotion: React.FC<{ f: number; w: number; t0: number }> = ({ f, w, t0 }) => {
  const k = f - t0;
  const beat = Math.exp(-((Math.max(0, k)) % 14.5) / 4);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #7133DA, #1a0b3a 60%, #05040a)" }}>
      <div style={{ position: "absolute", left: "50%", top: "34%", width: w * 0.5, height: w * 0.5, marginLeft: -w * 0.25, borderRadius: "50%", border: `${w * 0.03}px solid #B995FF`, boxShadow: "0 0 30px #A765FF", transform: `scale(${1 + 0.12 * beat}) rotate(${k * 2}deg)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "62%", textAlign: "center", ...sans(w * 0.17), transform: `scale(${1 + 0.06 * beat})` }}>Flowly</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: "74%", textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: w * 0.06, color: "rgba(255,255,255,0.7)" }}>Your day, organized.</div>
    </AbsoluteFill>
  );
};
const Sync: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.s6;
  const inQ = prog(f, a, a + 14, eExpo);
  const pct = Math.round(100 * prog(f, T.syncs, T.youEnd - 2, eInOut));
  const fly = (d: number) => prog(f, T.everything - 10 + d * 4, T.everything + 6 + d * 4, eInOut);
  const chips = [
    { x: -360, y: -330, el: <div style={{ display: "flex", gap: 8 }}>{["#B995FF", "#A765FF", "#7133DA"].map((c) => <div key={c} style={{ width: 34, height: 34, borderRadius: 10, background: c }} />)}</div> },
    { x: 360, y: -180, el: <div style={{ ...sans(56) }}>♫</div> },
    { x: -340, y: 260, el: <div style={{ ...caps(22, "#fff"), letterSpacing: "0.15em" }}>Template</div> },
  ];
  return (
    <AbsoluteFill style={exitStyle(f, CUT.s7)}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0 }}>
        <KLogo f={f} at={T.kinetik2} size={110} />
      </div>
      <Row top={330}>
        <Pop f={f} at={T.syncs} style={heavy(170, CYAN, 80)} glow="rgba(94,230,242,0.5)">SYNCS</Pop>
      </Row>
      <Row top={480} gap={22}>
        <Pop f={f} at={T.everything} style={heavy(120, "#fff", 80)}>EVERYTHING</Pop>
        <Pop f={f} at={T.for} style={sans(90)}>for you</Pop>
      </Row>
      <div style={{ position: "absolute", left: 540 - 170, top: 1180 - 330, opacity: inQ, transform: `translateY(${(1 - inQ) * 200}px) scale(${lerp(0.8, 1, inQ)})` }}>
        <Phone w={340} glow={0.4 + 0.6 * (pct / 100)}>
          <MiniMotion f={f} w={340} t0={T.syncs} />
          <div style={{ position: "absolute", inset: 0, background: "#05040a", clipPath: `inset(${pct}% 0 0 0)`, opacity: 0.85 }} />
        </Phone>
      </div>
      {chips.map((c, i) => {
        const q = fly(i);
        return (
          <div key={i} style={{ position: "absolute", left: 540 + lerp(c.x, 0, q), top: 1180 + lerp(c.y, 0, q), transform: `translate(-50%, -50%) scale(${lerp(1, 0.3, q)})`, opacity: prog(f, a + 6 + i * 3, a + 12 + i * 3) * (q > 0.95 ? 0 : 1), padding: "18px 24px", borderRadius: 22, border: "1.5px solid rgba(94,230,242,0.6)", background: "rgba(5,20,26,0.85)", boxShadow: `0 0 24px rgba(94,230,242,0.4)` }}>
            {c.el}
          </div>
        );
      })}
      {/* barre de synchro */}
      <div style={{ position: "absolute", left: 160, right: 160, top: 1610 }}>
        <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${CYAN}, ${LAV})`, boxShadow: `0 0 16px ${CYAN}` }} />
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", ...caps(28), letterSpacing: "0.15em" }}>
          <span>{pct >= 100 ? "synced" : "syncing to the beat"}</span>
          <span style={{ color: "#fff" }}>{pct}%</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- DONE ---------------- */
const Done: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.s7;
  const ph = prog(f, T.done + 4, T.done + 20, eExpo);
  const ready = prog(f, T.ready - 2, T.ready + 8, eBack);
  return (
    <AbsoluteFill style={exitStyle(f, CUT.s8)}>
      <Row top={140}>
        <Pop f={f} at={T.done} style={heavy(330, "#fff", 95)} glow="rgba(94,230,242,0.7)">DONE!</Pop>
      </Row>
      <Row top={500} gap={20}>
        <Pop f={f} at={T.your} style={sans(84)}>Your</Pop>
        <Pop f={f} at={T.video2} style={sans(84)}>video</Pop>
        <Pop f={f} at={T.is} style={sans(84)}>is</Pop>
        <Pop f={f} at={T.ready} style={{ ...heavy(120, CYAN, 85), marginLeft: 18 }} glow="rgba(94,230,242,0.5)">READY.</Pop>
      </Row>
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 1200px" }}>
        <div style={{ position: "absolute", left: 540 - 180, top: 1220 - 350, opacity: ph, transform: `translate3d(0, ${(1 - ph) * 300}px, ${(1 - ph) * -600}px) rotateY(${lerp(40, -8, ph) + Math.sin(f / 18) * 4}deg) rotateX(6deg)` }}>
          <Phone w={360} glow={1}>
            <MiniMotion f={f} w={360} t0={T.done} />
          </Phone>
        </div>
      </AbsoluteFill>
      {ready > 0 ? (
        <div style={{ position: "absolute", left: 540 + 120, top: 1500, transform: `scale(${ready})`, opacity: Math.min(1, ready * 2), display: "flex", alignItems: "center", gap: 12, padding: "14px 26px", borderRadius: 999, background: CYAN, color: "#03080a", ...caps(28, "#03080a"), letterSpacing: "0.12em", boxShadow: `0 0 40px ${CYAN}` }}>
          ✓ ready
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------------- éditeur ---------------- */
const TRACKS = [
  { c: CYAN, clips: [[0, 0.3], [0.34, 0.62], [0.66, 1]] },
  { c: LAV, clips: [[0.05, 0.45], [0.5, 0.92]] },
  { c: "#A765FF", clips: [[0, 0.22], [0.25, 0.55], [0.6, 0.8]] },
  { c: "#ff6b9a", clips: [[0.1, 0.9]] },
];
const Editor: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.s8;
  const swap = f >= T.with2 - 2;
  const head = ((f - a) / 90) % 1;
  const EW = 960;
  const EH = 640;
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, swap ? CUT.s9 : T.with2 - 2, 3)}>
        {!swap ? (
          <>
            <Row top={190}>
              <Pop f={f} at={T.want} style={sans(110)}>Want to</Pop>
            </Row>
            <Row top={330} gap={26}>
              <Pop f={f} at={T.customize} style={heavy(190, CYAN, 78)} glow="rgba(94,230,242,0.5)">CUSTOMIZE</Pop>
              <Pop f={f} at={T.it} style={sans(110)}>it?</Pop>
            </Row>
          </>
        ) : (
          <>
            <Row top={150}>
              <Pop f={f} at={T.with2} style={sans(96)}>with our</Pop>
            </Row>
            <Row top={270}>
              <Pop f={f} at={T.super} style={heavy(170, "#fff", 78)}>SUPER-SIMPLE</Pop>
            </Row>
            <Row top={430}>
              <Pop f={f} at={T.editor} style={heavy(190, CYAN, 78)} glow="rgba(94,230,242,0.5)">EDITOR?</Pop>
            </Row>
          </>
        )}
      </div>
      <Float3D f={f} a={a} b={CUT.s9} cy={1190} w={EW} h={EH} ry={-14}>
        <div style={{ width: EW, height: EH, borderRadius: 26, border: "2px solid rgba(94,230,242,0.8)", boxShadow: "0 0 50px rgba(94,230,242,0.35), 0 40px 80px rgba(0,0,0,0.6)", background: "#0b0a10", position: "relative", overflow: "hidden", fontFamily: SANS }}>
          {/* barre */}
          <div style={{ height: 54, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <KinetikGlyph size={30} f={f} />
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>Kinetik editor</span>
            <span style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 999, background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff", fontWeight: 800, fontSize: 16 }}>Export</span>
          </div>
          {/* outils */}
          <div style={{ position: "absolute", left: 0, top: 54, width: 70, bottom: 0, borderRight: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, paddingTop: 22 }}>
            {["T", "◐", "♫", "▦", "✦"].map((s, i) => (
              <div key={i} style={{ width: 40, height: 40, borderRadius: 12, background: i === Math.floor((f - a) / 20) % 5 ? "rgba(94,230,242,0.25)" : "rgba(255,255,255,0.06)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>
                {s}
              </div>
            ))}
          </div>
          {/* aperçu */}
          <div style={{ position: "absolute", left: 300, top: 76, width: 190, height: 330, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
            <MiniMotion f={f} w={190} t0={a} />
          </div>
          {/* propriétés */}
          <div style={{ position: "absolute", right: 22, top: 80, width: 300, display: "flex", flexDirection: "column", gap: 14 }}>
            {["Text", "Color", "Font", "Speed"].map((l, i) => (
              <div key={l} style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.75)", fontWeight: 700, fontSize: 17 }}>
                <span>{l}</span>
                {i === 1 ? <span style={{ width: 22, height: 22, borderRadius: 6, background: "#A765FF" }} /> : <span style={{ color: "#fff" }}>{["Flowly", "", "Poppins", "1.0×"][i]}</span>}
              </div>
            ))}
          </div>
          {/* timeline */}
          <div style={{ position: "absolute", left: 90, right: 22, top: 430, bottom: 20 }}>
            {TRACKS.map((tr, i) => (
              <div key={i} style={{ position: "relative", height: 34, marginBottom: 10, borderRadius: 8, background: "rgba(255,255,255,0.04)" }}>
                {tr.clips.map(([x0, x1], k) => (
                  <div key={k} style={{ position: "absolute", left: `${x0 * 100}%`, width: `${(x1 - x0) * 100}%`, top: 3, bottom: 3, borderRadius: 7, background: tr.c, opacity: 0.85 }} />
                ))}
              </div>
            ))}
            <div style={{ position: "absolute", top: -8, bottom: -4, left: `${head * 100}%`, width: 3, background: "#fff", boxShadow: "0 0 10px #fff" }} />
          </div>
        </div>
      </Float3D>
    </AbsoluteFill>
  );
};

/* ---------------- Part 2 ---------------- */
const Part2: React.FC<{ f: number }> = ({ f }) => {
  const bgOn = prog(f, T.two3, T.two3 + 6);
  const btn = prog(f, T.follow - 2, T.follow + 8, eBack);
  const clickAt = T.for2 + 4;
  const cur = prog(f, T.follow, clickAt - 2, eInOut);
  const followed = f >= clickAt;
  const rp = f >= clickAt ? (f - clickAt) / 14 : -1;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: bgOn * 0.9 }}>
        {Array.from({ length: 9 }).map((_, r) => (
          <div key={r} style={{ ...heavy(220, "transparent", 100), position: "absolute", top: r * 215 - 40, left: -400 + (r % 2 ? -1 : 1) * (f * 4) - (r % 2) * 300, WebkitTextStroke: "2px rgba(94,230,242,0.13)" }}>
            PART 2 · PART 2 · PART 2 · PART 2 ·
          </div>
        ))}
      </AbsoluteFill>
      <Row top={150}>
        <Pop f={f} at={T.follow} style={sans(96)}>Follow for</Pop>
      </Row>
      <Row top={290}>
        <Pop f={f} at={T.part} style={heavy(240, "#fff", 100)}>PART</Pop>
      </Row>
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center" }}>
        <Pop f={f} at={T.two3} style={{ ...heavy(760, CYAN, 100), lineHeight: 1 }} glow="rgba(94,230,242,0.55)">2</Pop>
      </div>
      {/* bouton Follow */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1390, display: "flex", justifyContent: "center", opacity: Math.min(1, btn * 2) }}>
        <div style={{ position: "relative", transform: `scale(${btn * (f >= clickAt - 2 && f < clickAt + 4 ? 0.92 : 1)})` }}>
          {rp >= 0 && rp < 1 ? <div style={{ position: "absolute", inset: -rp * 90, borderRadius: 999, border: `4px solid ${CYAN}`, opacity: 1 - rp }} /> : null}
          <div style={{ padding: "30px 80px", borderRadius: 999, background: followed ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)", border: followed ? `2px solid ${CYAN}` : "2px solid transparent", boxShadow: followed ? `0 0 40px rgba(94,230,242,0.6)` : "0 0 50px rgba(139,92,246,0.8)", ...sans(66) }}>
            {followed ? "✓ Following" : "+ Follow"}
          </div>
          <div style={{ position: "absolute", left: lerp(520, 300, cur), top: lerp(260, 70, cur) }}>
            <Cursor x={0} y={0} press={f >= clickAt - 2 && f < clickAt + 4 ? 1 : 0} />
          </div>
        </div>
      </div>
      <Row top={1640} gap={20}>
        <Pop f={f} at={T.ill} style={sans(76)}>I&apos;ll show</Pop>
        <Pop f={f} at={T.show + 4} style={sans(76)}>you</Pop>
        <Pop f={f} at={T.how2} style={heavy(100, CYAN, 85)} glow="rgba(94,230,242,0.5)">HOW!</Pop>
      </Row>
    </AbsoluteFill>
  );
};

/* ---------------- son ---------------- */
const Sfx: React.FC<{ at: number; src: string; vol: number }> = ({ at, src, vol }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Html5Audio src={staticFile(`kinetik3/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);
const Sounds: React.FC = () => (
  <>
    <Html5Audio src={staticFile("kinetik3/sfx/music.wav")} volume={0.32} />
    <Sequence from={VO} layout="none">
      <Html5Audio src={staticFile("kinetik3/voice.wav")} volume={0.92} />
    </Sequence>
    <Sfx at={T.how} src="whoosh" vol={0.2} />
    <Sfx at={T.motion} src="impact" vol={0.2} />
    <Sfx at={CUT.h2} src="glitch" vol={0.14} />
    {Array.from({ length: 6 }).map((_, i) => (
      <Sfx key={`r${i}`} at={CUT.h2 + 2 + i * 4} src="tick" vol={0.1} />
    ))}
    <Sfx at={T.two} src="drop" vol={0.3} />
    <Sfx at={T.seconds} src="impact" vol={0.18} />
    <Sfx at={CUT.h3} src="glitch" vol={0.14} />
    <Sfx at={T.kinetik} src="impact" vol={0.22} />
    <Sfx at={T.kinetik} src="shimmer" vol={0.3} />
    {[CUT.s1, CUT.s2, CUT.s3, CUT.s4, CUT.s5, CUT.s6, CUT.s8, CUT.s9].map((c, i) => (
      <React.Fragment key={`c${i}`}>
        <Sfx at={c - 3} src="whoosh" vol={0.2} />
        <Sfx at={c} src="glitch" vol={0.12} />
      </React.Fragment>
    ))}
    <Sfx at={T.website} src="pop" vol={0.16} />
    <Sfx at={T.create2 + 2} src="click" vol={0.4} />
    <Sfx at={T.create2 + 2} src="pop" vol={0.16} />
    <Sfx at={T.motion2 + 2} src="click" vol={0.4} />
    <Sfx at={T.template} src="pop" vol={0.16} />
    {Array.from({ length: 10 }).map((_, i) => (
      <Sfx key={`n${i}`} at={T.over + i * 2.6} src="tick" vol={0.08} />
    ))}
    <Sfx at={T.options} src="shimmer" vol={0.22} />
    {Array.from({ length: 6 }).map((_, i) => (
      <Sfx key={`k${i}`} at={T.brand + i * 3.5} src="key" vol={0.35} />
    ))}
    <Sfx at={T.colors} src="pop" vol={0.16} />
    <Sfx at={T.music - 4} src="whoosh" vol={0.18} />
    <Sfx at={T.music + 11} src="click" vol={0.4} />
    <Sfx at={T.kinetik2} src="shimmer" vol={0.28} />
    <Sfx at={T.syncs} src="scan" vol={0.2} />
    <Sfx at={T.done - 36} src="riser" vol={0.2} />
    <Sfx at={CUT.s7} src="glitch" vol={0.14} />
    <Sfx at={T.done} src="drop" vol={0.36} />
    <Sfx at={T.ready} src="shimmer" vol={0.25} />
    <Sfx at={T.customize} src="pop" vol={0.16} />
    <Sfx at={T.editor} src="pop" vol={0.16} />
    <Sfx at={T.two3} src="drop" vol={0.3} />
    <Sfx at={T.for2 + 4} src="click" vol={0.4} />
    <Sfx at={T.how2} src="shimmer" vol={0.25} />
  </>
);
