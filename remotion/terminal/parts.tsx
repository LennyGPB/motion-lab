import { Img, staticFile } from "remotion";
import { CONFIG, OutLine } from "./config";
import { TERM } from "./timing";
import { clamp, eOut, prog } from "../viewz/util";
import { interpolate } from "remotion";

const C = CONFIG;
export const MONO = "'JetBrains Mono', Menlo, monospace";
export const WIN_W = 960;
export const WIN_H = 600; // écran 16:10
export const BAR = 46;

/** Écran du résultat : image fournie, sinon écran générique (statique). */
export const ResultScreen: React.FC = () => {
  if (C.screenImage) {
    return <Img src={staticFile(C.screenImage)} style={{ width: WIN_W, height: WIN_H, objectFit: "cover", display: "block" }} />;
  }
  const g = `linear-gradient(135deg, ${C.accent}, ${C.accent2})`;
  return (
    <div style={{ width: WIN_W, height: WIN_H, background: "#0b0f17", position: "relative", overflow: "hidden", fontFamily: "Manrope, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 75% 20%, ${C.accent2}30, transparent 45%), radial-gradient(circle at 10% 90%, ${C.accent}22, transparent 45%)` }} />
      <div style={{ position: "absolute", left: 36, right: 36, top: 26, display: "flex", alignItems: "center", gap: 12, color: "#e6edf3", fontWeight: 800, fontSize: 20 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: g }} />
        {C.product}
        <div style={{ marginLeft: "auto", display: "flex", gap: 22, fontSize: 15, color: "#8b949e", fontWeight: 600 }}>
          <span>Docs</span>
          <span>API</span>
          <span>Examples</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 36, top: 110, width: 470 }}>
        <div style={{ display: "inline-block", padding: "5px 12px", borderRadius: 999, border: `1px solid ${C.accent}66`, color: C.accent, fontFamily: MONO, fontSize: 13 }}>v4.2 is live</div>
        <div style={{ fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1.08, marginTop: 16, letterSpacing: -1 }}>
          Your app is
          <br />
          <span style={{ background: g, WebkitBackgroundClip: "text", color: "transparent" }}>up and running.</span>
        </div>
        <div style={{ fontSize: 17, color: "#8b949e", marginTop: 14 }}>Edit src/app.ts and save to reload.</div>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <div style={{ padding: "12px 20px", borderRadius: 10, background: g, color: "#06120c", fontWeight: 800, fontSize: 16 }}>Read the docs</div>
          <div style={{ padding: "12px 20px", borderRadius: 10, border: "1px solid #30363d", color: "#e6edf3", fontWeight: 700, fontSize: 16 }}>Examples</div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 36, top: 104, width: 380, height: 250, borderRadius: 14, background: "#0d1117", border: "1px solid #30363d", padding: 18, boxSizing: "border-box", fontFamily: MONO, fontSize: 14, lineHeight: 1.7 }}>
        <div><span style={{ color: "#ff7b72" }}>import</span> <span style={{ color: "#e6edf3" }}>{"{ acme }"}</span> <span style={{ color: "#ff7b72" }}>from</span> <span style={{ color: "#a5d6ff" }}>"@acme/sdk"</span></div>
        <div style={{ color: "#8b949e" }}>{"// one line to start"}</div>
        <div><span style={{ color: "#ff7b72" }}>const</span> <span style={{ color: "#e6edf3" }}>app</span> = <span style={{ color: "#d2a8ff" }}>acme</span>()</div>
        <div><span style={{ color: "#e6edf3" }}>app</span>.<span style={{ color: "#d2a8ff" }}>get</span>(<span style={{ color: "#a5d6ff" }}>"/"</span>, () =&gt; <span style={{ color: "#a5d6ff" }}>"Hello"</span>)</div>
        <div><span style={{ color: "#e6edf3" }}>app</span>.<span style={{ color: "#d2a8ff" }}>listen</span>(<span style={{ color: "#79c0ff" }}>3000</span>)</div>
      </div>
      <div style={{ position: "absolute", left: 36, right: 36, bottom: 30, display: "flex", gap: 16 }}>
        {["Fast", "Typed", "Open source"].map((t, i) => (
          <div key={t} style={{ flex: 1, height: 120, borderRadius: 14, background: "#111722", border: "1px solid #21262d", padding: 18, boxSizing: "border-box" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: i === 1 ? C.accent2 : C.accent, opacity: 0.85 }} />
            <div style={{ color: "#e6edf3", fontWeight: 800, fontSize: 18, marginTop: 14 }}>{t}</div>
            <div style={{ width: "70%", height: 8, borderRadius: 4, background: "#21262d", marginTop: 10 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

/** Barre de fenêtre (macOS). */
export const WinBar: React.FC<{ title: string; dark?: boolean }> = ({ title, dark }) => (
  <div style={{ height: BAR, display: "flex", alignItems: "center", gap: 9, padding: "0 16px", background: dark ? "#161b22" : "#1c2230", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
    {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
      <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
    ))}
    <div style={{ marginLeft: "auto", marginRight: "auto", fontFamily: MONO, fontSize: 15, color: "#8b949e" }}>{title}</div>
  </div>
);

/** Fenêtre résultat complète (barre + écran). */
export const ResultWindow: React.FC = () => (
  <div style={{ width: WIN_W, borderRadius: 16, overflow: "hidden", boxShadow: "0 0 0 1px rgba(255,255,255,0.1)" }}>
    <WinBar title={C.windowTitle} />
    <ResultScreen />
  </div>
);

const SPIN = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const lineColor = (k?: OutLine["kind"]) => (k === "ok" ? C.accent : k === "info" ? C.accent2 : k === "accent" ? C.accent : k === "muted" ? "#8b949e" : "#c9d1d9");

/** Contenu du terminal (frappe + sorties). */
export const TerminalBody: React.FC<{ f: number; highlight: number }> = ({ f, highlight }) => {
  const caretOn = Math.floor(f / 8) % 2 === 0;
  const lastIdx = TERM.length - 1;
  const typing = TERM.findIndex((c) => f >= c.start && f < c.end + 4);
  return (
    <div style={{ padding: "22px 26px", fontFamily: MONO, fontSize: 25, lineHeight: 1.62, color: "#c9d1d9", textShadow: `0 0 8px ${C.accent}33` }}>
      <div style={{ color: "#8b949e" }}>Last login: today on ttys001</div>
      {TERM.map((c, ci) => {
        if (f < c.start - 6) return null;
        const n = Math.round(interpolate(f, [c.start, c.end], [0, c.cmd.length], clamp));
        return (
          <div key={ci}>
            <div>
              <span style={{ color: C.accent }}>➜</span> <span style={{ color: C.accent2 }}>~/dev</span> <span style={{ color: "#e6edf3" }}>{c.cmd.slice(0, n)}</span>
              {(typing === ci || (typing === -1 && ci === lastIdx && f > c.outs[c.outs.length - 1].at + 4 && false)) && caretOn ? <span style={{ display: "inline-block", width: 14, height: 28, background: C.accent, verticalAlign: "middle", marginLeft: 2 }} /> : null}
            </div>
            {c.outs.map((o, oi) => {
              if (f < o.at) return null;
              if (o.kind === "progress") {
                const p = prog(f, o.at, o.at + 14, eOut);
                const cells = 22;
                const fill = Math.round(p * cells);
                return (
                  <div key={oi} style={{ color: "#8b949e" }}>
                    [<span style={{ color: C.accent }}>{"█".repeat(fill)}</span>
                    {"░".repeat(cells - fill)}] {Math.round(p * 100)}%
                  </div>
                );
              }
              if (o.kind === "spinner") {
                const doneSpin = f >= o.at + 8;
                return (
                  <div key={oi} style={{ color: doneSpin ? C.accent : "#c9d1d9" }}>
                    {doneSpin ? "✔" : SPIN[Math.floor(f / 2) % SPIN.length]} {o.text}
                    {doneSpin ? "" : "…"}
                  </div>
                );
              }
              const isLast = ci === lastIdx && oi === c.outs.length - 1;
              return (
                <div key={oi} style={{ color: lineColor(o.kind), fontWeight: o.kind === "accent" ? 800 : 400, background: isLast && highlight > 0 ? `rgba(61,255,168,${0.14 * highlight})` : undefined, boxShadow: isLast && highlight > 0 ? `0 0 ${30 * highlight}px rgba(61,255,168,${0.4 * highlight})` : undefined, borderRadius: 6, padding: isLast ? "0 6px" : undefined, marginLeft: isLast ? -6 : undefined }}>
                  {o.text}
                </div>
              );
            })}
          </div>
        );
      })}
      {f > TERM[lastIdx].outs[TERM[lastIdx].outs.length - 1].at + 2 ? (
        <div>
          <span style={{ color: C.accent }}>➜</span> <span style={{ color: C.accent2 }}>~/dev</span> {caretOn ? <span style={{ display: "inline-block", width: 14, height: 28, background: C.accent, verticalAlign: "middle" }} /> : null}
        </div>
      ) : null}
    </div>
  );
};
