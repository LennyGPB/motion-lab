import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { GlassCard } from "../signspath/Card";
import { SceneFinale } from "../signspath/SceneFinale";
import { C, loadFonts, SANS, SERIF, serifGradient } from "../signspath/theme";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "./Orb";
import { DURATION_FRAMES, SC, T, W } from "./timing";

loadFonts();

type Key = keyof typeof SC;
const on = (f: number, k: Key) => f >= T(SC[k][0]) - 1 && f < T(SC[k][1]) + 2;
/** Entrée/sortie douce d'une scène (flou + échelle), façon SignsPath. */
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

/** Motion SignsPath #2 — "tie your ritual to a moment" (1080x1920). */
export const Ritual: React.FC = () => {
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
              full: W.full, signs: W.signs, path: W.path, dot: W.dot, comEnd: W.comEnd, cta: 17.33, from: T(SC.finale[0]),
            }}
          />
        </Sequence>
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : "Your ritual doesn't last because it's important." ---------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const dim = prog(f, T(W.impEnd) - 6, T(SC.a[1]), eInOut);
  const flare = Math.exp(-Math.max(0, f - T(W.important)) / 8) * (f >= T(W.important) ? 1 : 0);
  const power = (0.3 + 0.7 * prog(f, 0, 24)) * (1 - 0.65 * dim) + 0.4 * flare;
  const flicker = f >= T(W.doesnt) ? 0.55 : 0.1;
  const strike = prog(f, T(W.impEnd) - 8, T(W.impEnd) + 2, eInOut);
  const imp = prog(f, T(W.important) - 2, T(W.important) + 9, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "a")}>
      <Orb cx={540} cy={1230} R={220} power={power} flicker={flicker} />
      <Words
        f={f}
        top={260}
        size={84}
        lines={[
          [{ t: "Your", at: W.your }, { t: "ritual", at: W.ritual, kind: "serif" }],
          [{ t: "doesn't", at: W.doesnt, kind: "bold" }, { t: "last", at: W.last, kind: "bold" }],
          [{ t: "because", at: W.because, kind: "muted" }, { t: "it's", at: W.its, kind: "muted" }],
        ]}
      />
      <div style={{ position: "absolute", top: 620, width: "100%", display: "flex", justifyContent: "center" }}>
        <span style={{ position: "relative", opacity: imp * (1 - 0.45 * strike), filter: `blur(${(1 - imp) * 14}px)`, transform: `translateY(${(1 - imp) * 30}px)` }}>
          <span style={{ ...serifGradient, fontSize: 150, lineHeight: 1.1, filter: "drop-shadow(0 0 24px rgba(160,120,255,0.45))" }}>important.</span>
          <span style={{ position: "absolute", left: -10, right: -10, top: "54%", height: 6, borderRadius: 3, background: C.lilacSoft, transform: `scaleX(${strike})`, transformOrigin: "0% 50%", boxShadow: "0 0 18px rgba(200,170,255,0.9)" }} />
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B : "It lasts because it's tied to a specific moment." ---------- */
const DIAL = { cx: 600, cy: 1330, R: 290 };
const MARK_ANG = (-135 * Math.PI) / 180;
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const dialIn = prog(f, T(W.lasts), T(W.lasts) + 18, eOut);
  const tie = prog(f, T(W.tied) - 2, T(W.tied) + 20, eInOut);
  const mom = prog(f, T(W.moment) - 2, T(W.moment) + 10, eBack);
  const mx = DIAL.cx + Math.cos(MARK_ANG) * DIAL.R;
  const my = DIAL.cy + Math.sin(MARK_ANG) * DIAL.R;
  const ox = 230;
  const oy = 930;
  const hand = lerp(-200, -135, prog(f, T(W.lasts), T(W.moment), eInOut));
  return (
    <AbsoluteFill style={sceneFx(f, "b")}>
      <Orb cx={ox} cy={oy} R={110} power={0.45 + 0.75 * tie} flicker={0.4 * (1 - tie)} />
      {/* cadran */}
      <div style={{ position: "absolute", left: DIAL.cx - DIAL.R, top: DIAL.cy - DIAL.R, width: DIAL.R * 2, height: DIAL.R * 2, borderRadius: "50%", background: "linear-gradient(160deg, rgba(255,255,255,0.1), rgba(190,170,255,0.03)), rgba(36,18,92,0.6)", border: "1.5px solid rgba(225,215,255,0.3)", boxShadow: "0 30px 80px rgba(5,0,20,0.5)", opacity: dialIn, transform: `scale(${lerp(0.85, 1, dialIn)})` }} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: dialIn }}>
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const long = i % 5 === 0;
          const r1 = DIAL.R - (long ? 34 : 18);
          return <line key={i} x1={DIAL.cx + Math.cos(a) * r1} y1={DIAL.cy + Math.sin(a) * r1} x2={DIAL.cx + Math.cos(a) * (DIAL.R - 8)} y2={DIAL.cy + Math.sin(a) * (DIAL.R - 8)} stroke="rgba(225,215,255,0.5)" strokeWidth={long ? 4 : 2} />;
        })}
        <line x1={DIAL.cx} y1={DIAL.cy} x2={DIAL.cx + Math.cos((hand * Math.PI) / 180) * (DIAL.R - 60)} y2={DIAL.cy + Math.sin((hand * Math.PI) / 180) * (DIAL.R - 60)} stroke={C.lilacSoft} strokeWidth={6} strokeLinecap="round" />
        <circle cx={DIAL.cx} cy={DIAL.cy} r={12} fill={C.lilacSoft} />
        {/* fil de lumière orbe → instant */}
        <path d={`M ${ox} ${oy} Q ${ox + 40} ${my - 40} ${mx} ${my}`} stroke="rgba(230,210,255,0.95)" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={`${tie} 1`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px #b48cff)" }} />
        {mom > 0 ? (
          <>
            <circle cx={mx} cy={my} r={16 + 50 * ((f % 30) / 30)} fill="none" stroke={C.lilac} strokeWidth={3} opacity={1 - (f % 30) / 30} />
            <circle cx={mx} cy={my} r={18 * mom} fill="#fff" style={{ filter: "drop-shadow(0 0 18px #c8b0ff)" }} />
          </>
        ) : null}
      </svg>
      {mom > 0 ? (
        <div style={{ position: "absolute", left: mx + 40, top: my - 120, opacity: Math.min(1, mom * 2), transform: `scale(${mom})`, transformOrigin: "0% 100%", padding: "12px 26px", borderRadius: 999, background: "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))", boxShadow: "0 0 40px rgba(139,92,246,0.8)", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: "#fff" }}>
          10:30 PM
        </div>
      ) : null}
      <Words
        f={f}
        top={230}
        size={84}
        lines={[
          [{ t: "It", at: W.it, kind: "bold" }, { t: "lasts", at: W.lasts, kind: "bold" }],
          [{ t: "because", at: W.because2, kind: "muted" }, { t: "it's", at: W.its2, kind: "muted" }, { t: "tied", at: W.tied, kind: "serif" }],
          [{ t: "to a", at: W.to, kind: "muted" }, { t: "specific", at: W.specific }, { t: "moment.", at: W.moment, kind: "serif" }],
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------- C : 'Not "I'll do it sometime today."' ---------- */
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.c[0]);
  const bar = prog(f, st + 4, st + 22, eInOut);
  const fizz = prog(f, T(W.todayEnd) - 4, T(W.todayEnd) + 8, eIn);
  const bx = 540 + 330 * Math.sin((f - st) / 14) * Math.cos((f - st) / 31);
  const jx = (hash(f) - 0.5) * 8;
  return (
    <AbsoluteFill style={sceneFx(f, "c")}>
      <Words f={f} top={300} size={84} lines={[[{ t: "Not", at: W.not, kind: "serif", size: 120 }]]} />
      <div style={{ position: "absolute", left: jx, right: 0, top: 0, bottom: 0, filter: `blur(${1.5 + 1.5 * Math.sin(f / 5)}px)` }}>
        <Words
          f={f}
          top={560}
          size={74}
          lines={[
            [{ t: "“I'll", at: W.ill, kind: "muted", size: 100 }, { t: "do", at: W.do, kind: "muted", size: 100 }, { t: "it", at: W.it2, kind: "muted", size: 100 }],
            [{ t: "sometime", at: W.sometime, kind: "muted", size: 100 }, { t: "today.”", at: W.today, kind: "muted", size: 100 }],
          ]}
        />
      </div>
      {/* frise de la journée */}
      <div style={{ position: "absolute", left: 120, top: 1300, width: 840 * bar, height: 4, borderRadius: 2, background: "rgba(225,215,255,0.35)" }} />
      {["00:00", "06:00", "12:00", "18:00", "24:00"].map((h, i) => (
        <div key={h} style={{ position: "absolute", left: 120 + i * 210 - 50, top: 1330, width: 100, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.muted, opacity: bar }}>
          <div style={{ width: 2, height: 18, background: "rgba(225,215,255,0.4)", margin: "-36px auto 18px" }} />
          {h}
        </div>
      ))}
      {/* tache floue "un jour, peut-être" */}
      <div style={{ position: "absolute", left: bx - 90, top: 1300 - 90, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(185,166,255,0.55), rgba(120,90,200,0.15) 55%, transparent 70%)", filter: "blur(14px)", opacity: bar * (1 - fizz), transform: `scale(${1 - fizz * 0.7})` }} />
      <div style={{ position: "absolute", left: bx - 40, top: 1120, width: 80, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 110, color: "rgba(207,194,255,0.55)", opacity: bar * (1 - fizz), transform: `translateY(${8 * Math.sin(f / 6)}px)` }}>?</div>
    </AbsoluteFill>
  );
};

/* ---------- D : 'More like "right after I close my laptop."' ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.d[0]);
  const lapIn = prog(f, st + 2, st + 18, eOut);
  const close = prog(f, T(W.close), T(W.close) + 10, eIn);
  const shut = f >= T(W.close) + 10;
  const spark = shut ? Math.exp(-(f - T(W.close) - 10) / 6) : 0;
  const swap = prog(f, T(W.laptop) + 2, T(W.laptop) + 14, eInOut);
  const lidAngle = lerp(-8, -86, close);
  return (
    <AbsoluteFill style={sceneFx(f, "d")}>
      <Words
        f={f}
        top={230}
        size={84}
        lines={[
          [{ t: "More", at: W.more, kind: "muted" }, { t: "like", at: W.like, kind: "muted" }],
          [{ t: "“right", at: W.right }, { t: "after", at: W.after, kind: "serif" }],
          [{ t: "I", at: W.i, kind: "bold" }, { t: "close", at: W.close, kind: "bold" }, { t: "my laptop.”", at: W.my, kind: "serif" }],
        ]}
      />
      {/* laptop */}
      <div style={{ position: "absolute", left: 540 - 320, top: 960, width: 640, opacity: lapIn * (1 - swap), transform: `scale(${lerp(0.9, 1, lapIn) * (1 - swap * 0.4)}) translateY(${-swap * 100}px)` }}>
        <div style={{ perspective: 1400, height: 400, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ width: 600, height: 380, transformOrigin: "50% 100%", transform: `rotateX(${lidAngle}deg)`, borderRadius: "22px 22px 6px 6px", background: "linear-gradient(160deg, #3b2a63, #1b1035)", border: "2px solid rgba(225,215,255,0.35)", padding: 18, boxSizing: "border-box" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 10, background: `linear-gradient(135deg, rgba(185,166,255,${0.85 - close * 0.7}), rgba(124,58,237,${0.6 - close * 0.5}))`, boxShadow: `0 0 ${60 * (1 - close)}px rgba(185,140,255,0.8)`, overflow: "hidden", position: "relative" }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ position: "absolute", left: 30, top: 40 + i * 60, width: 300 - i * 50, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.45)" }} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 80, perspective: 900 }}>
          <div style={{ width: 640, height: 150, transformOrigin: "50% 0%", transform: "rotateX(72deg)", borderRadius: "6px 6px 26px 26px", background: "linear-gradient(180deg, #2c1f4d, #140b2a)", border: "2px solid rgba(225,215,255,0.3)" }} />
        </div>
      </div>
      {/* étincelle à la fermeture */}
      {spark > 0.02 ? <div style={{ position: "absolute", left: 540 - 300, top: 1350 - 300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,250,255,0.95), rgba(190,150,255,0.4) 25%, transparent 60%)", opacity: spark, transform: `scale(${0.4 + (1 - spark) * 0.8})` }} /> : null}
      {/* déclencheur → rituel */}
      {swap > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, opacity: swap }}>
          {[
            { icon: "laptop", kicker: "right after", label: "laptop shuts", d: 0 },
            { icon: "intention", kicker: "you do", label: "your ritual", d: 5 },
          ].map((c, i) => {
            const q = prog(f, T(W.laptop) + 4 + c.d, T(W.laptop) + 18 + c.d, eBack);
            return (
              <div key={c.icon} style={{ display: "flex", alignItems: "center", gap: 30 }}>
                {i === 1 ? <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 70, color: C.lilac, opacity: q }}>→</div> : null}
                <div style={{ perspective: 1200, opacity: q, transform: `rotateY(${(1 - q) * 70}deg) scale(${lerp(0.8, 1, q)})` }}>
                  <GlassCard icon={c.icon} kicker={c.kicker} label={c.label} active={i === 1 ? q : 0.3} w={330} h={420} labelSize={54} />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- E : "Three minutes every day beat one hour a week." ---------- */
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const COLX = (i: number) => 150 + i * 130;
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.e[0]);
  const grid = prog(f, st + 6, st + 20, eOut);
  const win = prog(f, T(W.beat) - 2, T(W.beat) + 10, eOut);
  const lose = prog(f, T(W.weekEnd) - 4, T(W.weekEnd) + 8, eInOut);
  const row2 = prog(f, T(W.one) - 2, T(W.one) + 10, eBack);
  const y1 = 1080;
  const y2 = 1420;
  const lit = (i: number) => prog(f, T(W.every) + i * 3, T(W.every) + i * 3 + 8, eBack);
  const thread = prog(f, T(W.every), T(W.every) + 30, eInOut);
  return (
    <AbsoluteFill style={sceneFx(f, "e")}>
      <Words
        f={f}
        top={200}
        size={84}
        lines={[
          [{ t: "Three", at: W.three, kind: "bold" }, { t: "minutes", at: W.minutes, kind: "bold" }],
          [{ t: "every", at: W.every, kind: "serif" }, { t: "day", at: W.day, kind: "serif" }],
          [{ t: "beat", at: W.beat, kind: "bold" }, { t: "one hour a week.", at: W.one, kind: "muted" }],
        ]}
      />
      {DAYS.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: COLX(i) - 30, top: 900, width: 60, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.muted, opacity: grid }}>
          {d}
        </div>
      ))}
      {/* rangée 1 : 3 min chaque jour */}
      <div style={{ position: "absolute", left: 105, top: y1 - 110, ...capsStyle, opacity: grid, color: win > 0.5 ? C.lilacSoft : C.muted }}>3 min · every day</div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d={`M ${COLX(0)} ${y1} ${DAYS.map((_, i) => `L ${COLX(i)} ${y1 + (i % 2 ? -14 : 14)}`).join(" ")}`} stroke="rgba(230,210,255,0.95)" strokeWidth={4 + win * 3} fill="none" pathLength={1} strokeDasharray={`${thread} 1`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${8 + win * 12}px #b48cff)` }} />
      </svg>
      {DAYS.map((_, i) => {
        const q = lit(i);
        return (
          <div key={i} style={{ position: "absolute", left: COLX(i) - 45, top: y1 + (i % 2 ? -14 : 14) - 45, width: 90, height: 90, borderRadius: 24, background: `linear-gradient(160deg, rgba(255,255,255,${0.08 + 0.12 * q}), rgba(190,170,255,0.04)), rgba(36,18,92,0.9)`, border: `1.5px solid rgba(225,215,255,${0.2 + 0.5 * q})`, boxShadow: `0 0 ${q * (30 + 30 * win)}px rgba(150,110,255,${0.6 * q})`, opacity: grid, transform: `scale(${0.8 + 0.2 * q + win * 0.04 * Math.sin(f / 4 + i)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", opacity: q, boxShadow: "0 0 14px #c8b0ff" }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 105, top: y1 + 100, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.white, opacity: thread }}>
        21 min <span style={{ color: C.muted, fontWeight: 500 }}>· 7 rituals</span>
      </div>
      {/* rangée 2 : 1 h une fois */}
      <div style={{ position: "absolute", left: 105, top: y2 - 110, ...capsStyle, opacity: row2 * (1 - 0.5 * lose) }}>1 hour · once a week</div>
      {DAYS.map((_, i) => (
        <div key={i} style={{ position: "absolute", left: COLX(i) - 45, top: y2 - 45, width: 90, height: i === 6 ? 220 : 90, borderRadius: 24, border: i === 6 ? "1.5px solid rgba(225,215,255,0.4)" : "2px dashed rgba(225,215,255,0.15)", background: i === 6 ? "rgba(124,58,237,0.35)" : "transparent", opacity: row2 * (1 - 0.6 * lose), transform: i === 6 ? `scaleY(${row2})` : undefined, transformOrigin: "50% 0%" }} />
      ))}
      <div style={{ position: "absolute", left: 105, top: y2 + 100, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.white, opacity: row2 * (1 - 0.6 * lose) }}>
        60 min <span style={{ color: C.muted, fontWeight: 500 }}>· 1 ritual</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.ritual, src: "chime1", vol: 0.16 },
  { at: W.doesnt, src: "whoosh_soft", vol: 0.12 },
  { at: W.impEnd - 0.25, src: "tick_low", vol: 0.3 },
  { at: 2.55, src: "whoosh", vol: 0.35 },
  { at: W.lasts, src: "chime2", vol: 0.2 },
  { at: W.tied, src: "shimmer", vol: 0.3 },
  { at: W.moment, src: "chime5", vol: 0.28 },
  { at: W.moment, src: "sub", vol: 0.3 },
  { at: 5.85, src: "whoosh", vol: 0.3 },
  { at: W.sometime, src: "whoosh_rev", vol: 0.12 },
  { at: W.todayEnd - 0.1, src: "freeze", vol: 0.22 },
  { at: 8.25, src: "whoosh", vol: 0.3 },
  { at: W.close + 0.3, src: "impact", vol: 0.32 },
  { at: W.close + 0.3, src: "sub", vol: 0.3 },
  { at: W.laptop + 0.2, src: "chime3", vol: 0.22 },
  { at: W.laptop + 0.35, src: "chime6", vol: 0.18 },
  { at: 10.95, src: "whoosh", vol: 0.3 },
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ at: W.every + i * 0.1, src: "tick", vol: 0.12 })),
  { at: W.beat, src: "chime6", vol: 0.25 },
  { at: W.weekEnd - 0.1, src: "whoosh_rev", vol: 0.18 },
  { at: W.manifest - 0.05, src: "impact", vol: 0.42 },
  { at: W.with, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.35 },
  { at: 17.2, src: "whoosh", vol: 0.3 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74, 0.86, 0.98, 1.1, 1.2].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio
      src={s("pad")}
      volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)}
    />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice2.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

export { eExpo };
