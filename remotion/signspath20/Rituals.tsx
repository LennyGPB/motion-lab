import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { C, loadFonts, SANS, SERIF, serifGradient } from "../signspath/theme";
import { clamp, eBack, eInOut, eOut, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { Shot, StoreCTA, capsStyle, glass, mkScenes, pillBg } from "../signspath18/shared";
import { DURATION_FRAMES, SC, T, W } from "./timing";

loadFonts();
const { on, fx } = mkScenes(SC);

const Sun: React.FC<{ size: number; f: number }> = ({ size, f }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ filter: "drop-shadow(0 0 16px rgba(255,220,180,0.8))" }}>
    <circle r={18} fill="#ffe6c2" />
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={i} x1={0} y1={-28} x2={0} y2={-40} stroke="#ffe6c2" strokeWidth={6} strokeLinecap="round" transform={`rotate(${i * 45 + f * 0.6})`} />
    ))}
  </svg>
);
const Moon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ filter: "drop-shadow(0 0 16px rgba(200,180,255,0.9))" }}>
    <path d="M 12 -34 A 36 36 0 1 0 34 14 A 28 28 0 1 1 12 -34 Z" fill="#dcd2ff" />
  </svg>
);

/** Ligne de rituel cochée au moment où elle est dite. */
const Step: React.FC<{ f: number; at: number; n: number; label: string; note?: string; top: number }> = ({ f, at, n, label, note, top }) => {
  const q = prog(f, T(at) - 2, T(at) + 12, eBack);
  const done = prog(f, T(at) + 10, T(at) + 18, eBack);
  return (
    <div style={{ position: "absolute", left: 100, right: 100, top, padding: "26px 34px", borderRadius: 32, ...glass(0.3 + 0.5 * Math.min(1, q)), display: "flex", alignItems: "center", gap: 28, opacity: Math.min(1, q * 1.5), transform: `translateX(${(1 - Math.min(1, q)) * -60}px)` }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid rgba(207,194,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", background: done > 0 ? pillBg : undefined, flexShrink: 0 }}>
        {done > 0 ? <span style={{ transform: `scale(${done})` }}>✓</span> : n}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.white, letterSpacing: -1 }}>{label}</div>
        {note ? <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 36, color: C.lilacSoft, marginTop: 4, opacity: done }}>{note}</div> : null}
      </div>
    </div>
  );
};

/** Motion SignsPath #20 — « 5 minutes le matin, 5 minutes le soir » (pub app Signs). */
export const Rituals: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.015 * Math.sin(f / 55)})` }}>
        {on(f, "a") ? <SceneA f={f} /> : null}
        {on(f, "b") ? <SceneMorning f={f} /> : null}
        {on(f, "c") ? <SceneNight f={f} /> : null}
        {on(f, "d") ? <SceneEvery f={f} /> : null}
        {on(f, "cta") ? (
          <AbsoluteFill style={fx(f, "cta")}>
            <Orb cx={540} cy={534} R={170} power={0.55 + 0.25 * prog(f, T(W.signs2), T(W.signs2) + 20)} />
            <StoreCTA f={f} W={W} top={400} />
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : « 5 minutes in the morning. 5 minutes at night. That's it. » ---------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const half = (at: number, end: number, left: number, night: boolean) => {
    const q = prog(f, T(at) - 2, T(at) + 12, eBack);
    const ring = prog(f, T(at), T(end) + 6, eInOut);
    return (
      <div style={{ position: "absolute", left, top: 720, width: 400, height: 560, borderRadius: 40, ...glass(0.5), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, opacity: Math.min(1, q * 1.5), transform: `translateY(${(1 - Math.min(1, q)) * 60}px)` }}>
        <div style={{ position: "relative", width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={220} height={220} style={{ position: "absolute", inset: 0 }}>
            <circle cx={110} cy={110} r={96} stroke="rgba(255,255,255,0.12)" strokeWidth={10} fill="none" />
            <circle cx={110} cy={110} r={96} stroke={night ? C.lilacSoft : "#ffd9a8"} strokeWidth={10} fill="none" pathLength={1} strokeDasharray={`${ring} 1`} strokeLinecap="round" transform="rotate(-90 110 110)" />
          </svg>
          {night ? <Moon size={110} /> : <Sun size={120} f={f} />}
        </div>
        <div style={{ ...serifGradient, fontSize: 96 }}>5 min</div>
        <div style={{ ...capsStyle, fontSize: 22 }}>{night ? "at night" : "in the morning"}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={fx(f, "a")}>
      <Words
        f={f}
        top={240}
        size={74}
        lineGap={2}
        lines={[
          [{ t: "5 minutes", at: W.five, kind: "bold" }, { t: "in the morning.", at: W.morning - 0.1, kind: "muted", size: 100 }],
          [{ t: "5 minutes", at: W.five2, kind: "bold" }, { t: "at night.", at: W.night - 0.05, kind: "muted", size: 100 }],
        ]}
      />
      {half(W.five, W.mEnd, 100, false)}
      {half(W.five2, W.nEnd, 580, true)}
      <Words f={f} top={1420} size={84} lines={[[{ t: "That's it.", at: W.thats, kind: "serif" }]]} />
    </AbsoluteFill>
  );
};

/* ---------- B : le rituel du matin ---------- */
const SceneMorning: React.FC<{ f: number }> = ({ f }) => {
  const h = prog(f, T(W.morning2) - 2, T(W.morning2) + 12, eBack);
  return (
    <AbsoluteFill style={fx(f, "b")}>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, opacity: Math.min(1, h * 1.4), transform: `scale(${lerp(0.85, 1, Math.min(1, h))})` }}>
        <Sun size={130} f={f} />
        <span style={{ ...serifGradient, fontSize: 160 }}>Morning</span>
      </div>
      <Step f={f} at={W.set} n={1} label="Set your energy" note="confident and prosperous." top={480} />
      <Step f={f} at={W.repeat} n={2} label="Repeat your affirmation" note="7 times, out loud." top={700} />
      <Step f={f} at={W.choose} n={3} label="Choose one aligned action" note="send that one email." top={920} />
      <div style={{ position: "absolute", left: 400, top: 1180 }}>
        <Shot src="repeat" w={280} q={prog(f, T(W.repeat) - 2, T(W.repeat) + 14, eBack)} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- C : le journal du soir ---------- */
const JOURNAL = [
  { at: W.write, label: "The sign you noticed", note: "“11:11, twice today.”", top: 480 },
  { at: W.proof, label: "Proof you're moving forward", note: "“A client said yes.”", top: 700 },
  { at: W.how, label: "How you felt", note: "“Calm. Grateful.”", top: 920 },
];
const SceneNight: React.FC<{ f: number }> = ({ f }) => {
  const h = prog(f, T(W.night2) - 2, T(W.night2) + 12, eBack);
  return (
    <AbsoluteFill style={fx(f, "c")}>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, opacity: Math.min(1, h * 1.4), transform: `scale(${lerp(0.85, 1, Math.min(1, h))})` }}>
        <Moon size={120} />
        <span style={{ ...serifGradient, fontSize: 160 }}>Night</span>
      </div>
      {JOURNAL.map((j, i) => (
        <Step key={j.label} f={f} at={j.at} n={i + 1} label={j.label} note={j.note} top={j.top} />
      ))}
      <Words
        f={f}
        top={1250}
        size={66}
        lineGap={2}
        lines={[
          [{ t: "write down", at: W.write, kind: "muted", size: 90 }, { t: "the sign,", at: W.sign, kind: "bold" }],
          [{ t: "the proof,", at: W.proof, kind: "bold" }, { t: "how you felt.", at: W.how, kind: "serif", size: 52 }],
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------- D : « Do it every day, and watch what changes. » ---------- */
const SceneEvery: React.FC<{ f: number }> = ({ f }) => {
  const n = Math.min(30, Math.max(0, Math.floor((f - T(W.every)) / 1.2)));
  const curve = prog(f, T(W.watch), T(W.chEnd) + 6, eInOut);
  return (
    <AbsoluteFill style={fx(f, "d")}>
      <Words
        f={f}
        top={220}
        size={88}
        lineGap={2}
        lines={[
          [{ t: "Do it", at: W.do, kind: "muted", size: 110 }, { t: "every day,", at: W.every, kind: "bold" }],
          [{ t: "and watch", at: W.and, kind: "muted", size: 110 }],
          [{ t: "what changes.", at: W.changes, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 140, right: 140, top: 820, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 12 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} style={{ height: 66, borderRadius: 16, ...glass(i < n ? 0.85 : 0.08), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff" }}>{i < n ? "✦" : ""}</div>
        ))}
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d="M 140 1600 C 380 1590, 560 1500, 700 1380 S 900 1180, 940 1140" stroke="url(#gUp)" strokeWidth={8} fill="none" pathLength={1} strokeDasharray={`${curve} 1`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 12px #b48cff)" }} />
        <defs>
          <linearGradient id="gUp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#f1ebff" />
          </linearGradient>
        </defs>
        <circle cx={940} cy={1140} r={16} fill="#fff" opacity={prog(f, T(W.chEnd) - 2, T(W.chEnd) + 6, eOut)} style={{ filter: "drop-shadow(0 0 16px #fff)" }} />
      </svg>
      <div style={{ position: "absolute", left: 140, top: 1640, ...capsStyle, fontSize: 20 }}>day 1</div>
      <div style={{ position: "absolute", right: 120, top: 1080, ...capsStyle, fontSize: 20, color: C.lilacSoft, opacity: curve }}>day 30</div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.five, src: "chime1", vol: 0.2 },
  { at: W.five2, src: "chime2", vol: 0.2 },
  { at: W.thats, src: "sub", vol: 0.24 },
  { at: 3.5, src: "whoosh", vol: 0.3 },
  { at: W.morning2, src: "shimmer", vol: 0.24 },
  { at: W.set + 0.33, src: "tick_low", vol: 0.2 },
  { at: W.repeat + 0.33, src: "tick_low", vol: 0.2 },
  { at: W.choose + 0.33, src: "tick_low", vol: 0.2 },
  { at: 9.35, src: "whoosh", vol: 0.3 },
  { at: W.night2, src: "chime5", vol: 0.22 },
  { at: W.write + 0.33, src: "tick_low", vol: 0.2 },
  { at: W.proof + 0.33, src: "tick_low", vol: 0.2 },
  { at: W.how + 0.33, src: "tick_low", vol: 0.2 },
  { at: 14.8, src: "whoosh", vol: 0.3 },
  ...Array.from({ length: 12 }, (_, i) => ({ at: W.every + i * 0.1, src: "tick", vol: 0.06 })),
  { at: W.watch, src: "riser", vol: 0.14 },
  { at: W.changes, src: "shimmer", vol: 0.24 },
  { at: 17.75, src: "whoosh", vol: 0.3 },
  { at: W.signs2, src: "impact", vol: 0.3 },
  { at: W.signs2, src: "shimmer", vol: 0.3 },
  { at: W.ios, src: "chime2", vol: 0.2 },
  { at: W.android, src: "chime3", vol: 0.2 },
  { at: W.end, src: "chime6", vol: 0.2 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice-promo3.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
