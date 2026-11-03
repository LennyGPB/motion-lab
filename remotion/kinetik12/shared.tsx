import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile } from "remotion";
import { eBack, eExpo, eInOut, hash, prog } from "../viewz/util";
import { SANS, Streaks } from "../kinetik2/parts";
import { KLogo, Pop, Row, caps, heavy, sans } from "../kinetik3/Kinetik3";
import { FlutedBg } from "../kinetik8/FlutedBg";

/* Habillage commun des pubs Kinetik « verre cannelé » (orange / violet). */
export const OR = "#ff6a2b";
export const AMB = "#ffb347";
export const glowO = "rgba(255,106,43,0.6)";
export const panel: React.CSSProperties = { borderRadius: 36, background: "rgba(12,6,18,0.82)", border: "1.5px solid rgba(255,170,120,0.35)", boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 40px rgba(255,106,43,0.25)" };
const NAMES = ["@lena.design", "@maxbuilds", "@studio.kai", "@julia.app", "@noah.creates"];
const AV = ["#ff6a2b", "#a855f7", "#ffb347", "#f472b6", "#fb923c"];

export const Sfx: React.FC<{ at: number; src: string; vol: number }> = ({ at, src, vol }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Html5Audio src={staticFile(`kinetik3/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

/** Fond + secousse + glitchs + flash + vignette + musique/voix + whooshs de coupe. */
export const FlutedShell: React.FC<{
  f: number;
  frames: number;
  dir: string;
  cuts: number[];
  hits: [number, number][];
  flashes: number[];
  speedUpAt?: number;
  children: React.ReactNode;
  sfx?: React.ReactNode;
}> = ({ f, frames, dir, cuts, hits, flashes, speedUpAt = 0, children, sfx }) => {
  const glitch = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const flash = Math.max(0, ...flashes.map((h) => (f >= h ? 0.7 * Math.exp(-(f - h) / 2.2) : 0)));
  return (
    <AbsoluteFill style={{ background: "#07030c", overflow: "hidden" }}>
      <FlutedBg heat={0.8 + 0.2 * Math.sin(f / 40)} speed={1 + 0.6 * prog(f, speedUpAt, speedUpAt + 20)} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,2,10,0.75) 0%, rgba(5,2,10,0.25) 38%, rgba(5,2,10,0.2) 62%, rgba(5,2,10,0.7) 100%)" }} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)` }}>{children}</AbsoluteFill>
      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, frames - 10, frames - 1, eInOut) }} />
      <Html5Audio src={staticFile(`${dir}/sfx/music.wav`)} volume={0.3} />
      <Sequence from={3} layout="none">
        <Html5Audio src={staticFile(`${dir}/voice.wav`)} volume={0.92} />
      </Sequence>
      {cuts.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={c - 3} src="whoosh" vol={0.18} />
          <Sfx at={c} src="glitch" vol={0.1} />
        </React.Fragment>
      ))}
      {sfx}
    </AbsoluteFill>
  );
};

/** Fin commune : « Comment MOTION: the first 5 get a discount in their DMs! » + 5 commentaires + DM + logo. */
export const CommentOutro: React.FC<{ f: number; a: number; t: { comment: number; motion: number; the: number; five: number; get: number; discount: number; dms: number; end: number } }> = ({ f, a, t }) => (
  <AbsoluteFill>
    <Row top={130} gap={18} style={{ alignItems: "center" }}>
      <Pop f={f} at={t.comment} style={sans(68)}>Comment</Pop>
      <Pop f={f} at={t.motion} style={heavy(108, OR, 82)} glow={glowO}>“MOTION”</Pop>
    </Row>
    <Row top={300} gap={18} style={{ alignItems: "center" }}>
      <Pop f={f} at={t.the} style={sans(64)}>the first</Pop>
      <Pop f={f} at={t.five} style={heavy(110, "#fff", 88)}>5</Pop>
      <Pop f={f} at={t.get} style={sans(64)}>get a</Pop>
    </Row>
    <Row top={430} gap={18} style={{ alignItems: "center" }}>
      <Pop f={f} at={t.discount} style={heavy(100, AMB, 85)}>DISCOUNT</Pop>
      <Pop f={f} at={t.dms - 6} style={sans(60)}>in their DMs!</Pop>
    </Row>
    <div style={{ position: "absolute", left: 90, right: 90, top: 620, padding: "26px 30px", ...panel, opacity: prog(f, a, a + 10), transform: `translateY(${(1 - prog(f, a, a + 16, eExpo)) * 200}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", ...caps(22, AMB), letterSpacing: "0.2em", marginBottom: 10 }}>
        <span>comments</span>
        <span>{Math.min(5, Math.max(0, Math.floor((f - t.motion) / 4) + 1))} / 5</span>
      </div>
      {NAMES.map((n, i) => {
        const at = t.motion + i * 4;
        const q = prog(f, at, at + 8, eBack);
        const dm = f >= t.discount + i * 4;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 0", borderTop: i ? "1px solid rgba(255,255,255,0.07)" : undefined, opacity: f >= at ? Math.min(1, q * 1.5) : 0.18 }}>
            <span style={{ ...heavy(38, AMB, 90), width: 40 }}>{i + 1}</span>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: f >= at ? `linear-gradient(135deg, ${AV[i]}, #3b0764)` : "rgba(255,255,255,0.08)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,0.6)" }}>{f >= at ? n : "your spot"}</div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#fff" }}>{f >= at ? "MOTION" : "…"}</div>
            </div>
            {dm ? <span style={{ padding: "8px 16px", borderRadius: 999, background: OR, ...caps(17, "#fff"), letterSpacing: "0.1em", transform: `scale(${prog(f, t.discount + i * 4, t.discount + i * 4 + 8, eBack)})` }}>🎁 dm sent</span> : null}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1460, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: prog(f, t.end, t.end + 10) }}>
      <KLogo f={f} at={t.end} size={100} />
      <div style={{ ...caps(26, AMB), letterSpacing: "0.25em" }}>kinetik-app.com</div>
    </div>
  </AbsoluteFill>
);

/** Sons de la fin « Comment MOTION ». */
export const CommentOutroSfx: React.FC<{ t: { motion: number; discount: number; end: number } }> = ({ t }) => (
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
