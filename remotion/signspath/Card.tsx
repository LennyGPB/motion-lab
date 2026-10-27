import { C, SANS, serifGradient } from "./theme";
import { Icon } from "./Icons";

type Props = {
  icon: string;
  label: string;
  kicker?: string;
  active?: number; // 0..1
  w?: number;
  h?: number;
  labelSize?: number;
};

/** Carte "verre dépoli" façon exemple (icône + petit kicker + mot en serif italique). */
export const GlassCard: React.FC<Props> = ({ icon, label, kicker, active = 0, w = 260, h = 340, labelSize }) => {
  const size = labelSize ?? Math.min(66, (w - 36) / (label.length * 0.43));
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 38,
        background: `linear-gradient(160deg, rgba(255,255,255,${0.17 + active * 0.08}) 0%, rgba(190,170,255,0.06) 55%, rgba(255,255,255,0.03) 100%), rgba(36,18,92,0.94)`,
        border: `1.5px solid rgba(225,215,255,${0.22 + active * 0.4})`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 30px 80px rgba(5,0,20,0.55), 0 0 ${active * 90}px rgba(150,110,255,${active * 0.65})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* reflet */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(125deg, rgba(255,255,255,0.18) 0%, transparent 32%)",
        }}
      />
      <Icon name={icon} size={w * 0.3} glow={0.4 + active * 0.8} />
      {kicker ? (
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: w * 0.085, color: C.muted, marginTop: 8 }}>{kicker}</div>
      ) : null}
      <div style={{ ...serifGradient, fontSize: size, lineHeight: 1.1, marginTop: kicker ? -6 : 8 }}>{label}</div>
    </div>
  );
};
