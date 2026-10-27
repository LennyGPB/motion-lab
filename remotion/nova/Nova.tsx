import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { StoreBtn } from "../stride/parts";
import { clamp, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { useLay } from "./layout";
import { Aurora, CARD_H, CARD_W, chartProgress, Feature, FeatureScene, GrowthChart, NIcon, Notif, NotifStack, NovaCard, NovaPhone, PH, PW, Wordmark } from "./parts";
import { Reveal } from "./Reveal";
import { CardsScreen, HomeScreen } from "./screens";
import { AURORA, auroraText, goldText, loadFonts, N, sans, serif } from "./theme";
import { beat, DROP, END, SC } from "./timing";

loadFonts();

type Key = keyof typeof SC;
const on = (f: number, k: Key) => f >= SC[k][0] - 1 && f < SC[k][1] + 2;

const NOTIFS: Notif[] = [
  { title: "Carte Nova", who: "Café Kitsuné", amount: "−4,20 €", at: DROP + 4 },
  { title: "Virement reçu", who: "Julien M.", amount: "+1 250,00 €", plus: true, at: DROP + 4 + 15 },
  { title: "Apple Pay", who: "Uber", amount: "−12,40 €", at: DROP + 4 + 30 },
  { title: "Cashback", who: "Fnac", amount: "+2,10 €", plus: true, at: DROP + 4 + 45 },
  { title: "Carte Nova", who: "Monoprix", amount: "−23,80 €", at: DROP + 4 + 60 },
  { title: "Épargne", who: "Arrondi automatique", amount: "+0,80 €", plus: true, at: DROP + 4 + 75 },
];

/** Fonctionnalités : ajouter une entrée = ajouter une scène. */
const FEATURES: Feature[] = [
  { icon: "bolt", title: "Virements instantanés", sub: "En moins de 10 secondes." },
  {
    icon: "card",
    title: "Cartes virtuelles",
    sub: "Créées en un geste.",
    visual: (f, from) => (
      <div style={{ transform: "scale(0.62) rotateY(-12deg)", transformOrigin: "50% 50%" }}>
        <NovaPhone f={f} screens={[{ from, node: <CardsScreen f={f} from={from} /> }]} glow={beat(f)} />
      </div>
    ),
  },
  {
    icon: "globe",
    title: "0 € de frais",
    sub: "Partout dans le monde.",
    visual: (f) => <Globe f={f} />,
  },
];
const FEAT_LEN = 30;

/** Pub Nova — même composant pour 9:16 et 16:9. */
export const Nova: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLay();
  const b = beat(f);
  const energy = f < DROP ? 0.3 + 0.2 * prog(f, 200, DROP) : 0.55 + 0.35 * b;
  const flash = Math.max(f >= DROP ? 0.6 * Math.exp(-(f - DROP) / 3) : 0, f >= END ? 0.45 * Math.exp(-(f - END) / 4) : 0);
  return (
    <AbsoluteFill style={{ background: N.bg, overflow: "hidden" }}>
      <Aurora f={f} W={L.W} H={L.H} energy={energy} />
      <AbsoluteFill style={{ transform: `scale(${1 + b * 0.008})` }}>
        {on(f, "card") ? <CardScene f={f} /> : null}
        {on(f, "phone") ? <PhoneScene f={f} /> : null}
        {on(f, "notifs") ? <NotifScene f={f} /> : null}
        {on(f, "chart") ? <ChartScene f={f} /> : null}
        {on(f, "features")
          ? FEATURES.map((ft, i) => {
              const from = SC.features[0] + 2 + i * FEAT_LEN;
              if (f < from - 1 || f >= from + FEAT_LEN + 2) return null;
              return <FeatureScene key={i} f={f} from={from} index={i} total={FEATURES.length} feat={ft} portrait={L.portrait} W={L.W} H={L.H} />;
            })
          : null}
        {f >= SC.end[0] - 1 ? <EndScene f={f} /> : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#f6f2ff", opacity: flash }} />
      <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "overlay" }}>
        <svg width={L.W} height={L.H}>
          <filter id="nvgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#nvgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

const TextBox: React.FC<{ children: React.ReactNode; maxW?: number }> = ({ children, maxW }) => {
  const L = useLay();
  return <div style={{ position: "absolute", left: L.tx, top: L.ty, width: maxW ?? L.tw }}>{children}</div>;
};

/* ---------- 1. Carte (lent) ---------- */
const CardScene: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const t = prog(f, 0, 150, eInOut);
  const reveal = prog(f, 8, 48, eOut);
  const exit = prog(f, 122, 145, eIn);
  const sc = (L.portrait ? 1 : 0.86) * (1 + exit * 0.35);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, filter: exit > 0 ? `blur(${exit * 14}px)` : undefined }}>
      {/* ombre portée */}
      <div style={{ position: "absolute", left: L.vx - 380 * sc, top: L.vy + 330 * sc, width: 760 * sc, height: 90 * sc, borderRadius: "50%", background: "rgba(0,0,0,0.7)", filter: "blur(30px)", opacity: reveal }} />
      <div style={{ position: "absolute", left: L.vx - CARD_W / 2, top: L.vy - CARD_H / 2 + 14 * Math.sin(f / 30), perspective: 1800, opacity: reveal }}>
        <NovaCard f={f} ry={lerp(-38, 24, t)} rx={lerp(18, -6, t)} rz={lerp(-8, -2, t)} sheen={prog(f, 22, 95, eInOut)} scale={sc} />
      </div>
      <TextBox>
        <div style={{ ...sans(24, 700), color: N.gold, letterSpacing: "0.32em", opacity: prog(f, 12, 34), marginBottom: 28 }}>NOVA · BANQUE EN LIGNE</div>
        <Reveal
          f={f}
          exitAt={118}
          lines={[[{ t: "L'argent,", at: 30, style: { ...serif(150), color: N.ink } }], [{ t: "réinventé.", at: 54, style: { ...serif(150), ...goldText } }]]}
        />
      </TextBox>
    </AbsoluteFill>
  );
};

/* ---------- 2. Téléphone (lent) ---------- */
const PhoneScene: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const st = SC.phone[0];
  const p = prog(f, st, st + 45, eOut);
  const push = prog(f, 238, 272, eIn);
  const s = (L.portrait ? 0.86 : 0.8) * (1 + push * 0.9);
  return (
    <AbsoluteFill style={{ opacity: prog(f, st, st + 14) * (1 - prog(f, 262, 272)), filter: push > 0.05 ? `blur(${push * 16}px)` : undefined }}>
      <div style={{ position: "absolute", left: L.vx - PW / 2, top: L.vy - PH / 2 + (1 - p) * 600, perspective: 2200 }}>
        <div style={{ transform: `scale(${s}) rotateY(${lerp(-28, -10, p) + 3 * Math.sin(f / 40)}deg) rotateX(${lerp(14, 4, p)}deg) rotateZ(${lerp(6, 2, p)}deg)` }}>
          <NovaPhone f={f} screens={[{ from: st, node: <HomeScreen f={f} from={st + 12} /> }]} />
        </div>
      </div>
      <TextBox>
        <Reveal
          f={f}
          exitAt={236}
          lines={[
            [
              { t: "Tout", at: st + 22, style: { ...sans(86, 300), color: N.ink } },
              { t: "votre", at: st + 28, style: { ...sans(86, 300), color: N.ink } },
              { t: "argent.", at: st + 34, style: { ...sans(86, 700), color: N.ink } },
            ],
            [{ t: "Une seule app.", at: st + 54, style: { ...serif(140), ...auroraText } }],
          ]}
        />
      </TextBox>
    </AbsoluteFill>
  );
};

/* ---------- 3. Notifications (punchy) ---------- */
const NotifScene: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const exit = prog(f, 350, 362, eIn);
  const w = L.portrait ? L.W - 180 : 820;
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateY(${-exit * 60}px)` }}>
      <TextBox>
        <Reveal
          f={f}
          mode="punch"
          lines={[[{ t: "En temps", at: DROP + 1, style: { ...sans(140, 800), color: N.ink } }], [{ t: "réel.", at: DROP + 6, style: { ...serif(200), ...auroraText } }]]}
        />
      </TextBox>
      <div style={{ position: "absolute", left: L.portrait ? 90 : L.vx - w / 2 + 40, top: L.portrait ? 760 : 200, perspective: 1600 }}>
        <NotifStack f={f} items={NOTIFS} width={w} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 4. Courbe (punchy) ---------- */
const ChartScene: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const st = SC.chart[0];
  const p = prog(f, st, st + 8, eExpo);
  const exit = prog(f, 428, 437, eIn);
  const cp = chartProgress(f, st);
  const cw = L.portrait ? 900 : 860;
  const ch = L.portrait ? 640 : 600;
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, filter: exit > 0 ? `blur(${exit * 10}px)` : undefined }}>
      <TextBox>
        <Reveal
          f={f}
          mode="punch"
          lines={[[{ t: "Votre épargne", at: st + 1, style: { ...sans(L.portrait ? 110 : 100, 800), color: N.ink } }], [{ t: "décolle.", at: st + 7, style: { ...serif(180), ...goldText } }]]}
        />
        <div style={{ ...sans(L.portrait ? 120 : 110, 800), color: N.green, marginTop: 24, fontVariantNumeric: "tabular-nums", opacity: prog(f, st + 10, st + 16) }}>
          +{(18.4 * cp).toFixed(1).replace(".", ",")} %
        </div>
      </TextBox>
      <div style={{ position: "absolute", left: L.vx - cw / 2, top: L.portrait ? 980 : L.vy - ch / 2, perspective: 1600 }}>
        <div
          style={{
            width: cw,
            height: ch,
            boxSizing: "border-box",
            padding: "70px 50px 60px",
            borderRadius: 44,
            background: "linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            transform: `rotateX(${lerp(30, 10, p)}deg) rotateY(${lerp(-25, -8, p) + 2 * Math.sin(f / 20)}deg) scale(${lerp(0.85, 1, p)})`,
            opacity: p,
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", left: 50, top: 28, ...sans(26, 700), color: N.muted, letterSpacing: "0.18em" }}>ÉPARGNE · 12 MOIS</div>
          <div style={{ position: "absolute", right: 50, top: 22, ...sans(36, 800), color: N.ink, fontVariantNumeric: "tabular-nums" }}>{Math.round(lerp(6960, 8240, cp)).toLocaleString("fr-FR").replace(/ /g, " ")} €</div>
          <GrowthChart f={f} from={st} w={cw - 100} h={ch - 190} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Globe (visuel de fonctionnalité) ---------- */
const Globe: React.FC<{ f: number }> = ({ f }) => {
  const R = 210;
  return (
    <svg width={R * 2 + 40} height={R * 2 + 40} viewBox={`${-R - 20} ${-R - 20} ${R * 2 + 40} ${R * 2 + 40}`} style={{ overflow: "visible", filter: "drop-shadow(0 0 30px rgba(94,230,208,0.4))" }}>
      <defs>
        <radialGradient id="glb" cx="0.35" cy="0.3">
          <stop offset="0" stopColor="rgba(111,124,255,0.45)" />
          <stop offset="1" stopColor="rgba(5,6,10,0.9)" />
        </radialGradient>
      </defs>
      <circle r={R} fill="url(#glb)" stroke="rgba(244,241,234,0.35)" strokeWidth={2} />
      {[-0.66, -0.33, 0, 0.33, 0.66].map((y) => (
        <ellipse key={y} cy={y * R} rx={R * Math.sqrt(1 - y * y)} ry={R * 0.12 * Math.sqrt(1 - y * y)} fill="none" stroke="rgba(244,241,234,0.18)" strokeWidth={1.5} />
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const a = ((i / 6) * Math.PI + f * 0.02) % Math.PI;
        return <ellipse key={i} rx={Math.abs(Math.cos(a)) * R} ry={R} fill="none" stroke="rgba(244,241,234,0.18)" strokeWidth={1.5} />;
      })}
      {[0, 1, 2, 3].map((i) => {
        const a = f * 0.03 + i * 1.6;
        const x = Math.cos(a) * R * 0.75;
        const y = (i - 1.5) * R * 0.35;
        const vis = Math.sin(a) > 0;
        return vis ? <circle key={i} cx={x} cy={y} r={10} fill={N.teal} style={{ filter: `drop-shadow(0 0 10px ${N.teal})` }} /> : null;
      })}
      <text y={22} textAnchor="middle" fontFamily="Manrope" fontWeight={800} fontSize={120} fill={N.ink}>
        0 €
      </text>
    </svg>
  );
};

/* ---------- 6. Fin ---------- */
const EndScene: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const st = SC.end[0];
  const logo = prog(f, st + 2, st + 20, eExpo);
  const cy = L.portrait ? L.H * 0.36 : L.H * 0.34;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${(cy / L.H) * 100}%, rgba(178,140,255,0.22), transparent 45%)` }} />
      {Array.from({ length: 40 }, (_, i) => {
        const x = hash(i) * L.W;
        const y = (hash(i + 3) * L.H - (f - st) * (0.6 + hash(i + 5))) % L.H;
        return <div key={i} style={{ position: "absolute", left: x, top: y < 0 ? y + L.H : y, width: 3, height: 3, borderRadius: "50%", background: N.ink, opacity: 0.25 + 0.5 * hash(i + 8) }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: cy - 110, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${lerp(1.3, 1, logo)})`, filter: logo < 1 ? `blur(${(1 - logo) * 14}px)` : undefined }}>
        <Wordmark size={230} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 150, display: "flex", justifyContent: "center" }}>
        <Reveal f={f} align="center" lines={[[{ t: "La banque, en mieux.", at: st + 16, style: { ...serif(90), ...auroraText } }]]} />
      </div>
      {(() => {
        const q = prog(f, st + 30, st + 44, eOut);
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: cy + (L.portrait ? 320 : 290), display: "flex", justifyContent: "center", opacity: q, transform: `translateY(${(1 - q) * 20}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 44px", borderRadius: 999, background: N.ink, ...sans(34, 700), color: N.bg }}>
              Ouvrez votre compte en 5 minutes
              <NIcon name="bolt" size={34} color={N.bg} sw={2} />
            </div>
          </div>
        );
      })()}
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + (L.portrait ? 520 : 440), display: "flex", justifyContent: "center", gap: 40 }}>
        {(["apple", "google"] as const).map((k, i) => {
          const q = prog(f, st + 42 + i * 5, st + 56 + i * 5, eOut);
          return (
            <div key={k} style={{ opacity: q, transform: `translateY(${(1 - q) * 30}px) scale(${L.portrait ? 1 : 0.85})` }}>
              <StoreBtn kind={k} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const sfx = (n: string) => staticFile(`nova/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: 18, src: "sheen", vol: 0.3 },
  { at: 125, src: "whoosh", vol: 0.22 },
  { at: 230, src: "whoosh", vol: 0.2 },
  { at: DROP, src: "impact", vol: 0.45 },
  ...NOTIFS.map((n) => ({ at: n.at, src: "notif", vol: 0.28 })),
  { at: SC.chart[0], src: "swipe", vol: 0.25 },
  ...FEATURES.map((_, i) => ({ at: SC.features[0] + i * FEAT_LEN, src: "swipe", vol: 0.25 })),
  { at: SC.features[0] + 2 + FEAT_LEN + 6, src: "click", vol: 0.25 },
  { at: END, src: "impact", vol: 0.4 },
  { at: END + 4, src: "sheen", vol: 0.22 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={sfx("music")} volume={0.5} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} layout="none" name={c.src}>
        <Html5Audio src={sfx(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

export { AURORA, clamp, interpolate };
