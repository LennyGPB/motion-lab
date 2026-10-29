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

/** Motion SignsPath #4 — "an ordinary Tuesday" (1080x1920). */
export const Tuesday: React.FC = () => {
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
              manifest: W.manifest, with: W.with2, method: W.method, not: W.not, by: W.by, chance: W.chance,
              full: W.full, signs: W.signs, path: W.path, dot: W.dot, comEnd: W.comEnd, cta: 21.05, from: T(SC.finale[0]),
            }}
          />
        </Sequence>
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : "Imagine an ordinary Tuesday in the life you're aiming for." ---------- */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const row = (i: number) => prog(f, T(W.an) + i * 2, T(W.an) + i * 2 + 12, eOut);
  const pick = prog(f, T(W.tuesday) - 2, T(W.tuesday) + 16, eInOut);
  const aim = prog(f, T(W.aiming) - 4, T(W.for) + 10, eOut);
  const CW = 118;
  const GAP = 14;
  const x0 = 540 - (7 * CW + 6 * GAP) / 2;
  return (
    <AbsoluteFill style={sceneFx(f, "a")}>
      <Orb cx={x0 + 1 * (CW + GAP) + CW / 2} cy={1180} R={150} power={0.15 + 0.35 * pick + 0.6 * aim} flicker={0.05} />
      <Words
        f={f}
        top={200}
        size={80}
        lineGap={0}
        lines={[
          [{ t: "Imagine", at: W.imagine, kind: "serif" }],
          [{ t: "an ordinary", at: W.an, kind: "muted", size: 96 }, { t: "Tuesday", at: W.tuesday, kind: "bold" }],
          [{ t: "in the life", at: W.in }],
          [{ t: "you're", at: W.youre, kind: "muted", size: 96 }, { t: "aiming for.", at: W.aiming, kind: "serif" }],
        ]}
      />
      {DAYS.map((d, i) => {
        const q = row(i);
        const sel = i === 1;
        const lift = sel ? pick : 0;
        const dim = sel ? 0 : pick;
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: x0 + i * (CW + GAP),
              top: 1100,
              width: CW,
              height: 160,
              borderRadius: 28,
              ...glass(sel ? 0.3 + 0.7 * pick : 0.15),
              opacity: q * (1 - 0.6 * dim),
              filter: dim > 0.05 ? `blur(${dim * 4}px)` : undefined,
              transform: `translateY(${(1 - q) * 40 - lift * 150}px) scale(${1 + lift * 0.75})`,
              zIndex: sel ? 2 : 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
            }}
          >
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: sel && pick > 0.5 ? "#fff" : C.muted }}>{d}</div>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", opacity: sel ? pick : 0.25, boxShadow: sel ? "0 0 12px #c8b0ff" : undefined }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1380, textAlign: "center", ...capsStyle, opacity: aim, color: C.lilacSoft }}>
        the life you&apos;re aiming for
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B : "You wake up. Light fills the room." ---------- */
const WIN = { cx: 540, cy: 1260, w: 400, h: 500 };
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.b[0]);
  const winIn = prog(f, st + 2, st + 16, eOut);
  const dawn = prog(f, T(W.wake), T(W.upEnd) + 4, eInOut);
  const light = prog(f, T(W.light) - 2, T(W.roomEnd), eInOut);
  return (
    <AbsoluteFill style={sceneFx(f, "b")}>
      {/* chaleur qui envahit la pièce */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 65%, rgba(255,214,190,${0.32 * light}), rgba(190,150,255,${0.2 * light}) 40%, transparent 75%)` }} />
      {/* rayons */}
      {[-38, -19, 0, 19, 38].map((a, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: WIN.cx - 80 + (i - 2) * 26,
            top: WIN.cy - 40,
            width: 140 + hash(i) * 60,
            height: 1400,
            transformOrigin: "50% 0%",
            transform: `rotate(${a + 2 * Math.sin(f / 40 + i)}deg) scaleY(${light})`,
            background: "linear-gradient(180deg, rgba(255,236,220,0.5), rgba(220,190,255,0.12) 55%, transparent)",
            filter: "blur(18px)",
            opacity: light * (0.5 + 0.3 * Math.sin(f / 13 + i)),
          }}
        />
      ))}
      {/* fenêtre */}
      <div style={{ position: "absolute", left: WIN.cx - WIN.w / 2, top: WIN.cy - WIN.h / 2, width: WIN.w, height: WIN.h, borderRadius: "200px 200px 24px 24px", overflow: "hidden", border: "3px solid rgba(225,215,255,0.5)", opacity: winIn, transform: `scale(${lerp(0.9, 1, winIn)})`, boxShadow: `0 0 ${120 * light}px rgba(255,220,200,${0.6 * light})` }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #120a32, #1d1050)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #b9a6ff 0%, #ffc9b5 62%, #fff1e0 100%)", opacity: dawn }} />
        {/* soleil */}
        <div style={{ position: "absolute", left: WIN.w / 2 - 80, top: lerp(WIN.h + 40, WIN.h * 0.52, dawn), width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, #fff, #ffe7d6 45%, rgba(255,210,190,0) 72%)", opacity: dawn }} />
        {/* croisillons */}
        <div style={{ position: "absolute", left: WIN.w / 2 - 3, top: 0, bottom: 0, width: 6, background: "rgba(36,18,92,0.85)" }} />
        <div style={{ position: "absolute", top: WIN.h * 0.55, left: 0, right: 0, height: 6, background: "rgba(36,18,92,0.85)" }} />
      </div>
      <Words
        f={f}
        top={230}
        size={88}
        lineGap={0}
        lines={[
          [{ t: "You", at: W.you, kind: "bold" }, { t: "wake up.", at: W.wake, kind: "bold" }],
          [{ t: "Light", at: W.light, kind: "serif" }, { t: "fills", at: W.fills }],
          [{ t: "the room.", at: W.the2, kind: "serif" }],
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------- C : "You know exactly what you're doing with your day." ---------- */
const PLAN = [
  ["07:00", "Morning pages"],
  ["09:00", "Deep work"],
  ["12:30", "Lunch outside"],
  ["18:00", "Evening run"],
];
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const item = (i: number) => prog(f, T(W.exactly) + 4 + i * 7, T(W.exactly) + 16 + i * 7, eBack);
  const check = (i: number) => prog(f, T(W.what) + i * 6, T(W.what) + i * 6 + 8, eBack);
  return (
    <AbsoluteFill style={sceneFx(f, "c")}>
      <Words
        f={f}
        top={200}
        size={84}
        lineGap={0}
        lines={[
          [{ t: "You", at: W.you2, kind: "bold" }, { t: "know", at: W.know, kind: "bold" }],
          [{ t: "exactly", at: W.exactly, kind: "serif" }],
          [{ t: "what you're doing", at: W.what, kind: "muted", size: 100 }],
          [{ t: "with", at: W.with }, { t: "your day.", at: W.your, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 150, top: 930, ...capsStyle, opacity: item(0) }}>Tuesday · plan</div>
      {PLAN.map(([h, l], i) => {
        const q = item(i);
        const c = check(i);
        return (
          <div key={h} style={{ position: "absolute", left: 140, top: 990 + i * 140, width: 800, height: 116, borderRadius: 30, ...glass(0.2 + 0.5 * c), opacity: Math.min(1, q * 1.4), transform: `translateX(${(1 - q) * 80}px)`, display: "flex", alignItems: "center", padding: "0 34px", boxSizing: "border-box", gap: 30 }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.muted, width: 110 }}>{h}</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.white, flex: 1 }}>{l}</div>
            <div style={{ width: 58, height: 58, borderRadius: "50%", border: "2px solid rgba(225,215,255,0.5)", background: c > 0 ? `rgba(167,139,250,${0.9 * Math.min(1, c)})` : "transparent", boxShadow: c > 0.5 ? "0 0 20px rgba(167,139,250,0.9)" : undefined, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="34" height="34" viewBox="0 0 34 34" style={{ opacity: c, transform: `scale(${c})` }}>
                <polyline points="7,18 14,25 27,10" fill="none" stroke="#fff" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- D : "No stress. No doubt." ---------- */
const N = 60;
const tangled = Array.from({ length: N }, (_, i) => {
  const a = i * 0.9;
  return [540 + Math.cos(a) * (120 + 160 * hash(i)) + Math.sin(i * 2.3) * 60, 1260 + Math.sin(a * 1.3) * (110 + 140 * hash(i + 9))];
});
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.d[0]);
  const calm = prog(f, T(W.stress) + 2, T(W.stressEnd) + 4, eInOut);
  const clear = prog(f, T(W.doubt), T(W.doubtEnd) + 4, eInOut);
  const jit = 1 - calm;
  const pts = tangled.map(([x, y], i) => {
    const sx = lerp(140, 940, i / (N - 1));
    const sy = 1260 + Math.sin(i / 4 + f / 8) * 8 * calm;
    return [lerp(x + (hash(i + f) - 0.5) * 16 * jit, sx, calm), lerp(y + (hash(i + f + 3) - 0.5) * 16 * jit, sy, calm)];
  });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <AbsoluteFill style={sceneFx(f, "d")}>
      <Words
        f={f}
        top={300}
        size={110}
        lineGap={10}
        lines={[[{ t: "No stress.", at: W.no, kind: "bold" }], [{ t: "No doubt.", at: W.no2, kind: "serif" }]]}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: prog(f, st, st + 8) }}>
        <path d={d} stroke={`rgba(235,220,255,${0.55 + 0.4 * calm})`} strokeWidth={4} fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${4 + 10 * calm}px #b48cff)` }} />
      </svg>
      {Array.from({ length: 7 }, (_, i) => {
        const x = 170 + hash(i * 3) * 740;
        const y = 1020 + hash(i * 5) * 520;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y - clear * 120, fontFamily: SERIF, fontStyle: "italic", fontSize: 70 + hash(i) * 40, color: "rgba(207,194,255,0.6)", opacity: prog(f, st + 2 + i, st + 10 + i) * (1 - clear), filter: `blur(${clear * 12}px)`, transform: `translate(${(hash(f + i) - 0.5) * 6}px, ${Math.sin(f / 6 + i) * 6}px)` }}>
            ?
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- E : "Just your life, the way you chose it." ---------- */
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.e[0]);
  const grow = prog(f, st, T(W.lifeEnd), eOut);
  const ring = prog(f, T(W.chose) - 2, T(W.itEnd) + 6, eInOut);
  const pulse = f >= T(W.chose) + 6 ? Math.exp(-(f - T(W.chose) - 6) / 12) : 0;
  return (
    <AbsoluteFill style={sceneFx(f, "e")}>
      <Orb cx={540} cy={1240} R={210} power={0.3 + 0.6 * grow + 0.6 * pulse} flicker={0} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <circle cx={540} cy={1240} r={330} fill="none" stroke="rgba(225,215,255,0.14)" strokeWidth={2} />
        <circle cx={540} cy={1240} r={330} fill="none" stroke="rgba(235,220,255,0.95)" strokeWidth={4} pathLength={1} strokeDasharray={`${ring} 1`} transform="rotate(-90 540 1240)" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 12px #b48cff)" }} />
        {pulse > 0.02 ? <circle cx={540} cy={1240} r={330 + (1 - pulse) * 100} fill="none" stroke={C.lilac} strokeWidth={3} opacity={pulse} /> : null}
      </svg>
      <Words
        f={f}
        top={260}
        size={86}
        lineGap={0}
        lines={[
          [{ t: "Just", at: W.just, kind: "muted", size: 100 }, { t: "your life,", at: W.your2, kind: "serif" }],
          [{ t: "the way you", at: W.the3 }],
          [{ t: "chose it.", at: W.chose, kind: "serif" }],
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------- F : "Write that day. In detail. In the present tense." ---------- */
type JW = { t: string; hl?: boolean };
const JOURNAL: JW[][] = [
  [{ t: "It's" }, { t: "Tuesday." }],
  [{ t: "I" }, { t: "wake", hl: true }, { t: "up" }, { t: "at" }, { t: "7." }, { t: "Light" }, { t: "fills", hl: true }, { t: "my" }, { t: "room." }],
  [{ t: "I" }, { t: "know", hl: true }, { t: "exactly" }, { t: "what" }, { t: "I'm" }, { t: "doing" }, { t: "today." }],
  [{ t: "I" }, { t: "feel", hl: true }, { t: "calm," }, { t: "clear," }, { t: "light." }],
];
const TOTAL = JOURNAL.reduce((s, l) => s + l.length, 0);
const SceneF: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.f[0]);
  const card = prog(f, st + 2, st + 16, eOut);
  const shown = interpolate(f, [T(W.write) + 6, T(W.present)], [0, TOTAL], clamp);
  let k = 0;
  let h = 0;
  return (
    <AbsoluteFill style={sceneFx(f, "f")}>
      <Words
        f={f}
        top={190}
        size={84}
        lineGap={0}
        lines={[
          [{ t: "Write", at: W.write, kind: "bold" }, { t: "that day.", at: W.that, kind: "serif" }],
          [{ t: "In detail.", at: W.in2, kind: "muted", size: 104 }],
          [{ t: "In the", at: W.in3, kind: "muted", size: 104 }, { t: "present tense.", at: W.present, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 120, top: 760, width: 840, minHeight: 760, borderRadius: 40, ...glass(0.35), opacity: card, transform: `translateY(${(1 - card) * 60}px) rotate(${-1.5 + Math.sin(f / 60)}deg)`, padding: "56px 60px", boxSizing: "border-box" }}>
        <div style={{ ...capsStyle, marginBottom: 30 }}>Journal · Tuesday</div>
        {JOURNAL.map((line, li) => (
          <div key={li} style={{ display: "flex", flexWrap: "wrap", columnGap: 16, rowGap: 6, marginBottom: 26 }}>
            {line.map((w) => {
              const idx = k++;
              const p = Math.max(0, Math.min(1, shown - idx));
              const hi = w.hl ? prog(f, T(W.present) + 2 + h * 4, T(W.present) + 12 + h++ * 4, eInOut) : 0;
              return (
                <span key={idx} style={{ position: "relative", fontFamily: SERIF, fontStyle: "italic", fontSize: 64, lineHeight: 1.1, color: hi > 0.5 ? "#fff" : C.white, opacity: p, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined }}>
                  {w.hl ? <span style={{ position: "absolute", left: -6, right: -6, bottom: 4, height: 22, borderRadius: 8, background: "rgba(167,139,250,0.85)", transform: `scaleX(${hi})`, transformOrigin: "0% 50%", boxShadow: "0 0 18px rgba(167,139,250,0.8)", zIndex: -1 }} /> : null}
                  <span style={{ position: "relative" }}>{w.t}</span>
                </span>
              );
            })}
          </div>
        ))}
        {/* curseur d'écriture */}
        <div style={{ width: 4, height: 56, background: C.lilacSoft, opacity: shown < TOTAL && Math.floor(f / 8) % 2 === 0 ? card : 0 }} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.imagine + 0.1, src: "chime1", vol: 0.18 },
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ at: W.an + i * 0.067, src: "tick", vol: 0.07 })),
  { at: W.tuesday, src: "chime3", vol: 0.24 },
  { at: W.aiming, src: "shimmer", vol: 0.2 },
  { at: 3.7, src: "whoosh", vol: 0.32 },
  { at: W.wake, src: "riser", vol: 0.12 },
  { at: W.light, src: "shimmer", vol: 0.32 },
  { at: W.room, src: "chime5", vol: 0.22 },
  { at: 6.5, src: "whoosh", vol: 0.32 },
  { at: W.exactly, src: "chime2", vol: 0.18 },
  ...[0, 1, 2, 3].map((i) => ({ at: W.what + i * 0.2, src: "tick", vol: 0.12 })),
  { at: 9.2, src: "whoosh", vol: 0.3 },
  { at: W.no, src: "chaos", vol: 0.08 },
  { at: W.stressEnd - 0.2, src: "chime6", vol: 0.2 },
  { at: W.doubt, src: "whoosh_rev", vol: 0.14 },
  { at: 11.25, src: "whoosh_soft", vol: 0.25 },
  { at: W.life2, src: "chime1", vol: 0.2 },
  { at: W.chose, src: "chime5", vol: 0.26 },
  { at: W.chose + 0.2, src: "sub", vol: 0.28 },
  { at: 14.08, src: "whoosh", vol: 0.3 },
  ...Array.from({ length: 12 }, (_, i) => ({ at: W.write + 0.25 + i * 0.2, src: "tick", vol: 0.05 })),
  { at: W.present + 0.07, src: "shimmer", vol: 0.26 },
  { at: W.tense, src: "chime3", vol: 0.2 },
  { at: W.manifest - 0.05, src: "impact", vol: 0.42 },
  { at: W.with2, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.35 },
  { at: 20.95, src: "whoosh", vol: 0.3 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74, 0.86, 0.98, 1.1].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice4.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
