import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, hash, lerp, prog } from "../viewz/util";
import { SANS, Streaks } from "../kinetik2/parts";
import { Float3D, KLogo, MiniMotion, Phone, Pop, Row, Screen, caps, exitStyle, heavy, sans } from "../kinetik3/Kinetik3";
import { CardCrop } from "../kinetik5/Kinetik5";
import { FlutedBg } from "../kinetik8/FlutedBg";
import { CUT, DURATION_FRAMES, T, VO } from "./timing";

loadViewzFonts();
loadFonts();

const OR = "#ff6a2b";
const AMB = "#ffb347";
const glowO = "rgba(255,106,43,0.6)";
const SW = 980;
const NAMES = ["@lena.design", "@maxbuilds", "@studio.kai", "@julia.app", "@noah.creates"];
const AV = ["#ff6a2b", "#a855f7", "#ffb347", "#f472b6", "#fb923c"];
const panel: React.CSSProperties = { borderRadius: 36, background: "rgba(12,6,18,0.82)", border: "1.5px solid rgba(255,170,120,0.35)", boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 40px rgba(255,106,43,0.25)" };

const Sfx: React.FC<{ at: number; src: string; vol: number }> = ({ at, src, vol }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Html5Audio src={staticFile(`kinetik3/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

/** Clic « tap » : onde orange à une position écran. */
const Tap: React.FC<{ f: number; at: number; x: number; y: number }> = ({ f, at, x, y }) => {
  const p = (f - at) / 14;
  if (p < 0 || p > 1) return null;
  return <div style={{ position: "absolute", left: x - 20 - p * 60, top: y - 20 - p * 60, width: 40 + p * 120, height: 40 + p * 120, borderRadius: "50%", border: `4px solid ${AMB}`, opacity: 1 - p, boxShadow: `0 0 20px ${OR}` }} />;
};

export const Setting: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = Object.values(CUT);
  const glitch = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const hits: [number, number][] = [
    [T.setting, 12],
    [T.brand, 12],
    [T.generate, 14],
    [T.clicks, 10],
    [T.kinetik, 14],
    [T.studio, 10],
    [T.five, 14],
    [T.discount, 10],
  ];
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const flash = Math.max(0, ...[T.generate, T.kinetik].map((h) => (f >= h ? 0.7 * Math.exp(-(f - h) / 2.2) : 0)));
  const sc = (a: number, b: number) => f >= a - 1 && f < b + 1;
  const url = "kinetik-app.com";
  const nUrl = f < T.app ? Math.round(lerp(0, 7, prog(f, T.kinetik, T.app, (x) => x))) : f < T.dot ? Math.round(lerp(7, 11, prog(f, T.app, T.dot, (x) => x))) : Math.round(lerp(11, 15, prog(f, T.dot, T.com + 6, (x) => x)));
  return (
    <AbsoluteFill style={{ background: "#07030c", overflow: "hidden" }}>
      <FlutedBg heat={0.8 + 0.2 * Math.sin(f / 40)} speed={1 + 0.6 * prog(f, CUT.c, CUT.c + 20)} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,2,10,0.75) 0%, rgba(5,2,10,0.25) 38%, rgba(5,2,10,0.2) 62%, rgba(5,2,10,0.7) 100%)" }} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)` }}>
        {/* ---- A : choisis ton décor 3D ---- */}
        {sc(0, CUT.b) && (
          <AbsoluteFill style={exitStyle(f, CUT.b, 3)}>
            <Row top={170} gap={22}>
              <Pop f={f} at={T.pick} style={sans(100)}>Pick your</Pop>
            </Row>
            <Row top={300}>
              <Pop f={f} at={T.setting} style={heavy(220, OR, 88)} glow={glowO}>SETTING.</Pop>
            </Row>
            <Float3D f={f} a={0} b={CUT.b} cy={1150} w={SW} h={SW / 1.436} ry={-12}>
              <Screen center dir="kinetik4" f={f} src="templates" aspect={1.436} w={SW} zoom={lerp(1.3, 1.9, prog(f, 0, CUT.b, eInOut))} origin={{ x: 0.7, y: 0.55 }} highlight={{ x: 0.527, y: 0.736, w: 0.108, h: 0.205, on: prog(f, T.setting, T.setting + 6), r: 16 }} />
            </Float3D>
          </AbsoluteFill>
        )}

        {/* ---- B : montre ta marque ---- */}
        {sc(CUT.b, CUT.c) && (
          <AbsoluteFill style={exitStyle(f, CUT.c, 3)}>
            <Row top={170} gap={22}>
              <Pop f={f} at={T.showcase} style={sans(100)}>Showcase your</Pop>
            </Row>
            <Row top={300}>
              <Pop f={f} at={T.brand} style={heavy(230, "#fff", 88)} glow="rgba(255,255,255,0.35)">BRAND.</Pop>
            </Row>
            <Float3D f={f} a={CUT.b} b={CUT.c} cy={1150} w={SW} h={SW / 1.779} ry={12}>
              <Screen center dir="kinetik3" f={f} src="colors" aspect={1.779} w={SW} zoom={lerp(1, 1.3, prog(f, CUT.b, CUT.c))} origin={{ x: 0.5, y: 0.6 }} highlight={{ x: 0.47, y: 0.66, w: 0.9, h: 0.33, on: prog(f, T.brand, T.brand + 6), r: 20 }} />
            </Float3D>
          </AbsoluteFill>
        )}

        {/* ---- C : génération automatique, en quelques clics ---- */}
        {sc(CUT.c, CUT.d) && (
          <AbsoluteFill style={exitStyle(f, CUT.d)}>
            <Row top={140}>
              <Pop f={f} at={T.generate} style={heavy(170, OR, 86)} glow={glowO}>GENERATE</Pop>
            </Row>
            <Row top={330} gap={18}>
              <Pop f={f} at={T.motion - 6} style={sans(76)}>your motion design</Pop>
            </Row>
            <Row top={440}>
              <Pop f={f} at={T.automatically} style={heavy(130, "#fff", 80)}>AUTOMATICALLY,</Pop>
            </Row>
            <Row top={590} gap={18} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.in} style={sans(72)}>in just a</Pop>
              <Pop f={f} at={T.few} style={heavy(110, AMB, 85)}>FEW CLICKS.</Pop>
            </Row>
            {(() => {
              const inQ = prog(f, CUT.c + 2, CUT.c + 16, eExpo);
              const pct = Math.round(100 * prog(f, T.generate + 4, T.clicks + 8, eInOut));
              const clicks = [T.generate - 2, T.few, T.clicks];
              return (
                <>
                  <div style={{ position: "absolute", left: 540 - 150, top: 800, opacity: inQ, transform: `translateY(${(1 - inQ) * 200}px) rotate(${Math.sin(f / 18) * 2}deg)` }}>
                    <Phone w={300} glow={0.5 + 0.5 * (pct / 100)}>
                      <MiniMotion f={f} w={300} t0={CUT.c} />
                      <div style={{ position: "absolute", inset: 0, background: "#05040a", clipPath: `inset(${pct}% 0 0 0)`, opacity: 0.85 }} />
                    </Phone>
                  </div>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 1440, display: "flex", justifyContent: "center", gap: 26 }}>
                    {clicks.map((c, i) => {
                      const q = prog(f, c, c + 8, eBack);
                      return (
                        <div key={i} style={{ position: "relative", width: 120, height: 120, borderRadius: 30, ...panel, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.7 + 0.3 * Math.min(1, q)})`, opacity: 0.35 + 0.65 * Math.min(1, q) }}>
                          <span style={{ ...heavy(64, q > 0.5 ? AMB : "rgba(255,255,255,0.4)", 90) }}>{i + 1}</span>
                          <Tap f={f} at={c} x={60} y={60} />
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ position: "absolute", top: 1600, left: 0, right: 0, textAlign: "center", ...caps(24, AMB), letterSpacing: "0.2em", opacity: prog(f, T.clicks, T.clicks + 8) }}>3 clicks · {pct}% generated</div>
                </>
              );
            })()}
          </AbsoluteFill>
        )}

        {/* ---- D : kinetik-app.com ---- */}
        {sc(CUT.d, CUT.e) && (
          <AbsoluteFill style={exitStyle(f, CUT.e)}>
            <Row top={150}>
              <Pop f={f} at={T.head} style={sans(90)}>Head to</Pop>
            </Row>
            <div style={{ position: "absolute", top: 270, left: 0, right: 0 }}>
              <KLogo f={f} at={T.kinetik} size={120} />
            </div>
            <div style={{ position: "absolute", left: 120, right: 120, top: 500, height: 130, borderRadius: 999, border: `2px solid ${OR}`, background: "rgba(12,6,18,0.85)", boxShadow: `0 0 40px ${glowO}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${prog(f, T.kinetik - 2, T.kinetik + 10, eBack)})` }}>
              <span style={{ ...sans(76, "#fff") }}>{url.slice(0, nUrl)}</span>
              <span style={{ width: 4, height: 64, marginLeft: 6, background: AMB, opacity: Math.floor(f / 7) % 2 ? 1 : 0.2 }} />
            </div>
            <Float3D f={f} a={T.kinetik + 4} b={CUT.e} cy={1220} w={SW} h={SW / 1.947} ry={-12}>
              <Screen center dir="kinetik3" f={f} src="website" aspect={1.947} w={SW} zoom={lerp(1, 1.3, prog(f, T.kinetik + 10, CUT.e, eInOut))} origin={{ x: 0.5, y: 0.35 }} />
            </Float3D>
          </AbsoluteFill>
        )}

        {/* ---- E : vidéos qualité studio, sans effort ---- */}
        {sc(CUT.e, CUT.f) && (
          <AbsoluteFill style={exitStyle(f, CUT.f)}>
            <Row top={150} gap={18}>
              <Pop f={f} at={T.and} style={sans(84)}>and create</Pop>
            </Row>
            <Row top={260}>
              <Pop f={f} at={T.studio} style={heavy(118, OR, 78)} glow={glowO}>STUDIO-QUALITY</Pop>
            </Row>
            <Row top={420} gap={18}>
              <Pop f={f} at={T.videos} style={sans(84)}>videos yourself,</Pop>
            </Row>
            <Row top={540}>
              <Pop f={f} at={T.effortlessly} style={heavy(150, "#fff", 80)}>EFFORTLESSLY.</Pop>
            </Row>
            <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 1300px" }}>
              <div style={{ position: "absolute", left: 540, top: 1300, transformStyle: "preserve-3d", transform: `translateZ(-480px) rotateX(-6deg) rotateY(${(f - CUT.e) * 2.4}deg)` }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} style={{ position: "absolute", left: -130, top: -230, transform: `rotateY(${i * 36}deg) translateZ(620px)`, backfaceVisibility: "hidden", opacity: prog(f, CUT.e + i * 2, CUT.e + i * 2 + 10) }}>
                    <CardCrop i={i * 3 + 2} w={260} />
                  </div>
                ))}
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        )}

        {/* ---- F : les 5 premiers « MOTION » → réduction en DM ---- */}
        {f >= CUT.f - 1 && (
          <AbsoluteFill>
            <Row top={130} gap={18} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.the} style={sans(80)}>The first</Pop>
              <Pop f={f} at={T.five} style={heavy(150, OR, 88)} glow={glowO}>5</Pop>
            </Row>
            <Row top={300} gap={18} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.comment} style={sans(68)}>to comment</Pop>
              <Pop f={f} at={T.motion2} style={heavy(104, "#fff", 82)} glow="rgba(255,255,255,0.4)">“MOTION”</Pop>
            </Row>
            <Row top={440} gap={18} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.get} style={sans(58)}>get a</Pop>
              <Pop f={f} at={T.discount} style={heavy(88, AMB, 82)}>DISCOUNT</Pop>
              <Pop f={f} at={T.dms} style={sans(58)}>in their DMs!</Pop>
            </Row>
            <div style={{ position: "absolute", left: 90, right: 90, top: 640, padding: "26px 30px", ...panel, opacity: prog(f, CUT.f, CUT.f + 10), transform: `translateY(${(1 - prog(f, CUT.f, CUT.f + 16, eExpo)) * 200}px)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", ...caps(22, AMB), letterSpacing: "0.2em", marginBottom: 10 }}>
                <span>comments</span>
                <span>{Math.min(5, Math.max(0, Math.floor((f - T.motion2) / 4) + 1))} / 5</span>
              </div>
              {NAMES.map((n, i) => {
                const at = T.motion2 + i * 4;
                const q = prog(f, at, at + 8, eBack);
                const dm = f >= T.dms + i * 3;
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 0", borderTop: i ? "1px solid rgba(255,255,255,0.07)" : undefined, opacity: f >= at ? Math.min(1, q * 1.5) : 0.18 }}>
                    <span style={{ ...heavy(38, AMB, 90), width: 40 }}>{i + 1}</span>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: f >= at ? `linear-gradient(135deg, ${AV[i]}, #3b0764)` : "rgba(255,255,255,0.08)" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,0.6)" }}>{f >= at ? n : "your spot"}</div>
                      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#fff" }}>{f >= at ? "MOTION" : "…"}</div>
                    </div>
                    {dm ? <span style={{ padding: "8px 16px", borderRadius: 999, background: OR, ...caps(17, "#fff"), letterSpacing: "0.1em", transform: `scale(${prog(f, T.dms + i * 3, T.dms + i * 3 + 8, eBack)})` }}>🎁 dm sent</span> : null}
                  </div>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: prog(f, T.end, T.end + 10) }}>
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

      <Html5Audio src={staticFile("kinetik10/sfx/music.wav")} volume={0.3} />
      <Sequence from={VO} layout="none">
        <Html5Audio src={staticFile("kinetik10/voice.wav")} volume={0.92} />
      </Sequence>
      {cuts.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={c - 3} src="whoosh" vol={0.18} />
          <Sfx at={c} src="glitch" vol={0.1} />
        </React.Fragment>
      ))}
      <Sfx at={T.setting} src="click" vol={0.35} />
      <Sfx at={T.brand} src="pop" vol={0.18} />
      <Sfx at={T.generate - 2} src="click" vol={0.35} />
      <Sfx at={T.few} src="click" vol={0.35} />
      <Sfx at={T.clicks} src="click" vol={0.35} />
      <Sfx at={T.generate} src="scan" vol={0.14} />
      <Sfx at={T.kinetik} src="shimmer" vol={0.26} />
      {Array.from({ length: 15 }, (_, i) => (
        <Sfx key={`u${i}`} at={T.kinetik + i * 3.4} src="key" vol={0.2} />
      ))}
      <Sfx at={T.studio} src="impact" vol={0.16} />
      <Sfx at={T.five} src="impact" vol={0.18} />
      {NAMES.map((_, i) => (
        <Sfx key={`m${i}`} at={T.motion2 + i * 4} src="pop" vol={0.13} />
      ))}
      {NAMES.map((_, i) => (
        <Sfx key={`d${i}`} at={T.dms + i * 3} src="tick" vol={0.12} />
      ))}
      <Sfx at={T.end} src="shimmer" vol={0.24} />
    </AbsoluteFill>
  );
};
