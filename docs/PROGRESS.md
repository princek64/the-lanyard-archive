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
