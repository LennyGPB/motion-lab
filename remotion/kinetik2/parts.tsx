import React from "react";
import { hash } from "../viewz/util";

export const CYAN = "#5ee6f2";
export const LAV = "#c4b5ff";
export const SANS = "Manrope, Inter, sans-serif";
export const FONT = "Archivo, sans-serif";

export const rgb = (a: number) =>
  a > 0.2 ? `${-a}px 0 rgba(255,40,90,0.75), ${a}px 0 rgba(40,240,255,0.75)` : undefined;

// Sol en grille néon, en perspective, qui avance doucement
export const GridFloor: React.FC<{ f: number; tint: string }> = ({ f, tint }) => {
  const H0 = 1060; // horizon
  const K = 860; // focale * hauteur caméra
  const c = 300; // écart des lignes au premier plan
  const phase = (f * 0.06) % 1;
  const vert = Array.from({ length: 31 }).map((_, i) => i - 15);
  const hor = Array.from({ length: 40 }).map((_, k) => 0.55 + k - phase).filter((z) => z > 0.3);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
          <stop offset={H0 / 1920} stopColor="#000" />
          <stop offset={(H0 + 160) / 1920} stopColor="#fff" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id="gm">
          <rect width={1080} height={1920} fill="url(#gf)" />
        </mask>
      </defs>
      <g mask="url(#gm)" stroke={tint} strokeWidth={2.4} style={{ filter: `drop-shadow(0 0 6px ${tint})` }}>
        {vert.map((x) => (
          <line key={`v${x}`} x1={540} y1={H0} x2={540 + c * x * 4} y2={H0 + K * 4} />
        ))}
        {hor.map((z, k) => (
          <line key={`h${k}`} x1={0} x2={1080} y1={H0 + K / z} y2={H0 + K / z} />
        ))}
      </g>
    </svg>
  );
};

// Traits horizontaux de glitch
export const Streaks: React.FC<{ f: number; amt: number }> = ({ f, amt }) => {
  if (amt <= 0.01) return null;
  const n = Math.round(10 + amt * 18);
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const s = Math.floor(f / 2) * 31 + i * 7;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: hash(s) * 1920,
              left: hash(s + 1) * 900 - 200,
              width: 120 + hash(s + 2) * 600,
              height: 2 + hash(s + 3) * 3,
              background: hash(s + 4) > 0.7 ? CYAN : "#fff",
              opacity: amt * (0.35 + 0.5 * hash(s + 5)),
            }}
          />
        );
      })}
    </>
  );
};

// Logo Kinetik : sphère en tranches horizontales
export const KinetikGlyph: React.FC<{ size: number; f: number }> = ({ size, f }) => {
  const rows = 9;
  const R = 50;
  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120">
      <defs>
        <linearGradient id="kg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor={LAV} />
        </linearGradient>
      </defs>
      {Array.from({ length: rows }).map((_, i) => {
        const y = (i - (rows - 1) / 2) * 11.5;
        const hw = Math.sqrt(Math.max(0, R * R - y * y));
        const sh = Math.sin(f / 6 + i * 0.8) * 4;
        return (
          <g key={i}>
            <rect x={-hw + 8 + sh} y={y - 3.2} width={Math.max(2, hw * 2 - 16)} height={6.4} rx={3.2} fill="url(#kg)" />
            <circle cx={-hw - 1 + sh} cy={y} r={2.6} fill="url(#kg)" />
          </g>
        );
      })}
    </svg>
  );
};

// Site fictif généré (contenu statique)
export const SiteW = 900;
export const SiteH = 540;
export const FictionalSite: React.FC = () => (
  <div style={{ width: SiteW, height: SiteH, position: "relative", overflow: "hidden", background: "linear-gradient(160deg, #0b1220 0%, #0a0f1a 60%, #120d24 100%)", fontFamily: SANS, color: "#fff" }}>
    {/* nav */}
    <div style={{ position: "absolute", top: 26, left: 40, right: 40, display: "flex", alignItems: "center", gap: 28, fontSize: 15, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontWeight: 800, fontSize: 20, marginRight: "auto" }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", border: `4px solid ${CYAN}`, boxShadow: `0 0 12px ${CYAN}` }} />
        Halo
      </div>
      <span>Product</span>
      <span>Sound</span>
      <span>Stories</span>
      <div style={{ padding: "9px 18px", borderRadius: 999, background: "#fff", color: "#0b1220", fontWeight: 800 }}>Pre-order</div>
    </div>
    {/* hero */}
    <div style={{ position: "absolute", top: 132, left: 48, width: 420 }}>
      <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(94,230,242,0.5)", color: CYAN, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>NEW · HALO ONE</div>
      <div style={{ marginTop: 22, fontSize: 58, fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.03em" }}>
        Sound,
        <br />
        <span style={{ background: `linear-gradient(90deg, ${CYAN}, ${LAV})`, WebkitBackgroundClip: "text", color: "transparent" }}>reimagined.</span>
      </div>
      <div style={{ marginTop: 18, fontSize: 17, lineHeight: 1.45, color: "rgba(255,255,255,0.6)" }}>Wireless headphones with adaptive spatial audio and 60 hours of battery.</div>
      <div style={{ marginTop: 26, display: "flex", gap: 12 }}>
        <div style={{ padding: "13px 24px", borderRadius: 999, background: `linear-gradient(90deg, ${CYAN}, ${LAV})`, color: "#0b1220", fontWeight: 800, fontSize: 16 }}>Shop now</div>
        <div style={{ padding: "13px 24px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)", fontWeight: 700, fontSize: 16 }}>Watch film</div>
      </div>
    </div>
    {/* visuel : anneaux lumineux */}
    <div style={{ position: "absolute", left: 520, top: 100, width: 340, height: 340 }}>
      <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: `radial-gradient(circle, rgba(94,230,242,0.35), transparent 65%)` }} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", inset: 30 + i * 46, borderRadius: "50%", border: `${10 - i * 3}px solid ${i === 1 ? LAV : CYAN}`, boxShadow: `0 0 24px ${i === 1 ? LAV : CYAN}, inset 0 0 18px ${i === 1 ? LAV : CYAN}`, opacity: 0.95 - i * 0.2 }} />
      ))}
      <div style={{ position: "absolute", inset: 150, borderRadius: "50%", background: "#fff", boxShadow: `0 0 30px #fff` }} />
    </div>
    {/* stats */}
    <div style={{ position: "absolute", bottom: 26, left: 48, right: 48, display: "flex", gap: 14 }}>
      {[
        ["60h", "battery"],
        ["-42 dB", "noise cancel"],
        ["4.9★", "12k reviews"],
      ].map(([a, b]) => (
        <div key={a} style={{ flex: 1, padding: "12px 16px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{a}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{b}</div>
        </div>
      ))}
    </div>
  </div>
);

// Fil de fer (avant génération)
export const Wireframe: React.FC = () => (
  <div style={{ width: SiteW, height: SiteH, position: "relative", background: "rgba(6,20,26,0.85)" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(94,230,242,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(94,230,242,0.12) 1px, transparent 1px)", backgroundSize: "45px 45px" }} />
    {[
      [40, 28, 120, 22],
      [48, 140, 300, 50],
      [48, 205, 360, 50],
      [48, 290, 380, 16],
      [48, 360, 140, 46],
      [200, 360, 140, 46],
      [540, 110, 300, 300],
    ].map(([x, y, w, h], i) => (
      <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: i === 6 ? "50%" : 8, border: "1.5px dashed rgba(94,230,242,0.45)" }} />
    ))}
  </div>
);
