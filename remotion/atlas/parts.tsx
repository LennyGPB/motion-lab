import { interpolate } from "remotion";
import { clamp, eBack, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { A, caps, sans, serif, sky, warmText } from "./theme";
import { CITIES, DOTS } from "./world";

/* ================= Ciel + effets cinéma ================= */
export const Sky: React.FC<{ f: number; W: number; H: number; tod: number }> = ({ f, W, H, tod }) => {
  const c = sky(tod);
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${c.top} 0%, ${c.mid} 62%, ${c.low} 100%)` }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,5,4,0.55) 0%, rgba(10,5,4,0.15) 55%, rgba(10,5,4,0.55) 100%)" }} />
      {/* halos chauds (light leaks) */}
      {[0, 1].map((i) => {
        const x = (i ? 0.85 : 0.1) * W + 120 * Math.sin(f / (70 + i * 20) + i);
        const y = (i ? 0.2 : 0.75) * H + 80 * Math.cos(f / 80 + i);
        const r = Math.max(W, H) * 0.7;
        return <div key={i} style={{ position: "absolute", left: x - r / 2, top: y - r / 2, width: r, height: r, borderRadius: "50%", background: `radial-gradient(circle, ${i ? "rgba(255,150,80,0.35)" : "rgba(255,90,120,0.25)"} 0%, transparent 60%)`, mixBlendMode: "screen" }} />;
      })}
    </div>
  );
};

/** Poussière qui flotte dans la lumière. */
export const Dust: React.FC<{ f: number; W: number; H: number; n?: number }> = ({ f, W, H, n = 50 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const x = (hash(i) * W + Math.sin(f / 50 + i) * 30 + f * (0.15 + hash(i + 2) * 0.3)) % W;
      const y = (hash(i + 7) * H - f * (0.2 + hash(i + 9) * 0.4) + H * 2) % H;
      const s = 2 + hash(i + 4) * 4;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: A.cream, opacity: 0.15 + 0.4 * hash(i + 11) * (0.5 + 0.5 * Math.sin(f / 12 + i)), filter: "blur(1px)" }} />;
    })}
  </>
);

/** Reflet d'objectif (traînée + cercles) depuis une source lumineuse. */
export const Flare: React.FC<{ x: number; y: number; W: number; H: number; k: number }> = ({ x, y, W, H, k }) => {
  if (k <= 0) return null;
  const cx = W / 2;
  const cy = H / 2;
  return (
    <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: k, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x - W, top: y - 3, width: W * 2, height: 6, background: "linear-gradient(90deg, transparent, rgba(255,200,140,0.7), transparent)", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", left: x - 220, top: y - 220, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,180,0.75), rgba(255,160,80,0.2) 35%, transparent 65%)" }} />
      {[0.4, 0.75, 1.3, 1.7].map((d, i) => {
        const fx = x + (cx - x) * d * 2;
        const fy = y + (cy - y) * d * 2;
        const r = [60, 30, 110, 45][i];
        return <div key={i} style={{ position: "absolute", left: fx - r, top: fy - r, width: r * 2, height: r * 2, borderRadius: "50%", background: ["rgba(255,180,100,0.18)", "rgba(255,120,140,0.25)", "rgba(255,200,120,0.1)", "rgba(180,140,255,0.15)"][i] }} />;
      })}
    </div>
  );
};

/** Bandes cinéma (s'ouvrent au début). */
export const Letterbox: React.FC<{ f: number; W: number; H: number; portrait: boolean }> = ({ f, W, H, portrait }) => {
  const open = prog(f, 0, 50, eInOut);
  const bar = portrait ? lerp(H * 0.5, H * 0.045, open) : lerp(H * 0.5, H * 0.07, open);
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: bar, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: bar, background: "#000" }} />
    </>
  );
};

/* ================= Logo ================= */
export const Mark: React.FC<{ size: number; draw?: number }> = ({ size, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="atlasg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={A.sun} />
        <stop offset="0.6" stopColor={A.orange} />
        <stop offset="1" stopColor={A.rose} />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="44" fill="none" stroke="url(#atlasg)" strokeWidth="5" pathLength={1} strokeDasharray={`${draw} 1`} transform="rotate(-90 50 50)" />
    <ellipse cx="50" cy="50" rx="18" ry="44" fill="none" stroke="url(#atlasg)" strokeWidth="3" opacity={draw} />
    <path d="M10 50 H90" stroke="url(#atlasg)" strokeWidth="3" opacity={draw} />
    <path d="M18 72 Q50 10 84 34" fill="none" stroke={A.cream} strokeWidth="4" strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
    <circle cx="84" cy="34" r="6" fill={A.cream} opacity={draw} />
  </svg>
);
export const Wordmark: React.FC<{ size: number; draw?: number }> = ({ size, draw = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.22 }}>
    <Mark size={size * 0.9} draw={draw} />
    <span style={{ ...sans(size * 0.78, 300), letterSpacing: "0.28em", color: A.cream }}>ATLAS</span>
  </div>
);

/* ================= Arc d'avion ================= */
export const FlightMap: React.FC<{ f: number; from: number; w: number; h: number }> = ({ f, from, w, h }) => {
  const l = f - from;
  const p = prog(l, 20, 110, eInOut);
  const P = CITIES.paris;
  const K = CITIES.kyoto;
  const ax = P.x * w;
  const ay = P.y * h;
  const bx = K.x * w;
  const by = K.y * h;
  const cx = (ax + bx) / 2;
  const cy = Math.min(ay, by) - h * 0.32;
  const q = (t: number): [number, number] => [(1 - t) ** 2 * ax + 2 * (1 - t) * t * cx + t * t * bx, (1 - t) ** 2 * ay + 2 * (1 - t) * t * cy + t * t * by];
  const [px, py] = q(p);
  const [tx, ty] = q(Math.min(1, p + 0.01));
  const ang = (Math.atan2(ty - py, tx - px) * 180) / Math.PI;
  const dots = prog(l, 0, 30, eOut);
  const pulse = (l % 40) / 40;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="arcg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={A.sun} />
          <stop offset="1" stopColor={A.rose} />
        </linearGradient>
      </defs>
      {DOTS.map(([x, y], i) => (
        <circle key={i} cx={x * w} cy={y * h} r={w * 0.0028} fill={A.cream} opacity={(0.12 + 0.18 * hash(i)) * (hash(i * 3) < dots ? 1 : 0)} />
      ))}
      <path d={`M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`} fill="none" stroke="rgba(255,241,222,0.25)" strokeWidth={3} strokeDasharray="4 12" />
      <path d={`M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`} fill="none" stroke="url(#arcg)" strokeWidth={5} pathLength={1} strokeDasharray={`${p} 1`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${A.orange})` }} />
      {[
        { x: ax, y: ay, c: P, on: prog(l, 6, 18, eBack) },
        { x: bx, y: by, c: K, on: prog(l, 100, 112, eBack) },
      ].map((pt) => (
        <g key={pt.c.code} transform={`translate(${pt.x} ${pt.y})`} opacity={pt.on}>
          <circle r={14 + pulse * 40} fill="none" stroke={A.amber} strokeWidth={2} opacity={1 - pulse} />
          <circle r={11 * pt.on} fill={A.sun} style={{ filter: `drop-shadow(0 0 12px ${A.amber})` }} />
          <text y={-32} textAnchor="middle" fontFamily="Manrope" fontWeight={800} fontSize={30} fill={A.cream} letterSpacing={4}>
            {pt.c.code}
          </text>
          <text y={48} textAnchor="middle" fontFamily="'Instrument Serif'" fontStyle="italic" fontSize={38} fill={A.cream}>
            {pt.c.name}
          </text>
        </g>
      ))}
      {p > 0 && p < 1 ? (
        <g transform={`translate(${px} ${py}) rotate(${ang})`}>
          <path d="M 22 0 L -10 -16 L -4 0 L -10 16 Z M -2 0 L -16 -6 L -18 0 L -16 6 Z" fill={A.cream} style={{ filter: `drop-shadow(0 0 10px ${A.sun})` }} transform="scale(1.6)" />
        </g>
      ) : null}
    </svg>
  );
};

/* ================= Paysages illustrés ================= */
export type SceneKind = "lisbon" | "marrakech" | "kyoto";
const PAL: Record<SceneKind, { sky: [string, string, string]; sun: string; far: string; near: string }> = {
  lisbon: { sky: ["#3b1d2a", "#e2774a", "#ffcf86"], sun: "#ffe2a8", far: "#9a4a3e", near: "#3a1712" },
  marrakech: { sky: ["#43160f", "#d9542b", "#ffb15c"], sun: "#ffd890", far: "#8e3a22", near: "#2c0f08" },
  kyoto: { sky: ["#2a1436", "#c2557a", "#ffa98a"], sun: "#ffd3c0", far: "#6a3550", near: "#221020" },
};
export const Landscape: React.FC<{ kind: SceneKind; f: number; w: number; h: number }> = ({ kind, f, w, h }) => {
  const P = PAL[kind];
  const drift = f * 0.25;
  const sx = w * 0.62;
  const sy = h * 0.5 - f * 0.12;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sk-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.sky[0]} />
          <stop offset="0.6" stopColor={P.sky[1]} />
          <stop offset="1" stopColor={P.sky[2]} />
        </linearGradient>
        <radialGradient id={`sg-${kind}`}>
          <stop offset="0" stopColor={P.sun} stopOpacity="0.9" />
          <stop offset="1" stopColor={P.sun} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#sk-${kind})`} />
      <circle cx={sx} cy={sy} r={w * 0.5} fill={`url(#sg-${kind})`} opacity={0.5} />
      <circle cx={sx} cy={sy} r={w * 0.11} fill={P.sun} />
      {/* nuages fins */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={((hash(i) * w + drift * (1 + i * 0.3)) % (w * 1.4)) - w * 0.3} y={h * (0.18 + i * 0.09)} width={w * (0.3 + hash(i + 3) * 0.3)} height={6} rx={3} fill="#fff" opacity={0.18} />
      ))}
      {kind === "lisbon" ? <Lisbon w={w} h={h} far={P.far} near={P.near} drift={drift} /> : kind === "marrakech" ? <Marrakech w={w} h={h} far={P.far} near={P.near} drift={drift} /> : <Kyoto w={w} h={h} far={P.far} near={P.near} drift={drift} />}
    </svg>
  );
};

type LP = { w: number; h: number; far: string; near: string; drift: number };
const Lisbon: React.FC<LP> = ({ w, h, far, near, drift }) => {
  const houses = Array.from({ length: 16 }, (_, i) => ({ x: (i / 16) * w * 1.1 - 20, hh: 40 + hash(i) * 70, ww: w * 0.06 + hash(i + 1) * w * 0.03 }));
  return (
    <>
      <path d={`M0 ${h * 0.68} Q ${w * 0.3} ${h * 0.56} ${w * 0.55} ${h * 0.64} T ${w} ${h * 0.6} V ${h} H 0 Z`} fill={far} transform={`translate(${-drift * 0.3} 0)`} />
      <rect x={w * 0.22} y={h * 0.42} width={w * 0.05} height={h * 0.2} fill={far} />
      <path d={`M${w * 0.215} ${h * 0.42} L ${w * 0.245} ${h * 0.37} L ${w * 0.275} ${h * 0.42} Z`} fill={far} />
      <g transform={`translate(${-drift * 0.6} 0)`}>
        <path d={`M0 ${h * 0.78} Q ${w * 0.4} ${h * 0.7} ${w * 1.2} ${h * 0.76} V ${h} H 0 Z`} fill={near} />
        {houses.map((hs, i) => (
          <g key={i}>
            <rect x={hs.x} y={h * 0.76 - hs.hh - i * 1.5} width={hs.ww} height={hs.hh + 40} fill={near} />
            <path d={`M${hs.x - 4} ${h * 0.76 - hs.hh - i * 1.5} L ${hs.x + hs.ww / 2} ${h * 0.76 - hs.hh - 22 - i * 1.5} L ${hs.x + hs.ww + 4} ${h * 0.76 - hs.hh - i * 1.5} Z`} fill={near} />
            {hash(i + 20) > 0.4 ? <rect x={hs.x + hs.ww * 0.35} y={h * 0.76 - hs.hh * 0.6} width={hs.ww * 0.3} height={hs.hh * 0.22} fill="#ffcf86" opacity={0.7} /> : null}
          </g>
        ))}
      </g>
    </>
  );
};
const Marrakech: React.FC<LP> = ({ w, h, far, near, drift }) => (
  <>
    <path d={`M0 ${h * 0.7} Q ${w * 0.25} ${h * 0.62} ${w * 0.5} ${h * 0.68} T ${w} ${h * 0.64} V ${h} H 0 Z`} fill={far} transform={`translate(${-drift * 0.3} 0)`} />
    <g transform={`translate(${-drift * 0.6} 0)`}>
      <rect x={w * 0.3} y={h * 0.3} width={w * 0.09} height={h * 0.5} fill={near} />
      <rect x={w * 0.315} y={h * 0.25} width={w * 0.06} height={h * 0.06} fill={near} />
      <rect x={w * 0.335} y={h * 0.2} width={w * 0.02} height={h * 0.06} fill={near} />
      <path d={`M${w * 0.5} ${h * 0.66} A ${w * 0.12} ${w * 0.12} 0 0 1 ${w * 0.74} ${h * 0.66} Z`} fill={near} />
      <rect x={w * 0.45} y={h * 0.66} width={w * 0.34} height={h * 0.2} fill={near} />
      {[0.1, 0.86].map((px, i) => (
        <g key={i} transform={`translate(${w * px} ${h * 0.82})`}>
          <path d={`M0 0 Q ${w * 0.01} ${-h * 0.15} ${w * 0.004} ${-h * 0.28}`} stroke={near} strokeWidth={w * 0.012} fill="none" />
          {[-60, -25, 10, 45, 80].map((a, k) => (
            <path key={k} d={`M ${w * 0.004} ${-h * 0.28} q ${Math.cos((a * Math.PI) / 180) * w * 0.06} ${-h * 0.03} ${Math.cos((a * Math.PI) / 180) * w * 0.11} ${h * 0.03 + Math.sin((a * Math.PI) / 180) * h * 0.02}`} stroke={near} strokeWidth={w * 0.012} fill="none" strokeLinecap="round" />
          ))}
        </g>
      ))}
      <rect x={-w * 0.2} y={h * 0.8} width={w * 1.5} height={h * 0.2} fill={near} />
    </g>
  </>
);
const Kyoto: React.FC<LP> = ({ w, h, far, near, drift }) => (
  <>
    <path d={`M0 ${h * 0.62} L ${w * 0.2} ${h * 0.45} L ${w * 0.38} ${h * 0.58} L ${w * 0.6} ${h * 0.4} L ${w * 0.85} ${h * 0.56} L ${w} ${h * 0.5} V ${h} H 0 Z`} fill={far} opacity={0.8} transform={`translate(${-drift * 0.2} 0)`} />
    <g transform={`translate(${-drift * 0.5} 0)`}>
      <path d={`M0 ${h * 0.8} Q ${w * 0.5} ${h * 0.74} ${w * 1.2} ${h * 0.8} V ${h} H 0 Z`} fill={near} />
      {[0, 1, 2, 3, 4].map((i) => {
        const yy = h * (0.74 - i * 0.075);
        const ww = w * (0.28 - i * 0.04);
        const x0 = w * 0.38 - ww / 2;
        return (
          <g key={i}>
            <rect x={x0 + ww * 0.2} y={yy - h * 0.05} width={ww * 0.6} height={h * 0.05} fill={near} />
            <path d={`M ${x0 - w * 0.03} ${yy - h * 0.045} Q ${x0 + ww / 2} ${yy - h * 0.085} ${x0 + ww + w * 0.03} ${yy - h * 0.045} L ${x0 + ww} ${yy - h * 0.03} L ${x0} ${yy - h * 0.03} Z`} fill={near} />
          </g>
        );
      })}
      <rect x={w * 0.375} y={h * 0.32} width={w * 0.01} height={h * 0.08} fill={near} />
      <g transform={`translate(${w * 0.78} ${h * 0.6})`}>
        <rect x={-w * 0.1} y={0} width={w * 0.02} height={h * 0.22} fill="#b8332a" />
        <rect x={w * 0.08} y={0} width={w * 0.02} height={h * 0.22} fill="#b8332a" />
        <path d={`M ${-w * 0.13} ${-h * 0.01} Q 0 ${-h * 0.04} ${w * 0.13} ${-h * 0.01} L ${w * 0.12} ${h * 0.02} L ${-w * 0.12} ${h * 0.02} Z`} fill="#b8332a" />
        <rect x={-w * 0.11} y={h * 0.045} width={w * 0.22} height={h * 0.015} fill="#b8332a" />
      </g>
    </g>
  </>
);

/* ================= Carte destination (répétable) ================= */
export type Dest = { city: string; country: string; price: number; temp: number; kind: SceneKind };
export const DestCard: React.FC<{ d: Dest; f: number; w: number; h: number; reveal: number }> = ({ d, f, w, h, reveal }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 44, overflow: "hidden", boxShadow: "0 50px 120px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(255,241,222,0.18)" }}>
    <div style={{ position: "absolute", inset: 0, transform: `scale(${1.15 - 0.1 * reveal})` }}>
      <Landscape kind={d.kind} f={f} w={w} h={h} />
    </div>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(10,4,2,0.85) 100%)" }} />
    <div style={{ position: "absolute", left: 50, right: 50, bottom: 50 }}>
      <div style={{ ...caps(24), color: A.amber, opacity: reveal }}>{d.country}</div>
      <div style={{ ...serif(w * 0.17), color: A.cream, marginTop: 10, transform: `translateY(${(1 - reveal) * 30}px)`, opacity: reveal }}>{d.city}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 26, opacity: reveal }}>
        <div style={{ padding: "14px 26px", borderRadius: 999, background: "rgba(255,241,222,0.14)", border: "1px solid rgba(255,241,222,0.3)", ...sans(30, 600), color: A.cream }}>
          dès <span style={{ ...sans(40, 800) }}>{Math.round(d.price * reveal)} €</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...sans(40, 700), color: A.cream }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={A.sun} strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" fill={A.sun} />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          {Math.round(d.temp * reveal)}°
        </div>
      </div>
    </div>
  </div>
);

/* ================= Écran de réservation ================= */
export const BookingScreen: React.FC<{ f: number; from: number; press: number; booked: number; sw: number; sh: number }> = ({ f, from, press, booked, sw, sh }) => {
  const l = f - from;
  const row = (i: number) => prog(l, 14 + i * 5, 28 + i * 5, eOut);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#160c09" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: sw, height: 430, overflow: "hidden" }}>
        <Landscape kind="lisbon" f={f} w={sw} h={430} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(22,12,9,1) 100%)" }} />
        <div style={{ position: "absolute", top: 26, left: 44, right: 40, display: "flex", justifyContent: "space-between", ...sans(24, 700), color: A.cream }}>
          <span>9:41</span>
          <span>●●●</span>
        </div>
        <div style={{ position: "absolute", left: 40, bottom: 30 }}>
          <div style={{ ...caps(18), color: A.amber }}>Portugal</div>
          <div style={{ ...serif(84), color: A.cream }}>Lisbonne</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 450, left: 30, right: 30, display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { k: "Dates", v: "12 – 16 juin · 2 voyageurs" },
          { k: "Vol", v: "CDG 08:40 → LIS 10:15 · direct" },
          { k: "Hôtel", v: "Casa Alfama ★★★★" },
        ].map((r, i) => (
          <div key={r.k} style={{ padding: "18px 24px", borderRadius: 24, background: "rgba(255,241,222,0.06)", border: "1px solid rgba(255,241,222,0.08)", opacity: row(i), transform: `translateY(${(1 - row(i)) * 20}px)` }}>
            <div style={{ ...caps(15), color: A.muted }}>{r.k}</div>
            <div style={{ ...sans(26, 700), color: A.cream, marginTop: 6 }}>{r.v}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 190, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: row(3) }}>
        <span style={{ ...sans(26, 600), color: A.muted }}>Total</span>
        <span style={{ ...sans(56, 800), color: A.cream }}>389 €</span>
      </div>
      {/* bouton */}
      <div
        style={{
          position: "absolute",
          left: 30,
          right: 30,
          bottom: 60,
          height: 110,
          borderRadius: 55,
          background: booked > 0.5 ? A.green : `linear-gradient(90deg, ${A.amber}, ${A.orange})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          transform: `scale(${1 - 0.06 * Math.sin(press * Math.PI)})`,
          boxShadow: `0 0 ${40 + 30 * press}px rgba(255,150,70,0.5)`,
          ...sans(36, 800),
          color: "#1a0d08",
          overflow: "hidden",
          opacity: row(4),
        }}
      >
        {booked > 0.5 ? "Réservé ✓" : "Réserver"}
        {press > 0 && press < 1 ? <div style={{ position: "absolute", width: 600 * press, height: 600 * press, borderRadius: "50%", background: "rgba(255,255,255,0.35)", opacity: 1 - press }} /> : null}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: sh - 2 }} />
    </div>
  );
};

/* ================= Billet ================= */
export const Ticket: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, borderRadius: 34, background: A.cream, color: "#1a0d08", padding: 36, boxSizing: "border-box", boxShadow: "0 40px 90px rgba(0,0,0,0.55)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ ...caps(20), color: A.orange }}>Carte d'embarquement</div>
      <Mark size={46} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 26 }}>
      <div>
        <div style={{ ...sans(80, 800), letterSpacing: -2 }}>CDG</div>
        <div style={{ ...sans(22, 600), color: "#7a5a48" }}>Paris · 08:40</div>
      </div>
      <svg width="90" height="40" viewBox="0 0 90 40">
        <path d="M5 30 Q45 0 85 30" fill="none" stroke={A.orange} strokeWidth="3" strokeDasharray="5 6" />
      </svg>
      <div style={{ textAlign: "right" }}>
        <div style={{ ...sans(80, 800), letterSpacing: -2 }}>LIS</div>
        <div style={{ ...sans(22, 600), color: "#7a5a48" }}>Lisbonne · 10:15</div>
      </div>
    </div>
    <div style={{ borderTop: "3px dashed rgba(26,13,8,0.2)", margin: "28px -36px 22px" }} />
    <div style={{ display: "flex", justifyContent: "space-between", ...sans(24, 700) }}>
      <span>12 JUIN</span>
      <span>SIÈGE 14A</span>
      <span>VOL AT 214</span>
    </div>
    <div style={{ display: "flex", gap: 3, marginTop: 22, height: 70 }}>
      {Array.from({ length: 60 }, (_, i) => (
        <div key={i} style={{ flex: hash(i) > 0.6 ? 2 : 1, background: hash(i + 9) > 0.25 ? "#1a0d08" : "transparent" }} />
      ))}
    </div>
  </div>
);

export { clamp, interpolate, warmText };
