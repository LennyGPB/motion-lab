import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Avatar, StoreBadge } from "../viewz/Bits";
import { FONT, hotText, loadViewzFonts, V } from "../viewz/theme";
import { Heat, Thermal } from "../viewz/Thermal";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { IconChip, PIcon, QR } from "./Icons";
import { Sound } from "./Sound";
import { kickPulse, SC, SECTION_NUM, T, W } from "./timing";
import { appear, Label, MX, Panel, PText } from "./ui";

loadViewzFonts();

const CW = 1080 - MX * 2; // largeur de contenu
const LOGO_RATIO = 439 / 1536;
type Key = keyof typeof SC;
const inSec = (f: number, k: Key, post = 10) => f >= T(SC[k][0]) - 2 && f < T(SC[k][1]) + post;
const exitOf = (k: Key) => T(SC[k][1]) - 4;

/** Sortie de section : fondu + léger glissement vers le haut. */
const SecWrap: React.FC<{ f: number; k: Key; children: React.ReactNode }> = ({ f, k, children }) => {
  const out = prog(f, exitOf(k), exitOf(k) + 10, eIn);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${-out * 50}px)`, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>{children}</AbsoluteFill>
  );
};

/** Motion "ViewZ — Partenariat organisateurs d'événements" (version pro). */
export const B2B: React.FC = () => {
  const f = useCurrentFrame();
  const kick = kickPulse(f);

  const heats: Heat[] = [];
  if (inSec(f, "intro")) heats.push({ x: 540, y: 820, r: 420, a: 0.2 + 0.5 * Math.exp(-Math.max(0, f - T(W.viewz)) / 15) });
  if (inSec(f, "appel")) heats.push({ x: 540, y: 1330, r: 380, a: 0.22 });
  if (inSec(f, "apport")) heats.push({ x: 540, y: 1100, r: 420, a: 0.2 });
  if (inSec(f, "echange")) heats.push({ x: 540, y: 1250, r: 300, ry: 1.4, a: 0.28 * prog(f, T(W.exclusivite), T(W.exclusivite) + 12) });
  if (f >= T(SC.end[0])) heats.push({ x: 540, y: 720, r: 420, a: 0.22 + 0.4 * Math.exp(-Math.max(0, f - T(W.viewz4)) / 15) });

  return (
    <AbsoluteFill style={{ backgroundColor: V.black, overflow: "hidden" }}>
      <Thermal intensity={0.72 + 0.05 * kick} heats={heats} vibrate={2.5 + 1.5 * kick} />
      {/* voile + grille fine */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,0,8,0.78) 0%, rgba(4,0,8,0.5) 40%, rgba(4,0,8,0.45) 70%, rgba(4,0,8,0.75) 100%)" }} />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(210,170,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(210,170,255,0.045) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          backgroundPosition: "60px 0px",
        }}
      />

      {inSec(f, "intro") ? <Intro f={f} kick={kick} /> : null}
      {inSec(f, "appel") ? <Appel f={f} /> : null}
      {inSec(f, "formats") ? <Formats f={f} /> : null}
      {inSec(f, "apport") ? <Apport f={f} kick={kick} /> : null}
      {inSec(f, "echange") ? <Echange f={f} /> : null}
      {inSec(f, "contact") ? <Contact f={f} /> : null}
      {f >= T(SC.end[0]) - 2 ? <EndCard f={f} kick={kick} /> : null}

      <Hud f={f} />
      <AbsoluteFill style={{ opacity: 0.06, mixBlendMode: "overlay" }}>
        <svg width="1080" height="1920">
          <filter id="b2bgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#b2bgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

/** Bandeau permanent : logo, intitulé, numéro de section, progression. */
const Hud: React.FC<{ f: number }> = ({ f }) => {
  const p = prog(f, T(SC.appel[0]), T(SC.appel[0]) + 14);
  const endFade = prog(f, T(SC.end[0]), T(SC.end[0]) + 10);
  const vis = p * (1 - endFade);
  if (vis <= 0) return null;
  const keys = Object.keys(SECTION_NUM) as Key[];
  const cur = keys.reduce<Key | null>((acc, k) => (f >= T(SC[k][0]) ? k : acc), null);
  const info = cur ? SECTION_NUM[cur] : undefined;
  const prg = interpolate(f, [T(SC.appel[0]), T(SC.end[0])], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <div style={{ position: "absolute", top: 76, left: MX, right: MX, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Img src={staticFile("viewz/logo.png")} style={{ height: 38 }} />
          <div style={{ width: 1.5, height: 30, background: "rgba(210,170,255,0.4)" }} />
          <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: V.lilac, letterSpacing: "0.22em" }}>PARTENARIATS</span>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: "#fff", letterSpacing: 2 }}>
          {info?.n ?? "00"}
          <span style={{ color: V.muted, fontWeight: 400 }}> / 05</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 138, left: MX, right: MX, height: 2, background: "rgba(210,170,255,0.15)" }}>
        <div style={{ width: `${prg * 100}%`, height: "100%", background: `linear-gradient(90deg, ${V.electric}, ${V.pink})`, boxShadow: "0 0 12px rgba(220,90,255,0.8)" }} />
      </div>
      <div style={{ position: "absolute", bottom: 70, left: MX, right: MX, display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 20, fontWeight: 600, letterSpacing: "0.24em", color: "rgba(200,180,230,0.55)" }}>
        <span>PROPOSITION DE PARTENARIAT</span>
        <span>PARIS</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Intro ---------------- */
const Intro: React.FC<{ f: number; kick: number }> = ({ f }) => {
  const at = T(W.viewz);
  const p = prog(f, at, at + 14, eExpo);
  const sweep = prog(f, at + 6, at + 30, eInOut);
  const since = f - at;
  const split = since >= 0 ? 12 * Math.exp(-since / 4) : 0;
  const w = 720;
  const h = w * LOGO_RATIO;
  const mask: React.CSSProperties = { WebkitMaskImage: `url(${staticFile("viewz/logo.png")})`, WebkitMaskSize: "100% 100%", position: "absolute", inset: 0 };
  return (
    <SecWrap f={f} k="intro">
      <div style={{ position: "absolute", left: 540 - w / 2, top: 760 - h / 2, width: w, height: h, opacity: p, transform: `scale(${lerp(1.25, 1, p)})`, filter: p < 1 ? `blur(${(1 - p) * 14}px)` : "drop-shadow(0 0 26px rgba(200,90,255,0.7))" }}>
        {split > 0.5 ? (
          <>
            <div style={{ ...mask, background: "rgba(255,40,220,0.7)", transform: `translateX(${-split}px)` }} />
            <div style={{ ...mask, background: "rgba(80,200,255,0.55)", transform: `translateX(${split}px)` }} />
          </>
        ) : null}
        <Img src={staticFile("viewz/logo.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        {/* reflet qui balaie le logo */}
        <div style={{ ...mask, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 160, left: lerp(-200, w + 40, sweep), background: "linear-gradient(90deg, transparent, rgba(255,220,255,0.9), transparent)", transform: "skewX(-20deg)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 760 + h / 2 + 60, left: 540 - 60 * prog(f, at + 10, at + 26), width: 120 * prog(f, at + 10, at + 26), height: 2, background: `linear-gradient(90deg, ${V.electric}, ${V.pink})` }} />
      <PText
        f={f}
        top={1000}
        align="center"
        lines={[
          { size: 62, tokens: [{ t: "Le", at: W.le }, { t: "premier", at: W.premier, kind: "accent" }, { t: "réseau social", at: W.reseau, kind: "bold" }] },
          { size: 62, tokens: [{ t: "pour", at: W.pour }, { t: "les", at: W.les }, { t: "danseurs.", at: W.danseurs }] },
        ]}
      />
    </SecWrap>
  );
};

/* ---------------- 01 Appel ---------------- */
const EVENT_PINS = [
  [300, 820], [560, 900], [700, 1150], [430, 1060], [250, 1250], [620, 1330], [480, 1450],
];
const Appel: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.appel[0]);
  const card = prog(f, T(W.organisateurs), T(W.organisateurs) + 16, eOut);
  const cardH = 700;
  const cardTop = 1060;
  const zoom = lerp(1.0, 1.08, prog(f, st, T(SC.appel[1]), eInOut));
  return (
    <SecWrap f={f} k="appel">
      <Label f={f} at={st} n="01" text="Appel à partenaires" top={230} />
      <PText
        f={f}
        top={300}
        lines={[
          { size: 66, tokens: [{ t: "On", at: W.on }, { t: "recherche", at: W.recherche }, { t: "des", at: W.des }] },
          { size: 96, tokens: [{ t: "organisateurs", at: W.organisateurs, kind: "bold" }] },
          { size: 96, tokens: [{ t: "d'événements", at: W.evenements, kind: "bold" }, { t: "danse", at: W.danse, kind: "bold" }] },
          { size: 66, tokens: [{ t: "sur", at: W.sur }, { t: "Paris,", at: W.paris, kind: "bold" }, { t: "pour", at: W.pour2 }, { t: "devenir", at: W.devenir }] },
          { size: 140, tokens: [{ t: "partenaires.", at: W.partenaires, kind: "accent" }] },
        ]}
      />
      <div style={{ position: "absolute", left: MX, top: cardTop + (1 - card) * 60, opacity: card }}>
        <Panel w={CW} h={cardH} pad={0}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <Img
              src={staticFile("viewz/screens/map.jpg")}
              style={{ position: "absolute", left: (CW - 921 * 1.0) / 2, top: -(1100 - cardH / 2), width: 921, transform: `scale(${zoom})`, transformOrigin: `50% ${1100}px`, filter: "saturate(0.6) brightness(0.8)" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(40,0,80,0.35), rgba(10,0,20,0.55))", mixBlendMode: "multiply" }} />
          </div>
          {EVENT_PINS.map(([x, y], i) => {
            const a = T(W.evenements) + i * 3;
            const p = prog(f, a, a + 10, eBack);
            if (p <= 0) return null;
            const ring = ((f - a) % 36) / 36;
            const px = (CW - 921) / 2 + x;
            const py = y - (1100 - cardH / 2);
            return (
              <div key={i} style={{ position: "absolute", left: px - 22, top: py - 22, width: 44, height: 44 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid rgba(240,150,255,${1 - ring})`, transform: `scale(${1 + ring * 2.2})` }} />
                <div style={{ position: "absolute", inset: 8, borderRadius: "50%", background: "linear-gradient(135deg,#ff6ad5,#a63cff)", boxShadow: "0 0 18px rgba(230,90,255,0.9)", transform: `scale(${p})` }} />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 30, top: 28, display: "flex", gap: 14 }}>
            <Tag text="Paris" on={prog(f, T(W.paris), T(W.paris) + 8)} hot />
            <Tag text="Événements danse" on={prog(f, T(W.evenements), T(W.evenements) + 8)} />
          </div>
        </Panel>
      </div>
    </SecWrap>
  );
};

const Tag: React.FC<{ text: string; on: number; hot?: boolean }> = ({ text, on, hot }) => (
  <div
    style={{
      opacity: on,
      transform: `translateY(${(1 - on) * 10}px)`,
      padding: "10px 22px",
      borderRadius: 999,
      background: hot ? "linear-gradient(135deg,#c13cff,#7a12d6)" : "rgba(12,3,22,0.8)",
      border: "1.5px solid rgba(220,170,255,0.45)",
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 26,
      color: "#fff",
      letterSpacing: 0.5,
    }}
  >
    {text}
  </div>
);

/* ---------------- 02 Formats ---------------- */
const FORMATS = [
  { icon: "battle", t: "Battles", d: "Compétition", at: W.battles },
  { icon: "showcase", t: "Showcases", d: "Scène & spectacle", at: W.showcases },
  { icon: "cours", t: "Cours", d: "Workshops & stages", at: W.cours },
  { icon: "session", t: "Sessions libres", d: "Pratique ouverte", at: W.sessions },
];
const Formats: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.formats[0]);
  const tw = (CW - 36) / 2;
  return (
    <SecWrap f={f} k="formats">
      <Label f={f} at={st} n="02" text="Formats d'événements" top={230} />
      <PText f={f} top={300} lines={[{ size: 66, tokens: [{ t: "Tous", at: W.battles - 0.15 }, { t: "les", at: W.battles - 0.1 }, { t: "formats", at: W.battles - 0.05, kind: "bold" }] }]} />
      {FORMATS.map((x, i) => {
        const p = prog(f, T(x.at) - 2, T(x.at) + 12, eOut);
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div key={x.t} style={{ position: "absolute", left: MX + col * (tw + 36), top: 430 + row * 330 + (1 - p) * 40, opacity: p }}>
            <Panel w={tw} h={300} hot={false}>
              <IconChip name={x.icon} size={86} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: "#fff", marginTop: 34, letterSpacing: -1, whiteSpace: "nowrap" }}>{x.t}</div>
              <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 28, color: V.muted, marginTop: 6 }}>{x.d}</div>
              <div style={{ position: "absolute", top: 36, right: 36, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: "rgba(210,170,255,0.5)", letterSpacing: 2 }}>0{i + 1}</div>
            </Panel>
          </div>
        );
      })}
      {/* tarification */}
      <div style={{ position: "absolute", left: MX, top: 1150, opacity: appear(f, T(W.gratuit) - 4) }}>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, letterSpacing: "0.28em", color: V.lilac }}>TARIFICATION</div>
      </div>
      {[
        { t: "Gratuit", d: "De préférence", at: W.gratuit, hot: true, x: 0 },
        { t: "Payant", d: "Ouverts à tout", at: W.ouverts, hot: false, x: 1 },
      ].map((o) => {
        const p = prog(f, T(o.at) - 2, T(o.at) + 12, eBack);
        const on = o.hot ? 1 : prog(f, T(o.at) + 4, T(o.at) + 12);
        return (
          <div key={o.t} style={{ position: "absolute", left: MX + o.x * (tw + 36), top: 1210, opacity: Math.min(1, p * 2), transform: `scale(${lerp(0.9, 1, p)})` }}>
            <Panel w={tw} h={220} hot={o.hot}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: "#fff" }}>{o.t}</div>
                <div style={{ width: 54, height: 54, borderRadius: "50%", background: on > 0.5 ? "linear-gradient(135deg,#ff6ad5,#a63cff)" : "transparent", border: "2px solid rgba(230,170,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + 0.2 * on})` }}>
                  {on > 0.5 ? <PIcon name="check" size={32} stroke={3} /> : null}
                </div>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 30, color: o.hot ? V.lilac : V.muted, marginTop: 18 }}>{o.d}</div>
            </Panel>
          </div>
        );
      })}
      <PText
        f={f}
        top={1490}
        lines={[
          {
            size: 50,
            tokens: [
              { t: "Gratuit", at: W.gratuit, kind: "bold" },
              { t: "de préférence,", at: W.de },
              { t: "mais", at: W.mais, kind: "muted" },
              { t: "ouverts", at: W.ouverts, kind: "accent" },
              { t: "à tout.", at: W.a, kind: "accent" },
            ],
          },
        ]}
      />
    </SecWrap>
  );
};

/* ---------------- 03 Ce qu'on apporte ---------------- */
const REGS = [
  { av: "nelson", n: "Nelson Ari", s: "Hip-Hop" },
  { av: "oceane", n: "Océane S", s: "Afro" },
  { av: "purple", n: "Monsieur Purple", s: "Krump" },
  { av: "lina", n: "Lina Morel", s: "House" },
];
const FEATURES = [
  { icon: "seats", t: "Gestion des places", at: W.gestion },
  { icon: "user", t: "Inscriptions", at: W.inscriptions },
  { icon: "qr", t: "QR codes", at: W.qr },
  { icon: "eye", t: "Visibilité", at: W.visibilite },
];
const Apport: React.FC<{ f: number; kick: number }> = ({ f, kick }) => {
  const st = T(SC.apport[0]);
  const dashIn = prog(f, T(W.gestion) - 6, T(W.gestion) + 10, eOut);
  const dashOut = prog(f, T(W.et2) - 4, T(W.et2) + 10, eIn);
  const visIn = prog(f, T(W.visibilite) - 4, T(W.visibilite) + 14, eOut);
  const fill = prog(f, T(W.places), T(W.places) + 40, eInOut);
  const via = prog(f, T(W.via), T(W.via) + 10);
  return (
    <SecWrap f={f} k="apport">
      <Label f={f} at={st} n="03" text="Ce qu'on apporte" top={230} />
      <PText f={f} top={300} lines={[{ size: 66, tokens: [{ t: "Ce", at: W.ce }, { t: "qu'on", at: W.quon }, { t: "apporte.", at: W.apporte, kind: "accent" }] }]} />

      {/* Tableau de bord événement */}
      {dashOut < 1 ? (
        <div style={{ position: "absolute", left: MX, top: 430 + (1 - dashIn) * 60, opacity: dashIn * (1 - dashOut), transform: `translateX(${-dashOut * 120}px)` }}>
          <Panel w={CW} h={830} pad={40}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, letterSpacing: "0.24em", color: V.muted }}>ÉVÉNEMENT</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: "#fff", marginTop: 6 }}>Open Battle · Paris</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 999, border: `1.5px solid rgba(230,170,255,${0.3 + 0.6 * via})`, background: `rgba(170,60,255,${0.1 + 0.35 * via})`, boxShadow: `0 0 ${30 * via}px rgba(200,90,255,0.7)` }}>
                <Img src={staticFile("viewz/logo.png")} style={{ height: 24 }} />
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: "#fff" }}>Géré via ViewZ</span>
              </div>
            </div>
            <div style={{ position: "absolute", right: 40, top: 128, fontFamily: FONT, fontWeight: 700, fontSize: 18, letterSpacing: "0.2em", color: "rgba(210,170,255,0.45)" }}>APERÇU</div>
            {/* jauge des places */}
            <div style={{ marginTop: 50, opacity: appear(f, T(W.gestion)) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: FONT }}>
                <span style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 700, fontSize: 32, color: "#fff" }}>
                  <PIcon name="seats" size={34} /> Places
                </span>
                <span style={{ fontWeight: 800, fontSize: 40, color: "#fff" }}>
                  {Math.round(lerp(0, 148, fill))}
                  <span style={{ color: V.muted, fontWeight: 400 }}> / 200</span>
                </span>
              </div>
              <div style={{ marginTop: 16, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.08)" }}>
                <div style={{ width: `${fill * 74}%`, height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${V.violet}, ${V.pink})`, boxShadow: "0 0 16px rgba(230,90,255,0.7)" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 36, marginTop: 50 }}>
              {/* inscriptions */}
              <div style={{ flex: 1, opacity: appear(f, T(W.inscriptions) - 2) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: "#fff", marginBottom: 20 }}>
                  <PIcon name="user" size={34} /> Inscriptions
                </div>
                {REGS.map((r, i) => {
                  const a = T(W.inscriptions) + 2 + i * 5;
                  const p = prog(f, a, a + 10, eOut);
                  const ok = prog(f, a + 8, a + 14, eBack);
                  return (
                    <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 0", borderTop: i ? "1px solid rgba(210,170,255,0.12)" : undefined, opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
                      <Avatar name={r.av} size={64} ring={0.2} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: "#fff" }}>{r.n}</div>
                        <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 22, color: V.muted }}>{r.s}</div>
                      </div>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#ff6ad5,#a63cff)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ok})` }}>
                        <PIcon name="check" size={24} stroke={3} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* billet QR */}
              {(() => {
                const p = prog(f, T(W.qr) - 2, T(W.qr) + 14, eBack);
                const qr = prog(f, T(W.qr) + 2, T(W.codes) + 6, eOut);
                const scan = prog(f, T(W.codes) + 4, T(W.directement) + 2, eInOut);
                const valid = prog(f, T(W.directement), T(W.directement) + 8, eBack);
                return (
                  <div style={{ width: 330, opacity: Math.min(1, p * 2), transform: `scale(${lerp(0.85, 1, p)}) rotate(${(1 - p) * 6}deg)` }}>
                    <div style={{ borderRadius: 26, background: "#f7f0ff", padding: 26, position: "relative", boxShadow: "0 0 50px rgba(190,80,255,0.45)" }}>
                      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: "#6a12d0" }}>BILLET</div>
                      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#120020", marginTop: 4 }}>Open Battle</div>
                      <div style={{ marginTop: 18, position: "relative" }}>
                        <QR size={278} reveal={qr} />
                        {scan > 0 && scan < 1 ? (
                          <div style={{ position: "absolute", left: -6, right: -6, top: `${scan * 100}%`, height: 4, background: "#c13cff", boxShadow: "0 0 16px 4px rgba(193,60,255,0.7)" }} />
                        ) : null}
                      </div>
                      <div style={{ borderTop: "2px dashed rgba(106,18,208,0.3)", marginTop: 20, paddingTop: 16, display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: "#6a12d0" }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#ff6ad5,#a63cff)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${valid})` }}>
                          <PIcon name="check" size={20} stroke={3} />
                        </div>
                        <span style={{ opacity: valid }}>Billet validé</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </Panel>
        </div>
      ) : null}

      {/* Visibilité : la communauté */}
      {visIn > 0 ? <Community f={f} p={visIn} kick={kick} /> : null}

      {/* récapitulatif des apports */}
      <div style={{ position: "absolute", left: MX, top: 1330, width: CW, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {FEATURES.map((x) => {
          const p = prog(f, T(x.at) - 2, T(x.at) + 10, eOut);
          return (
            <div
              key={x.t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "18px 22px",
                borderRadius: 22,
                background: `rgba(${p > 0.5 ? "170,60,255,0.16" : "255,255,255,0.03"})`,
                border: `1.5px solid rgba(220,170,255,${0.12 + 0.4 * p})`,
                opacity: 0.35 + 0.65 * p,
              }}
            >
              <IconChip name={x.icon} size={58} hot={p > 0.5} />
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#fff" }}>{x.t}</span>
            </div>
          );
        })}
      </div>
    </SecWrap>
  );
};

const DOTS = Array.from({ length: 140 }, (_, i) => ({ a: hash(i) * Math.PI * 2, r: 0.25 + hash(i + 7) * 0.75, s: 3 + hash(i * 3) * 5, d: hash(i * 9) }));
const Community: React.FC<{ f: number; p: number; kick: number }> = ({ f, p, kick }) => {
  const cx = 540;
  const cy = 840;
  const R = 390;
  const grow = prog(f, T(W.toute), T(W.communaute) + 20, eOut);
  return (
    <AbsoluteFill style={{ opacity: p }}>
      {[0, 1, 2].map((k) => {
        const q = ((f / 45 + k / 3) % 1);
        return <div key={k} style={{ position: "absolute", left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: "50%", border: `1.5px solid rgba(220,150,255,${0.5 * (1 - q)})`, transform: `scale(${0.2 + q * 0.8})` }} />;
      })}
      {DOTS.map((d, i) => {
        if (d.d > 0.25 + grow * 0.75) return null;
        const rr = R * d.r * lerp(0.4, 1, grow);
        return <div key={i} style={{ position: "absolute", left: cx + Math.cos(d.a + f * 0.004) * rr - d.s / 2, top: cy + Math.sin(d.a + f * 0.004) * rr - d.s / 2, width: d.s, height: d.s, borderRadius: "50%", background: "rgba(240,190,255,0.85)", boxShadow: "0 0 8px rgba(220,100,255,0.9)" }} />;
      })}
      {REGS.map((r, i) => {
        const ang = (i / 4) * Math.PI * 2 + 0.6;
        const q = prog(f, T(W.visibilite) + i * 3, T(W.visibilite) + i * 3 + 12, eBack);
        return (
          <div key={r.av} style={{ position: "absolute", left: cx + Math.cos(ang) * 290 - 60, top: cy + Math.sin(ang) * 290 - 60, transform: `scale(${q})` }}>
            <Avatar name={r.av} size={120} ring={0.4 + kick * 0.5} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: cx - 110, top: cy - 110, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(190,70,255,0.5), rgba(20,4,36,0.9) 70%)", border: "1.5px solid rgba(230,170,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 60px rgba(190,70,255,0.5)" }}>
        <PIcon name="eye" size={100} />
      </div>
      <PText
        f={f}
        top={1235}
        align="center"
        lines={[
          {
            size: 44,
            tokens: [
              { t: "Visibilité", at: W.visibilite, kind: "bold" },
              { t: "auprès", at: W.aupres },
              { t: "de", at: W.de2 },
              { t: "toute la communauté", at: W.toute, kind: "accent" },
            ],
          },
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------------- 04 En échange ---------------- */
const Echange: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.echange[0]);
  const a = prog(f, T(W.en), T(W.en) + 14, eOut);
  const arrow = prog(f, T(W.on3), T(W.demande) + 10, eInOut);
  const b = prog(f, T(W.exclusivite) - 4, T(W.exclusivite) + 12, eBack);
  return (
    <SecWrap f={f} k="echange">
      <Label f={f} at={st} n="04" text="En échange" top={230} />
      <PText
        f={f}
        top={300}
        lines={[
          { size: 66, tokens: [{ t: "En", at: W.en }, { t: "échange,", at: W.echange }, { t: "on", at: W.on3 }, { t: "demande", at: W.demande }] },
          { size: 120, tokens: [{ t: "l'exclusivité", at: W.exclusivite, kind: "accent" }] },
          { size: 66, tokens: [{ t: "des", at: W.des3 }, { t: "inscriptions", at: W.inscriptions2, kind: "bold" }, { t: "via", at: W.via2 }, { t: "ViewZ.", at: W.viewz3, kind: "bold" }] },
        ]}
      />
      <div style={{ position: "absolute", left: MX, top: 700 + (1 - a) * 40, opacity: a }}>
        <Panel w={CW} h={360}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Img src={staticFile("viewz/logo.png")} style={{ height: 34 }} />
              <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, letterSpacing: "0.24em", color: V.lilac }}>APPORTE</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 34 }}>
            {FEATURES.map((x, i) => (
              <div key={x.t} style={{ display: "flex", alignItems: "center", gap: 16, opacity: appear(f, T(W.en) + 4 + i * 3) }}>
                <IconChip name={x.icon} size={60} hot={false} />
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: "#fff" }}>{x.t}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      {/* flèches d'échange */}
      <div style={{ position: "absolute", left: 540 - 50, top: 1085, width: 100, height: 100, opacity: arrow, transform: `rotate(${arrow * 180}deg)` }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(12,3,22,0.9)", border: "1.5px solid rgba(230,170,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(190,70,255,0.5)" }}>
          <PIcon name="swap" size={54} />
        </div>
      </div>
      <div style={{ position: "absolute", left: MX, top: 1210 + (1 - b) * 40, opacity: Math.min(1, b * 2), transform: `scale(${lerp(0.94, 1, b)})` }}>
        <Panel w={CW} h={330} hot>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, letterSpacing: "0.24em", color: V.lilac }}>VOUS ACCORDEZ</div>
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 34 }}>
            <IconChip name="lock" size={110} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 64, ...hotText, paddingRight: 8 }}>Exclusivité</div>
              <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 34, color: "#fff", marginTop: 4, opacity: appear(f, T(W.inscriptions2)) }}>des inscriptions via ViewZ</div>
            </div>
          </div>
        </Panel>
      </div>
    </SecWrap>
  );
};

/* ---------------- 05 Contact ---------------- */
const Contact: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.contact[0]);
  const plane = prog(f, T(W.dm), T(W.dm) + 18, eIn);
  return (
    <SecWrap f={f} k="contact">
      <Label f={f} at={st} n="05" text="Contact" top={230} />
      <PText
        f={f}
        top={420}
        lines={[
          { size: 120, gap: 0, tokens: [{ t: "Écrivez-", at: W.ecrivez, kind: "bold" }, { t: "nous", at: W.nous, kind: "bold" }] },
          { size: 120, tokens: [{ t: "en", at: W.en2 }, { t: "DM.", at: W.dm, kind: "accent" }] },
        ]}
      />
      <DmMock f={f} />
      <div style={{ position: "absolute", left: lerp(820, 1200, plane), top: lerp(330, 0, plane), opacity: appear(f, T(W.ecrivez), 8) * (1 - plane), filter: "drop-shadow(0 0 20px rgba(220,100,255,0.9))" }}>
        <PIcon name="plane" size={150} />
      </div>
    </SecWrap>
  );
};

/** Aperçu d'un DM en cours d'écriture. */
const DmMock: React.FC<{ f: number }> = ({ f }) => {
  const p = prog(f, T(W.ecrivez), T(W.ecrivez) + 12, eOut);
  const msg = "Bonjour ! On organise des battles à Paris, parlons partenariat.";
  const n = Math.round(interpolate(f, [T(W.ecrivez) + 4, T(W.dm) + 2], [0, msg.length], clamp));
  const sent = f >= T(W.dm) + 4;
  return (
    <div style={{ position: "absolute", left: MX, top: 820 + (1 - p) * 50, opacity: p }}>
      <Panel w={CW} h={560} pad={36}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, paddingBottom: 24, borderBottom: "1px solid rgba(210,170,255,0.15)" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg,#c13cff,#5a0fb0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Img src={staticFile("viewz/logo.png")} style={{ width: 52 }} />
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: "#fff" }}>ViewZ</div>
            <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 22, color: V.muted }}>Partenariats</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 40, opacity: sent ? 1 : 0, transform: `translateY(${sent ? 0 : 20}px)` }}>
          <div style={{ maxWidth: 640, padding: "22px 30px", borderRadius: 32, borderBottomRightRadius: 8, background: "linear-gradient(135deg,#c13cff,#7a12d6)", fontFamily: FONT, fontSize: 30, fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>{msg}</div>
        </div>
        <div style={{ position: "absolute", left: 36, right: 36, bottom: 36, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ flex: 1, minHeight: 74, padding: "18px 26px", borderRadius: 37, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(210,170,255,0.25)", fontFamily: FONT, fontSize: 28, color: sent || n === 0 ? V.muted : "#fff", boxSizing: "border-box", lineHeight: 1.3 }}>
            {sent || n === 0 ? "Message…" : msg.slice(0, n)}
            {!sent && n > 0 && Math.floor(f / 8) % 2 === 0 ? <span style={{ color: V.lilac }}>|</span> : null}
          </div>
          <div style={{ width: 74, height: 74, borderRadius: "50%", background: "linear-gradient(135deg,#c13cff,#7a12d6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <PIcon name="plane" size={36} />
          </div>
        </div>
      </Panel>
    </div>
  );
};

/* ---------------- Fin ---------------- */
const EndCard: React.FC<{ f: number; kick: number }> = ({ f, kick }) => {
  const at = T(W.viewz4) - 4;
  const p = prog(f, at, at + 16, eExpo);
  const sweep = prog(f, at + 10, at + 36, eInOut);
  const w = 620;
  const h = w * LOGO_RATIO;
  const mask: React.CSSProperties = { WebkitMaskImage: `url(${staticFile("viewz/logo.png")})`, WebkitMaskSize: "100% 100%", position: "absolute", inset: 0 };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - w / 2, top: 600 - h / 2, width: w, height: h, opacity: p, transform: `scale(${lerp(1.2, 1, p) * (1 + kick * 0.008)})`, filter: p < 1 ? `blur(${(1 - p) * 12}px)` : "drop-shadow(0 0 26px rgba(200,90,255,0.7))" }}>
        <Img src={staticFile("viewz/logo.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        <div style={{ ...mask, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 140, left: lerp(-200, w + 40, sweep), background: "linear-gradient(90deg, transparent, rgba(255,220,255,0.9), transparent)", transform: "skewX(-20deg)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 600 + h / 2 + 46, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 400, fontSize: 40, color: "rgba(255,255,255,0.85)", opacity: appear(f, at + 10, 14) }}>
        Le premier réseau social <span style={{ fontWeight: 800, color: "#fff" }}>pour les danseurs</span>
      </div>
      <PText
        f={f}
        top={1010}
        align="center"
        lines={[{ size: 44, tokens: [{ t: "Disponible", at: W.disponible, kind: "muted" }, { t: "sur", at: W.sur2, kind: "muted" }] }]}
      />
      {[
        { kind: "apple" as const, at: W.app, x: MX },
        { kind: "google" as const, at: W.google, x: 1080 - MX - 440 },
      ].map((b) => {
        const q = prog(f, T(b.at) - 2, T(b.at) + 12, eOut);
        return (
          <div key={b.kind} style={{ position: "absolute", left: b.x, top: 1100 + (1 - q) * 40, opacity: q }}>
            <StoreBadge kind={b.kind} />
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1420, left: MX, right: MX, height: 1.5, background: "rgba(210,170,255,0.2)", transform: `scaleX(${prog(f, T(W.play), T(W.play) + 20, eInOut)})` }} />
      <div style={{ position: "absolute", top: 1460, width: "100%", textAlign: "center", opacity: appear(f, T(W.play) + 6, 16) }}>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, letterSpacing: "0.3em", color: V.lilac }}>PROPOSITION DE PARTENARIAT</div>
        <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 30, color: V.muted, marginTop: 14 }}>Organisateurs d'événements danse · Paris</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 40, padding: "18px 34px", borderRadius: 999, background: "linear-gradient(135deg,#c13cff,#7a12d6)", boxShadow: "0 0 40px rgba(190,70,255,0.6)", fontFamily: FONT, fontWeight: 700, fontSize: 32, color: "#fff" }}>
          <PIcon name="plane" size={34} /> Écrivez-nous en DM
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { eBack, interpolate };
