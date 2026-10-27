const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const P: Record<string, React.ReactNode> = {
  money: (
    <>
      <ellipse cx="12" cy="7" rx="7" ry="3" />
      <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
      <path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
    </>
  ),
  love: <path d="M12 20s-7.5-4.6-9.2-9.3A5 5 0 0 1 12 6.6a5 5 0 0 1 9.2 4.1C19.5 15.4 12 20 12 20z" />,
  career: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2.5" />
      <path d="M9 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5v2M3 13h18" />
    </>
  ),
  confidence: <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5L3 8z" />,
  body: (
    <>
      <circle cx="12" cy="4.5" r="2" />
      <path d="M5 9l7 1.5L19 9M12 10.5V15M12 15l-4 6M12 15l4 6" />
    </>
  ),
  creativity: <path d="M12 2.5l2 7.5 7.5 2-7.5 2-2 7.5-2-7.5-7.5-2 7.5-2z" />,
  lifestyle: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  spirituality: <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a6.6 6.6 0 0 0 9.5 9.5z" />,
  intention: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </>
  ),
  technique: (
    <>
      <path d="M12 3l9 4.5-9 4.5-9-4.5z" />
      <path d="M3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5" />
    </>
  ),
  day: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
};

export const Icon: React.FC<{ name: string; size?: number; color?: string; glow?: number }> = ({
  name,
  size = 72,
  color = "#f3eeff",
  glow = 0.6,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    style={{ color, filter: `drop-shadow(0 0 ${10 * glow}px rgba(190,160,255,${glow}))`, overflow: "visible" }}
    {...base}
  >
    {P[name]}
  </svg>
);
