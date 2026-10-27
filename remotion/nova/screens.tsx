import { interpolate } from "remotion";
import { clamp, eOut, lerp, prog } from "../viewz/util";
import { SH, SW, Star } from "./parts";
import { AURORA, N, sans, serif } from "./theme";

const Status = () => (
  <div style={{ position: "absolute", top: 26, left: 46, right: 42, display: "flex", justifyContent: "space-between", ...sans(24, 700), color: N.ink }}>
    <span>9:41</span>
    <div style={{ width: 40, height: 20, borderRadius: 6, border: `2px solid ${N.ink}`, padding: 2, boxSizing: "border-box" }}>
      <div style={{ width: "80%", height: "100%", borderRadius: 3, background: N.ink }} />
    </div>
  </div>
);

const eur = (v: number) =>
  v
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const TX = [
  { n: "Café Kitsuné", c: "Restaurants", a: "−4,20 €" },
  { n: "Julien M.", c: "Virement reçu", a: "+1 250,00 €", plus: true },
  { n: "Uber", c: "Transport", a: "−12,40 €" },
  { n: "Monoprix", c: "Courses", a: "−23,80 €" },
];

/** Écran d'accueil : solde qui défile, mini-carte, dernières opérations. */
export const HomeScreen: React.FC<{ f: number; from: number }> = ({ f, from }) => {
  const l = f - from;
  const bal = lerp(0, 12480, interpolate(l, [10, 60], [0, 1], { ...clamp, easing: eOut }));
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 0%, #1a1d3a 0%, ${N.bg} 55%)` }}>
      <Status />
      <div style={{ position: "absolute", top: 100, left: 40, right: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Star size={34} />
          <span style={{ ...serif(40), color: N.ink }}>Nova</span>
        </div>
        <div style={{ width: 54, height: 54, borderRadius: "50%", background: AURORA, display: "flex", alignItems: "center", justifyContent: "center", ...sans(22, 800), color: N.bg }}>CM</div>
      </div>
      <div style={{ position: "absolute", top: 200, left: 40 }}>
        <div style={{ ...sans(22, 600), color: N.muted }}>Solde total</div>
        <div style={{ ...sans(76, 800), color: N.ink, fontVariantNumeric: "tabular-nums", marginTop: 8 }}>
          {eur(bal).split(",")[0]}
          <span style={{ ...sans(44, 700), color: N.muted }}>,{eur(bal).split(",")[1]} €</span>
        </div>
        <div style={{ ...sans(22, 700), color: N.green, marginTop: 8 }}>▲ +2,4 % ce mois-ci</div>
      </div>
      <div style={{ position: "absolute", top: 410, left: 40, right: 40, display: "flex", gap: 14 }}>
        {["Envoyer", "Recevoir", "Épargner"].map((t, i) => (
          <div key={t} style={{ flex: 1, height: 96, borderRadius: 26, background: i === 0 ? N.ink : "rgba(255,255,255,0.06)", border: `1px solid ${N.line}`, display: "flex", alignItems: "center", justifyContent: "center", ...sans(22, 700), color: i === 0 ? N.bg : N.ink, opacity: prog(l, 20 + i * 4, 30 + i * 4) }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 550, left: 40, right: 40, ...sans(26, 700), color: N.ink }}>Opérations récentes</div>
      {TX.map((t, i) => {
        const q = prog(l, 26 + i * 5, 40 + i * 5, eOut);
        return (
          <div key={t.n} style={{ position: "absolute", top: 610 + i * 112, left: 30, right: 30, height: 96, padding: "0 18px", borderRadius: 24, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 18, opacity: q, transform: `translateY(${(1 - q) * 30}px)` }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: t.plus ? "rgba(94,230,160,0.15)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", ...sans(26, 800), color: t.plus ? N.green : N.ink }}>{t.n[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ ...sans(26, 700), color: N.ink }}>{t.n}</div>
              <div style={{ ...sans(20, 500), color: N.muted, marginTop: 4 }}>{t.c}</div>
            </div>
            <div style={{ ...sans(26, 800), color: t.plus ? N.green : N.ink }}>{t.a}</div>
          </div>
        );
      })}
      <TabBar active={0} />
    </div>
  );
};

/** Écran cartes virtuelles : une nouvelle carte se crée. */
export const CardsScreen: React.FC<{ f: number; from: number }> = ({ f, from }) => {
  const l = f - from;
  const make = prog(l, 4, 20, eOut);
  const cards = [
    { name: "Courses en ligne", c: "linear-gradient(135deg, #6f7cff, #b28cff)", num: "3390" },
    { name: "Abonnements", c: "linear-gradient(135deg, #5ee6d0, #6f7cff)", num: "7712" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: N.bg }}>
      <Status />
      <div style={{ position: "absolute", top: 100, left: 40, ...serif(56), color: N.ink }}>Mes cartes</div>
      {cards.map((c, i) => (
        <div key={c.num} style={{ position: "absolute", left: 40, top: 210 + i * 90, width: SW - 80, height: 280, borderRadius: 30, background: c.c, boxShadow: "0 20px 40px rgba(0,0,0,0.5)", opacity: 0.55 + i * 0.1 }}>
          <div style={{ position: "absolute", left: 28, top: 24, ...sans(22, 700), color: "rgba(5,6,10,0.8)" }}>{c.name}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 40, top: lerp(700, 400, make), width: SW - 80, height: 280, borderRadius: 30, background: "linear-gradient(135deg, #1c1e26, #0b0c10)", border: "1.5px solid rgba(212,179,122,0.6)", boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,179,122,0.25)", opacity: make }}>
        <div style={{ position: "absolute", left: 28, top: 26, display: "flex", alignItems: "center", gap: 10 }}>
          <Star size={30} />
          <span style={{ ...sans(22, 700), color: N.ink }}>Voyage · virtuelle</span>
        </div>
        <div style={{ position: "absolute", left: 28, bottom: 30, ...sans(30, 600), color: N.ink, letterSpacing: "0.12em" }}>•••• 0915</div>
        <div style={{ position: "absolute", right: 28, bottom: 30, ...sans(18, 800), color: N.gold, letterSpacing: "0.2em" }}>NOUVEAU</div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 740, display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { t: "Geler la carte", on: false },
          { t: "Paiements en ligne", on: true },
          { t: "Plafond 1 500 €", on: true },
        ].map((r, i) => {
          const q = prog(l, 10 + i * 4, 20 + i * 4);
          return (
            <div key={r.t} style={{ height: 90, borderRadius: 24, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", opacity: q }}>
              <span style={{ ...sans(26, 600), color: N.ink }}>{r.t}</span>
              <div style={{ width: 70, height: 40, borderRadius: 20, background: r.on ? N.violet : "rgba(255,255,255,0.15)", position: "relative" }}>
                <div style={{ position: "absolute", top: 4, left: r.on ? 34 : 4, width: 32, height: 32, borderRadius: "50%", background: "#fff" }} />
              </div>
            </div>
          );
        })}
      </div>
      <TabBar active={1} />
    </div>
  );
};

const TabBar: React.FC<{ active: number }> = ({ active }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "rgba(11,14,24,0.95)", borderTop: `1px solid ${N.line}`, display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: 16, boxSizing: "border-box" }}>
    {["Accueil", "Cartes", "Épargne", "Profil"].map((t, i) => (
      <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ width: 28, height: 28, borderRadius: i === 3 ? "50%" : 8, border: `2.5px solid ${i === active ? N.ink : N.muted}` }} />
        <span style={{ ...sans(16, 700), color: i === active ? N.ink : N.muted }}>{t}</span>
      </div>
    ))}
  </div>
);

export { SH };
