import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { AppIcon, Burst, MapView, PhoneFrame, Ring, StatScene, StoreBtn, Wordmark } from "./parts";
import { RunScreen, SummaryScreen } from "./screens";
import { FONT, mega, S } from "./theme";
import { B, beatPulse, SC } from "./timing";

loadViewzFonts();

type Key = keyof typeof SC;
const on = (f: number, k: Key, pre = 1, post = 3) => f >= B(SC[k][0]) - pre && f < B(SC[k][1]) + post;

/** Mot géant qui claque (scale + flou) à la frame `at`. */
const Slam: React.FC<{ f: number; at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ f, at, children, style, from = 1.6 }) => {
  const p = prog(f, at, at + 5, eExpo);
  if (f < at) return null;
  return (
    <div style={{ transform: `scale(${lerp(from, 1, p)})`, opacity: Math.min(1, p * 3), filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined, ...style }}>{children}</div>
  );
};

/** Transition "slice" : bandes diagonales qui balaient l'écran autour d'une coupe. */
const Slice: React.FC<{ f: number; cut: number }> = ({ f, cut }) => {
  const t = (f - cut + 5) / 10;
  if (t <= 0 || t >= 1) return null;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {[0, 1, 2, 3].map((i) => {
        const x = lerp(-1700, 1900, eInOut(Math.min(1, Math.max(0, t * 1.25 - i * 0.08))));
        return <div key={i} style={{ position: "absolute", top: -200, bottom: -200, left: x + i * 160, width: 460 - i * 60, background: i % 2 ? "#0b0c0e" : S.volt, transform: "skewX(-18deg)" }} />;
      })}
    </AbsoluteFill>
  );
};

/** Pub Stride (1080x1920, 30 fps, sans voix). */
export const Stride: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = beatPulse(f);
  const flashCuts = [B(8), B(16), B(26)];
  const flash = Math.max(0, ...flashCuts.map((c) => (f >= c ? 0.7 * Math.exp(-(f - c) / 2) : 0)));
  return (
    <AbsoluteFill style={{ backgroundColor: S.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + pulse * 0.012})` }}>
        {on(f, "intro") ? <Intro f={f} /> : null}
        {on(f, "gps") ? <Gps f={f} /> : null}
        {on(f, "rings") ? <Rings f={f} /> : null}
        {on(f, "phone1") ? <Phone1 f={f} /> : null}
        {on(f, "stats") ? <Stats f={f} /> : null}
        {on(f, "record") ? <Record f={f} /> : null}
        {on(f, "phone2") ? <Phone2 f={f} /> : null}
        {f >= B(SC.outro[0]) - 1 ? <Outro f={f} /> : null}
      </AbsoluteFill>
      {[B(4), B(12), B(22), B(30)].map((c) => (
        <Slice key={c} f={f} cut={c} />
      ))}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
        <svg width="1080" height="1920">
          <filter id="stgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#stgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

/* -------- Intro : CHAQUE / FOULÉE / COMPTE. → GO. -------- */
const Intro: React.FC<{ f: number }> = ({ f }) => {
  const go = f >= B(3);
  if (go) {
    const sh = 18 * Math.exp(-(f - B(3)) / 3);
    return (
      <AbsoluteFill style={{ background: S.volt, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${sh * Math.sin(f * 3)}px, ${sh * Math.cos(f * 2)}px)` }}>
        <Slam f={f} at={B(3)} from={2.2}>
          <span style={{ ...mega(640, "#0b0c0e") }}>GO.</span>
        </Slam>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} style={{ position: "absolute", top: 160 + i * 230, left: ((hash(i) * 1200 - f * (25 + hash(i + 2) * 30)) % 1500) - 200, width: 240 + hash(i + 1) * 400, height: 6, background: i % 3 === 0 ? S.volt : "rgba(255,255,255,0.08)", transform: "skewX(-20deg)" }} />
      ))}
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <Slam f={f} at={B(0)}>
          <span style={mega(290)}>CHAQUE</span>
        </Slam>
        <Slam f={f} at={B(1)}>
          <span style={mega(370, S.volt)}>FOULÉE</span>
        </Slam>
        <Slam f={f} at={B(2)}>
          <span style={{ ...mega(290), color: "transparent", WebkitTextStroke: "5px #fff" }}>COMPTE.</span>
        </Slam>
      </div>
    </AbsoluteFill>
  );
};

/* -------- GPS -------- */
const Gps: React.FC<{ f: number }> = ({ f }) => {
  const st = B(SC.gps[0]);
  const p = prog(f, st + 2, B(SC.gps[1]) - 4, eInOut);
  const zoom = lerp(1.0, 1.15, prog(f, st, B(SC.gps[1]), eInOut));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1500 }}>
        <div style={{ position: "absolute", left: 40, top: 700, transform: `rotateX(40deg) rotateZ(-10deg) scale(${zoom})`, transformOrigin: "50% 40%" }}>
          <MapView p={p} k={1} f={f} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #07080a 0%, rgba(7,8,10,0.9) 28%, rgba(7,8,10,0) 50%)" }} />
      <div style={{ position: "absolute", top: 180, left: 70 }}>
        <Slam f={f} at={st + 1}>
          <span style={mega(250)}>TRACE</span>
        </Slam>
        <Slam f={f} at={B(SC.gps[0] + 1)}>
          <span style={mega(250, S.volt)}>TA ROUTE.</span>
        </Slam>
      </div>
      <div style={{ position: "absolute", top: 1690, left: 70, display: "flex", alignItems: "center", gap: 18, padding: "18px 30px", borderRadius: 999, background: "rgba(0,0,0,0.75)", border: `2px solid ${S.volt}`, opacity: prog(f, st + 6, st + 12) }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: S.volt }} />
        <span style={{ ...mega(64, S.white), fontVariantNumeric: "tabular-nums" }}>{(p * 10).toFixed(1).replace(".", ",")} KM</span>
      </div>
    </AbsoluteFill>
  );
};

/* -------- Anneaux -------- */
const Rings: React.FC<{ f: number }> = ({ f }) => {
  const st = B(SC.rings[0]);
  const r1 = prog(f, st + 4, B(10), eInOut);
  const r2 = prog(f, B(8.5) + 4, B(10.5), eInOut);
  const r3 = prog(f, B(9) + 4, B(11), eInOut);
  const bump = (start: number) => 1 + 0.05 * Math.exp(-Math.max(0, f - start) / 4) * (f >= start ? 1 : 0);
  const all = bump(B(11));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 170, left: 70 }}>
        <Slam f={f} at={st + 1}>
          <span style={mega(220)}>ATTEINS</span>
        </Slam>
        <Slam f={f} at={B(SC.rings[0] + 1)}>
          <span style={mega(162, S.volt)}>TES OBJECTIFS.</span>
        </Slam>
      </div>
      <div style={{ position: "absolute", left: 540, top: 1150, transform: `scale(${prog(f, st, st + 8, eBack) * all})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${bump(B(10))})` }}>
          <Ring r={330} w={66} p={r1} color={S.volt} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${bump(B(10.5))})` }}>
          <Ring r={245} w={66} p={r2} color={S.orange} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${bump(B(11))})` }}>
          <Ring r={160} w={66} p={r3} color={S.sky} />
        </div>
        <div style={{ position: "absolute", left: -150, top: -70, width: 300, textAlign: "center" }}>
          <span style={{ ...mega(130), fontVariantNumeric: "tabular-nums" }}>{Math.round(r1 * 100)}%</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1590, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        {[
          { c: S.volt, t: "Distance", p: r1 },
          { c: S.orange, t: "Durée", p: r2 },
          { c: S.sky, t: "Séances", p: r3 },
        ].map((x) => (
          <div key={x.t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 999, background: "rgba(255,255,255,0.05)", border: `2px solid ${x.p >= 1 ? x.c : "rgba(255,255,255,0.12)"}`, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: "#fff" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: x.c }} />
            {x.t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* -------- Téléphone 1 : course en direct -------- */
const Phone1: React.FC<{ f: number }> = ({ f }) => {
  const st = B(SC.phone1[0]);
  const p = prog(f, st, st + 12, eOut);
  const out = prog(f, B(SC.phone1[1]) - 4, B(SC.phone1[1]) + 2, eIn);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 520, left: -40 - f * 3 + st * 3, ...mega(760), color: "transparent", WebkitTextStroke: "3px rgba(212,255,58,0.35)" }}>LIVE·LIVE</div>
      <div style={{ position: "absolute", top: 130, left: 70 }}>
        <Slam f={f} at={st + 2}>
          <span style={mega(140)}>SUIS CHAQUE</span>
        </Slam>
        <Slam f={f} at={B(SC.phone1[0] + 1)}>
          <span style={mega(140, S.volt)}>KILOMÈTRE.</span>
        </Slam>
      </div>
      <AbsoluteFill style={{ perspective: 2000 }}>
        <div
          style={{
            position: "absolute",
            left: lerp(1300, 540, p) - 280 + out * -900,
            top: 1060 - 590,
            transform: `rotateY(${lerp(55, -12, p) + 4 * Math.sin(f / 12)}deg) rotateX(6deg) rotateZ(${lerp(8, 2, p)}deg) scale(0.9)`,
            filter: p < 1 || out > 0 ? `blur(${(1 - p) * 10 + out * 12}px)` : undefined,
          }}
        >
          <PhoneFrame glow={beatPulse(f) * 0.5}>
            <RunScreen f={f} from={st} />
          </PhoneFrame>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* -------- Stats (scène répétable ×3) -------- */
const pace = (v: number) => `${Math.floor(v / 60)}'${String(Math.floor(v % 60)).padStart(2, "0")}"`;
const STATS = [
  { at: 16, value: 10, format: (v: number) => v.toFixed(1).replace(".", ","), unit: "KM", label: "DISTANCE" },
  { at: 18, value: 292, format: pace, unit: "/KM", label: "ALLURE MOYENNE", invert: true },
  { at: 20, value: 642, format: (v: number) => String(Math.round(v)), unit: "KCAL", label: "ÉNERGIE", accent: S.orange },
];
const Stats: React.FC<{ f: number }> = ({ f }) => {
  const i = STATS.reduce((acc, s, k) => (f >= B(s.at) ? k : acc), 0);
  const s = STATS[i];
  return <StatScene f={f} from={B(s.at)} value={s.value} format={s.format} unit={s.unit} label={s.label} invert={s.invert} accent={s.accent} />;
};

/* -------- Record -------- */
const Record: React.FC<{ f: number }> = ({ f }) => {
  const st = B(SC.record[0]);
  const pop = prog(f, st + 2, st + 14, eBack);
  const shine = prog(f, B(23), B(24), eInOut);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 0.8}deg at 50% 54%, rgba(212,255,58,0.08) 0deg 8deg, transparent 8deg 20deg)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 54%, rgba(212,255,58,0.18), transparent 45%)" }} />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Slam f={f} at={st}>
          <span style={mega(170)}>NOUVEAU</span>
        </Slam>
        <Slam f={f} at={st + 4}>
          <span style={mega(250, S.volt)}>RECORD !</span>
        </Slam>
      </div>
      {/* médaille */}
      <div style={{ position: "absolute", left: 540 - 230, top: 1040 - 230, width: 460, height: 460, transform: `scale(${pop}) rotate(${(1 - pop) * -40}deg)` }}>
        <div style={{ position: "absolute", left: 120, top: 360, width: 90, height: 260, background: S.orange, transform: "skewX(12deg)", transformOrigin: "top" }} />
        <div style={{ position: "absolute", left: 250, top: 360, width: 90, height: 260, background: S.volt, transform: "skewX(-12deg)", transformOrigin: "top" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from ${f * 2}deg, ${S.volt}, ${S.orange}, ${S.volt}, #fff, ${S.volt})`, boxShadow: "0 0 80px rgba(212,255,58,0.55)" }} />
        <div style={{ position: "absolute", inset: 34, borderRadius: "50%", background: "#0b0c0e", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ ...mega(190, S.volt), lineHeight: 0.8 }}>PR</span>
          <span style={{ ...mega(64), marginTop: 10 }}>5 KM</span>
          <div style={{ position: "absolute", top: -60, bottom: -60, width: 90, left: lerp(-200, 560, shine), background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", transform: "skewX(-20deg)" }} />
        </div>
      </div>
      <Burst t={f - st - 3} cx={540} cy={1040} />
      <div style={{ position: "absolute", top: 1560, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <Slam f={f} at={B(24)}>
          <span style={{ ...mega(130), fontVariantNumeric: "tabular-nums" }}>23:41</span>
        </Slam>
        <div style={{ opacity: prog(f, B(24) + 4, B(24) + 10), padding: "12px 28px", borderRadius: 999, background: S.volt, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#0b0c0e" }}>−38 s sur ton meilleur temps</div>
      </div>
    </AbsoluteFill>
  );
};

/* -------- Téléphone 2 : résumé -------- */
const Phone2: React.FC<{ f: number }> = ({ f }) => {
  const st = B(SC.phone2[0]);
  const p = prog(f, st, st + 12, eOut);
  const out = prog(f, B(SC.phone2[1]) - 3, B(SC.phone2[1]) + 2, eIn);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 640, left: -900 + (f - st) * 4, ...mega(640), color: "transparent", WebkitTextStroke: "3px rgba(255,90,31,0.4)" }}>PROGRESSE·PROGRESSE</div>
      <div style={{ position: "absolute", top: 130, left: 70 }}>
        <Slam f={f} at={st + 2}>
          <span style={mega(140)}>VOIS TA</span>
        </Slam>
        <Slam f={f} at={B(SC.phone2[0] + 1)}>
          <span style={mega(140, S.volt)}>PROGRESSION.</span>
        </Slam>
      </div>
      <AbsoluteFill style={{ perspective: 2000 }}>
        <div
          style={{
            position: "absolute",
            left: lerp(-300, 540, p) - 280,
            top: 1060 - 590 - out * 200,
            opacity: 1 - out,
            transform: `rotateY(${lerp(-55, 12, p) + 4 * Math.sin(f / 12)}deg) rotateX(6deg) rotateZ(${lerp(-8, -2, p)}deg) scale(${0.9 * (1 + out * 0.4)})`,
            filter: p < 1 || out > 0 ? `blur(${(1 - p) * 10 + out * 14}px)` : undefined,
          }}
        >
          <PhoneFrame glow={beatPulse(f) * 0.5}>
            <SummaryScreen f={f} from={st} />
          </PhoneFrame>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* -------- Outro -------- */
const Outro: React.FC<{ f: number }> = ({ f }) => {
  const st = B(SC.outro[0]);
  const icon = prog(f, st + 2, st + 14, eBack);
  const word = prog(f, st + 6, st + 14, eExpo);
  return (
    <AbsoluteFill style={{ background: S.bg }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 38%, rgba(212,255,58,0.16), transparent 50%)" }} />
      <Burst t={(f - st - 4) * 0.8} cx={540} cy={560} />
      <div style={{ position: "absolute", top: 450, left: 540 - 120, transform: `scale(${icon}) rotate(${(1 - icon) * -30}deg)` }}>
        <AppIcon size={240} />
      </div>
      <div style={{ position: "absolute", top: 740, left: 0, right: 0, textAlign: "center", opacity: word, transform: `scale(${lerp(1.5, 1, word)})`, filter: word < 1 ? `blur(${(1 - word) * 12}px)` : undefined }}>
        <Wordmark size={300} />
      </div>
      <div style={{ position: "absolute", top: 1030, left: 0, right: 0, textAlign: "center", opacity: prog(f, st + 14, st + 22), transform: `translateY(${(1 - prog(f, st + 14, st + 22, eOut)) * 20}px)` }}>
        <span style={{ ...mega(70), fontStretch: "80%" }}>
          CHAQUE <span style={{ color: S.volt }}>FOULÉE</span> COMPTE.
        </span>
      </div>
      {[
        { k: "apple" as const, x: 100, d: 20 },
        { k: "google" as const, x: 560, d: 24 },
      ].map((b) => {
        const q = prog(f, st + b.d, st + b.d + 10, eBack);
        return (
          <div key={b.k} style={{ position: "absolute", top: 1230, left: b.x, opacity: Math.min(1, q * 2), transform: `translateY(${(1 - q) * 60}px) scale(${0.9 + 0.1 * q})` }}>
            <StoreBtn kind={b.k} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* -------- Son -------- */
const sfx = (n: string) => staticFile(`stride/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: B(0), src: "thump", vol: 0.35 },
  { at: B(1), src: "thump", vol: 0.35 },
  { at: B(2), src: "thump", vol: 0.35 },
  { at: B(3), src: "thump", vol: 0.5 },
  ...[4, 12, 22, 30].map((b) => ({ at: B(b) - 5, src: "swish", vol: 0.22 })),
  { at: B(10), src: "tick", vol: 0.2 },
  { at: B(10.5), src: "tick", vol: 0.2 },
  { at: B(11), src: "ding", vol: 0.16 },
  ...[16, 18, 20].flatMap((b) => [0, 3, 6, 9, 12, 15].map((d) => ({ at: B(b) + d, src: "tick", vol: 0.1 }))),
  { at: B(22) + 2, src: "ding", vol: 0.25 },
  { at: B(22) + 2, src: "sparkle", vol: 0.22 },
  { at: B(30) + 2, src: "sparkle", vol: 0.18 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={sfx("music")} volume={0.42} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, c.at)} layout="none" name={c.src}>
        <Html5Audio src={sfx(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

export { clamp, interpolate };
