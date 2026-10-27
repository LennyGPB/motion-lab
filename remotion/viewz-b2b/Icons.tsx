const P: Record<string, React.ReactNode> = {
  battle: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4" />,
  showcase: <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.3l6-.7z" />,
  cours: <path d="M3 4h18v11H3zM12 15v5M8 20h8M7 8h6M7 11h9" />,
  session: <path d="M9 18V6l11-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z" />,
  seats: <path d="M5 11V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5M3 11h18v5H3zM5 16v4M19 16v4" />,
  user: <path d="M15 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19 8v6M16 11h6" />,
  qr: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" />,
  eye: <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  lock: <path d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 14.5v2.5" />,
  plane: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />,
  check: <path d="M4 12.5l5 5L20 6.5" />,
  swap: <path d="M7 4v14M7 18l-3-3M7 18l3-3M17 20V6M17 6l-3 3M17 6l3 3" />,
};

export const PIcon: React.FC<{ name: string; size: number; color?: string; stroke?: number }> = ({ name, size, color = "#fff", stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {P[name]}
  </svg>
);

/** Pastille icône (carré arrondi dégradé). */
export const IconChip: React.FC<{ name: string; size?: number; hot?: boolean }> = ({ name, size = 84, hot = true }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: hot ? "linear-gradient(135deg, #c13cff, #6a12d0)" : "rgba(255,255,255,0.06)",
      border: hot ? "1.5px solid rgba(255,210,255,0.5)" : "1.5px solid rgba(210,170,255,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: hot ? "0 0 30px rgba(170,60,255,0.45)" : undefined,
      flexShrink: 0,
    }}
  >
    <PIcon name={name} size={size * 0.52} />
  </div>
);

/** QR code illustratif (motif déterministe avec repères). */
export const QR: React.FC<{ size: number; reveal: number }> = ({ size, reveal }) => {
  const N = 25;
  const cell = size / N;
  const finder = (x: number, y: number) => {
    const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    for (const [ox, oy] of [
      [0, 0],
      [N - 7, 0],
      [0, N - 7],
    ]) {
      if (inBox(ox, oy)) {
        const dx = x - ox;
        const dy = y - oy;
        return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0;
      }
      if (x >= ox - 1 && x <= ox + 7 && y >= oy - 1 && y <= oy + 7) return 0;
    }
    return -1;
  };
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let v = finder(x, y);
      if (v === -1) {
        const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        v = h - Math.floor(h) > 0.52 ? 1 : 0;
      }
      if (!v) continue;
      const order = (x + y) / (2 * N);
      if (order > reveal) continue;
      rects.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell + 0.4} height={cell + 0.4} fill="#120020" />);
    }
  }
  return (
    <svg width={size} height={size}>
      {rects}
    </svg>
  );
};
