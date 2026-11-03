import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, hash, lerp, prog } from "../viewz/util";
import { KLogo, Pop, Row, caps, exitStyle, heavy, sans } from "../kinetik3/Kinetik3";
import { CardCrop } from "../kinetik5/Kinetik5";
import { AMB, CommentOutro, CommentOutroSfx, FlutedShell, OR, Sfx, glowO, panel } from "./shared";
import { CUT, DURATION_FRAMES, T } from "./timing";

loadViewzFonts();
loadFonts();

const MONO = "'JetBrains Mono', Menlo, monospace";
const CODE = [
  ["const", " app ", "=", " createSaaS", "({"],
  ["  name:", " \"Flowly\"", ","],
  ["  plan:", " \"pro\"", ","],
  ["});"],
  [""],
  ["app", ".", "deploy", "();", " // ✓ shipped"],
];
const COL = ["#c084fc", "#fff", "#ffb347", "#7dd3fc", "#fff"];

/** Éditeur de code (style terminal) qui se tape. */
const CodeEditor: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  const total = CODE.reduce((s, l) => s + l.join("").length, 0);
  let n = Math.round(lerp(0, total, prog(f, from, to, (x) => x)));
  return (
    <div style={{ width: 860, ...panel, borderRadius: 26, overflow: "hidden" }}>
      <div style={{ height: 50, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
        <span style={{ marginLeft: 14, fontFamily: MONO, fontSize: 20, color: "rgba(255,255,255,0.5)" }}>app.ts</span>
      </div>
      <div style={{ padding: "26px 30px", fontFamily: MONO, fontSize: 32, lineHeight: 1.5, minHeight: 330 }}>
        {CODE.map((line, li) => (
          <div key={li} style={{ whiteSpace: "pre" }}>
            <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 22 }}>{li + 1}</span>
            {line.map((tok, ti) => {
              const shown = tok.slice(0, Math.max(0, Math.min(tok.length, n)));
              n -= tok.length;
              return <span key={ti} style={{ color: tok.includes("//") ? "#86efac" : COL[ti % COL.length] }}>{shown}</span>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Timeline de montage générique (pistes, images clés) — ce qu'un dev n'a pas envie de faire. */
const MessyTimeline: React.FC<{ f: number; strike: number }> = ({ f, strike }) => (
  <div style={{ position: "relative", width: 860, padding: "24px 26px", ...panel, borderRadius: 26, filter: strike > 0.05 ? `saturate(${1 - 0.7 * strike}) blur(${strike * 2}px)` : undefined, opacity: 1 - 0.4 * strike }}>
    <div style={{ ...caps(20, "rgba(255,255,255,0.5)"), letterSpacing: "0.2em", marginBottom: 14 }}>timeline · 47 layers · 312 keyframes</div>
    {Array.from({ length: 6 }, (_, r) => (
      <div key={r} style={{ position: "relative", height: 32, marginBottom: 10, borderRadius: 6, background: "rgba(255,255,255,0.05)" }}>
        {Array.from({ length: 3 }, (_, k) => {
          const x0 = hash(r * 7 + k) * 0.7;
          return <div key={k} style={{ position: "absolute", left: `${x0 * 100}%`, width: `${(0.12 + hash(r + k * 3) * 0.2) * 100}%`, top: 4, bottom: 4, borderRadius: 5, background: [OR, "#a855f7", AMB, "#f472b6"][(r + k) % 4], opacity: 0.75 }} />;
        })}
        {Array.from({ length: 7 }, (_, k) => (
          <div key={`k${k}`} style={{ position: "absolute", left: `${hash(r * 11 + k) * 96}%`, top: 10, width: 12, height: 12, background: "#fff", transform: "rotate(45deg)", opacity: 0.8 }} />
        ))}
      </div>
    ))}
    <div style={{ position: "absolute", top: 60, bottom: 20, left: `${10 + ((f * 2) % 80)}%`, width: 3, background: "#fff", boxShadow: "0 0 10px #fff" }} />
    {strike > 0 ? (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <line x1={6} y1={10} x2={6 + 88 * strike} y2={10 + 80 * strike} stroke={OR} strokeWidth={10} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        <line x1={94} y1={10} x2={94 - 88 * strike} y2={10 + 80 * strike} stroke={OR} strokeWidth={10} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      </svg>
    ) : null}
  </div>
);

export const Dev: React.FC = () => {
  const f = useCurrentFrame();
  const sc = (a: number, b: number) => f >= a - 1 && f < b + 1;
  const saas = "app.flowly.dev";
  const nSaas = Math.round(lerp(0, saas.length, prog(f, T.saas - 2, T.link + 8, (x) => x)));
  const step = f < T.pick - 2 ? 0 : f < T.and2 - 2 ? 1 : 2;
  return (
    <FlutedShell
      f={f}
      frames={DURATION_FRAMES}
      dir="kinetik12"
      cuts={Object.values(CUT)}
      speedUpAt={CUT.c}
      hits={[
        [T.dev, 14],
        [T.editor, 10],
        [T.fine, 16],
        [T.kinetik, 12],
        [T.ready, 14],
        [T.zero, 14],
        [T.zero2, 14],
      ]}
      flashes={[T.fine, T.ready]}
      sfx={
        <>
          {Array.from({ length: 12 }, (_, i) => (
            <Sfx key={`k${i}`} at={T.youre + i * 3.5} src="key" vol={0.2} />
          ))}
          <Sfx at={T.editor + 8} src="glitch" vol={0.12} />
          <Sfx at={T.fine} src="impact" vol={0.2} />
          <Sfx at={T.kinetik} src="shimmer" vol={0.26} />
          {Array.from({ length: 8 }, (_, i) => (
            <Sfx key={`u${i}`} at={T.saas + i * 3} src="key" vol={0.2} />
          ))}
          <Sfx at={T.template} src="click" vol={0.35} />
          <Sfx at={T.ready} src="drop" vol={0.26} />
          <Sfx at={T.zero} src="impact" vol={0.18} />
          <Sfx at={T.zero2} src="impact" vol={0.18} />
          <CommentOutroSfx t={T} />
        </>
      }
    >
      {/* ---- A : dev, pas monteur ---- */}
      {sc(0, CUT.b) && (
        <AbsoluteFill style={exitStyle(f, CUT.b, 3)}>
          <Row top={150} gap={22} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.youre} style={sans(96)}>You&apos;re a</Pop>
            <Pop f={f} at={T.dev} style={heavy(200, OR, 88)} glow={glowO}>DEV,</Pop>
          </Row>
          <Row top={370} gap={20} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.not} style={sans(80)}>not a</Pop>
            <Pop f={f} at={T.video} style={heavy(110, "#fff", 82)}>VIDEO EDITOR.</Pop>
          </Row>
          <div style={{ position: "absolute", left: 110, top: 600, opacity: prog(f, 2, 10), transform: `translateY(${(1 - prog(f, 2, 16, eExpo)) * 160}px) rotate(-2deg)` }}>
            <CodeEditor f={f} from={T.youre} to={T.editor} />
          </div>
          <div style={{ position: "absolute", left: 110, top: 1150, opacity: prog(f, T.video - 2, T.video + 8), transform: `translateY(${(1 - prog(f, T.video - 2, T.video + 14, eExpo)) * 160}px) rotate(2deg)` }}>
            <MessyTimeline f={f} strike={prog(f, T.editor + 4, T.edEnd + 4, eInOut)} />
          </div>
        </AbsoluteFill>
      )}

      {/* ---- B : et c'est très bien ---- */}
      {sc(CUT.b, CUT.c) && (
        <AbsoluteFill style={exitStyle(f, CUT.c)}>
          <Row top={620}>
            <Pop f={f} at={T.and} style={sans(100)}>And that&apos;s</Pop>
          </Row>
          <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center" }}>
            <Pop f={f} at={T.fine} style={heavy(330, OR, 95)} glow={glowO}>FINE.</Pop>
          </div>
          <div style={{ position: "absolute", top: 1180, left: 0, right: 0, textAlign: "center", fontSize: 150, transform: `scale(${prog(f, T.fine + 4, T.fine + 14, eBack)})` }}>👍</div>
        </AbsoluteFill>
      )}

      {/* ---- C : colle ton lien SaaS, choisis un modèle, c'est prêt ---- */}
      {sc(CUT.c, CUT.d) && (
        <AbsoluteFill style={exitStyle(f, CUT.d)}>
          <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
            <Pop f={f} at={T.with} style={sans(80)}>With</Pop>
            <KLogo f={f} at={T.kinetik} size={90} />
          </div>
          {/* étapes */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", gap: 16 }}>
            {["paste your SaaS link", "pick a template", "video ready"].map((l, i) => {
              const at = [T.paste, T.pick, T.and2][i];
              const q = prog(f, at - 2, at + 10, eBack);
              return (
                <div key={l} style={{ padding: "14px 22px", borderRadius: 999, ...panel, border: `2px solid ${i === step ? OR : "rgba(255,170,120,0.25)"}`, boxShadow: i === step ? `0 0 26px ${glowO}` : undefined, opacity: Math.min(1, 0.3 + q), transform: `scale(${0.85 + 0.15 * Math.min(1, q)})`, ...caps(20, i <= step ? "#fff" : "rgba(255,255,255,0.4)"), letterSpacing: "0.1em" }}>
                  {i + 1} · {l}
                </div>
              );
            })}
          </div>
          {/* 1 : lien */}
          {step === 0 ? (
            <div style={{ position: "absolute", left: 90, right: 90, top: 520 }}>
              <Row top={0}>
                <Pop f={f} at={T.paste} style={heavy(150, OR, 82)} glow={glowO}>PASTE</Pop>
              </Row>
              <div style={{ position: "absolute", left: 0, right: 0, top: 230, padding: "30px 34px", ...panel }}>
                <div style={{ ...caps(22, AMB), letterSpacing: "0.2em", marginBottom: 16 }}>your saas link</div>
                <div style={{ padding: "24px 28px", borderRadius: 22, background: "rgba(255,255,255,0.06)", border: `2px solid ${OR}`, ...sans(48, "#fff"), fontWeight: 600 }}>
                  https://{saas.slice(0, nSaas)}
                  <span style={{ display: "inline-block", width: 3, height: 44, marginLeft: 4, background: AMB, opacity: Math.floor(f / 7) % 2 ? 1 : 0.2 }} />
                </div>
              </div>
            </div>
          ) : null}
          {/* 2 : modèle */}
          {step === 1 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 520 }}>
              <Row top={0}>
                <Pop f={f} at={T.pick} style={heavy(150, OR, 82)} glow={glowO}>PICK</Pop>
              </Row>
              <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", gap: 20 }}>
                {[3, 9, 15, 21].map((ci, i) => {
                  const sel = i === 1 && f >= T.template;
                  const q = prog(f, T.pick + i * 2, T.pick + i * 2 + 10, eBack);
                  return (
                    <div key={ci} style={{ transform: `translateY(${(1 - q) * 80}px) scale(${sel ? 1.12 : 0.95})`, opacity: Math.min(1, q * 1.5) * (sel || f < T.template ? 1 : 0.5) }}>
                      <CardCrop i={ci} w={210} glow={sel ? 1 : 0} />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          {/* 3 : vidéo produit prête */}
          {step === 2 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 520 }}>
              <Row top={0} gap={18} style={{ alignItems: "center" }}>
                <Pop f={f} at={T.product} style={sans(72)}>your product video is</Pop>
              </Row>
              <Row top={110}>
                <Pop f={f} at={T.ready} style={heavy(200, OR, 90)} glow={glowO}>READY.</Pop>
              </Row>
              <div style={{ position: "absolute", left: 540 - 140, top: 380, transform: `scale(${prog(f, T.and2, T.and2 + 14, eExpo)}) rotate(${Math.sin(f / 16) * 2}deg)` }}>
                <CardCrop i={21} w={280} glow={0.6} />
                <div style={{ position: "absolute", left: "50%", top: "50%", width: 90, height: 90, marginLeft: -45, marginTop: -45, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", ...sans(40, "#fff") }}>▶</div>
              </div>
              {f >= T.ready ? <div style={{ position: "absolute", left: 540 + 130, top: 880, transform: `scale(${prog(f, T.ready, T.ready + 8, eBack)})`, padding: "14px 26px", borderRadius: 999, background: OR, ...caps(26, "#fff"), letterSpacing: "0.12em", boxShadow: `0 0 40px ${glowO}` }}>✓ ready</div> : null}
            </div>
          ) : null}
        </AbsoluteFill>
      )}

      {/* ---- D : zéro compétence motion, zéro After Effects ---- */}
      {sc(CUT.d, CUT.e) && (
        <AbsoluteFill style={exitStyle(f, CUT.e)}>
          {[
            { at: T.zero, a: "MOTION", b: "SKILLS", y: 300 },
            { at: T.zero2, a: "AFTER", b: "EFFECTS", y: 900 },
          ].map((z, i) => {
            const q = prog(f, z.at, z.at + 10, eBack);
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: z.y, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, opacity: Math.min(1, q * 1.5) }}>
                <span style={{ ...heavy(380, OR, 95), textShadow: `0 0 50px ${glowO}`, transform: `scale(${lerp(1.6, 1, Math.min(1, q))})`, display: "inline-block" }}>0</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ ...heavy(110, "#fff", 82) }}>{z.a}</span>
                  <span style={{ ...heavy(110, i ? AMB : "#fff", 82) }}>{z.b}</span>
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", top: 1560, left: 0, right: 0, textAlign: "center", ...caps(26, AMB), letterSpacing: "0.25em", opacity: prog(f, T.effects, T.effects + 8) }}>no keyframes · no render queue</div>
        </AbsoluteFill>
      )}

      {f >= CUT.e - 1 && <CommentOutro f={f} a={CUT.e} t={T} />}
    </FlutedShell>
  );
};

