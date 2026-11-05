import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Vignette } from "../signspath/Background";
import { C, loadFonts, SANS, SERIF, serifGradient } from "../signspath/theme";
import { clamp, eBack, eInOut, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { Logo, Shot, StoreCTA, capsStyle, glass, pillBg } from "../signspath18/shared";
import { LiquidBackdrop, Stage3D, pop, typed } from "../signspath21/stage";
import { DURATION_FRAMES, SC, T, W } from "./timing";

loadFonts();

const CUTS = [SC.b[0], SC.c[0], SC.d[0], SC.e[0], SC.f[0], SC.cta[0]];
const OLD = "I'm not good enough.";
const NEW = "I'm capable and I'm learning.";

/** Motion SignsPath #22 — « une phrase dans ta tête bloque ta manifestation » (pub app Signs). */
export const Sentence: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <LiquidBackdrop f={f} cuts={CUTS} />
      <Stage3D f={f} range={SC.a} enter="none" exit="dive">
        <SceneA f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.b} enter="dive" exit="flipY">
        <SceneB f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.c} enter="flipY" exit="flipX">
        <SceneC f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.d} enter="flipX" exit="swing">
        <SceneD f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.e} enter="swing" exit="flipY">
        <SceneE f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.f} enter="flipY" exit="dive">
        <SceneF f={f} />
      </Stage3D>
      <Stage3D f={f} range={SC.cta} enter="dive" exit="none">
        <Orb cx={540} cy={534} R={170} power={0.55 + 0.25 * prog(f, T(W.signs2), T(W.signs2) + 20)} />
        <StoreCTA f={f} W={W} top={400} />
      </Stage3D>
      <Vignette />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 12, DURATION_FRAMES - 1, eInOut) }} />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : un rayon vers l'orbe, bloqué par une phrase ---------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const beam = prog(f, T(W.sentence), T(W.blocking), eInOut);
  const slab = prog(f, T(W.blocking) - 4, T(W.blocking) + 10, eBack);
  const hit = f >= T(W.blocking) + 4 ? Math.exp(-((f - T(W.blocking) - 4) % 18) / 5) : 0;
  const stop = lerp(80, 440, Math.min(1, slab));
  const end = lerp(80, 900, beam);
  return (
    <AbsoluteFill>
      <Words
        f={f}
        top={230}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "One sentence", at: W.one, kind: "serif" }],
          [{ t: "in your head", at: W.head, kind: "muted", size: 110 }],
          [{ t: "is blocking", at: W.blocking, kind: "bold" }],
          [{ t: "your manifestation.", at: W.manifestation, kind: "muted", size: 104 }],
        ]}
      />
      <Orb cx={900} cy={1300} R={110} power={0.25 + 0.15 * beam * (1 - Math.min(1, slab))} flicker={0.4} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <line x1={80} y1={1300} x2={slab > 0.05 ? Math.min(end, stop) : end} y2={1300} stroke="#efe8ff" strokeWidth={10} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 16px #c8b0ff)" }} opacity={beam > 0 ? 1 : 0} />
        <circle cx={80} cy={1300} r={18} fill="#fff" opacity={pop(f, W.sentence)} style={{ filter: "drop-shadow(0 0 14px #fff)" }} />
        {hit > 0 ? <circle cx={stop} cy={1300} r={30 + 60 * (1 - hit)} fill="none" stroke="#ff9db5" strokeWidth={4} opacity={hit} /> : null}
      </svg>
      <div style={{ position: "absolute", inset: 0, perspective: 1200 }}>
        <div style={{ position: "absolute", left: 430, top: 1000, width: 190, height: 600, borderRadius: 24, ...glass(0.7), transform: `translateZ(${(1 - Math.min(1, slab)) * 600}px) rotateY(${-55 + 8 * Math.sin(f / 18)}deg)`, opacity: Math.min(1, slab * 1.5), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 50px rgba(255,157,181,0.5)" }}>
          <span style={{ writingMode: "vertical-rl", fontFamily: SERIF, fontStyle: "italic", fontSize: 66, color: "#ffd3de" }}>“{OLD}”</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B : Signs la trouve et la réécrit ---------- */
const BLUR = ["I always mess it up.", "Money is hard for me.", "I'm not good enough.", "People like me don't…"];
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const lq = pop(f, W.signs, 14);
  const lens = prog(f, T(W.helps), T(W.find) + 8, eInOut);
  const found = prog(f, T(W.find) + 4, T(W.find) + 12, eBack);
  const rw = prog(f, T(W.rewrite), T(W.rwEnd), eInOut);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 180, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
        <Logo size={110} q={lq} f={f} />
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 96, color: C.white, letterSpacing: -2, opacity: Math.min(1, lq * 1.4) }}>Signs</span>
      </div>
      <Words
        f={f}
        top={360}
        size={74}
        lineGap={2}
        lines={[[{ t: "helps you", at: W.helps, kind: "muted", size: 104 }, { t: "find it,", at: W.find, kind: "bold" }], [{ t: "and rewrite it.", at: W.and + 0.1, kind: "serif" }]]}
      />
      <div style={{ position: "absolute", inset: 0, perspective: 1400 }}>
        <div style={{ position: "absolute", left: 110, right: 110, top: 760, padding: "40px 44px", borderRadius: 40, ...glass(0.5), transform: `rotateX(${16 + 3 * Math.sin(f / 20)}deg) rotateY(${-8 * Math.sin(f / 26)}deg)` }}>
          {BLUR.map((b, i) => {
            const key = i === 2;
            const sharp = key ? found : 0;
            return (
              <div key={b} style={{ position: "relative", padding: "20px 0", fontFamily: SERIF, fontStyle: "italic", fontSize: 54, color: key && rw > 0.5 ? "transparent" : "#efe8ff", filter: `blur(${(1 - sharp) * 6}px)`, opacity: key ? 0.5 + 0.5 * sharp : 0.45, borderTop: i ? "1px solid rgba(255,255,255,0.08)" : undefined }}>
                “{b}”
                {key && rw > 0 ? (
                  <span style={{ position: "absolute", left: 0, top: 20, ...serifGradient, fontSize: 54, clipPath: `inset(0 ${(1 - rw) * 100}% 0 0)` }}>“{NEW}”</span>
                ) : null}
                {key && found > 0 && rw < 0.5 ? <span style={{ position: "absolute", left: -18, right: -18, top: 8, bottom: 8, borderRadius: 18, border: `3px solid ${C.lilacSoft}`, boxShadow: "0 0 30px rgba(190,160,255,0.8)", opacity: found }} /> : null}
              </div>
            );
          })}
        </div>
        {/* loupe */}
        <div style={{ position: "absolute", left: lerp(820, 640, lens), top: lerp(820, 1010, lens), width: 170, height: 170, borderRadius: "50%", border: "8px solid #efe8ff", background: "rgba(255,255,255,0.06)", boxShadow: "0 0 40px rgba(190,160,255,0.8)", opacity: pop(f, W.helps) * (1 - rw), transform: "translateZ(120px)" }}>
          <div style={{ position: "absolute", right: -50, bottom: -50, width: 80, height: 18, borderRadius: 9, background: "#efe8ff", transform: "rotate(45deg)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- C : les 3 phrases qui arrivent du fond ---------- */
const Q = [
  { t: "I'm not good enough.", at: W.im },
  { t: "Money is hard for me.", at: W.money },
  { t: "It never works for me.", at: W.it },
];
const SceneC: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", top: 240, left: 0, right: 0, textAlign: "center", ...capsStyle, opacity: pop(f, W.im) }}>sounds familiar?</div>
    <div style={{ position: "absolute", inset: 0, perspective: 1100 }}>
      {Q.map((q, i) => {
        const inQ = prog(f, T(q.at) - 4, T(q.at) + 12, eBack);
        const back = i < Q.length - 1 ? prog(f, T(Q[i + 1].at) - 4, T(Q[i + 1].at) + 10, eInOut) : 0;
        const back2 = i < Q.length - 2 ? prog(f, T(Q[i + 2].at) - 4, T(Q[i + 2].at) + 10, eInOut) : 0;
        const z = lerp(-1800, 0, Math.min(1, inQ)) - 380 * (back + back2);
        const y = 950 - 260 * (back + back2) + (1 - Math.min(1, inQ)) * 100;
        return (
          <div key={q.t} style={{ position: "absolute", left: 80, right: 80, top: y, display: "flex", justifyContent: "center", transform: `translateZ(${z}px) rotateY(${(i - 1) * 10}deg) rotateZ(${(i - 1) * 2}deg)`, opacity: Math.min(1, inQ * 1.5) * (1 - 0.35 * (back + back2)), filter: back > 0.05 ? `blur(${(back + back2) * 2.5}px)` : undefined }}>
            <div style={{ padding: "34px 50px", borderRadius: 44, ...glass(0.7 - 0.4 * back), boxShadow: `0 0 ${60 * (1 - back)}px rgba(255,140,170,0.4)` }}>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 76, color: "#ffe3ea" }}>“{q.t}”</span>
            </div>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

/* ---------- D : la phrase tourne en boucle sur un cylindre 3D ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const N = 14;
  const R = 470;
  const fade = prog(f, T(W.without), T(W.notEnd), eInOut);
  const days = Math.min(7, Math.max(0, Math.floor((f - T(W.every)) / 2) + 1));
  return (
    <AbsoluteFill>
      <Words
        f={f}
        top={220}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "Your brain", at: W.your, kind: "muted", size: 110 }, { t: "repeats it", at: W.repeats, kind: "bold" }],
          [{ t: "every day,", at: W.every, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", inset: 0, perspective: 1400, perspectiveOrigin: "50% 1050px" }}>
        <div style={{ position: "absolute", left: 540, top: 1050, transformStyle: "preserve-3d", transform: `rotateX(-14deg) rotateY(${f * 1.6}deg)`, opacity: 1 - 0.75 * fade, filter: fade > 0.05 ? `blur(${fade * 6}px)` : undefined }}>
          {Array.from({ length: N }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: -150, top: -40 + (i % 2) * 110 - 55, width: 300, textAlign: "center", transform: `rotateY(${(i * 360) / N}deg) translateZ(${R}px)`, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: "#ffd3de", backfaceVisibility: "hidden", whiteSpace: "nowrap", textShadow: "0 0 18px rgba(255,140,170,0.6)" }}>
              {Q[i % 3].t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, display: "flex", justifyContent: "center", gap: 16 }}>
        {"MTWTFSS".split("").map((d, i) => (
          <div key={i} style={{ width: 80, height: 80, borderRadius: 22, ...glass(i < days ? 0.75 : 0.1), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: i < days ? "#ffd3de" : C.muted }}>{i < days ? "↻" : d}</div>
        ))}
      </div>
      <Words f={f} top={1520} size={66} lines={[[{ t: "without you noticing.", at: W.without, kind: "muted", size: 100 }]]} />
    </AbsoluteFill>
  );
};

/* ---------- E : la remplacer par une croyance acceptable ---------- */
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const flip = prog(f, T(W.replace) + 2, T(W.belief) + 6, eInOut);
  const meter = prog(f, T(W.actually), T(W.accEnd), eInOut);
  const nw = typed(f, NEW, W.im2, W.learnEnd);
  const face: React.CSSProperties = { position: "absolute", inset: 0, borderRadius: 40, backfaceVisibility: "hidden", padding: "56px 54px", display: "flex", flexDirection: "column", justifyContent: "center" };
  return (
    <AbsoluteFill>
      <Words
        f={f}
        top={200}
        size={74}
        lineGap={2}
        lines={[
          [{ t: "Replace it with a", at: W.replace, kind: "muted", size: 104 }, { t: "belief", at: W.belief, kind: "bold" }],
          [{ t: "you can actually accept:", at: W.actually - 0.3, kind: "serif", size: 56 }],
        ]}
      />
      <div style={{ position: "absolute", inset: 0, perspective: 1600 }}>
        <div style={{ position: "absolute", left: 110, right: 110, top: 560, height: 560, transformStyle: "preserve-3d", transform: `rotateY(${flip * 180 + 6 * Math.sin(f / 24)}deg) rotateX(${5 * Math.sin(f / 30)}deg)` }}>
          <div style={{ ...face, ...glass(0.4) }}>
            <div style={{ ...capsStyle, fontSize: 20, color: "#ff9db5" }}>old belief</div>
            <div style={{ position: "relative", display: "inline-block", fontFamily: SERIF, fontStyle: "italic", fontSize: 80, color: "#ffe3ea", marginTop: 20 }}>
              “{OLD}”
              <span style={{ position: "absolute", left: -8, right: -8, top: "54%", height: 6, borderRadius: 3, background: "#ff9db5", transform: `scaleX(${prog(f, T(W.replace) - 6, T(W.replace) + 4, eInOut)})`, transformOrigin: "0 50%" }} />
            </div>
          </div>
          <div style={{ ...face, ...glass(0.9), transform: "rotateY(180deg)" }}>
            <div style={{ display: "inline-flex", alignSelf: "flex-start", padding: "10px 22px", borderRadius: 999, background: pillBg, fontFamily: SANS, fontWeight: 800, fontSize: 24, color: "#fff" }}>✦ new belief</div>
            <div style={{ ...serifGradient, fontSize: 92, lineHeight: 1.08, marginTop: 26, minHeight: 200 }}>
              {nw ? `“${nw}` : ""}
              <span style={{ opacity: f < T(W.learnEnd) + 8 && Math.floor(f / 7) % 2 === 0 ? 1 : 0, color: C.lilac, fontFamily: SANS, fontStyle: "normal", fontSize: 70 }}>|</span>
            </div>
          </div>
        </div>
      </div>
      {/* jauge « crédible » */}
      <div style={{ position: "absolute", left: 170, right: 170, top: 1250, opacity: pop(f, W.actually) }}>
        <div style={{ display: "flex", justifyContent: "space-between", ...capsStyle, fontSize: 20 }}>
          <span>believable</span>
          <span style={{ color: "#fff" }}>{Math.round(meter * 100)}%</span>
        </div>
        <div style={{ marginTop: 14, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
          <div style={{ width: `${meter * 100}%`, height: "100%", background: "linear-gradient(90deg, #b9a6ff, #7c3aed)", boxShadow: "0 0 20px rgba(167,139,250,0.9)" }} />
        </div>
      </div>
      {meter >= 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1400, display: "flex", justifyContent: "center", opacity: prog(f, T(W.accEnd), T(W.accEnd) + 8) }}>
          <div style={{ padding: "14px 32px", borderRadius: 999, background: pillBg, boxShadow: "0 0 40px rgba(139,92,246,0.8)", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#fff" }}>✓ your brain can accept this</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- F : « Then repeat it every morning. » ---------- */
const SceneF: React.FC<{ f: number }> = ({ f }) => {
  const sun = prog(f, T(W.then), T(W.mornEnd), eInOut);
  const ph = pop(f, W.repeat, 16);
  return (
    <AbsoluteFill>
      <Words
        f={f}
        top={200}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "Then", at: W.then, kind: "muted", size: 110 }, { t: "repeat it", at: W.repeat, kind: "bold" }],
          [{ t: "every morning.", at: W.morning - 0.35, kind: "serif" }],
        ]}
      />
      <div style={{ position: "absolute", left: 540 - 260, top: lerp(1500, 1000, sun) - 260, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,200,0.9), rgba(255,190,150,0.35) 40%, rgba(255,160,120,0) 70%)", opacity: sun }} />
      <div style={{ position: "absolute", inset: 0, perspective: 1300 }}>
        <div style={{ position: "absolute", left: 390, top: 680, transform: `rotateY(${lerp(-120, -10, Math.min(1, ph)) + 6 * Math.sin(f / 20)}deg) rotateX(8deg)` }}>
          <Shot src="repeat" w={300} q={ph} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.sentence, src: "riser", vol: 0.12 },
  { at: W.blocking, src: "impact", vol: 0.26 },
  { at: W.blocking + 0.05, src: "freeze", vol: 0.18 },
  ...CUTS.map((c) => ({ at: c - 0.15, src: "whoosh", vol: 0.3 })),
  { at: W.signs, src: "shimmer", vol: 0.26 },
  { at: W.find + 0.15, src: "chime5", vol: 0.2 },
  { at: W.rewrite, src: "whoosh_soft", vol: 0.2 },
  { at: W.im, src: "sub", vol: 0.24 },
  { at: W.money, src: "sub", vol: 0.22 },
  { at: W.it, src: "sub", vol: 0.22 },
  ...Array.from({ length: 7 }, (_, i) => ({ at: W.every + i * 0.067, src: "tick_low", vol: 0.12 })),
  { at: W.replace + 0.1, src: "whoosh_soft", vol: 0.24 },
  { at: W.belief, src: "chime1", vol: 0.2 },
  { at: W.accEnd, src: "chime5", vol: 0.22 },
  { at: W.im2, src: "shimmer", vol: 0.26 },
  { at: W.then, src: "chime2", vol: 0.18 },
  { at: W.morning, src: "chime3", vol: 0.2 },
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
      <Html5Audio src={staticFile("signspath/voice-sentence.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
