import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, hash, lerp, prog } from "../viewz/util";
import { SANS, Streaks } from "../kinetik2/parts";
import { Float3D, KLogo, MiniMotion, Phone, Pop, Row, Screen, caps, exitStyle, heavy, sans } from "../kinetik3/Kinetik3";
import { CardCrop } from "../kinetik5/Kinetik5";
import { FlutedBg } from "./FlutedBg";
import { CUT, DURATION_FRAMES, T, VO } from "./timing";

loadViewzFonts();
loadFonts();

const OR = "#ff6a2b";
const AMB = "#ffb347";
const glowO = "rgba(255,106,43,0.6)";
const SW = 980;

const Sfx: React.FC<{ at: number; src: string; vol: number }> = ({ at, src, vol }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Html5Audio src={staticFile(`kinetik3/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

/** Devis d'agence générique (aucune vraie société). */
const Invoice: React.FC<{ f: number; rows: { k: string; v: string; at: number }[]; total: string; totalAt: number; stamp?: number }> = ({ f, rows, total, totalAt, stamp = 0 }) => (
  <div style={{ width: 760, padding: "46px 50px", borderRadius: 32, background: "linear-gradient(160deg, rgba(255,250,245,0.96), rgba(240,230,222,0.94))", boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 60px rgba(255,106,43,0.35)", position: "relative", fontFamily: SANS, color: "#1a1020", overflow: "hidden" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontWeight: 800, fontSize: 40, letterSpacing: "0.12em" }}>INVOICE</span>
      <span style={{ fontWeight: 600, fontSize: 22, color: "#7a6a70" }}>#0427 · creative agency</span>
    </div>
    <div style={{ height: 2, background: "#1a1020", opacity: 0.15, margin: "26px 0" }} />
    {rows.map((r) => (
      <div key={r.k} style={{ display: "flex", justifyContent: "space-between", fontSize: 32, fontWeight: 600, padding: "12px 0", opacity: prog(f, r.at, r.at + 6), transform: `translateX(${(1 - prog(f, r.at, r.at + 8, eExpo)) * 40}px)` }}>
        <span style={{ color: "#5a4a50" }}>{r.k}</span>
        <span style={{ fontWeight: 800 }}>{r.v}</span>
      </div>
    ))}
    <div style={{ height: 2, background: "#1a1020", opacity: 0.15, margin: "22px 0" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: prog(f, totalAt, totalAt + 6) }}>
      <span style={{ fontWeight: 800, fontSize: 30, letterSpacing: "0.1em" }}>TOTAL</span>
      <span style={{ ...heavy(96, OR, 90) }}>{total}</span>
    </div>
    {stamp > 0 ? (
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) rotate(-14deg) scale(${lerp(2.4, 1, stamp)})`, opacity: Math.min(1, stamp * 1.5), padding: "16px 46px", border: `8px solid ${OR}`, borderRadius: 18, ...heavy(120, OR, 90), background: "rgba(255,250,245,0.85)" }}>VOID</div>
    ) : null}
  </div>
);

export const Agency: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = Object.values(CUT);
  const glitch = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const hits: [number, number][] = [
    [T.two, 14],
    [T.weeks, 10],
    [T.kinetik, 14],
    [T.seconds, 12],
    [T.hundred, 12],
    [T.no, 10],
    [T.invoice, 26],
  ];
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const flash = Math.max(0, ...[T.kinetik, T.invoice].map((h) => (f >= h ? 0.8 * Math.exp(-(f - h) / 2.2) : 0)));
  const sc = (a: number, b: number) => f >= a - 1 && f < b + 1;
  const n2000 = Math.round(lerp(0, 2000, prog(f, T.two, T.dollars + 6, eExpo)));
  const n100 = Math.round(lerp(0, 100, prog(f, T.over, T.hundred + 10, eExpo)));
  return (
    <AbsoluteFill style={{ background: "#07030c", overflow: "hidden" }}>
      <FlutedBg heat={0.8 + 0.2 * Math.sin(f / 40)} speed={1 + 0.6 * prog(f, CUT.b, CUT.b + 20)} />
      {/* lisibilité : voile sombre en haut et en bas */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,2,10,0.75) 0%, rgba(5,2,10,0.25) 38%, rgba(5,2,10,0.2) 62%, rgba(5,2,10,0.7) 100%)" }} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)` }}>
        {/* ---- A : l'agence ---- */}
        {sc(0, CUT.b) && (
          <AbsoluteFill style={exitStyle(f, CUT.b)}>
            <Row top={140}>
              <Pop f={f} at={T.an} style={sans(96)}>An agency wants</Pop>
            </Row>
            <Row top={260}>
              <Pop f={f} at={T.two} style={heavy(250, OR, 92)} glow={glowO}>
                ${n2000.toLocaleString("en-US")}
              </Pop>
            </Row>
            <Row top={490} gap={22}>
              <Pop f={f} at={T.and} style={sans(90)}>and</Pop>
              <Pop f={f} at={T.three} style={heavy(150, "#fff", 85)}>3 WEEKS</Pop>
            </Row>
            <Row top={660}>
              <Pop f={f} at={T.for} style={sans(72)}>for your launch video?</Pop>
            </Row>
            <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 1300px" }}>
              <div style={{ position: "absolute", left: 540 - 380, top: 880, opacity: prog(f, T.agency, T.agency + 8), transform: `translateY(${(1 - prog(f, T.agency, T.agency + 18, eExpo)) * 300}px) rotateX(10deg) rotateZ(${-4 + Math.sin(f / 25)}deg)` }}>
                <Invoice
                  f={f}
                  rows={[
                    { k: "Launch video (30 s)", v: "$2,000", at: T.two },
                    { k: "Delivery", v: "3 weeks", at: T.three },
                    { k: "Revisions", v: "2 max", at: T.launch },
                  ]}
                  total="$2,000"
                  totalAt={T.video}
                />
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        )}

        {/* ---- B : générer en quelques secondes ---- */}
        {sc(CUT.b, CUT.c) && (
          <AbsoluteFill style={exitStyle(f, CUT.c)}>
            <div style={{ position: "absolute", top: 140, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
              <Pop f={f} at={T.with} style={sans(90, "#ffe6d8")}>With</Pop>
              <KLogo f={f} at={T.kinetik} size={100} />
            </div>
            <Row top={320} gap={22}>
              <Pop f={f} at={T.you} style={sans(96)}>you</Pop>
              <Pop f={f} at={T.generate} style={heavy(150, "#fff", 82)}>GENERATE IT</Pop>
            </Row>
            <Row top={500}>
              <Pop f={f} at={T.in} style={heavy(200, OR, 85)} glow={glowO}>IN SECONDS</Pop>
            </Row>
            {(() => {
              const inQ = prog(f, CUT.b + 4, CUT.b + 18, eExpo);
              const pct = Math.round(100 * prog(f, T.generate, T.seconds + 10, eInOut));
              return (
                <>
                  <div style={{ position: "absolute", left: 540 - 165, top: 790, opacity: inQ, transform: `translateY(${(1 - inQ) * 200}px) rotate(${Math.sin(f / 18) * 2}deg)` }}>
                    <Phone w={330} glow={0.5 + 0.5 * (pct / 100)}>
                      <MiniMotion f={f} w={330} t0={CUT.b} />
                      <div style={{ position: "absolute", inset: 0, background: "#05040a", clipPath: `inset(${pct}% 0 0 0)`, opacity: 0.85 }} />
                    </Phone>
                  </div>
                  <div style={{ position: "absolute", left: 180, right: 180, top: 1500, opacity: inQ }}>
                    <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${OR}, ${AMB})`, boxShadow: `0 0 16px ${OR}` }} />
                    </div>
                    <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", ...caps(24, AMB), letterSpacing: "0.15em" }}>
                      <span>{pct >= 100 ? "ready in 2 s" : "generating"}</span>
                      <span style={{ color: "#fff" }}>{pct}%</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </AbsoluteFill>
        )}

        {/* ---- C : retoucher autant qu'on veut ---- */}
        {sc(CUT.c, CUT.d) && (
          <AbsoluteFill>
            <div style={exitStyle(f, CUT.d, 3)}>
              <Row top={160} gap={22}>
                <Pop f={f} at={T.and2} style={sans(96)}>and</Pop>
                <Pop f={f} at={T.tweak} style={heavy(190, OR, 82)} glow={glowO}>TWEAK IT</Pop>
              </Row>
              <Row top={390}>
                <Pop f={f} at={T.much} style={sans(90)}>as much as you want</Pop>
              </Row>
            </div>
            <Float3D f={f} a={CUT.c} b={CUT.d} cy={1150} w={SW} h={SW / 1.894} ry={-12}>
              <Screen center dir="kinetik4" f={f} src="editor" aspect={1.894} w={SW} zoom={lerp(1, 1.8, prog(f, CUT.c + 4, CUT.d, eInOut))} origin={{ x: lerp(0.4, 0.33, prog(f, CUT.c, CUT.d)), y: lerp(0.4, 0.82, prog(f, CUT.c + 4, CUT.d, eInOut)) }} highlight={{ x: 0.248, y: 0.839, w: 0.085, h: 0.034, on: prog(f, T.want - 4, T.want + 4), r: 10 }} />
            </Float3D>
          </AbsoluteFill>
        )}

        {/* ---- D : 100+ modèles ---- */}
        {sc(CUT.d, CUT.e) && (
          <AbsoluteFill style={exitStyle(f, CUT.e)}>
            <Row top={150}>
              <Pop f={f} at={T.pick} style={sans(96)}>Pick from over</Pop>
            </Row>
            <Row top={270}>
              <Pop f={f} at={T.hundred} style={heavy(260, OR, 92)} glow={glowO}>
                {n100}+
              </Pop>
            </Row>
            <Row top={520}>
              <Pop f={f} at={T.custom} style={heavy(120, "#fff", 80)}>CUSTOM-MADE</Pop>
            </Row>
            <Row top={650}>
              <Pop f={f} at={T.templates} style={heavy(120, AMB, 80)}>TEMPLATES</Pop>
            </Row>
            <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 1300px" }}>
              <div style={{ position: "absolute", left: 540, top: 1300, transformStyle: "preserve-3d", transform: `translateZ(-480px) rotateX(-6deg) rotateY(${(f - CUT.d) * 2.2}deg)` }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} style={{ position: "absolute", left: -130, top: -230, transform: `rotateY(${i * 36}deg) translateZ(620px)`, backfaceVisibility: "hidden", opacity: prog(f, CUT.d + i * 2, CUT.d + i * 2 + 10) }}>
                    <CardCrop i={i * 2 + 1} w={260} />
                  </div>
                ))}
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        )}

        {/* ---- E : même rendu pro, pas de facture ---- */}
        {f >= CUT.e - 1 && (
          <AbsoluteFill>
            <Row top={140}>
              <Pop f={f} at={T.same} style={heavy(128, "#fff", 80)}>SAME PRO LOOK.</Pop>
            </Row>
            <Row top={330}>
              <Pop f={f} at={T.no} style={heavy(170, OR, 85)} glow={glowO}>NO INVOICE.</Pop>
            </Row>
            <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 1200px" }}>
              <div style={{ position: "absolute", left: 540 - 380, top: 660, opacity: prog(f, CUT.e, CUT.e + 8) * (1 - prog(f, T.end, T.end + 10)), transform: `translateY(${(1 - prog(f, CUT.e, CUT.e + 16, eExpo)) * 200 + prog(f, T.end, T.end + 12, eInOut) * 300}px) rotateX(10deg) rotateZ(${3 + Math.sin(f / 25)}deg) scale(${0.85})` }}>
                <Invoice
                  f={f}
                  rows={[
                    { k: "Launch video", v: "$0", at: CUT.e },
                    { k: "Delivery", v: "seconds", at: CUT.e },
                    { k: "Revisions", v: "unlimited", at: CUT.e },
                  ]}
                  total="$0"
                  totalAt={CUT.e}
                  stamp={prog(f, T.invoice, T.invoice + 8, eBack)}
                />
              </div>
            </AbsoluteFill>
            {/* carte de fin */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: prog(f, T.end, T.end + 10) }}>
              <KLogo f={f} at={T.end} size={120} />
              <div style={{ ...caps(30, AMB), letterSpacing: "0.25em", marginTop: 10 }}>kinetik-app.com</div>
              <div style={{ padding: "18px 40px", borderRadius: 999, background: `linear-gradient(135deg, ${OR}, #c2410c)`, boxShadow: `0 0 40px ${glowO}`, ...sans(44), transform: `scale(${prog(f, T.end + 6, T.end + 16, eBack)})` }}>Create my video →</div>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 10, DURATION_FRAMES - 1, eInOut) }} />

      <Html5Audio src={staticFile("kinetik8/sfx/music.wav")} volume={0.3} />
      <Sequence from={VO} layout="none">
        <Html5Audio src={staticFile("kinetik8/voice.wav")} volume={0.92} />
      </Sequence>
      {cuts.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={c - 3} src="whoosh" vol={0.18} />
          <Sfx at={c} src="glitch" vol={0.1} />
        </React.Fragment>
      ))}
      <Sfx at={T.agency} src="whoosh" vol={0.16} />
      {Array.from({ length: 8 }, (_, i) => (
        <Sfx key={`n${i}`} at={T.two + i * 2.5} src="tick" vol={0.08} />
      ))}
      <Sfx at={T.weeks} src="pop" vol={0.16} />
      <Sfx at={T.kinetik} src="shimmer" vol={0.26} />
      <Sfx at={T.generate} src="scan" vol={0.16} />
      <Sfx at={T.seconds + 10} src="pop" vol={0.18} />
      <Sfx at={T.tweak} src="click" vol={0.35} />
      <Sfx at={T.hundred} src="impact" vol={0.18} />
      <Sfx at={T.same} src="pop" vol={0.16} />
      <Sfx at={T.invoice} src="drop" vol={0.28} />
      <Sfx at={T.end} src="shimmer" vol={0.24} />
    </AbsoluteFill>
  );
};
