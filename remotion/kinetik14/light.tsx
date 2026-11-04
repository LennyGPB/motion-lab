import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile } from "remotion";
import { eBack, eExpo, eInOut, hash, lerp, prog } from "../viewz/util";
import { SANS } from "../kinetik2/parts";
import { Pop, Row, caps, heavy, sans } from "../kinetik3/Kinetik3";

/* ---------- habillage « clair » des pubs Kinetik Resto ---------- */
export const INK = "#1a0f24";
export const SOFT = "#6b5b7a";
export const OR = "#ff5a1f";
export const PU = "#7c3aed";
export const card: React.CSSProperties = { borderRadius: 32, background: "rgba(255,255,255,0.92)", border: "1px solid rgba(124,58,237,0.12)", boxShadow: "0 30px 70px rgba(60,20,90,0.16), 0 4px 14px rgba(60,20,90,0.08)" };
export const grad = { background: `linear-gradient(90deg, ${OR}, #ff2d6f 50%, ${PU})`, WebkitBackgroundClip: "text", color: "transparent" } as React.CSSProperties;

/** Fond blanc + ruban lumineux orange/violet à bord net, qui ondule (inspiré de la référence). */
export const SilkBg: React.FC<{ f: number; phase?: number }> = ({ f, phase = 0 }) => {
  const t = f / 30 + phase;
  const p = (a: number, b: number, s: number, o: number) => a + b * Math.sin(t * s + o);
  // courbe du bord net : d'en bas à gauche vers en haut à droite
  const x0 = p(-60, 40, 0.3, 0), y0 = p(1850, 40, 0.25, 1);
  const c1x = p(420, 120, 0.22, 2), c1y = p(1500, 120, 0.3, 0.5);
  const c2x = p(760, 120, 0.27, 4), c2y = p(900, 140, 0.2, 2);
  const x1 = p(1140, 30, 0.2, 3), y1 = p(220, 80, 0.24, 1);
  const edge = `M ${x0} ${y0} C ${c1x} ${c1y} ${c2x} ${c2y} ${x1} ${y1}`;
  const region = `${edge} L ${x1} -200 L -200 -200 L -200 ${y0} Z`;
  const gx = p(470, 110, 0.18, 1), gy = p(980, 160, 0.21, 2);
  // second ruban plus discret en haut à gauche
  const e2 = `M ${p(-100, 30, 0.2, 2)} ${p(620, 60, 0.25, 0)} C ${p(250, 80, 0.3, 1)} ${p(420, 60, 0.2, 3)} ${p(520, 80, 0.25, 2)} ${p(160, 50, 0.3, 4)} ${p(760, 40, 0.2, 1)} -60`;
  return (
    <AbsoluteFill style={{ background: "#fbfafd" }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="silkWarm" cx={gx} cy={gy} r={620} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff3d12" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="#ff6a2b" stopOpacity="0.75" />
            <stop offset="0.7" stopColor="#ffb08a" stopOpacity="0.25" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="silkEdge" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#6d28d9" />
            <stop offset="0.45" stopColor="#c026d3" />
            <stop offset="0.75" stopColor="#ff3d12" />
            <stop offset="1" stopColor="#ffb08a" stopOpacity="0.3" />
          </linearGradient>
          <filter id="silkB1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="55" />
          </filter>
          <filter id="silkB2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          <filter id="silkB3">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <clipPath id="silkClip">
            <path d={region} />
          </clipPath>
        </defs>
        {/* halo chaud, coupé net par le bord du ruban */}
        <g clipPath="url(#silkClip)">
          <rect x={-200} y={-200} width={1500} height={2400} fill="url(#silkWarm)" filter="url(#silkB1)" />
        </g>
        {/* lueur violette sous le bord */}
        <path d={edge} stroke="#8b5cf6" strokeWidth={150} fill="none" opacity={0.45} filter="url(#silkB1)" transform="translate(40 50)" />
        <path d={edge} stroke="#a855f7" strokeWidth={50} fill="none" opacity={0.5} filter="url(#silkB2)" transform="translate(14 18)" />
        {/* bord net */}
        <path d={edge} stroke="url(#silkEdge)" strokeWidth={9} fill="none" filter="url(#silkB3)" />
        {/* second ruban discret */}
        <path d={e2} stroke="#ff8a5c" strokeWidth={90} fill="none" opacity={0.25} filter="url(#silkB1)" />
        <path d={e2} stroke="#ffb08a" strokeWidth={4} fill="none" opacity={0.5} filter="url(#silkB3)" />
      </svg>
      {/* voile blanc pour la lisibilité du texte en haut */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(251,250,253,0.82) 0%, rgba(251,250,253,0.35) 30%, rgba(251,250,253,0) 55%)" }} />
    </AbsoluteFill>
  );
};

/** Logo Kinetik pour fond clair (sphère en tranches dégradée + mot sombre). */
export const LogoDark: React.FC<{ f: number; at: number; size: number; suffix?: string }> = ({ f, at, size, suffix }) => {
  const q = prog(f, at, at + 8, eExpo);
  const rows = 9;
  const R = 50;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: size * 0.16, opacity: prog(f, at, at + 2), transform: `scale(${lerp(1.5, 1, q)})`, filter: q < 0.97 ? `blur(${(1 - q) * 10}px)` : undefined }}>
      <svg width={size} height={size} viewBox="-60 -60 120 120">
        <defs>
          <linearGradient id="kgD" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={OR} />
            <stop offset="1" stopColor={PU} />
          </linearGradient>
        </defs>
        {Array.from({ length: rows }).map((_, i) => {
          const y = (i - (rows - 1) / 2) * 11.5;
          const hw = Math.sqrt(Math.max(0, R * R - y * y));
          const sh = Math.sin(f / 6 + i * 0.8) * 4;
          return (
            <g key={i}>
              <rect x={-hw + 8 + sh} y={y - 3.2} width={Math.max(2, hw * 2 - 16)} height={6.4} rx={3.2} fill="url(#kgD)" />
              <circle cx={-hw - 1 + sh} cy={y} r={2.6} fill="url(#kgD)" />
            </g>
          );
        })}
      </svg>
      <span style={{ ...sans(size * 1.03, INK), letterSpacing: "-0.04em" }}>Kinetik</span>
      {suffix ? <span style={{ padding: `${size * 0.08}px ${size * 0.22}px`, borderRadius: 999, background: `linear-gradient(135deg, ${OR}, ${PU})`, ...sans(size * 0.45, "#fff"), marginLeft: size * 0.05 }}>{suffix}</span> : null}
    </div>
  );
};

export const Sfx: React.FC<{ at: number; src: string; vol: number }> = ({ at, src, vol }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Html5Audio src={staticFile(`kinetik3/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

/** Habillage commun : fond soie, secousse légère, flash, musique/voix, whooshs de coupe. */
export const LightShell: React.FC<{ f: number; frames: number; dir: string; cuts: number[]; hits: [number, number][]; flashes: number[]; children: React.ReactNode; sfx?: React.ReactNode; phase?: number }> = ({ f, frames, dir, cuts, hits, flashes, children, sfx, phase }) => {
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const flash = Math.max(0, ...flashes.map((h) => (f >= h ? 0.6 * Math.exp(-(f - h) / 2.5) : 0)));
  const cut = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 5), 0);
  return (
    <AbsoluteFill style={{ background: "#fbfafd", overflow: "hidden" }}>
      <SilkBg f={f} phase={phase} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)`, filter: cut > 0.05 ? `blur(${cut * 6}px)` : undefined }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ background: "#fff", opacity: prog(f, frames - 10, frames - 1, eInOut) }} />
      <Html5Audio src={staticFile(`${dir}/sfx/music.wav`)} volume={0.3} />
      <Sequence from={3} layout="none">
        <Html5Audio src={staticFile(`${dir}/voice.wav`)} volume={0.92} />
      </Sequence>
      {cuts.map((c, i) => (
        <Sfx key={`c${i}`} at={c - 3} src="whoosh" vol={0.18} />
      ))}
      {sfx}
    </AbsoluteFill>
  );
};

/** Téléphone clair. */
export const PhoneL: React.FC<{ w: number; children?: React.ReactNode }> = ({ w, children }) => (
  <div style={{ width: w, height: w * 2, borderRadius: w * 0.15, border: "7px solid #1a0f24", background: "#fff", boxShadow: "0 40px 80px rgba(60,20,90,0.3)", position: "relative", overflow: "hidden" }}>
    {children}
    <div style={{ position: "absolute", top: 12, left: "50%", width: w * 0.3, height: 20, marginLeft: -w * 0.15, borderRadius: 10, background: "#1a0f24" }} />
  </div>
);

/** Mini vidéo « resto » (plat, titre, prix) — contenu générique. */
export const DishReel: React.FC<{ f: number; w: number; t0: number; emoji: string; title: string; sub: string; tint?: string }> = ({ f, w, t0, emoji, title, sub, tint = OR }) => {
  const k = Math.max(0, f - t0);
  const beat = Math.exp(-(k % 14) / 4);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, #fff3ea, #ffd9c2 55%, ${tint}55)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: "18%", textAlign: "center", fontSize: w * 0.42, transform: `scale(${1 + 0.06 * beat}) rotate(${Math.sin(k / 20) * 6}deg)` }}>{emoji}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: "60%", textAlign: "center", ...heavy(w * 0.13, INK, 85) }}>{title}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: "73%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: w * 0.06, color: SOFT }}>{sub}</div>
      <div style={{ position: "absolute", left: "50%", bottom: "7%", transform: "translateX(-50%)", padding: `${w * 0.02}px ${w * 0.05}px`, borderRadius: 999, background: tint, fontFamily: SANS, fontWeight: 800, fontSize: w * 0.05, color: "#fff" }}>Chez Lou</div>
    </AbsoluteFill>
  );
};

const NAMES = ["@lena.design", "@maxbuilds", "@studio.kai", "@julia.app", "@noah.creates"];
const AV = ["#ff5a1f", "#a855f7", "#ffb347", "#f472b6", "#fb923c"];

/** Fin claire « Comment MOTION ». */
export const LightCommentOutro: React.FC<{ f: number; a: number; t: { comment: number; motion: number; the: number; five: number; get: number; discount: number; dms: number; end: number } }> = ({ f, a, t }) => (
  <AbsoluteFill>
    <Row top={130} gap={18} style={{ alignItems: "center" }}>
      <Pop f={f} at={t.comment} style={sans(68, INK)}>Comment</Pop>
      <Pop f={f} at={t.motion} style={{ ...heavy(108, OR, 82), ...grad }}>“MOTION”</Pop>
    </Row>
    <Row top={300} gap={18} style={{ alignItems: "center" }}>
      <Pop f={f} at={t.the} style={sans(64, INK)}>the first</Pop>
      <Pop f={f} at={t.five} style={heavy(110, INK, 88)}>5</Pop>
      <Pop f={f} at={t.get} style={sans(64, INK)}>get a</Pop>
    </Row>
    <Row top={430} gap={18} style={{ alignItems: "center" }}>
      <Pop f={f} at={t.discount} style={heavy(100, PU, 85)}>DISCOUNT</Pop>
      <Pop f={f} at={t.dms - 6} style={sans(60, INK)}>in their DMs!</Pop>
    </Row>
    <div style={{ position: "absolute", left: 90, right: 90, top: 620, padding: "26px 30px", ...card, opacity: prog(f, a, a + 10), transform: `translateY(${(1 - prog(f, a, a + 16, eExpo)) * 200}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", ...caps(22, PU), letterSpacing: "0.2em", marginBottom: 10 }}>
        <span>comments</span>
        <span>{Math.min(5, Math.max(0, Math.floor((f - t.motion) / 4) + 1))} / 5</span>
      </div>
      {NAMES.map((n, i) => {
        const at = t.motion + i * 4;
        const q = prog(f, at, at + 8, eBack);
        const dm = f >= t.discount + i * 4;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 0", borderTop: i ? "1px solid rgba(26,15,36,0.07)" : undefined, opacity: f >= at ? Math.min(1, q * 1.5) : 0.25 }}>
            <span style={{ ...heavy(38, OR, 90), width: 40 }}>{i + 1}</span>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: f >= at ? `linear-gradient(135deg, ${AV[i]}, ${PU})` : "rgba(26,15,36,0.08)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, color: SOFT }}>{f >= at ? n : "your spot"}</div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: INK }}>{f >= at ? "MOTION" : "…"}</div>
            </div>
            {dm ? <span style={{ padding: "8px 16px", borderRadius: 999, background: `linear-gradient(135deg, ${OR}, ${PU})`, ...caps(17, "#fff"), letterSpacing: "0.1em", transform: `scale(${prog(f, t.discount + i * 4, t.discount + i * 4 + 8, eBack)})` }}>🎁 dm sent</span> : null}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: prog(f, t.end, t.end + 10) }}>
      <LogoDark f={f} at={t.end} size={90} suffix="Resto" />
      <div style={{ ...caps(26, PU), letterSpacing: "0.25em" }}>kinetik-app.com</div>
    </div>
  </AbsoluteFill>
);

export const LightOutroSfx: React.FC<{ t: { motion: number; discount: number; end: number } }> = ({ t }) => (
  <>
    {[0, 1, 2, 3, 4].map((i) => (
      <Sfx key={`m${i}`} at={t.motion + i * 4} src="pop" vol={0.13} />
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <Sfx key={`d${i}`} at={t.discount + i * 4} src="tick" vol={0.12} />
    ))}
    <Sfx at={t.end} src="shimmer" vol={0.24} />
  </>
);
