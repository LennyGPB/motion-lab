import { Config } from "@remotion/cli/config";

// Si Remotion ne peut pas télécharger son Chrome Headless (réseau restreint),
// pointer vers un Chromium local : REMOTION_BROWSER_EXECUTABLE=/chemin/vers/chrome npm run render
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
