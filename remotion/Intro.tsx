import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Palette
export const COLORS = {
  bg: "#0b0b14",
  violet: "#7c3aed",
  cyan: "#22d3ee",
  text: "#f8fafc",
  muted: "#94a3b8",
};

// Séquences (en frames, 30 fps)
// 0–30    : fond + halo qui s'ouvre (spring)
// 20–65   : "MOTION" lettre par lettre (slide-up, easeOutCubic, décalage 4 f)
// 55–85   : "LAB" + barre d'accent qui s'étire (easeInOutCubic)
// 85–110  : tagline en fondu
// 150–180 : sortie (fondu + léger zoom, easeInCubic)

const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);
const easeIn = Easing.in(Easing.cubic);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Halo
  const halo = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const haloRotate = interpolate(frame, [0, 180], [0, 40]);

  // Sortie
  const outT = interpolate(frame, [150, 180], [0, 1], { ...clamp, easing: easeIn });
  const globalOpacity = 1 - outT;
  const globalScale = 1 + outT * 0.08;

  // "LAB" + barre
  const labT = interpolate(frame, [55, 75], [0, 1], { ...clamp, easing: easeOut });
  const barT = interpolate(frame, [60, 85], [0, 1], { ...clamp, easing: easeInOut });

  // Tagline
  const tagT = interpolate(frame, [85, 110], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: "Inter, Helvetica, Arial, sans-serif" }}>
      {/* Halo dégradé */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 1100,
            height: 1100,
            borderRadius: "50%",
            background: `conic-gradient(from ${haloRotate}deg, ${COLORS.violet}, ${COLORS.cyan}, ${COLORS.violet})`,
            filter: "blur(140px)",
            opacity: 0.45 * halo * globalOpacity,
            transform: `scale(${0.4 + 0.6 * halo})`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: globalOpacity,
          transform: `scale(${globalScale})`,
        }}
      >
        {/* MOTION */}
        <div style={{ display: "flex", overflow: "hidden", height: 230 }}>
          {"MOTION".split("").map((ch, i) => {
            const t = interpolate(frame, [20 + i * 4, 40 + i * 4], [0, 1], { ...clamp, easing: easeOut });
            return (
              <span
                key={i}
                style={{
                  fontSize: 200,
                  fontWeight: 800,
                  letterSpacing: 6,
                  color: COLORS.text,
                  lineHeight: "230px",
                  transform: `translateY(${(1 - t) * 230}px)`,
                  opacity: t,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* LAB */}
        <div
          style={{
            fontSize: 200,
            fontWeight: 800,
            letterSpacing: 40,
            lineHeight: "230px",
            color: COLORS.cyan,
            opacity: labT,
            transform: `translateY(${(1 - labT) * 60}px)`,
            marginRight: -40,
          }}
        >
          LAB
        </div>

        {/* Barre d'accent */}
        <div
          style={{
            marginTop: 40,
            width: 520 * barT,
            height: 14,
            borderRadius: 7,
            background: `linear-gradient(90deg, ${COLORS.violet}, ${COLORS.cyan})`,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            marginTop: 70,
            fontSize: 52,
            fontWeight: 500,
            letterSpacing: 4,
            color: COLORS.muted,
            opacity: tagT,
            transform: `translateY(${(1 - tagT) * 30}px)`,
          }}
        >
          Motion design, en code.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
