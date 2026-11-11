# Draaibeweging voor het binnenkomen van de sectie: de camera draait rond de open bebouwing (oude staat)
# en eindigt exact op het standaardbeeld. Wacht tot render_alles klaar is. Klaar = renders/draai/klaar.txt
import bpy, os, math
PAD = "/Users/tobiasderyck/Claude code projects/nestcompany-site/bron/3d/"
UIT = PAD + "renders/draai/"; os.makedirs(UIT, exist_ok=True)
N, START = 24, math.radians(34)
st = {'i': -1, 'ns': None, 'basis': None}
def stap():
    if not os.path.exists(PAD + "renders/set/klaar.txt"): return 3.0
    sc = bpy.context.scene
    try:
        if st['i'] < 0:
            ns = {'TYPE': 'open'}; exec(compile(open(PAD + "bouw_huis.py").read(), PAD + "bouw_huis.py", 'exec'), ns); st['ns'] = ns
            cam, doel = bpy.data.objects['camera'], bpy.data.objects['doel']
            st['basis'] = (cam.location.x - doel.location.x, cam.location.y - doel.location.y, cam.location.z, doel.location.x, doel.location.y)
            sc.cycles.samples = 56; st['i'] = 0; return 0.3
        i = st['i']
        if i >= N - 1:
            open(UIT + "klaar.txt", "w").write("klaar"); return None
        t = i / (N - 1); e = 1 - (1 - t) ** 3                      # snel beginnen, zacht landen
        h = START * (1 - e); vx, vy, z, dx, dy = st['basis']
        cam = bpy.data.objects['camera']
        cam.location = (dx + vx * math.cos(h) - vy * math.sin(h), dy + vx * math.sin(h) + vy * math.cos(h), z)
        sc.render.filepath = f"{UIT}draai-{i:02d}.png"; bpy.ops.render.render(write_still=True); st['i'] += 1
    except Exception:
        import traceback; open(UIT + "fout.txt", "a").write(traceback.format_exc()); return None
    return 0.2
bpy.app.timers.register(stap, first_interval=1.0)
