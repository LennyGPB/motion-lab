import { useVideoConfig } from "remotion";

/** Mise en page adaptative 9:16 / 16:9. */
export type Lay = {
  W: number;
  H: number;
  portrait: boolean;
  /** zone texte */
  tx: number;
  ty: number;
  tw: number;
  /** centre de la zone visuelle */
  vx: number;
  vy: number;
  /** échelle du visuel */
  vs: number;
};

export const useLay = (): Lay => {
  const { width: W, height: H } = useVideoConfig();
  const portrait = H > W;
  return portrait
    ? { W, H, portrait, tx: 90, ty: 250, tw: W - 180, vx: W / 2, vy: H * 0.62, vs: 1 }
    : { W, H, portrait, tx: 140, ty: H * 0.3, tw: 760, vx: W * 0.7, vy: H / 2, vs: 0.82 };
};
