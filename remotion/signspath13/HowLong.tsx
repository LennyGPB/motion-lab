import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { GlassCard } from "../signspath/Card";
import { SceneFinale } from "../signspath/SceneFinale";
import { C, loadFonts, SANS, SERIF } from "../signspath/theme";
import { clamp, eBack, eIn, eInOut, eOut, lerp, prog } from "../signspath/util";
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

/** Motion SignsPath #13 — « depuis combien de temps manifestes-tu ? ». */
export const HowLong: React.FC = () => {
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
        <Sequence from={T(SC.finale[0])} durationInFrames={DURATION_FRAMES - T(SC.finale[0])} name="finale">
          <SceneFinale
            timing={{
              manifest: W.manifest, with: W.with, method: W.method, not: W.not2, by: W.by, chance: W.chance,
              full: W.full, signs: W.signs, path: W.path, dot: W.dot, comEnd: W.comEnd, cta: 23.7, from: T(SC.finale[0]),
            }}
          />
        </Sequence>
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : sondage « a few days / a few months / years » ---------- */
const OPTS = [
  { t: "A few days", at: W.few, pct: 34 },
  { t: "A few months", at: W.few2, pct: 41 },
  { t: "Years", at: W.years, pct: 25 },
];
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const card = prog(f, T(W.manifesting), T(W.manifesting) + 14, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "a")}>
      <Words
        f={f}
        top={280}
        size={88}
        lineGap={2}
        lines={[
          [{ t: "How long", at: W.how, kind: "bold" }],
          [{ t: "have you been", at: W.have, kind: "muted", size: 110 }],
          [{ t: "manifesting?", at: W.manifesting, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 120, right: 120, top: 900, padding: "40px 40px", borderRadius: 40, ...glass(0.4), opacity: card, transform: `translateY(${(1 - card) * 40}px)` }}>
        <div style={{ ...capsStyle, fontSize: 22, marginBottom: 26 }}>poll · tap your answer</div>
        {OPTS.map((o, i) => {
          const q = prog(f, T(o.at) - 2, T(o.at) + 14, eOut);
          const lit = f >= T(o.at) - 2 && (i === OPTS.length - 1 || f < T(OPTS[i + 1].at) - 2);
          return (
            <div key={o.t} style={{ position: "relative", height: 104, marginBottom: i < 2 ? 18 : 0, borderRadius: 26, overflow: "hidden", border: `1.5px solid rgba(225,215,255,${lit ? 0.7 : 0.2})`, boxShadow: lit ? "0 0 30px rgba(150,110,255,0.6)" : undefined }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${o.pct * q}%`, background: lit ? "linear-gradient(90deg, rgba(167,139,250,0.9), rgba(124,58,237,0.7))" : "rgba(167,139,250,0.3)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", fontFamily: SANS, fontWeight: 800, fontSize: 42, color: "#fff", opacity: 0.4 + 0.6 * q }}>
                <span>{o.t}?</span>
                <span style={{ fontSize: 34, color: C.lilacSoft }}>{Math.round(o.pct * q)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B : « nobody tells you… it's not the duration » ---------- */
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.b[0]);
  const bar = prog(f, st + 4, T(W.duration) + 6, eInOut);
  const strike = prog(f, T(W.matters) - 4, T(W.mattersEnd), eInOut);
  return (
    <AbsoluteFill style={sceneFx(f, "b")}>
      <Words
        f={f}
        top={300}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "Here's what", at: W.heres, kind: "muted", size: 110 }],
          [{ t: "nobody", at: W.nobody, kind: "serif" }, { t: "tells you.", at: W.tells, kind: "bold" }],
          [{ t: "It's not the", at: W.its, kind: "muted", size: 110 }],
          [{ t: "duration", at: W.duration, kind: "serif" }, { t: "that matters.", at: W.that, kind: "bold" }],
        ]}
      />
      {/* frise de durée, barrée */}
      <div style={{ position: "absolute", left: 140, right: 140, top: 1260, opacity: prog(f, st, st + 12) * (1 - 0.5 * strike) }}>
        <div style={{ position: "relative", height: 28, borderRadius: 14, background: "rgba(225,215,255,0.12)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${bar * 100}%`, borderRadius: 14, background: "linear-gradient(90deg, rgba(185,166,255,0.5), rgba(124,58,237,0.8))" }} />
          <div style={{ position: "absolute", left: -10, right: -10, top: 10, height: 8, borderRadius: 4, background: "#fff", transform: `scaleX(${strike}) rotate(-2deg)`, transformOrigin: "0% 50%", boxShadow: "0 0 18px rgba(255,255,255,0.8)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, ...capsStyle, fontSize: 22 }}>
          <span>days</span>
          <span>months</span>
          <span>years</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1440, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 80, color: "rgba(207,194,255,0.7)", opacity: strike }}>≠ results</div>
    </AbsoluteFill>
  );
};

/* ---------- C : clarté + régularité ---------- */
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const c1 = prog(f, T(W.clarity) - 2, T(W.clarity) + 14, eBack);
  const c2 = prog(f, T(W.consistency) - 2, T(W.consistency) + 14, eBack);
  const both = prog(f, T(W.practice), T(W.practiceEnd), eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "c")}>
      <Words
        f={f}
        top={280}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "It's the", at: W.its2, kind: "muted", size: 110 }, { t: "clarity", at: W.clarity, kind: "serif" }],
          [{ t: "of your", at: W.of, kind: "muted", size: 110 }, { t: "intention,", at: W.intention, kind: "bold" }],
          [{ t: "and the", at: W.and, kind: "muted", size: 110 }, { t: "consistency", at: W.consistency, kind: "serif" }],
          [{ t: "of your", at: W.of2, kind: "muted", size: 110 }, { t: "practice.", at: W.practice, kind: "bold" }],
        ]}
      />
      <Orb cx={540} cy={1260} R={130} power={0.3 + 0.8 * both} flicker={0} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", alignItems: "center", gap: 120 }}>
        {[
          { c: c1, icon: "intention", kicker: "clear", label: "intention" },
          { c: c2, icon: "day", kicker: "consistent", label: "practice" },
        ].map((x, i) => (
          <div key={i} style={{ perspective: 1200, opacity: Math.min(1, x.c * 1.5), transform: `rotateY(${(1 - x.c) * (i ? -70 : 70)}deg) translateY(${(1 - x.c) * 50}px)` }}>
            <GlassCard icon={x.icon} kicker={x.kicker} label={x.label} active={Math.min(1, x.c) * (0.5 + 0.5 * both)} w={300} h={400} labelSize={56} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1500, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 70, color: C.lilacSoft, opacity: both }}>+</div>
    </AbsoluteFill>
  );
};

/* ---------- D : 3 min chaque jour > 1 h par semaine ---------- */
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.d[0]);
  const grid = prog(f, st + 2, st + 14, eOut);
  const lit = (i: number) => prog(f, T(W.every) + i * 3, T(W.every) + i * 3 + 8, eBack);
  const win = prog(f, T(W.beat) - 2, T(W.beat) + 10, eOut);
  const row2 = prog(f, T(W.one) - 2, T(W.one) + 10, eBack);
  const X = (i: number) => 150 + i * 130;
  return (
    <AbsoluteFill style={sceneFx(f, "d")}>
      <Words
        f={f}
        top={280}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "Three minutes", at: W.three, kind: "bold" }],
          [{ t: "every day", at: W.every, kind: "serif" }],
          [{ t: "beat", at: W.beat, kind: "bold" }, { t: "one hour a week.", at: W.one, kind: "muted", size: 104 }],
        ]}
      />
      <div style={{ position: "absolute", left: 105, top: 940, ...capsStyle, opacity: grid, color: win > 0.5 ? C.lilacSoft : C.muted }}>3 min · every day</div>
      {DAYS.map((d, i) => {
        const q = lit(i);
        return (
          <div key={i} style={{ position: "absolute", left: X(i) - 45, top: 1010, width: 90, height: 90, borderRadius: 24, ...glass(q * (0.6 + 0.4 * win)), opacity: grid, transform: `scale(${0.8 + 0.2 * q})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: q > 0.5 ? "#fff" : C.muted }}>
            {d}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 105, top: 1180, ...capsStyle, opacity: row2 * (1 - 0.5 * win) }}>1 hour · once a week</div>
      {DAYS.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: X(i) - 45, top: 1250, width: 90, height: i === 6 ? 200 : 90, borderRadius: 24, border: i === 6 ? "1.5px solid rgba(225,215,255,0.4)" : "2px dashed rgba(225,215,255,0.15)", background: i === 6 ? "rgba(124,58,237,0.35)" : "transparent", opacity: row2 * 0.8, transform: i === 6 ? `scaleY(${row2})` : undefined, transformOrigin: "50% 0%" }} />
      ))}
      {win > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1540, display: "flex", justifyContent: "center", opacity: Math.min(1, win * 2) }}>
          <div style={{ ...pill, transform: `scale(${lerp(0.7, 1, win)})` }}>consistency wins</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- E : « Tell me in the comments… » ---------- */
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.e[0]);
  const box = prog(f, st + 4, st + 18, eBack);
  const msg = "3 months, 3 min every morning. I finally keep my promises to myself.";
  const typed = msg.slice(0, Math.round(lerp(0, msg.length, prog(f, T(W.comments), T(W.changedEnd) + 4, (x) => x))));
  const heart = prog(f, T(W.changed) + 8, T(W.changed) + 16, eBack);
  return (
    <AbsoluteFill style={sceneFx(f, "e")}>
      <Words
        f={f}
        top={260}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "Tell me", at: W.tell, kind: "bold" }, { t: "in the comments", at: W.comments, kind: "serif", size: 70 }],
          [{ t: "how long you've", at: W.how2, kind: "muted", size: 110 }],
          [{ t: "been practicing,", at: W.practicing, kind: "bold" }],
          [{ t: "and", at: W.and2, kind: "muted", size: 110 }, { t: "what changed.", at: W.what2, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 90, right: 90, top: 1060, padding: "34px 36px", borderRadius: 36, ...glass(0.4), opacity: Math.min(1, box * 1.5), transform: `scale(${lerp(0.9, 1, box)})` }}>
        <div style={{ ...capsStyle, fontSize: 20, marginBottom: 22 }}>comments</div>
        <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg, #b9a6ff, #7c3aed)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.white }}>you</div>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 38, lineHeight: 1.35, color: "#f0ebff", minHeight: 156 }}>
              {typed}
              <span style={{ display: "inline-block", width: 3, height: 36, marginLeft: 3, background: C.lilacSoft, opacity: typed.length < msg.length && Math.floor(f / 8) % 2 ? 1 : 0 }} />
            </div>
          </div>
          <div style={{ fontSize: 44, transform: `scale(${1 + 0.4 * heart * Math.exp(-(f - T(W.changed) - 8) / 6)})`, color: heart > 0.5 ? "#ff7aa8" : "rgba(225,215,255,0.4)" }}>♥</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.manifesting, src: "chime1", vol: 0.2 },
  { at: W.few, src: "tick", vol: 0.14 },
  { at: W.few2, src: "tick", vol: 0.14 },
  { at: W.years, src: "tick", vol: 0.14 },
  { at: 4.8, src: "whoosh", vol: 0.3 },
  { at: W.nobody, src: "whoosh_soft", vol: 0.14 },
  { at: W.matters - 0.1, src: "tick_low", vol: 0.3 },
  { at: 9.35, src: "whoosh", vol: 0.3 },
  { at: W.clarity, src: "chime2", vol: 0.22 },
  { at: W.consistency, src: "chime3", vol: 0.22 },
  { at: W.practice, src: "shimmer", vol: 0.24 },
  { at: 13.6, src: "whoosh", vol: 0.3 },
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ at: W.every + i * 0.1, src: "tick", vol: 0.12 })),
  { at: W.beat, src: "chime6", vol: 0.25 },
  { at: 16.85, src: "whoosh", vol: 0.3 },
  ...Array.from({ length: 16 }, (_, i) => ({ at: W.comments + i * 0.17, src: "tick", vol: 0.05 })),
  { at: W.changed + 0.3, src: "chime5", vol: 0.22 },
  { at: W.manifest - 0.05, src: "impact", vol: 0.42 },
  { at: W.with, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.35 },
  { at: 23.6, src: "whoosh", vol: 0.3 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74, 0.86].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice-howlong.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

