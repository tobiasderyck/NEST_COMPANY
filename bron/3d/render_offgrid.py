# Off-grid / hybride: de open bebouwing bij daglicht met netpaal, netkabel en een batterij tegen de gevel.
# De site tekent er stroomlijnen over; daarvoor schrijft dit script de ankerpunten weg (in % van het beeld).
import bpy, math, os, json
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
PAD = "/Users/tobiasderyck/Claude code projects/nestcompany-site/bron/3d/"
UIT = PAD + "renders/offgrid/"; os.makedirs(UIT, exist_ok=True)
ns = {'TYPE': 'open'}; exec(compile(open(PAD + "bouw_huis.py").read(), "bouw_huis.py", 'exec'), ns)
ns['staat'](dak=True, zon=True, gevel=True)
L, D, H, NOK, M = ns['L'], ns['D'], ns['H'], ns['NOK'], ns['M']; doos, cilinder, m_effen = ns['doos'], ns['cilinder'], ns['m_effen']
sc = bpy.context.scene

# batterij: gestapelde modules tegen de voorgevel, rechts van de deur
BX, BY = 3.95, -D / 2 - 0.2
wit = m_effen('batterij_wit', '#eef0ef', 0.4); strip = m_effen('batterij_strip', '#2a2d2f', 0.4)
doos('bat_voet', (0.78, 0.3, 0.08), (BX, BY, 0.04), M['alu'])
for i in range(3):
    doos('bat_module', (0.74, 0.28, 0.42), (BX, BY, 0.3 + i * 0.44), wit)
    doos('bat_naad', (0.74, 0.285, 0.02), (BX, BY, 0.51 + i * 0.44), strip)
doos('bat_kop', (0.74, 0.28, 0.3), (BX, BY, 1.56), wit); doos('bat_licht', (0.3, 0.01, 0.03), (BX, BY - 0.142, 1.6), M['doek_oranje'])

# netpaal met kabel naar de topgevel
PX, PY, PH = -L / 2 - 4.6, 0.8, 7.6
hout = m_effen('paal', '#6b5a48', 0.85)
cilinder('netpaal', 0.11, PH, (PX, PY, PH / 2), 'Z', hout, 20)
doos('dwarsarm', (0.1, 1.5, 0.1), (PX, PY, PH - 0.35), hout)
for dy in (-0.6, 0.6): cilinder('isolator', 0.05, 0.16, (PX, PY + dy, PH - 0.22), 'Z', M['doek'], 12)
AAN = Vector((-L / 2 - 0.02, 0.2, NOK - 1.5))                 # waar de kabel op de topgevel aankomt
doos('aansluiting', (0.05, 0.16, 0.22), AAN, M['alu'])
kc = bpy.data.curves.new('netkabel', 'CURVE'); kc.dimensions = '3D'; kc.bevel_depth = 0.022; kc.bevel_resolution = 3
a, b = Vector((PX, PY, PH - 0.14)), AAN; n = 24; sp = kc.splines.new('POLY'); sp.points.add(n)
for i, pt in enumerate(sp.points):
    t = i / n; c = a.lerp(b, t); c.z -= 0.55 * math.sin(math.pi * t); pt.co = (*c, 1)          # de kabel hangt licht door
ko = bpy.data.objects.new('netkabel', kc); sc.collection.objects.link(ko); kc.materials.append(M['inkt'])

cam = bpy.data.objects['camera']; doel = bpy.data.objects['doel']
doel.location = (-1.5, 0, 4.0); cam.location = (-23.5, -27.5, 8.0)
bpy.context.view_layer.update()

def pct(v):
    c = world_to_camera_view(sc, cam, Vector(v)); return [round(c.x * 100, 2), round((1 - c.y) * 100, 2)]
glas = [o for o in bpy.data.objects if o.name.startswith('paneelglas')]
midden = sum((o.matrix_world.translation for o in glas), Vector()) / len(glas)
ankers = {'zon': pct(midden), 'batterij': pct((BX, BY - 0.15, 1.2)), 'huis': pct((0.6, -D / 2, 2.4)), 'paal': pct(a), 'gevel': pct(AAN),
          'kabel': [pct(a.lerp(b, i / 8) - Vector((0, 0, 0.55 * math.sin(math.pi * i / 8)))) for i in range(9)], 'meter': pct((-L / 2, 0.2, 1.4))}
json.dump(ankers, open(UIT + 'ankers.json', 'w'))
sc.cycles.samples = 128
bpy.app.driver_namespace['offgrid'] = {'UIT': UIT}
result = ankers
