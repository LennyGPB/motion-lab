import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { CYAN, FictionalSite, SANS, SiteH, SiteW, Streaks } from "../kinetik2/parts";
import { KLogo, MiniMotion, Phone, Pop, Row, caps, heavy, sans } from "../kinetik3/Kinetik3";
import { CommentOutro, CommentOutroSfx, Sfx } from "../kinetik12/shared";
import { Stage } from "../kinetik16/AllIn3";
import { Mascot, Place } from "../mascot/MascotTest";
import { CloudsBg } from "./Clouds";
import { ENV19 } from "./env";
import { CUT, DURATION_FRAMES, T } from "./timing";

loadViewzFonts();
loadFonts();

const VI = "#a78bfa";
const VI2 = "#c4b5ff";
const glowV = "rgba(150,110,255,0.7)";
const panelV: React.CSSProperties = { borderRadius: 36, background: "rgba(10,4,30,0.86)", border: "1.5px solid rgba(180,150,255,0.45)", boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(130,90,255,0.35)" };

/* ---------- chorégraphie de la mascotte ---------- */
type Key = Place & { at: number; dur?: number; hop?: number };
const TRACK: Key[] = [
  { at: -20, x: 540, y: 2700, s: 0.85, rot: -25 },
  { at: 0, dur: 14, x: 540, y: 1920, s: 0.85, rot: 0 },
  { at: T.kinetik, dur: 8, x: 540, y: 1910, s: 0.9, rot: 4 },
  { at: CUT.b - 4, dur: 14, x: 230, y: 1960, s: 0.56, rot: -8, hop: 160 },
  { at: T.logo, dur: 8, x: 220, y: 1950, s: 0.58, rot: 6 },
  { at: T.copy, dur: 8, x: 230, y: 1955, s: 0.56, rot: -5 },
  { at: CUT.c - 4, dur: 16, x: 870, y: 920, s: 0.44, rot: -10, hop: 260 },
  { at: T.ready, dur: 8, x: 870, y: 900, s: 0.5, rot: 8 },
  { at: CUT.d - 4, dur: 16, x: 850, y: 1975, s: 0.6, rot: 0, hop: 200 },
  { at: T.export, dur: 14, x: 850, y: 1960, s: 0.62, rot: 0, ry: 360 },
  { at: T.post, dur: 8, x: 850, y: 1950, s: 0.66, rot: -6, ry: 360 },
  { at: CUT.e - 4, dur: 16, x: 540, y: 1990, s: 1.1, rot: 0, ry: 360, hop: 120 },
  { at: T.com, dur: 8, x: 540, y: 1975, s: 1.16, rot: -4, ry: 360 },
  { at: CUT.f - 4, dur: 16, x: 905, y: 2000, s: 0.42, rot: -6, ry: 360, hop: 180 },
  { at: T.motion, dur: 6, x: 905, y: 1990, s: 0.45, rot: 5, ry: 360 },
  { at: T.discount, dur: 6, x: 905, y: 1995, s: 0.44, rot: -3, ry: 360 },
];
const placeAt = (f: number): Place => {
  let cur: Key = TRACK[0];
  for (let i = 1; i < TRACK.length; i++) {
    const k = TRACK[i];
    if (f < k.at) break;
    const q = prog(f, k.at, k.at + (k.dur ?? 10), eBack);
    const qy = prog(f, k.at, k.at + (k.dur ?? 10), eInOut);
    const hop = (k.hop ?? 0) * Math.sin(Math.PI * Math.min(1, qy));
    cur = {
      at: k.at,
      x: lerp(cur.x, k.x, q),
      y: lerp(cur.y, k.y, q) - hop,
      s: lerp(cur.s, k.s, q),
      rot: lerp(cur.rot ?? 0, k.rot ?? 0, q),
      ry: lerp(cur.ry ?? 0, k.ry ?? 0, qy),
      flip: qy > 0.5 ? k.flip : cur.flip,
    };
  }
  return { ...cur, y: cur.y + 6 * Math.sin(f / 9) };
};

/* ---------- A : One link. That's all Kinetik needs. ---------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const q = prog(f, T.link - 2, T.link + 12, eBack);
  return (
    <AbsoluteFill>
      <Row top={150} gap={24}>
        <Pop f={f} at={T.one} style={heavy(190, "#fff", 78)}>ONE</Pop>
        <Pop f={f} at={T.link} style={heavy(190, VI2, 78)} glow={glowV}>LINK.</Pop>
      </Row>
      {/* maillon de chaîne 3D */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", perspective: 900, opacity: Math.min(1, q * 1.5) }}>
        <svg width={360} height={220} viewBox="0 0 360 220" style={{ transform: `rotateY(${f * 4}deg) rotateZ(-20deg) scale(${Math.min(1, q)})`, filter: `drop-shadow(0 0 20px ${CYAN}) drop-shadow(0 0 40px ${VI})` }}>
          <rect x={20} y={60} width={190} height={100} rx={50} fill="none" stroke={CYAN} strokeWidth={22} />
          <rect x={150} y={60} width={190} height={100} rx={50} fill="none" stroke={VI2} strokeWidth={22} />
        </svg>
      </div>
      <Row top={660} gap={18} style={{ alignItems: "center" }}>
        <Pop f={f} at={T.thats} style={sans(64)}>{"that's all"}</Pop>
      </Row>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760 }}>
        <KLogo f={f} at={T.kinetik} size={96} />
      </div>
      <Row top={880}>
        <Pop f={f} at={T.needs} style={heavy(90, VI2, 80)}>NEEDS.</Pop>
      </Row>
    </AbsoluteFill>
  );
};

/* ---------- B : Paste your website : logo, colors, copy ---------- */
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const url = "yourbrand.com";
  const pasted = f >= T.website;
  const flash = f >= T.website ? Math.exp(-(f - T.website) / 4) : 0;
  const site = prog(f, T.website, T.website + 14, eExpo);
  const chip = (at: number, label: string, top: number, el: React.ReactNode, fromX: number, fromY: number) => {
    const qq = prog(f, at - 4, at + 12, eBack);
    return (
      <div style={{ position: "absolute", left: lerp(fromX, 560, Math.min(1, qq)), top: lerp(fromY, top, Math.min(1, qq)), width: 440, padding: "18px 24px", ...panelV, borderRadius: 26, display: "flex", alignItems: "center", gap: 20, opacity: Math.min(1, qq * 2), transform: `scale(${lerp(0.4, 1, Math.min(1, qq))}) rotate(${(1 - Math.min(1, qq)) * 20}deg)` }}>
        <div style={{ width: 90, height: 90, borderRadius: 20, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>{el}</div>
        <span style={heavy(64, "#fff", 80)}>{label}</span>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Row top={110} gap={20} style={{ alignItems: "center" }}>
        <Pop f={f} at={T.paste} style={heavy(120, "#fff", 80)}>PASTE</Pop>
        <Pop f={f} at={T.website - 3} style={sans(62, VI2)}>your website</Pop>
      </Row>
      <div style={{ position: "absolute", left: 90, right: 90, top: 270, padding: "22px 30px", borderRadius: 999, ...panelV, display: "flex", alignItems: "center", gap: 18, opacity: prog(f, T.paste, T.paste + 6), boxShadow: `0 0 ${30 + 60 * flash}px rgba(150,110,255,${0.4 + 0.6 * flash})` }}>
        <span style={{ fontSize: 34 }}>🔗</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, color: "#fff" }}>
          https://{pasted ? url : ""}
          <span style={{ opacity: Math.floor(f / 7) % 2 ? 0 : 1, color: CYAN }}>|</span>
        </span>
        {f >= T.website - 6 && f < T.website + 12 ? <span style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: 12, background: VI, ...caps(20, "#fff"), letterSpacing: "0.1em" }}>⌘ V</span> : null}
      </div>
      {/* le site, en 3D */}
      <div style={{ position: "absolute", left: 540 - (SiteW * 0.95) / 2, top: 400, perspective: 1500, opacity: site }}>
        <div style={{ width: SiteW, height: SiteH, borderRadius: 22, overflow: "hidden", border: "2px solid rgba(180,150,255,0.6)", boxShadow: `0 0 60px ${glowV}`, transform: `scale(0.95) rotateX(${lerp(50, 14, site)}deg) rotateY(${-10 * Math.sin(f / 20)}deg)`, transformOrigin: "50% 0%" }}>
          <FictionalSite />
          {/* scan */}
          <div style={{ position: "absolute", left: 0, right: 0, top: `${((f - T.website) * 4) % 110 - 5}%`, height: 6, background: CYAN, boxShadow: `0 0 20px ${CYAN}`, opacity: f >= T.website && f < T.copyEnd ? 0.8 : 0 }} />
        </div>
      </div>
      {chip(T.logo, "LOGO", 1000, <div style={{ width: 50, height: 50, borderRadius: "50%", border: `8px solid ${CYAN}`, boxShadow: `0 0 14px ${CYAN}` }} />, 200, 520)}
      {chip(T.colors, "COLORS", 1150, <div style={{ display: "flex", gap: 6 }}>{[CYAN, VI2, "#0b1220"].map((c) => <div key={c} style={{ width: 22, height: 50, borderRadius: 8, background: c, border: "1px solid rgba(255,255,255,0.3)" }} />)}</div>, 700, 520)}
      {chip(T.copy, "COPY", 1300, <span style={{ ...heavy(30, "#fff", 80), textAlign: "center", lineHeight: 0.9 }}>Aa</span>, 300, 700)}
    </AbsoluteFill>
  );
};

/* ---------- C : your video's ready in seconds ---------- */
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const ph = prog(f, T.your - 2, T.your + 14, eBack);
  const secs = Math.min(3.2, Math.max(0, (f - T.videos) / 30) * 2.1);
  return (
    <AbsoluteFill>
      <Row top={120} gap={20}>
        <Pop f={f} at={T.your} style={heavy(118, "#fff", 80)}>{"YOUR VIDEO'S"}</Pop>
      </Row>
      <div style={{ position: "absolute", left: 150, top: 330, perspective: 1300 }}>
        <div style={{ transform: `rotateY(${lerp(-90, 12, Math.min(1, ph)) + 5 * Math.sin(f / 18)}deg) rotateX(6deg) scale(${Math.min(1, ph)})`, opacity: Math.min(1, ph * 2) }}>
          <Phone w={380} glow={0.8}>
            <MiniMotion f={f} w={380} t0={T.your} />
          </Phone>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Pop f={f} at={T.ready} style={heavy(200, VI2, 78)} glow={glowV}>READY</Pop>
        <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: prog(f, T.seconds - 4, T.seconds + 4) }}>
          <span style={sans(62)}>in</span>
          <span style={{ padding: "10px 28px", borderRadius: 999, ...panelV, ...heavy(80, CYAN, 80), fontVariantNumeric: "tabular-nums" }}>{secs.toFixed(1)}s</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- D : Tweak, export, post ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const row = (at: number, top: number, word: string, color: string, el: React.ReactNode) => {
    const q = prog(f, at - 3, at + 10, eBack);
    return (
      <div style={{ position: "absolute", left: 70, right: 70, top, display: "flex", alignItems: "center", gap: 34, opacity: Math.min(1, q * 2), transform: `translateX(${(1 - Math.min(1, q)) * -300}px) rotateY(${(1 - Math.min(1, q)) * 40}deg)` }}>
        <span style={{ ...heavy(150, color, 78), width: 520, textShadow: color === "#fff" ? undefined : `0 0 30px ${glowV}` }}>{word}</span>
        <div style={{ flex: 1, height: 200, ...panelV, borderRadius: 30, padding: 26, display: "flex", flexDirection: "column", justifyContent: "center" }}>{el}</div>
      </div>
    );
  };
  const exp = prog(f, T.export, T.post - 2, eInOut);
  const likes = Math.floor(Math.max(0, f - T.post) * 41);
  return (
    <AbsoluteFill>
      {row(T.tweak, 180, "TWEAK,", "#fff", (
        <>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "relative", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.15)", margin: "16px 0" }}>
              <div style={{ position: "absolute", top: -10, left: `${40 + 35 * Math.sin(f / (7 + i * 2) + i)}%`, width: 28, height: 28, borderRadius: "50%", background: [CYAN, VI2, "#fff"][i], boxShadow: `0 0 12px ${[CYAN, VI2, "#fff"][i]}` }} />
            </div>
          ))}
        </>
      ))}
      {row(T.export, 480, "EXPORT,", VI2, (
        <>
          <div style={{ ...heavy(64, "#fff", 80), fontVariantNumeric: "tabular-nums" }}>{Math.round(exp * 100)}%</div>
          <div style={{ marginTop: 14, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
            <div style={{ width: `${exp * 100}%`, height: "100%", background: `linear-gradient(90deg, ${CYAN}, ${VI2})`, boxShadow: `0 0 14px ${CYAN}` }} />
          </div>
        </>
      ))}
      {row(T.post, 780, "POST.", CYAN, (
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ fontSize: 70, transform: `scale(${1 + 0.3 * Math.exp(-((Math.max(0, f - T.post)) % 10) / 3)})` }}>❤️</span>
          <span style={{ ...heavy(64, "#fff", 80), fontVariantNumeric: "tabular-nums" }}>{likes.toLocaleString("en-US")}</span>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- E : kinetik-app.com ---------- */
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const url = "kinetik-app.com";
  const n = Math.round(lerp(0, url.length, prog(f, T.kinetik2, T.comEnd, (x) => x)));
  return (
    <AbsoluteFill>
      <Row top={150}>
        <Pop f={f} at={T.head} style={heavy(150, "#fff", 80)}>HEAD TO</Pop>
      </Row>
      <div style={{ position: "absolute", left: 80, right: 80, top: 360, padding: "30px 30px", borderRadius: 999, ...panelV, display: "flex", justifyContent: "center", opacity: prog(f, T.head + 3, T.head + 9), transform: `scale(${1 + 0.05 * (f >= T.comEnd ? Math.exp(-(f - T.comEnd) / 5) : 0)})` }}>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 78, color: "#fff" }}>
          {url.slice(0, n)}
          <span style={{ opacity: Math.floor(f / 7) % 2 ? 0 : 1, color: CYAN }}>|</span>
        </span>
      </div>
      {/* étincelles autour de l'URL */}
      {f >= T.comEnd
        ? Array.from({ length: 12 }).map((_, i) => {
            const q = prog(f, T.comEnd, T.comEnd + 18, eOut);
            const a = (i / 12) * Math.PI * 2;
            return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * (200 + 300 * q), top: 430 + Math.sin(a) * (60 + 140 * q), width: 12, height: 12, borderRadius: "50%", background: i % 2 ? CYAN : VI2, opacity: 1 - q, boxShadow: `0 0 12px ${CYAN}` }} />;
          })
        : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
export const Link: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = [CUT.b, CUT.c, CUT.d, CUT.e, CUT.f];
  const kick = cuts.reduce((s, c) => s + 1.2 * prog(f, c - 8, c + 8, eInOut), 0);
  const glitch = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const hits: [number, number][] = [[T.link, 14], [T.kinetik, 10], [T.website, 12], [T.ready, 16], [T.export + 12, 10], [T.post, 10], [T.comEnd, 10]];
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const flash = Math.max(0, ...[T.link, T.ready].map((h) => (f >= h ? 0.6 * Math.exp(-(f - h) / 2.2) : 0)));
  const place = placeAt(f);
  return (
    <AbsoluteFill style={{ background: "#02010a", overflow: "hidden" }}>
      <CloudsBg t={f / 30 + kick} rise={140 * Math.sin(f / 70) + kick * 60} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)` }}>
        <Stage f={f} a={0} b={CUT.b} enter="none" exit="cube">
          <SceneA f={f} />
        </Stage>
        <Stage f={f} a={CUT.b} b={CUT.c} enter="cube" exit="dive">
          <SceneB f={f} />
        </Stage>
        <Stage f={f} a={CUT.c} b={CUT.d} enter="dive" exit="rise">
          <SceneC f={f} />
        </Stage>
        <Stage f={f} a={CUT.d} b={CUT.e} enter="rise" exit="cube">
          <SceneD f={f} />
        </Stage>
        <Stage f={f} a={CUT.e} b={CUT.f} enter="cube" exit="dive">
          <SceneE f={f} />
        </Stage>
        <Stage f={f} a={CUT.f} b={DURATION_FRAMES + 20} enter="dive" exit="none">
          <CommentOutro f={f} a={CUT.f} t={T} c1={VI2} c2={CYAN} glow={glowV} box={panelV} />
        </Stage>
        {/* la mascotte, toujours au premier plan */}
        <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 30px rgba(150,110,255,0.35))" }}>
          <Mascot f={f} voiceFrom={3} env={ENV19} place={place} fade />
        </div>
      </AbsoluteFill>
      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 10, DURATION_FRAMES - 1, eInOut) }} />
      <Html5Audio src={staticFile("kinetik19/sfx/music.wav")} volume={0.28} />
      <Sequence from={3} layout="none">
        <Html5Audio src={staticFile("kinetik19/voice.wav")} volume={0.95} />
      </Sequence>
      {cuts.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={c - 4} src="whoosh" vol={0.2} />
          <Sfx at={c} src="glitch" vol={0.1} />
        </React.Fragment>
      ))}
      {/* sauts de la mascotte */}
      {TRACK.filter((k) => k.hop).map((k, i) => (
        <Sfx key={`h${i}`} at={k.at + (k.dur ?? 10) - 2} src="pop" vol={0.14} />
      ))}
      <Sfx at={T.link} src="impact" vol={0.2} />
      <Sfx at={T.kinetik} src="shimmer" vol={0.22} />
      <Sfx at={T.website - 2} src="click" vol={0.3} />
      <Sfx at={T.website} src="scan" vol={0.14} />
      {[T.logo, T.colors, T.copy].map((a, i) => (
        <Sfx key={`b${i}`} at={a} src="pop" vol={0.16} />
      ))}
      <Sfx at={T.ready} src="drop" vol={0.22} />
      {Array.from({ length: 8 }, (_, i) => (
        <Sfx key={`s${i}`} at={T.videos + i * 3} src="tick" vol={0.08} />
      ))}
      <Sfx at={T.tweak} src="whoosh" vol={0.14} />
      <Sfx at={T.export} src="riser" vol={0.12} />
      <Sfx at={T.post} src="impact" vol={0.18} />
      {Array.from({ length: 15 }, (_, i) => (
        <Sfx key={`k${i}`} at={T.kinetik2 + i * 3} src="key" vol={0.18} />
      ))}
      <Sfx at={T.comEnd} src="shimmer" vol={0.2} />
      <CommentOutroSfx t={T} />
    </AbsoluteFill>
  );
};
