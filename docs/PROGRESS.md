# Progress

The first exhibit has a responsive layout, a fictional Assembly 2024 card with distinct faces, a branded strap and a clip. The viewer supports pointer capture, physical release, keyboard and touch face controls, reduced motion and a static fallback.

The phase-one attachment is modelled on a generic metal clip. The fabric uses a joint-driven ribbon and the badge swings in the display plane. The HTML hit target follows the badge centre and uses an approximate rectangular outline.

Next steps are to deploy to a connected Vercel project, verify input and WebGL performance in Safari on a physical iPhone, and replace the fictional badge when real photographs and measurements are available.

## Verification

ESLint, TypeScript and the production build passed. A Chromium smoke test against the production server with software WebGL verified mouse drag and release, return toward rest, Shift-drag rotation, keyboard face switching, touch dragging, scrolling outside the badge and the static fallback. The mobile check used a 390 × 844 touch viewport with reduced motion enabled. Shared Cloud Chrome displayed the static fallback. Mobile Safari and GPU performance on a physical device are pending.

The workspace has no linked Vercel project or Vercel credentials. The production server was started in Codex Cloud on port 3001 for verification.

Adjusted the phase-one camera framing to give the badge and flip control more clearance on narrow screens. ESLint, TypeScript and the production build passed again. Chromium confirmed clearance at 320, 375, 390 and 430 CSS pixels and passed the existing interaction smoke checks against the restarted production server.

## Phase 2

Implemented a three-stop exhibition with scroll-driven camera travel, explicit stop controls, three fictional badge designs and a reusable focus panel. The view pauses its browse render loop during focus and mounts one physics rig. Closing focus restores the active stop and keyboard focus. The static fallback supports selecting exhibits and viewing both faces.

ESLint, TypeScript and the production build passed. Chromium smoke checks on the production server verified wheel and touch scrolling through the exhibition, explicit stop navigation, direct mesh selection, keyboard activation and focus restoration, Escape and close controls, drag and release, mobile panel scrolling, face switching, reduced-motion mode, and the fallback with WebGL disabled.

The production server is running in Codex Cloud on port 3001. Physical iPhone and Safari testing and Vercel deployment remain pending. Replace the fictional assets and stories when the owner's photographs and records are available.

## Production QA

Fixed the pinned exhibition height on short landscape screens, aligned the stop and flip button names with their visible labels for voice control, and added a focus restoration fallback when the opening artwork button has been replaced by the WebGL scene.

The rebuilt production server passed ESLint, TypeScript and Next.js build. Chromium and axe-core checked the normal and static views at nine viewport sizes from 320 × 568 to 1920 × 1080, including 667 × 375 and 844 × 390 landscape. The automated scans reported no selected WCAG A/AA violations in the browse view or sampled focus panels. Keyboard containment, repeated dialog cleanup, focus restoration, normal WebGL rendering, WebGL context loss in both viewers, emitted resource requests and the existing desktop and touch smoke checks passed.

One cold local Chromium run measured about 1.23 seconds to first contentful paint and 375 KiB of encoded JavaScript through first scene readiness. These are lab observations on the Cloud runtime, without Vercel delivery or real-device performance data. WebKit could not run because the Cloud host lacked libraries, and Firefox exited during profile startup. Safari on a physical iPhone and a deployed Vercel preview still need verification.

## Houdini HIVEalt London 2026

Replaced the third fictional stop with the first real badge. The card face and branded woven strap are vector reconstructions from the submitted reference photos, and the rectangular swivel clip is modelled from the front and reverse views. Both badge faces use the same design shown in the references. Dimensions are estimated and the catalogue records the year and city from the badge.

ESLint, TypeScript and the Next.js production build passed. Chromium verified the new record, drag and release, keyboard face switching, touch browsing and panel scrolling, and the static artwork fallback. The update remains in the Cloud workspace for review before publishing the named badge.

## Solana electronic badge

Replaced the Relay placeholder at stop 02 with a vector reconstruction of the photographed electronic badge. The front shows the recorded screen, the back shows the vent pattern, and the 3D model adds a thicker purple enclosure, six raised controls, two clips and two branded ribbons. Dimensions are estimates. The catalogue uses a descriptive title because the event and date have not been supplied.

ESLint, TypeScript and the production build passed. Chromium verified desktop and touch navigation, mesh selection, keyboard face switching, pointer release, touch dragging and scrolling on the electronic exhibit, and the static back artwork with WebGL disabled. The update is in the Cloud workspace for review.

## Breakpoint, Git Nation and CityJS

Added Breakpoint 2026 at stop 01, replacing the final fictional badge, and added the Git Nation crew pass and CityJS London 2026 at stops 04 and 05. The face and strap textures are reconstructions from the references. Breakpoint has two purple straps and a schematic floor plan on the back. Git Nation uses the matching red artwork shown in both views. CityJS has a white printed strap and a distinct schedule reverse. The catalogue marks all new measurements as estimated and includes event details only where known.

Lint, TypeScript and the production build passed. Chromium verified 3D inspection and keyboard flipping at all five stops, touch scrolling and drag release at 320 pixels, and the CityJS reverse with WebGL disabled. This update remains in Codex Cloud for review.

## CampAI, DDX London, BrainStation and Flower AI Summit

Added four photo-based reconstructions as stops 06–09. CampAI has a blank light reverse, DDX includes the 20 November 2026 date printed on its face, BrainStation has a blank label on the reverse, and Flower uses its distinct orange programme reverse and blue strap fitting. All four sets of dimensions are estimated. QR codes are omitted.

SVGs parsed successfully. ESLint, TypeScript and the production build passed. Chromium verified keyboard face switching and Escape at all nine stops, visible navigation at 320 pixels, native touch browsing, drag release and the Flower reverse without WebGL. The update is in the Cloud workspace for review.

## droidcon London, SEV0 and Ship LDN

Added photo-based reconstructions at stops 10–12. droidcon London uses its 30–31 October 2025 catalogue date and preserves the separate 2026 Berlin advertisement on the reverse. SEV0 uses the matching print on both photographed faces and a printed double lanyard. Ship LDN features the attendee artwork on the front and the exploded diagram and Vercel mark on the reverse. QR codes and printed Wi-Fi credentials are excluded. Physical measurements are estimated.

SVG parsing, ESLint, TypeScript and the production build passed. Chromium verified all twelve records and keyboard flipping, two-row navigation at 320 pixels, native touch browsing, touch release and the Ship LDN reverse without WebGL. The update is in the Cloud workspace for review.

## AI DevCon, RNLConf and design+AI

Added three photo-based reconstructions at stops 13–15. AI DevCon uses its crew artwork and double lanyard, RNLConf uses the matching Tower Bridge artwork on both faces, and design+AI has separate volunteer and sponsor faces. Dimensions are estimated, and unconfirmed dates and venues are omitted.

SVG parsing, ESLint, TypeScript and the production build passed. Chromium verified all fifteen records, keyboard flipping and Escape, two-row navigation at 320 pixels, native touch browsing, touch release and the design+AI reverse without WebGL. The update is in the Cloud workspace for review.

## Exhibition interface redesign

Rebuilt the live exhibition around a paper catalogue column and an uninterrupted dark viewing area. Added a named, keyboard-accessible index, reduced the scroll distance between stops and restyled the inspection panel. The badge camera has a straight viewing angle and leaves clearance below the card.

ESLint, TypeScript and the production build passed. Chromium verified all fifteen objects, keyboard flipping, Escape, index selection, 320-pixel touch scrolling and drag release, and the WebGL fallback. The final framing was also checked with direct mesh selection, index focus restoration, next and previous controls, and portrait and landscape layout. Screenshots show the production build in Codex Cloud.

## Full-screen exhibition and contact sheet

Replaced the split opening page with a full-viewport exhibition. The camera follows scroll continuously in the default motion mode, with lit objects at different depths, and the object index now uses the front artwork for all fifteen badges. The close-up opens as a full-screen inspection with the original physics controls.

ESLint, TypeScript and the production build passed. Chromium exercised the fifteen-stop inspection flow, direct mesh selection, sequential navigation, contact-sheet jumps and focus restoration, keyboard flip and Escape, mobile layout and native touch scrolling at 320 pixels, touch drag and release, and static fallback. Desktop, contact-sheet, inspection and mobile captures are in the Cloud workspace.

## Typography

Replaced the tightly spaced display headings with Barlow Condensed Medium. ESLint, TypeScript and the production build passed. Chromium confirmed the bundled font loaded and the title fit at six viewport sizes, including 320-pixel portrait and 667 × 375 landscape. Direct badge selection, focus return, arrows and index navigation also passed.

## Pegboard exhibition

All fifteen objects have a wall colour, visible inscription, accession label, materials description and short collector’s note. The DDX artwork now has a hand-drawn reconstruction of the marker lettering. The opening title contracts after the first stop. Each navigation button has a short metal clip sound with a mute control. Mobile places the paper label below the objects.

Lint and TypeScript passed. The cloud shell blocked Turbopack’s PostCSS worker from binding a local socket, so its default build is unverified here. An isolated Next.js production build using webpack and worker threads completed. Offline Chromium checks use that build and its static assets.

Chromium verified all fifteen inscriptions and front images, five viewport sizes from 320 to 1440 pixels, sound generation and mute, direct 3D selection, index and sequential navigation, keyboard face selection, native touch scrolling, drag release and the static reverse view. Desktop and phone captures were inspected. Live preview hosting could not bind a socket in this session.

## London Tech Week, Devoxx UK and Open House by ClickHouse

Acc. 016–018 bring the exhibition to eighteen stops. Each has two reconstructed faces and a ribbon texture based on the supplied photographs. The London Tech Week and Open House passes use two snap hooks. Devoxx uses a single hook. Measurements are estimates. The public artwork omits QR payloads, badge identifiers and Wi-Fi passwords.

Lint and typechecking passed. Turbopack could not open its local CSS worker socket in this environment. An isolated webpack production build passed. Chromium verified all nine new textures, index selection, keyboard flipping, the final navigation boundary and all three reverse faces at 320 px without WebGL.

## Security LIVE! Europe, OpenAI DevDay London and Caffè Culture Show

Stops 019–021 bring the archive to twenty-one. The collector identified the purple-ribbon badge as OpenAI DevDay London. Its name sticker faces forward and the multicoloured circles fill the reverse. The Security LIVE! pass carries alternating AWS and event marks on the ribbon. Its reverse omits the Wi-Fi password. Caffè Culture uses the matching visitor print shown in both close-ups, with the badge identifier and barcode omitted. The September dates come from the pass. All three sets of measurements are estimates.

ESLint, TypeScript and an isolated webpack production build passed. Turbopack’s CSS worker could not bind a local socket in the cloud shell. Chromium checked the twenty-one-entry index, the three new stops, keyboard face selection, the final navigation boundary and the reverse views at 320 px without WebGL.

## Birkbeck campus guide

Accession 022 reproduces the printed welcome message, red Birkbeck ribbon and a simplified drawing of the Bloomsbury campus map. Its caption quotes the guide. The record is undated, dimensions are estimated and the prospectus QR code is omitted.

Lint, typechecking and an isolated webpack production build passed. Chromium verified the 22-entry index, the guide’s caption and textures, keyboard flipping, the last-stop control and the reverse face on the 320-pixel static viewer. The default Turbopack build could not bind its CSS worker socket in the cloud shell.

## Hanging rail and enlarged print

All 22 stops share a metal rail. The paper label and collector commentary have been removed from the wall. Visitors can drag across the ribbon samples to select a pass. Picking up a pass opens its record and the Read print control for inspecting either face.

Lint, TypeScript and an isolated webpack production build passed. Chromium verified all 22 inscriptions and front images, five viewport sizes from 320 to 1440 pixels, touch and mouse scrubbing, keyboard range controls, physical badge selection, native page scrolling, touch release, keyboard flipping, focus restoration, clip sound and mute. The enlarged print scrolls and preserves the selected face when returning to the whole pass, including with WebGL disabled. The default Turbopack build remains unverified in this environment because the CSS worker cannot bind its local socket. Mobile checks used emulation.

## Scroll motion and catalogue

All 22 hanging views were rendered from the catalogue and checked for complete transparent bounds. Browsing loads no WebGL canvas. A Chromium wheel-input recording captured intermediate positions, a reversal during travel and a stop with no further rail transform writes. The contents, printed ribbon scale and caption tracked the selected pass.

The production assets passed Chromium checks at five viewport sizes from 320 to 1440 pixels. Checks covered mouse and touch pickup and release, native touch scrolling, keyboard face selection, reduced motion, direct selection, enlarged print, focus restoration and the WebGL-disabled viewer. Phone checks used emulation. ESLint, TypeScript and an isolated webpack production build passed. The default Turbopack build could not bind the PostCSS worker socket in this environment.

## Illustrated London exhibition

A silver snap-hook guide introduces the 22 passes above an illustrated London skyline. Inspecting a badge changes the guide’s pose and stamps its index entry for the current visit. The opening camera move and scroll parallax respect reduced motion.

Chromium checked all 22 inscriptions and front images, five viewport sizes from 320 to 1440 pixels, and single-pass framing at rest. The motion recording captured 16 intermediate frames during wheel navigation, a reversal before settling, and zero further transform writes at rest. The WebGL canvas loads on pickup. Mouse and emulated touch checks covered dragging, release, native scrolling, ribbon selection and enlarged-print panning. Keyboard face selection, focus return, sound and mute, the viewed stamp and the static viewer passed. A mobile walkthrough records the opening, a stop change and a DDX inspection. Physical phone testing remains outstanding.

ESLint and TypeScript passed. An isolated webpack production build passed. The default Turbopack build could not bind its PostCSS worker socket in the cloud shell.

## Mobile badge print, exhibition order and event records

The inspection viewer now uses lossless pixel textures for its 3D artwork. All 56 textures match the dimensions of their SVG masters. Mobile WebKit and Chromium at 3× pixel density showed the Houdini print across the whole card. WebKit also rendered both DDX faces, including the handwriting. Checks used emulated phones. A physical iPhone check remains outstanding.

Solana, Vercel and Breakpoint open the exhibition. Houdini is stop 11. Git Nation, BrainStation and Caffè Culture close it. The design+AI sticker was cleaned in the source print, texture and hanging specimen.

The badge records cover 21 dated event passes and one undated campus guide. Public references accompany each description. BrainStation is the Notion Developer Platform Watch Party, identified by the collector. The sound control previews the navigation click on enable and shows its current state. Index cards align at the top of their images and captions, including wrapped titles.

ESLint, TypeScript and an isolated webpack production build passed. The local Turbopack worker was unable to bind a socket.

## Pickup motion

Both the hanging badge and Pick up pass now carry the selected specimen into the close-up. Mobile Chromium and WebKit captured intermediate positions for both entry points. The same checks verified keyboard flipping and focus return after repeated opens. Chromium also verified touch dragging and release, native dialog scrolling, reduced motion, the entrance without View Transitions and the WebGL-disabled reverse face. These were emulated phone checks.

ESLint, TypeScript and an isolated webpack production build passed. The local Turbopack build was blocked by its CSS worker's socket restriction.

## First-frame lanyard geometry

All 22 records have front and reverse captures from the live rig. Desktop Chromium and emulated mobile WebKit opened Solana, Houdini and the landscape Caffè Culture badge with texture loading deliberately delayed. Once loaded, the resting previews and live images matched in framing on both faces. Chromium also verified touch drag and release, native scrolling, keyboard flipping, focus return and the static reverse. A physical handset check remains outstanding.

ESLint, TypeScript and the isolated webpack production build passed. The local default build encountered the sandbox socket restriction in the Turbopack CSS worker.

## Mobile pickup return and exhibition order

OpenAI DevDay London now appears fifth, RNLConf tenth and design+AI eleventh. CampAI moves from fifth to sixth and Houdini from eleventh to twelfth. All 22 accession records retain their artwork and metadata.

Mobile WebKit and Chromium emulation verified the index order, tapping the hanging pass and the pickup button, returning to the same stop, and keyboard face selection and focus restoration. Chromium also checked touch dragging, release and native scrolling. ESLint, TypeScript and the isolated webpack production build passed. The local Turbopack CSS worker was unable to bind its socket. Physical handset testing remains outstanding.

## Mobile framing, return motion and print details

The mobile caption reserves two title lines. Narrow phones also reserve a second inscription line. At a 390-pixel viewport the previously measured 35-pixel change between OpenAI and CampAI fell to zero. Across all 22 stops at widths of 320, 375, 390, 430 and 640 pixels the gallery and pickup button stayed within one pixel of their starting heights.

Mobile WebKit and Chromium emulation captured intermediate frames on pickup and return from both entry points. Other checks covered returning from a print or a scrolled record, interrupting the pickup, reduced motion, native touch scrolling, drag release, keyboard flipping, focus return and static fallback. A delayed first load kept the drag prompt hidden until the target was available. Print details for Solana, DDX and RNLConf remain pannable. Physical handset testing remains outstanding.

ESLint, TypeScript and an isolated webpack production build passed. The sandbox blocked the local Turbopack CSS worker from binding its socket.

## Solana OS on the electronic pass

Use badge boots the official WebAssembly firmware into the archived case. Mobile Chromium and WebKit emulation verified the launcher, opening Guide with the physical controls, returning with Escape, BOOT, keyboard navigation and preserving X Dex through put-down and pickup. Back to exhibition ends the session. The neighbouring Vercel pass retained its inspection controls. A failed firmware download recovered with Restart. The binary is fetched only on first use within an inspection.

Touch drag and release, native scrolling, keyboard flipping, reduced motion, focus restoration and the static reverse passed the Chromium checks. Lint, typechecking and an isolated webpack production build passed. The local Turbopack CSS worker was blocked from binding its socket. Physical phone testing remains outstanding.

## Solana mobile control spacing

The pickup hint sits on its own row, 12 pixels below Use badge and the face controls. Mobile WebKit and Chromium emulation verified the spacing from 320 to 600 pixels wide, plus the reading, operating and put-down states and keyboard face selection. ESLint, TypeScript and the isolated webpack build passed. The local Turbopack CSS worker could not bind its socket.

## Solana button legends and CityJS front

All six Solana legends are centered beneath their button caps on the operating case, hanging pass and enlarged print. The CityJS front retains the green handwritten name and removes the check mark and ink smudge. Both front textures and hanging views were regenerated.

Mobile Chromium and WebKit emulation verified clearance and touch-target alignment at 320, 393 and 430 pixels, opening Guide with the controls, and the CityJS index, hanging and print views. Touch drag and release, native scrolling and keyboard face selection also passed in Chromium. ESLint, TypeScript and an isolated webpack production build passed. The local Turbopack CSS worker could not bind its socket. Physical handset testing remains outstanding.

## Opt-in clasp sound

The sound control previews a short clasp snap. Changes to the featured pass, pickups and returns reuse that sound. Muting stops playback immediately. A failed load offers a retry, and muting during a pending load cancels the preview.

Mobile Chromium and WebKit emulation verified playback through the arrows, scrolling, ribbon, index, pickup and return, plus silence after muting and retry after a failed request. Chromium captured non-silent PCM from the media element. Touch drag and release, native scrolling and keyboard face selection passed. ESLint, TypeScript and the isolated webpack build passed. The local Turbopack worker could not bind its socket. Physical handset speaker testing remains outstanding.

## Visitor analytics

Installed the Next.js integration for Vercel Web Analytics in the root layout. ESLint, TypeScript and the production build passed. The exhibition route is still statically prerendered.
