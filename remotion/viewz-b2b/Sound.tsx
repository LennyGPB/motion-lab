import { Html5Audio, Sequence, staticFile } from "remotion";
import { T, W } from "./timing";

const s = (n: string) => staticFile(`viewz/sfx/${n}.wav`);
type Cue = { at: number; src: string; vol: number };

const CUES: Cue[] = [
  { at: W.viewz - 0.05, src: "b2b_logo", vol: 0.45 },
  { at: 2.9, src: "b2b_whoosh", vol: 0.22 },
  { at: W.organisateurs, src: "b2b_whoosh", vol: 0.15 },
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ at: W.evenements + 0.1 * i, src: "b2b_click", vol: 0.1 })),
  { at: 7.25, src: "b2b_whoosh", vol: 0.22 },
  { at: W.battles, src: "b2b_click", vol: 0.18 },
  { at: W.showcases, src: "b2b_click", vol: 0.18 },
  { at: W.cours, src: "b2b_click", vol: 0.18 },
  { at: W.sessions, src: "b2b_click", vol: 0.18 },
  { at: W.gratuit + 0.05, src: "b2b_confirm", vol: 0.2 },
  { at: W.ouverts + 0.2, src: "b2b_confirm", vol: 0.2 },
  { at: 12.95, src: "b2b_whoosh", vol: 0.22 },
  { at: W.gestion, src: "b2b_whoosh", vol: 0.14 },
  ...[0, 1, 2, 3].map((i) => ({ at: W.inscriptions + 0.33 + i * 0.17, src: "b2b_click", vol: 0.12 })),
  { at: W.directement, src: "b2b_confirm", vol: 0.25 },
  { at: W.et2 - 0.1, src: "b2b_whoosh", vol: 0.18 },
  { at: W.visibilite, src: "shimmer", vol: 0.18 },
  { at: 21.4, src: "b2b_whoosh", vol: 0.22 },
  { at: W.exclusivite - 0.1, src: "b2b_confirm", vol: 0.25 },
  { at: 25.4, src: "b2b_whoosh", vol: 0.22 },
  { at: W.dm, src: "swipe", vol: 0.15 },
  { at: W.viewz4 - 0.15, src: "b2b_logo", vol: 0.35 },
  { at: W.app - 0.05, src: "b2b_click", vol: 0.18 },
  { at: W.google - 0.05, src: "b2b_click", vol: 0.18 },
];

export const Sound: React.FC = () => (
  <>
    <Html5Audio src={s("b2b_music")} volume={0.32} />
    <Sequence from={T(0)} name="voix">
      <Html5Audio src={staticFile("viewz/voice_b2b.mp3")} volume={1} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, T(c.at))} name={c.src} layout="none">
        <Html5Audio src={s(c.src)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
