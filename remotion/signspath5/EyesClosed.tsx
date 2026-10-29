import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { SceneFinale } from "../signspath/SceneFinale";
import { C, loadFonts, SANS } from "../signspath/theme";
import { clamp, eBack, eIn, eInOut, eOut, hash, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { DURATION_FRAMES, SC, T, W } from "./timing";

loadFonts();

type Key = keyof typeof SC;
const on = (f: number, k: Key) => f >= T(SC[k][0]) - 1 && f < T(SC[k][1]) + 2;
const sceneFx = (f: number, k: Key) => {
  const a = T(SC[k][0]);
  const b = T(SC[k][1]);
  const i = prog(f, a, a + 10, eOut);
  const o = prog(f, b - 10, b, eIn);
  return {
    opacity: i * (1 - o),
    transform: `scale(${lerp(1.06, 1, i) * (1 + o * 0.08)})`,
    filter: i < 1 || o > 0 ? `blur(${(1 - i) * 14 + o * 18}px)` : undefined,
  } as React.CSSProperties;
};
const capsStyle: React.CSSProperties = { fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.32em", color: C.muted, textTransform: "uppercase" };
const glass = (a: number): React.CSSProperties => ({
  background: `linear-gradient(160deg, rgba(255,255,255,${0.08 + 0.12 * a}), rgba(190,170,255,0.04)), rgba(36,18,92,0.85)`,
  border: `1.5px solid rgba(225,215,255,${0.2 + 0.5 * a})`,
  boxShadow: `0 0 ${a * 40}px rgba(150,110,255,${0.55 * a})`,
});

/** Œil stylisé : open = 1 ouvert, 0 fermé (cils visibles). */
const Eye: React.FC<{ cx: number; cy: number; w: number; open: number; glow?: number }> = ({ cx, cy, w, open, glow = 0.5 }) => {
  const h = w * 0.36 * open;
  const up = `M ${cx - w / 2} ${cy} Q ${cx} ${cy - h * 1.6 - 2} ${cx + w / 2} ${cy}`;
  const lashes = Array.from({ length: 7 }, (_, i) => {
    const u = (i + 1) / 8;
    const x = cx - w / 2 + u * w;
    const y = cy + 4 * u * (1 - u) * w * 0.36 * 0.8 * (1 - open);
    const a = lerp(-0.9, 0.9, u);
    return <line key={i} x1={x} y1={y} x2={x + Math.sin(a) * 22} y2={y + 26} stroke="rgba(235,220,255,0.85)" strokeWidth={4} strokeLinecap="round" opacity={1 - open} />;
  });
  return (
    <g style={{ filter: `drop-shadow(0 0 ${10 + 14 * glow}px #b48cff)` }}>
      <clipPath id={`eye${cx}${cy}`}>
        <path d={`${up} Q ${cx} ${cy + h * 1.6} ${cx - w / 2} ${cy} Z`} />
      </clipPath>
      {open > 0.04 ? (
        <g clipPath={`url(#eye${cx}${cy})`}>
          <circle cx={cx} cy={cy} r={w * 0.2} fill="url(#iris)" />
          <circle cx={cx} cy={cy} r={w * 0.08} fill="#0b0420" />
          <circle cx={cx + w * 0.06} cy={cy - w * 0.06} r={w * 0.03} fill="#fff" />
        </g>
      ) : null}
      <path d={up} stroke="rgba(235,220,255,0.95)" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={`M ${cx - w / 2} ${cy} Q ${cx} ${cy + h * 1.6} ${cx + w / 2} ${cy}`} stroke="rgba(235,220,255,0.95)" strokeWidth={5} fill="none" strokeLinecap="round" opacity={open > 0.04 ? 1 : 0} />
      {lashes}
      <defs>
        <radialGradient id="iris">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.5" stopColor="#c4b0ff" />
          <stop offset="1" stopColor="#7c3aed" />
        </radialGradient>
      </defs>
    </g>
  );
};

/** Petite scène illustrée (terrasse au coucher du soleil), contenu statique. */
const SceneArt: React.FC<{ w: number; h: number; f: number; sparkle?: number }> = ({ w, h, f, sparkle = 0 }) => (
  <div style={{ position: "relative", width: w, height: h, overflow: "hidden", borderRadius: 30 }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #8f7bff 0%, #d9a6e8 45%, #ffcfb8 70%, #ffe9d6 100%)" }} />
    <div style={{ position: "absolute", left: w * 0.5 - h * 0.17, top: h * 0.46, width: h * 0.34, height: h * 0.34, borderRadius: "50%", background: "radial-gradient(circle, #fff, #ffe3cc 55%, rgba(255,220,200,0) 72%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.64, height: h * 0.36, background: "linear-gradient(180deg, #6c5bd8, #2b1f6e)" }} />
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ position: "absolute", left: w * 0.5 - (60 + i * 40), top: h * 0.68 + i * 18, width: 120 + i * 80, height: 3, borderRadius: 2, background: "rgba(255,235,220,0.55)", transform: `translateX(${Math.sin(f / 18 + i) * 8}px)` }} />
    ))}
    <div style={{ position: "absolute", left: -w * 0.1, top: h * 0.55, width: w * 0.55, height: h * 0.3, borderRadius: "50%", background: "#3a2a8a" }} />
    <div style={{ position: "absolute", right: -w * 0.15, top: h * 0.58, width: w * 0.6, height: h * 0.3, borderRadius: "50%", background: "#30237a" }} />
    {Array.from({ length: 10 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: hash(i * 3) * w, top: hash(i * 5) * h * 0.6, width: 8, height: 8, borderRadius: "50%", background: "#fff", boxShadow: "0 0 12px #fff", opacity: sparkle * (0.4 + 0.6 * Math.abs(Math.sin(f / 7 + i))) }} />
    ))}
  </div>
);

/** Motion SignsPath #5 — "5 minutes, eyes closed" (1080x1920). */
export const EyesClosed: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.015 * Math.sin(f / 55)})` }}>
        {on(f, "a") ? <SceneA f={f} /> : null}
        {on(f, "b") ? <SceneB f={f} /> : null}
        {on(f, "c") ? <SceneC f={f} /> : null}
        {on(f, "d") ? <SceneD f={f} /> : null}
        <Sequence from={T(SC.finale[0])} durationInFrames={DURATION_FRAMES - T(SC.finale[0])} name="finale">
          <SceneFinale
            timing={{
              manifest: W.manifest, with: W.with, method: W.method, not: W.not, by: W.by, chance: W.chance,
              full: W.full, signs: W.signs, path: W.path, dot: W.dot, comEnd: W.comEnd, cta: 19.55, from: T(SC.finale[0]),
            }}
          />
        </Sequence>
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : "5 minutes. Eyes closed. That's all." ---------- */
const RING = { cx: 540, cy: 1250, R: 270 };
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const ringIn = prog(f, T(W.five), T(W.minEnd), eOut);
  const close = prog(f, T(W.closed) - 2, T(W.closedEnd), eInOut);
  const all = prog(f, T(W.thats), T(W.allEnd) + 4, eOut);
  const C2 = 2 * Math.PI * RING.R;
  return (
    <AbsoluteFill style={sceneFx(f, "a")}>
      <AbsoluteFill style={{ background: "rgba(3,0,12,0.4)", opacity: close }} />
      <Words
        f={f}
        top={230}
        size={90}
        lineGap={4}
        lines={[
          [{ t: "5 minutes.", at: W.five, kind: "serif" }],
          [{ t: "Eyes", at: W.eyes, kind: "bold" }, { t: "closed.", at: W.closed, kind: "bold" }],
          [{ t: "That's all.", at: W.thats, kind: "muted", size: 100 }],
        ]}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: ringIn }}>
        <circle cx={RING.cx} cy={RING.cy} r={RING.R} fill="rgba(36,18,92,0.35)" stroke="rgba(225,215,255,0.16)" strokeWidth={3} />
        <circle cx={RING.cx} cy={RING.cy} r={RING.R} fill="none" stroke="rgba(235,220,255,0.95)" strokeWidth={6} strokeDasharray={`${C2 * ringIn} ${C2}`} strokeLinecap="round" transform={`rotate(-90 ${RING.cx} ${RING.cy})`} style={{ filter: "drop-shadow(0 0 12px #b48cff)" }} />
        <Eye cx={RING.cx} cy={RING.cy - 30} w={300} open={1 - close} glow={0.4 + 0.6 * all} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: RING.cy + 80, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 84, color: C.white, opacity: ringIn, letterSpacing: -2, textShadow: "0 0 30px rgba(170,130,255,0.6)" }}>5:00</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: RING.cy + RING.R + 50, textAlign: "center", ...capsStyle, opacity: all, color: C.lilacSoft }}>
        nothing else
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B : "Pick a single scene. A precise one, already real." ---------- */
const CARD = { cx: 540, cy: 1230, w: 560, h: 400 };
const DECOYS = [
  [-330, -330, -8],
  [320, -300, 7],
  [-360, 270, 6],
  [340, 300, -6],
  [0, -470, 3],
  [20, 470, -3],
];
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.b[0]);
  const cloud = prog(f, st + 2, st + 18, eOut);
  const pick = prog(f, T(W.single) - 2, T(W.scene) + 6, eInOut);
  const sharp = prog(f, T(W.precise) - 2, T(W.oneEnd), eInOut);
  const real = prog(f, T(W.already), T(W.real) + 6, eInOut);
  const badge = prog(f, T(W.real) - 2, T(W.real) + 10, eBack);
  return (
    <AbsoluteFill style={sceneFx(f, "b")}>
      {DECOYS.map(([dx, dy, r], i) => (
        <div key={i} style={{ position: "absolute", left: CARD.cx + dx * 0.9 - 150, top: CARD.cy + dy * 0.6 - 100, width: 300, height: 200, borderRadius: 26, ...glass(0.15), opacity: cloud * (1 - pick) * 0.8, filter: `blur(${3 + pick * 10}px)`, transform: `rotate(${r + Math.sin(f / 30 + i) * 2}deg) translate(${dx * pick * 0.4}px, ${dy * pick * 0.4}px) scale(${1 - pick * 0.3})`, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${120 + i * 40}deg, rgba(185,166,255,0.35), rgba(255,200,190,0.15))` }} />
        </div>
      ))}
      {/* la scène choisie */}
      <div style={{ position: "absolute", left: CARD.cx - CARD.w / 2, top: CARD.cy - CARD.h / 2, width: CARD.w, height: CARD.h, borderRadius: 32, ...glass(0.3 + 0.7 * pick), opacity: cloud, transform: `scale(${lerp(0.55, 1, pick)})`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.25 + 0.75 * real, filter: `blur(${(1 - sharp) * 14}px) saturate(${0.4 + 0.6 * real})` }}>
          <SceneArt w={CARD.w} h={CARD.h} f={f} sparkle={real} />
        </div>
      </div>
      {/* viseur "précis" */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: sharp }}>
        {[
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ].map(([sx, sy], i) => {
          const off = lerp(60, 26, sharp);
          const x = CARD.cx + sx * (CARD.w / 2 + off);
          const y = CARD.cy + sy * (CARD.h / 2 + off);
          return <path key={i} d={`M ${x} ${y - sy * 60} L ${x} ${y} L ${x - sx * 60} ${y}`} stroke="rgba(235,220,255,0.95)" strokeWidth={6} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px #b48cff)" }} />;
        })}
      </svg>
      {badge > 0 ? (
        <div style={{ position: "absolute", left: CARD.cx + CARD.w / 2 - 170, top: CARD.cy + CARD.h / 2 + 60, padding: "12px 26px", borderRadius: 999, background: "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))", boxShadow: "0 0 40px rgba(139,92,246,0.8)", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#fff", opacity: Math.min(1, badge * 2), transform: `scale(${badge})` }}>
          ✓ already real
        </div>
      ) : null}
      <Words
        f={f}
        top={200}
        size={86}
        lineGap={0}
        lines={[
          [{ t: "Pick", at: W.pick, kind: "bold" }, { t: "a", at: W.a, kind: "muted" }, { t: "single scene.", at: W.single, kind: "serif" }],
          [{ t: "A", at: W.a2, kind: "muted" }, { t: "precise", at: W.precise, kind: "bold" }, { t: "one,", at: W.one, kind: "muted" }],
          [{ t: "already real.", at: W.already, kind: "serif" }],
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------- C : les 3 sens ---------- */
const SENSES = [
  { at: W.what, key: "see", label: "see" },
  { at: W.what2, key: "hear", label: "hear" },
  { at: W.what3, key: "feel", label: "feel" },
] as const;
const SenseIcon: React.FC<{ k: string; s: number }> = ({ k, s }) => (
  <svg width={s} height={s} viewBox="0 0 60 60" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
    {k === "see" ? (
      <>
        <path d="M6 30 Q30 8 54 30 Q30 52 6 30 Z" />
        <circle cx={30} cy={30} r={8} fill="#fff" />
      </>
    ) : k === "hear" ? (
      <>
        <path d="M14 22 L22 22 L32 13 L32 47 L22 38 L14 38 Z" />
        <path d="M40 22 Q45 30 40 38" />
        <path d="M46 16 Q55 30 46 44" />
      </>
    ) : (
      <path d="M30 50 C10 36 6 26 12 18 C18 10 27 13 30 20 C33 13 42 10 48 18 C54 26 50 36 30 50 Z" />
    )}
  </svg>
);
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.c[0]);
  const cardIn = prog(f, st + 2, st + 16, eOut);
  const see = prog(f, T(W.see), T(W.seeEnd) + 10, eOut);
  const hear = prog(f, T(W.sounds), T(W.hearEnd) + 6, eOut);
  const feel = prog(f, T(W.feel), T(W.bodyEnd), eOut);
  const breath = 0.5 + 0.5 * Math.sin((f - T(W.feel)) / 9);
  const cx = 540;
  const cy = 1150;
  return (
    <AbsoluteFill style={sceneFx(f, "c")}>
      {/* chaleur dans le corps */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, rgba(255,190,200,${0.22 * feel * (0.6 + 0.4 * breath)}), transparent 60%)` }} />
      {/* ondes sonores */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2, 3].map((i) => {
          const p = (((f - T(W.sounds)) / 36 + i / 4) % 1 + 1) % 1;
          return <rect key={i} x={cx - 300 - p * 220} y={cy - 220 - p * 200} width={600 + p * 440} height={440 + p * 400} rx={60 + p * 120} fill="none" stroke="rgba(225,215,255,0.6)" strokeWidth={3} opacity={hear * (1 - p) * (1 - feel * 0.6)} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: cx - 300, top: cy - 220, width: 600, height: 440, borderRadius: 34, ...glass(0.5 + 0.5 * feel), opacity: cardIn, transform: `scale(${lerp(0.9, 1, cardIn) * (1 + 0.025 * feel * breath)})`, overflow: "hidden" }}>
        <SceneArt w={600} h={440} f={f} sparkle={see} />
      </div>
      {/* les 3 sens */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1490, display: "flex", justifyContent: "center", gap: 40 }}>
        {SENSES.map((s, i) => {
          const q = prog(f, T(s.at) - 2, T(s.at) + 10, eBack);
          const active = [see, hear, feel][i];
          return (
            <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: 0.35 + 0.65 * Math.min(1, q), transform: `scale(${0.85 + 0.15 * Math.min(1, q)})` }}>
              <div style={{ width: 150, height: 150, borderRadius: 40, ...glass(active), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SenseIcon k={s.key} s={70} />
              </div>
              <div style={{ ...capsStyle, color: active > 0.5 ? C.lilacSoft : C.muted }}>{s.label}</div>
            </div>
          );
        })}
      </div>
      <Words
        f={f}
        top={230}
        size={84}
        exitAt={T(W.what2) - 10}
        lines={[
          [{ t: "What", at: W.what, kind: "muted", size: 100 }, { t: "do you", at: W.do, kind: "muted", size: 100 }, { t: "see", at: W.see, kind: "serif" }],
          [{ t: "around you?", at: W.around, kind: "bold" }],
        ]}
      />
      {f >= T(W.what2) - 4 ? (
        <Words
          f={f}
          top={230}
          size={84}
          exitAt={T(W.what3) - 10}
          lines={[
            [{ t: "What", at: W.what2, kind: "muted", size: 100 }, { t: "sounds", at: W.sounds, kind: "serif" }],
            [{ t: "do you", at: W.do2, kind: "muted", size: 100 }, { t: "hear?", at: W.hear, kind: "bold" }],
          ]}
        />
      ) : null}
      {f >= T(W.what3) - 4 ? (
        <Words
          f={f}
          top={230}
          size={84}
          lines={[
            [{ t: "What", at: W.what3, kind: "muted", size: 100 }, { t: "do you", at: W.do3, kind: "muted", size: 100 }, { t: "feel", at: W.feel, kind: "serif" }],
            [{ t: "in your", at: W.in, kind: "muted", size: 100 }, { t: "body?", at: W.body, kind: "bold" }],
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- D : "Stay there a few seconds before opening your eyes." ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.d[0]);
  const inQ = prog(f, st + 2, st + 16, eOut);
  const open = prog(f, T(W.opening) + 2, T(W.eyesEnd), eInOut);
  const bloom = f >= T(W.eyes2) ? Math.exp(-(f - T(W.eyes2)) / 10) : 0;
  const breath = 0.5 + 0.5 * Math.sin((f - st) / 14);
  const dot = (i: number) => prog(f, T(W.few) + i * 8, T(W.few) + i * 8 + 8, eBack);
  return (
    <AbsoluteFill style={sceneFx(f, "d")}>
      <Orb cx={540} cy={1180} R={180 + 20 * breath} power={0.3 + 0.25 * breath + 0.5 * open + bloom} flicker={0} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: inQ }}>
        <Eye cx={540} cy={1180} w={320} open={open} glow={0.4 + open} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1460, display: "flex", justifyContent: "center", gap: 36, opacity: inQ * (1 - open) }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", opacity: 0.2 + 0.8 * dot(i), transform: `scale(${0.7 + 0.5 * dot(i)})`, boxShadow: dot(i) > 0.5 ? "0 0 16px #c8b0ff" : undefined }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1530, textAlign: "center", ...capsStyle, opacity: inQ * (1 - open) }}>breathe · stay</div>
      {bloom > 0.02 ? <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 61%, rgba(255,250,255,0.9), rgba(190,150,255,0.35) 30%, transparent 65%)", opacity: bloom * 0.8 }} /> : null}
      <Words
        f={f}
        top={230}
        size={86}
        lineGap={0}
        lines={[
          [{ t: "Stay", at: W.stay, kind: "bold" }, { t: "there", at: W.there, kind: "serif" }],
          [{ t: "a few seconds", at: W.a3, kind: "muted", size: 100 }],
          [{ t: "before opening", at: W.before }],
          [{ t: "your eyes.", at: W.your2, kind: "serif" }],
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.five + 0.05, src: "chime1", vol: 0.2 },
  { at: W.closed, src: "whoosh_soft", vol: 0.15 },
  { at: W.closedEnd - 0.1, src: "sub", vol: 0.22 },
  { at: W.thats, src: "chime2", vol: 0.16 },
  { at: 3.15, src: "whoosh", vol: 0.3 },
  { at: W.single, src: "chime3", vol: 0.22 },
  { at: W.precise, src: "tick_low", vol: 0.3 },
  { at: W.already, src: "shimmer", vol: 0.28 },
  { at: W.real, src: "chime5", vol: 0.26 },
  { at: 7.32, src: "whoosh", vol: 0.3 },
  { at: W.see, src: "shimmer", vol: 0.22 },
  { at: W.what2 - 0.25, src: "whoosh_soft", vol: 0.15 },
  { at: W.sounds, src: "chime6", vol: 0.2 },
  { at: W.hear, src: "chime2", vol: 0.16 },
  { at: W.what3 - 0.25, src: "whoosh_soft", vol: 0.15 },
  { at: W.feel, src: "sub", vol: 0.25 },
  { at: W.body, src: "chime1", vol: 0.2 },
  { at: 13.22, src: "whoosh", vol: 0.28 },
  ...[0, 1, 2].map((i) => ({ at: W.few + i * 0.27, src: "tick", vol: 0.1 })),
  { at: W.opening, src: "riser", vol: 0.14 },
  { at: W.eyes2, src: "chime5", vol: 0.3 },
  { at: W.eyes2, src: "shimmer", vol: 0.25 },
  { at: W.manifest - 0.05, src: "impact", vol: 0.42 },
  { at: W.with, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.35 },
  { at: 19.45, src: "whoosh", vol: 0.3 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74, 0.86, 0.98, 1.1].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice5.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
