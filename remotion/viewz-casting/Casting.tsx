import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Avatar, PinIcon, Pill, PlaneIcon, StoreBadge } from "../viewz/Bits";
import { KText } from "../viewz/KText";
import { Phone, PH, PW } from "../viewz/Phone";
import { FONT, hotText, loadViewzFonts, V } from "../viewz/theme";
import { Heat, Thermal } from "../viewz/Thermal";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { Check, FormatIcon, Silhouette } from "./Icons";
import { Sound } from "./Sound";
import { kickPulse, SC, SLAMS, T, W } from "./timing";

loadViewzFonts();

const inScene = (f: number, k: keyof typeof SC, pre = 2, post = 8) => f >= T(SC[k][0]) - pre && f < T(SC[k][1]) + post;
const exitOf = (k: keyof typeof SC) => T(SC[k][1]) - 3;

const NET = [
  { name: "nelson", x: 210, y: 1330 },
  { name: "oceane", x: 870, y: 1300 },
  { name: "purple", x: 300, y: 1680 },
  { name: "lina", x: 790, y: 1700 },
];

const STYLES = [
  { t: "Hip-hop", at: W.hiphop, av: "nelson", name: "Nelson Ari" },
  { t: "Afro", at: W.afro, av: "oceane", name: "Océane S" },
  { t: "Contemporain", at: W.contemporain, av: null, name: "Toi ?" },
  { t: "Krump", at: W.krump, av: "purple", name: "Monsieur Purple" },
  { t: "ou autre", at: W.ou, av: "lina", name: "Lina Morel" },
];

const LOGO_RATIO = 439 / 1536;

/** Logo ViewZ avec séparation RGB. */
const Logo: React.FC<{ f: number; at: number; width: number; cx: number; cy: number; kick: number }> = ({ f, at, width, cx, cy, kick }) => {
  const p = prog(f, at, at + 8, eExpo);
  const since = f - at;
  const split = since >= 0 ? 22 * Math.exp(-since / 5) + 3 * kick : 0;
  const h = width * LOGO_RATIO;
  const mask: React.CSSProperties = {
    WebkitMaskImage: `url(${staticFile("viewz/logo.png")})`,
    WebkitMaskSize: "100% 100%",
    position: "absolute",
    inset: 0,
  };
  return (
    <div
      style={{
        position: "absolute",
        left: cx - width / 2,
        top: cy - h / 2,
        width,
        height: h,
        opacity: p,
        transform: `scale(${lerp(2.6, 1, p) * (1 + kick * 0.02)})`,
        filter: p < 1 ? `blur(${(1 - p) * 20}px)` : "drop-shadow(0 0 30px rgba(200,90,255,0.9))",
      }}
    >
      {split > 0.5 ? (
        <>
          <div style={{ ...mask, background: "rgba(255,40,220,0.8)", transform: `translateX(${-split}px)`, mixBlendMode: "screen" }} />
          <div style={{ ...mask, background: "rgba(80,200,255,0.65)", transform: `translateX(${split}px)`, mixBlendMode: "screen" }} />
        </>
      ) : null}
      <Img src={staticFile("viewz/logo.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
};

const Glass: React.FC<{ w: number; h: number; children?: React.ReactNode; radius?: number; glow?: number }> = ({ w, h, children, radius = 48, glow = 0.5 }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: radius,
      background: "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(190,120,255,0.05) 60%), rgba(22,4,40,0.82)",
      border: "2px solid rgba(220,160,255,0.45)",
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 0 ${60 * glow}px rgba(170,60,255,${0.5 * glow + 0.2}), 0 40px 90px rgba(0,0,0,0.55)`,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

/** Motion "ViewZ — Casting danseur·se" (1080x1920, 30 fps). */
export const Casting: React.FC = () => {
  const f = useCurrentFrame();
  const kick = kickPulse(f);

  let shake = 0;
  let flash = 0;
  let slamHeat = 0;
  for (const s of SLAMS) {
    const d = f - s.f;
    if (d < 0) continue;
    shake += 24 * s.power * Math.exp(-d / 3);
    flash = Math.max(flash, (s.power >= 1 ? 0.8 : 0.16) * Math.exp(-d / 2.2));
    slamHeat += s.power * Math.exp(-d / 6);
  }
  const shx = shake * Math.sin(f * 2.9);
  const shy = shake * Math.cos(f * 2.1);

  const cuts = [T(SC.casting[0]), T(SC.formats[0]) + 0, T(SC.styles[0]), T(SC.match[0]), T(SC.dm[0]), T(SC.finale[0])];
  const speed = Math.max(...cuts.map((c) => Math.max(0, 1 - Math.abs(f - c) / 5)));

  // ---- positions dynamiques utiles pour la chaleur ----
  const logoMove = prog(f, T(W.cest) - 2, T(W.cest) + 12, eInOut);
  const introLogoY = lerp(820, 330, logoMove);
  const styleIdx = STYLES.reduce((acc, s, i) => (f >= T(s.at) - 2 ? i : acc), -1);
  const silHeat = prog(f, T(W.parle) - 2, T(W.parle) + 8);

  const heats: Heat[] = [];
  if (inScene(f, "intro")) heats.push({ x: 540, y: introLogoY, r: 420, a: 0.3 + 0.9 * Math.exp(-Math.max(0, f - T(W.viewz)) / 10) });
  if (inScene(f, "casting")) heats.push({ x: 540, y: 1250, r: 300, ry: 1.6, a: 0.4 * prog(f, T(W.recherche), T(W.recherche) + 12) });
  if (inScene(f, "styles") && styleIdx >= 0) heats.push({ x: 540, y: 1480, r: 220, ry: 1.8, a: 0.45 });
  if (inScene(f, "match")) heats.push({ x: 540, y: 1520, r: 170, ry: 2.2, a: 0.25 + 0.7 * silHeat });
  if (inScene(f, "dm")) heats.push({ x: 540, y: 1450, r: 400, a: 0.35 });
  if (f >= T(SC.finale[0])) heats.push({ x: 540, y: 520, r: 460, a: 0.25 + 0.7 * Math.exp(-Math.max(0, f - T(W.lapp)) / 12) });

  const boot = f < T(W.viewz) ? (hash(f) > 0.4 ? 0.6 : 0.25) : 1;
  const intensity = boot * (0.92 + 0.12 * kick + 0.25 * Math.min(1, slamHeat));
  const vibrate = 7 + 9 * kick + 24 * Math.min(1, slamHeat);

  return (
    <AbsoluteFill style={{ backgroundColor: V.black, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shx}px, ${shy}px) scale(${1.03 + kick * 0.012})` }}>
        <Thermal intensity={intensity} heats={heats} vibrate={vibrate} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,0,8,0.72) 0%, rgba(4,0,8,0.35) 35%, rgba(4,0,8,0.1) 60%, rgba(4,0,8,0.45) 100%)" }} />
        <AbsoluteFill
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 5px)",
            transform: `translateY(${(f * 2) % 5}px)`,
            opacity: 0.6,
          }}
        />

        {/* ===== 1. Intro : ViewZ, premier réseau social pour les danseurs ===== */}
        {inScene(f, "intro") ? (
          <AbsoluteFill
            style={{
              opacity: 1 - prog(f, exitOf("intro"), exitOf("intro") + 7, eIn),
              filter: f > exitOf("intro") ? `blur(${prog(f, exitOf("intro"), exitOf("intro") + 7) * 14}px)` : undefined,
            }}
          >
            <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
              {NET.flatMap((a, i) =>
                NET.slice(i + 1).map((b, j) => {
                  const p = prog(f, T(W.social) + (i + j) * 2, T(W.social) + (i + j) * 2 + 12);
                  if (p <= 0) return null;
                  return (
                    <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={lerp(a.x, b.x, p)} y2={lerp(a.y, b.y, p)} stroke="rgba(230,140,255,0.5)" strokeWidth={3} strokeDasharray="12 10" strokeDashoffset={-f * 2} />
                  );
                }),
              )}
            </svg>
            {NET.map((n, i) => {
              const p = prog(f, T(W.reseau) + i * 3, T(W.reseau) + i * 3 + 12, eBack);
              if (p <= 0) return null;
              return (
                <div key={n.name} style={{ position: "absolute", left: n.x - 90, top: n.y - 90, transform: `scale(${p})`, opacity: Math.min(1, p * 2) }}>
                  <Avatar name={n.name} size={180} ring={0.7 + kick} />
                </div>
              );
            })}
            <Logo f={f} at={T(W.viewz)} width={lerp(860, 560, logoMove)} cx={540} cy={introLogoY} kick={kick} />
            <KText
              f={f}
              top={520}
              lines={[
                { anim: "rise", size: 78, tokens: [{ t: "C'est", at: W.cest, look: "muted" }, { t: "le", at: W.le, look: "muted" }] },
                { anim: "slam", size: 170, tokens: [{ t: "premier", at: W.premier, look: "hot" }] },
                { anim: "slam", size: 108, tokens: [{ t: "réseau", at: W.reseau }, { t: "social", at: W.social, look: "outline" }] },
                { anim: "rise", size: 78, tokens: [{ t: "pour", at: W.pour, look: "muted" }, { t: "les", at: W.les, look: "muted" }, { t: "danseurs", at: W.danseurs }] },
              ]}
            />
          </AbsoluteFill>
        ) : null}

        {/* ===== 2. Casting ===== */}
        {inScene(f, "casting") ? (
          <>
            <KText
              f={f}
              top={160}
              exitAt={T(W.pour2) - 3}
              lines={[
                { anim: "rise", size: 76, tokens: [{ t: "Et", at: W.et, look: "muted" }, { t: "on", at: W.on, look: "muted" }, { t: "recherche", at: W.recherche }] },
                { anim: "rise", size: 100, tokens: [{ t: "un", at: W.un }, { t: "danseur", at: W.danseur }] },
                { anim: "slam", size: 140, tokens: [{ t: "expérimenté", at: W.experimente, look: "hot" }] },
                { anim: "rise", size: 92, tokens: [{ t: "sur", at: W.sur, look: "muted" }, { t: "Paris", at: W.paris, look: "hot" }] },
              ]}
            />
            <KText
              f={f}
              top={170}
              exitAt={exitOf("casting")}
              lines={[
                { anim: "rise", size: 90, tokens: [{ t: "pour", at: W.pour2, look: "muted" }, { t: "créer", at: W.creer }] },
                { anim: "slam", size: 150, tokens: [{ t: "du", at: W.du, look: "outline" }, { t: "contenu", at: W.contenu, look: "hot" }] },
                { anim: "rise", size: 90, tokens: [{ t: "avec", at: W.avec, look: "muted" }, { t: "nous", at: W.nous }] },
              ]}
            />
            {/* fiche casting */}
            {(() => {
              const p = prog(f, T(W.recherche), T(W.recherche) + 16, eBack);
              const out = prog(f, T(W.pour2) - 2, T(W.pour2) + 8, eIn);
              if (p <= 0 || out >= 1) return null;
              const scanY = ((f - T(W.recherche)) % 40) / 40;
              const found = prog(f, T(W.experimente), T(W.experimente) + 10);
              return (
                <div
                  style={{
                    position: "absolute",
                    left: 540 - 300,
                    top: 1250 - 380,
                    perspective: 1600,
                    opacity: Math.min(1, p * 2) * (1 - out),
                    transform: `scale(${lerp(0.6, 1, p) * (1 - out * 0.3)})`,
                    filter: out > 0 ? `blur(${out * 12}px)` : undefined,
                  }}
                >
                  <div style={{ transform: `rotateY(${(1 - p) * 80 + 6 * Math.sin(f / 22)}deg) rotateX(${3 * Math.sin(f / 30)}deg)` }}>
                    <Glass w={600} h={760} glow={0.6 + kick * 0.4}>
                      <div style={{ position: "absolute", top: 34, left: 40, right: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 36, color: V.white, letterSpacing: 4 }}>CASTING</span>
                        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: V.lilac, letterSpacing: 3 }}>#VIEWZ</span>
                      </div>
                      <div style={{ position: "relative", width: 340, height: 340, marginTop: 30 }}>
                        <div
                          style={{
                            position: "absolute",
                            inset: -14,
                            borderRadius: "50%",
                            border: "4px dashed rgba(230,150,255,0.8)",
                            transform: `rotate(${f * 2}deg)`,
                          }}
                        />
                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle, #3a0a6b, #12001f)" }}>
                          <div style={{ position: "absolute", left: 20, top: 30 }}>
                            <Silhouette size={300} />
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              top: `${scanY * 100}%`,
                              height: 6,
                              background: "rgba(255,180,255,0.95)",
                              boxShadow: "0 0 24px 8px rgba(220,100,255,0.7)",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 110, marginTop: 26, ...hotText, paddingRight: 10 }}>TOI ?</div>
                      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: V.muted, opacity: 0.4 + 0.6 * found }}>Danseur·se expérimenté·e</div>
                    </Glass>
                  </div>
                </div>
              );
            })()}
            {(() => {
              const p = prog(f, T(W.paris) - 1, T(W.paris) + 10, eBack);
              const out = prog(f, T(W.pour2) - 2, T(W.pour2) + 8, eIn);
              return (
                <div style={{ position: "absolute", top: 1680, width: "100%", display: "flex", justifyContent: "center", opacity: Math.min(1, p * 2) * (1 - out), transform: `scale(${lerp(1.8, 1, p)})` }}>
                  <Pill text="Paris" hot size={56} icon={<PinIcon size={56} />} />
                </div>
              );
            })()}
          </>
        ) : null}

        {/* ===== Viseur caméra (contenu → formats) ===== */}
        {f >= T(W.pour2) - 2 && f < T(SC.formats[1]) + 8 ? <Viewfinder f={f} kick={kick} /> : null}

        {/* ===== 3. Formats ===== */}
        {inScene(f, "formats") ? (
          <KText
            f={f}
            top={170}
            exitAt={exitOf("formats")}
            lines={[
              { anim: "slam", size: 130, tokens: [{ t: "vidéos,", at: W.videos, look: "hot" }] },
              { anim: "slam", size: 130, tokens: [{ t: "interviews,", at: W.interviews }] },
              { anim: "slam", size: 130, tokens: [{ t: "coulisses.", at: W.coulisses, look: "outline" }] },
            ]}
          />
        ) : null}

        {/* ===== 4. Styles ===== */}
        {inScene(f, "styles") ? <Styles f={f} kick={kick} styleIdx={styleIdx} /> : null}

        {/* ===== 5. Expérience + projet ===== */}
        {inScene(f, "match") ? (
          <>
            <KText
              f={f}
              top={170}
              exitAt={exitOf("match")}
              lines={[
                { anim: "rise", size: 90, tokens: [{ t: "si", at: W.si, look: "muted" }, { t: "t'as", at: W.tas }] },
                { anim: "slam", size: 116, tokens: [{ t: "de", at: W.de, look: "outline" }, { t: "l'expérience", at: W.experience, look: "hot" }] },
                { anim: "rise", size: 78, tokens: [{ t: "et", at: W.et2, look: "muted" }, { t: "que", at: W.que, look: "muted" }, { t: "le", at: W.le2, look: "muted" }, { t: "projet", at: W.projet }] },
                { anim: "slam", size: 170, tokens: [{ t: "te", at: W.te, look: "outline" }, { t: "parle", at: W.parle, look: "hot" }] },
              ]}
            />
            {[
              { at: W.experience, text: "Expérience", y: 980 },
              { at: W.parle, text: "Le projet te parle", y: 1130 },
            ].map((c) => {
              const p = prog(f, T(c.at) + 2, T(c.at) + 12, eBack);
              const out = prog(f, exitOf("match"), exitOf("match") + 7, eIn);
              return (
                <div key={c.text} style={{ position: "absolute", top: c.y, width: "100%", display: "flex", justifyContent: "center", opacity: Math.min(1, p * 2) * (1 - out), transform: `scale(${lerp(0.4, 1, p)}) translateX(${-out * 200}px)` }}>
                  <Pill
                    text={c.text}
                    size={46}
                    icon={
                      <div style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,#ff6ad5,#a63cff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={34} />
                      </div>
                    }
                  />
                </div>
              );
            })}
            {(() => {
              const p = prog(f, T(W.si), T(W.si) + 14, eOut);
              const out = prog(f, exitOf("match"), exitOf("match") + 7, eIn);
              return (
                <div
                  style={{
                    position: "absolute",
                    left: 540 - 210,
                    top: 1300,
                    opacity: p * (1 - out) * (0.35 + 0.65 * silHeat),
                    transform: `scale(${1 + silHeat * 0.06 + kick * 0.02})`,
                    filter: `drop-shadow(0 0 ${20 + 60 * silHeat}px rgba(255,120,240,${0.4 + 0.5 * silHeat}))`,
                  }}
                >
                  <Silhouette size={420} />
                </div>
              );
            })()}
          </>
        ) : null}

        {/* ===== 6. DM ===== */}
        {inScene(f, "dm", 2, 10) ? <Dm f={f} kick={kick} /> : null}

        {/* ===== 7. Finale ===== */}
        {f >= T(SC.finale[0]) - 1 ? (
          <>
            <Logo f={f} at={T(W.lapp) - 4} width={680} cx={540} cy={380} kick={kick} />
            <KText
              f={f}
              top={600}
              lines={[
                { anim: "rise", size: 80, tokens: [{ t: "L'app", at: W.lapp, look: "muted" }, { t: "est", at: W.est, look: "muted" }] },
                { anim: "slam", size: 150, tokens: [{ t: "disponible", at: W.disponible, look: "hot" }] },
                {
                  anim: "slam",
                  size: 100,
                  tokens: [
                    { t: "sur", at: W.sur2, look: "outline" },
                    { t: "iOS", at: W.ios, keepCase: true },
                    { t: "&", at: W.et3, look: "outline" },
                    { t: "Android", at: W.android, look: "hot", keepCase: true },
                  ],
                },
              ]}
            />
            {[
              { kind: "apple" as const, at: W.ios, x: 70 },
              { kind: "google" as const, at: W.android, x: 570 },
            ].map((b) => {
              const p = prog(f, T(b.at) - 1, T(b.at) + 11, eBack);
              return (
                <div key={b.kind} style={{ position: "absolute", left: b.x, top: 1130, opacity: Math.min(1, p * 2), transform: `scale(${lerp(0.8, 1, p) * (0.98 + 0.02 * kick)}) translateY(${(1 - p) * 120}px)` }}>
                  <StoreBadge kind={b.kind} />
                </div>
              );
            })}
            {["nelson", "oceane", "purple", "lina"].map((n, i) => {
              const st = T(W.gEnd) - 6 + i * 3;
              const p = prog(f, st, st + 12, eBack);
              return (
                <div key={n} style={{ position: "absolute", left: 540 + (i - 1.5) * 190 - 70, top: 1460, transform: `scale(${p}) translateY(${4 * Math.sin(f / 8 + i)}px)`, opacity: Math.min(1, p * 2) }}>
                  <Avatar name={n} size={140} ring={0.6 + kick} />
                </div>
              );
            })}
            {(() => {
              const p = prog(f, T(W.gEnd) + 6, T(W.gEnd) + 18);
              return (
                <div style={{ position: "absolute", top: 1660, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontStretch: "90%", fontSize: 34, letterSpacing: 8, color: V.lilac, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
                  LE RÉSEAU DES DANSEURS
                </div>
              );
            })()}
          </>
        ) : null}
      </AbsoluteFill>

      {speed > 0 ? (
        <AbsoluteFill style={{ opacity: speed }}>
          {Array.from({ length: 26 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: hash(i * 3.3 + Math.floor(f / 2)) * 1920,
                left: hash(i * 7.1 + f) * 400 - 200,
                width: 600 + hash(i * 1.9) * 900,
                height: 2 + hash(i * 5.5) * 5,
                background: "linear-gradient(90deg, transparent, rgba(240,200,255,0.8), transparent)",
              }}
            />
          ))}
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ backgroundColor: "#f6e8ff", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: "overlay" }}>
        <svg width="1080" height="1920">
          <filter id="csgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#csgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

/** Viseur caméra : REC, timecode, coins ; contenu "ViewZ × toi" puis les 3 formats. */
const Viewfinder: React.FC<{ f: number; kick: number }> = ({ f, kick }) => {
  const st = T(W.pour2) - 2;
  const p = prog(f, st, st + 12, eExpo);
  const out = prog(f, T(SC.formats[1]) - 3, T(SC.formats[1]) + 5, eIn);
  const X = 90;
  const Y = 820;
  const Wd = 900;
  const Hd = 980;
  const corner = (rot: number, x: number, y: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: 90, height: 90, borderTop: "7px solid #fff", borderLeft: "7px solid #fff", transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 0 10px rgba(220,120,255,0.9))" }} />
  );
  const secs = Math.max(0, f - st) / 30;
  const tc = `00:00:${String(Math.floor(secs)).padStart(2, "0")}:${String(Math.floor((secs % 1) * 30)).padStart(2, "0")}`;
  const blink = Math.floor(f / 10) % 2 === 0;
  const formats: { name: "video" | "mic" | "clap"; at: number; label: string }[] = [
    { name: "video", at: W.videos, label: "Vidéos" },
    { name: "mic", at: W.interviews, label: "Interviews" },
    { name: "clap", at: W.coulisses, label: "Coulisses" },
  ];
  const fi = formats.reduce((acc, x, i) => (f >= T(x.at) - 2 ? i : acc), -1);
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        top: Y,
        width: Wd,
        height: Hd,
        opacity: p * (1 - out),
        transform: `scale(${lerp(1.3, 1, p) * (1 + kick * 0.01)})`,
        filter: out > 0 ? `blur(${out * 14}px)` : undefined,
      }}
    >
      {corner(0, 0, 0)}
      {corner(90, Wd - 90, 0)}
      {corner(270, 0, Hd - 90)}
      {corner(180, Wd - 90, Hd - 90)}
      <div style={{ position: "absolute", left: 50, top: 40, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#fff", letterSpacing: 3 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#ff2d6f", opacity: blink ? 1 : 0.25, boxShadow: "0 0 18px #ff2d6f" }} />
        REC
      </div>
      <div style={{ position: "absolute", right: 50, top: 44, fontFamily: "JetBrains Mono, monospace", fontSize: 30, color: V.lilac }}>{tc}</div>
      <div style={{ position: "absolute", left: 50, bottom: 40, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: V.muted, letterSpacing: 3 }}>4K · 30FPS</div>
      {/* croix centrale */}
      <div style={{ position: "absolute", left: Wd / 2 - 20, top: Hd / 2, width: 40, height: 2, background: "rgba(255,255,255,0.35)" }} />
      <div style={{ position: "absolute", left: Wd / 2, top: Hd / 2 - 20, width: 2, height: 40, background: "rgba(255,255,255,0.35)" }} />

      {/* "ViewZ × toi" */}
      {fi < 0
        ? (() => {
            const q = prog(f, T(W.avec) - 2, T(W.avec) + 10, eBack);
            return (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 30, opacity: q, transform: `scale(${lerp(0.6, 1, q)})` }}>
                <Img src={staticFile("viewz/logo.png")} style={{ width: 360, filter: "drop-shadow(0 0 20px rgba(200,90,255,0.9))" }} />
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 90, color: V.lilac }}>×</span>
                <div style={{ width: 170, height: 170, borderRadius: "50%", background: "radial-gradient(circle, #3a0a6b, #12001f)", border: "4px dashed rgba(230,150,255,0.8)", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                  <Silhouette size={150} />
                </div>
              </div>
            );
          })()
        : null}

      {/* formats */}
      {formats.map((x, i) => {
        if (i !== fi) return null;
        const q = prog(f, T(x.at) - 2, T(x.at) + 8, eExpo);
        const g = Math.max(0, 1 - (f - T(x.at) + 2) / 6);
        return (
          <div key={x.name} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, opacity: q, transform: `scale(${lerp(1.8, 1, q)}) translateX(${g * 30 * (hash(f) - 0.5)}px)` }}>
            <Glass w={380} h={380} radius={90} glow={0.8}>
              <FormatIcon name={x.name} size={220} />
            </Glass>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 64, color: "#fff", letterSpacing: 2, textTransform: "uppercase" }}>{x.label}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Défilement des styles (façon machine à sous) + danseur associé. */
const Styles: React.FC<{ f: number; kick: number; styleIdx: number }> = ({ f, kick, styleIdx }) => {
  const exit = prog(f, exitOf("styles"), exitOf("styles") + 7, eIn);
  // position animée dans la liste
  let k = -1;
  STYLES.forEach((s) => {
    k += prog(f, T(s.at) - 3, T(s.at) + 5, eOut);
  });
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateX(${-exit * 260}px) skewX(${exit * 18}deg)`, filter: exit > 0 ? `blur(${exit * 14}px)` : undefined }}>
      <KText
        f={f}
        top={150}
        lines={[
          { anim: "rise", size: 76, tokens: [{ t: "Peu", at: W.peu, look: "muted" }, { t: "importe", at: W.importe, look: "muted" }] },
          { anim: "slam", size: 140, tokens: [{ t: "ton", at: W.ton, look: "outline" }, { t: "style", at: W.style, look: "hot" }] },
        ]}
      />
      {/* liste */}
      {STYLES.map((s, j) => {
        const d = j - k;
        if (d > 0.95 || d < -3.2) return null;
        const vis = d > 0 ? 1 - d : 1;
        const size = Math.min(170, 860 / (s.t.length * 0.56));
        const y = 860 + d * 150;
        const sc = d < 0 ? Math.max(0.35, 1 + d * 0.3) : 1;
        const op = d < 0 ? Math.max(0, 1 + d * 0.35) : vis;
        const isCur = j === styleIdx;
        const since = f - (T(s.at) - 2);
        const split = isCur && since >= 0 ? 16 * Math.exp(-since / 5) : 0;
        return (
          <div
            key={s.t}
            style={{
              position: "absolute",
              top: y - size / 2,
              width: "100%",
              textAlign: "center",
              opacity: op,
              transform: `scale(${sc})`,
              filter: d > 0 ? `blur(${d * 14}px)` : !isCur ? "blur(1.5px)" : "drop-shadow(0 0 24px rgba(180,60,255,0.6))",
            }}
          >
            <span
              style={{
                position: "relative",
                display: "inline-block",
                fontFamily: FONT,
                fontStyle: "italic",
                fontWeight: 900,
                fontStretch: "76%",
                fontSize: size,
                lineHeight: 1,
                textTransform: "uppercase",
                paddingRight: 12,
              }}
            >
              {split > 0.3 ? (
                <>
                  <span style={{ position: "absolute", left: -split, color: "rgba(255,40,220,0.75)", mixBlendMode: "screen" }}>{s.t}</span>
                  <span style={{ position: "absolute", left: split, color: "rgba(80,200,255,0.6)", mixBlendMode: "screen" }}>{s.t}</span>
                </>
              ) : null}
              <span style={{ position: "relative", ...(isCur ? hotText : { color: "transparent", WebkitTextStroke: `3px ${V.lilac}` }) }}>{s.t}</span>
            </span>
          </div>
        );
      })}
      {/* danseur associé */}
      {STYLES.map((s, j) => {
        if (j !== styleIdx) return null;
        const p = prog(f, T(s.at) - 2, T(s.at) + 9, eBack);
        return (
          <div key={s.t} style={{ position: "absolute", top: 1250, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, p * 2), transform: `scale(${lerp(0.4, 1, p) * (1 + kick * 0.02)}) rotate(${(1 - p) * 12}deg)` }}>
            {s.av ? (
              <Avatar name={s.av} size={300} ring={0.8 + kick} live={((f - T(s.at)) % 24) / 24} />
            ) : (
              <div style={{ width: 300, height: 300, borderRadius: "50%", border: "5px dashed rgba(230,150,255,0.85)", background: "radial-gradient(circle, #3a0a6b, #12001f)", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-end", transform: `rotate(${f}deg)` }}>
                <div style={{ transform: `rotate(${-f}deg)` }}>
                  <Silhouette size={270} />
                </div>
              </div>
            )}
            <div style={{ marginTop: 24 }}>
              <Pill text={`${s.name} · ${s.t === "ou autre" ? "House" : s.t}`} size={36} hot={!s.av} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** "Écris-nous en DM" : téléphone sur Messages + bulle qui s'écrit. */
const Dm: React.FC<{ f: number; kick: number }> = ({ f, kick }) => {
  const st = T(SC.dm[0]);
  const p = prog(f, st - 2, st + 12, eBack);
  const out = prog(f, T(SC.dm[1]) - 2, T(SC.dm[1]) + 8, eIn);
  const msg = "Je suis chaud pour le projet !";
  const n = Math.round(interpolate(f, [T(W.ecris) + 4, T(W.dm) + 6], [0, msg.length], clamp));
  const typing = n === 0;
  const sent = f >= T(W.dm) + 8;
  const plane = prog(f, T(W.dm) + 8, T(W.fEnd) + 10, eIn);
  return (
    <>
      <KText
        f={f}
        top={170}
        exitAt={T(SC.dm[1]) - 2}
        lines={[
          { anim: "slam", size: 140, gap: 0, tokens: [{ t: "écris-", at: W.ecris }, { t: "nous", at: W.nous2, look: "hot" }] },
          { anim: "slam", size: 250, tokens: [{ t: "en", at: W.en, look: "outline" }, { t: "DM", at: W.dm, look: "hot" }] },
        ]}
      />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div
          style={{
            position: "absolute",
            left: 540 - PW / 2,
            top: lerp(2300, 1450, p) - PH / 2 - out * 1600,
            transform: `rotateX(${lerp(35, 10, p)}deg) rotateY(${-12 + 3 * Math.sin(f / 20)}deg) rotateZ(${-3 + out * 10}deg) scale(0.82)`,
          }}
        >
          <Phone screen="messages" swap={1} glare={-0.5} glow={kick * 0.5} />
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 1080,
          opacity: prog(f, T(W.ecris), T(W.ecris) + 6) * (1 - out),
          transform: `scale(${lerp(0.5, 1, prog(f, T(W.ecris), T(W.ecris) + 8, eBack))}) translateY(${-out * 300}px)`,
          transformOrigin: "100% 100%",
        }}
      >
        <div
          style={{
            padding: "28px 38px",
            borderRadius: 44,
            borderBottomRightRadius: 8,
            background: sent ? "linear-gradient(135deg, #c13cff, #7a12d6)" : "rgba(45,12,80,0.9)",
            border: "2px solid rgba(220,160,255,0.55)",
            boxShadow: `0 0 ${40 + kick * 30}px rgba(170,60,255,0.6), 0 20px 50px rgba(0,0,0,0.5)`,
            color: "#fff",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 44,
            minWidth: 160,
            minHeight: 56,
            whiteSpace: "nowrap",
          }}
        >
          {typing ? (
            <div style={{ display: "flex", gap: 12, alignItems: "center", height: 56 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", opacity: 0.4 + 0.6 * Math.max(0, Math.sin(f / 3 - i)) }} />
              ))}
            </div>
          ) : (
            msg.slice(0, n)
          )}
        </div>
      </div>
      {plane > 0 && plane < 1 ? (
        <div style={{ position: "absolute", left: lerp(820, 1300, plane) - 70, top: lerp(1000, 300, plane) - 70, filter: "drop-shadow(0 0 20px #d070ff)" }}>
          <PlaneIcon size={140} />
        </div>
      ) : null}
    </>
  );
};
