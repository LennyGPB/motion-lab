import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, hash, lerp, prog } from "../viewz/util";
import { CYAN, GridFloor, LAV, SANS, Streaks } from "../kinetik2/parts";
import { KLogo, Pop, Row, Screen, caps, exitStyle, heavy, sans } from "../kinetik3/Kinetik3";
import { CommentOutro, CommentOutroSfx, Sfx } from "../kinetik12/shared";
import { CUT, DURATION_FRAMES, T } from "./timing";

loadViewzFonts();
loadFonts();

const RED = "#ff4d6d";
const glowC = "rgba(94,230,242,0.55)";
const panelC: React.CSSProperties = { borderRadius: 36, background: "rgba(3,14,18,0.86)", border: "1.5px solid rgba(94,230,242,0.45)", boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(94,230,242,0.3)" };

/* ---------- fenêtres d'outils (génériques) ---------- */
const Win: React.FC<{ title: string; accent: string; w: number; h: number; children: React.ReactNode }> = ({ title, accent, w, h, children }) => (
  <div style={{ width: w, height: h, borderRadius: 24, overflow: "hidden", background: "#0b0d12", border: `2px solid ${accent}`, boxShadow: `0 0 40px ${accent}66, 0 30px 60px rgba(0,0,0,0.6)` }}>
    <div style={{ height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
      <span style={{ marginLeft: 12, fontFamily: SANS, fontWeight: 800, fontSize: 24, color: "#fff" }}>{title}</span>
    </div>
    <div style={{ position: "relative", height: h - 56 }}>{children}</div>
  </div>
);
const EditWin: React.FC<{ f: number; w: number }> = ({ f, w }) => (
  <Win title="CapCut" accent="#ffffff" w={w} h={w * 0.66}>
    <div style={{ margin: 18, height: w * 0.22, borderRadius: 12, background: "linear-gradient(135deg, #2a2f3a, #11141b)" }} />
    {[0, 1, 2].map((r) => (
      <div key={r} style={{ position: "relative", height: 30, margin: "8px 18px", borderRadius: 6, background: "rgba(255,255,255,0.05)" }}>
        {[0, 1, 2].map((c) => <div key={c} style={{ position: "absolute", top: 4, bottom: 4, left: `${hash(r * 5 + c) * 25 + c * 32}%`, width: `${12 + hash(r + c * 3) * 16}%`, borderRadius: 5, background: ["#5ee6f2", "#c4b5ff", "#ffffff"][(r + c) % 3], opacity: 0.8 }} />)}
      </div>
    ))}
    <div style={{ position: "absolute", top: w * 0.26, bottom: 10, left: 18 + ((f * 6) % (w - 40)), width: 3, background: RED }} />
  </Win>
);
const PostWin: React.FC<{ f: number; w: number }> = ({ f, w }) => (
  <Win title="Canva" accent="#7dd3fc" w={w} h={w * 0.66}>
    <div style={{ position: "absolute", left: 20, top: 20, bottom: 20, width: 70, display: "flex", flexDirection: "column", gap: 10 }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 46, borderRadius: 10, background: "rgba(255,255,255,0.08)" }} />)}
    </div>
    <div style={{ position: "absolute", left: 110, right: 20, top: 20, bottom: 20, borderRadius: 14, background: "linear-gradient(160deg, #7dd3fc, #a78bfa)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 24, top: 24, ...heavy(w * 0.08, "#fff", 80) }}>SALE</div>
      <div style={{ position: "absolute", right: 24, bottom: 24, width: w * 0.16, height: w * 0.16, borderRadius: "50%", background: "#fff", transform: `scale(${1 + 0.08 * Math.sin(f / 5)})` }} />
    </div>
  </Win>
);
const MotionWin: React.FC<{ f: number; w: number }> = ({ f, w }) => (
  <Win title="After Effects" accent="#c4b5ff" w={w} h={w * 0.66}>
    <svg width={w} height={w * 0.66 - 56} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={20} x2={w - 20} y1={30 + i * 50} y2={30 + i * 50} stroke="rgba(255,255,255,0.06)" />)}
      <path d={`M 20 220 C ${w * 0.3} 220, ${w * 0.35} 40, ${w * 0.55} 60 S ${w * 0.8} 200, ${w - 20} 90`} stroke="#c4b5ff" strokeWidth={4} fill="none" />
      {[0.2, 0.45, 0.7, 0.9].map((x, i) => <rect key={i} x={w * x - 9} y={40 + i * 40} width={18} height={18} fill="#ffd36e" transform={`rotate(45 ${w * x} ${49 + i * 40})`} />)}
      <line x1={20 + ((f * 5) % (w - 40))} x2={20 + ((f * 5) % (w - 40))} y1={10} y2={w * 0.66 - 70} stroke="#5ee6f2" strokeWidth={3} />
    </svg>
  </Win>
);
const WINS = [EditWin, PostWin, MotionWin];

/* ---------- A + B : trois outils, et toi coincé au milieu ---------- */
const SceneAB: React.FC<{ f: number }> = ({ f }) => {
  const ats = [T.capcut, T.canva, T.after];
  const pos = [
    { x: 300, y: 700, r: -8 },
    { x: 780, y: 1000, r: 7 },
    { x: 320, y: 1320, r: -5 },
  ];
  const squeeze = prog(f, T.stuck - 4, T.middle + 6, eInOut);
  const stuckShake = f >= T.stuck ? Math.exp(-((f - T.stuck) % 16) / 4) * 12 : 0;
  const you = prog(f, T.and, T.and + 10, eBack);
  const WW = 560;
  return (
    <AbsoluteFill style={exitStyle(f, CUT.c)}>
      {/* titres */}
      {f < CUT.b ? (
        <>
          {[
            { at: T.capcut, end: T.canva, name: "CAPCUT", sub: "for editing" },
            { at: T.canva, end: T.after, name: "CANVA", sub: "for posts" },
            { at: T.after, end: CUT.b, name: "AFTER EFFECTS", sub: "for motion…" },
          ].map((l) =>
            f >= l.at - 1 && f < l.end ? (
              <React.Fragment key={l.name}>
                <Row top={170}>
                  <Pop f={f} at={l.at} style={heavy(l.name.length > 8 ? 120 : 170, "#fff", 80)}>{l.name}</Pop>
                </Row>
                <Row top={l.name.length > 8 ? 310 : 360}>
                  <Pop f={f} at={l.at + 8} style={sans(70, CYAN)}>{l.sub}</Pop>
                </Row>
              </React.Fragment>
            ) : null,
          )}
        </>
      ) : (
        <>
          <Row top={170} gap={22} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.and} style={sans(80)}>and you,</Pop>
          </Row>
          <Row top={290}>
            <Pop f={f} at={T.stuck} style={{ ...heavy(190, RED, 80), transform: `translateX(${(hash(f) - 0.5) * stuckShake}px)` }} glow="rgba(255,77,109,0.6)">STUCK</Pop>
          </Row>
          <Row top={480}>
            <Pop f={f} at={T.middle - 3} style={sans(76)}>in the middle?</Pop>
          </Row>
        </>
      )}
      {/* fenêtres en 3D */}
      <div style={{ position: "absolute", inset: 0, perspective: 1600 }}>
        {WINS.map((Wn, i) => {
          const q = prog(f, ats[i] - 3, ats[i] + 12, eBack);
          const p = pos[i];
          const cx = lerp(p.x, 540 + (i - 1) * 170, squeeze);
          const cy = lerp(p.y, 1120 + (i === 1 ? -180 : 120), squeeze);
          return (
            <div key={i} style={{ position: "absolute", left: cx - WW / 2, top: cy - WW * 0.33, transform: `translateZ(${(1 - Math.min(1, q)) * -1500 + squeeze * 120}px) rotateY(${p.r * 3 * (1 - squeeze) + (i - 1) * 25 * squeeze}deg) rotateZ(${p.r}deg) scale(${lerp(1, 0.78, squeeze)})`, opacity: Math.min(1, q * 2) }}>
              <Wn f={f} w={WW} />
            </div>
          );
        })}
      </div>
      {/* toi */}
      {you > 0 ? (
        <div style={{ position: "absolute", left: 540 - 70, top: 1120 - 70, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fff, #c4b5ff 60%, #7c5cff)", boxShadow: `0 0 50px ${LAV}`, transform: `scale(${Math.min(1, you) * (1 - 0.25 * squeeze)}) translateX(${(hash(f + 3) - 0.5) * stuckShake}px)`, display: "flex", alignItems: "center", justifyContent: "center", ...caps(22, "#1a1035"), letterSpacing: "0.1em" }}>you</div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- C : tout en un seul endroit ---------- */
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const merge = prog(f, CUT.c, T.kinetik + 4, eInOut);
  const scr = prog(f, T.all - 4, T.all + 12, eExpo);
  const W0 = 900;
  return (
    <AbsoluteFill style={exitStyle(f, CUT.d)}>
      <Row top={150}>
        <Pop f={f} at={T.with} style={sans(70)}>with</Pop>
      </Row>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0 }}>
        <KLogo f={f} at={T.kinetik} size={120} />
      </div>
      <Row top={430} gap={24}>
        <Pop f={f} at={T.all} style={heavy(108, "#fff", 80)}>ALL IN</Pop>
        <Pop f={f} at={T.one} style={heavy(108, CYAN, 80)} glow={glowC}>ONE PLACE</Pop>
      </Row>
      <div style={{ position: "absolute", inset: 0, perspective: 1600 }}>
        {WINS.map((Wn, i) => (
          <div key={i} style={{ position: "absolute", left: 540 - 280 + (i - 1) * lerp(300, 0, merge), top: 1000 + (i - 1) * lerp(260, 0, merge), transform: `translateZ(${lerp(0, -600, merge)}px) rotateY(${(i - 1) * 30 * (1 - merge) + merge * 180}deg) scale(${lerp(0.8, 0.3, merge)})`, opacity: 1 - merge }}>
            <Wn f={f} w={560} />
          </div>
        ))}
        <div style={{ position: "absolute", left: 540 - W0 / 2, top: 820, transform: `translateZ(${lerp(-900, 0, scr)}px) rotateX(${14 + 3 * Math.sin(f / 15)}deg) rotateY(${lerp(-60, -10, scr) + 4 * Math.sin(f / 21)}deg)`, opacity: scr }}>
          <Screen f={f} src="create" aspect={2000 / 1215} w={W0} zoom={1} origin={{ x: 0.5, y: 0.5 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1460, display: "flex", justifyContent: "center", gap: 16, opacity: prog(f, T.place, T.place + 8) }}>
        {["editing", "posts", "motion"].map((t, i) => (
          <span key={t} style={{ padding: "12px 24px", borderRadius: 999, border: "1.5px solid rgba(94,230,242,0.6)", background: "rgba(5,20,26,0.8)", ...caps(22, "#fff"), letterSpacing: "0.15em", transform: `scale(${prog(f, T.place + i * 3, T.place + i * 3 + 8, eBack)})` }}>✓ {t}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- D : Pick. Adapt. Export. Done. ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const W0 = 920;
  const phase = f < T.adapt ? 0 : f < T.export ? 1 : f < T.done ? 2 : 3;
  const pct = Math.round(100 * prog(f, T.export, T.done - 2, eInOut));
  const stamp = prog(f, T.done, T.done + 8, eBack);
  const tilt = phase * 8 - 8;
  return (
    <AbsoluteFill style={exitStyle(f, CUT.e)}>
      <Row top={150} gap={20}>
        <Pop f={f} at={T.pick} style={heavy(118, phase === 0 ? CYAN : "#fff", 80)}>PICK.</Pop>
        <Pop f={f} at={T.adapt} style={heavy(118, phase === 1 ? CYAN : "#fff", 80)}>ADAPT.</Pop>
      </Row>
      <Row top={290}>
        <Pop f={f} at={T.export} style={heavy(118, phase === 2 ? CYAN : "#fff", 80)}>EXPORT.</Pop>
      </Row>
      <div style={{ position: "absolute", inset: 0, perspective: 1600 }}>
        <div style={{ position: "absolute", left: 540 - W0 / 2, top: 600, transform: `rotateX(${12 + 2 * Math.sin(f / 14)}deg) rotateY(${tilt + 3 * Math.sin(f / 19)}deg) scale(${phase === 3 ? lerp(1, 0.9, stamp) : 1})`, transition: "none" }}>
          {phase === 0 ? (
            <Screen f={f} src="create" aspect={2000 / 1215} w={W0} zoom={lerp(1, 1.7, prog(f, T.pick, T.adapt, eInOut))} origin={{ x: 0.6, y: 0.48 }} center cursor={{ from: { x: 0.85, y: 0.85 }, to: { x: 0.62, y: 0.47 }, t: prog(f, T.pick, T.pick + 10, eInOut), clickAt: T.pick + 11 }} />
          ) : phase === 1 ? (
            <Screen f={f} src="colors" aspect={1197 / 673} w={W0} zoom={lerp(1.15, 1.5, prog(f, T.adapt, T.export, eInOut))} origin={{ x: 0.5, y: 0.6 }} center highlight={{ x: 0.5, y: 0.61, w: 0.86, h: 0.32, on: prog(f, T.adapt + 4, T.adapt + 10), r: 20 }} />
          ) : (
            <div style={{ position: "relative" }}>
              <Screen f={f} src="create" aspect={2000 / 1215} w={W0} zoom={1} origin={{ x: 0.5, y: 0.5 }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "rgba(3,8,10,0.78)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
                <div style={{ ...heavy(150, "#fff", 80), fontVariantNumeric: "tabular-nums" }}>{pct}%</div>
                <div style={{ width: 600, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${CYAN}, ${LAV})`, boxShadow: `0 0 16px ${CYAN}` }} />
                </div>
                <div style={{ ...caps(24), letterSpacing: "0.2em" }}>exporting · mp4 · 1080×1920</div>
              </div>
            </div>
          )}
        </div>
      </div>
      {stamp > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "18px 56px", borderRadius: 28, background: CYAN, ...heavy(170, "#03080a", 80), transform: `rotate(-5deg) scale(${lerp(2.4, 1, Math.min(1, stamp))})`, opacity: Math.min(1, stamp * 1.5), boxShadow: `0 0 60px ${CYAN}` }}>DONE.</div>
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
      <div style={{ position: "absolute", left: 110, right: 110, top: 520, padding: "26px 34px", borderRadius: 999, border: `2px solid ${CYAN}`, background: "rgba(3,14,18,0.85)", boxShadow: `0 0 40px ${glowC}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: prog(f, T.head + 4, T.head + 10) }}>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 70, color: "#fff" }}>
          {url.slice(0, n)}
          <span style={{ opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: CYAN }}>|</span>
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
export const OnePlace: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = [CUT.b, CUT.c, CUT.d, CUT.e, CUT.f];
  const glitch = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const hits: [number, number][] = [[T.capcut, 8], [T.canva, 8], [T.after, 8], [T.stuck, 18], [T.kinetik, 16], [T.pick, 8], [T.adapt, 8], [T.export, 8], [T.done, 22], [T.kinetik2, 10]];
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const flash = Math.max(0, ...[T.kinetik, T.done].map((h) => (f >= h ? 0.7 * Math.exp(-(f - h) / 2.2) : 0)));
  const red = prog(f, T.stuck - 2, T.stuck + 4) * (1 - prog(f, CUT.c - 4, CUT.c));
  const beat = f >= T.kinetik ? Math.exp(-((f - T.kinetik) % 14.5) / 4) : 0;
  return (
    <AbsoluteFill style={{ background: "#03080a", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(40,170,185,${0.18 + beat * 0.08}) 0%, transparent 45%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, rgba(255,60,90,0.35), transparent 60%)", opacity: red }} />
      <GridFloor f={f} tint={red > 0.5 ? "rgba(255,90,120,0.45)" : "rgba(94,230,242,0.42)"} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)` }}>
        {f < CUT.c + 1 && <SceneAB f={f} />}
        {f >= CUT.c - 1 && f < CUT.d + 1 && <SceneC f={f} />}
        {f >= CUT.d - 1 && f < CUT.e + 1 && <SceneD f={f} />}
        {f >= CUT.e - 1 && f < CUT.f + 1 && <SceneE f={f} />}
        {f >= CUT.f - 1 && <CommentOutro f={f} a={CUT.f} t={T} c1={CYAN} c2={LAV} glow={glowC} box={panelC} />}
      </AbsoluteFill>
      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 10, DURATION_FRAMES - 1, eInOut) }} />
      <Html5Audio src={staticFile("kinetik17/sfx/music.wav")} volume={0.3} />
      <Sequence from={3} layout="none">
        <Html5Audio src={staticFile("kinetik17/voice.wav")} volume={0.92} />
      </Sequence>
      {cuts.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={c - 3} src="whoosh" vol={0.18} />
          <Sfx at={c} src="glitch" vol={0.1} />
        </React.Fragment>
      ))}
      {[T.capcut, T.canva, T.after].map((a, i) => (
        <Sfx key={`p${i}`} at={a} src="pop" vol={0.16} />
      ))}
      <Sfx at={T.stuck} src="impact" vol={0.22} />
      <Sfx at={T.kinetik} src="drop" vol={0.22} />
      <Sfx at={T.kinetik} src="shimmer" vol={0.24} />
      {[0, 1, 2].map((i) => (
        <Sfx key={`v${i}`} at={T.place + i * 3} src="tick" vol={0.12} />
      ))}
      <Sfx at={T.pick + 11} src="click" vol={0.3} />
      <Sfx at={T.adapt} src="pop" vol={0.16} />
      {Array.from({ length: 8 }, (_, i) => (
        <Sfx key={`e${i}`} at={T.export + i * 3} src="tick" vol={0.08 + i * 0.01} />
      ))}
      <Sfx at={T.done} src="impact" vol={0.24} />
      <Sfx at={T.head} src="pop" vol={0.15} />
      {Array.from({ length: 15 }, (_, i) => (
        <Sfx key={`k${i}`} at={T.kinetik2 + i * 3} src="key" vol={0.18} />
      ))}
      <CommentOutroSfx t={T} />
    </AbsoluteFill>
  );
};
