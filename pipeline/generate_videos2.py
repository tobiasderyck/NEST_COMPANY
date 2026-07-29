#!/usr/bin/env python3
"""NEST COMPANY — clips v2 op de goedgekeurde "grauw naar goud"-keyframes.
Model: bytedance/seedance-2 (1080p, 6s, zonder audio), first+last frame
voor naadloze match-cuts. 4 clips parallel."""
import json, os, subprocess, sys, time

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(ROOT)
MANIFEST = os.path.join(ROOT, "manifest2.json")
CLIPS = os.path.join(SITE, "assets", "clips")
os.makedirs(CLIPS, exist_ok=True)

API = "https://api.kie.ai/api/v1"

def read_key():
    with open(os.path.join(SITE, ".env")) as f:
        for line in f:
            line = line.strip()
            if line.startswith("KIE_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("geen KIE_API_KEY in .env")

KEY = read_key()

with open(MANIFEST) as f:
    state = json.load(f)
state.setdefault("videos", {})

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

def download(url, dest):
    out = subprocess.run(["curl", "-sS", "-L", "--max-time", "300", "-o", dest, url],
                         capture_output=True, text=True)
    if out.returncode == 0 and os.path.getsize(dest) > 10000:
        return True
    log(f"  download mislukt ({out.stderr.strip()[:120]}); URL bewaard")
    if os.path.exists(dest):
        os.remove(dest)
    return False

LOCK = ("Continuous single take, no cuts, slow motion feel, silky smooth, the house "
        "perfectly centered and locked in frame at constant size, camera completely "
        "static on a tripod, no camera shake, no people, photorealistic.")

VIDEOS = [
    ("v1_dak", "k1_oud", "k2_dak",
     f"The old faded orange roof tiles gently lift away row by row and drift off screen "
     f"in slow motion, while brand new matte anthracite roof tiles slide in and settle "
     f"into perfect rows across the roof, a little dust drifting in the soft grey "
     f"daylight, the clouds slowly starting to break open. {LOCK}"),
    ("v2_zon", "k2_dak", "k3_zon",
     f"Sleek black solar panels float down one by one and mount themselves flush onto the "
     f"anthracite roof in a neat grid, each panel clicking softly into place, while warm "
     f"late-afternoon sunlight gradually breaks through the clouds and sweeps across the "
     f"lawn. {LOCK}"),
    ("v3_gevel", "k3_zon", "k4_gevel",
     f"A wave of renovation sweeps smoothly across the weathered brick facade: clean warm "
     f"off-white render flows over the old brickwork from one side to the other, window "
     f"frames turn crisp black with new glass, and a slim modern heat pump unit assembles "
     f"itself beside the house, while the light turns to full golden hour. {LOCK}"),
    ("v4_nest", "k4_gevel", "k5_nest",
     f"Golden hour fades softly into blue-hour dusk around the renovated house; the "
     f"windows begin to glow one by one with warm amber light, small garden lights along "
     f"the gravel path flicker on, the evening sky turning soft purple-blue with a last "
     f"warm glow on the horizon. {LOCK}"),
]

def main():
    for name, kf_a, kf_b, prompt in VIDEOS:
        if state["videos"].get(name, {}).get("taskId"):
            continue
        inp = {
            "prompt": prompt,
            "first_frame_url": state["keyframes"][kf_a]["url"],
            "last_frame_url": state["keyframes"][kf_b]["url"],
            "resolution": "1080p",
            "aspect_ratio": "16:9",
            "duration": 6,
            "generate_audio": False,
        }
        log(f"video {name}: taak aanmaken")
        tid = create_task("bytedance/seedance-2", inp)
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

    log("clips v2 afgerond")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"FOUT: {e}")
        save()
        sys.exit(1)
