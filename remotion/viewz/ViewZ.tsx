import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Avatar, Bubble, PinIcon, Pill, PlaneIcon, StoreBadge, TicketIcon } from "./Bits";
import { KText } from "./KText";
import { Phone, PW, PH, ScreenName, SH, SW } from "./Phone";
import { Sound } from "./Sound";
import { FONT, loadViewzFonts, V } from "./theme";
import { Heat, Thermal } from "./Thermal";
import { kickPulse, SC, SLAMS, T, W } from "./timing";
import { clamp, eBack, eExpo, eIn, eInOut, eOut, hash, lerp, prog } from "./util";

loadViewzFonts();

type Pose = { x: number; y: number; rx: number; ry: number; rz: number; s: number };
const POSES: { from: number; to: number; pose: Pose; ease?: (t: number) => number }[] = [
  { from: 0, to: 0, pose: { x: 540, y: 2700, rx: 45, ry: 0, rz: -6, s: 0.9 } },
  { from: T(W.lapp) - 2, to: T(W.lapp) + 14, pose: { x: 540, y: 1400, rx: 14, ry: -10, rz: -3, s: 0.9 }, ease: eBack },
  { from: T(SC.partner[0]) - 2, to: T(SC.partner[0]) + 12, pose: { x: 650, y: 1250, rx: 4, ry: -22, rz: 3, s: 0.86 } },
  { from: T(SC.map[0]) - 2, to: T(SC.map[0]) + 12, pose: { x: 430, y: 1250, rx: 4, ry: 20, rz: -3, s: 0.86 } },
  { from: T(SC.live[0]) - 2, to: T(SC.live[0]) + 12, pose: { x: 540, y: 1270, rx: 8, ry: -6, rz: 0, s: 0.86 } },
  { from: T(SC.connect[0]) - 2, to: T(SC.connect[0]) + 12, pose: { x: 620, y: 1250, rx: 4, ry: -20, rz: 2, s: 0.86 } },
  { from: T(10.18), to: T(10.45), pose: { x: 540, y: -900, rx: -40, ry: 0, rz: 10, s: 0.7 }, ease: eIn },
];

const phonePose = (f: number): Pose => {
  let cur = POSES[0].pose;
  for (let i = 1; i < POSES.length; i++) {
    const k = POSES[i];
    if (f < k.from) break;
    const t = interpolate(f, [k.from, k.to], [0, 1], { ...clamp, easing: k.ease ?? eInOut });
    cur = {
      x: lerp(cur.x, k.pose.x, t),
      y: lerp(cur.y, k.pose.y, t),
      rx: lerp(cur.rx, k.pose.rx, t),
      ry: lerp(cur.ry, k.pose.ry, t),
      rz: lerp(cur.rz, k.pose.rz, t),
      s: lerp(cur.s, k.pose.s, t),
    };
  }
  return cur;
};

const SCREENS: { at: number; name: ScreenName }[] = [
  { at: 0, name: "splash" },
  { at: T(SC.partner[0]), name: "recherches" },
  { at: T(SC.map[0]), name: "map" },
  { at: T(SC.live[0]), name: "live" },
  { at: T(SC.connect[0]), name: "messages" },
];

// Pins de la carte (coordonnées dans la capture 921x2000)
const PINS = [
  [424, 707], [524, 947], [840, 1035], [688, 1097], [444, 1266], [512, 1413], [84, 1306],
];
const MAP_SCALE = SH / 2000;
const MAP_DX = (SW - 921 * MAP_SCALE) / 2;

const TAGS = ["Krump", "Hip-Hop", "Afro", "House", "Dancehall", "Street Jazz"];
const TAG_POS = [
  [70, 830, -4], [130, 975, 3], [60, 1120, -2], [150, 1265, 4], [70, 1410, -3], [110, 1555, 2],
];

const LIVE_AV = [
  { name: "nelson", label: "Nelson Ari", style: "Hip-Hop", x: 190, y: 960 },
  { name: "oceane", label: "Océane S", style: "Afro", x: 890, y: 1110 },
  { name: "purple", label: "M. Purple", style: "Krump", x: 190, y: 1430 },
  { name: "lina", label: "Lina Morel", style: "House", x: 890, y: 1580 },
];

const NET = [
  { name: "oceane", x: 170, y: 380 },
  { name: "nelson", x: 910, y: 380 },
  { name: "purple", x: 170, y: 1170 },
  { name: "lina", x: 910, y: 1170 },
];

const inScene = (f: number, k: keyof typeof SC) => f >= T(SC[k][0]) - 2 && f < T(SC[k][1]) + 8;

/** Motion "ViewZ — La connexion entre danseurs" (1080x1920, 30 fps). */
export const ViewZ: React.FC = () => {
  const f = useCurrentFrame();
  const kick = kickPulse(f);

  // impacts : secousse + flash
  let shake = 0;
  let flash = 0;
  let slamHeat = 0;
  for (const s of SLAMS) {
    const d = f - s.f;
    if (d < 0) continue;
    shake += 26 * s.power * Math.exp(-d / 3);
    flash = Math.max(flash, (s.power >= 1 ? 0.85 : 0.22) * Math.exp(-d / 2.2));
    slamHeat += s.power * Math.exp(-d / 6);
  }
  const shx = shake * Math.sin(f * 2.9);
  const shy = shake * Math.cos(f * 2.1);

  // allumage "caméra thermique" au début (scintillement)
  const boot = f < T(W.danseurs) ? (hash(f) > 0.35 ? 0.55 + 0.35 * (f / T(W.danseurs)) : 0.25) : 1;
  const pose = phonePose(f);
  const logoT = T(W.viewz);
  const logoIn = prog(f, logoT, logoT + 8, eExpo);
  const heats: Heat[] = [];
  if (f > T(W.lapp) && f < logoT) heats.push({ x: pose.x, y: pose.y, r: 420, a: 0.35 });
  if (f >= logoT - 2) heats.push({ x: 540, y: lerp(880, 650, prog(f, T(W.la), T(W.la) + 14, eInOut)), r: 480, a: 0.25 + 0.9 * Math.exp(-(f - logoT) / 12) });
  if (inScene(f, "live")) LIVE_AV.forEach((a, i) => heats.push({ x: a.x, y: a.y, r: 200, a: 0.35 * prog(f, T(W.danse) + i * 3, T(W.danse) + i * 3 + 8) }));
  const intensity = boot * (0.92 + 0.12 * kick + 0.25 * Math.min(1, slamHeat));
  const vibrate = 7 + 9 * kick + 26 * Math.min(1, slamHeat);

  // écran courant du téléphone
  let si = 0;
  SCREENS.forEach((s, i) => {
    if (f >= s.at) si = i;
  });
  const swap = si === 0 ? 1 : prog(f, SCREENS[si].at, SCREENS[si].at + 9, eOut);

  // traits de vitesse aux transitions
  const cuts = [T(SC.partner[0]), T(SC.map[0]), T(SC.live[0]), T(SC.connect[0]), T(10.3)];
  const speed = Math.max(...cuts.map((c) => Math.max(0, 1 - Math.abs(f - c) / 5)));

  return (
    <AbsoluteFill style={{ backgroundColor: V.black, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shx}px, ${shy}px) scale(${1.03 + kick * 0.012})` }}>
        <Thermal intensity={intensity} heats={heats} vibrate={vibrate} />
        {/* voile sombre en haut pour la lisibilité du texte */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,0,8,0.72) 0%, rgba(4,0,8,0.35) 35%, rgba(4,0,8,0.1) 60%, rgba(4,0,8,0.45) 100%)" }} />
        {/* lignes de scan */}
        <AbsoluteFill
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 5px)",
            transform: `translateY(${(f * 2) % 5}px)`,
            opacity: 0.6,
          }}
        />

        {/* ---------- Scène 1 : intro ---------- */}
        {inScene(f, "intro") ? (
          <KText
            f={f}
            top={640}
            exitAt={T(SC.intro[1])}
            lines={[
              { anim: "rise", size: 96, tokens: [{ t: "Tu", at: W.tu }, { t: "cherches", at: W.cherches }] },
              { anim: "slam", size: 120, tokens: [{ t: "des", at: W.des, look: "outline" }] },
              { anim: "slam", size: 178, stretch: 74, tokens: [{ t: "danseurs ?", at: W.danseurs, look: "hot" }] },
            ]}
          />
        ) : null}

        {/* ---------- Scène 2 : l'app ---------- */}
        {inScene(f, "app") ? (
          <KText
            f={f}
            top={190}
            exitAt={T(SC.app[1]) - 3}
            lines={[
              { anim: "rise", size: 96, tokens: [{ t: "On", at: W.on }, { t: "a", at: W.a }, { t: "créé", at: W.cree }] },
              { anim: "slam", size: 230, tokens: [{ t: "l'app", at: W.lapp, look: "hot" }] },
              { anim: "rise", size: 96, tokens: [{ t: "pour", at: W.pour }, { t: "ça.", at: W.ca, look: "muted" }] },
            ]}
          />
        ) : null}

        {/* ---------- Scène 3 : partenaire ---------- */}
        {inScene(f, "partner") ? (
          <>
            <KText
              f={f}
              top={170}
              exitAt={T(SC.partner[1]) - 3}
              lines={[
                { anim: "rise", size: 92, tokens: [{ t: "Trouve", at: W.trouve }, { t: "un", at: W.un }] },
                { anim: "slam", size: 150, tokens: [{ t: "partenaire", at: W.partenaire, look: "hot" }] },
                {
                  anim: "rise",
                  size: 80,
                  tokens: [
                    { t: "dans", at: W.dans, look: "muted" },
                    { t: "ta", at: W.ta, look: "muted" },
                    { t: "ville", at: W.ville },
                  ],
                },
              ]}
            />
            {TAGS.map((tag, i) => {
              const st = T(W.partenaire) + 2 + i * 3;
              const p = prog(f, st, st + 12, eBack);
              const out = prog(f, T(SC.partner[1]) - 4, T(SC.partner[1]) + 3, eIn);
              const [tx, ty, rot] = TAG_POS[i];
              return (
                <div
                  key={tag}
                  style={{
                    position: "absolute",
                    left: lerp(pose.x - 100, tx, p),
                    top: lerp(pose.y - 40, ty, p),
                    opacity: Math.min(1, p * 2) * (1 - out),
                    transform: `scale(${lerp(0.3, 1, p)}) rotate(${rot + (1 - p) * 20}deg) translateX(${-out * 200}px)`,
                  }}
                >
                  <Pill text={tag} size={40} />
                </div>
              );
            })}
            {(() => {
              const p = prog(f, T(W.ville) - 2, T(W.ville) + 10, eBack);
              const out = prog(f, T(SC.partner[1]) - 4, T(SC.partner[1]) + 3, eIn);
              return (
                <div
                  style={{
                    position: "absolute",
                    top: 1730,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    opacity: Math.min(1, p * 2) * (1 - out),
                    transform: `scale(${lerp(1.8, 1, p)})`,
                  }}
                >
                  <Pill text="Paris 20e" hot size={54} icon={<PinIcon size={54} />} />
                </div>
              );
            })()}
          </>
        ) : null}

        {/* ---------- Scène 4 : carte ---------- */}
        {inScene(f, "map") ? (
          <>
            {/* ondes radar "autour de toi" */}
            {[0, 1, 2].map((k) => {
              const st = T(W.autour) + k * 7;
              const p = prog(f, st, st + 30, eOut);
              if (p <= 0 || p >= 1) return null;
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: pose.x - 700,
                    top: pose.y - 700,
                    width: 1400,
                    height: 1400,
                    borderRadius: "50%",
                    border: `${8 * (1 - p)}px solid rgba(230,120,255,${0.8 * (1 - p)})`,
                    boxShadow: `0 0 60px rgba(200,80,255,${0.6 * (1 - p)})`,
                    transform: `scale(${0.25 + p})`,
                  }}
                />
              );
            })}
            <KText
              f={f}
              top={150}
              exitAt={T(SC.map[1]) - 3}
              lines={[
                { anim: "rise", size: 90, tokens: [{ t: "Découvre", at: W.decouvre }] },
                { anim: "slam", size: 132, tokens: [{ t: "les", at: W.les, look: "outline" }, { t: "spots", at: W.spots, look: "hot" }] },
                { anim: "slam", size: 132, tokens: [{ t: "&", at: W.et, look: "outline" }, { t: "events", at: W.events, look: "hot" }] },
                {
                  anim: "rise",
                  size: 70,
                  tokens: [
                    { t: "autour", at: W.autour, look: "muted" },
                    { t: "de", at: W.de, look: "muted" },
                    { t: "toi", at: W.toi },
                  ],
                },
              ]}
            />
            {[
              { at: W.spots, text: "Spots", icon: <PinIcon size={46} />, y: 980 },
              { at: W.events, text: "Events", icon: <TicketIcon size={46} />, y: 1180 },
            ].map((c) => {
              const p = prog(f, T(c.at), T(c.at) + 11, eBack);
              const out = prog(f, T(SC.map[1]) - 4, T(SC.map[1]) + 3, eIn);
              return (
                <div
                  key={c.text}
                  style={{
                    position: "absolute",
                    left: lerp(pose.x, 720, p),
                    top: c.y,
                    opacity: Math.min(1, p * 2) * (1 - out),
                    transform: `scale(${lerp(0.3, 1, p)}) rotate(${(1 - p) * -15}deg)`,
                  }}
                >
                  <Pill text={c.text} hot icon={c.icon} size={46} />
                </div>
              );
            })}
          </>
        ) : null}

        {/* ---------- Scène 5 : live ---------- */}
        {inScene(f, "live") ? (
          <KText
            f={f}
            top={170}
            exitAt={T(SC.live[1]) - 3}
            lines={[
              { anim: "rise", size: 96, tokens: [{ t: "Vois", at: W.vois }, { t: "qui", at: W.qui }] },
              { anim: "slam", size: 220, tokens: [{ t: "danse", at: W.danse, look: "hot" }] },
              { anim: "rise", size: 96, tokens: [{ t: "maintenant", at: W.maintenant }] },
            ]}
          />
        ) : null}

        {/* ---------- Scène 6 : messages ---------- */}
        {inScene(f, "connect") ? (
          <KText
            f={f}
            top={190}
            exitAt={T(SC.connect[1]) - 4}
            lines={[
              { anim: "slam", size: 140, gap: 0, tokens: [{ t: "connecte-", at: W.connecte }, { t: "toi", at: W.toi2, look: "hot" }] },
              { anim: "slam", size: 132, tokens: [{ t: "directement", at: W.directement, look: "outline" }] },
            ]}
          />
        ) : null}

        {/* ---------- Téléphone ---------- */}
        {f >= T(W.lapp) - 4 && f < T(10.5) ? (
          <AbsoluteFill style={{ perspective: 2200 }}>
            <div
              style={{
                position: "absolute",
                left: pose.x - PW / 2,
                top: pose.y - PH / 2 + 10 * Math.sin(f / 18),
                transform: `rotateX(${pose.rx}deg) rotateY(${pose.ry + 2 * Math.sin(f / 25)}deg) rotateZ(${pose.rz}deg) scale(${pose.s})`,
                filter: speed > 0.3 ? `blur(${speed * 6}px)` : undefined,
              }}
            >
              <Phone
                screen={SCREENS[si].name}
                prev={si > 0 ? SCREENS[si - 1].name : undefined}
                swap={swap}
                zoom={SCREENS[si].name === "map" ? lerp(1, 1.12, prog(f, T(SC.map[0]), T(SC.map[1]), eInOut)) : SCREENS[si].name === "recherches" ? lerp(1, 1.06, prog(f, T(SC.partner[0]), T(SC.partner[1]), eInOut)) : 1}
                glare={pose.ry / 25}
                glow={kick * 0.5 + (f < T(W.lapp) + 12 ? 0.5 : 0)}
              >
                {SCREENS[si].name === "map"
                  ? PINS.map(([px, py], i) => {
                      const st = T(W.spots) + i * 2;
                      const p = ((f - st) % 24) / 24;
                      if (f < st) return null;
                      return (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            left: MAP_DX + px * MAP_SCALE - 60,
                            top: py * MAP_SCALE - 60,
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            border: `4px solid rgba(255,110,230,${1 - p})`,
                            boxShadow: `0 0 30px rgba(220,80,255,${1 - p})`,
                            transform: `scale(${0.3 + p * 1.2})`,
                          }}
                        />
                      );
                    })
                  : null}
              </Phone>
            </div>
          </AbsoluteFill>
        ) : null}

        {/* avatars "live" qui sortent du téléphone */}
        {inScene(f, "live")
          ? LIVE_AV.map((a, i) => {
              const st = T(W.danse) + i * 3;
              const p = prog(f, st, st + 12, eBack);
              const out = prog(f, T(SC.live[1]) - 4, T(SC.live[1]) + 3, eIn);
              const pulse = ((f - st) % 20) / 20;
              return (
                <div
                  key={a.name}
                  style={{
                    position: "absolute",
                    left: lerp(pose.x, a.x, p) - 95,
                    top: lerp(pose.y, a.y, p) - 95,
                    width: 190,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: Math.min(1, p * 2) * (1 - out),
                    transform: `scale(${lerp(0.2, 1, p) * (1 - out * 0.4)})`,
                  }}
                >
                  <Avatar name={a.name} size={170} live={f > st ? pulse : 0} />
                  <div style={{ marginTop: 14, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#fff", whiteSpace: "nowrap", textShadow: "0 2px 12px #000" }}>{a.label}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, color: V.lilac, whiteSpace: "nowrap" }}>{a.style}</div>
                </div>
              );
            })
          : null}
        {inScene(f, "live")
          ? (() => {
              const p = prog(f, T(W.maintenant) + 4, T(W.maintenant) + 12, eBack);
              const out = prog(f, T(SC.live[1]) - 3, T(SC.live[1]) + 3, eIn);
              const blink = 0.6 + 0.4 * Math.sin(f / 3);
              return (
                <div style={{ position: "absolute", top: 640, width: "100%", display: "flex", justifyContent: "center", opacity: p * (1 - out), transform: `scale(${lerp(1.6, 1, p)})` }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "10px 28px",
                      borderRadius: 999,
                      background: "rgba(255,40,140,0.18)",
                      border: "2px solid rgba(255,90,200,0.8)",
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: 38,
                      color: "#fff",
                      letterSpacing: 4,
                    }}
                  >
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#ff3da8", boxShadow: `0 0 ${20 * blink}px #ff3da8`, opacity: blink }} />
                    LIVE
                  </div>
                </div>
              );
            })()
          : null}

        {/* bulles de messages */}
        {inScene(f, "connect")
          ? [
              { at: W.connecte, avatar: "oceane", text: "Je suis intéressé !", side: "left" as const, x: 50, y: 760 },
              { at: W.toi2, avatar: "purple", text: "Salut !", side: "right" as const, x: 470, y: 1120 },
              { at: W.directement, avatar: "nelson", text: "Partenaire battle hip-hop ?", side: "left" as const, x: 50, y: 1500 },
            ].map((b) => {
              const p = prog(f, T(b.at), T(b.at) + 10, eBack);
              const out = prog(f, T(10.15), T(10.35), eIn);
              return (
                <div
                  key={b.text}
                  style={{
                    position: "absolute",
                    left: b.side === "left" ? b.x : undefined,
                    right: b.side === "right" ? 1080 - b.x - 560 : undefined,
                    top: b.y,
                    opacity: Math.min(1, p * 2) * (1 - out),
                    transform: `scale(${lerp(0.3, 1, p)}) translateY(${-out * 300}px)`,
                    transformOrigin: b.side === "left" ? "0% 100%" : "100% 100%",
                  }}
                >
                  <Bubble avatar={b.avatar} text={b.text} side={b.side} />
                </div>
              );
            })
          : null}
        {f >= T(W.directement) && f < T(W.directement) + 22
          ? (() => {
              const p = prog(f, T(W.directement), T(W.directement) + 20, eIn);
              const x = lerp(-150, 1250, p);
              const y = lerp(1750, 350, p);
              return (
                <>
                  <div
                    style={{
                      position: "absolute",
                      left: x - 600,
                      top: y + 60,
                      width: 600,
                      height: 6,
                      background: "linear-gradient(90deg, transparent, rgba(240,160,255,0.9))",
                      transform: "rotate(-45deg)",
                      transformOrigin: "100% 50%",
                      filter: "blur(2px)",
                    }}
                  />
                  <div style={{ position: "absolute", left: x - 70, top: y - 70, transform: "rotate(0deg)", filter: "drop-shadow(0 0 20px #d070ff)" }}>
                    <PlaneIcon size={140} />
                  </div>
                </>
              );
            })()
          : null}

        {/* ---------- Finale : logo + connexion + stores ---------- */}
        {f >= logoT - 1 ? <Finale f={f} logoIn={logoIn} kick={kick} /> : null}
      </AbsoluteFill>

      {/* traits de vitesse */}
      {speed > 0 ? (
        <AbsoluteFill style={{ opacity: speed }}>
          {Array.from({ length: 26 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: hash(i * 3.3 + Math.floor(f / 2)) * 1920,
                left: hash(i * 7.1 + f) * 400 - 200,
                width: 600 + hash(i * 1.9) * 900,
                height: 2 + hash(i * 5.5) * 5,
                background: "linear-gradient(90deg, transparent, rgba(240,200,255,0.8), transparent)",
              }}
            />
          ))}
        </AbsoluteFill>
      ) : null}
      {/* flash */}
      <AbsoluteFill style={{ backgroundColor: "#f6e8ff", opacity: flash, mixBlendMode: "screen" }} />
      {/* grain */}
      <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: "overlay" }}>
        <svg width="1080" height="1920">
          <filter id="vzgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#vzgrain)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
      <Sound />
    </AbsoluteFill>
  );
};

const Finale: React.FC<{ f: number; logoIn: number; kick: number }> = ({ f, logoIn, kick }) => {
  const logoT = T(W.viewz);
  const move = prog(f, T(W.la), T(W.la) + 14, eInOut);
  const since = f - logoT;
  const split = since >= 0 ? 22 * Math.exp(-since / 5) + 4 * kick : 0;
  const lw = 860 * lerp(1, 0.74, move);
  const lh = (lw * 439) / 1536;
  const cy = lerp(880, 640, move);
  const shock = prog(f, logoT, logoT + 22, eOut);
  const mask: React.CSSProperties = {
    WebkitMaskImage: `url(${staticFile("viewz/logo.png")})`,
    WebkitMaskSize: "100% 100%",
    maskImage: `url(${staticFile("viewz/logo.png")})`,
    maskSize: "100% 100%",
    position: "absolute",
    inset: 0,
  };
  return (
    <AbsoluteFill>
      {/* onde de choc */}
      {shock > 0 && shock < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 540 - 600,
            top: 880 - 600,
            width: 1200,
            height: 1200,
            borderRadius: "50%",
            border: `${14 * (1 - shock)}px solid rgba(255,200,255,${1 - shock})`,
            boxShadow: `0 0 80px rgba(200,80,255,${1 - shock})`,
            transform: `scale(${0.15 + shock * 1.3})`,
          }}
        />
      ) : null}

      {/* réseau de danseurs connectés */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {NET.map((n, i) => {
          const p = prog(f, T(W.connexion) + i * 3, T(W.connexion) + i * 3 + 14, eOut);
          if (p <= 0) return null;
          const x2 = lerp(540, n.x, p);
          const y2 = lerp(cy, n.y, p);
          const pulse = ((f - T(W.connexion) - i * 5) % 30) / 30;
          return (
            <g key={n.name}>
              <line x1={540} y1={cy} x2={x2} y2={y2} stroke="rgba(220,130,255,0.55)" strokeWidth={3} />
              <line x1={540} y1={cy} x2={x2} y2={y2} stroke="rgba(200,80,255,0.25)" strokeWidth={14} />
              <circle cx={lerp(x2, 540, pulse)} cy={lerp(y2, cy, pulse)} r={9} fill="#fff" style={{ filter: "drop-shadow(0 0 10px #e070ff)" }} />
            </g>
          );
        })}
        {[0, 1, 3, 2].map((a, k, arr) => {
          const b = arr[(k + 1) % arr.length];
          const p = prog(f, T(W.danseurs2), T(W.danseurs2) + 14, eOut);
          if (p <= 0) return null;
          const A = NET[a];
          const B = NET[b];
          return <line key={k} x1={A.x} y1={A.y} x2={lerp(A.x, B.x, p)} y2={lerp(A.y, B.y, p)} stroke="rgba(255,120,230,0.45)" strokeWidth={3} strokeDasharray="10 10" strokeDashoffset={-f * 2} />;
        })}
      </svg>
      {NET.map((n, i) => {
        const p = prog(f, T(W.connexion) + i * 3, T(W.connexion) + i * 3 + 14, eBack);
        if (p <= 0) return null;
        return (
          <div key={n.name} style={{ position: "absolute", left: lerp(540, n.x, p) - 80, top: lerp(cy, n.y, p) - 80, transform: `scale(${p})` }}>
            <Avatar name={n.name} size={160} ring={0.8 + kick} />
          </div>
        );
      })}

      {/* logo */}
      <div
        style={{
          position: "absolute",
          left: 540 - lw / 2,
          top: cy - lh / 2,
          width: lw,
          height: lh,
          opacity: logoIn,
          transform: `scale(${lerp(2.6, 1, logoIn) * (1 + kick * 0.02)})`,
          filter: logoIn < 1 ? `blur(${(1 - logoIn) * 20}px)` : "drop-shadow(0 0 30px rgba(200,90,255,0.9))",
        }}
      >
        {split > 0.5 ? (
          <>
            <div style={{ ...mask, background: "rgba(255,40,220,0.8)", transform: `translateX(${-split}px)`, mixBlendMode: "screen" }} />
            <div style={{ ...mask, background: "rgba(80,200,255,0.65)", transform: `translateX(${split}px)`, mixBlendMode: "screen" }} />
          </>
        ) : null}
        <Img src={staticFile("viewz/logo.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      </div>

      <KText
        f={f}
        top={830}
        lines={[
          { anim: "rise", size: 84, tokens: [{ t: "La", at: W.la, look: "muted" }, { t: "connexion", at: W.connexion }] },
          { anim: "slam", size: 112, tokens: [{ t: "entre", at: W.entre, look: "outline" }, { t: "danseurs", at: W.danseurs2, look: "hot" }] },
        ]}
      />
      <KText f={f} top={1330} lines={[{ anim: "rise", size: 60, tokens: [{ t: "Disponible", at: W.disponible, look: "muted" }, { t: "sur", at: W.sur, look: "muted" }] }]} />
      {[
        { kind: "apple" as const, at: W.app, x: 70 },
        { kind: "google" as const, at: W.google, x: 570 },
      ].map((b) => {
        const p = prog(f, T(b.at) - 2, T(b.at) + 10, eBack);
        return (
          <div
            key={b.kind}
            style={{
              position: "absolute",
              left: b.x,
              top: 1440,
              opacity: Math.min(1, p * 2),
              transform: `scale(${lerp(0.8, 1, p) * (0.98 + 0.02 * kick)}) translateY(${(1 - p) * 120}px)`,
              transformOrigin: "50% 50%",
            }}
          >
            <div style={{ transform: "scale(0.98)" }}>
              <StoreBadge kind={b.kind} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
