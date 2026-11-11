#!/usr/bin/env python3
"""NEST COMPANY — huisfilm v3: dak en zon opnieuw, waarheidsgetrouw en zonder verspringen.

Waarom v3:
  * k1_oud had een andere kadrering dan k2..k5 → de dakclip zoomde uit (verspringing).
  * Eén clip oud→nieuw dak liet het oude dak opklappen terwijl het nieuwe er al onder lag.
  * De zonneclip legde panelen op panelen.

Aanpak:
  * Nieuwe stills worden gemaakt als BEWERKING van k2_dak (zelfde camera), en daarna lokaal
    pixel-exact op k2_dak uitgelijnd. Elk begin- en eindbeeld heeft dus exact dezelfde kadrering.
  * Het dak wordt in twee echte werfstappen getoond: afbreken tot op het onderdak, dan nieuwe
    pannen rij per rij van de goot naar de nok.
  * Gevel- en nestclip blijven zoals ze zijn.

Veiligheidsregel (Tobias): elke taak wordt HOOGSTENS ÉÉN KEER ingediend.
  * Vóór de POST wordt "indienen" in het manifest geschreven.
  * Staat een taak op "indienen" zonder taskId (bv. time-out bij het indienen), dan stopt het
    script en meldt het dat de gebruiker in kie.ai moet nakijken. Het dient NOOIT opnieuw in.
  * Pollen en downloaden mag wel herhaald worden; dat kost niets.

Gebruik:
  python3 pipeline/generate_v3.py stills     # 2 stills (afbraak-start en onderdak)
  python3 pipeline/generate_v3.py video      # pas na goedkeuring van de stills: 3 clips
  python3 pipeline/generate_v3.py status     # alleen pollen / downloaden
"""
import json, os, subprocess, sys, time

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(ROOT)
MANIFEST = os.path.join(ROOT, "manifest3.json")
KEYS_OUD = os.path.join(SITE, "bron", "oude-scrollfilm", "keyframes2")
UIT = os.path.join(SITE, "bron", "film-v3")
os.makedirs(UIT, exist_ok=True)
API = "https://api.kie.ai/api/v1"
UPLOAD = "https://kieai.redpandaai.co/api/file-stream-upload"


def read_key():
    with open(os.path.join(SITE, ".env")) as f:
        for line in f:
            line = line.strip()
            if line.startswith("KIE_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("geen KIE_API_KEY in .env")


KEY = read_key()
state = {"uploads": {}, "taken": {}, "log": []}
if os.path.exists(MANIFEST):
    with open(MANIFEST) as f:
        state = json.load(f)


def save():
    with open(MANIFEST, "w") as f:
        json.dump(state, f, indent=2)


def log(msg):
    state["log"].append(f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}")
    print(msg, flush=True)
    save()


def curl_json(args, timeout=120):
    out = subprocess.run(["curl", "-sS", "--max-time", str(timeout - 10)] + args,
                         capture_output=True, text=True, timeout=timeout)
    if out.returncode != 0:
        raise RuntimeError(f"curl: {out.stderr.strip()}")
    return json.loads(out.stdout)


def upload(naam, pad):
    """Bestand naar kie.ai-opslag (geen generatie; herhalen mag)."""
    if state["uploads"].get(naam):
        return state["uploads"][naam]
    r = curl_json(["-H", f"Authorization: Bearer {KEY}",
                   "-F", f"file=@{pad}", "-F", "uploadPath=nest-film-v3",
                   "-F", f"fileName={naam}{os.path.splitext(pad)[1]}", UPLOAD], timeout=300)
    d = r.get("data") or {}
    url = d.get("downloadUrl") or d.get("fileUrl") or d.get("url")
    if not url:
        raise RuntimeError(f"upload {naam} gaf geen url: {r}")
    state["uploads"][naam] = url
    log(f"upload {naam}: ok")
    return url


def dien_eenmaal_in(naam, model, inp):
    """Dient een taak hoogstens één keer in. Geeft taskId terug of stopt."""
    t = state["taken"].get(naam)
    if t and t.get("taskId"):
        return t["taskId"]
    if t and t.get("status") == "indienen":
        log(f"STOP: {naam} staat op 'indienen' zonder taskId (ingediend op {t.get('tijd')}). "
            f"Mogelijk is de taak toch aangekomen. Kijk in kie.ai (Logs) na vóór iets opnieuw "
            f"te starten. Dit script dient niet opnieuw in.")
        sys.exit(2)
    state["taken"][naam] = {"status": "indienen", "tijd": time.strftime("%Y-%m-%d %H:%M:%S"),
                            "model": model, "input": inp}
    save()
    try:
        r = curl_json(["-H", f"Authorization: Bearer {KEY}", "-H", "Content-Type: application/json",
                       "-X", "POST", "-d", json.dumps({"model": model, "input": inp}),
                       API + "/jobs/createTask"], timeout=90)
    except Exception as e:
        log(f"STOP: antwoord op het indienen van {naam} niet ontvangen ({e}). "
            f"Niet opnieuw ingediend. Kijk in kie.ai na of de taak er staat.")
        sys.exit(2)
    if r.get("code") != 200 or not (r.get("data") or {}).get("taskId"):
        state["taken"][naam]["status"] = "geweigerd"
        state["taken"][naam]["antwoord"] = r
        log(f"STOP: kie.ai weigerde {naam}: {r}. Niet opnieuw ingediend.")
        sys.exit(2)
    tid = r["data"]["taskId"]
    state["taken"][naam].update({"status": "ingediend", "taskId": tid})
    log(f"{naam}: ingediend als {tid}")
    return tid


def poll_alles(namen, max_s=2400):
    open_ = [n for n in namen if not state["taken"][n].get("url")]
    t0 = time.time()
    while open_ and time.time() - t0 < max_s:
        for n in list(open_):
            t = state["taken"][n]
            try:
                r = curl_json(["-H", f"Authorization: Bearer {KEY}",
                               API + f"/jobs/recordInfo?taskId={t['taskId']}"], timeout=70)
            except Exception as e:
                log(f"  poll-fout {n}: {e}")
                continue
            d = r.get("data") or {}
            if d.get("state") == "success":
                urls = json.loads(d.get("resultJson") or "{}").get("resultUrls") or []
                t.update({"status": "klaar", "url": urls[0] if urls else None,
                          "credits": d.get("creditsConsumed")})
                log(f"{n}: klaar ({d.get('creditsConsumed')} credits)")
                open_.remove(n)
            elif d.get("state") == "fail":
                t.update({"status": "mislukt", "fout": f"{d.get('failCode')} {d.get('failMsg')}"})
                log(f"{n}: MISLUKT bij kie.ai: {t['fout']}. Niet opnieuw ingediend.")
                open_.remove(n)
        if open_:
            time.sleep(15)
    for n in namen:
        t = state["taken"][n]
        if t.get("url") and not t.get("file"):
            ext = ".mp4" if n.startswith("v") else ".png"
            dest = os.path.join(UIT, n + ext)
            out = subprocess.run(["curl", "-sS", "-L", "--max-time", "300", "-o", dest, t["url"]],
                                 capture_output=True, text=True)
            if out.returncode == 0 and os.path.getsize(dest) > 10000:
                t["file"] = dest
                log(f"{n}: opgeslagen in {dest}")
    save()


# ---------- stills: bewerkingen van k2_dak, zelfde camera ----------
HOU = ("Keep EVERYTHING else exactly identical to the input image: same camera position, same "
       "framing, same lens, same crop, same house size and placement, same tree, hedge, lawn, "
       "path, sky and light. Only change the roof as described. Photorealistic, no people, no text.")
STILLS = [
    ("s1_oud", "Edit this photo: replace the new anthracite roof tiles with an old, weathered roof "
               "of faded orange-red clay tiles with patches of green moss and some dark staining, "
               "old zinc gutters. The facade and windows stay exactly as they are. Make the sky a "
               "flat overcast grey. " + HOU),
    ("s2_onderdak", "Edit this photo: the old roof tiles have been removed. The roof now shows a new "
                    "light blue breathable roofing membrane (underlayment) stretched over the whole "
                    "roof, with straight horizontal light wooden tiling battens nailed across it at "
                    "even spacing from the gutter up to the ridge, and vertical counter battens. No "
                    "tiles on the roof at all. Chimney stays. The facade and windows stay exactly as "
                    "they are. " + HOU),
]

LOCK = ("Single continuous take. The camera is locked off on a tripod: no zoom, no pan, no dolly, "
        "no reframing, the house keeps exactly the same size and position in every frame. "
        "Nothing else in the scene changes. No people. Photorealistic.")
VIDEOS = [
    ("v1a_afbraak", "s1_oud", "s2_onderdak", 4,
     "The old orange roof tiles are removed row by row, starting at the ridge and working down "
     "toward the gutter. Each tile simply disappears from the roof in place; tiles do not fly, "
     "float or lift as a sheet. As each row is removed it reveals the light blue membrane and "
     "wooden battens underneath. By the end the whole roof shows only the membrane and battens. "
     + LOCK),
    ("v1b_pannen", "s2_onderdak", "k2_dak", 4,
     "New matte anthracite roof tiles are laid row by row on the wooden battens, starting at the "
     "gutter and working up to the ridge, each new row overlapping the row below it like real "
     "roof tiles. Tiles appear in place one row at a time; nothing flies or floats. The rest of "
     "the roof still shows the light blue membrane until it is covered. The overcast clouds "
     "slowly begin to break. " + LOCK),
    ("v2_zon", "k2_dak", "k3_zon", 6,
     "Black solar panels are installed on the front slope of the anthracite roof, one panel at a "
     "time, each panel placed directly into its own empty spot on the bare roof, filling the "
     "grid from left to right, bottom row first. Panels never overlap, never stack on top of "
     "another panel, and never move after they are placed. No panel flies in from outside the "
     "frame. Warm late-afternoon sunlight gradually breaks through the clouds. " + LOCK),
]


def stills():
    k2 = upload("k2_dak", os.path.join(KEYS_OUD, "k2_dak.jpg"))
    namen = []
    for naam, prompt in STILLS:
        dien_eenmaal_in(naam, "nano-banana-pro", {"prompt": prompt, "image_input": [k2],
                                                  "aspect_ratio": "16:9", "resolution": "2K",
                                                  "output_format": "png"})
        namen.append(naam)
    poll_alles(namen, 900)


def video():
    for n, _ in STILLS:
        if not state["taken"].get(n, {}).get("goedgekeurd"):
            sys.exit(f"{n} is nog niet goedgekeurd (zet 'goedgekeurd': true in manifest3.json "
                     f"nadat het uitgelijnde beeld akkoord is).")
    beelden = {"k2_dak": upload("k2_dak", os.path.join(KEYS_OUD, "k2_dak.jpg")),
               "k3_zon": upload("k3_zon", os.path.join(KEYS_OUD, "k3_zon.jpg")),
               "s1_oud": upload("s1_oud_uitgelijnd", os.path.join(UIT, "s1_oud_uitgelijnd.jpg")),
               "s2_onderdak": upload("s2_onderdak_uitgelijnd", os.path.join(UIT, "s2_onderdak_uitgelijnd.jpg"))}
    namen = []
    for naam, a, b, duur, prompt in VIDEOS:
        dien_eenmaal_in(naam, "bytedance/seedance-2", {
            "prompt": prompt, "first_frame_url": beelden[a], "last_frame_url": beelden[b],
            "resolution": "1080p", "aspect_ratio": "16:9", "duration": duur, "generate_audio": False})
        namen.append(naam)
    poll_alles(namen, 2400)


if __name__ == "__main__":
    stap = sys.argv[1] if len(sys.argv) > 1 else "status"
    if stap == "stills":
        stills()
    elif stap == "video":
        video()
    else:
        poll_alles([n for n, t in state["taken"].items() if t.get("taskId")], 120)
    print(json.dumps({n: {k: t.get(k) for k in ("status", "taskId", "credits", "file")}
                      for n, t in state["taken"].items()}, indent=1))
