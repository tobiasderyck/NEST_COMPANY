# Onafhankelijke eindbeoordeling — NEST-verkenner

## 1. Dispositie

Gereed binnen het vastgelegde jaarmodel. De gekozen richting en de rekenkern zijn overtuigend; geen herontwerp nodig. Beide aanvankelijke bevindingen zijn opgelost en hieronder afgetekend. Geen openstaande materiële bevindingen uit deze review.

Beoordeeld op 23 september 2026, als onafhankelijke vervanger voor de niet beschikbare benoemde reviewrol. Alleen dit reviewbestand aangepast; geen applicatiecode.

## 2. Contractbeoordeling

- **Product en ontwerp:** sluit aan op PRODUCT.md en DESIGN.md. De warme papierkleuren, Archivo-typografie en ingetogen woningtekening voelen als een uitbreiding van de bestaande site. De aangeleverde mobiele beelden tonen een eigen compositie zonder zichtbare horizontale afsnijding.
- **Jaarbalans:** elektriciteitsvraag wordt eerst voor boilervervanging aangepast, daarna verdeeld over directe PV, ontladen batterij en netafname. PV-productie wordt eenmaal verdeeld over direct verbruik, lading en injectie. Opslagverlies staat apart. Geen dubbele waardering aangetroffen.
- **Geld en onzekerheid:** lege investeringen blijven onbekend; negatieve injectievergoeding en meerkosten blijven mogelijk. Een niet gekwantificeerd dak maakt het plan gedeeltelijk en blokkeert de totale terugverdientijd. Het voorbeeld is herkenbaar fictief en vult geen offertebedragen in.
- **Scope:** vertrekpunt zonder bestaande PV/batterij staat zichtbaar bij de invoer. Dakbesparing is beperkt tot ingevoerde gas-/stookolievermindering uit energieadvies. De pagina presenteert geen fictieve EPC-verbetering of bewezen off-grid autonomie.
- **Overdracht:** samenvatting gaat pas na de expliciete bespreekactie naar sessieopslag. Contact toont de context, laat verwijdering toe en beschrijft de mailto-stap eerlijk. Er is geen verzending uitgevoerd in deze review.

## 3. Materiële bevindingen

| Prioriteit | Bevinding | Bevestigde oplossing |
|---|---|---|
| P2 · opgelost | Een ongeldig offertebedrag kon in een gesloten `details.cost-details` zitten, waardoor de veldfout niet bereikbaar was. | De submit-handler opent nu alle bovenliggende details-elementen vóór focus. Code bevestigd; `cost-validation.png` toont het geopende blok met negatieve PV-kost en zichtbare foutmelding op 320 px. De hoofdagent bevestigt focus op `calc-pvCost` en `aria-invalid=true`. |
| P2 · opgelost | De uitgesloten extra ruimteverwarming bij warmteonttrekking uit verwarmde binnenlucht was onvoldoende expliciet. | De uitsluiting staat nu naast de boilerinvoer, in de resultaataannames en voor geselecteerde boiler in de overdraagbare/printbare samenvatting. Alle drie locaties in de broncode bevestigd. Het onderzoeksdocument benoemt dezelfde grens; geen fictieve correctiefactor toegevoegd. |

Geen andere materiële fout aangetroffen in de onderzochte rekenlogica. De hardere papieren onderschaduw en de compacte ondersteunende typografie zijn aandachtspunten vanuit de algemene craft-floor, maar passen hier binnen de al vastgelegde papieren ontwerpwereld; ze rechtvaardigen geen zelfstandig herontwerp.

## 4. Sterke punten

- Concrete energieverdeling maakt de combinatie begrijpelijk en controleerbaar.
- Het ontbreken van een offerte krijgt een eerlijke status in plaats van een verzonnen prijs.
- Dakeffect, injectie en opslagverlies worden afzonderlijk verklaard.
- De jaarbalans wordt niet als winterzekerheid verkocht; het januarispoor leidt naar passend advies.
- De contactoverdracht houdt de fictieve status, aannames, ingevoerde tarieven en ontbrekende bedragen bij het resultaat.
- Alle tien bestaande modeltests opnieuw geslaagd. Aanvullend 10.000 willekeurige geldige gecombineerde scenario's gecontroleerd: geen schending van energiebehoud, negatieve energiestromen of zonnedekking boven 100%.

## 5. Grenzen van deze review

Code, onderzoeksdocument, product-/ontwerpcontract en de drie oorspronkelijke screenshots geïnspecteerd. De afsluitende controle bleef beperkt tot de twee gevraagde oplossingen en het aanvullende beeld `cost-validation.png`; er is geen nieuwe auditronde gestart. Geen eigen browserbediening, contrastmeting, schermlezerproef of print-render uitgevoerd; responsieve eindcontroles blijven bij de hoofdagent. De onderzoeksbronnen zijn op gebruik en onderlinge consistentie beoordeeld, maar niet opnieuw extern opgehaald. De gerapporteerde succesvolle routebuild van 29 pagina's, tien tests na de correcties, browserinteracties en bronverificatie van de hoofdagent zijn geen zelfstandig herhaalde tests in deze afsluitende controle. De eerdere 10.000 scenario's toetsen wiskundige invarianten, geen fysieke haalbaarheid van een uurprofiel of commerciële opbrengst.
