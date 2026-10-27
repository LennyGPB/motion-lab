import { Composition } from "remotion";
import { Intro } from "./Intro";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Intro"
      component={Intro}
      durationInFrames={180} // 6 s à 30 fps
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
