# NEST-verkenner: bronnenonderzoek voor schattingen (oktober 2026)

Gecontroleerd op 30 oktober 2026. Scope: particulier in Vlaanderen met digitale meter, adres Machelen (1830). Doel: een eerlijke bandbreedte (laag, midden, hoog) voor jaarlijkse besparing, investering en terugverdientijd.

**Werkwijze.**
- Bedragen zijn inclusief 6% btw, tenzij anders vermeld.
- Leadgeneratiesites (Bobex, Trustup, Callmepower, Selectra) gebruik ik enkel als prijspeiling naast een betere bron. Dat staat er telkens bij.
- Een leverancierstariefkaart (Eneco) is wel een primaire bron, maar alleen voor dat ene product. Ze dient hier als controle, niet als marktgemiddelde.
- Waar een waarde van mij komt (rekensom, interpolatie of aanname), staat dat er expliciet bij.

---

## 0. Controle van het bestaande register (RESEARCH-NEST-VERKENNER.md)

| Item uit het register | Status op 30-10-2026 |
|---|---|
| Vlaanderen.be thuisbatterij, zelfverbruik "gemiddeld 28% tot ongeveer 68%" | Klopt nog. De pagina noemt ook een vuistregel van 1 tot 1,5 kWh batterij per kWp. Er staat geen premie meer op. |
| Vlaanderen.be warmtepompboiler, ca. €3.500 incl. btw en plaatsing, "3 tot 4 keer zuiniger" | Klopt nog. Geen datum op de pagina. |
| VREG/VNR-verbruikscategorieën 1.200, 3.500 en 7.500 kWh | Klopt nog (laatste update van de pagina: 24-06-2026). Nieuw: een gemiddeld Vlaams gezin nam in 2024 **2.662 kWh** af. Dat cijfer is vertekend door gezinnen met zonnepanelen. |
| Historische 900 kWh/kWp | Is verouderd als middenwaarde. PVGIS geeft voor Machelen 1.017 à 1.051 kWh/kWp (zuid, 35°). Zie punt 4. |
| Zonnekaart, achtergronddocumenten | De gelinkte handleidingen dateren van 2022. Volgens de pagina worden de parameters jaarlijks bijgewerkt, maar de waarden zelf staan niet op de pagina. |
| "€0,30 import, €0,04 injectie" (snelstart) | Import is te laag voor eind 2026. Zie punt 1: midden €0,32. Injectie €0,04 blijft verdedigbaar als middenwaarde. |
| Netbeheerder Machelen | Machelen valt onder **Fluvius Halle-Vilvoorde**, het vroegere Sibelgas, sinds 1-1-2025. Bron: [VNR, aanwijzing netbeheerders](https://www.vlaamsenutsregulator.be/elektriciteit-en-aardgas/technische-reglementen-flexibiliteit-niet-publieke-netten/wie-is-mijn-netbeheerder/aanwijzing-netbeheerders). Die vermeldt "Grimbergen, Machelen, Meise, Vilvoorde en Wemmel" en de naamswijziging van Sibelgas naar Fluvius Halle-Vilvoorde. |

---

## 1. Elektriciteitsprijs Vlaanderen 2026 (digitale meter, Fluvius Halle-Vilvoorde)

### Waarden voor de calculator

| Parameter | Laag | Midden | Hoog | Eenheid |
|---|---|---|---|---|
| **Vermijdbare afnameprijs** (variabel deel, incl. 6% btw) | **0,27** | **0,32** | **0,38** | €/kWh |
| Vermijdbare prijs tijdens zonne-uren bij een **dynamisch** contract (indicatie) | 0,21 | (gebruik dan dit cijfer als midden voor zelfverbruik) | — | €/kWh |
| Vaste kosten, **niet** vermijdbaar door minder af te nemen | vaste vergoeding €0–100/jaar + databeheer €18,92/jaar + capaciteitstarief (punt 3) | | | €/jaar |

**Opbouw van de vermijdbare kWh-prijs, oktober 2026, Fluvius Halle-Vilvoorde, incl. 6% btw:**

| Component | Waarde | Bron |
|---|---|---|
| Energiecomponent leverancier, incl. groenestroom/WKK | ±17 tot ±29 c€/kWh (afgeleid uit de CREG-marktspreiding, zie hieronder). Voorbeeld Eneco Flex okt. 2026: 20,78 + 1,51 (GSC/WKK) = 22,3 c€ | CREG, Eneco |
| Distributie + transmissie, kWh-tarief digitale meter | **5,64 c€/kWh** (53,177 €/MWh excl. btw) | VNR-tarieflijst 2026 |
| Bijzondere accijns (de energiebijdrage is sinds 1-8-2026 = 0) | **4,876 c€/kWh** | Fluvius-tarieflijst Q4 2026, Eneco okt. 2026 |
| **Totaal vermijdbaar** | **±27 tot ±40 c€/kWh**, typisch ±32–33 | eigen optelling |

**Controle met een onafhankelijk gemiddelde.** De CREG-"End-user Price EV" voor Vlaanderen met digitale meter bedroeg per maand in 2026 (c€/kWh):
- januari 31,58
- februari 33,16
- maart 30,79
- april 32,71
- mei 30,93
- juni 32,17
- juli 33,65

Het gemiddelde over januari tot juli is 32,1 (eigen berekening). Het daaruit afgeleide forfait voor Q4 2026 is 32,25 c€/kWh. Volgens de CREG omvat dit "energiekost, netwerkkosten, heffingen, toeslagen en btw". Of vaste termen erin zijn omgeslagen, is **niet gedocumenteerd**. De waarde valt wel samen met de optelling van de variabele componenten hierboven.

**Fixed, variable, dynamic contracts** (CREG infographic, October 2026, Flanders, 3,500 kWh, energy component only, including the fixed supplier fee, **excluding** VAT, network and levies):
- vast: €570–1.026 per jaar
- variabel: €614–966 per jaar
- dynamisch: €581–984 per jaar

Daaruit volgt een energiecomponent van ±16 à 29 c€/kWh excl. btw, met de vaste vergoeding erin. De midden-, laag- en hoogwaarden van de calculator zijn mijn afronding: laag ≈ goedkoopste producten, hoog ≈ dure producten.

**Dynamic contract.** The midday price is lower than the average price. Eneco (dynamic, October 2026) estimates the Belpex price weighted by consumption profile (RLP) at €150.95/MWh, and weighted by solar profile (SPP) at €79.46/MWh. Applied to Eneco's own formula, that gives about 9.1 c€ energy cost during solar hours. Add GSC/WKK, network and excise and you get **≈ 0.21 €/kWh avoided per self-consumed solar kWh**. That is my calculation from Eneco's figures, for one product.

**Vaste, niet-vermijdbare delen (Halle-Vilvoorde 2026, incl. btw):**
- databeheer €18,92 per jaar
- capaciteitstarief 59,41 €/kW per jaar, met een minimum van 2,5 kW = €148,52 per jaar
- vaste vergoeding van de leverancier, bv. Eneco €65 per jaar
- Bijdrage Energiefonds €0 per maand voor gedomicilieerde gezinnen (Eneco-tariefkaart)

### Bronnen
- [CREG: tarief thuisladen bedrijfswagens, incl. methodeomschrijving](https://www.creg.be/nl/consumenten/prijzen-en-tarieven/tarief-voor-terugbetaling-thuisladen-bedrijfswagens). Maandreeks: [CREG_Tariff_EV.csv](https://www.creg.be/sites/default/files/assets/Prices/CREG_Tariff_EV.csv). Gecontroleerd 30-10-2026, laatste maand juli 2026.
- [CREG: infografiek particulieren, oktober 2026](https://www.creg.be/sites/default/files/assets/Prices/InfographResNl.pdf). Gecontroleerd 30-10-2026.
- [VNR: distributienettarieven 2026](https://www.vlaamsenutsregulator.be/elektriciteit-en-aardgas/nettarieven/hoeveel-bedragen-de-distributienettarieven), pagina-update 11-06-2026. Bestanden: [tarieflijst xlsx](https://assets.vlaamsenutsregulator.be/2025-11/Distributienettarieven%20elektriciteit%202026.xlsx) en [Fluvius Halle-Vilvoorde 2026 pdf](https://assets.vlaamsenutsregulator.be/2025-11/FHV%20-%202026%20-%20ELEK.pdf). Geldig 01-01 t/m 31-12-2026.
- [VNR: waaruit bestaat de energieprijs](https://www.vlaamsenutsregulator.be/elektriciteit-en-aardgas/energieprijzen-en-facturen/waaruit-bestaat-de-energieprijs-voor-elektriciteit-en-aardgas), update 20-08-2026. Bevestigt dat een deel van de nettarieven en heffingen met het verbruik meeschaalt.
- [Fluvius: tarieflijst Halle-Vilvoorde, niet-beschermde gedropte klanten, 01-10 t/m 31-12-2026](https://www.fluvius.be/sites/fluvius/files/2026-09/tarieven-niet-beschermde-gedropte-klanten-elektriciteit-fluvius-halle-vilvoorde-km-01102026-31122026.pdf). Daarin: accijns 4,876 c€ incl. btw, energiebijdrage 0. Ter vergelijking Q3: [Fluvius Antwerpen 01-07 t/m 30-09-2026](https://www.fluvius.be/sites/fluvius/files/2026-06/tarieven-fraude-en-zegelbreuk-elektriciteit-fluvius-antwerpen-01072026-30092026.pdf), met 0,193 + 4,748 c€ excl. btw.
- [Test-Aankoop: hervorming accijnzen](https://www.test-aankoop.be/woning-energie/gas-elektriciteit-mazout-pellets/nieuws/belgie-hervorming-accijnzen-gevolgen-energiefactuur) (2-9-2026). Van kracht sinds 1-8-2026. Accijnzen voor 3.500 kWh dalen van ±€183 naar €170,66 per jaar.
- Leverancierscontrole (één product, geen marktgemiddelde), Eneco-tariefkaarten oktober 2026: [Flex](https://cdn.eneco.be/downloads/nl/general/tk/BC_032_012610_NL_ENECO_POWER_FLEX.pdf), [Vast](https://cdn.eneco.be/downloads/nl/general/tk/BC_032_012610_NL_ENECO_POWER_FIX.pdf), [Dynamisch](https://cdn.eneco.be/downloads/nl/general/tk/BC_032_012610_NL_ENECO_POWER_DYNAMIC.pdf).
- [VRT NWS, 25-11-2025](https://www.vrt.be/vrtnws/nl/2025/11/25/20-euro-minder-voor-elektriciteit-16-meer-voor-gas-regulator-m/): nettarieven voor een gemiddeld gezin in 2026 €463 incl. btw, €20 lager dan in 2025.

**Onzekerheid.** De energiecomponent is sinds eind februari 2026 merkbaar gestegen (Test-Aankoop koppelt dat aan het Iran-conflict) en blijft volatiel. Een prijs van 0,32 €/kWh is een momentopname, geen voorspelling over 10 à 20 jaar.

---

## 2. Injectievergoeding (teruglevering) 2026

| Parameter | Laag | Midden | Hoog | Eenheid |
|---|---|---|---|---|
| Injectievergoeding van de leverancier | **0,01** | **0,04** | **0,07** | €/kWh (geen btw op injectie) |
| Nettarief op injectie (Fluvius, installatie ≤ 10 kVA) | **0** | 0 | 0 | €/kWh |

- **Marktspreiding, Test-Aankoop 28-5-2026.** Gemiddeld "3 à 4 cent per kWh". In mei 2026 lag de vergoeding bij een enkelvoudig tarief in Vlaanderen en Wallonië tussen **0,94 c€** (Mega Zen Fixed) en **4,90 c€** (Energy Knights, Eneco). Vóór eind februari 2026 lag ze onder 3 cent.
- **Recente leverancierscontrole, Eneco oktober 2026.** Geschatte jaarprijs **6,41 c€** (variabel) en **6,65 c€** (dynamisch). De maandprijs voor september 2026 was 9,04 c€. Daarom is de hoge waarde 7 c€.
- **Injectiekosten.** Fluvius rekent op injectie geen nettarief aan voor productie ≤ 10 kVA. Boven 10 kVA is dat 0,1751 c€/kWh excl. btw (VNR-tarieflijst Halle-Vilvoorde 2026). Bij de leverancier kan de vergoeding bij sommige variabele of dynamische formules **negatief** worden. Volgens schattingen van de Vlaamse regulator betaalden ±29.000 prosumenten in 2025 minstens één maand voor injectie (Test-Aankoop). Engie en Luminus garanderen bij variabele contracten geen negatieve vergoeding. Energyvision garandeert minstens 1 c€.

### Bronnen
- [Test-Aankoop: kosten geïnjecteerde zonnestroom](https://www.test-aankoop.be/woning-energie/hernieuwbare-energie/nieuws/kosten-geinjecteerde-zonnestroom) (28-5-2026).
- [VNR-tarieflijst Halle-Vilvoorde 2026, injectiepagina](https://assets.vlaamsenutsregulator.be/2025-11/FHV%20-%202026%20-%20ELEK.pdf): "Netgebruikers met decentrale productie <= 10 kVA betalen geen tarief voor het netgebruik voor hun injectie".
- Eneco-tariefkaarten oktober 2026 (zie punt 1). Leveranciersbron, ter peiling.

**Onzekerheid.** De vergoeding volgt de groothandelsprijs op zonne-uren. Die daalt structureel naarmate er meer PV bijkomt, dus 0,04 €/kWh over de hele levensduur is eerder optimistisch dan voorzichtig.

---

## 3. Capaciteitstarief 2026 (Fluvius Halle-Vilvoorde)

| Parameter | Laag | Midden | Hoog | Eenheid |
|---|---|---|---|---|
| Capaciteitstarief Halle-Vilvoorde 2026 | 56,04 excl. btw | **59,41 incl. btw** | — | €/kW/jaar |
| Vlaams gemiddelde 2026 (VNR) | 53,39 excl. btw | | | €/kW/jaar |
| Minimumbijdrage | 2,5 kW = €140,11 excl. / **€148,52 incl. btw** per jaar | | | |
| Gemiddelde maandpiek Vlaamse gezinnen | **4,24 kW** (VNR, verdeling november 2025) | | | kW |
| Verlaging van de gemiddelde maandpiek door een **thuisbatterij** | **0** | **0,5** | **1,5** (max. tot 2,5 kW-bodem) | kW |
| Bijhorende besparing, incl. btw | €0 | ≈ €30 | ≈ €89 | €/jaar |

- Tariff and rules come from the VNR: the average of 12 monthly peaks (15-minute peak), minimum 2.5 kW, and **only offtake peaks count**, injection peaks do not.
- **Wat een batterij in de praktijk doet** (Energent voor Stad Gent, 12-6-2024; Huawei LUNA, 2,5 kW laad- en ontlaadvermogen):
  - 0,5 kWh vrijgehouden capaciteit volstaat om de piek met "minstens 1 à 2,5 kW" te verlagen.
  - Netto levert dat bijna niets op, omdat het verlies aan zelfverbruik de winst op het capaciteitstarief opheft.
  - In de drie doorgerekende gevallen lag de winst op het capaciteitstarief rond €6, €18 en €33 per jaar. Ik heb die waarden afgelezen uit staafdiagrammen, ze zijn dus benaderend. Het ging om 2024-tarieven.
  - Zelfverbruikssturing alleen vlakt al een deel van de pieken af.
- De midden- en hoogwaarde (0,5 en 1,5 kW) zijn **mijn aannames**, binnen de door Energent gemeten 1 à 2,5 kW. De bovengrens volgt uit het gemiddelde 4,24 kW min de bodem van 2,5 kW = 1,74 kW.
- **EMS en slim laden.** Voor huishoudens met een wagen of warmtepomp kan de piekverlaging groter zijn. Daarvoor vond ik **geen Vlaamse meetstudie**. Laat de gebruiker zijn maandpieken uit Mijn Fluvius invullen.

### Bronnen
- [VNR: capaciteitstarief](https://www.vlaamsenutsregulator.be/elektriciteit-en-aardgas/nettarieven/capaciteitstarief) (update 11-06-2026) en de VNR-tarieflijst 2026 (zie punt 1).
- [Energent: Rapport praktijktest thuisbatterijen](https://energent.be/wp-content/uploads/2024/06/20240612-Rapport-praktijktest-thuisbatterijen-Final-1.pdf) (12-06-2024): 19 meetbatterijen en 518 installaties van Atom bv.
- [Vlaanderen.be: thuisbatterij](https://www.vlaanderen.be/bouwen-wonen-en-energie/groene-energie/zonnepanelen/thuisbatterij). Voorbeeld: een batterij van 2,5 kW beperkt een piek van 4,6 kW tot 2,1 kW.

**Onzekerheid.** Piekverlaging hangt volledig af van het kwartierprofiel van het gezin. Zonder Mijn Fluvius-data is elke kW-waarde een aanname.

---

## 4. PV-opbrengst Machelen (50,888 N; 4,450 O)

**De PVGIS-API is effectief opgevraagd op 30-10-2026.** Versies: v5.3 (PVGIS-SARAH3, 2005–2023) en v5.2 (SARAH2, 2005–2020). Instellingen: peakpower = 1, loss = 14%, kristallijn Si. Hoogte van de locatie volgens PVGIS: 45 m. Voorbeeld-URL: `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=50.888&lon=4.450&peakpower=1&loss=14&angle=35&aspect=0&outputformat=json`. PVGIS-conventie voor aspect: 0 = zuid, −90 = oost, 90 = west, −45 = zuidoost, 45 = zuidwest.

**Ruwe resultaten E_y (kWh/kWp/jaar):**

| Oriëntatie / helling | v5.3 vrijstaand | v5.3 "building-integrated" | v5.2 vrijstaand | SD_y v5.3 |
|---|---|---|---|---|
| Zuid 35° | **1.051,3** | 1.017,3 | 1.045,0 | 55 |
| Zuid 45° | 1.049,9 | — | 1.043,6 | 57 |
| Zuid optimaal (39°) | 1.053,7 | — | — | — |
| Zuid 20° | 1.009,4 | — | 1.003,4 | 50 |
| Zuid 10° | 953,8 | 926,5 | 948,2 | 46 |
| Zuidoost 35° | 997,4 | 965,8 | 990,7 | 54 |
| Zuidwest 35° | 980,4 | 950,2 | 975,0 | 46 |
| Zuidoost 10° | 932,7 | — | 927,1 | 46 |
| Zuidwest 10° | 927,6 | — | 922,4 | 43 |
| Oost 10° | 875,7 | 852,4 | 870,4 | 42 |
| West 10° | 868,2 | 845,5 | 863,6 | 38 |
| Oost 35° | 842,9 | — | 837,2 | 44 |
| West 35° | 820,3 | — | 816,2 | 33 |
| Plat 0° | 877,2 | 854,2 | 872,2 | 41 |
| Verticaal zuid 90° | 756,4 | — | 752,7 | 45 |

**Maandprofiel, zuid 35°, v5.3 (kWh/kWp):** 38, 55, 93, 119, 128, 126, 126, 114, 101, 73, 45, 33. Bruikbaar voor een maandmodel.

**Waarden voor de calculator (kWh/kWp/jaar).** Laag = PVGIS "building-integrated" (warmere modules, conservatief), hoog = PVGIS vrijstaand, midden = het gemiddelde van beide (eigen keuze):

| Dak | Laag | Midden | Hoog |
|---|---|---|---|
| Zuid 30–40° | 1.017 | 1.034 | 1.051 |
| Zuidoost 35° | 966 | 982 | 997 |
| Zuidwest 35° | 950 | 965 | 980 |
| Oost-west 10° (½ oost + ½ west) | 849 | 860 | 872 |
| Oost-west 35° | niet berekend (BIPV) | — | 832 (vrijstaand) |
| Plat dak, zuid 10° opgesteld | 927 | 940 | 954 |
| Plat dak, liggend 0° | 854 | 866 | 877 |

- **Schaduw en extra verliezen** zitten niet in deze cijfers (PVGIS rekent met 14% systeemverlies). Voorzie een schaduwfactor als invoer (bv. 0–20%) en geef een Zonnekaart- of offertewaarde voorrang.
- **Jaar-op-jaarvariatie:** de standaardafwijking SD_y bedraagt 33–57 kWh/kWp, ofwel ±4–5%.
- **Degradatie:** midden **0,5%/jaar** en voorzichtig **0,8%/jaar**.
  - Jordan & Kurtz (NREL, 2013) vonden een mediaan van 0,5%/jaar over bijna 2.000 metingen.
  - Jordan et al. (2016, meer dan 11.000 metingen) vonden voor x-Si een mediaan van 0,5–0,6%/jaar en een gemiddelde van 0,8–0,9%/jaar.
  - Ik heb deze cijfers via secundaire samenvattingen gecontroleerd. De primaire NREL-pagina was in deze sessie niet bereikbaar (DNS-fout).

### Bronnen
- [JRC PVGIS-API v5.3 en v5.2](https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=50.888&lon=4.450&peakpower=1&loss=14&angle=35&aspect=0&outputformat=json), opgevraagd op 30-10-2026.
- Jordan, D.C. & Kurtz, S.R. (2013), "Photovoltaic Degradation Rates – an Analytical Review", *Progress in Photovoltaics* 21:12–29.
- Jordan, D.C. et al. (2016), "Compendium of photovoltaic degradation rates", *Progress in Photovoltaics* 24:978–989.

**Onzekerheid.** De ruimtelijke en klimatologische nauwkeurigheid van PVGIS is goed. De grootste fout komt van schaduw, opstelling en omvormerkeuze op het concrete dak, niet van de instraling.

---

## 5. Zelfverbruik zonder en met thuisbatterij

### 5a. Direct zelfverbruik zonder batterij, in functie van r = jaarproductie PV / jaarverbruik

Ik heb de waarden uit de simulatietabellen van de HTW Berlin Unabhängigkeitsrechner gelezen ([tabelleEigenverbrauch.json](https://solar.htw-berlin.de/unabhaengigkeitsrechner/js/tabelleEigenverbrauch.json) en tabelleAutarkie.json, opgehaald op 30-10-2026). HTW drukt de PV-grootte uit in kWp per MWh. Ik heb die omgerekend met de HTW-opbrengst van 1.024 kWh/kWp, wat dicht bij Machelen ligt (1.017–1.051).

| r (PV/verbruik) | 0,25 | 0,5 | 0,75 | **1,0** | 1,25 | **1,5** | 2,0 | 3,0 |
|---|---|---|---|---|---|---|---|---|
| Zelfverbruiksaandeel (% van de PV-productie) | 65,5 | **47,0** | 36,8 | **30,2** | 25,7 | **22,4** | 17,8 | 12,8 |
| Autarkie (% van het verbruik) | 16,4 | 23,5 | 27,6 | 30,2 | 32,1 | 33,6 | 35,7 | 38,3 |

The no-battery values are independent of the absolute consumption level in the HTW model.

**Waarden voor de calculator (zonder batterij):**
- midden = HTW-tabel
- laag = HTW × 0,85
- hoog = HTW × 1,15

The ±15% follows Energent's recommendation: correct by 15% for households with very low or very high daytime consumption. In 73% of the measured Flemish installations, reality fell within ±10% of their formula.

**Controle met Vlaamse meetdata.** Energent meet een gemiddeld zelfverbruik zonder batterij van **25,1%** over 518 installaties. Vlaanderen.be noemt **28%**. Beide passen bij HTW voor r ≈ 1,0–1,3.

### 5b. Extra zelfverbruik door een thuisbatterij

HTW-tabel voor een verbruik van 3.500 kWh/jaar. **De capaciteit is de bruikbare capaciteit.** HTW rekent met een systeemrendement van 83,9%.

| r | Zonder batterij: zelfverbruik / autarkie | 5 kWh bruikbaar | 10 kWh bruikbaar | 15 kWh bruikbaar |
|---|---|---|---|---|
| 0,5 | 47,0% / 23,5% | 96,6% / 44,3% | 99,5% / 45,6% | 99,9% / 45,8% |
| 1,0 | 30,2% / 30,2% | 67,3% / 61,4% | 74,5% / 67,5% | 76,2% / 68,9% |
| 1,5 | 22,4% / 33,6% | 49,1% / 67,3% | 55,1% / 74,8% | 56,6% / 76,7% |

**Batterij-ontlading in kWh/jaar,** gelijk aan de vermeden netafname (= Δautarkie × verbruik). Bij V = 3.500 kWh:
- r = 0,5: 728 (5 kWh), 774 (10 kWh), 781 (15 kWh)
- r = 1,0: 1.092, 1.306, 1.355
- r = 1,5: 1.180, 1.442, 1.509

Boven ±1,5 kWh per 1.000 kWh verbruik wint een grotere batterij nauwelijks nog iets. Dat is ook de HTW-aanbeveling: max. 1,5 kWh bruikbaar per MWh verbruik en per kWp.

**Vlaamse empirische formule (Energent, 2024).** C is de **nominale** capaciteit in kWh (90% bruikbaar). P en V zijn in kWh/jaar.

```
ΔAC_5kWh  = −1407 + 266 · ln(P·V/1000)            (R² = 0,67)
ΔAC_10kWh = −3016 + 467 · ln(P·V/1000)            (R² = 0,61)
ΔAC(C)    = (376 − 107·ln C) · C · ( −(0,18·C + 0,483) + (0,0198·C + 0,163) · ln(P·V/1000) )
```

ΔAC is de verhoogde autoconsumptie in kWh/jaar, gelijk aan het ontlaadvolume.

**Vergelijking bij P = V = 3.500:**

| Nominaal | HTW (bij 90% bruikbaar) | Energent |
|---|---|---|
| 5 kWh | 1.033 | 1.104 |
| 10 kWh | 1.286 | 1.446 |
| 15 kWh | 1.344 | 1.484 |

Energent ligt 5–40% hoger dan HTW. Het verschil is het grootst bij kleine P·V, waar Energent weinig datapunten heeft. **Calculator: laag = HTW, hoog = Energent, midden = gemiddelde.**

### Bronnen
- [HTW Berlin: Unabhängigkeitsrechner](https://solar.htw-berlin.de/rechner/unabhaengigkeitsrechner/) en [FAQ met de aannames](https://solar.htw-berlin.de/faq-unabhaengigkeitsrechner/), gecontroleerd 30-10-2026. Aannames: simulatie per minuut, VDI 4655-lastprofiel zonder warmtepomp of EV, 1.024 kWh/kWp, batterij 95% × omvormer 2 × 94% = 83,9%.
- [Energent 2024](https://energent.be/wp-content/uploads/2024/06/20240612-Rapport-praktijktest-thuisbatterijen-Final-1.pdf) (zie punt 3).
- [Vlaanderen.be: thuisbatterij](https://www.vlaanderen.be/bouwen-wonen-en-energie/groene-energie/zonnepanelen/thuisbatterij).

**Onzekerheid.** Beide modellen gelden voor een gezin zonder warmtepomp of elektrische wagen. Met zulke verbruikers en een EMS kan het zelfverbruik hoger liggen, maar daarvoor vond ik **geen onderbouwde Belgische cijfers**.

---

## 6. Investeringskosten 2026 en btw

### Waarden voor de calculator (incl. plaatsing en 6% btw, woning ouder dan 10 jaar)

| Maatregel | Laag | Midden | Hoog | Eenheid | Basis |
|---|---|---|---|---|---|
| Zonnepanelen (3–10 kWp) | **800** | **1.000** | **1.400** | €/kWp | Test-Aankoop, zie toelichting |
| Thuisbatterij | **600** | **750** | **900** | €/kWh nominaal | Energent 2024 en Test-Aankoop 2025, zie toelichting |
| Warmtepompboiler | — | **3.500** | — | € per toestel | Vlaanderen.be (geen bandbreedte gepubliceerd) |
| Laadpaal (toestel + installatie) | **700** | **2.380** | **4.060** | € | Test-Aankoop 4-5-2026 |
| Airco / lucht-luchtwarmtepomp, monosplit | **1.500** | **2.250** | **3.000** | € | Test-Aankoop |

**Toelichting per maatregel:**
- **Zonnepanelen.**
  - Test-Aankoop (30-6-2025): offertes gemiddeld **±€1.000/kWp**, "hier en daar" onder €800/kWp. De prijs per kWp daalt bij grotere installaties. Of dat incl. btw is, staat er niet bij.
  - Peilingen bij leadgeneratiesites voor 2026: €1,0–1,5/Wp en €1,2–1,8/Wp. De hoge waarde (€1.400) is daarop gebaseerd en daarmee zwakker onderbouwd.
  - Gebruik bij 3–4 kWp eerder de bovenste helft van de bandbreedte, bij 8–10 kWp de onderste. Dat is kwalitatief, op basis van Test-Aankoop. Een sluitende formule vond ik niet.
- **Thuisbatterij.**
  - Energent, groepsaankoop 2024: **€901/kWh** (5 kWh) en **€742/kWh** (10 kWh) incl. btw.
  - Test-Aankoop (22-7-2025): gemiddeld **€850/kWh** voor 5 kWh en **€600/kWh** voor 15 kWh.
  - Een gezaghebbende Belgische prijsbron voor 2026 vond ik **niet**. Prijzen zijn waarschijnlijk verder gedaald, maar dat is niet gestaafd.
  - Een eventuele hybride omvormer of vervangomvormer is niet inbegrepen.
- **Warmtepompboiler.**
  - €3.500 is het gemiddelde dat Vlaanderen.be publiceert, incl. btw en plaatsing.
  - Laag en hoog zijn niet in een gezaghebbende bron gevonden. Vul ze in met NEST-offertebanden.
  - Voor de premie moet de factuur minstens €1.000 excl. btw bedragen.
- **Laadpaal.** Test-Aankoop (4-5-2026): toestel €500–2.660 plus installatie €200–1.400. Of dat incl. btw is, staat er niet bij. Laag en hoog zijn de sommen van de grenzen. Midden is het rekenkundige midden (1.580 + 800), een eigen berekening.
- **Airco / lucht-luchtwarmtepomp.** Test-Aankoop: "€1.500 tot €3.000 incl. btw, plaatsing inbegrepen". Midden = rekenkundig midden. De pagina vermeldt geen datum, alleen © 2026.

### Btw-regeling 2026

| Werk | Woning ≥ 10 jaar | Woning < 10 jaar / nieuwbouw |
|---|---|---|
| Zonnepanelen (PV) | **6%** (renovatieregime; Test-Aankoop noemt pv-panelen expliciet) | **21%** |
| Thuisbatterij | **Niet officieel bevestigd.** Installateurs passen 6% toe als werk in onroerende staat, maar een FOD-tekst die batterijen expliciet noemt, vond ik niet. | 21% |
| Warmtepomp en **warmtepompboiler** | 6% | **6%** van 01-01-2026 t/m 31-12-2030 (circulaire 2026/C/19 van 20-01-2026, warmtepompboilers expliciet inbegrepen). Hybride en louter koelende toestellen zijn uitgesloten. Privéwoning en eindverbruiker zijn vereist. |
| Airco / lucht-lucht | 6% voor vaste installaties (Test-Aankoop) | 21%. Als het toestel bedoeld is om te verwarmen, kan de circulaire van toepassing zijn. Dat is **niet zeker**, controleer het per geval. |
| Laadpaal | **Niet bevestigd** | 21% |
| Dakisolatie / dakwerken | 6% (dakisolatie expliciet vermeld) | 21% |
| Gas- of mazoutketel (ter info) | **21%** sinds 29-07-2025 | 21% |

Calculator: zonnepanelen ×1,1415 (= 1,21/1,06) bij een woning jonger dan 10 jaar.

### Bronnen
- [Test-Aankoop: rendement zonnepanelen](https://www.test-aankoop.be/woning-energie/hernieuwbare-energie/nieuws/zonnepanelen-blijven-rendabel) (30-6-2025).
- [Test-Aankoop: kosten thuisbatterij](https://www.test-aankoop.be/woning-energie/hernieuwbare-energie/dossier/batterij-optimaliseren-zonnepanelen/kosten-thuisbatterij) (22-7-2025).
- [Energent 2024](https://energent.be/wp-content/uploads/2024/06/20240612-Rapport-praktijktest-thuisbatterijen-Final-1.pdf).
- [Vlaanderen.be: warmtepompboiler](https://www.vlaanderen.be/bouwen-wonen-en-energie/groene-energie/warmtepompboiler).
- [Test-Aankoop: laadpaal koopgids](https://www.test-aankoop.be/mobiliteit/auto-s/koopgids/laadpalen) (4-5-2026).
- [Test-Aankoop: kostprijs lucht-luchtwarmtepomp](https://www.test-aankoop.be/woning-energie/huis-water-verwarmen/dossier/lucht-luchtwarmtepompen/hoeveel-kost-een-lucht-luchtwarmtepomp).
- [Test-Aankoop: btw voor werkzaamheden aan de woning](https://www.test-aankoop.be/geld/belastingen/dossier/btw-voor-werkzaamheden-aan-de-woning-belgie) (9-2-2026).
- [FOD Financiën: verbouwen, btw-tarief](https://fin.belgium.be/nl/particulieren/woning/bouwen-verbouwen/verbouwen/verbouwen-btw-tarief).
- [Circulaire 2026/C/19, samenvatting met citaten](https://blog.forumforthefuture.be/nl/article/circulaire-2026c19-betreffende-de-herinvoering-van-een-verlaagd-btw-tarief-voor-de-levering-met-plaatsing-van-warmtepompen/29972).

**Onzekerheid.** Er bestaat geen officiële Belgische prijsstatistiek voor installaties bij particulieren. Deze bandbreedtes zijn consumentenorganisatie- en groepsaankoopcijfers van 2024–2026 en moeten met NEST-offertes gekalibreerd worden.

---

## 7. Premies in Vlaanderen 2026

| Maatregel | Premie (aanvraag vanaf 1-3-2026) | Voorwaarden |
|---|---|---|
| **Zonnepanelen** | **Geen** | De Fluvius-premie is stopgezet voor installaties met keuring vanaf 1-1-2024. Er is geen categorie in Mijn VerbouwPremie. |
| **Thuisbatterij** | **Geen** | Geen categorie in Mijn VerbouwPremie. De vlaanderen.be-pagina over thuisbatterijen vermeldt geen premie. De exacte stopdatum van de vroegere batterijpremie heb ik niet op vlaanderen.be gecontroleerd; secundaire bronnen spreken van afschaffing per 1-1-2024. |
| **Warmtepompboiler** | Cat. 1 en 2: **€450**, max. 20% (cat. 1) of 25% (cat. 2) van de factuur excl. btw. Cat. 3: **€1.050**, max. 35%. Cat. 4 of verhuur aan woonmaatschappij: **€1.200**, max. 50%. | Factuur ≥ €1.000 excl. btw. Label A+ of beter. Regeling voor extern signaal (thermische opslag) verplicht. Alleen sanitair warm water. Plaatsing door aannemer. Eén premie per 10 jaar. Cat. 1 en 2 kunnen aanvragen t/m 31-12-2027. |
| Warmtepomp (ter info) | Cat. 1 en 2: lucht-water €1.500, lucht-lucht €300, hybride €800, geothermisch €4.000 | |
| **Dakisolatie** | Cat. 1 en 2: **geen premie meer** voor aanvragen vanaf 1-3-2026 (tot 28-2-2026 was dat €8 resp. €16/m²). Cat. 3: tot **35%** van de factuur, max. **€4.025**. Cat. 4: tot **50%**, max. **€5.750**. Factuurbedrag €1.000–11.500 excl. btw. Plus €8/m² bij asbestverwijdering. | Nieuwe isolatie Rd ≥ **4,5 m²K/W**. Dampscherm bij isolatie langs binnen. Uitvoering door aannemer. Factuur max. 2 jaar oud. |
| Algemeen | | De woning moet vóór 1-1-2014 aangesloten zijn op het net, of de vergunning moet meer dan 5 jaar vóór de eindfactuur verleend zijn. Niet-woongebouwen komen sinds 1-3-2026 niet meer in aanmerking. De inkomensgrenzen per categorie heb ik niet opgehaald (zie de simulator 2026). |

Een federale premie voor deze maatregelen vond ik niet. Voor een laadpaal noemt Test-Aankoop (mei 2026) geen premie of fiscaal voordeel.

### Bronnen
- [Vlaanderen.be: wijzigingen Mijn VerbouwPremie vanaf 2026](https://www.vlaanderen.be/bouwen-wonen-en-energie/bouwen-en-verbouwen/premies-voor-renovatie/mijn-verbouwpremie/wijzigingen-mijn-verbouwpremie-vanaf-2026), gecontroleerd 30-10-2026.
- [Mijn VerbouwPremie voor warmtepompboiler](https://www.vlaanderen.be/bouwen-wonen-en-energie/bouwen-en-verbouwen/premies-voor-renovatie/mijn-verbouwpremie/mijn-verbouwpremie-voor-warmtepompboiler).
- [Mijn VerbouwPremie voor dak](https://www.vlaanderen.be/bouwen-wonen-en-energie/bouwen-en-verbouwen/premies-voor-renovatie/mijn-verbouwpremie/mijn-verbouwpremie-voor-dak).
- [Werken die in aanmerking komen](https://www.vlaanderen.be/bouwen-wonen-en-energie/bouwen-en-verbouwen/premies-voor-renovatie/mijn-verbouwpremie/werken-die-in-aanmerking-komen-voor-mijn-verbouwpremie).
- [Fluvius-premie zonnepanelen (stopgezet)](https://www.vlaanderen.be/premie-voor-zonnepanelen-op-gebouwen-fluvius-stopgezet).
- Ter context: [Test-Aankoop: renovatiepremies Vlaanderen 2026](https://www.test-aankoop.be/woning-energie/isolatie/nieuws/vlaanderen-nieuwigheden) (15-10-2026). Volgens dit artikel kunnen de premies voor warmtepompboilers "vanaf 1 januari 2028" verdwijnen.

**Onzekerheid.** Het premiebeleid wijzigt bijna jaarlijks. Toon premies als aparte, optionele aftrek met de aanvraagdatum en de inkomenscategorie erbij, en reken standaard met €0 voor categorie 1 en 2 (behalve voor warmtepomp en warmtepompboiler).

---

## 8. Dakisolatie

### Waarden voor de calculator

| Parameter | Laag | Midden | Hoog | Eenheid | Bron |
|---|---|---|---|---|---|
| U-waarde vóór isolatie (ongeïsoleerd hellend dak) | **1,7** | 2,2 (interpolatie) | **2,7** (afgeleid) | W/m²K | zie toelichting |
| U-waarde na isolatie | **0,24** (EPB-eis daken en plafonds, nieuwbouw en renovatie 2026) | | | W/m²K | EPB-brochure 2026 |
| Graaddagen Ukkel, basis 15/15 | 1.835 | **1.835** (normaal 1991–2020) | 2.127 (normaal 1961–1990, koud scenario) | Kd/jaar | KMI |
| Seizoensrendement verwarming (gas) | 0,95 | **0,90** | **0,86** (ecodesign-minimum nieuwe ketel sinds 2015; oudere ketels lager, maar geen bron gevonden) | — | Verordening 813/2013 |
| Gasprijs, vermijdbaar, incl. btw (Halle-Vilvoorde, T2) | **0,096** | **0,11** | **0,13** | €/kWh (bovenwaarde) | CREG, VNR, Eneco |
| Besparing aan brandstof per m² dak | **~71** | **~95** | **~120** | kWh/m²/jaar | eigen formule, zie punt 9 van het rekenmodel |
| Kostprijs, hellend dak langs binnen (wol tussen kepers) | **75** | 105 | **135** | €/m² | Test-Aankoop 2025 en 2022 |
| Kostprijs, sarking / langs buiten met nieuwe dakbedekking | **210** | 290 | **370** | €/m² | Test-Aankoop 2022 en 2025 |

**Toelichting:**
- **U-waarde vóór isolatie.** De enige gedocumenteerde waarde die ik vond, is **1,70 W/m²K** voor een "ongeïsoleerde dakconstructie" (leiendak) in een referentiewoning. Bron: VEKA-studie kostenoptimale renovatie, Thomas More / KU Leuven, juni 2015.
  - De hoge waarde is **afgeleid** uit Test-Aankoop (2022, gepubliceerd via vlaanderen.be): "langs één vierkante meter niet-geïsoleerd dak [gaat] ongeveer 13 liter stookolie per jaar verloren". Met 15 cm glaswol wordt dat 1 liter, een besparing van 12 l/m².
  - Met ±10 kWh per liter stookolie (eigen benaderende omrekening) is dat ±120 kWh/m²/jaar. Dat komt in mijn formule overeen met U ≈ 2,7.
- **Gasprijs.** Opbouw incl. btw:
  - energie 7,3–10,5 c€ (CREG-marktspreiding okt. 2026, 17.000 kWh; Eneco Flex 8,46–9,12)
  - distributie 0,98 c€ (Halle-Vilvoorde, T2)
  - transport Fluxys ±0,165 c€
  - accijns 1,183 c€ (boven 12.000 kWh)
- **Plafond.** Fluvius Dakinzicht: het dak kan tot 30% van het warmteverlies uitmaken. Begrens de dakbesparing dus op 30% van het huidige verwarmingsverbruik. Dat staat al in het bestaande register; de pagina heb ik vandaag niet opnieuw gecontroleerd.
- **Kosten.**
  - Test-Aankoop, "isoleren in 5 vragen" (prijzen okt. 2025, btw-status niet vermeld): wol tussen kepers €75–85/m², ingeblazen cellulose €85–110, sarking €310–370.
  - Test-Aankoop 2022: langs binnen €110–135/m² (incl. dampscherm en afwerking), langs buiten €210–290/m².
  - Zoldervloerisolatie: alleen een VEKA-studie van 2015 gevonden (± €30–60/m²). Die is te oud voor 2026, gebruik ze niet.

### Bronnen
- [EPB-eisen 2026, brochure](https://publicaties.vlaanderen.be/view-file/83595): Umax daken en plafonds 0,24 W/m²K.
- [KMI: graaddagen Ukkel, basis 15/15](https://www.meteo.be/nl/klimaat/klimaat-van-belgie/klimaatnormalen-te-ukkel/luchttemperatuur/temperatuurindices/graaddagen). Jaarnormalen: 1961–1990 = 2.127,1; 1971–2000 = 2.033,3; 1981–2010 = 1.940,2; **1991–2020 = 1.835,2**.
- [VEKA / Thomas More: kostenoptimale EPB-eisen, renovatie](https://assets.vlaanderen.be/image/upload/v1662987375/EPB-beleid_-_Kostenoptimale_EPB-eisen_voor_residenti%C3%ABle_gebouwen_Studie_renovatie_rgfnki.pdf) (juni 2015).
- [Test-Aankoop: "Dakisolatie rendeert"](https://assets.vlaanderen.be/image/upload/v1674038288/TA_2207_Dakisolatie-rendeert_gx08un.pdf) (2022, via vlaanderen.be).
- [Test-Aankoop: isoleren in 5 vragen](https://test-aankoop.be/woning-energie/isolatie/dossier/isoleren-in-5-vragen) (prijzen okt. 2025).
- [Ecodesign-verordening (EU) 813/2013, bijlage II](https://www.legislation.gov.uk/eur/2013/813/annex/II/adopted): seizoensrendement van ketels ≤ 70 kW "shall not fall below 86 %" vanaf 26-9-2015. Dit is de UK-kopie van de EU-tekst; EUR-Lex gaf in deze sessie een lege pagina.
- Gas: VNR-tarieflijst aardgas 2026 (Halle-Vilvoorde T2: 9,80 €/MWh incl. btw), [Eneco Aardgas Flex okt. 2026](https://cdn.eneco.be/downloads/nl/general/tk/BC_032_012610_NL_ENECO_GAS_FLEX.pdf) en de CREG-infografiek okt. 2026.
- [VNR: energieverbruik](https://www.vlaamsenutsregulator.be/elektriciteit-en-aardgas/energieprijzen-en-facturen/energieverbruik): verwarming met gas, doorsnee 17.000 kWh/jaar.

**Onzekerheid.** De U-waarde vóór isolatie is de grootste onbekende. Een dak met onderdak en afwerking, een dak zonder en een al licht geïsoleerd dak verschillen een factor 2 à 3. Vraag de bezoeker daarom naar de huidige toestand (niets, of een paar cm) en of de zolder verwarmd is.

---

## 9. Warmtepompboiler

| Parameter | Laag | Midden | Hoog | Eenheid | Bron |
|---|---|---|---|---|---|
| Nuttige warmwaterbehoefte (EU-tapprofiel) | **2.133** (profiel M: 5,845 kWh/dag) | ±3.200 (interpolatie) | **4.254** (profiel L: 11,655 kWh/dag); XL = 6.961 | kWh nuttige warmte/jaar | Verordening 814/2013 |
| Verbruik van de huidige elektrische boiler | ≥ nuttige behoefte, plus stilstandsverlies | | | kWh/jaar | Stilstandsverlies **niet gekwantificeerd** met een bron |
| Efficiëntiefactor warmtepompboiler t.o.v. een elektrische boiler | **2,5** (eigen voorzichtigheidsmarge, geen bron) | **3,0** | **3,5–4,0** | — | Vlaanderen.be: "3 tot 4 keer zuiniger" |
| Levensduur | 15 (aanname) | **20** | 20 | jaar | VEKA-studie 2015, sanitair warm water "Warmtepomp" 20 jaar |
| Onderhoud | | **€100/jaar** | | € | VEKA-studie 2015 (oud) |

- **Vlaanderen.be:**
  - ±70% van de energie komt uit de lucht.
  - De boiler werkt zonder weerstand tot −5 °C buitenlucht. De warmtepomp verwarmt tot 55 °C, daarboven springt de weerstand bij.
  - Kost gemiddeld €3.500.
  - Formaat M volstaat voor een gezin van 4. Dat is de grootteklasse van de fabrikant, niet hetzelfde als het EU-tapprofiel M.
- **Interactie met PV.** De premievoorwaarde vereist een regeling die bij een extern signaal de watertemperatuur verhoogt, voor thermische opslag van zonnestroom. Hoeveel extra zelfverbruik dat oplevert, heb ik in **geen** Belgische bron gekwantificeerd gevonden.
- **Plaatsing binnen.** De boiler onttrekt warmte aan de ruimte waarin hij staat. In een verwarmde ruimte verhoogt dat de warmtevraag. Dit blijft niet gemodelleerd, zoals in het bestaande register.

### Bronnen
- [Vlaanderen.be: warmtepompboiler](https://www.vlaanderen.be/bouwen-wonen-en-energie/groene-energie/warmtepompboiler) (gecontroleerd 30-10-2026, geen datum op de pagina).
- [Verordening (EU) 814/2013, bijlage III, tabel 1](https://www.legislation.gov.uk/eur/2013/814/annex/III/adopted): Qref M = 5,845, L = 11,655, XL = 19,07 kWh/dag. Jaarwaarden = ×365, eigen berekening.
- VEKA-studie 2015, bijlage C, levensduren (link onder punt 8).

**Onzekerheid.** De praktijk-COP van warmtepompboilers in Belgische woningen heb ik **niet** in een veldmeting gevonden. Factor 3 is de officiële ondergrens van Vlaanderen.be, en veldstudies voor warmtepompen in het algemeen tonen dat praktijkwaarden onder catalogus- en labowaarden liggen.

---

## 10. Levensduur en onderhoud

| Onderdeel | Laag | Midden | Hoog | Eenheid | Bron |
|---|---|---|---|---|---|
| PV-panelen | 20 | **25** | 30 (alleen leadgeneratiesites) | jaar | Vlaanderen.be noemt 25 jaar op de zonnepanelenpagina en 20 jaar in de milieusectie; de VEKA-studie 2015 rekent met 20 jaar. |
| Omvormer | **10** | 12 | 15 | jaar | VEKA-studie 2015: "overige" 10 jaar. Peiling via leadgeneratiesites: 10–15 jaar, micro-omvormers langer. |
| Vervanging omvormer | 500 | 1.000 | 1.500 | € | Alleen een peiling via Bobex (leadgeneratie) |
| Onderhoud PV | | 30–70 | | €/jaar | VEKA-studie 2015, naargelang kWp (oud) |
| Thuisbatterij: kalenderlevensduur | **10** | 12–15 | **20** | jaar | Energent 2024: "10 à 20 jaar" |
| Thuisbatterij: garantie | product 5–15, prestatie 10–15 | | | jaar | HTW Stromspeicher-Inspektion 2026, tabel 7 |
| Thuisbatterij: gegarandeerde restcapaciteit | 60 | 80 ("in vielen Fällen" na 10 jaar) | 85 | % | HTW 2026 |
| Thuisbatterij: gegarandeerde doorvoer | 2,6 | — | 8,5 | MWh per kWh capaciteit | HTW 2026. Voorbeeld: 10 kWh, 26 MWh over 10 jaar. |
| Thuisbatterij: garantiecycli | 3.500 | — | 10.000 | equivalente volle cycli | HTW 2026 |
| Thuisbatterij: werkelijk gebruik | 150 | — | 300 | equivalente volle cycli/jaar | HTW 2026 |
| Thuisbatterij: capaciteitsverlies | 2 | 2,5 | 3 | %-punt per jaar | HTW 2026, gemeten bij systemen van 2015. Volgens HTW is vandaag minder te verwachten. |
| Batterijrendement (batterij zelf) | 87,9 | >95 typisch | 97,1 | % | HTW 2026 |
| Systeemrendement, rondgang AC→AC | 84 (HTW-rekenaanname) | | | % | HTW-FAQ |
| Stand-by bij lege batterij | 4 | — | 64 | W | HTW 2026. Batterij typisch 1.250–3.500 u/jaar leeg, dus ±5–220 kWh/jaar (eigen berekening). |
| Warmtepompboiler | | 20 | | jaar | VEKA-studie 2015 |
| Lucht-luchtwarmtepomp / airco | | **12,5** | | jaar | VEKA-studie 2015. Onderhoud €175/jaar volgens dezelfde studie (oud). |
| Dakisolatie | | 90 | | jaar | VEKA-studie 2015 (bouwkundig) |

### Bronnen
- [HTW / aquu: Stromspeicher-Inspektion 2026](https://solar.htw-berlin.de/wp-content/uploads/HTW-aquu-Stromspeicher-Inspektion-2026.pdf) (versie 1.0, maart 2026; garantieanalyse december 2025).
- [Energent 2024](https://energent.be/wp-content/uploads/2024/06/20240612-Rapport-praktijktest-thuisbatterijen-Final-1.pdf).
- [Vlaanderen.be: zonnepanelen](https://www.vlaanderen.be/bouwen-wonen-en-energie/groene-energie/zonnepanelen).
- VEKA-studie 2015 (link onder punt 8).

**Onzekerheid.** Batterijlevensduur in Belgisch residentieel gebruik is nauwelijks langer dan 10 jaar gemeten. Garanties beperken vaak de doorvoer en niet alleen de jaren.

---

## Aanbevolen rekenmodel

Notatie:
- V = jaarverbruik elektriciteit (kWh)
- P = PV-productie (kWh/jaar)
- p_a = vermijdbare afnameprijs (€/kWh)
- p_i = injectievergoeding (€/kWh)
- alle € incl. btw

**1. PV-productie**

```
P = kWp × Y_or × (1 − schaduw)
```

Y_or komt uit de PVGIS-tabel van punt 4. In jaar n geldt P_n = P × (1 − d)^(n−1), met d = 0,005 (midden) of 0,008 (voorzichtig).

**2. Direct zelfverbruik zonder batterij**

```
r     = P / V
SC0   = f_HTW(r) × k_profiel        (k = 0,85 / 1,0 / 1,15 voor overdag weinig / gemiddeld / veel thuis)
E_dir = min(SC0 × P, V)
E_inj = P − E_dir
```

f_HTW is lineaire interpolatie in de tabel van punt 5a.

**3. Batterij** (C_b = bruikbare kWh, η = rondgangsrendement 0,84–0,90)

```
E_ont  = ΔA(r, C_b/V) × V                        laag: HTW-tabel; hoog: Energent ΔAC(C_nom); midden: gemiddelde
         Begrens: E_ont ≤ V − E_dir  en  E_ont ≤ η × E_inj
E_laad = E_ont / η
Batterijwinst (€/jaar) = E_ont × p_a − E_laad × p_i  (− stand-byverbruik × p_a)
```

**4. Jaarlijkse elektriciteitsbesparing PV + batterij**

```
B_el = (E_dir + E_ont) × p_a + (E_inj − E_laad) × p_i
```

p_i mag negatief zijn. Bij een dynamisch contract rekent u met p_a ≈ 0,21 voor E_dir en met p_a,avond voor E_ont. Die avondprijs is **niet onderzocht**: gebruik de gewone p_a als bovengrens.

**5. Capaciteitstarief**

```
B_cap = max(0, min(ΔkW, P_piek,gem − 2,5)) × 59,41 €/kW/jaar      (Halle-Vilvoorde 2026, incl. btw)
```

ΔkW is standaard 0 / 0,5 / 1,5. Gebruik de echte maandpieken uit Mijn Fluvius als die beschikbaar zijn.

**6. Warmtepompboiler** (E_boiler = huidig verbruik van de elektrische boiler, kWh/jaar)

```
E_wpb = E_boiler / F         (F = 2,5 / 3,0 / 3,5)
B_wpb = (E_boiler − E_wpb) × p_a'
```

p_a' ligt tussen p_a en de waarde van eigen zonnestroom, als de boiler op PV-overschot draait. Kort samengevat: (1 − 1/F) × E_boiler × p_a.

**7. Dakisolatie** (A = isolatieoppervlak in m², GD = 1.835 Kd, η_verw = 0,90)

```
ΔQ_m2   = (U_voor − U_na) × GD × 24 / 1000            [kWh nuttige warmte per m² per jaar]
E_brand = A × ΔQ_m2 / η_verw
          Begrens: E_brand ≤ 0,30 × huidig verwarmingsverbruik   (Fluvius: dak tot 30% van het warmteverlies)
B_dak   = E_brand × p_gas                                          (0,096 / 0,11 / 0,13 €/kWh)
```

Rekenvoorbeeld per m²: U 1,7 → 0,24 geeft 64 kWh warmte en ±71 kWh gas, dus ±€7,9/m²/jaar. U 2,7 → 0,24 geeft ±120 kWh gas, dus ±€13/m²/jaar. Bij een warmtepomp: E_el = ΔQ / SCOP × p_a. De SCOP is **niet onderzocht** in dit dossier.

**8. Terugverdientijd**

```
I_netto = I_bruto (incl. juiste btw) − premie (alleen indien aangevinkt en categorie bekend)
TVT_eenvoudig = I_netto / B_jaar
TVT_levensduur: kleinste N waarvoor Σ_{n=1..N} [B_n − O_n] ≥ I_netto + vervangingen
```

- B_n houdt rekening met de degradatie.
- O_n is het onderhoud.
- Vervangingen: omvormer na 10–15 jaar, batterij als N groter is dan de batterijlevensduur.

Toon de TVT alleen als B_jaar > 0. Toon een waarschuwing als de TVT langer is dan de levensduur, bv. batterij > 12 jaar.

**9. Bandbreedte.** Combineer niet alle "laag"-waarden tot één scenario. Gebruik:
- **pessimistisch** = lage prijzen, lage opbrengst, hoge kosten
- **optimistisch** = omgekeerd
- **midden** = alle middenwaarden

Zo krijgt de bezoeker een eerlijk interval in plaats van een extreem cijfer.

**Rekenvoorbeeld als controle.** 3.500 kWh/jaar, 4 kWp zuid 35°, 1.034 kWh/kWp. Dat geeft P = 4.136 kWh, r = 1,18 en een zelfverbruik van 26,8%. E_dir = 1.107 kWh en E_inj = 3.029 kWh.
- **PV:** besparing €329 / **€476** / €633 per jaar (laag / midden / hoog prijsset). Bij €4.000 investering is de terugverdientijd ±8,4 jaar in het midden (bereik 6–12 jaar).
- **Batterij 10 kWh nominaal (9 kWh bruikbaar), HTW:** E_ont ≈ 1.346 kWh. Batterijwinst ≈ €347 / **€367** / €399 per jaar. Bij ±€7.250 investering is de terugverdientijd ±20 jaar.
- **Batterij 5 kWh:** ≈ €291 per jaar tegenover ±€4.250, dus ±15 jaar.

Dat ligt in lijn met Energent (12–15 jaar voor de meeste gezinnen) en Test-Aankoop ("10 jaar of langer").

---

## Wat we NIET met zekerheid weten

1. **Prijsevolutie.** Alle prijzen zijn een momentopname van oktober 2026, in een periode van verhoogde volatiliteit (gas TTF ±€69–75/MWh, Belpex ±€150–163/MWh volgens de Eneco-kaart). Een terugverdientijd over 10–25 jaar met de prijzen van vandaag is een aanname, geen voorspelling.
2. **Of de CREG-"End-user Price EV" vaste termen omvat.** De methode zegt alleen "incl. energiekost, netwerkkosten, heffingen, toeslagen en btw". Mijn opbouw per component komt op hetzelfde niveau uit, maar is niet officieel bevestigd.
3. **Injectievergoeding op lange termijn.** De waarde kan structureel dalen en zelfs negatief worden op zonne-uren. Een Vlaamse marktprognose vond ik niet.
4. **Installatieprijzen 2026.** Er is geen officiële prijsstatistiek. De bandbreedtes steunen op Test-Aankoop (2025–2026) en één groepsaankoop (2024). Voor PV-kosten per kWp in functie van de grootte vond ik geen gezaghebbende formule.
5. **Btw op een thuisbatterij en een laadpaal.** De 6% bij woningen ouder dan 10 jaar wordt in de praktijk toegepast, maar ik vond geen FOD-tekst die het bevestigt. Voor lucht-luchtwarmtepompen in nieuwbouw is de toepassing van de 6%-circulaire niet eenduidig.
6. **Effect van een EMS** op zelfverbruik en piekverlaging bij warmtepomp, EV of boiler: geen onderbouwde Belgische meetcijfers gevonden. De 0,5–1,5 kW piekverlaging is een aanname binnen de Energent-metingen (1–2,5 kW).
7. **U-waarde van het bestaande dak.** Er is maar één gedocumenteerde referentie (1,7 W/m²K, 2015). Een officiële EPC-standaardwaarde voor een ongeïsoleerd hellend dak vond ik niet.
8. **Rendement van oudere ketels.** Alleen het ecodesign-minimum van 86% voor nieuwe ketels is gestaafd. Lagere waarden voor oude ketels vond ik niet in een gezaghebbende bron.
9. **Praktijk-COP en stilstandsverlies van boilers.** Er is geen Belgische veldmeting voor warmtepompboilers, en geen gestaafd stilstandsverlies voor elektrische boilers.
10. **Batterijlevensduur en degradatie** bij huidige LFP-systemen in Belgisch gebruik. Er zijn alleen garantievoorwaarden en meetdata van oudere systemen (HTW: 2–3 %-punt per jaar bij systemen van 2015).
11. **Inkomensgrenzen van de premiecategorieën 2026.** Die heb ik niet opgehaald (simulator). Ook de exacte stopdatum van de vroegere Vlaamse batterijpremie is niet op vlaanderen.be gecontroleerd.
12. **Gelijkwaardige graaddagen 16,5/16,5 (Synergrid).** Niet gevonden. Het model gebruikt de KMI-graaddagen op basis 15/15, wat voor een kamer op 20 °C eerder een onderschatting geeft.
13. **Primaire NREL-bronnen voor degradatie.** Niet bereikbaar in deze sessie (DNS-fout). De cijfers zijn via samenvattingen bevestigd.
14. **Eneco-cijfers zijn één leverancier.** Ze dienen als plausibiliteitscontrole, niet als marktgemiddelde.
