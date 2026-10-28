import { AbsoluteFill, Html5Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFonts as loadSans, SANS, SERIF } from "../signspath/theme";
import { FONT, loadViewzFonts } from "../viewz/theme";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { CONFIG } from "./config";
import { GenericPage, PW } from "./Pages";
import { DURATION_FRAMES, END, OVERVIEW, PAGE_LEN, PAGE_START } from "./timing";

loadViewzFonts();
loadSans();
const C = CONFIG;
const W = 1080;
const H = 1920;
const CY = 1060;
const VH = 760;
const BAR = 54;
const N = C.pages.length;
const GRAD = `linear-gradient(135deg, ${C.accent}, ${C.accent2})`;

const mega = (size: number, color = "#fff"): React.CSSProperties => ({ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontStretch: "68%", fontSize: size, lineHeight: 0.92, textTransform: "uppercase", color, whiteSpace: "nowrap" });
const fit = (text: string, maxW: number, max: number) => Math.min(max, maxW / (Math.max(1, text.length) * 0.5));
const pageStart = (i: number) => PAGE_START + i * PAGE_LEN;

/** Fenêtre de navigateur ; la capture défile (fraction p de 0 à 1). */
const BrowserWindow: React.FC<{ i: number; p: number; glow: number }> = ({ i, p, glow }) => {
  const pg = C.pages[i];
  return (
    <div style={{ width: PW, borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: `0 60px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.12), 0 0 ${90 * glow}px ${C.accent}55` }}>
      <div style={{ height: BAR, background: "#efeef5", display: "flex", alignItems: "center", gap: 9, padding: "0 18px" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ marginLeft: 20, flex: 1, height: 34, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontFamily: SANS, fontSize: 17, color: "#3b3852" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          {C.domain}
          <span style={{ color: "#9a97b0" }}>{pg.path === "/" ? "" : pg.path}</span>
        </div>
      </div>
      <div style={{ position: "relative", height: VH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: PW, transform: `translateY(calc(${-p} * (100% - ${VH}px)))` }}>
          {pg.image ? <Img src={staticFile(pg.image)} style={{ width: PW, display: "block" }} /> : <GenericPage kind={pg.kind} />}
        </div>
        <div style={{ position: "absolute", right: 6, top: 6 + p * (VH - 120), width: 6, height: 110, borderRadius: 3, background: "rgba(0,0,0,0.25)" }} />
      </div>
    </div>
  );
};

/** "Browser tour" (1080x1920). */
export const BrowserTour: React.FC = () => {
  const f = useCurrentFrame();
  // index actif (flottant) du carrousel
  let a = 0;
  for (let i = 1; i < N; i++) a += prog(f, pageStart(i) - 12, pageStart(i) + 10, eInOut);
  const ov = prog(f, OVERVIEW - 6, OVERVIEW + 26, eInOut);
  const out = prog(f, END - 6, END + 18, eIn);
  const stRy = lerp(-6 + 3 * Math.sin(f / 50), -24, ov);
  const stRx = lerp(5, 16, ov);
  // défilement
  const scroll = (i: number) => {
    const s = pageStart(i);
    const own = prog(f, s + 14, s + PAGE_LEN - 6, eInOut) * 0.72;
    return lerp(own, 1, prog(f, OVERVIEW + 18, END - 4, eInOut));
  };
  const flash = Math.max(f >= END ? 0.7 * Math.exp(-(f - END) / 3) : 0, f >= OVERVIEW ? 0.18 * Math.exp(-(f - OVERVIEW) / 3) : 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.bg[0] }}>
      <AbsoluteFill style={{ background: `linear-gradient(170deg, ${C.bg[0]} 0%, ${C.bg[1]} 60%, ${C.bg[0]} 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${50 + 25 * Math.sin(f / 70)}% 55%, ${C.accent}33, transparent 45%), radial-gradient(circle at 20% 20%, ${C.accent2}33, transparent 45%)` }} />
      {/* particules de lumière */}
      {Array.from({ length: 40 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: hash(i) * W, top: (hash(i + 3) * H - f * (0.4 + hash(i + 5)) + H * 3) % H, width: 3, height: 3, borderRadius: "50%", background: "#fff", opacity: 0.12 + 0.25 * hash(i + 7) }} />
      ))}
      <Titles f={f} a={a} />
      {/* scène 3D */}
      <AbsoluteFill style={{ perspective: 2300, perspectiveOrigin: `50% ${CY}px` }}>
        <div style={{ position: "absolute", left: W / 2, top: CY, transformStyle: "preserve-3d", transform: `rotateY(${stRy}deg) rotateX(${stRx}deg) translateZ(${-out * 400}px)` }}>
          {C.pages.map((_, k) => {
            const intro = prog(f, 6 + k * 5, 34 + k * 5, eOut);
            const d = k - a;
            const ad = Math.min(1.4, Math.abs(d));
            // carrousel
            const cx = d * 640;
            const cy = -ad * 40;
            const cz = -ad * 520;
            const cry = -d * 30;
            // cascade (vue d'ensemble)
            const ox = (k - (N - 1) / 2) * 220 + 80;
            const oy = (k - (N - 1) / 2) * 190 + 130;
            const oz = -k * 240 + 120;
            const x = lerp(cx, ox, ov);
            const y = lerp(cy, oy, ov) + (1 - intro) * 300;
            const z = lerp(cz, oz, ov) - (1 - intro) * 2200;
            const ry = lerp(cry, 0, ov);
            const op = intro * lerp(1 - Math.min(1, ad) * 0.45, 1, ov) * (1 - out);
            const blur = lerp(Math.min(1, ad) * 4, 0, ov) + out * 10;
            const glow = Math.max(0, 1 - ad) * (1 - ov);
            return (
              <div key={k} style={{ position: "absolute", left: -PW / 2, top: -(VH + BAR) / 2, transform: `translate3d(${x}px, ${y + 8 * Math.sin(f / 22 + k)}px, ${z}px) rotateY(${ry}deg)`, opacity: op, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
                <BrowserWindow i={k} p={scroll(k)} glow={glow} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* indicateur de page */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1600, display: "flex", justifyContent: "center", gap: 14, opacity: prog(f, PAGE_START, PAGE_START + 10) * (1 - ov) }}>
        {C.pages.map((pg, i) => {
          const act = Math.max(0, 1 - Math.abs(i - a));
          return (
            <div key={i} style={{ height: 12, width: 40 + 80 * act, borderRadius: 6, background: act > 0.5 ? GRAD : "rgba(255,255,255,0.25)" }} />
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1650, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em", opacity: prog(f, PAGE_START, PAGE_START + 10) * (1 - ov) }}>
        {C.domain}
        <span style={{ color: C.accent }}>{C.pages[Math.round(a)].path === "/" ? "" : C.pages[Math.round(a)].path}</span>
      </div>
      {f >= END - 2 ? <EndCard f={f} /> : null}
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "overlay" }}>
        <svg width={W} height={H}>
          <filter id="btgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#btgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

/** Titres : intro, titre de chaque page, vue d'ensemble. */
const Titles: React.FC<{ f: number; a: number }> = ({ f, a }) => {
  const block = (lines: string[], from: number, to: number, key: string) => {
    if (f < from - 1 || f > to + 10) return null;
    const out = prog(f, to, to + 9, eIn);
    return (
      <div key={key} style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>
        {lines.map((l, i) => {
          const q = prog(f, from + i * 7, from + 6 + i * 7, eExpo);
          return (
            <div key={i} style={{ ...mega(fit(l, 960, 190)), ...(i ? { background: GRAD, WebkitBackgroundClip: "text", color: "transparent", paddingRight: 16 } : {}), opacity: Math.min(1, q * 3), transform: `scale(${lerp(1.5, 1, q)})`, filter: q < 1 ? `blur(${(1 - q) * 10}px)` : undefined }}>
              {l}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <>
      {block(C.intro, 2, PAGE_START - 6, "intro")}
      {C.pages.map((pg, i) => {
        const s = pageStart(i);
        const e = i < N - 1 ? pageStart(i + 1) - 14 : OVERVIEW - 8;
        if (f < s - 2 || f > e + 10) return null;
        const q = prog(f, s, s + 10, eOut);
        const o = prog(f, e, e + 9, eIn);
        void a;
        return (
          <div key={i} style={{ position: "absolute", top: 190, left: 80, right: 80, opacity: q * (1 - o), transform: `translateX(${(1 - q) * 120 - o * 120}px)` }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "rgba(255,255,255,0.6)", letterSpacing: "0.3em" }}>
              {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </div>
            <div style={{ ...mega(fit(pg.title, 920, 210)), marginTop: 14 }}>{pg.title}</div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 66, marginTop: 10, background: GRAD, WebkitBackgroundClip: "text", color: "transparent", paddingRight: 12 }}>{pg.sub}</div>
          </div>
        );
      })}
      {block(C.overview, OVERVIEW + 6, END - 6, "ov")}
    </>
  );
};

/** Carte de fin. */
const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const st = END;
  const word = prog(f, st + 6, st + 14, eExpo);
  const size = fit(C.brand, 900, 220);
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: word, transform: `scale(${lerp(1.4, 1, word)})`, filter: word < 1 ? `blur(${(1 - word) * 12}px)` : undefined }}>
        <div style={{ width: size * 0.7, height: size * 0.7, borderRadius: "50%", background: GRAD, boxShadow: `0 0 80px ${C.accent}88` }} />
        <span style={{ ...mega(size), textTransform: "none" }}>{C.brand}</span>
      </div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 70, color: "#fff", opacity: prog(f, st + 14, st + 24), transform: `translateY(${(1 - prog(f, st + 14, st + 24, eOut)) * 20}px)`, textAlign: "center", padding: "0 60px" }}>{C.tagline}</div>
      {(() => {
        const q = prog(f, st + 22, st + 34, eBack);
        return <div style={{ marginTop: 20, padding: "26px 58px", borderRadius: 999, background: GRAD, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#fff", opacity: Math.min(1, q * 2), transform: `scale(${lerp(0.8, 1, q)})`, boxShadow: `0 0 60px ${C.accent}88` }}>{C.cta}</div>;
      })()}
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const sfx = (n: string) => staticFile(`browsertour/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number; dur?: number }[] = [
  { at: 4, src: "swipe", vol: 0.3 },
  ...C.pages.map((_, i) => ({ at: pageStart(i) - 10, src: "swipe", vol: i ? 0.32 : 0 })),
  ...C.pages.map((_, i) => ({ at: pageStart(i) + 2, src: "pop", vol: 0.2 })),
  ...C.pages.map((_, i) => ({ at: pageStart(i) + 14, src: "scroll", vol: 0.3, dur: PAGE_LEN - 24 })),
  { at: OVERVIEW, src: "shimmer", vol: 0.3 },
  { at: OVERVIEW + 18, src: "scroll", vol: 0.25, dur: 50 },
  { at: END, src: "impact", vol: 0.42 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={sfx("music")} volume={0.62} />
    {CUES.filter((c) => c.vol > 0).map((c, i) => (
      <Sequence key={i} from={c.at} durationInFrames={c.dur} layout="none" name={c.src}>
        <Html5Audio src={sfx(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

export { DURATION_FRAMES, interpolate, clamp };
