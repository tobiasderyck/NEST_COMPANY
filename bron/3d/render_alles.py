# Rendert per woningtype alle combinaties en de losse lagen. Draait in Blender via een timer,
# zodat de koppeling niet blokkeert. Klaar = bron/3d/renders/set/klaar.txt
import bpy, os, itertools
PAD = "/Users/tobiasderyck/Claude code projects/nestcompany-site/bron/3d/"
UIT = PAD + "renders/set/"; os.makedirs(UIT, exist_ok=True)
if os.path.exists(UIT + "klaar.txt"): os.remove(UIT + "klaar.txt")
TYPES = ['open', 'halfopen', 'rij', 'appartement']
taken = []
for T in TYPES:
    taken.append(('bouw', T))
    for d, z, g in itertools.product((0, 1), repeat=3): taken.append(('combo', T, d, z, g))
    taken += [('laag', T, 'wp'), ('laag', T, 'steiger')]
st = {'ns': None}
def stap():
    if not taken:
        open(UIT + "klaar.txt", "w").write("klaar"); return None
    t = taken.pop(0); sc = bpy.context.scene
    try:
        if t[0] == 'bouw':
            ns = {'TYPE': t[1]}; exec(compile(open(PAD + "bouw_huis.py").read(), PAD + "bouw_huis.py", 'exec'), ns); st['ns'] = ns
        elif t[0] == 'combo':
            ns = st['ns']; ns['alleen'](None); ns['staat'](dak=bool(t[2]), zon=bool(t[3]), gevel=bool(t[4]))
            sc.render.filepath = f"{UIT}{t[1]}-{t[2]}{t[3]}{t[4]}.png"; bpy.ops.render.render(write_still=True)
        else:
            ns = st['ns']; ns['staat'](wp=t[2] == 'wp', steigers=t[2] == 'steiger')
            ns['alleen'](ns['warmtepomp'] if t[2] == 'wp' else ns['steiger'])
            sc.render.filepath = f"{UIT}{t[1]}-{t[2]}.png"; bpy.ops.render.render(write_still=True)
            ns['alleen'](None)
    except Exception as e:
        import traceback; open(UIT + "fout.txt", "a").write(str(t) + "\n" + traceback.format_exc() + "\n")
    return 0.3
bpy.app.timers.register(stap, first_interval=0.3)
