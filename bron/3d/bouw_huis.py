# NEST — het huis voor "Zet de koffie maar klaar", procedureel opgebouwd in Blender.
# Draaien in Blender:  ns = {'TYPE': 'open'}; exec(open(".../bron/3d/bouw_huis.py").read(), ns)
# TYPE: 'open' | 'halfopen' | 'rij' | 'appartement'.   Daarna: ns['staat'](dak=True, zon=True, gevel=False)
import bpy, bmesh, math
from mathutils import Vector

TYPE = globals().get('TYPE', 'halfopen')
PLAT = TYPE == 'appartement'
EXPORT = globals().get('EXPORT', False)      # lichte geometrie voor de 3D-weergave in de browser
L, D, H = {'open': (9.0, 8.0, 5.3), 'halfopen': (9.0, 8.0, 5.3), 'rij': (6.6, 8.0, 5.3), 'appartement': (12.0, 9.0, 9.3)}[TYPE]
BUUR_L, BUUR_R = TYPE == 'rij', TYPE in ('halfopen', 'rij')
HELLING = math.radians(40)
OV = 0.38
OVL, OVR = (0 if BUUR_L else 0.30), (0 if BUUR_R else 0.30)   # oversteek aan een vrije kopgevel
NOK = H + (D / 2) * math.tan(HELLING)
PAN_B, PAN_L, PAN_STAP = 0.25, 0.40, 0.31
LUCHT_DRAAI, BELICHTING = 125, -0.9

# ── opruimen ────────────────────────────────────────────────
for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
for blok in (bpy.data.meshes, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
    for d in list(blok):
        if d.users == 0: blok.remove(d)
col = bpy.context.scene.collection

def obj(naam, mesh):
    o = bpy.data.objects.new(naam, mesh); col.objects.link(o); return o

def doos(naam, maat, plaats, mat=None, rot=None):
    me = bpy.data.meshes.new(naam); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1)
    bmesh.ops.scale(bm, vec=Vector(maat), verts=bm.verts); bm.to_mesh(me); bm.free()
    o = obj(naam, me); o.location = plaats
    if rot: o.rotation_euler = rot
    if mat: me.materials.append(mat)
    return o

def cilinder(naam, straal, lengte, plaats, as_='X', mat=None, segm=28):
    me = bpy.data.meshes.new(naam); bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segm, radius1=straal, radius2=straal, depth=lengte)
    bm.to_mesh(me); bm.free(); o = obj(naam, me); o.location = plaats
    if as_ == 'X': o.rotation_euler = (0, math.pi / 2, 0)
    if as_ == 'Y': o.rotation_euler = (math.pi / 2, 0, 0)
    for p in me.polygons: p.use_smooth = True
    if mat: me.materials.append(mat)
    return o

# ── materialen ──────────────────────────────────────────────
def mat(naam):
    m = bpy.data.materials.new(naam); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]; return m, nt, b

def kleur(h, a=1):
    h = h.lstrip('#'); r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (lin(r), lin(g), lin(b), a)

def n(nt, soort, **kw):
    x = nt.nodes.new(soort)
    for k, v in kw.items(): setattr(x, k, v)
    return x

def muur_uv(nt):
    """Vlakke projectie op een verticale muur: (langs de muur, hoogte)."""
    tc = n(nt, 'ShaderNodeTexCoord'); p = n(nt, 'ShaderNodeSeparateXYZ'); nn = n(nt, 'ShaderNodeSeparateXYZ')
    nt.links.new(tc.outputs['Object'], p.inputs[0]); nt.links.new(tc.outputs['Normal'], nn.inputs[0])
    ab = n(nt, 'ShaderNodeMath', operation='ABSOLUTE'); gt = n(nt, 'ShaderNodeMath', operation='GREATER_THAN')
    nt.links.new(nn.outputs['X'], ab.inputs[0]); nt.links.new(ab.outputs[0], gt.inputs[0]); gt.inputs[1].default_value = 0.5
    mx = n(nt, 'ShaderNodeMix'); mx.data_type = 'FLOAT'
    nt.links.new(gt.outputs[0], mx.inputs[0]); nt.links.new(p.outputs['X'], mx.inputs[2]); nt.links.new(p.outputs['Y'], mx.inputs[3])
    c = n(nt, 'ShaderNodeCombineXYZ'); nt.links.new(mx.outputs[0], c.inputs['X']); nt.links.new(p.outputs['Z'], c.inputs['Y'])
    return c.outputs[0], tc

TEX = "/Users/tobiasderyck/Claude code projects/nestcompany-site/bron/3d/polyhaven/"

def beeld(nt, bestand, kleurdata, vector):
    t = n(nt, 'ShaderNodeTexImage'); t.image = bpy.data.images.load(TEX + bestand, check_existing=True)
    if not kleurdata: t.image.colorspace_settings.name = 'Non-Color'
    nt.links.new(vector, t.inputs['Vector']); return t

def m_scan(naam, set_, meter, vuil=0.0, tint=None, ruw_plus=0.0):
    """Gescand materiaal van Poly Haven (CC0), vlak geprojecteerd op de muren; 'meter' = breedte van één tegel."""
    m, nt, b = mat(naam); uv, tc = muur_uv(nt)
    mp = n(nt, 'ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1 / meter, 1 / meter, 1); nt.links.new(uv, mp.inputs[0])
    dif = beeld(nt, set_ + '_Diffuse.jpg', True, mp.outputs[0]); uit = dif.outputs['Color']
    ao = beeld(nt, set_ + '_AO.jpg', False, mp.outputs[0])
    m1 = n(nt, 'ShaderNodeMix'); m1.data_type = 'RGBA'; m1.blend_type = 'MULTIPLY'; m1.inputs[0].default_value = 0.8
    nt.links.new(uit, m1.inputs[6]); nt.links.new(ao.outputs['Color'], m1.inputs[7]); uit = m1.outputs[2]
    if tint:
        mt = n(nt, 'ShaderNodeMix'); mt.data_type = 'RGBA'; mt.blend_type = 'MULTIPLY'; mt.inputs[0].default_value = 1
        nt.links.new(uit, mt.inputs[6]); mt.inputs[7].default_value = kleur(tint); uit = mt.outputs[2]
    if vuil:
        # grote, zachte vlekken en een vuilere strook onderaan, zoals op een gevel van veertig jaar
        ns = n(nt, 'ShaderNodeTexNoise'); ns.inputs['Scale'].default_value = 0.55; ns.inputs['Detail'].default_value = 6
        nt.links.new(tc.outputs['Object'], ns.inputs['Vector'])
        rp = n(nt, 'ShaderNodeValToRGB'); rp.color_ramp.elements[0].position = 0.38; rp.color_ramp.elements[0].color = (1 - vuil, 1 - vuil * 1.05, 1 - vuil * 1.1, 1); rp.color_ramp.elements[1].position = 0.7
        nt.links.new(ns.outputs['Fac'], rp.inputs[0])
        mv = n(nt, 'ShaderNodeMix'); mv.data_type = 'RGBA'; mv.blend_type = 'MULTIPLY'; mv.inputs[0].default_value = 1
        nt.links.new(uit, mv.inputs[6]); nt.links.new(rp.outputs[0], mv.inputs[7]); uit = mv.outputs[2]
        sp = n(nt, 'ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sp.inputs[0])
        mr = n(nt, 'ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 0.3; mr.inputs['From Max'].default_value = 1.4
        mr.inputs['To Min'].default_value = 1 - vuil * 0.9; mr.inputs['To Max'].default_value = 1; nt.links.new(sp.outputs['Z'], mr.inputs['Value'])
        mz = n(nt, 'ShaderNodeMix'); mz.data_type = 'RGBA'; mz.blend_type = 'MULTIPLY'; mz.inputs[0].default_value = 1
        nt.links.new(uit, mz.inputs[6]); nt.links.new(mr.outputs[0], mz.inputs[7]); uit = mz.outputs[2]
    nt.links.new(uit, b.inputs['Base Color'])
    rg = beeld(nt, set_ + '_Rough.jpg', False, mp.outputs[0])
    if ruw_plus:
        ad = n(nt, 'ShaderNodeMath', operation='ADD', use_clamp=True); ad.inputs[1].default_value = ruw_plus
        nt.links.new(rg.outputs['Color'], ad.inputs[0]); nt.links.new(ad.outputs[0], b.inputs['Roughness'])
    else: nt.links.new(rg.outputs['Color'], b.inputs['Roughness'])
    nm = beeld(nt, set_ + '_nor_gl.jpg', False, mp.outputs[0]); nmap = n(nt, 'ShaderNodeNormalMap'); nmap.space = 'OBJECT' if False else 'TANGENT'
    ds = beeld(nt, set_ + '_Displacement.jpg', False, mp.outputs[0])
    bp = n(nt, 'ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.9; bp.inputs['Distance'].default_value = 0.012
    nt.links.new(ds.outputs['Color'], bp.inputs['Height']); nt.links.new(bp.outputs[0], b.inputs['Normal'])
    return m

def m_baksteen(): return m_scan('baksteen', 'red_brick', 1.9, vuil=0.2, tint='#fff4ec')
def m_crepi(): return m_scan('crepi', 'white_stucco', 1.6, vuil=0.06, tint='#f6f1e8', ruw_plus=0.1)

def m_pan(naam, tinten, mos):
    m, nt, b = mat(naam); geo = n(nt, 'ShaderNodeNewGeometry'); tc = n(nt, 'ShaderNodeTexCoord')
    rp = n(nt, 'ShaderNodeValToRGB'); el = rp.color_ramp.elements
    el[0].color = kleur(tinten[0]); el[1].color = kleur(tinten[-1])
    for i, t in enumerate(tinten[1:-1]): e = el.new((i + 1) / (len(tinten) - 1)); e.color = kleur(t)
    nt.links.new(geo.outputs['Random Per Island'], rp.inputs[0])
    uit = rp.outputs[0]
    if mos:
        ns = n(nt, 'ShaderNodeTexNoise'); ns.inputs['Scale'].default_value = 0.9; ns.inputs['Detail'].default_value = 8; ns.inputs['Roughness'].default_value = 0.65
        mp = n(nt, 'ShaderNodeMapping'); mp.inputs['Scale'].default_value = (0.35, 1, 1)
        nt.links.new(tc.outputs['Object'], mp.inputs[0]); nt.links.new(mp.outputs[0], ns.inputs['Vector'])
        mr = n(nt, 'ShaderNodeValToRGB'); mr.color_ramp.elements[0].position = 0.5; mr.color_ramp.elements[1].position = 0.68; mr.color_ramp.elements[1].color = (0.75, 0.75, 0.75, 1)
        nt.links.new(ns.outputs['Fac'], mr.inputs[0])
        mx = n(nt, 'ShaderNodeMix'); mx.data_type = 'RGBA'; nt.links.new(mr.outputs[0], mx.inputs[0])
        nt.links.new(uit, mx.inputs[6]); mx.inputs[7].default_value = kleur('#4a4f2c'); uit = mx.outputs[2]
        vl = n(nt, 'ShaderNodeTexNoise'); vl.inputs['Scale'].default_value = 3.5; vl.inputs['Detail'].default_value = 4; nt.links.new(tc.outputs['Object'], vl.inputs['Vector'])
        vr = n(nt, 'ShaderNodeValToRGB'); vr.color_ramp.elements[0].position = 0.3; vr.color_ramp.elements[0].color = (0.45, 0.42, 0.4, 1); vr.color_ramp.elements[1].position = 0.62
        nt.links.new(vl.outputs['Fac'], vr.inputs[0])
        m2 = n(nt, 'ShaderNodeMix'); m2.data_type = 'RGBA'; m2.blend_type = 'MULTIPLY'; m2.inputs[0].default_value = 1
        nt.links.new(uit, m2.inputs[6]); nt.links.new(vr.outputs[0], m2.inputs[7]); uit = m2.outputs[2]
    nt.links.new(uit, b.inputs['Base Color'])
    fijn = n(nt, 'ShaderNodeTexNoise'); fijn.inputs['Scale'].default_value = 160; nt.links.new(tc.outputs['Object'], fijn.inputs['Vector'])
    bp = n(nt, 'ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.3 if mos else 0.12; bp.inputs['Distance'].default_value = 0.003
    nt.links.new(fijn.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs[0], b.inputs['Normal'])
    b.inputs['Roughness'].default_value = 0.86 if mos else 0.52; return m

def m_effen(naam, hex_, ruw=0.6, metaal=0.0, coat=0.0):
    m, nt, b = mat(naam); b.inputs['Base Color'].default_value = kleur(hex_); b.inputs['Roughness'].default_value = ruw
    b.inputs['Metallic'].default_value = metaal; b.inputs['Coat Weight'].default_value = coat
    bv = n(nt, 'ShaderNodeBevel'); bv.samples = 2; bv.inputs['Radius'].default_value = 0.006; nt.links.new(bv.outputs[0], b.inputs['Normal']); return m

def m_paneel():
    m, nt, b = mat('paneel'); tc = n(nt, 'ShaderNodeTexCoord')
    br = n(nt, 'ShaderNodeTexBrick'); br.offset = 0; br.inputs['Scale'].default_value = 1; br.inputs['Brick Width'].default_value = 0.182
    br.inputs['Row Height'].default_value = 0.091; br.inputs['Mortar Size'].default_value = 0.0012
    br.inputs['Color1'].default_value = kleur('#0b0e14'); br.inputs['Color2'].default_value = kleur('#0d1118'); br.inputs['Mortar'].default_value = kleur('#1c2230')
    nt.links.new(tc.outputs['Object'], br.inputs['Vector']); nt.links.new(br.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = 0.07; b.inputs['Coat Weight'].default_value = 1; b.inputs['Coat Roughness'].default_value = 0.03
    b.inputs['Specular IOR Level'].default_value = 0.6; return m

def m_glas():
    m, nt, b = mat('glas'); b.inputs['Base Color'].default_value = (1, 1, 1, 1); b.inputs['Roughness'].default_value = 0.0
    b.inputs['Transmission Weight'].default_value = 1; b.inputs['IOR'].default_value = 1.45; return m

def m_gordijn():
    m, nt, b = mat('gordijn'); tc = n(nt, 'ShaderNodeTexCoord'); uv, _ = muur_uv(nt)
    wv = n(nt, 'ShaderNodeTexWave'); wv.inputs['Scale'].default_value = 9; wv.inputs['Distortion'].default_value = 1.2; nt.links.new(uv, wv.inputs['Vector'])
    rp = n(nt, 'ShaderNodeValToRGB'); rp.color_ramp.elements[0].color = kleur('#b9b3a4'); rp.color_ramp.elements[1].color = kleur('#f1eee6')
    nt.links.new(wv.outputs['Fac'], rp.inputs[0]); nt.links.new(rp.outputs[0], b.inputs['Base Color'])
    bp = n(nt, 'ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.6; nt.links.new(wv.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs[0], b.inputs['Normal'])
    b.inputs['Roughness'].default_value = 0.9; return m

M = dict(baksteen=m_baksteen(), crepi=m_crepi(),
         pan_oud=m_pan('pan_oud', ['#8a4429', '#a9562f', '#c06a3c', '#9c4f30', '#b8623a'], True),
         pan_nieuw=m_pan('pan_nieuw', ['#27292b', '#2e3133', '#333638', '#2a2c2e'], False),
         zink=m_effen('zink', '#8d9296', 0.42, 0.9), zink_nieuw=m_effen('zink_nieuw', '#3a3d40', 0.4, 0.85),
         kozijn_oud=m_effen('kozijn_oud', '#e4e0d4', 0.6), kozijn_nieuw=m_effen('kozijn_nieuw', '#26292b', 0.45),
         deur_oud=m_effen('deur_oud', '#5d7560', 0.55), deur_nieuw=m_effen('deur_nieuw', '#2a2d2f', 0.4),
         steen=m_effen('blauwe_steen', '#6a6b69', 0.6), plint_nieuw=m_effen('plint_nieuw', '#3b3e40', 0.8),
         hout=m_effen('boeiboord', '#d9d4c8', 0.6), boei_nieuw=m_effen('boei_nieuw', '#2c2f31', 0.5),
         alu=m_effen('alu_zwart', '#16181a', 0.35, 0.8), buur=m_effen('buur', '#f2f0ea', 1.0),
         onderdak=m_effen('onderdak', '#2b2622', 0.9), paneel=m_paneel(), glas=m_glas(), gordijn=m_gordijn(), binnen=m_effen('binnen', '#0b0c0d', 0.9), beton=m_effen('beton', '#a39f95', 0.85))

M['grind'] = m_effen('grind', '#8b8880', 0.95); M['epdm'] = m_effen('epdm', '#232526', 0.7)
M['wp_wit'] = m_effen('wp_wit', '#dcdcd8', 0.45); M['wp_rooster'] = m_effen('wp_rooster', '#1b1d1e', 0.5, 0.6)
M['plank'] = m_effen('plank', '#b08d5e', 0.8); M['doek'] = m_effen('doek', '#f4f2ec', 0.7); M['doek_oranje'] = m_effen('doek_oranje', '#d14d29', 0.7); M['inkt'] = m_effen('inkt', '#1d2320', 0.6)

# ── de romp ─────────────────────────────────────────────────
def prisma(naam, lengte, x0, mat_):
    me = bpy.data.meshes.new(naam); bm = bmesh.new()
    prof = [(-D / 2, 0), (D / 2, 0), (D / 2, H), (0, NOK), (-D / 2, H)]
    a = [bm.verts.new((x0, y, z)) for y, z in prof]; b = [bm.verts.new((x0 + lengte, y, z)) for y, z in prof]
    bm.faces.new(a[::-1]); bm.faces.new(b)
    for i in range(5): j = (i + 1) % 5; bm.faces.new((a[i], a[j], b[j], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    o = obj(naam, me); me.materials.append(mat_); return o

if PLAT:
    romp = doos('romp', (L, D, H), (0, 0, H / 2), M['baksteen'])
else:
    romp = prisma('romp', L, -L / 2, M['baksteen'])
    BL = 3.6 if TYPE == 'rij' else 5.0
    if BUUR_R: prisma('buur', BL, L / 2, M['buur'])
    if BUUR_L: prisma('buur', BL, -L / 2 - BL, M['buur'])
plint = doos('plint', (L + 0.03, D + 0.03, 0.42), (0, 0, 0.21), M['steen'])
grond = doos('grond', (160, 160, 0.02), (0, 0, -0.01)); grond.is_shadow_catcher = True

kozijnen, deuren, gordijnen, lateien, gevel_wissel, dak_wissel = [], [], [], [], [], []
def opening(cx, z0, b, h, wand='voor', deur=False):
    """Raam of deur: snijdt de muur uit en zet kozijn, glas en dorpel."""
    zc = z0 + h / 2
    if wand == 'voor': basis, langs, uit = Vector((cx, -D / 2, zc)), Vector((1, 0, 0)), Vector((0, -1, 0))
    else:              basis, langs, uit = Vector((-L / 2, cx, zc)), Vector((0, 1, 0)), Vector((-1, 0, 0))
    def maat(l, u, z): return (abs(langs.x) * l + abs(uit.x) * u, abs(langs.y) * l + abs(uit.y) * u, z)
    s = doos('snij', maat(b, 0.5, h), basis); s.hide_render = True; s.display_type = 'WIRE'
    mod = romp.modifiers.new('gat', 'BOOLEAN'); mod.object = s; mod.operation = 'DIFFERENCE'; mod.solver = 'EXACT'
    diep = lambda d: basis - uit * d
    doos('glas', maat(b, 0.008, h), diep(0.13), M['glas'])
    doos('binnen', maat(b, 0.01, h), diep(0.243), M['binnen'])
    hoog = h > 1.9
    if not deur:
        for kant in (-1, 1):
            gordijnen.append(doos('gordijn', maat(b * 0.3, 0.01, h * 0.98), diep(0.2) + langs * kant * b * 0.35, M['gordijn']))
    p, t = 0.065, 0.07
    stukken = [(-b / 2 + p / 2, 0, p, h), (b / 2 - p / 2, 0, p, h), (0, h / 2 - p / 2, b, p), (0, -h / 2 + p / 2, b, p)]
    if not deur: stukken += [(0, 0, p * 0.8, h)] + ([(0, h * 0.18, b, p * 0.8)] if 1.25 < h <= 1.9 else [])
    for dl, dz, bb, hh in stukken:
        kozijnen.append(doos('kozijn', maat(bb, t, hh), diep(0.11) + langs * dl + Vector((0, 0, dz)), M['kozijn_oud']))
    if deur:
        deuren.append(doos('deurblad', maat(b - 2 * p, 0.05, h - p), diep(0.125) + Vector((0, 0, -p / 2)), M['deur_oud']))
        doos('klink', maat(0.03, 0.05, 0.14), diep(0.08) + langs * (b / 2 - p - 0.11) + Vector((0, 0, -0.08)), M['zink'])
        doos('trede', maat(b + 0.5, 0.75, 0.16), basis + uit * 0.3 + Vector((0, 0, -h / 2 + 0.08)), M['steen'])
        doos('lamp', maat(0.1, 0.09, 0.2), basis + uit * 0.045 + langs * (b / 2 + 0.28) + Vector((0, 0, 0.75)), M['alu'])
    else:
        lateien.append(doos('latei', maat(b + 0.3, 0.02, 0.16), basis + uit * 0.004 + Vector((0, 0, h / 2 + 0.08)), M['beton']))
        if not hoog: doos('dorpel', maat(b + 0.14, 0.24, 0.055), basis + uit * 0.02 + Vector((0, 0, -h / 2 - 0.0275)), M['steen'])

if TYPE in ('open', 'halfopen'):
    for x in (-2.95, 2.55): opening(x, 0.95, 1.35, 1.5)
    opening(-0.35, 0.16, 1.02, 2.3, deur=True)
    for x in (-2.95, -0.35, 2.55): opening(x, 3.35, 1.15, 1.35)
    opening(-1.6, 0.95, 1.1, 1.5, 'zij'); opening(1.7, 3.35, 1.0, 1.35, 'zij'); opening(0, 6.2, 0.7, 0.9, 'zij')
    WP_X = 3.95
elif TYPE == 'rij':
    opening(0.75, 0.95, 1.7, 1.5); opening(-2.0, 0.16, 1.02, 2.3, deur=True)
    for x in (-1.7, 1.2): opening(x, 3.35, 1.25, 1.35)
    WP_X = 2.7
else:
    for v in range(3):
        z = 0.95 + v * 3.1
        for x in (-4.6, 4.6): opening(x, z, 1.5, 1.5)
        if v == 0:
            opening(0, 0.16, 1.3, 2.4, deur=True); opening(-2.3, z, 1.2, 1.5); opening(2.3, z, 1.2, 1.5)
            doos('luifel', (2.6, 1.1, 0.1), (0, -D / 2 - 0.55, 2.78), M['beton'])
        else:
            for x in (-1.6, 1.6): opening(x, z - 0.8, 1.7, 2.3)
            zb = v * 3.1 + 0.06
            doos('balkon', (5.6, 1.3, 0.16), (0, -D / 2 - 0.65, zb), M['beton'])
            doos('balustrade', (5.5, 0.012, 1.0), (0, -D / 2 - 1.26, zb + 0.6), M['glas'])
            for x in (-2.75, 2.75): doos('balustrade', (0.012, 1.24, 1.0), (x, -D / 2 - 0.64, zb + 0.6), M['glas'])
            doos('leuning', (5.56, 0.05, 0.04), (0, -D / 2 - 1.26, zb + 1.12), M['alu'])
        for y in (-2.0, 2.2): opening(y, z, 1.3, 1.5, 'zij')
    WP_X = 4.9

# ── het dak ─────────────────────────────────────────────────
panelen = []
PB, PL, TUS = 1.134, 1.722, 0.02
if not PLAT:
    def pan_mesh():
        me = bpy.data.meshes.new('pan'); bm = bmesh.new(); nu, nv = (5, 1) if EXPORT else (10, 3); vs = []
        for j in range(nv + 1):
            for i in range(nu + 1):
                u, v = i / nu, j / nv
                z = 0.024 * math.exp(-((u - 0.84) / 0.12) ** 2) - 0.006 * math.sin(math.pi * min(u / 0.7, 1)) + 0.024 * (1 - v)
                vs.append(bm.verts.new((u * PAN_B * 1.03, v * PAN_L, z)))
        for j in range(nv):
            for i in range(nu):
                a = j * (nu + 1) + i; bm.faces.new((vs[a], vs[a + 1], vs[a + nu + 2], vs[a + nu + 1]))
        bm.to_mesh(me); bm.free()
        for p in me.polygons: p.use_smooth = True
        return me

    LENGTE_X = L + OVL + OVR; X0 = -(L / 2 + OVL)
    SCHUIN = (D / 2 + OV) / math.cos(HELLING)
    NX, NY = math.ceil(LENGTE_X / PAN_B), math.ceil((SCHUIN - 0.1) / PAN_STAP)
    GOOT_Z = H - OV * math.tan(HELLING) + 0.07
    dakvlakken = []
    for kant in (1, -1):                     # 1 = voorkant, -1 = achterkant
        vlak = bpy.data.objects.new('dakvlak', None); col.objects.link(vlak)
        vlak.location = (X0 if kant == 1 else X0 + LENGTE_X, -kant * (D / 2 + OV), GOOT_Z)
        vlak.rotation_euler = (HELLING, 0, 0 if kant == 1 else math.pi)
        pan = obj('pannen', pan_mesh()); pan.parent = vlak; pan.data.materials.append(M['pan_oud'])
        if not EXPORT: so = pan.modifiers.new('dikte', 'SOLIDIFY'); so.thickness = 0.016; so.offset = -1
        ax = pan.modifiers.new('breedte', 'ARRAY'); ax.count = NX; ax.use_relative_offset = False; ax.use_constant_offset = True; ax.constant_offset_displace = (PAN_B, 0, 0)
        ay = pan.modifiers.new('rijen', 'ARRAY'); ay.count = NY; ay.use_relative_offset = False; ay.use_constant_offset = True; ay.constant_offset_displace = (0, PAN_STAP, 0)
        plaat = doos('dakplaat', (LENGTE_X, SCHUIN, 0.07), (LENGTE_X / 2, SCHUIN / 2, -0.05), M['onderdak']); plaat.parent = vlak
        boei = doos('boeiboord', (LENGTE_X, 0.03, 0.2), (LENGTE_X / 2, -0.005, -0.1), M['hout']); boei.parent = vlak; boei.rotation_euler = (-HELLING, 0, 0)
        goot = cilinder('goot', 0.075, LENGTE_X + 0.04, (LENGTE_X / 2, -0.09, -0.03), 'X', M['zink']); goot.parent = vlak
        randen = ([0.0] if (OVL if kant == 1 else OVR) else []) + ([LENGTE_X] if (OVR if kant == 1 else OVL) else [])
        for u in randen:
            wv = doos('windveer', (0.03, SCHUIN, 0.18), (u, SCHUIN / 2, -0.07), M['hout']); wv.parent = vlak; dak_wissel.append((wv, 'hout', 'boei_nieuw'))
        dakvlakken.append(vlak)
        dak_wissel += [(pan, 'pan_oud', 'pan_nieuw'), (goot, 'zink', 'zink_nieuw'), (boei, 'hout', 'boei_nieuw')]
    nokpan = cilinder('nok', 0.13, LENGTE_X, (X0 + LENGTE_X / 2, 0, NOK + 0.09), 'X', M['pan_oud'], 20); dak_wissel.append((nokpan, 'pan_oud', 'pan_nieuw'))
    afvoer = cilinder('afvoer', 0.045, GOOT_Z - 0.1, (-L / 2 + 0.28, -D / 2 - 0.075, (GOOT_Z - 0.1) / 2), 'Z', M['zink']); dak_wissel.append((afvoer, 'zink', 'zink_nieuw'))
    sx = min(2.4, L / 2 - 0.9)
    schouw = doos('schouw', (0.62, 0.5, 1.9), (sx, 0.55, NOK - 0.25), M['baksteen']); gevel_wissel.append((schouw, 'baksteen', 'crepi'))
    doos('schouwkap', (0.74, 0.62, 0.07), (sx, 0.55, NOK + 0.735), M['beton'])
    # zonnepanelen op het voorste dakvlak
    KOLOMMEN, RIJEN = (5 if L > 8 else 4), 2
    u0 = OVL + (L - (KOLOMMEN * PB + (KOLOMMEN - 1) * TUS)) / 2 - (0.5 if L > 8 else 0.25)
    v0 = (SCHUIN - (RIJEN * PL + TUS)) / 2 + 0.25
    for r in range(RIJEN):
        for k in range(KOLOMMEN):
            c = (u0 + k * (PB + TUS) + PB / 2, v0 + r * (PL + TUS) + PL / 2, 0.115)
            rand = doos('paneelrand', (PB, PL, 0.035), c, M['alu']); rand.parent = dakvlakken[0]
            glas = doos('paneelglas', (PB - 0.022, PL - 0.022, 0.004), (c[0], c[1], c[2] + 0.018), M['paneel']); glas.parent = dakvlakken[0]
            panelen += [rand, glas]
    for i in range(3):
        rail = doos('rail', (KOLOMMEN * (PB + TUS), 0.04, 0.05), (u0 + KOLOMMEN * (PB + TUS) / 2 - TUS / 2, v0 + 0.35 + i * 1.38, 0.075), M['alu'])
        rail.parent = dakvlakken[0]; panelen.append(rail)
else:
    dakvloer = doos('platdak', (L - 0.5, D - 0.5, 0.06), (0, 0, H + 0.03), M['grind']); dak_wissel.append((dakvloer, 'grind', 'epdm'))
    for (mx, my, px, py) in ((L, 0.28, 0, -D / 2 + 0.14), (L, 0.28, 0, D / 2 - 0.14), (0.28, D, -L / 2 + 0.14, 0), (0.28, D, L / 2 - 0.14, 0)):
        op = doos('opstand', (mx, my, 0.45), (px, py, H + 0.225), M['baksteen']); gevel_wissel.append((op, 'baksteen', 'crepi'))
        kap = doos('dakrand', (mx + 0.06, my + 0.06, 0.035), (px, py, H + 0.467), M['zink']); dak_wissel.append((kap, 'zink', 'zink_nieuw'))
    doos('liftkoker', (2.2, 2.4, 1.5), (3.6, 2.2, H + 0.75), M['beton'])
    afvoer = cilinder('afvoer', 0.05, H, (-L / 2 + 0.3, -D / 2 - 0.08, H / 2), 'Z', M['zink']); dak_wissel.append((afvoer, 'zink', 'zink_nieuw'))
    for rij, y in enumerate((-2.6, -0.4, 1.8)):
        houder = bpy.data.objects.new('paneelrij', None); col.objects.link(houder); houder.location = (-1.2, y, H + 0.34); houder.rotation_euler = (math.radians(14), 0, 0)
        for k in range(4):
            c = ((k - 1.5) * (PL + TUS), 0, 0)
            rand = doos('paneelrand', (PL, PB, 0.035), c, M['alu']); rand.parent = houder
            glas = doos('paneelglas', (PL - 0.022, PB - 0.022, 0.004), (c[0], 0, 0.018), M['paneel']); glas.parent = houder
            panelen += [rand, glas]
        voet = doos('ballast', (4 * (PL + TUS), 0.5, 0.12), (-1.2, y + 0.25, H + 0.12), M['beton']); panelen.append(voet)

# ── warmtepomp (buitenunit) ─────────────────────────────────
warmtepomp = []
wy = -D / 2 - 0.42
warmtepomp.append(doos('wp_voet', (0.9, 0.36, 0.1), (WP_X, wy, 0.05), M['beton']))
warmtepomp.append(doos('wp_kast', (0.98, 0.38, 0.86), (WP_X, wy, 0.53), M['wp_wit']))
warmtepomp.append(cilinder('wp_rooster', 0.33, 0.02, (WP_X - 0.1, wy - 0.195, 0.53), 'Y', M['wp_rooster'], 40))
warmtepomp.append(cilinder('wp_naaf', 0.07, 0.03, (WP_X - 0.1, wy - 0.2, 0.53), 'Y', M['wp_wit'], 24))
for i in range(5): warmtepomp.append(doos('wp_lamel', (0.66, 0.012, 0.012), (WP_X - 0.1, wy - 0.207, 0.31 + i * 0.11), M['wp_rooster']))

# ── steiger met NEST-doek ───────────────────────────────────
steiger = []
SX0, SX1 = -L / 2 + 0.15, L / 2 - 0.15
YB, YV = -D / 2 - 0.28, -D / 2 - 1.08
niveaus = [2.0 + 2.0 * i for i in range(int((H - 0.3) // 2))]
top = niveaus[-1] + 1.1
aantal = max(2, round((SX1 - SX0) / 2.4)); xs = [SX0 + (SX1 - SX0) * i / aantal for i in range(aantal + 1)]
for x in xs:
    for y in (YB, YV): steiger.append(cilinder('staander', 0.024, top, (x, y, top / 2), 'Z', M['zink'], 12))
    for z in niveaus + [top - 0.05]: steiger.append(cilinder('korteling', 0.022, YB - YV, (x, (YB + YV) / 2, z), 'Y', M['zink'], 10))
for z in niveaus:
    for y in (YB, YV): steiger.append(cilinder('ligger', 0.022, SX1 - SX0, ((SX0 + SX1) / 2, y, z), 'X', M['zink'], 10))
    steiger.append(cilinder('leuning', 0.02, SX1 - SX0, ((SX0 + SX1) / 2, YV, z + 1.0), 'X', M['zink'], 10))
    steiger.append(doos('vloer', (SX1 - SX0, YB - YV - 0.06, 0.045), ((SX0 + SX1) / 2, (YB + YV) / 2, z + 0.045), M['plank']))
    steiger.append(doos('kantplank', (SX1 - SX0, 0.03, 0.15), ((SX0 + SX1) / 2, YV + 0.02, z + 0.14), M['plank']))
for i in range(aantal):
    a, b = xs[i], xs[i + 1]; lengte = math.hypot(b - a, 2.0)
    dg = cilinder('schoor', 0.018, lengte, ((a + b) / 2, YV - 0.03, 1.0), 'X', M['zink'], 8); dg.rotation_euler = (0, math.pi / 2 - math.atan2(2.0, (b - a) * (1 if i % 2 else -1)), 0); steiger.append(dg)
DB, DH = min(3.4, L * 0.42), 1.5
dx, dz = SX0 + DB / 2 + 0.4, niveaus[-1] + 0.2 - (2.0 if len(niveaus) > 1 else 0) + 0.35
steiger.append(doos('doek', (DB, 0.012, DH), (dx, YV - 0.04, dz), M['doek']))
steiger.append(doos('doekband', (DB, 0.014, 0.16), (dx, YV - 0.041, dz - DH / 2 + 0.08), M['doek_oranje']))
for tekst, grootte, dz2 in (('NEST', 0.5, 0.18), ('COMPANY', 0.2, -0.22)):
    cu = bpy.data.curves.new('tekst', 'FONT'); cu.body = tekst; cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.size = grootte; cu.space_character = 1.15 if grootte > 0.3 else 1.6
    to = bpy.data.objects.new('doektekst', cu); col.objects.link(to); to.location = (dx, YV - 0.05, dz + dz2); to.rotation_euler = (math.pi / 2, 0, 0); cu.materials.append(M['inkt']); steiger.append(to)

# ── laadpaal: wandlader, kabel en een wagen als wit blok ────
def afgerond(o, breedte=0.1, segm=4):
    b = o.modifiers.new('rond', 'BEVEL'); b.width = breedte; b.segments = segm
    for pl in o.data.polygons: pl.use_smooth = True
    return o
laadpaal = []
LX = {'rij': -0.8, 'appartement': 3.4}.get(TYPE, 1.2)
AX, AY = LX - {'rij': 1.5, 'appartement': 3.5}.get(TYPE, 2.7), -D / 2 - (2.3 if PLAT else 3.4)     # links van de warmtepomp, zodat ze elkaar vanuit de camera niet overlappen
laadpaal.append(afgerond(doos('lader', (0.24, 0.12, 0.36), (LX, -D / 2 - 0.06, 1.25), M['alu']), 0.03, 3))
laadpaal.append(doos('lader_licht', (0.12, 0.01, 0.03), (LX, -D / 2 - 0.125, 1.33), M['doek_oranje']))
# de wagen: een strakke elektrische berline, opgebouwd uit dwarsdoorsneden van achter naar voor
def berline(cx, cy):
    #          x     bodem  gordel  dak   breedte dakbreedte
    spanten = [(-2.35, .44, .78, .80, .78, .72), (-2.12, .30, .98, 1.04, .90, .80), (-1.5, .25, 1.0, 1.29, .925, .63),
               (-0.8, .25, .98, 1.42, .925, .60), (0.0, .25, .96, 1.44, .925, .60), (0.6, .25, .95, 1.36, .925, .61),
               (1.2, .25, .94, .985, .92, .78), (1.9, .28, .84, .87, .90, .78), (2.32, .42, .66, .68, .76, .68)]
    me = bpy.data.meshes.new('berline'); bm = bmesh.new(); ringen = []
    for x, zb, zg, zd, w, wd in spanten:
        helft = [(0, zb), (w * .86, zb), (w, zb + .16), (w, zg), (wd, zd), (0, zd + .035)]
        ring = [bm.verts.new((x, y, z)) for y, z in helft] + [bm.verts.new((x, -y, z)) for y, z in reversed(helft[1:-1])]
        ringen.append(ring)
    kajuit = [zd - zg > .1 for _, _, zg, zd, _, _ in spanten]
    for i in range(len(ringen) - 1):
        a, b_, n = ringen[i], ringen[i + 1], len(ringen[i])
        for k in range(n):
            f = bm.faces.new((a[k], a[(k + 1) % n], b_[(k + 1) % n], b_[k]))
            f.material_index = 1 if (k in (3, 4, 5, 6) and (kajuit[i] or kajuit[i + 1])) else 0
    bm.faces.new(ringen[0][::-1]); bm.faces.new(ringen[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    for pl in me.polygons: pl.use_smooth = True
    o = obj('berline', me); me.materials.append(M['lak']); me.materials.append(M['autoglas']); o.location = (cx, cy, 0); o.rotation_euler = (0, 0, math.pi)
    ss = o.modifiers.new('glad', 'SUBSURF'); ss.levels = 2; ss.render_levels = 3
    delen = [o]
    for wx in (-1.42, 1.4):
        for wy in (-0.83, 0.83):
            delen.append(cilinder('band', 0.345, 0.25, (cx + wx, cy + wy, 0.345), 'Y', M['band'], 32))
            delen.append(cilinder('velg', 0.235, 0.262, (cx + wx, cy + wy, 0.345), 'Y', M['velg'], 24))
    delen.append(doos('achterlicht', (0.03, 1.3, 0.05), (cx + 2.345, cy, 0.86), M['doek_oranje']))
    for wy in (-0.6, 0.6): delen.append(doos('koplamp', (0.05, 0.3, 0.05), (cx - 2.3, cy + wy, 0.7), M['kozijn_oud']))
    return delen
M['lak'] = m_effen('lak', '#e8eaed', 0.22, 0.15, 1.0); M['autoglas'] = m_effen('autoglas', '#07090b', 0.04, 0.2, 1.0)
M['band'] = m_effen('band', '#141516', 0.85); M['velg'] = m_effen('velg', '#5c6064', 0.3, 0.9)
laadpaal += berline(AX, AY)
kc = bpy.data.curves.new('kabel', 'CURVE'); kc.dimensions = '3D'; kc.bevel_depth = 0.016; kc.bevel_resolution = 4
PX, WAND = AX + 1.95, -D / 2                                   # laadpoort achteraan, aan de kant van het huis
punten = [(LX, WAND - 0.1, 1.08), (LX, WAND - 0.16, 0.45), (LX - 0.08, WAND - 0.5, 0.045), ((LX + PX) / 2 + 0.25, WAND - 1.4, 0.04),
          (PX + 0.2, AY + 1.55, 0.04), (PX + 0.06, AY + 1.08, 0.4), (PX, AY + 0.93, 0.8)]
def vloeiend(pts, per=14):
    """Catmull-Rom door de punten; elke z blijft boven het maaiveld."""
    uit = []; q = [pts[0]] + list(pts) + [pts[-1]]
    for i in range(1, len(q) - 2):
        p0, p1, p2, p3 = (Vector(x) for x in q[i - 1:i + 3])
        for k in range(per):
            t = k / per
            c = 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3)
            uit.append((c.x, c.y, max(c.z, 0.035)))
    return uit + [tuple(pts[-1])]
lijn = vloeiend(punten)
sp = kc.splines.new('POLY'); sp.points.add(len(lijn) - 1)
for pt, co in zip(sp.points, lijn): pt.co = (*co, 1)
ko = bpy.data.objects.new('kabel', kc); col.objects.link(ko); kc.materials.append(M['inkt']); laadpaal.append(ko)

# ── voortuin: het bord ("binnen het halfjaar") en de bank met koffie ("ik kijk nog rond") ──
TX, TY, DRAAI = -L / 2 + (1.9 if PLAT else 1.5), -D / 2 - (1.5 if PLAT else 2.9), math.radians(-32)   # bij het appartement dichter bij de gevel, anders valt het buiten beeld
def in_tuin(o, lokaal):
    """Plaatst een voorwerp in de voortuin, gedraaid naar de camera."""
    x, y, z = lokaal; c, sn = math.cos(DRAAI), math.sin(DRAAI)
    o.location = (TX + x * c - y * sn, TY + x * sn + y * c, z); o.rotation_euler = (o.rotation_euler[0], o.rotation_euler[1], o.rotation_euler[2] + DRAAI); return o
bord = []
for px in (-0.75, 0.75): bord.append(in_tuin(doos('bordpaal', (0.07, 0.07, 2.1), (0, 0, 0), M['plank']), (px, 0.03, 1.05)))
bord.append(in_tuin(doos('bordvlak', (1.9, 0.03, 1.2), (0, 0, 0), M['doek']), (0, -0.02, 1.55)))
bord.append(in_tuin(doos('bordband', (1.9, 0.034, 0.13), (0, 0, 0), M['doek_oranje']), (0, -0.022, 1.015)))
for tekst, grootte, tz, breed in (('HIER RENOVEERT', 0.135, 1.94, 1.5), ('NEST', 0.36, 1.62, 1.12), ('COMPANY', 0.13, 1.36, 1.7), ('BINNENKORT', 0.135, 1.16, 1.5)):
    cu = bpy.data.curves.new('tekst', 'FONT'); cu.body = tekst; cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.size = grootte; cu.space_character = breed
    to = bpy.data.objects.new('bordtekst', cu); col.objects.link(to); to.rotation_euler = (math.pi / 2, 0, 0); cu.materials.append(M['inkt']); bord.append(in_tuin(to, (0, -0.04, tz)))

bank = []
for i in range(3): bank.append(in_tuin(doos('bankzit', (1.7, 0.13, 0.035), (0, 0, 0), M['plank']), (0, 0.1 + i * 0.15, 0.45)))
for i in range(2): bank.append(in_tuin(doos('bankrug', (1.7, 0.03, 0.13), (0, 0, 0), M['plank']), (0, 0.5, 0.66 + i * 0.17)))
for px in (-0.75, 0.75):
    bank.append(in_tuin(doos('bankpoot', (0.06, 0.5, 0.44), (0, 0, 0), M['alu']), (px, 0.26, 0.22)))
    bank.append(in_tuin(doos('bankstijl', (0.05, 0.05, 0.5), (0, 0, 0), M['alu']), (px, 0.52, 0.66)))
bank.append(in_tuin(cilinder('tafelblad', 0.36, 0.035, (0, 0, 0), 'Z', M['plank'], 36), (0.1, -0.75, 0.5)))
bank.append(in_tuin(cilinder('tafelpoot', 0.035, 0.48, (0, 0, 0), 'Z', M['alu'], 16), (0.1, -0.75, 0.24)))
bank.append(in_tuin(cilinder('tafelvoet', 0.2, 0.025, (0, 0, 0), 'Z', M['alu'], 28), (0.1, -0.75, 0.0125)))
for kx in (-0.06, 0.26):
    bank.append(in_tuin(cilinder('schotel', 0.085, 0.012, (0, 0, 0), 'Z', M['doek'], 28), (kx, -0.75 + (0.08 if kx > 0 else -0.06), 0.524)))
    bank.append(in_tuin(cilinder('kop', 0.05, 0.075, (0, 0, 0), 'Z', M['doek'], 24), (kx, -0.75 + (0.08 if kx > 0 else -0.06), 0.565)))
    bank.append(in_tuin(cilinder('koffie', 0.042, 0.004, (0, 0, 0), 'Z', M['inkt'], 24), (kx, -0.75 + (0.08 if kx > 0 else -0.06), 0.602)))

# ── standen ─────────────────────────────────────────────────
def zet(o, m): o.data.materials[0] = M[m]
def toon(lijst, aan):
    for o in lijst: o.hide_render = not aan; o.hide_viewport = not aan

def staat(dak=False, zon=False, gevel=False, wp=False, steigers=False, lader=False, bordje=False, bankje=False):
    for o, uit, aan in dak_wissel: zet(o, aan if dak else uit)
    for o, uit, aan in gevel_wissel: zet(o, aan if gevel else uit)
    zet(romp, 'crepi' if gevel else 'baksteen'); zet(plint, 'plint_nieuw' if gevel else 'steen')
    for k in kozijnen: zet(k, 'kozijn_nieuw' if gevel else 'kozijn_oud')
    for d in deuren: zet(d, 'deur_nieuw' if gevel else 'deur_oud')
    toon(gordijnen, not gevel); toon(lateien, not gevel)
    toon(panelen, zon); toon(warmtepomp, wp); toon(steiger, steigers); toon(laadpaal, lader); toon(bord, bordje); toon(bank, bankje)

def alleen(lijst):
    """Voor een losse laag: alles behalve 'lijst' wordt uitgespaard (doorzichtig in de render) en werpt geen schaduw,
    zodat de grond alleen de schaduw van de laag zelf opvangt."""
    for o in bpy.data.objects:
        if o.type in ('MESH', 'FONT', 'CURVE') and o is not grond:
            uit = lijst is not None and o not in lijst
            o.is_holdout = uit; o.visible_shadow = not uit
    grond.is_holdout = False; grond.is_shadow_catcher = True; grond.hide_render = False

# ── merktekens voor de 3D-weergave: welke laag, en welk materiaal bij "nieuw" ──
def merk(lijst, laag):
    for i, o in enumerate(lijst): o['laag'] = laag; o['volg'] = i
merk(panelen, 'zon'); merk(warmtepomp, 'wp'); merk(steiger, 'steiger'); merk(laadpaal, 'laadpaal'); merk(bord, 'bord'); merk(bank, 'bank')
merk(gordijnen, 'oud'); merk(lateien, 'oud')
for o, uit, aan in dak_wissel: o['wissel'] = 'dak'; o['nieuw'] = aan
for o, uit, aan in gevel_wissel: o['wissel'] = 'gevel'; o['nieuw'] = aan
romp['wissel'] = 'gevel'; romp['nieuw'] = 'crepi'; plint['wissel'] = 'gevel'; plint['nieuw'] = 'plint_nieuw'
for k in kozijnen: k['wissel'] = 'gevel'; k['nieuw'] = 'kozijn_nieuw'
for d in deuren: d['wissel'] = 'gevel'; d['nieuw'] = 'deur_nieuw'

# ── licht, camera, render ───────────────────────────────────
sc = bpy.context.scene
w = bpy.data.worlds.new('lucht'); w.use_nodes = True; sc.world = w; wn = w.node_tree
env = wn.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(TEX + 'lucht_4k.hdr', check_existing=True)
wtc = wn.nodes.new('ShaderNodeTexCoord'); wmp = wn.nodes.new('ShaderNodeMapping'); wmp.inputs['Rotation'].default_value = (0, 0, math.radians(LUCHT_DRAAI))
wn.links.new(wtc.outputs['Generated'], wmp.inputs[0]); wn.links.new(wmp.outputs[0], env.inputs['Vector'])
bg = wn.nodes['Background']; wn.links.new(env.outputs[0], bg.inputs['Color']); bg.inputs['Strength'].default_value = 1.0; sc.view_settings.exposure = BELICHTING

cam_d = bpy.data.cameras.new('camera'); cam_d.lens = 60; cam = bpy.data.objects.new('camera', cam_d); col.objects.link(cam); sc.camera = cam
doel = bpy.data.objects.new('doel', None); col.objects.link(doel)
if PLAT: doel.location = (0.2, 0, 5.3); cam.location = (-24.0, -30.0, 19.0)
elif TYPE == 'rij': doel.location = (0.3, 0, 3.7); cam.location = (-18.3, -33.0, 8.4)
else: doel.location = (1.6 if TYPE == 'halfopen' else 0.2, 0, 4.0); cam.location = (-19.5, -24.5, 7.2)
tr = cam.constraints.new('TRACK_TO'); tr.target = doel; tr.track_axis = 'TRACK_NEGATIVE_Z'; tr.up_axis = 'UP_Y'

sc.render.engine = 'CYCLES'; sc.cycles.device = 'GPU'; sc.cycles.samples = 96; sc.cycles.use_denoising = True
sc.render.film_transparent = True; sc.render.resolution_x, sc.render.resolution_y = 1600, 1100; sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
staat()
result = {'type': TYPE, 'objecten': len(bpy.data.objects)}
