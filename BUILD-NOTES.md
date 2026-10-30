# NEST — lokale ontwerpversie

## Bekijken

`npm run dev:site -- --host 127.0.0.1` → http://127.0.0.1:4327/

## Inhoud en structuur

- 27 inhoudspagina’s en een 404-pagina. De 22 PDF-bronnen en hun bestemming staan in `implementation_plan.md`.
- Vier ingangen: dakwerken, energieoplossingen, gevelrenovatie en totaalrenovatie. Twaalf volledige dienstenpagina’s.
- Advies, configuratie, premies en opvolging zijn gedeelde begeleidingspagina’s. Dienstteksten verwijzen ernaar in plaats van hetzelfde blok telkens te herhalen.
- Bedrijfsverhaal, team, realisaties en twee projectverhalen blijven beschikbaar.
- De dubbele blogexports bevatten placeholders. `/blog/` biedt daarom inhoudelijke vragen en antwoorden uit de diensten, zonder verzonnen artikelen of publicatiedata.
- Gevel- en totaalrenovatie zijn door Tobias bevestigd; de nieuwe teksten zijn conceptteksten zonder onbevestigde garanties of exacte uitvoeringsbeloften.

## Beheer

De werkelijke paginainhoud staat in `content/services.json` en `content/editorial.json`; kernteksten van de homepage staan in `content/homepage.json`. Deze drie bronnen zijn gekoppeld aan `tina/config.ts`. Overige homepage-onderdelen, navigatie, bedrijfsgegevens en Q&A worden momenteel in de Astro-componenten en `src/data/nest.ts` beheerd. `content/site.json` is de behouden inhoud van de oude versie en wordt niet meer door de nieuwe site gebruikt.

De lokale Tina-build is gecontroleerd met `tinacms build --local --skip-cloud-checks --noTelemetry`. De cloudcontrole meldt terecht dat het nieuwe schema nog niet overeenkomt met de bestaande online versie. Die koppeling hoort bij het publiceren van de gewijzigde repository. Geen cloudinhoud bijgewerkt. Behoud bestaande slugs en dienstnamen bij gewone tekstcorrecties; verwijzingen en projectselectie gebruiken deze identificatie.

## Media

Geen nieuwe AI-generatie. Vier bestaande clips, opnieuw gecodeerd naar desktop (5.01 MB samen) en mobiel (1.03 MB samen). Clips worden progressief geladen; de oude 436-frame-reeks wordt niet meer opgevraagd. Geen scrollblokkering. Pauze wanneer buiten beeld of in een verborgen tab; geen automatische start bij reduced motion of data besparen. Het hele huis blijft zichtbaar op mobiel. Er zijn stilstaande beelden als fallback.

Nieuw gegenereerde foto’s worden altijd eerst aan Tobias getoond voor goedkeuring voordat daar nieuwe video’s van worden gemaakt.

## Contact

De ontwerpversie maakt na validatie een e-mail klaar in het mailprogramma van de bezoeker en zegt dat expliciet. Er wordt geen verzonden aanvraag nagebootst. Het persoonlijke projectlijstje bewaart alleen dienstnamen op het toestel; namen, e-mailadressen en berichten worden niet opgeslagen. Een echte formulierdienst is nog nodig voor directe verzending en betrouwbare aflevering.

## Uitgevoerde controles

- Astro productiebouw: 28 pagina’s succesvol.
- JavaScript syntaxcontrole: geslaagd.
- Alle gegenereerde inhoudspagina’s: één H1, interne links, lokale media en ankers gecontroleerd, geen ontbrekende doelen.
- Desktop en mobiele browsercontrole (1280 en 390 px): navigatie, menu, dienstpagina, contact, projectselectie en behoud na navigatie.
- Energiescène dag/avond, film afspelen/pauzeren en lege formuliervalidatie gecontroleerd. Testselecties nadien verwijderd. Geen aanvraag verstuurd.
- Geen browserwaarschuwingen of fouten tijdens de geteste flows.
- Reduced-motion- en databesparingslogica in code aanwezig; niet op echte mobiele toestellen of met gewijzigde OS-instellingen getest.
- Ontwerpdetector één keer uitgevoerd: geen mechanische bevindingen. Onafhankelijke visuele review staat in `.impeccable/review/`.

## Voor publicatie

1. Formulierdienst koppelen, ontvangst bij NEST testen en privacytekst afstemmen op de daadwerkelijke verwerking.
2. Nieuwe Tina-schema publiceren/synchroniseren en de live redactietoegang controleren.
3. Nieuwe teksten voor gevel/totaalrenovatie en koppeling tussen projectverhalen en echte projectfoto’s door NEST laten bevestigen.
4. Definitieve domeinnaam, metadata, redirects van bestaande adressen, juridische bedrijfsgegevens en echte iPhone/Android-test afronden.

De huidige versie is lokaal. Er is niets naar productie uitgerold.

## Toegevoegd: NEST-verkenner

`/nestverkenner/` is een deelbare ingang voor een transparante vergelijking van PV, thuisbatterij, elektrische-boilervervanging en een onderbouwd dakisolatiescenario. Nu 28 inhoudspagina’s plus 404. De navigatie en energiescène verwijzen ernaar. De huistekening en energiebalans reageren op keuzes; een printweergave en expliciete tijdelijke overdracht naar contact houden alle aannames bij het resultaat.

Tien onafhankelijke scenario-/randgevaltests controleren de rekenkern. Browsercontroles: fictief voorbeeld, PV/opslag/boilercombinatie, gedeeltelijk dakeffect, positieve terugverdientijd na eigen kostinvoer, negatieve injectieprijs met meerkosten, lege invoer, reset, contactoverdracht en verwijderen. Geen aanvraag verzonden. CSS voor afdrukken is toegevoegd; echte PDF-afdruk en echte telefoon zijn nog niet getest.

Belangrijk: dit is een controleerbaar jaarmodel, geen maatwerkofferte of productie-/verbruikssimulatie op kwartierniveau. Ontbrekende kosten blijven onbekend. De enige openbare kostreferentie die apart kan worden ingevuld is een warmtepompboiler (€3.500 incl. btw/plaatsing, Vlaanderen); ze wordt niet als NEST-prijs voorgesteld. Zie RESEARCH-NEST-VERKENNER.md voor bronlinks en modelgrenzen.

### Compacte scan en richtwaarden

De losse voorbeeldknop is vervangen door drie verbruiksrichtwaarden en een actie om alleen ontbrekende voorbeeldcijfers aan te vullen. Eigen en technische invoer, offertes en bronnen staan standaard dicht; de technische boilerinstellingen openen bij selectie. Aannames blijven zichtbaar en gaan mee naar contact/print. Dertien tests geslaagd, inclusief behoud van nul/eigen tarieven, geldige combinaties van alle verbruiksprofielen en het ontbreken van fictieve offertes. De Astro-sitebuild slaagt; `npm run build` kan de Tina Cloud-check niet bereiken (`ERR_CLOUD_CHECK_FAILED`, fetch failed), vóór de sitebuild. Geen CMS-configuratie of productie aangepast.

### Paneelaantal, netafname en investering

De scan berekent kWp uit aantal panelen × Wp, met een expliciete grove opbrengstfactor of een dakspecifieke productie uit Zonnekaart/PVGIS. De architecturale SVG-tekening toont de keuzes en vermeldt het gekozen aantal panelen. Een theoretische jaarbalans van 0 kWh geeft het werkelijke netverbruik als onbekend en onderdrukt de terugverdientijd, ook als een budget is ingevoerd. Het budget kan nu als één zichtbaar totaalbedrag of als bedragen per maatregel worden ingevuld; beide tegelijk worden geweigerd. De resultaten bewaren dezelfde grenzen in print- en contacttekst. Zestien tests en de Astro-build van 29 pagina's slagen. Mobiel en desktop zijn visueel en interactief gecontroleerd; geen horizontale overloop op de smalle testbreedte. Onderzoeksgrondslag en bronlinks: RESEARCH-NEST-VERKENNER.md.
