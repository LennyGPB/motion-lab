import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFonts as loadSans, SANS } from "../signspath/theme";
import { StoreBtn } from "../stride/parts";
import { FONT, loadViewzFonts } from "../viewz/theme";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { CONFIG } from "./config";
import { GRAD, Laptop, Phone, Tablet } from "./Devices";
import { DURATION_FRAMES, END, FAMILY, LAPTOP, NEST, PHONE, TABLET } from "./timing";

loadViewzFonts();
loadSans();
const C = CONFIG;
const W = 1080;
const H = 1920;
const CY = 960;

const mega = (size: number, color = "#fff"): React.CSSProperties => ({ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontStretch: "68%", fontSize: size, lineHeight: 0.92, textTransform: "uppercase", color, whiteSpace: "nowrap" });
const fit = (text: string, maxW: number, max: number) => Math.min(max, maxW / (Math.max(1, text.length) * 0.5));
const kf = (f: number, keys: [number, number][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) return interpolate(f, [keys[i - 1][0], keys[i][0]], [keys[i - 1][1], keys[i][1]], { ...clamp, easing: eInOut });
  }
  return keys[keys.length - 1][1];
};
const F30 = FAMILY + 30;
const N26 = NEST + 26;

/** "Works everywhere" (1080x1920). */
export const Platforms: React.FC = () => {
  const f = useCurrentFrame();
  const collapse = prog(f, N26 + 4, END, eIn);
  const orbit = f >= F30 && f < NEST ? 6 * Math.sin(((f - F30) / (NEST - F30)) * Math.PI) : 0;
  // poses
  const L = {
    x: kf(f, [[TABLET, 0], [TABLET + 30, -90], [FAMILY, -90], [F30, 0]]),
    y: kf(f, [[LAPTOP, 760], [LAPTOP + 28, 0], [TABLET, 0], [TABLET + 30, -430], [FAMILY, -430], [F30, -260]]),
    z: kf(f, [[LAPTOP, -900], [LAPTOP + 28, 0], [TABLET, 0], [TABLET + 30, -700], [FAMILY, -700], [F30, -200]]),
    ry: kf(f, [[LAPTOP, -40], [LAPTOP + 28, -14], [TABLET, 12], [TABLET + 30, 24], [FAMILY, 24], [F30, -6], [NEST, 6], [N26, 0]]),
    rx: kf(f, [[LAPTOP, 18], [LAPTOP + 28, 12], [TABLET + 30, 14], [F30, 10], [NEST, 10], [N26, 2]]),
    s: kf(f, [[LAPTOP, 0.7], [LAPTOP + 28, 0.84], [TABLET, 0.88], [TABLET + 30, 0.62], [F30, 0.74]]),
    op: prog(f, LAPTOP, LAPTOP + 8) * kf(f, [[TABLET + 10, 1], [TABLET + 30, 0.55], [FAMILY, 0.55], [F30, 1]]),
  };
  const lid = prog(f, LAPTOP + 22, LAPTOP + 52, eInOut);
  const on = prog(f, LAPTOP + 50, LAPTOP + 62);
  const T = {
    x: kf(f, [[TABLET, 760], [TABLET + 30, 0], [PHONE, 0], [PHONE + 28, -270], [FAMILY, -270], [F30, -300], [NEST, -300], [N26, 0]]),
    y: kf(f, [[TABLET, 120], [TABLET + 30, 60], [PHONE + 28, 20], [FAMILY, 20], [F30, 300], [NEST, 300], [N26, -262]]),
    z: kf(f, [[TABLET, -200], [TABLET + 30, 0], [PHONE, 0], [PHONE + 28, -350], [FAMILY, -350], [F30, 120], [NEST, 120], [N26, -120]]),
    ry: kf(f, [[TABLET, 200], [TABLET + 32, -8], [PHONE, 10], [PHONE + 28, 22], [FAMILY, 22], [F30, 16], [NEST, 18], [N26, 0]]),
    rx: kf(f, [[TABLET, 10], [TABLET + 30, 6], [F30, 6], [N26, 2]]),
    s: kf(f, [[TABLET, 0.8], [TABLET + 30, 1], [PHONE, 1.02], [PHONE + 28, 0.72], [FAMILY, 0.72], [F30, 0.5], [NEST, 0.5], [N26, 0.47]]),
    op: prog(f, TABLET, TABLET + 6) * kf(f, [[PHONE + 10, 1], [PHONE + 28, 0.7], [FAMILY, 0.7], [F30, 1]]),
  };
  const drop = prog(f, PHONE, PHONE + 26, eBack);
  const P = {
    x: kf(f, [[FAMILY, 150], [F30, 320], [NEST, 320], [N26, 0]]),
    y: f < FAMILY ? lerp(-1600, 60, drop) : kf(f, [[FAMILY, 60], [F30, 330], [NEST, 330], [N26, -262]]),
    z: kf(f, [[FAMILY, 150], [F30, 240], [NEST, 240], [N26, -40]]),
    ry: kf(f, [[PHONE, -25], [PHONE + 26, -12], [FAMILY, -4], [F30, -16], [NEST, -18], [N26, 0]]),
    rz: kf(f, [[PHONE, 16], [PHONE + 30, 0]]),
    s: kf(f, [[FAMILY, 0.95], [F30, 0.44], [NEST, 0.44], [N26, 0.25]]),
    op: prog(f, PHONE, PHONE + 4),
  };
  const pose = (p: { x: number; y: number; z: number; ry: number; rx: number; s: number; rz?: number }) =>
    `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateY(${p.ry}deg) rotateX(${p.rx}deg) rotateZ(${p.rz ?? 0}deg) scale(${p.s})`;
  const flash = Math.max(f >= END ? 0.85 * Math.exp(-(f - END) / 3) : 0, ...[LAPTOP + 50, N26].map((h) => (f >= h ? 0.25 * Math.exp(-(f - h) / 3) : 0)));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#070914" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${C.accent}40, transparent 55%), radial-gradient(circle at 15% 85%, ${C.accent2}2a, transparent 45%), linear-gradient(180deg, #0b0e1f, #05060d)` }} />
      {/* sol réfléchissant */}
      <div style={{ position: "absolute", left: -400, right: -400, top: 1380, height: 900, background: `radial-gradient(ellipse at 50% 0%, ${C.accent}33, transparent 60%)`, transform: "perspective(900px) rotateX(70deg)", transformOrigin: "50% 0%" }} />
      <Captions f={f} />
      <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: `50% ${CY}px` }}>
        <div style={{ position: "absolute", left: W / 2, top: CY, transformStyle: "preserve-3d", transform: `rotateY(${orbit}deg) scale(${1 - collapse})` }}>
          {f >= LAPTOP - 1 ? (
            <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: pose(L) }}>
              <Laptop lid={lid} on={on} op={L.op} baseOp={1 - kf(f, [[TABLET, 0], [TABLET + 14, 1], [FAMILY + 10, 1], [F30, 0]])} />
            </div>
          ) : null}
          {f >= TABLET - 1 ? (
            <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: pose(T) }}>
              <Tablet op={T.op} />
            </div>
          ) : null}
          {f >= PHONE - 1 ? (
            <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: pose({ ...P, rx: 4 }) }}>
              <Phone op={P.op} />
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
      <SyncArcs f={f} />
      <Label f={f} />
      <Badges f={f} />
      {f >= END - 1 ? <EndCard f={f} /> : null}
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "overlay" }}>
        <svg width={W} height={H}>
          <filter id="plgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#plgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

/** Titres de chaque phase. */
const Captions: React.FC<{ f: number }> = ({ f }) => {
  const items: { from: number; to: number; lines: string[]; top: number; size: number }[] = [
    { from: 2, to: LAPTOP - 2, lines: C.captions.intro, top: 760, size: 200 },
    { from: LAPTOP + 30, to: TABLET - 2, lines: [C.captions.desktop], top: 170, size: 130 },
    { from: TABLET + 20, to: PHONE - 2, lines: [C.captions.tablet], top: 170, size: 130 },
    { from: PHONE + 18, to: FAMILY - 2, lines: [C.captions.phone], top: 170, size: 130 },
    { from: FAMILY + 10, to: NEST + 14, lines: C.captions.family, top: 130, size: 190 },
  ];
  return (
    <>
      {items.map((it, k) => {
        if (f < it.from || f > it.to + 8) return null;
        const out = prog(f, it.to, it.to + 8, eIn);
        return (
          <div key={k} style={{ position: "absolute", top: it.top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>
            {it.lines.map((l, i) => {
              const q = prog(f, it.from + i * 7, it.from + 6 + i * 7, eExpo);
              const last = i === it.lines.length - 1 && it.lines.length > 1;
              return (
                <div key={i} style={{ ...mega(fit(l, 960, it.size)), ...(last || it.lines.length === 1 ? { background: GRAD, WebkitBackgroundClip: "text", color: "transparent", paddingRight: 16 } : {}), opacity: Math.min(1, q * 3), transform: `scale(${lerp(1.5, 1, q)})`, filter: q < 1 ? `blur(${(1 - q) * 10}px)` : undefined }}>
                  {l}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

/** Étiquette de l'appareil courant. */
const Label: React.FC<{ f: number }> = ({ f }) => {
  const ph = [
    { from: LAPTOP + 34, to: TABLET - 4 },
    { from: TABLET + 28, to: PHONE - 4 },
    { from: PHONE + 26, to: FAMILY - 4 },
  ];
  return (
    <>
      {ph.map((p, i) => {
        if (f < p.from || f > p.to + 8) return null;
        const q = prog(f, p.from, p.from + 10, eBack) * (1 - prog(f, p.to, p.to + 8));
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 1660, display: "flex", justifyContent: "center", opacity: Math.min(1, q * 2), transform: `scale(${lerp(0.7, 1, q)})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 34px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.25)", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: "#fff" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: GRAD, boxShadow: `0 0 14px ${C.accent2}` }} />
              {C.labels[i]}
            </div>
          </div>
        );
      })}
    </>
  );
};

/** Arcs de synchronisation entre les appareils (vue famille). */
const NODES: [number, number][] = [
  [540, 690],
  [258, 1240],
  [872, 1270],
];
const SyncArcs: React.FC<{ f: number }> = ({ f }) => {
  const v = prog(f, F30, F30 + 12) * (1 - prog(f, NEST - 4, NEST + 6));
  if (v <= 0) return null;
  const pairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
  ];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: v }}>
      <defs>
        <linearGradient id="plsync" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.accent} />
          <stop offset="1" stopColor={C.accent2} />
        </linearGradient>
      </defs>
      {pairs.map(([a, b], i) => {
        const [x1, y1] = NODES[a];
        const [x2, y2] = NODES[b];
        const mx = (x1 + x2) / 2;
        const my = Math.min(y1, y2) - (i === 2 ? -160 : 120);
        const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
        const tt = ((f - F30) / 26 + i * 0.33) % 1;
        const q = (u: number): [number, number] => [(1 - u) ** 2 * x1 + 2 * (1 - u) * u * mx + u * u * x2, (1 - u) ** 2 * y1 + 2 * (1 - u) * u * my + u * u * y2];
        const draw = prog(f, F30 + i * 4, F30 + i * 4 + 16, eOut);
        return (
          <g key={i}>
            <path d={d} stroke="url(#plsync)" strokeWidth={4} fill="none" strokeDasharray="10 12" strokeDashoffset={-f * 2} pathLength={undefined} opacity={draw} style={{ filter: `drop-shadow(0 0 8px ${C.accent2})` }} />
            {draw > 0.9 ? (
              <circle cx={q(tt)[0]} cy={q(tt)[1]} r={9} fill="#fff" style={{ filter: `drop-shadow(0 0 12px ${C.accent2})` }} />
            ) : null}
          </g>
        );
      })}
      {NODES.map(([x, y], i) => {
        const r = ((f - F30 + i * 8) % 30) / 30;
        return <circle key={i} cx={x} cy={y} r={20 + r * 70} fill="none" stroke={C.accent2} strokeWidth={3} opacity={(1 - r) * 0.8} />;
      })}
    </svg>
  );
};

/** Badges des plateformes. */
const Badges: React.FC<{ f: number }> = ({ f }) => {
  const out = prog(f, NEST + 6, NEST + 16);
  if (f < F30 + 10 || out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 1640, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, opacity: 1 - out }}>
      {C.platforms.map((p, i) => {
        const q = prog(f, F30 + 10 + i * 4, F30 + 20 + i * 4, eBack);
        return (
          <div key={p} style={{ padding: "14px 28px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.22)", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#fff", opacity: Math.min(1, q * 2), transform: `translateY(${(1 - q) * 30}px) scale(${lerp(0.7, 1, q)})` }}>
            {p}
          </div>
        );
      })}
    </div>
  );
};

/** Carte de fin. */
const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const st = END;
  const icon = prog(f, st + 2, st + 14, eBack);
  const word = prog(f, st + 6, st + 12, eExpo);
  const nameSize = fit(C.product, 900, 260);
  const cy = 600;
  return (
    <AbsoluteFill>
      {Array.from({ length: 40 }, (_, i) => {
        const t = f - st;
        if (t > 45) return null;
        const a = hash(i) * Math.PI * 2;
        const v = 12 + hash(i + 1) * 24;
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * v * t, top: cy + Math.sin(a) * v * t, width: 8, height: 8, borderRadius: "50%", background: i % 2 ? C.accent2 : "#fff", opacity: 1 - t / 45 }} />;
      })}
      <div style={{ position: "absolute", left: 540 - 120, top: cy - 120, width: 240, height: 240, borderRadius: 60, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${icon}) rotate(${(1 - icon) * -20}deg)`, boxShadow: `0 0 100px ${C.accent}88` }}>
        <span style={{ ...mega(170), lineHeight: 1 }}>{C.iconGlyph}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 170, textAlign: "center", opacity: word, transform: `scale(${lerp(1.5, 1, word)})` }}>
        <span style={mega(nameSize)}>{C.product}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 190 + nameSize * 0.9, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "rgba(255,255,255,0.92)", opacity: prog(f, st + 14, st + 24) }}>{C.tagline}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 280 + nameSize * 0.9, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", opacity: prog(f, st + 20, st + 30) }}>{C.platforms.join("  ·  ")}</div>
      {(() => {
        const q = prog(f, st + 26, st + 38, eBack);
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: cy + 370 + nameSize * 0.9, display: "flex", justifyContent: "center", opacity: Math.min(1, q * 2), transform: `scale(${lerp(0.8, 1, q)})` }}>
            <div style={{ padding: "24px 58px", borderRadius: 999, background: GRAD, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#fff", boxShadow: `0 0 60px ${C.accent}88` }}>{C.cta}</div>
          </div>
        );
      })()}
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 520 + nameSize * 0.9, display: "flex", justifyContent: "center", gap: 36 }}>
        {C.stores.map((k, i) => {
          const q = prog(f, st + 34 + i * 5, st + 46 + i * 5, eOut);
          return (
            <div key={k} style={{ opacity: q, transform: `translateY(${(1 - q) * 40}px)` }}>
              <StoreBtn kind={k} lang="en" />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const sfx = (n: string) => staticFile(`platforms/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: 2, src: "pop", vol: 0.25 },
  { at: 9, src: "pop", vol: 0.25 },
  { at: LAPTOP - 4, src: "whoosh", vol: 0.3 },
  { at: LAPTOP + 26, src: "land1", vol: 0.4 },
  { at: LAPTOP + 22, src: "lid", vol: 0.35 },
  { at: LAPTOP + 50, src: "success", vol: 0.22 },
  { at: TABLET - 4, src: "whoosh", vol: 0.3 },
  { at: TABLET + 30, src: "land2", vol: 0.4 },
  { at: PHONE + 4, src: "whoosh", vol: 0.25 },
  { at: PHONE + 20, src: "land3", vol: 0.42 },
  { at: FAMILY, src: "whoosh", vol: 0.3 },
  { at: F30, src: "sync", vol: 0.35 },
  ...C.platforms.map((_, i) => ({ at: F30 + 10 + i * 4, src: "pop", vol: 0.14 })),
  { at: NEST, src: "whoosh", vol: 0.3 },
  { at: N26, src: "land3", vol: 0.3 },
  { at: END, src: "impact", vol: 0.45 },
  ...C.stores.map((_, i) => ({ at: END + 34 + i * 5, src: "pop", vol: 0.16 })),
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={sfx("music")} volume={0.6} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} layout="none" name={c.src}>
        <Html5Audio src={sfx(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

export { DURATION_FRAMES };
