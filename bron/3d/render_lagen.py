# Rendert per woningtype de losse lagen (warmtepomp, steiger, laadpaal, bord, bank), elk met eigen schaduw.
# Wacht tot de draaibeweging klaar is. Klaar = renders/set/lagen-klaar.txt
import bpy, os
PAD = "/Users/tobiasderyck/Claude code projects/nestcompany-site/bron/3d/"
UIT = PAD + "renders/set/"
LAGEN = [('wp', 'warmtepomp', 'wp'), ('steiger', 'steiger', 'steigers'), ('laadpaal', 'laadpaal', 'lader'), ('bord', 'bord', 'bordje')]
taken = []
for T in ['open', 'halfopen', 'rij', 'appartement']:
    taken.append(('bouw', T)); taken += [('laag', T) + l for l in LAGEN]
st = {'ns': None}
def stap():
    if not (os.path.exists(PAD + "renders/draai/klaar.txt") or os.path.exists(PAD + "renders/draai/fout.txt")): return 3.0
    if not taken:
        open(UIT + "lagen-klaar.txt", "w").write("klaar"); return None
    t = taken.pop(0); sc = bpy.context.scene
    try:
        if t[0] == 'bouw':
            ns = {'TYPE': t[1]}; exec(compile(open(PAD + "bouw_huis.py").read(), PAD + "bouw_huis.py", 'exec'), ns); st['ns'] = ns; sc.cycles.samples = 72
        else:
            ns = st['ns']; ns['staat'](**{t[4]: True}); ns['alleen'](ns[t[3]])
            sc.render.filepath = f"{UIT}{t[1]}-{t[2]}.png"; bpy.ops.render.render(write_still=True); ns['alleen'](None)
    except Exception:
        import traceback; open(UIT + "fout.txt", "a").write(str(t) + "\n" + traceback.format_exc() + "\n")
    return 0.3
bpy.app.timers.register(stap, first_interval=1.0)
