import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFonts as loadSans } from "../signspath/theme";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "../viewz/util";
import { CONFIG } from "./config";
import { BAR, MONO, ResultWindow, TerminalBody, WIN_H, WIN_W } from "./parts";
import { DURATION_FRAMES, END, EXPLODE, SHOW, TERM, TERM_IN, TYPING_END, WARP } from "./timing";

loadSans();
const C = CONFIG;
const W = 1080;
const H = 1920;
const CY = 1010;
const TW = 960;
const TH = 720;

/** Interpolation par images-clés (adoucie). */
const kf = (f: number, keys: [number, number][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) return interpolate(f, [keys[i - 1][0], keys[i][0]], [keys[i - 1][1], keys[i][1]], { ...clamp, easing: eInOut });
  }
  return keys[keys.length - 1][1];
};
const E28 = EXPLODE + 28;

/** "The terminal" (1080x1920). */
export const TerminalAd: React.FC = () => {
  const f = useCurrentFrame();
  // pose de la scène
  const stRx = kf(f, [[EXPLODE, 0], [E28, 52], [END, 52], [END + 14, 0]]);
  const stRz = kf(f, [[EXPLODE, 0], [E28, -26], [END, -36], [END + 14, 0]]);
  const stS = kf(f, [[EXPLODE, 1], [E28, 0.72], [END, 0.75]]);
  // terminal
  const tIn = prog(f, TERM_IN, TERM_IN + 18, eOut);
  const T = {
    x: kf(f, [[WARP, 0], [WARP + 22, -330], [EXPLODE, -330], [E28, -150], [END, -150], [END + 14, 0]]),
    y: kf(f, [[EXPLODE, 0], [E28, -110]]),
    z: kf(f, [[WARP, 0], [WARP + 22, -900], [EXPLODE, -900], [E28, 0], [END, 0], [END + 14, -700]]),
    ry: kf(f, [[TERM_IN, -10], [WARP, -6 + 3 * Math.sin(f / 30)], [WARP + 22, -60], [EXPLODE, -60], [E28, 0]]),
    rx: kf(f, [[TERM_IN, 26], [TERM_IN + 26, 8], [WARP, 5], [E28, 0]]),
    s: kf(f, [[TERM_IN + 20, 1], [WARP - 4, 1.05], [WARP + 22, 1]]),
    op: tIn * kf(f, [[WARP, 1], [WARP + 22, 0.4], [EXPLODE, 0.4], [E28, 1], [END, 1], [END + 14, 0]]),
  };
  // fenêtre résultat
  const R = {
    x: kf(f, [[EXPLODE, 0], [E28, 120]]),
    y: kf(f, [[EXPLODE, 0], [E28, 110]]),
    z: kf(f, [[WARP + 4, -2600], [SHOW + 8, 0], [EXPLODE, 0], [E28, 260], [END, 260], [END + 14, -700]]),
    ry: kf(f, [[WARP + 4, 55], [SHOW + 8, -16], [(SHOW + EXPLODE) / 2, 6], [EXPLODE, 16], [E28, 0]]),
    rx: kf(f, [[WARP + 4, 18], [SHOW + 8, 8], [EXPLODE, 4], [E28, 0]]),
    op: prog(f, WARP + 4, WARP + 12) * (1 - prog(f, END, END + 14)),
  };
  const highlight = prog(f, TYPING_END + 4, TYPING_END + 12) * (1 - prog(f, WARP, WARP + 10));
  const sweep = (a: number) => prog(f, a, a + 24, eInOut);
  // glitch
  const glitches = [TERM_IN, WARP, EXPLODE, END];
  const gl = Math.max(0, ...glitches.map((g) => (f >= g && f < g + 6 ? 1 - (f - g) / 6 : 0)));
  const flash = Math.max(f >= WARP + 4 ? 0.8 * Math.exp(-(f - WARP - 4) / 3) : 0, f >= END ? 0.6 * Math.exp(-(f - END) / 3) : 0);
  return (
    <AbsoluteFill style={{ background: "#030507", overflow: "hidden" }}>
      <Backdrop f={f} />
      <AbsoluteFill style={{ transform: `translate(${gl * (hash(f) - 0.5) * 30}px, ${gl * (hash(f + 1) - 0.5) * 10}px)` }}>
        {/* boot : curseur seul */}
        {f < TERM_IN + 6 ? (
          <div style={{ position: "absolute", left: W / 2 - 20, top: CY - 30, width: 40, height: 60, background: C.accent, opacity: Math.floor(f / 6) % 2 === 0 ? 1 : 0.15, boxShadow: `0 0 30px ${C.accent}`, transform: `scaleY(${1 - prog(f, TERM_IN - 4, TERM_IN + 4)})` }} />
        ) : null}
        <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: `50% ${CY}px` }}>
          <div style={{ position: "absolute", left: W / 2, top: CY, transformStyle: "preserve-3d", transform: `rotateX(${stRx}deg) rotateZ(${stRz}deg) scale(${stS})` }}>
            {/* plaque de base (vue éclatée) */}
            {f >= EXPLODE ? (
              <div style={{ position: "absolute", left: -620, top: -560, width: 1240, height: 1120, transform: "translateZ(-80px)", borderRadius: 40, border: `2px solid ${C.accent}55`, backgroundImage: `linear-gradient(${C.accent}22 1px, transparent 1px), linear-gradient(90deg, ${C.accent}22 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: prog(f, EXPLODE + 6, E28) * (1 - prog(f, END, END + 12)), boxShadow: `0 0 80px ${C.accent}33` }} />
            ) : null}
            {/* symboles de code flottants */}
            <Glyphs f={f} />
            {/* terminal */}
            <div
              style={{
                position: "absolute",
                left: -TW / 2,
                top: -TH / 2,
                width: TW,
                height: TH,
                transform: `translate3d(${T.x}px, ${T.y}px, ${T.z}px) rotateY(${T.ry}deg) rotateX(${T.rx}deg) scale(${T.s})`,
                opacity: T.op,
                clipPath: f < TERM_IN + 18 ? `inset(${(1 - tIn) * 49.5}% 0 ${(1 - tIn) * 49.5}% 0 round 18px)` : undefined,
                borderRadius: 18,
                overflow: "hidden",
                background: "rgba(10,14,20,0.94)",
                boxShadow: `0 0 0 1px rgba(255,255,255,0.1), 0 50px 120px rgba(0,0,0,0.7), 0 0 ${60 + 40 * highlight}px ${C.accent}${f < WARP ? "33" : "11"}`,
                filter: f > WARP && f < E28 ? `blur(${kf(f, [[WARP, 0], [WARP + 22, 3], [EXPLODE, 3], [E28, 0]])}px)` : undefined,
              }}
            >
              <div style={{ height: BAR, display: "flex", alignItems: "center", gap: 9, padding: "0 16px", background: "#161b22" }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
                ))}
                <div style={{ marginLeft: "auto", marginRight: "auto", fontFamily: MONO, fontSize: 15, color: "#8b949e" }}>zsh — ~/dev</div>
              </div>
              <TerminalBody f={f} highlight={highlight} />
              <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 1px, transparent 1px 3px)", pointerEvents: "none" }} />
              {f < TERM_IN + 22 ? <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0.5 * (1 - prog(f, TERM_IN, TERM_IN + 20)) }} /> : null}
            </div>
            {/* fenêtre résultat (écran remplaçable, jamais animé à l'intérieur) */}
            {f >= WARP + 2 ? (
              <div
                style={{
                  position: "absolute",
                  left: -WIN_W / 2,
                  top: -(WIN_H + BAR) / 2,
                  width: WIN_W,
                  transform: `translate3d(${R.x}px, ${R.y}px, ${R.z}px) rotateY(${R.ry}deg) rotateX(${R.rx}deg) scale(${kf(f, [[SHOW, 0.92], [EXPLODE, 0.92], [E28, 1]])})`,
                  opacity: R.op,
                }}
              >
                <div style={{ position: "relative", borderRadius: 16, boxShadow: `0 60px 140px rgba(0,0,0,0.75), 0 0 90px ${C.accent2}33` }}>
                  <ResultWindow />
                  {/* balayages de lumière */}
                  {[SHOW + 14, SHOW + 110].map((a) => {
                    const s = sweep(a);
                    if (s <= 0 || s >= 1) return null;
                    return <div key={a} style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden" }}><div style={{ position: "absolute", top: -200, bottom: -200, width: 220, left: lerp(-400, WIN_W + 200, s), background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)", transform: "skewX(-22deg)" }} /></div>;
                  })}
                </div>
                {/* reflet au sol */}
                <div style={{ marginTop: 24, transform: "scaleY(-1)", opacity: 0.22 * (1 - prog(f, EXPLODE, EXPLODE + 12)), WebkitMaskImage: "linear-gradient(0deg, rgba(0,0,0,0.9), transparent 45%)", filter: "blur(2px)" }}>
                  <ResultWindow />
                </div>
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
        {/* étiquettes de la vue éclatée */}
        {f >= EXPLODE + 20 && f < END + 4 ? (
          <>
            {[
              { t: "// your app", x: 600, y: 600, d: 0 },
              { t: "// terminal", x: 90, y: 1530, d: 6 },
            ].map((l) => (
              <div key={l.t} style={{ position: "absolute", left: l.x, top: l.y, fontFamily: MONO, fontWeight: 800, fontSize: 34, color: C.accent, padding: "8px 16px", border: `2px solid ${C.accent}`, borderRadius: 10, background: "rgba(3,5,7,0.8)", opacity: prog(f, EXPLODE + 20 + l.d, EXPLODE + 30 + l.d) * (1 - prog(f, END - 6, END)) }}>
                {l.t}
              </div>
            ))}
          </>
        ) : null}
      </AbsoluteFill>
      <Warp f={f} />
      <Captions f={f} />
      {f >= END - 1 ? <EndCard f={f} /> : null}
      {/* glitch : tranches décalées */}
      {gl > 0 ? (
        <AbsoluteFill style={{ mixBlendMode: "screen" }}>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: (hash(f * 3 + i) - 0.5) * 80, top: hash(f + i * 7) * H, width: W, height: 6 + hash(i + f) * 40, background: i % 2 ? `${C.accent}66` : "#ff2bd666", opacity: gl }} />
          ))}
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ background: "#eafff5", opacity: flash }} />
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 4px)", opacity: 0.5 }} />
      <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: "overlay" }}>
        <svg width={W} height={H}>
          <filter id="tmgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#tmgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.8) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

/** Fond : pluie de code + sol en grille qui défile. */
const Backdrop: React.FC<{ f: number }> = ({ f }) => {
  const on = prog(f, TERM_IN, TERM_IN + 30);
  const chars = "01{}<>/=;$#@npmgitapi";
  return (
    <AbsoluteFill style={{ opacity: on }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${C.accent}18, transparent 50%)` }} />
      {Array.from({ length: 18 }, (_, c) => {
        const x = c * 60 + 20;
        const speed = 4 + hash(c) * 6;
        const off = (f * speed + hash(c + 9) * H) % (H + 600);
        return (
          <div key={c} style={{ position: "absolute", left: x, top: off - 600, fontFamily: MONO, fontSize: 26, lineHeight: "30px", color: C.accent, opacity: 0.07 + 0.08 * hash(c + 3), whiteSpace: "pre" }}>
            {Array.from({ length: 20 }, (_, r) => chars[Math.floor(hash(c * 31 + r + Math.floor(f / 6)) * chars.length)]).join("\n")}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: -600, right: -600, top: 1350, height: 1400, transform: "perspective(900px) rotateX(72deg)", transformOrigin: "50% 0%", backgroundImage: `linear-gradient(${C.accent}55 2px, transparent 2px), linear-gradient(90deg, ${C.accent}55 2px, transparent 2px)`, backgroundSize: "80px 80px", backgroundPosition: `0 ${(f * 6) % 80}px`, WebkitMaskImage: "linear-gradient(180deg, transparent, black 30%)", opacity: 0.55 }} />
    </AbsoluteFill>
  );
};

/** Symboles de code flottant en 3D autour des fenêtres. */
const GLYPHS = ["{ }", "</>", "npm", "=>", "api.get()", "200 OK", "git push", "★", "λ", "async", "[ ]", "0x1F"];
const Glyphs: React.FC<{ f: number }> = ({ f }) => {
  const v = prog(f, SHOW - 4, SHOW + 16) * (1 - prog(f, END - 6, END + 4));
  if (v <= 0) return null;
  return (
    <>
      {GLYPHS.map((g, i) => {
        const a = (i / GLYPHS.length) * Math.PI * 2 + f * 0.008;
        const r = 560 + hash(i) * 160;
        const x = Math.cos(a) * r * 0.85;
        const z = Math.sin(a) * r;
        const y = -300 + hash(i + 5) * 900 + 20 * Math.sin(f / 20 + i);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%)`, fontFamily: MONO, fontWeight: 800, fontSize: 30 + hash(i + 2) * 30, color: i % 3 ? C.accent : C.accent2, opacity: v * (0.35 + 0.5 * ((Math.sin(a) + 1) / 2)), textShadow: `0 0 20px ${i % 3 ? C.accent : C.accent2}`, whiteSpace: "nowrap" }}>
            {g}
          </div>
        );
      })}
    </>
  );
};

/** Hyperespace : traînées radiales autour du warp. */
const Warp: React.FC<{ f: number }> = ({ f }) => {
  const t = f - (WARP - 8);
  if (t < 0 || t > 30) return null;
  const k = t < 14 ? t / 14 : 1 - (t - 14) / 16;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen" }}>
      {Array.from({ length: 70 }, (_, i) => {
        const a = hash(i) * Math.PI * 2;
        const r0 = 80 + hash(i + 1) * 300 + t * 40;
        const len = (60 + hash(i + 2) * 400) * k;
        return <div key={i} style={{ position: "absolute", left: W / 2 + Math.cos(a) * r0, top: CY + Math.sin(a) * r0, width: len, height: 2 + hash(i + 3) * 3, background: `linear-gradient(90deg, transparent, ${i % 3 ? C.accent : "#fff"})`, transform: `rotate(${(a * 180) / Math.PI}deg)`, transformOrigin: "0 50%", opacity: k }} />;
      })}
    </AbsoluteFill>
  );
};

/** Titres monospace, révélés comme au clavier, avec glitch RGB. */
const Captions: React.FC<{ f: number }> = ({ f }) => {
  const groups: { from: number; to: number; lines: string[] }[] = [
    { from: 40, to: WARP - 6, lines: C.captions.terminal },
    { from: SHOW + 4, to: EXPLODE - 2, lines: C.captions.showcase },
    { from: EXPLODE + 8, to: END - 4, lines: C.captions.exploded },
  ];
  return (
    <>
      {groups.map((g, gi) => {
        if (f < g.from || f > g.to + 8) return null;
        const out = prog(f, g.to, g.to + 8, eIn);
        return (
          <div key={gi} style={{ position: "absolute", top: 150, left: 70, right: 70, opacity: 1 - out, transform: `translateX(${-out * 60}px)` }}>
            {g.lines.map((l, li) => {
              const at = g.from + li * 12;
              const n = Math.round(interpolate(f, [at, at + l.length * 0.9], [0, l.length], clamp));
              const sp = f >= at && f < at + 6 ? (1 - (f - at) / 6) * 12 : 0;
              const style: React.CSSProperties = { fontFamily: MONO, fontWeight: 800, fontSize: 92, lineHeight: 1.12, letterSpacing: -2, whiteSpace: "pre" };
              return (
                <div key={li} style={{ position: "relative", height: 104 }}>
                  {sp > 0 ? (
                    <>
                      <span style={{ ...style, position: "absolute", left: -sp, color: "#ff2bd6", opacity: 0.7 }}>{l.slice(0, n)}</span>
                      <span style={{ ...style, position: "absolute", left: sp, color: C.accent2, opacity: 0.7 }}>{l.slice(0, n)}</span>
                    </>
                  ) : null}
                  <span style={{ ...style, position: "absolute", left: 0, color: li === g.lines.length - 1 ? C.accent : "#e6edf3", textShadow: li === g.lines.length - 1 ? `0 0 30px ${C.accent}88` : undefined }}>
                    {l.slice(0, n)}
                    {n < l.length && f >= at ? <span style={{ color: C.accent }}>▌</span> : null}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

/** Carte de fin. */
const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const st = END;
  const name = `> ${C.product}`;
  const n = Math.round(interpolate(f, [st + 6, st + 6 + name.length * 1.2], [0, name.length], clamp));
  const size = Math.min(130, 960 / (name.length * 0.62));
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34 }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${C.accent}26, transparent 50%)`, opacity: prog(f, st, st + 12) }} />
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, color: "#e6edf3", whiteSpace: "pre", textShadow: `0 0 40px ${C.accent}66` }}>
        {name.slice(0, n)}
        <span style={{ color: C.accent, opacity: Math.floor(f / 8) % 2 === 0 ? 1 : 0 }}>_</span>
      </div>
      <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 48, color: "rgba(230,237,243,0.9)", opacity: prog(f, st + 22, st + 32), transform: `translateY(${(1 - prog(f, st + 22, st + 32, eOut)) * 20}px)` }}>{C.tagline}</div>
      {(() => {
        const q = prog(f, st + 30, st + 42, eBack);
        return (
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 22, padding: "24px 34px", borderRadius: 18, background: "#0d1117", border: `2px solid ${C.accent}88`, boxShadow: `0 0 40px ${C.accent}44`, fontFamily: MONO, fontSize: 40, color: "#e6edf3", opacity: Math.min(1, q * 2), transform: `scale(${lerp(0.8, 1, q)})` }}>
            <span style={{ color: C.accent }}>$</span> {C.installCmd}
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" style={{ marginLeft: 10 }}>
              <rect x="8" y="8" width="12" height="12" rx="2" />
              <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
            </svg>
          </div>
        );
      })()}
      {(() => {
        const q = prog(f, st + 38, st + 50, eBack);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 36px", borderRadius: 14, background: "#e6edf3", color: "#0d1117", fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 36, opacity: Math.min(1, q * 2), transform: `scale(${lerp(0.8, 1, q)})` }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#0d1117">
              <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
            </svg>
            ★ {C.githubLabel} · {C.githubStars}
          </div>
        );
      })()}
      <div style={{ fontFamily: MONO, fontSize: 36, color: C.accent2, opacity: prog(f, st + 48, st + 58) }}>{C.docsUrl}</div>
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const sfx = (n: string) => staticFile(`terminal/sfx/${n}.wav`);
const Sound: React.FC = () => {
  const cues: { at: number; src: string; vol: number; dur?: number }[] = [
    { at: 0, src: "boot", vol: 0.4 },
    { at: TERM_IN, src: "glitch", vol: 0.25 },
    ...TERM.map((c) => ({ at: c.start, src: "typing", vol: 0.38, dur: c.end - c.start + 2 })),
    ...TERM.flatMap((c) => c.outs.map((o) => ({ at: o.at, src: "beep", vol: 0.12 }))),
    { at: TYPING_END, src: "success", vol: 0.28 },
    { at: WARP - 10, src: "warp", vol: 0.45 },
    { at: WARP + 4, src: "impact", vol: 0.5 },
    { at: SHOW + 14, src: "swish", vol: 0.2 },
    { at: SHOW + 110, src: "swish", vol: 0.2 },
    { at: EXPLODE, src: "glitch", vol: 0.25 },
    { at: EXPLODE + 2, src: "warp", vol: 0.25 },
    { at: END, src: "impact", vol: 0.42 },
    { at: END + 30, src: "success", vol: 0.25 },
  ];
  return (
    <>
      <Html5Audio src={sfx("music")} volume={0.62} />
      {cues.map((c, i) => (
        <Sequence key={i} from={c.at} durationInFrames={c.dur} layout="none" name={c.src}>
          <Html5Audio src={sfx(c.src)} volume={c.vol} />
        </Sequence>
      ))}
    </>
  );
};

export { DURATION_FRAMES, eExpo };
