import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eExpo, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { CYAN, FONT, FictionalSite, GridFloor, KinetikGlyph, LAV, SANS, SiteH, SiteW, Streaks, Wireframe, rgb } from "./parts";
import { DURATION_FRAMES, T, VO } from "./timing";

loadViewzFonts();
loadFonts();

// Coupures (transitions glitch)
const B1 = T.im - 2;
const B2 = T.for - 1;
const B3 = T.with - 2;
const B4 = T.in - 2;
const B5 = T.end;
const CUTS = [B1, B2, B3, B4, B5];
const HITS: [number, number][] = [
  [T.day, 14],
  [T.two, 26],
  [T.kinetik, 16],
  [T.five, 28],
  [T.seconds, 10],
];

const heavy = (size: number, color = "#fff", stretch = 100): React.CSSProperties => ({
  fontFamily: FONT,
  fontStyle: "italic",
  fontWeight: 900,
  fontStretch: `${stretch}%`,
  fontSize: size,
  lineHeight: 0.9,
  textTransform: "uppercase",
  color,
  whiteSpace: "nowrap",
  letterSpacing: "-0.02em",
});
const sans = (size: number, color = "#fff"): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1.05,
  color,
  whiteSpace: "nowrap",
  letterSpacing: "-0.02em",
});

// Apparition d'un mot : zoom arrière + flou + aberration chromatique
const Pop: React.FC<{ f: number; at: number; style: React.CSSProperties; children: React.ReactNode; glow?: string }> = ({ f, at, style, children, glow }) => {
  if (f < at) return <span style={{ ...style, opacity: 0 }}>{children}</span>;
  const q = prog(f, at, at + 7, eExpo);
  const ab = (1 - q) * 14;
  return (
    <span
      style={{
        ...style,
        display: "inline-block",
        opacity: prog(f, at, at + 2),
        transform: `scale(${lerp(1.45, 1, q)})`,
        filter: q < 0.97 ? `blur(${(1 - q) * 9}px)` : undefined,
        textShadow: [rgb(ab), glow ? `0 0 40px ${glow}` : undefined].filter(Boolean).join(", ") || undefined,
      }}
    >
      {children}
    </span>
  );
};

// Sortie de scène : grossit, se floute, disparaît
const exitStyle = (f: number, at: number, len = 4): React.CSSProperties => {
  const o = prog(f, at - len, at, eInOut);
  return { opacity: 1 - o, transform: `scale(${1 + o * 0.25}) translateX(${o * (hash(Math.floor(f)) - 0.5) * 60}px)`, filter: o > 0.02 ? `blur(${o * 14}px)` : undefined };
};

export const Kinetik2: React.FC = () => {
  const f = useCurrentFrame();

  const glitch = CUTS.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const shake = HITS.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const sx = (hash(f * 3) - 0.5) * shake;
  const sy = (hash(f * 3 + 1) - 0.5) * shake;
  const flash = Math.max(...[T.two, T.five].map((h) => (f >= h ? Math.exp(-(f - h) / 2.2) : 0)), f >= T.kinetik ? 0.45 * Math.exp(-(f - T.kinetik) / 2) : 0);
  const purple = prog(f, B3, B3 + 4) * (1 - prog(f, B4 - 3, B4));
  const beat = f >= T.im && f < B5 ? Math.exp(-((f - T.im) % 13) / 4) : 0;

  return (
    <AbsoluteFill style={{ background: "#03080a", overflow: "hidden" }}>
      {/* ---------- fond ---------- */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(40,170,185,${0.2 + beat * 0.08}) 0%, transparent 42%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 46%, rgba(130,90,255,0.45) 0%, rgba(60,30,140,0.25) 35%, transparent 70%)", opacity: purple }} />
      <GridFloor f={f} tint={purple > 0.5 ? "rgba(170,150,255,0.5)" : "rgba(94,230,242,0.42)"} />

      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        {f < B1 && <SceneDay f={f} />}
        {f >= B1 - 1 && f < B3 && <SceneCreate f={f} />}
        {f >= B3 && f < B4 && <SceneKinetik f={f} />}
        {f >= B4 && f < B5 && <SceneFive f={f} />}
        {f >= B5 && <SceneResult f={f} />}
      </AbsoluteFill>

      {/* ---------- effets globaux ---------- */}
      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(0.85, flash) * 0.85, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 30} />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 8, DURATION_FRAMES - 1, eInOut) }} />

      <Sounds />
    </AbsoluteFill>
  );
};

// ---------------- Scène 1 : DAY 2 ----------------
const SceneDay: React.FC<{ f: number }> = ({ f }) => {
  const bgOn = prog(f, T.two, T.two + 6);
  return (
    <AbsoluteFill style={exitStyle(f, B1)}>
      {/* motif DAY 2 en contour */}
      <AbsoluteFill style={{ opacity: bgOn * 0.9 }}>
        {Array.from({ length: 9 }).map((_, r) => (
          <div
            key={r}
            style={{
              ...heavy(230, "transparent"),
              position: "absolute",
              top: r * 215 - 40,
              left: -400 + (r % 2 ? -1 : 1) * (f * 4) - (r % 2) * 300,
              WebkitTextStroke: "2px rgba(94,230,242,0.14)",
            }}
          >
            DAY 2 · DAY 2 · DAY 2 · DAY 2 ·
          </div>
        ))}
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "0.4em", color: CYAN, opacity: prog(f, 0, 8) }}>
        KINETIK CHALLENGE
      </div>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center" }}>
        <Pop f={f} at={T.day} style={heavy(260)}>
          DAY
        </Pop>
      </div>
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, textAlign: "center" }}>
        <Pop f={f} at={T.two} style={{ ...heavy(900, CYAN), lineHeight: 1 }} glow="rgba(94,230,242,0.55)">
          2
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Scène 2 : creating a motion graphic / fictional website ----------------
const SceneCreate: React.FC<{ f: number }> = ({ f }) => {
  // écran 3D
  const inQ = prog(f, T.motion - 4, T.motion + 14, eExpo);
  const out = prog(f, B3 - 4, B3, eInOut);
  const scan = prog(f, T.fictional, T.website + 10, eInOut);
  const pct = Math.min(100, Math.round(scan * 100));
  const ry = lerp(-34, -14, inQ) + Math.sin(f / 18) * 3 + out * 30;
  const rx = 10 + Math.sin(f / 23) * 2;
  const z = lerp(-900, 0, inQ) + out * 700;
  const blockA = f < B2;
  return (
    <AbsoluteFill>
      {/* sous-titres */}
      {blockA ? (
        <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", ...exitStyle(f, B2, 3) }}>
          <div style={{ display: "flex", gap: 26 }}>
            <Pop f={f} at={T.im} style={sans(118)}>
              I&apos;m
            </Pop>
            <Pop f={f} at={T.creating} style={sans(118)}>
              creating
            </Pop>
          </div>
          <Pop f={f} at={T.a} style={{ ...sans(62), marginTop: 6 }}>
            a
          </Pop>
          <Pop f={f} at={T.motion} style={{ ...heavy(196, CYAN, 82), marginTop: 6 }} glow="rgba(94,230,242,0.5)">
            MOTION
          </Pop>
          <Pop f={f} at={T.graphic} style={heavy(196, "#fff", 82)}>
            GRAPHIC
          </Pop>
        </div>
      ) : (
        <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", ...exitStyle(f, B3) }}>
          <div style={{ display: "flex", gap: 24 }}>
            <Pop f={f} at={T.for} style={sans(112)}>
              for
            </Pop>
            <Pop f={f} at={T.a2} style={sans(112)}>
              a
            </Pop>
            <Pop f={f} at={T.fictional} style={sans(112)}>
              fictional
            </Pop>
          </div>
          <Pop f={f} at={T.website} style={{ ...heavy(232, CYAN, 82), marginTop: 18 }} glow="rgba(94,230,242,0.5)">
            WEBSITE
          </Pop>
        </div>
      )}

      {/* écran flottant */}
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 1150px" }}>
        <div
          style={{
            position: "absolute",
            left: 540 - SiteW / 2,
            top: 1150 - SiteH / 2,
            width: SiteW,
            transformStyle: "preserve-3d",
            transform: `translate3d(0, ${(1 - inQ) * 260}px, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`,
          }}
        >
          <div
            style={{
              position: "relative",
              width: SiteW,
              height: SiteH,
              borderRadius: 24,
              overflow: "hidden",
              border: `2px solid rgba(94,230,242,0.8)`,
              boxShadow: `0 0 50px rgba(94,230,242,${0.35 + scan * 0.2}), 0 40px 80px rgba(0,0,0,0.6)`,
              opacity: prog(f, T.motion - 4, T.motion + 4) * (1 - out),
              filter: out > 0.02 ? `blur(${out * 12}px)` : undefined,
            }}
          >
            <Wireframe />
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - scan) * 100}% 0 0)` }}>
              <FictionalSite />
            </div>
            {scan > 0 && scan < 1 && (
              <div style={{ position: "absolute", top: -20, bottom: -20, left: scan * SiteW - 3, width: 6, background: "#eaffff", boxShadow: `0 0 24px 8px ${CYAN}, 0 0 80px 20px rgba(94,230,242,0.5)` }} />
            )}
          </div>
          {/* barre de génération */}
          <div style={{ marginTop: 34, padding: "0 30px", opacity: prog(f, T.for - 2, T.for + 4) * (1 - out) }}>
            <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <div style={{ width: `${scan * 100}%`, height: "100%", background: `linear-gradient(90deg, ${CYAN}, ${LAV})`, boxShadow: `0 0 16px ${CYAN}` }} />
            </div>
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: "0.12em", color: CYAN }}>
              <span>{pct >= 100 ? "DONE" : "GENERATING"}</span>
              <span style={{ color: "#fff" }}>{pct}%</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- Scène 3 : with Kinetik ----------------
const SceneKinetik: React.FC<{ f: number }> = ({ f }) => {
  const q = prog(f, T.kinetik, T.kinetik + 8, eExpo);
  const ab = (1 - q) * 18 + (f >= T.kinetik ? 3 : 0);
  return (
    <AbsoluteFill style={exitStyle(f, B4)}>
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center" }}>
        <Pop f={f} at={T.with} style={sans(84, "#e4dcff")}>
          with
        </Pop>
      </div>
      <div
        style={{
          position: "absolute",
          top: 880,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          opacity: prog(f, T.kinetik, T.kinetik + 2),
          transform: `scale(${lerp(1.6, 1, q) * (1 + (f - T.kinetik) * 0.002)})`,
          filter: q < 0.97 ? `blur(${(1 - q) * 12}px)` : undefined,
        }}
      >
        <div style={{ filter: `drop-shadow(${-ab}px 0 0 rgba(255,40,90,0.6)) drop-shadow(${ab}px 0 0 rgba(40,240,255,0.6)) drop-shadow(0 0 24px rgba(196,181,255,0.8))` }}>
          <KinetikGlyph size={170} f={f} />
        </div>
        <span
          style={{
            ...sans(176),
            letterSpacing: "-0.04em",
            background: `linear-gradient(180deg, #ffffff 10%, ${LAV} 100%)`,
            WebkitBackgroundClip: "text",
            color: "transparent",
            filter: `drop-shadow(${-ab}px 0 0 rgba(255,40,90,0.6)) drop-shadow(${ab}px 0 0 rgba(40,240,255,0.6)) drop-shadow(0 0 30px rgba(170,140,255,0.7))`,
          }}
        >
          Kinetik
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Scène 4 : in literally 5 seconds ----------------
const SceneFive: React.FC<{ f: number }> = ({ f }) => {
  const R = 300;
  const C = 2 * Math.PI * R;
  const p = prog(f, T.in, T.five, (x) => x);
  const five = f >= T.five;
  const pulse = five ? Math.exp(-(f - T.five) / 5) : 0;
  return (
    <AbsoluteFill style={exitStyle(f, B5)}>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 24 }}>
        <Pop f={f} at={T.in} style={sans(112)}>
          in
        </Pop>
        <Pop f={f} at={T.literally} style={sans(112)}>
          literally
        </Pop>
      </div>
      {/* anneau */}
      <div style={{ position: "absolute", left: 540 - R - 30, top: 1000 - R - 30, width: 2 * R + 60, height: 2 * R + 60, opacity: prog(f, B4, B4 + 5), transform: `scale(${lerp(0.7, 1, prog(f, B4, B4 + 10, eExpo)) * (1 + pulse * 0.08)}) rotate(-90deg)` }}>
        <svg width={2 * R + 60} height={2 * R + 60} viewBox={`${-R - 30} ${-R - 30} ${2 * R + 60} ${2 * R + 60}`}>
          <circle r={R} fill="none" stroke="rgba(94,230,242,0.13)" strokeWidth={22} />
          <circle
            r={R}
            fill="none"
            stroke={CYAN}
            strokeWidth={22}
            strokeLinecap="round"
            strokeDasharray={`${C * (five ? 1 : p)} ${C}`}
            style={{ filter: `drop-shadow(0 0 ${14 + pulse * 30}px ${CYAN})` }}
          />
        </svg>
      </div>
      {!five && (
        <div style={{ position: "absolute", top: 1000 - 70, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 120, color: "rgba(255,255,255,0.25)", opacity: prog(f, B4 + 4, B4 + 10) }}>
          {(p * 5).toFixed(1)}s
        </div>
      )}
      <div style={{ position: "absolute", top: 1000 - 330, left: 0, right: 0, textAlign: "center" }}>
        <Pop f={f} at={T.five} style={{ ...heavy(600), lineHeight: 1.1 }} glow="rgba(255,255,255,0.35)">
          5
        </Pop>
      </div>
      <div style={{ position: "absolute", top: 1380, left: 0, right: 0, textAlign: "center" }}>
        <Pop f={f} at={T.seconds} style={heavy(200, CYAN, 90)} glow="rgba(94,230,242,0.55)">
          SECONDS
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Scène 5 : le résultat ----------------
const SceneResult: React.FC<{ f: number }> = ({ f }) => {
  const q = prog(f, B5, B5 + 14, eExpo);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "0.4em", color: CYAN, opacity: prog(f, B5 + 2, B5 + 8) }}>
        KINETIK CHALLENGE
      </div>
      <div style={{ position: "absolute", top: 370, left: 0, right: 0, textAlign: "center" }}>
        <Pop f={f} at={B5 + 2} style={heavy(170)}>
          DAY <span style={{ color: CYAN }}>2</span>
        </Pop>
      </div>
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 1000px" }}>
        <div
          style={{
            position: "absolute",
            left: 540 - SiteW / 2,
            top: 1000 - SiteH / 2,
            width: SiteW,
            height: SiteH,
            borderRadius: 24,
            overflow: "hidden",
            border: "2px solid rgba(94,230,242,0.8)",
            boxShadow: "0 0 60px rgba(94,230,242,0.45), 0 50px 90px rgba(0,0,0,0.6)",
            opacity: prog(f, B5, B5 + 4),
            transform: `translate3d(0, ${(1 - q) * 120}px, ${(1 - q) * -900}px) rotateX(${8 + Math.sin(f / 20) * 2}deg) rotateY(${lerp(25, -6, q) + Math.sin(f / 16) * 3}deg)`,
            filter: q < 0.95 ? `blur(${(1 - q) * 10}px)` : undefined,
          }}
        >
          <FictionalSite />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${lerp(-30, 130, prog(f, B5 + 10, B5 + 34, eInOut))}%, rgba(255,255,255,0.18) ${lerp(-20, 140, prog(f, B5 + 10, B5 + 34, eInOut))}%, transparent ${lerp(-10, 150, prog(f, B5 + 10, B5 + 34, eInOut))}%)` }} />
        </div>
      </AbsoluteFill>
      {/* chevrons */}
      <div style={{ position: "absolute", top: 1440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: prog(f, B5 + 10, B5 + 16) }}>
        {[0, 1, 2].map((i) => {
          const a = 0.25 + 0.75 * Math.max(0, Math.sin((f - B5) / 4 - i * 0.9));
          return (
            <svg key={i} width={120} height={56} viewBox="0 0 120 56" style={{ marginTop: -14, opacity: a, filter: `drop-shadow(0 0 12px ${CYAN})` }}>
              <polyline points="14,10 60,46 106,10" fill="none" stroke={CYAN} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Son ----------------
const Sfx: React.FC<{ at: number; src: string; vol: number; dur?: number }> = ({ at, src, vol, dur }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={dur} layout="none">
    <Html5Audio src={staticFile(`kinetik2/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

const Sounds: React.FC = () => (
  <>
    <Html5Audio src={staticFile("kinetik2/sfx/music.wav")} volume={0.4} />
    <Sequence from={VO} layout="none">
      <Html5Audio src={staticFile("kinetik2/voice.wav")} volume={0.9} />
    </Sequence>
    <Sfx at={T.day} src="impact" vol={0.26} />
    <Sfx at={T.two} src="drop" vol={0.3} />
    <Sfx at={T.two} src="glitch" vol={0.18} />
    <Sfx at={B1 - 3} src="whoosh" vol={0.25} />
    <Sfx at={B1} src="glitch" vol={0.16} />
    <Sfx at={T.motion} src="pop" vol={0.2} />
    <Sfx at={B2} src="glitch" vol={0.12} />
    <Sfx at={T.fictional} src="scan" vol={0.28} />
    {Array.from({ length: 9 }).map((_, i) => (
      <Sfx key={i} at={T.fictional + 2 + i * 3} src="tick" vol={0.1} />
    ))}
    <Sfx at={T.website} src="pop" vol={0.22} />
    <Sfx at={B3 - 3} src="whoosh" vol={0.25} />
    <Sfx at={B3} src="glitch" vol={0.16} />
    <Sfx at={T.kinetik} src="impact" vol={0.26} />
    <Sfx at={T.kinetik} src="shimmer" vol={0.35} />
    <Sfx at={B4} src="glitch" vol={0.14} />
    {Array.from({ length: 6 }).map((_, i) => (
      <Sfx key={`t${i}`} at={T.in + i * 4} src="tick" vol={0.12} />
    ))}
    <Sfx at={T.five - 30} src="riser" vol={0.25} />
    <Sfx at={T.five} src="drop" vol={0.36} />
    <Sfx at={T.seconds} src="impact" vol={0.25} />
    <Sfx at={B5} src="glitch" vol={0.16} />
    <Sfx at={B5 + 1} src="whoosh" vol={0.25} />
    <Sfx at={B5 + 4} src="shimmer" vol={0.3} />
  </>
);
