> **Uitvoering gereed als lokale ontwerpversie.** De definitieve hero speelt automatisch en in een lus; geen scrollbesturing. Zie [BUILD-NOTES.md](BUILD-NOTES.md) voor de werkelijk gebouwde structuur, beheer, controles en publicatiepunten. Onderstaand voorstel bewaart het eerdere onderzoek en de bronmapping.

# NEST Company — voorstel voor de nieuwe website

> **Besluit 23 september 2026, bevestigd door Tobias:** de hero wordt een automatisch afspelende renovatiefilm in een lus. De korte scrollfilm hieronder is de eerdere onderzoeksrichting en vervalt als implementatiekeuze. Normaal scrollen, direct beschikbare diensten en contact. De verdere inhoudsstructuur blijft de basis; de actuele product- en ontwerpafspraken staan in PRODUCT.md en DESIGN.md. Tobias heeft daarna de volledige lokale uitwerking met unieke interacties geautoriseerd.

23 september 2026 · Concept- en uitvoeringsvoorstel voor Tobias De Ryck / Pixelshift

## De keuze

**Behoud “Van huis. Naar nest.” en het huis dat onder je vingers transformeert. Maak er een korte, krachtige opening van, met diensten en contact vanaf het eerste scherm bereikbaar. Bouw daaronder een volwaardige website met de goedgekeurde inhoud uit de aangeleverde pagina’s.**

Het huis is het herkenningspunt. Het warme eindbeeld is de beloning. De bezoeker hoeft de transformatie niet af te maken om te begrijpen wat NEST doet of een gesprek aan te vragen.

De kernbelofte voor de nieuwe site: **NEST brengt dak, gevel, renovatie en energie samen, met persoonlijk advies en één aanspreekpunt.** Tobias heeft bevestigd dat gevel- en totaalrenovatie volwaardige diensten blijven. De pdf’s leveren daarvoor nog geen afzonderlijke dienstteksten; die worden aanvullend geschreven en inhoudelijk bevestigd.

## Wat het onderzoek laat zien

Bekeken: de publieke demo, de lokale Astro-site, alle 22 aangeleverde pdf’s (113 pagina’s tekst; twee vrijwel identieke blogexports) en visueel de eerste pagina van elke pdf. De pdf’s zijn bronmateriaal, geen opdrachten. Hun printweergave is geen betrouwbare weergave van alle schermkleuren, afbeeldingen of interactieve toestanden van de oorspronkelijke website.

| Vaststelling | Gevolg voor het voorstel |
|---|---|
| De filmsectie heeft `height: 1600vh`: 16 schermhoogtes, waarvan circa 15 aan vastgezette scroll. | De opening terugbrengen tot een ontwerprichting van 400vh op desktop en 300vh op mobiel. |
| De dienstensectie volgt pas na de film en een extra statement. | Vanaf het eerste scherm een diensteningang; direct na de korte film het volledige overzicht. |
| Er staat al een afspraakknop bovenaan. Deze verwijst naar het contactblok onderaan, met telefoon en e-mail. | Die vroege contactmogelijkheid behouden en versterken met een direct bereikbaar aanvraagformulier. |
| Onder 860px verdwijnt de gewone navigatie; er staat geen vervangend mobiel dienstenmenu in de huidige pagina. | Een echt mobiel menu met alle diensten en een vaste contactactie. |
| De canvas gebruikt een gecentreerde, schermvullende uitsnede van brede frames. | Mobiel krijgt een eigen compositie waarin het hele huis leesbaar blijft. |
| 436 JPEG-frames van 1600 × 900 pixels wegen lokaal samen 122.044.588 bytes, ongeveer 122 MB. Na 300 ms begint ook het laden van de resterende clips. | Apart mobiel beeldpakket, beperkt vooruitladen en een direct zichtbaar openingsbeeld. Dit is de lokale bronomvang, geen gemeten mobiel dataverbruik. |
| Er zit een laadscherm voor de site en de engine gebruikt een dissolve rond clipnaden. | Contact en tekst meteen tonen; naden beoordelen en bijwerken waar nodig. Geen nieuwe clipproductie vóór beeldgoedkeuring. |
| De pdf’s benadrukken merkonafhankelijk advies, dimensionering, samenwerking tussen installaties en opvolging. | Dat wordt de inhoudelijke reden om voor NEST te kiezen. |

De mobiele uitsnede en het verdwijnen van de navigatie zijn ook in de browser waargenomen. De browser herschaalde de ingestelde testmaten; dit was een responsive inspectie, geen test op een echte telefoon. Een volledige prestatiemeting en praktijkproef op iPhone en Android horen bij de bouwfase.

## Het concept: een compacte transformatie

We blijven in dezelfde fotografische wereld: één herkenbaar Belgisch huis, een vaste camerahoek en een overtuigende verandering van verweerd naar verzorgd en comfortabel. De kijker herkent op elk moment hetzelfde pand. Het eindmoment waarin de ramen warm oplichten blijft behouden.

Het verhaal krijgt vier korte bewegingen. Niet iedere dienst krijgt een aparte scène: onzichtbare installaties zoals een thuisbatterij of EMS leggen we naast en onder de film uit.

| Deel | Beeld | Wat de bezoeker begrijpt |
|---|---|---|
| Begin | Het oude huis, volledig herkenbaar | Dit kan mijn woning zijn. |
| Dak | Vernieuwd en geïsoleerd dak | NEST begint bij een degelijke basis. |
| Energie | Zonnepanelen verschijnen | Het huis gaat zelf energie produceren. |
| Gevel | Gevel en afwerking veranderen | Ook de renovatie en uitstraling horen bij NEST. |
| Thuis | Het warme, bewoonde eindbeeld | Alles komt samen in een comfortabel nest. |

De bijschriften blijven beperkt tot één korte zin per beweging. De bestaande langere uitleg verhuist naar de dienstpagina’s. Zo kunnen we de film korter maken zonder de tekst onleesbaar snel voorbij te laten komen.

**Startwaarde desktop:** een filmsectie van 400vh, met circa 300vh daadwerkelijke vastgezette scroll. Dat is 75% minder sectiehoogte dan nu. Bij een scherm van 900px hoog daalt de vastgezette scroll van circa 13.500px naar circa 2.700px. Dit is een ontwerpdoel, nog geen getest resultaat.

**Startwaarde mobiel:** een sectie van circa 300svh, met circa twee schermhoogtes beweging nadat het eerste scherm in beeld staat. We toetsen het gevoel op echte toestellen. Het aantal duimbewegingen hangt af van het toestel en de gebruiker; we beloven geen exact aantal swipes.

Bij het eindbeeld komt de gewone inhoud meteen in beeld. Geen tweede lange introductie, en geen tweede volledige voor-na-ervaring van hetzelfde AI-huis. Echte voor-na-projecten blijven wel waardevol.

### Drie manieren om de opening te behandelen

| Richting | Ervaring | Advies |
|---|---|---|
| Compacte scrollfilm | Scrollen verbouwt het huis; de volledige film zit in circa vier schermhoogtes op desktop. | **Voorkeur.** Behoudt het verkochte concept en maakt de rest van de site sneller bereikbaar. |
| Huis met aanklikbare fasen | Bezoeker kiest Dak, Energie, Gevel of Thuis; gewone scroll gaat direct naar de inhoud. | Goede uitwijkmogelijkheid als zelfs de korte scrollfilm te veel vertraging geeft. |
| Korte afspelende openingsfilm | De transformatie speelt onafhankelijk van de scroll, met pauzeknop. | Minder passend bij de uitgesproken voorkeur voor zelf transformeren door te scrollen. |

We werken de eerste richting uit. De andere twee zijn concrete alternatieven, geen extra producties die automatisch worden gemaakt.

## Het eerste scherm

De bestaande titel **“Van huis. Naar nest.”** blijft. Hij wordt zo geplaatst dat dak, gevel en verandering zichtbaar blijven. Desktop kan de tekst aan één kant van het huis staan; mobiel krijgt de tekst een eigen rustige zone boven of onder het hoofdonderwerp.

Voorstel voor de korte uitleg:

> Dakwerken, gevel- en totaalrenovatie, met energieoplossingen op maat. Van persoonlijk advies tot uitvoering en opvolging.

De primaire knop is overal **“Plan je gratis adviesgesprek”**, aansluitend op de aangeleverde teksten. Daarnaast staat een rustigere link **“Bekijk onze diensten”**. Op het eerste scherm zijn ook de vier ingangen leesbaar: **Dakwerken · Energie · Gevelrenovatie · Totaalrenovatie**.

De adviesknop opent direct een compact formulier of brengt de bezoeker rechtstreeks naar de contactpagina. Hij speelt of doorloopt niet eerst de film. De dienstenlink springt direct naar het aanbod. Ook toetsenbordgebruik en terugnavigatie moeten daarbij logisch blijven.

Navigatie desktop: **Oplossingen · Realisaties · Over NEST · Contact**, met de adviesknop apart. Onder Oplossingen staan de concrete diensten gegroepeerd. Zakelijke energieopslag krijgt een zichtbare ingang, zodat een bedrijfsbezoeker zich ook aangesproken voelt.

## De homepage onder de film

| Volgorde | Inhoud en vorm | Functie |
|---|---|---|
| Diensten | Een ruim, redactioneel overzicht met vier duidelijke dienstgroepen en concrete links. Dak en gevel krijgen groot beeld; energie toont ook batterijen, laadpalen en sturing. | Snel herkennen waarvoor je NEST kunt inschakelen. |
| Echte realisaties | Twee sterke projecten, met echte foto’s, de klantvraag, de oplossing en een aantoonbaar resultaat. De twee aangeleverde cases zijn een inhoudelijke basis. | Bewijs vóór het midden van de gewone inhoud. |
| De mensen achter NEST | Tommy en Joeri, echte portretten, hun aanvullende expertise in dak en energie, en waarom ze merkonafhankelijk adviseren. | Van indrukwekkend beeld naar vertrouwen in echte mensen. |
| Begeleiding | Een korte uitleg van advies, uitvoering, configuratie, administratie en opvolging; verdieping via de bestaande informatiepagina’s. | Duidelijk maken wat één aanspreekpunt betekent. |
| Contact | Een korte uitnodiging, eenvoudig formulier, bellen en beide vestigingsadressen. | Aanvraag afronden. |

De volgorde wordt visueel afgewisseld: groot beeld, rustige dienstregels, een projectverhaal en mensen. Geen herhaalde rij identieke kaartjes. De overgang van het warme eindbeeld naar de inhoud vloeit via kleuren die al in de foto aanwezig zijn. De tekstgedeelten blijven licht en goed leesbaar.

Visuele richting: materiaalgevoel van baksteen, pleister en daglicht; gebroken wit en diepe inkt voor leesbaarheid; het bestaande oranje als spaarzaam actieaccent. Het meerkleurige logo blijft intact. We behouden de herkenbare krachtige titelstijl, maar verminderen de hoeveelheid enorme hoofdletters en decoratieve labels in de rest van de site. Glas alleen waar het functioneel boven beeld ligt, zoals de navigatie.

## Alle goede inhoud krijgt een plaats

De nieuwe website wordt een homepage met onderliggende pagina’s. De goedgekeurde teksten blijven inhoudelijk het vertrekpunt. Op de homepage komen korte samenvattingen; op de dienstpagina’s blijven voordelen, toepassingen, aanpak, merken en combinaties beschikbaar.

| Groep | Pagina’s / inhoud |
|---|---|
| Dakwerken | Overzicht; dakrenovatie; dakisolatie; asbest verwijderen. |
| Energieoplossingen | Overzicht; zonnepanelen; thuisbatterijen; industriële batterijen; laadpalen; airco en warmtepompboilers; EMS-systemen; netoplossingen met on-grid, hybride en off-grid. |
| Gevelrenovatie | Nieuwe dienstpagina; exact aanbod en bijbehorende tekst bevestigen. |
| Totaalrenovatie | Nieuwe dienstpagina; inbegrepen werken, projectaanpak en voorbeelden bevestigen. |
| Waarom NEST | Persoonlijk advies; configuratie en optimalisatie; premies en aanvragen; administratieve opvolging. |
| Over NEST | Het verhaal van NEST; het team. |
| Realisaties | Overzicht; zonnepanelen op maat; zonnepanelen en thuisbatterij; later extra echte projecten. |
| Kennis | Blogoverzicht en echte artikelen. |
| Contact | Adviesaanvraag; telefoon; e-mail; Machelen en Lebbeke. |

Een dienstpagina opent meteen met een passende foto, een duidelijke titel, de kernuitleg en een adviesknop. Daarna volgen voordelen, aanpak en combinaties in een afwisselend maar herkenbaar ontwerp. De film van de homepage wordt hier niet opnieuw verplicht afgespeeld.

De bronpaden uit de pdf’s vormen de basis voor de URL-structuur. Voor publicatie vergelijken we die met de werkelijk gebruikte publieke URL’s. Bestaande relevante URL’s behouden; bij een wijziging een gerichte redirect. De twee blog-pdf’s leveren één blogoverzicht op. Algemene voorwaarden en privacy zijn wel genoemd maar niet als volledige documenten aangeleverd; de bestaande teksten moeten worden meegenomen.

Kleine broncorrecties horen bij de migratie: de blogexports bevatten nog “Blog 2”, “Blog 3” en “Inhoud blog”; de laadpalenpagina verwijst bij EMS met het label “Meer over zonnepanelen”. Herhalingen en echte tekstfouten corrigeren we gericht. Afgebroken woorden in een pdf kunnen exportproblemen zijn en worden vergeleken met de oorspronkelijke tekst. We herschrijven niet automatisch alle teksten die de klant al goed vindt.

## Mobiel: hetzelfde verhaal, eigen compositie

De huidige brede foto schermvullend in een smalle telefoon plaatsen snijdt het huis af. Een kleinere lettergrootte lost dat niet op.

Het voorstel is een mobiele scène met het hele huis binnen een vooraf vastgelegd veilig beeldvlak. Daknok, zijgevel, zonnepanelen en voordeur moeten zichtbaar blijven. Tekst en contactknoppen krijgen vrije ruimte. We beginnen met een compositieproef op de bestaande beelden. Past het huis niet overtuigend, dan maken we aangepaste portretstills van hetzelfde huis, met dezelfde camera, materialen en omgeving.

Die stills worden vóór mobiele clips aan Tobias getoond. Een aangepaste uitsnede is alleen voldoende als het volledige relevante onderwerp behouden blijft. Het huis mag niet veranderen in een ander pand tussen desktop en mobiel of tussen twee fasen.

Mobiele bediening:

- Compact logo en een herkenbare menuknop; alle diensten blijven bereikbaar.
- Eén vaste onderste contactstrook met “Gratis advies” en een belactie, rekening houdend met de schermrand en het toetsenbord.
- De hero-actie en vaste actie nemen elkaars plaats over waar nodig; geen dubbele balken over het huis.
- Gewoon verticaal scrollen, zonder verplichte horizontale bewegingen of hoverbediening.
- Leesbare tekst zonder animatie die eerst moet worden afgewacht.
- Bij minder-bewegingvoorkeur of een laadfout: een sterk stilstaand beeld, direct alle inhoud en geen lege lange filmsectie.

## Leads en bewijs

Het aanvraagformulier vraagt drie gegevens: **naam, e-mailadres en een korte omschrijving van het project**. De dienst waarvan iemand komt kan vooraf worden ingevuld als context. Bellen blijft een afzonderlijke directe route. Zo hoeft iemand niet tegelijk voornaam, achternaam, e-mail, telefoon, onderwerp en bericht in te vullen zoals in de aangeleverde contactpagina.

Een geslaagde aanvraag toont een duidelijke bevestiging. Bij een fout blijft de ingevulde tekst staan en is telefoon/e-mail bereikbaar. De ontvangende mailbox of CRM-koppeling wordt vóór livegang afgesproken en daadwerkelijk getest. Er komt geen verzonnen antwoordtermijn op de site.

Contactgegevens uit de bron: **0492 86 42 02**, **info@nestcompany.be**, **De Kleetlaan 5, 1831 Machelen** en **Opwijksestraat 91, 9280 Lebbeke**.

De AI-transformatie is conceptbeeld en wordt niet als gerealiseerd klantproject voorgesteld. De cases krijgen echte projectfoto’s. Projectcijfers, beoordelingen en certificeringen gebruiken we alleen met passende bronbevestiging. De bestaande RESCert-vermelding uit de tekst wordt bij NEST gecontroleerd voordat we daarvan een prominent keurmerk maken.

Meten: succesvolle aanvragen, klikken om te bellen, herkomst per dienst en gebruik van de diensteningang. Formulieropeningen en telefoonkliks zijn geen bevestigde leads. Scrollvoltooiing helpt om de beleving te evalueren, maar aanvragen en leadkwaliteit blijven leidend. Tracking wordt passend ingericht; er worden geen formulierteksten of contactgegevens naar analytics gestuurd.

## Productie: eerst hergebruiken, gericht verbeteren

**Stap 1 — beeldvoorstel.** Een concrete desktop- en mobiele hero-compositie, het dienstgedeelte eronder en een storyboard met de bestaande vijf beeldstaten. We vergelijken begin, dak, zon, gevel en eindbeeld. Eventuele nieuwe stills duidelijk naast de bestaande beelden tonen.

**Stap 2 — expliciete beeldgoedkeuring.** Tobias beoordeelt het huis, de mobiele kadrering, de sfeer en het eindbeeld. Nieuwe video’s starten pas daarna. Deze volgorde volgt ook zijn uitdrukkelijke instructie in deze opdracht.

**Stap 3 — werkende korte opening.** De goedgekeurde richting krijgt de kortere tijdlijn, vroege dienstenlinks, mobiele navigatie en direct contact. De bestaande clips zijn het eerste materiaal. We toetsen lengte en bruikbaarheid voordat we extra scènes laten maken.

**Stap 4 — gerichte beeldproductie indien nodig.** Alleen problematische naden of ontbrekende mobiele scènes opnieuw maken via de afgesproken KIE-workflow. Elke vervolgclip sluit aan op het werkelijke laatste beeld van de vorige clip. De huidige dissolve verwijderen we niet blind als daardoor een sprong zichtbaar wordt; eerst de naad oplossen. Beschikbaarheid en kosten van het model worden op dat moment gecontroleerd.

**Stap 5 — diensten en inhoud.** De aangeleverde teksten migreren, gevel- en totaalrenovatie aanvullen, echte beelden koppelen en het CMS uitbreiden. De huidige Astro/Tina-basis kan daarbij blijven dienen; een extra 3D-engine is voor dit concept niet nodig.

**Stap 6 — controle en publicatie.** Desktop, tablet, echte iPhone en Android, trage verbinding, verminderde beweging, navigatie en formulierafhandeling controleren. Daarna het publicatiepakket met URL-mapping en inhoudelijke controle opleveren.

## Technisch uitvoeringsplan

De websitecode is voor dit voorstel niet gewijzigd. Onderstaande bestanden zijn de beoogde implementatie, geen reeds opgeleverde functionaliteit.

| Status | Bestand / map | Wijziging |
|---|---|---|
| MODIFY | `src/pages/index.astro` | Nieuwe homepagevolgorde, compacte opening, directe diensten- en contactingangen. |
| MODIFY | `public/style.css` | Kortere filmsectie, mobiele beeldruimte, navigatie en rustige contenttypografie. |
| MODIFY | `public/scrub.js` | Tijdlijn en bijschriften opnieuw afstemmen; responsieve assetselectie; begrensd laden; stilstaande fallback; pauzeren buiten beeld. |
| MODIFY | `public/main.js` | Blokkerend laadscherm vervangen door direct bruikbare inhoud; menu en formulierinteractie. |
| MODIFY | `public/smooth.js` | Directe ankeracties en normaal mobiel scrollgedrag controleren. |
| MODIFY | `content/site.json` | Nieuwe homepage-inhoud en navigatie, behoud van bevestigde merk- en contactgegevens. |
| MODIFY | `tina/config.ts` | Collecties voor diensten, begeleiding, team, cases en blog. |
| NEW | `src/layouts/SiteLayout.astro`, `src/components/Header.astro`, `src/components/ContactForm.astro` | Gedeelde paginastructuur, navigatie en aanvraagcomponent. |
| NEW | `src/pages/energieoplossingen/`, `src/pages/dakwerken/`, `src/pages/gevelrenovatie.astro`, `src/pages/totaalrenovatie.astro` | Overzichten en afzonderlijke dienstenroutes. |
| NEW | `src/pages/waarom-nest-company/`, `src/pages/over-ons/`, `src/pages/realisaties/`, `src/pages/blog/`, `src/pages/contact.astro` | Verdieping, bewijs en contact. |
| NEW | `content/diensten/`, `content/begeleiding/`, `content/over-ons/`, `content/realisaties/`, `content/blog/` | Inhoud uit de bronnen gestructureerd opslaan, met herkomst en publicatiestatus. |
| NEW | `public/assets/film-desktop/`, `public/assets/film-mobile/` | Geoptimaliseerde beelden uit goedgekeurd materiaal. |

De formulierontvanger en eventuele serverroute worden concreet gekozen op basis van de bestaande hosting en NEST’s opvolging. De API-sleutel voor beeldproductie blijft buiten de browser. Er is voor dit voorstel geen API-aanroep voor beeld- of videogeneratie gedaan.

Voorkeur voor de eerste implementatie: een compacte beeldreeks op de bestaande canvas-basis, omdat dit aansluit op het huidige werk. Aantal frames en formaat volgen uit een visuele proef. Als gecomprimeerde video op echte telefoons aantoonbaar soepeler en lichter werkt, kiezen we die route. Geen volledige desktop- en mobiele reeks tegelijk downloaden.

Werkbudget voor optimalisatie, nog te toetsen: het eerste scherm inclusief lettertypen en openingsbeeld bij voorkeur onder 1 MB; het volledige mobiele animatiepakket bij voorkeur onder 5 MB, aanvullend en progressief geladen. Dit zijn engineeringdoelen, geen huidige prestaties of beloofde eindcijfers.

## Wanneer deze versie geslaagd is

- Bij openen zie je wat NEST doet, kun je diensten bekijken en direct contact opnemen.
- De filmsectie blijft rond 400vh desktop / 300svh mobiel en bevat geen stilstaande, lege scrollstukken.
- Het huis blijft herkenbaar en volledig genoeg in beeld; tekst bedekt geen essentiële verandering.
- Iedere hoofdservice is binnen maximaal twee navigatiekeuzes bereikbaar, ook mobiel en met toetsenbord.
- Alle aangeleverde inhoud heeft een bestemming; aanvullende dienstclaims zijn bevestigd.
- De site blijft bruikbaar zonder geladen film en bij verminderde-bewegingvoorkeur.
- Een proefaanvraag komt daadwerkelijk aan; fouten, bevestiging en spambeperking zijn gecontroleerd.
- Er staan echte projecten en mensen tegenover de cinematografische conceptbeelden.
- Overgangen zijn op meerdere tussenposities bekeken, niet alleen op begin- en eindbeelden.

## Korte toelichting voor de klant

> We behouden het idee dat jullie aansprak: een huis dat tijdens het scrollen verandert in een warm nest. We maken die ervaring compacter en zorgen dat bezoekers vanaf het eerste scherm kunnen zien waarvoor ze bij NEST terechtkunnen en meteen advies kunnen aanvragen. De teksten die jullie goed vinden krijgen een plaats in een nieuwe, filmische vormgeving. Op mobiel krijgt het huis een eigen compositie, zodat de volledige transformatie ook op een klein scherm tot haar recht komt.

## Bronnen en grenzen

Demo: [nest-company.vercel.app](https://nest-company.vercel.app/). Codebevindingen: [filmhoogte en mobiele navigatie](</Users/tobiasderyck/Claude code projects/nestcompany-site/public/style.css:182>), [framebelasting en uitsnede](</Users/tobiasderyck/Claude code projects/nestcompany-site/public/scrub.js:19>), [huidige pagina](</Users/tobiasderyck/Claude code projects/nestcompany-site/src/pages/index.astro:105>) en [inhoud](</Users/tobiasderyck/Claude code projects/nestcompany-site/content/site.json>).

De pdf’s bepalen de aangeleverde inhoud. De gebruikersinstructie en Tobias’ bevestiging bepalen de opdracht en het bredere aanbod. Voor dit voorstel zijn geen premiebedragen, besparingsgaranties, nieuwe certificeringsclaims of generatieprijzen onderzocht of toegevoegd.

| Aangeleverd document | Bestemming |
|---|---|
| [Energieoplossingen](</Users/tobiasderyck/Downloads/Energieoplossingen - Nest Company.pdf>) | Energieoverzicht |
| [Thuisbatterijen](</Users/tobiasderyck/Downloads/Thuisbatterijen - Nest Company.pdf>) | Dienst |
| [Industriële batterijen](</Users/tobiasderyck/Downloads/Industriële batterijen - Nest Company.pdf>) | Zakelijke dienst |
| [Zonnepanelen](</Users/tobiasderyck/Downloads/Zonnepanelen - Nest Company.pdf>) | Dienst |
| [Laadpalen](</Users/tobiasderyck/Downloads/Laadpalen - Nest Company.pdf>) | Dienst |
| [Airco en warmtepompboilers](</Users/tobiasderyck/Downloads/Airco en warmtepompboilers - Nest Company.pdf>) | Dienst |
| [EMS-systemen](</Users/tobiasderyck/Downloads/EMS-systemen - Nest Company.pdf>) | Dienst |
| [Off-grid oplossingen](</Users/tobiasderyck/Downloads/Off-grid oplossingen - Nest Company.pdf>) | Netoplossingen |
| [Dakrenovatie](</Users/tobiasderyck/Downloads/Dakrenovatie - Nest Company.pdf>) | Dienst |
| [Dakisolatie](</Users/tobiasderyck/Downloads/Dakisolatie - Nest Company.pdf>) | Dienst |
| [Asbest verwijderen](</Users/tobiasderyck/Downloads/Asbest verwijderen - Nest Company.pdf>) | Dienst |
| [Over NEST Company](</Users/tobiasderyck/Downloads/Over NEST Company - Nest Company.pdf>) | Bedrijfsverhaal |
| [Ons team](</Users/tobiasderyck/Downloads/Ons team - Nest Company.pdf>) | Team |
| [Persoonlijk advies](</Users/tobiasderyck/Downloads/Persoonlijk advies - Nest Company.pdf>) | Begeleiding |
| [Configuratie en optimalisatie](</Users/tobiasderyck/Downloads/Configuratie & optimalisatie - Nest Company.pdf>) | Begeleiding |
| [Premies en aanvragen](</Users/tobiasderyck/Downloads/Premies & aanvragen - Nest Company.pdf>) | Begeleiding |
| [Administratieve opvolging](</Users/tobiasderyck/Downloads/Administratieve opvolging - Nest Company.pdf>) | Begeleiding |
| [Zonnepanelen en thuisbatterij](</Users/tobiasderyck/Downloads/Zonnepanelen en thuisbatterij - Nest Company.pdf>) | Case |
| [Zonnepanelen op maat](</Users/tobiasderyck/Downloads/Zonnepanelen op maat - Nest Company.pdf>) | Case |
| [Blog](</Users/tobiasderyck/Downloads/Blog - Nest Company.pdf>) | Blogoverzicht |
| [Tweede blogexport](</Users/tobiasderyck/Downloads/Blog - kNest Company.pdf>) | Dezelfde overzichtspagina |
| [Contact](</Users/tobiasderyck/Downloads/Contact - Nest Company.pdf>) | Contactpagina |
