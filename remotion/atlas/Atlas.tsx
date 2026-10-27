import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { NovaPhone, PH, PW, SH, SW } from "../nova/parts";
import { Reveal } from "../nova/Reveal";
import { useLay } from "../nova/layout";
import { StoreBtn } from "../stride/parts";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { BookingScreen, Dest, DestCard, Dust, Flare, FlightMap, Letterbox, Sky, Ticket, Wordmark } from "./parts";
import { A, caps, loadFonts, sans, serif, warmText } from "./theme";
import { BOOK, CARD_LEN, DURATION_FRAMES, END, SC } from "./timing";

loadFonts();

type Key = keyof typeof SC;
const on = (f: number, k: Key) => f >= SC[k][0] - 1 && f < SC[k][1] + 2;

/** Destinations : ajouter une entrée = ajouter une carte. */
const DESTS: Dest[] = [
  { city: "Lisbonne", country: "Portugal", price: 89, temp: 24, kind: "lisbon" },
  { city: "Marrakech", country: "Maroc", price: 119, temp: 31, kind: "marrakech" },
  { city: "Kyoto", country: "Japon", price: 549, temp: 19, kind: "kyoto" },
];

/** Pub Atlas — même composant pour 9:16 et 16:9. */
export const Atlas: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLay();
  const tod = interpolate(f, [0, DURATION_FRAMES], [0, 1], clamp);
  const sunX = L.W * (L.portrait ? 0.78 : 0.82);
  const sunY = L.H * (L.portrait ? 0.14 : 0.18);
  return (
    <AbsoluteFill style={{ background: A.night, overflow: "hidden" }}>
      <Sky f={f} W={L.W} H={L.H} tod={tod} />
      {on(f, "intro") ? <Intro f={f} /> : null}
      {on(f, "arc") ? <ArcScene f={f} /> : null}
      {on(f, "cards") ? <Cards f={f} /> : null}
      {on(f, "phone") ? <PhoneScene f={f} /> : null}
      {f >= SC.end[0] - 1 ? <EndScene f={f} /> : null}
      <Dust f={f} W={L.W} H={L.H} />
      {f >= SC.arc[0] && f < SC.end[0] ? <Flare x={sunX} y={sunY} W={L.W} H={L.H} k={0.35 + 0.1 * Math.sin(f / 25)} /> : null}
      {/* étalonnage chaud + grain + vignette */}
      <AbsoluteFill style={{ background: "rgba(255,140,60,0.06)", mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ opacity: 0.1, mixBlendMode: "overlay" }}>
        <svg width={L.W} height={L.H}>
          <filter id="atgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed={f % 12} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#atgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, rgba(10,4,2,0.75) 100%)" }} />
      <Letterbox f={f} W={L.W} H={L.H} portrait={L.portrait} />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- 1. Lever de soleil ---------- */
const Intro: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const exit = prog(f, 122, 140, eIn);
  const horizon = L.H * (L.portrait ? 0.66 : 0.68);
  const rise = prog(f, 0, 140, eOut);
  const sunY = lerp(horizon + 120, horizon - (L.portrait ? 260 : 70), rise);
  const R = L.portrait ? 170 : 125;
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, filter: exit > 0 ? `blur(${exit * 12}px)` : undefined, transform: `translateY(${exit * 80}px)` }}>
      <div style={{ position: "absolute", left: L.W / 2 - R * 4, top: sunY - R * 4, width: R * 8, height: R * 8, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,210,140,0.55), rgba(255,140,70,0.15) 40%, transparent 65%)" }} />
      <div style={{ position: "absolute", left: L.W / 2 - R, top: sunY - R, width: R * 2, height: R * 2, borderRadius: "50%", background: `radial-gradient(circle at 50% 45%, #fff6dc, ${A.sun} 60%, ${A.amber})`, boxShadow: "0 0 120px rgba(255,200,120,0.8)" }} />
      {/* mer */}
      <div style={{ position: "absolute", left: 0, right: 0, top: horizon, bottom: 0, background: "linear-gradient(180deg, #5a2a1c 0%, #1c0d08 100%)" }}>
        {Array.from({ length: 22 }, (_, i) => {
          const y = Math.pow(i / 22, 1.6) * (L.H - horizon);
          const w = (60 + i * 26) * (0.6 + 0.4 * Math.sin(f / 9 + i * 1.3));
          return <div key={i} style={{ position: "absolute", left: L.W / 2 - w / 2 + 20 * Math.sin(f / 15 + i), top: y, width: w, height: 2 + i * 0.25, borderRadius: 4, background: A.sun, opacity: 0.55 - i * 0.02 }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: L.H * (L.portrait ? 0.2 : 0.16), display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ ...caps(L.portrait ? 26 : 22), color: A.cream, opacity: prog(f, 26, 50) * 0.85, marginBottom: 30 }}>Atlas présente</div>
        <Reveal
          f={f}
          align="center"
          lines={[[{ t: "Le monde", at: 40, style: { ...serif(L.portrait ? 170 : 150), color: A.cream } }], [{ t: "vous attend.", at: 64, style: { ...serif(L.portrait ? 170 : 150), ...warmText } }]]}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2. Arc d'avion ---------- */
const ArcScene: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const st = SC.arc[0];
  const enter = prog(f, st, st + 20, eOut);
  const exit = prog(f, 278, 290, eIn);
  const w = L.portrait ? 2400 : 2700;
  const h = w / 2;
  const mapX = L.W / 2 - 0.6935 * w;
  const mapY = (L.portrait ? L.H * 0.6 : L.H * 0.62) - 0.3 * h;
  const zoom = lerp(1, 1.12, prog(f, st, 290, eInOut));
  const arrive = prog(f, st + 112, st + 124, eBack);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - exit), filter: exit > 0 ? `blur(${exit * 10}px)` : undefined }}>
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: mapX, top: mapY, transform: `rotateX(26deg) scale(${zoom})`, transformOrigin: `${0.6935 * w}px ${0.3 * h}px` }}>
          <FlightMap f={f} from={st} w={w} h={h} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: L.portrait ? 90 : 140, top: L.portrait ? L.H * 0.14 : L.H * 0.14 }}>
        <div style={{ ...caps(L.portrait ? 24 : 20), color: A.amber, opacity: prog(f, st + 6, st + 24), marginBottom: 24 }}>Vols · Hôtels · Escapades</div>
        <Reveal f={f} lines={[[{ t: "Un clic,", at: st + 14, style: { ...serif(L.portrait ? 150 : 130), color: A.cream } }], [{ t: "et vous y êtes.", at: st + 34, style: { ...serif(L.portrait ? 150 : 130), ...warmText } }]]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: L.portrait ? L.H * 0.14 : L.H * 0.13, display: "flex", justifyContent: "center", opacity: arrive, transform: `translateY(${(1 - arrive) * 30}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 40px", borderRadius: 999, background: "rgba(20,10,6,0.6)", border: "1px solid rgba(255,241,222,0.25)", ...sans(34, 600), color: A.cream }}>
          <span style={{ fontWeight: 800 }}>CDG → KIX</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>12 h 05</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>
            dès <b style={{ color: A.sun }}>549 €</b>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3. Cartes destination ---------- */
const Cards: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const st = SC.cards[0] + 2;
  const exit = prog(f, 452, 465, eIn);
  const cw = L.portrait ? 820 : 600;
  const ch = L.portrait ? 1100 : 820;
  const cx = L.portrait ? L.W / 2 : L.W * 0.7;
  const cy = L.portrait ? L.H * 0.6 : L.H * 0.52;
  const idx = DESTS.reduce((acc, _, i) => (f >= st + i * CARD_LEN ? i : acc), 0);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <div style={{ position: "absolute", left: L.portrait ? 90 : 140, top: L.portrait ? L.H * 0.09 : L.H * 0.3 }}>
        <Reveal f={f} lines={[[{ t: "Où partir", at: st, style: { ...serif(L.portrait ? 120 : 130), color: A.cream } }], [{ t: "ce mois-ci ?", at: st + 10, style: { ...serif(L.portrait ? 120 : 130), ...warmText } }]]} />
        <div style={{ ...caps(24), color: A.muted, marginTop: 30, opacity: prog(f, st + 10, st + 24) }}>
          {String(idx + 1).padStart(2, "0")} / {String(DESTS.length).padStart(2, "0")}
        </div>
      </div>
      <AbsoluteFill style={{ perspective: 2000 }}>
        {DESTS.map((d, i) => {
          const from = st + i * CARD_LEN;
          const p = prog(f, from - 4, from + 16, eOut);
          const out = i < DESTS.length - 1 ? prog(f, from + CARD_LEN - 4, from + CARD_LEN + 14, eInOut) : 0;
          if (p <= 0 || out >= 1) return null;
          const x = cx + (1 - p) * L.W * 0.55 - out * L.W * 0.6;
          return (
            <div
              key={d.city}
              style={{
                position: "absolute",
                left: x - cw / 2,
                top: cy - ch / 2 + 10 * Math.sin((f - from) / 25),
                transform: `rotateY(${(1 - p) * 35 - out * 30}deg) rotateZ(${(1 - p) * 4 - out * 3}deg) scale(${lerp(0.9, 1, p) * (1 - out * 0.1)})`,
                opacity: Math.min(1, p * 1.5) * (1 - out),
                filter: out > 0 ? `blur(${out * 10}px)` : undefined,
                zIndex: i,
              }}
            >
              <DestCard d={d} f={f} w={cw} h={ch} reveal={prog(f, from + 6, from + 30, eOut)} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- 4. Téléphone + "Réservé" ---------- */
const PhoneScene: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const st = SC.phone[0];
  const p = prog(f, st, st + 30, eOut);
  const press = prog(f, BOOK - 6, BOOK + 4, eInOut);
  const booked = prog(f, BOOK, BOOK + 6);
  const exit = prog(f, 588, 600, eIn);
  const back = prog(f, BOOK + 2, BOOK + 22, eInOut);
  const s = (L.portrait ? 0.82 : 0.68) * lerp(1, 0.92, back);
  const tk = prog(f, BOOK + 6, BOOK + 26, eBack);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, filter: exit > 0 ? `blur(${exit * 12}px)` : undefined }}>
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: L.vx - PW / 2 - back * (L.portrait ? 0 : 120), top: L.vy - PH / 2 + (1 - p) * 500 - back * (L.portrait ? 80 : 0) }}>
          <div style={{ transform: `scale(${s}) rotateY(${lerp(-24, -8, p) + 2 * Math.sin(f / 30)}deg) rotateX(${lerp(14, 4, p)}deg) rotateZ(${lerp(5, 2, p)}deg)` }}>
            <NovaPhone f={f} screens={[{ from: st, node: <BookingScreen f={f} from={st + 6} press={press} booked={booked} sw={SW} sh={SH} /> }]} />
          </div>
        </div>
      </AbsoluteFill>
      {/* billet qui sort */}
      {tk > 0 ? (
        <div style={{ position: "absolute", left: L.portrait ? L.W / 2 - 360 : L.vx - 120, top: L.portrait ? L.H * 0.66 : L.H * 0.48, opacity: Math.min(1, tk * 2), transform: `translateY(${(1 - tk) * 200}px) rotate(${lerp(8, -5, tk)}deg)` }}>
          <Ticket w={L.portrait ? 720 : 640} />
        </div>
      ) : null}
      {/* étincelles de validation */}
      {Array.from({ length: 36 }, (_, i) => {
        const t = f - BOOK;
        if (t < 0 || t > 40) return null;
        const a = hash(i) * Math.PI * 2;
        const v = 8 + hash(i + 1) * 14;
        return <div key={i} style={{ position: "absolute", left: L.vx + Math.cos(a) * v * t, top: L.vy + Math.sin(a) * v * t + 0.2 * t * t, width: 8, height: 8, borderRadius: "50%", background: [A.sun, A.amber, A.cream][i % 3], opacity: 1 - t / 40, boxShadow: `0 0 10px ${A.amber}` }} />;
      })}
      <div style={{ position: "absolute", left: L.tx, top: L.portrait ? L.H * 0.08 : L.ty, width: L.tw }}>
        <Reveal f={f} exitAt={BOOK - 4} lines={[[{ t: "Réservez", at: st + 14, style: { ...serif(L.portrait ? 130 : 130), color: A.cream } }], [{ t: "en 30 secondes.", at: st + 30, style: { ...serif(L.portrait ? 130 : 120), ...warmText } }]]} />
      </div>
      {f >= BOOK ? (
        <div style={{ position: "absolute", left: L.tx, top: L.portrait ? L.H * 0.08 : L.ty, display: "flex", alignItems: "center", gap: 30 }}>
          <svg width={140} height={140} viewBox="0 0 100 100" style={{ opacity: prog(f, BOOK, BOOK + 6) }}>
            <circle cx="50" cy="50" r="44" fill="none" stroke={A.green} strokeWidth="6" pathLength={1} strokeDasharray={`${prog(f, BOOK, BOOK + 14, eOut)} 1`} transform="rotate(-90 50 50)" />
            <path d="M30 52 L45 66 L72 36" fill="none" stroke={A.green} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${prog(f, BOOK + 8, BOOK + 18, eOut)} 1`} />
          </svg>
          <Reveal f={f} mode="punch" lines={[[{ t: "Réservé.", at: BOOK + 4, style: { ...serif(L.portrait ? 180 : 170), ...warmText } }]]} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- 5. Fin ---------- */
const EndScene: React.FC<{ f: number }> = ({ f }) => {
  const L = useLay();
  const st = SC.end[0];
  const draw = prog(f, st + 2, st + 34, eInOut);
  const word = prog(f, st + 4, st + 24, eExpo);
  const cy = L.H * (L.portrait ? 0.38 : 0.33);
  const horizon = L.H * 0.78;
  return (
    <AbsoluteFill style={{ opacity: prog(f, st - 1, st + 10) }}>
      {/* soleil couchant sur l'horizon */}
      <div style={{ position: "absolute", left: L.W / 2 - 600, top: horizon - 600, width: 1200, height: 1200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,170,110,0.5), transparent 60%)" }} />
      <div style={{ position: "absolute", left: L.W / 2 - 160, top: horizon - 110 + prog(f, st, 720) * 60, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle at 50% 40%, #fff0d0, ${A.amber} 60%, ${A.orange})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: horizon, bottom: 0, background: "linear-gradient(180deg, #3a160f, #120a08)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: cy - 90, display: "flex", justifyContent: "center", opacity: word, transform: `scale(${lerp(1.15, 1, word)})`, filter: word < 1 ? `blur(${(1 - word) * 10}px)` : undefined }}>
        <Wordmark size={L.portrait ? 170 : 150} draw={draw} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 120, display: "flex", justifyContent: "center" }}>
        <Reveal f={f} align="center" lines={[[{ t: "Le monde, à portée de main.", at: st + 22, style: { ...serif(L.portrait ? 86 : 80), ...warmText } }]]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + (L.portrait ? 270 : 240), display: "flex", justifyContent: "center", gap: 36 }}>
        {(["apple", "google"] as const).map((k, i) => {
          const q = prog(f, st + 40 + i * 6, st + 54 + i * 6, eOut);
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
const sfx = (n: string) => staticFile(`atlas/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: 120, src: "whoosh", vol: 0.25 },
  { at: SC.arc[0] + 15, src: "flyby", vol: 0.4 },
  ...DESTS.map((_, i) => ({ at: SC.cards[0] + 2 + i * CARD_LEN - 6, src: "swish", vol: 0.25 })),
  { at: SC.phone[0] - 6, src: "whoosh", vol: 0.22 },
  { at: BOOK - 4, src: "tap", vol: 0.35 },
  { at: BOOK, src: "success", vol: 0.35 },
  { at: BOOK + 6, src: "paper", vol: 0.3 },
  { at: END - 6, src: "whoosh", vol: 0.22 },
  { at: END + 6, src: "shimmer", vol: 0.25 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={sfx("music")} volume={0.55} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} layout="none" name={c.src}>
        <Html5Audio src={sfx(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

export { caps, eInOut };
