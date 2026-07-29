import { defineConfig } from "astro/config";

export default defineConfig({
  server: { port: 4327 },
  /* De balk van Astro zelf weglaten: deze site wordt live getoond aan de klant. */
  devToolbar: { enabled: false },
  /* De scrollfilm laadt 436 losse frames uit public/assets; die moeten
     ongemoeid blijven, vandaar geen asset-verwerking of naamgeving-hashes. */
  build: { assets: "_astro" },
  vite: {
    server: {
      /* Tina schrijft tijdens het bewerken tijdelijke bestanden in tina/__generated__.
         Zonder deze regel herlaadt Vite daardoor onnodig de hele pagina. */
      watch: { ignored: ["**/tina/__generated__/**"] },
    },
  },
});
