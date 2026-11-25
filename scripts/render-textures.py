"""Bake the catalogue's WebGL textures. Run from the repo root with Node 24, Inkscape and Pillow."""
import json
import subprocess
import tempfile
from pathlib import Path

from PIL import Image


catalogue = json.loads(subprocess.check_output([
    "node", "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--input-type=module", "-e",
    "import {exhibition} from './lib/badges.ts'; console.log(JSON.stringify(exhibition))",
]))
sources = {
    Path("public", url.lstrip("/"))
    for badge in catalogue
    for url in (badge["artwork"]["front"], badge["artwork"]["back"], badge["lanyard"].get("texture"))
    if url and url.endswith(".svg")
}

with tempfile.TemporaryDirectory() as folder:
    png = Path(folder, "print.png")
    for source in sorted(sources):
        subprocess.run(["inkscape", str(source), "--export-area-page", "-o", str(png)], check=True)
        with Image.open(png) as image:
            image.save(source.with_suffix(".webp"), lossless=True)
