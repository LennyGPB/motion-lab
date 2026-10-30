import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, hash, lerp, prog } from "../viewz/util";
import { CYAN, GridFloor, LAV, SANS, Streaks } from "../kinetik2/parts";
import { Float3D, KLogo, MiniMotion, Phone, Pop, Row, Screen, caps, exitStyle, heavy, sans } from "../kinetik3/Kinetik3";
import { Block, CardCrop, PanScreen, Tag } from "../kinetik5/Kinetik5";
import { P1, P1CUT, P1_FRAMES, P2, P2CUT, P2_FRAMES, VO } from "./timing";

loadViewzFonts();
loadFonts();

const glowC = "rgba(94,230,242,0.5)";
const HOT = "#ff7a45";
const SW = 980;

/* =================== habillage commun =================== */
const Shell: React.FC<{
  f: number;
  frames: number;
  cuts: number[];
  hits: [number, number][];
  flashes: number[];
  purple: [number, number][];
  dir: string;
  children: React.ReactNode;
  sfx: React.ReactNode;
}> = ({ f, frames, cuts, hits, flashes, purple, dir, children, sfx }) => {
  const glitch = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4), 0);
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const flash = Math.max(0, ...flashes.map((h) => (f >= h ? Math.exp(-(f - h) / 2.2) : 0)));
  const pu = Math.max(0, ...purple.map(([a, b]) => prog(f, a, a + 5) * (1 - prog(f, b - 4, b))));
  const beat = Math.exp(-(f % (30 * (60 / 128))) / 3);
  return (
    <AbsoluteFill style={{ background: "#03080a", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(40,170,185,${0.16 + beat * 0.08}) 0%, transparent 44%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 46%, rgba(130,90,255,0.45) 0%, rgba(60,30,140,0.25) 35%, transparent 70%)", opacity: pu * 0.8 }} />
      <GridFloor f={f * 1.6} tint={pu > 0.5 ? "rgba(170,150,255,0.5)" : `rgba(94,230,242,${0.36 + beat * 0.1})`} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)` }}>{children}</AbsoluteFill>
      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(0.85, flash) * 0.85, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grainP">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 30} />
          </filter>
          <rect width="100%" height="100%" filter="url(#grainP)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, frames - 10, frames - 1, eInOut) }} />
      <Html5Audio src={staticFile(`${dir}/sfx/music.wav`)} volume={0.3} />
      <Sequence from={VO} layout="none">
        <Html5Audio src={staticFile(`${dir}/voice.wav`)} volume={0.92} />
      </Sequence>
      {cuts.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={c - 3} src="whoosh" vol={0.18} />
          <Sfx at={c} src="glitch" vol={0.1} />
        </React.Fragment>
      ))}
      {sfx}
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ at: number; src: string; vol: number }> = ({ at, src, vol }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Html5Audio src={staticFile(`kinetik3/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

/** Bulles de chat génériques (aucune marque) qui s'empilent. */
const Chat: React.FC<{ f: number; from: number; step: number; msgs: string[]; top?: number; counter?: (n: number) => string }> = ({ f, from, step, msgs, top = 900, counter }) => {
  const n = Math.max(0, Math.floor((f - from) / step) + 1);
  const shown = msgs.slice(0, Math.min(msgs.length, n));
  const scroll = Math.max(0, shown.length - 5) * 120;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top, height: 760, overflow: "hidden", maskImage: "linear-gradient(180deg, transparent, #000 14%, #000)", WebkitMaskImage: "linear-gradient(180deg, transparent, #000 14%, #000)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, transform: `translateY(${-scroll * 0}px)`, display: "flex", flexDirection: "column", gap: 18 }}>
        {shown.map((m, i) => {
          const me = i % 2 === 0;
          const q = prog(f, from + i * step, from + i * step + 6, eBack);
          return (
            <div key={i} style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: 640, padding: "20px 28px", borderRadius: 28, borderBottomRightRadius: me ? 6 : 28, borderBottomLeftRadius: me ? 28 : 6, background: me ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "rgba(255,255,255,0.09)", border: me ? "none" : "1px solid rgba(255,255,255,0.12)", ...sans(38, "#fff"), fontWeight: 600, whiteSpace: "normal", lineHeight: 1.25, transform: `scale(${q})`, transformOrigin: me ? "100% 100%" : "0% 100%", opacity: Math.min(1, q * 1.5) }}>
              {m}
            </div>
          );
        })}
      </div>
      {counter ? <div style={{ position: "absolute", right: 0, top: 0, padding: "10px 20px", borderRadius: 999, border: `1.5px solid ${HOT}`, ...caps(22, "#fff"), letterSpacing: "0.12em" }}>{counter(n)}</div> : null}
    </div>
  );
};

/** « kinetik-app.com » : logo + URL tapée + page d'accueil en 3D. */
const UrlScene: React.FC<{ f: number; a: number; b: number; k: number; app: number; dot: number; com: number; lead?: React.ReactNode }> = ({ f, a, b, k, app, dot, com, lead }) => {
  const url = "kinetik-app.com";
  const n = f < app ? Math.round(lerp(0, 7, prog(f, k, app, (x) => x))) : f < dot ? Math.round(lerp(7, 11, prog(f, app, dot, (x) => x))) : Math.round(lerp(11, 15, prog(f, dot, com + 6, (x) => x)));
  const card = prog(f, k - 2, k + 10, eBack);
  return (
    <AbsoluteFill style={exitStyle(f, b)}>
      {lead}
      <div style={{ position: "absolute", top: 260, left: 0, right: 0 }}>
        <KLogo f={f} at={k} size={130} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 500, height: 130, borderRadius: 999, border: `2px solid ${CYAN}`, background: "rgba(5,20,26,0.85)", boxShadow: `0 0 40px rgba(94,230,242,0.45)`, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, card * 1.5), transform: `scale(${card})` }}>
        <span style={{ ...sans(76, "#fff") }}>{url.slice(0, n)}</span>
        <span style={{ width: 4, height: 64, marginLeft: 6, background: CYAN, opacity: Math.floor(f / 7) % 2 ? 1 : 0.2 }} />
      </div>
      <Float3D f={f} a={k + 4} b={b} cy={1220} w={SW} h={SW / 1.947} ry={-12}>
        <Screen center dir="kinetik3" f={f} src="website" aspect={1.947} w={SW} zoom={lerp(1, 1.4, prog(f, k + 10, b, eInOut))} origin={{ x: 0.5, y: 0.35 }} />
      </Float3D>
    </AbsoluteFill>
  );
};

/** Téléphone : la vidéo générée + barre de synchro + « ready ». */
const Generated: React.FC<{ f: number; a: number; doneAt: number; cy?: number }> = ({ f, a, doneAt, cy = 1230 }) => {
  const inQ = prog(f, a, a + 14, eExpo);
  const pct = Math.round(100 * prog(f, a + 4, doneAt, eInOut));
  const ready = prog(f, doneAt, doneAt + 8, eBack);
  return (
    <>
      <div style={{ position: "absolute", left: 540 - 165, top: cy - 320, opacity: inQ, transform: `translateY(${(1 - inQ) * 200}px) rotate(${Math.sin(f / 18) * 2}deg)` }}>
        <Phone w={330} glow={0.4 + 0.6 * (pct / 100)}>
          <MiniMotion f={f} w={330} t0={a} />
          <div style={{ position: "absolute", inset: 0, background: "#05040a", clipPath: `inset(${pct}% 0 0 0)`, opacity: 0.85 }} />
        </Phone>
      </div>
      <div style={{ position: "absolute", left: 180, right: 180, top: cy + 370, opacity: inQ }}>
        <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${CYAN}, ${LAV})`, boxShadow: `0 0 16px ${CYAN}` }} />
        </div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", ...caps(24), letterSpacing: "0.15em" }}>
          <span>{pct >= 100 ? "ready" : "generating"}</span>
          <span style={{ color: "#fff" }}>{pct}%</span>
        </div>
      </div>
      {ready > 0 ? <div style={{ position: "absolute", left: 540 + 100, top: cy + 220, transform: `scale(${ready})`, padding: "14px 26px", borderRadius: 999, background: CYAN, ...caps(26, "#03080a"), letterSpacing: "0.12em", boxShadow: `0 0 40px ${CYAN}` }}>✓ ready</div> : null}
    </>
  );
};

/** Carte de fin : logo + URL + bouton. */
const EndCard: React.FC<{ f: number; a: number; top?: number }> = ({ f, a, top = 1520 }) => {
  const q = prog(f, a, a + 10, eBack);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: Math.min(1, q * 1.5), transform: `scale(${q})` }}>
      <div style={{ ...caps(30, LAV), letterSpacing: "0.25em" }}>kinetik-app.com</div>
      <div style={{ padding: "18px 40px", borderRadius: 999, background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", boxShadow: "0 0 40px rgba(139,92,246,0.8)", ...sans(44) }}>Create my video →</div>
    </div>
  );
};

/* =================== Pub 1 : « Need motion design…? » =================== */
export const KinetikPromo1: React.FC = () => {
  const f = useCurrentFrame();
  const T = P1;
  const C = P1CUT;
  const sc = (a: number, b: number) => f >= a - 1 && f < b + 1;
  return (
    <Shell
      f={f}
      frames={P1_FRAMES}
      dir="kinetik6"
      cuts={Object.values(C)}
      hits={[
        [T.motion, 12],
        [T.fast, 26],
        [T.kinetik, 14],
        [T.community, 10],
        [T.kinetik2, 14],
      ]}
      flashes={[T.fast, T.kinetik]}
      purple={[
        [C.d, C.e],
        [C.g, P1_FRAMES],
      ]}
      sfx={
        <>
          <Sfx at={T.motion} src="impact" vol={0.18} />
          <Sfx at={T.brand} src="pop" vol={0.16} />
          <Sfx at={T.fast} src="drop" vol={0.28} />
          {Array.from({ length: 7 }, (_, i) => (
            <Sfx key={`m${i}`} at={T.without + i * 6} src="pop" vol={0.1} />
          ))}
          <Sfx at={T.kinetik} src="shimmer" vol={0.26} />
          {Array.from({ length: 15 }, (_, i) => (
            <Sfx key={`u${i}`} at={T.kinetik + i * 3.2} src="key" vol={0.22} />
          ))}
          <Sfx at={T.hundreds} src="pop" vol={0.16} />
          <Sfx at={T.community} src="shimmer" vol={0.2} />
          {Array.from({ length: 14 }, (_, i) => (
            <Sfx key={`k${i}`} at={T.website + i * 3} src="key" vol={0.22} />
          ))}
          <Sfx at={T.kinetik2} src="shimmer" vol={0.26} />
          <Sfx at={T.rest} src="impact" vol={0.2} />
        </>
      }
    >
      {sc(0, C.b) && (
        <AbsoluteFill style={exitStyle(f, C.b)}>
          <Row top={150}>
            <Pop f={f} at={T.need} style={sans(100)}>Need</Pop>
          </Row>
          <Row top={270}>
            <Pop f={f} at={T.motion} style={heavy(220, CYAN, 80)} glow={glowC}>MOTION</Pop>
          </Row>
          <Row top={470}>
            <Pop f={f} at={T.design} style={heavy(220, "#fff", 80)}>DESIGN</Pop>
          </Row>
          <Row top={710} gap={18}>
            <Pop f={f} at={T.showcase} style={sans(64)}>to showcase your</Pop>
          </Row>
          <Row top={800} gap={22}>
            <Pop f={f} at={T.project} style={heavy(92, "#fff", 80)}>PROJECT</Pop>
            <Pop f={f} at={T.or} style={sans(60)}>or</Pop>
            <Pop f={f} at={T.brand} style={heavy(92, CYAN, 80)} glow={glowC}>BRAND?</Pop>
          </Row>
          <div style={{ position: "absolute", left: 540 - 140, top: 1020, opacity: prog(f, 4, 14), transform: `translateY(${(1 - prog(f, 4, 18, eExpo)) * 200}px) rotate(${Math.sin(f / 18) * 3}deg)` }}>
            <Phone w={280} glow={0.8}>
              <MiniMotion f={f} w={280} t0={0} />
            </Phone>
          </div>
          {[0, 1, 2, 3].map((i) => {
            const q = prog(f, T.design + i * 4, T.design + i * 4 + 12, eBack);
            const pos = [
              [140, 1150, -10],
              [800, 1100, 8],
              [170, 1520, 6],
              [790, 1500, -7],
            ][i];
            return (
              <div key={i} style={{ position: "absolute", left: pos[0] - 75, top: pos[1] + Math.sin(f / 12 + i) * 10, transform: `scale(${q}) rotate(${pos[2]}deg)`, opacity: Math.min(1, q * 1.5) }}>
                <CardCrop i={i * 5 + 2} w={150} />
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {sc(C.b, C.c) && (
        <AbsoluteFill style={exitStyle(f, C.c)}>
          {Array.from({ length: 18 }, (_, i) => (
            <div key={i} style={{ position: "absolute", top: 200 + hash(i) * 1500, left: ((hash(i + 3) * 1400 - (f - C.b) * (40 + hash(i + 5) * 40)) % 1400) + 1080 - 1400, width: 200 + hash(i + 7) * 400, height: 3, background: i % 3 ? "#fff" : CYAN, opacity: 0.25 + 0.4 * hash(i + 9) }} />
          ))}
          <Row top={560} gap={20}>
            <Pop f={f} at={T.and} style={sans(100)}>And you want it</Pop>
          </Row>
          <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", transform: `skewX(-8deg) translateX(${(1 - prog(f, T.fast, T.fast + 8, eExpo)) * 600}px)` }}>
            <Pop f={f} at={T.fast} style={heavy(330, CYAN, 95)} glow="rgba(94,230,242,0.7)">FAST</Pop>
          </div>
        </AbsoluteFill>
      )}

      {sc(C.c, C.d) && (
        <AbsoluteFill style={exitStyle(f, C.d)}>
          <Row top={160} gap={20}>
            <Pop f={f} at={T.without} style={sans(96)}>without spending</Pop>
          </Row>
          <Row top={290} gap={22}>
            <Pop f={f} at={T.hours} style={heavy(200, HOT, 80)} glow="rgba(255,122,69,0.5)">HOURS</Pop>
          </Row>
          <Row top={480} gap={22}>
            <Pop f={f} at={T.prompting} style={heavy(125, "#fff", 78)}>PROMPTING</Pop>
            <Pop f={f} at={T.ai} style={sans(80)}>an AI?</Pop>
          </Row>
          <Chat
            f={f}
            from={T.without - 4}
            step={6}
            top={760}
            msgs={["Make a motion for my app", "Here's a first draft…", "No, more dynamic", "Updated version ✨", "The text is cut off", "Fixed! Anything else?", "Start over…", "Sure! New version…"]}
            counter={(n) => `⏱ ${Math.min(3, Math.floor(n / 2))}h ${String((n * 17) % 60).padStart(2, "0")}m`}
          />
        </AbsoluteFill>
      )}

      {sc(C.d, C.e) && (
        <UrlScene
          f={f}
          a={C.d}
          b={C.e}
          k={T.kinetik}
          app={T.app}
          dot={T.dot}
          com={T.com}
          lead={
            <Row top={150} gap={20}>
              <Pop f={f} at={T.head} style={sans(90)}>Head to</Pop>
            </Row>
          }
        />
      )}

      {sc(C.e, C.f) && (
        <AbsoluteFill>
          <Block f={f} from={C.e} to={T.official - 2}>
            <Row top={150}>
              <Pop f={f} at={T.pick} style={sans(100)}>Pick from</Pop>
            </Row>
            <Row top={280}>
              <Pop f={f} at={T.hundreds} style={heavy(210, CYAN, 80)} glow={glowC}>HUNDREDS</Pop>
            </Row>
            <Row top={480}>
              <Pop f={f} at={T.templates} style={sans(100)}>of templates</Pop>
            </Row>
          </Block>
          <Block f={f} from={T.official - 2} to={C.f}>
            <Row top={150}>
              <Pop f={f} at={T.official} style={heavy(190, "#fff", 80)}>OFFICIAL</Pop>
            </Row>
            <Row top={350} gap={20}>
              <Pop f={f} at={T.or2} style={sans(90)}>or made by the</Pop>
            </Row>
            <Row top={460}>
              <Pop f={f} at={T.community} style={heavy(190, CYAN, 78)} glow={glowC}>COMMUNITY</Pop>
            </Row>
          </Block>
          {f < T.made + 2 ? <PanScreen f={f} a={C.e} b={T.made + 2} src="motion" zoom={1.7} x0={0.17} x1={0.8} y={0.52} /> : <PanScreen f={f} a={T.made - 2} b={C.f} src="community" zoom={1.6} x0={0.4} x1={0.75} y={0.5} ry={12} />}
          <Tag f={f} a={C.e} label={f < T.made ? "kinetik templates" : "community creations"} />
        </AbsoluteFill>
      )}

      {sc(C.f, C.g) && (
        <AbsoluteFill>
          <div style={exitStyle(f, C.g, 3)}>
            <Row top={150}>
              <Pop f={f} at={T.paste} style={sans(100)}>Paste your</Pop>
            </Row>
            <Row top={280}>
              <Pop f={f} at={T.website} style={heavy(170, CYAN, 80)} glow={glowC}>WEBSITE LINK</Pop>
            </Row>
            <Row top={460} gap={22}>
              <Pop f={f} at={T.or3} style={sans(90)}>or your</Pop>
              <Pop f={f} at={T.brand2} style={heavy(140, "#fff", 80)}>BRAND INFO…</Pop>
            </Row>
          </div>
          <BrandForm f={f} a={C.f} b={C.g} urlFrom={T.website} urlTo={T.or3} nameFrom={T.brand2} nameTo={T.infoEnd} />
          <Tag f={f} a={C.f} label="your brand" />
        </AbsoluteFill>
      )}

      {f >= C.g - 1 && (
        <AbsoluteFill>
          <div style={{ position: "absolute", top: 150, left: 0, right: 0 }}>
            <KLogo f={f} at={T.kinetik2} size={110} />
          </div>
          <Row top={330}>
            <Pop f={f} at={T.handles} style={heavy(170, CYAN, 80)} glow={glowC}>HANDLES</Pop>
          </Row>
          <Row top={500}>
            <Pop f={f} at={T.rest} style={heavy(170, "#fff", 80)}>THE REST.</Pop>
          </Row>
          <Generated f={f} a={C.g} doneAt={T.rest} cy={1080} />
          <EndCard f={f} a={T.end + 2} />
        </AbsoluteFill>
      )}
    </Shell>
  );
};

/** Formulaire « marque » réel : l'URL puis le nom se tapent dans les champs. */
const BrandForm: React.FC<{ f: number; a: number; b: number; urlFrom: number; urlTo: number; nameFrom: number; nameTo: number }> = ({ f, a, b, urlFrom, urlTo, nameFrom, nameTo }) => {
  const W2 = SW;
  const H2 = W2 / 1.938;
  const url = "https://flowly.app";
  const u = url.slice(0, Math.round(lerp(0, url.length, prog(f, urlFrom, urlTo, (x) => x))));
  const nm = "Flowly".slice(0, Math.round(lerp(0, 6, prog(f, nameFrom, nameTo, (x) => x))));
  const field = (top: number, txt: string, fs = 0.0155) => (
    <div style={{ position: "absolute", left: 0.047 * W2, top: top * H2, width: 0.53 * W2, height: 0.07 * H2, background: "#0f0f12", display: "flex", alignItems: "center", paddingLeft: 0.012 * W2, fontFamily: SANS, fontWeight: 600, fontSize: fs * W2, color: "#fff" }}>
      {txt}
      <span style={{ width: 2, height: "45%", marginLeft: 2, background: "#fff", opacity: Math.floor(f / 6) % 2 ? 1 : 0 }} />
    </div>
  );
  const onUrl = f < nameFrom - 2;
  return (
    <Float3D f={f} a={a} b={b} cy={1180} w={W2} h={H2}>
      <Screen
        center
        dir="kinetik3"
        f={f}
        src="brand"
        aspect={1.938}
        w={W2}
        zoom={lerp(1, 1.6, prog(f, a + 4, urlFrom + 6, eInOut))}
        origin={{ x: 0.1, y: onUrl ? 0.66 : 0.51 }}
        highlight={{ x: 0.315, y: onUrl ? 0.667 : 0.51, w: 0.545, h: 0.075, on: prog(f, urlFrom - 4, urlFrom + 4), r: 14 }}
      >
        {f >= urlFrom ? field(0.633, u, 0.0135) : null}
        {f >= nameFrom ? field(0.478, nm) : null}
      </Screen>
    </Float3D>
  );
};

/* =================== Pub 2 : « Going back and forth… » =================== */
export const KinetikPromo2: React.FC = () => {
  const f = useCurrentFrame();
  const T = P2;
  const C = P2CUT;
  const sc = (a: number, b: number) => f >= a - 1 && f < b + 1;
  const credits = Math.round(lerp(100, 0, prog(f, T.burning, T.credits + 14, eInOut)));
  return (
    <Shell
      f={f}
      frames={P2_FRAMES}
      dir="kinetik7"
      cuts={Object.values(C)}
      hits={[
        [T.fifty, 14],
        [T.burning, 12],
        [T.fix, 26],
        [T.kinetik, 14],
        [T.money, 14],
      ]}
      flashes={[T.fix, T.kinetik]}
      purple={[
        [C.d, C.e],
        [C.g, P2_FRAMES],
      ]}
      sfx={
        <>
          {Array.from({ length: 10 }, (_, i) => (
            <Sfx key={`b${i}`} at={T.back + i * 7} src="pop" vol={0.1} />
          ))}
          <Sfx at={T.fifty} src="impact" vol={0.18} />
          <Sfx at={T.burning} src="scan" vol={0.16} />
          {Array.from({ length: 12 }, (_, i) => (
            <Sfx key={`d${i}`} at={T.burning + i * 4} src="tick" vol={0.08} />
          ))}
          <Sfx at={T.fix} src="drop" vol={0.3} />
          <Sfx at={T.kinetik} src="shimmer" vol={0.26} />
          {Array.from({ length: 15 }, (_, i) => (
            <Sfx key={`u${i}`} at={T.kinetik + i * 2.6} src="key" vol={0.22} />
          ))}
          <Sfx at={T.hundreds} src="pop" vol={0.16} />
          {Array.from({ length: 12 }, (_, i) => (
            <Sfx key={`t${i}`} at={T.hundreds + i * 2.4 + 8} src="tick" vol={0.06} />
          ))}
          <Sfx at={T.tweak} src="click" vol={0.35} />
          <Sfx at={T.editor} src="pop" vol={0.16} />
          <Sfx at={T.time} src="impact" vol={0.18} />
          <Sfx at={T.money} src="shimmer" vol={0.26} />
        </>
      }
    >
      {sc(0, C.b) && (
        <AbsoluteFill style={exitStyle(f, C.b)}>
          <Row top={150} gap={20}>
            <Pop f={f} at={T.going} style={sans(90)}>Going back and forth</Pop>
          </Row>
          <Row top={260} gap={20}>
            <Pop f={f} at={T.with} style={sans(90)}>with Claude</Pop>
          </Row>
          <Row top={380}>
            <Pop f={f} at={T.fifty} style={heavy(220, HOT, 85)} glow="rgba(255,122,69,0.5)">50 TIMES</Pop>
          </Row>
          <Row top={600}>
            <Pop f={f} at={T.get} style={sans(80)}>to get your motion…</Pop>
          </Row>
          <Chat
            f={f}
            from={T.back - 4}
            step={7}
            top={780}
            msgs={["Make my intro animation", "Here you go!", "Smoother please", "Done ✨", "Now it's too slow", "Adjusted!", "The logo is wrong…", "Let me fix that", "Try again", "New version!"]}
            counter={(n) => `attempt ${Math.min(50, n * 5)} / 50`}
          />
        </AbsoluteFill>
      )}

      {sc(C.b, C.c) && (
        <AbsoluteFill style={exitStyle(f, C.c)}>
          <Row top={170} gap={20}>
            <Pop f={f} at={T.and} style={sans(100)}>and</Pop>
          </Row>
          <Row top={300}>
            <Pop f={f} at={T.burning} style={heavy(210, HOT, 80)} glow="rgba(255,122,69,0.6)">BURNING</Pop>
          </Row>
          <Row top={500} gap={20}>
            <Pop f={f} at={T.through} style={sans(90)}>through all your</Pop>
          </Row>
          <Row top={620}>
            <Pop f={f} at={T.credits} style={heavy(190, "#fff", 80)}>CREDITS?</Pop>
          </Row>
          <div style={{ position: "absolute", top: 960, left: 0, right: 0, textAlign: "center" }}>
            <div style={{ ...heavy(300, credits < 20 ? HOT : "#fff", 90), textShadow: `0 0 40px ${credits < 20 ? "rgba(255,122,69,0.7)" : "rgba(255,255,255,0.3)"}`, transform: `translateX(${credits < 30 ? (hash(f) - 0.5) * 12 : 0}px)` }}>{credits}</div>
            <div style={{ ...caps(34, credits < 20 ? HOT : CYAN), marginTop: 10 }}>credits left</div>
          </div>
          <div style={{ position: "absolute", left: 160, right: 160, top: 1420, height: 20, borderRadius: 10, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{ width: `${credits}%`, height: "100%", background: credits < 30 ? `linear-gradient(90deg, ${HOT}, #ffb347)` : `linear-gradient(90deg, ${CYAN}, ${LAV})`, boxShadow: `0 0 16px ${credits < 30 ? HOT : CYAN}` }} />
          </div>
          {Array.from({ length: 16 }, (_, i) => {
            const p = ((f - T.burning) / 30 + hash(i)) % 1;
            return f >= T.burning ? <div key={i} style={{ position: "absolute", left: 160 + (credits / 100) * 760 + (hash(i + 2) - 0.5) * 40, top: 1420 - p * 160, width: 8, height: 8, borderRadius: 4, background: i % 2 ? HOT : "#ffb347", opacity: (1 - p) * 0.9, boxShadow: `0 0 10px ${HOT}` }} /> : null;
          })}
        </AbsoluteFill>
      )}

      {sc(C.c, C.d) && (
        <AbsoluteFill style={exitStyle(f, C.d)}>
          <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center" }}>
            <Pop f={f} at={T.the} style={heavy(250, CYAN, 92)} glow="rgba(94,230,242,0.7)">THE FIX:</Pop>
          </div>
        </AbsoluteFill>
      )}

      {sc(C.d, C.e) && <UrlScene f={f} a={C.d} b={C.e} k={T.kinetik} app={T.app} dot={T.dot} com={T.com} />}

      {sc(C.e, C.f) && (
        <AbsoluteFill style={exitStyle(f, C.f)}>
          <Row top={150} gap={20}>
            <Pop f={f} at={T.generate} style={sans(92)}>Generate your motion</Pop>
          </Row>
          <Row top={270} gap={20}>
            <Pop f={f} at={T.from} style={sans(80)}>from</Pop>
            <Pop f={f} at={T.hundreds} style={heavy(170, CYAN, 80)} glow={glowC}>HUNDREDS</Pop>
          </Row>
          <Row top={460}>
            <Pop f={f} at={T.ready} style={heavy(120, "#fff", 80)}>OF READY-MADE TEMPLATES</Pop>
          </Row>
          <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 1250px" }}>
            <div style={{ position: "absolute", left: 540 - (5 * 196) / 2, top: 720, width: 5 * 196, transform: "rotateX(20deg) rotateZ(-6deg)", transformStyle: "preserve-3d" }}>
              {Array.from({ length: 20 }, (_, i) => {
                const at = T.hundreds - 4 + i * 2.4;
                const q = prog(f, at, at + 10, eBack);
                return (
                  <div key={i} style={{ position: "absolute", left: (i % 5) * 196, top: Math.floor(i / 5) * 290 - (1 - q) * 260, opacity: f >= at ? Math.min(1, q * 1.6) : 0, transform: `rotate(${(1 - q) * (hash(i) - 0.5) * 40}deg)` }}>
                    <CardCrop i={i * 2 + 3} w={180} glow={f >= at && f < at + 12 ? 1 - (f - at) / 12 : 0} />
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {sc(C.f, C.g) && (
        <AbsoluteFill>
          <div style={exitStyle(f, C.g, 3)}>
            <Row top={150} gap={22}>
              <Pop f={f} at={T.tweak} style={heavy(170, CYAN, 80)} glow={glowC}>TWEAK IT</Pop>
            </Row>
            <Row top={340} gap={20}>
              <Pop f={f} at={T.however} style={sans(84)}>however you want</Pop>
            </Row>
            <Row top={450} gap={20}>
              <Pop f={f} at={T.with2} style={sans(84)}>with our</Pop>
              <Pop f={f} at={T.super} style={sans(84, LAV)}>super simple</Pop>
            </Row>
            <Row top={560}>
              <Pop f={f} at={T.editor} style={heavy(170, "#fff", 80)}>EDITOR</Pop>
            </Row>
          </div>
          <Float3D f={f} a={C.f} b={C.g} cy={1250} w={SW} h={SW / 1.894} ry={12}>
            <Screen
              center
              dir="kinetik4"
              f={f}
              src="editor"
              aspect={1.894}
              w={SW}
              zoom={lerp(1, 1.9, prog(f, T.however, T.editor + 6, eInOut))}
              origin={{ x: lerp(0.38, 0.39, prog(f, T.however, T.editor)), y: lerp(0.45, 0.8, prog(f, T.however, T.editor + 6, eInOut)) }}
              highlight={{ x: 0.393, y: 0.78, w: 0.7, h: 0.036, on: prog(f, T.editor, T.editor + 6), r: 8 }}
            />
          </Float3D>
          <Tag f={f} a={C.f} label="super simple editor" />
        </AbsoluteFill>
      )}

      {f >= C.g - 1 && (
        <AbsoluteFill>
          <Row top={150} gap={20}>
            <Pop f={f} at={T.everything} style={sans(84)}>Everything&apos;s built</Pop>
          </Row>
          <Row top={260} gap={20}>
            <Pop f={f} at={T.save} style={sans(84)}>to save you</Pop>
          </Row>
          <Row top={380}>
            <Pop f={f} at={T.time} style={heavy(230, CYAN, 85)} glow={glowC}>TIME…</Pop>
          </Row>
          <Row top={610} gap={22}>
            <Pop f={f} at={T.and2} style={sans(84)}>and</Pop>
            <Pop f={f} at={T.money} style={heavy(230, "#fff", 85)} glow="rgba(255,255,255,0.4)">MONEY.</Pop>
          </Row>
          <div style={{ position: "absolute", top: 1000, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
            {[
              { at: T.time, big: "2 s", small: "instead of hours" },
              { at: T.money, big: "5 cr", small: "per export" },
            ].map((c, i) => {
              const q = prog(f, c.at, c.at + 10, eBack);
              return (
                <div key={i} style={{ width: 380, padding: "34px 0", borderRadius: 36, border: `2px solid ${CYAN}`, background: "rgba(5,20,26,0.85)", boxShadow: `0 0 ${30 * q}px rgba(94,230,242,0.5)`, textAlign: "center", transform: `scale(${q})`, opacity: Math.min(1, q * 1.5) }}>
                  <div style={{ ...heavy(110, i ? "#fff" : CYAN, 90) }}>{c.big}</div>
                  <div style={{ ...caps(22, "#fff"), letterSpacing: "0.15em", marginTop: 10 }}>{c.small}</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", top: 1330, left: 0, right: 0 }}>
            <KLogo f={f} at={T.end} size={100} />
          </div>
          <EndCard f={f} a={T.end + 6} top={1500} />
        </AbsoluteFill>
      )}
    </Shell>
  );
};
