import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eInOut, hash, lerp, prog } from "../viewz/util";
import { FONT, FictionalSite, SANS, SiteH, SiteW, Streaks } from "../kinetik2/parts";
import { KLogo, MiniMotion, Phone } from "../kinetik3/Kinetik3";
import { CommentOutro, CommentOutroSfx, Sfx } from "../kinetik12/shared";
import { BLUE, INK, Line, ORA, PINK, PopBg, Slam, THEMES, YEL, stk } from "../kinetik20/Never";
import { Mascot, MascotKey, trackPlace } from "../mascot/MascotTest";
import { ENV19 } from "./env";
import { CUT, DURATION_FRAMES, T } from "./timing";

loadViewzFonts();
loadFonts();

/* Même univers « pop » que la pub « I've never edited a video ». */
const THEMES6 = [THEMES[0], THEMES[1], THEMES[2], THEMES[3], { ...THEMES[1], a: "#ff5fa8", b: "#f24d97" }, THEMES[4]];
const sticker = (bg = "#fff"): React.CSSProperties => ({ background: bg, border: `7px solid ${INK}`, boxShadow: `14px 14px 0 ${INK}`, borderRadius: 32 });

const TRACK: MascotKey[] = [
  { at: -20, x: 540, y: 2700, s: 0.85, rot: 30 },
  { at: 0, dur: 14, x: 540, y: 1930, s: 0.85, rot: 0 },
  { at: T.link, dur: 8, x: 540, y: 1920, s: 0.88, rot: -7 },
  { at: T.kinetik, dur: 8, x: 540, y: 1925, s: 0.9, rot: 6 },
  { at: CUT.b - 4, dur: 14, x: 230, y: 1965, s: 0.56, rot: -8, hop: 200 },
  { at: T.logo, dur: 8, x: 220, y: 1955, s: 0.58, rot: 7 },
  { at: T.copy, dur: 8, x: 230, y: 1960, s: 0.56, rot: -6 },
  { at: CUT.c - 4, dur: 16, x: 850, y: 1980, s: 0.6, rot: -8, hop: 260 },
  { at: T.ready, dur: 8, x: 850, y: 1970, s: 0.66, rot: 8 },
  { at: CUT.d - 4, dur: 16, x: 830, y: 1985, s: 0.6, rot: 0, hop: 200 },
  { at: T.export, dur: 14, x: 830, y: 1970, s: 0.62, rot: 0, ry: 360 },
  { at: T.post, dur: 8, x: 830, y: 1960, s: 0.66, rot: -6, ry: 360 },
  { at: CUT.e - 4, dur: 16, x: 540, y: 2020, s: 1.05, rot: 0, ry: 360, hop: 140 },
  { at: T.com, dur: 8, x: 540, y: 2010, s: 1.1, rot: -5, ry: 360 },
  { at: CUT.f - 4, dur: 16, x: 905, y: 2000, s: 0.42, rot: -6, ry: 360, hop: 180 },
  { at: T.motion, dur: 6, x: 905, y: 1990, s: 0.45, rot: 5, ry: 360 },
];

/* ---------- A : One link. That's all Kinetik needs. ---------- */
const SceneA: React.FC<{ f: number }> = ({ f }) => {
  const q = prog(f, T.link - 2, T.link + 12, eBack);
  return (
    <AbsoluteFill>
      <Line top={140}>
        <Slam f={f} at={T.one} style={stk(190)}>ONE</Slam>
        <Slam f={f} at={T.link} style={stk(190, YEL)} rot={-6}>LINK.</Slam>
      </Line>
      {/* maillon autocollant */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: Math.min(1, q * 1.6) }}>
        <svg width={420} height={240} viewBox="0 0 360 220" style={{ transform: `rotate(${-14 + 8 * Math.sin(f / 10)}deg) scale(${Math.min(1, q)})`, filter: `drop-shadow(12px 12px 0 ${INK})` }}>
          {[
            [20, PINK],
            [150, "#fff"],
          ].map(([x, c]) => (
            <g key={String(x)}>
              <rect x={Number(x)} y={60} width={190} height={100} rx={50} fill="none" stroke={INK} strokeWidth={40} />
              <rect x={Number(x)} y={60} width={190} height={100} rx={50} fill="none" stroke={String(c)} strokeWidth={22} />
            </g>
          ))}
        </svg>
      </div>
      <Line top={680} gap={18}>
        <Slam f={f} at={T.thats} style={stk(78)} rot={3}>{"THAT'S ALL"}</Slam>
      </Line>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", gap: 20, alignItems: "center" }}>
        <div style={{ padding: "12px 28px", ...sticker(INK), boxShadow: "10px 10px 0 #fff", opacity: prog(f, T.kinetik - 2, T.kinetik + 4), transform: `scale(${lerp(0.5, 1, prog(f, T.kinetik - 2, T.kinetik + 10, eBack))}) rotate(-3deg)` }}>
          <KLogo f={f} at={T.kinetik} size={80} />
        </div>
        <Slam f={f} at={T.needs} style={stk(90, PINK)} rot={-5}>NEEDS.</Slam>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B : Paste your website: logo, colors, copy ---------- */
const SceneB: React.FC<{ f: number }> = ({ f }) => {
  const pasted = f >= T.website;
  const site = prog(f, T.website, T.website + 14, eBack);
  const chip = (at: number, label: string, bg: string, top: number, left: number, rot: number, el: React.ReactNode) => {
    const q = prog(f, at - 4, at + 12, eBack);
    return (
      <div style={{ position: "absolute", left: lerp(540, left, Math.min(1, q)), top: lerp(700, top, Math.min(1, q)), padding: "16px 26px", ...sticker(bg), display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, q * 2), transform: `scale(${lerp(0.3, 1, Math.min(1, q))}) rotate(${rot}deg)` }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: "#fff", border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{el}</div>
        <span style={stk(66, "#fff")}>{label}</span>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Line top={110} gap={18}>
        <Slam f={f} at={T.paste} style={stk(130, YEL)}>PASTE</Slam>
        <Slam f={f} at={T.website - 3} style={stk(76)} rot={3}>YOUR WEBSITE</Slam>
      </Line>
      <div style={{ position: "absolute", left: 80, right: 80, top: 290, padding: "18px 28px", ...sticker("#fff"), borderRadius: 999, display: "flex", alignItems: "center", gap: 16, opacity: prog(f, T.paste, T.paste + 6) }}>
        <span style={{ fontSize: 40 }}>🔗</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 48, color: INK }}>
          https://{pasted ? "yourbrand.com" : ""}
          <span style={{ opacity: Math.floor(f / 7) % 2 ? 0 : 1, color: PINK }}>|</span>
        </span>
        {f >= T.website - 6 && f < T.website + 14 ? <span style={{ marginLeft: "auto", padding: "6px 16px", borderRadius: 14, background: PINK, border: `4px solid ${INK}`, ...stk(30, "#fff") }}>⌘V</span> : null}
      </div>
      <div style={{ position: "absolute", left: 540 - (SiteW * 0.9) / 2, top: 470, opacity: Math.min(1, site * 2) }}>
        <div style={{ width: SiteW, height: SiteH, transform: `scale(${0.9 * lerp(0.5, 1, Math.min(1, site))}) rotate(${-3 + Math.sin(f / 18)}deg)`, transformOrigin: "0 0", borderRadius: 26, overflow: "hidden", border: `8px solid ${INK}`, boxShadow: `16px 16px 0 ${INK}`, position: "relative" }}>
          <FictionalSite />
          <div style={{ position: "absolute", left: 0, right: 0, top: `${((f - T.website) * 4) % 110 - 5}%`, height: 10, background: YEL, boxShadow: `0 0 20px ${YEL}`, opacity: f >= T.website && f < T.copyEnd ? 0.9 : 0 }} />
        </div>
      </div>
      {chip(T.logo, "LOGO", BLUE, 1010, 520, -4, <div style={{ width: 46, height: 46, borderRadius: "50%", border: `9px solid ${BLUE}` }} />)}
      {chip(T.colors, "COLORS", PINK, 1170, 470, 3, <div style={{ display: "flex", gap: 5 }}>{[YEL, PINK, BLUE].map((c) => <div key={c} style={{ width: 16, height: 44, borderRadius: 6, background: c, border: `3px solid ${INK}` }} />)}</div>)}
      {chip(T.copy, "COPY", ORA, 1330, 540, -3, <span style={{ ...stk(40, INK), WebkitTextStroke: "0px", textShadow: "none" }}>Aa</span>)}
    </AbsoluteFill>
  );
};

/* ---------- C : your video's ready in seconds ---------- */
const SceneC: React.FC<{ f: number }> = ({ f }) => {
  const ph = prog(f, T.your - 2, T.your + 14, eBack);
  const secs = Math.min(2.2, Math.max(0, (f - T.videos) / 30) * 2.1);
  return (
    <AbsoluteFill>
      <Line top={110}>
        <Slam f={f} at={T.your} style={stk(118)}>{"YOUR VIDEO'S"}</Slam>
      </Line>
      <div style={{ position: "absolute", left: 120, top: 300, perspective: 1300 }}>
        <div style={{ transform: `rotateY(${lerp(-80, 12, Math.min(1, ph)) + 5 * Math.sin(f / 16)}deg) rotateZ(-4deg) scale(${Math.min(1, ph)})`, opacity: Math.min(1, ph * 2), filter: `drop-shadow(14px 14px 0 ${INK})` }}>
          <Phone w={380} glow={0}>
            <MiniMotion f={f} w={380} t0={T.your} />
          </Phone>
        </div>
      </div>
      <div style={{ position: "absolute", left: 560, top: 520, display: "flex", flexDirection: "column", gap: 30, alignItems: "flex-start" }}>
        <Slam f={f} at={T.ready} style={stk(150, YEL)} rot={-6}>READY</Slam>
        <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: prog(f, T.seconds - 4, T.seconds + 4) }}>
          <span style={stk(70)}>IN</span>
          <span style={{ padding: "8px 24px", ...sticker("#fff"), borderRadius: 22, fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontSize: 80, color: INK, fontVariantNumeric: "tabular-nums" }}>{secs.toFixed(1)}s</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- D : Tweak, export, post ---------- */
const SceneD: React.FC<{ f: number }> = ({ f }) => {
  const exp = prog(f, T.export, T.post - 2, eInOut);
  const likes = Math.floor(Math.max(0, f - T.post) * 41);
  const row = (at: number, top: number, word: string, color: string, rot: number, el: React.ReactNode) => {
    const q = prog(f, at - 3, at + 10, eBack);
    return (
      <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", alignItems: "center", gap: 30, opacity: Math.min(1, q * 2), transform: `translateX(${(1 - Math.min(1, q)) * -400}px) rotate(${rot}deg)` }}>
        <span style={{ ...stk(140, color), width: 520 }}>{word}</span>
        <div style={{ flex: 1, height: 190, ...sticker("#fff"), padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>{el}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      {row(T.tweak, 170, "TWEAK,", "#fff", -3, (
        <>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "relative", height: 10, borderRadius: 5, background: "rgba(17,16,24,0.15)", margin: "14px 0" }}>
              <div style={{ position: "absolute", top: -12, left: `${40 + 35 * Math.sin(f / (7 + i * 2) + i)}%`, width: 32, height: 32, borderRadius: "50%", background: [PINK, BLUE, YEL][i], border: `4px solid ${INK}` }} />
            </div>
          ))}
        </>
      ))}
      {row(T.export, 470, "EXPORT,", YEL, 2, (
        <>
          <div style={{ ...stk(60, INK), WebkitTextStroke: "0px", textShadow: "none", fontVariantNumeric: "tabular-nums" }}>{Math.round(exp * 100)}%</div>
          <div style={{ marginTop: 12, height: 22, borderRadius: 11, background: "rgba(17,16,24,0.12)", border: `4px solid ${INK}`, overflow: "hidden" }}>
            <div style={{ width: `${exp * 100}%`, height: "100%", background: PINK }} />
          </div>
        </>
      ))}
      {row(T.post, 770, "POST.", PINK, -2, (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 70, transform: `scale(${1 + 0.3 * Math.exp(-(Math.max(0, f - T.post) % 10) / 3)})` }}>❤️</span>
          <span style={{ ...stk(60, INK), WebkitTextStroke: "0px", textShadow: "none", fontVariantNumeric: "tabular-nums" }}>{likes.toLocaleString("en-US")}</span>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- E : Head to kinetik-app.com ---------- */
const SceneE: React.FC<{ f: number }> = ({ f }) => {
  const url = "kinetik-app.com";
  const n = Math.round(lerp(0, url.length, prog(f, T.kinetik2, T.comEnd - 2, (x) => x)));
  return (
    <AbsoluteFill>
      <Line top={200}>
        <Slam f={f} at={T.head} style={stk(150)}>HEAD TO</Slam>
      </Line>
      <div style={{ position: "absolute", left: 60, right: 60, top: 440, padding: "34px 20px", ...sticker("#fff"), borderRadius: 40, textAlign: "center", opacity: prog(f, T.head + 3, T.head + 8), transform: `rotate(-2deg) scale(${lerp(0.6, 1, prog(f, T.head + 3, T.head + 12, eBack)) * (1 + 0.06 * (f >= T.comEnd ? Math.exp(-(f - T.comEnd) / 5) : 0))})` }}>
        <span style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 900, fontStretch: "80%", fontSize: 108, color: INK }}>
          {url.slice(0, n)}
          <span style={{ opacity: Math.floor(f / 6) % 2 ? 0 : 1, color: PINK }}>|</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
export const LinkPop: React.FC = () => {
  const f = useCurrentFrame();
  const cuts = [CUT.b, CUT.c, CUT.d, CUT.e, CUT.f];
  const scene = (a: number, b: number) => f >= a - 1 && f < b + 1;
  const pop = (a: number, b: number): React.CSSProperties => {
    const i = prog(f, a, a + 8, eBack);
    const o = prog(f, b - 5, b, eInOut);
    return { opacity: 1 - o, transform: `scale(${lerp(0.7, 1, Math.min(1, i)) * (1 + o * 0.4)}) rotate(${(1 - Math.min(1, i)) * -8 + o * 8}deg)` };
  };
  const hits: [number, number][] = [[T.link, 16], [T.kinetik, 10], [T.website, 12], [T.ready, 18], [T.export + 12, 10], [T.post, 12], [T.comEnd, 10]];
  const shake = hits.reduce((s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s), 0);
  const glitch = cuts.reduce((s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 3), 0);
  const flash = Math.max(0, ...[T.link, T.ready].map((h) => (f >= h ? 0.55 * Math.exp(-(f - h) / 2.5) : 0)));
  return (
    <AbsoluteFill style={{ background: BLUE, overflow: "hidden" }}>
      <PopBg f={f} cuts={cuts} themes={THEMES6} />
      <AbsoluteFill style={{ transform: `translate(${(hash(f * 3) - 0.5) * shake}px, ${(hash(f * 3 + 1) - 0.5) * shake}px)` }}>
        {scene(0, CUT.b) && (
          <AbsoluteFill style={pop(-10, CUT.b)}>
            <SceneA f={f} />
          </AbsoluteFill>
        )}
        {scene(CUT.b, CUT.c) && (
          <AbsoluteFill style={pop(CUT.b, CUT.c)}>
            <SceneB f={f} />
          </AbsoluteFill>
        )}
        {scene(CUT.c, CUT.d) && (
          <AbsoluteFill style={pop(CUT.c, CUT.d)}>
            <SceneC f={f} />
          </AbsoluteFill>
        )}
        {scene(CUT.d, CUT.e) && (
          <AbsoluteFill style={pop(CUT.d, CUT.e)}>
            <SceneD f={f} />
          </AbsoluteFill>
        )}
        {scene(CUT.e, CUT.f) && (
          <AbsoluteFill style={pop(CUT.e, CUT.f)}>
            <SceneE f={f} />
          </AbsoluteFill>
        )}
        {f >= CUT.f - 1 && (
          <AbsoluteFill style={pop(CUT.f, DURATION_FRAMES + 20)}>
            <CommentOutro f={f} a={CUT.f} t={T} c1={YEL} c2={PINK} glow="rgba(255,200,60,0.6)" box={{ borderRadius: 36, background: "#16122a", border: "6px solid #fff", boxShadow: `14px 14px 0 ${INK}` }} />
          </AbsoluteFill>
        )}
        <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(14px 14px 0 rgba(17,16,24,0.85))" }}>
          <Mascot f={f} voiceFrom={3} env={ENV19} place={trackPlace(TRACK, f)} fade />
        </div>
      </AbsoluteFill>
      <Streaks f={f} amt={Math.min(1, glitch + shake / 40)} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, DURATION_FRAMES - 10, DURATION_FRAMES - 1, eInOut) }} />
      <Html5Audio src={staticFile("kinetik19/sfx/music.wav")} volume={0.28} />
      <Sequence from={3} layout="none">
        <Html5Audio src={staticFile("kinetik19/voice.wav")} volume={0.95} />
      </Sequence>
      {cuts.map((c, i) => (
        <React.Fragment key={`c${i}`}>
          <Sfx at={c - 3} src="whoosh" vol={0.2} />
          <Sfx at={c} src="pop" vol={0.18} />
        </React.Fragment>
      ))}
      {TRACK.filter((k) => k.hop).map((k, i) => (
        <Sfx key={`h${i}`} at={k.at + (k.dur ?? 10) - 2} src="pop" vol={0.12} />
      ))}
      <Sfx at={T.one} src="click" vol={0.18} />
      <Sfx at={T.link} src="impact" vol={0.22} />
      <Sfx at={T.kinetik} src="shimmer" vol={0.22} />
      <Sfx at={T.needs} src="click" vol={0.18} />
      <Sfx at={T.paste} src="click" vol={0.18} />
      <Sfx at={T.website - 2} src="click" vol={0.3} />
      <Sfx at={T.website} src="scan" vol={0.14} />
      {[T.logo, T.colors, T.copy].map((a, i) => (
        <Sfx key={`b${i}`} at={a} src="pop" vol={0.18} />
      ))}
      <Sfx at={T.ready} src="drop" vol={0.24} />
      {Array.from({ length: 8 }, (_, i) => (
        <Sfx key={`s${i}`} at={T.videos + i * 3} src="tick" vol={0.08} />
      ))}
      <Sfx at={T.tweak} src="click" vol={0.18} />
      <Sfx at={T.export} src="riser" vol={0.12} />
      <Sfx at={T.post} src="impact" vol={0.18} />
      <Sfx at={T.head} src="impact" vol={0.16} />
      {Array.from({ length: 15 }, (_, i) => (
        <Sfx key={`k${i}`} at={T.kinetik2 + i * 3} src="key" vol={0.18} />
      ))}
      <Sfx at={T.comEnd} src="shimmer" vol={0.2} />
      <CommentOutroSfx t={T} />
    </AbsoluteFill>
  );
};
