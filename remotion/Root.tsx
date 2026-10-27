import { Composition } from "remotion";
import { Intro } from "./Intro";
import { SignsPath } from "./signspath/SignsPath";
import { DURATION_FRAMES, FPS } from "./signspath/timing";
import { ViewZ } from "./viewz/ViewZ";
import { DURATION_FRAMES as VZ_FRAMES } from "./viewz/timing";
import { Casting } from "./viewz-casting/Casting";
import { DURATION_FRAMES as CASTING_FRAMES } from "./viewz-casting/timing";
import { B2B } from "./viewz-b2b/B2B";
import { DURATION_FRAMES as B2B_FRAMES } from "./viewz-b2b/timing";
import { Stride } from "./stride/Stride";
import { DURATION_FRAMES as STRIDE_FRAMES } from "./stride/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="Intro"
      component={Intro}
      durationInFrames={180} // 6 s à 30 fps
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="SignsPath"
      component={SignsPath}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition id="ViewZ" component={ViewZ} durationInFrames={VZ_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ViewZCasting" component={Casting} durationInFrames={CASTING_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ViewZPartenaires" component={B2B} durationInFrames={B2B_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Stride" component={Stride} durationInFrames={STRIDE_FRAMES} fps={30} width={1080} height={1920} />
    </>
  );
};
