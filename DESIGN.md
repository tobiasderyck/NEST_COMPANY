---
name: NEST Company
description: Architectural warmth, real house imagery and a clear route to advice.
colors:
  paper: "#f4f2eb"
  paper-light: "#fbfaf6"
  ink: "#28332e"
  muted: "#59665d"
  orange: "#c94c30"
  orange-hover: "#ac3b22"
  button-text: "#fffaf5"
  line: "rgba(40,51,46,.18)"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(65px,7.3vw,110px)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(34px,4.2vw,65px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-.04em"
  body:
    fontFamily: "General Sans, sans-serif"
    fontSize: "17px"
    lineHeight: 1.6
rounded:
  control: "3px"
  pill: "25px"
spacing:
  gutter: "clamp(22px,4.5vw,88px)"
  section: "clamp(80px,8vw,144px)"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.button-text}"
    rounded: "{rounded.control}"
    padding: "16px 23px"
  button-primary-hover:
    backgroundColor: "{colors.orange-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
---

# Design System: NEST Company

## Overview

**Creative North Star: "Architectural warmth"**

The established orange NEST identity and photographic house imagery anchor a warm, open editorial system. Large, compact headings frame the photography; useful controls and clear service copy make the offer understandable before any interaction. This records the approved local implementation, refreshed from source on 23 September 2026.

Paper layers, small roof drawings and lightly angled photographs connect the interface to homes and renovation. Motion explains transformation or responds to a deliberate action. Ordinary scrolling keeps every section accessible without a film timeline or pinned journey.

**Key Characteristics:**
- Warm paper, dark green ink and a focused orange accent.
- Archivo headings, General Sans reading and control text.
- Photographic evidence, generous spacing and grouped editorial lists.
- Tactile paper details with functional, optional motion.

## Colors

The palette combines warm paper neutrals with an orange identity accent and muted green supporting surfaces.

### Primary
- **NEST orange:** advice actions, emphasized heading words, selected shortlist controls, focus outlines and diagram details. The darker hover tone reinforces button state.

### Neutral
- **Paper / light paper:** page ground and lifted paper or menu surfaces.
- **Ink / muted:** headings and primary text / supporting copy and descriptions.
- **Line:** quiet separators within lists, controls and footer groups.
- **Button text:** warm white on orange actions.

**The Grouped Rule.** Dividers organize related information; major sections transition through spacing and feathered tonal fields.

## Typography

**Display Font:** Archivo, with sans-serif fallback. The CSS variable is historically named `--serif`; the implemented font is sans-serif.

**Body Font:** General Sans, with sans-serif fallback. There is no separate mono face.

Archivo supplies compact architectural headings; General Sans carries the longer explanations and practical controls. Display emphasis uses orange upright text, not italic lettering. Paragraphs default to a maximum of 66 characters.

The frontmatter records the desktop hero, section-heading and body roles. Page titles and smaller editorial headings adapt by template. At narrow widths the homepage title uses a fluid 56–78px range, section headings become 38px and body text becomes 16px. Supporting labels remain subordinate to the readable explanatory copy.

## Layout

The shared content width stops at 1440px with fluid side gutters. Most desktop sections pair unequal columns: statement and explanation, photograph and service index, or energy scene and controls. Staggered project images and carefully angled paper create variation without repeating card grids.

Responsive adjustments occur at 1100px, 860px and 600px. Navigation switches to a mobile menu at 860px. Below 600px gutters become 23px, section spacing becomes 65px and paired content becomes sequential. The homepage film fills the first viewport beneath the header, with the title, promise and advice action layered over it. On mobile the landscape film stays fully visible inside an ambient full-height field instead of cropping the house into a portrait close-up. Founder sheets stack into a readable sequence.

The header remains sticky. Mobile pages offer a fixed advice/phone bar, suppressed on the contact page and on the narrow calculator layout. On the homepage the bar also yields while the hero advice action is visible, then returns after the film scrolls away. Content is never hidden pending a scroll reveal.

The calculator extends this system as an operating surface: grouped inputs beside a tabbed energy ledger. Its columns stack at 900px; fields stack at 350px. The result is sticky only on wide, sufficiently tall viewports, so its controls remain reachable. Numeric values use tabular figures.

## Elevation & Depth

Depth comes from tonal paper layers, restrained offset shadows and small rotations. Photographs remain the main visual weight. The homepage now moves through distinct, feathered light situations: sage at the service index, warm late-day light around the energy scene, a soft gallery ground behind real projects, and clay-toned paper behind the founders. A faint architectural elevation sits behind the guidance chapter, away from body text. These fields always fade back into the page paper at both ends; no hard horizontal color seam is part of the system. The founder folder uses CSS perspective with separate sheets and a stamp; pointer tilt is enabled only for a fine hover-capable pointer. It is not a WebGL scene and its content does not depend on motion.

Inner-page light is keyed to the subject: roof, energy, renovation, people or contact. It is a quiet background wash behind the existing editorial hero and fades before the reading sections. The energy-section light follows its day/evening slider at low intensity. Contact uses a lightly rotated paper form on desktop and an unrotated surface on mobile. Menus and the mobile contact bar use soft shadows to distinguish them from page content.

## Shapes

Controls have near-square corners, with rounded pills reserved for playback and day/evening controls. The full-width film has no card frame; a directional dark wash gives its light title and controls reliable contrast. Paper sheets use thin borders and small rotations, while roof outlines and simple SVG strokes echo the subject. Circles are functional arrow controls, diagram markers or the folder stamp.

## Components

### Buttons and links

Primary actions use orange, warm white text and a small corner radius. Their desktop minimum height is 56px; compact variants use 44px. Hover darkens and lifts the button slightly; press scales it down. Outline actions use ink and a quiet border. Text links pair a readable label with a directional arrow and underline on hover. A global orange focus outline identifies keyboard focus.

### Navigation

Desktop navigation combines direct links with a service menu. Mobile uses an expandable panel with grouped service links. Expanded states are exposed semantically; Escape closes a menu and returns focus to its trigger. The saved-plan count stays beside the advice action.

### Service index and shortlist

Grouped service links sit beside an editorial photograph. Fine-pointer hover and keyboard focus update its preview. Plus controls add or remove service names; selected state is orange and exposed through `aria-pressed`. The device-local shortlist survives navigation and appears as removable chips on the contact paper. Personal form fields are not persisted.

### House film

Four existing silent clips play automatically and loop through two native video buffers, with a deliberate shutter reset behind the headline. Sources load progressively in desktop or mobile sizes. A poster remains visible until playback succeeds, and a pause/play control stays available. The first-screen advice action is present even while the film is loading or paused. Playback pauses offscreen and in hidden tabs. Reduced-motion or Save Data preference prevents automatic startup; playback never controls scrolling. No new AI assets were generated for this build.

### Energy explorer

A range input and day/evening buttons blend existing house stills, move the sun and update the explanation and service link. SVG traces illustrate connections among panels, battery and home. The scene is explicitly illustrative and makes no consumption or savings claim. Mobile places the explanation under the image and uses short diagram labels. Reduced motion disables animated traces while preserving the controls and information.

### Founder folder

Two named founder sheets express the roof and energy expertise. Desktop separates their readable text within the layered folder; mobile presents sequential sheets with the full names visible. Paper depth and pointer response are decorative, never prerequisites for reading.

### Contact paper and fields

Transparent fields use bottom rules and visible focus. Native validation precedes a clearly described `mailto:` handoff, with a copy-request fallback. The interface says the request is only sent when the visitor sends it in their own mail application; it does not claim delivery.

### Calculator worktable

Unit-bearing fields, native measure checkboxes and optional quote details share the paper, ink and orange system. A layered architectural SVG study adds the selected panels (up to twelve drawn, with the actual count labelled), storage and hot-water marks; roof selection changes its material. Fine siding, glazed windows, roof seams and a drafting baseline give the illustration depth without claiming a real roof layout. The result ledger gives each electricity flow a named row. Its segmented energy strip animates with transforms, disabled under reduced motion. Mobile presents the form before the result; a successful comparison moves focus to the result, while invalid quote inputs open their disclosure before receiving focus.

Required consumption and price inputs start empty. Three consumption presets provide a deliberate quick start, with visibly labelled scenario values filling only missing PV configuration/tariff/storage inputs. Editing a value removes its preset attribution. A visible panel count and whole-plan budget make the key questions easy to answer; technical production settings, itemised quotes and sources use native disclosures. Actual Zonnekaart/PVGIS production overrides the rough count × Wp × yield estimate. On phones, four compact measure rows omit secondary descriptions. A year balance that reaches theoretical zero grid import displays real import as unknown, marks the savings figure as a theoretical result without predictive value and suppresses payback. Actual whole-plan or itemised costs unlock simple payback when the savings data support it. Annual results and the transferred/printed summary retain assumptions and unknowns. Only “Bespreek dit plan” transfers a summary through `sessionStorage` to contact. No hourly simulation, off-grid guarantee or invented price bands. See the calculator surface brief and `RESEARCH-NEST-VERKENNER.md`.

## Do's and Don'ts

### Do:
- **Do** retain the established logo, approved house imagery and direct advice route.
- **Do** use the same meaningful links and readable content on touch and keyboard.
- **Do** keep motion optional, with a visible poster and readable still-state content.
- **Do** use the homepage surface brief for its sequence and interaction strategy; use this file for the shared visual system.

### Don't:
- **Don't** replace the ordinary page with a pinned scroll film or require playback to reach information.
- **Don't** introduce repeated glass cards, decorative counters or generic stock-icon tiles.
- **Don't** invent measured outcomes, reviews, delivery confirmations or WebGL capabilities.
- **Don't** generate new video from new stills before the user's image approval.
