import { Html5Audio, interpolate, Sequence, staticFile } from "remotion";
import { AREAS, DURATION_FRAMES, T, W } from "./timing";

type Cue = { at: number; src: string; vol: number; offset?: number };

const s = (name: string) => staticFile(`signspath/sfx/${name}.wav`);

// Placement des effets sonores (temps de la voix, en secondes)
const CUES: Cue[] = [
  { at: -0.25, src: "chaos", vol: 0.35 },
  { at: -0.2, src: "whoosh_rev", vol: 0.35 },
  { at: W.nothing - 0.05, src: "freeze", vol: 0.4 },
  { at: W.nothing, src: "sub", vol: 0.35 },
  { at: 3.75, src: "whoosh", vol: 0.45 },
  { at: W.eight, src: "impact", vol: 0.35 },
  ...AREAS.map((a, i) => ({ at: a.at - 0.05, src: `chime${i}`, vol: 0.22 })),
  ...AREAS.map((a) => ({ at: a.at - 0.18, src: "whoosh_soft", vol: 0.12 })),
  { at: W.one1 - 0.2, src: "whoosh_rev", vol: 0.3 },
  { at: W.one1 + 0.2, src: "sub", vol: 0.35 },
  { at: W.pick - 0.1, src: "whoosh_soft", vol: 0.3 },
  { at: W.matters - 0.1, src: "shimmer", vol: 0.35 },
  { at: W.today, src: "impact", vol: 0.4 },
  { at: 16.55, src: "whoosh", vol: 0.45 },
  { at: W.oneA - 0.05, src: "tick_low", vol: 0.35 },
  { at: W.oneB - 0.05, src: "tick_low", vol: 0.35 },
  { at: W.oneC - 0.05, src: "tick_low", vol: 0.35 },
  { at: W.oneA - 0.1, src: "whoosh_soft", vol: 0.2 },
  { at: W.oneB - 0.1, src: "whoosh_soft", vol: 0.2 },
  { at: W.oneC - 0.1, src: "whoosh_soft", vol: 0.2 },
  { at: W.start - 2.0, src: "riser", vol: 0.3 },
  { at: W.start - 0.05, src: "whoosh", vol: 0.4 },
  { at: 21.15, src: "impact", vol: 0.45 },
  { at: W.with, src: "shimmer", vol: 0.4 },
  { at: W.chance, src: "sub", vol: 0.45 },
  { at: 23.95, src: "whoosh", vol: 0.35 },
  ...[0, 0.12, 0.24, 0.36, 0.5, 0.62, 0.74, 0.86, 0.98, 1.1, 1.2].map((d) => ({ at: W.signs + d, src: "tick", vol: 0.08 })),
  { at: W.comEnd, src: "chime5", vol: 0.3 },
  { at: W.comEnd, src: "shimmer", vol: 0.3 },
];

export const Sound: React.FC = () => (
  <>
    {/* Nappe d'ambiance : baisse légèrement sous la voix, fondu de fin */}
    <Html5Audio
      src={s("pad")}
      volume={(f) =>
        interpolate(f, [0, 30, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("signspath/voice.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
