import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { Icon } from "../signspath/Icons";
import { C, loadFonts, SANS, SERIF, serifGradient } from "../signspath/theme";
import { clamp, eBack, eInOut, eOut, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { Shot, StoreCTA, capsStyle, glass, mkScenes, pillBg } from "../signspath18/shared";
import { DURATION_FRAMES, SC, T, W } from "./timing";

loadFonts();
const { on, fx } = mkScenes(SC);

/** Silhouette lumineuse (tête + buste). */
const Figure: React.FC<{ a: number; scale?: number; ghost?: boolean }> = ({ a, scale = 1, ghost }) => (
  <div style={{ transform: `scale(${scale})`, opacity: a, filter: ghost ? "blur(1.5px)" : `drop-shadow(0 0 ${30 * a}px rgba(190,160,255,0.9))` }}>
    <div style={{ width: 110, height: 110, borderRadius: "50%", margin: "0 auto", background: ghost ? "rgba(207,194,255,0.25)" : "linear-gradient(160deg, #f1ebff, #b9a6ff)" }} />
    <div style={{ width: 200, height: 170, borderRadius: "100px 100px 26px 26px", marginTop: 14, background: ghost ? "rgba(207,194,255,0.2)" : "linear-gradient(160deg, #e3d9ff, #8b5cf6)" }} />
  </div>
);

/** Motion SignsPath #19 — « you attract who you are » (pub app Signs). */
export const FutureSelf: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.015 * Math.sin(f / 55)})` }}>
        {on(f, "a") ? <SceneA f={f} /> : null}
        {on(f, "b") ? <SceneB f={f} /> : null}
        {on(f, "c") ? <SceneC f={f} /> : null}
        {on(f, "d") ? <SceneD f={f} /> : null}
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

/* ---------- A : « You don't attract what you want. You attract who you are. » ---------- */
const WANTS = ["money", "love", "career", "lifestyle"];
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const turn = prog(f, T(W.you2) - 2, T(W.are) + 6, eInOut);
  const pull = prog(f, T(W.attract2), T(W.are) + 10, eInOut);
  return (
    <AbsoluteFill style={fx(f, "a")}>
      <Words
        f={f}
        top={230}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "You don't attract", at: W.you, kind: "muted", size: 110 }],
          [{ t: "what you want.", at: W.what, kind: "bold" }],
          [{ t: "You attract", at: W.you2, kind: "muted", size: 110 }],
          [{ t: "who you are.", at: W.who, kind: "serif" }],
        ]}
      />
      <Orb cx={540} cy={1330} R={130} power={0.35 + 0.45 * pull} />
      {/* ce qu'on veut : des icônes qui flottent puis s'éloignent */}
      {WANTS.map((n, i) => {
        const ang = (i / WANTS.length) * Math.PI * 2 + f / 60;
        const R = lerp(300, 520, turn);
        const q = prog(f, T(W.what) + i * 3, T(W.what) + i * 3 + 10, eBack);
        return (
          <div key={n} style={{ position: "absolute", left: 540 + Math.cos(ang) * R - 60, top: 1330 + Math.sin(ang) * R * 0.6 - 60, width: 120, height: 120, borderRadius: 32, ...glass(0.3 * (1 - turn)), display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, q) * (1 - 0.75 * turn), transform: `scale(${Math.min(1, q)})` }}>
            <Icon name={n} size={64} color={C.lilacSoft} glow={0.4} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1230, display: "flex", justifyContent: "center", opacity: pull }}>
        <Figure a={pull} scale={0.8} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B : « …your future self matters more than your vision board. » ---------- */
const BOARD = ["money", "love", "career", "body", "creativity", "lifestyle"];
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const self = prog(f, T(W.future) - 2, T(W.self) + 12, eBack);
  const board = prog(f, T(W.vision) - 4, T(W.vision) + 10, eOut);
  const more = prog(f, T(W.more), T(W.boardEnd), eInOut);
  return (
    <AbsoluteFill style={fx(f, "b")}>
      <Words
        f={f}
        top={220}
        size={80}
        lineGap={2}
        lines={[
          [{ t: "That's why your", at: W.thats, kind: "muted", size: 104 }],
          [{ t: "future self", at: W.future, kind: "serif" }],
          [{ t: "matters more than your", at: W.matters, kind: "muted", size: 96 }],
          [{ t: "vision board.", at: W.vision, kind: "bold" }],
        ]}
      />
      {/* futur soi */}
      <div style={{ position: "absolute", left: 90, top: 980, width: 430, height: 620, borderRadius: 40, ...glass(0.4 + 0.5 * more), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: Math.min(1, self * 1.4), transform: `scale(${lerp(0.85, 1, Math.min(1, self)) * (1 + 0.06 * more)})` }}>
        <Figure a={1} />
        <div style={{ ...capsStyle, fontSize: 22, color: C.lilacSoft, marginTop: 36 }}>future self</div>
      </div>
      {/* tableau de vision */}
      <div style={{ position: "absolute", left: 580, top: 1060, width: 410, padding: 22, borderRadius: 34, ...glass(0.15), opacity: board * (1 - 0.5 * more), transform: `scale(${1 - 0.12 * more}) rotate(${3 * more}deg)`, filter: more > 0.05 ? `saturate(${1 - 0.7 * more}) blur(${more * 1.5}px)` : undefined }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {BOARD.map((n, i) => (
            <div key={n} style={{ height: 120, borderRadius: 20, background: "rgba(207,194,255,0.08)", border: "1px dashed rgba(207,194,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${(i % 2 ? 1 : -1) * 3}deg)` }}>
              <Icon name={n} size={56} color={C.muted} glow={0} />
            </div>
          ))}
        </div>
        <div style={{ ...capsStyle, fontSize: 18, textAlign: "center", marginTop: 16 }}>vision board</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- C : « Who are you in 6 months? How do you think? How do you act? » ---------- */
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const line = prog(f, T(W.who2), T(W.monthsEnd), eInOut);
  const card = (at: number, label: string, quote: string, top: number) => {
    const q = prog(f, T(at) - 2, T(at) + 12, eBack);
    return (
      <div style={{ position: "absolute", left: 110, right: 110, top, padding: "30px 40px", borderRadius: 34, ...glass(0.55), opacity: Math.min(1, q * 1.5), transform: `translateY(${(1 - Math.min(1, q)) * 50}px)` }}>
        <div style={{ ...capsStyle, fontSize: 20, color: C.lilacSoft }}>{label}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 54, color: "#f0ebff", marginTop: 10 }}>{quote}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={fx(f, "c")}>
      <Words
        f={f}
        top={230}
        size={90}
        lineGap={2}
        lines={[
          [{ t: "Who are you", at: W.who2, kind: "bold" }],
          [{ t: "in", at: W.six - 0.1, kind: "muted", size: 110 }, { t: "6 months?", at: W.six, kind: "serif" }],
        ]}
      />
      {/* frise aujourd'hui → 6 mois */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <line x1={160} y1={720} x2={lerp(160, 920, line)} y2={720} stroke="rgba(235,220,255,0.85)" strokeWidth={5} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px #b48cff)" }} />
        <circle cx={160} cy={720} r={14} fill="#cfc2ff" />
        <circle cx={lerp(160, 920, line)} cy={720} r={20} fill="#fff" style={{ filter: "drop-shadow(0 0 18px #c8b0ff)" }} />
      </svg>
      <div style={{ position: "absolute", left: 100, top: 760, ...capsStyle, fontSize: 20 }}>today</div>
      <div style={{ position: "absolute", right: 100, top: 760, ...capsStyle, fontSize: 20, color: C.lilacSoft, opacity: line }}>+6 months</div>
      {card(W.how, "mindset", "“I'm ready for it.”", 900)}
      {card(W.how2, "actions", "“I show up, every day.”", 1180)}
      <Words f={f} top={1490} size={70} lines={[[{ t: "How do you think?", at: W.how, kind: "muted", size: 90 }], [{ t: "How do you act?", at: W.how2, kind: "bold", size: 70 }]]} />
    </AbsoluteFill>
  );
};

/* ---------- D : « Signs helps you define that person, and become them, one ritual at a time. » ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const p1 = prog(f, T(W.signs) - 2, T(W.signs) + 14, eBack);
  const swap = prog(f, T(W.become) - 4, T(W.become) + 8, eInOut);
  const days = Math.min(7, Math.max(0, Math.floor((f - T(W.one)) / 4) + 1));
  return (
    <AbsoluteFill style={fx(f, "d")}>
      <Words
        f={f}
        top={170}
        size={76}
        lineGap={2}
        lines={[
          [{ t: "Signs helps you", at: W.signs, kind: "muted", size: 100 }],
          [{ t: "define", at: W.define, kind: "serif" }, { t: "that person,", at: W.person, kind: "bold" }],
          [{ t: "and", at: W.and, kind: "muted", size: 100 }, { t: "become them.", at: W.become, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 390, top: 700 }}>
        <div style={{ position: "absolute", opacity: 1 - swap }}>
          <Shot src="focus" w={300} q={p1} />
        </div>
        <div style={{ opacity: swap }}>
          <Shot src="home" w={300} q={swap} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 820, display: "flex", flexDirection: "column", gap: 20 }}>
        {["define", "become"].map((l, i) => {
          const q = prog(f, T(i ? W.become : W.define) - 2, T(i ? W.become : W.define) + 10, eBack);
          return (
            <span key={l} style={{ padding: "10px 22px", borderRadius: 999, background: pillBg, fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#fff", opacity: Math.min(1, q * 1.4), transform: `scale(${Math.min(1, q)})`, boxShadow: "0 0 24px rgba(139,92,246,0.7)" }}>✓ {l}</span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1450, display: "flex", justifyContent: "center", gap: 16, opacity: prog(f, T(W.one) - 2, T(W.one) + 8) }}>
        {"MTWTFSS".split("").map((d, i) => (
          <div key={i} style={{ width: 84, height: 84, borderRadius: 22, ...glass(i < days ? 0.8 : 0.1), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 28, color: i < days ? "#fff" : C.muted }}>{i < days ? "✦" : d}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1580, textAlign: "center", opacity: prog(f, T(W.ritual) - 2, T(W.ritual) + 10) }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, color: C.muted }}>one </span>
        <span style={{ ...serifGradient, fontSize: 84 }}>ritual</span>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, color: C.muted }}> at a time</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  ...[0, 1, 2, 3].map((i) => ({ at: W.what + i * 0.1, src: "tick", vol: 0.08 })),
  { at: W.who, src: "chime5", vol: 0.22 },
  { at: W.are, src: "sub", vol: 0.26 },
  { at: 3.8, src: "whoosh", vol: 0.3 },
  { at: W.future, src: "shimmer", vol: 0.22 },
  { at: W.vision, src: "tick_low", vol: 0.24 },
  { at: 7.35, src: "whoosh", vol: 0.3 },
  { at: W.six, src: "chime1", vol: 0.2 },
  { at: W.how, src: "chime2", vol: 0.18 },
  { at: W.how2, src: "chime3", vol: 0.18 },
  { at: 11.6, src: "whoosh", vol: 0.3 },
  { at: W.signs, src: "shimmer", vol: 0.26 },
  { at: W.become, src: "chime5", vol: 0.2 },
  ...Array.from({ length: 7 }, (_, i) => ({ at: W.one + i * 0.133, src: "tick", vol: 0.08 })),
  { at: 16.75, src: "whoosh", vol: 0.3 },
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
      <Html5Audio src={staticFile("signspath/voice-promo2.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
