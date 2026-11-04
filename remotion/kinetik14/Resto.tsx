import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, lerp, prog } from "../viewz/util";
import { SANS } from "../kinetik2/parts";
import { Pop, Row, caps, exitStyle, heavy, sans } from "../kinetik3/Kinetik3";
import { DishReel, INK, LightCommentOutro, LightOutroSfx, LightShell, LogoDark, OR, PU, PhoneL, SOFT, Sfx, card, grad } from "./light";
import { CUT, DURATION_FRAMES, T } from "./timing";

loadViewzFonts();
loadFonts();

const G = (size: number, stretch = 85): React.CSSProperties => ({ ...heavy(size, OR, stretch), ...grad, paddingRight: 8 });

/** Carte qui glisse depuis le bas avec rebond. */
const In: React.FC<{ f: number; at: number; style?: React.CSSProperties; children: React.ReactNode; dy?: number }> = ({ f, at, style, children, dy = 260 }) => {
  const q = prog(f, at, at + 14, eBack);
  return <div style={{ position: "absolute", opacity: prog(f, at, at + 6), transform: `translateY(${(1 - q) * dy}px) scale(${lerp(0.85, 1, q)})`, ...style }}>{children}</div>;
};

export const Resto: React.FC = () => {
  const f = useCurrentFrame();
  const sc = (a: number, b: number) => f >= a - 1 && f < b + 1;
  const url = "kinetik-app.com";
  const nUrl = Math.round(lerp(0, url.length, prog(f, T.kinetik, T.com + 6, (x) => x)));
  // horloge du soir qui avance
  const mins = Math.round(lerp(19 * 60, 23 * 60 + 40, prog(f, T.without, T.evEnd, eInOut)));
  const clock = `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  const posts = Math.floor(lerp(12, 148, prog(f, T.socials2, T.cookEnd + 10, (x) => x)));
  return (
    <LightShell
      f={f}
      frames={DURATION_FRAMES}
      dir="kinetik14"
      cuts={Object.values(CUT)}
      hits={[
        [T.restaurant, 10],
        [T.kinetik, 10],
        [T.monday, 8],
        [T.click, 12],
        [T.snap, 10],
        [T.kinetik2, 12],
      ]}
      flashes={[T.snap, T.kinetik2]}
      sfx={
        <>
          <Sfx at={T.restaurant} src="impact" vol={0.18} />
          <Sfx at={T.socials} src="pop" vol={0.14} />
          <Sfx at={T.evenings} src="tick" vol={0.14} />
          <Sfx at={T.kinetik} src="shimmer" vol={0.24} />
          {Array.from({ length: 15 }, (_, i) => (
            <Sfx key={`k${i}`} at={T.kinetik + i * 2.6} src="key" vol={0.18} />
          ))}
          <Sfx at={T.monday} src="pop" vol={0.16} />
          {[T.menu, T.signature, T.happy].map((a, i) => (
            <Sfx key={`p${i}`} at={a} src="whoosh" vol={0.14} />
          ))}
          <Sfx at={T.click} src="click" vol={0.3} />
          {[0, 1, 2].map((i) => (
            <Sfx key={`o${i}`} at={T.post2 + i * 4} src="pop" vol={0.14} />
          ))}
          <Sfx at={T.snap} src="click" vol={0.3} />
          <Sfx at={T.snap + 1} src="impact" vol={0.12} />
          <Sfx at={T.ready2} src="shimmer" vol={0.2} />
          <Sfx at={T.tv} src="scan" vol={0.16} />
          <Sfx at={T.kinetik2} src="drop" vol={0.22} />
          {Array.from({ length: 8 }, (_, i) => (
            <Sfx key={`r${i}`} at={T.running + i * 6} src="tick" vol={0.08} />
          ))}
          <LightOutroSfx t={T} />
        </>
      }
    >
      {/* A — Own a restaurant? */}
      {sc(0, CUT.b) && (
        <AbsoluteFill style={exitStyle(f, CUT.b, 3)}>
          <Row top={300} gap={20}>
            <Pop f={f} at={T.own} style={sans(90, INK)}>Own a</Pop>
          </Row>
          <Row top={420}>
            <Pop f={f} at={T.restaurant} style={G(128)}>RESTAURANT?</Pop>
          </Row>
          <In f={f} at={T.own + 4} style={{ left: 190, top: 780, width: 700, height: 640, ...card, overflow: "hidden" }}>
            {/* store */}
            <div style={{ display: "flex", height: 120 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ flex: 1, background: i % 2 ? "#fff" : OR, borderRadius: "0 0 60px 60px" }} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40, ...heavy(80, INK, 85) }}>Chez Lou</div>
            <div style={{ textAlign: "center", ...caps(22, SOFT), letterSpacing: "0.3em", marginTop: 12 }}>bistro · since 2014</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 50, fontSize: 110 }}>
              {["🍝", "🥗", "🍷"].map((e, i) => (
                <span key={e} style={{ display: "inline-block", transform: `translateY(${(1 - prog(f, T.restaurant + i * 3, T.restaurant + i * 3 + 10, eBack)) * 120}px)`, opacity: prog(f, T.restaurant + i * 3, T.restaurant + i * 3 + 4) }}>
                  {e}
                </span>
              ))}
            </div>
          </In>
        </AbsoluteFill>
      )}

      {/* B — ready-to-post videos for your socials, without giving up your evenings */}
      {sc(CUT.b, CUT.c) && (
        <AbsoluteFill style={exitStyle(f, CUT.c)}>
          <Row top={150} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.want} style={sans(66, INK)}>Want</Pop>
            <Pop f={f} at={T.ready} style={G(96)}>READY-TO-POST</Pop>
          </Row>
          <Row top={280} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.videos} style={sans(66, INK)}>videos for your</Pop>
            <Pop f={f} at={T.socials} style={heavy(96, PU, 85)}>SOCIALS</Pop>
          </Row>
          <div style={{ position: "absolute", left: 120, top: 480 }}>
            <In f={f} at={T.videos} style={{ left: 0, top: 0 }}>
              <PhoneL w={380}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: "70px 10px 10px" }}>
                  {["🍝", "🍷", "🥐", "🍔", "🍹", "🍰", "🥗", "🍕", "☕"].map((e, i) => {
                    const at = T.socials + i * 2;
                    return (
                      <div key={i} style={{ height: 140, borderRadius: 10, background: `linear-gradient(160deg, #ffe2d1, ${i % 2 ? "#e9d5ff" : "#ffc2a6"})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 58, transform: `scale(${prog(f, at, at + 8, eBack)})` }}>
                        {e}
                      </div>
                    );
                  })}
                </div>
              </PhoneL>
            </In>
          </div>
          <In f={f} at={T.without} style={{ left: 560, top: 640, width: 400, padding: "34px 20px", ...card, textAlign: "center" }}>
            <div style={{ fontSize: 90 }}>🌙</div>
            <div style={{ ...heavy(110, INK, 80), marginTop: 10, fontVariantNumeric: "tabular-nums" }}>{clock}</div>
            <div style={{ ...caps(20, SOFT), letterSpacing: "0.25em", marginTop: 14 }}>editing videos?</div>
            <div style={{ position: "absolute", left: 40, right: 40, top: "52%", height: 10, borderRadius: 5, background: OR, transform: `rotate(-14deg) scaleX(${prog(f, T.evenings, T.evenings + 8, eExpo)})` }} />
          </In>
          <Row top={1380} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.without} style={sans(58, INK)}>without giving up your</Pop>
          </Row>
          <Row top={1470}>
            <Pop f={f} at={T.evenings} style={G(120)}>EVENINGS</Pop>
          </Row>
        </AbsoluteFill>
      )}

      {/* C — kinetik-app.com */}
      {sc(CUT.c, CUT.d) && (
        <AbsoluteFill style={exitStyle(f, CUT.d, 3)}>
          <Row top={560}>
            <Pop f={f} at={T.with} style={sans(64, SOFT)}>with</Pop>
          </Row>
          <div style={{ position: "absolute", left: 0, right: 0, top: 700 }}>
            <LogoDark f={f} at={T.kinetik} size={150} />
          </div>
          <div style={{ position: "absolute", left: 170, right: 170, top: 960, padding: "26px 34px", ...card, display: "flex", alignItems: "center", gap: 18, opacity: prog(f, T.kinetik, T.kinetik + 6) }}>
            <span style={{ fontSize: 40 }}>🔒</span>
            <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, color: INK }}>
              {url.slice(0, nUrl)}
              <span style={{ opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: OR }}>|</span>
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* D — every Monday, weekly pack: menu, signature dish, happy hour */}
      {sc(CUT.d, CUT.e) && (
        <AbsoluteFill style={exitStyle(f, CUT.e)}>
          <Row top={140} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.every} style={sans(66, INK)}>Every</Pop>
            <Pop f={f} at={T.monday} style={G(110)}>MONDAY</Pop>
          </Row>
          <Row top={280} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.weekly} style={sans(60, INK)}>your weekly</Pop>
            <Pop f={f} at={T.pack} style={heavy(96, PU, 85)}>PACK</Pop>
            <Pop f={f} at={T.waiting} style={sans(60, INK)}>is waiting</Pop>
          </Row>
          <In f={f} at={T.monday} style={{ left: 400, top: 430, width: 280, ...card, overflow: "hidden", textAlign: "center" }}>
            <div style={{ background: `linear-gradient(135deg, ${OR}, ${PU})`, ...caps(26, "#fff"), padding: "12px 0" }}>MON</div>
            <div style={{ ...heavy(110, INK, 85), padding: "14px 0 18px" }}>
              {String(Math.min(9, 1 + Math.floor(Math.max(0, f - T.monday) / 3))).padStart(2, "0")}
            </div>
          </In>
          {[
            { at: T.menu, e: "📋", t: "MENU", s: "this week", tint: "#fb923c" },
            { at: T.signature, e: "🍝", t: "SIGNATURE", s: "dish of the house", tint: OR },
            { at: T.happy, e: "🍹", t: "HAPPY HOUR", s: "6 – 8 pm", tint: PU },
          ].map((r, i) => (
            <In key={r.t} f={f} at={r.at} style={{ left: 60 + i * 330, top: 780 + (i === 1 ? -30 : 0) }}>
              <div style={{ width: 300, height: 540, borderRadius: 28, overflow: "hidden", position: "relative", boxShadow: "0 30px 60px rgba(60,20,90,0.22)", transform: `rotate(${(i - 1) * 4}deg)` }}>
                <DishReel f={f} w={300} t0={r.at} emoji={r.e} title={r.t} sub={r.s} tint={r.tint} />
              </div>
            </In>
          ))}
          <Row top={1430} gap={16} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.menu} style={sans(54, INK)}>menu ·</Pop>
            <Pop f={f} at={T.signature} style={sans(54, OR)}>signature dish ·</Pop>
            <Pop f={f} at={T.happy} style={sans(54, PU)}>happy hour</Pop>
          </Row>
        </AbsoluteFill>
      )}

      {/* E — approve in one click, post. That's it. */}
      {sc(CUT.e, CUT.f) && (
        <AbsoluteFill style={exitStyle(f, CUT.f)}>
          <Row top={170}>
            <Pop f={f} at={T.approve} style={G(140)}>APPROVE</Pop>
          </Row>
          <Row top={340} gap={18}>
            <Pop f={f} at={T.one} style={sans(66, INK)}>in one click,</Pop>
            <Pop f={f} at={T.post2} style={heavy(96, PU, 85)}>POST.</Pop>
          </Row>
          <In f={f} at={T.approve} style={{ left: 160, top: 520, width: 760, padding: 30, ...card }}>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ width: 200, height: 300, borderRadius: 20, overflow: "hidden", position: "relative" }}>
                <DishReel f={f} w={200} t0={T.approve} emoji="🍝" title="TAGLIATELLE" sub="today" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...caps(20, SOFT), letterSpacing: "0.2em" }}>weekly pack · 3 videos</div>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: INK, marginTop: 12 }}>Ready to post</div>
                {(() => {
                  const press = Math.max(0, 1 - Math.abs(f - T.click) / 3);
                  const done = f >= T.click;
                  return (
                    <div style={{ marginTop: 28, padding: "22px 0", borderRadius: 999, textAlign: "center", background: done ? "#16a34a" : `linear-gradient(135deg, ${OR}, ${PU})`, ...sans(40, "#fff"), transform: `scale(${1 - press * 0.08})`, boxShadow: "0 14px 30px rgba(124,58,237,0.35)" }}>
                      {done ? "✓ Approved" : "Approve"}
                    </div>
                  );
                })()}
              </div>
            </div>
          </In>
          {/* curseur */}
          {(() => {
            const q = prog(f, T.approve + 6, T.click, eInOut);
            return (
              <svg width={80} height={80} viewBox="0 0 24 24" style={{ position: "absolute", left: lerp(900, 690, q), top: lerp(1100, 760, q), opacity: prog(f, T.approve + 4, T.approve + 8), filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.3))" }}>
                <path d="M4 2 L4 19 L8.5 15 L11.5 21.5 L14.2 20.3 L11.3 14 L17 14 Z" fill={INK} stroke="#fff" strokeWidth={1.2} strokeLinejoin="round" />
              </svg>
            );
          })()}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", gap: 24 }}>
            {["Instagram", "TikTok", "Facebook"].map((n, i) => {
              const at = T.post2 + i * 4;
              return (
                <div key={n} style={{ padding: "18px 28px", ...card, borderRadius: 999, display: "flex", gap: 12, alignItems: "center", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: INK, opacity: prog(f, at, at + 4), transform: `scale(${prog(f, at, at + 10, eBack)})` }}>
                  <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#16a34a", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
                  {n}
                </div>
              );
            })}
          </div>
          <Row top={1300}>
            <Pop f={f} at={T.thats} style={G(130)}>THAT'S IT.</Pop>
          </Row>
        </AbsoluteFill>
      )}

      {/* F — daily special? snap a photo, video ready in a minute */}
      {sc(CUT.f, CUT.g) && (
        <AbsoluteFill style={exitStyle(f, CUT.g)}>
          <Row top={140} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.got} style={sans(62, INK)}>Got a</Pop>
            <Pop f={f} at={T.daily} style={G(104)}>DAILY SPECIAL?</Pop>
          </Row>
          <div style={{ position: "absolute", left: 300, top: 320 }}>
            <In f={f} at={T.got} style={{ left: 0, top: 0 }}>
              <PhoneL w={480}>
                {f < T.ready2 ? (
                  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #fff1e6, #f5c9ac 60%, #c98a64)" }}>
                    <div style={{ position: "absolute", left: 0, right: 0, top: "30%", textAlign: "center", fontSize: 230, filter: f < T.snap ? `blur(${lerp(6, 0, prog(f, T.got, T.snap))}px)` : undefined }}>🍲</div>
                    {/* viseur */}
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} style={{ position: "absolute", width: 70, height: 70, [i < 2 ? "top" : "bottom"]: 150, [i % 2 ? "right" : "left"]: 50, borderStyle: "solid", borderColor: "#fff", borderWidth: `${i < 2 ? 6 : 0}px ${i % 2 ? 6 : 0}px ${i < 2 ? 0 : 6}px ${i % 2 ? 0 : 6}px` } as React.CSSProperties} />
                    ))}
                    <div style={{ position: "absolute", left: "50%", bottom: 50, width: 110, height: 110, marginLeft: -55, borderRadius: "50%", border: "8px solid #fff", background: f >= T.snap && f < T.snap + 4 ? "#fff" : "rgba(255,255,255,0.3)" }} />
                    {f >= T.snap && f < T.ready2 ? (
                      <div style={{ position: "absolute", left: 60, right: 60, top: "62%", padding: "16px 0", borderRadius: 999, background: "rgba(26,15,36,0.8)", textAlign: "center", ...sans(30, "#fff") }}>
                        ✨ creating your video… {Math.min(100, Math.round(prog(f, T.snap + 4, T.ready2) * 100))}%
                      </div>
                    ) : null}
                  </AbsoluteFill>
                ) : (
                  <DishReel f={f} w={466} t0={T.ready2} emoji="🍲" title="SPECIAL" sub="beef bourguignon · 18€" />
                )}
              </PhoneL>
            </In>
          </div>
          <Row top={1340} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.snap} style={heavy(96, PU, 85)}>SNAP</Pop>
            <Pop f={f} at={T.photo} style={sans(60, INK)}>a photo,</Pop>
          </Row>
          <Row top={1460} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.ready2} style={G(96)}>READY</Pop>
            <Pop f={f} at={T.minute - 4} style={sans(60, INK)}>in a minute</Pop>
          </Row>
        </AbsoluteFill>
      )}

      {/* G — menu on the TV screen in the dining room */}
      {sc(CUT.g, CUT.h) && (
        <AbsoluteFill style={exitStyle(f, CUT.h)}>
          <Row top={170} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.menu2} style={sans(62, INK)}>Your menu comes to</Pop>
            <Pop f={f} at={T.life} style={G(104)}>LIFE</Pop>
          </Row>
          <In f={f} at={T.comes} style={{ left: 70, top: 470, width: 940 }}>
            <div style={{ width: 940, height: 560, borderRadius: 24, background: "#140b1c", padding: 18, boxShadow: "0 40px 90px rgba(60,20,90,0.35)" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 10, overflow: "hidden", position: "relative", background: "linear-gradient(135deg, #2a1236, #12081a)", opacity: prog(f, T.tv - 6, T.tv + 4) }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${30 + 20 * Math.sin(f / 30)}% 30%, rgba(255,90,31,0.45), transparent 55%)` }} />
                <div style={{ position: "absolute", left: 50, top: 36, ...heavy(64, "#fff", 85) }}>Chez Lou · Menu</div>
                {[
                  ["🍝", "Tagliatelle truffe", "19€"],
                  ["🥩", "Entrecôte frites", "24€"],
                  ["🥗", "Burrata & tomates", "14€"],
                  ["🍰", "Tarte tatin", "8€"],
                ].map(([e, n, p], i) => {
                  const at = T.tv + i * 5;
                  return (
                    <div key={n} style={{ position: "absolute", left: 50, right: 300, top: 140 + i * 88, display: "flex", alignItems: "center", gap: 18, fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#fff", opacity: prog(f, at, at + 6), transform: `translateX(${(1 - prog(f, at, at + 10, eExpo)) * -80}px)` }}>
                      <span style={{ fontSize: 44 }}>{e}</span>
                      <span style={{ flex: 1 }}>{n}</span>
                      <span style={{ color: "#ffb08a" }}>{p}</span>
                    </div>
                  );
                })}
                <div style={{ position: "absolute", right: 50, top: 130, width: 210, height: 330, borderRadius: 20, overflow: "hidden", transform: `scale(${prog(f, T.screen, T.screen + 12, eBack)})` }}>
                  <DishReel f={f} w={210} t0={T.screen} emoji="🍝" title="CHEF'S PICK" sub="today" />
                </div>
              </div>
            </div>
            <div style={{ width: 200, height: 40, margin: "0 auto", background: "linear-gradient(180deg, #3a2a48, #1a0f24)", borderRadius: "0 0 12px 12px" }} />
          </In>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center", gap: 30, fontSize: 80, opacity: prog(f, T.dining, T.dining + 8) }}>
            {["🪑", "🍽️", "🕯️", "🍽️", "🪑"].map((e, i) => (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - prog(f, T.dining + i * 2, T.dining + i * 2 + 10, eBack)) * 80}px)` }}>
                {e}
              </span>
            ))}
          </div>
          <Row top={1330} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.tv - 3} style={sans(58, INK)}>on the</Pop>
            <Pop f={f} at={T.tv} style={heavy(100, PU, 85)}>TV SCREEN</Pop>
          </Row>
          <Row top={1450}>
            <Pop f={f} at={T.dining - 4} style={sans(58, INK)}>in your dining room</Pop>
          </Row>
        </AbsoluteFill>
      )}

      {/* H — Kinetik Resto. Your socials keep running, you keep cooking. */}
      {sc(CUT.h, CUT.i) && (
        <AbsoluteFill style={exitStyle(f, CUT.i)}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 420 }}>
            <LogoDark f={f} at={T.kinetik2} size={130} suffix={f >= T.resto ? "Resto" : undefined} />
          </div>
          <div style={{ position: "absolute", left: 110, right: 110, top: 760, display: "flex", gap: 30 }}>
            <In f={f} at={T.socials2} style={{ position: "relative", flex: 1, padding: "34px 20px", ...card, textAlign: "center" }}>
              <div style={{ fontSize: 80 }}>📱</div>
              <div style={{ ...heavy(110, OR, 80), ...grad, fontVariantNumeric: "tabular-nums" }}>{posts}</div>
              <div style={{ ...caps(20, SOFT), letterSpacing: "0.2em" }}>posts published</div>
            </In>
            <In f={f} at={T.you} style={{ position: "relative", flex: 1, padding: "34px 20px", ...card, textAlign: "center" }}>
              <div style={{ fontSize: 80, transform: `rotate(${Math.sin(f / 4) * 8}deg)` }}>👨‍🍳</div>
              <div style={{ fontSize: 110, lineHeight: 1, transform: `translateY(${-Math.abs(Math.sin(f / 5)) * 20}px)` }}>🍳</div>
              <div style={{ ...caps(20, SOFT), letterSpacing: "0.2em", marginTop: 10 }}>you, cooking</div>
            </In>
          </div>
          <Row top={1240} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.socials2} style={sans(58, INK)}>Your socials keep</Pop>
            <Pop f={f} at={T.running} style={heavy(96, PU, 85)}>RUNNING,</Pop>
          </Row>
          <Row top={1360} gap={18} style={{ alignItems: "center" }}>
            <Pop f={f} at={T.you} style={sans(58, INK)}>you keep</Pop>
            <Pop f={f} at={T.cooking} style={G(110)}>COOKING.</Pop>
          </Row>
        </AbsoluteFill>
      )}

      {/* I — comment MOTION */}
      {f >= CUT.i - 1 && <LightCommentOutro f={f} a={CUT.i} t={T} />}
    </LightShell>
  );
};
