import { SANS, SERIF } from "../signspath/theme";
import { CONFIG, PageKind } from "./config";

const C = CONFIG;
export const PW = 900;
const GRAD = `linear-gradient(135deg, ${C.accent}, ${C.accent2})`;
const bar = (w: number | string, h = 14, c = "#e7e5ef"): React.CSSProperties => ({ width: w, height: h, borderRadius: h / 2, background: c });
const ink = "#17142b";

const Nav = () => (
  <div style={{ height: 76, display: "flex", alignItems: "center", padding: "0 40px", borderBottom: "1px solid #eeecf5" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 24, color: ink }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: GRAD }} />
      {C.brand}
    </div>
    <div style={{ marginLeft: "auto", display: "flex", gap: 28, fontSize: 17, fontWeight: 600, color: "#6b6785" }}>
      <span>Product</span>
      <span>Pricing</span>
      <span>Blog</span>
    </div>
    <div style={{ marginLeft: 28, padding: "10px 18px", borderRadius: 10, background: ink, color: "#fff", fontSize: 16, fontWeight: 700 }}>Get started</div>
  </div>
);
const Footer = () => (
  <div style={{ background: ink, padding: "60px 40px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 30 }}>
    <div style={{ color: "#fff", fontWeight: 800, fontSize: 24 }}>{C.brand}</div>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} style={bar(`${60 + ((k * 13 + i * 7) % 30)}%`, 10, "rgba(255,255,255,0.18)")} />
        ))}
      </div>
    ))}
  </div>
);

const Home = () => (
  <>
    <Nav />
    <div style={{ padding: "70px 40px 40px", textAlign: "center" }}>
      <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, background: "#fff1ec", color: C.accent, fontSize: 15, fontWeight: 800 }}>NEW · v2 is here</div>
      <div style={{ fontSize: 66, fontWeight: 800, color: ink, lineHeight: 1.05, letterSpacing: -2, marginTop: 20 }}>
        Grow faster with
        <br />
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, background: GRAD, WebkitBackgroundClip: "text", color: "transparent", paddingRight: 8 }}>beautiful</span> tools.
      </div>
      <div style={{ fontSize: 20, color: "#6b6785", marginTop: 18 }}>Everything your team needs, in one place.</div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 30 }}>
        <div style={{ padding: "16px 28px", borderRadius: 12, background: GRAD, color: "#fff", fontWeight: 800, fontSize: 18 }}>Start for free</div>
        <div style={{ padding: "16px 28px", borderRadius: 12, border: "2px solid #e1def0", color: ink, fontWeight: 700, fontSize: 18 }}>Book a demo</div>
      </div>
    </div>
    <div style={{ margin: "10px 40px", height: 420, borderRadius: 24, background: GRAD, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 50, bottom: -20, borderRadius: 18, background: "#fff", padding: 24, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={bar(i ? "80%" : "60%", 14, i ? "#eeecf5" : "#d8d4ea")} />
          ))}
        </div>
        <div style={{ borderRadius: 14, background: "#f6f5fb" }} />
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-around", padding: "40px", opacity: 0.6 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={bar(110, 26, "#dddae9")} />
      ))}
    </div>
    <div style={{ padding: "30px 40px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
      {["Fast", "Secure", "Collaborative"].map((t, i) => (
        <div key={t} style={{ padding: 26, borderRadius: 20, border: "1px solid #eeecf5", background: "#fff" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: i === 1 ? C.accent2 : C.accent, opacity: 0.9 }} />
          <div style={{ fontSize: 24, fontWeight: 800, color: ink, marginTop: 16 }}>{t}</div>
          <div style={{ ...bar("90%", 10), marginTop: 12 }} />
          <div style={{ ...bar("70%", 10), marginTop: 8 }} />
        </div>
      ))}
    </div>
    <div style={{ margin: "40px", padding: 40, borderRadius: 24, background: "#f6f5fb", display: "flex", gap: 30, alignItems: "center" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: ink }}>Loved by 10,000+ teams</div>
        <div style={{ ...bar("80%", 12), marginTop: 16 }} />
        <div style={{ ...bar("60%", 12), marginTop: 10 }} />
      </div>
      <div style={{ width: 260, height: 180, borderRadius: 18, background: GRAD, opacity: 0.85 }} />
    </div>
    <div style={{ margin: "40px", padding: "50px", borderRadius: 24, background: GRAD, textAlign: "center", color: "#fff" }}>
      <div style={{ fontSize: 40, fontWeight: 800 }}>Ready to start?</div>
      <div style={{ display: "inline-block", marginTop: 20, padding: "14px 26px", borderRadius: 12, background: "#fff", color: ink, fontWeight: 800, fontSize: 18 }}>Create an account</div>
    </div>
    <Footer />
  </>
);

const Pricing = () => (
  <>
    <Nav />
    <div style={{ padding: "70px 40px 30px", textAlign: "center" }}>
      <div style={{ fontSize: 60, fontWeight: 800, color: ink, letterSpacing: -2 }}>Simple pricing</div>
      <div style={{ fontSize: 20, color: "#6b6785", marginTop: 12 }}>Start free. Upgrade when you're ready.</div>
      <div style={{ display: "inline-flex", marginTop: 26, padding: 6, borderRadius: 12, background: "#f1effa", gap: 6 }}>
        <div style={{ padding: "10px 20px", borderRadius: 9, background: "#fff", fontWeight: 800, color: ink }}>Monthly</div>
        <div style={{ padding: "10px 20px", fontWeight: 700, color: "#6b6785" }}>Yearly −20%</div>
      </div>
    </div>
    <div style={{ padding: "20px 40px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
      {[
        { n: "Starter", p: "$0" },
        { n: "Pro", p: "$29", hot: true },
        { n: "Team", p: "$79" },
      ].map((pl) => (
        <div key={pl.n} style={{ padding: 28, borderRadius: 22, background: pl.hot ? ink : "#fff", border: pl.hot ? "none" : "1px solid #eeecf5", color: pl.hot ? "#fff" : ink, transform: pl.hot ? "translateY(-14px)" : undefined, boxShadow: pl.hot ? "0 30px 60px rgba(23,20,43,0.3)" : undefined }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{pl.n}</div>
          <div style={{ fontSize: 54, fontWeight: 800, marginTop: 12 }}>
            {pl.p}
            <span style={{ fontSize: 18, opacity: 0.6 }}>/mo</span>
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: pl.hot ? C.accent : "#e9e6f5" }} />
              <div style={bar("70%", 10, pl.hot ? "rgba(255,255,255,0.25)" : "#eeecf5")} />
            </div>
          ))}
          <div style={{ marginTop: 26, padding: "14px", borderRadius: 12, textAlign: "center", fontWeight: 800, background: pl.hot ? GRAD : "#f1effa", color: pl.hot ? "#fff" : ink }}>Choose {pl.n}</div>
        </div>
      ))}
    </div>
    <div style={{ padding: "50px 40px 20px" }}>
      <div style={{ fontSize: 34, fontWeight: 800, color: ink }}>Compare plans</div>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "18px 0", borderBottom: "1px solid #eeecf5", alignItems: "center" }}>
          <div style={bar(`${50 + (i * 11) % 30}%`, 12)} />
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ width: 22, height: 22, borderRadius: "50%", background: k >= (i % 3) ? C.accent : "#eeecf5", opacity: 0.85, justifySelf: "center" }} />
          ))}
        </div>
      ))}
    </div>
    <div style={{ padding: "40px" }}>
      <div style={{ fontSize: 34, fontWeight: 800, color: ink }}>FAQ</div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ marginTop: 16, padding: 22, borderRadius: 16, border: "1px solid #eeecf5", display: "flex", justifyContent: "space-between" }}>
          <div style={bar(`${55 + i * 8}%`, 14, "#dddae9")} />
          <span style={{ color: C.accent, fontWeight: 800 }}>+</span>
        </div>
      ))}
    </div>
    <Footer />
  </>
);

const Blog = () => (
  <>
    <Nav />
    <div style={{ padding: "60px 40px 20px" }}>
      <div style={{ fontSize: 56, fontWeight: 800, color: ink, letterSpacing: -2 }}>
        The <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>journal</span>
      </div>
    </div>
    <div style={{ margin: "10px 40px", borderRadius: 24, overflow: "hidden", border: "1px solid #eeecf5" }}>
      <div style={{ height: 340, background: `linear-gradient(135deg, ${C.accent2}, ${C.accent})` }} />
      <div style={{ padding: 28 }}>
        <div style={{ color: C.accent, fontWeight: 800, fontSize: 15 }}>FEATURED · 6 MIN READ</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: ink, marginTop: 10 }}>How we grew 3x in one year</div>
        <div style={{ ...bar("90%", 12), marginTop: 16 }} />
        <div style={{ ...bar("70%", 12), marginTop: 10 }} />
      </div>
    </div>
    <div style={{ padding: "30px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #eeecf5" }}>
          <div style={{ height: 170, background: `hsl(${(i * 50 + 10) % 360}, 70%, ${70 - (i % 3) * 6}%)` }} />
          <div style={{ padding: 20 }}>
            <div style={bar("40%", 10, "#ffd9cc")} />
            <div style={{ ...bar("85%", 16, "#dddae9"), marginTop: 14 }} />
            <div style={{ ...bar("60%", 16, "#dddae9"), marginTop: 8 }} />
          </div>
        </div>
      ))}
    </div>
    <div style={{ margin: "30px 40px", padding: 40, borderRadius: 24, background: "#f6f5fb", textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 800, color: ink }}>Get the newsletter</div>
      <div style={{ display: "inline-flex", marginTop: 20, gap: 10 }}>
        <div style={{ width: 320, height: 54, borderRadius: 12, background: "#fff", border: "1px solid #e1def0" }} />
        <div style={{ padding: "16px 24px", borderRadius: 12, background: GRAD, color: "#fff", fontWeight: 800 }}>Subscribe</div>
      </div>
    </div>
    <Footer />
  </>
);

/** Page générique pleine hauteur (statique). */
export const GenericPage: React.FC<{ kind: PageKind }> = ({ kind }) => (
  <div style={{ width: PW, background: "#fff", fontFamily: SANS }}>{kind === "home" ? <Home /> : kind === "pricing" ? <Pricing /> : <Blog />}</div>
);
