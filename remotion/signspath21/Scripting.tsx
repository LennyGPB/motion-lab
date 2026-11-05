import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Vignette } from "../signspath/Background";
import { C, loadFonts, SANS, SERIF, serifGradient } from "../signspath/theme";
import { clamp, eBack, eInOut, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { Logo, Shot, StoreCTA, capsStyle, glass, pillBg } from "../signspath18/shared";
import { LiquidBackdrop, Stage3D, pop, typed } from "./stage";
import { DURATION_FRAMES, SC, T, W } from "./timing";

loadFonts();

const CUTS = [SC.b[0], SC.c[0], SC.d[0], SC.e[0], SC.f[0], SC.cta[0]];
const lines = (n: number, gap: number) =>
  Array.from({ length: n }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40, right: 40, top: 110 + i * gap, height: 2, background: "rgba(207,194,255,0.18)" }} />);

/** Motion SignsPath #21 — « scripting » (pub app Signs, fond métal liquide). */
export const Scripting: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <LiquidBackdrop f={f} cuts={CUTS} />
      <Stage3D f={f} range={SC.a} enter="none" exit="flipY">
        <SceneA f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.b} enter="flipY" exit="dive">
        <SceneB f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.c} enter="dive" exit="swing">
        <SceneC f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.d} enter="swing" exit="flipX">
        <SceneD f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.e} enter="flipX" exit="flipY">
        <SceneE f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.f} enter="flipY" exit="dive">
        <SceneF f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.cta} enter="dive" exit="none">
        <Orb cx={540} cy={534} R={170} power={0.55 + 0.25 * prog(f, T(W.signs3), T(W.signs3) + 20)} />
        <StoreCTA f={f} W={{ signs2: W.signs3, available: W.available, ios: W.ios, android: W.android, end: W.end }} top={400} />
      </Stage3D>
      <Vignette />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 12, DURATION_FRAMES - 1, eInOut) }} />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : « Scripting is the most underrated manifestation technique. » ---------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const nb = pop(f, W.scripting, 18);
  const tag = prog(f, T(W.underrated) - 2, T(W.underrated) + 10, eBack);
  const txt = typed(f, "I am calm. I am free. I did it.", W.scripting + 0.2, W.techEnd);
  return (
    <AbsoluteFill>
      <Words
        f={f}
        top={220}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "Scripting", at: W.scripting, kind: "serif", size: 110 }],
          [{ t: "is the most", at: W.is, kind: "muted", size: 110 }, { t: "underrated", at: W.underrated, kind: "bold" }],
          [{ t: "manifestation technique.", at: W.manifestation, kind: "muted", size: 100 }],
        ]}
      />
      <div style={{ position: "absolute", inset: 0, perspective: 1400 }}>
        <div style={{ position: "absolute", left: 150, top: 900, width: 780, height: 560, borderRadius: 40, ...glass(0.55), opacity: Math.min(1, nb * 1.4), transform: `translateY(${(1 - Math.min(1, nb)) * 200}px) rotateX(${22 + 4 * Math.sin(f / 25)}deg) rotateY(${lerp(-60, -12, Math.min(1, nb)) + 4 * Math.sin(f / 31)}deg) rotateZ(-3deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", left: 40, top: 36, ...capsStyle, fontSize: 20, color: C.lilacSoft }}>my script</div>
          {lines(5, 80)}
          <div style={{ position: "absolute", left: 40, right: 40, top: 120, fontFamily: SERIF, fontStyle: "italic", fontSize: 62, lineHeight: "80px", color: "#f3eeff" }}>
            {txt}
            <span style={{ opacity: Math.floor(f / 7) % 2 ? 0 : 1, color: C.lilac }}>|</span>
          </div>
          {/* stylo */}
          <div style={{ position: "absolute", left: 60 + (txt.length % 18) * 34, top: 170 + Math.floor(txt.length / 18) * 80, width: 16, height: 170, borderRadius: 8, background: "linear-gradient(180deg, #f1ebff, #8b5cf6)", transform: `rotate(28deg) translateZ(60px)`, transformOrigin: "50% 100%", boxShadow: "0 0 20px rgba(190,160,255,0.8)", opacity: Math.min(1, nb) }} />
        </div>
      </div>
      {tag > 0 ? (
        <div style={{ position: "absolute", right: 110, top: 840, padding: "12px 26px", borderRadius: 16, background: pillBg, fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "0.12em", color: "#fff", transform: `rotate(6deg) scale(${lerp(2.2, 1, Math.min(1, tag))})`, opacity: Math.min(1, tag * 1.5), boxShadow: "0 0 40px rgba(139,92,246,0.9)" }}>#1 UNDERRATED</div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- B : « With the Signs app, you can practice it every day in seconds. » ---------- */
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const lq = pop(f, W.signs, 14);
  const ph = prog(f, T(W.signs) - 2, T(W.practice), eInOut);
  const days = Math.min(7, Math.max(0, Math.floor((f - T(W.every)) / 2) + 1));
  const secs = prog(f, T(W.in), T(W.secEnd), eInOut);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 160, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 54, color: C.muted, opacity: pop(f, W.with) }}>with</span>
        <Logo size={110} q={lq} f={f} />
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 96, color: C.white, letterSpacing: -2, opacity: Math.min(1, lq * 1.4) }}>Signs</span>
      </div>
      <Words
        f={f}
        top={330}
        size={74}
        lineGap={2}
        lines={[[{ t: "practice it", at: W.practice, kind: "bold" }], [{ t: "every day,", at: W.every, kind: "serif", size: 66 }, { t: "in seconds.", at: W.in, kind: "serif", size: 66 }]]}
      />
      <div style={{ position: "absolute", inset: 0, perspective: 1300 }}>
        <div style={{ position: "absolute", left: 390, top: 680, transform: `rotateY(${lerp(200, -14, ph) + 6 * Math.sin(f / 22)}deg) rotateX(${8 + 3 * Math.sin(f / 28)}deg)`, transformStyle: "preserve-3d" }}>
          <Shot src="home" w={300} q={Math.min(1, ph * 2)} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1450, display: "flex", justifyContent: "center", gap: 26 }}>
        <div style={{ padding: "20px 28px", borderRadius: 28, ...glass(0.6), opacity: pop(f, W.every), display: "flex", gap: 10 }}>
          {"MTWTFSS".split("").map((d, i) => (
            <div key={i} style={{ width: 44, height: 44, borderRadius: 12, ...glass(i < days ? 0.9 : 0.1), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 18, color: i < days ? "#fff" : C.muted }}>{d}</div>
          ))}
        </div>
        <div style={{ padding: "12px 26px", borderRadius: 28, ...glass(0.6), opacity: pop(f, W.in), display: "flex", alignItems: "center", gap: 14 }}>
          <svg width={60} height={60} viewBox="0 0 60 60">
            <circle cx={30} cy={30} r={24} stroke="rgba(255,255,255,0.15)" strokeWidth={6} fill="none" />
            <circle cx={30} cy={30} r={24} stroke={C.lilacSoft} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={`${secs * 0.3} 1`} strokeLinecap="round" transform="rotate(-90 30 30)" />
          </svg>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{Math.round(secs * 30)}s</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- C : les 3 règles ---------- */
const RULES = [
  { at: W.write, t: "As if it already happened", bad: "I will be calm", good: "I am calm" },
  { at: W.present, t: "Present tense", bad: "Someday I'll have it", good: "I have it" },
  { at: W.first, t: "First person", bad: "They say it works", good: "I, me, my" },
];
const SceneC: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <Words
      f={f}
      top={210}
      size={84}
      lineGap={2}
      lines={[
        [{ t: "Write", at: W.write, kind: "bold" }, { t: "as if it", at: W.as, kind: "muted", size: 110 }],
        [{ t: "already happened.", at: W.already, kind: "serif" }],
      ]}
    />
    <div style={{ position: "absolute", inset: 0, perspective: 1200 }}>
      {RULES.map((r, i) => {
        const q = prog(f, T(r.at) - 2, T(r.at) + 14, eBack);
        const fix = prog(f, T(r.at) + 10, T(r.at) + 20, eInOut);
        return (
          <div key={r.t} style={{ position: "absolute", left: 100, right: 100, top: 640 + i * 290, height: 250, padding: "30px 40px", borderRadius: 36, ...glass(0.35 + 0.5 * Math.min(1, q)), transformOrigin: "50% 0%", transform: `rotateX(${(1 - Math.min(1, q)) * -100}deg) rotateY(${(i - 1) * 4 + 2 * Math.sin(f / 20 + i)}deg)`, opacity: Math.min(1, q * 2) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: pillBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#fff", boxShadow: "0 0 26px rgba(139,92,246,0.8)" }}>{i + 1}</div>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.white, letterSpacing: -1 }}>{r.t}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 30 }}>
              <span style={{ position: "relative", fontFamily: SERIF, fontStyle: "italic", fontSize: 46, color: C.muted, opacity: 1 - 0.5 * fix }}>
                “{r.bad}”
                <span style={{ position: "absolute", left: -6, right: -6, top: "55%", height: 4, background: "#ff9db5", transform: `scaleX(${fix})`, transformOrigin: "0 50%" }} />
              </span>
              <span style={{ fontSize: 40, color: C.lilacSoft, opacity: fix }}>→</span>
              <span style={{ ...serifGradient, fontSize: 56, opacity: fix, transform: `translateX(${(1 - fix) * 30}px)` }}>“{r.good}”</span>
            </div>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

/* ---------- D : « Today, I feel calm, because I finally… » ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const q = pop(f, W.today - 0.3, 16);
  const quote = typed(f, "Today, ", W.today, W.i) + typed(f, "I feel calm, ", W.i, W.because) + typed(f, "because I finally…", W.because, W.finEnd);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: q }}>your script · today</div>
      <div style={{ position: "absolute", inset: 0, perspective: 1500 }}>
        <div style={{ position: "absolute", left: 90, right: 90, top: 520, height: 800, borderRadius: 44, ...glass(0.6), transform: `rotateY(${8 * Math.sin(f / 26)}deg) rotateX(${10 + 4 * Math.cos(f / 30)}deg) scale(${lerp(0.85, 1, Math.min(1, q))})`, opacity: Math.min(1, q * 1.4), boxShadow: "0 0 80px rgba(150,110,255,0.55), 0 40px 90px rgba(5,0,20,0.6)" }}>
          {lines(7, 96)}
          <div style={{ position: "absolute", left: 60, right: 60, top: 110, fontFamily: SERIF, fontStyle: "italic", fontSize: 98, lineHeight: "96px", color: "#f6f2ff", textShadow: "0 0 26px rgba(190,160,255,0.6)" }}>
            “{quote}
            <span style={{ opacity: Math.floor(f / 7) % 2 ? 0 : 1, color: C.lilac }}>|</span>
          </div>
        </div>
      </div>
      {/* poussières lumineuses */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = i * 2.4 + f / 40;
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * (430 + (i % 3) * 40) - 5, top: 920 + Math.sin(a) * 560 - 5, width: 10, height: 10, borderRadius: "50%", background: "#efe8ff", opacity: q * (0.4 + 0.5 * Math.sin(f / 6 + i)), boxShadow: "0 0 14px #c8b0ff" }} />;
      })}
    </AbsoluteFill>
  );
};

/* ---------- E : prompt personnalisé, jamais de page blanche ---------- */
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const card = pop(f, W.signs2, 14);
  const flip = prog(f, T(W.prompt) - 4, T(W.prompt) + 14, eInOut);
  const stamp = prog(f, T(W.blank) - 2, T(W.blank) + 10, eBack);
  const face: React.CSSProperties = { position: "absolute", inset: 0, borderRadius: 40, backfaceVisibility: "hidden", padding: "50px 54px" };
  return (
    <AbsoluteFill>
      <Words
        f={f}
        top={200}
        size={78}
        lineGap={2}
        lines={[
          [{ t: "Signs gives you a", at: W.signs2, kind: "muted", size: 104 }],
          [{ t: "personalized prompt,", at: W.personalized, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", inset: 0, perspective: 1600 }}>
        <div style={{ position: "absolute", left: 140, right: 140, top: 560, height: 720, transformStyle: "preserve-3d", transform: `rotateY(${flip * 180 + 6 * Math.sin(f / 24)}deg) rotateX(${6 * Math.sin(f / 30)}deg) scale(${lerp(0.8, 1, Math.min(1, card))})`, opacity: Math.min(1, card * 1.5) }}>
          {/* recto : page blanche */}
          <div style={{ ...face, background: "linear-gradient(160deg, rgba(255,255,255,0.22), rgba(220,210,255,0.08))", border: "1.5px solid rgba(255,255,255,0.4)" }}>
            <div style={{ ...capsStyle, fontSize: 20 }}>new entry</div>
            <div style={{ marginTop: 40, fontFamily: SANS, fontWeight: 300, fontSize: 80, color: "#fff", opacity: Math.floor(f / 8) % 2 ? 0.2 : 0.9 }}>|</div>
          </div>
          {/* verso : le prompt */}
          <div style={{ ...face, ...glass(0.9), transform: "rotateY(180deg)" }}>
            <div style={{ display: "inline-block", padding: "10px 22px", borderRadius: 999, background: pillBg, fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#fff" }}>✦ your prompt</div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 66, lineHeight: 1.12, color: "#f3eeff", marginTop: 40 }}>{"Describe the moment you realised it was real. Where are you? Who's with you?"}</div>
            <div style={{ ...capsStyle, fontSize: 18, marginTop: 40, color: C.lilacSoft }}>made for your intention</div>
          </div>
        </div>
      </div>
      <Words
        f={f}
        top={1400}
        size={66}
        lineGap={2}
        lines={[
          [{ t: "so you never start", at: W.so, kind: "muted", size: 100 }],
          [{ t: "from a", at: W.start + 0.2, kind: "muted", size: 100 }, { t: "blank page.", at: W.blank, kind: "bold" }],
        ]}
      />
      {stamp > 0 ? (
        <div style={{ position: "absolute", left: 120, top: 520, padding: "10px 24px", borderRadius: 14, fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: "0.14em", color: "#ffd3de", background: "rgba(20,10,40,0.92)", border: "3px solid rgba(255,157,181,0.7)", transform: `rotate(-8deg) scale(${lerp(2, 1, Math.min(1, stamp))})`, opacity: Math.min(1, stamp * 1.5) }}>NO BLANK PAGE</div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- F : « Your brain starts looking for proof that it's true. » ---------- */
const PROOFS = ["a sign", "a yes", "a coincidence", "a new idea", "an open door"];
const SceneF: React.FC<{ f: number }> = ({ f }) => {
  const scan = prog(f, T(W.looking) - 4, T(W.trueEnd), eInOut);
  return (
    <AbsoluteFill>
      <Words
        f={f}
        top={230}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "Your brain starts", at: W.your, kind: "muted", size: 104 }],
          [{ t: "looking for proof", at: W.looking, kind: "bold" }],
          [{ t: "that it's true.", at: W.true - 0.35, kind: "serif" }],
        ]}
      />
      <Orb cx={540} cy={1180} R={150} power={0.5 + 0.4 * scan} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2].map((k) => {
          const q = ((f - T(W.looking)) / 30 + k / 3) % 1;
          return f >= T(W.looking) ? <circle key={k} cx={540} cy={1180} r={160 + q * 420} stroke="rgba(207,194,255,0.8)" strokeWidth={4 * (1 - q)} fill="none" opacity={1 - q} /> : null;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, perspective: 1200 }}>
        {PROOFS.map((p, i) => {
          const at = T(W.proof) + i * 4;
          const q = prog(f, at - 2, at + 10, eBack);
          const a = (i / PROOFS.length) * Math.PI * 2 + f / 45;
          const z = Math.sin(a);
          return (
            <div key={p} style={{ position: "absolute", left: 540 + Math.cos(a) * 380, top: 1180 + z * 120 + (i % 2 ? -40 : 40), transform: `translate(-50%, -50%) translateZ(${z * 200}px) scale(${Math.min(1, q)})`, opacity: Math.min(1, q * 1.5) * (0.55 + 0.45 * (z + 1) / 2), zIndex: Math.round(z * 10) + 10, padding: "14px 26px", borderRadius: 999, ...glass(0.7), fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#fff", whiteSpace: "nowrap" }}>
              ✓ {p}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.scripting, src: "chime5", vol: 0.2 },
  ...Array.from({ length: 10 }, (_, i) => ({ at: 0.2 + i * 0.3, src: "tick", vol: 0.05 })),
  { at: W.underrated, src: "impact", vol: 0.22 },
  ...CUTS.map((c) => ({ at: c - 0.15, src: "whoosh", vol: 0.3 })),
  { at: W.signs, src: "shimmer", vol: 0.26 },
  ...Array.from({ length: 7 }, (_, i) => ({ at: W.every + i * 0.067, src: "tick", vol: 0.08 })),
  { at: W.in, src: "chime2", vol: 0.18 },
  { at: W.write, src: "chime1", vol: 0.2 },
  { at: W.present, src: "chime2", vol: 0.2 },
  { at: W.first, src: "chime3", vol: 0.2 },
  ...Array.from({ length: 14 }, (_, i) => ({ at: W.today + i * 0.2, src: "tick", vol: 0.05 })),
  { at: W.calm, src: "chime5", vol: 0.18 },
  { at: W.prompt - 0.1, src: "whoosh_soft", vol: 0.22 },
  { at: W.prompt + 0.2, src: "shimmer", vol: 0.24 },
  { at: W.blank, src: "tick_low", vol: 0.26 },
  { at: W.looking, src: "riser", vol: 0.12 },
  ...PROOFS.map((_, i) => ({ at: W.proof + i * 0.133, src: "chime" + (i % 4), vol: 0.14 })),
  { at: W.signs3, src: "impact", vol: 0.3 },
  { at: W.signs3, src: "shimmer", vol: 0.3 },
  { at: W.ios, src: "chime2", vol: 0.2 },
  { at: W.android, src: "chime3", vol: 0.2 },
  { at: W.end, src: "chime6", vol: 0.2 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice-scripting.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

