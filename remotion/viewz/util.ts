import { Easing, interpolate } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const eOut = Easing.out(Easing.cubic);
export const eIn = Easing.in(Easing.cubic);
export const eInOut = Easing.inOut(Easing.cubic);
export const eExpo = Easing.out(Easing.exp);
export const eBack = Easing.out(Easing.back(1.7));
export const prog = (f: number, a: number, b: number, easing = eOut) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
