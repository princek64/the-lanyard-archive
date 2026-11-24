# Design

The opening view is the exhibition. Oversized type and a small set of controls sit over a full-viewport scene of suspended badges. Lighting and depth distinguish the active object from its neighbours. The bottom edge carries the current event, position in the collection, inspection button and sequential controls. On phones, the objects occupy the space between the title and controls.

Scroll moves the camera continuously along the collection while the caption follows the nearest badge. Previous and Next advance one stop. The Object index opens a contact sheet of the badge fronts. Selecting a print takes visitors to its stop. Escape closes the sheet and restores focus to its trigger.

Clicking a badge or choosing Inspect badge opens a full-screen close-up beside the event record. On mobile, the record follows the viewer in the same scrollable panel. Escape or Back to exhibition returns to the same stop and restores focus.

Drag the badge to move it and release it to watch it settle. Shift-drag with a mouse to rotate and snap to the nearer face. Flip badge and the Front and Back controls work with touch and keyboard. Only the focused badge hit target captures gestures, so the rest of the panel scrolls normally.

Reduced motion uses immediate stop and face changes, removes camera parallax and idle sway, and damps the focused badge more quickly. The static viewer preserves all fifteen stops, both faces and their records when WebGL is unavailable.
