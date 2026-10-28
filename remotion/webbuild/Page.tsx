import { interpolate } from "remotion";
import { SANS } from "../signspath/theme";
import { clamp, eBack, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { CONFIG } from "./config";
import { Block, CLICK, SCHEDULE } from "./timing";

const C = CONFIG;
export const PAGE_W = 980;
export const PAGE_H = 736;
const POP = SCHEDULE.pops;
const GRAD = `linear-gradient(135deg, ${C.accent}, ${C.accent2})`;

/** Zones des blocs (coordonnées page) — pour le cadre de sélection. */
const BOX: Record<Block, [number, number, number, number]> = {
  nav: [0, 0, PAGE_W, 72],
  title: [40, 112, 500, 160],
  sub: [40, 286, 480, 40],
  buttons: [40, 352, 420, 68],
  image: [560, 104, 380, 330],
  features: [40, 470, 900, 168],
  logos: [40, 664, 900, 44],
};
const TAG: Record<Block, string> = { nav: "nav", title: "h1", sub: "p", buttons: "button × 2", image: "img", features: "section.features", logos: "footer" };

/** Apparition d'un bloc : pop (échelle + flou + montée). */
const useAppear = (f: number, b: Block) => {
  const p = prog(f, POP[b], POP[b] + 10, eBack);
  return {
    p,
    style: {
      opacity: Math.min(1, p * 2),
      transform: `translateY(${(1 - p) * 24}px) scale(${lerp(0.94, 1, p)})`,
      filter: p < 1 ? `blur(${(1 - Math.min(1, p)) * 8}px)` : undefined,
    } as React.CSSProperties,
  };
};

/** Cadre de sélection façon outils de développement. */
const Selection: React.FC<{ f: number; b: Block }> = ({ f, b }) => {
  const [x, y, w, h] = BOX[b];
  const v = interpolate(f, [POP[b] - 3, POP[b], POP[b] + 14, POP[b] + 22], [0, 1, 1, 0], clamp);
  if (v <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - 6, top: y - 6, width: w + 12, height: h + 12, border: `2px dashed ${C.accent}`, background: `${C.accent}12`, opacity: v, borderRadius: 6 }}>
      <div style={{ position: "absolute", left: -2, top: -30, padding: "3px 10px", borderRadius: 6, background: C.accent, color: "#fff", fontFamily: "JetBrains Mono, monospace", fontSize: 16, fontWeight: 700, whiteSpace: "nowrap" }}>
        {TAG[b]} · {w}×{h}
      </div>
    </div>
  );
};

/** La page de démonstration (thème clair), construite bloc par bloc. */
export const Page: React.FC<{ f: number }> = ({ f }) => {
  const nav = useAppear(f, "nav");
  const title = useAppear(f, "title");
  const sub = useAppear(f, "sub");
  const btn = useAppear(f, "buttons");
  const img = useAppear(f, "image");
  const feat = useAppear(f, "features");
  const logos = useAppear(f, "logos");
  // survol + clic sur le bouton principal
  const hover = prog(f, CLICK - 8, CLICK - 2, eOut);
  const press = interpolate(f, [CLICK, CLICK + 3, CLICK + 9], [0, 1, 0], clamp);
  const ripple = prog(f, CLICK, CLICK + 18, eOut);
  const done = f >= CLICK + 6;
  const toast = prog(f, CLICK + 8, CLICK + 20, eBack);
  // titre : les lettres "s'écrivent" après l'apparition
  const titleChars = Math.round(interpolate(f, [POP.title, POP.title + 16], [0, C.heroTitle.join(" ").length], clamp));
  let rem = titleChars;
  const titleLines = C.heroTitle.map((l) => {
    const s = l.slice(0, Math.max(0, rem));
    rem -= l.length + 1;
    return s;
  });
  return (
    <div style={{ position: "relative", width: PAGE_W, height: PAGE_H, background: "#fbfbfe", overflow: "hidden", fontFamily: SANS }}>
      {/* grille fine de mise en page */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(108,92,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108,92,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 1 - prog(f, POP.logos, POP.logos + 20) }} />
      {/* nav */}
      <div style={{ position: "absolute", left: 0, top: 0, width: PAGE_W, height: 72, borderBottom: "1px solid #ececf4", display: "flex", alignItems: "center", padding: "0 36px", boxSizing: "border-box", background: "#fff", ...nav.style }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 26, color: "#14142b" }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: GRAD }} />
          {C.brand}
        </div>
        <div style={{ display: "flex", gap: 34, marginLeft: 120, fontSize: 20, fontWeight: 600, color: "#5b5b78" }}>
          {C.navLinks.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div style={{ marginLeft: "auto", padding: "10px 20px", borderRadius: 10, background: "#14142b", color: "#fff", fontSize: 18, fontWeight: 700 }}>Sign up</div>
      </div>
      {/* titre */}
      <div style={{ position: "absolute", left: 40, top: 112, width: 520, ...title.style }}>
        {titleLines.map((l, i) => (
          <div key={i} style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: i === 1 ? undefined : "#14142b", ...(i === 1 ? { background: GRAD, WebkitBackgroundClip: "text", color: "transparent" } : {}) }}>
            {l || " "}
          </div>
        ))}
      </div>
      {/* sous-titre */}
      <div style={{ position: "absolute", left: 40, top: 290, width: 480, fontSize: 24, color: "#5b5b78", ...sub.style }}>{C.heroSub}</div>
      {/* boutons */}
      <div style={{ position: "absolute", left: 40, top: 352, display: "flex", gap: 18, ...btn.style }}>
        <div
          style={{
            position: "relative",
            width: 210,
            height: 66,
            borderRadius: 14,
            background: done ? "#16a34a" : GRAD,
            color: "#fff",
            fontSize: 22,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${1 + 0.04 * hover - 0.07 * press})`,
            boxShadow: `0 ${10 + 10 * hover}px ${24 + 20 * hover}px ${C.accent}55`,
            overflow: "hidden",
          }}
        >
          {done ? "✓ Welcome!" : C.primaryBtn}
          {ripple > 0 && ripple < 1 ? <div style={{ position: "absolute", left: 105 - 160 * ripple, top: 33 - 160 * ripple, width: 320 * ripple, height: 320 * ripple, borderRadius: "50%", background: "rgba(255,255,255,0.45)", opacity: 1 - ripple }} /> : null}
        </div>
        <div style={{ width: 190, height: 66, borderRadius: 14, border: "2px solid #d9d9ea", color: "#14142b", fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>{C.secondaryBtn}</div>
      </div>
      {/* image héros */}
      <div style={{ position: "absolute", left: 560, top: 104, width: 380, height: 330, borderRadius: 26, background: GRAD, overflow: "hidden", boxShadow: `0 30px 60px ${C.accent}44`, ...img.style }}>
        <div style={{ position: "absolute", left: 40 + 10 * Math.sin(f / 15), top: 40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.35)" }} />
        <div style={{ position: "absolute", right: 30, bottom: 30 + 10 * Math.cos(f / 18), width: 150, height: 110, borderRadius: 22, background: "rgba(255,255,255,0.9)", padding: 16, boxSizing: "border-box" }}>
          <svg width="118" height="60" viewBox="0 0 118 60">
            <path d={`M0 50 L25 38 L45 44 L70 22 L95 26 L118 ${8 + 4 * Math.sin(f / 10)}`} stroke={C.accent} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${prog(f, POP.image + 4, POP.image + 24, eInOut)} 1`} />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 36, bottom: 40, width: 150, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.7)" }} />
        <div style={{ position: "absolute", left: 36, bottom: 70, width: 100, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.45)" }} />
      </div>
      {/* fonctionnalités */}
      <div style={{ position: "absolute", left: 40, top: 470, display: "flex", gap: 20 }}>
        {C.features.map((ft, i) => {
          const q = prog(f, POP.features + i * 3, POP.features + i * 3 + 10, eBack);
          return (
            <div key={i} style={{ width: 286, height: 168, borderRadius: 20, background: "#fff", border: "1px solid #ececf4", boxShadow: "0 12px 30px rgba(20,20,43,0.07)", padding: 24, boxSizing: "border-box", opacity: Math.min(1, q * 2) * (feat.p > 0 ? 1 : 0), transform: `translateY(${(1 - q) * 30}px) scale(${lerp(0.9, 1, q)})` }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: i === 1 ? C.accent2 : C.accent, opacity: 0.9 }} />
              <div style={{ fontSize: 26, fontWeight: 800, color: "#14142b", marginTop: 16 }}>{ft.title}</div>
              <div style={{ fontSize: 19, color: "#6b6b88", marginTop: 6 }}>{ft.text}</div>
            </div>
          );
        })}
      </div>
      {/* logos */}
      <div style={{ position: "absolute", left: 40, top: 664, width: 900, display: "flex", justifyContent: "space-between", alignItems: "center", ...logos.style }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ width: 140, height: 30, borderRadius: 8, background: "#e4e4ef", opacity: 0.6 + hash(i) * 0.4 }} />
        ))}
      </div>
      {(["nav", "title", "sub", "buttons", "image", "features", "logos"] as Block[]).map((b) => (
        <Selection key={b} f={f} b={b} />
      ))}
      {/* notification de succès */}
      {toast > 0 ? (
        <div style={{ position: "absolute", left: PAGE_W / 2 - 220, top: lerp(-80, 96, toast), width: 440, padding: "18px 24px", borderRadius: 18, background: "#14142b", color: "#fff", fontSize: 24, fontWeight: 800, textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}>{C.successToast}</div>
      ) : null}
      {f >= CLICK + 6
        ? Array.from({ length: 40 }, (_, i) => {
            const t = f - CLICK - 6;
            if (t > 45) return null;
            const a = hash(i) * Math.PI * 2;
            const v = 6 + hash(i + 2) * 12;
            return <div key={i} style={{ position: "absolute", left: 145 + Math.cos(a) * v * t, top: 385 + Math.sin(a) * v * t + 0.3 * t * t, width: 10, height: 6, borderRadius: 2, background: [C.accent, C.accent2, "#ffb703", "#ff5d8f"][i % 4], transform: `rotate(${t * 15 + i * 30}deg)`, opacity: 1 - t / 45 }} />;
          })
        : null}
    </div>
  );
};

/** Position du bouton principal (centre, coordonnées page). */
export const PRIMARY_BTN: [number, number] = [145, 385];
export { eOut };
