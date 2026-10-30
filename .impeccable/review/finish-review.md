# Disposition

**Pass for the reviewed local build.** The bounded finish pass resolves all three reported findings. No further visual redesign is needed for this review. This is a local design/implementation sign-off, not confirmation of production delivery or independent real-device playback QA.

# Contract / quality assessment

The build expresses the agreed house-to-nest concept through Dutch copy, clear advice actions, photographic house imagery, warm paper and orange palette, a distinct service index, an explanatory energy explorer and the project-folder motif. It reads as a considered local business site rather than a generic card grid. Service and contact layouts translate convincingly to mobile. Source implements ordinary scrolling, a muted four-part looping film, device-specific sources, visibility pausing and reduced-motion handling. Facade and total renovation are present in the service groups and shortlist.

The refreshed 375px hero screenshot shows the whole house with playback active. The founder revision retains the paper-folder character while restoring access to both descriptions and full names. The mobile energy diagram now uses readable short labels; the 320px day and evening captures keep the whole house, labels and caption inside the scene. These revisions satisfy the practical intent of the brief without changing its direction or requiring new media.

# Material findings — final verdicts

| Finding | Final verdict | Evidence / resolution |
| --- | --- | --- |
| P1 — Initial opaque video hides mobile poster | **Resolved** | `src/pages/index.astro` now initializes both videos without `is-active`; CSS keeps them transparent. `public/nest.js` adds the class only after `await video.play()` succeeds. Static inspection confirms the poster remains exposed when startup is skipped for reduced motion/Save Data, JavaScript is absent, or initial playback rejects. Refreshed `mobile.png` shows the complete house during playback. OS reduced-motion behavior was not dynamically emulated. |
| P2 — Founder paper overlap obscures Tommy’s copy | **Resolved** | Refreshed `desktop-people.png` shows both full names and complete descriptions. Desktop sheets are separated at 47% width and 52% offset. `mobile-people.png` shows sequential sheets with readable 13px body and 12px names; overlap falls on paper surfaces rather than the copy. |
| P3 — Supplementary mobile energy labels too small | **Resolved** | Labels now read “Zonnepanelen”, “Woning” and “Batterij” at 11px; the battery label is anchored 5% from the right, and the caption is 10px. `mobile-energy-320-day.png` and `mobile-energy-320-evening.png` show readable, contained labels without covering each other. The larger story text explains the relationship beneath the scene. |

No unresolved material findings remain within this review’s bounded scope.

# Strengths

- The first-screen offer and advice action are immediate, with a distinct identity and a deliberately composed mobile text layout.
- The editorial service index groups many offerings without repeated cards; saving services has a useful role in the contact journey.
- The energy explorer connects imagery, system relationships and plain-language copy without fabricated performance numbers.
- Contact offers phone/email, addresses, the persistent shortlist and an honest email-draft handoff. Source does not claim an enquiry has been delivered.
- Focus styling, selection/caret theming, keyboard preview handling and reduced-motion code show care beyond static screenshots.

# Validation / limitations

Initial review covered PRODUCT.md, DESIGN.md, craft-floor.md, supplied region/viewport screenshots, homepage markup, relevant CSS/JavaScript and detector.json (`[]`). Follow-up inspected refreshed mobile hero, desktop/mobile founder, and 320px day/evening energy screenshots and the corresponding source changes. No browser was used and no implementation files were edited by this reviewer. The full-page screenshot was intentionally excluded because its lazy-load capture is known to be unreliable.

The reported 28-route build, link check, menu/shortlist/energy/form/playback checks, repeated passing build and 320px DOM overflow/bounds check are implementation-agent evidence, not independently rerun tests. PDF-by-PDF semantic completeness, real-device autoplay, OS reduced-motion emulation and transactional delivery were not independently audited. DM Sans is named in DESIGN.md while the implementation uses General Sans; this is minor documentation drift rather than a blocking visual defect. Publication still requires the already-declared project-image association and delivery checks.
