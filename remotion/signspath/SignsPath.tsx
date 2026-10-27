import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Background, Vignette } from "./Background";
import { SceneAreas } from "./SceneAreas";
import { SceneChaos } from "./SceneChaos";
import { SceneFinale } from "./SceneFinale";
import { SceneSteps } from "./SceneSteps";
import { Sound } from "./Sound";
import { loadFonts } from "./theme";
import { SCENES } from "./timing";

loadFonts();

const seq = (k: keyof typeof SCENES) => ({ from: SCENES[k].from, durationInFrames: SCENES[k].to - SCENES[k].from });

/** Motion "SignsPath — One at a time" (1080x1920, 30 fps). */
export const SignsPath: React.FC = () => {
  const frame = useCurrentFrame();
  // Caméra : lente respiration globale
  const cam = 1 + 0.015 * Math.sin(frame / 55);
  return (
    <AbsoluteFill style={{ backgroundColor: "#07031a", overflow: "hidden" }}>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <Sequence {...seq("chaos")} name="1 · chaos">
          <SceneChaos />
        </Sequence>
        <Sequence {...seq("areas")} name="2-3 · areas">
          <SceneAreas />
        </Sequence>
        <Sequence {...seq("steps")} name="4 · steps">
          <SceneSteps />
        </Sequence>
        <Sequence {...seq("finale")} name="5-6 · finale">
          <SceneFinale />
        </Sequence>
      </AbsoluteFill>
      <Vignette />
      <Sound />
    </AbsoluteFill>
  );
};
