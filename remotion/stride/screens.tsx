import { interpolate } from "remotion";
import { clamp, eBack, eOut, prog } from "../viewz/util";
import { MapView, Ring, SH, SW } from "./parts";
import { FONT, S } from "./theme";

const txt = (size: number, weight = 600, color = S.white): React.CSSProperties => ({ fontFamily: FONT, fontSize: size, fontWeight: weight, color });

const StatusBar = () => (
  <div style={{ position: "absolute", top: 26, left: 44, right: 40, display: "flex", justifyContent: "space-between", alignItems: "center", ...txt(24, 700) }}>
    <span>9:41</span>
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
      {[8, 12, 16, 20].map((h) => (
        <div key={h} style={{ width: 5, height: h, borderRadius: 2, background: "#fff" }} />
      ))}
      <div style={{ width: 40, height: 20, borderRadius: 6, border: "2px solid #fff", marginLeft: 8, padding: 2, boxSizing: "border-box" }}>
        <div style={{ width: "78%", height: "100%", borderRadius: 3, background: S.volt }} />
      </div>
    </div>
  </div>
);

const fmtTime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};

/** Écran 1 : course en direct. */
export const RunScreen: React.FC<{ f: number; from: number }> = ({ f, from }) => {
  const l = f - from;
  const secs = 1471 + l * 0.6; // chrono accéléré
  const km = 5.02 + l * 0.0022;
  const bpm = 162 + Math.round(3 * Math.sin(l / 9));
  const heart = 1 + 0.12 * Math.max(0, Math.sin(l * 0.75));
  const mapP = interpolate(l, [0, 50], [0.55, 0.78], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, background: S.bg }}>
      <StatusBar />
      <div style={{ position: "absolute", top: 92, left: 36, right: 36, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={txt(40, 800)}>Course</span>
        <span style={{ ...txt(20, 800, "#0b0c0e"), background: S.volt, padding: "8px 16px", borderRadius: 999, letterSpacing: 2, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#0b0c0e", opacity: Math.floor(l / 8) % 2 ? 0.3 : 1 }} />
          EN DIRECT
        </span>
      </div>
      {/* carte */}
      <div style={{ position: "absolute", top: 160, left: 24, width: SW - 48, height: 400, borderRadius: 30, overflow: "hidden", background: S.panel, border: `1px solid ${S.line}` }}>
        <div style={{ position: "absolute", left: -20, top: -40 }}>
          <MapView p={mapP} k={0.5} f={f} markers={false} strokeW={16} />
        </div>
        <div style={{ position: "absolute", left: 18, bottom: 16, ...txt(18, 700, S.muted), background: "rgba(0,0,0,0.6)", padding: "6px 12px", borderRadius: 999 }}>Parc des Buttes-Chaumont</div>
      </div>
      {/* chrono */}
      <div style={{ position: "absolute", top: 590, width: "100%", textAlign: "center" }}>
        <div style={{ ...txt(20, 700, S.muted), letterSpacing: "0.25em" }}>DURÉE</div>
        <div style={{ ...txt(96, 900), fontStyle: "italic", fontStretch: "70%", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{fmtTime(secs)}</div>
      </div>
      {/* stats */}
      <div style={{ position: "absolute", top: 740, left: 24, right: 24, display: "flex", gap: 12 }}>
        {[
          { l: "DISTANCE", v: km.toFixed(2).replace(".", ","), u: "km", c: S.volt },
          { l: "ALLURE", v: "4'48\"", u: "/km", c: S.white },
          { l: "CARDIO", v: String(bpm), u: "bpm", c: S.orange },
        ].map((s, i) => (
          <div key={s.l} style={{ flex: 1, background: S.panel, borderRadius: 22, padding: "16px 14px", border: `1px solid ${S.line}` }}>
            <div style={{ ...txt(15, 700, S.muted), letterSpacing: "0.15em" }}>{s.l}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 6 }}>
              <span style={{ ...txt(38, 900, s.c), fontStyle: "italic", fontStretch: "75%", transform: i === 2 ? `scale(${heart})` : undefined, display: "inline-block" }}>{s.v}</span>
              <span style={txt(16, 600, S.muted)}>{s.u}</span>
            </div>
          </div>
        ))}
      </div>
      {/* contrôles */}
      <div style={{ position: "absolute", bottom: 60, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 46 }}>
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: S.panel2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 26, height: 26, borderRadius: 5, background: "#fff" }} />
        </div>
        <div style={{ width: 140, height: 140, borderRadius: "50%", background: S.volt, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: `0 0 ${30 + 20 * heart}px rgba(212,255,58,0.5)` }}>
          <div style={{ width: 16, height: 52, borderRadius: 4, background: "#0b0c0e" }} />
          <div style={{ width: 16, height: 52, borderRadius: 4, background: "#0b0c0e" }} />
        </div>
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: S.panel2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/** Écran 2 : résumé de la semaine. */
export const SummaryScreen: React.FC<{ f: number; from: number }> = ({ f, from }) => {
  const l = f - from;
  const rp = (d: number) => interpolate(l, [4 + d, 30 + d], [0, 1], { ...clamp, easing: eOut });
  const bars = [0.45, 0.7, 0.3, 0.85, 0.55, 1, 0.62];
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div style={{ position: "absolute", inset: 0, background: S.bg }}>
      <StatusBar />
      <div style={{ position: "absolute", top: 90, left: 36 }}>
        <div style={txt(22, 600, S.muted)}>Bonjour Léa</div>
        <div style={{ ...txt(46, 900), fontStyle: "italic", fontStretch: "75%" }}>TA SEMAINE</div>
      </div>
      {/* anneaux */}
      <div style={{ position: "absolute", top: 200, left: 24, width: SW - 48, height: 250, borderRadius: 30, background: S.panel, border: `1px solid ${S.line}` }}>
        <div style={{ position: "absolute", left: 125, top: 125 }}>
          <Ring r={90} w={20} p={0.92 * rp(0)} color={S.volt} />
          <Ring r={62} w={20} p={0.84 * rp(3)} color={S.orange} />
          <Ring r={34} w={20} p={1 * rp(6)} color={S.sky} />
        </div>
        <div style={{ position: "absolute", left: 250, top: 50, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { c: S.volt, l: "Distance", v: "32,4 / 35 km" },
            { c: S.orange, l: "Durée", v: "4h12 / 5h" },
            { c: S.sky, l: "Séances", v: "5 / 5" },
          ].map((x) => (
            <div key={x.l}>
              <div style={{ ...txt(16, 700, x.c), letterSpacing: "0.12em" }}>{x.l.toUpperCase()}</div>
              <div style={txt(24, 800)}>{x.v}</div>
            </div>
          ))}
        </div>
      </div>
      {/* graphique */}
      <div style={{ position: "absolute", top: 470, left: 24, width: SW - 48, height: 290, borderRadius: 30, background: S.panel, border: `1px solid ${S.line}`, padding: 24, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={txt(22, 800)}>Distance</span>
          <span style={txt(18, 700, S.volt)}>+18 % vs sem. passée</span>
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 50, height: 160, display: "flex", alignItems: "flex-end", gap: 16 }}>
          {bars.map((b, i) => {
            const g = interpolate(l, [6 + i * 2, 22 + i * 2], [0, 1], { ...clamp, easing: eOut });
            return <div key={i} style={{ flex: 1, height: `${b * g * 100}%`, borderRadius: 10, background: i === 5 ? S.volt : "rgba(255,255,255,0.16)", boxShadow: i === 5 ? `0 0 20px rgba(212,255,58,0.5)` : undefined }} />;
          })}
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 18, display: "flex", gap: 16 }}>
          {days.map((d, i) => (
            <span key={i} style={{ flex: 1, textAlign: "center", ...txt(16, 700, i === 5 ? S.volt : S.muted) }}>{d}</span>
          ))}
        </div>
      </div>
      {/* record */}
      {(() => {
        const q = prog(l, 22, 34, eBack);
        return (
          <div style={{ position: "absolute", top: 780, left: 24, width: SW - 48, borderRadius: 30, background: `linear-gradient(135deg, rgba(212,255,58,0.18), rgba(255,90,31,0.12))`, border: `1.5px solid rgba(212,255,58,0.5)`, padding: 22, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 20, opacity: Math.min(1, q * 2), transform: `scale(${0.85 + 0.15 * q})` }}>
            <div style={{ width: 76, height: 76, borderRadius: "50%", background: `conic-gradient(${S.volt}, ${S.orange}, ${S.volt})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", ...txt(24, 900, S.volt), fontStyle: "italic" }}>PR</div>
            </div>
            <div>
              <div style={txt(18, 700, S.muted)}>Nouveau record · 5 km</div>
              <div style={{ ...txt(44, 900), fontStyle: "italic", fontStretch: "75%" }}>23:41</div>
            </div>
          </div>
        );
      })()}
      {/* barre d'onglets */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "rgba(17,19,23,0.95)", borderTop: `1px solid ${S.line}`, display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: 18 }}>
        {["Accueil", "Courses", "Stats", "Profil"].map((t, i) => (
          <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: i === 3 ? "50%" : 8, border: `3px solid ${i === 2 ? S.volt : S.muted}` }} />
            <span style={txt(15, 700, i === 2 ? S.volt : S.muted)}>{t}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: SH - 2, height: 2 }} />
    </div>
  );
};
