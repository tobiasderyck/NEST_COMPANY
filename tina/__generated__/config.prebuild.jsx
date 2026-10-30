// tina/config.ts
import { defineConfig } from "tinacms";
var text = (name, label, multiline = false) => ({ type: "string", name, label, ...multiline ? { ui: { component: "textarea" } } : {} });
var list = (name, label) => ({ type: "string", name, label, list: true });
var chapters = { type: "object", name: "sections", label: "Inhoudelijke hoofdstukken", list: true, ui: { itemProps: (item) => ({ label: item?.title || "Hoofdstuk" }) }, fields: [text("title", "Titel"), text("text", "Tekst", true), list("items", "Opsomming (optioneel)")] };
var common = [
  { ...text("slug", "Pagina-adres"), required: true, description: "Behoud dit adres bij tekstwijzigingen. Andere pagina\u2019s verwijzen hiernaar." },
  { ...text("title", "Naam"), required: true },
  text("headline", "Grote titel"),
  text("summary", "Korte beschrijving", true),
  { ...text("image", "Beeld"), options: ["leuven", "dak-lucht", "werf", "kempen", "zolder", "k1_oud", "k2_dak", "k3_zon", "k4_gevel", "k5_nest"] },
  chapters,
  text("question", "Afsluitende vraag"),
  text("cta", "Tekst bij de adviesknop", true)
];
var collection = (name, label, fields) => ({
  name,
  label,
  path: "content",
  format: "json",
  match: { include: name },
  ui: { allowedActions: { create: false, delete: false } },
  fields: [{ type: "object", name: "items", label: "Pagina\u2019s", list: true, ui: { itemProps: (item) => ({ label: item?.title || "Pagina" }) }, fields }]
});
var config_default = defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.HEAD || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "assets", publicFolder: "public" } },
  schema: { collections: [
    collection("services", "Diensten", [
      ...common,
      { ...text("group", "Categorie"), options: [{ label: "Dakwerken", value: "dak" }, { label: "Energieoplossingen", value: "energie" }, { label: "Gevelrenovatie", value: "gevel" }, { label: "Totaalrenovatie", value: "totaal" }], required: true },
      text("imageAlt", "Beschrijving van het beeld"),
      text("intro", "Introductie", true),
      list("benefits", "Voordelen"),
      list("brands", "Merken"),
      { ...list("related", "Gerelateerde diensten"), description: "Laatste deel van het pagina-adres, bijvoorbeeld thuisbatterijen." },
      text("source", "Interne bronnotitie")
    ]),
    collection("editorial", "Begeleiding, team & projectverhalen", [
      ...common,
      { ...text("kind", "Soort pagina"), options: ["guidance", "story", "team", "case"], required: true }
    ]),
    { name: "homepage", label: "Homepage \u2014 kernteksten", path: "content", format: "json", match: { include: "homepage" }, ui: { allowedActions: { create: false, delete: false } }, fields: [
      text("titleStart", "Titel \u2014 eerste regel"),
      text("titleEnd", "Titel \u2014 tweede regel"),
      text("titleAccent", "Titel \u2014 accent"),
      text("promise", "Welke werken doet NEST?"),
      text("description", "Korte belofte"),
      text("adviceButton", "Adviesknop"),
      text("servicesLink", "Link naar diensten"),
      text("intro", "Introductie", true),
      text("servicesTitle", "Diensten \u2014 titel"),
      text("servicesAccent", "Diensten \u2014 accent"),
      text("servicesDescription", "Diensten \u2014 toelichting", true)
    ] }
  ] }
});
export {
  config_default as default
};
