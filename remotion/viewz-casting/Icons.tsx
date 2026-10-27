const st = { fill: "none", stroke: "#fff", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const FormatIcon: React.FC<{ name: "video" | "mic" | "clap"; size: number }> = ({ name, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...st} style={{ filter: "drop-shadow(0 0 14px rgba(220,120,255,0.9))", overflow: "visible" }}>
    {name === "video" ? (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="3" />
        <path d="M10 9.2v5.6l4.8-2.8z" fill="#fff" />
      </>
    ) : name === "mic" ? (
      <>
        <rect x="9" y="2.5" width="6" height="11" rx="3" />
        <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v4M8.5 21.5h7" />
      </>
    ) : (
      <>
        <rect x="3" y="9" width="18" height="12" rx="2" />
        <path d="M3 9l1.5-5 16.2 3.3-1 1.7M8 4.8l-1 4M13 5.8l-1 3.2M18 6.8l-.8 2.2" />
      </>
    )}
  </svg>
);

export const Check: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const Silhouette: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="silg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e3b8ff" />
        <stop offset="1" stopColor="#6a12d0" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="38" r="17" fill="url(#silg)" />
    <path d="M18 98c2-22 16-34 32-34s30 12 32 34z" fill="url(#silg)" />
  </svg>
);
