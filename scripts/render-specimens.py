"""Capture the live inspection rig. Run from the repo root with a local archive server."""
import argparse
import base64
import io
import json
from pathlib import Path
import subprocess

from PIL import Image
from playwright.sync_api import sync_playwright

# The observer runs only inside the offline capture browser. The normal viewer
# needs no capture flag, extra camera or preserved WebGL drawing buffer.
OBSERVE = """
window.__THREE_DEVTOOLS__ = new EventTarget();
window.__THREE_DEVTOOLS__.addEventListener("observe", ({ detail }) => {
  if (!detail.isScene) return;
  detail.onAfterRender = (renderer, scene, camera) => {
    window.inspectionFrame = { renderer, scene, camera };
  };
});
"""
CAPTURE = """
({ frameWidth, frameHeight, centreBelowAnchor }) => {
  const { renderer, scene, camera } = window.inspectionFrame;
  const lens = camera.clone();
  const originalWidth = renderer.domElement.width;
  const originalHeight = renderer.domElement.height;
  const ratio = renderer.getPixelRatio();
  try {
    renderer.setPixelRatio(1);
    renderer.setSize(frameWidth, frameHeight, false);
    lens.left = -1.5 * frameWidth / frameHeight;
    lens.right = -lens.left;
    lens.top = 1.5;
    lens.bottom = -1.5;
    lens.zoom = 1;
    lens.position.y += centreBelowAnchor - 1.37;
    lens.updateProjectionMatrix();
    renderer.render(scene, lens);
    return renderer.domElement.toDataURL("image/png").split(",")[1];
  } finally {
    renderer.setPixelRatio(ratio);
    renderer.setSize(originalWidth / ratio, originalHeight / ratio, false);
  }
}
"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ids", nargs="*", help="Accession numbers (default: all)")
    parser.add_argument("--url", default="http://localhost:3000")
    parser.add_argument("--chromium", help="Path to an installed Chromium executable")
    args = parser.parse_args()
    badges = json.loads(subprocess.check_output([
        "node", "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--input-type=module", "-e",
        "import {exhibition} from './lib/badges.ts';console.log(JSON.stringify(exhibition))",
    ]))
    if set(args.ids) - {badge["id"] for badge in badges}:
        parser.error("Unknown accession number")

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=args.chromium, args=[
            "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader",
        ])
        page = browser.new_page(viewport={"width": 1200, "height": 900}, reduced_motion="reduce")
        page.add_init_script(OBSERVE)
        page.goto(args.url)
        for index, badge in enumerate(badges):
            if args.ids and badge["id"] not in args.ids:
                continue
            page.get_by_role("button", name="Object index").click()
            page.locator(".object-index button").nth(index).click()
            page.get_by_role("button", name="Pick up pass", exact=True).click()
            page.locator(".scene[data-ready=true] .badge-hit").wait_for()
            record = page.locator(".focus-record .eyebrow").inner_text()
            if record.lower() != f"object {badge['id']}":
                raise ValueError(f"Expected object {badge['id']}, opened {record}")
            page.wait_for_function("window.inspectionFrame?.renderer.domElement.isConnected")
            span = badge["dimensions"]["height"] + badge["lanyard"]["length"]
            for face, asset in [("Front", "specimen"), ("Back", "specimenBack")]:
                page.get_by_role("button", name=face, exact=True).click()
                # Allow the ribbon joints to settle and the selected side to paint.
                page.evaluate("""() => new Promise(resolve => {
                    let frames = 0;
                    function step() {
                        if (++frames === 12) resolve();
                        else requestAnimationFrame(step);
                    }
                    requestAnimationFrame(step);
                })""")
                encoded = page.evaluate(CAPTURE, {
                    "frameWidth": 464, "frameHeight": 980,
                    # This desktop viewport uses the studio camera's 34 mm bottom clearance.
                    "centreBelowAnchor": (span / 2 + 34) / 100,
                })
                image = Image.open(io.BytesIO(base64.b64decode(encoded))).convert("RGBA")
                if not image.getchannel("A").getbbox():
                    raise ValueError(f"Empty render for {record}")
                target = Path("public", badge["artwork"][asset].lstrip("/"))
                image.save(target, lossless=True)
            print(f"Captured {record}", flush=True)
            page.keyboard.press("Escape")
            page.locator(".focus-dialog[open]").wait_for(state="detached")
        browser.close()


if __name__ == "__main__":
    main()
