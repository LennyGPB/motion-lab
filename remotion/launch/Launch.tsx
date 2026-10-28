import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { NovaPhone, PH, PW } from "../nova/parts";
import { useLay } from "../nova/layout";
import { StoreBtn } from "../stride/parts";
import { FONT, loadViewzFonts } from "../viewz/theme";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { CONFIG } from "./config";
import { MockScreen } from "./screens";
import { BANNER, BEAT, beatPulse, DROP, DURATION_FRAMES, END, FEAT_LEN, FEAT_START, TRIO } from "./timing";

loadViewzFonts();
const C = CONFIG;
const GRAD = `linear-gradient(135deg, ${C.accent}, ${C.accent2})`;

/** Typo massive : italique, ultra-grasse, condensée. */
const mega = (size: number, color = "#fff"): React.CSSProperties => ({
  fontFamily: FONT,
  fontStyle: "italic",
  fontWeight: 900,
  fontStretch: "68%",
  fontSize: size,
  lineHeight: 0.86,
  letterSpacing: size * -0.01,
  textTransform: "uppercase",
  color,
  whiteSpace: "nowrap",
});
/** Taille de police pour qu'un texte tienne dans une largeur donnée. */
const fit = (text: string, maxW: number, max: number) => Math.min(max, maxW / (Math.max(1, text.length) * 0.5));

/** Mot qui claque avec séparation RGB. */
const Slam: React.FC<{ f: number; at: number; children: string; style: React.CSSProperties; from?: number }> = ({ f, at, children, style, from = 1.7 }) => {
  if (f < at) return null;
  const p = prog(f, at, at + 6, eExpo);
  const split = 18 * Math.exp(-(f - at) / 4);
  return (
    <div style={{ position: "relative", display: "inline-block", transform: `scale(${lerp(from, 1, p)})`, opacity: Math.min(1, p * 3), filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined }}>
      {split > 0.5 ? (
        <>
          <span style={{ ...style, position: "absolute", left: -split, top: 0, color: C.accent2, opacity: 0.7, mixBlendMode: "screen", WebkitTextStroke: undefined }}>{children}</span>
          <span style={{ ...style, position: "absolute", left: split, top: 0, color: C.accent, opacity: 0.7, mixBlendMode: "screen", WebkitTextStroke: undefined }}>{children}</span>
        </>
      ) : null}
      <span style={{ ...style, position: "relative" }}>{children}</span>
    </div>
  );
};

/** Icône de l'app. */
const AppIcon: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${size * 0.5}px ${C.accent}88, inset 0 2px 0 rgba(255,255,255,0.35)` }}>
    <span style={{ ...mega(size * 0.72), lineHeight: 1, transform: "translateY(4%)" }}>{C.iconGlyph}</span>
  </div>
);

/** Template "Lancement" — même composant pour 9:16 et 16:9. */
export const Launch: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLay();
  const b = beatPulse(f);
  // flash + secousse sur les temps forts
  const hits = [0, BEAT, 2 * BEAT, DROP, ...C.features.map((_, i) => FEAT_START + i * FEAT_LEN), TRIO, BANNER, END];
  let flash = 0;
  let shake = 0;
  for (const h of hits) {
    if (f < h) continue;
    const d = f - h;
    const big = h === DROP || h === END;
    flash = Math.max(flash, (big ? 0.95 : h < DROP ? 0.35 : 0.5) * Math.exp(-d / (big ? 4 : 2.5)));
    shake += (big ? 30 : 18) * Math.exp(-d / 3);
  }
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shake * Math.sin(f * 2.7)}px, ${shake * Math.cos(f * 2.1)}px) scale(${1 + b * 0.012})` }}>
        <Glow f={f} />
        {f < DROP + 2 ? <Countdown f={f} /> : null}
        {f >= DROP - 1 && f < FEAT_START + 2 ? <LogoReveal f={f} /> : null}
        {C.features.map((ft, i) => {
          const from = FEAT_START + i * FEAT_LEN;
          return f >= from - 1 && f < from + FEAT_LEN + 2 ? <FeatureBurst key={i} f={f} from={from} i={i} /> : null;
        })}
        {f >= TRIO - 1 && f < BANNER + 2 ? <Trio f={f} /> : null}
        {f >= BANNER - 1 && f < END + 2 ? <Banner f={f} /> : null}
        {f >= END - 1 ? <EndCard f={f} /> : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
        <svg width={L.W} height={L.H}>
          <filter id="lcgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#lcgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

const Glow: React.FC<{ f: number }> = ({ f }) => {
  const b = beatPulse(f);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 30%, ${C.accent}${f >= DROP ? "40" : "18"}, transparent 50%), radial-gradient(circle at 75% 75%, ${C.accent2}${f >= DROP ? "33" : "12"}, transparent 50%)`, opacity: 0.8 + 0.2 * b }} />
    </AbsoluteFill>
  );
};

/* ---------- 3-2-1 ---------- */
const Countdown: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const k = Math.min(3, Math.floor(f / BEAT));
  const local = f - k * BEAT;
  const size = L.portrait ? 1150 : 900;
  if (k === 3) {
    // suspension : l'anneau se referme en un point, puis flash
    const q = prog(local, 0, BEAT, eIn);
    return (
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: lerp(500, 8, q), height: lerp(500, 8, q), borderRadius: "50%", border: `${lerp(10, 4, q)}px solid #fff`, boxShadow: `0 0 ${60 * q}px ${C.accent}` }} />
      </AbsoluteFill>
    );
  }
  const n = String(3 - k);
  const ring = 1 - local / BEAT;
  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* échos */}
      <div style={{ position: "absolute", ...mega(size * 1.6), color: "transparent", WebkitTextStroke: `3px ${k % 2 ? C.accent2 : C.accent}`, opacity: 0.35, transform: `scale(${1 + local * 0.02})` }}>{n}</div>
      <svg width={760} height={760} style={{ position: "absolute" }} viewBox="0 0 760 760">
        <circle cx={380} cy={380} r={350} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={14} />
        <circle cx={380} cy={380} r={350} fill="none" stroke={k % 2 ? C.accent2 : C.accent} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${ring} 1`} transform="rotate(-90 380 380)" style={{ filter: `drop-shadow(0 0 16px ${C.accent})` }} />
      </svg>
      <Slam f={f} at={k * BEAT} style={mega(size * 0.62)} from={2.2}>
        {n}
      </Slam>
    </AbsoluteFill>
  );
};

/* ---------- Logo ---------- */
const LogoReveal: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const icon = prog(f, DROP, DROP + 12, eBack);
  const word = prog(f, DROP + 4, DROP + 10, eExpo);
  const exit = prog(f, FEAT_START - 6, FEAT_START, eIn);
  const nameSize = fit(C.name, L.portrait ? 940 : 1400, L.portrait ? 300 : 280);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 + exit * 0.3})`, filter: exit > 0 ? `blur(${exit * 14}px)` : undefined }}>
      {/* rayons */}
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 1.2}deg at 50% ${L.portrait ? 38 : 34}%, ${C.accent}22 0deg 6deg, transparent 6deg 18deg)`, opacity: prog(f, DROP, DROP + 10) }} />
      {/* éclats */}
      {Array.from({ length: 60 }, (_, i) => {
        const t = f - DROP;
        if (t < 0 || t > 40) return null;
        const a = hash(i) * Math.PI * 2;
        const v = 14 + hash(i + 1) * 30;
        return <div key={i} style={{ position: "absolute", left: L.W / 2 + Math.cos(a) * v * t, top: L.H * (L.portrait ? 0.38 : 0.34) + Math.sin(a) * v * t, width: 10, height: 10, borderRadius: i % 2 ? 2 : "50%", background: i % 3 ? C.accent2 : "#fff", opacity: 1 - t / 40, transform: `rotate(${i * 30 + t * 10}deg)` }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: L.H * (L.portrait ? 0.38 : 0.34) - 130, display: "flex", justifyContent: "center", transform: `scale(${icon}) rotate(${(1 - icon) * -25}deg)` }}>
        <AppIcon size={260} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: L.H * (L.portrait ? 0.38 : 0.34) + 190, display: "flex", justifyContent: "center", opacity: word, transform: `scale(${lerp(1.6, 1, word)})`, filter: word < 1 ? `blur(${(1 - word) * 14}px)` : undefined }}>
        <span style={mega(nameSize)}>{C.name}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: L.H * (L.portrait ? 0.38 : 0.34) + 190 + nameSize * 0.95 + 20, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: L.portrait ? 46 : 40, color: "rgba(255,255,255,0.85)", opacity: prog(f, DROP + 14, DROP + 24), transform: `translateY(${(1 - prog(f, DROP + 14, DROP + 24, eOut)) * 20}px)` }}>
        {C.tagline}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Téléphones en rafale (répétable) ---------- */
const FeatureBurst: React.FC<{ f: number; from: number; i: number }> = ({ f, from, i }) => {
  const L = useLay();
  const ft = C.features[i];
  const side = i % 2 ? -1 : 1;
  const p = prog(f, from, from + 10, eOut);
  const out = prog(f, from + FEAT_LEN - 5, from + FEAT_LEN, eIn);
  const titleSize = fit(ft.title, L.portrait ? 1600 : 2400, L.portrait ? 520 : 600);
  const s = L.portrait ? 0.84 : 0.62;
  const local = f - from;
  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.6 }}>
      {/* titre massif derrière */}
      <div style={{ position: "absolute", top: L.H / 2 - titleSize * 0.55, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateX(${side * (60 - local * 4)}px) rotate(-6deg)` }}>
        <Slam f={f} at={from} style={{ ...mega(titleSize), color: "transparent", WebkitTextStroke: `4px ${i % 2 ? C.accent2 : C.accent}` }}>
          {ft.title}
        </Slam>
      </div>
      <div style={{ position: "absolute", top: L.H / 2 - titleSize * 0.55 + titleSize * 0.9, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateX(${-side * (60 - local * 4)}px) rotate(-6deg)`, opacity: 0.9 }}>
        <Slam f={f} at={from + 3} style={mega(titleSize * 0.55, "#fff")}>
          {ft.title}
        </Slam>
      </div>
      {/* téléphone */}
      <AbsoluteFill style={{ perspective: 2000 }}>
        <div
          style={{
            position: "absolute",
            left: L.W / 2 - PW / 2 + side * (1 - p) * L.W * 0.8 - side * out * L.W * 0.7,
            top: L.H / 2 - PH / 2,
            transform: `scale(${s}) rotateY(${side * (lerp(65, 14, p) + out * 40)}deg) rotateZ(${side * lerp(10, 3, p)}deg)`,
            filter: p < 1 || out > 0 ? `blur(${(1 - p) * 12 + out * 14}px)` : undefined,
          }}
        >
          <NovaPhone f={f} screens={[{ from, node: <MockScreen kind={ft.screen} f={f} from={from + 4} /> }]} glow={beatPulse(f) * 0.6} />
        </div>
      </AbsoluteFill>
      {/* index + sous-titre */}
      <div style={{ position: "absolute", top: L.portrait ? 150 : 90, left: L.portrait ? 80 : 120, ...mega(80), opacity: p }}>
        {String(i + 1).padStart(2, "0")}
        <span style={{ color: "rgba(255,255,255,0.4)" }}>/{String(C.features.length).padStart(2, "0")}</span>
      </div>
      <div style={{ position: "absolute", bottom: L.portrait ? 150 : 90, left: L.portrait ? 0 : 120, right: L.portrait ? 0 : undefined, textAlign: L.portrait ? "center" : "left", fontFamily: FONT, fontWeight: 800, fontSize: L.portrait ? 54 : 46, color: "#fff", opacity: prog(f, from + 8, from + 14), transform: `translateY(${(1 - prog(f, from + 8, from + 14, eOut)) * 30}px)` }}>
        {ft.sub}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Les 3 téléphones ensemble ---------- */
const Trio: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const out = prog(f, BANNER - 5, BANNER, eIn);
  const s = L.portrait ? 0.58 : 0.5;
  const gap = L.portrait ? 300 : 360;
  const top = L.portrait ? L.H * 0.6 : L.H * 0.66;
  const lineSize = L.portrait ? 200 : 140;
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 + out * 0.2})` }}>
      <div style={{ position: "absolute", top: L.portrait ? 170 : 50, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <Slam f={f} at={TRIO} style={mega(lineSize)}>
          {C.trioLine[0]}
        </Slam>
        <Slam f={f} at={TRIO + BEAT} style={{ ...mega(lineSize), background: GRAD, WebkitBackgroundClip: "text", color: "transparent", paddingRight: 20 }}>
          {C.trioLine[1]}
        </Slam>
      </div>
      <AbsoluteFill style={{ perspective: 2200 }}>
        {[-1, 1, 0].map((pos) => {
          const idx = pos + 1;
          const ft = C.features[idx % C.features.length];
          const d = Math.abs(pos) * 3;
          const p = prog(f, TRIO + d, TRIO + d + 12, eBack);
          return (
            <div
              key={pos}
              style={{
                position: "absolute",
                left: L.W / 2 - PW / 2 + pos * gap * p,
                top: top - PH / 2 + (1 - p) * 500 + Math.abs(pos) * 40,
                transform: `scale(${s * (pos === 0 ? 1.08 : 0.96)}) rotateY(${-pos * 22}deg) rotateZ(${pos * 4}deg)`,
                opacity: Math.min(1, p * 2),
                zIndex: pos === 0 ? 3 : 1,
              }}
            >
              <NovaPhone f={f} screens={[{ from: TRIO, node: <MockScreen kind={ft.screen} f={f} from={TRIO} /> }]} glow={beatPulse(f) * 0.5} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Bandeau date de sortie ---------- */
const Tape: React.FC<{ f: number; text: string; rot: number; y: number; dir: number; light: boolean; W: number }> = ({ f, text, rot, y, dir, light, W }) => {
  const unit = `${text}  ★  `;
  const rep = unit.repeat(8);
  return (
    <div style={{ position: "absolute", left: -W * 0.3, width: W * 1.6, top: y, height: 130, background: light ? "#fff" : "#0a0a0d", transform: `rotate(${rot}deg)`, overflow: "hidden", display: "flex", alignItems: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
      <span style={{ ...mega(92, light ? "#0a0a0d" : "#fff"), transform: `translateX(${dir * ((f * 9) % 1400) - 1400}px)` }}>{rep}</span>
    </div>
  );
};
const Banner: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const st = BANNER;
  const tapes = prog(f, st, st + 10, eOut);
  const out = prog(f, END - 5, END, eIn);
  const dateSize = fit(C.releaseShort, L.portrait ? 980 : 1300, L.portrait ? 560 : 440);
  return (
    <AbsoluteFill style={{ background: GRAD, opacity: 1 - out }}>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.08) 0 30px, transparent 30px 60px)", transform: `translateX(${(f * 3) % 85}px)` }} />
      <div style={{ opacity: tapes, transform: `translateX(${(1 - tapes) * -400}px)` }}>
        <Tape f={f} text={`${C.releaseLabel} ${C.releaseDate}`} rot={L.portrait ? -9 : -4} y={L.H * (L.portrait ? 0.16 : 0.03)} dir={1} light W={L.W} />
      </div>
      <div style={{ opacity: tapes, transform: `translateX(${(1 - tapes) * 400}px)` }}>
        <Tape f={f} text={`${C.name}  ·  ${C.releaseDate}`} rot={L.portrait ? 7 : 3} y={L.H * (L.portrait ? 0.76 : 0.84)} dir={-1} light={false} W={L.W} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: L.H / 2 - dateSize * 0.62, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Slam f={f} at={st + 2} style={{ ...mega(L.portrait ? 90 : 80), fontStretch: "90%", letterSpacing: "0.1em" }}>
          {C.releaseLabel}
        </Slam>
        <Slam f={f} at={st + BEAT} style={{ ...mega(dateSize), textShadow: "0 20px 60px rgba(0,0,0,0.35)" }} from={2.4}>
          {C.releaseShort}
        </Slam>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Fin ---------- */
const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const icon = prog(f, END + 1, END + 13, eBack);
  const word = prog(f, END + 5, END + 11, eExpo);
  const nameSize = fit(C.name, L.portrait ? 900 : 1100, L.portrait ? 260 : 220);
  const cy = L.portrait ? L.H * 0.3 : L.H * 0.22;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${(cy / L.H) * 100 + 8}%, ${C.accent}55, transparent 45%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: cy - 110, display: "flex", justifyContent: "center", transform: `scale(${icon}) rotate(${(1 - icon) * 20}deg)` }}>
        <AppIcon size={220} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 150, display: "flex", justifyContent: "center", opacity: word, transform: `scale(${lerp(1.5, 1, word)})` }}>
        <span style={mega(nameSize)}>{C.name}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 160 + nameSize * 0.9 + 10, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: L.portrait ? 44 : 38, color: "rgba(255,255,255,0.85)", opacity: prog(f, END + 12, END + 22) }}>
        {C.tagline}
      </div>
      {(() => {
        const q = prog(f, END + 18, END + 30, eBack);
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: cy + 160 + nameSize * 0.9 + (L.portrait ? 110 : 90), display: "flex", justifyContent: "center", opacity: Math.min(1, q * 2), transform: `scale(${lerp(0.8, 1, q)})` }}>
            <div style={{ padding: "22px 48px", borderRadius: 999, background: GRAD, fontFamily: FONT, fontWeight: 800, fontSize: L.portrait ? 40 : 34, color: "#fff", boxShadow: `0 0 50px ${C.accent}88` }}>{C.cta}</div>
          </div>
        );
      })()}
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 160 + nameSize * 0.9 + (L.portrait ? 250 : 210), display: "flex", justifyContent: "center", gap: 36 }}>
        {C.stores.map((k, i) => {
          const q = prog(f, END + 26 + i * 5, END + 38 + i * 5, eOut);
          return (
            <div key={k} style={{ opacity: q, transform: `translateY(${(1 - q) * 40}px) scale(${L.portrait ? 1 : 0.85})` }}>
              <StoreBtn kind={k} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const sfx = (n: string) => staticFile(`launch/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: 0, src: "count3", vol: 0.5 },
  { at: BEAT, src: "count2", vol: 0.5 },
  { at: 2 * BEAT, src: "count1", vol: 0.55 },
  { at: DROP, src: "drop", vol: 0.55 },
  { at: DROP, src: "glitch", vol: 0.2 },
  ...C.features.map((_, i) => ({ at: FEAT_START + i * FEAT_LEN - 4, src: "whoosh", vol: 0.3 })),
  ...C.features.map((_, i) => ({ at: FEAT_START + i * FEAT_LEN, src: "swipe", vol: 0.22 })),
  { at: TRIO - 3, src: "whoosh", vol: 0.3 },
  { at: BANNER, src: "tape", vol: 0.35 },
  { at: BANNER + BEAT, src: "glitch", vol: 0.2 },
  { at: END + 2, src: "shimmer", vol: 0.3 },
  ...C.stores.map((_, i) => ({ at: END + 26 + i * 5, src: "pop", vol: 0.2 })),
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={sfx("music")} volume={0.5} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} layout="none" name={c.src}>
        <Html5Audio src={sfx(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

export { clamp, DURATION_FRAMES, eInOut, interpolate };
