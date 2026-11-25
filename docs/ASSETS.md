# Preparing badge assets

1. Photograph each face straight on, with the camera parallel to the badge. Use broad, neutral light and minimise glare. Take one reference with a ruler and another showing the edge and thickness.
2. Photograph the strap flat and untwisted. Include a full branding repeat from edge to edge and keep a separate close-up of the weave. Photograph the attachment from the front, back and side.
3. Correct perspective before cropping. Crop each face to its physical outline and orient it upright. Match the width-to-height ratio in the badge configuration. Fill the rectangular canvas to its edges because the mesh already rounds the corners.
4. Export in sRGB as WebP or PNG. Start with 1,024 to 1,536 pixels on the long edge and check that fine text holds up. Export the strap as a clean lengthwise repeat. Store files under `public/badges/`.
5. Update `lib/badges.ts` with the face paths, edge colour, physical dimensions, strap width and visible hanging length, and event details. Record the actual fastening type and geometry separately if it differs from the placeholder clip. Preview both faces, especially the back orientation.

## Exhibition records

The exhibition order is defined in the `exhibition` array in `lib/badges.ts`. Each badge has a unique ID, display date and ISO date, plus a venue and a short note about the event. Remove the fictional marker only when replacing a placeholder with a real record. Use distinctly readable artwork so that each badge stays recognisable when seen from a distance.

## Hanging views

The catalogue's `artwork.specimen` points to a transparent WebP render. To regenerate a single item, run `blender -b -t 4 --python-exit-code 1 -P scripts/render-specimens.py -- 007` from the repository root. Omit the accession number to render the collection. The offline script reads the catalogue with Node 24, rasterises the printed art with Inkscape and exports WebP with Pillow inside Blender. The website build consumes the committed images.
