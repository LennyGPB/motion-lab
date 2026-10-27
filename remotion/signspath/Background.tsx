import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Canvas } from "./Canvas";
import { C } from "./theme";
import { hash } from "./util";

const STARS = Array.from({ length: 220 }, (_, i) => ({
  x: hash(i * 3.1) * 1080,
  y: hash(i * 7.7) * 1920,
  r: 0.6 + hash(i * 1.3) * 1.6,
  tw: hash(i * 9.9) * Math.PI * 2,
  sp: 0.03 + hash(i * 4.2) * 0.08,
  depth: 0.2 + hash(i * 5.5) * 0.8,
}));

/** Fond commun : dégradé violet, poussière d'étoiles, halo qui respire, grain, vignette. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = 0.85 + 0.15 * Math.sin(frame / 40);
  const glowY = interpolate(frame, [0, 870], [42, 50]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bgDeep }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 60% at 50% ${glowY}%, ${C.bgGlow} 0%, ${C.bgMid} 45%, ${C.bgDeep} 100%)`,
          opacity: breathe,
        }}
      />
      <Canvas
        draw={(ctx, f) => {
          for (const s of STARS) {
            const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(f * s.sp + s.tw));
            const y = (s.y - f * 0.25 * s.depth + 1920) % 1920;
            ctx.fillStyle = `rgba(214,200,255,${a * s.depth})`;
            ctx.beginPath();
            ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }}
      />
      {/* Grain animé */}
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
        <svg width="1080" height="1920">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 12} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(ellipse 75% 60% at 50% 50%, transparent 55%, rgba(3,0,12,0.75) 100%)",
      pointerEvents: "none",
    }}
  />
);
