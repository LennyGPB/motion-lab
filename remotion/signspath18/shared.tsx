import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, SANS } from "../signspath/theme";
import { eBack, eIn, eOut, lerp, prog } from "../signspath/util";
import { T } from "../signspath/timing";

/** Scènes : visibilité + entrée/sortie floue, pour un objet SC de plages [début, fin] (s voix). */
export const mkScenes = <K extends string>(SC: Record<K, readonly [number, number]>) => ({
  on: (f: number, k: K) => f >= T(SC[k][0]) - 1 && f < T(SC[k][1]) + 2,
  fx: (f: number, k: K) => {
    const a = T(SC[k][0]);
    const b = T(SC[k][1]);
    const i = prog(f, a, a + 10, eOut);
    const o = prog(f, b - 10, b, eIn);
    return {
      opacity: i * (1 - o),
      transform: `scale(${lerp(1.06, 1, i) * (1 + o * 0.08)})`,
      filter: i < 1 || o > 0 ? `blur(${(1 - i) * 14 + o * 18}px)` : undefined,
    } as React.CSSProperties;
  },
});

export const capsStyle: React.CSSProperties = { fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.32em", color: C.muted, textTransform: "uppercase" };
export const glass = (a: number): React.CSSProperties => ({
  background: `linear-gradient(160deg, rgba(255,255,255,${0.08 + 0.12 * a}), rgba(190,170,255,0.04)), rgba(36,18,92,0.85)`,
  border: `1.5px solid rgba(225,215,255,${0.2 + 0.5 * a})`,
  boxShadow: `0 0 ${a * 40}px rgba(150,110,255,${0.55 * a})`,
});
export const pillBg = "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))";
export const LOGO = staticFile("signspath/app/logo.png");

/** Logo Signs (soleil souriant) avec halo. */
export const Logo: React.FC<{ size: number; q: number; f: number }> = ({ size, q, f }) => (
  <Img
    src={LOGO}
    style={{
      width: size,
      height: size * (330 / 320),
      opacity: Math.min(1, q * 1.4),
      transform: `scale(${lerp(0.6, 1, Math.min(1, q))}) rotate(${Math.sin(f / 40) * 4}deg)`,
      filter: `drop-shadow(0 0 ${18 + 10 * Math.sin(f / 12)}px rgba(190,160,255,0.95))${q < 1 ? ` blur(${(1 - q) * 8}px)` : ""}`,
    }}
  />
);

/** Téléphone avec une vraie capture de l'app. */
export const Shot: React.FC<{ src: string; w: number; q: number; rot?: number; lit?: number }> = ({ src, w, q, rot = 0, lit = 1 }) => (
  <div style={{ width: w, height: w * (2000 / 891), borderRadius: w * 0.13, overflow: "hidden", border: `2px solid rgba(225,215,255,${0.25 + 0.45 * lit})`, boxShadow: `0 30px 70px rgba(5,0,20,0.7), 0 0 ${50 * lit}px rgba(150,110,255,${0.5 * lit})`, opacity: Math.min(1, q * 1.4), transform: `translateY(${(1 - Math.min(1, q)) * 120}px) rotate(${rot}deg) scale(${lerp(0.85, 1, Math.min(1, q))})`, filter: lit < 1 ? `brightness(${0.55 + 0.45 * lit})` : undefined }}>
    <Img src={staticFile(`signspath/app/${src}.png`)} style={{ width: "100%", height: "100%", display: "block" }} />
  </div>
);

/* ---------- CTA : logo dans la sphère + « available on iOS and Android » ---------- */
export const StoreCTA: React.FC<{ f: number; W: { signs2: number; available: number; ios: number; android: number; end: number }; top?: number }> = ({ f, W, top = 470 }) => {
  const lq = prog(f, T(W.signs2) - 4, T(W.signs2) + 14, eBack);
  const av = prog(f, T(W.available) - 2, T(W.available) + 10, eOut);
  const tag = prog(f, T(W.end), T(W.end) + 16, eOut);
  const store = (at: number, top: string, name: string) => {
    const q = prog(f, T(at) - 2, T(at) + 12, eBack);
    return (
      <div style={{ width: 380, padding: "22px 0", borderRadius: 30, ...glass(0.7), display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, q * 1.4), transform: `translateY(${(1 - Math.min(1, q)) * 50}px) scale(${lerp(0.85, 1, Math.min(1, q))})` }}>
        <span style={{ ...capsStyle, fontSize: 18, color: C.lilacSoft }}>{top}</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, color: C.white, letterSpacing: -1, marginTop: 4 }}>{name}</span>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
        <Logo size={260} q={lq} f={f} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: top + 390, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 150, color: C.white, letterSpacing: -4, opacity: Math.min(1, lq * 1.4), filter: lq < 1 ? `blur(${(1 - Math.min(1, lq)) * 10}px)` : undefined }}>Signs</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: top + 620, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 48, color: C.muted, opacity: av }}>
        available on
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: top + 720, display: "flex", justifyContent: "center", gap: 30 }}>
        {store(W.ios, "iOS", "App Store")}
        {store(W.android, "Android", "Google Play")}
      </div>
      <div style={{ position: "absolute", top: top + 970, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: "0.5em", color: C.muted, opacity: tag, transform: `translateY(${(1 - tag) * 20}px)` }}>
        MANIFEST WITH METHOD
      </div>
    </AbsoluteFill>
  );
};

