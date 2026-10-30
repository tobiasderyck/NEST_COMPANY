# NEST — architectuur van de energieverkenner

## Scheiding van verantwoordelijkheden

- Astro maakt de vaste pagina `/nestverkenner/`. Bestaande huisstijl blijft gedeeld, pagina-CSS staat in `public/calculator/verkenner.css`.
- `public/calculator/model.mjs` is een zuivere functie zonder DOM, netwerk of opslag. `calculate()` valideert invoer en berekent één jaarbalans; bij ontbrekende verplichte invoer is `ok:false` het resultaat. `null` is onbekend, niet nul.
- `public/calculator/interface.mjs` beheert invoer, validatiefouten, richtwaarden, grafische energiebalans, print-CSS en expliciete overdracht naar contact. `presets.mjs` levert uitsluitend ontbrekende voorbeeldwaarden; eigen waarden (ook nul) blijven behouden. Veldherkomst blijft herkenbaar tot handmatige wijziging, inclusief in overdracht/print. Geen externe API wordt tijdens het rekenen aangeroepen.
- PV-productie gebruikt een locatieonafhankelijke aanname `aantal × Wp / 1000 × kWh/kWp` zolang geen eigen Zonnekaart/PVGIS-productie is ingevuld. Het paneelaantal vormt ook maximaal twaalf schematische tegels in `PlanHouse.astro`; de tekst vermeldt altijd het echte gekozen aantal. De tekening is illustratief, geen dakindeling.
- `totalCost` is een alternatief voor de som van gekozen maatregelkosten. Beide manieren tegelijk geven een validatiefout. Een theoretisch nultarief voor netafname in de jaarbalans wordt met `gridUncertain` nooit als werkelijk 0 kWh of als berekenbare terugverdientijd gepresenteerd.
- De modeltests draaien met `node --test tests/energy-model.test.mjs`.

## Rekenkundige invarianten

PV-productie = direct gebruik + batterijlading + injectie. Nieuwe stroomvraag = direct gebruik + batterijontlading + netafname. Lading − ontlading = opslagverlies. Boilerbesparing verlaagt de vraag vóór de verdeling van zonnestroom. Dakbesparing gebruikt alleen een afzonderlijke door de bezoeker opgegeven vermindering van gas/stookolie en wordt niet stilzwijgend uit een EPC-waarde afgeleid.

De basiswoning heeft geen bestaande PV/batterij. Vermijdbare kosten en injectievergoeding blijven gescheiden. Geen vaste kosten, capaciteitstarief, energiehandel of subsidievoorspelling. Jaarbalans is geen bewijs van off-grid haalbaarheid. Bronnen, grenzen en toekomstige uitbreidingen staan in RESEARCH-NEST-VERKENNER.md.

## Contactoverdracht

Alleen een expliciete klik op ‘Bespreek dit plan’ schrijft `nest-calculator-plan` naar sessionStorage. Structuur `{version, created, text}`. `public/nest.js` accepteert alleen de bekende modelversie, een timestamp binnen twee uur en maximaal 12.000 tekens. Tekst wordt via textContent ingevoegd, kan verwijderd worden en wordt pas bij het zelf versturen van een contactaanvraag aan de mailtekst toegevoegd. De calculator schrijft geen contactgegevens weg.

## Uitbreiden

Wijzig modelversie bij betekenisvolle rekenwijzigingen; pas ook de contactlezer aan. Voeg tests toe voor energiebehoud, ontbrekende gegevens en ongunstige uitkomsten. NEST-prijsbanden, echte offertes, VEKA/EPC-API of PVGIS-tijdsprofielen zijn nog niet gekoppeld. Voeg die pas toe met geverifieerde input, herkomst, datum en expliciet gewijzigde scope. Geen prijslijsten of productclaims uit taalmodelgeheugen.
