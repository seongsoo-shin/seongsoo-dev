#!/usr/bin/env python3
"""Capture full-page screenshots via Windows Chrome CDP for visual comparison."""
import json, sys, time, base64, urllib.request
import websocket

CDP = "172.27.176.1:9223"   # Windows Chrome remote debugging
WSLIP = sys.argv[1]         # WSL host IP reachable from Windows Chrome

PAGES = [
    ("home",      "react", f"http://{WSLIP}:4180/"),
    ("home",      "orig",  f"http://{WSLIP}:4181/"),
    ("projects",  "react", f"http://{WSLIP}:4180/projects/"),
    ("projects",  "orig",  f"http://{WSLIP}:4181/projects.html"),
    ("career",    "react", f"http://{WSLIP}:4180/career/"),
    ("career",    "orig",  f"http://{WSLIP}:4181/career.html"),
    ("contact",   "react", f"http://{WSLIP}:4180/contact/"),
    ("contact",   "orig",  f"http://{WSLIP}:4181/contact.html"),
    ("nmodelin",  "react", f"http://{WSLIP}:4180/projects/nmodelin/"),
    ("nmodelin",  "orig",  f"http://{WSLIP}:4181/projects/nmodelin.html"),
]

def new_tab():
    req = urllib.request.Request(f"http://{CDP}/json/new?about:blank", method="PUT")
    r = urllib.request.urlopen(req, timeout=10)
    return json.load(r)

def close_tab(tid):
    try:
        urllib.request.urlopen(f"http://{CDP}/json/close/{tid}", timeout=10).read()
    except Exception:
        pass

def cap(ws_url, url, out):
    ws = websocket.create_connection(ws_url, timeout=30, max_size=64*1024*1024)
    i = [0]
    def cmd(method, params=None):
        i[0] += 1
        ws.send(json.dumps({"id": i[0], "method": method, "params": params or {}}))
        while True:
            m = json.loads(ws.recv())
            if m.get("id") == i[0]:
                return m
    cmd("Page.enable")
    cmd("Emulation.setDeviceMetricsOverride",
        {"width":1440,"height":900,"deviceScaleFactor":1,"mobile":False})
    cmd("Page.navigate", {"url": url})
    time.sleep(3.0)  # let fonts, reveal, first-load screen settle
    r = cmd("Page.captureScreenshot", {"format":"jpeg","quality":80,"captureBeyondViewport":True})
    data = r.get("result",{}).get("data")
    ws.close()
    if not data:
        print(f"  !! no data for {url}")
        return False
    with open(out,"wb") as f:
        f.write(base64.b64decode(data))
    return True

for name, kind, url in PAGES:
    t = new_tab()
    ok = cap(t["webSocketDebuggerUrl"], url, f"/tmp/cmp-{name}-{kind}.jpg")
    close_tab(t["id"])
    print(f"{'OK' if ok else 'FAIL'} {name}/{kind} <- {url}")
print("done")
