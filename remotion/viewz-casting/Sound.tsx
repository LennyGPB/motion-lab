import { Html5Audio, Sequence, staticFile } from "remotion";
import { T, W } from "./timing";

const s = (n: string) => staticFile(`viewz/sfx/${n}.wav`);
type Cue = { at: number; src: string; vol: number };

// temps de la voix (s)
const CUES: Cue[] = [
  { at: -0.28, src: "glitch", vol: 0.3 },
  { at: W.viewz - 0.03, src: "drop", vol: 0.45 },
  { at: W.premier, src: "pop_hi", vol: 0.15 },
  ...[0, 1, 2, 3].map((i) => ({ at: W.reseau + i * 0.1, src: "pop", vol: 0.14 })),
  { at: 2.95, src: "swipe", vol: 0.35 },
  { at: W.recherche, src: "scan", vol: 0.25 },
  { at: W.experimente, src: "slam", vol: 0.32 },
  { at: W.paris, src: "ping", vol: 0.25 },
  { at: W.pour2 - 0.15, src: "whoosh", vol: 0.3 },
  { at: W.contenu, src: "glitch", vol: 0.2 },
  { at: W.avec, src: "pop_hi", vol: 0.18 },
  { at: W.videos, src: "slam", vol: 0.28 },
  { at: W.interviews, src: "slam", vol: 0.28 },
  { at: W.coulisses, src: "slam", vol: 0.28 },
  { at: 9.3, src: "tape_stop", vol: 0.3 },
  { at: W.style, src: "glitch", vol: 0.2 },
  { at: W.hiphop - 0.1, src: "swipe", vol: 0.3 },
  { at: W.afro - 0.1, src: "swipe", vol: 0.25 },
  { at: W.contemporain - 0.1, src: "swipe", vol: 0.25 },
  { at: W.krump - 0.1, src: "swipe", vol: 0.25 },
  { at: W.ou - 0.1, src: "swipe", vol: 0.25 },
  { at: W.hiphop, src: "pop", vol: 0.15 },
  { at: W.afro, src: "pop", vol: 0.15 },
  { at: W.contemporain, src: "pop_hi", vol: 0.15 },
  { at: W.krump, src: "pop", vol: 0.15 },
  { at: W.ou, src: "pop", vol: 0.15 },
  { at: W.experience + 0.07, src: "ping", vol: 0.22 },
  { at: W.parle, src: "slam", vol: 0.3 },
  { at: W.parle + 0.07, src: "ping", vol: 0.22 },
  { at: 16.25, src: "swipe", vol: 0.35 },
  { at: W.dm, src: "slam", vol: 0.4 },
  { at: W.dm + 0.28, src: "bubble", vol: 0.24 },
  { at: W.dm + 0.3, src: "whoosh", vol: 0.25 },
  { at: W.lapp - 0.15, src: "drop", vol: 0.32 },
  { at: W.ios, src: "pop_hi", vol: 0.25 },
  { at: W.android, src: "pop_hi", vol: 0.25 },
  { at: W.gEnd - 0.1, src: "shimmer", vol: 0.28 },
];

export const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("music_casting")} volume={0.34} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("viewz/voice_casting.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
