import { defineConfig } from "astro/config";
import fs from "node:fs";

const SITE = "https://nestcompany.be";
/* Sitemap en robots.txt schrijven na de build, zonder extra pakket. */
const zoekmachines = {
  name: "nest-sitemap",
  hooks: {
    "astro:build:done": ({ dir, pages }) => {
      const weg = /^(404|admin|proef|verkenner)/;
      const urls = pages.map(p => "/" + p.pathname).filter(p => !weg.test(p.slice(1))).sort();
      const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + urls.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join("\n") + "\n</urlset>\n";
      fs.writeFileSync(new URL("sitemap.xml", dir), xml);
      fs.writeFileSync(new URL("robots.txt", dir), `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE}/sitemap.xml\n`);
    },
  },
};

export default defineConfig({
  site: SITE,
  integrations: [zoekmachines],
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
