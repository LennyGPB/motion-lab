import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { Icon } from "../signspath/Icons";
import { SceneFinale } from "../signspath/SceneFinale";
import { C, loadFonts, SANS, SERIF, serifGradient } from "../signspath/theme";
import { clamp, eBack, eIn, eInOut, eOut, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { DURATION_FRAMES, SC, STEPS, T, W } from "./timing";

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
const pillBg = "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))";
const AREAS = ["money", "love", "career", "confidence", "body", "creativity", "lifestyle", "spirituality"];

/** Texte manuscrit qui s'écrit entre deux temps (en secondes voix). */
const Hand: React.FC<{ f: number; text: string; from: number; to: number; size?: number; color?: string }> = ({ f, text, from, to, size = 60, color = "#2a1270" }) => {
  const n = Math.round(lerp(0, text.length, prog(f, T(from), T(to), (x) => x)));
  return <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: size, color, whiteSpace: "nowrap" }}>{text.slice(0, n)}</span>;
};

/** Motion SignsPath #16 — « fais l'exercice avec moi » (1 minute). */
export const Exercise: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.015 * Math.sin(f / 55)})` }}>
        {on(f, "a") ? <SceneA f={f} /> : null}
        {on(f, "paper") ? <ScenePaper f={f} /> : null}
        {on(f, "d") ? <SceneD f={f} /> : null}
        <Sequence from={T(SC.finale[0])} durationInFrames={DURATION_FRAMES - T(SC.finale[0])} name="finale">
          <SceneFinale
            timing={{
              manifest: W.manifest, with: W.with, method: W.method, not: W.not, by: W.by, chance: W.chance,
              full: W.full, signs: W.signs, path: W.path, dot: W.dot, comEnd: W.comEnd, cta: 31.9, from: T(SC.finale[0]),
            }}
          />
        </Sequence>
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- « Do the exercise with me. It takes one minute. » ---------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const ring = prog(f, T(W.one), T(W.minEnd) + 6, eInOut);
  const R = 230;
  return (
    <AbsoluteFill style={sceneFx(f, "a")}>
      <Words
        f={f}
        top={300}
        size={78}
        lineGap={2}
        lines={[
          [{ t: "Do the", at: W.do, kind: "muted", size: 110 }, { t: "exercise", at: W.exercise, kind: "serif" }],
          [{ t: "with me.", at: W.me, kind: "bold" }],
          [{ t: "It takes", at: W.it, kind: "muted", size: 110 }, { t: "one minute.", at: W.one, kind: "serif" }],
        ]}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: prog(f, T(W.takes), T(W.takes) + 8) }}>
        <circle cx={540} cy={1250} r={R} fill="rgba(36,18,92,0.35)" stroke="rgba(225,215,255,0.16)" strokeWidth={3} />
        <circle cx={540} cy={1250} r={R} fill="none" stroke="rgba(235,220,255,0.95)" strokeWidth={6} pathLength={1} strokeDasharray={`${ring} 1`} transform="rotate(-90 540 1250)" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 12px #b48cff)" }} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1250 - 70, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 130, color: "#fff", letterSpacing: -3, opacity: prog(f, T(W.one), T(W.one) + 8), textShadow: "0 0 30px rgba(170,130,255,0.6)" }}>1:00</div>
    </AbsoluteFill>
  );
};

/* ---------- la feuille, étape par étape ---------- */
const CAPTIONS = [
  [
    [{ t: "Write down", at: W.write, kind: "bold" as const }, { t: "one thing", at: W.one2, kind: "serif" as const }],
    [{ t: "you want,", at: W.want - 0.15, kind: "muted" as const, size: 104 }, { t: "right now.", at: W.right, kind: "bold" as const }],
  ],
  [
    [{ t: "Now, make it", at: W.now2, kind: "muted" as const, size: 104 }, { t: "precise.", at: W.precise, kind: "serif" as const }],
    [{ t: "Add a", at: W.add, kind: "muted" as const, size: 104 }, { t: "number,", at: W.number, kind: "bold" as const }, { t: "or a deadline.", at: W.or, kind: "bold" as const }],
  ],
  [
    [{ t: "Rewrite it in the", at: W.rewrite, kind: "muted" as const, size: 100 }, { t: "present tense,", at: W.present, kind: "serif" as const }],
    [{ t: "as if it were", at: W.as, kind: "muted" as const, size: 104 }, { t: "already true.", at: W.already, kind: "bold" as const }],
  ],
  [
    [{ t: "There. You just turned", at: W.there, kind: "muted" as const, size: 100 }],
    [{ t: "a wish", at: W.wish - 0.08, kind: "serif" as const }, { t: "into an", at: W.into, kind: "muted" as const, size: 104 }, { t: "intention.", at: W.intention, kind: "serif" as const }],
  ],
  [
    [{ t: "Read it", at: W.read, kind: "bold" as const }, { t: "out loud,", at: W.out, kind: "serif" as const }],
    [{ t: "three times.", at: W.three, kind: "bold" as const }],
  ],
];
const ScenePaper: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.paper[0]);
  const paper = prog(f, T(W.sheet) - 4, T(W.sheet) + 14, eOut);
  const pen = prog(f, T(W.pen) - 2, T(W.pen) + 14, eBack);
  const step = STEPS.findIndex((s, i) => f >= T(s.at) - 6 && (i === STEPS.length - 1 || f < T(STEPS[i + 1].at) - 6));
  const strike1 = prog(f, T(W.precise), T(W.precise) + 10, eInOut);
  const strike2 = prog(f, T(W.present), T(W.present) + 10, eInOut);
  const wishStamp = prog(f, T(W.wish), T(W.wish) + 10, eBack);
  const intStamp = prog(f, T(W.intention), T(W.intention) + 10, eBack);
  const reads = [0, 1, 2].map((k) => prog(f, T(W.three) + k * 6, T(W.three) + k * 6 + 8, eBack));
  // le stylo suit l'écriture
  const penY = f < T(W.now2) ? 940 : f < T(W.rewrite) ? 1080 : 1220;
  const writing = (f >= T(W.write) && f < T(W.nowEnd)) || (f >= T(W.add) && f < T(W.dlEnd) + 6) || (f >= T(W.present) && f < T(W.trueEnd) + 6);
  const penX = 300 + (writing ? ((f % 30) / 30) * 420 : 560);
  return (
    <AbsoluteFill style={sceneFx(f, "paper")}>
      {/* sous-titres */}
      {f < T(W.write) - 6 ? (
        <Words
          f={f}
          top={300}
          size={90}
          lineGap={2}
          lines={[
            [{ t: "Grab a", at: W.grab, kind: "muted", size: 110 }, { t: "pen", at: W.pen, kind: "serif" }],
            [{ t: "and a", at: W.sheet - 0.2, kind: "muted", size: 110 }, { t: "sheet of paper.", at: W.sheet, kind: "bold" }],
          ]}
        />
      ) : (
        CAPTIONS.map((lines, i) =>
          i === step ? <Words key={i} f={f} top={200} size={84} lineGap={2} lines={lines.map((l) => l.map((t) => ({ ...t })))} /> : null,
        )
      )}
      {/* indicateur d'étapes */}
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12, opacity: step >= 0 ? 1 : 0 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{ width: i === step ? 40 : 12, height: 12, borderRadius: 6, background: i <= step ? C.lilacSoft : "rgba(225,215,255,0.25)", boxShadow: i === step ? "0 0 12px #c8b0ff" : undefined }} />
        ))}
      </div>
      {/* la feuille */}
      <div style={{ position: "absolute", left: 130, right: 130, top: 640, height: 900, borderRadius: 24, background: "#fbf8f2", boxShadow: "0 40px 90px rgba(0,0,0,0.55), 0 0 60px rgba(150,110,255,0.25)", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 138px, rgba(124,58,237,0.16) 138px 140px)", opacity: paper, transform: `translateY(${(1 - paper) * 120}px) rotate(${lerp(-8, -1.5, paper)}deg)`, padding: "60px 56px", boxSizing: "border-box" }}>
        <div style={{ ...capsStyle, color: "#7c3aed", fontSize: 20 }}>my intention · step {Math.max(1, step + 1)} / 5</div>
        {/* 1 : le souhait */}
        <div style={{ position: "relative", marginTop: 40, height: 140, display: "flex", alignItems: "center" }}>
          <span style={{ position: "relative" }}>
            <Hand f={f} text="I want more money." from={W.one2} to={W.nowEnd} color={strike1 > 0.5 ? "#9a8fb5" : "#2a1270"} />
            <span style={{ position: "absolute", left: -6, right: -6, top: "55%", height: 4, background: "#7c3aed", transform: `scaleX(${strike1})`, transformOrigin: "0% 50%" }} />
          </span>
          {wishStamp > 0 ? <span style={{ position: "absolute", right: 0, top: 30, padding: "6px 18px", border: "4px solid #b9a6ff", borderRadius: 12, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#9a8fb5", transform: `rotate(-8deg) scale(${lerp(2, 1, wishStamp)})`, opacity: Math.min(1, wishStamp * 1.5) }}>WISH</span> : null}
        </div>
        {/* 2 : précis */}
        <div style={{ position: "relative", height: 140, display: "flex", alignItems: "center" }}>
          <span style={{ position: "relative" }}>
            <Hand f={f} text="I want +€500 a month, by June." from={W.add} to={W.dlEnd} color={strike2 > 0.5 ? "#9a8fb5" : "#2a1270"} size={56} />
            <span style={{ position: "absolute", left: -6, right: -6, top: "55%", height: 4, background: "#7c3aed", transform: `scaleX(${strike2})`, transformOrigin: "0% 50%" }} />
          </span>
        </div>
        {/* 3 : au présent */}
        <div style={{ position: "relative", height: 280, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Hand f={f} text="I earn €500 more" from={W.present} to={W.as + 0.3} color="#5b21b6" size={64} />
          <Hand f={f} text="every month, since June." from={W.as + 0.3} to={W.trueEnd} color="#5b21b6" size={64} />
          {intStamp > 0 ? <span style={{ position: "absolute", right: -10, bottom: -20, padding: "8px 20px", borderRadius: 12, background: pillBg, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", transform: `rotate(-6deg) scale(${lerp(2, 1, intStamp)})`, opacity: Math.min(1, intStamp * 1.5), boxShadow: "0 0 20px rgba(139,92,246,0.7)" }}>INTENTION ✓</span> : null}
        </div>
        {/* chips nombre / échéance */}
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          {[
            { t: "+€500 / month", at: W.number },
            { t: "by June", at: W.deadline },
          ].map((c) => {
            const q = prog(f, T(c.at), T(c.at) + 10, eBack);
            return <span key={c.t} style={{ padding: "10px 20px", borderRadius: 999, background: "rgba(124,58,237,0.12)", border: "2px solid rgba(124,58,237,0.5)", fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#5b21b6", transform: `scale(${q})`, opacity: Math.min(1, q * 1.5) }}>{c.t}</span>;
          })}
        </div>
      </div>
      {/* stylo */}
      <svg width="200" height="200" viewBox="0 0 100 100" style={{ position: "absolute", left: penX, top: penY - 150 + (writing ? Math.sin(f / 2) * 6 : 0), opacity: Math.min(1, pen * 1.5) * paper, transform: `rotate(${lerp(40, 0, Math.min(1, pen))}deg)` }}>
        <g transform="rotate(35 50 50)">
          <rect x={44} y={0} width={14} height={70} rx={4} fill="#3b1d8f" stroke="#c4b5ff" strokeWidth={2} />
          <path d="M44 70 L58 70 L51 92 Z" fill="#e9e3ff" />
          <rect x={44} y={6} width={14} height={8} fill="#b9a6ff" />
        </g>
      </svg>
      {/* lire à voix haute ×3 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1590, display: "flex", justifyContent: "center", gap: 30, opacity: prog(f, T(W.read), T(W.read) + 8) }}>
        {reads.map((q, k) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 999, ...glass(q), transform: `scale(${0.85 + 0.15 * q})` }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round">
              <path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" opacity={0.4 + 0.6 * q} />
            </svg>
            <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: q > 0.5 ? "#fff" : C.muted }}>{k + 1}×</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- « the beginning of the method… eight areas of your life » ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.d[0]);
  const ring = (i: number) => prog(f, T(W.eight) + i * 2, T(W.eight) + i * 2 + 12, eBack);
  const R = 300;
  return (
    <AbsoluteFill style={sceneFx(f, "d")}>
      <Words
        f={f}
        top={230}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "This exercise is", at: W.this, kind: "muted", size: 104 }],
          [{ t: "the beginning", at: W.beginning, kind: "serif" }],
          [{ t: "of the method.", at: W.method0 - 0.1, kind: "bold" }],
        ]}
        exitAt={T(W.the) - 6}
      />
      {f >= T(W.the) - 8 ? (
        <Words
          f={f}
          top={230}
          size={84}
          lineGap={2}
          lines={[
            [{ t: "The full guide", at: W.full0, kind: "bold" }],
            [{ t: "teaches you to do it in", at: W.teaches, kind: "muted", size: 100 }],
            [{ t: "eight areas", at: W.eight, kind: "serif" }, { t: "of your life.", at: W.life - 0.15, kind: "bold" }],
          ]}
        />
      ) : null}
      <Orb cx={540} cy={1260} R={130} power={0.4 + 0.5 * prog(f, T(W.eight), T(W.lifeEnd))} flicker={0} />
      {/* la feuille au centre, les 8 domaines autour */}
      <div style={{ position: "absolute", left: 540 - 110, top: 1260 - 150, width: 220, height: 300, borderRadius: 16, background: "#fbf8f2", transform: `rotate(-3deg) scale(${lerp(0.6, 1, prog(f, st, st + 16, eOut))})`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", padding: 22, boxSizing: "border-box" }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 26, color: "#5b21b6", lineHeight: 1.3 }}>I earn €500 more every month, since June.</div>
      </div>
      {AREAS.map((a, i) => {
        const ang = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const q = ring(i);
        return (
          <div key={a} style={{ position: "absolute", left: 540 + Math.cos(ang) * R - 70, top: 1260 + Math.sin(ang) * R - 70, width: 140, height: 140, borderRadius: 34, ...glass(q), opacity: Math.min(1, q * 1.5), transform: `scale(${q})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Icon name={a} size={52} glow={0.4 + 0.6 * q} />
            <span style={{ ...serifGradient, fontSize: a.length > 9 ? 20 : 26 }}>{a}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.one, src: "chime1", vol: 0.2 },
  { at: 3.0, src: "whoosh", vol: 0.3 },
  { at: W.pen, src: "tick_low", vol: 0.25 },
  { at: W.sheet, src: "whoosh_soft", vol: 0.2 },
  ...Array.from({ length: 12 }, (_, i) => ({ at: W.one2 + i * 0.14, src: "tick", vol: 0.05 })),
  { at: W.precise, src: "chime2", vol: 0.2 },
  { at: W.number, src: "chime3", vol: 0.2 },
  { at: W.deadline, src: "chime3", vol: 0.2 },
  ...Array.from({ length: 14 }, (_, i) => ({ at: W.present + i * 0.15, src: "tick", vol: 0.05 })),
  { at: W.already, src: "shimmer", vol: 0.24 },
  { at: W.wish, src: "tick_low", vol: 0.28 },
  { at: W.intention, src: "chime5", vol: 0.26 },
  { at: W.intention, src: "sub", vol: 0.26 },
  { at: W.three, src: "chime1", vol: 0.16 },
  { at: W.three + 0.2, src: "chime2", vol: 0.16 },
  { at: W.three + 0.4, src: "chime3", vol: 0.16 },
  { at: 22.2, src: "whoosh", vol: 0.3 },
  ...Array.from({ length: 8 }, (_, i) => ({ at: W.eight + i * 0.067, src: "tick", vol: 0.1 })),
  { at: W.life, src: "shimmer", vol: 0.24 },
  { at: W.manifest - 0.05, src: "impact", vol: 0.42 },
  { at: W.with, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.35 },
  { at: 31.8, src: "whoosh", vol: 0.3 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} loop volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice-exercise.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
