import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { SANS, Streaks } from "../kinetik2/parts";
import { KLogo, Pop, Row, Screen, caps, heavy, sans } from "../kinetik3/Kinetik3";
import { CommentOutro, CommentOutroSfx, Sfx } from "../kinetik12/shared";
import { BL, BL2, WavesBg } from "./Waves";
import { CUT, DURATION_FRAMES, T } from "./timing";

loadViewzFonts();
loadFonts();

const LAV = "#b4b4ff";
const glowB = "rgba(70,70,255,0.75)";
const panelB: React.CSSProperties = { borderRadius: 36, background: "rgba(5,5,18,0.86)", border: "1.5px solid rgba(150,150,255,0.4)", boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(60,60,255,0.35)" };

/* ---------- transitions 3D ---------- */
type Kind = "cube" | "dive" | "rise" | "none";
const enterT = (k: Kind, q: number) =>
  k === "cube" ? `rotateY(${(1 - q) * 95}deg)` : k === "dive" ? `translateZ(${(1 - q) * -2200}px)` : k === "rise" ? `translateY(${(1 - q) * 700}px) rotateX(${(1 - q) * 75}deg)` : "";
const exitT = (k: Kind, q: number) =>
  k === "cube" ? `rotateY(${-q * 95}deg)` : k === "dive" ? `translateZ(${q * 1300}px)` : k === "rise" ? `translateY(${-q * 700}px) rotateX(${-q * 75}deg)` : "";
const Stage: React.FC<{ f: number; a: number; b: number; enter: Kind; exit: Kind; children: React.ReactNode }> = ({ f, a, b, enter, exit, children }) => {
  if (f < a - 6 || f > b + 4) return null;
  const qi = enter === "none" ? 1 : prog(f, a - 6, a + 9, eExpo);
  const qo = exit === "none" ? 0 : prog(f, b - 8, b + 3, eInOut);
  const origin = "50% 50% -620px";
  return (
    <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 50%" }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transformOrigin: origin, transform: exitT(exit, qo), opacity: 1 - (exit === "dive" ? qo : qo * 0.3), filter: qo > 0.03 ? `blur(${qo * 10}px)` : undefined }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transformOrigin: origin, transform: enterT(enter, qi), opacity: Math.min(1, qi * 1.6), filter: qi < 0.97 ? `blur(${(1 - qi) * 12}px)` : undefined }}>{children}</AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Mot qui bascule en 3D (charnière haute) pendant [a, b). */
const Flip: React.FC<{ f: number; a: number; b: number; top: number; children: React.ReactNode }> = ({ f, a, b, top, children }) => {
  if (f < a || f >= b + 1) return null;
  const qi = prog(f, a, a + 7, eBack);
  const qo = prog(f, b - 3, b + 1, eInOut);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, perspective: 900, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ transformOrigin: "50% 0%", transform: `rotateX(${(1 - qi) * -95 + qo * 95}deg) translateZ(${(1 - Math.min(1, qi)) * -200}px)`, opacity: Math.min(1, qi * 2) * (1 - qo), textAlign: "center" }}>{children}</div>
    </div>
  );
};
const H = (size: number, color = "#fff", stretch = 80): React.CSSProperties => ({ ...heavy(size, color, stretch), display: "block", textShadow: color === "#fff" ? "0 6px 30px rgba(0,0,0,0.6)" : `0 0 30px ${glowB}` });

/* ---------- faces du carrousel ---------- */
const FW = 560;
const FH = 720;
const faceBox: React.CSSProperties = { position: "absolute", left: -FW / 2, top: -FH / 2, width: FW, height: FH, borderRadius: 40, overflow: "hidden", border: "2px solid rgba(170,170,255,0.7)", boxShadow: `0 0 60px ${glowB}`, backfaceVisibility: "hidden" };
const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center" }}>
    <span style={{ padding: "10px 22px", borderRadius: 999, background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.25)", ...caps(20, "#fff"), letterSpacing: "0.2em" }}>{children}</span>
  </div>
);
const FaceMotion: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ ...faceBox, background: "radial-gradient(circle at 50% 42%, #4b4bff, #14145c 60%, #04041a)" }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: "50%", top: "42%", width: 150 + i * 90, height: 150 + i * 90, marginLeft: -(75 + i * 45), marginTop: -(75 + i * 45), borderRadius: "50%", border: `${8 - i * 2}px solid rgba(220,220,255,${0.9 - i * 0.25})`, borderTopColor: "transparent", transform: `rotate(${f * (4 - i) * (i % 2 ? -1 : 1)}deg)` }} />
    ))}
    <div style={{ position: "absolute", left: "50%", top: "42%", width: 70, height: 70, margin: -35, borderRadius: 18, background: "#fff", transform: `rotate(${f * 6}deg) scale(${1 + 0.2 * Math.sin(f / 4)})`, boxShadow: "0 0 30px #fff" }} />
    <Tag>motion design</Tag>
  </div>
);
const FacePosts: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ ...faceBox, background: "linear-gradient(180deg, #0b0b24, #1b1b4f)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "30px 28px 18px" }}>
      <div style={{ width: 54, height: 54, borderRadius: "50%", background: `conic-gradient(${BL}, ${LAV}, ${BL})`, padding: 4 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#0b0b24" }} />
      </div>
      <span style={{ ...sans(28) }}>@yourbrand</span>
      <span style={{ marginLeft: "auto", ...sans(26, LAV) }}>♥ {1200 + Math.floor(f * 37)}</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: "0 16px" }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={{ height: 140, borderRadius: 8, background: `linear-gradient(${135 + i * 30}deg, ${[BL, "#ffffff", "#7a7aff", "#1d1d80", LAV][i % 5]}, #0b0b24)`, opacity: 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(f / 6 + i)) }} />
      ))}
    </div>
    <Tag>instagram · tiktok</Tag>
  </div>
);
const FaceEdit: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ ...faceBox, background: "linear-gradient(180deg, #08081c, #111134)" }}>
    <div style={{ margin: 26, height: 250, borderRadius: 20, background: "radial-gradient(circle at 40% 40%, #5a5aff, #0d0d3a)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: `${(f * 3) % 120 - 20}%`, top: 80, width: 90, height: 90, borderRadius: 20, background: "#fff", transform: `rotate(${f * 5}deg)` }} />
    </div>
    {[0, 1, 2, 3].map((r) => (
      <div key={r} style={{ position: "relative", height: 46, margin: "10px 26px", borderRadius: 10, background: "rgba(255,255,255,0.05)" }}>
        {[0, 1, 2].map((c) => (
          <div key={c} style={{ position: "absolute", top: 6, bottom: 6, left: `${hash(r * 7 + c) * 30 + c * 33}%`, width: `${14 + hash(r * 3 + c) * 16}%`, borderRadius: 8, background: [BL, LAV, "#6a6aff", "#ffffff"][(r + c) % 4], opacity: 0.85 }} />
        ))}
      </div>
    ))}
    <div style={{ position: "absolute", top: 300, bottom: 90, left: 26 + ((f * 7) % 448), width: 4, background: "#ff4d6d", boxShadow: "0 0 10px #ff4d6d" }} />
    <Tag>video editing</Tag>
  </div>
);
const FaceDesign: React.FC<{ f: number }> = ({ f }) => {
  const k = 0.5 + 0.5 * Math.sin(f / 10);
  return (
    <div style={{ ...faceBox, background: "linear-gradient(160deg, #f4f4ff, #c9c9ff)" }}>
      <svg width={FW} height={FH} style={{ position: "absolute", inset: 0 }}>
        <path d={`M 60 420 C ${150 + 80 * k} ${120}, ${330 - 60 * k} ${520}, 440 210`} stroke={BL} strokeWidth={12} fill="none" strokeLinecap="round" />
        <line x1={60} y1={420} x2={150 + 80 * k} y2={120} stroke="#1d1d80" strokeWidth={3} />
        <line x1={440} y1={210} x2={330 - 60 * k} y2={520} stroke="#1d1d80" strokeWidth={3} />
        {[[60, 420], [440, 210]].map(([x, y], i) => <rect key={i} x={x - 14} y={y - 14} width={28} height={28} fill="#fff" stroke="#1d1d80" strokeWidth={4} />)}
        {[[150 + 80 * k, 120], [330 - 60 * k, 520]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={12} fill="#1d1d80" />)}
      </svg>
      <div style={{ position: "absolute", left: 40, top: 40, display: "flex", gap: 12 }}>
        {[BL, "#1d1d80", LAV, "#ffffff"].map((c) => <div key={c} style={{ width: 46, height: 46, borderRadius: 12, background: c, border: "2px solid rgba(0,0,0,0.15)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center" }}>
        <span style={{ padding: "10px 22px", borderRadius: 999, background: "#1d1d80", ...caps(20, "#fff"), letterSpacing: "0.2em" }}>design</span>
      </div>
    </div>
  );
};

/* ---------- A + B : carrousel 3D des métiers → tout en 3 s → Kinetik ---------- */
const SceneAB: React.FC<{ f: number }> = ({ f }) => {
  const step = (a: number) => prog(f, a - 5, a + 7, eBack);
  const spinB = prog(f, T.get, T.kinetik - 2, (x) => x * x);
  const ang = -90 * (step(T.instagram) + step(T.video) + step(T.design2)) - 900 * spinB + 6 * Math.sin(f / 18);
  const implode = prog(f, T.kinetik - 6, T.kinetik, eInOut);
  const sc = lerp(1, 0.62, prog(f, T.get, T.three, eInOut)) * (1 - implode);
  const R = FW / 2 + 40;
  const ringIn = prog(f, 0, 12, eExpo);
  const logoQ = prog(f, T.kinetik, T.kinetik + 10, eExpo);
  const wave = (f - T.kinetik) / 18;
  const secs = Math.max(0, 3 - (f - T.three) / ((T.kinetik - T.three) / 3));
  return (
    <AbsoluteFill>
      {/* titres qui basculent */}
      <Flip f={f} a={T.motion0} b={T.instagram} top={170}>
        <span style={H(170)}>MOTION</span>
        <span style={H(170, BL2)}>DESIGN</span>
      </Flip>
      <Flip f={f} a={T.instagram} b={T.video} top={170}>
        <span style={H(130)}>INSTAGRAM &</span>
        <span style={H(130, BL2)}>TIKTOK POSTS</span>
      </Flip>
      <Flip f={f} a={T.video} b={T.design2} top={170}>
        <span style={H(170)}>VIDEO</span>
        <span style={H(170, BL2)}>EDITING</span>
      </Flip>
      <Flip f={f} a={T.design2} b={T.get} top={200}>
        <span style={H(200, BL2)}>DESIGN?</span>
      </Flip>
      <Flip f={f} a={T.get} b={T.three} top={180}>
        <span style={H(180)}>GET IT</span>
        <span style={H(220, BL2)}>ALL</span>
      </Flip>
      <Flip f={f} a={T.three} b={T.with} top={160}>
        <span style={{ ...sans(70), display: "block" }}>in</span>
        <span style={{ ...H(300, "#fff", 75), fontVariantNumeric: "tabular-nums" }}>{secs.toFixed(1)}s</span>
      </Flip>
      {/* carrousel */}
      {implode < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, perspective: 1700, perspectiveOrigin: "50% 1150px" }}>
          <div style={{ position: "absolute", left: 540, top: lerp(1180, 1120, spinB), transformStyle: "preserve-3d", transform: `translateZ(${-R + (1 - ringIn) * -1400}px) scale(${sc}) rotateX(-6deg) rotateY(${ang}deg)` }}>
            {[FaceMotion, FacePosts, FaceEdit, FaceDesign].map((Face, i) => (
              <div key={i} style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", transform: `rotateY(${i * 90}deg) translateZ(${R + implode * 600}px)` }}>
                <Face f={f} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {/* Kinetik */}
      {f >= T.kinetik - 1 ? (
        <>
          {[0, 1, 2].map((i) => {
            const q = Math.max(0, wave - i * 0.25);
            return q > 0 && q < 1.4 ? <div key={i} style={{ position: "absolute", left: 540 - 600 * q, top: 1040 - 600 * q, width: 1200 * q, height: 1200 * q, borderRadius: "50%", border: `${10 * (1.4 - q)}px solid ${LAV}`, opacity: Math.max(0, 1 - q / 1.4), boxShadow: `0 0 40px ${glowB}` }} /> : null;
          })}
          <Row top={760}>
            <Pop f={f} at={T.with} style={sans(70)}>with</Pop>
          </Row>
          <div style={{ position: "absolute", left: 0, right: 0, top: 900, transform: `scale(${lerp(0.4, 1, logoQ)})` }}>
            <KLogo f={f} at={T.kinetik} size={170} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- C : mur 3D de templates → un template prend ta marque ---------- */
const TPL = ["Product demo", "Motion design", "Posts Instagram", "Physical product", "Studio", "Launch", "Story", "Promo", "App Store", "Reel", "Logo reveal", "Event"];
const TPLC = [[BL, "#0a0a30"], ["#ffffff", "#8a8aff"], ["#ff5a7a", "#2a0a40"], [LAV, "#1d1d80"], ["#1d1d80", "#03020a"], ["#6d6dff", "#ffffff"]];
const TplCard: React.FC<{ i: number; w: number; f: number; brand?: number }> = ({ i, w, f, brand = 0 }) => {
  const [c1, c2] = TPLC[i % TPLC.length];
  const h = w * 1.35;
  return (
    <div style={{ width: w, height: h, borderRadius: w * 0.09, overflow: "hidden", position: "relative", background: `linear-gradient(${150 + i * 23}deg, ${c1}, ${c2})`, border: "1.5px solid rgba(255,255,255,0.35)" }}>
      <div style={{ position: "absolute", left: "50%", top: "38%", width: w * 0.38, height: w * 0.38, marginLeft: -w * 0.19, marginTop: -w * 0.19, borderRadius: i % 3 === 0 ? "50%" : w * 0.08, border: `${w * 0.025}px solid rgba(255,255,255,0.85)`, transform: `rotate(${f * (i % 2 ? 3 : -3) + i * 20}deg)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: w * 0.08, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: w * 0.09, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{TPL[i % TPL.length]}</div>
      {brand > 0 ? <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${BL}, #0a0a40)`, clipPath: `circle(${brand * 150}% at 85% 10%)` }} /> : null}
    </div>
  );
};
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const k = f - CUT.c;
  const adapt = prog(f, T.adapt - 2, T.adapt + 14, eInOut);
  const swatch = prog(f, T.brand - 2, T.brand + 10, eBack);
  const snap = prog(f, T.snap, T.snap + 8, eExpo);
  const n = Math.round(lerp(0, 500, prog(f, T.hundreds, T.tEnd, eOut)));
  return (
    <AbsoluteFill>
      {/* le mur */}
      <div style={{ position: "absolute", inset: 0, perspective: 1100, perspectiveOrigin: "50% 40%", opacity: 1 - 0.7 * adapt, filter: adapt > 0.02 ? `blur(${adapt * 5}px)` : undefined }}>
        <div style={{ position: "absolute", left: -250, top: 300, width: 1580, transformStyle: "preserve-3d", transform: `rotateX(52deg) rotateZ(-16deg) translateY(${-k * 9 - 200}px)`, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 34 }}>
          {Array.from({ length: 45 }).map((_, i) => (
            <div key={i} style={{ opacity: 0.55 + 0.45 * hash(i * 1.9), transform: `translateZ(${Math.max(0, Math.sin(k / 8 + i) * 40)}px)` }}>
              <TplCard i={i} w={282} f={f} />
            </div>
          ))}
        </div>
      </div>
      {/* textes 1 */}
      <Flip f={f} a={T.browse} b={T.adapt} top={150}>
        <span style={{ ...sans(70), display: "block" }}>browse</span>
        <span style={H(170, BL2)}>HUNDREDS</span>
        <span style={H(120)}>OF TEMPLATES</span>
      </Flip>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1640, display: "flex", justifyContent: "center", opacity: prog(f, T.hundreds, T.hundreds + 6) * (1 - adapt) }}>
        <div style={{ padding: "18px 36px", ...panelB, borderRadius: 999, ...sans(50), fontVariantNumeric: "tabular-nums" }}>
          <span style={{ color: BL2 }}>{n}+</span> templates
        </div>
      </div>
      {/* le template élu qui vient au premier plan */}
      {adapt > 0 ? (
        <div style={{ position: "absolute", inset: 0, perspective: 1300 }}>
          <div style={{ position: "absolute", left: 540 - 210, top: 1050 - 283, transform: `translate3d(${lerp(-260, 0, adapt)}px, ${lerp(500, 0, adapt)}px, ${lerp(-900, 0, adapt)}px) rotateX(${lerp(52, 6 * Math.sin(f / 15), adapt)}deg) rotateY(${lerp(-200, 0, adapt) + 8 * Math.sin(f / 20)}deg) scale(${1 + 0.06 * Math.exp(-Math.max(0, f - T.snap) / 4) * (f >= T.snap ? 1 : 0)})`, boxShadow: `0 0 ${80 * snap}px ${glowB}`, borderRadius: 38 }}>
            <TplCard i={6} w={420} f={f} brand={snap} />
            {snap > 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", ...heavy(80, "#fff", 80), opacity: snap }}>NOVA</div> : null}
          </div>
          {/* pastilles de marque */}
          {[BL, LAV, "#0a0a40"].map((c, i) => {
            const q = prog(f, T.brand + i * 3 - 2, T.brand + i * 3 + 10, eBack);
            const fly = prog(f, T.snap - 3, T.snap, eInOut);
            return (
              <div key={c} style={{ position: "absolute", left: lerp(lerp(1100, 800, q), 700, fly) + i * 20, top: lerp(780 + i * 120, 800, fly), width: 96, height: 96, borderRadius: "50%", background: c, border: "4px solid #fff", boxShadow: `0 0 30px ${glowB}`, opacity: Math.min(1, swatch * 1.5) * (1 - prog(f, T.snap, T.snap + 3)), transform: `scale(${lerp(1, 0.4, fly)})` }} />
            );
          })}
        </div>
      ) : null}
      {/* textes 2 */}
      <Flip f={f} a={T.adapt} b={T.snap} top={170}>
        <span style={H(150)}>ADAPT THEM</span>
        <span style={{ ...sans(70), display: "block", marginTop: 10 }}>to your brand</span>
      </Flip>
      <Flip f={f} a={T.snap} b={CUT.d + 6} top={170}>
        <span style={{ ...sans(70), display: "block" }}>in a</span>
        <span style={H(220, BL2)}>SNAP!</span>
      </Flip>
    </AbsoluteFill>
  );
};

/* ---------- D : Kinetik handles the rest ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const pct = Math.round(100 * prog(f, T.handles, T.restEnd + 4, eInOut));
  const W0 = 920;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 170, left: 0, right: 0 }}>
        <KLogo f={f} at={T.kinetik2} size={110} />
      </div>
      <Row top={360}>
        <Pop f={f} at={T.handles} style={heavy(150, "#fff", 80)}>HANDLES</Pop>
      </Row>
      <Row top={510}>
        <Pop f={f} at={T.rest - 3} style={heavy(150, BL2, 80)} glow={glowB}>THE REST</Pop>
      </Row>
      <div style={{ position: "absolute", inset: 0, perspective: 1600 }}>
        <div style={{ position: "absolute", left: 540 - W0 / 2, top: 820, transform: `rotateX(${14 + 3 * Math.sin(f / 15)}deg) rotateY(${-12 + 4 * Math.sin(f / 21)}deg)`, transformStyle: "preserve-3d" }}>
          <Screen f={f} src="create" aspect={2000 / 1215} w={W0} zoom={lerp(1, 1.5, prog(f, CUT.d, CUT.e, eInOut))} origin={{ x: 0.7, y: 0.45 }} center />
        </div>
      </div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 1500 }}>
        <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${BL}, ${LAV})`, boxShadow: `0 0 16px ${BL}` }} />
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", ...caps(26, LAV), letterSpacing: "0.15em" }}>
          <span>{pct >= 100 ? "✓ ready to post" : "animating · syncing · exporting"}</span>
          <span style={{ color: "#fff" }}>{pct}%</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- E : kinetik-app.com en 3D extrudé ---------- */
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const url = "kinetik-app.com";
  const n = Math.round(lerp(0, url.length, prog(f, T.kinetik3, T.comEnd, (x) => x)));
  const txt = url.slice(0, n);
  const LAYERS = 16;
  const sq = prog(f, T.kinetik3, T.kinetik3 + 14, eExpo);
  return (
    <AbsoluteFill>
      <Row top={380}>
        <Pop f={f} at={T.head} style={heavy(130, "#fff", 80)}>HEAD TO</Pop>
      </Row>
      <div style={{ position: "absolute", inset: 0, perspective: 1200, perspectiveOrigin: "50% 700px" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, transformStyle: "preserve-3d", transform: `rotateX(${18 + 4 * Math.sin(f / 14)}deg) rotateY(${-16 * Math.sin(f / 22)}deg) scale(${lerp(0.6, 1, sq)})` }}>
          {Array.from({ length: LAYERS }).map((_, i) => {
            const L = LAYERS - 1 - i;
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, textAlign: "center", transform: `translateZ(${-L * 7}px)`, ...heavy(118, L === 0 ? "#fff" : `rgb(${40 + (1 - L / LAYERS) * 40}, ${40 + (1 - L / LAYERS) * 40}, ${170 + (1 - L / LAYERS) * 85})`, 78), textTransform: "none", textShadow: L === 0 ? `0 0 30px ${glowB}` : undefined }}>
                {txt}
                <span style={{ opacity: L === 0 && f < T.comEnd + 10 && Math.floor(f / 6) % 2 === 0 ? 1 : 0 }}>|</span>
              </div>
            );
          })}
        </div>
        {/* le site, posé sur un plan incliné */}
        <div style={{ position: "absolute", left: 90, top: 980, width: 900, transform: `rotateX(${38 - 6 * prog(f, CUT.e, CUT.f)}deg) translateZ(${-200 + 80 * Math.sin(f / 30)}px)`, transformOrigin: "50% 0%", opacity: prog(f, T.kinetik3, T.kinetik3 + 12), borderRadius: 24, overflow: "hidden", boxShadow: `0 0 70px ${glowB}`, border: "2px solid rgba(170,170,255,0.6)" }}>
          <Screen f={f} src="website" aspect={2000 / 1027} w={900} zoom={1} origin={{ x: 0.5, y: 0.5 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
export const AllIn3: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = [CUT.c, CUT.d, CUT.e, CUT.f];
  const kick = cuts.reduce((s, c) => s + 1.4 * prog(f, c - 8, c + 8, eInOut), 0) + 1.6 * prog(f, T.get, T.kinetik, eInOut) + 1.2 * prog(f, T.kinetik - 4, T.kinetik + 10, eOut);
  const warp = Math.min(1, cuts.reduce((s, c) => s + Math.exp(-Math.abs(f - c) / 5), 0) + Math.exp(-Math.abs(f - T.kinetik) / 6));
  const glitch = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const hits: [number, number][] = [[T.get, 14], [T.kinetik, 22], [T.snap, 16], [T.handles, 8], [T.kinetik3, 10]];
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const flash = Math.max(0, ...[T.kinetik, T.snap].map((h) => (f >= h ? 0.75 * Math.exp(-(f - h) / 2.2) : 0)));
  const outroQ = prog(f, CUT.f - 6, CUT.f + 10, eExpo);
  return (
    <AbsoluteFill style={{ background: "#03020a", overflow: "hidden" }}>
      <WavesBg f={f} kick={kick} warp={warp} dim={0.42 + 0.25 * outroQ} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)` }}>
        <Stage f={f} a={0} b={CUT.c} enter="none" exit="cube">
          <SceneAB f={f} />
        </Stage>
        <Stage f={f} a={CUT.c} b={CUT.d} enter="cube" exit="dive">
          <SceneC f={f} />
        </Stage>
        <Stage f={f} a={CUT.d} b={CUT.e} enter="dive" exit="rise">
          <SceneD f={f} />
        </Stage>
        <Stage f={f} a={CUT.e} b={CUT.f} enter="rise" exit="cube">
          <SceneE f={f} />
        </Stage>
        <Stage f={f} a={CUT.f} b={DURATION_FRAMES + 20} enter="cube" exit="none">
          <CommentOutro f={f} a={CUT.f} t={{ ...T, get: T.get2 }} c1={BL2} c2={LAV} glow={glowB} box={panelB} />
        </Stage>
      </AbsoluteFill>
      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 10, DURATION_FRAMES - 1, eInOut) }} />
      <Html5Audio src={staticFile("kinetik16/sfx/music.wav")} volume={0.3} />
      <Sequence from={3} layout="none">
        <Html5Audio src={staticFile("kinetik16/voice.wav")} volume={0.92} />
      </Sequence>
      {cuts.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={c - 4} src="whoosh" vol={0.2} />
          <Sfx at={c} src="glitch" vol={0.1} />
        </React.Fragment>
      ))}
      {[T.motion0, T.instagram, T.video, T.design2].map((a, i) => (
        <Sfx key={`w${i}`} at={a - 3} src="whoosh" vol={0.14} />
      ))}
      <Sfx at={T.get} src="impact" vol={0.2} />
      <Sfx at={T.get} src="riser" vol={0.14} />
      {Array.from({ length: 9 }, (_, i) => (
        <Sfx key={`t${i}`} at={T.three + i * 3} src="tick" vol={0.08 + i * 0.01} />
      ))}
      <Sfx at={T.kinetik} src="drop" vol={0.24} />
      <Sfx at={T.kinetik} src="shimmer" vol={0.26} />
      <Sfx at={T.browse} src="scan" vol={0.16} />
      <Sfx at={T.adapt} src="whoosh" vol={0.16} />
      {[0, 1, 2].map((i) => (
        <Sfx key={`b${i}`} at={T.brand + i * 3} src="pop" vol={0.15} />
      ))}
      <Sfx at={T.snap} src="impact" vol={0.2} />
      <Sfx at={T.snap} src="click" vol={0.3} />
      <Sfx at={T.handles} src="pop" vol={0.15} />
      <Sfx at={T.restEnd} src="shimmer" vol={0.18} />
      <Sfx at={T.head} src="pop" vol={0.15} />
      {Array.from({ length: 15 }, (_, i) => (
        <Sfx key={`k${i}`} at={T.kinetik3 + i * 2.4} src="key" vol={0.18} />
      ))}
      <CommentOutroSfx t={T} />
    </AbsoluteFill>
  );
};
