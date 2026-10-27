import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GlassCard } from "./Card";
import { C, SANS, SERIF, serifGradient } from "./theme";
import { AREAS, PICKED, SCENES, T, W } from "./timing";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "./util";
import { Words } from "./Words";

const R = 470;
const CX = 540;
const CY = 1080;
const CW = 260;
const CH = 340;

type Pose = { x: number; y: number; z: number; ry: number; rz: number; s: number; o: number; blur: number };

const norm = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

/** Scènes 2 & 3 : les huit domaines en carrousel 3D, puis "one at a time" → choix d'une carte → "today". */
export const SceneAreas: React.FC = () => {
  const f = useCurrentFrame() + SCENES.areas.from;

  // Rotation du carrousel : chaque domaine vient face caméra quand il est prononcé
  let rot = -45 - 200 * (1 - prog(f, T(W.eight), T(W.money) - 2, eOut));
  AREAS.forEach((a) => {
    rot += 45 * prog(f, T(a.at) - 5, T(a.at) + 7, eInOut);
  });

  const activeIdx = AREAS.reduce((acc, a, i) => (f >= T(a.at) - 3 ? i : acc), -1);
  const ringIn = (i: number) => prog(f, T(W.eight) + i * 2, T(W.eight) + i * 2 + 22, eExpo);
  const deck = prog(f, T(W.one1) - 4, T(W.one1) + 14, eInOut);
  const fan = prog(f, T(W.pick) - 3, T(W.pick) + 14, eOut);
  const pick = prog(f, T(W.matters) - 4, T(W.matters) + 16, eOut);
  const exit = prog(f, T(16.72), T(17.0), eIn);

  const poses: Pose[] = AREAS.map((_, i) => {
    // 1) anneau
    const theta = norm(i * 45 - rot);
    const rad = (theta * Math.PI) / 180;
    const ri = ringIn(i);
    const front = (Math.cos(rad) + 1) / 2;
    let p: Pose = {
      x: CX + R * Math.sin(rad) * ri + (1 - ri) * (hash(i) - 0.5) * 900,
      y: CY + (1 - ri) * (hash(i + 9) - 0.5) * 1200,
      z: (R * Math.cos(rad) - R) * ri - (1 - ri) * 2500,
      ry: theta,
      rz: 0,
      s: 1 + (i === activeIdx ? 0.12 : 0),
      o: ri * (0.3 + 0.7 * front),
      blur: (1 - front) * 3,
    };
    // 2) paquet
    if (deck > 0) {
      const d: Pose = { x: CX + (i - 3.5) * 3, y: CY + 40 - i * 5, z: i * 2, ry: 0, rz: (i - 3.5) * 2.5, s: 0.95, o: 1, blur: 0 };
      p = mix(p, d, deck);
    }
    // 3) éventail
    if (fan > 0) {
      const k = i - 3.5;
      const fp: Pose = { x: CX + k * 120, y: CY + 70 + k * k * 9, z: 0, ry: 0, rz: k * 7, s: 0.66, o: 1, blur: 0 };
      p = mix(p, fp, fan);
    }
    // 4) choix
    if (pick > 0) {
      const chosen = i === PICKED;
      const pk: Pose = chosen
        ? { x: CX, y: CY - 90, z: 150, ry: 0, rz: 0, s: 1.05, o: 1, blur: 0 }
        : { ...p, y: p.y + 160, o: 0.18, blur: 6, s: p.s * 0.92 };
      p = mix(p, pk, pick);
    }
    // 5) sortie : la carte choisie fonce vers la caméra
    if (exit > 0) {
      p = i === PICKED ? { ...p, s: p.s * (1 + exit * 2.5), blur: exit * 20, o: p.o * (1 - exit) } : { ...p, o: p.o * (1 - exit) };
    }
    return p;
  });

  const isActive = (i: number) => {
    if (pick > 0) return i === PICKED ? pick : 0;
    if (deck > 0) return 0;
    return i === activeIdx ? prog(f, T(AREAS[i].at) - 4, T(AREAS[i].at) + 4) : 0;
  };

  // Grand "8" fantôme derrière
  const eightIn = prog(f, T(W.eight) - 2, T(W.eight) + 20, eExpo);
  const eightOut = prog(f, T(W.money), T(W.money) + 20);

  // Légende du domaine courant
  const captionOut = prog(f, T(W.spiritualityEnd), T(W.one1), eIn);

  // "today" : tampon
  const today = prog(f, T(W.today) - 2, T(W.today) + 12, eBack);
  const shock = prog(f, T(W.today), T(W.today) + 22, eOut);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit * 0.2 }}>
      {/* Halo central */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: CY - 450,
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(80,40,180,0.12) 45%, transparent 70%)",
            transform: `scale(${0.8 + 0.2 * Math.sin(f / 25)})`,
          }}
        />
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          top: 330,
          width: "100%",
          textAlign: "center",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 1100,
          lineHeight: 1,
          color: "rgba(185,166,255,0.07)",
          transform: `scale(${0.6 + 0.4 * eightIn}) translateY(${eightOut * -80}px)`,
          opacity: eightIn * (1 - eightOut * 0.6) * (1 - deck),
        }}
      >
        8
      </div>

      <Words
        f={f}
        top={270}
        size={92}
        exitAt={T(W.spiritualityEnd) + 2}
        lines={[
          [
            { t: "Eight", at: W.eight, kind: "serif" },
            { t: "areas.", at: W.areas, kind: "bold" },
          ],
        ]}
      />

      {/* Carrousel 3D */}
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: `50% ${CY - 200}px` }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateX(${-8 * (1 - deck)}deg)`, transformOrigin: `50% ${CY}px` }}>
          {poses
            .map((p, i) => ({ p, i }))
            .sort((a, b) => a.p.z - b.p.z)
            .map(({ p, i }) => (
              <div
                key={AREAS[i].key}
                style={{
                  position: "absolute",
                  left: p.x - CW / 2,
                  top: p.y - CH / 2,
                  transform: `translateZ(${p.z}px) rotateY(${p.ry}deg) rotateZ(${p.rz}deg) scale(${p.s})`,
                  opacity: p.o,
                  filter: p.blur > 0.3 ? `blur(${p.blur}px)` : undefined,
                }}
              >
                <GlassCard icon={AREAS[i].key} label={AREAS[i].label} active={isActive(i)} />
              </div>
            ))}
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Légende du domaine prononcé */}
      {AREAS.map((a, i) => {
        const inP = prog(f, T(a.at) - 3, T(a.at) + 7);
        const next = AREAS[i + 1];
        const outP = next ? prog(f, T(next.at) - 4, T(next.at) + 2, eIn) : captionOut;
        const v = inP * (1 - outP);
        if (v <= 0) return null;
        return (
          <div
            key={a.key}
            style={{
              position: "absolute",
              top: 1440,
              width: "100%",
              textAlign: "center",
              opacity: v,
              filter: `blur(${(1 - v) * 14}px)`,
              transform: `translateY(${(1 - inP) * 30 - outP * 30}px)`,
            }}
          >
            <span style={{ ...serifGradient, fontSize: 150, filter: "drop-shadow(0 0 30px rgba(160,120,255,0.5))" }}>{a.label}</span>
          </div>
        );
      })}

      {/* Index 01/08 */}
      <div
        style={{
          position: "absolute",
          top: 1660,
          width: "100%",
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: "0.35em",
          color: C.muted,
          opacity: prog(f, T(W.money), T(W.money) + 8) * (1 - captionOut),
        }}
      >
        {String(Math.max(1, activeIdx + 1)).padStart(2, "0")} / 08
      </div>

      <Words
        f={f}
        top={290}
        size={96}
        exitAt={T(W.timeEnd) + 6}
        lines={[
          [
            { t: "One", at: W.one1, kind: "serif" },
            { t: "at", at: W.at2, kind: "bold" },
            { t: "a", at: W.a, kind: "bold" },
            { t: "time.", at: W.time, kind: "bold" },
          ],
        ]}
      />

      <Words
        f={f}
        top={240}
        size={80}
        exitAt={T(16.7)}
        lines={[
          [
            { t: "Pick", at: W.pick, kind: "bold" },
            { t: "the", at: W.the },
            { t: "one", at: W.one2 },
          ],
          [
            { t: "that", at: W.that, kind: "muted" },
            { t: "matters", at: W.matters, kind: "serif" },
            { t: "most", at: W.most, kind: "bold" },
          ],
          [
            { t: "to", at: W.to2, kind: "muted" },
            { t: "you,", at: W.you2, kind: "muted" },
          ],
        ]}
      />

      {/* Onde de choc + tampon "today." */}
      {shock > 0 && shock < 1 ? (
        <div
          style={{
            position: "absolute",
            left: CX - 300,
            top: 1330 - 300,
            width: 600,
            height: 600,
            borderRadius: "50%",
            border: `${6 * (1 - shock)}px solid rgba(200,180,255,${0.8 * (1 - shock)})`,
            transform: `scale(${0.2 + shock * 1.6})`,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          top: 1270,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(today, [0, 0.3], [0, 1], clamp) * (1 - exit),
          transform: `scale(${lerp(2.4, 1, today)}) rotate(${lerp(-12, -4, today)}deg)`,
        }}
      >
        <div
          style={{
            padding: "18px 60px 26px",
            borderRadius: 999,
            background: "linear-gradient(135deg, rgba(167,139,250,0.95), rgba(124,58,237,0.95))",
            boxShadow: "0 0 60px rgba(139,92,246,0.8), inset 0 2px 0 rgba(255,255,255,0.4)",
          }}
        >
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 110, color: "#fff", lineHeight: 1 }}>today.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const mix = (a: Pose, b: Pose, t: number): Pose => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t),
  ry: lerp(a.ry, b.ry, t),
  rz: lerp(a.rz, b.rz, t),
  s: lerp(a.s, b.s, t),
  o: lerp(a.o, b.o, t),
  blur: lerp(a.blur, b.blur, t),
});
