import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { GlassCard } from "../signspath/Card";
import { Icon } from "../signspath/Icons";
import { C, loadFonts, SANS, SERIF, serifGradient } from "../signspath/theme";
import { clamp, eBack, eIn, eInOut, eOut, hash, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { AREAS8, DURATION_FRAMES, SC, T, W } from "./timing";

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
const pill: React.CSSProperties = { padding: "14px 30px", borderRadius: 999, background: pillBg, boxShadow: "0 0 40px rgba(139,92,246,0.8)", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#fff", whiteSpace: "nowrap" };

/** Bouton Follow tapé : onde + passage à « Following ». */
const FollowBtn: React.FC<{ f: number; at: number; scale?: number }> = ({ f, at, scale = 1 }) => {
  const q = prog(f, at - 6, at + 6, eBack);
  const done = f >= at + 8;
  const rp = f >= at + 6 ? (f - at - 6) / 16 : -1;
  return (
    <div style={{ position: "relative", display: "inline-block", transform: `scale(${q * scale * (f >= at + 4 && f < at + 9 ? 0.93 : 1)})`, opacity: Math.min(1, q * 1.5) }}>
      {rp >= 0 && rp < 1 ? <div style={{ position: "absolute", inset: -rp * 70, borderRadius: 999, border: `3px solid ${C.lilac}`, opacity: 1 - rp }} /> : null}
      <div style={{ ...pill, fontSize: 52, padding: "26px 70px", background: done ? "rgba(255,255,255,0.1)" : pillBg, border: done ? `2px solid ${C.lilacSoft}` : "2px solid transparent", boxShadow: done ? "0 0 30px rgba(170,130,255,0.5)" : pill.boxShadow }}>{done ? "✓ Following" : "+ Follow"}</div>
    </div>
  );
};

/** Couverture de l'ebook en 3D (épaisseur via une tranche). */
const Book: React.FC<{ f: number; w?: number; ry?: number; glow?: number }> = ({ f, w = 420, ry = -22, glow = 0.6 }) => {
  const h = w * 1.38;
  const d = 34;
  return (
    <div style={{ width: w, height: h, transformStyle: "preserve-3d", transform: `rotateY(${ry + 6 * Math.sin(f / 40)}deg) rotateX(6deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "6px 18px 18px 6px", background: "linear-gradient(160deg, #3b1d8f, #1c0b4d 60%, #0d0526)", boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 ${60 * glow}px rgba(150,110,255,${0.6 * glow})`, overflow: "hidden", transform: `translateZ(${d / 2}px)`, border: "1.5px solid rgba(225,215,255,0.35)" }}>
        <div style={{ position: "absolute", left: "50%", top: "30%", width: w * 0.5, height: w * 0.5, marginLeft: -w * 0.25, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,230,255,0.95), rgba(170,130,255,0.35) 45%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: w * 0.12, left: 0, right: 0, textAlign: "center", ...capsStyle, fontSize: w * 0.05, color: C.lilacSoft }}>signspath</div>
        <div style={{ position: "absolute", bottom: w * 0.2, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ ...serifGradient, fontSize: w * 0.16, lineHeight: 1 }}>Manifest</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: w * 0.075, color: "#fff", marginTop: w * 0.02 }}>with method</div>
        </div>
        <div style={{ position: "absolute", bottom: w * 0.07, left: 0, right: 0, textAlign: "center", ...capsStyle, fontSize: w * 0.035 }}>the manifestation guide</div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 35%)" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: d, height: h, background: "linear-gradient(90deg, #120638, #2a1270)", transform: `rotateY(-90deg) translateZ(${d / 2}px)`, transformOrigin: "0 50%" }} />
    </div>
  );
};

/** Motion SignsPath #14 — l'ebook « Manifestation » (commente, DM, contenu du guide). */
export const Ebook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.015 * Math.sin(f / 55)})` }}>
        {on(f, "a") ? <SceneA f={f} /> : null}
        {on(f, "b1") ? <SceneFollow f={f} /> : null}
        {on(f, "b2") ? <SceneDM f={f} /> : null}
        {on(f, "b3") ? <SceneEveryone f={f} /> : null}
        {on(f, "c") ? <SceneGuide f={f} /> : null}
        {on(f, "d") ? <SceneWhy f={f} /> : null}
        {on(f, "e") ? <SceneTechniques f={f} /> : null}
        {on(f, "f") ? <SceneAreas f={f} /> : null}
        {on(f, "g") ? <SceneWorkbook f={f} /> : null}
        {on(f, "h") ? <ScenePractice f={f} /> : null}
        {on(f, "i") ? <SceneRecap f={f} /> : null}
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- « Want to manifest, but don't know where to start? » ---------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={sceneFx(f, "a")}>
    <Words
      f={f}
      top={340}
      size={92}
      lineGap={2}
      lines={[
        [{ t: "Want to", at: W.want, kind: "muted", size: 110 }, { t: "manifest,", at: W.manifest, kind: "serif" }],
        [{ t: "but don't know", at: W.but, kind: "bold" }],
        [{ t: "where to start?", at: W.where, kind: "serif" }],
      ]}
    />
    <Orb cx={540} cy={1250} R={150} power={0.4} flicker={0.6} />
    {Array.from({ length: 7 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: 200 + hash(i * 3) * 640, top: 1050 + hash(i * 5) * 420 + Math.sin(f / 9 + i) * 10, fontFamily: SERIF, fontStyle: "italic", fontSize: 70 + hash(i) * 50, color: "rgba(207,194,255,0.55)", opacity: prog(f, T(W.where) - 4 + i * 2, T(W.where) + 8 + i * 2), filter: "blur(1px)" }}>?</div>
    ))}
  </AbsoluteFill>
);

/* ---------- « Follow me, and comment "Manifestation" under this video. » ---------- */
const SceneFollow: React.FC<{ f: number }> = ({ f }) => {
  const box = prog(f, T(W.comment) - 4, T(W.comment) + 10, eBack);
  const msg = "Manifestation";
  const typed = msg.slice(0, Math.round(lerp(0, msg.length, prog(f, T(W.manifestation), T(W.under) + 4, (x) => x))));
  const sent = f >= T(W.video);
  return (
    <AbsoluteFill style={sceneFx(f, "b1")}>
      <Words
        f={f}
        top={260}
        size={90}
        lineGap={2}
        lines={[
          [{ t: "Follow", at: W.follow, kind: "bold" }, { t: "me,", at: W.me, kind: "muted", size: 110 }],
          [{ t: "and", at: W.and, kind: "muted", size: 110 }, { t: "comment", at: W.comment, kind: "bold" }],
          [{ t: "“Manifestation”", at: W.manifestation, kind: "serif", size: 72 }],
        ]}
      />
      <div style={{ position: "absolute", top: 820, left: 0, right: 0, textAlign: "center" }}>
        <FollowBtn f={f} at={T(W.me)} />
      </div>
      <div style={{ position: "absolute", left: 100, right: 100, top: 1100, padding: "30px 34px", borderRadius: 36, ...glass(0.4), opacity: Math.min(1, box * 1.5), transform: `scale(${lerp(0.9, 1, box)})` }}>
        <div style={{ ...capsStyle, fontSize: 20, marginBottom: 20 }}>comments</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #b9a6ff, #7c3aed)" }} />
          <div style={{ flex: 1, padding: "18px 24px", borderRadius: 999, background: "rgba(255,255,255,0.08)", fontFamily: SANS, fontWeight: 700, fontSize: 40, color: "#fff" }}>
            {typed || <span style={{ color: C.muted }}>Add a comment…</span>}
            <span style={{ display: "inline-block", width: 3, height: 38, marginLeft: 3, background: C.lilacSoft, opacity: !sent && Math.floor(f / 8) % 2 ? 1 : 0 }} />
          </div>
          <div style={{ ...pill, fontSize: 30, padding: "14px 22px", opacity: sent ? 1 : 0.5, transform: `scale(${sent ? 1 + 0.15 * Math.exp(-(f - T(W.video)) / 5) : 1})` }}>{sent ? "✓" : "↑"}</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1360, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: prog(f, T(W.under), T(W.under) + 10) }}>under this video ↓</div>
    </AbsoluteFill>
  );
};

/* ---------- « I'll send you a discount on my manifestation ebook, in a private message. » ---------- */
const SceneDM: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.b2[0]);
  const card = prog(f, T(W.send), T(W.send) + 14, eBack);
  const book = prog(f, T(W.ebookM) - 2, T(W.ebookM) + 16, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "b2")}>
      <Words
        f={f}
        top={230}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "I'll send you", at: W.ill, kind: "muted", size: 110 }],
          [{ t: "a discount", at: W.discount, kind: "serif" }],
          [{ t: "on my", at: W.my, kind: "muted", size: 110 }, { t: "ebook,", at: W.ebook, kind: "bold" }],
          [{ t: "in a private message.", at: W.in, kind: "muted", size: 104 }],
        ]}
      />
      <div style={{ position: "absolute", left: 100, right: 100, top: 860, padding: "30px 34px", borderRadius: 36, ...glass(0.5), opacity: Math.min(1, card * 1.5), transform: `scale(${lerp(0.9, 1, card)})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", ...capsStyle, fontSize: 20, marginBottom: 20 }}>
          <span>🔒 private message</span>
          <span>now</span>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
          <div style={{ perspective: 900, opacity: book, transform: `translateY(${(1 - book) * 40}px)` }}>
            <Book f={f} w={180} ry={-18} glow={0.4} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: "#fff", lineHeight: 1.2 }}>🎁 Your discount on the</div>
            <div style={{ ...serifGradient, fontSize: 64, lineHeight: 1.1 }}>Manifestation ebook</div>
            <div style={{ ...pill, display: "inline-block", marginTop: 18, fontSize: 30, transform: `scale(${prog(f, T(W.private), T(W.private) + 10, eBack)})` }}>Get my discount →</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1420, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: prog(f, st + 10, st + 24) }}>sent by dm</div>
    </AbsoluteFill>
  );
};

/* ---------- « Yes, to everyone who comments. » ---------- */
const SceneEveryone: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.b3[0]);
  const N = 12;
  return (
    <AbsoluteFill style={sceneFx(f, "b3")}>
      <Words
        f={f}
        top={300}
        size={92}
        lineGap={2}
        lines={[[{ t: "Yes,", at: W.yes, kind: "serif" }], [{ t: "to everyone", at: W.everyone, kind: "bold" }], [{ t: "who comments.", at: W.comments, kind: "muted", size: 110 }]]}
      />
      <div style={{ position: "absolute", left: 120, right: 120, top: 950, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 30 }}>
        {Array.from({ length: N }, (_, i) => {
          const at = st + 8 + i * 3;
          const q = prog(f, at, at + 10, eBack);
          const ok = f >= at + 14;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: Math.min(1, q * 1.5), transform: `scale(${q})` }}>
              <div style={{ position: "relative", width: 120, height: 120, borderRadius: "50%", background: `linear-gradient(135deg, hsl(${255 + hash(i) * 50},70%,72%), #3b1d8f)`, border: "2px solid rgba(225,215,255,0.4)" }}>
                {ok ? <div style={{ position: "absolute", right: -6, bottom: -6, width: 46, height: 46, borderRadius: "50%", background: pillBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#fff", boxShadow: "0 0 16px rgba(139,92,246,0.9)" }}>✓</div> : null}
              </div>
              <div style={{ ...capsStyle, fontSize: 16, letterSpacing: "0.1em", color: ok ? C.lilacSoft : C.muted }}>{ok ? "dm sent" : "comment"}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- « This guide is what most people are missing: a real method. » ---------- */
const SceneGuide: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.c[0]);
  const inQ = prog(f, st + 2, st + 20, eOut);
  const glow = prog(f, T(W.real), T(W.method) + 10, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "c")}>
      <Words
        f={f}
        top={230}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "This guide", at: W.this, kind: "bold" }],
          [{ t: "is what most people", at: W.guide + 0.2, kind: "muted", size: 104 }],
          [{ t: "are missing:", at: W.missing - 0.07, kind: "muted", size: 104 }],
          [{ t: "a real method.", at: W.real - 0.1, kind: "serif" }],
        ]}
      />
      <Orb cx={540} cy={1250} R={200} power={0.3 + 0.7 * glow} flicker={0} />
      <div style={{ position: "absolute", left: 540 - 210, top: 1250 - 290, perspective: 1400, opacity: inQ, transform: `translateY(${(1 - inQ) * 120}px)` }}>
        <Book f={f} w={420} ry={lerp(-50, -18, inQ)} glow={0.4 + 0.6 * glow} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- « You learn why intention and repetition actually work. » ---------- */
const SceneWhy: React.FC<{ f: number }> = ({ f }) => {
  const c1 = prog(f, T(W.intention) - 2, T(W.intention) + 14, eBack);
  const c2 = prog(f, T(W.repetition) - 2, T(W.repetition) + 14, eBack);
  const work = prog(f, T(W.work), T(W.workEnd) + 6, eOut);
  const loop = (f / 30) * 120;
  return (
    <AbsoluteFill style={sceneFx(f, "d")}>
      <Words
        f={f}
        top={260}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "You learn", at: W.you, kind: "muted", size: 110 }, { t: "why", at: W.why, kind: "bold" }],
          [{ t: "intention", at: W.intention, kind: "serif" }],
          [{ t: "and", at: W.and2, kind: "muted", size: 110 }, { t: "repetition", at: W.repetition, kind: "serif" }],
          [{ t: "actually work.", at: W.actually, kind: "bold" }],
        ]}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", alignItems: "center", gap: 70 }}>
        <div style={{ perspective: 1200, opacity: Math.min(1, c1 * 1.5), transform: `rotateY(${(1 - c1) * 70}deg)` }}>
          <GlassCard icon="intention" kicker="why" label="intention" active={c1 * (0.5 + 0.5 * work)} w={300} h={390} labelSize={54} />
        </div>
        <div style={{ perspective: 1200, opacity: Math.min(1, c2 * 1.5), transform: `rotateY(${(1 - c2) * -70}deg)`, position: "relative" }}>
          <GlassCard icon="day" kicker="why" label="repetition" active={c2 * (0.5 + 0.5 * work)} w={300} h={390} labelSize={50} />
          <svg width="120" height="120" viewBox="-60 -60 120 120" style={{ position: "absolute", right: -40, top: -40, opacity: c2, transform: `rotate(${loop}deg)` }}>
            <path d="M 0 -40 A 40 40 0 1 1 -38 -12" stroke={C.lilacSoft} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M -48 -24 L -38 -10 L -24 -20" stroke={C.lilacSoft} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {work > 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: 1530, display: "flex", justifyContent: "center", opacity: work }}><div style={{ ...pill, transform: `scale(${lerp(0.7, 1, work)})` }}>✓ backed by method</div></div> : null}
    </AbsoluteFill>
  );
};

/* ---------- « three simple techniques: the 369, scripting, and vision » ---------- */
const TECH = [
  { icon: "day", kicker: "the", label: "369", at: W.the369 },
  { icon: "technique", kicker: "", label: "scripting", at: W.scripting },
  { icon: "intention", kicker: "", label: "vision", at: W.vision },
];
const SceneTechniques: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={sceneFx(f, "e")}>
    <Words
      f={f}
      top={260}
      size={86}
      lineGap={2}
      lines={[
        [{ t: "You discover", at: W.you2, kind: "muted", size: 110 }],
        [{ t: "three", at: W.three, kind: "serif" }, { t: "simple", at: W.simple, kind: "bold" }],
        [{ t: "techniques:", at: W.techniques, kind: "serif" }],
      ]}
    />
    <div style={{ position: "absolute", left: 0, right: 0, top: 940, display: "flex", justifyContent: "center", gap: 26 }}>
      {TECH.map((t, i) => {
        const q = prog(f, T(t.at) - 2, T(t.at) + 14, eBack);
        const act = prog(f, T(t.at), T(t.at) + 8);
        return (
          <div key={t.label} style={{ perspective: 1200, opacity: Math.min(1, q * 1.5), transform: `rotateY(${(1 - q) * 70}deg) translateY(${(1 - q) * 60 - act * 14}px)` }}>
            <GlassCard icon={t.icon} kicker={t.kicker || undefined} label={t.label} active={act} w={290} h={390} labelSize={t.label === "369" ? 76 : 52} />
            <div style={{ textAlign: "center", marginTop: 18, ...capsStyle, fontSize: 22, opacity: act }}>{["3 · 6 · 9", "write it", "see it"][i]}</div>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

/* ---------- « eight areas of your life » ---------- */
const SceneAreas: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.f[0]);
  return (
    <AbsoluteFill style={sceneFx(f, "f")}>
      <Words
        f={f}
        top={230}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "You work on", at: W.you3, kind: "muted", size: 110 }],
          [{ t: "eight areas", at: W.eight, kind: "serif" }],
          [{ t: "of your life:", at: W.areas + 0.4, kind: "bold" }],
        ]}
      />
      <div style={{ position: "absolute", left: 70, right: 70, top: 760, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
        {AREAS8.map((a, i) => {
          const q = prog(f, st + 10 + i * 2, st + 24 + i * 2, eOut);
          const lit = prog(f, T(a.at) - 2, T(a.at) + 8, eBack);
          return (
            <div key={a.key} style={{ height: 300, borderRadius: 30, ...glass(0.15 + 0.85 * lit), opacity: Math.min(1, q * 1.5), transform: `translateY(${(1 - q) * 40}px) scale(${0.92 + 0.08 * Math.min(1, lit)})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <Icon name={a.key} size={74} glow={0.3 + 0.9 * lit} />
              <span style={{ ...serifGradient, fontSize: a.key.length > 9 ? 34 : 44, opacity: 0.45 + 0.55 * Math.min(1, lit) }}>{a.key}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1440, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: prog(f, T(W.spirituality), T(W.spirituality) + 12) }}>8 / 8 areas covered</div>
    </AbsoluteFill>
  );
};

/* ---------- « move forward with a workbook… one page at a time » ---------- */
const SceneWorkbook: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.g[0]);
  const page = prog(f, T(W.workbook) - 2, T(W.workbook) + 16, eOut);
  const lines = ["My intention:", "I earn +€500 a month", "by March, through", "a skill I practice daily."];
  const total = lines.join("").length;
  const n = Math.round(lerp(0, total, prog(f, T(W.write), T(W.one) + 6, (x) => x)));
  const flip = prog(f, T(W.page), T(W.time) + 8, eInOut);
  let k = 0;
  return (
    <AbsoluteFill style={sceneFx(f, "g")}>
      <Words
        f={f}
        top={230}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "And you", at: W.and4, kind: "muted", size: 110 }, { t: "move forward", at: W.move, kind: "bold" }],
          [{ t: "with a", at: W.forward + 0.2, kind: "muted", size: 110 }, { t: "workbook,", at: W.workbook, kind: "serif" }],
          [{ t: "to write your own intentions,", at: W.write, kind: "muted", size: 100 }],
          [{ t: "one page at a time.", at: W.one, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 150, right: 150, top: 900, height: 640, perspective: 1600, opacity: page, transform: `translateY(${(1 - page) * 60}px) rotate(-2deg)` }}>
        {/* page suivante dessous */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "#f4efe6", boxShadow: "0 30px 70px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "#fbf8f2", transformOrigin: "0% 50%", transform: `rotateY(${-flip * 160}deg)`, backfaceVisibility: "hidden", padding: "50px 54px", boxSizing: "border-box", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 78px, rgba(124,58,237,0.18) 78px 80px)" }}>
          <div style={{ ...capsStyle, color: "#7c3aed", fontSize: 20, marginBottom: 20 }}>workbook · page 1</div>
          {lines.map((l, i) => {
            const s = k;
            k += l.length;
            const shown = l.slice(0, Math.max(0, Math.min(l.length, n - s)));
            return (
              <div key={i} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: i ? 56 : 46, lineHeight: "80px", color: i ? "#2a1270" : "#7c3aed" }}>
                {shown}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", top: 1590, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: flip }}>page 2 · tomorrow</div>
    </AbsoluteFill>
  );
};

/* ---------- « No more hope without structure. Here, you practice, day after day. » ---------- */
const ScenePractice: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.h[0]);
  const struct = prog(f, T(W.structure), T(W.structEnd) + 6, eInOut);
  const days = (i: number) => prog(f, T(W.practice) + i * 4, T(W.practice) + i * 4 + 10, eBack);
  return (
    <AbsoluteFill style={sceneFx(f, "h")}>
      <Words
        f={f}
        top={230}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "No more", at: W.no, kind: "muted", size: 110 }, { t: "hope", at: W.hope, kind: "serif" }],
          [{ t: "without", at: W.without, kind: "muted", size: 110 }, { t: "structure.", at: W.structure, kind: "bold" }],
          [{ t: "Here, you", at: W.here, kind: "muted", size: 110 }, { t: "practice,", at: W.practice, kind: "serif" }],
          [{ t: "day after day.", at: W.day, kind: "bold" }],
        ]}
      />
      {/* l'espoir flou se range dans une grille */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: prog(f, st, st + 10) }}>
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`v${i}`} x1={180 + i * 120} y1={940} x2={180 + i * 120} y2={940 + 600 * struct} stroke="rgba(225,215,255,0.25)" strokeWidth={2} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1={180} y1={940 + i * 120} x2={180 + 720 * struct} y2={940 + i * 120} stroke="rgba(225,215,255,0.25)" strokeWidth={2} />
        ))}
      </svg>
      {Array.from({ length: 30 }, (_, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const fx2 = 180 + col * 120 + 60;
        const fy2 = 940 + row * 120 + 60;
        const x = lerp(220 + hash(i) * 640, fx2, struct);
        const y = lerp(960 + hash(i + 3) * 560, fy2, struct);
        const d = days(i);
        return <div key={i} style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 14, background: d > 0.3 ? pillBg : "rgba(225,215,255,0.25)", boxShadow: d > 0.3 ? "0 0 16px rgba(139,92,246,0.8)" : undefined, filter: struct < 0.9 ? `blur(${(1 - struct) * 6}px)` : undefined, transform: `scale(${0.8 + 0.25 * d})` }} />;
      })}
    </AbsoluteFill>
  );
};

/* ---------- récap + signspath.com ---------- */
const SceneRecap: React.FC<{ f: number }> = ({ f }) => {
  const steps = [
    { t: "Follow me", at: W.follow2 },
    { t: "Comment “Manifestation”", at: W.comment2 },
    { t: "Get your discount by DM", at: W.ill2 },
  ];
  const parts = [
    { txt: "signs", from: W.signs, to: W.path },
    { txt: "path", from: W.path, to: W.dot },
    { txt: ".com", from: W.dot, to: W.comEnd },
  ];
  let typed = "";
  for (const p of parts) typed += p.txt.slice(0, Math.round(interpolate(f, [T(p.from), T(p.to) - 1], [0, p.txt.length], clamp)));
  const url = prog(f, T(W.head) - 4, T(W.head) + 12, eBack);
  return (
    <AbsoluteFill style={sceneFx(f, "i")}>
      <Orb cx={540} cy={420} R={150} power={0.6 + 0.3 * Math.sin(f / 25)} flicker={0} />
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: prog(f, T(W.so), T(W.so) + 10) }}>so…</div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 720, display: "flex", flexDirection: "column", gap: 26 }}>
        {steps.map((s, i) => {
          const q = prog(f, T(s.at) - 2, T(s.at) + 12, eBack);
          const done = f >= T(s.at) + 14;
          return (
            <div key={s.t} style={{ display: "flex", alignItems: "center", gap: 24, padding: "26px 32px", borderRadius: 30, ...glass(done ? 0.9 : 0.3), opacity: Math.min(1, q * 1.5), transform: `translateX(${(1 - Math.min(1, q)) * 80}px)` }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: done ? pillBg : "transparent", border: "2px solid rgba(225,215,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", boxShadow: done ? "0 0 20px rgba(139,92,246,0.9)" : undefined }}>{done ? "✓" : i + 1}</div>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#fff" }}>{s.t}</span>
            </div>
          );
        })}
      </div>
      <Words f={f} top={1260} size={84} lines={[[{ t: "and head over to", at: W.and5, kind: "muted", size: 110 }]]} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 1400, height: 150, borderRadius: 999, ...glass(0.6 * url), opacity: Math.min(1, url * 1.5), transform: `scale(${lerp(0.9, 1, Math.min(1, url))})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...serifGradient, fontSize: 96, lineHeight: 1 }}>{typed}</span>
        <span style={{ width: 3, height: 70, marginLeft: 6, background: C.lilacSoft, opacity: Math.floor(f / 10) % 2 ? 1 : 0.2 }} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.manifest, src: "chime1", vol: 0.18 },
  { at: 2.75, src: "whoosh", vol: 0.3 },
  { at: W.me + 0.2, src: "chime5", vol: 0.22 },
  ...Array.from({ length: 10 }, (_, i) => ({ at: W.manifestation + i * 0.11, src: "tick", vol: 0.06 })),
  { at: W.video, src: "chime2", vol: 0.2 },
  { at: 6.65, src: "whoosh", vol: 0.3 },
  { at: W.send, src: "chime3", vol: 0.2 },
  { at: W.private, src: "shimmer", vol: 0.24 },
  { at: 10.55, src: "whoosh", vol: 0.3 },
  ...Array.from({ length: 12 }, (_, i) => ({ at: 10.9 + i * 0.1, src: "tick", vol: 0.07 })),
  { at: 13.05, src: "whoosh", vol: 0.3 },
  { at: W.real, src: "chime6", vol: 0.24 },
  { at: W.method, src: "sub", vol: 0.28 },
  { at: 17.05, src: "whoosh", vol: 0.3 },
  { at: W.intention, src: "chime1", vol: 0.2 },
  { at: W.repetition, src: "chime2", vol: 0.2 },
  { at: W.work, src: "shimmer", vol: 0.2 },
  { at: 20.65, src: "whoosh", vol: 0.3 },
  { at: W.the369, src: "chime1", vol: 0.22 },
  { at: W.scripting, src: "chime2", vol: 0.22 },
  { at: W.vision, src: "chime3", vol: 0.22 },
  { at: 26.25, src: "whoosh", vol: 0.3 },
  ...AREAS8.map((a, i) => ({ at: a.at, src: `chime${(i % 6) + 1}`, vol: 0.14 })),
  { at: 35.85, src: "whoosh", vol: 0.3 },
  { at: W.workbook, src: "chime3", vol: 0.2 },
  ...Array.from({ length: 14 }, (_, i) => ({ at: W.write + i * 0.12, src: "tick", vol: 0.05 })),
  { at: W.page, src: "whoosh_soft", vol: 0.22 },
  { at: 41.55, src: "whoosh", vol: 0.3 },
  { at: W.structure, src: "freeze", vol: 0.16 },
  ...Array.from({ length: 8 }, (_, i) => ({ at: W.practice + i * 0.13, src: "tick", vol: 0.08 })),
  { at: 46.85, src: "whoosh", vol: 0.3 },
  { at: W.follow2 + 0.4, src: "chime1", vol: 0.2 },
  { at: W.comment2 + 0.4, src: "chime2", vol: 0.2 },
  { at: W.ill2 + 0.4, src: "chime3", vol: 0.2 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74, 0.86].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} loop volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice-ebook.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
