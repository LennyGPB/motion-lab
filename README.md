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
