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
import { Kinetik3 } from "./kinetik3/Kinetik3";
import { Kinetik4 } from "./kinetik4/Kinetik4";
import { Kinetik5 } from "./kinetik5/Kinetik5";
import { DURATION_FRAMES as KINETIK5_FRAMES } from "./kinetik5/timing";
import { DURATION_FRAMES as KINETIK4_FRAMES } from "./kinetik4/timing";
import { DURATION_FRAMES as KINETIK3_FRAMES } from "./kinetik3/timing";
import { Days21 } from "./signspath3/Days21";
import { Tuesday } from "./signspath4/Tuesday";
import { EyesClosed } from "./signspath5/EyesClosed";
import { OneYear } from "./signspath6/OneYear";
import { Night } from "./signspath7/Night";
import { Repeat } from "./signspath8/Repeat";
import { Morning } from "./signspath9/Morning";
import { DURATION_FRAMES as MORNING_FRAMES } from "./signspath9/timing";
import { DURATION_FRAMES as REPEAT_FRAMES } from "./signspath8/timing";
import { DURATION_FRAMES as NIGHT_FRAMES } from "./signspath7/timing";
import { DURATION_FRAMES as ONEYEAR_FRAMES } from "./signspath6/timing";
import { DURATION_FRAMES as EYES_FRAMES } from "./signspath5/timing";
import { DURATION_FRAMES as TUESDAY_FRAMES } from "./signspath4/timing";
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
      <Composition id="KinetikTutorial" component={Kinetik3} durationInFrames={KINETIK3_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="KinetikEditor" component={Kinetik4} durationInFrames={KINETIK4_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="KinetikFeatures" component={Kinetik5} durationInFrames={KINETIK5_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="SignsPath21Days" component={Days21} durationInFrames={DAYS21_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="SignsPathTuesday" component={Tuesday} durationInFrames={TUESDAY_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="SignsPathEyesClosed" component={EyesClosed} durationInFrames={EYES_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="SignsPathOneYear" component={OneYear} durationInFrames={ONEYEAR_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="SignsPathNight" component={Night} durationInFrames={NIGHT_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="SignsPathRepeat" component={Repeat} durationInFrames={REPEAT_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="SignsPathMorning" component={Morning} durationInFrames={MORNING_FRAMES} fps={30} width={1080} height={1920} />
    </>
  );
};
