import { Img, staticFile } from "remotion";
import { NovaPhone } from "../nova/parts";
import { SANS } from "../signspath/theme";
import { CONFIG } from "./config";

const C = CONFIG;
const GRAD = `linear-gradient(135deg, ${C.accent}, ${C.accent2})`;
const bar = (w: number | string, h = 12, o = 0.16): React.CSSProperties => ({ width: w, height: h, borderRadius: h / 2, background: `rgba(255,255,255,${o})` });

/* ---------------- Écrans génériques (statiques) ---------------- */
const Card: React.FC<{ h: number; accent?: boolean; children?: React.ReactNode }> = ({ h, accent, children }) => (
  <div style={{ height: h, borderRadius: 16, background: accent ? GRAD : "rgba(255,255,255,0.06)", padding: 16, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
);
const Chart: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h}>
    <path d={`M0 ${h * 0.8} C ${w * 0.2} ${h * 0.6}, ${w * 0.35} ${h * 0.75}, ${w * 0.5} ${h * 0.45} S ${w * 0.8} ${h * 0.3}, ${w} ${h * 0.12}`} stroke={C.accent2} strokeWidth={4} fill="none" />
  </svg>
);
const Head: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontWeight: 800, fontSize: size, color: "#fff" }}>
    <div style={{ width: size * 1.2, height: size * 1.2, borderRadius: size * 0.35, background: GRAD }} />
    {C.product}
  </div>
);
const bg = `radial-gradient(circle at 80% 0%, ${C.accent}33, transparent 50%), #0e1120`;

export const DesktopScreen: React.FC<{ w: number; h: number }> = ({ w, h }) =>
  C.screens.desktop ? (
    <Img src={staticFile(C.screens.desktop)} style={{ width: w, height: h, objectFit: "cover", display: "block" }} />
  ) : (
    <div style={{ width: w, height: h, background: bg, display: "flex", fontFamily: SANS }}>
      <div style={{ width: 190, padding: 22, borderRight: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 16 }}>
        <Head size={20} />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ ...bar(i === 0 ? "90%" : "70%", 14, i === 0 ? 0.4 : 0.14), marginTop: i === 0 ? 14 : 0 }} />
        ))}
      </div>
      <div style={{ flex: 1, padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "130px 1fr", gap: 16 }}>
        <Card h={130} accent>
          <div style={bar("50%", 12, 0.6)} />
          <div style={{ fontSize: 34, fontWeight: 800, color: "#fff" }}>2,480</div>
        </Card>
        <Card h={130}>
          <div style={bar("60%")} />
          <div style={bar("40%", 22, 0.35)} />
        </Card>
        <Card h={130}>
          <div style={bar("45%")} />
          <div style={bar("55%", 22, 0.35)} />
        </Card>
        <div style={{ gridColumn: "1 / 3", borderRadius: 16, background: "rgba(255,255,255,0.05)", padding: 18 }}>
          <div style={bar("30%", 14, 0.35)} />
          <Chart w={500} h={250} />
        </div>
        <div style={{ borderRadius: 16, background: "rgba(255,255,255,0.05)", padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: i % 2 ? C.accent2 : C.accent, opacity: 0.8 }} />
              <div style={bar("70%")} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

export const TabletScreen: React.FC<{ w: number; h: number }> = ({ w, h }) =>
  C.screens.tablet ? (
    <Img src={staticFile(C.screens.tablet)} style={{ width: w, height: h, objectFit: "cover", display: "block" }} />
  ) : (
    <div style={{ width: w, height: h, background: bg, padding: 26, boxSizing: "border-box", fontFamily: SANS, display: "flex", flexDirection: "column", gap: 18 }}>
      <Head size={24} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card h={150} accent>
          <div style={bar("50%", 12, 0.6)} />
          <div style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>2,480</div>
        </Card>
        <Card h={150}>
          <div style={bar("60%")} />
          <div style={bar("40%", 22, 0.35)} />
        </Card>
      </div>
      <div style={{ borderRadius: 16, background: "rgba(255,255,255,0.05)", padding: 16 }}>
        <div style={bar("35%", 14, 0.35)} />
        <Chart w={500} h={190} />
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.04)" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: i % 2 ? C.accent2 : C.accent, opacity: 0.8 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={bar("60%", 12, 0.35)} />
            <div style={bar("35%", 10)} />
          </div>
        </div>
      ))}
    </div>
  );

export const PhoneScreen: React.FC<{ w: number; h: number }> = ({ w, h }) =>
  C.screens.phone ? (
    <Img src={staticFile(C.screens.phone)} style={{ width: w, height: h, objectFit: "cover", display: "block" }} />
  ) : (
    <div style={{ width: w, height: h, background: bg, padding: "84px 26px 26px", boxSizing: "border-box", fontFamily: SANS, display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
      <Head size={30} />
      <Card h={190} accent>
        <div style={bar("45%", 14, 0.6)} />
        <div style={{ fontSize: 50, fontWeight: 800, color: "#fff" }}>2,480</div>
        <div style={bar("35%", 12, 0.5)} />
      </Card>
      <div style={{ borderRadius: 18, background: "rgba(255,255,255,0.05)", padding: 16 }}>
        <Chart w={440} h={170} />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.04)" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: i % 2 ? C.accent2 : C.accent, opacity: 0.8 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={bar("70%", 14, 0.35)} />
            <div style={bar("40%", 10)} />
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 100, background: "rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 30, height: 30, borderRadius: 9, background: i === 0 ? GRAD : "rgba(255,255,255,0.2)" }} />
        ))}
      </div>
    </div>
  );

/* ---------------- Appareils ---------------- */
export const LAP = { sw: 1000, sh: 625, bez: 22 };

/** Laptop : écran (charnière en bas, s'ouvre) + clavier. Origine = centre de l'écran. */
export const Laptop: React.FC<{ lid: number; on: number; op: number; baseOp?: number }> = ({ lid, on, op, baseOp = 1 }) => {
  const LW = LAP.sw + LAP.bez * 2;
  const LH = LAP.sh + LAP.bez * 2;
  const angle = -92 + 90 * lid; // -92 fermé → -2 ouvert
  return (
    <div style={{ position: "absolute", left: -LW / 2, top: -LH / 2, width: LW, height: LH, transformStyle: "preserve-3d" }}>
      {/* clavier (plan incliné sous la charnière) */}
      <div style={{ position: "absolute", left: -70, top: LH, width: LW + 140, height: 420, transformOrigin: "50% 0%", transform: "rotateX(84deg)", borderRadius: "10px 10px 36px 36px", background: "linear-gradient(180deg, #c9ccd6, #8e93a3)", opacity: op * baseOp, boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 40, height: 220, borderRadius: 14, background: "repeating-linear-gradient(90deg, #6d7180 0 46px, #9a9eab 46px 52px)", opacity: 0.6 }} />
        <div style={{ position: "absolute", left: "50%", top: 290, width: 360, height: 100, marginLeft: -180, borderRadius: 14, background: "rgba(0,0,0,0.12)" }} />
      </div>
      {/* écran */}
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 100%", transform: `rotateX(${angle}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "#111318", border: "3px solid #3a3d46", padding: LAP.bez, boxSizing: "border-box", opacity: op, backfaceVisibility: "hidden" }}>
          <div style={{ position: "relative", width: LAP.sw, height: LAP.sh, borderRadius: 8, overflow: "hidden", background: "#05060a" }}>
            <div style={{ opacity: on }}>
              <DesktopScreen w={LAP.sw} h={LAP.sh} />
            </div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.08) 48%, transparent 58%)" }} />
          </div>
          <div style={{ position: "absolute", left: "50%", top: 6, width: 10, height: 10, marginLeft: -5, borderRadius: "50%", background: "#2a2d35" }} />
        </div>
        {/* dos de l'écran */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(135deg, #d6d9e2, #9da2b1)", transform: "rotateY(180deg)", backfaceVisibility: "hidden", opacity: op, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 90, height: 90, borderRadius: 26, background: "rgba(255,255,255,0.5)" }} />
        </div>
      </div>
    </div>
  );
};

export const TAB = { sw: 600, sh: 800, bez: 30 };
/** Tablette recto-verso. Origine = centre. */
export const Tablet: React.FC<{ op: number }> = ({ op }) => {
  const TW = TAB.sw + TAB.bez * 2;
  const TH = TAB.sh + TAB.bez * 2;
  return (
    <div style={{ position: "absolute", left: -TW / 2, top: -TH / 2, width: TW, height: TH, transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 50, background: "#111318", border: "3px solid #4a4d56", padding: TAB.bez, boxSizing: "border-box", backfaceVisibility: "hidden", opacity: op, boxShadow: "0 50px 100px rgba(0,0,0,0.55)" }}>
        <div style={{ width: TAB.sw, height: TAB.sh, borderRadius: 22, overflow: "hidden", position: "relative" }}>
          <TabletScreen w={TAB.sw} h={TAB.sh} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.08) 48%, transparent 58%)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 50, background: "linear-gradient(135deg, #dfe2ea, #9da2b1)", transform: "rotateY(180deg)", backfaceVisibility: "hidden", opacity: op, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 120, height: 120, borderRadius: 34, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff" }}>{C.iconGlyph}</div>
        <div style={{ position: "absolute", left: 40, top: 40, width: 90, height: 90, borderRadius: 26, background: "#2a2d35" }} />
      </div>
    </div>
  );
};

/** Téléphone (réutilise le cadre de Nova). Origine = centre. */
export const Phone: React.FC<{ op: number }> = ({ op }) => (
  <div style={{ position: "absolute", left: -280, top: -590, opacity: op }}>
    <NovaPhone f={0} screens={[{ from: 0, node: <PhoneScreen w={524} h={1144} /> }]} />
  </div>
);

export { GRAD };
