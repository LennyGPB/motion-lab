import { Img, staticFile } from "remotion";
import { FONT, V } from "./theme";

const label: React.CSSProperties = { fontFamily: FONT, fontWeight: 800, fontStretch: "90%", textTransform: "uppercase" };

export const Pill: React.FC<{ text: string; icon?: React.ReactNode; size?: number; hot?: boolean }> = ({ text, icon, size = 40, hot }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.35,
      padding: `${size * 0.42}px ${size * 0.8}px`,
      borderRadius: 999,
      background: hot ? "linear-gradient(135deg, #c13cff, #7a12d6)" : "rgba(40,10,70,0.72)",
      border: `2px solid ${hot ? "rgba(255,210,255,0.7)" : "rgba(200,120,255,0.55)"}`,
      boxShadow: `0 0 30px rgba(170,60,255,${hot ? 0.8 : 0.45}), inset 0 1px 0 rgba(255,255,255,0.2)`,
      color: V.white,
      fontSize: size,
      whiteSpace: "nowrap",
      ...label,
    }}
  >
    {icon}
    {text}
  </div>
);

export const PinIcon: React.FC<{ size: number; color?: string }> = ({ size, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
);

export const TicketIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinejoin="round">
    <path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6H3z" />
    <path d="M14 6v12" strokeDasharray="2 2" />
  </svg>
);

export const PlaneIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinejoin="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" fill="rgba(200,120,255,0.35)" />
  </svg>
);

export const Avatar: React.FC<{ name: string; size: number; ring?: number; live?: number }> = ({ name, size, ring = 1, live = 0 }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    {live > 0 ? (
      <div
        style={{
          position: "absolute",
          inset: -size * 0.12,
          borderRadius: "50%",
          border: `3px solid rgba(255,90,220,${0.9 * (1 - live)})`,
          transform: `scale(${1 + live * 0.5})`,
        }}
      />
    ) : null}
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        padding: size * 0.045,
        background: `conic-gradient(from 200deg, #ff5ad8, #a63cff, #6a12d0, #ff5ad8)`,
        boxShadow: `0 0 ${30 * ring}px rgba(190,70,255,0.8)`,
      }}
    >
      <Img src={staticFile(`viewz/avatars/${name}.png`)} style={{ width: "100%", height: "100%", borderRadius: "50%", display: "block" }} />
    </div>
  </div>
);

export const Bubble: React.FC<{ avatar: string; text: string; side: "left" | "right" }> = ({ avatar, text, side }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexDirection: side === "left" ? "row" : "row-reverse" }}>
    <Avatar name={avatar} size={92} ring={0.6} />
    <div
      style={{
        padding: "24px 34px",
        borderRadius: 40,
        borderBottomLeftRadius: side === "left" ? 8 : 40,
        borderBottomRightRadius: side === "right" ? 8 : 40,
        background: side === "left" ? "rgba(45,12,80,0.88)" : "linear-gradient(135deg, #c13cff, #7a12d6)",
        border: "2px solid rgba(220,160,255,0.5)",
        boxShadow: "0 0 40px rgba(170,60,255,0.55), 0 20px 50px rgba(0,0,0,0.5)",
        color: V.white,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 40,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  </div>
);

export const AppleLogo = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="#fff">
    <path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.8-1-2.8-4.1zM13.9 5.2c.7-.8 1.2-2 1-3.2-1 .1-2.2.7-3 1.5-.6.7-1.2 1.9-1 3.1 1.1.1 2.3-.6 3-1.4z" />
  </svg>
);

export const PlayLogo = () => (
  <svg width="60" height="60" viewBox="0 0 24 24">
    <path d="M4 2.5l10.2 9.5L4 21.5c-.5-.2-.8-.7-.8-1.3V3.8c0-.6.3-1.1.8-1.3z" fill="#00d2ff" />
    <path d="M14.2 12L4 2.5c.3-.1.7-.1 1.1.1l12.2 6.9z" fill="#00f076" />
    <path d="M14.2 12l3.1 2.5-12.2 6.9c-.4.2-.8.2-1.1.1z" fill="#ff3a44" />
    <path d="M17.3 9.5l3.2 1.8c.9.5.9 1.8 0 2.3l-3.2 1.9-3.1-3.5z" fill="#ffd000" />
  </svg>
);

export const StoreBadge: React.FC<{ kind: "apple" | "google" }> = ({ kind }) => (
  <div
    style={{
      width: 440,
      height: 132,
      borderRadius: 30,
      background: "rgba(5,0,10,0.92)",
      border: "2.5px solid rgba(255,255,255,0.85)",
      boxShadow: "0 0 40px rgba(170,60,255,0.6)",
      display: "flex",
      alignItems: "center",
      gap: 22,
      paddingLeft: 36,
      color: "#fff",
      fontFamily: FONT,
    }}
  >
    {kind === "apple" ? <AppleLogo /> : <PlayLogo />}
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
      <span style={{ fontSize: 24, fontWeight: 500, letterSpacing: 0.5 }}>{kind === "apple" ? "Télécharger dans" : "DISPONIBLE SUR"}</span>
      <span style={{ fontSize: 50, fontWeight: 700, letterSpacing: -1 }}>{kind === "apple" ? "l'App Store" : "Google Play"}</span>
    </div>
  </div>
);
