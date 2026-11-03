import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, lerp, prog } from "../viewz/util";
import { KLogo, MiniMotion, Phone, Pop, Row, caps, exitStyle, heavy, sans } from "../kinetik3/Kinetik3";
import { AMB, CommentOutro, CommentOutroSfx, FlutedShell, OR, Sfx, glowO, panel } from "../kinetik12/shared";
import { CUT, DURATION_FRAMES, T } from "./timing";

loadViewzFonts();
loadFonts();

/** Écran d'app générique (pour les « screens » déposés). */
const AppScreen: React.FC<{ w: number; v: number }> = ({ w, v }) => (
  <div style={{ width: w, height: w * 2, borderRadius: w * 0.14, border: "4px solid #1d1b29", background: "linear-gradient(180deg, #faf7ff, #ece6ff)", overflow: "hidden", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
    <div style={{ margin: `${w * 0.16}px ${w * 0.1}px ${w * 0.06}px`, height: w * 0.08, width: "50%", borderRadius: 6, background: "#7c3aed" }} />
    {v === 0 ? <div style={{ margin: `0 ${w * 0.1}px`, height: w * 0.5, borderRadius: w * 0.06, background: "linear-gradient(135deg, #8b5cf6, #ff6a2b)" }} /> : null}
    {v === 1
      ? [0.7, 0.45, 0.9, 0.6].map((h, i) => <div key={i} style={{ display: "inline-block", marginLeft: i ? w * 0.05 : w * 0.12, width: w * 0.12, height: w * 0.5 * h, borderRadius: 4, background: i % 2 ? "#a78bfa" : "#ff6a2b", verticalAlign: "bottom", marginTop: w * 0.5 * (1 - h) }} />)
      : null}
    {v === 2 ? [0, 1, 2].map((i) => <div key={i} style={{ margin: `${w * 0.05}px ${w * 0.1}px`, height: w * 0.16, borderRadius: w * 0.04, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }} />) : null}
    {[0, 1, 2].map((i) => <div key={`l${i}`} style={{ margin: `${w * 0.05}px ${w * 0.1}px`, height: w * 0.05, width: `${70 - i * 15}%`, borderRadius: 4, background: "rgba(40,20,80,0.18)" }} />)}
  </div>
);

export const Launch: React.FC = () => {
  const f = useCurrentFrame();
  const sc = (a: number, b: number) => f >= a - 1 && f < b + 1;
  // compte à rebours jusqu'au lancement (fictif), qui s'accélère
  const left = Math.max(0, 86399 - Math.round(f * 37 + Math.max(0, f - T.and) * 400));
  const hh = String(Math.floor(left / 3600)).padStart(2, "0");
  const mm = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const url = "kinetik-app.com";
  const nUrl = Math.round(lerp(0, url.length, prog(f, T.kinetik, T.com + 6, (x) => x)));
  return (
    <FlutedShell
      f={f}
      frames={DURATION_FRAMES}
      dir="kinetik13"
      cuts={Object.values(CUT)}
      speedUpAt={CUT.c}
      hits={[
        [T.ready, 12],
        [T.tomorrow, 16],
        [T.video, 10],
        [T.kinetik, 12],
        [T.ready2, 14],
        [T.promo, 14],
      ]}
      flashes={[T.tomorrow, T.ready2]}
      sfx={
        <>
          <Sfx at={T.ready} src="pop" vol={0.16} />
          <Sfx at={T.tomorrow} src="impact" vol={0.2} />
          {Array.from({ length: 14 }, (_, i) => (
            <Sfx key={`t${i}`} at={T.and + i * 4} src="tick" vol={0.08 + i * 0.006} />
          ))}
          <Sfx at={T.kinetik} src="shimmer" vol={0.26} />
          {Array.from({ length: 15 }, (_, i) => (
            <Sfx key={`u${i}`} at={T.kinetik + i * 2.7} src="key" vol={0.2} />
          ))}
          <Sfx at={T.logo} src="pop" vol={0.16} />
          {[0, 1, 2].map((i) => (
            <Sfx key={`s${i}`} at={T.screens + i * 3} src="pop" vol={0.14} />
          ))}
          <Sfx at={T.your3} src="scan" vol={0.14} />
          <Sfx at={T.ready2} src="drop" vol={0.26} />
          <Sfx at={T.promo} src="impact" vol={0.18} />
          <CommentOutroSfx t={T} />
        </>
      }
    >
      {/* ---- A : app prête, lancement demain ---- */}
      {sc(0, CUT.b) && (
        <AbsoluteFill style={exitStyle(f, CUT.b, 3)}>
          <Row top={140} gap={20} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.your} style={sans(84)}>Your app is</Pop>
            <Pop f={f} at={T.ready} style={heavy(130, "#fff", 85)}>READY.</Pop>
          </Row>
          <Row top={300} gap={20} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.your2} style={sans(84)}>Your launch is</Pop>
          </Row>
          <Row top={410}>
            <Pop f={f} at={T.tomorrow} style={heavy(165, OR, 84)} glow={glowO}>TOMORROW.</Pop>
          </Row>
          <div style={{ position: "absolute", left: 120, top: 720, opacity: prog(f, 2, 10), transform: `translateY(${(1 - prog(f, 2, 16, eExpo)) * 200}px) rotate(-4deg)` }}>
            <Phone w={300} glow={0.6}>
              <MiniMotion f={f} w={300} t0={0} />
            </Phone>
            {f >= T.ready ? <div style={{ position: "absolute", right: -40, top: 60, transform: `scale(${prog(f, T.ready, T.ready + 8, eBack)})`, padding: "12px 22px", borderRadius: 999, background: "#22c55e", ...caps(22, "#fff"), letterSpacing: "0.1em" }}>✓ app ready</div> : null}
          </div>
          <div style={{ position: "absolute", right: 110, top: 820, width: 380, padding: "26px 0", ...panel, textAlign: "center", opacity: prog(f, T.launch, T.launch + 8), transform: `rotate(4deg) scale(${prog(f, T.launch, T.launch + 12, eBack)})` }}>
            <div style={{ ...caps(22, AMB), letterSpacing: "0.2em" }}>launch day</div>
            <div style={{ ...heavy(150, "#fff", 90), marginTop: 8 }}>🚀</div>
            <div style={{ ...caps(24, "#fff"), letterSpacing: "0.15em", marginTop: 6 }}>tomorrow · 9:00</div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1460, textAlign: "center", opacity: prog(f, T.tomorrow, T.tomorrow + 8) }}>
            <div style={{ ...caps(22, AMB), letterSpacing: "0.25em" }}>launch in</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 110, color: "#fff", textShadow: `0 0 30px ${glowO}` }}>{hh}:{mm}:{ss}</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---- B : et toujours pas de vidéo… ---- */}
      {sc(CUT.b, CUT.c) && (
        <AbsoluteFill style={exitStyle(f, CUT.c)}>
          <Row top={150} gap={20}>
            <Pop f={f} at={T.and} style={sans(84)}>And you still</Pop>
          </Row>
          <Row top={270} gap={20} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.dont} style={sans(84)}>don&apos;t have a</Pop>
            <Pop f={f} at={T.video} style={heavy(140, OR, 85)} glow={glowO}>VIDEO…</Pop>
          </Row>
          <div style={{ position: "absolute", left: 540 - 180, top: 520, width: 360, height: 640, borderRadius: 48, border: "4px dashed rgba(255,170,120,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, background: "rgba(12,6,18,0.5)" }}>
            <span style={{ ...heavy(200, "rgba(255,255,255,0.4)", 90), opacity: 0.5 + 0.5 * Math.abs(Math.sin(f / 6)) }}>?</span>
            <span style={{ ...caps(24, "rgba(255,255,255,0.6)"), letterSpacing: "0.2em" }}>no promo video</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center" }}>
            <div style={{ ...caps(22, OR), letterSpacing: "0.25em" }}>launch in</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 120, color: OR, textShadow: `0 0 40px ${glowO}`, transform: `translateX(${Math.sin(f * 2.3) * 4}px)` }}>{hh}:{mm}:{ss}</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---- C : kinetik-app.com ---- */}
      {sc(CUT.c, CUT.d) && (
        <AbsoluteFill style={exitStyle(f, CUT.d)}>
          <Row top={640}>
            <Pop f={f} at={T.on} style={sans(90)}>On</Pop>
          </Row>
          <div style={{ position: "absolute", top: 780, left: 0, right: 0 }}>
            <KLogo f={f} at={T.kinetik} size={130} />
          </div>
          <div style={{ position: "absolute", left: 120, right: 120, top: 1010, height: 130, borderRadius: 999, border: `2px solid ${OR}`, background: "rgba(12,6,18,0.85)", boxShadow: `0 0 40px ${glowO}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${prog(f, T.kinetik - 2, T.kinetik + 10, eBack)})` }}>
            <span style={{ ...sans(76, "#fff") }}>{url.slice(0, nUrl)}</span>
            <span style={{ width: 4, height: 64, marginLeft: 6, background: AMB, opacity: Math.floor(f / 7) % 2 ? 1 : 0.2 }} />
          </div>
        </AbsoluteFill>
      )}

      {/* ---- D : ajoute logo + écrans ---- */}
      {sc(CUT.d, CUT.e) && (
        <AbsoluteFill style={exitStyle(f, CUT.e)}>
          <Row top={150} gap={20} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.add} style={sans(84)}>add your</Pop>
            <Pop f={f} at={T.logo} style={heavy(130, OR, 85)} glow={glowO}>LOGO</Pop>
          </Row>
          <Row top={310} gap={20} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.and2} style={sans(84)}>and</Pop>
            <Pop f={f} at={T.screens} style={heavy(130, "#fff", 85)}>SCREENS</Pop>
          </Row>
          <div style={{ position: "absolute", left: 90, right: 90, top: 520, height: 1060, ...panel, border: "3px dashed rgba(255,170,120,0.45)" }}>
            <div style={{ position: "absolute", top: 26, left: 0, right: 0, textAlign: "center", ...caps(22, AMB), letterSpacing: "0.2em" }}>drop your files</div>
            {/* logo */}
            {(() => {
              const q = prog(f, T.logo - 2, T.logo + 12, eBack);
              return (
                <div style={{ position: "absolute", left: 360, top: lerp(-200, 110, Math.min(1, q)), opacity: Math.min(1, q * 1.5), width: 180, height: 180, borderRadius: 40, background: "linear-gradient(135deg, #8b5cf6, #ff6a2b)", display: "flex", alignItems: "center", justifyContent: "center", ...heavy(110, "#fff", 90), boxShadow: `0 0 40px ${glowO}` }}>F</div>
              );
            })()}
            {/* écrans */}
            {[0, 1, 2].map((i) => {
              const q = prog(f, T.screens + i * 3, T.screens + i * 3 + 12, eBack);
              return (
                <div key={i} style={{ position: "absolute", left: 90 + i * 250, top: lerp(-600, 380, Math.min(1, q)), opacity: Math.min(1, q * 1.5), transform: `rotate(${(i - 1) * 6}deg)` }}>
                  <AppScreen w={200} v={i} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ---- E : la vidéo est prête en quelques secondes ---- */}
      {sc(CUT.e, CUT.f) && (
        <AbsoluteFill style={exitStyle(f, CUT.f)}>
          <Row top={140} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.your3} style={sans(84)}>your video&apos;s</Pop>
          </Row>
          <Row top={260}>
            <Pop f={f} at={T.ready2} style={heavy(220, OR, 90)} glow={glowO}>READY</Pop>
          </Row>
          <Row top={490}>
            <Pop f={f} at={T.seconds - 4} style={sans(84)}>in seconds.</Pop>
          </Row>
          {(() => {
            const inQ = prog(f, CUT.e, CUT.e + 12, eExpo);
            const pct = Math.round(100 * prog(f, CUT.e + 2, T.ready2 + 2, eInOut));
            return (
              <>
                <div style={{ position: "absolute", left: 540 - 165, top: 680, opacity: inQ, transform: `translateY(${(1 - inQ) * 200}px) rotate(${Math.sin(f / 18) * 2}deg)` }}>
                  <Phone w={330} glow={0.5 + 0.5 * (pct / 100)}>
                    <MiniMotion f={f} w={330} t0={CUT.e} />
                    <div style={{ position: "absolute", inset: 0, background: "#05040a", clipPath: `inset(${pct}% 0 0 0)`, opacity: 0.85 }} />
                  </Phone>
                </div>
                <div style={{ position: "absolute", left: 200, right: 200, top: 1430 }}>
                  <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${OR}, ${AMB})`, boxShadow: `0 0 16px ${OR}` }} />
                  </div>
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", ...caps(24, AMB), letterSpacing: "0.15em" }}>
                    <span>{pct >= 100 ? "promo ready" : "generating"}</span>
                    <span style={{ color: "#fff" }}>{pct}%</span>
                  </div>
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ---- F : toi l'app, nous la promo ---- */}
      {sc(CUT.f, CUT.g) && (
        <AbsoluteFill style={exitStyle(f, CUT.g)}>
          <Row top={180} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.you} style={sans(84)}>You built</Pop>
            <Pop f={f} at={T.app3} style={heavy(130, "#fff", 85)}>THE APP,</Pop>
          </Row>
          <Row top={340} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.well} style={sans(84)}>we&apos;ll handle</Pop>
          </Row>
          <Row top={450}>
            <Pop f={f} at={T.promo} style={heavy(220, OR, 90)} glow={glowO}>THE PROMO.</Pop>
          </Row>
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center", gap: 40 }}>
            {[
              { who: "you", icon: "</>", what: "the app", at: T.built },
              { who: "kinetik", icon: "▶", what: "the promo", at: T.handle },
            ].map((c, i) => {
              const q = prog(f, c.at, c.at + 12, eBack);
              return (
                <div key={c.who} style={{ width: 380, padding: "40px 0", ...panel, border: `2px solid ${i ? OR : "rgba(255,170,120,0.35)"}`, boxShadow: i ? `0 0 40px ${glowO}` : panel.boxShadow, textAlign: "center", transform: `scale(${q})`, opacity: Math.min(1, q * 1.5) }}>
                  <div style={{ ...caps(22, AMB), letterSpacing: "0.25em" }}>{c.who}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 110, color: i ? OR : "#fff", margin: "16px 0" }}>{c.icon}</div>
                  <div style={{ ...sans(44, "#fff") }}>{c.what} ✓</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {f >= CUT.g - 1 && <CommentOutro f={f} a={CUT.g} t={T} />}
    </FlutedShell>
  );
};

