import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, lerp, prog } from "../viewz/util";
import { SANS } from "../kinetik2/parts";
import { Pop, Row, caps, exitStyle, heavy, sans } from "../kinetik3/Kinetik3";
import { DishReel, INK, LightCommentOutro, LightOutroSfx, LightShell, LogoDark, OR, PU, PhoneL, SOFT, Sfx, card, grad } from "../kinetik14/light";
import { CUT, DURATION_FRAMES, T } from "./timing";

loadViewzFonts();
loadFonts();

const G = (size: number, stretch = 85): React.CSSProperties => ({ ...heavy(size, OR, stretch), ...grad, paddingRight: 8 });

const In: React.FC<{ f: number; at: number; style?: React.CSSProperties; children: React.ReactNode; dy?: number }> = ({ f, at, style, children, dy = 260 }) => {
  const q = prog(f, at, at + 14, eBack);
  return <div style={{ position: "absolute", opacity: prog(f, at, at + 6), transform: `translateY(${(1 - q) * dy}px) scale(${lerp(0.85, 1, q)})`, ...style }}>{children}</div>;
};

const Reel: React.FC<{ f: number; w: number; at: number; e: string; t: string; s: string; tint?: string; rot?: number }> = ({ f, w, at, e, t, s, tint, rot = 0 }) => (
  <div style={{ width: w, height: w * 1.75, borderRadius: 26, overflow: "hidden", position: "relative", boxShadow: "0 26px 50px rgba(60,20,90,0.22)", transform: `rotate(${rot}deg)` }}>
    <DishReel f={f} w={w} t0={at} emoji={e} title={t} sub={s} tint={tint} />
  </div>
);

export const Resto2: React.FC = () => {
  const f = useCurrentFrame();
  const sc = (a: number, b: number) => f >= a - 1 && f < b + 1;
  const url = "kinetik-app.com";
  const nUrl = Math.round(lerp(0, url.length, prog(f, T.kinetik, T.com + 6, (x) => x)));
  const orders = Math.floor(lerp(0, 47, prog(f, T.orders, T.teamEnd + 10, (x) => x)));
  const spin = prog(f, T.we, T.timeEnd + 6, (x) => x);
  return (
    <LightShell
      f={f}
      frames={DURATION_FRAMES}
      dir="kinetik15"
      phase={7}
      cuts={Object.values(CUT)}
      hits={[
        [T.instagram, 10],
        [T.time, 12],
        [T.kinetik, 10],
        [T.once, 8],
        [T.approve + 6, 14],
        [T.kinetik2, 12],
      ]}
      flashes={[T.approve + 6, T.kinetik2]}
      sfx={
        <>
          {[T.lunch, T.dinner, T.orders, T.team].map((a, i) => (
            <Sfx key={`a${i}`} at={a} src="pop" vol={0.14 + i * 0.01} />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <Sfx key={`o${i}`} at={T.orders + i * 3} src="tick" vol={0.07} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <Sfx key={`n${i}`} at={T.post + i * 3} src="pop" vol={0.1} />
          ))}
          <Sfx at={T.instagram} src="impact" vol={0.16} />
          {Array.from({ length: 12 }, (_, i) => (
            <Sfx key={`t${i}`} at={T.we + i * 3} src="tick" vol={0.08 + i * 0.005} />
          ))}
          <Sfx at={T.kinetik} src="shimmer" vol={0.24} />
          {Array.from({ length: 15 }, (_, i) => (
            <Sfx key={`k${i}`} at={T.kinetik + i * 2.6} src="key" vol={0.18} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <Sfx key={`p${i}`} at={T.photos + i * 3} src="whoosh" vol={0.1} />
          ))}
          <Sfx at={T.menu} src="pop" vol={0.14} />
          <Sfx at={T.once} src="impact" vol={0.14} />
          {[0, 1, 2, 3].map((i) => (
            <Sfx key={`w${i}`} at={T.videos + i * 5} src="pop" vol={0.12} />
          ))}
          {[T.menu2, T.dish, T.event, T.reviews].map((a, i) => (
            <Sfx key={`g${i}`} at={a} src="whoosh" vol={0.14} />
          ))}
          <Sfx at={T.approve + 6} src="click" vol={0.32} />
          <Sfx at={T.approve + 7} src="impact" vol={0.14} />
          <Sfx at={T.kinetik2} src="drop" vol={0.22} />
          <Sfx at={T.effortlessly} src="shimmer" vol={0.16} />
          <LightOutroSfx t={T} />
        </>
      }
    >
      {/* A — lunch service, dinner service, orders, your team… */}
      {sc(0, CUT.b) && (
        <AbsoluteFill style={exitStyle(f, CUT.b, 3)}>
          {[
            { at: T.lunch, e: "🍽️", t: "LUNCH SERVICE", s: "12:00 – 14:30", c: OR, x: 110, y: 260, r: -4 },
            { at: T.dinner, e: "🌙", t: "DINNER SERVICE", s: "19:00 – 23:00", c: PU, x: 190, y: 560, r: 3 },
            { at: T.orders, e: "🧾", t: "ORDERS", s: `${orders} tickets`, c: OR, x: 130, y: 860, r: -2 },
            { at: T.team, e: "👥", t: "YOUR TEAM", s: "8 people · 2 shifts", c: PU, x: 210, y: 1160, r: 4 },
          ].map((r) => (
            <In key={r.t} f={f} at={r.at} style={{ left: r.x, top: r.y, width: 740, padding: "30px 36px", ...card, display: "flex", alignItems: "center", gap: 28, rotate: `${r.r}deg` }}>
              <span style={{ fontSize: 96 }}>{r.e}</span>
              <div>
                <div style={heavy(72, r.c, 82)}>{r.t}</div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: SOFT, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{r.s}</div>
              </div>
            </In>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", ...sans(70, INK), opacity: prog(f, T.teamEnd - 4, T.teamEnd + 4) }}>…</div>
        </AbsoluteFill>
      )}

      {/* B — and on top of that, post on Instagram every day? */}
      {sc(CUT.b, CUT.c) && (
        <AbsoluteFill style={exitStyle(f, CUT.c)}>
          <Row top={150} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.and} style={sans(60, INK)}>And on top of that,</Pop>
          </Row>
          <Row top={250} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.supposed} style={sans(60, INK)}>you're supposed to</Pop>
            <Pop f={f} at={T.post} style={heavy(96, PU, 85)}>POST</Pop>
          </Row>
          <Row top={360}>
            <Pop f={f} at={T.instagram} style={G(130)}>ON INSTAGRAM</Pop>
          </Row>
          <In f={f} at={T.post} style={{ left: 170, top: 580, width: 740, padding: 34, ...card }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...caps(22, SOFT), letterSpacing: "0.2em", marginBottom: 22 }}>
              <span>this week</span>
              <span style={{ color: OR }}>0 / 7 posted</span>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
                const at = T.post + i * 3;
                return (
                  <div key={i} style={{ flex: 1, height: 130, borderRadius: 18, background: "rgba(124,58,237,0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: INK }}>{d}</span>
                    <span style={{ width: 34, height: 34, borderRadius: "50%", background: OR, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${prog(f, at, at + 8, eBack)})` }}>!</span>
                  </div>
                );
              })}
            </div>
          </In>
          {[0, 1, 2].map((i) => {
            const at = T.instagram + 4 + i * 5;
            return (
              <In key={i} f={f} at={at} dy={-120} style={{ left: 200 + i * 30, top: 1000 + i * 120, width: 680, padding: "22px 26px", ...card, borderRadius: 24, display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg, #feda75, #d62976 55%, #4f5bd5)" }} />
                <div>
                  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: INK }}>Instagram</div>
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: SOFT }}>{["You haven't posted in 3 days", "Your audience is waiting…", "Post a story today?"][i]}</div>
                </div>
              </In>
            );
          })}
          <Row top={1500}>
            <Pop f={f} at={T.every} style={heavy(110, PU, 85)}>EVERY DAY?</Pop>
          </Row>
        </AbsoluteFill>
      )}

      {/* C — we know you don't have the time */}
      {sc(CUT.c, CUT.d) && (
        <AbsoluteFill style={exitStyle(f, CUT.d, 3)}>
          <Row top={300} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.we} style={sans(66, INK)}>We know you don't have</Pop>
          </Row>
          <Row top={410}>
            <Pop f={f} at={T.time} style={G(170)}>THE TIME</Pop>
          </Row>
          <In f={f} at={T.we} style={{ left: 290, top: 760, width: 500, height: 500, ...card, borderRadius: "50%" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ position: "absolute", left: 245, top: 30, width: 10, height: 34, borderRadius: 5, background: i % 3 ? "rgba(26,15,36,0.2)" : INK, transformOrigin: "5px 220px", transform: `rotate(${i * 30}deg)` }} />
            ))}
            <div style={{ position: "absolute", left: 244, top: 110, width: 12, height: 150, borderRadius: 6, background: INK, transformOrigin: "6px 140px", transform: `rotate(${spin * 360 * 1.5}deg)` }} />
            <div style={{ position: "absolute", left: 246, top: 50, width: 8, height: 210, borderRadius: 4, background: `linear-gradient(${OR}, ${PU})`, transformOrigin: "4px 200px", transform: `rotate(${spin * 360 * 14}deg)` }} />
            <div style={{ position: "absolute", left: 230, top: 230, width: 40, height: 40, borderRadius: "50%", background: OR }} />
          </In>
        </AbsoluteFill>
      )}

      {/* D — so kinetik-app.com does it for you */}
      {sc(CUT.d, CUT.e) && (
        <AbsoluteFill style={exitStyle(f, CUT.e, 3)}>
          <Row top={540}>
            <Pop f={f} at={T.so} style={sans(64, SOFT)}>So</Pop>
          </Row>
          <div style={{ position: "absolute", left: 0, right: 0, top: 680 }}>
            <LogoDark f={f} at={T.kinetik} size={150} />
          </div>
          <div style={{ position: "absolute", left: 170, right: 170, top: 940, padding: "26px 34px", ...card, display: "flex", alignItems: "center", gap: 18, opacity: prog(f, T.kinetik, T.kinetik + 6) }}>
            <span style={{ fontSize: 40 }}>🔒</span>
            <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, color: INK }}>
              {url.slice(0, nUrl)}
              <span style={{ opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: OR }}>|</span>
            </span>
          </div>
          <Row top={1180} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.does} style={sans(64, INK)}>does it</Pop>
            <Pop f={f} at={T.forYou} style={G(120)}>FOR YOU</Pop>
          </Row>
        </AbsoluteFill>
      )}

      {/* E — send us your photos and your menu, just once */}
      {sc(CUT.e, CUT.f) && (
        <AbsoluteFill style={exitStyle(f, CUT.f)}>
          <Row top={150} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.send} style={sans(62, INK)}>Send us your</Pop>
            <Pop f={f} at={T.photos} style={heavy(100, OR, 85)}>PHOTOS</Pop>
          </Row>
          <Row top={280} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.menu - 6} style={sans(62, INK)}>and your</Pop>
            <Pop f={f} at={T.menu} style={heavy(100, PU, 85)}>MENU</Pop>
          </Row>
          {/* photos qui volent vers la carte d'envoi */}
          {["🍝", "🥩", "🍷", "🍰", "🥗"].map((e, i) => {
            const at = T.photos + i * 3;
            const q = prog(f, at, at + 16, eInOut);
            const sx = [80, 860, 120, 820, 470][i];
            const sy = [520, 520, 1500, 1500, 1650][i];
            return (
              <div key={i} style={{ position: "absolute", left: lerp(sx, 300 + i * 100, q), top: lerp(sy, 830, q), width: 140, height: 140, borderRadius: 20, background: `linear-gradient(150deg, #ffe2d1, ${i % 2 ? "#e9d5ff" : "#ffc2a6"})`, boxShadow: "0 16px 30px rgba(60,20,90,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, opacity: prog(f, at, at + 4) * (1 - prog(f, at + 14, at + 20)), transform: `rotate(${(1 - q) * (i % 2 ? 30 : -30)}deg) scale(${lerp(1, 0.6, q)})` }}>
                {e}
              </div>
            );
          })}
          <In f={f} at={T.send} style={{ left: 190, top: 640, width: 700, padding: 34, ...card, textAlign: "center" }}>
            <div style={{ fontSize: 80 }}>📤</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: INK, marginTop: 8 }}>Upload to Kinetik</div>
            <div style={{ height: 18, borderRadius: 9, background: "rgba(124,58,237,0.1)", marginTop: 26, overflow: "hidden" }}>
              <div style={{ width: `${prog(f, T.photos, T.menuEnd, (x) => x) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${OR}, ${PU})` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: SOFT }}>
              <span>📸 {Math.min(5, Math.max(0, Math.floor((f - T.photos) / 3) + 1))} photos</span>
              <span style={{ opacity: f >= T.menu ? 1 : 0.3 }}>📋 menu.pdf</span>
            </div>
          </In>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center" }}>
            <div style={{ padding: "18px 40px", borderRadius: 999, background: `linear-gradient(135deg, ${OR}, ${PU})`, ...sans(44, "#fff"), opacity: prog(f, T.once, T.once + 4), transform: `scale(${prog(f, T.once, T.once + 10, eBack)})` }}>✓ one time setup</div>
          </div>
          <Row top={1400} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.just} style={sans(64, INK)}>just</Pop>
            <Pop f={f} at={T.once} style={G(140)}>ONCE.</Pop>
          </Row>
        </AbsoluteFill>
      )}

      {/* F — then every week, your videos show up on their own */}
      {sc(CUT.f, CUT.g) && (
        <AbsoluteFill style={exitStyle(f, CUT.g)}>
          <Row top={150} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.then} style={sans(62, INK)}>Then,</Pop>
            <Pop f={f} at={T.everyW} style={G(110)}>EVERY WEEK</Pop>
          </Row>
          <div style={{ position: "absolute", left: 70, right: 70, top: 400, display: "flex", gap: 18 }}>
            {["W1", "W2", "W3", "W4"].map((wk, i) => {
              const at = T.videos + i * 5;
              return (
                <div key={wk} style={{ flex: 1, ...card, padding: 14, opacity: prog(f, T.then + i * 2, T.then + i * 2 + 6) }}>
                  <div style={{ ...caps(22, i === 0 ? OR : SOFT), letterSpacing: "0.2em", textAlign: "center", marginBottom: 12 }}>{wk}</div>
                  <div style={{ height: 380, borderRadius: 18, overflow: "hidden", position: "relative", background: "rgba(124,58,237,0.06)" }}>
                    <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - prog(f, at, at + 12, eBack)) * -420}px)` }}>
                      <DishReel f={f} w={206} t0={at} emoji={["🍝", "🍹", "🎷", "⭐"][i]} title={["MENU", "DRINKS", "LIVE", "REVIEWS"][i]} sub="new" tint={i % 2 ? PU : OR} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 930, display: "flex", justifyContent: "center", gap: 14, alignItems: "center", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#16a34a", opacity: prog(f, T.own - 4, T.own + 4) }}>
            ✓ auto-delivered · no editing
          </div>
          <Row top={1090} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.videos} style={sans(62, INK)}>your videos show up</Pop>
          </Row>
          <Row top={1210}>
            <Pop f={f} at={T.own - 6} style={heavy(110, PU, 85)}>ON THEIR OWN</Pop>
          </Row>
        </AbsoluteFill>
      )}

      {/* G — this week's menu, dish of the moment, next event, customers' reviews */}
      {sc(CUT.g, CUT.h) && (
        <AbsoluteFill style={exitStyle(f, CUT.h)}>
          {[
            { at: T.menu2, e: "📋", t: "MENU", s: "this week", label: "This week's menu", tint: "#fb923c", x: 110, y: 200 },
            { at: T.dish, e: "🍝", t: "DISH", s: "of the moment", label: "Dish of the moment", tint: OR, x: 570, y: 200 },
            { at: T.next, e: "🎷", t: "JAZZ NIGHT", s: "friday · 9 pm", label: "Your next event", tint: PU, x: 110, y: 1010 },
            { at: T.reviews, e: "⭐", t: "★★★★★", s: "“best pasta in town”", label: "Customers' reviews", tint: "#f472b6", x: 570, y: 1010 },
          ].map((r, i) => (
            <In key={r.label} f={f} at={r.at} style={{ left: r.x, top: r.y }}>
              <Reel f={f} w={400} at={r.at} e={r.e} t={r.t} s={r.s} tint={r.tint} rot={i % 2 ? 2 : -2} />
              <div style={{ marginTop: 18, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: INK }}>{r.label}</div>
            </In>
          ))}
        </AbsoluteFill>
      )}

      {/* H — all you do is approve */}
      {sc(CUT.h, CUT.i) && (
        <AbsoluteFill style={exitStyle(f, CUT.i, 3)}>
          <Row top={420} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.all} style={sans(70, INK)}>All you do is</Pop>
          </Row>
          {(() => {
            const at = T.approve + 6;
            const press = Math.max(0, 1 - Math.abs(f - at) / 3);
            const done = f >= at;
            return (
              <div style={{ position: "absolute", left: 110, right: 110, top: 620, padding: "50px 0", borderRadius: 999, textAlign: "center", background: done ? "#16a34a" : `linear-gradient(135deg, ${OR}, ${PU})`, ...heavy(108, "#fff", 85), opacity: prog(f, T.approve - 4, T.approve + 2), transform: `scale(${(1 - press * 0.1) * lerp(0.6, 1, prog(f, T.approve - 4, T.approve + 6, eBack))})`, boxShadow: "0 30px 60px rgba(124,58,237,0.35)" }}>
                {done ? "✓ APPROVED" : "APPROVE"}
              </div>
            );
          })()}
          {(() => {
            const q = prog(f, T.all, T.approve + 6, eInOut);
            return (
              <svg width={100} height={100} viewBox="0 0 24 24" style={{ position: "absolute", left: lerp(880, 560, q), top: lerp(1300, 720, q), filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.3))" }}>
                <path d="M4 2 L4 19 L8.5 15 L11.5 21.5 L14.2 20.3 L11.3 14 L17 14 Z" fill={INK} stroke="#fff" strokeWidth={1.2} strokeLinejoin="round" />
              </svg>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* I — Kinetik Resto. Your restaurant on video, every week, effortlessly. */}
      {sc(CUT.i, CUT.j) && (
        <AbsoluteFill style={exitStyle(f, CUT.j)}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170 }}>
            <LogoDark f={f} at={T.kinetik2} size={120} suffix={f >= T.resto ? "Resto" : undefined} />
          </div>
          <div style={{ position: "absolute", left: 330, top: 400 }}>
            <In f={f} at={T.restaurant} style={{ left: 0, top: 0 }}>
              <PhoneL w={420}>
                <DishReel f={f} w={406} t0={T.restaurant} emoji="🍝" title="CHEZ LOU" sub="new video · this week" />
              </PhoneL>
            </In>
          </div>
          <Row top={1300} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.restaurant} style={sans(58, INK)}>Your restaurant on</Pop>
            <Pop f={f} at={T.video} style={heavy(92, PU, 85)}>VIDEO,</Pop>
          </Row>
          <Row top={1410} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.everyW2} style={sans(58, INK)}>every week,</Pop>
          </Row>
          <Row top={1510}>
            <Pop f={f} at={T.effortlessly} style={G(110)}>EFFORTLESSLY.</Pop>
          </Row>
        </AbsoluteFill>
      )}

      {f >= CUT.j - 1 && <LightCommentOutro f={f} a={CUT.j} t={T} />}
    </LightShell>
  );
};
