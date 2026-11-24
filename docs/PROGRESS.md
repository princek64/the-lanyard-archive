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
