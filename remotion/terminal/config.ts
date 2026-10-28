// =====================================================================
//  "THE TERMINAL" — everything is customised here.
// =====================================================================

export type OutLine = { text: string; kind?: "ok" | "info" | "accent" | "progress" | "spinner" | "muted" };

export const CONFIG = {
  product: "ACME SDK",
  tagline: "Ship faster. Build anything.",
  installCmd: "npm i @acme/sdk",
  githubLabel: "Star on GitHub",
  githubStars: "12.4k",
  docsUrl: "docs.acme.dev",
  accent: "#3dffa8",
  accent2: "#4cc9ff",
  /**
   * Écran de résultat : mettez votre capture dans public/ (ex. "terminal/screen.png")
   * et indiquez son chemin ici. null = écran générique de démonstration.
   * Format conseillé : 1600x1000 (16:10).
   */
  screenImage: null as string | null,
  windowTitle: "localhost:3000",
  /** Commandes tapées dans le terminal et leurs sorties. */
  commands: [
    {
      cmd: "npm install @acme/sdk",
      out: [
        { text: "resolving dependencies", kind: "spinner" },
        { text: "", kind: "progress" },
        { text: "added 128 packages in 2.1s", kind: "muted" },
      ] as OutLine[],
    },
    {
      cmd: "npx acme init my-app",
      out: [
        { text: "✔ Created my-app", kind: "ok" },
        { text: "✔ Installed templates", kind: "ok" },
      ] as OutLine[],
    },
    {
      cmd: "npx acme dev",
      out: [
        { text: "▲ Acme dev server v4.2", kind: "info" },
        { text: "✔ Ready on http://localhost:3000", kind: "accent" },
      ] as OutLine[],
    },
  ],
  /** Titres (monospace) des différentes phases. */
  captions: {
    terminal: ["$ ONE COMMAND.", "THAT'S ALL."],
    showcase: ["FROM INSTALL", "TO LIVE", "IN SECONDS."],
    exploded: ["BUILT FOR", "DEVELOPERS."],
  },
};
