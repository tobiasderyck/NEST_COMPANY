#!/usr/bin/env python3
"""NEST COMPANY — keyframes v2: "Van grauw naar goud".
Warm, uitnodigend, hoopvol — geen horror-void. Alleen keyframes;
video's volgen pas na goedkeuring.
"""
import json, os, subprocess, sys, time

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(ROOT)
MANIFEST = os.path.join(ROOT, "manifest2.json")
KEYS = os.path.join(SITE, "assets", "keyframes2")
os.makedirs(KEYS, exist_ok=True)

API = "https://api.kie.ai/api/v1"

def read_key():
    with open(os.path.join(SITE, ".env")) as f:
        for line in f:
            line = line.strip()
            if line.startswith("KIE_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("geen KIE_API_KEY in .env")

KEY = read_key()

state = {"keyframes": {}, "log": []}
if os.path.exists(MANIFEST):
    with open(MANIFEST) as f:
        state = json.load(f)

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
    return out.returncode == 0 and os.path.getsize(dest) > 10000

BASE = ("cinematic architectural photography, photorealistic, ultra sharp, 8k, "
        "high-end real estate advertising quality, inviting warm mood, clean composition, "
        "no people, no text")
SETTING = ("standing on a neat green lawn with a light gravel path leading to the front "
           "door, a low trimmed boxwood hedge, a young birch tree with leaves at the side, "
           "soft open countryside in the background")
FRAME = ("the house perfectly centered in frame, seen from a slightly low three-quarter "
         "angle, same camera position and same distance as the reference image")

KEYFRAMES = [
    ("k1_oud", None,
     f"A tired old Belgian brick family house, faded orange roof tiles with patches of "
     f"moss, weathered dull brick facade, worn white window frames, {SETTING}, "
     f"the house perfectly centered in frame, seen from a slightly low three-quarter angle. "
     f"Overcast soft grey day, flat diffuse daylight, slightly desaturated colors but a "
     f"friendly everyday atmosphere, {BASE}"),
    ("k2_dak", "k1_oud",
     f"The exact same Belgian brick house, {FRAME}, but the roof is now brand new: crisp "
     f"matte anthracite roof tiles in perfect rows with new zinc gutters. The facade and "
     f"windows still old and weathered. The grey clouds are just beginning to break open "
     f"with a first hint of soft sunlight. {BASE}"),
    ("k3_zon", "k2_dak",
     f"The exact same house, {FRAME}, now with sleek black solar panels mounted flush in a "
     f"neat grid on the front slope of the anthracite roof. Facade still old. Warm "
     f"late-afternoon sunlight breaking through the clouds, soft long shadows across the "
     f"lawn, the light turning golden. {BASE}"),
    ("k4_gevel", "k3_zon",
     f"The exact same house, {FRAME}, now fully renovated: the facade wrapped in clean warm "
     f"off-white render with crisp black window frames and larger glass windows, a slim "
     f"modern heat pump unit discreetly beside the house. Solar panels and anthracite roof "
     f"unchanged. Full golden hour, warm glowing sky, long soft shadows. {BASE}"),
    ("k5_nest", "k4_gevel",
     f"The exact same fully renovated house, {FRAME}, at soft blue-hour dusk: every window "
     f"glowing with warm amber light from inside, small warm garden lights along the gravel "
     f"path switched on, a soft purple-blue evening sky with the last warm glow on the "
     f"horizon, cozy and welcoming — a dream home. {BASE}"),
]

def main():
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
        dest = os.path.join(KEYS, f"{name}.jpg")
        if download(url, dest):
            state["keyframes"][name]["file"] = dest
        log(f"keyframe {name}: klaar")
        save()
    log("keyframes v2 afgerond")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"FOUT: {e}")
        save()
        sys.exit(1)
