import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFonts as loadSans, SANS } from "../signspath/theme";
import { FONT, loadViewzFonts } from "../viewz/theme";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, lerp, prog } from "../viewz/util";
import { CONFIG, Pt, Rect } from "./config";
import { Dashboard, DashState } from "./Dashboard";
import { APP_H, APP_W, TITLE_H } from "./geometry";
import { DURATION_FRAMES, END, INTRO, STEP_LEN, stepStart } from "./timing";

loadViewzFonts();
loadSans();
const C = CONFIG;
const W = 1080;
const H = 1920;
const CX = 540;
const CY = 1010;
const FULL: Rect = [0, -TITLE_H, APP_W, APP_H + TITLE_H];
const MOVE = 22; // durée d'un mouvement de caméra

const mega = (size: number, color = "#fff"): React.CSSProperties => ({ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontStretch: "68%", fontSize: size, lineHeight: 0.92, textTransform: "uppercase", color, whiteSpace: "nowrap" });
const fit = (text: string, maxW: number, max: number) => Math.min(max, maxW / (Math.max(1, text.length) * 0.5));

/* ---------- Caméra ---------- */
const KEYS: { t: number; rect: Rect }[] = [{ t: 0, rect: FULL }, ...C.steps.flatMap((s, i) => s.zooms.map((z) => ({ t: stepStart(i) + z.at, rect: z.rect }))), { t: END - 8, rect: FULL }];
const toCam = (r: Rect) => ({ s: Math.min(2.4, 980 / r[2], 1150 / r[3]), fx: r[0] + r[2] / 2, fy: r[1] + r[3] / 2 + TITLE_H });
const camera = (f: number) => {
  let cur = toCam(KEYS[0].rect);
  for (let k = 1; k < KEYS.length; k++) {
    if (f < KEYS[k].t) break;
    const nx = toCam(KEYS[k].rect);
    const t = interpolate(f, [KEYS[k].t, KEYS[k].t + MOVE], [0, 1], { ...clamp, easing: eInOut });
    cur = { s: Math.exp(lerp(Math.log(cur.s), Math.log(nx.s), t)), fx: lerp(cur.fx, nx.fx, t), fy: lerp(cur.fy, nx.fy, t) };
  }
  return cur;
};
/** Point de l'app → écran. */
const toScreen = (f: number, [u, v]: Pt): Pt => {
  const c = camera(f);
  return [CX + c.s * (u - c.fx), CY + c.s * (v + TITLE_H - c.fy)];
};

/* ---------- Curseur ---------- */
const CLICKS = C.steps.flatMap((s, i) => s.clicks.map((c) => ({ t: stepStart(i) + c.at, pt: c.pt })));
const WAY = [{ t: 36, pt: [1350, 900] as Pt }, ...CLICKS];
const cursorAt = (f: number): Pt => {
  let p = WAY[0].pt;
  for (let k = 1; k < WAY.length; k++) {
    const a = WAY[k - 1];
    const b = WAY[k];
    const t0 = Math.max(a.t + 4, b.t - 26);
    const t = interpolate(f, [t0, b.t - 2], [0, 1], { ...clamp, easing: eInOut });
    if (f < t0) return p;
    const dx = b.pt[0] - a.pt[0];
    const dy = b.pt[1] - a.pt[1];
    const bow = Math.sin(t * Math.PI) * 0.12;
    p = [lerp(a.pt[0], b.pt[0], t) - dy * bow, lerp(a.pt[1], b.pt[1], t) + dx * bow];
  }
  return p;
};

/* ---------- État du tableau de bord ---------- */
const dashState = (f: number): DashState => {
  const s: DashState = { rangeOpen: 0, rangeHover: -1, morph: 0, selected90: false, point: 0, pointIdx: 8, exportPress: 0, exportLoading: 0, toast: 0 };
  C.steps.forEach((st, i) => {
    const t0 = stepStart(i);
    const c0 = t0 + (st.clicks[0]?.at ?? 0);
    if (st.effect === "range") {
      const c1 = t0 + (st.clicks[1]?.at ?? st.clicks[0].at + 20);
      s.rangeOpen = prog(f, c0, c0 + 6, eOut) * (1 - prog(f, c1 + 2, c1 + 8));
      s.rangeHover = f >= c1 - 12 && f < c1 + 6 ? 2 : -1;
      s.morph = prog(f, c1 + 2, c1 + 28, eInOut);
      s.selected90 = f >= c1 + 1;
    } else if (st.effect === "point") {
      s.point = prog(f, c0 + 1, c0 + 9, eOut);
    } else if (st.effect === "export") {
      s.exportPress = interpolate(f, [c0, c0 + 3, c0 + 8], [0, 1, 0], clamp);
      s.exportLoading = prog(f, c0 + 2, c0 + 14);
      s.toast = prog(f, c0 + 14, c0 + 24, eBack);
    }
  });
  return s;
};

/** "Product demo with cursor" (1080x1920). */
export const Demo: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  const prev = camera(Math.max(0, f - 1));
  const speed = Math.abs(Math.log(cam.s) - Math.log(prev.s)) * 60 + (Math.hypot(cam.fx - prev.fx, cam.fy - prev.fy) * cam.s) / 30;
  const intro = prog(f, 0, 34, eOut);
  const outro = prog(f, END - 4, END + 26, eInOut);
  const cy = lerp(CY, 640, outro);
  const s = cam.s * lerp(1, 0.78, outro) * lerp(0.82, 1, intro);
  const [cx0, cy0] = cursorAt(f);
  const lastClick = CLICKS.filter((c) => f >= c.t).pop();
  const press = lastClick ? interpolate(f, [lastClick.t, lastClick.t + 3, lastClick.t + 8], [1, 0.82, 1], clamp) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.wallpaper[0] }}>
      <AbsoluteFill style={{ background: `linear-gradient(160deg, ${C.wallpaper[0]} 0%, ${C.wallpaper[1]} 55%, ${C.wallpaper[2]} 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${30 + 10 * Math.sin(f / 60)}% 30%, rgba(255,255,255,0.18), transparent 40%), radial-gradient(circle at 80% 85%, rgba(255,200,220,0.2), transparent 45%)` }} />
      {/* fenêtre de l'app filmée */}
      <AbsoluteFill style={{ perspective: 2400 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: APP_W,
            transformOrigin: "0 0",
            transform: `translate(${CX - s * cam.fx}px, ${cy - s * cam.fy}px) scale(${s})`,
            filter: speed > 0.4 ? `blur(${Math.min(4, speed * 1.2)}px)` : undefined,
            opacity: intro,
          }}
        >
          <div style={{ transform: `rotateX(${lerp(22, 0, intro) + 10 * outro}deg) rotateY(${-14 * outro}deg)`, transformOrigin: "50% 50%", borderRadius: 18, overflow: "hidden", boxShadow: "0 60px 140px rgba(10,8,40,0.55), 0 0 0 1px rgba(255,255,255,0.1)" }}>
            <div style={{ height: TITLE_H, background: "#e8e9f1", display: "flex", alignItems: "center", gap: 9, padding: "0 18px", fontFamily: SANS }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
              ))}
              <span style={{ marginLeft: "auto", marginRight: "auto", fontSize: 17, fontWeight: 700, color: "#6b6f8a" }}>{C.appName} — Overview</span>
            </div>
            <div style={{ position: "relative" }}>
              <Dashboard f={f} s={dashState(f)} />
              {/* clics : anneau */}
              {CLICKS.map((c, i) => {
                const q = prog(f, c.t, c.t + 16, eOut);
                if (q <= 0 || q >= 1) return null;
                return <div key={i} style={{ position: "absolute", left: c.pt[0] - 40, top: c.pt[1] - 40, width: 80, height: 80, borderRadius: "50%", border: `4px solid ${C.accent}`, background: `${C.accent}22`, transform: `scale(${0.3 + q})`, opacity: 1 - q }} />;
              })}
              {/* curseur */}
              {f >= 36 && f < END + 4 ? (
                <div style={{ position: "absolute", left: cx0, top: cy0, transform: `scale(${press * 1.25})`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.3))", opacity: prog(f, 36, 42) }}>
                  <svg width="30" height="38" viewBox="0 0 24 30">
                    <path d="M2 2 L2 24 L8 18.5 L12 28 L16 26.2 L12 17 L20 17 Z" fill="#121527" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </AbsoluteFill>
      {/* bandeau du haut (devant la fenêtre) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 420, background: `linear-gradient(180deg, ${C.wallpaper[0]}f0 0%, ${C.wallpaper[0]}aa 55%, transparent 100%)`, opacity: prog(f, INTRO, INTRO + 10) * (1 - prog(f, END - 4, END + 4)) }} />
      <TopBar f={f} />
      {/* bulles d'explication */}
      {C.steps.map((st, i) => (
        <Callout key={i} f={f} i={i} />
      ))}
      {f >= END - 2 ? <EndCard f={f} /> : null}
      <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "overlay" }}>
        <svg width={W} height={H}>
          <filter id="dmgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#dmgrain)" />
        </svg>
      </AbsoluteFill>
      <Sound />
    </AbsoluteFill>
  );
};

/** Haut de l'écran : accroche, puis progression des étapes. */
const TopBar: React.FC<{ f: number }> = ({ f }) => {
  const head = 1 - prog(f, INTRO - 4, INTRO + 4, eIn);
  const steps = prog(f, INTRO, INTRO + 10) * (1 - prog(f, END - 4, END + 4));
  const cur = Math.min(C.steps.length - 1, Math.max(0, Math.floor((f - INTRO) / STEP_LEN)));
  return (
    <>
      {f >= END - 2 ? (
        <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {C.outroLine.map((l, i) => {
            const q = prog(f, END + 6 + i * 8, END + 12 + i * 8, eExpo);
            return (
              <div key={i} style={{ ...mega(fit(l, 960, i ? 110 : 170)), opacity: Math.min(1, q * 3), transform: `scale(${lerp(1.5, 1, q)})` }}>
                {l}
              </div>
            );
          })}
        </div>
      ) : null}
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: head }}>
        {C.headline.map((l, i) => {
          const q = prog(f, 4 + i * 8, 10 + i * 8, eExpo);
          return (
            <div key={i} style={{ ...mega(fit(l, 960, 170)), opacity: Math.min(1, q * 3), transform: `scale(${lerp(1.5, 1, q)})` }}>
              {l}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 110, left: 70, right: 70, opacity: steps }}>
        <div style={{ display: "flex", gap: 12 }}>
          {C.steps.map((_, i) => {
            const fill = i < cur ? 1 : i === cur ? prog(f, stepStart(i), stepStart(i) + STEP_LEN) : 0;
            return (
              <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
                <div style={{ width: `${fill * 100}%`, height: "100%", background: "#fff" }} />
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 26, fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "rgba(255,255,255,0.9)", letterSpacing: "0.2em" }}>
          STEP {cur + 1} OF {C.steps.length}
        </div>
      </div>
    </>
  );
};

/** Bulle d'explication ancrée sur un point de l'app. */
const Callout: React.FC<{ f: number; i: number }> = ({ f, i }) => {
  const st = C.steps[i];
  const t0 = stepStart(i) + st.callout.at;
  const t1 = stepStart(i) + STEP_LEN - 6;
  const p = prog(f, t0, t0 + 12, eBack);
  const out = prog(f, t1, t1 + 8, eIn);
  if (p <= 0 || out >= 1) return null;
  const [ax, ay] = toScreen(f, st.callout.pt);
  const BW = 640;
  const below = ay < 1250;
  const bx = Math.max(50, Math.min(W - 50 - BW, ax - 140));
  const by = below ? ay + 64 : ay - 64;
  const arrowX = Math.max(40, Math.min(BW - 40, ax - bx));
  return (
    <>
      <div style={{ position: "absolute", left: ax - 22, top: ay - 22, width: 44, height: 44, borderRadius: "50%", border: "4px solid #fff", boxShadow: `0 0 0 6px ${C.accent}88`, opacity: p * (1 - out), transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(f / 4)})` }} />
      <div style={{ position: "absolute", left: bx, top: below ? by : undefined, bottom: below ? undefined : H - by, width: BW, opacity: Math.min(1, p * 2) * (1 - out), transform: `scale(${lerp(0.8, 1, p)}) translateY(${(1 - p) * (below ? -20 : 20)}px)`, transformOrigin: `${arrowX}px ${below ? 0 : "100%"}` }}>
        <div style={{ position: "absolute", left: arrowX - 16, [below ? "top" : "bottom"]: -14, width: 32, height: 32, background: "#fff", transform: "rotate(45deg)", borderRadius: 6 }} />
        <div style={{ position: "relative", borderRadius: 30, background: "#fff", padding: "30px 34px", boxShadow: "0 30px 70px rgba(10,8,40,0.4)", fontFamily: SANS }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, color: "#fff", fontWeight: 900, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#121527", letterSpacing: -0.5 }}>{st.callout.title}</div>
          </div>
          <div style={{ fontSize: 31, fontWeight: 500, color: "#5d6180", marginTop: 14 }}>{st.callout.text}</div>
        </div>
      </div>
    </>
  );
};

/** Carte de fin. */
const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const st = END;
  const word = prog(f, st + 14, st + 22, eExpo);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={{ ...mega(fit(C.product, 960, 170)), opacity: word, transform: `scale(${lerp(1.5, 1, word)})`, filter: word < 1 ? `blur(${(1 - word) * 12}px)` : undefined, textShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>{C.product}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "rgba(255,255,255,0.95)", opacity: prog(f, st + 22, st + 32), transform: `translateY(${(1 - prog(f, st + 22, st + 32, eOut)) * 20}px)` }}>{C.tagline}</div>
      {(() => {
        const q = prog(f, st + 30, st + 42, eBack);
        return <div style={{ marginTop: 20, padding: "26px 58px", borderRadius: 999, background: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#121527", opacity: Math.min(1, q * 2), transform: `scale(${lerp(0.8, 1, q)})`, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>{C.cta}</div>;
      })()}
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: "rgba(255,255,255,0.85)", opacity: prog(f, st + 40, st + 50) }}>{C.url}</div>
    </div>
  );
};

/* ---------- Son ---------- */
const sfx = (n: string) => staticFile(`demo/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: 0, src: "whoosh", vol: 0.25 },
  ...KEYS.slice(1).map((k) => ({ at: k.t, src: "zoom", vol: 0.28 })),
  ...CLICKS.map((c) => ({ at: c.t, src: "click", vol: 0.5 })),
  ...C.steps.map((s, i) => ({ at: stepStart(i) + s.callout.at, src: "pop", vol: 0.22 })),
  ...C.steps.flatMap((s, i) => (s.effect === "range" ? [{ at: stepStart(i) + s.clicks[0].at + 4, src: "tick", vol: 0.25 }] : [])),
  ...C.steps.flatMap((s, i) => (s.effect === "export" ? [{ at: stepStart(i) + s.clicks[0].at + 14, src: "success", vol: 0.32 }] : [])),
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={sfx("music")} volume={0.7} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} layout="none" name={c.src}>
        <Html5Audio src={sfx(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

export { DURATION_FRAMES };
