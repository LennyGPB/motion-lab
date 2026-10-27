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
import { Nova } from "./nova/Nova";
import { DURATION_FRAMES as NOVA_FRAMES } from "./nova/timing";
import { Atlas } from "./atlas/Atlas";
import { DURATION_FRAMES as ATLAS_FRAMES } from "./atlas/timing";
import { Ritual } from "./signspath2/Ritual";
import { DURATION_FRAMES as RITUAL_FRAMES } from "./signspath2/timing";

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
    <Composition id="NovaVertical" component={Nova} durationInFrames={NOVA_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="NovaWide" component={Nova} durationInFrames={NOVA_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="AtlasVertical" component={Atlas} durationInFrames={ATLAS_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="AtlasWide" component={Atlas} durationInFrames={ATLAS_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="SignsPathRitual" component={Ritual} durationInFrames={RITUAL_FRAMES} fps={30} width={1080} height={1920} />
    </>
  );
};
