This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Motion design (Remotion)

- `npm run remotion:studio` — ouvre le Studio Remotion pour prévisualiser.
- `npm run render` — rend la composition `Intro` (1080x1920, 30 fps, 6 s) dans `out/intro.mp4`.

Sources dans `remotion/`. Si le téléchargement du Chrome Headless de Remotion est bloqué, pointer vers un Chromium local :
`REMOTION_BROWSER_EXECUTABLE=/chemin/vers/chrome npm run render`.

### Motion « SignsPath — One at a time »

Composition `SignsPath` (1080x1920, 30 fps, 29 s), sources dans `remotion/signspath/`.

- `npm run render:signspath` — rend `out/signspath.mp4` (vidéo + audio).
- `npm run sfx:signspath` — régénère les effets sonores synthétisés (`public/signspath/sfx/`).
- Le timing des mots est dans `remotion/signspath/timing.ts` (alignement forcé de la voix avec PocketSphinx).
- `public/signspath/voice.mp3` est la voix fournie, normalisée à -16 LUFS.
- Polices : Manrope + Instrument Serif (Google Fonts, embarquées dans `public/signspath/fonts/`).

### Motion « ViewZ — La connexion entre danseurs »

Composition `ViewZ` (1080x1920, 30 fps, 17,5 s), sources dans `remotion/viewz/`.

- `npm run render:viewz` — rend `out/viewz.mp4`.
- `npm run sfx:viewz` — régénère la prod hip-hop et les effets (`public/viewz/sfx/`).
- Captures de l'app : `public/viewz/screens/`, avatars : `public/viewz/avatars/`.
- Logo `public/viewz/logo.png` reconstruit depuis une capture d'écran : à remplacer par le logo vectoriel/HD si disponible.
- Timing des mots : `remotion/viewz/timing.ts`.

### Motion « ViewZ — Casting danseur·se »

Composition `ViewZCasting` (1080x1920, 30 fps, 22,3 s), sources dans `remotion/viewz-casting/` (réutilise les briques de `remotion/viewz/`).

- `npm run render:viewz-casting` — rend `out/viewz-casting.mp4`.
- Voix : `public/viewz/voice_casting.mp3` ; prod : `public/viewz/sfx/music_casting.wav` (générée par `npm run sfx:viewz`).
- Timing des mots : `remotion/viewz-casting/timing.ts`.

### Motion « ViewZ — Partenariats organisateurs » (version pro / B2B)

Composition `ViewZPartenaires` (1080x1920, 30 fps, 32 s), sources dans `remotion/viewz-b2b/` (réutilise le fond thermique et les polices de `remotion/viewz/`).

- `npm run render:viewz-partenaires` — rend `out/viewz-partenaires.mp4`.
- `npm run sfx:viewz-b2b` — régénère la musique et les sons `b2b_*` (`public/viewz/sfx/`).
- Voix : `public/viewz/voice_b2b.mp3` ; timing : `remotion/viewz-b2b/timing.ts`.
- Les chiffres et le nom d'événement du tableau de bord (« Open Battle », 148/200) sont illustratifs (marqués « Aperçu »).

### Pub « Stride » (app de running, sans voix)

Composition `Stride` (1080x1920, 30 fps, 17,5 s), sources dans `remotion/stride/`. Tout est calé sur une grille à 128 BPM (`remotion/stride/timing.ts`).

- `npm run render:stride` — rend `out/stride.mp4`.
- `npm run sfx:stride` — régénère musique et effets (`public/stride/sfx/`).
- Scène stat réutilisable : `StatScene` dans `remotion/stride/parts.tsx` (valeur, format, unité, libellé, inversion des couleurs).
- Faux écrans de l'app : `remotion/stride/screens.tsx` (`RunScreen`, `SummaryScreen`).

### Pub « Nova » (néobanque premium, 9:16 + 16:9)

Compositions `NovaVertical` (1080x1920) et `NovaWide` (1920x1080) — même composant, mise en page adaptative (`remotion/nova/layout.ts`). 22 s : partie lente jusqu'au drop (9 s), partie rythmée, fin posée.

- `npm run render:nova` — rend `out/nova-9x16.mp4` et `out/nova-16x9.mp4`.
- `npm run sfx:nova` — régénère musique et effets (`public/nova/sfx/`).
- Briques réutilisables (`remotion/nova/parts.tsx`) :
  - `NovaCard` : carte bancaire 3D (recto/verso, épaisseur, reflet holographique) ;
  - `NotifStack` : notifications de paiement qui tombent et s'empilent (données dans `NOTIFS`) ;
  - `GrowthChart` : courbe qui se dessine ;
  - `NovaPhone` : téléphone à écran remplaçable (`screens={[{ from, node }]}`, transition auto) ;
  - `FeatureScene` : scène fonctionnalité répétable (liste `FEATURES` dans `Nova.tsx`, visuel optionnel).
- Écrans de l'app : `remotion/nova/screens.tsx` (`HomeScreen`, `CardsScreen`).

### Pub « Atlas » (app de voyage, 9:16 + 16:9)

Compositions `AtlasVertical` (1080x1920) et `AtlasWide` (1920x1080), 24 s, ambiance cinématique en lumière chaude (ciel qui passe de l'aube au crépuscule, bandes cinéma, halos, poussière, reflet d'objectif, grain).

- `npm run render:atlas` — rend `out/atlas-9x16.mp4` et `out/atlas-16x9.mp4`.
- `npm run sfx:atlas` — régénère musique et effets (`public/atlas/sfx/`).
- Briques (`remotion/atlas/parts.tsx`) : `FlightMap` (arc d'avion entre deux villes sur un monde en points), `DestCard` (carte destination répétable : ville, pays, prix, température, paysage illustré `lisbon` / `marrakech` / `kyoto`), `BookingScreen` (faux écran de réservation), `Ticket` (carte d'embarquement), `Wordmark`.
- Destinations : liste `DESTS` dans `remotion/atlas/Atlas.tsx`. Le téléphone réutilise `NovaPhone` (écran remplaçable).
