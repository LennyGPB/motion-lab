import { interpolate } from "remotion";
import { FONT } from "../viewz/theme";
import { clamp, eOut, hash } from "../viewz/util";
import { CONFIG, ScreenKind } from "./config";

const C = CONFIG;
const grad = `linear-gradient(135deg, ${C.accent}, ${C.accent2})`;
const txt = (size: number, weight = 700, color = "#fff"): React.CSSProperties => ({ fontFamily: FONT, fontSize: size, fontWeight: weight, color, lineHeight: 1.1 });
const bar = (w: number | string, h = 14, o = 0.18): React.CSSProperties => ({ width: w, height: h, borderRadius: h / 2, background: `rgba(255,255,255,${o})` });

const Status = () => (
  <div style={{ position: "absolute", top: 26, left: 44, right: 42, display: "flex", justifyContent: "space-between", ...txt(24) }}>
    <span>9:41</span>
    <div style={{ width: 40, height: 20, borderRadius: 6, border: "2px solid #fff", padding: 2, boxSizing: "border-box" }}>
      <div style={{ width: "75%", height: "100%", borderRadius: 3, background: "#fff" }} />
    </div>
  </div>
);
const Header: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ position: "absolute", top: 92, left: 36, right: 36, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ ...txt(44, 900), fontStyle: "italic", fontStretch: "80%" }}>{title}</span>
    <div style={{ width: 56, height: 56, borderRadius: "50%", background: grad }} />
  </div>
);
const Tabs: React.FC<{ active: number }> = ({ active }) => (
  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 118, background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: 14, boxSizing: "border-box" }}>
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ width: 34, height: 34, borderRadius: i === 3 ? "50%" : 10, background: i === active ? grad : "transparent", border: i === active ? "none" : "3px solid rgba(255,255,255,0.35)" }} />
    ))}
  </div>
);

/** Fil d'actualité : cartes avec visuels en dégradé. */
const Feed: React.FC<{ l: number }> = ({ l }) => (
  <>
    <Header title="Accueil" />
    <div style={{ position: "absolute", top: 180, left: 30, right: 30, display: "flex", gap: 16 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ width: 92, height: 92, borderRadius: "50%", padding: 4, background: i === 0 ? grad : "rgba(255,255,255,0.15)", flexShrink: 0 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `hsl(${220 + i * 40},60%,${30 + i * 5}%)` }} />
        </div>
      ))}
    </div>
    {[0, 1].map((i) => {
      const q = interpolate(l, [4 + i * 6, 18 + i * 6], [0, 1], { ...clamp, easing: eOut });
      return (
        <div key={i} style={{ position: "absolute", top: 310 + i * 400, left: 30, right: 30, height: 380, borderRadius: 32, overflow: "hidden", background: "rgba(255,255,255,0.05)", opacity: q, transform: `translateY(${(1 - q) * 40}px)` }}>
          <div style={{ height: 250, background: i === 0 ? grad : `linear-gradient(135deg, ${C.accent2}, #ffb35b)`, position: "relative" }}>
            <div style={{ position: "absolute", right: 24, top: 24, ...txt(20, 800), background: "rgba(0,0,0,0.35)", padding: "6px 14px", borderRadius: 999 }}>NOUVEAU</div>
          </div>
          <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={bar("70%", 18, 0.5)} />
            <div style={bar("45%")} />
          </div>
        </div>
      );
    })}
    <Tabs active={0} />
  </>
);

/** Statistiques : gros chiffre + graphique en barres. */
const Stats: React.FC<{ l: number }> = ({ l }) => {
  const v = interpolate(l, [4, 30], [0, 1], { ...clamp, easing: eOut });
  return (
    <>
      <Header title="Aperçu" />
      <div style={{ position: "absolute", top: 190, left: 36 }}>
        <div style={txt(22, 600, "rgba(255,255,255,0.55)")}>Cette semaine</div>
        <div style={{ ...txt(110, 900), fontStyle: "italic", fontStretch: "75%", fontVariantNumeric: "tabular-nums" }}>{Math.round(2480 * v).toLocaleString("fr-FR").replace(/ /g, " ")}</div>
        <div style={{ ...txt(24, 800), background: grad, WebkitBackgroundClip: "text", color: "transparent" }}>▲ +32 %</div>
      </div>
      <div style={{ position: "absolute", top: 470, left: 30, right: 30, height: 360, borderRadius: 32, background: "rgba(255,255,255,0.05)", padding: 26, boxSizing: "border-box", display: "flex", alignItems: "flex-end", gap: 16 }}>
        {[0.4, 0.65, 0.5, 0.85, 0.6, 1, 0.75].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h * 100 * interpolate(l, [6 + i * 2, 22 + i * 2], [0, 1], { ...clamp, easing: eOut })}%`, borderRadius: 12, background: i === 5 ? grad : "rgba(255,255,255,0.18)" }} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 860, left: 30, right: 30, display: "flex", gap: 16 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ flex: 1, height: 140, borderRadius: 28, background: "rgba(255,255,255,0.05)", padding: 22, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: i ? C.accent2 : C.accent }} />
            <div style={bar("70%", 14, 0.35)} />
          </div>
        ))}
      </div>
      <Tabs active={1} />
    </>
  );
};

/** Messagerie : bulles qui arrivent. */
const Chat: React.FC<{ l: number }> = ({ l }) => {
  const msgs = [
    { me: false, w: 300 },
    { me: true, w: 260 },
    { me: false, w: 360 },
    { me: true, w: 200 },
    { me: false, w: 240 },
  ];
  return (
    <>
      <Header title="Messages" />
      {msgs.map((m, i) => {
        const q = interpolate(l, [3 + i * 5, 10 + i * 5], [0, 1], { ...clamp, easing: eOut });
        return (
          <div key={i} style={{ position: "absolute", top: 200 + i * 150, left: m.me ? undefined : 30, right: m.me ? 30 : undefined, display: "flex", alignItems: "flex-end", gap: 12, flexDirection: m.me ? "row-reverse" : "row", opacity: q, transform: `scale(${0.8 + 0.2 * q})`, transformOrigin: m.me ? "100% 100%" : "0% 100%" }}>
            {!m.me ? <div style={{ width: 54, height: 54, borderRadius: "50%", background: `hsl(${200 + hash(i) * 120},60%,45%)` }} /> : null}
            <div style={{ width: m.w, padding: "22px 24px", borderRadius: 30, background: m.me ? grad : "rgba(255,255,255,0.09)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={bar("90%", 14, m.me ? 0.7 : 0.4)} />
              {m.w > 250 ? <div style={bar("55%", 14, m.me ? 0.5 : 0.25)} /> : null}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 140, height: 84, borderRadius: 42, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: grad }} />
      </div>
      <Tabs active={2} />
    </>
  );
};

/** Écran générique (fond + contenu selon le type). */
export const MockScreen: React.FC<{ kind: ScreenKind; f: number; from: number }> = ({ kind, f, from }) => {
  const l = f - from;
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 0%, ${C.accent}33, ${C.bg} 55%)` }}>
      <Status />
      {kind === "feed" ? <Feed l={l} /> : kind === "stats" ? <Stats l={l} /> : <Chat l={l} />}
    </div>
  );
};
