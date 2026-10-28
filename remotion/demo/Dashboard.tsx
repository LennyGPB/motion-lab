import { SANS } from "../signspath/theme";
import { lerp } from "../viewz/util";
import { CONFIG } from "./config";
import { APP_H, APP_W, CHART, chartXY, DATA_30, DATA_90, EXPORT_BTN, OPTIONS, PICKER, TOAST } from "./geometry";

const C = CONFIG;
const INK = "#121527";
const MUTED = "#70748f";
const LINE = "#eceef5";

export type DashState = {
  rangeOpen: number;
  rangeHover: number;
  morph: number;
  selected90: boolean;
  point: number;
  pointIdx: number;
  exportPress: number;
  exportLoading: number;
  toast: number;
};

const Card: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 6px 20px rgba(18,21,39,0.05)", boxSizing: "border-box", padding: 22 }}>{children}</div>
);

/** Tableau de bord SaaS de démonstration (1600x1000). */
export const Dashboard: React.FC<{ f: number; s: DashState }> = ({ f, s }) => {
  const data = DATA_30.map((v, i) => lerp(v, DATA_90[i], s.morph));
  const pts = data.map((_, i) => chartXY(i, data));
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const area = `${path} L ${CHART.x + CHART.w} ${CHART.y + CHART.h} L ${CHART.x} ${CHART.y + CHART.h} Z`;
  const kpi = [
    { l: "Revenue", v: `$${Math.round(lerp(48290, 131420, s.morph)).toLocaleString("en-US")}`, d: "+12.4%" },
    { l: "Active users", v: Math.round(lerp(12840, 36120, s.morph)).toLocaleString("en-US"), d: "+8.1%" },
    { l: "Conversion", v: `${lerp(3.8, 4.3, s.morph).toFixed(1)}%`, d: "+0.5pt" },
    { l: "Churn", v: `${lerp(1.2, 0.9, s.morph).toFixed(1)}%`, d: "−0.3pt" },
  ];
  const [px, py] = chartXY(s.pointIdx, data);
  return (
    <div style={{ position: "relative", width: APP_W, height: APP_H, background: "#f6f7fb", fontFamily: SANS, color: INK, overflow: "hidden" }}>
      {/* barre latérale */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 240, height: APP_H, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "26px 18px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 800 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})` }} />
          {C.appName}
        </div>
        {["Overview", "Reports", "Customers", "Integrations", "Settings"].map((t, i) => (
          <div key={t} style={{ marginTop: i ? 6 : 36, padding: "12px 14px", borderRadius: 12, background: i === 0 ? `${C.accent}14` : "transparent", color: i === 0 ? C.accent : MUTED, fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, border: `2.5px solid ${i === 0 ? C.accent : "#b4b7cc"}` }} />
            {t}
          </div>
        ))}
      </div>
      {/* barre du haut */}
      <div style={{ position: "absolute", left: 270, top: 20, width: 420, height: 44, borderRadius: 12, background: "#fff", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 16px", color: "#a3a6bd", fontSize: 18 }}>Search reports, customers…</div>
      <div style={{ position: "absolute", left: PICKER.x, top: PICKER.y, width: PICKER.w, height: PICKER.h, borderRadius: 12, background: "#fff", border: `1.5px solid ${s.rangeOpen > 0.1 ? C.accent : LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", boxSizing: "border-box", fontSize: 19, fontWeight: 700, boxShadow: s.rangeOpen > 0.1 ? `0 0 0 4px ${C.accent}22` : undefined }}>
        <span>📅 {s.selected90 ? OPTIONS[2] : OPTIONS[1]}</span>
        <span style={{ color: MUTED }}>▾</span>
      </div>
      <div style={{ position: "absolute", left: EXPORT_BTN.x, top: EXPORT_BTN.y, width: EXPORT_BTN.w, height: EXPORT_BTN.h, borderRadius: 12, background: INK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 19, fontWeight: 800, transform: `scale(${1 - 0.07 * s.exportPress})` }}>
        {s.exportLoading > 0 && s.exportLoading < 1 ? <div style={{ width: 18, height: 18, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", transform: `rotate(${f * 30}deg)` }} /> : <span>⤓</span>}
        Export
      </div>
      <div style={{ position: "absolute", left: 1480, top: 18, width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, #ffb35b, #ff6b8b)` }} />
      {/* KPIs */}
      {kpi.map((k, i) => (
        <Card key={k.l} x={270 + i * 330} y={100} w={310} h={150}>
          <div style={{ fontSize: 18, fontWeight: 700, color: MUTED }}>{k.l}</div>
          <div style={{ fontSize: 40, fontWeight: 800, marginTop: 10, letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>{k.v}</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: i === 3 ? "#16a34a" : "#16a34a", marginTop: 6 }}>▲ {k.d}</div>
        </Card>
      ))}
      {/* graphique */}
      <Card x={270} y={280} w={850} h={370}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, fontWeight: 800 }}>Revenue</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["7D", "30D", "90D"].map((t, i) => (
              <span key={t} style={{ padding: "4px 12px", borderRadius: 8, fontSize: 15, fontWeight: 800, background: (s.selected90 ? i === 2 : i === 1) ? INK : "#f0f1f7", color: (s.selected90 ? i === 2 : i === 1) ? "#fff" : MUTED }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </Card>
      <svg width={APP_W} height={APP_H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="dmarea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.accent} stopOpacity="0.28" />
            <stop offset="1" stopColor={C.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.33, 0.66, 1].map((g) => (
          <line key={g} x1={CHART.x} x2={CHART.x + CHART.w} y1={CHART.y + g * CHART.h} y2={CHART.y + g * CHART.h} stroke={LINE} strokeWidth={1.5} />
        ))}
        <path d={area} fill="url(#dmarea)" />
        <path d={path} stroke={C.accent} strokeWidth={4} fill="none" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === s.pointIdx && s.point > 0 ? 9 : 5} fill="#fff" stroke={C.accent} strokeWidth={3} />
        ))}
        {s.point > 0 ? (
          <>
            <line x1={px} x2={px} y1={CHART.y - 10} y2={CHART.y + CHART.h} stroke={C.accent} strokeWidth={2} strokeDasharray="5 5" opacity={s.point} />
            <circle cx={px} cy={py} r={14 + 16 * ((f % 30) / 30)} fill="none" stroke={C.accent} strokeWidth={2} opacity={(1 - (f % 30) / 30) * s.point} />
          </>
        ) : null}
      </svg>
      {s.point > 0 ? (
        <div style={{ position: "absolute", left: px - 110, top: py - 118, width: 220, padding: "12px 16px", borderRadius: 14, background: INK, color: "#fff", opacity: s.point, transform: `translateY(${(1 - s.point) * 12}px)`, boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}>
          <div style={{ fontSize: 15, color: "#b4b7cc", fontWeight: 700 }}>Mar 24</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>$6,420 <span style={{ fontSize: 16, color: "#4ade80" }}>▲ 12%</span></div>
        </div>
      ) : null}
      {/* objectifs */}
      <Card x={1150} y={280} w={420} h={370}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Goals</div>
        <svg width={200} height={200} style={{ position: "absolute", left: 110, top: 80 }} viewBox="0 0 200 200">
          <circle cx={100} cy={100} r={78} fill="none" stroke="#f0f1f7" strokeWidth={22} />
          <circle cx={100} cy={100} r={78} fill="none" stroke={C.accent2} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 78 * lerp(0.62, 0.84, s.morph)} 999`} transform="rotate(-90 100 100)" />
          <text x={100} y={112} textAnchor="middle" fontSize={38} fontWeight={800} fill={INK} fontFamily={SANS}>
            {Math.round(lerp(62, 84, s.morph))}%
          </text>
        </svg>
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, textAlign: "center", fontSize: 17, color: MUTED, fontWeight: 600 }}>Quarterly target</div>
      </Card>
      {/* tableau */}
      <Card x={270} y={680} w={1300} h={300}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Recent customers</div>
        {["Northwind", "Globex", "Initech", "Umbrella"].map((n, i) => (
          <div key={n} style={{ position: "absolute", left: 22, right: 22, top: 70 + i * 54, height: 48, display: "flex", alignItems: "center", borderTop: `1px solid ${LINE}`, fontSize: 18 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: ["#c7d2fe", "#bbf7d0", "#fde68a", "#fecdd3"][i], marginRight: 14 }} />
            <span style={{ width: 300, fontWeight: 700 }}>{n}</span>
            <span style={{ width: 260, color: MUTED }}>{["Enterprise", "Pro", "Pro", "Starter"][i]}</span>
            <span style={{ width: 240, fontWeight: 700 }}>${[12400, 4320, 3180, 890][i].toLocaleString("en-US")}</span>
            <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 15, fontWeight: 800, background: i === 3 ? "#fef3c7" : "#dcfce7", color: i === 3 ? "#b45309" : "#15803d" }}>{i === 3 ? "Trial" : "Active"}</span>
          </div>
        ))}
      </Card>
      {/* menu déroulant */}
      {s.rangeOpen > 0.01 ? (
        <div style={{ position: "absolute", left: PICKER.x, top: 70, width: PICKER.w, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 18px 40px rgba(18,21,39,0.18)", padding: 6, opacity: s.rangeOpen, transform: `translateY(${(1 - s.rangeOpen) * -10}px)`, transformOrigin: "50% 0%" }}>
          {OPTIONS.map((o, k) => (
            <div key={o} style={{ height: 44, borderRadius: 10, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 18, fontWeight: 700, background: s.rangeHover === k ? `${C.accent}18` : "transparent", color: s.rangeHover === k ? C.accent : INK }}>
              {o}
              {(s.selected90 ? k === 2 : k === 1) ? <span style={{ marginLeft: "auto", color: C.accent }}>✓</span> : null}
            </div>
          ))}
        </div>
      ) : null}
      {/* notification d'export */}
      {s.toast > 0 ? (
        <div style={{ position: "absolute", left: TOAST.x, top: TOAST.y + (1 - s.toast) * 40, width: TOAST.w, height: TOAST.h, borderRadius: 16, background: INK, color: "#fff", display: "flex", alignItems: "center", gap: 16, padding: "0 20px", boxSizing: "border-box", opacity: s.toast, boxShadow: "0 18px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900 }}>✓</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Report exported</div>
            <div style={{ fontSize: 15, color: "#b4b7cc" }}>revenue-90d.pdf · 1.2 MB</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
