import { interpolate } from "remotion";
import { clamp, eBack, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { AURORA, auroraText, goldText, N, SANS, sans, SERIF, serif } from "./theme";

/* ================= Fond aurore ================= */
export const Aurora: React.FC<{ f: number; W: number; H: number; energy: number }> = ({ f, W, H, energy }) => {
  const blobs = [
    { c: N.peri, x: 0.2, y: 0.25, r: 0.55, s: 0.006 },
    { c: N.violet, x: 0.8, y: 0.6, r: 0.6, s: 0.005 },
    { c: N.teal, x: 0.35, y: 0.85, r: 0.45, s: 0.007 },
  ];
  const D = Math.max(W, H);
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${N.bg2} 0%, ${N.bg} 70%)`, overflow: "hidden" }}>
      {blobs.map((b, i) => {
        const x = (b.x + 0.12 * Math.sin(f * b.s * 2 + i * 2)) * W;
        const y = (b.y + 0.1 * Math.cos(f * b.s * 1.6 + i)) * H;
        const r = b.r * D;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - r / 2,
              top: y - r / 2,
              width: r,
              height: r,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${b.c} 0%, transparent 65%)`,
              opacity: 0.16 + 0.22 * energy,
              filter: "blur(40px)",
            }}
          />
        );
      })}
      {/* fines lignes de lumière */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${-100} ${H * (0.3 + i * 0.2) + 60 * Math.sin(f / 60 + i)} C ${W * 0.3} ${H * (0.2 + i * 0.2)}, ${W * 0.7} ${H * (0.45 + i * 0.15) + 40 * Math.cos(f / 50 + i)}, ${W + 100} ${H * (0.35 + i * 0.2)}`}
            stroke="rgba(244,241,234,0.08)"
            strokeWidth={1.2}
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
};

/* ================= Logo ================= */
export const Star: React.FC<{ size: number; spin?: number }> = ({ size, spin = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", transform: `rotate(${spin}deg)` }}>
    <defs>
      <linearGradient id="novastar" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={N.peri} />
        <stop offset="0.5" stopColor={N.violet} />
        <stop offset="1" stopColor={N.teal} />
      </linearGradient>
    </defs>
    <path d="M50 2 C54 34 66 46 98 50 C66 54 54 66 50 98 C46 66 34 54 2 50 C34 46 46 34 50 2 Z" fill="url(#novastar)" style={{ filter: "drop-shadow(0 0 12px rgba(178,140,255,0.7))" }} />
  </svg>
);

export const Wordmark: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.18 }}>
    <Star size={size * 0.62} />
    <span style={{ ...serif(size), color: N.ink, fontStyle: "italic" }}>Nova</span>
  </div>
);

/* ================= Carte bancaire 3D ================= */
export const CARD_W = 860;
export const CARD_H = 542;
export const NovaCard: React.FC<{ f: number; ry: number; rx: number; rz?: number; sheen: number; scale?: number }> = ({ f, ry, rx, rz = 0, sheen, scale = 1 }) => {
  const face: React.CSSProperties = { position: "absolute", inset: 0, borderRadius: 40, backfaceVisibility: "hidden", overflow: "hidden" };
  return (
    <div style={{ width: CARD_W, height: CARD_H, transformStyle: "preserve-3d", transform: `scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
      {/* épaisseur */}
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, borderRadius: 40, background: i === 7 ? "#2a2c33" : "#15161b", transform: `translateZ(${-i - 1}px)` }} />
      ))}
      {/* recto */}
      <div style={{ ...face, background: "linear-gradient(135deg, #1c1e26 0%, #0b0c10 45%, #1a1b22 100%)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.12)" }}>
        {/* métal brossé */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px)" }} />
        {/* reflet holographique */}
        <div style={{ position: "absolute", top: -200, bottom: -200, width: 420, left: lerp(-600, CARD_W + 200, sheen), background: AURORA, opacity: 0.35, filter: "blur(30px)", transform: "skewX(-25deg)", mixBlendMode: "screen" }} />
        <div style={{ position: "absolute", top: -200, bottom: -200, width: 80, left: lerp(-400, CARD_W + 300, sheen), background: "rgba(255,255,255,0.35)", filter: "blur(12px)", transform: "skewX(-25deg)" }} />
        <div style={{ position: "absolute", left: 56, top: 50, display: "flex", alignItems: "center", gap: 14 }}>
          <Star size={44} />
          <span style={{ ...serif(58), color: N.ink }}>Nova</span>
        </div>
        <div style={{ position: "absolute", right: 56, top: 62, ...sans(22, 700), letterSpacing: "0.3em", color: N.gold }}>PREMIUM</div>
        {/* puce */}
        <div style={{ position: "absolute", left: 60, top: 190, width: 110, height: 84, borderRadius: 16, background: `linear-gradient(135deg, #f2dca8, ${N.gold} 50%, ${N.goldDeep})`, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.25)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 28, height: 1.5, background: "rgba(0,0,0,0.3)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 54, height: 1.5, background: "rgba(0,0,0,0.3)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 38, width: 1.5, background: "rgba(0,0,0,0.3)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 72, width: 1.5, background: "rgba(0,0,0,0.3)" }} />
        </div>
        {/* sans contact */}
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(244,241,234,0.7)" strokeWidth="1.6" strokeLinecap="round" style={{ position: "absolute", left: 196, top: 202 }}>
          <path d="M8 8.5a5 5 0 0 1 0 7M11.5 6a8.5 8.5 0 0 1 0 12M15 3.5a12 12 0 0 1 0 17" />
        </svg>
        <div style={{ position: "absolute", left: 60, top: 330, ...sans(46, 500), color: N.ink, letterSpacing: "0.14em", fontVariantNumeric: "tabular-nums" }}>•••• •••• •••• 4821</div>
        <div style={{ position: "absolute", left: 60, bottom: 48, ...sans(26, 600), color: "rgba(244,241,234,0.75)", letterSpacing: "0.18em" }}>CAMILLE MARTIN</div>
        <div style={{ position: "absolute", left: 470, bottom: 48, ...sans(26, 600), color: "rgba(244,241,234,0.75)", letterSpacing: "0.12em" }}>12/29</div>
        <div style={{ position: "absolute", right: 56, bottom: 40, display: "flex" }}>
          <div style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(244,241,234,0.85)" }} />
          <div style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(212,179,122,0.85)", marginLeft: -22, mixBlendMode: "screen" }} />
        </div>
      </div>
      {/* verso */}
      <div style={{ ...face, transform: "rotateY(180deg)", background: "linear-gradient(135deg, #15161c, #0a0b0e)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 100, background: "#000" }} />
        <div style={{ position: "absolute", left: 60, top: 220, width: 460, height: 70, borderRadius: 8, background: "repeating-linear-gradient(45deg, #e8e4da 0 6px, #d8d3c6 6px 12px)" }} />
        <div style={{ position: "absolute", left: 540, top: 236, ...sans(30, 700), color: N.ink }}>742</div>
        <div style={{ position: "absolute", left: 60, bottom: 50, ...sans(18, 500), color: N.muted, letterSpacing: "0.1em" }}>NOVA · BANQUE EN LIGNE</div>
        <div style={{ position: "absolute", right: 56, bottom: 40 }}>
          <Star size={60} />
        </div>
      </div>
    </div>
  );
};

/* ================= Notifications ================= */
export type Notif = { title: string; who: string; amount: string; plus?: boolean; at: number };
const NOTIF_H = 148;
const NOTIF_GAP = 18;
export const NotifStack: React.FC<{ f: number; items: Notif[]; width: number }> = ({ f, items, width }) => {
  const arrived = items.filter((n) => f >= n.at);
  return (
    <div style={{ position: "relative", width, height: 4 * (NOTIF_H + NOTIF_GAP) }}>
      {arrived.map((n, idx) => {
        const order = arrived.length - 1 - idx; // 0 = le plus récent (en haut)
        const drop = prog(f, n.at, n.at + 9, eBack);
        // position animée : glisse vers le bas quand une nouvelle arrive
        let slot = 0;
        arrived.forEach((m, j) => {
          if (j > idx) slot += prog(f, m.at, m.at + 9, eOut);
        });
        const y = slot * (NOTIF_H + NOTIF_GAP) + (1 - drop) * -260;
        const fade = Math.max(0, 1 - Math.max(0, slot - 2.6) * 1.2);
        const sc = 1 - Math.max(0, slot - 2) * 0.05;
        if (fade <= 0) return null;
        void order;
        return (
          <div
            key={n.at}
            style={{
              position: "absolute",
              left: 0,
              top: y,
              width,
              height: NOTIF_H,
              boxSizing: "border-box",
              borderRadius: 38,
              padding: "26px 30px",
              display: "flex",
              alignItems: "center",
              gap: 24,
              background: "linear-gradient(160deg, rgba(255,255,255,0.13), rgba(255,255,255,0.05))",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
              backdropFilter: "blur(20px)",
              opacity: Math.min(1, drop * 2) * fade,
              transform: `scale(${sc}) rotateX(${(1 - drop) * 35}deg)`,
              transformOrigin: "50% 0%",
            }}
          >
            <div style={{ width: 82, height: 82, borderRadius: 22, background: "#0b0c10", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Star size={46} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ ...sans(28, 700), color: N.ink }}>{n.title}</span>
                <span style={{ ...sans(22, 500), color: N.muted }}>maintenant</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ ...sans(30, 500), color: "rgba(244,241,234,0.8)" }}>{n.who}</span>
                <span style={{ ...sans(34, 800), color: n.plus ? N.green : N.ink, fontVariantNumeric: "tabular-nums" }}>{n.amount}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ================= Courbe qui monte ================= */
const CURVE = [0.18, 0.22, 0.2, 0.3, 0.34, 0.31, 0.45, 0.5, 0.47, 0.62, 0.7, 0.86];
export const GrowthChart: React.FC<{ f: number; from: number; w: number; h: number }> = ({ f, from, w, h }) => {
  const p = prog(f, from + 4, from + 50, eInOut);
  const pts = CURVE.map((v, i) => [(i / (CURVE.length - 1)) * w, h - v * h] as [number, number]);
  // courbe lissée (Catmull-Rom → Bézier)
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
  }
  const idx = p * (pts.length - 1);
  const i0 = Math.floor(Math.min(idx, pts.length - 2));
  const r = idx - i0;
  const hx = lerp(pts[i0][0], pts[i0 + 1][0], r);
  const hy = lerp(pts[i0][1], pts[i0 + 1][1], r);
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <svg width={w} height={h + 50} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="nvline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={N.peri} />
          <stop offset="0.6" stopColor={N.violet} />
          <stop offset="1" stopColor={N.teal} />
        </linearGradient>
        <linearGradient id="nvarea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={N.violet} stopOpacity="0.45" />
          <stop offset="1" stopColor={N.peri} stopOpacity="0" />
        </linearGradient>
        <clipPath id="nvclip">
          <rect x={-10} y={-40} width={hx + 10} height={h + 80} />
        </clipPath>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={0} x2={w} y1={h - g * h} y2={h - g * h} stroke="rgba(244,241,234,0.07)" strokeWidth={1.5} />
      ))}
      <g clipPath="url(#nvclip)">
        <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#nvarea)" />
        <path d={d} stroke="url(#nvline)" strokeWidth={7} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 12px rgba(178,140,255,0.8))" }} />
      </g>
      {pts.map(([x, y], i) => {
        const q = interpolate(idx, [i - 0.2, i + 0.3], [0, 1], clamp);
        return q > 0 ? <circle key={i} cx={x} cy={y} r={6 * q} fill={N.ink} opacity={0.6} /> : null;
      })}
      <circle cx={hx} cy={hy} r={16} fill={N.ink} style={{ filter: `drop-shadow(0 0 16px ${N.violet})` }} />
      <circle cx={hx} cy={hy} r={30 + 10 * Math.sin(f / 4)} fill="none" stroke={N.violet} strokeOpacity={0.5} strokeWidth={2} />
      {months.map((m, i) => (
        <text key={i} x={(i / (months.length - 1)) * w} y={h + 44} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={22} fill={N.muted}>
          {m}
        </text>
      ))}
    </svg>
  );
};
export const chartProgress = (f: number, from: number) => prog(f, from + 4, from + 50, eInOut);

/* ================= Téléphone à écran remplaçable ================= */
export const PW = 560;
export const PH = 1180;
export const SW = PW - 36;
export const SH = PH - 36;
export type ScreenSlot = { from: number; node: React.ReactNode };
/**
 * Téléphone dont l'écran est passé en paramètre.
 * `screens` : liste d'écrans avec leur frame d'apparition (transition en fondu + glissement).
 */
export const NovaPhone: React.FC<{ f: number; screens: ScreenSlot[]; glow?: number }> = ({ f, screens, glow = 0 }) => {
  const active = screens.filter((s) => f >= s.from);
  const cur = active[active.length - 1] ?? screens[0];
  const prev = active.length > 1 ? active[active.length - 2] : undefined;
  const t = prev ? prog(f, cur.from, cur.from + 12, eInOut) : 1;
  return (
    <div
      style={{
        width: PW,
        height: PH,
        borderRadius: 88,
        padding: 18,
        boxSizing: "border-box",
        background: "linear-gradient(145deg, #4b4d55 0%, #121318 25%, #0b0c10 60%, #3a3c44 100%)",
        boxShadow: `0 0 0 1.5px rgba(255,255,255,0.1), 0 60px 140px rgba(0,0,0,0.7), 0 0 ${60 + 80 * glow}px rgba(178,140,255,${0.12 + 0.25 * glow})`,
        position: "relative",
      }}
    >
      <div style={{ position: "relative", width: SW, height: SH, borderRadius: 70, overflow: "hidden", background: N.bg }}>
        {prev && t < 1 ? <div style={{ position: "absolute", inset: 0, opacity: 1 - t, transform: `scale(${1 - 0.05 * t})` }}>{prev.node}</div> : null}
        <div style={{ position: "absolute", inset: 0, opacity: t, transform: `translateY(${(1 - t) * 40}px)` }}>{cur.node}</div>
        <div style={{ position: "absolute", top: 20, left: SW / 2 - 66, width: 132, height: 38, borderRadius: 19, background: "#000" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(118deg, transparent 35%, rgba(255,255,255,0.07) 44%, transparent 55%)" }} />
      </div>
      <div style={{ position: "absolute", right: -5, top: 330, width: 5, height: 150, borderRadius: 3, background: "#30323a" }} />
      <div style={{ position: "absolute", left: -5, top: 260, width: 5, height: 90, borderRadius: 3, background: "#30323a" }} />
    </div>
  );
};

/* ================= Icônes ================= */
const IC: Record<string, React.ReactNode> = {
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  card: <path d="M3 6h18v12H3zM3 10h18M7 15h4" />,
  globe: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
};
export const NIcon: React.FC<{ name: string; size: number; color?: string; sw?: number }> = ({ name, size, color = N.ink, sw = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {IC[name]}
  </svg>
);

/* ================= Scène fonctionnalité (répétable) ================= */
export type Feature = { icon: string; title: string; sub: string; visual?: (f: number, from: number) => React.ReactNode };
export const FeatureScene: React.FC<{ f: number; from: number; index: number; total: number; feat: Feature; portrait: boolean; W: number; H: number }> = ({
  f,
  from,
  index,
  total,
  feat,
  portrait,
  W,
  H,
}) => {
  const l = f - from;
  const p = interpolate(l, [0, 7], [0, 1], { ...clamp, easing: eOut });
  const wipe = interpolate(l, [0, 8], [0, 100], { ...clamp, easing: eInOut });
  const textX = portrait ? 90 : 140;
  const textY = portrait ? 260 : H * 0.3;
  const vx = portrait ? W / 2 : W * 0.7;
  const vy = portrait ? H * 0.63 : H / 2;
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - wipe}% 0 0)` }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${(vx / W) * 100}% ${(vy / H) * 100}%, rgba(178,140,255,0.22), transparent 55%)` }} />
      <div style={{ position: "absolute", left: textX, top: textY, maxWidth: portrait ? W - 180 : 780 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: p }}>
          <span style={{ ...sans(28, 700), color: N.gold, letterSpacing: "0.2em" }}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div style={{ width: 80 * p, height: 1.5, background: N.gold }} />
        </div>
        <div style={{ ...sans(portrait ? 112 : 104, 800), color: N.ink, marginTop: 30, transform: `translateX(${(1 - p) * 60}px)`, opacity: p }}>{feat.title}</div>
        <div style={{ ...serif(portrait ? 60 : 54), ...auroraText, marginTop: 22, transform: `translateX(${(1 - p) * 90}px)`, opacity: p }}>{feat.sub}</div>
      </div>
      <div style={{ position: "absolute", left: vx, top: vy, transform: `translate(-50%, -50%) scale(${lerp(0.85, 1, p)})`, opacity: p }}>
        {feat.visual ? (
          feat.visual(f, from)
        ) : (
          <div style={{ position: "relative", width: 420, height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {[0, 1, 2].map((k) => {
              const q = ((l / 30 + k / 3) % 1);
              return <div key={k} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px solid rgba(178,140,255,${0.6 * (1 - q)})`, transform: `scale(${0.5 + q * 0.8})` }} />;
            })}
            <div style={{ width: 260, height: 260, borderRadius: "50%", background: "linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 80px rgba(178,140,255,0.35)" }}>
              <NIcon name={feat.icon} size={140} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { eBack, goldText, hash, SERIF };
