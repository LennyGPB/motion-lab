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

const Sfx: React.FC<{ at: number; src: string; vol: number }> = ({ at, src, vol }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Html5Audio src={staticFile(`kinetik3/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

const panel: React.CSSProperties = { borderRadius: 36, background: "rgba(12,6,18,0.82)", border: "1.5px solid rgba(255,170,120,0.35)", boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 40px rgba(255,106,43,0.25)" };

export const CommentMotion: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = Object.values(CUT);
  const glitch = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const hits: [number, number][] = [
    [T.five, 14],
    [T.motion, 16],
    [T.discount, 10],
    [T.two, 14],
    [T.editor, 10],
    [T.struggling, 12],
    [T.dm, 14],
  ];
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const flash = Math.max(0, ...[T.motion, T.two].map((h) => (f >= h ? 0.7 * Math.exp(-(f - h) / 2.2) : 0)));
  const sc = (a: number, b: number) => f >= a - 1 && f < b + 1;
  return (
    <AbsoluteFill style={{ background: "#07030c", overflow: "hidden" }}>
      <FlutedBg heat={0.8 + 0.2 * Math.sin(f / 40)} speed={1 + 0.5 * prog(f, CUT.b, CUT.b + 20)} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,2,10,0.75) 0%, rgba(5,2,10,0.25) 38%, rgba(5,2,10,0.2) 62%, rgba(5,2,10,0.7) 100%)" }} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)` }}>
        {/* ---- A : les 5 premiers qui commentent « MOTION » ---- */}
        {sc(0, CUT.b) && (
          <AbsoluteFill style={exitStyle(f, CUT.b)}>
            <Row top={130} gap={22}>
              <Pop f={f} at={T.the} style={sans(92)}>The first</Pop>
            </Row>
            <Row top={240}>
              <Pop f={f} at={T.five} style={heavy(200, OR, 88)} glow={glowO}>5 PEOPLE</Pop>
            </Row>
            <Row top={440} gap={22}>
              <Pop f={f} at={T.comment} style={sans(68)}>to comment</Pop>
              <Pop f={f} at={T.motion} style={heavy(104, "#fff", 82)} glow="rgba(255,255,255,0.4)">“MOTION”</Pop>
            </Row>
            <Row top={590} gap={20} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.get} style={sans(76)}>get a</Pop>
              <Pop f={f} at={T.discount} style={heavy(110, AMB, 85)}>DISCOUNT</Pop>
              <Pop f={f} at={T.on} style={sans(76)}>on</Pop>
            </Row>
            <div style={{ position: "absolute", top: 720, left: 0, right: 0 }}>
              <KLogo f={f} at={T.kinetik} size={90} />
            </div>
            {/* fil de commentaires : 5 places */}
            <div style={{ position: "absolute", left: 90, right: 90, top: 880, padding: "30px 34px", ...panel, opacity: prog(f, T.first, T.first + 10), transform: `translateY(${(1 - prog(f, T.first, T.first + 16, eExpo)) * 200}px)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", ...caps(22, AMB), letterSpacing: "0.2em", marginBottom: 18 }}>
                <span>comments</span>
                <span>{Math.min(5, Math.max(0, Math.floor((f - T.motion) / 5) + 1))} / 5 spots</span>
              </div>
              {NAMES.map((n, i) => {
                const at = T.motion + i * 5;
                const q = prog(f, at, at + 8, eBack);
                const won = f >= T.discount + i * 3;
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 0", borderTop: i ? "1px solid rgba(255,255,255,0.07)" : undefined, opacity: f >= at ? Math.min(1, q * 1.5) : 0.18, transform: `translateX(${(1 - Math.min(1, q)) * 60}px)` }}>
                    <span style={{ ...heavy(40, AMB, 90), width: 46 }}>{i + 1}</span>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: f >= at ? `linear-gradient(135deg, ${AV[i]}, #3b0764)` : "rgba(255,255,255,0.08)" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "rgba(255,255,255,0.6)" }}>{f >= at ? n : "your spot"}</div>
                      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#fff" }}>{f >= at ? "MOTION" : "…"}</div>
                    </div>
                    {won ? <span style={{ padding: "8px 16px", borderRadius: 999, background: OR, ...caps(18, "#fff"), letterSpacing: "0.1em", transform: `scale(${prog(f, T.discount + i * 3, T.discount + i * 3 + 8, eBack)})` }}>🎁 discount</span> : null}
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        )}

        {/* ---- B : en 2 secondes, des centaines de modèles et d'effets ---- */}
        {sc(CUT.b, CUT.c) && (
          <AbsoluteFill style={exitStyle(f, CUT.c)}>
            <Row top={140} gap={22}>
              <Pop f={f} at={T.create} style={sans(92)}>Create your motion</Pop>
            </Row>
            <Row top={260} gap={22}>
              <Pop f={f} at={T.in} style={sans(80)}>in</Pop>
              <Pop f={f} at={T.two} style={heavy(165, OR, 85)} glow={glowO}>2 SECONDS</Pop>
            </Row>
            <Row top={480} gap={20} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.from} style={sans(72)}>from</Pop>
              <Pop f={f} at={T.hundreds} style={heavy(110, "#fff", 82)}>HUNDREDS</Pop>
            </Row>
            <Row top={610} gap={20} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.templates} style={sans(72)}>of templates &amp;</Pop>
              <Pop f={f} at={T.effects} style={heavy(110, AMB, 82)}>EFFECTS</Pop>
            </Row>
            {(() => {
              const inQ = prog(f, CUT.b + 2, CUT.b + 16, eExpo);
              const pct = Math.round(100 * prog(f, T.motion2, T.seconds + 10, eInOut));
              return (
                <>
                  <div style={{ position: "absolute", left: 540 - 150, top: 820, opacity: inQ, transform: `translateY(${(1 - inQ) * 200}px) rotate(${Math.sin(f / 18) * 2}deg)`, zIndex: 2 }}>
                    <Phone w={300} glow={0.5 + 0.5 * (pct / 100)}>
                      <MiniMotion f={f} w={300} t0={CUT.b} />
                      <div style={{ position: "absolute", inset: 0, background: "#05040a", clipPath: `inset(${pct}% 0 0 0)`, opacity: 0.85 }} />
                    </Phone>
                  </div>
                  {/* éventail de vrais modèles qui s'ouvre derrière le téléphone */}
                  {[-2, -1, 1, 2].map((k, i) => {
                    const q = prog(f, T.hundreds + i * 3, T.hundreds + i * 3 + 12, eBack);
                    return (
                      <div key={k} style={{ position: "absolute", left: 540 - 95 + k * 190 * q, top: 900 + Math.abs(k) * 40 * q, transform: `rotate(${k * 9 * q}deg) scale(${0.6 + 0.4 * q})`, opacity: Math.min(1, q * 1.5) }}>
                        <CardCrop i={i * 4 + 6} w={190} />
                      </div>
                    );
                  })}
                  <div style={{ position: "absolute", left: 200, right: 200, top: 1500, opacity: inQ }}>
                    <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${OR}, ${AMB})`, boxShadow: `0 0 16px ${OR}` }} />
                    </div>
                    <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", ...caps(24, AMB), letterSpacing: "0.15em" }}>
                      <span>{pct >= 100 ? "done" : "generating"}</span>
                      <span style={{ color: "#fff" }}>{pct}%</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </AbsoluteFill>
        )}

        {/* ---- C : l'éditeur ---- */}
        {sc(CUT.c, CUT.d) && (
          <AbsoluteFill>
            <div style={exitStyle(f, CUT.d, 3)}>
              <Row top={150} gap={22}>
                <Pop f={f} at={T.edit} style={heavy(180, OR, 82)} glow={glowO}>EDIT</Pop>
                <Pop f={f} at={T.videos} style={sans(90)}>your videos</Pop>
              </Row>
              <Row top={360}>
                <Pop f={f} at={T.however} style={sans(84)}>however you want</Pop>
              </Row>
              <Row top={470} gap={18}>
                <Pop f={f} at={T.with} style={sans(84)}>with our</Pop>
                <Pop f={f} at={T.super} style={sans(84, AMB)}>super simple</Pop>
              </Row>
              <Row top={580}>
                <Pop f={f} at={T.editor} style={heavy(170, "#fff", 82)}>EDITOR</Pop>
              </Row>
            </div>
            <Float3D f={f} a={CUT.c} b={CUT.d} cy={1250} w={SW} h={SW / 1.894} ry={12}>
              <Screen center dir="kinetik4" f={f} src="editor" aspect={1.894} w={SW} zoom={lerp(1, 1.8, prog(f, T.videos, T.editor + 6, eInOut))} origin={{ x: lerp(0.4, 0.86, prog(f, T.however, T.editor, eInOut)), y: lerp(0.4, 0.3, prog(f, T.however, T.editor, eInOut)) }} />
            </Float3D>
          </AbsoluteFill>
        )}

        {/* ---- D : fini la galère ---- */}
        {sc(CUT.d, CUT.e) && (
          <AbsoluteFill style={exitStyle(f, CUT.e)}>
            <Row top={200}>
              <Pop f={f} at={T.no} style={heavy(200, "#fff", 85)}>NO MORE</Pop>
            </Row>
            <div style={{ position: "absolute", top: 420, left: 0, right: 0, textAlign: "center" }}>
              <span style={{ position: "relative", display: "inline-block" }}>
                <Pop f={f} at={T.struggling} style={heavy(170, OR, 80)} glow={glowO}>STRUGGLING</Pop>
                <span style={{ position: "absolute", left: -10, right: -10, top: "46%", height: 14, borderRadius: 7, background: "#fff", transform: `scaleX(${prog(f, T.get2, T.motEnd, eInOut)}) rotate(-3deg)`, transformOrigin: "0% 50%", boxShadow: "0 0 18px #fff" }} />
              </span>
            </div>
            <Row top={640}>
              <Pop f={f} at={T.get2} style={sans(84)}>to get your motions.</Pop>
            </Row>
            {/* messages de galère qui s'effacent */}
            {["Try again…", "Still not right", "Error: credits left 0", "Regenerate ↻", "Why is the text cut?", "One more time…"].map((m, i) => {
              const at = CUT.d + i * 4;
              const gone = prog(f, T.motions, T.motEnd + 6, eInOut);
              return (
                <div key={m} style={{ position: "absolute", left: 120 + (i % 2) * 300 + hash(i) * 80, top: 860 + i * 120, padding: "18px 28px", borderRadius: 26, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", ...sans(38, "#fff"), fontWeight: 600, opacity: prog(f, at, at + 6) * (1 - gone), transform: `rotate(${(hash(i + 3) - 0.5) * 10}deg) translateY(${gone * 200}px) scale(${1 - gone * 0.3})`, filter: gone > 0.05 ? `blur(${gone * 10}px)` : undefined }}>
                  {m}
                </div>
              );
            })}
          </AbsoluteFill>
        )}

        {/* ---- E : DM aux 5 premiers ---- */}
        {f >= CUT.e - 1 && (
          <AbsoluteFill>
            <Row top={130} gap={20}>
              <Pop f={f} at={T.ill} style={sans(92)}>I&apos;ll</Pop>
              <Pop f={f} at={T.dm} style={heavy(170, OR, 88)} glow={glowO}>DM</Pop>
            </Row>
            <Row top={330} gap={20} style={{ alignItems: "center" }}>
              <Pop f={f} at={T.first2} style={sans(80)}>the first</Pop>
              <Pop f={f} at={T.five2} style={heavy(130, "#fff", 88)}>5</Pop>
            </Row>
            <Row top={480} gap={20}>
              <Pop f={f} at={T.with2} style={sans(80)}>with their</Pop>
              <Pop f={f} at={T.discount2} style={heavy(110, AMB, 85)}>DISCOUNT</Pop>
            </Row>
            <div style={{ position: "absolute", left: 90, right: 90, top: 680, padding: "26px 30px", ...panel, opacity: prog(f, CUT.e + 2, CUT.e + 12), transform: `translateY(${(1 - prog(f, CUT.e + 2, CUT.e + 18, eExpo)) * 200}px)` }}>
              <div style={{ ...caps(22, AMB), letterSpacing: "0.2em", marginBottom: 10 }}>messages</div>
              {NAMES.map((n, i) => {
                const at = T.dm + 4 + i * 5;
                const q = prog(f, at, at + 8, eBack);
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 0", borderTop: i ? "1px solid rgba(255,255,255,0.07)" : undefined, opacity: Math.min(1, 0.25 + q) }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${AV[i]}, #3b0764)` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff" }}>{n}</div>
                      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: "rgba(255,255,255,0.65)" }}>{q > 0 ? "🎁 Here's your Kinetik discount!" : "…"}</div>
                    </div>
                    <span style={{ ...caps(18, q > 0.5 ? AMB : "rgba(255,255,255,0.3)"), letterSpacing: "0.1em", transform: `scale(${0.8 + 0.2 * q})` }}>{q > 0.5 ? "✓ sent" : "sending"}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: prog(f, T.end, T.end + 10) }}>
              <KLogo f={f} at={T.end} size={110} />
              <div style={{ padding: "16px 36px", borderRadius: 999, background: `linear-gradient(135deg, ${OR}, #c2410c)`, boxShadow: `0 0 40px ${glowO}`, ...sans(40), transform: `scale(${prog(f, T.end + 6, T.end + 16, eBack)})` }}>Comment “MOTION” ↓</div>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 10, DURATION_FRAMES - 1, eInOut) }} />

      <Html5Audio src={staticFile("kinetik9/sfx/music.wav")} volume={0.3} />
      <Sequence from={VO} layout="none">
        <Html5Audio src={staticFile("kinetik9/voice.wav")} volume={0.92} />
      </Sequence>
      {cuts.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={c - 3} src="whoosh" vol={0.18} />
          <Sfx at={c} src="glitch" vol={0.1} />
        </React.Fragment>
      ))}
      <Sfx at={T.five} src="impact" vol={0.18} />
      {NAMES.map((_, i) => (
        <Sfx key={`m${i}`} at={T.motion + i * 5} src="pop" vol={0.14} />
      ))}
      <Sfx at={T.discount} src="shimmer" vol={0.24} />
      <Sfx at={T.two} src="drop" vol={0.26} />
      <Sfx at={T.seconds + 10} src="pop" vol={0.16} />
      <Sfx at={T.edit} src="click" vol={0.35} />
      <Sfx at={T.struggling} src="glitch" vol={0.14} />
      <Sfx at={T.get2} src="whoosh" vol={0.16} />
      {NAMES.map((_, i) => (
        <Sfx key={`d${i}`} at={T.dm + 4 + i * 5} src="tick" vol={0.12} />
      ))}
      <Sfx at={T.end} src="shimmer" vol={0.24} />
    </AbsoluteFill>
  );
};
