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
import { Launch } from "./launch/Launch";
import { DURATION_FRAMES as LAUNCH_FRAMES } from "./launch/timing";
import { ProbSol } from "./probsol/ProbSol";
import { DURATION_FRAMES as PROBSOL_FRAMES } from "./probsol/timing";
import { Proof } from "./proof/Proof";
import { DURATION_FRAMES as PROOF_FRAMES } from "./proof/timing";
import { WebBuild } from "./webbuild/WebBuild";
import { DURATION_FRAMES as WEBBUILD_FRAMES } from "./webbuild/timing";
import { Demo } from "./demo/Demo";
import { DURATION_FRAMES as DEMO_FRAMES } from "./demo/timing";
import { TerminalAd } from "./terminal/TerminalAd";
import { DURATION_FRAMES as TERMINAL_FRAMES } from "./terminal/timing";
import { Platforms } from "./platforms/Platforms";
import { DURATION_FRAMES as PLATFORMS_FRAMES } from "./platforms/timing";
import { BrowserTour } from "./browsertour/BrowserTour";
import { Kinetik2 } from "./kinetik2/Kinetik2";
import { Days21 } from "./signspath3/Days21";
import { DURATION_FRAMES as DAYS21_FRAMES } from "./signspath3/timing";
import { DURATION_FRAMES as KINETIK2_FRAMES } from "./kinetik2/timing";
import { DURATION_FRAMES as BROWSERTOUR_FRAMES } from "./browsertour/timing";

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
    <Composition id="LaunchVertical" component={Launch} durationInFrames={LAUNCH_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="LaunchWide" component={Launch} durationInFrames={LAUNCH_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="ProblemSolution" component={ProbSol} durationInFrames={PROBSOL_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="SocialProof" component={Proof} durationInFrames={PROOF_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="WebBuild" component={WebBuild} durationInFrames={WEBBUILD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ProductDemo" component={Demo} durationInFrames={DEMO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Terminal" component={TerminalAd} durationInFrames={TERMINAL_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Platforms" component={Platforms} durationInFrames={PLATFORMS_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="BrowserTour" component={BrowserTour} durationInFrames={BROWSERTOUR_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="KinetikDay2" component={Kinetik2} durationInFrames={KINETIK2_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="SignsPath21Days" component={Days21} durationInFrames={DAYS21_FRAMES} fps={30} width={1080} height={1920} />
    </>
  );
};
