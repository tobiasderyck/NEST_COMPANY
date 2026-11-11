# Bijwerken: de rijwoning volledig opnieuw (ruimer kader) en de laadpaal-laag van elk type (nieuwe wagen).
import bpy, os, itertools
PAD = "/Users/tobiasderyck/Claude code projects/nestcompany-site/bron/3d/"; UIT = PAD + "renders/set/"
if os.path.exists(UIT + "bij-klaar.txt"): os.remove(UIT + "bij-klaar.txt")
LAGEN = {'wp': ('warmtepomp', 'wp'), 'steiger': ('steiger', 'steigers'), 'laadpaal': ('laadpaal', 'lader'), 'bord': ('bord', 'bordje')}
taken = []
for T in ('open', 'halfopen', 'rij', 'appartement'): taken += [('bouw', T), ('laag', T, 'laadpaal')]
st = {}
def stap():
    if not taken:
        open(UIT + "bij-klaar.txt", "w").write("klaar"); return None
    t = taken.pop(0); sc = bpy.context.scene
    try:
        if t[0] == 'bouw':
            ns = {'TYPE': t[1]}; exec(compile(open(PAD + "bouw_huis.py").read(), "bouw_huis.py", 'exec'), ns); st['ns'] = ns
        elif t[0] == 'combo':
            ns = st['ns']; sc.cycles.samples = 96; ns['alleen'](None); ns['staat'](dak=bool(t[2]), zon=bool(t[3]), gevel=bool(t[4]))
            sc.render.filepath = f"{UIT}{t[1]}-{t[2]}{t[3]}{t[4]}.png"; bpy.ops.render.render(write_still=True)
        else:
            ns = st['ns']; sc.cycles.samples = 72; lijst, sleutel = LAGEN[t[2]]; ns['staat'](**{sleutel: True}); ns['alleen'](ns[lijst])
            sc.render.filepath = f"{UIT}{t[1]}-{t[2]}.png"; bpy.ops.render.render(write_still=True); ns['alleen'](None)
    except Exception:
        import traceback; open(UIT + "fout.txt", "a").write(str(t) + "\n" + traceback.format_exc() + "\n")
    return 0.3
bpy.app.timers.register(stap, first_interval=0.5)
