import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFonts as loadSans } from "../signspath/theme";
import { FONT, loadViewzFonts } from "../viewz/theme";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { CONFIG } from "./config";
import { Editor } from "./Editor";
import { Page, PAGE_H, PAGE_W, PRIMARY_BTN } from "./Page";
import { CLICK, DURATION_FRAMES, END, SCHEDULE } from "./timing";

loadViewzFonts();
loadSans();
const C = CONFIG;
const W = 1080;
const H = 1920;
const BX = 50;
const BY = 380;
const CHROME = 64;
const EY = 1225;

const mega = (size: number, color = "#fff"): React.CSSProperties => ({
  fontFamily: FONT,
  fontStyle: "italic",
  fontWeight: 900,
  fontStretch: "68%",
  fontSize: size,
  lineHeight: 0.92,
  letterSpacing: size * -0.01,
  textTransform: "uppercase",
  color,
  whiteSpace: "nowrap",
});
const fit = (text: string, maxW: number, max: number) => Math.min(max, maxW / (Math.max(1, text.length) * 0.5));
const GRAD = `linear-gradient(135deg, ${C.accent}, ${C.accent2})`;

/** "The site that builds itself" (1080x1920). */
export const WebBuild: React.FC = () => {
  const f = useCurrentFrame();
  const enter = prog(f, 0, 30, eOut);
  const after = prog(f, CLICK + 4, CLICK + 34, eInOut);
  const out = prog(f, END - 6, END + 10, eIn);
  // caméra
  const rx = lerp(lerp(16, 6, prog(f, 0, CLICK, eInOut)), 0, after);
  const ry = lerp(lerp(-14, 8, prog(f, 0, CLICK, eInOut)), 0, after) + 1.5 * Math.sin(f / 40);
  const browserY = lerp(BY, H / 2 - (CHROME + PAGE_H) / 2 + 40, after);
  const browserS = lerp(1, 1.04, after);
  return (
    <AbsoluteFill style={{ background: C.stageBg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 20% 25%, ${C.accent}33, transparent 45%), radial-gradient(circle at 85% 80%, ${C.accent2}2a, transparent 45%)` }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)", backgroundSize: "48px 48px", backgroundPosition: `0 ${(f * 0.6) % 48}px` }} />
      <Headlines f={f} />
      {/* scène 3D */}
      <AbsoluteFill style={{ perspective: 2400, opacity: enter * (1 - out), filter: out > 0 ? `blur(${out * 14}px)` : enter < 1 ? `blur(${(1 - enter) * 12}px)` : undefined }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateY(${(1 - enter) * 260}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${1 - out * 0.25})`, transformOrigin: "50% 45%" }}>
          {/* navigateur */}
          <div style={{ position: "absolute", left: BX, top: browserY, width: PAGE_W, transform: `scale(${browserS})`, transformOrigin: "50% 50%", borderRadius: 22, overflow: "hidden", boxShadow: `0 50px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), 0 0 80px ${C.accent}33` }}>
            <BrowserChrome f={f} />
            <div style={{ position: "relative" }}>
              <Page f={f} />
              <Cursor f={f} />
            </div>
          </div>
          {/* éditeur */}
          <div style={{ position: "absolute", left: BX, top: EY + after * 760, opacity: 1 - after, transform: `translateZ(${40 - after * 200}px)` }}>
            <Editor f={f} w={PAGE_W} h={560} />
          </div>
        </div>
      </AbsoluteFill>
      {f >= END - 2 ? <EndCard f={f} /> : null}
      <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "overlay" }}>
        <svg width={W} height={H}>
          <filter id="wbgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#wbgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

/** Barre du navigateur (onglet, URL qui se tape). */
const BrowserChrome: React.FC<{ f: number }> = ({ f }) => {
  const n = Math.round(interpolate(f, [12, 30], [0, C.url.length], clamp));
  const loading = interpolate(f, [30, SCHEDULE.typingEnd], [0, 1], clamp);
  return (
    <div style={{ height: CHROME, background: "#e9e9f2", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", position: "relative" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
      ))}
      <div style={{ marginLeft: 20, display: "flex", gap: 14, color: "#8a8aa3", fontSize: 22, fontWeight: 700 }}>
        <span>‹</span>
        <span>›</span>
      </div>
      <div style={{ marginLeft: 14, flex: 1, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 16px", fontFamily: "Manrope, sans-serif", fontSize: 20, color: "#14142b" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        {C.url.slice(0, n)}
        {f < 34 && Math.floor(f / 8) % 2 === 0 ? <span style={{ width: 2, height: 22, background: "#14142b" }} /> : null}
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: `${loading * 100}%`, background: GRAD, opacity: loading < 1 ? 1 : 1 - prog(f, SCHEDULE.typingEnd, SCHEDULE.typingEnd + 10) }} />
    </div>
  );
};

/** Curseur qui va cliquer sur le bouton principal. */
const Cursor: React.FC<{ f: number }> = ({ f }) => {
  const st = CLICK - 48;
  if (f < st) return null;
  const p = prog(f, st, CLICK - 6, eInOut);
  const [tx, ty] = PRIMARY_BTN;
  const sx = 900;
  const sy = 720;
  // trajectoire courbe
  const cx = lerp(sx, tx, p) + Math.sin(p * Math.PI) * -80;
  const cy = lerp(sy, ty, p) + Math.sin(p * Math.PI) * 60;
  const press = interpolate(f, [CLICK - 1, CLICK + 2, CLICK + 8], [1, 0.82, 1], clamp);
  const fade = 1 - prog(f, CLICK + 30, CLICK + 40);
  return (
    <div style={{ position: "absolute", left: cx, top: cy, transform: `scale(${press * 1.4})`, transformOrigin: "0 0", opacity: prog(f, st, st + 6) * fade, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))", zIndex: 20 }}>
      <svg width="36" height="44" viewBox="0 0 24 30">
        <path d="M2 2 L2 24 L8 18.5 L12 28 L16 26.2 L12 17 L20 17 Z" fill="#14142b" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Titres au-dessus de la scène (3 phases). */
const Headlines: React.FC<{ f: number }> = ({ f }) => {
  const phases = [0, 150, CLICK - 4];
  const pi = phases.reduce((acc, s, i) => (f >= s ? i : acc), 0);
  const from = phases[pi];
  const to = pi < phases.length - 1 ? phases[pi + 1] : END;
  const out = prog(f, to - 6, to, eIn);
  return (
    <div style={{ position: "absolute", top: 100, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, transform: `translateY(${-out * 30}px)` }}>
      {C.headlines[pi].map((l, i) => {
        const q = prog(f, from + 4 + i * 8, from + 10 + i * 8, eExpo);
        return (
          <div key={i} style={{ ...mega(fit(l, 960, 130), i ? undefined : "#fff"), ...(i ? { background: GRAD, WebkitBackgroundClip: "text", color: "transparent", paddingRight: 14 } : {}), opacity: Math.min(1, q * 3), transform: `scale(${lerp(1.5, 1, q)})`, filter: q < 1 ? `blur(${(1 - q) * 10}px)` : undefined }}>
            {l}
          </div>
        );
      })}
    </div>
  );
};

/** Carte de fin : studio / agence. */
const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const st = END;
  const word = prog(f, st + 4, st + 12, eExpo);
  const size = fit(C.studio, 960, 230);
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${C.accent}44, transparent 50%)`, opacity: prog(f, st, st + 12) }} />
      <div style={{ ...mega(size), opacity: word, transform: `scale(${lerp(1.5, 1, word)})`, filter: word < 1 ? `blur(${(1 - word) * 12}px)` : undefined }}>{C.studio}</div>
      <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 52, color: "rgba(255,255,255,0.9)", opacity: prog(f, st + 12, st + 22), transform: `translateY(${(1 - prog(f, st + 12, st + 22, eOut)) * 20}px)` }}>{C.studioTagline}</div>
      {(() => {
        const q = prog(f, st + 18, st + 30, eBack);
        return <div style={{ marginTop: 30, padding: "26px 56px", borderRadius: 999, background: GRAD, fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 44, color: "#fff", opacity: Math.min(1, q * 2), transform: `scale(${lerp(0.8, 1, q)})`, boxShadow: `0 0 60px ${C.accent}88` }}>{C.cta}</div>;
      })()}
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 36, color: C.accent2, opacity: prog(f, st + 28, st + 38) }}>{C.studioUrl}</div>
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: hash(i) * W, top: (hash(i + 4) * H - (f - st) * (1 + hash(i + 2) * 2) + H * 4) % H, width: 4, height: 4, borderRadius: "50%", background: "#fff", opacity: 0.2 + 0.3 * hash(i + 7) }} />
      ))}
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const sfx = (n: string) => staticFile(`webbuild/sfx/${n}.wav`);
const Sound: React.FC = () => {
  const pops = Object.values(SCHEDULE.pops);
  return (
    <>
      <Html5Audio src={sfx("music")} volume={0.75} />
      <Sequence from={0} layout="none" name="whoosh">
        <Html5Audio src={sfx("whoosh")} volume={0.25} />
      </Sequence>
      <Sequence from={12} durationInFrames={18} layout="none" name="url">
        <Html5Audio src={sfx("typing")} volume={0.3} />
      </Sequence>
      {SCHEDULE.lines.map((l, i) => (
        <Sequence key={`t${i}`} from={l.start} durationInFrames={l.end - l.start + 2} layout="none" name={`code ${i + 1}`}>
          <Html5Audio src={sfx("typing")} volume={0.35} />
        </Sequence>
      ))}
      {pops.map((p, i) => (
        <Sequence key={`p${i}`} from={p} layout="none" name="pop">
          <Html5Audio src={sfx("pop")} volume={0.22} />
        </Sequence>
      ))}
      {[150, CLICK - 4].map((at) => (
        <Sequence key={at} from={at} layout="none" name="swish">
          <Html5Audio src={sfx("swish")} volume={0.22} />
        </Sequence>
      ))}
      <Sequence from={CLICK} layout="none" name="click">
        <Html5Audio src={sfx("click")} volume={0.5} />
      </Sequence>
      <Sequence from={CLICK + 6} layout="none" name="success">
        <Html5Audio src={sfx("success")} volume={0.32} />
      </Sequence>
      <Sequence from={END - 4} layout="none" name="whoosh2">
        <Html5Audio src={sfx("whoosh")} volume={0.25} />
      </Sequence>
    </>
  );
};

export { DURATION_FRAMES, hash };
