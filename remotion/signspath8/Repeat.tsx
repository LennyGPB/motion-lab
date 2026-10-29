import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { C, loadFonts, SANS, serifGradient } from "../signspath/theme";
import { clamp, eIn, eOut, lerp, prog } from "../signspath/util";
import { Token, Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { AFF, DURATION_FRAMES, T, W } from "./timing";

loadFonts();

const capsStyle: React.CSSProperties = { fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.32em", color: C.muted, textTransform: "uppercase" };
const glass = (a: number): React.CSSProperties => ({
  background: `linear-gradient(160deg, rgba(255,255,255,${0.08 + 0.12 * a}), rgba(190,170,255,0.04)), rgba(36,18,92,0.85)`,
  border: `1.5px solid rgba(225,215,255,${0.2 + 0.5 * a})`,
  boxShadow: `0 0 ${a * 40}px rgba(150,110,255,${0.55 * a})`,
});

/** Fenêtre d'une scène [a, b[ (en temps voix) avec fondus longs. */
const fx = (f: number, a: number, b: number): React.CSSProperties => {
  const i = prog(f, T(a), T(a) + 16, eOut);
  const o = prog(f, T(b) - 14, T(b), eIn);
  return { opacity: i * (1 - o), transform: `scale(${lerp(1.04, 1, i) * (1 + o * 0.05)})`, filter: i < 1 || o > 0 ? `blur(${(1 - i) * 12 + o * 16}px)` : undefined };
};

const LINES: Token[][][] = [
  [
    [{ t: "I am", at: W.i1, kind: "bold" }],
    [{ t: "capable", at: W.capable, kind: "serif" }],
    [{ t: "of keeping", at: W.of, kind: "muted", size: 110 }],
    [{ t: "my commitments.", at: W.my1, kind: "serif", size: 70 }],
  ],
  [
    [{ t: "I", at: W.i2, kind: "bold" }, { t: "choose", at: W.choose, kind: "serif" }],
    [{ t: "what I", at: W.what, kind: "muted", size: 110 }],
    [{ t: "repeat.", at: W.repeat, kind: "serif" }],
  ],
  [
    [{ t: "Every day,", at: W.every, kind: "muted", size: 110 }],
    [{ t: "I move", at: W.i3, kind: "bold" }],
    [{ t: "forward", at: W.forward, kind: "serif" }],
    [{ t: "a little more.", at: W.a, kind: "muted", size: 110 }],
  ],
  [
    [{ t: "My life", at: W.my4, kind: "bold" }],
    [{ t: "is built", at: W.is, kind: "muted", size: 110 }],
    [{ t: "with method.", at: W.with, kind: "serif" }],
  ],
  [
    [{ t: "I", at: W.i5, kind: "bold" }, { t: "deserve", at: W.deserve, kind: "serif" }],
    [{ t: "the life", at: W.the, kind: "muted", size: 110 }],
    [{ t: "I'm building.", at: W.im, kind: "serif" }],
  ],
];

/** Motion SignsPath #8 — « Repeat after me » : affirmations avec 3 s pour répéter. */
export const Repeat: React.FC = () => {
  const f = useCurrentFrame();
  const cur = AFF.findIndex((a, i) => f >= T(a.start) - 9 && f < T(i < AFF.length - 1 ? AFF[i + 1].start : W.full) - 9);
  const done = AFF.filter((a) => f >= T(a.end) + 90).length;
  const sceneEnd = (i: number) => (i < AFF.length - 1 ? AFF[i + 1].start : W.full) - 0.3;
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,1,14,0.5), rgba(3,1,14,0.1) 50%, rgba(3,1,14,0.45))" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.012 * Math.sin(f / 70)})` }}>
        {/* orbe central qui gagne en lumière à chaque affirmation répétée */}
        <AbsoluteFill style={{ opacity: prog(f, 0, 30) * (1 - prog(f, T(W.full) - 20, T(W.full))) }}>
          <Orb cx={540} cy={1330} R={150 + done * 12} power={0.35 + done * 0.13 + 0.15 * Math.sin(f / 30)} flicker={0} />
        </AbsoluteFill>
        {/* progression */}
        <div style={{ position: "absolute", top: 140, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: (cur >= 0 ? 1 : prog(f, 0, 20)) * (1 - prog(f, T(W.full) - 20, T(W.full))) }}>
          {cur >= 0 ? `affirmation ${cur + 1} / 5` : "repeat after me"}
        </div>
        <div style={{ position: "absolute", top: 186, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14, opacity: prog(f, T(W.i1) - 10, T(W.i1)) * (1 - prog(f, T(W.full) - 20, T(W.full))) }}>
          {AFF.map((_, i) => (
            <div key={i} style={{ width: i === cur ? 34 : 10, height: 10, borderRadius: 5, background: i < done || i === cur ? C.lilacSoft : "rgba(225,215,255,0.25)", boxShadow: i === cur ? "0 0 12px #c8b0ff" : undefined }} />
          ))}
        </div>

        {/* intro */}
        {f < T(W.i1) ? (
          <AbsoluteFill style={fx(f, -0.25, W.i1 - 0.3)}>
            <Words
              f={f}
              top={480}
              size={92}
              lineGap={4}
              lines={[[{ t: "Repeat", at: W.repeat0, kind: "serif", size: 110 }], [{ t: "after me.", at: W.after, kind: "bold" }]]}
            />
            <div style={{ position: "absolute", top: 820, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: prog(f, T(W.meEnd), T(W.meEnd) + 20) }}>5 affirmations · 3 seconds each</div>
            <Pause f={f} from={W.meEnd + 0.15} label="get ready" />
          </AbsoluteFill>
        ) : null}

        {/* affirmations */}
        {AFF.map((a, i) =>
          f >= T(a.start) - 10 && f < T(sceneEnd(i)) + 2 ? (
            <AbsoluteFill key={i} style={fx(f, a.start - 0.3, sceneEnd(i))}>
              <Words f={f} top={i === 0 || i === 2 ? 300 : 360} size={86} lineGap={2} lines={LINES[i]} />
              <Pause f={f} from={a.end + 0.1} label="your turn · repeat" />
            </AbsoluteFill>
          ) : null,
        )}

        {f >= T(W.full) - 10 ? <End f={f} /> : null}
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/** Pause de 3 s : anneau qui se remplit autour de l'orbe + invitation à répéter. */
const Pause: React.FC<{ f: number; from: number; label: string }> = ({ f, from, label }) => {
  const a = T(from);
  const p = prog(f, a, a + 90, (x) => x);
  const vis = prog(f, a - 6, a + 10) * (1 - prog(f, a + 84, a + 96));
  const R = 270;
  const secs = Math.max(1, 3 - Math.floor((f - a) / 30));
  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <circle cx={540} cy={1330} r={R} fill="none" stroke="rgba(225,215,255,0.14)" strokeWidth={3} />
        <circle cx={540} cy={1330} r={R} fill="none" stroke="rgba(235,220,255,0.9)" strokeWidth={4} pathLength={1} strokeDasharray={`${p} 1`} transform="rotate(-90 540 1330)" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px #b48cff)" }} />
      </svg>
      <div style={{ position: "absolute", top: 1660, left: 0, right: 0, textAlign: "center", ...capsStyle, color: C.lilacSoft }}>{label}</div>
      <div style={{ position: "absolute", top: 1710, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16 }}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ width: 12, height: 12, borderRadius: 6, background: "#fff", opacity: k < 3 - secs + 1 ? 0.95 : 0.25, boxShadow: k < 3 - secs + 1 ? "0 0 10px #c8b0ff" : undefined }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const End: React.FC<{ f: number }> = ({ f }) => {
  const parts = [
    { txt: "signs", from: W.signs, to: W.path },
    { txt: "path", from: W.path, to: W.dot },
    { txt: ".com", from: W.dot, to: W.comEnd },
  ];
  let typed = "";
  for (const p of parts) typed += p.txt.slice(0, Math.round(interpolate(f, [T(p.from), T(p.to) - 1], [0, p.txt.length], clamp)));
  const card = prog(f, T(W.at), T(W.at) + 16, eOut);
  const st = T(W.full);
  return (
    <AbsoluteFill style={{ opacity: prog(f, st - 10, st + 10), filter: f < st + 10 ? `blur(${(1 - prog(f, st - 10, st + 10)) * 12}px)` : undefined }}>
      <Orb cx={540} cy={820} R={170} power={0.9 + 0.2 * Math.sin((f - st) / 25)} flicker={0} />
      <div style={{ position: "absolute", top: 1020, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
        {AFF.map((_, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: C.lilacSoft, boxShadow: "0 0 12px #c8b0ff" }} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 1060, left: 0, right: 0, textAlign: "center", ...capsStyle }}>5 / 5 · well done</div>
      <Words f={f} top={1150} size={84} lines={[[{ t: "Full guide at", at: W.full, kind: "muted", size: 110 }]]} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 1290, height: 150, borderRadius: 999, ...glass(0.6 * card), opacity: card, transform: `scale(${lerp(0.9, 1, card)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...serifGradient, fontSize: 96, lineHeight: 1 }}>{typed}</span>
        <span style={{ width: 3, height: 70, marginLeft: 6, background: C.lilacSoft, opacity: Math.floor(f / 10) % 2 ? 1 : 0.2 }} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- son : musique calme, voix avec écho, presque pas d'effets ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_soft", vol: 0.1 },
  ...AFF.map((a, i) => ({ at: a.start - 0.05, src: `chime${(i % 3) + 1}`, vol: 0.08 })),
  { at: W.full, src: "shimmer", vol: 0.14 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={staticFile("signspath/repeat/music.wav")} volume={(fr) => interpolate(fr, [0, 40, DURATION_FRAMES - 60, DURATION_FRAMES], [0, 0.42, 0.42, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/repeat/voice.wav")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

