import { defineConfig } from "tinacms";

/* ═══ NEST COMPANY — inhoudsbeheer ═══
   Alles wat hier staat, ziet de klant in de bewerkomgeving op /admin.
   Labels en uitleg bewust in het Nederlands en in gewone mensentaal.

   Twee terugkerende begrippen:
   - "Kicker"  = het kleine oranje regeltje boven een titel.
   - "Accent"  = het cursieve, gekleurde deel van een titel. Elke titel is
                 gesplitst in een vet deel en een cursief accent; zo blijft
                 de typografie kloppen wat de klant ook invult. */

const KICKER = {
  type: "string" as const,
  name: "kicker",
  label: "Klein regeltje erboven",
  description: "Het kleine gekleurde regeltje boven de titel. Meestal in HOOFDLETTERS.",
};

const titelVelden = (uitleg: string) => [
  {
    type: "string" as const,
    name: "titel",
    label: "Titel — vet deel",
    description: uitleg,
  },
  {
    type: "string" as const,
    name: "titelAccent",
    label: "Titel — cursief accent",
    description: "Het schuingedrukte, gekleurde staartje van de titel.",
  },
];

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.HEAD || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "site",
        label: "Website",
        path: "content",
        format: "json",
        match: { include: "site" },
        ui: {
          // Eén vaste pagina: niets kunnen aanmaken of verwijderen.
          allowedActions: { create: false, delete: false },
          // Geen `router` hier: die stuurt Tina naar de visuele bewerkmodus,
          // die een React-koppeling vereist. Zonder router krijgt de klant het
          // gewone formulier, dat los van het framework werkt.
        },
        fields: [
          /* ── 1. Bedrijfsgegevens ── */
          {
            type: "object",
            name: "merk",
            label: "1. Bedrijfsgegevens & Google",
            description: "Naam, contactgegevens en hoe de site in Google en op sociale media verschijnt.",
            fields: [
              { type: "string", name: "naam", label: "Naam (vet)", description: 'Het vetgedrukte deel linksboven, bv. "NEST".' },
              { type: "string", name: "naamVervolg", label: "Naam (dun vervolg)", description: 'Het lichtere deel erachter, bv. "COMPANY BV".' },
              { type: "string", name: "telefoon", label: "Telefoonnummer (zichtbaar)", description: "Zoals het op de site staat, bv. 0492 86 42 02." },
              { type: "string", name: "telefoonLink", label: "Telefoonnummer (om te bellen)", description: "Internationaal formaat zonder spaties, bv. +32492864202. Hierop belt de bezoeker als hij klikt." },
              { type: "string", name: "email", label: "E-mailadres" },
              { type: "string", name: "paginaTitel", label: "Titel in Google & browsertabblad" },
              { type: "string", name: "paginaOmschrijving", label: "Omschrijving in Google", description: "Kort zinnetje onder de titel in de zoekresultaten. Houd het onder ±155 tekens.", ui: { component: "textarea" } },
              { type: "string", name: "deelTitel", label: "Titel bij delen (WhatsApp, Facebook)" },
              { type: "string", name: "deelOmschrijving", label: "Omschrijving bij delen", ui: { component: "textarea" } },
              { type: "image", name: "deelBeeld", label: "Afbeelding bij delen", description: "Deze foto verschijnt wanneer iemand de link deelt." },
            ],
          },

          /* ── 2. Menu ── */
          {
            type: "object",
            name: "menu",
            label: "2. Menu bovenaan",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Menu-item" }) },
            fields: [
              { type: "string", name: "label", label: "Tekst" },
              { type: "string", name: "anker", label: "Springt naar", description: "Verwijzing naar een deel van de pagina: #journey, #diensten, #realisaties, #aanpak of #contact." },
            ],
          },
          { type: "string", name: "knopBoven", label: "Knop rechtsboven" },

          /* ── 3. Laadscherm ── */
          {
            type: "object",
            name: "laadscherm",
            label: "3. Laadscherm",
            description: "Wat de bezoeker heel even ziet terwijl de film inlaadt.",
            fields: [
              { type: "string", name: "naam", label: "Naam onder het logo" },
              { type: "string", name: "stap1", label: "Tekst bij 0–35%" },
              { type: "string", name: "stap2", label: "Tekst bij 35–70%" },
              { type: "string", name: "stap3", label: "Tekst bij 70–100%" },
              { type: "string", name: "klaar", label: "Tekst wanneer klaar" },
            ],
          },

          /* ── 4. De scrollfilm ── */
          {
            type: "object",
            name: "film",
            label: "4. De scrollfilm",
            description: "De teksten die over de film verschijnen terwijl de bezoeker scrolt.",
            fields: [
              {
                type: "object",
                name: "rail",
                label: "Hoofdstukken rechts in beeld",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label || "Hoofdstuk" }) },
                fields: [{ type: "string", name: "label", label: "Tekst" }],
              },
              {
                type: "object",
                name: "hero",
                label: "Openingsscherm",
                fields: [
                  { ...KICKER, label: "Klein regeltje bovenaan" },
                  { type: "string", name: "titelRegel1", label: "Grote titel — eerste regel" },
                  { type: "string", name: "titelRegel2", label: "Grote titel — tweede regel" },
                  { type: "string", name: "ondertitel", label: "Ondertitel" },
                  { type: "string", name: "ondertitelAccent", label: "Ondertitel — gekleurd slot" },
                  { type: "string", name: "voetLinks", label: "Onderaan links" },
                  { type: "string", name: "voetMidden", label: "Onderaan midden (scroll-hint)" },
                  { type: "string", name: "voetRechts", label: "Onderaan rechts" },
                ],
              },
              {
                type: "object",
                name: "aktes",
                label: "Teksten tijdens de film",
                description:
                  "Elk blok verschijnt op een bepaald moment in de film. Pas gerust de teksten aan. De momenten (start/einde) alleen wijzigen als een tekst niet meer bij het juiste beeld staat.",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.kicker || "Filmtekst" }) },
                fields: [
                  KICKER,
                  ...titelVelden("De grote titel over het beeld."),
                  { type: "string", name: "tekst", label: "Tekstje eronder", ui: { component: "textarea" } },
                  { type: "number", name: "start", label: "Verschijnt op (0 – 1)", description: "0 = helemaal aan het begin van de film, 1 = helemaal op het einde. 0.3 is dus ongeveer een derde." },
                  { type: "number", name: "einde", label: "Verdwijnt op (0 – 1)" },
                ],
              },
              {
                type: "object",
                name: "slot",
                label: "Slotscherm van de film",
                fields: [
                  KICKER,
                  ...titelVelden("De afsluitende titel."),
                  { type: "string", name: "knop", label: "Tekst op de knop" },
                  { type: "number", name: "start", label: "Verschijnt op (0 – 1)" },
                  { type: "number", name: "einde", label: "Verdwijnt op (0 – 1)" },
                ],
              },
            ],
          },

          /* ── 5. Statement ── */
          {
            type: "object",
            name: "statement",
            label: "5. Statement onder de film",
            fields: [
              { type: "string", name: "regel1", label: "Eerste regel" },
              { type: "string", name: "regel2", label: "Tweede regel" },
              { type: "string", name: "regel2Accent", label: "Tweede regel — cursief accent" },
              { type: "string", name: "onderschrift", label: "Klein regeltje eronder" },
            ],
          },

          /* ── 6. Diensten ── */
          {
            type: "object",
            name: "diensten",
            label: "6. Diensten",
            fields: [
              KICKER,
              ...titelVelden("Titel boven de dienstenlijst."),
              {
                type: "object",
                name: "items",
                label: "De diensten",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.titel || "Dienst" }) },
                fields: [
                  { type: "string", name: "nummer", label: "Nummer", description: 'Bv. "01". Puur visueel.' },
                  { type: "string", name: "titel", label: "Naam van de dienst" },
                  { type: "string", name: "subtitel", label: "Korte uitleg" },
                  { type: "image", name: "beeld", label: "Foto bij aanwijzen", description: "Deze foto zweeft mee wanneer de bezoeker met de muis over de dienst gaat." },
                ],
              },
            ],
          },

          /* ── 7. Voor & na ── */
          {
            type: "object",
            name: "voorna",
            label: "7. Voor & na (schuifbalk)",
            fields: [
              KICKER,
              ...titelVelden("Titel boven de voor/na-foto."),
              { type: "image", name: "beeldVoor", label: 'Foto "voor"' },
              { type: "string", name: "beeldVoorAlt", label: 'Omschrijving foto "voor"', description: "Voor blinde bezoekers en Google. Beschrijf kort wat er te zien is." },
              { type: "image", name: "beeldNa", label: 'Foto "na"' },
              { type: "string", name: "beeldNaAlt", label: 'Omschrijving foto "na"' },
              { type: "string", name: "labelVoor", label: 'Label linksboven' },
              { type: "string", name: "labelNa", label: 'Label rechtsboven' },
              { type: "string", name: "hint", label: "Klein regeltje eronder" },
            ],
          },

          /* ── 8. Realisaties ── */
          {
            type: "object",
            name: "realisaties",
            label: "8. Realisaties",
            description: "De projecten die de bezoeker opzij kan slepen. Hier voeg je nieuwe werven toe.",
            fields: [
              KICKER,
              ...titelVelden("Titel boven de projecten."),
              {
                type: "object",
                name: "items",
                label: "Projecten",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.titel || "Project" }) },
                fields: [
                  { type: "image", name: "beeld", label: "Foto", description: "Liefst liggend formaat. Wordt automatisch bijgesneden naar 4:3." },
                  { type: "string", name: "tag", label: "Soort werk", description: 'Het kleine oranje label, bv. "DAK + ZON".' },
                  { type: "string", name: "titel", label: "Titel van het project" },
                  { type: "string", name: "alt", label: "Omschrijving van de foto", description: "Voor blinde bezoekers en Google." },
                ],
              },
              { type: "string", name: "hint", label: "Regeltje onderaan" },
              { type: "string", name: "hintLinkTekst", label: "Tekst van de link" },
              { type: "string", name: "hintLink", label: "Waar de link naartoe gaat" },
            ],
          },

          /* ── 9. Aanpak ── */
          {
            type: "object",
            name: "aanpak",
            label: "9. Onze aanpak",
            fields: [
              KICKER,
              ...titelVelden("Titel boven de stappen."),
              {
                type: "object",
                name: "stappen",
                label: "De stappen",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.titel || "Stap" }) },
                fields: [
                  { type: "string", name: "nummer", label: "Nummer" },
                  { type: "string", name: "titel", label: "Titel van de stap" },
                  { type: "string", name: "tekst", label: "Uitleg", ui: { component: "textarea" } },
                ],
              },
              {
                type: "object",
                name: "cijfers",
                label: "Cijfers onderaan",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label || "Cijfer" }) },
                fields: [
                  { type: "string", name: "waarde", label: "Cijfer of teken" },
                  { type: "string", name: "label", label: "Wat het betekent" },
                  { type: "boolean", name: "telOp", label: "Laten optellen?", description: "Aan: het cijfer telt omhoog wanneer de bezoeker het ziet. Werkt enkel bij gewone getallen, niet bij tekens zoals ∞." },
                ],
              },
            ],
          },

          /* ── 10. Calculator ── */
          {
            type: "object",
            name: "calculator",
            label: "10. Blok naar de calculator",
            fields: [
              KICKER,
              ...titelVelden("Titel in het calculator-blok."),
              { type: "string", name: "knop", label: "Tekst op de knop" },
              { type: "string", name: "link", label: "Waar de knop naartoe gaat" },
            ],
          },

          /* ── 11. Contact ── */
          {
            type: "object",
            name: "contact",
            label: "11. Contact",
            description: "Telefoon en e-mail beheer je bovenaan bij Bedrijfsgegevens; die verschijnen hier automatisch.",
            fields: [
              KICKER,
              ...titelVelden("De grote afsluitende titel."),
              { type: "string", name: "tekst", label: "Zinnetje eronder", ui: { component: "textarea" } },
              { type: "string", name: "adres", label: "Adresregel onderaan" },
            ],
          },

          /* ── 12. Voettekst ── */
          {
            type: "object",
            name: "voet",
            label: "12. Onderste balk",
            fields: [
              { type: "string", name: "links", label: "Links" },
              { type: "string", name: "midden", label: "Midden" },
              { type: "string", name: "rechts", label: "Rechts" },
            ],
          },
        ],
      },
    ],
  },
});
