import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { GlassCard } from "../signspath/Card";
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
const pill: React.CSSProperties = { padding: "12px 26px", borderRadius: 999, background: "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))", boxShadow: "0 0 40px rgba(139,92,246,0.8)", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#fff", whiteSpace: "nowrap" };

/** Motion SignsPath #12 — « une vraie intention a un chiffre, une échéance, un chemin ». */
export const Intention: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.015 * Math.sin(f / 55)})` }}>
        {on(f, "a") ? <SceneA f={f} /> : null}
        {on(f, "b") ? <SceneB f={f} /> : null}
        {on(f, "c") ? <SceneC f={f} /> : null}
        {on(f, "d") ? <SceneD f={f} /> : null}
        {on(f, "e") ? <SceneE f={f} /> : null}
        {on(f, "f") ? <SceneF f={f} /> : null}
        <Sequence from={T(SC.finale[0])} durationInFrames={DURATION_FRAMES - T(SC.finale[0])} name="finale">
          <SceneFinale
            timing={{
              manifest: W.manifest, with: W.with, method: W.method, not: W.not, by: W.by, chance: W.chance,
              full: W.full, signs: W.signs, path: W.path, dot: W.dot, comEnd: W.comEnd, cta: 24.62, from: T(SC.finale[0]),
            }}
          />
        </Sequence>
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : « What's your biggest intention right now? » ---------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const card = prog(f, T(W.intention), T(W.intention) + 14, eBack);
  return (
    <AbsoluteFill style={sceneFx(f, "a")}>
      <Orb cx={540} cy={1250} R={170} power={0.4 + 0.3 * prog(f, 0, 40)} flicker={0} />
      <Words
        f={f}
        top={300}
        size={88}
        lineGap={2}
        lines={[
          [{ t: "What's your", at: W.whats, kind: "muted", size: 110 }],
          [{ t: "biggest", at: W.biggest, kind: "bold" }],
          [{ t: "intention", at: W.intention, kind: "serif" }],
          [{ t: "right now?", at: W.right, kind: "bold" }],
        ]}
      />
      <div style={{ position: "absolute", left: 150, right: 150, top: 1180, height: 140, borderRadius: 36, ...glass(0.5), opacity: Math.min(1, card * 1.5), transform: `scale(${card})`, display: "flex", alignItems: "center", padding: "0 40px", gap: 16 }}>
        <span style={{ ...capsStyle, fontSize: 22 }}>my intention:</span>
        <span style={{ width: 3, height: 56, background: C.lilacSoft, opacity: Math.floor(f / 10) % 2 ? 1 : 0.15 }} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B : « Careful. "I want more money" isn't an intention. It's a wish. » ---------- */
const DUST = Array.from({ length: 60 }, (_, i) => ({ x: hash(i) * 700 - 350, y: hash(i + 2) * 120 - 60, v: 0.5 + hash(i + 4), s: 3 + hash(i + 6) * 4 }));
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const quote = prog(f, T(W.i) - 2, T(W.i) + 12, eOut);
  const strike = prog(f, T(W.isnt), T(W.int2End), eInOut);
  const wish = prog(f, T(W.wish) - 2, T(W.wishEnd) + 8, eOut);
  const jx = (hash(f) - 0.5) * 6;
  return (
    <AbsoluteFill style={sceneFx(f, "b")}>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: prog(f, T(W.careful) - 2, T(W.careful) + 8) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 30px", borderRadius: 999, border: "2px solid rgba(255,190,200,0.6)", background: "rgba(80,20,60,0.4)", fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: "0.2em", color: "#ffd6de", transform: `scale(${1 + 0.08 * Math.sin((f - T(W.careful)) / 3) * Math.exp(-(f - T(W.careful)) / 15)})` }}>
          ⚠ CAREFUL
        </div>
      </div>
      {/* le souhait vague */}
      <div style={{ position: "absolute", left: 120 + jx, right: 120 - jx, top: 520, height: 200, borderRadius: 36, ...glass(0.2), opacity: quote * (1 - wish), transform: `scale(${lerp(0.9, 1, quote)})`, filter: `blur(${1.2 + Math.sin(f / 5)}px)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ position: "relative", fontFamily: SERIF, fontStyle: "italic", fontSize: 92, color: "rgba(225,215,255,0.75)" }}>
          “I want more money”
          <span style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 6, borderRadius: 3, background: C.lilacSoft, transform: `scaleX(${strike})`, transformOrigin: "0% 50%", boxShadow: "0 0 18px rgba(200,170,255,0.9)" }} />
        </span>
      </div>
      {/* qui s'envole comme un vœu */}
      {DUST.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: 540 + d.x * (1 + wish * 0.4), top: 620 + d.y - wish * 400 * d.v, width: d.s, height: d.s, borderRadius: "50%", background: "#efe6ff", boxShadow: "0 0 8px #c8b0ff", opacity: wish * (1 - wish) * 3 }} />
      ))}
      <Words
        f={f}
        top={820}
        size={90}
        lineGap={4}
        lines={[
          [{ t: "isn't an", at: W.isnt, kind: "muted", size: 110 }, { t: "intention.", at: W.intention2, kind: "bold" }],
          [{ t: "It's a", at: W.its, kind: "muted", size: 110 }, { t: "wish.", at: W.wish, kind: "serif" }],
        ]}
      />
      <Orb cx={540} cy={1420} R={110} power={0.25 + 0.4 * wish} flicker={0.5 * (1 - wish)} />
    </AbsoluteFill>
  );
};

/* ---------- C : « A real intention has a number, a deadline, and a path. » ---------- */
const CARDS = [
  { icon: "money", kicker: "a", label: "number", at: W.number },
  { icon: "clock", kicker: "a", label: "deadline", at: W.deadline },
  { icon: "technique", kicker: "a", label: "path", at: W.path0 },
];
const SceneC: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={sceneFx(f, "c")}>
    <Words
      f={f}
      top={300}
      size={88}
      lineGap={2}
      lines={[
        [{ t: "A", at: W.a2, kind: "muted", size: 110 }, { t: "real", at: W.real, kind: "bold" }, { t: "intention", at: W.intention3, kind: "serif" }],
        [{ t: "has a", at: W.has, kind: "muted", size: 110 }, { t: "number,", at: W.number, kind: "bold" }],
        [{ t: "a", at: W.a3, kind: "muted", size: 110 }, { t: "deadline,", at: W.deadline, kind: "bold" }],
        [{ t: "and a", at: W.and, kind: "muted", size: 110 }, { t: "path.", at: W.path0, kind: "serif" }],
      ]}
    />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", gap: 26 }}>
      {CARDS.map((c, i) => {
        const q = prog(f, T(c.at) - 2, T(c.at) + 14, eBack);
        const act = prog(f, T(c.at), T(c.at) + 8);
        return (
          <div key={c.label} style={{ perspective: 1200, opacity: Math.min(1, q * 1.5), transform: `rotateY(${(1 - q) * 70}deg) translateY(${(1 - q) * 60 - act * 10}px)` }}>
            <GlassCard icon={c.icon} kicker={c.kicker} label={c.label} active={act} w={290} h={380} labelSize={54} />
            <div style={{ textAlign: "center", marginTop: 18, ...capsStyle, fontSize: 22, opacity: act }}>{["how much", "by when", "how"][i]}</div>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

/* ---------- D : la version précise ---------- */
const CHIPS = [
  { t: "+€500 / month", k: "number", at: W.five, x: 0 },
  { t: "within 3 months", k: "deadline", at: W.within, x: 1 },
  { t: "through a skill", k: "path", at: W.through, x: 2 },
];
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.d[0]);
  const card = prog(f, st + 2, st + 16, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "d")}>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: card }}>the precise version</div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 300, padding: "50px 50px", borderRadius: 44, ...glass(0.45), opacity: card, transform: `translateY(${(1 - card) * 40}px)` }}>
        <Words
          f={f}
          top={0}
          size={74}
          lineGap={6}
          style={{ position: "relative", left: 0, right: 0 }}
          lines={[
            [{ t: "“I earn", at: W.i2, kind: "bold" }, { t: "€500 more", at: W.five, kind: "serif" }],
            [{ t: "per month", at: W.per, kind: "bold" }],
            [{ t: "within", at: W.within, kind: "muted", size: 100 }, { t: "three months,", at: W.three, kind: "serif" }],
            [{ t: "through a skill", at: W.through, kind: "bold" }],
            [{ t: "I'm developing.”", at: W.developing, kind: "serif" }],
          ]}
        />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        {CHIPS.map((c) => {
          const q = prog(f, T(c.at), T(c.at) + 12, eBack);
          return (
            <div key={c.k} style={{ display: "flex", alignItems: "center", gap: 20, opacity: Math.min(1, q * 1.5), transform: `translateX(${(1 - q) * 80}px)` }}>
              <span style={{ ...capsStyle, width: 200, textAlign: "right", fontSize: 22 }}>✓ {c.k}</span>
              <span style={{ ...pill, transform: `scale(${q})` }}>{c.t}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- E : « That's the difference. » ---------- */
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.e[0]);
  const q = prog(f, st + 2, st + 14, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "e")}>
      <Words f={f} top={360} size={90} lines={[[{ t: "That's the", at: W.thats, kind: "muted", size: 110 }], [{ t: "difference.", at: W.difference, kind: "serif" }]]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", gap: 40, opacity: q }}>
        <div style={{ width: 360, height: 420, borderRadius: 40, ...glass(0.1), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, filter: "blur(2.5px)", opacity: 0.7 }}>
          <span style={capsStyle}>wish</span>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 56, color: C.muted, textAlign: "center" }}>“more money”</span>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 90, color: C.muted }}>?</span>
        </div>
        <div style={{ width: 360, height: 420, borderRadius: 40, ...glass(1), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, transform: `scale(${lerp(0.9, 1.04, q)})` }}>
          <span style={{ ...capsStyle, color: C.lilacSoft }}>intention</span>
          <span style={{ ...serifGradient, fontSize: 60 }}>+€500</span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.white }}>in 3 months</span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.white }}>via a skill</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- F : « Write your intention in the comments… precise version. » ---------- */
const SceneF: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.f[0]);
  const box = prog(f, st + 4, st + 18, eBack);
  const msg = "I earn +€500/month within 3 months through UX design.";
  const typed = msg.slice(0, Math.round(lerp(0, msg.length, prog(f, T(W.comments), T(W.version) + 6, (x) => x))));
  const precise = prog(f, T(W.precise), T(W.precise) + 10, eBack);
  const heart = prog(f, T(W.version) + 8, T(W.version) + 16, eBack);
  return (
    <AbsoluteFill style={sceneFx(f, "f")}>
      <Words
        f={f}
        top={260}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "So", at: W.so, kind: "muted", size: 110 }, { t: "write", at: W.write, kind: "bold" }, { t: "your intention", at: W.your2, kind: "serif" }],
          [{ t: "in the comments,", at: W.comments - 0.1, kind: "bold" }],
          [{ t: "but in its", at: W.but, kind: "muted", size: 110 }],
          [{ t: "precise version.", at: W.precise, kind: "serif" }],
        ]}
      />
      {/* faux fil de commentaires */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 1060, padding: "34px 36px", borderRadius: 36, ...glass(0.4), opacity: Math.min(1, box * 1.5), transform: `scale(${lerp(0.9, 1, box)})` }}>
        <div style={{ ...capsStyle, fontSize: 20, marginBottom: 22 }}>comments</div>
        <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg, #b9a6ff, #7c3aed)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.white }}>you</div>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 38, lineHeight: 1.35, color: "#f0ebff", minHeight: 104 }}>
              {typed}
              <span style={{ display: "inline-block", width: 3, height: 36, marginLeft: 3, background: C.lilacSoft, opacity: typed.length < msg.length && Math.floor(f / 8) % 2 ? 1 : 0 }} />
            </div>
          </div>
          <div style={{ fontSize: 44, transform: `scale(${1 + 0.4 * heart * Math.exp(-(f - T(W.version) - 8) / 6)})`, color: heart > 0.5 ? "#ff7aa8" : "rgba(225,215,255,0.4)" }}>♥</div>
        </div>
      </div>
      {precise > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1450, display: "flex", justifyContent: "center", opacity: Math.min(1, precise * 2) }}>
          <div style={{ ...pill, transform: `scale(${precise})` }}>✓ number · deadline · path</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.intention, src: "chime1", vol: 0.2 },
  { at: 2.3, src: "whoosh", vol: 0.3 },
  { at: W.careful, src: "tick_low", vol: 0.3 },
  { at: W.isnt + 0.3, src: "freeze", vol: 0.18 },
  { at: W.wish, src: "shimmer", vol: 0.3 },
  { at: 7.1, src: "whoosh", vol: 0.3 },
  { at: W.number, src: "chime1", vol: 0.22 },
  { at: W.deadline, src: "chime2", vol: 0.22 },
  { at: W.path0, src: "chime3", vol: 0.22 },
  { at: 11.25, src: "whoosh", vol: 0.3 },
  { at: W.five, src: "chime5", vol: 0.22 },
  { at: W.within, src: "chime6", vol: 0.2 },
  { at: W.through, src: "chime3", vol: 0.2 },
  { at: 16.2, src: "whoosh", vol: 0.3 },
  { at: W.difference, src: "sub", vol: 0.3 },
  { at: W.difference, src: "chime5", vol: 0.24 },
  { at: 17.7, src: "whoosh", vol: 0.3 },
  ...Array.from({ length: 14 }, (_, i) => ({ at: W.comments + i * 0.14, src: "tick", vol: 0.06 })),
  { at: W.precise, src: "chime6", vol: 0.24 },
  { at: W.manifest - 0.05, src: "impact", vol: 0.42 },
  { at: W.with, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.35 },
  { at: 24.55, src: "whoosh", vol: 0.3 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74, 0.86, 0.98].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice-intention.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
