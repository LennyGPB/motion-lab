import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, hash, lerp, prog } from "../viewz/util";
import { CYAN, FictionalSite, LAV, SANS, SiteH, SiteW, Streaks } from "../kinetik2/parts";
import { KLogo, Phone, Pop, Row, caps, exitStyle, heavy, sans } from "../kinetik3/Kinetik3";
import { FlutedBg } from "../kinetik8/FlutedBg";
import { CUT, DURATION_FRAMES, T, VO } from "./timing";

loadViewzFonts();
loadFonts();

const OR = "#ff6a2b";
const AMB = "#ffb347";
const glowO = "rgba(255,106,43,0.6)";
const NAMES = ["@lena.design", "@maxbuilds", "@studio.kai", "@julia.app", "@noah.creates"];
const AV = ["#ff6a2b", "#a855f7", "#ffb347", "#f472b6", "#fb923c"];
const panel: React.CSSProperties = { borderRadius: 36, background: "rgba(12,6,18,0.82)", border: "1.5px solid rgba(255,170,120,0.35)", boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 40px rgba(255,106,43,0.25)" };

const Sfx: React.FC<{ at: number; src: string; vol: number }> = ({ at, src, vol }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Html5Audio src={staticFile(`kinetik3/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

/** Logo « Halo » du site fictif. */
const HaloLogo: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ display: "flex", alignItems: "center", gap: s * 0.3 }}>
    <div style={{ width: s, height: s, borderRadius: "50%", border: `${s * 0.18}px solid ${CYAN}`, boxShadow: `0 0 ${s * 0.5}px ${CYAN}` }} />
    <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: s * 1.1, color: "#fff" }}>Halo</span>
  </div>
);

/** Mini vidéo générée aux couleurs du site (logo + couleurs + texte récupérés). */
const HaloMotion: React.FC<{ f: number; w: number; t0: number }> = ({ f, w, t0 }) => {
  const k = Math.max(0, f - t0);
  const beat = Math.exp(-(k % 14) / 4);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 38%, #123044, #0b1220 60%, #05070c)" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: "50%", top: "33%", width: w * (0.62 - i * 0.16), height: w * (0.62 - i * 0.16), marginLeft: -w * (0.31 - i * 0.08), marginTop: -w * (0.31 - i * 0.08), borderRadius: "50%", border: `${w * 0.025}px solid ${i === 1 ? LAV : CYAN}`, boxShadow: `0 0 20px ${i === 1 ? LAV : CYAN}`, transform: `scale(${1 + 0.08 * beat * (i + 1) / 2}) rotate(${k * (i % 2 ? -2 : 2)}deg)` }} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: "60%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: w * 0.15, color: "#fff", transform: `scale(${1 + 0.05 * beat})` }}>Sound,</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: "70%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: w * 0.15, background: `linear-gradient(90deg, ${CYAN}, ${LAV})`, WebkitBackgroundClip: "text", color: "transparent" }}>reimagined.</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "6%", display: "flex", justifyContent: "center" }}>
        <HaloLogo s={w * 0.06} />
      </div>
    </AbsoluteFill>
  );
};

export const PasteLink: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = Object.values(CUT);
  const glitch = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const hits: [number, number][] = [
    [T.link, 12],
    [T.kinetik, 12],
    [T.ready, 16],
    [T.brief, 10],
    [T.hassle, 10],
    [T.kinetik2, 12],
    [T.motion, 14],
  ];
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const flash = Math.max(0, ...[T.ready, T.kinetik2].map((h) => (f >= h ? 0.7 * Math.exp(-(f - h) / 2.2) : 0)));
  const sc = (a: number, b: number) => f >= a - 1 && f < b + 1;
  const link = "https://halo-audio.com";
  const nLink = Math.round(lerp(0, link.length, prog(f, T.link - 4, T.link + 2, (x) => x)));
  const url = "kinetik-app.com";
  const nUrl = Math.round(lerp(0, url.length, prog(f, T.kinetik2, T.com + 6, (x) => x)));
  return (
    <AbsoluteFill style={{ background: "#07030c", overflow: "hidden" }}>
      <FlutedBg heat={0.8 + 0.2 * Math.sin(f / 40)} speed={1 + 0.6 * prog(f, CUT.b, CUT.b + 20)} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,2,10,0.75) 0%, rgba(5,2,10,0.25) 38%, rgba(5,2,10,0.2) 62%, rgba(5,2,10,0.7) 100%)" }} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)` }}>
        {/* ---- A : colle le lien de ton site ---- */}
        {sc(0, CUT.b) && (
          <AbsoluteFill style={exitStyle(f, CUT.b, 3)}>
            <Row top={170} gap={22}>
              <Pop f={f} at={T.paste} style={sans(100)}>Paste your</Pop>
            </Row>
            <Row top={300}>
              <Pop f={f} at={T.website} style={heavy(140, OR, 80)} glow={glowO}>WEBSITE LINK.</Pop>
            </Row>
            <div style={{ position: "absolute", left: 90, right: 90, top: 820, padding: "34px 36px", ...panel, opacity: prog(f, 2, 10), transform: `translateY(${(1 - prog(f, 2, 16, eExpo)) * 160}px)` }}>
              <div style={{ ...caps(22, AMB), letterSpacing: "0.2em", marginBottom: 16 }}>website url</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 28px", borderRadius: 22, background: "rgba(255,255,255,0.06)", border: `2px solid ${f >= T.link - 4 ? OR : "rgba(255,255,255,0.15)"}`, boxShadow: f >= T.link - 4 ? `0 0 26px ${glowO}` : undefined }}>
                <span style={{ ...sans(44, "#fff"), fontWeight: 600 }}>{nLink ? link.slice(0, nLink) : <span style={{ color: "rgba(255,255,255,0.35)" }}>https://your-site.com</span>}</span>
                <span style={{ width: 3, height: 44, background: AMB, opacity: Math.floor(f / 7) % 2 ? 1 : 0.2 }} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", opacity: prog(f, T.link - 8, T.link - 2), transform: `scale(${1 + 0.2 * Math.exp(-Math.max(0, f - T.link + 4) / 4)})` }}>
              <div style={{ padding: "16px 30px", borderRadius: 18, ...panel, ...caps(30, "#fff"), letterSpacing: "0.12em" }}>⌘ V · paste</div>
            </div>
          </AbsoluteFill>
        )}

        {/* ---- B : Kinetik récupère logo, couleurs et texte ---- */}
        {sc(CUT.b, CUT.c) && (
          <AbsoluteFill style={exitStyle(f, CUT.c)}>
            <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
              <KLogo f={f} at={T.kinetik} size={90} />
              <Pop f={f} at={T.grabs} style={heavy(120, OR, 85)} glow={glowO}>GRABS</Pop>
            </div>
            <Row top={300} gap={16} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.logo - 6} style={sans(64)}>your</Pop>
              <Pop f={f} at={T.logo} style={heavy(96, "#fff", 82)}>LOGO,</Pop>
              <Pop f={f} at={T.colors} style={heavy(96, AMB, 82)}>COLORS</Pop>
            </Row>
            <Row top={420} gap={16} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.and} style={sans(64)}>and</Pop>
              <Pop f={f} at={T.copy} style={heavy(96, "#fff", 82)}>COPY.</Pop>
            </Row>
            {/* le site, scanné */}
            {(() => {
              const sc2 = 0.86;
              const scan = prog(f, T.kinetik, T.copyEnd, eInOut);
              return (
                <div style={{ position: "absolute", left: 540 - (SiteW * sc2) / 2, top: 600, width: SiteW * sc2, height: SiteH * sc2, borderRadius: 22, overflow: "hidden", border: `2px solid ${OR}`, boxShadow: `0 0 40px ${glowO}` }}>
                  <div style={{ transform: `scale(${sc2})`, transformOrigin: "0 0" }}>
                    <FictionalSite />
                  </div>
                  <div style={{ position: "absolute", top: 0, bottom: 0, left: `${scan * 100}%`, width: 5, background: "#fff4ea", boxShadow: `0 0 24px 8px ${OR}`, opacity: scan > 0 && scan < 1 ? 1 : 0 }} />
                </div>
              );
            })()}
            {/* éléments extraits */}
            {[
              { at: T.logo, label: "logo", el: <HaloLogo s={46} />, x: 220 },
              { at: T.colors, label: "colors", el: <div style={{ display: "flex", gap: 10 }}>{[CYAN, LAV, "#0b1220", "#ffffff"].map((c) => <div key={c} style={{ width: 46, height: 46, borderRadius: 12, background: c, border: "1px solid rgba(255,255,255,0.3)" }} />)}</div>, x: 540 },
              { at: T.copy, label: "copy", el: <span style={{ ...sans(36, "#fff") }}>“Sound, reimagined.”</span>, x: 860 },
            ].map((c, i) => {
              const q = prog(f, c.at, c.at + 14, eBack);
              return (
                <div key={c.label} style={{ position: "absolute", left: c.x, top: lerp(900, 1240 + (i % 2) * 150, Math.min(1, q)), transform: `translate(-50%, 0) scale(${0.5 + 0.5 * Math.min(1, q)})`, opacity: Math.min(1, q * 2), display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{ padding: "22px 26px", ...panel, borderRadius: 26 }}>{c.el}</div>
                  <span style={{ ...caps(20, AMB), letterSpacing: "0.2em" }}>✓ {c.label}</span>
                </div>
              );
            })}
          </AbsoluteFill>
        )}

        {/* ---- C : la vidéo est prête ---- */}
        {sc(CUT.c, CUT.d) && (
          <AbsoluteFill style={exitStyle(f, CUT.d)}>
            <Row top={150} gap={20}>
              <Pop f={f} at={T.your} style={sans(96)}>Your video&apos;s</Pop>
            </Row>
            <Row top={270}>
              <Pop f={f} at={T.ready} style={heavy(240, OR, 92)} glow={glowO}>READY.</Pop>
            </Row>
            <div style={{ position: "absolute", left: 540 - 170, top: 640, opacity: prog(f, CUT.c, CUT.c + 6), transform: `translateY(${(1 - prog(f, CUT.c, CUT.c + 14, eExpo)) * 240}px) rotate(${Math.sin(f / 16) * 2}deg)` }}>
              <Phone w={340} glow={1}>
                <HaloMotion f={f} w={340} t0={CUT.c} />
              </Phone>
            </div>
            <div style={{ position: "absolute", left: 540 + 130, top: 1300, transform: `scale(${prog(f, T.ready, T.ready + 8, eBack)})`, padding: "14px 26px", borderRadius: 999, background: OR, ...caps(26, "#fff"), letterSpacing: "0.12em", boxShadow: `0 0 40px ${glowO}` }}>✓ ready</div>
          </AbsoluteFill>
        )}

        {/* ---- D : pas de brief, pas de galère ---- */}
        {sc(CUT.d, CUT.e) && (
          <AbsoluteFill style={exitStyle(f, CUT.e)}>
            {[
              { w: "BRIEF", at: T.brief, y: 300, doc: "brief_v7_FINAL.docx" },
              { w: "HASSLE", at: T.hassle, y: 820, doc: "“can we change everything?”" },
            ].map((x) => {
              const st = prog(f, x.at + 4, x.at + 12, eInOut);
              return (
                <React.Fragment key={x.w}>
                  <Row top={x.y} gap={22} style={{ alignItems: "center" }}>
                    <Pop f={f} at={x.at - 5} style={sans(100)}>no</Pop>
                    <span style={{ position: "relative", display: "inline-block" }}>
                      <Pop f={f} at={x.at} style={heavy(190, "#fff", 85)}>{x.w}</Pop>
                      <span style={{ position: "absolute", left: -10, right: -10, top: "46%", height: 14, borderRadius: 7, background: OR, transform: `scaleX(${st}) rotate(-3deg)`, transformOrigin: "0% 50%", boxShadow: `0 0 18px ${OR}` }} />
                    </span>
                  </Row>
                  <div style={{ position: "absolute", left: 0, right: 0, top: x.y + 230, display: "flex", justifyContent: "center", opacity: prog(f, x.at, x.at + 6) * (1 - 0.6 * st), filter: st > 0.1 ? `blur(${st * 4}px)` : undefined }}>
                    <div style={{ padding: "18px 30px", ...panel, ...sans(38, "rgba(255,255,255,0.8)"), fontWeight: 600 }}>{x.doc}</div>
                  </div>
                </React.Fragment>
              );
            })}
          </AbsoluteFill>
        )}

        {/* ---- E : sur kinetik-app.com ---- */}
        {sc(CUT.e, CUT.f) && (
          <AbsoluteFill style={exitStyle(f, CUT.f)}>
            <Row top={560}>
              <Pop f={f} at={T.on} style={sans(90)}>on</Pop>
            </Row>
            <div style={{ position: "absolute", top: 700, left: 0, right: 0 }}>
              <KLogo f={f} at={T.kinetik2} size={130} />
            </div>
            <div style={{ position: "absolute", left: 120, right: 120, top: 930, height: 130, borderRadius: 999, border: `2px solid ${OR}`, background: "rgba(12,6,18,0.85)", boxShadow: `0 0 40px ${glowO}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${prog(f, T.kinetik2 - 2, T.kinetik2 + 10, eBack)})` }}>
              <span style={{ ...sans(76, "#fff") }}>{url.slice(0, nUrl)}</span>
              <span style={{ width: 4, height: 64, marginLeft: 6, background: AMB, opacity: Math.floor(f / 7) % 2 ? 1 : 0.2 }} />
            </div>
          </AbsoluteFill>
        )}

        {/* ---- F : commente « MOTION » ---- */}
        {f >= CUT.f - 1 && (
          <AbsoluteFill>
            <Row top={130} gap={18} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.comment} style={sans(68)}>Comment</Pop>
              <Pop f={f} at={T.motion} style={heavy(108, OR, 82)} glow={glowO}>“MOTION”</Pop>
            </Row>
            <Row top={300} gap={18} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.the} style={sans(64)}>the first</Pop>
              <Pop f={f} at={T.five} style={heavy(110, "#fff", 88)}>5</Pop>
              <Pop f={f} at={T.get} style={sans(64)}>get a</Pop>
            </Row>
            <Row top={430} gap={18} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.discount} style={heavy(100, AMB, 85)}>DISCOUNT</Pop>
              <Pop f={f} at={T.dms - 6} style={sans(60)}>in their DMs!</Pop>
            </Row>
            <div style={{ position: "absolute", left: 90, right: 90, top: 620, padding: "26px 30px", ...panel, opacity: prog(f, CUT.f, CUT.f + 10), transform: `translateY(${(1 - prog(f, CUT.f, CUT.f + 16, eExpo)) * 200}px)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", ...caps(22, AMB), letterSpacing: "0.2em", marginBottom: 10 }}>
                <span>comments</span>
                <span>{Math.min(5, Math.max(0, Math.floor((f - T.motion) / 4) + 1))} / 5</span>
              </div>
              {NAMES.map((n, i) => {
                const at = T.motion + i * 4;
                const q = prog(f, at, at + 8, eBack);
                const dm = f >= T.discount + i * 4;
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 0", borderTop: i ? "1px solid rgba(255,255,255,0.07)" : undefined, opacity: f >= at ? Math.min(1, q * 1.5) : 0.18 }}>
                    <span style={{ ...heavy(38, AMB, 90), width: 40 }}>{i + 1}</span>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: f >= at ? `linear-gradient(135deg, ${AV[i]}, #3b0764)` : "rgba(255,255,255,0.08)" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,0.6)" }}>{f >= at ? n : "your spot"}</div>
                      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#fff" }}>{f >= at ? "MOTION" : "…"}</div>
                    </div>
                    {dm ? <span style={{ padding: "8px 16px", borderRadius: 999, background: OR, ...caps(17, "#fff"), letterSpacing: "0.1em", transform: `scale(${prog(f, T.discount + i * 4, T.discount + i * 4 + 8, eBack)})` }}>🎁 dm sent</span> : null}
                  </div>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1460, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: prog(f, T.end, T.end + 10) }}>
              <KLogo f={f} at={T.end} size={100} />
              <div style={{ ...caps(26, AMB), letterSpacing: "0.25em" }}>kinetik-app.com</div>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 10, DURATION_FRAMES - 1, eInOut) }} />

      <Html5Audio src={staticFile("kinetik11/sfx/music.wav")} volume={0.3} />
      <Sequence from={VO} layout="none">
        <Html5Audio src={staticFile("kinetik11/voice.wav")} volume={0.92} />
      </Sequence>
      {cuts.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={c - 3} src="whoosh" vol={0.18} />
          <Sfx at={c} src="glitch" vol={0.1} />
        </React.Fragment>
      ))}
      <Sfx at={T.link - 4} src="click" vol={0.38} />
      <Sfx at={T.kinetik} src="scan" vol={0.16} />
      <Sfx at={T.logo} src="pop" vol={0.16} />
      <Sfx at={T.colors} src="pop" vol={0.16} />
      <Sfx at={T.copy} src="pop" vol={0.16} />
      <Sfx at={T.ready} src="drop" vol={0.26} />
      <Sfx at={T.brief + 4} src="whoosh" vol={0.14} />
      <Sfx at={T.hassle + 4} src="whoosh" vol={0.14} />
      <Sfx at={T.kinetik2} src="shimmer" vol={0.26} />
      {Array.from({ length: 15 }, (_, i) => (
        <Sfx key={`u${i}`} at={T.kinetik2 + i * 3} src="key" vol={0.2} />
      ))}
      {NAMES.map((_, i) => (
        <Sfx key={`m${i}`} at={T.motion + i * 4} src="pop" vol={0.13} />
      ))}
      {NAMES.map((_, i) => (
        <Sfx key={`d${i}`} at={T.discount + i * 4} src="tick" vol={0.12} />
      ))}
      <Sfx at={T.end} src="shimmer" vol={0.24} />
    </AbsoluteFill>
  );
};
