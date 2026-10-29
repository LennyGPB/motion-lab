import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { C, loadFonts, SANS, SERIF, serifGradient } from "../signspath/theme";
import { clamp, eIn, eInOut, eOut, hash, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { DURATION_FRAMES, SC, T, W } from "./timing";

loadFonts();

type Key = keyof typeof SC;
const on = (f: number, k: Key) => f >= T(SC[k][0]) - 1 && f < T(SC[k][1]) + 2;
/** Entrée/sortie très douce (fondu long + flou), pour un rythme apaisé. */
const sceneFx = (f: number, k: Key) => {
  const a = T(SC[k][0]);
  const b = T(SC[k][1]);
  const i = prog(f, a, a + 16, eOut);
  const o = prog(f, b - 14, b, eIn);
  return {
    opacity: i * (1 - o),
    transform: `scale(${lerp(1.04, 1, i) * (1 + o * 0.05)})`,
    filter: i < 1 || o > 0 ? `blur(${(1 - i) * 12 + o * 16}px)` : undefined,
  } as React.CSSProperties;
};
const capsStyle: React.CSSProperties = { fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.32em", color: C.muted, textTransform: "uppercase" };
const glass = (a: number): React.CSSProperties => ({
  background: `linear-gradient(160deg, rgba(255,255,255,${0.08 + 0.12 * a}), rgba(190,170,255,0.04)), rgba(36,18,92,0.85)`,
  border: `1.5px solid rgba(225,215,255,${0.2 + 0.5 * a})`,
  boxShadow: `0 0 ${a * 40}px rgba(150,110,255,${0.55 * a})`,
});

/** Lune en croissant (disque masqué : pas de second disque visible). */
const Moon: React.FC<{ cx: number; cy: number; r: number; op?: number }> = ({ cx, cy, r, op = 1 }) => {
  const mask = `radial-gradient(circle at 78% 30%, transparent ${r * 0.86}px, #000 ${r * 0.9}px)`;
  return (
    <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, opacity: op }}>
      <div style={{ position: "absolute", inset: -r * 0.8, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,205,255,0.3), transparent 65%)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fbf8ff, #d9ccff 60%, #b9a6ff)", maskImage: mask, WebkitMaskImage: mask, filter: "drop-shadow(0 0 24px rgba(210,190,255,0.8))" }} />
    </div>
  );
};

const AFF: Key[] = ["a1", "a2", "a3", "a4", "a5", "a6"];

/** Motion SignsPath #7 — affirmations du soir (1080x1920). */
export const Night: React.FC = () => {
  const f = useCurrentFrame();
  const idx = AFF.findIndex((k) => f >= T(SC[k][0]) && f < T(SC[k][1]));
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      {/* nuit : on assombrit le fond */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,1,14,0.55), rgba(3,1,14,0.15) 50%, rgba(3,1,14,0.5))" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.012 * Math.sin(f / 70)})` }}>
        {/* compteur d'affirmations */}
        <div style={{ position: "absolute", top: 140, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: idx >= 0 ? prog(f, T(SC.a1[0]), T(SC.a1[0]) + 20) * (1 - prog(f, T(SC.end[0]) - 10, T(SC.end[0]))) : 0 }}>
          affirmation {idx >= 0 ? idx + 1 : 6} / 6
        </div>
        <div style={{ position: "absolute", top: 186, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14, opacity: idx >= 0 ? 1 : 0 }}>
          {AFF.map((k, i) => (
            <div key={k} style={{ width: i === idx ? 34 : 10, height: 10, borderRadius: 5, background: i <= idx ? C.lilacSoft : "rgba(225,215,255,0.25)", boxShadow: i === idx ? "0 0 12px #c8b0ff" : undefined }} />
          ))}
        </div>
        {on(f, "intro") ? <SceneIntro f={f} /> : null}
        {on(f, "a1") ? <SceneLetGo f={f} /> : null}
        {on(f, "a2") ? <SceneRest f={f} /> : null}
        {on(f, "a3") ? <SceneBecoming f={f} /> : null}
        {on(f, "a4") ? <ScenePromises f={f} /> : null}
        {on(f, "a5") ? <SceneRepeat f={f} /> : null}
        {on(f, "a6") ? <SceneSleep f={f} /> : null}
        {on(f, "end") ? <SceneEnd f={f} /> : null}
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- « Listen to this before you fall asleep. » ---------- */
const SceneIntro: React.FC<{ f: number }> = ({ f }) => {
  const rise = prog(f, 0, T(W.asleepEnd), eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "intro")}>
      <div style={{ position: "absolute", top: 160, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: prog(f, 0, 20) }}>night affirmations</div>
      <Words
        f={f}
        top={430}
        size={90}
        lineGap={4}
        lines={[
          [{ t: "Listen", at: W.listen, kind: "bold" }, { t: "to this", at: W.to }],
          [{ t: "before you", at: W.before, kind: "muted", size: 110 }],
          [{ t: "fall asleep.", at: W.fall, kind: "serif" }],
        ]}
      />
      <Moon cx={540} cy={lerp(1500, 1230, rise)} r={120} op={rise} />
      <div style={{ position: "absolute", top: 1480, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: prog(f, T(W.fall), T(W.fall) + 20) }}>repeat · breathe · rest</div>
    </AbsoluteFill>
  );
};

/* ---------- « I let go of this day. I did what I could. » ---------- */
const PARTS = Array.from({ length: 80 }, (_, i) => ({ a: hash(i) * Math.PI * 2, r: Math.sqrt(hash(i + 3)) * 110, v: 0.4 + hash(i + 7) * 1.2, d: hash(i + 9) * 40 - 20 }));
const SceneLetGo: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.a1[0]);
  const sink = prog(f, T(W.go), T(W.dayEnd) + 10, eInOut);
  const dissolve = prog(f, T(W.go) + 6, T(W.couldEnd), eOut);
  const cy = lerp(1240, 1330, sink);
  return (
    <AbsoluteFill style={sceneFx(f, "a1")}>
      <Words
        f={f}
        top={300}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "I", at: W.i, kind: "bold" }, { t: "let go", at: W.let, kind: "serif" }],
          [{ t: "of this day.", at: W.of, kind: "muted", size: 110 }],
          [{ t: "I did", at: W.i2, kind: "bold" }, { t: "what", at: W.what, kind: "muted", size: 110 }],
          [{ t: "I could.", at: W.could, kind: "serif" }],
        ]}
      />
      {/* le "jour" : disque doux qui se défait en poussière */}
      <div style={{ position: "absolute", left: 540 - 120, top: cy - 120, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,240,0.95), rgba(210,170,255,0.6) 55%, rgba(160,120,255,0) 72%)", opacity: prog(f, st, st + 16) * (1 - dissolve), transform: `scale(${1 - 0.3 * dissolve})`, filter: `blur(${dissolve * 6}px)` }} />
      {PARTS.map((p, i) => {
        const k = dissolve;
        const x = 540 + Math.cos(p.a) * p.r * (1 + k * 1.5) + p.d * k;
        const y = cy + Math.sin(p.a) * p.r - k * (180 + 300 * p.v);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 4, height: 4, borderRadius: 2, background: "#efe6ff", opacity: k * (1 - k) * 2.4, boxShadow: "0 0 8px #c8b0ff" }} />;
      })}
      <div style={{ position: "absolute", left: 160, right: 160, top: 1380, height: 2, background: "linear-gradient(90deg, transparent, rgba(225,215,255,0.5), transparent)", opacity: prog(f, st, st + 20) }} />
    </AbsoluteFill>
  );
};

/* ---------- « My body rests, my mind settles. » ---------- */
const SceneRest: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.a2[0]);
  const breath = 0.5 + 0.5 * Math.sin((f - st) / 22 - Math.PI / 2);
  const calm = prog(f, T(W.mind), T(W.settlesEnd), eInOut);
  const amp = lerp(70, 6, calm);
  const pts = Array.from({ length: 81 }, (_, i) => {
    const x = 140 + i * 10;
    const y = 1560 + Math.sin(i / 4 + (f - st) / 8) * amp * Math.sin((i / 80) * Math.PI);
    return `${i ? "L" : "M"} ${x} ${y.toFixed(1)}`;
  }).join(" ");
  return (
    <AbsoluteFill style={sceneFx(f, "a2")}>
      <Words
        f={f}
        top={300}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "My", at: W.my, kind: "muted", size: 110 }, { t: "body", at: W.body, kind: "bold" }],
          [{ t: "rests,", at: W.rests, kind: "serif" }],
          [{ t: "my", at: W.my2, kind: "muted", size: 110 }, { t: "mind", at: W.mind, kind: "bold" }],
          [{ t: "settles.", at: W.settles, kind: "serif" }],
        ]}
      />
      {/* cercle de respiration */}
      <div style={{ position: "absolute", left: 540 - 200, top: 1180 - 200, width: 400, height: 400, borderRadius: "50%", border: "2px solid rgba(225,215,255,0.35)", transform: `scale(${0.7 + 0.3 * breath})`, boxShadow: `0 0 ${30 + 40 * breath}px rgba(170,130,255,0.35), inset 0 0 ${30 + 30 * breath}px rgba(170,130,255,0.25)` }} />
      <div style={{ position: "absolute", left: 540 - 90, top: 1180 - 90, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,230,255,0.85), rgba(170,130,255,0.25) 60%, transparent 72%)", transform: `scale(${0.75 + 0.35 * breath})` }} />
      <div style={{ position: "absolute", top: 1165, left: 0, right: 0, textAlign: "center", ...capsStyle, color: "#fff", fontSize: 22, opacity: 0.8 }}>{breath > 0.5 ? "breathe in" : "breathe out"}</div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d={pts} stroke="rgba(225,215,255,0.7)" strokeWidth={3} fill="none" style={{ filter: "drop-shadow(0 0 8px #b48cff)" }} />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- « I am becoming the person I want to be. » ---------- */
const SceneBecoming: React.FC<{ f: number }> = ({ f }) => {
  const grow = prog(f, T(W.becoming), T(W.beEnd) + 6, eInOut);
  const ring = prog(f, T(W.person), T(W.beEnd), eInOut);
  return (
    <AbsoluteFill style={sceneFx(f, "a3")}>
      <Orb cx={540} cy={1280} R={120 + 90 * grow} power={0.3 + 0.8 * grow} flicker={0} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <circle cx={540} cy={1280} r={290} fill="none" stroke="rgba(225,215,255,0.12)" strokeWidth={2} />
        <circle cx={540} cy={1280} r={290} fill="none" stroke="rgba(235,220,255,0.85)" strokeWidth={3} pathLength={1} strokeDasharray={`${ring} 1`} transform="rotate(-90 540 1280)" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px #b48cff)" }} />
      </svg>
      <Words
        f={f}
        top={300}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "I am", at: W.i3, kind: "bold" }],
          [{ t: "becoming", at: W.becoming, kind: "serif" }],
          [{ t: "the person", at: W.the, kind: "muted", size: 110 }],
          [{ t: "I want to be.", at: W.want, kind: "serif" }],
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------- « Every day, I keep my promises to myself a little more. » ---------- */
const ScenePromises: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.a4[0]);
  const lit = (i: number) => prog(f, T(W.keep) + i * 9, T(W.keep) + i * 9 + 12, eOut);
  const thread = prog(f, T(W.keep), T(W.more) + 8, eInOut);
  const X = (i: number) => 180 + i * 120;
  const Y = (i: number) => 1450 - i * 22;
  return (
    <AbsoluteFill style={sceneFx(f, "a4")}>
      <Words
        f={f}
        top={290}
        size={78}
        lineGap={0}
        lines={[
          [{ t: "Every day,", at: W.every, kind: "muted", size: 104 }],
          [{ t: "I keep my", at: W.i4, kind: "bold" }],
          [{ t: "promises", at: W.promises, kind: "serif" }],
          [{ t: "to myself", at: W.to2, kind: "muted", size: 104 }],
          [{ t: "a little more.", at: W.a, kind: "serif" }],
        ]}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: prog(f, st, st + 16) }}>
        <path d={Array.from({ length: 7 }, (_, i) => `${i ? "L" : "M"} ${X(i)} ${Y(i)}`).join(" ")} stroke="rgba(230,210,255,0.9)" strokeWidth={3} fill="none" pathLength={1} strokeDasharray={`${thread} 1`} style={{ filter: "drop-shadow(0 0 8px #b48cff)" }} />
      </svg>
      {Array.from({ length: 7 }, (_, i) => {
        const q = lit(i);
        return (
          <div key={i} style={{ position: "absolute", left: X(i) - 34, top: Y(i) - 34, width: 68, height: 68, borderRadius: "50%", ...glass(q), opacity: prog(f, st + i * 2, st + 16 + i * 2), transform: `scale(${0.8 + 0.2 * q + 0.06 * i * q})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", opacity: q, boxShadow: "0 0 12px #c8b0ff" }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1560, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: thread }}>promises kept · a little more each day</div>
    </AbsoluteFill>
  );
};

/* ---------- « What I repeat becomes my reality. » ---------- */
const SceneRepeat: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.a5[0]);
  const echo = prog(f, T(W.repeat), T(W.repeat) + 30, eOut);
  const real = prog(f, T(W.reality), T(W.realEnd) + 6, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "a5")}>
      {/* ondes qui se répètent */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2, 3].map((i) => {
          const p = ((((f - st) / 50 + i / 4) % 1) + 1) % 1;
          return <circle key={i} cx={540} cy={1320} r={60 + p * 380} fill="none" stroke="rgba(225,215,255,0.6)" strokeWidth={2} opacity={(1 - p) * prog(f, st, st + 20)} />;
        })}
      </svg>
      {/* « repeat » en écho */}
      {[3, 2, 1].map((k) => (
        <div key={k} style={{ position: "absolute", top: 1240 + k * 40 * echo, left: 0, right: 0, textAlign: "center", ...serifGradient, fontSize: 110, opacity: echo * (0.35 - k * 0.09) * (1 - real), filter: `blur(${k * 1.5}px)` }}>
          repeat
        </div>
      ))}
      <div style={{ position: "absolute", top: 1240, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 110, color: "#f2ecff", opacity: real, transform: `scale(${lerp(0.9, 1, real)})`, textShadow: "0 0 30px rgba(190,160,255,0.8)" }}>reality</div>
      <Words
        f={f}
        top={300}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "What I", at: W.what2, kind: "muted", size: 110 }],
          [{ t: "repeat", at: W.repeat, kind: "serif" }],
          [{ t: "becomes", at: W.becomes, kind: "bold" }],
          [{ t: "my reality.", at: W.my4, kind: "serif" }],
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------- « I fall asleep in peace, and I wake up ready to move forward. » ---------- */
const SceneSleep: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.a6[0]);
  const dawn = prog(f, T(W.wake), T(W.fwdEnd), eInOut);
  const fwd = prog(f, T(W.move), T(W.fwdEnd) + 10, eInOut);
  return (
    <AbsoluteFill style={sceneFx(f, "a6")}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 45% at 50% 100%, rgba(255,205,215,0.55), rgba(190,150,255,0.25) 45%, transparent 75%)", opacity: dawn }} />
      <Moon cx={540} cy={lerp(1240, 1320, dawn)} r={110} op={prog(f, st, st + 20) * (1 - dawn)} />
      <div style={{ position: "absolute", left: 540 - 150, top: lerp(1700, 1380, dawn), width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #fff6ee, #ffd6c8 45%, rgba(255,200,190,0) 72%)", opacity: dawn }} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: fwd }}>
        <path d="M 240 1640 L 840 1640" stroke="rgba(255,240,240,0.9)" strokeWidth={4} pathLength={1} strokeDasharray={`${fwd} 1`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px #ffd6c8)" }} />
        <path d={`M ${lerp(240, 840, fwd) - 26} 1620 L ${lerp(240, 840, fwd)} 1640 L ${lerp(240, 840, fwd) - 26} 1660`} stroke="rgba(255,240,240,0.95)" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Words
        f={f}
        top={290}
        size={80}
        lineGap={2}
        lines={[
          [{ t: "I fall asleep", at: W.i6, kind: "muted", size: 110 }],
          [{ t: "in peace,", at: W.in, kind: "serif" }],
          [{ t: "and I", at: W.and, kind: "muted", size: 110 }, { t: "wake up", at: W.wake, kind: "bold" }],
          [{ t: "ready to move", at: W.ready }],
          [{ t: "forward.", at: W.forward, kind: "serif" }],
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------- « Full guide at signspath.com » ---------- */
const SceneEnd: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.end[0]);
  const parts = [
    { txt: "signs", from: W.signs, to: W.path },
    { txt: "path", from: W.path, to: W.dot },
    { txt: ".com", from: W.dot, to: W.comEnd },
  ];
  let typed = "";
  for (const p of parts) typed += p.txt.slice(0, Math.round(interpolate(f, [T(p.from), T(p.to) - 1], [0, p.txt.length], clamp)));
  const card = prog(f, T(W.at), T(W.at) + 16, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "end")}>
      <Orb cx={540} cy={820} R={150} power={0.6 + 0.3 * Math.sin((f - st) / 25)} flicker={0} />
      <Words f={f} top={1080} size={84} lines={[[{ t: "Full guide at", at: W.full, kind: "muted", size: 110 }]]} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 1220, height: 150, borderRadius: 999, ...glass(0.6 * card), opacity: card, transform: `scale(${lerp(0.9, 1, card)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...serifGradient, fontSize: 96, lineHeight: 1 }}>{typed}</span>
        <span style={{ width: 3, height: 70, marginLeft: 6, background: C.lilacSoft, opacity: Math.floor(f / 10) % 2 ? 1 : 0.2 }} />
      </div>
      <div style={{ position: "absolute", top: 1440, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: prog(f, T(W.comEnd), T(W.comEnd) + 20) }}>sleep well</div>
    </AbsoluteFill>
  );
};

/* ---------- Son : peu d'effets, musique calme, voix avec écho ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_soft", vol: 0.12 },
  { at: W.i, src: "chime1", vol: 0.1 },
  { at: W.my, src: "chime2", vol: 0.1 },
  { at: W.i3, src: "chime3", vol: 0.1 },
  { at: W.every, src: "chime1", vol: 0.1 },
  { at: W.what2, src: "chime2", vol: 0.1 },
  { at: W.i6, src: "chime3", vol: 0.1 },
  { at: W.full, src: "shimmer", vol: 0.14 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={staticFile("signspath/night/music.wav")} volume={(fr) => interpolate(fr, [0, 40, DURATION_FRAMES - 60, DURATION_FRAMES], [0, 0.42, 0.42, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/night/voice.wav")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

