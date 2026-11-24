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
