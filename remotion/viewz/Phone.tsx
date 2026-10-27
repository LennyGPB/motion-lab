import { Img, staticFile } from "remotion";
import { V } from "./theme";

export const PW = 560;
export const PH = 1180;
export const SW = PW - 36;
export const SH = PH - 36;

export type ScreenName = "splash" | "recherches" | "map" | "live" | "messages";

type Props = {
  screen: ScreenName;
  prev?: ScreenName;
  /** 0..1 progression du swipe vers `screen` */
  swap: number;
  /** décalage vertical du contenu (scroll) en px écran */
  scroll?: number;
  zoom?: number;
  glare: number;
  glow: number;
  children?: React.ReactNode;
};

const ScreenImg: React.FC<{ name: ScreenName; scroll: number; zoom: number }> = ({ name, scroll, zoom }) => {
  if (name === "splash") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 55%, #3a0a6b 0%, #12001f 45%, #050008 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img src={staticFile("viewz/logo.png")} style={{ width: SW * 0.62, filter: "drop-shadow(0 0 24px rgba(200,100,255,0.8))" }} />
      </div>
    );
  }
  return (
    <Img
      src={staticFile(`viewz/screens/${name}.jpg`)}
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        height: SH,
        width: "auto",
        transform: `translateX(-50%) translateY(${-scroll}px) scale(${zoom})`,
        transformOrigin: "50% 45%",
      }}
    />
  );
};

/** Téléphone (mockup) avec écran de l'app, reflet et lueur violette. */
export const Phone: React.FC<Props> = ({ screen, prev, swap, scroll = 0, zoom = 1, glare, glow, children }) => (
  <div
    style={{
      width: PW,
      height: PH,
      borderRadius: 86,
      padding: 18,
      background: "linear-gradient(145deg, #3a3346 0%, #0d0b12 30%, #1b1724 70%, #4a4258 100%)",
      boxShadow: `0 0 0 2px rgba(255,255,255,0.08), 0 0 ${60 + glow * 120}px rgba(170,60,255,${0.35 + glow * 0.4}), 0 60px 120px rgba(0,0,0,0.6)`,
      position: "relative",
    }}
  >
    <div style={{ position: "relative", width: SW, height: SH, borderRadius: 68, overflow: "hidden", background: "#000" }}>
      {prev && swap < 1 ? (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${-swap * 35}%)`, filter: `blur(${swap * 8}px)`, opacity: 1 - swap * 0.5 }}>
          <ScreenImg name={prev} scroll={0} zoom={1} />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${(1 - swap) * 100}%)`,
          filter: swap < 1 ? `blur(${(1 - swap) * 10}px)` : undefined,
          boxShadow: swap < 1 ? "-30px 0 60px rgba(0,0,0,0.6)" : undefined,
        }}
      >
        <ScreenImg name={screen} scroll={scroll} zoom={zoom} />
        {children}
      </div>
      {/* dynamic island */}
      <div style={{ position: "absolute", top: 22, left: SW / 2 - 70, width: 140, height: 40, borderRadius: 20, background: "#000" }} />
      {/* reflet */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${115 + glare * 30}deg, transparent 30%, rgba(255,255,255,0.13) 42%, transparent 55%)`,
          pointerEvents: "none",
        }}
      />
      {/* liseré violet intérieur */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 68, boxShadow: `inset 0 0 0 1.5px rgba(200,140,255,0.25), inset 0 0 40px rgba(140,40,255,${0.15 + glow * 0.2})` }} />
    </div>
    {/* boutons latéraux */}
    <div style={{ position: "absolute", left: -5, top: 260, width: 5, height: 90, borderRadius: 3, background: "#2a2433" }} />
    <div style={{ position: "absolute", right: -5, top: 330, width: 5, height: 150, borderRadius: 3, background: "#2a2433" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: 86, border: `1.5px solid rgba(220,180,255,${0.18 + glow * 0.3})`, pointerEvents: "none" }} />
  </div>
);

export { V };
