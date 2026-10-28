import { interpolate } from "remotion";
import { AppleLogo, PlayLogo } from "../viewz/Bits";
import { clamp, eOut, hash, lerp } from "../viewz/util";
import { routePath, routePoint, STREETS } from "./route";
import { FONT, mega, S } from "./theme";

export const PW = 560;
export const PH = 1180;
export const SW = PW - 36;
export const SH = PH - 36;

/** Cadre de téléphone (contenu libre). */
export const PhoneFrame: React.FC<{ children: React.ReactNode; glow?: number }> = ({ children, glow = 0 }) => (
  <div
    style={{
      width: PW,
      height: PH,
      borderRadius: 86,
      padding: 18,
      boxSizing: "border-box",
      background: "linear-gradient(145deg, #3c3f46 0%, #0d0e11 30%, #1c1e23 70%, #4a4d55 100%)",
      boxShadow: `0 0 0 2px rgba(255,255,255,0.08), 0 0 ${50 + glow * 90}px rgba(212,255,58,${0.12 + glow * 0.25}), 0 60px 120px rgba(0,0,0,0.7)`,
      position: "relative",
    }}
  >
    <div style={{ position: "relative", width: SW, height: SH, borderRadius: 68, overflow: "hidden", background: S.bg }}>
      {children}
      <div style={{ position: "absolute", top: 20, left: SW / 2 - 66, width: 132, height: 38, borderRadius: 19, background: "#000" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.08) 45%, transparent 56%)", pointerEvents: "none" }} />
    </div>
    <div style={{ position: "absolute", left: -5, top: 260, width: 5, height: 90, borderRadius: 3, background: "#2b2d33" }} />
    <div style={{ position: "absolute", right: -5, top: 330, width: 5, height: 150, borderRadius: 3, background: "#2b2d33" }} />
  </div>
);

/** Anneau de progression. */
export const Ring: React.FC<{ r: number; w: number; p: number; color: string; track?: string }> = ({ r, w, p, color, track = "rgba(255,255,255,0.07)" }) => {
  const c = 2 * Math.PI * r;
  const size = (r + w) * 2;
  const end = -Math.PI / 2 + p * Math.PI * 2;
  return (
    <svg width={size} height={size} style={{ position: "absolute", left: -size / 2, top: -size / 2, overflow: "visible" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={w} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        strokeDasharray={`${c * p} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 ${w * 0.35}px ${color})` }}
      />
      {p > 0.01 ? <circle cx={size / 2 + Math.cos(end) * r} cy={size / 2 + Math.sin(end) * r} r={w * 0.32} fill="#fff" opacity={0.9} /> : null}
    </svg>
  );
};

/** Carte + tracé GPS (boîte 1000x1000 mise à l'échelle k). */
export const MapView: React.FC<{ p: number; k: number; f: number; streets?: number; dot?: boolean; markers?: boolean; strokeW?: number }> = ({
  p,
  k,
  f,
  streets = 1,
  dot = true,
  markers = true,
  strokeW = 14,
}) => {
  const [dx, dy] = routePoint(p);
  const pulse = (f % 20) / 20;
  return (
    <svg width={1000 * k} height={1000 * k} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`rg${k}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={S.orange} />
          <stop offset="1" stopColor={S.volt} />
        </linearGradient>
      </defs>
      <g opacity={streets}>
        {/* parc + fleuve */}
        <path d={`M ${80 * k} ${120 * k} h ${260 * k} v ${220 * k} h ${-260 * k} z`} fill="rgba(212,255,58,0.05)" />
        <path d={`M ${-40 * k} ${460 * k} C ${300 * k} ${400 * k}, ${500 * k} ${720 * k}, ${1040 * k} ${640 * k}`} stroke="rgba(58,214,255,0.13)" strokeWidth={46 * k} fill="none" />
        {STREETS.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1 * k} y1={y1 * k} x2={x2 * k} y2={y2 * k} stroke="rgba(255,255,255,0.09)" strokeWidth={(i % 4 === 0 ? 5 : 2) * k} />
        ))}
      </g>
      <path d={routePath(p, k)} stroke={`url(#rg${k})`} strokeWidth={strokeW * 2.4 * k} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.18} />
      <path d={routePath(p, k)} stroke={`url(#rg${k})`} strokeWidth={strokeW * k} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {markers
        ? [0.25, 0.5, 0.75].map((m, i) => {
            if (p < m) return null;
            const [mx, my] = routePoint(m);
            const q = interpolate(p, [m, m + 0.05], [0, 1], { ...clamp, easing: eOut });
            return (
              <g key={i} transform={`translate(${mx * k} ${my * k}) scale(${q})`}>
                <circle r={26 * k} fill={S.bg} stroke={S.white} strokeWidth={4 * k} />
                <text textAnchor="middle" dy={9 * k} fontFamily={FONT} fontWeight={800} fontSize={26 * k} fill="#fff">
                  {i + 1}
                </text>
              </g>
            );
          })
        : null}
      {dot ? (
        <g transform={`translate(${dx * k} ${dy * k})`}>
          <circle r={(22 + pulse * 40) * k} fill="none" stroke={S.volt} strokeWidth={3 * k} opacity={1 - pulse} />
          <circle r={18 * k} fill={S.volt} style={{ filter: `drop-shadow(0 0 ${14 * k}px ${S.volt})` }} />
          <circle r={7 * k} fill="#000" />
        </g>
      ) : null}
    </svg>
  );
};

/** Scène stat réutilisable : gros compteur qui défile + libellé. */
export const StatScene: React.FC<{
  f: number;
  from: number;
  value: number;
  format: (v: number) => string;
  unit: string;
  label: string;
  invert?: boolean;
  accent?: string;
}> = ({ f, from, value, format, unit, label, invert, accent = S.volt }) => {
  const local = f - from;
  const p = interpolate(local, [0, 17], [0, 1], { ...clamp, easing: eOut });
  const inP = interpolate(local, [0, 5], [0, 1], { ...clamp, easing: eOut });
  const bg = invert ? S.volt : S.bg;
  const fg = invert ? "#0b0c0e" : S.white;
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, overflow: "hidden" }}>
      {/* bandes de vitesse */}
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 120 + i * 180,
            left: ((hash(i) * 1400 - local * (30 + hash(i + 3) * 40)) % 1600) - 300,
            width: 300 + hash(i + 1) * 500,
            height: 4,
            background: invert ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.06)",
          }}
        />
      ))}
      <div style={{ position: "absolute", top: 520, left: 70, ...mega(40, invert ? "#0b0c0e" : accent), fontStyle: "normal", fontStretch: "100%", fontWeight: 800, letterSpacing: "0.3em", opacity: inP }}>
        {label}
      </div>
      <div style={{ position: "absolute", top: 600, left: 50, display: "flex", alignItems: "baseline", transform: `translateY(${(1 - inP) * 120}px) skewX(${(1 - inP) * -12}deg)`, filter: inP < 1 ? `blur(${(1 - inP) * 10}px)` : undefined }}>
        <span style={{ ...mega(430, fg), fontVariantNumeric: "tabular-nums" }}>{format(lerp(0, value, p))}</span>
      </div>
      <div style={{ position: "absolute", top: 1020, left: 70, display: "flex", alignItems: "center", gap: 24, opacity: inP }}>
        <div style={{ width: lerp(0, 220, p), height: 16, background: invert ? "#0b0c0e" : accent, transform: "skewX(-20deg)" }} />
        <span style={{ ...mega(120, invert ? "#0b0c0e" : accent) }}>{unit}</span>
      </div>
    </div>
  );
};

/** Particules (confettis + étincelles) avec gravité. */
const PARTS = Array.from({ length: 140 }, (_, i) => ({
  a: hash(i) * Math.PI * 2,
  v: 14 + hash(i + 1) * 30,
  s: 8 + hash(i + 2) * 18,
  rot: hash(i + 3) * 360,
  spin: (hash(i + 4) - 0.5) * 30,
  c: [S.volt, S.orange, S.white, S.sky][i % 4],
  kind: i % 3,
}));
export const Burst: React.FC<{ t: number; cx: number; cy: number }> = ({ t, cx, cy }) => {
  if (t < 0) return null;
  return (
    <>
      {PARTS.map((p, i) => {
        const x = cx + Math.cos(p.a) * p.v * t * (1 - t * 0.012);
        const y = cy + Math.sin(p.a) * p.v * t + 0.35 * t * t;
        const o = Math.max(0, 1 - t / 55);
        if (o <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.kind === 2 ? p.s * 0.4 : p.s,
              height: p.kind === 1 ? p.s * 0.4 : p.s,
              borderRadius: p.kind === 0 ? "50%" : 2,
              background: p.c,
              opacity: o,
              transform: `rotate(${p.rot + p.spin * t}deg)`,
              boxShadow: p.kind === 0 ? `0 0 10px ${p.c}` : undefined,
            }}
          />
        );
      })}
    </>
  );
};

/** Icône d'app + logotype Stride. */
export const AppIcon: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      background: `linear-gradient(135deg, ${S.volt}, #9fe000)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 0 ${size * 0.4}px rgba(212,255,58,0.5)`,
    }}
  >
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="#0b0c0e">
      <path d="M6 20 L12.5 4 h4.5 L10.5 20 z" />
      <path d="M13 20 L16.6 11 h4.4 L17.4 20 z" />
      <path d="M2 20 L4.2 14.5 h4.4 L6.4 20 z" />
    </svg>
  </div>
);

export const Wordmark: React.FC<{ size: number; color?: string }> = ({ size, color = S.white }) => (
  <span style={{ ...mega(size, color), fontStretch: "72%" }}>
    STRIDE<span style={{ color: S.volt }}>.</span>
  </span>
);

export const StoreBtn: React.FC<{ kind: "apple" | "google"; lang?: "fr" | "en" }> = ({ kind, lang = "fr" }) => (
  <div
    style={{
      width: 420,
      height: 126,
      borderRadius: 28,
      background: "#000",
      border: "2px solid rgba(255,255,255,0.75)",
      display: "flex",
      alignItems: "center",
      gap: 20,
      paddingLeft: 34,
      boxSizing: "border-box",
      color: "#fff",
      fontFamily: FONT,
    }}
  >
    {kind === "apple" ? <AppleLogo /> : <PlayLogo />}
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
      <span style={{ fontSize: 22, fontWeight: 500 }}>{kind === "apple" ? (lang === "en" ? "Download on the" : "Télécharger dans") : lang === "en" ? "GET IT ON" : "DISPONIBLE SUR"}</span>
      <span style={{ fontSize: 46, fontWeight: 700, letterSpacing: -1 }}>{kind === "apple" ? (lang === "en" ? "App Store" : "l'App Store") : "Google Play"}</span>
    </div>
  </div>
);
