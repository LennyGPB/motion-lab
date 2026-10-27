import { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  draw: (ctx: CanvasRenderingContext2D, frame: number, w: number, h: number) => void;
  style?: React.CSSProperties;
};

/** Canvas plein écran redessiné à chaque frame (rendu déterministe). */
export const Canvas: React.FC<Props> = ({ draw, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, width, height);
    draw(ctx, frame, width, height);
  });
  return <canvas ref={ref} width={width} height={height} style={{ position: "absolute", inset: 0, ...style }} />;
};
