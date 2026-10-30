import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { C, loadFonts, SANS, serifGradient } from "../signspath/theme";
import { T } from "../signspath/timing";
import { clamp, eIn, eOut, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { Mantra, MONEY, SKILL } from "./config";

loadFonts();

const capsStyle: React.CSSProperties = { fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.32em", color: C.muted, textTransform: "uppercase" };
const glass = (a: number): React.CSSProperties => ({
  background: `linear-gradient(160deg, rgba(255,255,255,${0.08 + 0.12 * a}), rgba(190,170,255,0.04)), rgba(36,18,92,0.85)`,
  border: `1.5px solid rgba(225,215,255,${0.2 + 0.5 * a})`,
  boxShadow: `0 0 ${a * 40}px rgba(150,110,255,${0.55 * a})`,
});
const CY = 1330;

/** Spirale hypnotique : bras logarithmiques qui tournent + anneaux qui s'enfoncent (effet tunnel). */
const Hypno: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  const arms = 6;
  const rot = f * (0.5 + 0.25 * k);
  const pts = (arm: number) =>
    Array.from({ length: 170 }, (_, i) => {
      const th = i * 0.11;
      const r = 16 * Math.exp(0.18 * th);
      const a = th + (arm / arms) * Math.PI * 2;
      return `${i ? "L" : "M"} ${(540 + Math.cos(a) * r).toFixed(1)} ${(CY + Math.sin(a) * r).toFixed(1)}`;
    }).join(" ");
  return (
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="hfade">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.75" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="hmask">
          <circle cx={540} cy={CY} r={640} fill="url(#hfade)" />
        </mask>
      </defs>
      <g mask="url(#hmask)">
        {/* anneaux qui s'enfoncent vers le centre */}
        {Array.from({ length: 9 }, (_, i) => {
          const p = (((i / 9 - f / 160) % 1) + 1) % 1;
          const r = 30 + Math.pow(p, 1.8) * 620;
          return <circle key={i} cx={540} cy={CY} r={r} fill="none" stroke={i % 2 ? "rgba(255,214,150,0.5)" : "rgba(200,170,255,0.55)"} strokeWidth={1.5 + p * 4} opacity={(0.25 + 0.5 * k) * Math.min(1, p * 4)} />;
        })}
        <g transform={`rotate(${rot} 540 ${CY})`} opacity={0.6 + 0.35 * k}>
          {Array.from({ length: arms }, (_, a) => (
            <path key={a} d={pts(a)} stroke={a % 2 ? "rgba(255,220,170,0.7)" : "rgba(210,185,255,0.8)"} strokeWidth={5} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px #b48cff)" }} />
          ))}
        </g>
      </g>
    </svg>
  );
};

/** Croissance : 12 mois de barres qui montent au fil des répétitions. */
const Growth: React.FC<{ f: number; k: number; m: Mantra }> = ({ f, k, m }) => {
  const months = "JFMAMJJASOND".split("");
  const X = (i: number) => 150 + i * 71;
  const lit = (i: number) => {
    // chaque répétition fait pousser ~2,4 mois
    const rep = Math.min(4, Math.floor(i / 2.4));
    const a = T(m.reps[rep].start) + (i - rep * 2.4) * 12;
    return prog(f, a, a + 20, eOut);
  };
  return (
    <AbsoluteFill>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d={months.map((_, i) => `${i ? "L" : "M"} ${X(i) + 22} ${1790 - (40 + i * 22) * lit(i)}`).join(" ")} stroke="rgba(235,220,255,0.85)" strokeWidth={3} fill="none" strokeDasharray="6 8" opacity={0.3 + 0.7 * k} />
      </svg>
      {months.map((mo, i) => {
        const q = lit(i);
        const h = (40 + i * 22) * q;
        return (
          <div key={i} style={{ position: "absolute", left: X(i), top: 1790 - h, width: 44, height: Math.max(2, h), borderRadius: 10, background: `linear-gradient(180deg, rgba(240,230,255,${0.9 * q}), rgba(124,58,237,${0.5 * q}))`, boxShadow: q > 0.5 ? "0 0 16px rgba(170,130,255,0.6)" : undefined }}>
            <div style={{ position: "absolute", top: h + 12, left: 0, width: 44, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 20, color: q > 0.5 ? C.lilacSoft : C.muted }}>{mo}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Pause de 3 s pour répéter : anneau qui se remplit. */
const Pause: React.FC<{ f: number; from: number }> = ({ f, from }) => {
  const a = T(from);
  const p = prog(f, a, a + 90, (x) => x);
  const vis = prog(f, a - 6, a + 10) * (1 - prog(f, a + 84, a + 96));
  const R = 250;
  const secs = Math.max(1, 3 - Math.floor((f - a) / 30));
  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <circle cx={540} cy={CY} r={R} fill="none" stroke="rgba(225,215,255,0.14)" strokeWidth={3} />
        <circle cx={540} cy={CY} r={R} fill="none" stroke="rgba(245,235,255,0.95)" strokeWidth={4} pathLength={1} strokeDasharray={`${p} 1`} transform={`rotate(-90 540 ${CY})`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px #b48cff)" }} />
      </svg>
      <div style={{ position: "absolute", top: CY + R + 50, left: 0, right: 0, textAlign: "center", ...capsStyle, color: C.lilacSoft }}>your turn · repeat</div>
      <div style={{ position: "absolute", top: CY + R + 100, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16 }}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ width: 12, height: 12, borderRadius: 6, background: "#fff", opacity: k < 4 - secs ? 0.95 : 0.25 }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const MantraVideo: React.FC<{ m: Mantra }> = ({ m }) => {
  const f = useCurrentFrame();
  const dur = Math.round(m.duration * 30);
  const reps = m.reps;
  const cur = reps.findIndex((r, i) => f >= T(r.start) - 9 && f < T(i < reps.length - 1 ? reps[i + 1].start : m.final.full) - 9);
  const done = reps.filter((r) => f >= T(r.end) + 90).length;
  const endIn = prog(f, T(m.final.full) - 20, T(m.final.full) + 10);
  const k = prog(f, 0, T(m.final.full), (x) => x); // intensité qui monte au fil des répétitions
  const hypno = m.visual === "hypno";
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,1,14,0.5), rgba(3,1,14,0.1) 50%, rgba(3,1,14,0.45))" }} />
      {/* respiration lente de toute l'image (effet hypnotique) */}
      <AbsoluteFill style={{ transform: `scale(${1 + (hypno ? 0.03 : 0.012) * Math.sin(f / (hypno ? 45 : 70))})` }}>
        <AbsoluteFill style={{ opacity: prog(f, 0, 30) * (1 - endIn) }}>
          {hypno ? <Hypno f={f} k={k} /> : <Growth f={f} k={k} m={m} />}
          <Orb cx={540} cy={CY} R={hypno ? 120 + done * 10 : 140 + done * 10} power={0.35 + done * 0.12 + 0.15 * Math.sin(f / 30)} flicker={0} />
        </AbsoluteFill>
        {/* titre + progression */}
        <div style={{ position: "absolute", top: 140, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: prog(f, 0, 20) * (1 - endIn) }}>
          {m.title} · repeat {cur >= 0 ? cur + 1 : 1} / 5
        </div>
        <div style={{ position: "absolute", top: 186, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14, opacity: prog(f, 0, 20) * (1 - endIn) }}>
          {reps.map((_, i) => (
            <div key={i} style={{ width: i === cur ? 34 : 10, height: 10, borderRadius: 5, background: i < done || i === cur ? C.lilacSoft : "rgba(225,215,255,0.25)", boxShadow: i === cur ? "0 0 12px #c8b0ff" : undefined }} />
          ))}
        </div>
        {/* la phrase, à chaque répétition */}
        {reps.map((r, i) => {
          const nextAt = i < reps.length - 1 ? reps[i + 1].start : m.final.full;
          if (f < T(r.start) - 10 || f >= T(nextAt - 0.3) + 2) return null;
          const a = T(r.start - 0.3);
          const b = T(nextAt - 0.3);
          const iq = prog(f, a, a + 14, eOut);
          const oq = prog(f, b - 14, b, eIn);
          return (
            <AbsoluteFill key={i} style={{ opacity: iq * (1 - oq), filter: iq < 1 || oq > 0 ? `blur(${(1 - iq) * 12 + oq * 16}px)` : undefined, transform: `scale(${lerp(1.04, 1, iq) * (1 + 0.05 * oq)})` }}>
              <Words f={f} top={300} size={84} lineGap={2} lines={m.lines.map((ln) => ln.map((tok) => ({ t: tok.t, at: r.words[tok.w], kind: tok.kind, size: tok.size })))} />
              <Pause f={f} from={r.end + 0.1} />
            </AbsoluteFill>
          );
        })}
        {f >= T(m.final.full) - 20 ? <End f={f} m={m} /> : null}
      </AbsoluteFill>
      <Vignette />
      <Sound m={m} dur={dur} />
    </AbsoluteFill>
  );
};

const End: React.FC<{ f: number; m: Mantra }> = ({ f, m }) => {
  const F = m.final;
  const parts = [
    { txt: "signs", from: F.signs, to: F.path },
    { txt: "path", from: F.path, to: F.dot },
    { txt: ".com", from: F.dot, to: F.comEnd },
  ];
  let typed = "";
  for (const p of parts) typed += p.txt.slice(0, Math.round(interpolate(f, [T(p.from), T(p.to) - 1], [0, p.txt.length], clamp)));
  const card = prog(f, T(F.at), T(F.at) + 16, eOut);
  const st = T(F.full);
  const inQ = prog(f, st - 10, st + 10);
  return (
    <AbsoluteFill style={{ opacity: inQ, filter: inQ < 1 ? `blur(${(1 - inQ) * 12}px)` : undefined }}>
      <Orb cx={540} cy={820} R={170} power={0.9 + 0.2 * Math.sin((f - st) / 25)} flicker={0} />
      <div style={{ position: "absolute", top: 1020, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
        {m.reps.map((_, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: C.lilacSoft, boxShadow: "0 0 12px #c8b0ff" }} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 1060, left: 0, right: 0, textAlign: "center", ...capsStyle }}>5 / 5 · well done</div>
      <Words f={f} top={1150} size={84} lines={[[{ t: "Full guide at", at: F.full, kind: "muted", size: 110 }]]} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 1290, height: 150, borderRadius: 999, ...glass(0.6 * card), opacity: card, transform: `scale(${lerp(0.9, 1, card)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...serifGradient, fontSize: 96, lineHeight: 1 }}>{typed}</span>
        <span style={{ width: 3, height: 70, marginLeft: 6, background: C.lilacSoft, opacity: Math.floor(f / 10) % 2 ? 1 : 0.2 }} />
      </div>
    </AbsoluteFill>
  );
};

/* son : musique calme, voix avec écho, un carillon discret par répétition */
const Sound: React.FC<{ m: Mantra; dur: number }> = ({ m, dur }) => (
  <>
    <Html5Audio src={staticFile(`signspath/${m.id}/music.wav`)} volume={(fr) => interpolate(fr, [0, 40, dur - 60, dur], [0, 0.42, 0.42, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile(`signspath/${m.id}/voice.wav`)} volume={1} />
    </Sequence>
    {m.reps.map((r, i) => (
      <Sequence key={i} from={Math.max(0, T(r.start - 0.05))} layout="none">
        <Html5Audio src={staticFile(`signspath/sfx/chime${(i % 3) + 1}.wav`)} volume={0.07} />
      </Sequence>
    ))}
    <Sequence from={T(m.final.full)} layout="none">
      <Html5Audio src={staticFile("signspath/sfx/shimmer.wav")} volume={0.14} />
    </Sequence>
  </>
);

/** Motion SignsPath #10 — mantra « money » (hypnotique). */
export const MoneyMantra: React.FC = () => <MantraVideo m={MONEY} />;
/** Motion SignsPath #11 — mantra « skill » (croissance mois par mois). */
export const SkillMantra: React.FC = () => <MantraVideo m={SKILL} />;
