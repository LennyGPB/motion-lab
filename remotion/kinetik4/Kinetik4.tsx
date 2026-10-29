import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, hash, lerp, prog } from "../viewz/util";
import { CYAN, GridFloor, LAV, SANS, Streaks } from "../kinetik2/parts";
import { Cursor, Float3D, KLogo, MiniMotion, Phone, Pop, Row, Screen, caps, exitStyle, heavy, sans } from "../kinetik3/Kinetik3";
import { CUT, DURATION_FRAMES, T, VO } from "./timing";

loadViewzFonts();
loadFonts();

const DIR = "kinetik4";
const CUTS = Object.values(CUT);
const HITS: [number, number][] = [
  [T.ready, 10],
  [T.easy, 28],
  [T.editor, 12],
  [T.click, 10],
  [T.mp4, 18],
  [T.hd, 18],
  [T.ready2, 12],
];
const SW = 980;
const glowC = "rgba(94,230,242,0.5)";

const Tag: React.FC<{ f: number; a: number; label: string; top?: number }> = ({ f, a, label, top = 1600 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: prog(f, a + 4, a + 10) }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 26px", borderRadius: 999, border: "1.5px solid rgba(94,230,242,0.5)", background: "rgba(5,20,26,0.7)" }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
      <span style={{ ...caps(24, "#fff"), letterSpacing: "0.22em" }}>{label}</span>
    </div>
  </div>
);

/** Interpolation par paliers : [[frame, valeur], ...] */
const steps = (f: number, k: [number, number][]) => {
  let v = k[0][1];
  for (let i = 1; i < k.length; i++) v = lerp(v, k[i][1], prog(f, k[i][0] - 6, k[i][0] + 6, eInOut));
  return v;
};

export const Kinetik4: React.FC = () => {
  const f = useCurrentFrame();
  const glitch = CUTS.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const shake = HITS.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const sx = (hash(f * 3) - 0.5) * shake;
  const sy = (hash(f * 3 + 1) - 0.5) * shake;
  const flash = Math.max(...[T.easy, T.mp4, T.hd].map((h) => (f >= h ? Math.exp(-(f - h) / 2.2) : 0)), f >= T.kinetik ? 0.35 * Math.exp(-(f - T.kinetik) / 2) : 0);
  const purple = Math.max(prog(f, CUT.c, CUT.c + 4) * (1 - prog(f, CUT.d - 3, CUT.d)) * 0.7, prog(f, CUT.k, CUT.k + 6));
  const beat = f >= T.easy && f < DURATION_FRAMES - 30 ? Math.exp(-((f - T.easy) % 14.5) / 4) : 0;
  const scene = (a: number, b: number) => f >= a - 1 && f < b + 1;

  return (
    <AbsoluteFill style={{ background: "#03080a", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(40,170,185,${0.18 + beat * 0.07}) 0%, transparent 42%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 46%, rgba(130,90,255,0.45) 0%, rgba(60,30,140,0.25) 35%, transparent 70%)", opacity: purple }} />
      <GridFloor f={f} tint={purple > 0.5 ? "rgba(170,150,255,0.5)" : "rgba(94,230,242,0.42)"} />

      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        {scene(0, CUT.b) && <SceneA f={f} />}
        {scene(CUT.b, CUT.c) && <SceneEasy f={f} />}
        {scene(CUT.c, CUT.d) && <SceneEditor f={f} />}
        {scene(CUT.d, CUT.e) && <SceneChat f={f} />}
        {scene(CUT.e, CUT.f) && <SceneControl f={f} />}
        {scene(CUT.f, CUT.g) && <SceneTemplates f={f} />}
        {scene(CUT.g, CUT.h) && <SceneVoice f={f} />}
        {scene(CUT.h, CUT.i) && <SceneTransitions f={f} />}
        {scene(CUT.i, CUT.j) && <SceneExport f={f} />}
        {scene(CUT.j, CUT.k) && <SceneMp4 f={f} />}
        {f >= CUT.k - 1 && <SceneEnd f={f} />}
      </AbsoluteFill>

      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(0.85, flash) * 0.85, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grain4">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 30} />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain4)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 10, DURATION_FRAMES - 1, eInOut) }} />
      <Sounds />
    </AbsoluteFill>
  );
};

/* ---------------- A : prête en 2 s… mais retoucher ? ---------------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const swap = f >= T.but - 2;
  const ph = prog(f, 2, 18, eExpo);
  const tweak = prog(f, T.tweak - 2, T.tweak + 10, eBack);
  const chips = [
    { x: -330, y: -230, el: <span style={{ ...sans(52) }}>Aa</span> },
    { x: 330, y: -120, el: <div style={{ width: 44, height: 44, borderRadius: 12, background: "#A765FF" }} /> },
    { x: -300, y: 230, el: <span style={{ ...sans(48) }}>♫</span> },
    { x: 310, y: 260, el: <span style={{ ...sans(44) }}>✦</span> },
  ];
  return (
    <AbsoluteFill style={exitStyle(f, CUT.b)}>
      <div style={exitStyle(f, swap ? CUT.b : T.but - 2, 3)}>
        {!swap ? (
          <>
            <Row top={160} gap={22}>
              <Pop f={f} at={T.your} style={sans(100)}>Your video&apos;s</Pop>
            </Row>
            <Row top={290}>
              <Pop f={f} at={T.ready} style={heavy(220, CYAN, 82)} glow={glowC}>READY</Pop>
            </Row>
            <Row top={500} gap={22}>
              <Pop f={f} at={T.in} style={sans(100)}>in</Pop>
              <Pop f={f} at={T.two} style={heavy(130, CYAN, 90)} glow={glowC}>2</Pop>
              <Pop f={f} at={T.seconds} style={sans(100)}>seconds…</Pop>
            </Row>
          </>
        ) : (
          <>
            <Row top={160} gap={22}>
              <Pop f={f} at={T.but} style={sans(100)}>but you</Pop>
              <Pop f={f} at={T.want} style={sans(100)}>want to</Pop>
            </Row>
            <Row top={300}>
              <Pop f={f} at={T.tweak} style={heavy(190, "#fff", 82)}>TWEAK IT?</Pop>
            </Row>
          </>
        )}
      </div>
      <div style={{ position: "absolute", left: 540 - 170, top: 1230 - 330, opacity: ph, transform: `translateY(${(1 - ph) * 200}px) rotate(${Math.sin(f / 20) * 2}deg)` }}>
        <Phone w={340} glow={0.8}>
          <MiniMotion f={f} w={340} t0={0} />
        </Phone>
      </div>
      {f >= T.ready && !swap ? (
        <div style={{ position: "absolute", left: 540 + 110, top: 1500, transform: `scale(${prog(f, T.ready, T.ready + 8, eBack)})`, padding: "14px 26px", borderRadius: 999, background: CYAN, ...caps(28, "#03080a"), letterSpacing: "0.12em", boxShadow: `0 0 40px ${CYAN}` }}>✓ ready</div>
      ) : null}
      {chips.map((c, i) => {
        const q = prog(f, T.tweak - 2 + i * 3, T.tweak + 10 + i * 3, eBack);
        return (
          <div key={i} style={{ position: "absolute", left: 540 + c.x, top: 1230 + c.y + Math.sin(f / 6 + i) * 8 * tweak, transform: `translate(-50%, -50%) scale(${q}) rotate(${Math.sin(f / 5 + i) * 8}deg)`, opacity: Math.min(1, q * 1.5), padding: "18px 22px", borderRadius: 22, border: "1.5px solid rgba(94,230,242,0.6)", background: "rgba(5,20,26,0.85)", boxShadow: "0 0 24px rgba(94,230,242,0.4)" }}>
            {c.el}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- « Easy. » ---------------- */
const SceneEasy: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={exitStyle(f, CUT.c)}>
    <AbsoluteFill style={{ opacity: prog(f, T.easy, T.easy + 6) * 0.9 }}>
      {Array.from({ length: 9 }).map((_, r) => (
        <div key={r} style={{ ...heavy(220, "transparent", 100), position: "absolute", top: r * 215 - 40, left: -400 + (r % 2 ? -1 : 1) * (f * 5) - (r % 2) * 300, WebkitTextStroke: "2px rgba(94,230,242,0.13)" }}>
          EASY · EASY · EASY · EASY · EASY ·
        </div>
      ))}
    </AbsoluteFill>
    <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center" }}>
      <Pop f={f} at={T.easy} style={heavy(380, CYAN, 95)} glow="rgba(94,230,242,0.6)">EASY.</Pop>
    </div>
  </AbsoluteFill>
);

/* ---------------- éditeur ---------------- */
const EA = 1.894;
const SceneEditor: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <div style={exitStyle(f, CUT.d, 3)}>
      <div style={{ position: "absolute", top: 140, left: 0, right: 0 }}>
        <KLogo f={f} at={T.kinetik} size={100} />
      </div>
      <Row top={300} gap={20}>
        <Pop f={f} at={T.has} style={sans(90)}>has a</Pop>
      </Row>
      <Row top={410}>
        <Pop f={f} at={T.super} style={heavy(150, "#fff", 80)}>SUPER SIMPLE</Pop>
      </Row>
      <Row top={550}>
        <Pop f={f} at={T.editor} style={heavy(210, CYAN, 80)} glow={glowC}>EDITOR</Pop>
      </Row>
    </div>
    <Float3D f={f} a={CUT.c + 2} b={CUT.d} cy={1220} w={SW} h={SW / EA}>
      <Screen center dir={DIR} f={f} src="editor" aspect={EA} w={SW} zoom={lerp(1, 1.12, prog(f, CUT.c, CUT.d))} origin={{ x: 0.4, y: 0.4 }} />
    </Float3D>
    <Tag f={f} a={CUT.c} label="the editor" />
  </AbsoluteFill>
);

/* ---------------- chat ---------------- */
const SceneChat: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.d;
  const swap = f >= T.and - 2;
  const zoom = lerp(1, 2.4, prog(f, a + 2, T.ask + 6, eInOut));
  const msg = "Make the title bigger";
  const typed = msg.slice(0, Math.round(lerp(0, msg.length, prog(f, T.ask + 4, T.and - 4, (x) => x))));
  const sendAt = T.and;
  const reply = prog(f, T.handles, T.handles + 8, eBack);
  const H = SW / EA;
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, swap ? CUT.e : T.and - 2, 3)}>
        {!swap ? (
          <>
            <Row top={170} gap={22}>
              <Pop f={f} at={T.just} style={sans(104)}>Just ask</Pop>
              <Pop f={f} at={T.ask + 7} style={sans(104)}>the</Pop>
            </Row>
            <Row top={310}>
              <Pop f={f} at={T.kinetik2} style={heavy(190, CYAN, 80)} glow={glowC}>KINETIK</Pop>
            </Row>
            <Row top={490}>
              <Pop f={f} at={T.chat} style={heavy(190, "#fff", 80)}>CHAT</Pop>
            </Row>
          </>
        ) : (
          <>
            <Row top={170} gap={22}>
              <Pop f={f} at={T.and} style={sans(104)}>and it</Pop>
              <Pop f={f} at={T.handles} style={sans(104)}>handles</Pop>
            </Row>
            <Row top={310}>
              <Pop f={f} at={T.edits} style={heavy(190, CYAN, 80)} glow={glowC}>THE EDITS</Pop>
            </Row>
            <Row top={490}>
              <Pop f={f} at={T.for} style={sans(104)}>for you.</Pop>
            </Row>
          </>
        )}
      </div>
      <Float3D f={f} a={a} b={CUT.e} cy={1200} w={SW} h={H} ry={-10}>
        <Screen
          center
          dir={DIR}
          f={f}
          src="editor"
          aspect={EA}
          w={SW}
          zoom={zoom}
          origin={{ x: 0.885, y: 0.62 }}
          cursor={f >= T.ask ? { from: { x: 0.84, y: 0.75 }, to: { x: 0.981, y: 0.937 }, t: prog(f, T.chat, sendAt - 2, eInOut), clickAt: sendAt } : null}
          highlight={{ x: 0.872, y: 0.937, w: 0.215, h: 0.054, on: prog(f, T.ask, T.ask + 6) * (1 - prog(f, sendAt + 2, sendAt + 8)), r: 12 }}
        >
          {f >= T.ask + 4 && f < sendAt + 2 ? (
            <div style={{ position: "absolute", left: 0.778 * SW, top: 0.915 * H, width: 0.18 * SW, height: 0.045 * H, background: "#101013", display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 600, fontSize: 0.0085 * SW, color: "#fff", whiteSpace: "nowrap" }}>
              {typed}
              <span style={{ width: 1.5, height: "55%", marginLeft: 1, background: "#fff", opacity: Math.floor(f / 6) % 2 ? 1 : 0 }} />
            </div>
          ) : null}
          {f >= sendAt + 2 ? (
            <div style={{ position: "absolute", left: 0.835 * SW, top: 0.33 * H, width: 0.13 * SW, padding: `${0.006 * SW}px ${0.008 * SW}px`, borderRadius: 0.01 * SW, background: "#7c3aed", fontFamily: SANS, fontWeight: 600, fontSize: 0.0082 * SW, color: "#fff", transform: `scale(${prog(f, sendAt + 2, sendAt + 8, eBack)})`, transformOrigin: "100% 0%" }}>
              {msg}
            </div>
          ) : null}
          {reply > 0 ? (
            <div style={{ position: "absolute", left: 0.795 * SW, top: 0.42 * H, width: 0.17 * SW, padding: `${0.007 * SW}px ${0.009 * SW}px`, borderRadius: 0.01 * SW, background: "#18181c", border: "1px solid rgba(255,255,255,0.08)", fontFamily: SANS, fontWeight: 600, fontSize: 0.0082 * SW, color: "#fff", transform: `scale(${reply})`, transformOrigin: "0% 0%", lineHeight: 1.35 }}>
              Done ✓ The title is now bigger. Anything else?
            </div>
          ) : null}
        </Screen>
      </Float3D>
      <Tag f={f} a={a} label="kinetik ai chat" />
    </AbsoluteFill>
  );
};

/* ---------------- contrôle total ---------------- */
const SceneControl: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.e;
  const list = f >= T.every - 2;
  const zoom = steps(f, [
    [a, 1],
    [T.every, 1.75],
    [T.every2, 2.1],
    [T.every3, 1.9],
  ]);
  const ox = steps(f, [
    [a, 0.4],
    [T.every, 0.38],
    [T.every2, 0.25],
    [T.every3, 0.378],
  ]);
  const oy = steps(f, [
    [a, 0.5],
    [T.every, 0.78],
    [T.every2, 0.84],
    [T.every3, 0.2],
  ]);
  const st = f < T.every2 - 2 ? 0 : f < T.every3 - 2 ? 1 : 2;
  const HL = [
    { x: 0.393, y: 0.78, w: 0.7, h: 0.036, r: 8 },
    { x: 0.248, y: 0.839, w: 0.085, h: 0.034, r: 10 },
    { x: 0.378, y: 0.185, w: 0.15, h: 0.09, r: 14 },
  ][st];
  const hlOn = list ? prog(f, [T.every, T.every2, T.every3][st], [T.every, T.every2, T.every3][st] + 6) : 0;
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, list ? CUT.f : T.every - 2, 3)}>
        {!list ? (
          <>
            <Row top={170} gap={22}>
              <Pop f={f} at={T.or} style={sans(104)}>Or</Pop>
              <Pop f={f} at={T.change} style={sans(104)}>change</Pop>
            </Row>
            <Row top={310}>
              <Pop f={f} at={T.everything} style={heavy(190, CYAN, 78)} glow={glowC}>EVERYTHING</Pop>
            </Row>
            <Row top={500}>
              <Pop f={f} at={T.yourself} style={sans(104)}>yourself:</Pop>
            </Row>
          </>
        ) : (
          <>
            <Row top={150}>
              <Pop f={f} at={T.every} style={heavy(118, st === 0 ? CYAN : "#fff", 80)} glow={st === 0 ? glowC : undefined}>EVERY SCENE</Pop>
            </Row>
            <Row top={300}>
              <Pop f={f} at={T.every2} style={heavy(118, st === 1 ? CYAN : "#fff", 80)} glow={st === 1 ? glowC : undefined}>EVERY ANIMATION</Pop>
            </Row>
            <Row top={450}>
              <Pop f={f} at={T.every3} style={heavy(118, st === 2 ? CYAN : "#fff", 80)} glow={st === 2 ? glowC : undefined}>EVERY WORD</Pop>
            </Row>
          </>
        )}
      </div>
      <Float3D f={f} a={a} b={CUT.f} cy={1200} w={SW} h={SW / EA} ry={12}>
        <Screen center dir={DIR} f={f} src="editor" aspect={EA} w={SW} zoom={zoom} origin={{ x: ox, y: oy }} highlight={{ ...HL, on: hlOn }} />
      </Float3D>
      <Tag f={f} a={a} label={["every scene", "every animation", "every word"][st]} />
    </AbsoluteFill>
  );
};

/* ---------------- modèles ---------------- */
const TA = 1.436;
const SceneTemplates: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.f;
  const swap = f >= T.switch - 2;
  const pick = { x: 0.527, y: 0.736 };
  const W2 = 900;
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, swap ? CUT.g : T.switch - 2, 3)}>
        {!swap ? (
          <>
            <Row top={170} gap={22}>
              <Pop f={f} at={T.want2} style={sans(104)}>Want a</Pop>
            </Row>
            <Row top={310}>
              <Pop f={f} at={T.different} style={heavy(190, CYAN, 78)} glow={glowC}>DIFFERENT</Pop>
            </Row>
            <Row top={490}>
              <Pop f={f} at={T.vibe} style={heavy(190, "#fff", 78)}>VIBE?</Pop>
            </Row>
          </>
        ) : (
          <>
            <Row top={170} gap={22}>
              <Pop f={f} at={T.switch} style={sans(104)}>Switch</Pop>
            </Row>
            <Row top={300}>
              <Pop f={f} at={T.templates} style={heavy(190, "#fff", 78)}>TEMPLATES</Pop>
            </Row>
            <Row top={490} gap={24}>
              <Pop f={f} at={T.in2} style={sans(104)}>in</Pop>
              <Pop f={f} at={T.one} style={heavy(170, CYAN, 80)} glow={glowC}>ONE CLICK</Pop>
            </Row>
          </>
        )}
      </div>
      <Float3D f={f} a={a} b={CUT.g} cy={1230} w={W2} h={W2 / TA} ry={-12}>
        <Screen
          center
          dir={DIR}
          f={f}
          src="templates"
          aspect={TA}
          w={W2}
          zoom={lerp(1, 1.45, prog(f, T.switch, T.click, eInOut))}
          origin={{ x: 0.6, y: 0.62 }}
          cursor={f >= T.switch - 4 ? { from: { x: 0.82, y: 0.95 }, to: pick, t: prog(f, T.switch, T.click - 2, eInOut), clickAt: T.click } : null}
          highlight={{ x: pick.x, y: pick.y, w: 0.108, h: 0.205, on: prog(f, T.click, T.click + 6), r: 16 }}
        />
      </Float3D>
      <Tag f={f} a={a} label="16+ templates" />
    </AbsoluteFill>
  );
};

/* ---------------- voix, musique, traduction ---------------- */
const LANGS = [
  ["EN", "Animate your brand!"],
  ["FR", "Anime ta marque !"],
  ["ES", "¡Anima tu marca!"],
  ["DE", "Animiere deine Marke!"],
  ["IT", "Anima il tuo brand!"],
  ["PT", "Anime sua marca!"],
];
const SceneVoice: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.g;
  const swap = f >= T.and2 - 2;
  const ox = steps(f, [
    [a, 0.7],
    [T.voiceover, 0.78],
    [T.music, 0.72],
    [T.translate, 0.48],
  ]);
  const zoom = lerp(1, 2.6, prog(f, a + 2, T.voiceover, eInOut));
  const st = f < T.music - 2 ? 0 : f < T.translate - 2 ? 1 : 2;
  const HL = [
    { x: 0.806, y: 0.026, w: 0.07, h: 0.036, r: 10 },
    { x: 0.737, y: 0.026, w: 0.055, h: 0.036, r: 10 },
    { x: 0.474, y: 0.026, w: 0.085, h: 0.036, r: 10 },
  ][st];
  const hlOn = prog(f, [T.voiceover, T.music, T.translate][st] - 2, [T.voiceover, T.music, T.translate][st] + 4);
  const langI = Math.min(LANGS.length - 1, Math.max(0, Math.floor((f - T.multiple) / 9) + 1));
  const card = prog(f, T.translate, T.translate + 10, eBack);
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, swap ? CUT.h : T.and2 - 2, 3)}>
        {!swap ? (
          <>
            <Row top={170} gap={22}>
              <Pop f={f} at={T.add} style={sans(104)}>Add a</Pop>
            </Row>
            <Row top={300}>
              <Pop f={f} at={T.voiceover} style={heavy(190, CYAN, 78)} glow={glowC}>VOICEOVER</Pop>
            </Row>
            <Row top={490} gap={22}>
              <Pop f={f} at={T.pick} style={sans(104)}>pick your</Pop>
              <Pop f={f} at={T.music} style={heavy(150, "#fff", 80)}>MUSIC</Pop>
            </Row>
          </>
        ) : (
          <>
            <Row top={150} gap={22}>
              <Pop f={f} at={T.and2} style={sans(96)}>and</Pop>
              <Pop f={f} at={T.translate} style={heavy(150, CYAN, 80)} glow={glowC}>TRANSLATE</Pop>
            </Row>
            <Row top={310} gap={22}>
              <Pop f={f} at={T.text} style={sans(96)}>your text into</Pop>
            </Row>
            <Row top={430}>
              <Pop f={f} at={T.multiple} style={heavy(150, "#fff", 80)}>MULTIPLE</Pop>
            </Row>
            <Row top={570}>
              <Pop f={f} at={T.languages} style={heavy(150, CYAN, 80)} glow={glowC}>LANGUAGES</Pop>
            </Row>
          </>
        )}
      </div>
      <Float3D f={f} a={a} b={CUT.h} cy={swap ? lerp(1120, 1080, prog(f, T.and2, T.and2 + 10)) : 1120} w={SW} h={SW / EA} ry={10}>
        <Screen center dir={DIR} f={f} src="editor" aspect={EA} w={SW} zoom={zoom} origin={{ x: ox, y: 0.03 }} highlight={{ ...HL, on: hlOn }} />
      </Float3D>
      {/* ondes voix / musique */}
      {!swap ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, opacity: prog(f, T.voiceover, T.voiceover + 6) }}>
          {Array.from({ length: 28 }, (_, i) => (
            <div key={i} style={{ width: 12, height: 16 + 90 * Math.abs(Math.sin(f / (st === 0 ? 3 : 6) + i * 0.7)) * (0.4 + 0.6 * hash(i)), borderRadius: 6, background: i % 3 ? CYAN : LAV, boxShadow: `0 0 10px ${CYAN}` }} />
          ))}
        </div>
      ) : null}
      {/* carte de traduction */}
      {card > 0 ? (
        <div style={{ position: "absolute", left: 90, right: 90, top: 1400, opacity: Math.min(1, card * 1.5), transform: `scale(${lerp(0.8, 1, card)})` }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 22 }}>
            {LANGS.map(([l], i) => (
              <div key={l} style={{ padding: "10px 18px", borderRadius: 14, border: `2px solid ${i === langI ? CYAN : "rgba(255,255,255,0.15)"}`, background: i === langI ? "rgba(94,230,242,0.2)" : "rgba(5,20,26,0.7)", ...caps(24, i === langI ? "#fff" : "rgba(255,255,255,0.6)"), letterSpacing: "0.12em", boxShadow: i === langI ? `0 0 20px rgba(94,230,242,0.5)` : undefined }}>
                {l}
              </div>
            ))}
          </div>
          <div key={langI} style={{ textAlign: "center", ...sans(78), filter: `blur(${(1 - prog(f, T.multiple + (langI - 1) * 9, T.multiple + (langI - 1) * 9 + 4)) * (langI > 0 ? 8 : 0)}px)` }}>
            {LANGS[langI][1]}
          </div>
        </div>
      ) : null}
      {!swap ? <Tag f={f} a={a} label={st === 0 ? "voiceover" : "music"} top={1650} /> : null}
    </AbsoluteFill>
  );
};

/* ---------------- transitions & effets ---------------- */
const SceneTransitions: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.h;
  const rows = [0.288, 0.317, 0.346, 0.4, 0.429, 0.458, 0.487, 0.516, 0.545, 0.574, 0.603, 0.632, 0.661, 0.69, 0.719, 0.748, 0.777, 0.806];
  const idx = Math.min(rows.length - 1, Math.floor(lerp(0, rows.length, prog(f, T.transitions, T.effEnd + 4, (x) => x))));
  const W2 = SW;
  const H2 = W2 / 1.887;
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, CUT.i, 3)}>
        <Row top={170} gap={22}>
          <Pop f={f} at={T.choose} style={sans(104)}>Choose your</Pop>
        </Row>
        <Row top={310}>
          <Pop f={f} at={T.transitions} style={heavy(180, CYAN, 76)} glow={glowC}>TRANSITIONS</Pop>
        </Row>
        <Row top={490}>
          <Pop f={f} at={T.and3} style={heavy(180, "#fff", 78)}>&amp; EFFECTS</Pop>
        </Row>
      </div>
      <Float3D f={f} a={a} b={CUT.i} cy={1200} w={W2} h={H2} ry={-12}>
        <Screen center dir={DIR} f={f} src="transitions" aspect={1.887} w={W2} zoom={lerp(1, 2.1, prog(f, a + 2, T.transitions + 4, eInOut))} origin={{ x: 0.27, y: 0.55 }}>
          {f >= T.transitions ? <div style={{ position: "absolute", left: 0.208 * W2, top: (rows[idx] - 0.0145) * H2, width: 0.122 * W2, height: 0.029 * H2, background: "rgba(94,230,242,0.35)", border: `1px solid ${CYAN}`, boxShadow: `0 0 12px ${CYAN}` }} /> : null}
        </Screen>
      </Float3D>
      <Tag f={f} a={a} label="30+ transitions" />
    </AbsoluteFill>
  );
};

/* ---------------- export ---------------- */
const XA = 1.6;
const PLAT = [
  { at: "tiktok", name: "TIKTOK", hl: { x: 0.316, y: 0.357 } },
  { at: "instagram", name: "INSTAGRAM", hl: { x: 0.468, y: 0.357 } },
  { at: "youtube", name: "YOUTUBE", hl: { x: 0.165, y: 0.357 } },
] as const;
const SceneExport: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.i;
  const st = f < T.instagram - 2 ? 0 : f < T.youtube - 2 ? 1 : 2;
  const p = PLAT[st];
  const W2 = 920;
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, CUT.j, 3)}>
        <Row top={170} gap={22}>
          <Pop f={f} at={T.then} style={sans(104)}>then</Pop>
          <Pop f={f} at={T.export} style={heavy(150, CYAN, 80)} glow={glowC}>EXPORT</Pop>
        </Row>
        <Row top={330}>
          <Pop f={f} at={T.for2} style={sans(96)}>for</Pop>
        </Row>
        {f >= T.tiktok ? (
          <Row top={450}>
            <Pop key={st} f={f} at={T[p.at]} style={heavy(190, st === 1 ? LAV : st === 0 ? "#fff" : CYAN, 80)} glow={glowC}>
              {p.name}
            </Pop>
          </Row>
        ) : null}
      </div>
      <Float3D f={f} a={a} b={CUT.j} cy={1220} w={W2} h={W2 / XA} ry={12}>
        <Screen
          center
          dir={DIR}
          f={f}
          src="export"
          aspect={XA}
          w={W2}
          zoom={lerp(1, 1.5, prog(f, a + 2, T.tiktok, eInOut))}
          origin={{ x: 0.32, y: 0.36 }}
          highlight={f >= T.tiktok ? { x: p.hl.x, y: p.hl.y, w: 0.146, h: 0.222, on: prog(f, T[p.at] - 2, T[p.at] + 4), r: 16 } : null}
        />
      </Float3D>
      <Tag f={f} a={a} label={["9:16 · tiktok", "1:1 · instagram", "16:9 · youtube"][st]} />
    </AbsoluteFill>
  );
};

/* ---------------- MP4 · HD · prêt ---------------- */
const SceneMp4: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.j;
  const W2 = 900;
  const H2 = W2 / XA;
  const st = f < T.hd - 2 ? 0 : f < T.ready2 - 2 ? 1 : 2;
  const HL = [
    { x: 0.16, y: 0.148, w: 0.15, h: 0.055, r: 10 },
    { x: 0.427, y: 0.585, w: 0.215, h: 0.062, r: 999 },
    { x: 0.316, y: 0.807, w: 0.45, h: 0.075, r: 999 },
  ][st];
  const clickAt = T.post;
  const render = prog(f, clickAt + 2, CUT.k - 4, eInOut);
  return (
    <AbsoluteFill>
      <div style={exitStyle(f, CUT.k, 3)}>
        <Row top={140} gap={24}>
          <Pop f={f} at={T.in3} style={sans(110)}>In</Pop>
          <Pop f={f} at={T.mp4} style={heavy(220, "#fff", 90)}>MP4.</Pop>
        </Row>
        <Row top={360} gap={24}>
          <Pop f={f} at={T.in4} style={sans(110)}>In</Pop>
          <Pop f={f} at={T.hd} style={heavy(220, CYAN, 90)} glow={glowC}>HD.</Pop>
        </Row>
        <Row top={580}>
          <Pop f={f} at={T.ready2} style={heavy(150, "#fff", 80)}>READY TO POST.</Pop>
        </Row>
      </div>
      <Float3D f={f} a={a} b={CUT.k} cy={1260} w={W2} h={H2} ry={-10}>
        <Screen
          center
          dir={DIR}
          f={f}
          src="export"
          aspect={XA}
          w={W2}
          zoom={steps(f, [
            [a, 1.05],
            [T.hd, 1.3],
            [T.ready2, 1.35],
          ])}
          origin={{ x: 0.3, y: steps(f, [[a, 0.3], [T.hd, 0.58], [T.ready2, 0.8]]) }}
          cursor={f >= T.ready2 - 4 ? { from: { x: 0.6, y: 0.95 }, to: { x: 0.36, y: 0.81 }, t: prog(f, T.ready2, clickAt - 2, eInOut), clickAt } : null}
          highlight={{ ...HL, on: prog(f, [T.mp4, T.hd, T.ready2][st], [T.mp4, T.hd, T.ready2][st] + 6) }}
        >
          {render > 0 ? (
            <div style={{ position: "absolute", left: 0.094 * W2, top: 0.772 * H2, width: 0.445 * W2 * render, height: 0.072 * H2, borderRadius: 999, background: `linear-gradient(90deg, ${CYAN}, ${LAV})`, opacity: 0.85 }} />
          ) : null}
        </Screen>
      </Float3D>
      {render > 0.6 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1600, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "14px 30px", borderRadius: 999, background: CYAN, ...caps(28, "#03080a"), letterSpacing: "0.12em", boxShadow: `0 0 40px ${CYAN}`, transform: `scale(${prog(f, CUT.k - 14, CUT.k - 6, eBack)})` }}>✓ exported · 1080×1920</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------------- fin ---------------- */
const SceneEnd: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", top: 820, left: 0, right: 0 }}>
      <KLogo f={f} at={CUT.k + 2} size={160} />
    </div>
    <div style={{ position: "absolute", top: 1060, left: 0, right: 0, textAlign: "center", ...caps(32, LAV), opacity: prog(f, CUT.k + 10, CUT.k + 18) }}>kinetik-app.com</div>
    <div style={{ position: "absolute", top: 1140, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: prog(f, CUT.k + 14, CUT.k + 22) }}>
      <div style={{ padding: "18px 40px", borderRadius: 999, background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", boxShadow: "0 0 40px rgba(139,92,246,0.8)", ...sans(44) }}>Create my video →</div>
    </div>
  </AbsoluteFill>
);

/* ---------------- son ---------------- */
const Sfx: React.FC<{ at: number; src: string; vol: number }> = ({ at, src, vol }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Html5Audio src={staticFile(`kinetik3/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);
const typeTicks = (from: number, to: number, step = 3) => Array.from({ length: Math.max(0, Math.floor((to - from) / step)) }, (_, i) => from + i * step);
const Sounds: React.FC = () => (
  <>
    <Html5Audio src={staticFile("kinetik4/sfx/music.wav")} volume={0.32} />
    <Sequence from={VO} layout="none">
      <Html5Audio src={staticFile("kinetik4/voice.wav")} volume={0.92} />
    </Sequence>
    <Sfx at={0} src="whoosh" vol={0.2} />
    <Sfx at={T.ready} src="pop" vol={0.18} />
    <Sfx at={T.two} src="impact" vol={0.16} />
    <Sfx at={T.tweak} src="pop" vol={0.16} />
    {Object.values(CUT).map((c, i) => (
      <React.Fragment key={`c${i}`}>
        <Sfx at={c - 3} src="whoosh" vol={0.18} />
        <Sfx at={c} src="glitch" vol={0.11} />
      </React.Fragment>
    ))}
    <Sfx at={T.easy} src="drop" vol={0.32} />
    <Sfx at={T.kinetik} src="shimmer" vol={0.26} />
    <Sfx at={T.editor} src="impact" vol={0.18} />
    {typeTicks(T.ask + 4, T.and - 4).map((t) => (
      <Sfx key={`t${t}`} at={t} src="key" vol={0.28} />
    ))}
    <Sfx at={T.and} src="click" vol={0.4} />
    <Sfx at={T.handles} src="pop" vol={0.2} />
    <Sfx at={T.every} src="pop" vol={0.16} />
    <Sfx at={T.every2} src="pop" vol={0.16} />
    <Sfx at={T.every3} src="pop" vol={0.16} />
    <Sfx at={T.click} src="click" vol={0.4} />
    <Sfx at={T.click} src="shimmer" vol={0.2} />
    <Sfx at={T.voiceover} src="pop" vol={0.16} />
    <Sfx at={T.music} src="pop" vol={0.16} />
    <Sfx at={T.translate} src="scan" vol={0.16} />
    {Array.from({ length: 5 }).map((_, i) => (
      <Sfx key={`l${i}`} at={T.multiple + i * 9} src="tick" vol={0.12} />
    ))}
    {Array.from({ length: 12 }).map((_, i) => (
      <Sfx key={`h${i}`} at={T.transitions + i * 3} src="tick" vol={0.07} />
    ))}
    <Sfx at={T.tiktok} src="pop" vol={0.18} />
    <Sfx at={T.instagram} src="pop" vol={0.18} />
    <Sfx at={T.youtube} src="pop" vol={0.18} />
    <Sfx at={T.in3 - 30} src="riser" vol={0.16} />
    <Sfx at={T.mp4} src="impact" vol={0.22} />
    <Sfx at={T.hd} src="impact" vol={0.22} />
    <Sfx at={T.post} src="click" vol={0.4} />
    <Sfx at={T.post + 4} src="scan" vol={0.15} />
    <Sfx at={CUT.k + 2} src="shimmer" vol={0.3} />
  </>
);

