import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFonts as loadSerif, SERIF } from "../signspath/theme";
import { StoreBtn } from "../stride/parts";
import { FONT, loadViewzFonts } from "../viewz/theme";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { CONFIG } from "./config";
import { beatPulse, DURATION_FRAMES, END, REV_LEN, REV_START, STAT_LEN, STATS_START, WALL } from "./timing";

loadViewzFonts();
loadSerif();
const C = CONFIG;
const W = 1080;
const H = 1920;

const mega = (size: number, color = "#fff"): React.CSSProperties => ({
  fontFamily: FONT,
  fontStyle: "italic",
  fontWeight: 900,
  fontStretch: "68%",
  fontSize: size,
  lineHeight: 0.9,
  letterSpacing: size * -0.01,
  textTransform: "uppercase",
  color,
  whiteSpace: "nowrap",
});
const fit = (text: string, maxW: number, max: number) => Math.min(max, maxW / (Math.max(1, text.length) * 0.5));
/** Relief 3D par empilement d'ombres. */
const extrude = (depth: number, color: string) => Array.from({ length: depth }, (_, i) => `${i + 1}px ${i + 1}px 0 ${color}`).join(", ");

const Star: React.FC<{ size: number; fill: number }> = ({ size, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: "visible", transform: `scale(${0.6 + 0.4 * Math.min(1, fill) + 0.25 * Math.sin(Math.min(1, fill) * Math.PI)})` }}>
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill={fill > 0.5 ? C.star : "rgba(255,255,255,0.15)"} style={{ filter: fill > 0.5 ? `drop-shadow(0 0 ${size * 0.25}px ${C.star}aa)` : undefined }} />
  </svg>
);
const Stars: React.FC<{ f: number; at: number; n?: number; size: number; gap?: number }> = ({ f, at, n = 5, size, gap = 8 }) => (
  <div style={{ display: "flex", gap }}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={size} fill={i < n ? prog(f, at + i * 3, at + i * 3 + 6, eBack) : 0} />
    ))}
  </div>
);

/** Template "Social proof" (1080x1920). */
export const Proof: React.FC = () => {
  const f = useCurrentFrame();
  const b = beatPulse(f);
  const cuts = [STATS_START, ...C.stats.map((_, i) => STATS_START + i * STAT_LEN), WALL, END];
  const flash = Math.max(0, ...cuts.map((c) => (f >= c ? (c === END ? 0.7 : 0.3) * Math.exp(-(f - c) / 3) : 0)));
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${C.accent}33, transparent 55%), radial-gradient(circle at 50% 90%, ${C.star}1a, transparent 50%)`, opacity: 0.85 + 0.15 * b }} />
      <AbsoluteFill style={{ transform: `scale(${1 + b * 0.01})` }}>
        {f < STATS_START + 4 ? <Hook f={f} /> : null}
        {C.stats.map((s, i) => {
          const from = STATS_START + i * STAT_LEN;
          return f >= from - 1 && f < from + STAT_LEN + 3 ? <StatScene key={i} f={f} from={from} i={i} /> : null;
        })}
        {f >= REV_START - 2 && f < WALL + 4 ? <Reviews f={f} /> : null}
        {f >= WALL - 2 && f < END + 4 ? <Wall f={f} /> : null}
        {f >= END - 1 ? <EndCard f={f} /> : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ opacity: 0.06, mixBlendMode: "overlay" }}>
        <svg width={W} height={H}>
          <filter id="pfgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#pfgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- Accroche ---------- */
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const out = prog(f, STATS_START - 5, STATS_START + 2, eIn);
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: 1 - out, transform: `scale(${1 + out * 0.3})` }}>
      {C.hook.map((l, i) => {
        const p = prog(f, 4 + i * 12, 10 + i * 12, eExpo);
        return (
          <div key={i} style={{ ...mega(fit(l, 960, 200), i ? C.star : "#fff"), opacity: Math.min(1, p * 3), transform: `scale(${lerp(1.6, 1, p)})`, filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined }}>
            {l}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Chiffre clé (répétable) ---------- */
const StatScene: React.FC<{ f: number; from: number; i: number }> = ({ f, from, i }) => {
  const s = C.stats[i];
  const l = f - from;
  const p = prog(f, from, from + 22, eOut);
  const land = prog(f, from, from + 6, eExpo);
  const out = prog(f, from + STAT_LEN - 5, from + STAT_LEN + 2, eIn);
  const val = (s.value * p).toFixed(s.decimals);
  const txt = `${s.prefix}${val}${s.suffix}`;
  const size = fit(`${s.prefix}${s.value.toFixed(s.decimals)}${s.suffix}`, 900, 520);
  const rx = lerp(25, 8, land) + 2 * Math.sin(l / 10);
  const ry = (i % 2 ? 1 : -1) * (lerp(30, 12, land) + 2 * Math.cos(l / 12));
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${-out * 120}px)` }}>
      {/* faisceau */}
      <div style={{ position: "absolute", left: 540 - 500, top: -200, width: 1000, height: 1600, background: `linear-gradient(180deg, ${C.accent}44, transparent 75%)`, clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)", opacity: 0.6 * land }} />
      {/* éclats */}
      {Array.from({ length: 40 }, (_, k) => {
        const t = l - 4;
        if (t < 0 || t > 36) return null;
        const a = hash(k + i * 50) * Math.PI * 2;
        const v = 10 + hash(k + 3) * 24;
        return <div key={k} style={{ position: "absolute", left: 540 + Math.cos(a) * v * t, top: 900 + Math.sin(a) * v * t, width: 10, height: 10, borderRadius: k % 2 ? 2 : "50%", background: k % 3 ? C.star : "#fff", opacity: 1 - t / 36 }} />;
      })}
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.35em", color: "rgba(255,255,255,0.6)", opacity: land }}>
        {String(i + 1).padStart(2, "0")} / {String(C.stats.length).padStart(2, "0")}
      </div>
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", top: 900 - size * 0.5, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `rotateX(${rx}deg) rotateY(${ry}deg) scale(${lerp(1.8, 1, land)})`, opacity: Math.min(1, land * 3) }}>
          <span style={{ ...mega(size), fontVariantNumeric: "tabular-nums", textShadow: `${extrude(22, "#2a3a7a")}, 30px 40px 60px rgba(0,0,0,0.5)` }}>{txt}</span>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 900 + size * 0.55, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: prog(f, from + 8, from + 16), transform: `translateY(${(1 - prog(f, from + 8, from + 16, eOut)) * 30}px)` }}>
        {s.stars ? <Stars f={f} at={from + 8} size={84} gap={14} /> : null}
        <div style={{ ...mega(fit(s.label, 900, 110), C.star), fontStretch: "80%" }}>{s.label}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Avis (répétable, cartes empilées en 3D) ---------- */
const Reviews: React.FC<{ f: number }> = ({ f }) => {
  const out = prog(f, WALL - 6, WALL + 2, eIn);
  const head = prog(f, REV_START, REV_START + 10, eOut);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 - out * 0.1})` }}>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: head, transform: `translateY(${(1 - head) * -40}px)` }}>
        <div style={{ ...mega(150) }}>WHAT USERS</div>
        <div style={{ ...mega(150, C.star) }}>ARE SAYING</div>
      </div>
      <AbsoluteFill style={{ perspective: 1800 }}>
        {C.reviews.map((r, i) => {
          const from = REV_START + i * REV_LEN;
          if (f < from - 2) return null;
          const p = prog(f, from, from + 14, eOut);
          // profondeur : combien de cartes sont arrivées après celle-ci
          let depth = 0;
          C.reviews.forEach((_, j) => {
            if (j > i) depth += prog(f, REV_START + j * REV_LEN, REV_START + j * REV_LEN + 14, eInOut);
          });
          const side = i % 2 ? -1 : 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 540 - 440,
                top: 900 + (1 - p) * 700 - depth * 90,
                width: 880,
                transform: `translateZ(${-depth * 160}px) rotateY(${side * lerp(40, 6, p)}deg) rotateZ(${side * lerp(8, 2, p) + depth * side * 2}deg)`,
                opacity: Math.min(1, p * 2) * (1 - Math.max(0, depth - 1.6)),
                filter: depth > 0.1 ? `brightness(${1 - depth * 0.25}) blur(${depth * 1.5}px)` : undefined,
                zIndex: 10 - Math.round(depth),
              }}
            >
              <div style={{ borderRadius: 44, background: "#fff", padding: "50px 54px", boxShadow: "0 50px 100px rgba(0,0,0,0.5)", color: "#0a0f1f" }}>
                <Stars f={f} at={from + 8} n={r.stars} size={64} gap={10} />
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 64, lineHeight: 1.12, marginTop: 30 }}>“{r.quote}”</div>
                <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 40 }}>
                  <div style={{ width: 86, height: 86, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, hsl(${hash(i + 4) * 360},75%,62%))`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff" }}>{r.name[0]}</div>
                  <div>
                    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38 }}>{r.name}</div>
                    <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 26, color: "#5a6480" }}>{r.meta}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Mur d'avis ---------- */
const Wall: React.FC<{ f: number }> = ({ f }) => {
  const p = prog(f, WALL, WALL + 12, eOut);
  const out = prog(f, END - 5, END + 2, eIn);
  const l = f - WALL;
  return (
    <AbsoluteFill style={{ opacity: p * (1 - out) }}>
      <AbsoluteFill style={{ perspective: 1400 }}>
        <div style={{ position: "absolute", left: -400, top: 250, width: W + 800, transform: "rotateX(28deg) rotateZ(-10deg)", transformOrigin: "50% 50%" }}>
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <div key={row} style={{ display: "flex", gap: 24, marginBottom: 24, transform: `translateX(${(row % 2 ? -1 : 1) * l * (6 + row) - 400}px)` }}>
              {Array.from({ length: 10 }, (_, k) => {
                const q = C.wall[(row * 3 + k) % C.wall.length];
                return (
                  <div key={k} style={{ flexShrink: 0, width: 330, padding: "24px 26px", borderRadius: 28, background: "rgba(255,255,255,0.95)", boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }}>
                    <Stars f={1000} at={0} size={30} gap={4} />
                    <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: "#0a0f1f", marginTop: 12 }}>“{q}”</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.bg}00 20%, ${C.bg}ee 50%, ${C.bg}00 80%)` }} />
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {C.wallLine.map((t, i) => {
          const q = prog(f, WALL + 4 + i * 8, WALL + 10 + i * 8, eExpo);
          return (
            <div key={i} style={{ ...mega(fit(t, 960, 220), i ? C.star : "#fff"), opacity: Math.min(1, q * 3), transform: `scale(${lerp(1.6, 1, q)})`, textShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
              {t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Fin ---------- */
const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const icon = prog(f, END + 2, END + 14, eBack);
  const word = prog(f, END + 6, END + 12, eExpo);
  const nameSize = fit(C.name, 900, 250);
  const cy = 560;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 0.6}deg at 50% ${(cy / H) * 100}%, ${C.star}14 0deg 7deg, transparent 7deg 20deg)`, opacity: prog(f, END, END + 12) }} />
      <div style={{ position: "absolute", left: 540 - 120, top: cy - 120, width: 240, height: 240, borderRadius: 58, background: `linear-gradient(135deg, ${C.accent}, ${C.star})`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${icon}) rotate(${(1 - icon) * -20}deg)`, boxShadow: `0 0 100px ${C.accent}88` }}>
        <span style={{ ...mega(170), lineHeight: 1 }}>{C.iconGlyph}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 170, textAlign: "center", opacity: word, transform: `scale(${lerp(1.5, 1, word)})` }}>
        <span style={mega(nameSize)}>{C.name}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 190 + nameSize * 0.9, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 50, color: "rgba(255,255,255,0.9)", opacity: prog(f, END + 14, END + 24) }}>{C.tagline}</div>
      {(() => {
        const q = prog(f, END + 20, END + 32, eBack);
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: cy + 300 + nameSize * 0.9, display: "flex", justifyContent: "center", opacity: Math.min(1, q * 2), transform: `scale(${lerp(0.8, 1, q)})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 40px", borderRadius: 999, background: "rgba(255,255,255,0.1)", border: `2px solid ${C.star}88` }}>
              <Stars f={f} at={END + 22} size={46} gap={6} />
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#fff" }}>{C.ratingBadge}</span>
            </div>
          </div>
        );
      })()}
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 450 + nameSize * 0.9, display: "flex", justifyContent: "center", gap: 36 }}>
        {C.stores.map((k, i) => {
          const q = prog(f, END + 34 + i * 5, END + 46 + i * 5, eOut);
          return (
            <div key={k} style={{ opacity: q, transform: `translateY(${(1 - q) * 40}px)` }}>
              <StoreBtn kind={k} lang="en" />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const sfx = (n: string) => staticFile(`proof/sfx/${n}.wav`);
const starCues = (at: number, n: number, vol: number) => Array.from({ length: n }, (_, i) => ({ at: at + i * 3 + 3, src: `star${i}`, vol }));
const CUES: { at: number; src: string; vol: number }[] = [
  { at: 4, src: "hit", vol: 0.3 },
  { at: 16, src: "hit", vol: 0.3 },
  ...C.stats.flatMap((s, i) => {
    const from = STATS_START + i * STAT_LEN;
    return [{ at: from, src: "hit", vol: 0.35 }, { at: from + 1, src: "counter", vol: 0.3 }, ...(s.stars ? starCues(from + 8, 5, 0.2) : [])];
  }),
  ...C.reviews.flatMap((r, i) => {
    const from = REV_START + i * REV_LEN;
    return [{ at: from - 2, src: "card", vol: 0.3 }, ...starCues(from + 8, r.stars, 0.18)];
  }),
  { at: WALL, src: "whoosh", vol: 0.3 },
  { at: END + 2, src: "chime", vol: 0.3 },
  { at: END + 4, src: "shimmer", vol: 0.25 },
  ...starCues(END + 22, 5, 0.14),
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

export { clamp, DURATION_FRAMES, interpolate };
