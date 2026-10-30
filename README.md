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

### Motion « SignsPath — Ritual » (2e vidéo SignsPath)

Composition `SignsPathRitual` (1080x1920, 30 fps, 21,5 s), sources dans `remotion/signspath2/` (réutilise fond, typo, cartes et finale de `remotion/signspath/`).

- `npm run render:signspath-ritual` — rend `out/signspath-ritual.mp4`.
- Voix : `public/signspath/voice2.mp3` (normalisée), timing mot à mot (PocketSphinx) dans `remotion/signspath2/timing.ts`.
- `SceneFinale` (sphère + CTA signspath.com) accepte maintenant un `timing` pour être réutilisée ; sans paramètre, le rendu de la 1re vidéo est inchangé.

### Template « Lancement » (annonce d'app, 9:16 + 16:9)

Compositions `LaunchVertical` (1080x1920) et `LaunchWide` (1920x1080), 16 s à 120 BPM : compte à rebours 3-2-1 sur le beat → logo avec flash → téléphones en rafale → les 3 téléphones ensemble → bandeau date de sortie → fin avec stores.

- **Tout se personnalise dans `remotion/launch/config.ts`** : nom, glyphe de l'icône, slogan, couleurs, fonctionnalités (une entrée = un téléphone dans la rafale, avec son écran `feed` / `stats` / `chat`), phrase du plan à 3 téléphones, date de sortie, CTA, stores.
- Faux écrans : `remotion/launch/screens.tsx` (`MockScreen`), aux couleurs de la config.
- `npm run render:launch` — rend `out/launch-9x16.mp4` et `out/launch-16x9.mp4`.
- `npm run sfx:launch` — régénère musique et effets (`public/launch/sfx/`). La musique dure 16 s pour 3 fonctionnalités : si vous en ajoutez, ajustez `DUR` / `END` dans `scripts/generate_sfx_launch.py` (1 fonctionnalité = 3 temps = 1,5 s).

### Template « Problème → Solution » (vertical)

Composition `ProblemSolution` (1080x1920, 19 s) : partie problème en noir et blanc (texte qui tremble, notifications qui s'empilent, horloge qui s'emballe, son tendu) → un point de couleur → la couleur envahit l'écran (tache au bord organique) → révélation de l'app dans un téléphone → bénéfices (répétables, l'écran du téléphone change à chacun) → fin avec CTA et stores.

- **Tout se personnalise dans `remotion/probsol/config.ts`** : nom, glyphe, slogan, couleurs, lignes du problème, notifications, phrase de bascule, bénéfices (icône `grid` / `target` / `bolt` / `check` / `heart`, titre, sous-titre, écran), CTA, stores.
- Faux écrans : `remotion/probsol/screens.tsx` (`home`, `focus`, `done`) — ajoutez un type pour un nouvel écran.
- `npm run render:probsol` — rend `out/probleme-solution.mp4` ; `npm run sfx:probsol` — régénère le son. La musique est calée sur 3 bénéfices (`END` = 15 s dans le script).

### Template « Social proof » (vertical, textes en anglais)

Composition `SocialProof` (1080x1920, 18 s, 120 BPM) : accroche → chiffres clés en compteurs géants 3D (répétable) → avis clients en cartes empilées en 3D avec étoiles qui se remplissent (répétable) → mur d'avis qui défile → logo, note et stores.

- **Tout se personnalise dans `remotion/proof/config.ts`** : nom, glyphe, slogan, couleurs, accroche, `stats` (valeur, décimales, préfixe/suffixe, libellé, étoiles), `reviews` (nombre d'étoiles, citation, prénom, mention), phrases du mur, badge de note, stores.
- `npm run render:proof` — rend `out/social-proof.mp4` ; `npm run sfx:proof` — régénère le son (calé sur 3 chiffres + 3 avis, `END` = 14 s dans le script).
- `StoreBtn` (badges stores) accepte maintenant `lang="en"`.

### Motion « The site that builds itself » (mockup PC, vertical, anglais)

Composition `WebBuild` (1080x1920, 17 s). En haut, une fenêtre de navigateur en 3D où la page se construit bloc par bloc (nav, titre, sous-titre, boutons, image, fonctionnalités, logos) avec un cadre de sélection façon devtools ; en bas, un éditeur de code qui tape le HTML en direct (chaque bloc apparaît quand sa ligne est finie). Le curseur clique ensuite sur « Get started » (succès + confettis), la caméra se recentre sur le site, puis carte de fin agence/studio.

- **Tout se personnalise dans `remotion/webbuild/config.ts`** : studio, URL, slogan, CTA, couleurs, contenu du site de démo (marque, liens, titre, sous-titre, boutons, fonctionnalités), titres des 3 phases.
- Le code affiché est généré depuis ces textes (`remotion/webbuild/timing.ts`, liste `CODE`) ; le planning de frappe et d'apparition des blocs est calculé automatiquement.
- `npm run render:webbuild` — rend `out/web-build.mp4` ; `npm run sfx:webbuild` — régénère le son.

### Motion « Product demo with cursor » (mockup PC / SaaS, vertical, anglais)

Composition `ProductDemo` (1080x1920, 16 s). Fausse démo filmée d'un tableau de bord SaaS dans une fenêtre d'app : le curseur se déplace en courbe et clique, la caméra zoome en douceur sur la zone importante à chaque étape (avec léger flou de mouvement), et une bulle d'explication pointe sur l'élément. Barre de progression des étapes en haut, carte de fin produit.

- **Tout se personnalise dans `remotion/demo/config.ts`** : produit, slogan, CTA, URL, couleurs, fond d'écran, accroche et phrase de fin, et surtout `steps` (répétable) : pour chaque étape, les zooms (`at` + zone à cadrer), les clics (`at` + point), la bulle (`at`, point d'ancrage, titre, texte) et l'effet (`range`, `point`, `export` ou `none`).
- Géométrie de l'app de démo : `remotion/demo/geometry.ts` ; écran : `remotion/demo/Dashboard.tsx`.
- `npm run render:demo` — rend `out/product-demo.mp4` ; `npm run sfx:demo` — régénère le son.

### Motion « The terminal » (outils dev / API / open source, vertical, anglais)

Composition `Terminal` (1080x1920, 19 s). Boot CRT → terminal en 3D qui tape les commandes (installation avec barre de progression, init, dev) → « Ready on localhost » s'illumine → warp (hyperespace + flash) → la fenêtre résultat jaillit → vitrine 3D (orbite, reflet au sol, balayages de lumière, symboles de code qui flottent) → vue éclatée isométrique (terminal + app en couches) → fin (logo, commande d'installation, bouton GitHub, docs).

- **Écran résultat remplaçable** : mettez votre capture dans `public/` (ex. `public/terminal/screen.png`, format 16:10 conseillé) et indiquez `screenImage: "terminal/screen.png"` dans `remotion/terminal/config.ts`. Le contenu de cette fenêtre n'est jamais animé : toutes les animations portent sur la fenêtre entière.
- Dans la même config : produit, slogan, commande d'installation, GitHub, URL docs, couleurs, titre de la fenêtre, commandes + sorties du terminal (`spinner`, `progress`, `ok`, `info`, `accent`, `muted`), titres des 3 phases.
- `npm run render:terminal` — rend `out/terminal.mp4` ; `npm run sfx:terminal` — régénère le son.

### Motion « Works everywhere » (multi-plateformes, vertical, anglais)

Composition `Platforms` (1080x1920, 20 s). Le laptop arrive en 3D et s'ouvre, l'écran s'allume → la tablette entre en se retournant (dos alu → écran) → le téléphone tombe avec un rebond → les trois se placent en famille, reliés par des arcs de synchronisation, « WORKS EVERYWHERE. » + badges des plateformes → emboîtement (le téléphone dans la tablette, la tablette dans l'écran du laptop) → fin (logo, slogan, CTA, stores).

- **Écrans remplaçables** (contenu jamais animé) : `screens.desktop` (16:10), `screens.tablet` (3:4), `screens.phone` (~9:19.5) dans `remotion/platforms/config.ts`, images à placer dans `public/`. `null` = écran générique.
- Dans la même config : produit, glyphe, slogan, CTA, couleurs, titres de chaque phase, étiquettes des appareils, plateformes, stores.
- `npm run render:platforms` — rend `out/platforms.mp4` ; `npm run sfx:platforms` — régénère le son.

### Motion « Browser tour » (navigateur en perspective, vertical, anglais)

Composition `BrowserTour` (1080x1920, 20 s). Les fenêtres de navigateur arrivent du fond en 3D → carrousel en perspective : chaque page passe au premier plan à son tour (les autres reculent, pivotent et se floutent), sa capture défile verticalement, avec son numéro, son titre et son sous-titre à côté, plus l'URL en bas → vue d'ensemble en cascade isométrique « EVERY PAGE. POLISHED. » → fin (logo, slogan, CTA).

- **Captures remplaçables** : `pages[].image` dans `remotion/browsertour/config.ts`, images à placer dans `public/` (ex. `public/browsertour/home.png`). Mettez une capture **pleine page**, 900 px de large ou plus ; elle défile automatiquement de haut en bas et son contenu n'est jamais animé. `null` = page générique.
- La liste `pages` est répétable (titre, sous-titre, chemin d'URL, image) : la durée et les sons s'adaptent au nombre de pages.
- Dans la même config : marque, domaine, slogan, CTA, couleurs, textes d'intro et de vue d'ensemble.
- `npm run render:browsertour` — rend `out/browser-tour.mp4` ; `npm run sfx:browsertour` — régénère le son.

### Motion « Kinetik challenge — Day 2 » (vertical, anglais, voix)

Composition `KinetikDay2` (1080x1920, 8 s), dans le style du Day 1 : sol en grille néon cyan, halo central, grain, glitchs et aberration chromatique. Sous-titres mot à mot calés sur la voix (alignement PocketSphinx, `remotion/kinetik2/timing.ts`). Déroulé :
1. « KINETIK CHALLENGE », DAY 2 avec flash.
2. « I'm creating a MOTION GRAPHIC » : un écran 3D sort de la grille en fil de fer.
3. « for a fictional WEBSITE » : un scan génère le site fictif « Halo » (GENERATING 0 → 100 %).
4. « with Kinetik » : logo violet.
5. « in literally 5 SECONDS » : anneau chrono.
6. Le site final en 3D avec des chevrons.

- Voix : `public/kinetik2/voice.wav` (normalisée). Pour une autre voix, remplace le fichier et recale les temps dans `timing.ts`.
- `npm run render:kinetik2` rend `out/kinetik-day2.mp4` ; `npm run sfx:kinetik2` régénère la musique et les effets.

### Motion SignsPath #3 « 21 days » (vertical, anglais, voix)

Composition `SignsPath21Days` (1080x1920, 24,4 s), dans le style SignsPath.
1. « Do this for 21 days. No more, no less. » : un anneau de 21 jours s'allume avec un compteur, un 22e point se dissout, puis l'anneau se verrouille.
2. « Not "when I have time." Not "until it works." » : une frise de jours sans fin se perd dans le flou, puis ∞ apparaît.
3. « A clear duration is a goal you can reach. » : un chemin Day 1 → Day 21, l'arrivée est validée.
4. « A vague one is a quiet way to quit. » : chemin en pointillés, brouillard, le point s'éteint.
5. « Pick your intention. Mark your calendar. And start today. » : pastille intention, calendrier de 3 semaines entouré, « Day 1 · Today ».
6. Finale « Manifest with method » + signspath.com (scène commune).

- Voix : `public/signspath/voice3.mp3` (normalisée). Timing : `remotion/signspath3/timing.ts`.
- `npm run render:signspath-21days` rend `out/signspath-21days.mp4`.

### Motion SignsPath #4 « An ordinary Tuesday » (vertical, anglais, voix)

Composition `SignsPathTuesday` (1080x1920, 25,4 s), dans le style SignsPath.
1. « Imagine an ordinary Tuesday… » : la semaine en cartes de verre, le mardi se soulève et s'illumine.
2. « You wake up. Light fills the room. » : une fenêtre en arche, lever de soleil, rayons de lumière chaude.
3. « You know exactly what you're doing with your day. » : le planning du mardi se coche ligne par ligne.
4. « No stress. No doubt. » : un gribouillis emmêlé se dénoue en ligne calme, les « ? » s'évaporent.
5. « Just your life, the way you chose it. » : orbe lumineux entouré d'un cercle qui se referme.
6. « Write that day. In detail. In the present tense. » : un journal s'écrit mot à mot, les verbes au présent sont surlignés.
7. Finale « Manifest with method » + signspath.com.

- Voix : `public/signspath/voice4.mp3` (normalisée). Timing : `remotion/signspath4/timing.ts`.
- `npm run render:signspath-tuesday` rend `out/signspath-tuesday.mp4`.

### Motion SignsPath #5 « 5 minutes, eyes closed » (vertical, anglais, voix)

Composition `SignsPathEyesClosed` (1080x1920, 24 s), dans le style SignsPath.
1. « 5 minutes. Eyes closed. That's all. » : cadran 5:00 qui se trace, l'œil se ferme (cils), la scène s'assombrit.
2. « Pick a single scene. A precise one, already real. » : un nuage de scènes floues, une seule est choisie, le viseur se resserre, la scène prend ses couleurs (« ✓ already real »).
3. « What do you see / hear / feel… » : la scène, avec scintillements, ondes sonores puis chaleur qui respire ; trois pictos see · hear · feel s'allument.
4. « Stay there a few seconds before opening your eyes. » : orbe qui respire, trois points de secondes, l'œil s'ouvre dans un halo.
5. Finale « Manifest with method » + signspath.com.

- Voix : `public/signspath/voice5.mp3` (normalisée). Timing : `remotion/signspath5/timing.ts`.
- `npm run render:signspath-eyes` rend `out/signspath-eyes-closed.mp4`.

### Motion SignsPath #6 « In a year » (vertical, anglais, voix)

Composition `SignsPathOneYear` (1080x1920, 22,3 s), dans le style SignsPath.
1. « In a year, you'll be glad you started today. » : frise de 12 mois de « today » à « in a year », le point la traverse, l'arrivée s'illumine (« glad you did »).
2. « Your future self is watching. » : orbe « you · in a year » relié par un regard en pointillés à « you · today ».
3. « They're not asking you to be perfect… to start. » : « perfect. » barré, 5 étoiles qui s'éteignent, puis un gros bouton « Start ▸ » pressé.
4. « One intention. One technique. One specific day. » : trois cartes de verre qui se retournent une à une.
5. « And that day is today. » : la carte « someday ? » se retourne en « Today · Day 1 ».
6. Finale « Manifest with method » + signspath.com.

- Voix : `public/signspath/voice6.mp3` (normalisée). Timing : `remotion/signspath6/timing.ts`.
- `npm run render:signspath-oneyear` rend `out/signspath-one-year.mp4`.

### Motion « Kinetik — tuto motion design en 2 secondes » (vertical, anglais, voix)

Composition `KinetikTutorial` (1080x1920, 26,2 s), style Kinetik (grille néon, sous-titres mot à mot, glitchs) avec les vraies captures du site.
1. Accroche : « How do you create a MOTION GRAPHIC », « 2 SECONDS » sur un anneau, puis le logo Kinetik.
2. Étape 1 : la page d'accueil en 3D ; le curseur clique sur « Create my video » (zoom).
3. Étape 2 : « What are we creating today? » ; clic sur la carte « Motion design ».
4. Étape 3 : un mur 3D de modèles qui défile, compteur 0 → 250+.
5. Étape 4 : le formulaire, « Flowly » se tape dans le champ.
6. Étape 5 : l'écran des couleurs, puis celui de la musique passe devant (clic sur « Body On Body »).
7. « Kinetik syncs everything » : couleurs, musique et modèle volent dans le téléphone, barre de synchro.
8. « DONE! » + la vidéo prête dans un téléphone 3D.
9. Teaser de l'éditeur (timeline, propriétés), puis « Follow for PART 2 » avec le bouton Follow cliqué.

- Captures : `public/kinetik3/screens/` (website, create, brand, colors, music). Les zones cliquées sont réglées dans `remotion/kinetik3/Kinetik3.tsx`.
- `npm run render:kinetik-tuto` rend `out/kinetik-tutorial.mp4` ; `npm run sfx:kinetik-tuto` régénère la musique et les effets.

### Motion « Kinetik — tuto partie 2 : l'éditeur » (vertical, anglais, voix)

Composition `KinetikEditor` (1080x1920, 33,7 s), même style que la partie 1, avec les vraies captures de l'éditeur.
1. « Your video's READY in 2 seconds… TWEAK IT? » puis « EASY. »
2. « Kinetik has a SUPER SIMPLE EDITOR » : l'éditeur en 3D.
3. Le chat Kinetik : « Make the title bigger » se tape dans le chat, envoi, réponse « Done ✓ ».
4. « EVERY SCENE / EVERY ANIMATION / EVERY WORD » : zoom sur la timeline, la transition, puis le titre.
5. « Switch TEMPLATES in ONE CLICK » : clic sur un modèle (Halo 3D).
6. Voiceover, musique, traduction (zoom sur la barre du haut, titre traduit EN → FR → ES → DE → IT → PT).
7. Transitions : la liste défile en surbrillance.
8. Export : 9:16 TikTok, 1:1 Instagram, 16:9 YouTube ; « In MP4. In HD. Ready to post. » + clic sur « Start rendering ».
9. Carte de fin Kinetik + kinetik-app.com.

- Captures : `public/kinetik4/screens/` ; les effets sonores sont ceux de la partie 1 (`public/kinetik3/sfx`).
- `npm run render:kinetik-editor` rend `out/kinetik-editor.mp4` ; `npm run sfx:kinetik-editor` régénère la musique.

### Motion « What can Kinetik do? » (vertical, anglais, voix)

Composition `KinetikFeatures` (1080x1920, 36,8 s), style Kinetik, musique plus dynamique (128 BPM, arpège, montée avant « New templates drop »). Utilise toutes les captures de la page Templates.
1. « What can KINETIK do? » puis « your own VIDEO STUDIO » : carrousel 3D des 6 catégories.
2. Community creations : clic sur un modèle, un scan l'adapte à la marque (couleurs changées), compte à rebours 3 s, « DONE. ».
3. « Over 150+ MOTION TEMPLATES » : la page Motion défile, puis l'éditeur (« fully CUSTOMIZABLE »).
4. Physical products, Signature (logo animé), Instagram posts (« NO MORE HEADACHES » barré), Store screenshots : chaque page défile en 3D.
5. « New templates DROP EVERY DAY » : de vraies cartes de modèles tombent dans une grille ; la communauté (avatars) grandit.
6. « FOLLOW » : bouton cliqué, logo, cartes de modèles.

- Captures : `public/kinetik5/screens/` (+ l'éditeur de `public/kinetik4`). Effets : `public/kinetik3/sfx`.
- `npm run render:kinetik-features` rend `out/kinetik-features.mp4` ; `npm run sfx:kinetik-features` régénère la musique.

### Motion SignsPath #7 « Night affirmations » (vertical, anglais, voix avec écho)

Composition `SignsPathNight` (1080x1920, 29,5 s), style SignsPath en version nuit : rythme lent, fondus longs, très peu d'effets (un carillon discret par affirmation), musique ambiante calme, voix avec écho.
1. « Listen to this before you fall asleep. » : la lune se lève.
2. « I let go of this day. I did what I could. » : le « jour » se défait en poussière qui s'envole.
3. « My body rests, my mind settles. » : cercle de respiration (breathe in / out), l'onde se calme.
4. « I am becoming the person I want to be. » : l'orbe grandit, un cercle se referme.
5. « Every day, I keep my promises to myself a little more. » : 7 jours s'allument le long d'un fil qui monte.
6. « What I repeat becomes my reality. » : ondes qui se répètent, « repeat » en écho devient « reality ».
7. « I fall asleep in peace, and I wake up ready to move forward. » : la lune descend, l'aube se lève, une flèche avance.
8. « Full guide at signspath.com » : l'URL se tape, « sleep well ».

- Voix avec écho : `public/signspath/night/voice.wav` (ffmpeg `aecho`). Musique : `npm run sfx:signspath-night`.
- `npm run render:signspath-night` rend `out/signspath-night.mp4`.

### Motion SignsPath #8 « Repeat after me » (vertical, anglais, voix avec écho)

Composition `SignsPathRepeat` (1080x1920, 35,8 s), même ambiance que « Night affirmations ». La voix a été recomposée avec **3 s de silence après chaque phrase** pour laisser le temps de répéter (`public/signspath/repeat/voice.wav`, écho ajouté).
- Intro « Repeat after me. » (« 5 affirmations · 3 seconds each »), puis 5 affirmations : chacune s'écrit mot à mot, puis l'anneau autour de l'orbe se remplit pendant les 3 s de pause (« your turn · repeat », 3 points qui s'allument). L'orbe gagne en lumière à chaque affirmation répétée.
- Fin : « 5 / 5 · well done », « Full guide at signspath.com ».
- `npm run render:signspath-repeat` rend `out/signspath-repeat.mp4` ; `npm run sfx:signspath-repeat` régénère la musique.

### Motion SignsPath #9 « Morning affirmations » (vertical, anglais, voix avec écho)

Composition `SignsPathMorning` (1080x1920, 40,4 s), même principe que « Repeat after me » (3 s de silence après chaque phrase pour répéter), version matin : un soleil se lève et l'aube se réchauffe au fil des 5 affirmations.
- Voix recomposée + écho : `public/signspath/morning/voice.wav` ; musique : `npm run sfx:signspath-morning`.
- `npm run render:signspath-morning` rend `out/signspath-morning.mp4`.

### Motions SignsPath #10–11 « Money mantra » et « Growth mantra » (vertical, anglais, voix avec écho)

Compositions `SignsPathMoney` (39,2 s) et `SignsPathSkill` (36,3 s), un seul composant (`remotion/signspath10/Mantra.tsx`) piloté par `remotion/signspath10/config.ts` : la même phrase répétée 5 fois, 3 s de silence après chaque répétition, anneau « your turn · repeat », progression 1 → 5, fin « 5 / 5 · well done » + signspath.com.
- Money : visuel hypnotique (spirale qui tourne de plus en plus, anneaux qui s'enfoncent en tunnel, respiration lente de l'image).
- Skill : 12 mois de barres qui poussent au fil des répétitions.
- Voix recomposées + écho : `public/signspath/{money,skill}/voice.wav` ; musiques : `npm run sfx:signspath-mantras`.
- `npm run render:signspath-money` / `npm run render:signspath-skill`.

### Motion SignsPath #12 « Intention » (vertical, anglais, voix)

Composition `SignsPathIntention` (1080x1920, 28,6 s), style SignsPath classique : « What's your biggest intention? », « CAREFUL » + « I want more money » barré qui s'envole comme un vœu, 3 cartes (number / deadline / path), la version précise avec ses 3 pastilles (+€500/month, within 3 months, through a skill), « wish » vs « intention », un faux commentaire qui se tape, puis la finale « Manifest with method ».
- Voix : `public/signspath/voice-intention.mp3`. `npm run render:signspath-intention` rend `out/signspath-intention.mp4`.

### Motion SignsPath #13 « How long » (vertical, anglais, voix)

Composition `SignsPathHowLong` (1080x1920, 27,8 s), style SignsPath classique : sondage « A few days? / A few months? / Years? », frise de durée barrée (« nobody tells you »), cartes clarity + consistency, « 3 min every day beat 1 hour a week » (« consistency wins »), faux commentaire qui se tape, puis la finale « Manifest with method ».
- Voix : `public/signspath/voice-howlong.mp3`. `npm run render:signspath-howlong` rend `out/signspath-howlong.mp4`.
