"""From the repository root: blender -b -t 4 -P scripts/render-specimens.py [-- 007]

Offline art pipeline. Requires Node 24, Inkscape and Blender with Pillow.
Only regenerate the affected object when its print or dimensions change.
"""
import json
import math
import subprocess
import sys
import tempfile
from pathlib import Path

import bpy
from mathutils import Vector
from PIL import Image

ROOT = Path.cwd()
PUBLIC = ROOT / "public"
entries = json.loads(subprocess.check_output([
    "node", "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--input-type=module", "-e",
    "import {exhibition} from './lib/badges.ts'; console.log(JSON.stringify(exhibition))",
]))
selected = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def material(name, colour, metal=0, rough=.48):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    rgb = [int(colour[i:i+2], 16) / 255 for i in (1, 3, 5)]
    shader.inputs["Base Color"].default_value = [v ** 2.2 for v in rgb] + [1]
    shader.inputs["Metallic"].default_value = metal
    shader.inputs["Roughness"].default_value = rough
    return mat


def textured(name, source, colour, temp):
    mat = material(name, colour)
    if source:
        png = temp / (Path(source).stem + ".png")
        if not png.exists():
            subprocess.run(["inkscape", str(PUBLIC / source.lstrip("/")), "-w", "650",
                            "-o", str(png)], check=True, stdout=subprocess.DEVNULL)
        node = mat.node_tree.nodes.new("ShaderNodeTexImage")
        node.image = bpy.data.images.load(str(png))
        mat.node_tree.links.new(node.outputs["Color"], mat.node_tree.nodes.get("Principled BSDF").inputs["Base Color"])
    return mat


def surface(name, vertices, polygons, mat, uv=None):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], polygons)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    if uv:
        layer = mesh.uv_layers.new()
        for loop in mesh.loops:
            layer.data[loop.index].uv = uv[loop.vertex_index]
    return obj


def wire(name, points, radius, mat, closed=False):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = radius
    curve.bevel_resolution = 4
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points)-1)
    for point, xyz in zip(spline.bezier_points, points):
        point.co = xyz
        point.handle_left_type = point.handle_right_type = "AUTO"
    spline.use_cyclic_u = closed
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)


def softbox(position, target, energy, size):
    bpy.ops.object.light_add(type="AREA", location=position)
    light = bpy.context.object
    light.rotation_euler = (Vector(target)-light.location).to_track_quat("-Z", "Y").to_euler()
    light.data.energy = energy
    light.data.shape = "DISK"
    light.data.size = size


def render(entry, temp):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 16
    scene.cycles.use_denoising = False
    scene.cycles.transparent_max_bounces = 2
    scene.world = bpy.data.worlds.new("Soft surroundings")
    scene.world.use_nodes = True
    scene.world.node_tree.nodes["Background"].inputs["Color"].default_value = (.65,.65,.65,1)
    scene.world.node_tree.nodes["Background"].inputs["Strength"].default_value = .65
    scene.render.film_transparent = True
    scene.view_settings.view_transform = "Standard"
    scene.render.resolution_x, scene.render.resolution_y = 464, 980
    scene.render.resolution_percentage = 100
    bpy.ops.object.camera_add(location=(0,-7,-1.37), rotation=(math.pi/2,0,0))
    scene.camera = bpy.context.object
    scene.camera.data.type = "ORTHO"
    scene.camera.data.ortho_scale = 3.0
    softbox((-2,-3,3), (0,0,-1), 145, 3)
    softbox((2,-1,1), (0,0,-1.2), 75, 1.2)
    metal = material("Polished steel", "#b9bfd1", .96, .18)
    strap = entry["lanyard"]
    fabric = textured("Woven strap", strap.get("texture"), strap["colour"], temp)
    width, length = strap["width"]/100, strap["length"]/100
    spread = strap.get("clipSpread", 0)/200
    shader = fabric.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Sheen Weight"].default_value = .16
    shader.inputs["Roughness"].default_value = .78
    for side in (-1,1):
        vertices, faces, uv = [], [], []
        for i in range(65):
            t = i/64
            bow = math.sin(math.pi*t)
            x = side*(.034*(1-t) + spread*t + (.21 if not spread else .102)*bow)
            twist = side*(1.0*(1-t) + .66*math.sin(t*math.pi*2))
            for edge in (-1,1):
                half = edge*width/2
                vertices.append((x+half*math.cos(twist), side*.075*bow + half*math.sin(twist), -t*length))
                uv.append(((edge+1)/2, (1-t)*length / (width*strap.get("repeatAspect",3))))
            if i:
                n = 2*i
                faces.append((n-2,n-1,n+1,n))
        obj = surface("Folded ribbon", vertices, faces, fabric, uv)
        for face in obj.data.polygons:
            face.use_smooth = True
        obj.modifiers.new("Fabric edge", "SOLIDIFY").thickness=.004
    for x in ([-spread,spread] if spread else [0]):
        ring = width*.53
        if entry.get("attachment") == "swivel-clip":
            for u,v in [((-ring,0),(ring,0)), ((ring,0),(ring,-.075)),
                        ((ring,-.075),(-ring,-.075)), ((-ring,-.075),(-ring,0))]:
                wire("Webbing buckle", [(x+u[0],0,-length+u[1]),(x+v[0],0,-length+v[1])],.009,metal)
        else:
            wire("D-ring", [(x-ring,0,-length+.009),(x+ring,0,-length+.009),
                            (x+ring*.86,0,-length-.048),(x,0,-length-.08),(x-ring*.86,0,-length-.048)], .009, metal, True)
        if strap.get("sleeveColour"):
            bpy.ops.mesh.primitive_cube_add(size=1, location=(x,-.009,-length+.045))
            sleeve = bpy.context.object
            sleeve.dimensions = (width+.014,.035,.085)
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            sleeve.data.materials.append(material("Crimp sleeve",strap["sleeveColour"],.78,.28))
            bevel = sleeve.modifiers.new("Rolled edge","BEVEL")
            bevel.width, bevel.segments = .008, 3
        wire("Swivel", [(x,0,-length-.075),(x,-.004,-length-.12)],.022,metal)
        wire("Spring clasp", [(x,0,-length-.11),(x-.034,-.006,-length-.166),
                              (x-.022,-.019,-length-.236),(x+.032,-.024,-length-.235),
                              (x+.043,-.017,-length-.211),(x+.015,-.008,-length-.161),
                              (x+.012,0,-length-.122)], .011, metal, True)
    dims = entry["dimensions"]
    w,h,r = [dims[key]/100 for key in ("width","height","radius")]
    depth = dims["thickness"]/100
    top = -length-.213
    rim = []
    for cx,cz,start in [(w/2-r,top-r,0),(-w/2+r,top-r,90),(-w/2+r,top-h+r,180),(w/2-r,top-h+r,270)]:
        for i in range(7):
            a = math.radians(start+90*i/6)
            rim.append((cx+r*math.cos(a),cz+r*math.sin(a)))
    card = textured("Printed face",entry["artwork"]["front"],"#ffffff",temp)
    vertices = [(x,.012,z) for x,z in rim]
    surface("Front",vertices,[tuple(range(len(rim)))],card,[(.5+x/w,1+(z-top)/h) for x,z in rim])
    n=len(rim)
    surface("Edge", vertices+[(x,.012+depth,z) for x,z in rim],
            [(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)],material("Card edge",entry["artwork"]["edge"]))
    scene.render.filepath = str(temp / "object.png")
    bpy.ops.render.render(write_still=True)
    dest = PUBLIC / entry["artwork"]["specimen"].lstrip("/")
    dest.parent.mkdir(exist_ok=True)
    with Image.open(scene.render.filepath) as image:
        image.save(dest, quality=92, method=6)


with tempfile.TemporaryDirectory() as tmp:
    for item in entries:
        if not selected or item["id"] in selected:
            render(item, Path(tmp))
