import { Html5Audio, Sequence, staticFile } from "remotion";
import { T, W } from "./timing";

const s = (n: string) => staticFile(`viewz/sfx/${n}.wav`);
type Cue = { at: number; src: string; vol: number };

// temps de la voix (s)
const CUES: Cue[] = [
  { at: -0.25, src: "glitch", vol: 0.35 },
  { at: W.danseurs - 0.02, src: "slam", vol: 0.55 },
  { at: W.danseurs - 0.35, src: "whoosh", vol: 0.3 },
  { at: W.lapp - 0.25, src: "swipe", vol: 0.4 },
  { at: W.lapp, src: "slam", vol: 0.35 },
  { at: 2.8, src: "swipe", vol: 0.4 },
  { at: W.partenaire, src: "glitch", vol: 0.22 },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ at: W.partenaire + 0.07 + i * 0.1, src: i % 2 ? "pop" : "pop_hi", vol: 0.16 })),
  { at: W.ville, src: "ping", vol: 0.3 },
  { at: 4.4, src: "swipe", vol: 0.4 },
  { at: W.spots, src: "pop_hi", vol: 0.3 },
  { at: W.events, src: "pop", vol: 0.3 },
  { at: W.autour, src: "scan", vol: 0.35 },
  { at: 6.96, src: "swipe", vol: 0.4 },
  { at: W.danse, src: "slam", vol: 0.3 },
  ...[0, 1, 2, 3].map((i) => ({ at: W.danse + 0.07 + i * 0.1, src: "pop", vol: 0.15 })),
  { at: W.maintenant + 0.15, src: "ping", vol: 0.25 },
  { at: 8.56, src: "swipe", vol: 0.4 },
  { at: W.connecte, src: "bubble", vol: 0.26 },
  { at: W.toi2, src: "bubble", vol: 0.26 },
  { at: W.directement, src: "bubble", vol: 0.24 },
  { at: W.directement, src: "whoosh", vol: 0.35 },
  { at: 10.1, src: "tape_stop", vol: 0.35 },
  { at: 10.0, src: "riser", vol: 0.3 },
  { at: W.viewz - 0.05, src: "drop", vol: 0.5 },
  { at: W.viewz, src: "glitch", vol: 0.3 },
  { at: W.connexion, src: "shimmer", vol: 0.3 },
  { at: W.app - 0.05, src: "pop_hi", vol: 0.3 },
  { at: W.google - 0.05, src: "pop_hi", vol: 0.3 },
  { at: W.play + 0.2, src: "ping", vol: 0.3 },
];

export const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("music")} volume={0.34} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("viewz/voice.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
