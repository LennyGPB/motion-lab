import React from "react";
import { AbsoluteFill, Html5Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { eInOut, prog } from "../viewz/util";
import { CYAN, GridFloor } from "../kinetik2/parts";
import { KLogo, Pop, Row, heavy } from "../kinetik3/Kinetik3";
import { T } from "../kinetik16/timing";
import { ENV } from "./env";

loadViewzFonts();

export const MASCOT_FRAMES = 240;
const IW = 736;
const IH = 815;
const S = 1000 / IW; // échelle d'affichage

/** Mascotte qui « parle » : tête qui bouge, mâchoire pilotée par le volume, yeux et filtres lumineux. */
export type Place = { x: number; y: number; s: number; rot?: number; ry?: number; flip?: boolean };
export const Mascot: React.FC<{ f: number; voiceFrom: number; env?: number[]; place?: Place; fade?: boolean }> = ({ f, voiceFrom, env: E = ENV, place, fade }) => {
  const env = (k: number) => E[Math.max(0, Math.min(E.length - 1, k - voiceFrom))] ?? 0;
  const talk = f >= voiceFrom ? env(f) : 0;
  const smooth = f >= voiceFrom ? (env(f) + env(f - 1) + env(f - 2) + env(f - 3)) / 4 : 0;
  const headRot = 2 * Math.sin(f / 21) + (smooth - 0.35) * 3.5;
  const headY = 3 * Math.sin(f / 17) - 6 * smooth;
  const breathe = 1 + 0.01 * Math.sin(f / 24);
  const jawY = talk * 22;
  const jawRot = talk * 3;
  const blink = f % 95 > 90 ? 0.15 : 1;
  const eye = (0.55 + 0.45 * smooth) * blink;
  const layer: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: IW, height: IH };
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: IW,
        height: IH,
        transformOrigin: "50% 100%",
        transform: place
          ? `translate(${place.x - IW / 2}px, ${place.y - IH}px) perspective(1400px) rotateY(${place.ry ?? 0}deg) rotate(${place.rot ?? 0}deg) scale(${S * place.s}) scaleX(${place.flip ? -1 : 1})`
          : `translate(${540 - IW / 2}px, ${1920 - IH}px) scale(${S})`,
        WebkitMaskImage: fade ? "linear-gradient(180deg, #000 72%, transparent 98%)" : undefined,
        maskImage: fade ? "linear-gradient(180deg, #000 72%, transparent 98%)" : undefined,
      }}
    >
      {/* corps qui respire */}
      <Img src={staticFile("mascot/body.png")} style={{ ...layer, transformOrigin: "50% 100%", transform: `scaleY(${breathe})` }} />
      {/* tête + mâchoire, pivot au cou */}
      <div style={{ ...layer, transformOrigin: "370px 590px", transform: `translateY(${headY}px) rotate(${headRot}deg)` }}>
        {/* lumière derrière les trous des yeux */}
        {[
          [193, 292, 62],
          [418, 224, 66],
        ].map(([x, y, r], i) => (
          <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${eye}), rgba(94,230,242,${0.85 * eye}) 45%, rgba(40,20,90,0.9) 75%)`, boxShadow: `0 0 ${40 * eye}px rgba(94,230,242,${eye})` }} />
        ))}
        <Img src={staticFile("mascot/head.png")} style={layer} />
        {/* filtres jaunes qui s'allument quand il parle */}
        {[
          [163, 467, 50],
          [517, 383, 52],
        ].map(([x, y, r], i) => (
          <div key={`g${i}`} style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,240,150,${0.75 * smooth}), rgba(255,200,60,${0.4 * smooth}) 55%, rgba(255,200,60,0) 75%)`, mixBlendMode: "screen" }} />
        ))}
        <Img src={staticFile("mascot/jaw.png")} style={{ ...layer, transformOrigin: "225px 520px", transform: `translateY(${jawY}px) rotate(${jawRot}deg)` }} />
        {/* ondes sonores près de la bouche */}
        {[0, 1, 2].map((k) => (
          <div key={`w${k}`} style={{ position: "absolute", left: 520 + k * 26, top: 500 - k * 14, width: 40 + k * 26, height: 70 + k * 30, borderRadius: "50%", borderRight: `6px solid ${CYAN}`, opacity: Math.max(0, smooth - 0.25 - k * 0.15) * 1.6, filter: `drop-shadow(0 0 8px ${CYAN})` }} />
        ))}
      </div>
    </div>
  );
};

const LINES: { a: number; b: number; parts: [string, string][] }[] = [
  { a: T.motion0, b: T.instagram, parts: [["MOTION", "#fff"], ["DESIGN,", CYAN]] },
  { a: T.instagram, b: T.video, parts: [["INSTAGRAM &", "#fff"], ["TIKTOK POSTS,", CYAN]] },
  { a: T.video, b: T.design2, parts: [["VIDEO", "#fff"], ["EDITING,", CYAN]] },
  { a: T.design2, b: T.get, parts: [["DESIGN?", CYAN]] },
  { a: T.get, b: T.kinetik, parts: [["GET IT ALL", "#fff"], ["IN 3 SECONDS", CYAN]] },
];

/** Test : la mascotte dit le début de la pub « Get it all in 3 seconds ». */
export const MascotTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#03080a", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 70%, rgba(130,90,255,0.45), rgba(40,170,185,0.15) 45%, transparent 75%)" }} />
      <GridFloor f={f} tint="rgba(94,230,242,0.42)" />
      <Mascot f={f} voiceFrom={3} />
      {LINES.map((l) =>
        f >= l.a - 1 && f < l.b ? (
          <React.Fragment key={l.a}>
            {l.parts.map(([t, c], i) => (
              <Row key={t} top={150 + i * 140}>
                <Pop f={f} at={l.a + i * 4} style={heavy(t.length > 10 ? 120 : 150, c, 80)}>{t}</Pop>
              </Row>
            ))}
          </React.Fragment>
        ) : null,
      )}
      {f >= T.kinetik - 1 ? (
        <div style={{ position: "absolute", top: 220, left: 0, right: 0 }}>
          <KLogo f={f} at={T.kinetik} size={150} />
        </div>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: prog(f, MASCOT_FRAMES - 10, MASCOT_FRAMES - 1, eInOut) }} />
      <Sequence from={3} layout="none">
        <Html5Audio src={staticFile("kinetik16/voice.wav")} volume={0.95} />
      </Sequence>
      <Html5Audio src={staticFile("kinetik16/sfx/music.wav")} volume={0.22} />
    </AbsoluteFill>
  );
};
