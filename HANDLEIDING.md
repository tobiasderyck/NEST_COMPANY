# Nest Company — site & inhoudsbeheer

De site draait op **Astro** en de inhoud wordt beheerd met **TinaCMS**.
Alle teksten en foto's staan in één bestand — `content/site.json` — en de klant
bewerkt dat via een bewerkomgeving op `/admin`. Wie daar op **Save** klikt,
schrijft naar dat bestand; online betekent dat een commit naar GitHub en een
automatische herbouw van de site.

---

## Deel 1 — Voor jou (eenmalig instellen)

### 1.1 Lokaal draaien

```bash
cd nestcompany-site && npm install && npm run dev
```

- Site: <http://localhost:4327>
- Bewerkomgeving: <http://localhost:4327/admin/index.html>

Lokaal draait Tina in *local mode*: geen account nodig, opslaan schrijft direct
naar `content/site.json` op je schijf. Ideaal om te testen vóór de klant erin gaat.

> **Waarom `ASTRO_DEV_BACKGROUND=1` in het dev-script staat:** Astro 7 duwt
> `astro dev` naar de achtergrond zodra het merkt dat een AI-assistent het start.
> Tina wikkelt zich rond dat proces en stopt zodra het afsluit. Die variabele
> houdt Astro op de voorgrond, zodat `npm run dev` overal werkt.

### 1.2 Tina Cloud koppelen (nodig om de klant online te laten bewerken)

1. Maak gratis een account op <https://app.tina.io> en klik **New Project**.
2. Kies **Import your site** en koppel de GitHub-repo `tobiasderyck/NEST_COMPANY`.
3. Zet de branch op `main`.
4. Tina geeft je een **Client ID**. Maak daarnaast bij *Tokens* een **Read Only
   Token** aan.
5. Zet beide in een `.env` in de projectmap (dit bestand blijft buiten GitHub):

   ```
   NEXT_PUBLIC_TINA_CLIENT_ID=jouw-client-id
   TINA_TOKEN=jouw-token
   ```

6. Nodig de klant uit als gebruiker bij *Collaborators*. Die krijgt een eigen
   login en hoeft niets van GitHub te weten.

> **Twee valkuilen bij het aanmaken van het Tina Cloud-project**
>
> - De **projectnaam** mag geen underscore bevatten. `NEST_COMPANY` wordt
>   geweigerd (toegestaan zijn letters, cijfers en `+=,.@'-`); gebruik
>   `NESTCOMPANY` of `NEST-COMPANY`. De foutmelding staat onder het naamveld,
>   maar je gaat gemakkelijk in het URL-veld zoeken.
> - Krijg je bij *Create Project* de rode balk **"Could not load the project"**:
>   dat is een bekende bug in Tina Cloud
>   ([issue #7236](https://github.com/tinacms/tinacms/issues/7236)). Het project
>   is wél aangemaakt. Klik dus niet opnieuw op de knop, maar ververs de pagina
>   en open het project via **Projects**.

### 1.3 Online zetten

Werkt op Vercel, Netlify of Cloudflare Pages. Instellingen:

| Instelling | Waarde |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Omgevingsvariabelen | `NEXT_PUBLIC_TINA_CLIENT_ID` en `TINA_TOKEN` |

Let op: de map is groot (±150 MB) omdat de scrollfilm uit 436 losse beelden
bestaat. De eerste deploy duurt daardoor enkele minuten. Als een host struikelt
over de omvang, kun je de film lichter maken door in `pipeline/slice.sh` het
aantal beelden per seconde (`fps=18`) of de breedte (`scale=1600`) te verlagen en
opnieuw te slicen — pas dan wel `PER` in `public/scrub.js` aan naar het nieuwe
aantal beelden per clip.

Na het koppelen bewerkt de klant op `https://[jouw-domein]/admin/index.html`.

---

## Deel 2 — Voor de klant (dagelijks gebruik)

### Inloggen en bewerken

1. Ga naar `https://[jouw-domein]/admin/index.html` en log in.
2. Klik links op **Website**, dan op **site**.
3. Je krijgt een lijst met twaalf genummerde onderdelen, in dezelfde volgorde als
   de pagina. Klik op het potloodje om een onderdeel te openen.
4. Klik rechtsonder op **Save**. Binnen een paar minuten staat de wijziging online.

### Wat je waar aanpast

| Onderdeel | Wat je erin regelt |
|---|---|
| 1. Bedrijfsgegevens & Google | Naam, telefoon, e-mail, en hoe de site in Google en op WhatsApp verschijnt |
| 2. Menu bovenaan | De links in de balk bovenaan |
| 3. Laadscherm | De tekstjes die heel even verschijnen tijdens het laden |
| 4. De scrollfilm | De teksten die over de film schuiven |
| 5. Statement | De grote uitspraak onder de film |
| 6. Diensten | De lijst met vakgebieden |
| 7. Voor & na | De twee foto's van de schuifbalk |
| 8. Realisaties | **Hier voeg je nieuwe werven toe** |
| 9. Onze aanpak | De drie stappen en de cijfers |
| 10. Calculator | Het blok dat naar de rekenmodule leidt |
| 11. Contact | De afsluitende tekst |
| 12. Onderste balk | De kleine regel helemaal onderaan |

### Een nieuwe realisatie toevoegen

1. Open **8. Realisaties** en klik onderaan op **Add Item**.
2. Klik bij *Foto* op het vak, dan op **Upload** en kies je foto.
   Liefst een liggende foto; de site snijdt hem automatisch bij naar 4:3.
3. Vul in:
   - **Soort werk** — het kleine oranje label, bv. `DAK + ZON`
   - **Titel van het project** — bv. `Dakwerk & zonnepanelen — Leuven`
   - **Omschrijving van de foto** — één zin over wat er te zien is. Dit lezen
     blinde bezoekers en Google; het helpt je vindbaarheid.
4. Sleep het item met de greep links naar de plek waar je het wil.
5. **Save**.

### Twee begrippen die overal terugkomen

- **Klein regeltje erboven** — het kleine gekleurde zinnetje boven een titel.
- **Titel — vet deel** en **Titel — cursief accent** — elke grote titel is in
  tweeën gesplitst: een vet deel en een schuingedrukt gekleurd staartje. Vul ze
  allebei in, dan blijft de vormgeving kloppen. Laat je het accent leeg, dan valt
  alleen dat schuine stukje weg.

### Waar je beter afblijft

- **Verschijnt op / Verdwijnt op** bij de scrollfilm. Die getallen bepalen op welk
  moment een tekst over het juiste beeld staat. Alleen aanraken als een tekst
  duidelijk naast het verkeerde beeld valt. `0` is het begin van de film, `1` het
  einde.
- **Springt naar** bij de menu-items. Dat zijn verwijzingen naar delen van de
  pagina (`#diensten`, `#realisaties`, …). Een typfout maakt de link stuk.
- De beelden van de film zelf (de map `frames`) staan niet in het beheer — die
  vormen de animatie en horen bij het ontwerp.

### Iets misgegaan?

Zolang je nog niet op **Save** hebt geklikt, zet **Reset** alles terug. Is er al
opgeslagen, dan staat elke wijziging als aparte versie in GitHub en kan Pixelshift
elke stap terugdraaien.
