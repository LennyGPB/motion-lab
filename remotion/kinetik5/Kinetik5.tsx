import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadViewzFonts } from "../viewz/theme";
import { loadFonts } from "../signspath/theme";
import { eBack, eExpo, eInOut, hash, lerp, prog } from "../viewz/util";
import { CYAN, GridFloor, LAV, Streaks } from "../kinetik2/parts";
import {
  Cursor,
  Float3D,
  KLogo,
  Pop,
  Row,
  Screen,
  caps,
  exitStyle,
  heavy,
  sans,
} from "../kinetik3/Kinetik3";
import { CUT, DURATION_FRAMES, T, VO } from "./timing";

loadViewzFonts();
loadFonts();

const DIR = "kinetik5";
const CUTS = Object.values(CUT);
const glowC = "rgba(94,230,242,0.5)";
const HITS: [number, number][] = [
  [T.kinetik, 10],
  [T.kinetik2, 14],
  [T.done, 26],
  [T.n150, 12],
  [T.drop, 26],
  [T.follow, 14],
];
const SW = 980;
export const AR: Record<string, number> = {
  instagram: 1.463,
  signature: 1.462,
  physical: 1.438,
  motion: 1.526,
  community: 1.498,
  store: 1.495,
};

/** Cartes de modèles réelles (centre normalisé dans chaque capture). */
const CARDS: { src: string; x: number; y: number; w: number; h: number }[] = [
  ...[0.16, 0.387, 0.613, 0.84].map((x) => ({
    src: "instagram",
    x,
    y: 0.48,
    w: 0.214,
    h: 0.39,
  })),
  ...[0.146, 0.374, 0.603, 0.831].map((x) => ({
    src: "signature",
    x,
    y: 0.484,
    w: 0.216,
    h: 0.47,
  })),
  ...[0.139, 0.371, 0.602, 0.834].map((x) => ({
    src: "physical",
    x,
    y: 0.48,
    w: 0.219,
    h: 0.47,
  })),
  ...[0.16, 0.385, 0.61, 0.835].map((x) => ({
    src: "store",
    x,
    y: 0.506,
    w: 0.212,
    h: 0.475,
  })),
  ...[0.375, 0.602, 0.829].map((x) => ({
    src: "community",
    x,
    y: 0.508,
    w: 0.214,
    h: 0.48,
  })),
  ...[0.173, 0.39, 0.607, 0.825].map((x) => ({
    src: "motion",
    x,
    y: 0.52,
    w: 0.214,
    h: 0.47,
  })),
];
/** Recadre une carte de modèle dans une capture. */
export const CardCrop: React.FC<{ i: number; w: number; glow?: number }> = ({
  i,
  w,
  glow = 0,
}) => {
  const c = CARDS[i % CARDS.length];
  const imgW = w / c.w;
  const imgH = imgW / AR[c.src];
  const h = c.h * imgH;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.07,
        overflow: "hidden",
        position: "relative",
        border: `2px solid ${glow > 0 ? CYAN : "rgba(255,255,255,0.15)"}`,
        boxShadow:
          glow > 0
            ? `0 0 ${30 * glow}px ${CYAN}`
            : "0 14px 30px rgba(0,0,0,0.55)",
      }}
    >
      <Img
        src={staticFile(`${DIR}/screens/${c.src}.jpg`)}
        style={{
          position: "absolute",
          width: imgW,
          height: imgH,
          left: -c.x * imgW + w / 2,
          top: -c.y * imgH + h / 2,
          maxWidth: "none",
        }}
      />
    </div>
  );
};

export const Tag: React.FC<{ f: number; a: number; label: string; top?: number }> = ({
  f,
  a,
  label,
  top = 1640,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      opacity: prog(f, a + 4, a + 10),
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 26px",
        borderRadius: 999,
        border: "1.5px solid rgba(94,230,242,0.5)",
        background: "rgba(5,20,26,0.7)",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: CYAN,
          boxShadow: `0 0 10px ${CYAN}`,
        }}
      />
      <span style={{ ...caps(24, "#fff"), letterSpacing: "0.22em" }}>
        {label}
      </span>
    </div>
  </div>
);

/** Bloc de sous-titres qui laisse la place au suivant (sortie floue). */
export const Block: React.FC<{
  f: number;
  from: number;
  to: number;
  children: React.ReactNode;
}> = ({ f, from, to, children }) =>
  f >= from - 1 && f < to + 1 ? (
    <div style={exitStyle(f, to, 3)}>{children}</div>
  ) : null;

/** Capture qui défile latéralement (zoom centré sur un point qui se déplace). */
export const PanScreen: React.FC<{
  f: number;
  a: number;
  b: number;
  src: string;
  zoom: number;
  x0: number;
  x1: number;
  y: number;
  ry?: number;
  cy?: number;
  hl?: { i: number; at: number } | null;
}> = ({ f, a, b, src, zoom, x0, x1, y, ry = -12, cy = 1230, hl }) => {
  const ar = AR[src];
  const z = lerp(1, zoom, prog(f, a, a + 16, eInOut));
  const x = lerp(x0, x1, prog(f, a + 6, b - 4, eInOut));
  const card = hl ? CARDS[hl.i] : null;
  return (
    <Float3D f={f} a={a} b={b} cy={cy} w={SW} h={SW / ar} ry={ry}>
      <Screen
        center
        dir={DIR}
        f={f}
        src={src}
        aspect={ar}
        w={SW}
        zoom={z}
        origin={{ x, y }}
        highlight={
          card && hl
            ? {
                x: card.x,
                y: card.y,
                w: card.w,
                h: card.h,
                on: prog(f, hl.at, hl.at + 6),
                r: 22,
              }
            : null
        }
      />
    </Float3D>
  );
};

export const Kinetik5: React.FC = () => {
  const f = useCurrentFrame();
  const glitch = CUTS.reduce(
    (s, c) => s + Math.max(0, 1 - Math.abs(f - c) / 4),
    0,
  );
  const shake = HITS.reduce(
    (s, [h, a]) => (f >= h ? s + a * Math.exp(-(f - h) / 3) : s),
    0,
  );
  const sx = (hash(f * 3) - 0.5) * shake;
  const sy = (hash(f * 3 + 1) - 0.5) * shake;
  const flash = Math.max(
    ...[T.done, T.drop].map((h) => (f >= h ? Math.exp(-(f - h) / 2.2) : 0)),
    f >= T.kinetik2 ? 0.4 * Math.exp(-(f - T.kinetik2) / 2) : 0,
  );
  const purple = Math.max(
    prog(f, 0, 6) * (1 - prog(f, CUT.c - 4, CUT.c)) * 0.75,
    prog(f, CUT.j, CUT.j + 6) * 0.8,
  );
  const beatLen = 30 * (60 / 128);
  const beat =
    f >= T.kinetik2 ? Math.exp(-((f - T.kinetik2) % beatLen) / 3) : 0;
  const scene = (a: number, b: number) => f >= a - 1 && f < b + 1;
  return (
    <AbsoluteFill style={{ background: "#03080a", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(40,170,185,${0.17 + beat * 0.1}) 0%, transparent 44%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgba(130,90,255,0.45) 0%, rgba(60,30,140,0.25) 35%, transparent 70%)",
          opacity: purple,
        }}
      />
      <GridFloor
        f={f * 1.6}
        tint={
          purple > 0.5
            ? "rgba(170,150,255,0.5)"
            : `rgba(94,230,242,${0.38 + beat * 0.12})`
        }
      />

      <AbsoluteFill
        style={{
          transform: `translate(${sx}px, ${sy}px) scale(${1 + beat * 0.006})`,
        }}
      >
        {scene(0, CUT.b) && <SceneIntro f={f} />}
        {scene(CUT.b, CUT.c) && <SceneStudio f={f} />}
        {scene(CUT.c, CUT.d) && <SceneCommunity f={f} />}
        {scene(CUT.d, CUT.e) && <SceneMotion f={f} />}
        {scene(CUT.e, CUT.f) && <ScenePhysical f={f} />}
        {scene(CUT.f, CUT.g) && <SceneSignature f={f} />}
        {scene(CUT.g, CUT.h) && <SceneInsta f={f} />}
        {scene(CUT.h, CUT.i) && <SceneStore f={f} />}
        {scene(CUT.i, CUT.j) && <SceneDrop f={f} />}
        {f >= CUT.j - 1 && <SceneFollow f={f} />}
      </AbsoluteFill>

      <Streaks f={f} amt={Math.min(1, glitch + shake / 30)} />
      <AbsoluteFill
        style={{
          background: "#fff",
          opacity: Math.min(0.85, flash) * 0.85,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grain5">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed={f % 30}
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain5)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "#000",
          opacity: prog(f, DURATION_FRAMES - 10, DURATION_FRAMES - 1, eInOut),
        }}
      />
      <Sounds />
    </AbsoluteFill>
  );
};

/* ---------------- intro ---------------- */
const SceneIntro: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={exitStyle(f, CUT.b)}>
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 0,
        right: 0,
        textAlign: "center",
        ...caps(28),
        opacity: prog(f, 0, 8),
      }}
    >
      kinetik
    </div>
    <Row top={640}>
      <Pop f={f} at={T.what} style={sans(120)}>
        What can
      </Pop>
    </Row>
    <Row top={800}>
      <Pop f={f} at={T.kinetik} style={heavy(250, CYAN, 82)} glow={glowC}>
        KINETIK
      </Pop>
    </Row>
    <Row top={1050}>
      <Pop f={f} at={T.do} style={heavy(250, "#fff", 90)}>
        DO?
      </Pop>
    </Row>
  </AbsoluteFill>
);

/* ---------------- votre studio : carrousel 3D de toutes les captures ---------------- */
const RING = [
  "community",
  "motion",
  "physical",
  "signature",
  "instagram",
  "store",
];
const SceneStudio: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.b;
  const inQ = prog(f, a, a + 18, eExpo);
  const rot = (f - a) * 1.6 + lerp(-120, 0, inQ);
  const R = 620;
  return (
    <AbsoluteFill style={exitStyle(f, CUT.c)}>
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
        }}
      >
        <Pop f={f} at={T.with} style={sans(90, "#e4dcff")}>
          With
        </Pop>
        <KLogo f={f} at={T.kinetik2} size={96} />
      </div>
      <Row top={320} gap={22}>
        <Pop f={f} at={T.you} style={sans(100)}>
          you get
        </Pop>
        <Pop f={f} at={T.your} style={sans(100)}>
          your own
        </Pop>
      </Row>
      <Row top={450}>
        <Pop f={f} at={T.video} style={heavy(200, CYAN, 80)} glow={glowC}>
          VIDEO
        </Pop>
      </Row>
      <Row top={640}>
        <Pop f={f} at={T.studio} style={heavy(200, "#fff", 80)}>
          STUDIO
        </Pop>
      </Row>
      <AbsoluteFill
        style={{ perspective: 1800, perspectiveOrigin: "50% 1300px" }}
      >
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 1290,
            transformStyle: "preserve-3d",
            transform: `translateZ(${-R + 150 + lerp(-800, 0, inQ)}px) rotateX(-6deg) rotateY(${rot}deg)`,
          }}
        >
          {RING.map((src, i) => {
            const ang = (i / RING.length) * 360;
            const wS = 680;
            const hS = wS / AR[src];
            const facing = Math.cos(((ang + rot) * Math.PI) / 180);
            return (
              <div
                key={src}
                style={{
                  position: "absolute",
                  left: -wS / 2,
                  top: -hS / 2,
                  width: wS,
                  height: hS,
                  transform: `rotateY(${ang}deg) translateZ(${R}px)`,
                  backfaceVisibility: "hidden",
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "2px solid rgba(94,230,242,0.7)",
                  boxShadow: `0 0 ${30 + 30 * Math.max(0, facing)}px rgba(94,230,242,${0.25 + 0.3 * Math.max(0, facing)})`,
                  filter:
                    facing < 0.3
                      ? `brightness(${0.5 + 0.5 * Math.max(0, facing)})`
                      : undefined,
                }}
              >
                <Img
                  src={staticFile(`${DIR}/screens/${src}.jpg`)}
                  style={{ width: wS, height: hS, display: "block" }}
                />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- créations de la communauté ---------------- */
const SceneCommunity: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.c;
  const card = { x: 0.375, y: 0.508 };
  const ar = AR.community;
  const zoom = lerp(1, 1.9, prog(f, T.creation - 4, T.adapt + 2, eInOut));
  const scan = prog(f, T.brand, T.done - 2, eInOut);
  const done = prog(f, T.done, T.done + 10, eBack);
  const H = SW / ar;
  const scr = (extra?: React.CSSProperties, cursor = false) => (
    <div style={{ position: "absolute", inset: 0, ...extra }}>
      <Screen
        center
        dir={DIR}
        f={f}
        src="community"
        aspect={ar}
        w={SW}
        zoom={zoom}
        origin={card}
        cursor={
          cursor && f >= T.community
            ? {
                from: { x: 0.7, y: 0.9 },
                to: { x: 0.42, y: 0.6 },
                t: prog(f, T.community, T.adapt - 2, eInOut),
                clickAt: T.adapt,
              }
            : null
        }
        highlight={{
          x: card.x,
          y: card.y,
          w: 0.216,
          h: 0.485,
          on: prog(f, T.adapt, T.adapt + 6),
          r: 24,
        }}
      />
    </div>
  );
  return (
    <AbsoluteFill>
      <Block f={f} from={CUT.c} to={T.adapt - 2}>
        <Row top={170}>
          <Pop f={f} at={T.love} style={sans(110)}>
            Love a
          </Pop>
        </Row>
        <Row top={310}>
          <Pop f={f} at={T.community} style={heavy(190, CYAN, 78)} glow={glowC}>
            COMMUNITY
          </Pop>
        </Row>
        <Row top={500}>
          <Pop f={f} at={T.creation} style={heavy(190, "#fff", 78)}>
            CREATION?
          </Pop>
        </Row>
      </Block>
      <Block f={f} from={T.adapt - 2} to={T.done - 2}>
        <Row top={170} gap={22}>
          <Pop f={f} at={T.adapt} style={sans(104)}>
            Adapt it to your
          </Pop>
        </Row>
        <Row top={300}>
          <Pop f={f} at={T.brand} style={heavy(200, CYAN, 80)} glow={glowC}>
            BRAND
          </Pop>
        </Row>
        <Row top={500} gap={22}>
          <Pop f={f} at={T.in} style={sans(104)}>
            in
          </Pop>
          <Pop f={f} at={T.three} style={heavy(170, "#fff", 85)}>
            3 SECONDS.
          </Pop>
        </Row>
      </Block>
      {f >= T.done - 2 ? (
        <Row top={200}>
          <Pop
            f={f}
            at={T.done}
            style={heavy(330, CYAN, 95)}
            glow="rgba(94,230,242,0.7)"
          >
            DONE.
          </Pop>
        </Row>
      ) : null}
      <Float3D f={f} a={a} b={CUT.d} cy={1230} w={SW} h={H} ry={-12}>
        <div style={{ position: "relative", width: SW, height: H }}>
          {scr(undefined, true)}
          {scan > 0
            ? scr({
                clipPath: `inset(0 ${(1 - scan) * 100}% 0 0)`,
                filter: "hue-rotate(115deg) saturate(1.3)",
              })
            : null}
          {scan > 0 && scan < 1 ? (
            <div
              style={{
                position: "absolute",
                top: -10,
                bottom: -10,
                left: scan * SW - 3,
                width: 6,
                background: "#eaffff",
                boxShadow: `0 0 24px 8px ${CYAN}`,
              }}
            />
          ) : null}
        </div>
      </Float3D>
      {/* compte à rebours 3 s */}
      {f >= T.three && f < T.done + 30 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1580,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              padding: "14px 30px",
              borderRadius: 999,
              background: done > 0 ? CYAN : "rgba(5,20,26,0.8)",
              border: `2px solid ${CYAN}`,
              ...caps(30, done > 0 ? "#03080a" : "#fff"),
              letterSpacing: "0.12em",
              boxShadow: `0 0 ${20 + 30 * done}px ${CYAN}`,
              transform: `scale(${1 + 0.15 * done * Math.exp(-(f - T.done) / 6)})`,
            }}
          >
            {done > 0
              ? "✓ adapted to your brand"
              : `${Math.max(1, 3 - Math.floor((f - T.three) / ((T.done - T.three) / 3)))}…`}
          </div>
        </div>
      ) : (
        <Tag f={f} a={a} label="community creations" />
      )}
    </AbsoluteFill>
  );
};

/* ---------------- 150+ modèles motion + éditeur ---------------- */
const SceneMotion: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.d;
  const n = Math.round(lerp(0, 150, prog(f, T.n150, T.templates, eExpo)));
  const swap = f >= T.fully - 2;
  const flip = prog(f, T.fully - 4, T.fully + 10, eInOut);
  return (
    <AbsoluteFill>
      <Block f={f} from={CUT.d} to={T.fully - 2}>
        <Row top={150} gap={22} style={{ alignItems: "center" }}>
          <Pop f={f} at={T.over} style={sans(100)}>
            Over
          </Pop>
          <Pop
            f={f}
            at={T.n150}
            style={heavy(200, "#fff", 90)}
            glow="rgba(255,255,255,0.3)"
          >
            {n}+
          </Pop>
        </Row>
        <Row top={370}>
          <Pop f={f} at={T.motion} style={heavy(128, CYAN, 76)} glow={glowC}>
            MOTION TEMPLATES
          </Pop>
        </Row>
        <Row top={560}>
          <Pop f={f} at={T.ready} style={sans(96)}>
            ready for you.
          </Pop>
        </Row>
      </Block>
      <Block f={f} from={T.fully - 2} to={CUT.e}>
        <Row top={170}>
          <Pop f={f} at={T.fully} style={sans(104)}>
            fully
          </Pop>
        </Row>
        <Row top={300}>
          <Pop
            f={f}
            at={T.customizable}
            style={heavy(140, CYAN, 76)}
            glow={glowC}
          >
            CUSTOMIZABLE
          </Pop>
        </Row>
        <Row top={480} gap={18}>
          <Pop f={f} at={T.with2} style={sans(76)}>
            with our
          </Pop>
          <Pop f={f} at={T.super} style={sans(76, LAV)}>
            super simple
          </Pop>
          <Pop f={f} at={T.editor} style={sans(76)}>
            editor
          </Pop>
        </Row>
      </Block>
      {!swap || flip < 0.5 ? (
        <AbsoluteFill
          style={{ opacity: 1 - prog(f, T.fully - 4, T.fully + 3) }}
        >
          <PanScreen
            f={f}
            a={a}
            b={T.fully + 4}
            src="motion"
            zoom={1.75}
            x0={0.17}
            x1={0.83}
            y={0.52}
          />
        </AbsoluteFill>
      ) : null}
      {f >= T.fully - 4 ? (
        <Float3D
          f={f}
          a={T.fully - 4}
          b={CUT.e}
          cy={1230}
          w={SW}
          h={SW / 1.894}
          ry={14}
        >
          <Screen
            center
            dir="kinetik4"
            f={f}
            src="editor"
            aspect={1.894}
            w={SW}
            zoom={lerp(1, 1.5, prog(f, T.super, T.editor + 8, eInOut))}
            origin={{ x: 0.38, y: 0.42 }}
          />
        </Float3D>
      ) : null}
      <Tag
        f={f}
        a={a}
        label={swap ? "super simple editor" : "motion templates"}
      />
    </AbsoluteFill>
  );
};

/* ---------------- produits physiques ---------------- */
const ScenePhysical: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <Block f={f} from={CUT.e} to={T.weve - 2}>
      <Row top={170}>
        <Pop f={f} at={T.selling} style={sans(110)}>
          Selling
        </Pop>
      </Row>
      <Row top={310}>
        <Pop f={f} at={T.physical} style={heavy(190, CYAN, 78)} glow={glowC}>
          PHYSICAL
        </Pop>
      </Row>
      <Row top={500}>
        <Pop f={f} at={T.products} style={heavy(190, "#fff", 78)}>
          PRODUCTS?
        </Pop>
      </Row>
    </Block>
    <Block f={f} from={T.weve - 2} to={CUT.f}>
      <Row top={170}>
        <Pop f={f} at={T.weve} style={sans(100)}>
          We&apos;ve got ready-made
        </Pop>
      </Row>
      <Row top={310}>
        <Pop f={f} at={T.motions} style={heavy(200, CYAN, 80)} glow={glowC}>
          MOTIONS
        </Pop>
      </Row>
      <Row top={510}>
        <Pop f={f} at={T.that} style={sans(100)}>
          for that.
        </Pop>
      </Row>
    </Block>
    <PanScreen
      f={f}
      a={CUT.e}
      b={CUT.f}
      src="physical"
      zoom={1.9}
      x0={0.14}
      x1={0.83}
      y={0.48}
      ry={12}
    />
    <Tag f={f} a={CUT.e} label="physical products · 3D" />
  </AbsoluteFill>
);

/* ---------------- logo animé ---------------- */
const SceneSignature: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <Block f={f} from={CUT.f} to={T.kinetik3 - 2}>
      <Row top={170}>
        <Pop f={f} at={T.want} style={sans(110)}>
          Want your
        </Pop>
      </Row>
      <Row top={310}>
        <Pop f={f} at={T.brand2} style={heavy(190, "#fff", 78)}>
          BRAND NAME
        </Pop>
      </Row>
      <Row top={500}>
        <Pop f={f} at={T.animated} style={heavy(190, CYAN, 78)} glow={glowC}>
          ANIMATED?
        </Pop>
      </Row>
    </Block>
    {f >= T.kinetik3 - 2 ? (
      <>
        <div style={{ position: "absolute", top: 220, left: 0, right: 0 }}>
          <KLogo f={f} at={T.kinetik3} size={130} />
        </div>
        <Row top={470}>
          <Pop f={f} at={T.handles} style={heavy(170, CYAN, 80)} glow={glowC}>
            HANDLES IT.
          </Pop>
        </Row>
      </>
    ) : null}
    <PanScreen
      f={f}
      a={CUT.f}
      b={CUT.g}
      src="signature"
      zoom={1.9}
      x0={0.15}
      x1={0.83}
      y={0.484}
      hl={{
        i: 4 + Math.min(3, Math.floor(prog(f, CUT.f + 6, CUT.g - 4) * 4)),
        at: CUT.f + 8,
      }}
    />
    <Tag f={f} a={CUT.f} label="signature · animated logos" />
  </AbsoluteFill>
);

/* ---------------- posts Instagram ---------------- */
const SceneInsta: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <Block f={f} from={CUT.g} to={T.the - 2}>
      <Row top={170}>
        <Pop f={f} at={T.need} style={sans(110)}>
          Need
        </Pop>
      </Row>
      <Row top={310}>
        <Pop f={f} at={T.instagram} style={heavy(190, CYAN, 78)} glow={glowC}>
          INSTAGRAM
        </Pop>
      </Row>
      <Row top={500}>
        <Pop f={f} at={T.posts} style={heavy(190, "#fff", 78)}>
          POSTS?
        </Pop>
      </Row>
    </Block>
    <Block f={f} from={T.the - 2} to={T.no - 2}>
      <Row top={170}>
        <Pop f={f} at={T.the} style={sans(104)}>
          The templates are
        </Pop>
      </Row>
      <Row top={310}>
        <Pop f={f} at={T.ready3} style={heavy(230, CYAN, 82)} glow={glowC}>
          READY.
        </Pop>
      </Row>
    </Block>
    <Block f={f} from={T.no - 2} to={CUT.h}>
      <Row top={170}>
        <Pop f={f} at={T.no} style={heavy(190, "#fff", 80)}>
          NO MORE
        </Pop>
      </Row>
      <div
        style={{
          position: "absolute",
          top: 370,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <span style={{ position: "relative", display: "inline-block" }}>
          <Pop f={f} at={T.headaches} style={heavy(190, CYAN, 78)} glow={glowC}>
            HEADACHES
          </Pop>
          <span
            style={{
              position: "absolute",
              left: -10,
              right: -10,
              top: "48%",
              height: 12,
              borderRadius: 6,
              background: "#fff",
              transform: `scaleX(${prog(f, T.headaches + 8, T.headaches + 16, eInOut)}) rotate(-3deg)`,
              transformOrigin: "0% 50%",
              boxShadow: "0 0 18px #fff",
            }}
          />
        </span>
      </div>
    </Block>
    <PanScreen
      f={f}
      a={CUT.g}
      b={CUT.h}
      src="instagram"
      zoom={1.8}
      x0={0.16}
      x1={0.84}
      y={0.48}
      ry={12}
    />
    <Tag f={f} a={CUT.g} label="instagram posts" />
  </AbsoluteFill>
);

/* ---------------- captures App Store / Play Store ---------------- */
const SceneStore: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <div style={exitStyle(f, CUT.i, 3)}>
      <Row top={150}>
        <Pop f={f} at={T.same} style={sans(100)}>
          Same for your
        </Pop>
      </Row>
      <Row top={280}>
        <Pop f={f} at={T.app} style={heavy(170, "#fff", 80)}>
          APP STORE
        </Pop>
      </Row>
      <Row top={450}>
        <Pop f={f} at={T.play} style={heavy(170, CYAN, 80)} glow={glowC}>
          &amp; PLAY STORE
        </Pop>
      </Row>
      <Row top={620}>
        <Pop f={f} at={T.screenshots} style={sans(90)}>
          screenshots
        </Pop>
      </Row>
    </div>
    <PanScreen
      f={f}
      a={CUT.h}
      b={CUT.i}
      src="store"
      zoom={1.7}
      x0={0.16}
      x1={0.84}
      y={0.5}
      cy={1290}
    />
    <Tag f={f} a={CUT.h} label="store screenshots" top={1700} />
  </AbsoluteFill>
);

/* ---------------- nouveaux modèles chaque jour + communauté ---------------- */
const SceneDrop: React.FC<{ f: number }> = ({ f }) => {
  const a = CUT.i;
  const swap = f >= T.and - 2;
  const COLS = 5;
  const CW = 180;
  const N = 20;
  const grow = prog(f, T.keeps, T.growing + 12, eExpo);
  return (
    <AbsoluteFill>
      <Block f={f} from={a} to={T.and - 2}>
        <Row top={150}>
          <Pop f={f} at={T.new} style={sans(104)}>
            New templates
          </Pop>
        </Row>
        <Row top={280}>
          <Pop f={f} at={T.drop} style={heavy(250, CYAN, 90)} glow={glowC}>
            DROP
          </Pop>
        </Row>
        <Row top={510}>
          <Pop f={f} at={T.every} style={heavy(170, "#fff", 80)}>
            EVERY DAY
          </Pop>
        </Row>
      </Block>
      <Block f={f} from={T.and - 2} to={CUT.j}>
        <Row top={150}>
          <Pop f={f} at={T.and} style={sans(96)}>
            and the
          </Pop>
        </Row>
        <Row top={260}>
          <Pop
            f={f}
            at={T.community2}
            style={heavy(180, CYAN, 78)}
            glow={glowC}
          >
            COMMUNITY
          </Pop>
        </Row>
        <Row top={440} gap={22}>
          <Pop f={f} at={T.keeps} style={sans(96)}>
            keeps
          </Pop>
          <Pop f={f} at={T.growing} style={heavy(140, "#fff", 82)}>
            GROWING
          </Pop>
        </Row>
        <Row top={600} gap={22}>
          <Pop f={f} at={T.thanks} style={sans(96)}>
            thanks to
          </Pop>
          <Pop f={f} at={T.you3} style={heavy(140, CYAN, 85)} glow={glowC}>
            YOU
          </Pop>
        </Row>
      </Block>
      {/* les modèles tombent dans la grille */}
      <AbsoluteFill
        style={{ perspective: 1800, perspectiveOrigin: "50% 1250px" }}
      >
        <div
          style={{
            position: "absolute",
            left: 540 - (COLS * (CW + 16)) / 2,
            top: swap ? lerp(820, 900, prog(f, T.and, T.and + 12)) : 820,
            width: COLS * (CW + 16),
            transform: `rotateX(${18 + 6 * grow}deg) rotateZ(-6deg) scale(${1 - 0.2 * grow})`,
            transformStyle: "preserve-3d",
          }}
        >
          {Array.from({ length: N }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const at = T.drop - 6 + i * 2.2;
            const q = prog(f, at, at + 10, eBack);
            const isNew = f >= at && f < at + 14;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: col * (CW + 16),
                  top: row * 290 - (1 - q) * 900,
                  opacity: f >= at ? 1 : 0,
                  transform: `rotate(${(1 - q) * (hash(i) - 0.5) * 40}deg)`,
                }}
              >
                <CardCrop
                  i={i * 3 + 1}
                  w={CW}
                  glow={isNew ? 1 - (f - at) / 14 : 0}
                />
                {isNew ? (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      right: -10,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: CYAN,
                      ...caps(14, "#03080a"),
                      letterSpacing: "0.1em",
                    }}
                  >
                    new
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* la communauté : des avatars qui affluent */}
      {swap ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1560,
            display: "flex",
            justifyContent: "center",
            opacity: prog(f, T.community2, T.community2 + 8),
          }}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const q = prog(
              f,
              T.community2 + i * 3,
              T.community2 + i * 3 + 8,
              eBack,
            );
            const hues = [
              "#5ee6f2",
              "#c4b5ff",
              "#A765FF",
              "#ff6b9a",
              "#facc15",
              "#34d399",
            ];
            return (
              <div
                key={i}
                style={{
                  width: 74,
                  height: 74,
                  marginLeft: i ? -18 : 0,
                  borderRadius: "50%",
                  border: "4px solid #03080a",
                  background: `linear-gradient(135deg, ${hues[i % 6]}, ${hues[(i + 2) % 6]})`,
                  transform: `scale(${q})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...caps(22, "#03080a"),
                  letterSpacing: 0,
                }}
              >
                {"AKMJLSRNTEOC"[i]}
              </div>
            );
          })}
          <div
            style={{
              marginLeft: 20,
              alignSelf: "center",
              ...caps(30),
              letterSpacing: "0.05em",
              opacity: prog(f, T.thanks, T.thanks + 6),
            }}
          >
            + you
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------------- follow ---------------- */
const SceneFollow: React.FC<{ f: number }> = ({ f }) => {
  const btn = prog(f, T.follow - 2, T.follow + 8, eBack);
  const clickAt = T.so + 4;
  const cur = prog(f, T.follow, clickAt - 2, eInOut);
  const followed = f >= clickAt;
  const rp = f >= clickAt ? (f - clickAt) / 14 : -1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
        <KLogo f={f} at={CUT.j + 2} size={110} />
      </div>
      <Row top={470}>
        <Pop f={f} at={T.follow} style={heavy(280, CYAN, 90)} glow={glowC}>
          FOLLOW
        </Pop>
      </Row>
      <Row top={760} gap={20}>
        <Pop f={f} at={T.so} style={sans(84)}>
          so you don&apos;t
        </Pop>
        <Pop f={f} at={T.miss} style={sans(84)}>
          miss a
        </Pop>
        <Pop f={f} at={T.thing} style={heavy(110, "#fff", 85)}>
          THING
        </Pop>
      </Row>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1180,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, btn * 2),
        }}
      >
        <div
          style={{
            position: "relative",
            transform: `scale(${btn * (f >= clickAt - 2 && f < clickAt + 4 ? 0.92 : 1)})`,
          }}
        >
          {rp >= 0 && rp < 1 ? (
            <div
              style={{
                position: "absolute",
                inset: -rp * 90,
                borderRadius: 999,
                border: `4px solid ${CYAN}`,
                opacity: 1 - rp,
              }}
            />
          ) : null}
          <div
            style={{
              padding: "34px 90px",
              borderRadius: 999,
              background: followed
                ? "rgba(255,255,255,0.1)"
                : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              border: followed ? `2px solid ${CYAN}` : "2px solid transparent",
              boxShadow: followed
                ? "0 0 40px rgba(94,230,242,0.6)"
                : "0 0 50px rgba(139,92,246,0.8)",
              ...sans(72),
            }}
          >
            {followed ? "✓ Following" : "+ Follow"}
          </div>
          <div
            style={{
              position: "absolute",
              left: lerp(560, 330, cur),
              top: lerp(280, 80, cur),
            }}
          >
            <Cursor
              x={0}
              y={0}
              press={f >= clickAt - 2 && f < clickAt + 4 ? 1 : 0}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1480,
          display: "flex",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {[0, 4, 8, 12, 16].map((k, i) => (
          <div
            key={k}
            style={{
              opacity: prog(f, CUT.j + 8 + i * 3, CUT.j + 14 + i * 3),
              transform: `translateY(${(1 - prog(f, CUT.j + 8 + i * 3, CUT.j + 16 + i * 3, eBack)) * 60}px) rotate(${(i - 2) * 4}deg)`,
            }}
          >
            <CardCrop i={k} w={150} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- son ---------------- */
const Sfx: React.FC<{ at: number; src: string; vol: number }> = ({
  at,
  src,
  vol,
}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Html5Audio src={staticFile(`kinetik3/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);
const Sounds: React.FC = () => (
  <>
    <Html5Audio src={staticFile("kinetik5/sfx/music.wav")} volume={0.3} />
    <Sequence from={VO} layout="none">
      <Html5Audio src={staticFile("kinetik5/voice.wav")} volume={0.92} />
    </Sequence>
    <Sfx at={T.kinetik} src="pop" vol={0.18} />
    <Sfx at={T.kinetik2} src="shimmer" vol={0.26} />
    {CUTS.map((c, i) => (
      <React.Fragment key={`c${i}`}>
        <Sfx at={c - 3} src="whoosh" vol={0.18} />
        <Sfx at={c} src="glitch" vol={0.1} />
      </React.Fragment>
    ))}
    <Sfx at={T.video} src="pop" vol={0.15} />
    <Sfx at={T.adapt} src="click" vol={0.4} />
    <Sfx at={T.brand} src="scan" vol={0.18} />
    {[0, 1, 2].map((i) => (
      <Sfx
        key={`t${i}`}
        at={T.three + i * ((T.done - T.three) / 3)}
        src="tick"
        vol={0.14}
      />
    ))}
    <Sfx at={T.done} src="drop" vol={0.3} />
    {Array.from({ length: 10 }).map((_, i) => (
      <Sfx key={`n${i}`} at={T.n150 + i * 2.5} src="tick" vol={0.07} />
    ))}
    <Sfx at={T.fully - 4} src="whoosh" vol={0.18} />
    <Sfx at={T.physical} src="pop" vol={0.15} />
    <Sfx at={T.animated} src="pop" vol={0.15} />
    <Sfx at={T.kinetik3} src="shimmer" vol={0.24} />
    <Sfx at={T.instagram} src="pop" vol={0.15} />
    <Sfx at={T.ready3} src="impact" vol={0.15} />
    <Sfx at={T.headaches + 8} src="whoosh" vol={0.14} />
    <Sfx at={T.app} src="pop" vol={0.15} />
    <Sfx at={T.play} src="pop" vol={0.15} />
    {Array.from({ length: 20 }).map((_, i) => (
      <Sfx key={`d${i}`} at={T.drop - 6 + i * 2.2 + 8} src="tick" vol={0.06} />
    ))}
    <Sfx at={T.community2} src="shimmer" vol={0.2} />
    <Sfx at={T.follow} src="impact" vol={0.2} />
    <Sfx at={T.so + 4} src="click" vol={0.4} />
    <Sfx at={T.thing} src="shimmer" vol={0.26} />
  </>
);
