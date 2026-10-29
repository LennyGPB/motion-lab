import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Vignette } from "../signspath/Background";
import { Icon } from "../signspath/Icons";
import { SceneFinale } from "../signspath/SceneFinale";
import { C, loadFonts, SANS, SERIF, serifGradient } from "../signspath/theme";
import { clamp, eBack, eIn, eInOut, eOut, hash, lerp, prog } from "../signspath/util";
import { Words } from "../signspath/Words";
import { Orb } from "../signspath2/Orb";
import { DURATION_FRAMES, SC, T, W } from "./timing";

loadFonts();

type Key = keyof typeof SC;
const on = (f: number, k: Key) => f >= T(SC[k][0]) - 1 && f < T(SC[k][1]) + 2;
const sceneFx = (f: number, k: Key) => {
  const a = T(SC[k][0]);
  const b = T(SC[k][1]);
  const i = prog(f, a, a + 10, eOut);
  const o = prog(f, b - 10, b, eIn);
  return {
    opacity: i * (1 - o),
    transform: `scale(${lerp(1.06, 1, i) * (1 + o * 0.08)})`,
    filter: i < 1 || o > 0 ? `blur(${(1 - i) * 14 + o * 18}px)` : undefined,
  } as React.CSSProperties;
};
const capsStyle: React.CSSProperties = { fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.32em", color: C.muted, textTransform: "uppercase" };
const glass = (a: number): React.CSSProperties => ({
  background: `linear-gradient(160deg, rgba(255,255,255,${0.08 + 0.12 * a}), rgba(190,170,255,0.04)), rgba(36,18,92,0.85)`,
  border: `1.5px solid rgba(225,215,255,${0.2 + 0.5 * a})`,
  boxShadow: `0 0 ${a * 40}px rgba(150,110,255,${0.55 * a})`,
});

/** Motion SignsPath #3 — "Do this for 21 days" (1080x1920). */
export const Days21: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.015 * Math.sin(f / 55)})` }}>
        {on(f, "a") ? <SceneA f={f} /> : null}
        {on(f, "b") ? <SceneB f={f} /> : null}
        {on(f, "c") ? <SceneC f={f} /> : null}
        {on(f, "d") ? <SceneD f={f} /> : null}
        {on(f, "e") ? <SceneE f={f} /> : null}
        <Sequence from={T(SC.finale[0])} durationInFrames={DURATION_FRAMES - T(SC.finale[0])} name="finale">
          <SceneFinale
            timing={{
              manifest: W.manifest, with: W.with, method: W.method, not: W.not3, by: W.by, chance: W.chance,
              full: W.full, signs: W.signs, path: W.path, dot: W.dot, comEnd: W.comEnd, cta: 20.22, from: T(SC.finale[0]),
            }}
          />
        </Sequence>
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};

/* ---------- A : "Do this for 21 days. No more, no less." ---------- */
const RING = { cx: 540, cy: 1320, R: 290 };
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const ringIn = prog(f, T(W.this), T(W.twenty), eOut);
  const lit = (i: number) => prog(f, T(W.twenty) + i * 1.1, T(W.twenty) + i * 1.1 + 6, eBack);
  const count = Math.round(interpolate(f, [T(W.twenty), T(W.twenty) + 20 * 1.1 + 4], [0, 21], clamp));
  // "no more" : un 22e point tente de s'ajouter puis se dissout
  const extraIn = prog(f, T(W.more) - 2, T(W.more) + 6, eBack);
  const extraOut = prog(f, T(W.more) + 7, T(W.moreEnd) + 4, eIn);
  // "no less" : l'anneau se referme et se verrouille
  const lock = prog(f, T(W.less) - 2, T(W.less) + 12, eInOut);
  const pulse = f >= T(W.less) + 10 ? Math.exp(-(f - T(W.less) - 10) / 10) : 0;
  const pos = (i: number, r = RING.R) => {
    const a = -Math.PI / 2 + (i / 21) * Math.PI * 2;
    return [RING.cx + Math.cos(a) * r, RING.cy + Math.sin(a) * r];
  };
  const [ex, ey] = pos(20.5, RING.R + 90);
  return (
    <AbsoluteFill style={sceneFx(f, "a")}>
      <Orb cx={RING.cx} cy={RING.cy} R={140} power={0.25 + 0.5 * prog(f, T(W.twenty), T(W.daysEnd)) + 0.6 * pulse} flicker={0.05} />
      <Words
        f={f}
        top={220}
        size={84}
        lines={[
          [{ t: "Do", at: W.do }, { t: "this", at: W.this }, { t: "for", at: W.for, kind: "muted" }],
          [{ t: "21 days.", at: W.twenty, kind: "serif", size: 100 }],
          [{ t: "No more,", at: W.no, kind: "bold" }, { t: "no less.", at: W.no2, kind: "bold" }],
        ]}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: ringIn }}>
        <circle cx={RING.cx} cy={RING.cy} r={RING.R} fill="none" stroke="rgba(225,215,255,0.16)" strokeWidth={2} />
        <circle
          cx={RING.cx}
          cy={RING.cy}
          r={RING.R}
          fill="none"
          stroke="rgba(235,220,255,0.95)"
          strokeWidth={4 + 3 * pulse}
          pathLength={1}
          strokeDasharray={`${lock} 1`}
          transform={`rotate(-90 ${RING.cx} ${RING.cy})`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 ${10 + 20 * pulse}px #b48cff)` }}
        />
        {pulse > 0.02 ? <circle cx={RING.cx} cy={RING.cy} r={RING.R + (1 - pulse) * 90} fill="none" stroke={C.lilac} strokeWidth={3} opacity={pulse} /> : null}
      </svg>
      {Array.from({ length: 21 }, (_, i) => {
        const [x, y] = pos(i);
        const q = lit(i);
        return (
          <div key={i} style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: "50%", ...glass(q), opacity: ringIn, transform: `scale(${0.6 + 0.4 * q + 0.15 * pulse})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", opacity: q, boxShadow: "0 0 12px #c8b0ff" }} />
          </div>
        );
      })}
      {/* point en trop */}
      {extraIn > 0 && extraOut < 1 ? (
        <div style={{ position: "absolute", left: ex - 22, top: ey - 22, width: 44, height: 44, borderRadius: "50%", border: "2px dashed rgba(225,215,255,0.6)", opacity: extraIn * (1 - extraOut), transform: `scale(${extraIn * (1 + extraOut)})`, filter: `blur(${extraOut * 10}px)` }} />
      ) : null}
      {/* compteur central */}
      <div style={{ position: "absolute", left: 0, right: 0, top: RING.cy - 110, textAlign: "center", opacity: ringIn }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 170, lineHeight: 1, color: C.white, letterSpacing: -4, textShadow: "0 0 40px rgba(170,130,255,0.6)" }}>{count}</div>
        <div style={{ ...capsStyle, marginTop: 6, color: lock > 0.5 ? C.lilacSoft : C.muted }}>days</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B : 'Not "when I have time." Not "until it works."' ---------- */
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.b[0]);
  const strip = prog(f, st + 4, st + 20, eOut);
  const inf = prog(f, T(W.works) - 2, T(W.works) + 14, eOut);
  const jx = (hash(f) - 0.5) * 8;
  const shift = (f - st) * 4;
  const CW = 120;
  return (
    <AbsoluteFill style={sceneFx(f, "b")}>
      <div style={{ position: "absolute", left: jx, right: 0, top: 0, bottom: 0 }}>
        <Words
          f={f}
          top={240}
          size={84}
          lineGap={0}
          lines={[
            [{ t: "Not", at: W.not, kind: "serif", size: 84 }],
            [{ t: "“when", at: W.when, kind: "muted", size: 100 }, { t: "I have", at: W.i, kind: "muted", size: 100 }, { t: "time.”", at: W.time, kind: "muted", size: 100 }],
            [{ t: "Not", at: W.not2, kind: "serif", size: 84 }],
            [{ t: "“until", at: W.until, kind: "muted", size: 100 }, { t: "it works.”", at: W.it, kind: "muted", size: 100 }],
          ]}
          style={{ filter: `blur(${0.8 + 0.8 * Math.sin(f / 5)}px)` }}
        />
      </div>
      {/* une frise de jours sans fin, qui s'efface dans le flou */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, height: 200, opacity: strip, maskImage: "linear-gradient(90deg, transparent, #000 15%, #000 45%, transparent 95%)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 15%, #000 45%, transparent 95%)" }}>
        {Array.from({ length: 16 }, (_, i) => {
          const x = ((i * (CW + 22) - shift) % (16 * (CW + 22)) + 16 * (CW + 22)) % (16 * (CW + 22)) - 100;
          const fog = Math.min(1, Math.max(0, (x - 300) / 600));
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 40, width: CW, height: CW, borderRadius: 26, border: "2px dashed rgba(225,215,255,0.55)", background: "rgba(60,30,140,0.25)", filter: `blur(${fog * 6}px)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: "rgba(207,194,255,0.75)" }}>
              {hash(i * 7) > 0.55 ? "?" : ""}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1480, textAlign: "center", ...capsStyle, opacity: strip * (1 - inf) }}>someday · later · maybe</div>
      {inf > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1440, textAlign: "center", opacity: inf, transform: `scale(${lerp(0.6, 1, inf)})`, filter: `blur(${(1 - inf) * 10}px)` }}>
          <span style={{ ...serifGradient, fontSize: 220, lineHeight: 1 }}>∞</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- C & D : le chemin (clair puis vague) ---------- */
const PATH = { x0: 150, x1: 930, y: 1300, bend: 140 };
const ptAt = (u: number) => {
  const x = lerp(PATH.x0, PATH.x1, u);
  const y = PATH.y - Math.sin(u * Math.PI) * PATH.bend + (u - 0.5) * -60;
  return [x, y];
};
const pathD = Array.from({ length: 41 }, (_, i) => {
  const [x, y] = ptAt(i / 40);
  return `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(" ");

const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.c[0]);
  const draw = prog(f, st + 4, T(W.duration) + 6, eInOut);
  const travel = prog(f, T(W.goal), T(W.reach) + 2, eInOut);
  const arrive = f >= T(W.reach) + 2 ? Math.exp(-(f - T(W.reach) - 2) / 12) : 0;
  const reached = f >= T(W.reach) + 2;
  const [tx, ty] = ptAt(travel);
  const [gx, gy] = ptAt(1);
  return (
    <AbsoluteFill style={sceneFx(f, "c")}>
      <Orb cx={gx} cy={gy} R={70} power={0.4 * draw + (reached ? 0.5 : 0) + 0.8 * arrive} flicker={0} />
      <Words
        f={f}
        top={230}
        size={84}
        lines={[
          [{ t: "A", at: W.a, kind: "muted" }, { t: "clear", at: W.clear, kind: "serif" }, { t: "duration", at: W.duration, kind: "bold" }],
          [{ t: "is a goal", at: W.is, kind: "muted" }],
          [{ t: "you can", at: W.you }, { t: "reach.", at: W.reach, kind: "serif" }],
        ]}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d={pathD} stroke="rgba(225,215,255,0.15)" strokeWidth={4} fill="none" />
        <path d={pathD} stroke="rgba(235,220,255,0.95)" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={`${draw} 1`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px #b48cff)" }} />
        {Array.from({ length: 21 }, (_, i) => {
          const u = i / 20;
          const [x, y] = ptAt(u);
          const on = draw >= u;
          const passed = travel >= u - 0.001 && travel > 0;
          return <circle key={i} cx={x} cy={y} r={passed ? 9 : 6} fill={passed ? "#fff" : "rgba(225,215,255,0.5)"} opacity={on ? 1 : 0} style={passed ? { filter: "drop-shadow(0 0 8px #c8b0ff)" } : undefined} />;
        })}
        {travel > 0 ? <circle cx={tx} cy={ty} r={20} fill="#fff" style={{ filter: "drop-shadow(0 0 20px #d4bfff)" }} /> : null}
        {arrive > 0.02 ? <circle cx={gx} cy={gy} r={30 + (1 - arrive) * 120} fill="none" stroke={C.lilac} strokeWidth={3} opacity={arrive} /> : null}
      </svg>
      <div style={{ position: "absolute", left: PATH.x0 - 80, top: PATH.y + 50, width: 160, textAlign: "center", ...capsStyle, opacity: draw }}>Day 1</div>
      <div style={{ position: "absolute", left: PATH.x1 - 90, top: gy + 70, width: 180, textAlign: "center", ...capsStyle, color: reached ? C.lilacSoft : C.muted, opacity: prog(f, T(W.duration), T(W.duration) + 10) }}>Day 21</div>
      {reached ? (
        <div style={{ position: "absolute", left: gx - 60, top: gy - 200, width: 120, height: 120, borderRadius: "50%", ...glass(1), display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${prog(f, T(W.reach) + 2, T(W.reach) + 14, eBack)})` }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <polyline points="14,31 26,43 47,18" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const st = T(SC.d[0]);
  const draw = prog(f, st + 2, T(W.one2) + 6, eInOut);
  const travel = 0.62 * prog(f, T(W.is2), T(W.quit) + 4, (x) => 1 - Math.pow(1 - x, 2.4));
  const fade = prog(f, T(W.quit) - 2, T(W.quitEnd) + 4, eIn);
  const [tx, ty] = ptAt(travel);
  return (
    <AbsoluteFill style={sceneFx(f, "d")}>
      <AbsoluteFill style={{ background: "rgba(3,0,12,0.45)", opacity: prog(f, st, st + 20) }} />
      <Words
        f={f}
        top={230}
        size={84}
        lines={[
          [{ t: "A", at: W.a3, kind: "muted" }, { t: "vague", at: W.vague, kind: "serif" }, { t: "one", at: W.one2, kind: "muted" }],
          [{ t: "is a", at: W.is2, kind: "muted" }, { t: "quiet way", at: W.quiet, kind: "muted" }],
          [{ t: "to quit.", at: W.to, kind: "bold" }],
        ]}
        style={{ opacity: 1 - 0.5 * fade }}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, filter: "blur(3px)" }}>
        <defs>
          <linearGradient id="vg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(225,215,255,0.5)" />
            <stop offset="0.55" stopColor="rgba(225,215,255,0.25)" />
            <stop offset="0.85" stopColor="rgba(225,215,255,0)" />
          </linearGradient>
        </defs>
        <path d={pathD} stroke="url(#vg)" strokeWidth={4} fill="none" strokeDasharray="14 18" opacity={draw} />
        {travel > 0 ? <circle cx={tx} cy={ty + 6 * Math.sin(f / 7)} r={18} fill="#fff" opacity={1 - fade} style={{ filter: `blur(${fade * 12}px) drop-shadow(0 0 14px #c8b0ff)` }} /> : null}
      </svg>
      {/* brouillard sur l'arrivée */}
      <div style={{ position: "absolute", left: 640, top: 1040, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,100,170,0.35), transparent 65%)", filter: "blur(30px)", opacity: draw, transform: `translateX(${10 * Math.sin(f / 20)}px)` }} />
      <div style={{ position: "absolute", left: PATH.x1 - 90, top: PATH.y - 60, width: 180, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 120, color: "rgba(207,194,255,0.35)", filter: "blur(4px)", opacity: draw }}>?</div>
      <div style={{ position: "absolute", left: PATH.x0 - 80, top: PATH.y + 50, width: 160, textAlign: "center", ...capsStyle, opacity: draw * 0.6 }}>Day 1</div>
    </AbsoluteFill>
  );
};

/* ---------- E : "Pick your intention. Mark your calendar. And start today." ---------- */
const CAL = { left: 128, top: 1060, cell: 104, gap: 16 };
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const pill = prog(f, T(W.intention) - 2, T(W.intention) + 12, eBack);
  const calIn = (i: number) => prog(f, T(W.mark) + i * 0.8, T(W.mark) + i * 0.8 + 8, eBack);
  const ring = prog(f, T(W.calendar), T(W.calEnd) + 4, eInOut);
  const today = prog(f, T(W.today) - 2, T(W.today) + 8, eBack);
  const tp = f >= T(W.today) ? ((f - T(W.today)) % 30) / 30 : 0;
  const gw = 7 * CAL.cell + 6 * CAL.gap;
  const gh = 3 * CAL.cell + 2 * CAL.gap;
  return (
    <AbsoluteFill style={sceneFx(f, "e")}>
      <Words
        f={f}
        top={200}
        size={80}
        lineGap={2}
        lines={[
          [{ t: "Pick", at: W.pick, kind: "bold" }, { t: "your", at: W.your, kind: "muted" }, { t: "intention.", at: W.intention, kind: "serif" }],
          [{ t: "Mark", at: W.mark, kind: "bold" }, { t: "your", at: W.your2, kind: "muted" }, { t: "calendar.", at: W.calendar, kind: "serif" }],
          [{ t: "And", at: W.and, kind: "muted" }, { t: "start", at: W.start, kind: "bold" }, { t: "today.", at: W.today, kind: "serif" }],
        ]}
      />
      {/* intention */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", opacity: Math.min(1, pill * 1.5) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 34px 16px 22px", borderRadius: 999, ...glass(0.8), transform: `scale(${pill})` }}>
          <Icon name="intention" size={58} glow={1} />
          <span style={{ ...serifGradient, fontSize: 56, lineHeight: 1 }}>my intention</span>
        </div>
      </div>
      {/* calendrier 3 semaines */}
      <div style={{ position: "absolute", left: CAL.left, top: CAL.top - 60, ...capsStyle, opacity: calIn(0), color: ring > 0.5 ? C.lilacSoft : C.muted }}>21 days</div>
      {Array.from({ length: 21 }, (_, i) => {
        const q = calIn(i);
        const x = CAL.left + (i % 7) * (CAL.cell + CAL.gap);
        const y = CAL.top + Math.floor(i / 7) * (CAL.cell + CAL.gap);
        const isToday = i === 0;
        const a = isToday ? 0.3 + 0.7 * today : 0.15 + 0.3 * ring;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: CAL.cell, height: CAL.cell, borderRadius: 24, ...glass(a), opacity: Math.min(1, q * 1.4), transform: `scale(${(0.7 + 0.3 * q) * (isToday ? 1 + 0.12 * today : 1)})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 34, color: isToday && today > 0 ? "#fff" : C.muted, zIndex: isToday ? 2 : 1 }}>
            {i + 1}
          </div>
        );
      })}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <rect x={CAL.left - 18} y={CAL.top - 18} width={gw + 36} height={gh + 36} rx={40} fill="none" stroke="rgba(235,220,255,0.9)" strokeWidth={4} pathLength={1} strokeDasharray={`${ring} 1`} style={{ filter: "drop-shadow(0 0 10px #b48cff)" }} />
        {today > 0 ? <circle cx={CAL.left + CAL.cell / 2} cy={CAL.top + CAL.cell / 2} r={60 + tp * 60} fill="none" stroke={C.lilac} strokeWidth={3} opacity={1 - tp} /> : null}
      </svg>
      {today > 0 ? (
        <div style={{ position: "absolute", left: CAL.left - 6, top: CAL.top + gh + 50, padding: "12px 26px", borderRadius: 999, background: "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))", boxShadow: "0 0 40px rgba(139,92,246,0.8)", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: "#fff", opacity: Math.min(1, today * 2), transform: `scale(${today})`, transformOrigin: "0% 0%" }}>
          Day 1 · Today
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- Son ---------- */
const s = (n: string) => staticFile(`signspath/sfx/${n}.wav`);
const CUES: { at: number; src: string; vol: number }[] = [
  { at: -0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.twenty, src: "chime1", vol: 0.18 },
  ...Array.from({ length: 21 }, (_, i) => ({ at: W.twenty + i * (1.1 / 30) - 0.03, src: "tick", vol: 0.07 })),
  { at: W.more, src: "whoosh_soft", vol: 0.15 },
  { at: W.less, src: "chime5", vol: 0.26 },
  { at: W.less + 0.3, src: "sub", vol: 0.3 },
  { at: 3.5, src: "whoosh", vol: 0.32 },
  { at: W.when, src: "whoosh_rev", vol: 0.1 },
  { at: W.until, src: "whoosh_rev", vol: 0.12 },
  { at: W.works, src: "freeze", vol: 0.2 },
  { at: 7.35, src: "whoosh", vol: 0.32 },
  { at: W.clear, src: "chime2", vol: 0.2 },
  { at: W.goal, src: "riser", vol: 0.14 },
  { at: W.reach + 0.07, src: "chime6", vol: 0.28 },
  { at: W.reach + 0.07, src: "shimmer", vol: 0.25 },
  { at: 10.17, src: "whoosh_soft", vol: 0.25 },
  { at: W.vague, src: "chaos", vol: 0.08 },
  { at: W.quit, src: "tick_low", vol: 0.3 },
  { at: 12.98, src: "whoosh", vol: 0.32 },
  { at: W.intention, src: "chime3", vol: 0.22 },
  ...Array.from({ length: 21 }, (_, i) => ({ at: W.mark + i * (0.8 / 30), src: "tick", vol: 0.06 })),
  { at: W.calendar, src: "shimmer", vol: 0.22 },
  { at: W.today, src: "chime5", vol: 0.28 },
  { at: W.today, src: "sub", vol: 0.28 },
  { at: W.manifest - 0.05, src: "impact", vol: 0.42 },
  { at: W.with, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.35 },
  { at: 20.12, src: "whoosh", vol: 0.3 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74, 0.86, 0.98, 1.1].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];
const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("pad")} volume={(fr) => interpolate(fr, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice3.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
