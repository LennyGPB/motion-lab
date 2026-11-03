import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { SceneFinale } from "../signspath/SceneFinale";
import { C, loadFonts, SANS, SERIF, serifGradient } from "../signspath/theme";
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
const pillBg = "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))";

const WISH = "“I want more self-confidence.”";
const INTENT = "“I speak up in meetings, without fearing other people's judgment.”";
const typed = (f: number, txt: string, a: number, b: number) => txt.slice(0, Math.round(lerp(0, txt.length, prog(f, T(a), T(b), (x) => x))));

/** Tampon (WISH / INTENTION). */
const Stamp: React.FC<{ q: number; label: string; strong?: boolean }> = ({ q, label, strong }) =>
  q > 0 ? (
    <div style={{ position: "absolute", right: 30, top: -26, padding: "10px 24px", borderRadius: 14, fontFamily: SANS, fontWeight: 800, fontSize: 32, letterSpacing: "0.14em", color: strong ? "#fff" : "#b9b0d0", background: strong ? pillBg : "rgba(20,10,40,0.9)", border: strong ? "none" : "3px solid rgba(185,176,208,0.6)", boxShadow: strong ? "0 0 30px rgba(139,92,246,0.8)" : undefined, transform: `rotate(-6deg) scale(${lerp(2, 1, Math.min(1, q))})`, opacity: Math.min(1, q * 1.5) }}>
      {label}
    </div>
  ) : null;

/** Motion SignsPath #17 — « manifestation classique » vs « avec méthode ». */
export const Confidence: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.015 * Math.sin(f / 55)})` }}>
        {on(f, "compare") ? <SceneCompare f={f} /> : null}
        {on(f, "d") ? <SceneAnatomy f={f} /> : null}
        {on(f, "e") ? <SceneDifference f={f} /> : null}
        <Sequence from={T(SC.finale[0])} durationInFrames={DURATION_FRAMES - T(SC.finale[0])} name="finale">
          <SceneFinale
            timing={{
              manifest: W.manifest, with: W.with2, method: W.method2, not: W.not, by: W.by, chance: W.chance,
              full: W.full, signs: W.signs, path: W.path, dot: W.dot, comEnd: W.comEnd, cta: 24.7, from: T(SC.finale[0]),
            }}
          />
        </Sequence>
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- les deux versions, l'une au-dessus de l'autre ---------- */
const SceneCompare: React.FC<{ f: number }> = ({ f }) => {
  const top = prog(f, T(W.classic), T(W.classic) + 14, eOut);
  const bot = prog(f, T(W.manif2) - 2, T(W.manif2) + 14, eOut);
  const dimTop = prog(f, T(W.manif2), T(W.manif2) + 16, eInOut);
  const wish = prog(f, T(W.wish), T(W.wish) + 10, eBack);
  const intent = prog(f, T(W.intention), T(W.intention) + 10, eBack);
  const jx = (hash(f) - 0.5) * 4 * (1 - dimTop * 0.5);
  return (
    <AbsoluteFill style={sceneFx(f, "compare")}>
      {/* carte 1 : manifestation classique */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 260, opacity: top * (1 - 0.35 * dimTop), transform: `translate(${jx}px, ${(1 - top) * 40}px) scale(${1 - 0.06 * dimTop})` }}>
        <div style={{ textAlign: "center", ...capsStyle, marginBottom: 22 }}>
          <span style={{ opacity: prog(f, T(W.classic), T(W.classic) + 8) }}>classic</span> <span style={{ opacity: prog(f, T(W.manifestation), T(W.manifestation) + 8) }}>manifestation</span>
        </div>
        <div style={{ position: "relative", padding: "50px 46px", borderRadius: 38, background: "rgba(40,30,70,0.55)", border: "1.5px dashed rgba(200,190,230,0.35)", filter: `blur(${1 + 0.8 * Math.sin(f / 6)}px) saturate(0.5)`, minHeight: 170 }}>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 66, color: "rgba(225,215,245,0.8)" }}>{typed(f, WISH, W.i, W.confEnd)}</span>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} style={{ position: "absolute", left: 80 + i * 220, top: 10 + hash(i) * 40, fontFamily: SERIF, fontStyle: "italic", fontSize: 50, color: "rgba(207,194,255,0.35)", opacity: prog(f, T(W.confEnd), T(W.confEnd) + 10) }}>?</span>
          ))}
        </div>
        <Stamp q={wish} label="WISH" />
      </div>
      {/* « vs » */}
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 70, color: C.lilacSoft, opacity: bot }}>vs</div>
      {/* carte 2 : manifestation avec méthode */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 880, opacity: bot, transform: `translateY(${(1 - bot) * 60}px)` }}>
        <div style={{ textAlign: "center", ...capsStyle, color: C.lilacSoft, marginBottom: 22 }}>manifestation with method</div>
        <div style={{ position: "relative", padding: "50px 46px", borderRadius: 38, ...glass(0.5 + 0.5 * intent), minHeight: 320 }}>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 66, lineHeight: 1.2, color: "#fff" }}>{typed(f, INTENT, W.i2, W.judgEnd)}</span>
          <Stamp q={intent} label="INTENTION ✓" strong />
        </div>
      </div>
      <Orb cx={540} cy={1560} R={110} power={0.3 + 0.6 * intent} flicker={0.4 * (1 - bot)} />
      {/* sous-titres « The first is a wish. The second is an intention. » */}
      <Words
        f={f}
        top={1640}
        size={60}
        lineGap={0}
        lines={[[{ t: "The first is a", at: W.the, kind: "muted", size: 80 }, { t: "wish.", at: W.wish, kind: "serif" }, { t: "The second is an", at: W.the2, kind: "muted", size: 80 }, { t: "intention.", at: W.intention, kind: "serif" }]]}
      />
    </AbsoluteFill>
  );
};

/* ---------- situation · action · résultat vérifiable ---------- */
const PARTS = [
  { k: "situation", t: "in meetings", at: W.situation, word: W.specific },
  { k: "action", t: "I speak up", at: W.action, word: W.an },
  { k: "result you can check", t: "without fearing judgment", at: W.result, word: W.a2 },
];
const SceneAnatomy: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.d[0]);
  const card = prog(f, st + 2, st + 14, eOut);
  const cur = f < T(W.an) - 3 ? 0 : f < T(W.a2) - 3 ? 1 : 2;
  const seg = (txt: string, k: number) => {
    const lit = f >= T(PARTS[k].word) - 3;
    return <span style={{ padding: "2px 8px", borderRadius: 10, background: lit ? (k === cur ? "rgba(167,139,250,0.55)" : "rgba(167,139,250,0.25)") : "transparent", boxShadow: lit && k === cur ? "0 0 20px rgba(167,139,250,0.7)" : undefined }}>{txt}</span>;
  };
  return (
    <AbsoluteFill style={sceneFx(f, "d")}>
      <Words
        f={f}
        top={220}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "A specific", at: W.a, kind: "muted", size: 104 }, { t: "situation.", at: W.situation, kind: "serif" }],
          [{ t: "An", at: W.an, kind: "muted", size: 104 }, { t: "action.", at: W.action, kind: "bold" }],
          [{ t: "A result", at: W.a2, kind: "muted", size: 104 }, { t: "you can check.", at: W.result + 0.56, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 80, right: 80, top: 760, padding: "46px 44px", borderRadius: 38, ...glass(0.7), opacity: card, transform: `translateY(${(1 - card) * 40}px)` }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 64, lineHeight: 1.35, color: "#fff" }}>
          “{seg("I speak up", 1)} {seg("in meetings", 0)}, {seg("without fearing other people's judgment", 2)}.”
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        {PARTS.map((p, i) => {
          const q = prog(f, T(p.at) - 2, T(p.at) + 12, eBack);
          return (
            <div key={p.k} style={{ display: "flex", alignItems: "center", gap: 22, opacity: Math.min(1, q * 1.5), transform: `translateX(${(1 - Math.min(1, q)) * 80}px)` }}>
              <span style={{ ...capsStyle, fontSize: 22, width: 330, textAlign: "right", color: i === cur ? C.lilacSoft : C.muted }}>{i === 2 ? "✓ " : ""}{p.k}</span>
              <span style={{ padding: "14px 28px", borderRadius: 999, background: pillBg, boxShadow: "0 0 30px rgba(139,92,246,0.7)", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#fff", whiteSpace: "nowrap" }}>{p.t}</span>
            </div>
          );
        })}
      </div>
      {f >= T(W.check) ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1560, display: "flex", justifyContent: "center", gap: 18, opacity: prog(f, T(W.check), T(W.check) + 8) }}>
          {["mon", "tue", "wed"].map((d, i) => (
            <div key={d} style={{ padding: "12px 22px", borderRadius: 18, ...glass(0.8), fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#fff", transform: `scale(${prog(f, T(W.check) + i * 3, T(W.check) + i * 3 + 8, eBack)})` }}>{d} ✓</div>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- « That's the difference that changes everything. » ---------- */
const SceneDifference: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.e[0]);
  const q = prog(f, st + 2, st + 16, eOut);
  const arrow = prog(f, T(W.changes), T(W.everything) + 6, eInOut);
  return (
    <AbsoluteFill style={sceneFx(f, "e")}>
      <Words
        f={f}
        top={300}
        size={88}
        lineGap={2}
        lines={[
          [{ t: "That's the", at: W.thats, kind: "muted", size: 110 }, { t: "difference", at: W.difference, kind: "serif" }],
          [{ t: "that changes", at: W.changes - 0.15, kind: "bold" }],
          [{ t: "everything.", at: W.everything, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, opacity: q }}>
        <div style={{ width: 320, height: 380, borderRadius: 36, background: "rgba(40,30,70,0.55)", border: "1.5px dashed rgba(200,190,230,0.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, filter: "blur(2px)", opacity: 0.75 }}>
          <span style={capsStyle}>wish</span>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.muted, textAlign: "center", padding: "0 20px" }}>“more confidence”</span>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 80, color: C.muted }}>?</span>
        </div>
        <svg width="110" height="60" viewBox="0 0 110 60" style={{ opacity: arrow }}>
          <path d={`M 5 30 L ${5 + 95 * arrow} 30`} stroke={C.lilacSoft} strokeWidth={6} strokeLinecap="round" />
          <path d={`M ${80 * arrow + 20} 12 L ${100 * arrow} 30 L ${80 * arrow + 20} 48`} stroke={C.lilacSoft} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ width: 320, height: 380, borderRadius: 36, ...glass(1), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: `scale(${lerp(0.9, 1.04, arrow)})` }}>
          <span style={{ ...capsStyle, color: C.lilacSoft }}>intention</span>
          <span style={{ ...serifGradient, fontSize: 52, textAlign: "center" }}>I speak up</span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#fff" }}>in meetings</span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#fff" }}>without fear</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.manifestation, src: "chime1", vol: 0.16 },
  ...Array.from({ length: 10 }, (_, i) => ({ at: W.i + i * 0.17, src: "tick", vol: 0.05 })),
  { at: W.manif2, src: "whoosh_soft", vol: 0.2 },
  { at: W.method, src: "chime3", vol: 0.22 },
  ...Array.from({ length: 16 }, (_, i) => ({ at: W.i2 + i * 0.22, src: "tick", vol: 0.05 })),
  { at: W.wish, src: "tick_low", vol: 0.3 },
  { at: W.intention, src: "chime5", vol: 0.26 },
  { at: W.intention, src: "sub", vol: 0.24 },
  { at: 14.1, src: "whoosh", vol: 0.3 },
  { at: W.situation, src: "chime1", vol: 0.2 },
  { at: W.action, src: "chime2", vol: 0.2 },
  { at: W.result, src: "chime3", vol: 0.2 },
  { at: W.check, src: "shimmer", vol: 0.22 },
  { at: 18.9, src: "whoosh", vol: 0.3 },
  { at: W.difference, src: "chime6", vol: 0.24 },
  { at: W.everything, src: "sub", vol: 0.28 },
  { at: W.manifest - 0.05, src: "impact", vol: 0.42 },
  { at: W.with2, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.35 },
  { at: 24.6, src: "whoosh", vol: 0.3 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} loop volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice-confidence.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
