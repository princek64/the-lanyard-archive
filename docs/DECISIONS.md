# Decisions

- **Exhibit data.** Badge artwork, dimensions, strap appearance and event metadata live in one typed record. One scene unit corresponds to 100 mm. The single record can move into a collection with the same shape.
- **Card geometry.** An extruded outline provides rounded corners and a bevel. The front and back caps have independent UVs and materials. Artwork defaults to locally bundled SVGs and can be replaced with raster assets.
- **Suspension.** Rapier spherical joints connect lightweight bodies to a fixed anchor. A smoothed ribbon follows the bodies and carries the repeating textile print. The ribbon is a render mesh and does not model cloth folds, collision or self-contact.
- **Handling.** A captured pointer moves the badge as a kinematic body while held. Release restores dynamics with capped velocity. The badge swings in the display plane. Face inspection uses a separate yaw around the clip, which preserves the suspension and makes both sides readable.
- **Rendering.** The orthographic camera scales with the viewer and object dimensions. The studio uses direct lighting, a small shadow map and a capped pixel ratio. Three.js texture clones and custom geometries are disposed on unmount. The shared loader retains source images for reuse.
- **Interface motion.** Three.js handles face interpolation and Rapier handles the swing. CSS handles layout and control states. No Motion dependency is needed for the first exhibit.

## Phase 2

- **Exhibition camera.** A sticky canvas follows a native scroll track. Scroll position and explicit stop buttons drive the same three camera positions. A perspective camera makes the depth between badges visible.
- **Physics budget.** The exhibition uses mesh-only objects with lightweight sway. Opening focus pauses its render loop and mounts the Phase 1 Rapier rig for one badge. Closing focus disposes that viewer and resumes the exhibition.
- **Focus and content.** A native modal dialog handles keyboard containment and Escape. The active stop and opening control are preserved. Event record components are rendered on the server and passed to the client shell.
- **Fallback.** The exhibition initially shows the badge artwork. Canvas readiness replaces it with the scene. If WebGL is unavailable or lost, the artwork remains selectable and the focused viewer provides front and back images.

## First real badge

Houdini HIVEalt London 2026 uses one artwork texture on both faces because both reference photographs show matching print. Artwork and the woven Houdini ribbon are redrawn from the photos. An optional attachment variant selects the rectangular swivel clip in the browse and focus views, and a configurable repeat aspect keeps printed strap artwork proportional. The event panel omits unavailable pass type and personal notes and marks the dimensions as estimated.

## Electronic badge

The Solana exhibit uses an estimated thick enclosure, separate face textures and raised control meshes. The screen and rear vent pattern are recorded as artwork. Two clips and ribbons branch from the existing suspended physics chain and follow the rotating badge in focus. The event name, date and location are omitted until supplied.

## Five-stop exhibition

Scroll travel scales with the number of transitions so adding stops preserves the existing scroll distance between badges. The three latest card exhibits share a snap-hook attachment model with a configurable single or double ribbon. Breakpoint's illustrated reverse is a schematic based on the photo. Personal and schedule QR codes are omitted because their destinations were not supplied.

## Nine-stop navigation

The numbered navigation wraps into two rows at narrow widths and reserves space below the canvas. A configurable metal sleeve reuses the snap-hook assembly for the satin BrainStation and blue Flower strap fittings. DDX reverse panels retain the printed section labels and omit the reference QR codes. The Flower programme QR code is also omitted.

The twelve-stop exhibition uses two rows of seven navigation controls on narrow phones. The wider stacked layout also covers tablets where the event label and fourteen controls would compete for space. The droidcon reverse keeps the Berlin promotion separate from the London event record. Ship LDN retains the artwork and Vercel mark, with its printed Wi-Fi credentials omitted.

The fifteen-stop exhibition retains every direct stop control. The layout stacks controls on tablets and uses two rows on smaller screens. RNLConf shares one texture across its matching photographed faces. The AI DevCon and design+AI reverse reconstructions retain the printed app and programme labels with QR codes omitted.

## Catalogue redesign

The exhibition separates the active object and controls from the dark viewing area. A named index replaces the persistent numbered button rows while preserving direct access to every stop, sequential buttons and native scroll. The index restores focus on dismissal and reveals the selected row when reopened. The focus viewer shares the same paper and studio surfaces. The loading and WebGL fallback view renders the selected object and its immediate neighbours.

## Full-screen exhibition

Native scrolling supplies fractional camera progress independently of the active caption. A named contact sheet presents the actual artwork in a modal and jumps to the selected stop after closing, once page scrolling is restored. The exhibition render loop pauses while the contact sheet or inspection view is open. The inspection view retains the single-badge physics rig. Reduced motion snaps the camera to the nearest stop and disables pointer parallax.

## Wall exhibition

Each accession carries its visible inscription, materials and two colours in the catalogue. The existing date and collector’s note feed the wall label. Unknown dates read “Undated”. STIX Two Text sets the masthead, inscriptions and italic notes. Regular and italic Latin fonts and their OFL licence are bundled locally.

The exhibition moves the pegs relative to a fixed light and camera. The CSS wall supplies colour and perforations. A transparent Three.js plane receives real-time shadows. Each strip of fabric has a curved mesh from peg to clasp. The overview briefly swings around the peg on pointer entry, while close inspection retains its independent physics rig. The navigation buttons synthesize two short audio transients on activation and share a mute control.

## Ribbon browsing

The wall uses a continuous rail and leaves the space around the passes clear. Materials and measurements appear in the inspection view. The caption uses the inscription and event name from the catalogue.

Ribbon samples reuse each object's strap texture or fabric colour. One native range input tracks the entire strip and scrolls the existing exhibition to the selected stop. The rail, caption, strip and object index share one selection. The static viewer uses the same navigation and records.

Reading the print uses the same face artwork at a larger scale in a native scroll region. It releases the close-up physics scene while open and works in the static viewer. Returning to the whole pass keeps the selected face.

## Composited exhibition rail

The overview displays transparent WebP renders of the configured objects. A translating layer moves the row, and nearby passes tilt around the peg according to the rail's velocity. This removes continuous WebGL rendering and texture-loading boundaries from the scroll path. The independent inspection view still loads Three.js and Rapier on demand.

Native scroll supplies the target. A frame-rate-independent exponential response drives one displayed position shared by the hanging objects, caption, contents and index needle. The animation loop stops at rest. A contact-sheet jump, ribbon scrub or reduced-motion preference applies the new position directly. No wheel or touch handlers cancel page scrolling.
