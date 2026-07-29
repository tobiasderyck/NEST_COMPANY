#!/usr/bin/env python3
"""NEST COMPANY — beeldpipeline "Van huis naar nest".
Keten: 5 keyframes (nano-banana-pro, geketend voor consistentie)
-> 4 clips (seedance-1.5-pro, 1080p, zonder audio) met first+last frame
via input_urls voor naadloze match-cuts.
Budget: 5x18 + 4x45 = 270 credits.
Schrijft voortgang naar manifest.json; downloadt resultaten.
"""
import json, os, subprocess, sys, time

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(ROOT)
MANIFEST = os.path.join(ROOT, "manifest.json")
CLIPS = os.path.join(SITE, "assets", "clips")
KEYS = os.path.join(SITE, "assets", "keyframes")
os.makedirs(CLIPS, exist_ok=True)
os.makedirs(KEYS, exist_ok=True)

API = "https://api.kie.ai/api/v1"

def read_key():
    key = None
    with open(os.path.join(SITE, ".env")) as f:
        for line in f:
            line = line.strip()
            if line.startswith("KIE_API_KEY="):
                key = line.split("=", 1)[1].strip().strip('"').strip("'")
    if not key:
        sys.exit("geen KIE_API_KEY in .env")
    return key

KEY = read_key()

state = {"phase": "start", "keyframes": {}, "videos": {}, "log": []}
if os.path.exists(MANIFEST):
    with open(MANIFEST) as f:
        prev = json.load(f)
    state["keyframes"] = prev.get("keyframes", {})
    state["videos"] = prev.get("videos", {})
    state["log"] = prev.get("log", [])

def save():
    with open(MANIFEST, "w") as f:
        json.dump(state, f, indent=2)

def log(msg):
    state["log"].append(f"{time.strftime('%H:%M:%S')} {msg}")
    print(msg, flush=True)
    save()

def api(path, body=None):
    cmd = ["curl", "-sS", "--max-time", "60",
           "-H", f"Authorization: Bearer {KEY}",
           "-H", "Content-Type: application/json"]
    if body is not None:
        cmd += ["-X", "POST", "-d", json.dumps(body)]
    cmd.append(API + path)
    out = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
    if out.returncode != 0:
        raise RuntimeError(f"curl: {out.stderr.strip()}")
    return json.loads(out.stdout)

def create_task(model, inp):
    r = api("/jobs/createTask", {"model": model, "input": inp})
    if r.get("code") != 200:
        raise RuntimeError(f"createTask {model}: {r}")
    return r["data"]["taskId"]

def poll(task_id, timeout_s, interval):
    t0 = time.time()
    while time.time() - t0 < timeout_s:
        try:
            r = api(f"/jobs/recordInfo?taskId={task_id}")
        except Exception as e:
            log(f"  poll-fout {task_id}: {e}; opnieuw")
            time.sleep(interval)
            continue
        d = r.get("data") or {}
        st = d.get("state")
        if st == "success":
            rj = json.loads(d.get("resultJson") or "{}")
            urls = rj.get("resultUrls") or []
            return urls[0] if urls else None
        if st == "fail":
            raise RuntimeError(f"taak {task_id} faalde: {d.get('failCode')} {d.get('failMsg')}")
        time.sleep(interval)
    raise RuntimeError(f"taak {task_id} timeout na {timeout_s}s")

def download(url, dest):
    out = subprocess.run(["curl", "-sS", "-L", "--max-time", "300", "-o", dest, url],
                         capture_output=True, text=True)
    if out.returncode == 0 and os.path.getsize(dest) > 10000:
        return True
    log(f"  download mislukt ({out.stderr.strip()[:120]}); URL bewaard")
    if os.path.exists(dest):
        os.remove(dest)
    return False

GRADE = ("cinematic architectural photography, dusk blue hour, thin ground mist, "
         "moody dramatic sky, warm terracotta and charcoal palette, single warm key light, "
         "ultra sharp, photorealistic, 8k, high-end advertising quality")
FRAME = ("the house perfectly centered in frame, seen from a low three-quarter angle, "
         "same camera position and same distance as the reference image")
LOCK = ("Continuous single take, no cuts, slow motion feel, silky smooth, the house perfectly "
        "centered and locked in frame at constant size, camera almost static with a very subtle "
        "slow push-in, no camera shake, no people.")

KEYFRAMES = [
    ("k1_oud", None,
     f"A weathered old Belgian brick house standing alone on a small patch of ground in a dark "
     f"misty void, the house perfectly centered in frame, seen from a low three-quarter angle. "
     f"Faded moss-covered orange roof tiles, dull stained brickwork, dark lifeless windows, "
     f"a bare tree silhouette far behind, {GRADE}"),
    ("k2_dak", "k1_oud",
     f"The exact same weathered Belgian brick house, {FRAME}, but the roof is now brand new: "
     f"crisp matte anthracite roof tiles in perfect rows, sharp clean roofline with new zinc "
     f"gutters. The facade and windows still old and weathered. Same mist, same lighting, {GRADE}"),
    ("k3_zon", "k2_dak",
     f"The exact same house, {FRAME}, now with sleek black solar panels mounted flush in a neat "
     f"grid on the anthracite roof, subtle sky reflections in the glass. Facade still old and "
     f"weathered. Same mist, same lighting, {GRADE}"),
    ("k4_gevel", "k3_zon",
     f"The exact same house, {FRAME}, now fully renovated: the facade wrapped in clean warm "
     f"off-white render with crisp black window frames and large glass windows, a slim modern "
     f"heat pump unit standing beside the house. Solar panels and anthracite roof unchanged. "
     f"Same mist, same lighting, {GRADE}"),
    ("k5_nest", "k4_gevel",
     f"The exact same fully renovated house, {FRAME}, but dusk has deepened into night: every "
     f"window glows with warm amber light from inside, warm light spills onto the mist and "
     f"ground, thin smoke curls from the chimney, the house radiating warmth like a nest in "
     f"the dark. {GRADE}"),
]

VIDEOS = [
    ("v1_dak", "k1_oud", "k2_dak",
     f"The old faded roof tiles gently lift away and drift off in slow motion while brand new "
     f"matte anthracite tiles slide in and settle into perfect rows across the roof, fine dust "
     f"drifting in the cool light. {LOCK}"),
    ("v2_zon", "k2_dak", "k3_zon",
     f"Sleek black solar panels float down one by one and mount themselves flush onto the "
     f"anthracite roof in a neat grid, each panel catching a subtle reflection of the sky as it "
     f"clicks into place. {LOCK}"),
    ("v3_gevel", "k3_zon", "k4_gevel",
     f"A wave of renovation sweeps across the weathered facade: clean warm off-white render "
     f"flows over the old brickwork, window frames turn crisp black with new glass, and a slim "
     f"modern heat pump unit assembles itself beside the house. {LOCK}"),
    ("v4_nest", "k4_gevel", "k5_nest",
     f"Dusk deepens into night around the renovated house; the windows begin to glow one by one "
     f"with warm amber light, the glow spilling onto the mist and ground, thin smoke starting "
     f"to curl from the chimney until the house radiates warmth like a nest. {LOCK}"),
]

def main():
    # ── fase 1: keyframes, sequentieel geketend ──
    state["phase"] = "keyframes"
    for name, ref, prompt in KEYFRAMES:
        if state["keyframes"].get(name, {}).get("url"):
            continue
        inp = {
            "prompt": prompt,
            "image_input": [state["keyframes"][ref]["url"]] if ref else [],
            "aspect_ratio": "16:9",
            "resolution": "2K",
            "output_format": "jpg",
        }
        log(f"keyframe {name}: taak aanmaken")
        tid = create_task("nano-banana-pro", inp)
        state["keyframes"][name] = {"taskId": tid}
        save()
        url = poll(tid, 480, 10)
        state["keyframes"][name]["url"] = url
        log(f"keyframe {name}: klaar")
        dest = os.path.join(KEYS, f"{name}.jpg")
        if download(url, dest):
            state["keyframes"][name]["file"] = dest
        save()

    # ── fase 2: video's, parallel ──
    state["phase"] = "videos"
    for name, kf_a, kf_b, prompt in VIDEOS:
        if state["videos"].get(name, {}).get("taskId"):
            continue
        inp = {
            "prompt": prompt,
            "input_urls": [state["keyframes"][kf_a]["url"], state["keyframes"][kf_b]["url"]],
            "aspect_ratio": "16:9",
            "resolution": "1080p",
            "duration": 6,
            "fixed_lens": True,
            "generate_audio": False,
        }
        log(f"video {name}: taak aanmaken")
        tid = create_task("bytedance/seedance-1.5-pro", inp)
        state["videos"][name] = {"taskId": tid}
        save()

    done = set(n for n, *_ in VIDEOS if state["videos"].get(n, {}).get("file"))
    t0 = time.time()
    while len(done) < len(VIDEOS) and time.time() - t0 < 2400:
        for name, *_ in VIDEOS:
            if name in done:
                continue
            v = state["videos"][name]
            try:
                r = api(f"/jobs/recordInfo?taskId={v['taskId']}")
            except Exception as e:
                log(f"  poll-fout {name}: {e}")
                continue
            d = r.get("data") or {}
            st = d.get("state")
            if st == "success":
                rj = json.loads(d.get("resultJson") or "{}")
                urls = rj.get("resultUrls") or []
                v["url"] = urls[0] if urls else None
                log(f"video {name}: klaar ({d.get('creditsConsumed')} credits)")
                dest = os.path.join(CLIPS, f"{name}.mp4")
                if v["url"] and download(v["url"], dest):
                    v["file"] = dest
                done.add(name)
                save()
            elif st == "fail":
                v["error"] = f"{d.get('failCode')} {d.get('failMsg')}"
                log(f"video {name}: MISLUKT — {v['error']}")
                done.add(name)
                save()
        if len(done) < len(VIDEOS):
            time.sleep(20)

    state["phase"] = "klaar"
    save()
    log("pipeline afgerond")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        state["phase"] = "fout"
        log(f"FOUT: {e}")
        save()
        sys.exit(1)
