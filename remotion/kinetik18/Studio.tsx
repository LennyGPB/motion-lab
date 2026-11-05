import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, lerp, prog } from "../viewz/util";
import { KinetikGlyph, SANS } from "../kinetik2/parts";
import { KLogo, MiniMotion, Phone, Pop, Row, Screen, caps, exitStyle, heavy, sans } from "../kinetik3/Kinetik3";
import { AMB, CommentOutro, CommentOutroSfx, FlutedShell, OR, Sfx, glowO, panel } from "../kinetik12/shared";
import { CUT, DURATION_FRAMES, T } from "./timing";

loadViewzFonts();
loadFonts();

const PU = "#a855f7";

/* ---------- A : No time, no budget, no skills? ---------- */
const NOS = [
  { at: T.no, w: "TIME", icon: "⏰" },
  { at: T.no2, w: "BUDGET", icon: "💸" },
  { at: T.no3, w: "SKILLS", icon: "🎓" },
];
const SceneA: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={exitStyle(f, CUT.b, 3)}>
    <div style={{ position: "absolute", inset: 0, perspective: 1400 }}>
      {NOS.map((n, i) => {
        const q = prog(f, n.at - 2, n.at + 9, eBack);
        const x = prog(f, n.at + 6, n.at + 12, eExpo);
        return (
          <div key={n.w} style={{ position: "absolute", left: 90, right: 90, top: 330 + i * 400, height: 330, ...panel, display: "flex", alignItems: "center", gap: 40, padding: "0 60px", transform: `translateZ(${(1 - Math.min(1, q)) * -1200}px) rotateX(${(1 - Math.min(1, q)) * 50}deg) rotateZ(${(i - 1) * -3}deg)`, opacity: Math.min(1, q * 2) }}>
            <span style={{ fontSize: 130 }}>{n.icon}</span>
            <div>
              <div style={sans(70)}>no</div>
              <div style={heavy(118, i === 2 ? OR : "#fff", 80)}>{n.w}{i === 2 ? "?" : ","}</div>
            </div>
            <svg width={160} height={160} viewBox="0 0 100 100" style={{ position: "absolute", right: 30, width: 120, height: 120, opacity: x }}>
              <path d="M 15 15 L 85 85 M 85 15 L 15 85" stroke={OR} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${x} 1`} style={{ filter: `drop-shadow(0 0 12px ${OR})` }} />
            </svg>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

/* ---------- B : Kinetik gives you a full creative studio, ready in seconds ---------- */
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const doors = prog(f, T.studio - 4, T.studio + 14, eInOut);
  const pct = Math.round(100 * prog(f, T.ready, T.secEnd - 4, eInOut));
  const W0 = 860;
  return (
    <AbsoluteFill style={exitStyle(f, CUT.c)}>
      <div style={{ position: "absolute", top: 140, left: 0, right: 0 }}>
        <KLogo f={f} at={T.kinetik} size={110} />
      </div>
      <Row top={330}>
        <Pop f={f} at={T.gives} style={sans(66)}>gives you a</Pop>
      </Row>
      <Row top={430} gap={22}>
        <Pop f={f} at={T.full} style={heavy(130, "#fff", 80)}>FULL</Pop>
        <Pop f={f} at={T.creative} style={heavy(130, AMB, 80)}>CREATIVE</Pop>
      </Row>
      <Row top={570}>
        <Pop f={f} at={T.studio} style={heavy(170, OR, 78)} glow={glowO}>STUDIO</Pop>
      </Row>
      {/* le studio derrière deux portes qui s'ouvrent en 3D */}
      <div style={{ position: "absolute", left: 540 - W0 / 2, top: 830, width: W0, height: W0 / (2000 / 1215), perspective: 1600 }}>
        <div style={{ position: "absolute", inset: 0, opacity: prog(f, T.studio - 4, T.studio + 6), transform: `scale(${lerp(0.9, 1, doors)})` }}>
          <Screen f={f} src="create" aspect={2000 / 1215} w={W0} zoom={lerp(1.3, 1, doors)} origin={{ x: 0.5, y: 0.6 }} center />
        </div>
        {[0, 1].map((i) => (
          <div key={i} style={{ position: "absolute", top: -6, bottom: -6, [i ? "right" : "left"]: -6, width: W0 / 2 + 6, borderRadius: 22, background: "linear-gradient(160deg, #2a1236, #0c0612)", border: "1.5px solid rgba(255,170,120,0.5)", transformOrigin: i ? "100% 50%" : "0% 50%", transform: `rotateY(${(i ? 1 : -1) * doors * 105}deg)`, display: "flex", alignItems: "center", justifyContent: i ? "flex-start" : "flex-end", opacity: prog(f, T.full - 2, T.full + 6) } as React.CSSProperties}>
            <span style={{ ...caps(26, AMB), letterSpacing: "0.3em", margin: 30 }}>{i ? "dio" : "stu"}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 1450, opacity: prog(f, T.ready - 2, T.ready + 6) }}>
        <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${OR}, ${AMB})`, boxShadow: `0 0 16px ${OR}` }} />
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", ...caps(28, AMB), letterSpacing: "0.15em" }}>
          <span>{pct >= 100 ? "ready" : "setting up your studio"}</span>
          <span style={{ color: "#fff" }}>{pct}%</span>
        </div>
      </div>
      <Row top={1580} gap={20}>
        <Pop f={f} at={T.ready} style={heavy(110, "#fff", 80)}>READY</Pop>
        <Pop f={f} at={T.seconds - 4} style={sans(70, AMB)}>in seconds</Pop>
      </Row>
    </AbsoluteFill>
  );
};

/* ---------- C + D : les 4 formats, puis tout s'adapte à ta marque ---------- */
const brandify = (f: number, i: number) => prog(f, T.brand + i * 4, T.brand + i * 4 + 10, eInOut);
const Card: React.FC<{ f: number; i: number; at: number; label: string; children: React.ReactNode }> = ({ f, i, at, label, children }) => {
  const q = prog(f, at - 3, at + 12, eBack);
  const b = brandify(f, i);
  const col = i % 2;
  const row = Math.floor(i / 2);
  return (
    <div style={{ position: "absolute", left: 80 + col * 470, top: 560 + row * 560, width: 450, height: 520, transform: `translateZ(${(1 - Math.min(1, q)) * -1400}px) rotateY(${(1 - Math.min(1, q)) * (col ? 80 : -80) + b * 360 + (col ? -6 : 6)}deg) rotateX(${row ? -5 : 5}deg)`, opacity: Math.min(1, q * 2), transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden", border: `2px solid ${b > 0.5 ? OR : "rgba(255,255,255,0.25)"}`, boxShadow: b > 0.5 ? `0 0 40px ${glowO}` : "0 20px 50px rgba(0,0,0,0.5)", filter: b > 0.5 ? undefined : "grayscale(0.85) brightness(0.8)" }}>{children}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -60, textAlign: "center", ...caps(24, b > 0.5 ? AMB : "#fff"), letterSpacing: "0.2em" }}>{label}</div>
    </div>
  );
};
const SceneCD: React.FC<{ f: number }> = ({ f }) => {
  const auto = prog(f, T.auto, T.auto + 10, eBack);
  return (
    <AbsoluteFill style={exitStyle(f, CUT.e)}>
      {f < CUT.d ? (
        <>
          <Row top={170} gap={20}>
            <Pop f={f} at={T.videos} style={heavy(110, "#fff", 80)}>VIDEOS,</Pop>
            <Pop f={f} at={T.animated} style={heavy(110, AMB, 80)}>LOGOS,</Pop>
          </Row>
          <Row top={300} gap={20}>
            <Pop f={f} at={T.posts} style={heavy(110, "#fff", 80)}>POSTS,</Pop>
            <Pop f={f} at={T.visuals} style={heavy(110, OR, 80)} glow={glowO}>VISUALS</Pop>
          </Row>
        </>
      ) : (
        <>
          <Row top={150}>
            <Pop f={f} at={T.everything} style={heavy(120, "#fff", 80)}>EVERYTHING</Pop>
          </Row>
          <Row top={280} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.adapts} style={sans(66)}>adapts to</Pop>
            <Pop f={f} at={T.brand - 3} style={heavy(110, OR, 80)} glow={glowO}>YOUR BRAND</Pop>
          </Row>
        </>
      )}
      <div style={{ position: "absolute", inset: 0, perspective: 1700 }}>
        <Card f={f} i={0} at={T.videos} label="videos">
          <AbsoluteFill style={{ background: "#05040a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Phone w={200}>
              <MiniMotion f={f} w={200} t0={T.videos} />
            </Phone>
          </AbsoluteFill>
        </Card>
        <Card f={f} i={1} at={T.animated} label="animated logos">
          <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #3b1a4a, #0c0612)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: `rotate(${f * 3}deg) scale(${1 + 0.1 * Math.sin(f / 4)})` }}>
              <KinetikGlyph size={220} f={f} />
            </div>
          </AbsoluteFill>
        </Card>
        <Card f={f} i={2} at={T.posts} label="posts">
          <AbsoluteFill style={{ background: "#0f0a16", padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[0, 1, 2, 3].map((k) => (
              <div key={k} style={{ borderRadius: 14, background: `linear-gradient(${135 + k * 40}deg, ${[OR, PU, AMB, "#f472b6"][k]}, #1a0b2a)`, display: "flex", alignItems: "flex-end", padding: 12, ...caps(16, "#fff"), letterSpacing: "0.1em" }}>{["new", "sale", "launch", "tip"][k]}</div>
            ))}
          </AbsoluteFill>
        </Card>
        <Card f={f} i={3} at={T.visuals} label="visuals">
          <AbsoluteFill style={{ background: `linear-gradient(160deg, ${PU}, ${OR})` }}>
            <div style={{ position: "absolute", left: "50%", top: "40%", width: 200, height: 200, margin: -100, borderRadius: 40, background: "rgba(255,255,255,0.9)", transform: `rotate(${f * 1.5}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", ...heavy(60, "#fff", 80) }}>YOUR BRAND</div>
          </AbsoluteFill>
        </Card>
      </div>
      {/* pastilles de marque qui balaient les cartes */}
      {f >= CUT.d ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1700, display: "flex", justifyContent: "center", gap: 20 }}>
          {[OR, AMB, PU, "#ffffff"].map((c, i) => (
            <div key={c} style={{ width: 70, height: 70, borderRadius: "50%", background: c, border: "3px solid rgba(255,255,255,0.7)", boxShadow: `0 0 20px ${c}`, transform: `scale(${prog(f, T.adapts + i * 3, T.adapts + i * 3 + 8, eBack)})` }} />
          ))}
          {auto > 0 ? <div style={{ marginLeft: 20, padding: "14px 28px", borderRadius: 999, background: OR, ...caps(26, "#fff"), letterSpacing: "0.12em", transform: `scale(${Math.min(1, auto)})`, display: "flex", alignItems: "center" }}>✓ automatically</div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- E : kinetik-app.com ---------- */
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const url = "kinetik-app.com";
  const n = Math.round(lerp(0, url.length, prog(f, T.kinetik2, T.comEnd, (x) => x)));
  const site = prog(f, T.kinetik2, T.kinetik2 + 14, eExpo);
  return (
    <AbsoluteFill style={exitStyle(f, CUT.f)}>
      <Row top={300}>
        <Pop f={f} at={T.head} style={heavy(140, "#fff", 80)}>HEAD TO</Pop>
      </Row>
      <div style={{ position: "absolute", left: 110, right: 110, top: 520, padding: "26px 34px", ...panel, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", opacity: prog(f, T.head + 4, T.head + 10) }}>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 70, color: "#fff" }}>
          {url.slice(0, n)}
          <span style={{ opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: OR }}>|</span>
        </span>
      </div>
      <div style={{ position: "absolute", inset: 0, perspective: 1600 }}>
        <div style={{ position: "absolute", left: 90, top: 820, transform: `translateZ(${lerp(-900, 0, site)}px) rotateX(${lerp(40, 14, site) + 2 * Math.sin(f / 16)}deg) rotateY(${-8 * Math.sin(f / 22)}deg)`, opacity: site }}>
          <Screen f={f} src="website" aspect={2000 / 1027} w={900} zoom={1} origin={{ x: 0.5, y: 0.5 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
export const Studio: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <FlutedShell
      f={f}
      frames={DURATION_FRAMES}
      dir="kinetik18"
      cuts={Object.values(CUT)}
      speedUpAt={CUT.b}
      hits={[
        [T.time + 6, 10],
        [T.budget + 6, 10],
        [T.skills + 6, 12],
        [T.kinetik, 14],
        [T.studio, 16],
        [T.brand, 12],
        [T.auto, 10],
      ]}
      flashes={[T.kinetik, T.studio]}
      sfx={
        <>
          {[T.time, T.budget, T.skills].map((a, i) => (
            <React.Fragment key={`n${i}`}>
              <Sfx at={a - 3} src="pop" vol={0.16} />
              <Sfx at={a + 6} src="impact" vol={0.14} />
            </React.Fragment>
          ))}
          <Sfx at={T.kinetik} src="shimmer" vol={0.24} />
          <Sfx at={T.studio - 4} src="whoosh" vol={0.18} />
          <Sfx at={T.studio} src="drop" vol={0.2} />
          {Array.from({ length: 8 }, (_, i) => (
            <Sfx key={`r${i}`} at={T.ready + i * 3} src="tick" vol={0.08 + i * 0.01} />
          ))}
          {[T.videos, T.animated, T.posts, T.visuals].map((a, i) => (
            <Sfx key={`c${i}`} at={a - 2} src="whoosh" vol={0.14} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <Sfx key={`b${i}`} at={T.brand + i * 4} src="pop" vol={0.14} />
          ))}
          <Sfx at={T.auto} src="shimmer" vol={0.2} />
          <Sfx at={T.head} src="pop" vol={0.15} />
          {Array.from({ length: 15 }, (_, i) => (
            <Sfx key={`k${i}`} at={T.kinetik2 + i * 3} src="key" vol={0.18} />
          ))}
          <CommentOutroSfx t={T} />
        </>
      }
    >
      {f < CUT.b + 1 && <SceneA f={f} />}
      {f >= CUT.b - 1 && f < CUT.c + 1 && <SceneB f={f} />}
      {f >= CUT.c - 1 && f < CUT.e + 1 && <SceneCD f={f} />}
      {f >= CUT.e - 1 && f < CUT.f + 1 && <SceneE f={f} />}
      {f >= CUT.f - 1 && <CommentOutro f={f} a={CUT.f} t={T} />}
    </FlutedShell>
  );
};
