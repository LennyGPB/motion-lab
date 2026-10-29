import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { GlassCard } from "../signspath/Card";
import { SceneFinale } from "../signspath/SceneFinale";
import { C, loadFonts, SANS, serifGradient } from "../signspath/theme";
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
const pill: React.CSSProperties = {
  padding: "12px 26px",
  borderRadius: 999,
  background: "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))",
  boxShadow: "0 0 40px rgba(139,92,246,0.8)",
  fontFamily: SANS,
  fontWeight: 800,
  fontSize: 36,
  color: "#fff",
  whiteSpace: "nowrap",
};

/** Motion SignsPath #6 — "In a year" (1080x1920). */
export const OneYear: React.FC = () => {
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
              full: W.full, signs: W.signs, path: W.path, dot: W.dot, comEnd: W.comEnd, cta: 17.98, from: T(SC.finale[0]),
            }}
          />
        </Sequence>
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : "In a year, you'll be glad you started today." ---------- */
const LINE = { x0: 150, x1: 930, y: 1300 };
const MONTHS = "JFMAMJJASOND".split("");
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const draw = prog(f, T(W.year) - 2, T(W.glad), eInOut);
  const travel = prog(f, T(W.glad), T(W.todayEnd), eInOut);
  const glad = f >= T(W.todayEnd) - 6 ? prog(f, T(W.todayEnd) - 6, T(W.todayEnd) + 10, eOut) : 0;
  const startPulse = f >= T(W.today) ? Math.exp(-(f - T(W.today)) / 10) : 0;
  const x = lerp(LINE.x0, LINE.x1, travel);
  return (
    <AbsoluteFill style={sceneFx(f, "a")}>
      <Orb cx={LINE.x1} cy={LINE.y} R={90} power={0.2 * draw + 0.9 * glad} flicker={0} />
      <Words
        f={f}
        top={240}
        size={86}
        lineGap={0}
        lines={[
          [{ t: "In a year,", at: W.in, kind: "serif" }],
          [{ t: "you'll be", at: W.youll, kind: "muted", size: 100 }, { t: "glad", at: W.glad, kind: "bold" }],
          [{ t: "you", at: W.you, kind: "muted", size: 100 }, { t: "started", at: W.started, kind: "bold" }],
          [{ t: "today.", at: W.today, kind: "serif" }],
        ]}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <line x1={LINE.x0} y1={LINE.y} x2={LINE.x1} y2={LINE.y} stroke="rgba(225,215,255,0.15)" strokeWidth={4} />
        <line x1={LINE.x0} y1={LINE.y} x2={lerp(LINE.x0, LINE.x1, draw)} y2={LINE.y} stroke="rgba(235,220,255,0.9)" strokeWidth={4} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px #b48cff)" }} />
        {MONTHS.map((m, i) => {
          const u = (i + 0.5) / 12;
          const mx = lerp(LINE.x0, LINE.x1, u);
          const lit = travel >= u;
          return (
            <g key={i} opacity={draw >= u ? 1 : 0.15}>
              <line x1={mx} y1={LINE.y - 14} x2={mx} y2={LINE.y + 14} stroke={lit ? "#fff" : "rgba(225,215,255,0.5)"} strokeWidth={3} />
              <text x={mx} y={LINE.y + 60} textAnchor="middle" fontFamily="Manrope" fontWeight={700} fontSize={26} fill={lit ? C.lilacSoft : C.muted}>
                {m}
              </text>
            </g>
          );
        })}
        <circle cx={LINE.x0} cy={LINE.y} r={14 + 10 * startPulse} fill="#fff" style={{ filter: "drop-shadow(0 0 14px #c8b0ff)" }} opacity={prog(f, T(W.in), T(W.in) + 8)} />
        {startPulse > 0.02 ? <circle cx={LINE.x0} cy={LINE.y} r={20 + (1 - startPulse) * 70} fill="none" stroke={C.lilac} strokeWidth={3} opacity={startPulse} /> : null}
        {travel > 0 ? <circle cx={x} cy={LINE.y} r={16} fill="#fff" style={{ filter: "drop-shadow(0 0 16px #d4bfff)" }} /> : null}
      </svg>
      <div style={{ position: "absolute", left: LINE.x0 - 80, top: LINE.y - 90, width: 160, textAlign: "center", ...capsStyle, opacity: prog(f, T(W.in), T(W.in) + 10) }}>today</div>
      <div style={{ position: "absolute", left: LINE.x1 - 120, top: LINE.y - 160, width: 240, textAlign: "center", ...capsStyle, color: C.lilacSoft, opacity: draw }}>in a year</div>
      {glad > 0 ? (
        <div style={{ position: "absolute", left: LINE.x1 - 200, top: LINE.y + 110, width: 300, display: "flex", justifyContent: "center", opacity: glad, transform: `scale(${lerp(0.7, 1, glad)})` }}>
          <div style={pill}>glad you did</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- B : "Your future self is watching." ---------- */
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.b[0]);
  const fut = prog(f, T(W.future) - 2, T(W.self) + 10, eOut);
  const watch = prog(f, T(W.watching) - 2, T(W.watchEnd), eInOut);
  const you = prog(f, st + 4, st + 16, eBack);
  const P = { fx: 760, fy: 1050, yx: 330, yy: 1520 };
  return (
    <AbsoluteFill style={sceneFx(f, "b")}>
      <Orb cx={P.fx} cy={P.fy} R={200} power={0.25 + 0.5 * fut + 0.5 * watch} flicker={0} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d={`M ${P.fx} ${P.fy} Q ${P.fx - 80} ${P.yy - 120} ${P.yx} ${P.yy}`} stroke="rgba(230,210,255,0.85)" strokeWidth={4} fill="none" strokeDasharray="4 16" strokeLinecap="round" pathLength={1} strokeDashoffset={0} opacity={watch} style={{ filter: "drop-shadow(0 0 8px #b48cff)" }} />
        <circle cx={P.yx} cy={P.yy} r={22 * you} fill="#fff" style={{ filter: "drop-shadow(0 0 16px #c8b0ff)" }} />
        {watch > 0 ? <circle cx={P.yx} cy={P.yy} r={30 + ((f % 30) / 30) * 60} fill="none" stroke={C.lilac} strokeWidth={3} opacity={(1 - (f % 30) / 30) * watch} /> : null}
      </svg>
      <div style={{ position: "absolute", left: P.fx - 160, top: P.fy + 250, width: 320, textAlign: "center", ...capsStyle, color: C.lilacSoft, opacity: fut }}>you · in a year</div>
      <div style={{ position: "absolute", left: P.yx - 140, top: P.yy + 50, width: 280, textAlign: "center", ...capsStyle, opacity: you }}>you · today</div>
      <Words
        f={f}
        top={250}
        size={90}
        lineGap={0}
        lines={[
          [{ t: "Your", at: W.your, kind: "muted", size: 100 }, { t: "future self", at: W.future, kind: "serif" }],
          [{ t: "is", at: W.is, kind: "muted", size: 100 }, { t: "watching.", at: W.watching, kind: "bold" }],
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------- C : "They're not asking you to be perfect. They're asking you to start." ---------- */
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const perf = prog(f, T(W.perfect) - 2, T(W.perfect) + 9, eOut);
  const strike = prog(f, T(W.perfEnd) - 6, T(W.perfEnd) + 4, eInOut);
  const swap = T(W.theyre2) - 6;
  const stars = prog(f, T(W.be2), T(W.perfect) + 10, eOut);
  const btnIn = prog(f, T(W.asking2), T(W.you3) + 6, eBack);
  const press = prog(f, T(W.start) - 1, T(W.start) + 3, eIn) * (1 - prog(f, T(W.start) + 3, T(W.start) + 10, eOut));
  const ripple = f >= T(W.start) + 2 ? ((f - T(W.start) - 2) % 34) / 34 : -1;
  const lit = f >= T(W.start) + 2 ? 1 : 0;
  return (
    <AbsoluteFill style={sceneFx(f, "c")}>
      {f < swap + 12 ? (
        <AbsoluteFill style={{ opacity: 1 - prog(f, swap, swap + 10, eIn), filter: f > swap ? `blur(${prog(f, swap, swap + 10) * 16}px)` : undefined }}>
          <Words
            f={f}
            top={260}
            size={88}
            lineGap={0}
            lines={[
              [{ t: "They're", at: W.theyre, kind: "muted", size: 100 }, { t: "not", at: W.not, kind: "bold" }, { t: "asking", at: W.asking, kind: "muted", size: 100 }],
              [{ t: "you to be", at: W.you2, kind: "muted", size: 100 }],
            ]}
          />
          <div style={{ position: "absolute", top: 520, width: "100%", display: "flex", justifyContent: "center" }}>
            <span style={{ position: "relative", opacity: perf * (1 - 0.45 * strike), filter: `blur(${(1 - perf) * 14}px)`, transform: `translateY(${(1 - perf) * 30}px)` }}>
              <span style={{ ...serifGradient, fontSize: 160, lineHeight: 1.1, filter: "drop-shadow(0 0 24px rgba(160,120,255,0.45))" }}>perfect.</span>
              <span style={{ position: "absolute", left: -10, right: -10, top: "54%", height: 6, borderRadius: 3, background: C.lilacSoft, transform: `scaleX(${strike})`, transformOrigin: "0% 50%", boxShadow: "0 0 18px rgba(200,170,255,0.9)" }} />
            </span>
          </div>
          {/* 5 étoiles "parfaites" qui s'éteignent */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", gap: 26 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const q = prog(f, T(W.be2) + i * 2, T(W.be2) + i * 2 + 8, eBack);
              return (
                <svg key={i} width="110" height="110" viewBox="0 0 24 24" style={{ opacity: stars * q * (1 - 0.75 * strike), transform: `scale(${q}) translateY(${strike * 20 * ((i % 2) * 2 - 1)}px)`, filter: `blur(${strike * 3}px) drop-shadow(0 0 ${12 * (1 - strike)}px #c8b0ff)` }}>
                  <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill={strike > 0.5 ? "rgba(225,215,255,0.3)" : "#e6dcff"} />
                </svg>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1340, textAlign: "center", ...capsStyle, opacity: stars * (1 - strike) }}>flawless · every day · no mistakes</div>
        </AbsoluteFill>
      ) : null}
      {f >= swap ? (
        <>
          <Words
            f={f}
            top={260}
            size={88}
            lineGap={0}
            lines={[
              [{ t: "They're", at: W.theyre2, kind: "muted", size: 100 }, { t: "asking", at: W.asking2, kind: "bold" }],
              [{ t: "you to", at: W.you3, kind: "muted", size: 100 }],
              [{ t: "start.", at: W.start, kind: "serif", size: 110 }],
            ]}
          />
          {/* bouton "Start" */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", opacity: Math.min(1, btnIn * 1.5) }}>
            <div style={{ position: "relative", transform: `scale(${btnIn * (1 - 0.08 * press)})` }}>
              {ripple >= 0 ? <div style={{ position: "absolute", inset: -ripple * 120, borderRadius: 999, border: `3px solid ${C.lilac}`, opacity: 1 - ripple }} /> : null}
              <div style={{ padding: "40px 120px", borderRadius: 999, ...glass(0.4 + 0.6 * lit), background: lit ? "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))" : glass(0.4).background, boxShadow: lit ? "0 0 80px rgba(139,92,246,0.9)" : glass(0.4).boxShadow, fontFamily: SANS, fontWeight: 800, fontSize: 72, color: "#fff", letterSpacing: -1 }}>Start ▸</div>
            </div>
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- D : "One intention. One technique. One specific day." ---------- */
const CARDS = [
  { icon: "intention", kicker: "one", label: "intention", at: W.one, end: W.one2 },
  { icon: "technique", kicker: "one", label: "technique", at: W.one2, end: W.one3 },
  { icon: "day", kicker: "one specific", label: "day", at: W.one3, end: 99 },
];
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const all = prog(f, T(W.dayEnd), T(W.dayEnd) + 10, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "d")}>
      <Words
        f={f}
        top={240}
        size={86}
        lineGap={0}
        lines={[
          [{ t: "One", at: W.one, kind: "bold" }, { t: "intention.", at: W.intention, kind: "serif" }],
          [{ t: "One", at: W.one2, kind: "bold" }, { t: "technique.", at: W.technique, kind: "serif" }],
          [{ t: "One", at: W.one3, kind: "bold" }, { t: "specific", at: W.specific, kind: "muted", size: 100 }, { t: "day.", at: W.day, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", gap: 28 }}>
        {CARDS.map((c, i) => {
          const q = prog(f, T(c.at) - 2, T(c.at) + 14, eBack);
          const act = Math.max(prog(f, T(c.at), T(c.at) + 8) * (1 - prog(f, T(c.end), T(c.end) + 8)) , all);
          return (
            <div key={c.icon} style={{ perspective: 1200, opacity: Math.min(1, q * 1.5), transform: `rotateY(${(1 - q) * 70}deg) translateY(${(1 - q) * 60 - act * 20}px) scale(${lerp(0.85, 1, q)})` }}>
              <GlassCard icon={c.icon} kicker={c.kicker} label={c.label} active={act} w={300} h={400} labelSize={56} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- E : "And that day is today." ---------- */
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.e[0]);
  const cardIn = prog(f, st + 2, st + 14, eOut);
  const flip = prog(f, T(W.today2) - 4, T(W.today2) + 8, eInOut);
  const pulse = f >= T(W.today2) + 6 ? Math.exp(-(f - T(W.today2) - 6) / 12) : 0;
  const side = flip < 0.5;
  return (
    <AbsoluteFill style={sceneFx(f, "e")}>
      <Orb cx={540} cy={1220} R={220} power={0.3 + 0.5 * flip + 0.7 * pulse} flicker={0} />
      <Words
        f={f}
        top={260}
        size={90}
        lineGap={0}
        lines={[
          [{ t: "And", at: W.and, kind: "muted", size: 100 }, { t: "that day", at: W.that, kind: "bold" }],
          [{ t: "is", at: W.is2, kind: "muted", size: 100 }, { t: "today.", at: W.today2, kind: "serif", size: 110 }],
        ]}
      />
      <div style={{ position: "absolute", left: 540 - 220, top: 1220 - 250, width: 440, height: 500, perspective: 1400, opacity: cardIn }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 44, ...glass(side ? 0.35 : 0.9), transform: `rotateY(${flip * 180 - (side ? 0 : 180)}deg) scale(${1 + 0.05 * pulse})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 90, background: side ? "rgba(124,58,237,0.45)" : "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))", display: "flex", alignItems: "center", justifyContent: "center", ...capsStyle, color: "#fff" }}>
            {side ? "someday" : "today"}
          </div>
          {side ? (
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 200, color: "rgba(225,215,255,0.35)", marginTop: 60, filter: "blur(2px)" }}>?</div>
          ) : (
            <>
              <div style={{ ...serifGradient, fontSize: 150, lineHeight: 1, marginTop: 70 }}>Day 1</div>
              <div style={{ ...capsStyle, marginTop: 24, color: C.lilacSoft }}>it starts now</div>
            </>
          )}
        </div>
      </div>
      {pulse > 0.02 ? <div style={{ position: "absolute", left: 540 - 260 - (1 - pulse) * 80, top: 1220 - 290 - (1 - pulse) * 80, width: 520 + (1 - pulse) * 160, height: 580 + (1 - pulse) * 160, borderRadius: 60, border: `3px solid ${C.lilac}`, opacity: pulse }} /> : null}
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.year, src: "chime1", vol: 0.18 },
  ...MONTHS.map((_, i) => ({ at: W.glad + 0.1 + i * 0.07, src: "tick", vol: 0.07 })),
  { at: W.today, src: "chime5", vol: 0.24 },
  { at: W.today, src: "sub", vol: 0.22 },
  { at: 2.7, src: "whoosh", vol: 0.3 },
  { at: W.future, src: "shimmer", vol: 0.28 },
  { at: W.watching, src: "chime2", vol: 0.2 },
  { at: 4.9, src: "whoosh", vol: 0.3 },
  ...[0, 1, 2, 3, 4].map((i) => ({ at: W.be2 + i * 0.067, src: "tick", vol: 0.1 })),
  { at: W.perfEnd - 0.2, src: "tick_low", vol: 0.3 },
  { at: W.theyre2 - 0.15, src: "whoosh_soft", vol: 0.2 },
  { at: W.start + 0.05, src: "impact", vol: 0.3 },
  { at: W.start + 0.05, src: "chime6", vol: 0.26 },
  { at: 8.9, src: "whoosh", vol: 0.3 },
  { at: W.one, src: "chime1", vol: 0.22 },
  { at: W.one2, src: "chime2", vol: 0.22 },
  { at: W.one3, src: "chime3", vol: 0.22 },
  { at: W.day, src: "shimmer", vol: 0.25 },
  { at: 13.05, src: "whoosh", vol: 0.3 },
  { at: W.today2 - 0.12, src: "whoosh_soft", vol: 0.2 },
  { at: W.today2 + 0.1, src: "chime5", vol: 0.3 },
  { at: W.today2 + 0.1, src: "sub", vol: 0.3 },
  { at: W.manifest - 0.05, src: "impact", vol: 0.42 },
  { at: W.with, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.35 },
  { at: 17.88, src: "whoosh", vol: 0.3 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74, 0.86, 0.98, 1.1].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice6.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
