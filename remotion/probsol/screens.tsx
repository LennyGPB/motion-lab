import { interpolate } from "remotion";
import { FONT } from "../viewz/theme";
import { clamp, eBack, eOut } from "../viewz/util";
import { CONFIG, PSScreen } from "./config";

const C = CONFIG;
const GRAD = `linear-gradient(135deg, ${C.accent}, ${C.accent2})`;
const txt = (size: number, weight = 700, color = "#fff"): React.CSSProperties => ({ fontFamily: FONT, fontSize: size, fontWeight: weight, color, lineHeight: 1.1 });
const bar = (w: number | string, h = 14, o = 0.2): React.CSSProperties => ({ width: w, height: h, borderRadius: h / 2, background: `rgba(255,255,255,${o})` });

const Status = () => (
  <div style={{ position: "absolute", top: 26, left: 44, right: 42, display: "flex", justifyContent: "space-between", ...txt(24) }}>
    <span>9:41</span>
    <div style={{ width: 40, height: 20, borderRadius: 6, border: "2px solid #fff", padding: 2, boxSizing: "border-box" }}>
      <div style={{ width: "85%", height: "100%", borderRadius: 3, background: "#fff" }} />
    </div>
  </div>
);
const Title: React.FC<{ t: string }> = ({ t }) => <div style={{ position: "absolute", top: 96, left: 36, ...txt(46, 900), fontStyle: "italic", fontStretch: "80%" }}>{t}</div>;

/** Accueil : tâches qui se cochent. */
const Home: React.FC<{ l: number }> = ({ l }) => (
  <>
    <Title t="Aujourd'hui" />
    <div style={{ position: "absolute", top: 180, left: 30, right: 30, height: 170, borderRadius: 30, background: GRAD, padding: 26, boxSizing: "border-box" }}>
      <div style={txt(22, 700, "rgba(255,255,255,0.8)")}>Progression</div>
      <div style={{ ...txt(64, 900), marginTop: 6 }}>{Math.round(interpolate(l, [6, 40], [20, 80], { ...clamp, easing: eOut }))} %</div>
    </div>
    {[0, 1, 2, 3, 4].map((i) => {
      const q = interpolate(l, [4 + i * 4, 14 + i * 4], [0, 1], { ...clamp, easing: eOut });
      const done = interpolate(l, [18 + i * 6, 24 + i * 6], [0, 1], { ...clamp, easing: eBack });
      return (
        <div key={i} style={{ position: "absolute", top: 380 + i * 118, left: 30, right: 30, height: 100, borderRadius: 26, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 20, padding: "0 24px", opacity: q, transform: `translateX(${(1 - q) * 40}px)` }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, border: "3px solid rgba(255,255,255,0.4)", background: done > 0.5 ? GRAD : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + 0.2 * done})` }}>
            {done > 0.5 ? <span style={txt(26, 900)}>✓</span> : null}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={bar(`${70 - i * 6}%`, 16, done > 0.5 ? 0.25 : 0.55)} />
            <div style={bar("35%", 12, 0.18)} />
          </div>
        </div>
      );
    })}
  </>
);

/** Concentration : minuteur circulaire. */
const Focus: React.FC<{ l: number }> = ({ l }) => {
  const p = interpolate(l, [0, 50], [0.15, 0.72], { ...clamp, easing: eOut });
  const secs = Math.max(0, 25 * 60 - Math.round(l * 9));
  const r = 180;
  const c = 2 * Math.PI * r;
  return (
    <>
      <Title t="Focus" />
      <svg width={460} height={460} style={{ position: "absolute", top: 220, left: 32 }} viewBox="0 0 460 460">
        <defs>
          <linearGradient id="psg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.accent} />
            <stop offset="1" stopColor={C.accent2} />
          </linearGradient>
        </defs>
        <circle cx={230} cy={230} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={34} />
        <circle cx={230} cy={230} r={r} fill="none" stroke="url(#psg)" strokeWidth={34} strokeLinecap="round" strokeDasharray={`${c * p} ${c}`} transform="rotate(-90 230 230)" />
      </svg>
      <div style={{ position: "absolute", top: 390, left: 0, right: 0, textAlign: "center", ...txt(96, 900), fontVariantNumeric: "tabular-nums" }}>
        {String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", top: 720, left: 30, right: 30, display: "flex", gap: 14 }}>
        {["Notifs coupées", "Mode calme"].map((t) => (
          <div key={t} style={{ flex: 1, height: 96, borderRadius: 26, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", ...txt(24, 700) }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 860, left: 120, right: 120, height: 100, borderRadius: 50, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", ...txt(32, 800) }}>Pause</div>
    </>
  );
};

/** Terminé : validation + résumé. */
const Done: React.FC<{ l: number }> = ({ l }) => {
  const q = interpolate(l, [4, 18], [0, 1], { ...clamp, easing: eBack });
  return (
    <>
      <Title t="Bravo !" />
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 260, height: 260, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${q})`, boxShadow: `0 0 80px ${C.accent2}88` }}>
          <span style={txt(150, 900)}>✓</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 530, left: 0, right: 0, textAlign: "center", ...txt(40, 800) }}>Journée bouclée</div>
      <div style={{ position: "absolute", top: 620, left: 30, right: 30, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[0, 1, 2, 3].map((i) => {
          const p = interpolate(l, [10 + i * 4, 22 + i * 4], [0, 1], { ...clamp, easing: eOut });
          return (
            <div key={i} style={{ height: 150, borderRadius: 28, background: "rgba(255,255,255,0.07)", padding: 22, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: p }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: i % 2 ? C.accent2 : C.accent }} />
              <div style={bar("70%", 16, 0.45)} />
            </div>
          );
        })}
      </div>
    </>
  );
};

/** Écran remplaçable : ajoutez un type ici pour un nouvel écran. */
export const PSMockScreen: React.FC<{ kind: PSScreen; f: number; from: number }> = ({ kind, f, from }) => {
  const l = f - from;
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 0%, ${C.accent}40, #070a14 55%)` }}>
      <Status />
      {kind === "home" ? <Home l={l} /> : kind === "focus" ? <Focus l={l} /> : <Done l={l} />}
    </div>
  );
};
