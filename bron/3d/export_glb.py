# Exporteert elk woningtype als GLB voor de 3D-weergave op de site: public/assets/huis3d/<type>.glb
# Materialen gaan alleen als naam mee; de site bouwt ze zelf op. Lagen en wissels zitten in de extras.
import bpy, os
PAD = "/Users/tobiasderyck/Claude code projects/nestcompany-site/"
UIT = PAD + "public/assets/huis3d/"; os.makedirs(UIT, exist_ok=True)
verslag = {}
for T in TYPES:
    ns = {'TYPE': T, 'EXPORT': True}; exec(compile(open(PAD + "bron/3d/bouw_huis.py").read(), "bouw_huis.py", 'exec'), ns)
    ns['staat'](dak=False, zon=True, gevel=False, wp=True, steigers=True, lader=True, bordje=True, bankje=True)
    for o in bpy.data.objects: o.hide_viewport = False; o.hide_render = False
    dg = bpy.context.evaluated_depsgraph_get(); romp = ns['romp']
    me = bpy.data.meshes.new_from_object(romp.evaluated_get(dg)); romp.modifiers.clear(); romp.data = me
    cam, doel = bpy.data.objects['camera'], bpy.data.objects['doel']
    info = {'camera': list(cam.location), 'doel': list(doel.location), 'L': ns['L'], 'D': ns['D'], 'H': ns['H']}
    for o in list(bpy.data.objects):
        if o.name.startswith(('snij', 'grond', 'camera', 'doel', 'binnen')): bpy.data.objects.remove(o, do_unlink=True)
    bpy.ops.export_scene.gltf(filepath=UIT + T + ".glb", export_format='GLB', export_apply=True, export_extras=True,
                              export_cameras=False, export_lights=False, export_yup=True, export_image_format='NONE', export_texcoords=False, export_animations=False)
    verslag[T] = dict(info, kb=round(os.path.getsize(UIT + T + ".glb") / 1024))
import json; open(UIT + "info.json", "w").write(json.dumps(verslag))
result = verslag
