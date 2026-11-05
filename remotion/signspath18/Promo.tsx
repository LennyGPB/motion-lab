import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { Icon } from "../signspath/Icons";
import { SceneFinale } from "../signspath/SceneFinale";
import { C, loadFonts, SANS, SERIF, serifGradient } from "../signspath/theme";
import { clamp, eBack, eIn, eInOut, eOut, hash, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { DURATION_FRAMES, SC, T, W } from "./timing";
import { Logo, Shot, StoreCTA, capsStyle, glass, pillBg } from "./shared";

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
/** Motion SignsPath #18 — pub de l'app Signs. */
export const Promo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.015 * Math.sin(f / 55)})` }}>
        {on(f, "a") ? <SceneA f={f} /> : null}
        {on(f, "b") ? <SceneB f={f} /> : null}
        {on(f, "c") ? <SceneC f={f} /> : null}
        {on(f, "e") ? <SceneE f={f} /> : null}
        <Sequence from={T(SC.finale[0])} durationInFrames={DURATION_FRAMES - T(SC.finale[0])} name="finale">
          <SceneFinale
            timing={{
              manifest: W.manifest, with: W.with, method: W.method, not: W.not, by: W.by, chance: W.chance,
              full: 99, signs: 99, path: 99.2, dot: 99.4, comEnd: 99.6, cta: 24.1, from: T(SC.finale[0]),
            }}
          />
        </Sequence>
        {f >= T(W.signs2) - 4 ? <StoreCTA f={f} W={W} /> : null}
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : « Your manifestation isn't working… and it's not the universe's fault. » ---------- */
const STARS = Array.from({ length: 40 }, (_, i) => ({ x: hash(i * 3.1) * 1000 + 40, y: hash(i * 5.7) * 640 + 960, r: 2 + hash(i * 7.3) * 4, ph: hash(i * 9.1) * 6.28 }));
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const bar = prog(f, T(W.manifestation), T(W.working), eOut);
  const stuck = f >= T(W.working);
  const pct = Math.round(lerp(0, 12, bar) + (stuck ? Math.sin(f / 2) * 0.6 : 0));
  const uni = prog(f, T(W.universe) - 4, T(W.universe) + 14, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "a")}>
      <Words
        f={f}
        top={230}
        size={86}
        lineGap={2}
        lines={[
          [{ t: "Your manifestation", at: W.your, kind: "bold" }],
          [{ t: "isn't working…", at: W.isnt, kind: "serif" }],
          [{ t: "and it's not the", at: W.and, kind: "muted", size: 104 }],
          [{ t: "universe's fault.", at: W.universe, kind: "serif" }],
        ]}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: uni }}>
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r * (0.6 + 0.4 * Math.sin(f / 9 + s.ph))} fill="#e9e0ff" opacity={0.35 + 0.5 * (0.5 + 0.5 * Math.sin(f / 7 + s.ph))} style={{ filter: "drop-shadow(0 0 6px #b48cff)" }} />
        ))}
      </svg>
      <Orb cx={540} cy={1300} R={120} power={stuck ? 0.35 : 0.5} flicker={stuck ? 0.6 : 0.1} />
      <div style={{ position: "absolute", left: 170, right: 170, top: 1560, padding: "26px 34px", borderRadius: 30, ...glass(0.3), opacity: prog(f, T(W.manifestation), T(W.manifestation) + 10) * (1 - 0.5 * uni) }}>
        <div style={{ display: "flex", justifyContent: "space-between", ...capsStyle, fontSize: 20 }}>
          <span>manifesting…</span>
          <span style={{ color: stuck ? "#ff9db5" : C.lilacSoft }}>{pct}%</span>
        </div>
        <div style={{ marginTop: 16, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #b9a6ff, #7c3aed)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B : « You're wishing. You're not manifesting. » ---------- */
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const star = prog(f, T(W.wishing) - 2, T(W.wishing) + 16, eInOut);
  const list = prog(f, T(W.manifesting) - 2, T(W.manifesting) + 10, eOut);
  return (
    <AbsoluteFill style={sceneFx(f, "b")}>
      <Words
        f={f}
        top={300}
        size={96}
        lineGap={2}
        lines={[
          [{ t: "You're", at: W.wishing - 0.2, kind: "muted", size: 110 }, { t: "wishing.", at: W.wishing, kind: "serif" }],
          [{ t: "You're not", at: W.youre2, kind: "muted", size: 110 }],
          [{ t: "manifesting.", at: W.manifesting, kind: "bold" }],
        ]}
      />
      {/* étoile filante = le vœu */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="shoot" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b9a6ff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
        </defs>
        <line x1={lerp(-200, 700, star) - 360} y1={lerp(980, 1180, star) - 80} x2={lerp(-200, 700, star)} y2={lerp(980, 1180, star)} stroke="url(#shoot)" strokeWidth={6} strokeLinecap="round" opacity={1 - prog(f, T(W.wishEnd), T(W.wishEnd) + 8)} />
        <circle cx={lerp(-200, 700, star)} cy={lerp(980, 1180, star)} r={12} fill="#fff" opacity={1 - prog(f, T(W.wishEnd), T(W.wishEnd) + 8)} style={{ filter: "drop-shadow(0 0 16px #fff)" }} />
      </svg>
      <div style={{ position: "absolute", left: 200, right: 200, top: 1180, padding: "30px 40px", borderRadius: 34, ...glass(0.2), opacity: list, transform: `translateY(${(1 - list) * 40}px)` }}>
        <div style={{ ...capsStyle, fontSize: 20, marginBottom: 18 }}>real manifestation</div>
        {["intention", "belief", "action"].map((l, i) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: i ? 14 : 0, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.muted }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, border: `3px solid ${C.muted}` }} />
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- C : les 3 étapes, puis « most people skip the last one » ---------- */
const STEPS = [
  { n: 1, t: "A clear intention", s: "what you want, precisely", at: W.clear, icon: "intention", y: 760 },
  { n: 2, t: "A new belief", s: "what you choose to believe", at: W.new, icon: "spirituality", y: 1010 },
  { n: 3, t: "One aligned action", s: "every day", at: W.one, icon: "day", y: 1260 },
];
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const skip = prog(f, T(W.skip) - 2, T(W.skip) + 14, eInOut);
  const days = Math.min(7, Math.max(0, Math.floor((f - T(W.every)) / 2) + 1));
  return (
    <AbsoluteFill style={sceneFx(f, "c")}>
      <Words
        f={f}
        top={250}
        size={84}
        lineGap={2}
        exitAt={T(W.most) - 8}
        lines={[
          [{ t: "Real manifestation", at: W.real, kind: "bold" }],
          [{ t: "has", at: W.has, kind: "muted", size: 110 }, { t: "3 steps.", at: W.three, kind: "serif" }],
        ]}
      />
      <Words
        f={f}
        top={250}
        size={84}
        lineGap={2}
        lines={[
          [{ t: "Most people", at: W.most, kind: "bold" }],
          [{ t: "skip the last one.", at: W.skip, kind: "serif" }],
        ]}
      />
      {STEPS.map((s, i) => {
        const q = prog(f, T(s.at) - 2, T(s.at) + 12, eBack);
        const last = i === 2;
        const lit = last ? 1 - skip * 0.75 : 1;
        return (
          <div key={s.n} style={{ position: "absolute", left: 110, right: 110, top: s.y, height: 200, padding: "0 40px", borderRadius: 36, ...glass(0.25 + 0.6 * lit * Math.min(1, q)), display: "flex", alignItems: "center", gap: 34, opacity: Math.min(1, q * 1.5) * (last ? 1 - 0.45 * skip : 1), transform: `translateX(${last ? skip * 90 : 0}px) scale(${lerp(0.9, 1, Math.min(1, q))}) rotate(${last ? skip * 3 : 0}deg)` }}>
            <div style={{ width: 104, height: 104, borderRadius: "50%", background: pillBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 52, color: "#fff", boxShadow: `0 0 ${30 * lit}px rgba(139,92,246,0.8)`, flexShrink: 0 }}>{s.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.white, letterSpacing: -1 }}>{s.t}</div>
              {last ? (
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  {"MTWTFSS".split("").map((d, k) => (
                    <div key={k} style={{ width: 44, height: 44, borderRadius: 12, ...glass(k < days ? 0.8 : 0.1), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 18, color: k < days ? "#fff" : C.muted }}>{d}</div>
                  ))}
                </div>
              ) : (
                <div style={{ ...capsStyle, fontSize: 19, marginTop: 10 }}>{s.s}</div>
              )}
            </div>
            <div style={{ opacity: 0.85 }}>
              <Icon name={s.icon} size={70} color={C.lilacSoft} glow={lit} />
            </div>
            {last && skip > 0 ? (
              <div style={{ position: "absolute", right: -20, top: -34, padding: "10px 24px", borderRadius: 14, fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "0.14em", color: "#ffd3de", background: "rgba(20,10,40,0.92)", border: "3px solid rgba(255,157,181,0.7)", transform: `rotate(-6deg) scale(${lerp(2, 1, skip)})`, opacity: Math.min(1, skip * 1.5) }}>SKIPPED</div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- E : « Signs builds all three for you, in under 5 minutes a day. » ---------- */
const PHONES = [
  { src: "focus", label: "intention", at: W.builds, x: 70, rot: -5 },
  { src: "home", label: "belief", at: W.all, x: 400, rot: 0 },
  { src: "repeat", label: "action", at: W.three2, x: 730, rot: 5 },
];
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const lq = prog(f, T(W.signs) - 4, T(W.signs) + 12, eBack);
  const timer = prog(f, T(W.under) - 2, T(W.under) + 10, eBack);
  const ring = prog(f, T(W.five), T(W.dEnd), eInOut);
  return (
    <AbsoluteFill style={sceneFx(f, "e")}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
        <Logo size={120} q={lq} f={f} />
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 104, color: C.white, letterSpacing: -2, opacity: Math.min(1, lq * 1.4) }}>Signs</span>
      </div>
      <Words
        f={f}
        top={330}
        size={80}
        lineGap={2}
        lines={[[{ t: "builds all three", at: W.builds, kind: "bold" }, { t: "for you,", at: W.forYou, kind: "serif", size: 62 }]]}
      />
      {PHONES.map((p, i) => {
        const q = prog(f, T(p.at) - 2, T(p.at) + 14, eBack);
        return (
          <div key={p.src} style={{ position: "absolute", left: p.x, top: 560 + (i === 1 ? -20 : 30) }}>
            <Shot src={p.src} w={280} q={q} rot={p.rot} />
            <div style={{ marginTop: 26, display: "flex", justifyContent: "center", opacity: prog(f, T(p.at) + 4, T(p.at) + 12) }}>
              <span style={{ padding: "10px 24px", borderRadius: 999, background: pillBg, fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#fff", boxShadow: "0 0 24px rgba(139,92,246,0.7)" }}>✓ {p.label}</span>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1560, display: "flex", justifyContent: "center", opacity: Math.min(1, timer * 1.4), transform: `scale(${lerp(0.8, 1, Math.min(1, timer))})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "22px 44px 22px 26px", borderRadius: 999, ...glass(0.6) }}>
          <svg width={86} height={86} viewBox="0 0 86 86">
            <circle cx={43} cy={43} r={36} stroke="rgba(255,255,255,0.15)" strokeWidth={8} fill="none" />
            <circle cx={43} cy={43} r={36} stroke={C.lilacSoft} strokeWidth={8} fill="none" pathLength={1} strokeDasharray={`${ring * 0.85} 1`} strokeLinecap="round" transform="rotate(-90 43 43)" />
          </svg>
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, color: C.muted }}>
            under <span style={{ ...serifGradient, fontSize: 84 }}>5 minutes</span> a day
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.manifestation, src: "riser", vol: 0.12 },
  { at: W.working, src: "freeze", vol: 0.22 },
  { at: W.universe, src: "shimmer", vol: 0.18 },
  { at: 5.1, src: "whoosh", vol: 0.3 },
  { at: W.wishing, src: "whoosh_soft", vol: 0.2 },
  { at: W.wishing + 0.1, src: "chime5", vol: 0.16 },
  { at: W.manifesting, src: "tick_low", vol: 0.26 },
  { at: 8.15, src: "whoosh", vol: 0.3 },
  { at: W.three, src: "chime0", vol: 0.18 },
  { at: W.clear, src: "chime1", vol: 0.2 },
  { at: W.new, src: "chime2", vol: 0.2 },
  { at: W.one, src: "chime3", vol: 0.2 },
  ...Array.from({ length: 7 }, (_, i) => ({ at: W.every + i * 0.067, src: "tick", vol: 0.08 })),
  { at: W.skip, src: "sub", vol: 0.3 },
  { at: W.skip + 0.05, src: "tick_low", vol: 0.3 },
  { at: 17.3, src: "whoosh", vol: 0.3 },
  { at: W.signs, src: "shimmer", vol: 0.3 },
  { at: W.builds, src: "chime1", vol: 0.18 },
  { at: W.all, src: "chime2", vol: 0.18 },
  { at: W.three2, src: "chime3", vol: 0.18 },
  { at: W.five, src: "chime5", vol: 0.2 },
  { at: W.manifest - 0.05, src: "impact", vol: 0.42 },
  { at: W.with, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.35 },
  { at: 24.0, src: "whoosh", vol: 0.3 },
  { at: W.signs2, src: "chime5", vol: 0.3 },
  { at: W.signs2, src: "shimmer", vol: 0.3 },
  { at: W.ios, src: "chime2", vol: 0.2 },
  { at: W.android, src: "chime3", vol: 0.2 },
  { at: W.end, src: "chime6", vol: 0.2 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} loop volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice-promo.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

export { SERIF };
