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
const pillBg = "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))";

/** Bulle de pensée (citation héritée). */
const Bubble: React.FC<{ text: string; a: number; size?: number; jitter?: number; f: number }> = ({ text, a, size = 54, jitter = 0, f }) => (
  <div style={{ position: "relative", padding: "30px 44px", borderRadius: 40, ...glass(a), transform: `translateX(${(hash(f + size) - 0.5) * jitter}px)` }}>
    <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: size, color: "#f0ebff" }}>“{text}”</span>
    <div style={{ position: "absolute", left: 60, bottom: -22, width: 30, height: 30, borderRadius: "50%", ...glass(a) }} />
    <div style={{ position: "absolute", left: 40, bottom: -48, width: 16, height: 16, borderRadius: "50%", ...glass(a) }} />
  </div>
);

/** Motion SignsPath #15 — « la phrase sur l'argent qui revient dans ta tête ». */
export const Belief: React.FC = () => {
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
        {on(f, "g") ? <SceneG f={f} /> : null}
        <Sequence from={T(SC.finale[0])} durationInFrames={DURATION_FRAMES - T(SC.finale[0])} name="finale">
          <SceneFinale
            timing={{
              manifest: W.manifest, with: W.with, method: W.method, not: W.not, by: W.by, chance: W.chance,
              full: W.full, signs: W.signs, path: W.path, dot: W.dot, comEnd: W.comEnd, cta: 32.85, from: T(SC.finale[0]),
            }}
          />
        </Sequence>
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : « What sentence about money keeps coming back in your head? » ---------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.a[0]);
  const loop = prog(f, T(W.keeps), T(W.head), eOut);
  const R = 260;
  const txt = "money · ".repeat(14);
  return (
    <AbsoluteFill style={sceneFx(f, "a")}>
      <Words
        f={f}
        top={260}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "What sentence", at: W.what, kind: "bold" }],
          [{ t: "about", at: W.about, kind: "muted", size: 110 }, { t: "money", at: W.money, kind: "serif" }],
          [{ t: "keeps coming back", at: W.keeps, kind: "bold" }],
          [{ t: "in your head?", at: W.head - 0.1, kind: "serif" }],
        ]}
      />
      <Orb cx={540} cy={1260} R={140} power={0.4 + 0.3 * loop} flicker={0.2} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: loop }}>
        <defs>
          <path id="loopP" d={`M ${540 - R} 1260 a ${R} ${R} 0 1 1 ${2 * R} 0 a ${R} ${R} 0 1 1 ${-2 * R} 0`} />
        </defs>
        <g transform={`rotate(${(f - st) * 1.6} 540 1260)`}>
          <text fontFamily="Instrument Serif" fontStyle="italic" fontSize={46} fill="rgba(225,210,255,0.8)" letterSpacing={4}>
            <textPath href="#loopP">{txt}</textPath>
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- B : les 3 phrases héritées ---------- */
const QUOTES = [
  { t: "Money doesn't grow on trees.", at: W.money2, y: 700 },
  { t: "I'm not meant to be rich.", at: W.im, y: 1000 },
  { t: "People like me don't make it.", at: W.people, y: 1300 },
];
const SceneB: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={sceneFx(f, "b")}>
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: prog(f, T(W.money2) - 6, T(W.money2) + 8) }}>sounds familiar?</div>
    {QUOTES.map((q, i) => {
      const inQ = prog(f, T(q.at) - 2, T(q.at) + 12, eBack);
      const next = i < QUOTES.length - 1 ? T(QUOTES[i + 1].at) : 99999;
      const dim = prog(f, next - 2, next + 8);
      return (
        <div key={q.t} style={{ position: "absolute", top: q.y, left: i % 2 ? 160 : 70, right: i % 2 ? 70 : 160, display: "flex", justifyContent: i % 2 ? "flex-end" : "flex-start", opacity: Math.min(1, inQ * 1.5) * (1 - 0.5 * dim), transform: `scale(${lerp(0.8, 1, Math.min(1, inQ))}) rotate(${(i - 1) * 2}deg)`, filter: dim > 0.05 ? `blur(${dim * 2}px)` : undefined }}>
          <Bubble text={q.t} a={0.3 + 0.7 * (1 - dim)} f={f} jitter={(1 - dim) * 4} size={i === 2 ? 50 : 54} />
        </div>
      );
    })}
  </AbsoluteFill>
);

/* ---------- C : « You may have heard it at home, as a kid. » ---------- */
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.c[0]);
  const house = prog(f, st + 2, T(W.home) + 6, eInOut);
  const kid = prog(f, T(W.kid) - 2, T(W.kid) + 12, eBack);
  return (
    <AbsoluteFill style={sceneFx(f, "c")}>
      <Words
        f={f}
        top={290}
        size={88}
        lineGap={2}
        lines={[
          [{ t: "You may have", at: W.you, kind: "muted", size: 110 }],
          [{ t: "heard it", at: W.heard, kind: "bold" }, { t: "at home,", at: W.home, kind: "serif" }],
          [{ t: "as a", at: W.as, kind: "muted", size: 110 }, { t: "kid.", at: W.kid, kind: "serif" }],
        ]}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d="M 340 1500 L 340 1180 L 540 1010 L 740 1180 L 740 1500 Z" stroke="rgba(235,220,255,0.85)" strokeWidth={5} fill="rgba(36,18,92,0.4)" pathLength={1} strokeDasharray={`${house} 1`} strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 10px #b48cff)" }} />
        <rect x={500} y={1380} width={80} height={120} rx={8} stroke="rgba(235,220,255,0.7)" strokeWidth={4} fill="none" opacity={house} />
        <rect x={400} y={1230} width={90} height={90} rx={8} fill={`rgba(255,230,190,${0.7 * house})`} style={{ filter: "drop-shadow(0 0 20px rgba(255,220,180,0.9))" }} />
        <rect x={590} y={1230} width={90} height={90} rx={8} fill={`rgba(255,230,190,${0.5 * house})`} />
      </svg>
      {/* la phrase qui sort de la maison */}
      <div style={{ position: "absolute", left: 0, right: 0, top: lerp(1250, 900, kid), textAlign: "center", opacity: kid * (1 - prog(f, T(W.kidEnd), T(W.kidEnd) + 10)), fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: "rgba(225,210,255,0.7)", filter: "blur(0.6px)" }}>“money doesn't grow on trees…”</div>
      {/* petit personnage */}
      <div style={{ position: "absolute", left: 800, top: 1400, opacity: kid, transform: `scale(${kid})` }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.lilacSoft, margin: "0 auto", boxShadow: "0 0 14px #c8b0ff" }} />
        <div style={{ width: 60, height: 70, borderRadius: "30px 30px 10px 10px", background: C.lilacSoft, marginTop: 6, opacity: 0.85 }} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- D : « …don't come from a lack of strategy. » ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.d[0]);
  const card = prog(f, T(W.many) - 2, T(W.many) + 14, eOut);
  const strike = prog(f, T(W.strategy), T(W.strategyEnd) + 4, eInOut);
  const bars = [0.4, 0.6, 0.5, 0.75, 0.65, 0.9];
  return (
    <AbsoluteFill style={sceneFx(f, "d")}>
      <Words
        f={f}
        top={230}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "Here's what", at: W.heres, kind: "muted", size: 110 }, { t: "nobody", at: W.nobody, kind: "serif" }],
          [{ t: "tells you.", at: W.tells, kind: "bold" }],
          [{ t: "Many financial blocks", at: W.many, kind: "bold", size: 72 }],
          [{ t: "don't come from a", at: W.dont2, kind: "muted", size: 104 }],
        ]}
      />
      <div style={{ position: "absolute", left: 150, right: 150, top: 900, padding: "36px 40px", borderRadius: 36, ...glass(0.35), opacity: card * (1 - 0.4 * strike), transform: `translateY(${(1 - card) * 40}px)`, filter: strike > 0.05 ? `saturate(${1 - 0.6 * strike})` : undefined }}>
        <div style={{ ...capsStyle, fontSize: 20, marginBottom: 20 }}>budget · strategy · plan</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 22, height: 220 }}>
          {bars.map((b, i) => (
            <div key={i} style={{ flex: 1, height: `${b * 100 * prog(f, T(W.many) + i * 2, T(W.many) + i * 2 + 12, eOut)}%`, borderRadius: 10, background: "linear-gradient(180deg, rgba(240,230,255,0.85), rgba(124,58,237,0.5))" }} />
          ))}
        </div>
        {["✓ budget", "✓ savings plan", "✓ investing app"].map((l, i) => (
          <div key={l} style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.white, marginTop: 14, opacity: prog(f, T(W.blocks) + i * 4, T(W.blocks) + i * 4 + 8) }}>{l}</div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1560, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ position: "relative", display: "inline-block", ...serifGradient, fontSize: 110, opacity: prog(f, T(W.lack) - 2, T(W.lack) + 8) }}>
          lack of strategy
          <span style={{ position: "absolute", left: -10, right: -10, top: "54%", height: 6, borderRadius: 3, background: C.lilacSoft, transform: `scaleX(${strike})`, transformOrigin: "0% 50%", boxShadow: "0 0 18px rgba(200,170,255,0.9)" }} />
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- E : une croyance héritée, jamais questionnée ---------- */
const GEN = [
  { label: "grandparents", y: 980 },
  { label: "parents", y: 1220 },
  { label: "you", y: 1460 },
];
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const thread = prog(f, T(W.inherited) - 4, T(W.belief) + 10, eInOut);
  const q = prog(f, T(W.questioned), T(W.qEnd) + 8, eBack);
  return (
    <AbsoluteFill style={sceneFx(f, "e")}>
      <Words
        f={f}
        top={260}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "They come from an", at: W.they, kind: "muted", size: 104 }],
          [{ t: "inherited belief", at: W.inherited, kind: "serif" }],
          [{ t: "you've never", at: W.youve, kind: "muted", size: 110 }, { t: "questioned.", at: W.questioned, kind: "bold" }],
        ]}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d={`M 540 ${GEN[0].y} L 540 ${GEN[2].y}`} stroke="rgba(235,220,255,0.9)" strokeWidth={5} pathLength={1} strokeDasharray={`${thread} 1`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px #b48cff)" }} />
      </svg>
      {GEN.map((g, i) => {
        const lit = prog(f, T(W.inherited) + i * 8, T(W.inherited) + i * 8 + 10, eBack);
        return (
          <div key={g.label} style={{ position: "absolute", left: 0, right: 0, top: g.y - 45, display: "flex", justifyContent: "center", alignItems: "center", gap: 28 }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", ...glass(lit), display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + 0.2 * lit})` }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", opacity: lit, boxShadow: "0 0 14px #c8b0ff" }} />
            </div>
            <div style={{ position: "absolute", left: 640, ...capsStyle, fontSize: 22, color: i === 2 ? C.lilacSoft : C.muted, opacity: lit }}>{g.label}</div>
            <div style={{ position: "absolute", right: 640, fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: "rgba(225,210,255,0.6)", opacity: lit * 0.9 }}>“not for us…”</div>
          </div>
        );
      })}
      {q > 0 ? <div style={{ position: "absolute", left: 600, top: GEN[2].y - 120, fontFamily: SERIF, fontStyle: "italic", fontSize: 140, color: C.lilacSoft, opacity: Math.min(1, q * 1.5), transform: `scale(${q})`, textShadow: "0 0 30px rgba(190,160,255,0.8)" }}>?</div> : null}
    </AbsoluteFill>
  );
};

/* ---------- F : « until you see it, you keep repeating it. Every day. » ---------- */
const SceneF: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.f[0]);
  const days = Math.min(7, Math.max(0, Math.floor((f - T(W.every)) / 3) + 1));
  const see = prog(f, T(W.see) - 2, T(W.see) + 10, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "f")}>
      <Words
        f={f}
        top={260}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "And until you", at: W.and, kind: "muted", size: 110 }, { t: "see it,", at: W.see, kind: "serif" }],
          [{ t: "you keep", at: W.keep, kind: "muted", size: 110 }, { t: "repeating it.", at: W.repeating, kind: "bold" }],
          [{ t: "Every day.", at: W.every, kind: "serif" }],
        ]}
      />
      {/* la phrase qui tourne en boucle, en écho */}
      {[0, 1, 2, 3].map((k) => (
        <div key={k} style={{ position: "absolute", left: 0, right: 0, top: 1000 + k * 110, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 58, color: "rgba(225,210,255,0.85)", opacity: prog(f, T(W.keep) + k * 5, T(W.keep) + k * 5 + 8) * (0.9 - k * 0.18), filter: `blur(${k * 1.2}px)`, transform: `translateX(${Math.sin(f / 10 + k) * 10}px)` }}>
          “Money doesn't grow on trees.”
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1520, display: "flex", justifyContent: "center", gap: 18 }}>
        {"MTWTFSS".split("").map((d, i) => (
          <div key={i} style={{ width: 84, height: 84, borderRadius: 22, ...glass(i < days ? 0.8 : 0.1), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 28, color: i < days ? "#fff" : C.muted }}>{d}</div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: see }}>on repeat · until you see it</div>
    </AbsoluteFill>
  );
};

/* ---------- G : « Write it in the comments. Then we can transform it. » ---------- */
const SceneG: React.FC<{ f: number }> = ({ f }) => {
  const box = prog(f, T(W.write) - 4, T(W.write) + 10, eBack);
  const oldMsg = "I'm just bad with money.";
  const newMsg = "I'm learning to manage money with method.";
  const typedOld = oldMsg.slice(0, Math.round(lerp(0, oldMsg.length, prog(f, T(W.write), T(W.commentsEnd), (x) => x))));
  const strike = prog(f, T(W.transform) - 4, T(W.transform) + 8, eInOut);
  const typedNew = newMsg.slice(0, Math.round(lerp(0, newMsg.length, prog(f, T(W.transform) + 6, T(W.itEnd) + 8, (x) => x))));
  return (
    <AbsoluteFill style={sceneFx(f, "g")}>
      <Words
        f={f}
        top={240}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "So take", at: W.so, kind: "muted", size: 110 }, { t: "a moment.", at: W.take + 0.3, kind: "serif" }],
          [{ t: "Write it", at: W.write, kind: "bold" }, { t: "in the comments.", at: W.comments - 0.1, kind: "muted", size: 104 }],
          [{ t: "Then we can", at: W.then, kind: "muted", size: 110 }],
          [{ t: "transform it.", at: W.transform, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 90, right: 90, top: 1000, padding: "34px 36px", borderRadius: 36, ...glass(0.4 + 0.5 * strike), opacity: Math.min(1, box * 1.5), transform: `scale(${lerp(0.9, 1, Math.min(1, box))})` }}>
        <div style={{ ...capsStyle, fontSize: 20, marginBottom: 22 }}>comments</div>
        <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg, #b9a6ff, #7c3aed)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.white }}>you</div>
            <div style={{ position: "relative", display: "inline-block", fontFamily: SANS, fontWeight: 500, fontSize: 40, color: strike > 0.5 ? C.muted : "#f0ebff" }}>
              {typedOld}
              <span style={{ position: "absolute", left: -4, right: -4, top: "52%", height: 4, background: C.lilacSoft, transform: `scaleX(${strike})`, transformOrigin: "0% 50%" }} />
            </div>
            {typedNew ? <div style={{ ...serifGradient, fontSize: 52, lineHeight: 1.15, marginTop: 14 }}>{typedNew}</div> : null}
          </div>
        </div>
      </div>
      {strike > 0.5 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", opacity: prog(f, T(W.transform) + 6, T(W.transform) + 14) }}>
          <div style={{ padding: "14px 30px", borderRadius: 999, background: pillBg, boxShadow: "0 0 40px rgba(139,92,246,0.8)", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#fff" }}>✦ belief transformed</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.money, src: "chime1", vol: 0.18 },
  { at: W.keeps, src: "whoosh_soft", vol: 0.14 },
  { at: 3.1, src: "whoosh", vol: 0.3 },
  { at: W.money2, src: "chime2", vol: 0.16 },
  { at: W.im, src: "chime3", vol: 0.16 },
  { at: W.people, src: "chime2", vol: 0.16 },
  { at: 9.15, src: "whoosh", vol: 0.3 },
  { at: W.home, src: "chime5", vol: 0.2 },
  { at: 11.75, src: "whoosh", vol: 0.3 },
  { at: W.nobody, src: "whoosh_soft", vol: 0.14 },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ at: W.many + i * 0.07, src: "tick", vol: 0.08 })),
  { at: W.strategy, src: "tick_low", vol: 0.3 },
  { at: 17.45, src: "whoosh", vol: 0.3 },
  { at: W.inherited, src: "chime1", vol: 0.18 },
  { at: W.inherited + 0.27, src: "chime2", vol: 0.18 },
  { at: W.inherited + 0.54, src: "chime3", vol: 0.18 },
  { at: W.questioned, src: "sub", vol: 0.26 },
  { at: 20.95, src: "whoosh", vol: 0.3 },
  { at: W.see, src: "shimmer", vol: 0.2 },
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ at: W.every + i * 0.1, src: "tick", vol: 0.1 })),
  { at: 24.95, src: "whoosh", vol: 0.3 },
  ...Array.from({ length: 10 }, (_, i) => ({ at: W.write + i * 0.12, src: "tick", vol: 0.05 })),
  { at: W.transform, src: "shimmer", vol: 0.3 },
  { at: W.transform + 0.2, src: "chime5", vol: 0.24 },
  { at: W.manifest - 0.05, src: "impact", vol: 0.42 },
  { at: W.with, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.35 },
  { at: 32.75, src: "whoosh", vol: 0.3 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} loop volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice-belief.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
