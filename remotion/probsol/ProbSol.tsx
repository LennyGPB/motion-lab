import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { NovaPhone, PH, PW } from "../nova/parts";
import { StoreBtn } from "../stride/parts";
import { FONT, loadViewzFonts } from "../viewz/theme";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { CONFIG, PSIcon } from "./config";
import { PSMockScreen } from "./screens";
import { BEN_LEN, BEN_START, DURATION_FRAMES, END, HERO, SWITCH } from "./timing";

loadViewzFonts();
const C = CONFIG;
const GRAD = `linear-gradient(135deg, ${C.accent}, ${C.accent2})`;
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
});
const fit = (text: string, maxW: number, max: number) => Math.min(max, maxW / (Math.max(1, text.length) * 0.5));
const capsSt: React.CSSProperties = { fontFamily: FONT, fontWeight: 700, fontSize: 28, letterSpacing: "0.32em", textTransform: "uppercase" };

/** Template "Problème → Solution" (1080x1920). */
export const ProbSol: React.FC = () => {
  const f = useCurrentFrame();
  const blobR = interpolate(f, [SWITCH, SWITCH + 32], [0, 2400], { ...clamp, easing: eIn });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {f < SWITCH + 34 ? <Problem f={f} /> : null}
      {/* point lumineux : la seule couleur dans la partie problème */}
      {f >= 122 && f < SWITCH + 4 ? (
        <div
          style={{
            position: "absolute",
            left: 540 - 60,
            top: 1000 - 60,
            width: 120,
            height: 120,
            zIndex: 5,
            borderRadius: "50%",
            background: GRAD,
            boxShadow: `0 0 ${60 + 30 * Math.sin(f / 2)}px 20px ${C.accent2}aa`,
            transform: `scale(${prog(f, 122, 132, eBack) * (1 + 0.15 * Math.sin(f / 2)) + prog(f, SWITCH - 6, SWITCH, eIn) * 1.5})`,
          }}
        />
      ) : null}
      {f >= SWITCH ? (
        <AbsoluteFill style={{ clipPath: blobPath(f, blobR) }}>
          <Solution f={f} />
        </AbsoluteFill>
      ) : null}
      {/* lueur au bord de la tache de couleur */}
      {f >= SWITCH && f < SWITCH + 34 ? (
        <div style={{ position: "absolute", left: 540 - blobR, top: 1000 - blobR, width: blobR * 2, height: blobR * 2, borderRadius: "50%", boxShadow: `0 0 120px 40px ${C.accent2}88, inset 0 0 80px 20px #ffffff66` }} />
      ) : null}
      <AbsoluteFill style={{ opacity: f < SWITCH ? 0.14 : 0.06, mixBlendMode: "overlay" }}>
        <svg width={W} height={H}>
          <filter id="psgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 12} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#psgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

/** Contour organique de la tache de couleur (clip-path polygon). */
const blobPath = (f: number, r: number) => {
  const N = 72;
  const pts: string[] = [];
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2;
    const rr = r * (1 + 0.07 * Math.sin(a * 5 + f * 0.4) + 0.05 * Math.sin(a * 9 - f * 0.3));
    pts.push(`${540 + Math.cos(a) * rr}px ${1000 + Math.sin(a) * rr}px`);
  }
  return `polygon(${pts.join(",")})`;
};

/* ====================== PROBLÈME (noir et blanc) ====================== */
const Problem: React.FC<{ f: number }> = ({ f }) => {
  const flick = 0.85 + 0.15 * hash(Math.floor(f / 2));
  const chaos = prog(f, 0, SWITCH, eIn);
  const lineAt = [10, 45, 80];
  return (
    <AbsoluteFill style={{ filter: `grayscale(1) contrast(1.25) brightness(${flick})` }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #2a2a2a, #0b0b0b 70%)" }} />
      {/* horloge qui s'emballe */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        <circle cx={540} cy={1000} r={420} fill="none" stroke="#bbb" strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={540 + Math.cos(a) * 380} y1={1000 + Math.sin(a) * 380} x2={540 + Math.cos(a) * 410} y2={1000 + Math.sin(a) * 410} stroke="#bbb" strokeWidth={6} />;
        })}
        <line x1={540} y1={1000} x2={540 + Math.cos(f * 0.05 * (1 + chaos * 3)) * 230} y2={1000 + Math.sin(f * 0.05 * (1 + chaos * 3)) * 230} stroke="#ddd" strokeWidth={14} strokeLinecap="round" />
        <line x1={540} y1={1000} x2={540 + Math.cos(f * 0.6 * (1 + chaos * 2)) * 340} y2={1000 + Math.sin(f * 0.6 * (1 + chaos * 2)) * 340} stroke="#ddd" strokeWidth={6} strokeLinecap="round" />
      </svg>
      {/* notifications qui s'empilent */}
      {C.noise.map((n, i) => {
        const at = 14 + i * 13;
        const q = prog(f, at, at + 6, eBack);
        if (q <= 0) return null;
        const jx = (hash(f * 1.3 + i) - 0.5) * (4 + chaos * 10);
        const jy = (hash(f * 2.1 + i) - 0.5) * (4 + chaos * 10);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 60 + hash(i * 7) * 420 + jx,
              top: 760 + hash(i * 3) * 820 + jy,
              transform: `rotate(${(hash(i * 5) - 0.5) * 18}deg) scale(${q})`,
              width: 560,
              padding: "24px 28px",
              borderRadius: 30,
              background: "rgba(235,235,235,0.92)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontFamily: FONT,
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "#777", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#222" }}>Notification</div>
              <div style={{ fontSize: 30, fontWeight: 600, color: "#333" }}>{n}</div>
            </div>
          </div>
        );
      })}
      {/* texte qui tremble */}
      <div style={{ position: "absolute", top: 140, left: 70, ...capsSt, color: "#aaa", opacity: prog(f, 4, 14) }}>{C.problemKicker}</div>
      <div style={{ position: "absolute", top: 200, left: 60, right: 60 }}>
        {C.problemLines.map((line, li) => {
          const at = lineAt[li] ?? 10 + li * 35;
          if (f < at) return null;
          const p = prog(f, at, at + 6, eExpo);
          const size = fit(line, 960, 190);
          return (
            <div key={li} style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.2, transform: `scale(${lerp(1.5, 1, p)})`, transformOrigin: "0% 50%", opacity: Math.min(1, p * 3) }}>
              {line.split(" ").map((w, wi) => {
                const amp = 3 + chaos * 9 + 10 * Math.exp(-(f - at) / 4);
                const jx = (hash(f * 3.1 + li * 10 + wi) - 0.5) * amp;
                const jy = (hash(f * 5.7 + li * 10 + wi) - 0.5) * amp;
                const rot = (hash(f * 1.9 + wi) - 0.5) * (1 + chaos * 3);
                return (
                  <span key={wi} style={{ position: "relative", display: "inline-block", transform: `translate(${jx}px, ${jy}px) rotate(${rot}deg)` }}>
                    <span style={{ ...mega(size, "rgba(255,255,255,0.25)"), position: "absolute", left: -6 - jx * 0.6, top: 2 }}>{w}</span>
                    <span style={{ ...mega(size, li === C.problemLines.length - 1 ? "#fff" : "#d8d8d8"), position: "relative" }}>{w}</span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* bascule : phrase + point lumineux (seule couleur) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1230, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 52, color: "#fff", opacity: prog(f, 112, 122), textShadow: "0 4px 30px #000" }}>{C.switchLine}</div>
    </AbsoluteFill>
  );
};

/* ====================== SOLUTION (couleur) ====================== */
const Solution: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${C.accent} 0%, #1b2a8f 45%, #0d1b4a 70%, ${C.accent2} 140%)` }} />
    <AbsoluteFill style={{ background: `radial-gradient(circle at ${50 + 20 * Math.sin(f / 60)}% ${30 + 10 * Math.cos(f / 50)}%, ${C.accent2}55, transparent 45%)` }} />
    {/* bulles de lumière */}
    {Array.from({ length: 24 }, (_, i) => {
      const y = (hash(i) * H - (f - SWITCH) * (1 + hash(i + 3) * 2) + H * 3) % H;
      const s = 6 + hash(i + 5) * 18;
      return <div key={i} style={{ position: "absolute", left: hash(i + 9) * W, top: y, width: s, height: s, borderRadius: "50%", background: "#fff", opacity: 0.12 + 0.2 * hash(i + 2) }} />;
    })}
    {f < END + 2 ? <Hero f={f} /> : null}
    {f >= END - 1 ? <EndCard f={f} /> : null}
  </AbsoluteFill>
);

/** Téléphone + révélation, puis bénéfices (écran remplacé à chaque bénéfice). */
const Hero: React.FC<{ f: number }> = ({ f }) => {
  const p = prog(f, HERO, HERO + 26, eOut);
  const toBen = prog(f, BEN_START - 8, BEN_START + 6, eInOut);
  const out = prog(f, END - 8, END, eIn);
  const screens = [{ from: HERO, node: <PSMockScreen kind={C.heroScreen} f={f} from={HERO + 10} /> }, ...C.benefits.map((b, i) => ({ from: BEN_START + i * BEN_LEN, node: <PSMockScreen kind={b.screen} f={f} from={BEN_START + i * BEN_LEN + 4} /> }))];
  const bi = Math.min(C.benefits.length - 1, Math.max(0, Math.floor((f - BEN_START) / BEN_LEN)));
  const side = bi % 2 ? -1 : 1;
  const sway = f >= BEN_START ? side * 60 * prog(f, BEN_START + bi * BEN_LEN, BEN_START + bi * BEN_LEN + 12, eInOut) : 0;
  const s = lerp(0.82, 0.7, toBen);
  const y = lerp(1180, 1310, toBen);
  const nameSize = fit(C.name, 940, 300);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 12}px)` : undefined }}>
      {/* révélation */}
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - toBen, transform: `translateY(${-toBen * 60}px)` }}>
        <div style={{ ...capsSt, color: "rgba(255,255,255,0.8)", opacity: prog(f, SWITCH + 20, SWITCH + 32) }}>{C.solutionKicker}</div>
        <div style={{ ...mega(120), marginTop: 20, opacity: prog(f, SWITCH + 26, SWITCH + 32), transform: `scale(${lerp(1.4, 1, prog(f, SWITCH + 26, SWITCH + 32, eExpo))})` }}>{C.solutionLine}</div>
        <div style={{ ...mega(nameSize), background: "linear-gradient(180deg, #fff, #d6fff2)", WebkitBackgroundClip: "text", color: "transparent", paddingRight: 16, opacity: prog(f, SWITCH + 34, SWITCH + 40), transform: `scale(${lerp(1.6, 1, prog(f, SWITCH + 34, SWITCH + 40, eExpo))})`, filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.3))" }}>
          {C.name}
        </div>
      </div>
      {/* bénéfices */}
      {C.benefits.map((b, i) => {
        const from = BEN_START + i * BEN_LEN;
        if (f < from - 2 || f > from + BEN_LEN + 4) return null;
        const q = prog(f, from, from + 10, eOut);
        const o = i < C.benefits.length - 1 ? prog(f, from + BEN_LEN - 6, from + BEN_LEN, eIn) : 0;
        const tSize = fit(b.title, 940, 150);
        return (
          <div key={i} style={{ position: "absolute", top: 150, left: 70, right: 70, opacity: q * (1 - o), transform: `translateX(${(1 - q) * 120 - o * 120}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <IconChip name={b.icon} size={96} />
              <span style={{ ...mega(80), color: "rgba(255,255,255,0.45)" }}>
                {String(i + 1).padStart(2, "0")}/{String(C.benefits.length).padStart(2, "0")}
              </span>
            </div>
            <div style={{ ...mega(tSize), marginTop: 26, whiteSpace: "nowrap" }}>{b.title}</div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 46, color: "rgba(255,255,255,0.9)", marginTop: 20 }}>{b.sub}</div>
          </div>
        );
      })}
      {/* téléphone à écran remplaçable */}
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: 540 - PW / 2 + sway, top: y - PH / 2 + (1 - p) * 900 }}>
          <div style={{ transform: `scale(${s}) rotateY(${lerp(-30, -10, p) + side * (f >= BEN_START ? 14 : 0) * toBen + 3 * Math.sin(f / 30)}deg) rotateX(${lerp(20, 4, p)}deg) rotateZ(${lerp(8, 2, p)}deg)` }}>
            <NovaPhone f={f} screens={screens} glow={0.2} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ICONS: Record<PSIcon, React.ReactNode> = {
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  target: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM12 11v2" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  check: <path d="M4 12.5l5 5L20 6.5" />,
  heart: <path d="M12 20s-7.5-4.6-9.2-9.3A5 5 0 0 1 12 6.6a5 5 0 0 1 9.2 4.1C19.5 15.4 12 20 12 20z" />,
};
const IconChip: React.FC<{ name: PSIcon; size: number }> = ({ name, size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: "rgba(255,255,255,0.16)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  </div>
);

/* ====================== FIN ====================== */
const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const icon = prog(f, END + 2, END + 14, eBack);
  const word = prog(f, END + 6, END + 12, eExpo);
  const nameSize = fit(C.name, 900, 250);
  const cy = 620;
  return (
    <AbsoluteFill>
      {Array.from({ length: 50 }, (_, i) => {
        const t = f - END;
        if (t < 0 || t > 50) return null;
        const a = hash(i) * Math.PI * 2;
        const v = 12 + hash(i + 1) * 26;
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * v * t, top: cy + Math.sin(a) * v * t + 0.25 * t * t, width: 12, height: 12, borderRadius: i % 2 ? 3 : "50%", background: i % 3 ? "#fff" : C.accent2, opacity: 1 - t / 50, transform: `rotate(${t * 12 + i * 20}deg)` }} />;
      })}
      <div style={{ position: "absolute", left: 540 - 120, top: cy - 120, width: 240, height: 240, borderRadius: 58, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${icon}) rotate(${(1 - icon) * -20}deg)`, boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }}>
        <span style={{ ...mega(170), background: GRAD, WebkitBackgroundClip: "text", color: "transparent", paddingRight: 10, lineHeight: 1 }}>{C.iconGlyph}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 170, textAlign: "center", opacity: word, transform: `scale(${lerp(1.5, 1, word)})` }}>
        <span style={mega(nameSize)}>{C.name}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 190 + nameSize * 0.9, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 50, color: "rgba(255,255,255,0.92)", opacity: prog(f, END + 14, END + 24) }}>{C.tagline}</div>
      {(() => {
        const q = prog(f, END + 20, END + 32, eBack);
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: cy + 300 + nameSize * 0.9, display: "flex", justifyContent: "center", opacity: Math.min(1, q * 2), transform: `scale(${lerp(0.8, 1, q)})` }}>
            <div style={{ padding: "24px 54px", borderRadius: 999, background: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: "#0d1b4a" }}>{C.cta}</div>
          </div>
        );
      })()}
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 460 + nameSize * 0.9, display: "flex", justifyContent: "center", gap: 36 }}>
        {C.stores.map((k, i) => {
          const q = prog(f, END + 28 + i * 5, END + 40 + i * 5, eOut);
          return (
            <div key={k} style={{ opacity: q, transform: `translateY(${(1 - q) * 40}px)` }}>
              <StoreBtn kind={k} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ====================== SON ====================== */
const sfx = (n: string) => staticFile(`probsol/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  ...[10, 45, 80].map((at) => ({ at, src: "glitch", vol: 0.25 })),
  ...C.noise.map((_, i) => ({ at: 14 + i * 13, src: "buzz", vol: 0.18 })),
  { at: SWITCH - 2, src: "impact", vol: 0.35 },
  { at: SWITCH, src: "bloom", vol: 0.45 },
  { at: HERO, src: "whoosh", vol: 0.3 },
  ...C.benefits.map((_, i) => ({ at: BEN_START + i * BEN_LEN - 3, src: "whoosh", vol: 0.25 })),
  ...C.benefits.map((_, i) => ({ at: BEN_START + i * BEN_LEN + 4, src: "pop", vol: 0.2 })),
  { at: END + 2, src: "ping", vol: 0.3 },
  ...C.stores.map((_, i) => ({ at: END + 28 + i * 5, src: "pop", vol: 0.18 })),
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={sfx("music")} volume={0.55} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} layout="none" name={c.src}>
        <Html5Audio src={sfx(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

export { DURATION_FRAMES, eInOut };
