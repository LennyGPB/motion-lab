import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { FONT, SANS, Streaks } from "../kinetik2/parts";
import { KLogo, Phone } from "../kinetik3/Kinetik3";
import { CommentOutro, CommentOutroSfx, Sfx } from "../kinetik12/shared";
import { Mascot, MascotKey, trackPlace } from "../mascot/MascotTest";
import { ENV20 } from "./env";
import { CUT, DURATION_FRAMES, T } from "./timing";

loadViewzFonts();
loadFonts();

/* ---------- palette « pop » reprise de la mascotte ---------- */
const YEL = "#ffc93c";
const PINK = "#ff4f9a";
const BLUE = "#1fa3e8";
const ORA = "#ff7a2f";
const INK = "#111018";
type Theme = { a: string; b: string; dots: string; shapes: string[] };
const THEMES: Theme[] = [
  { a: "#1fa3e8", b: "#1793d6", dots: "rgba(255,255,255,0.14)", shapes: [YEL, PINK, "#fff"] },
  { a: "#ff4f9a", b: "#f43f8c", dots: "rgba(255,255,255,0.16)", shapes: [YEL, BLUE, "#fff"] },
  { a: "#ffc93c", b: "#ffbb1f", dots: "rgba(255,255,255,0.22)", shapes: [PINK, BLUE, ORA] },
  { a: "#ff7a2f", b: "#f56a1f", dots: "rgba(255,255,255,0.16)", shapes: [YEL, BLUE, PINK] },
  { a: "#2b1065", b: "#33157a", dots: "rgba(255,255,255,0.07)", shapes: [YEL, PINK, BLUE] },
];

/** Texte « autocollant » : lettres épaisses, contour noir, ombre décalée. */
const stk = (size: number, color = "#fff", stretch = 80): React.CSSProperties => ({
  fontFamily: FONT,
  fontStyle: "italic",
  fontWeight: 900,
  fontStretch: `${stretch}%`,
  fontSize: size,
  lineHeight: 0.95,
  textTransform: "uppercase",
  color,
  WebkitTextStroke: `${Math.max(4, size * 0.05)}px ${INK}`,
  paintOrder: "stroke fill",
  textShadow: `${size * 0.06}px ${size * 0.06}px 0 ${INK}`,
  whiteSpace: "nowrap",
  letterSpacing: "0.01em",
});

/** Mot qui « claque » : arrive en grand avec rotation, rebondit. */
const Slam: React.FC<{ f: number; at: number; style: React.CSSProperties; children: React.ReactNode; rot?: number }> = ({ f, at, style, children, rot = -4 }) => {
  const q = prog(f, at - 1, at + 9, eBack);
  return <span style={{ ...style, display: "inline-block", opacity: f < at - 1 ? 0 : 1, transform: `scale(${lerp(2.2, 1, Math.min(1, q)) * (q > 1 ? q : 1)}) rotate(${lerp(rot * 4, rot, Math.min(1, q))}deg)` }}>{children}</span>;
};
const Line: React.FC<{ top: number; children: React.ReactNode; gap?: number }> = ({ top, children, gap = 22 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap }}>{children}</div>
);

/** Formes qui flottent (étoiles, anneaux, gribouillis). */
const SHAPES = Array.from({ length: 16 }, (_, i) => ({ x: hash(i * 2.1) * 1080, y: hash(i * 3.7) * 1920, k: i % 4, s: 50 + hash(i * 5.3) * 80, sp: 0.4 + hash(i * 7.1), ph: hash(i * 9.9) * 6.28 }));
const Shape: React.FC<{ k: number; c: string; s: number }> = ({ k, c, s }) =>
  k === 0 ? (
    <svg width={s} height={s} viewBox="-50 -50 100 100"><path d="M0,-46 L13,-14 L46,-14 L19,7 L29,40 L0,20 L-29,40 L-19,7 L-46,-14 L-13,-14 Z" fill={c} stroke={INK} strokeWidth={6} strokeLinejoin="round" /></svg>
  ) : k === 1 ? (
    <svg width={s} height={s} viewBox="-50 -50 100 100"><circle r={34} fill="none" stroke={INK} strokeWidth={22} /><circle r={34} fill="none" stroke={c} strokeWidth={12} /></svg>
  ) : k === 2 ? (
    <svg width={s * 1.6} height={s} viewBox="0 0 160 100"><path d="M10 60 Q 35 10 60 60 T 110 60 T 150 50" fill="none" stroke={INK} strokeWidth={20} strokeLinecap="round" /><path d="M10 60 Q 35 10 60 60 T 110 60 T 150 50" fill="none" stroke={c} strokeWidth={10} strokeLinecap="round" /></svg>
  ) : (
    <svg width={s} height={s} viewBox="-50 -50 100 100"><path d="M-10,-40 H10 V-10 H40 V10 H10 V40 H-10 V10 H-40 V-10 H-10 Z" fill={c} stroke={INK} strokeWidth={6} strokeLinejoin="round" /></svg>
  );

const PopLayer: React.FC<{ f: number; th: Theme; speed: number }> = ({ f, th, speed }) => (
  <AbsoluteFill style={{ background: th.a }}>
    <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 0.35 * speed}deg at 50% 42%, ${th.a} 0deg 9deg, ${th.b} 9deg 18deg)` }} />
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${th.dots} 30%, transparent 32%)`, backgroundSize: "34px 34px", backgroundPosition: `${f * 0.6}px ${f * 0.4}px`, WebkitMaskImage: "radial-gradient(circle at 50% 42%, transparent 20%, #000 75%)", maskImage: "radial-gradient(circle at 50% 42%, transparent 20%, #000 75%)" }} />
    {SHAPES.map((s, i) => (
      <div key={i} style={{ position: "absolute", left: (s.x + f * s.sp * 0.8) % 1180 - 100, top: s.y + 30 * Math.sin(f / 30 + s.ph), transform: `rotate(${f * s.sp * 1.5 + s.ph * 50}deg) scale(${0.85 + 0.15 * Math.sin(f / 12 + s.ph)})`, opacity: 0.9 }}>
        <Shape k={s.k} c={th.shapes[i % 3]} s={s.s} />
      </div>
    ))}
  </AbsoluteFill>
);

/** Fond pop : rayons qui tournent, trame de points, formes ; nouvelle couleur en rond qui grandit à chaque coupe. */
const PopBg: React.FC<{ f: number; cuts: number[] }> = ({ f, cuts }) => {
  let i = 0;
  while (i < cuts.length && f >= cuts[i]) i++;
  const speed = 1 + cuts.reduce((s, c) => s + 4 * Math.exp(-Math.abs(f - c) / 6), 0);
  const prev = i > 0 ? THEMES[i - 1] : THEMES[0];
  const wipe = i > 0 ? prog(f, cuts[i - 1], cuts[i - 1] + 14, eInOut) : 1;
  return (
    <AbsoluteFill>
      <PopLayer f={f} th={prev} speed={speed} />
      {wipe < 1 || i > 0 ? (
        <AbsoluteFill style={{ clipPath: `circle(${wipe * 120}% at 50% 42%)` }}>
          <PopLayer f={f} th={THEMES[i]} speed={speed} />
        </AbsoluteFill>
      ) : null}
      {/* anneau d'onde sur la coupe */}
      {wipe < 1 ? <div style={{ position: "absolute", left: 540 - wipe * 1500, top: 806 - wipe * 1500, width: wipe * 3000, height: wipe * 3000, borderRadius: "50%", border: `24px solid ${INK}`, opacity: 1 - wipe }} /> : null}
    </AbsoluteFill>
  );
};

/* ---------- mascotte ---------- */
const TRACK: MascotKey[] = [
  { at: -20, x: 540, y: 2700, s: 0.9, rot: 30 },
  { at: 0, dur: 14, x: 540, y: 1930, s: 0.9, rot: 0 },
  { at: T.never, dur: 8, x: 540, y: 1925, s: 0.9, rot: -7 },
  { at: T.life, dur: 8, x: 540, y: 1930, s: 0.93, rot: 7 },
  { at: CUT.b - 4, dur: 14, x: 250, y: 1965, s: 0.62, rot: -8, hop: 220 },
  { at: T.kinetik, dur: 8, x: 250, y: 1955, s: 0.66, rot: 9 },
  { at: CUT.c - 4, dur: 14, x: 540, y: 2060, s: 1.05, rot: 0 },
  { at: T.you, dur: 10, x: 540, y: 2090, s: 1.15, rot: -5 },
  { at: CUT.d - 4, dur: 14, x: 850, y: 1975, s: 0.62, rot: 0, ry: 360, hop: 220 },
  { at: T.com, dur: 6, x: 850, y: 1965, s: 0.66, rot: -6, ry: 360 },
  { at: CUT.e - 2, dur: 14, x: 905, y: 2000, s: 0.42, rot: -6, ry: 360, hop: 160 },
  { at: T.motion, dur: 6, x: 905, y: 1990, s: 0.45, rot: 5, ry: 360 },
];

/* ---------- A : I've never edited a video in my life ---------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const x = prog(f, T.never + 4, T.never + 12, eExpo);
  return (
    <AbsoluteFill>
      <Line top={150}>
        <Slam f={f} at={T.ive} style={stk(120)}>I&apos;ve</Slam>
        <Slam f={f} at={T.never} style={stk(150, YEL)} rot={-6}>NEVER</Slam>
      </Line>
      <Line top={320}>
        <Slam f={f} at={T.edited} style={stk(118)} rot={3}>EDITED A VIDEO</Slam>
      </Line>
      <Line top={470}>
        <Slam f={f} at={T.life - 6} style={stk(130, PINK)} rot={-3}>IN MY LIFE.</Slam>
      </Line>
      {/* timeline de montage barrée */}
      <div style={{ position: "absolute", left: 130, right: 130, top: 650, padding: 22, borderRadius: 26, background: "#fff", border: `6px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, opacity: prog(f, T.edited, T.edited + 6), transform: `rotate(-3deg) scale(${lerp(0.7, 1, prog(f, T.edited, T.edited + 10, eBack))})` }}>
        {[0, 1].map((r) => (
          <div key={r} style={{ display: "flex", gap: 8, margin: "8px 0" }}>
            {[0, 1, 2, 3].map((c) => <div key={c} style={{ flex: 1 + hash(r * 4 + c), height: 46, borderRadius: 8, background: [BLUE, PINK, YEL, ORA][(r + c) % 4], border: `4px solid ${INK}` }} />)}
          </div>
        ))}
        {[14, -14].map((r) => (
          <div key={r} style={{ position: "absolute", left: -20, right: -20, top: "50%", height: 22, marginTop: -11, borderRadius: 11, background: INK, transform: `rotate(${r}deg) scaleX(${x})` }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B : Yet I made this one in seconds with Kinetik ---------- */
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const ph = prog(f, T.made - 2, T.made + 14, eBack);
  const secs = Math.min(3, Math.max(0, (f - T.this) / 30) * 1.6);
  const mini = trackPlace(TRACK, T.ive + 10 + (f % 60));
  return (
    <AbsoluteFill>
      <Line top={120}>
        <Slam f={f} at={T.yet} style={stk(110)}>YET I MADE</Slam>
      </Line>
      <Line top={260}>
        <Slam f={f} at={T.this} style={stk(150, YEL)} rot={-5}>THIS ONE</Slam>
      </Line>
      {/* la vidéo dans la vidéo */}
      <div style={{ position: "absolute", left: 560, top: 470, perspective: 1300 }}>
        <div style={{ transform: `rotateY(${lerp(-80, -14, Math.min(1, ph)) + 5 * Math.sin(f / 16)}deg) rotateZ(4deg) scale(${Math.min(1, ph)})`, opacity: Math.min(1, ph * 2), filter: `drop-shadow(14px 14px 0 ${INK})` }}>
          <Phone w={380} glow={0}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${380 / 1080})`, transformOrigin: "0 0", overflow: "hidden" }}>
              <PopLayer f={f} th={THEMES[0]} speed={1} />
              <div style={{ position: "absolute", top: 160, left: 0, right: 0, textAlign: "center" }}>
                <span style={stk(150, YEL)}>NEVER</span>
              </div>
              <Mascot f={f} voiceFrom={3} env={ENV20} place={{ ...mini, x: 540, y: 1930, s: 0.9 }} />
            </div>
          </Phone>
        </div>
      </div>
      <div style={{ position: "absolute", left: 520, top: 1240, display: "flex", alignItems: "center", gap: 18, opacity: prog(f, T.seconds - 4, T.seconds + 4) }}>
        <span style={stk(70)}>IN</span>
        <span style={{ padding: "10px 26px", borderRadius: 22, background: "#fff", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontSize: 80, color: INK, fontVariantNumeric: "tabular-nums" }}>{secs.toFixed(1)}s</span>
      </div>
      <div style={{ position: "absolute", left: 470, right: 0, top: 1430, opacity: prog(f, T.with, T.with + 6), transform: `scale(${lerp(0.5, 1, prog(f, T.kinetik, T.kinetik + 10, eBack))})` }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 28px", borderRadius: 26, background: INK, boxShadow: `8px 8px 0 #fff` }}>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: "#fff" }}>with</span>
          <KLogo f={f} at={T.kinetik} size={70} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- C : If I can do it, so can you ---------- */
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const burst = prog(f, T.you - 2, T.you + 14, eOut);
  return (
    <AbsoluteFill>
      <Line top={140}>
        <Slam f={f} at={T.if} style={stk(96)}>IF I CAN</Slam>
        <Slam f={f} at={T.do} style={stk(96, YEL)} rot={4}>DO IT,</Slam>
      </Line>
      <Line top={300}>
        <Slam f={f} at={T.so} style={stk(120, "#fff")} rot={-3}>SO CAN</Slam>
      </Line>
      {/* éclat autour de YOU */}
      {f >= T.you - 2 ? (
        <svg width={1080} height={700} viewBox="-540 -350 1080 700" style={{ position: "absolute", left: 0, top: 230, transform: `scale(${lerp(0.3, 1, burst)}) rotate(${f * 0.8}deg)` }}>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <path key={i} d={`M ${Math.cos(a - 0.08) * 120} ${Math.sin(a - 0.08) * 90} L ${Math.cos(a) * 520} ${Math.sin(a) * 330} L ${Math.cos(a + 0.08) * 120} ${Math.sin(a + 0.08) * 90} Z`} fill={i % 2 ? "#fff" : PINK} stroke={INK} strokeWidth={6} opacity={0.95} />;
          })}
        </svg>
      ) : null}
      <Line top={440}>
        <Slam f={f} at={T.you} style={{ ...stk(260, PINK, 75), textShadow: `16px 16px 0 ${INK}` }} rot={-6}>YOU!</Slam>
      </Line>
    </AbsoluteFill>
  );
};

/* ---------- D : Head to kinetik-app.com ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const url = "kinetik-app.com";
  const n = Math.round(lerp(0, url.length, prog(f, T.kinetik2, T.comEnd - 2, (x) => x)));
  return (
    <AbsoluteFill>
      <Line top={220}>
        <Slam f={f} at={T.head} style={stk(150)}>HEAD TO</Slam>
      </Line>
      <div style={{ position: "absolute", left: 60, right: 60, top: 470, padding: "34px 20px", borderRadius: 40, background: "#fff", border: `8px solid ${INK}`, boxShadow: `16px 16px 0 ${INK}`, textAlign: "center", opacity: prog(f, T.head + 3, T.head + 8), transform: `rotate(-2deg) scale(${lerp(0.6, 1, prog(f, T.head + 3, T.head + 12, eBack))})` }}>
        <span style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontStretch: "80%", fontSize: 108, color: INK }}>
          {url.slice(0, n)}
          <span style={{ opacity: Math.floor(f / 6) % 2 ? 0 : 1, color: PINK }}>|</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
export const Never: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = [CUT.b, CUT.c, CUT.d, CUT.e];
  const scene = (a: number, b: number) => f >= a - 1 && f < b + 1;
  const pop = (a: number, b: number): React.CSSProperties => {
    const i = prog(f, a, a + 8, eBack);
    const o = prog(f, b - 5, b, eInOut);
    return { opacity: 1 - o, transform: `scale(${lerp(0.7, 1, Math.min(1, i)) * (1 + o * 0.4)}) rotate(${(1 - Math.min(1, i)) * -8 + o * 8}deg)` };
  };
  const hits: [number, number][] = [[T.never, 14], [T.life, 8], [T.this, 14], [T.kinetik, 10], [T.you, 24], [T.head, 10]];
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const glitch = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 3), 0);
  const flash = f >= T.you ? 0.6 * Math.exp(-(f - T.you) / 2.5) : 0;
  return (
    <AbsoluteFill style={{ background: BLUE, overflow: "hidden" }}>
      <PopBg f={f} cuts={cuts} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)` }}>
        {scene(0, CUT.b) && (
          <AbsoluteFill style={pop(-10, CUT.b)}>
            <SceneA f={f} />
          </AbsoluteFill>
        )}
        {scene(CUT.b, CUT.c) && (
          <AbsoluteFill style={pop(CUT.b, CUT.c)}>
            <SceneB f={f} />
          </AbsoluteFill>
        )}
        {scene(CUT.c, CUT.d) && (
          <AbsoluteFill style={pop(CUT.c, CUT.d)}>
            <SceneC f={f} />
          </AbsoluteFill>
        )}
        {scene(CUT.d, CUT.e) && (
          <AbsoluteFill style={pop(CUT.d, CUT.e)}>
            <SceneD f={f} />
          </AbsoluteFill>
        )}
        {f >= CUT.e - 1 && (
          <AbsoluteFill style={pop(CUT.e, DURATION_FRAMES + 20)}>
            <CommentOutro f={f} a={CUT.e} t={T} c1={YEL} c2={PINK} glow="rgba(255,200,60,0.6)" box={{ borderRadius: 36, background: "#16122a", border: "6px solid #fff", boxShadow: `14px 14px 0 ${INK}` }} />
          </AbsoluteFill>
        )}
        <div style={{ position: "absolute", inset: 0, filter: `drop-shadow(14px 14px 0 rgba(17,16,24,0.85))` }}>
          <Mascot f={f} voiceFrom={3} env={ENV20} place={trackPlace(TRACK, f)} fade />
        </div>
      </AbsoluteFill>
      <Streaks f={f} amt={Math.min(1, glitch + shake / 40)} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 10, DURATION_FRAMES - 1, eInOut) }} />
      <Html5Audio src={staticFile("kinetik20/sfx/music.wav")} volume={0.28} />
      <Sequence from={3} layout="none">
        <Html5Audio src={staticFile("kinetik20/voice.wav")} volume={0.95} />
      </Sequence>
      {cuts.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={c - 3} src="whoosh" vol={0.2} />
          <Sfx at={c} src="pop" vol={0.18} />
        </React.Fragment>
      ))}
      {TRACK.filter((k) => k.hop).map((k, i) => (
        <Sfx key={`h${i}`} at={k.at + (k.dur ?? 10) - 2} src="pop" vol={0.12} />
      ))}
      {[T.ive, T.never, T.edited, T.life - 6].map((a, i) => (
        <Sfx key={`a${i}`} at={a} src={i === 1 ? "impact" : "click"} vol={i === 1 ? 0.2 : 0.18} />
      ))}
      <Sfx at={T.never + 6} src="glitch" vol={0.1} />
      <Sfx at={T.this} src="impact" vol={0.2} />
      {Array.from({ length: 8 }, (_, i) => (
        <Sfx key={`s${i}`} at={T.this + i * 3} src="tick" vol={0.08} />
      ))}
      <Sfx at={T.kinetik} src="shimmer" vol={0.24} />
      <Sfx at={T.if} src="click" vol={0.16} />
      <Sfx at={T.do} src="click" vol={0.16} />
      <Sfx at={T.so} src="click" vol={0.16} />
      <Sfx at={T.you - 4} src="riser" vol={0.12} />
      <Sfx at={T.you} src="drop" vol={0.26} />
      <Sfx at={T.head} src="impact" vol={0.16} />
      {Array.from({ length: 15 }, (_, i) => (
        <Sfx key={`k${i}`} at={T.kinetik2 + i * 2} src="key" vol={0.18} />
      ))}
      <CommentOutroSfx t={T} />
    </AbsoluteFill>
  );
};
