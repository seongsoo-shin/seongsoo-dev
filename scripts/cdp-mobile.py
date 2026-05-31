#!/usr/bin/env python3
"""Mobile viewport CDP capture: nav drawer closed, then toggled open."""
import json, sys, time, base64, urllib.request
import websocket

CDP = "172.27.176.1:9223"
WSLIP = sys.argv[1]
BASE = f"http://{WSLIP}:4180"

def new_tab():
    req = urllib.request.Request(f"http://{CDP}/json/new?about:blank", method="PUT")
    return json.load(urllib.request.urlopen(req, timeout=10))

def close_tab(tid):
    try: urllib.request.urlopen(f"http://{CDP}/json/close/{tid}", timeout=10).read()
    except Exception: pass

def run(ws_url):
    ws = websocket.create_connection(ws_url, timeout=30, max_size=64*1024*1024)
    i=[0]
    def cmd(method, params=None):
        i[0]+=1
        ws.send(json.dumps({"id":i[0],"method":method,"params":params or {}}))
        while True:
            m=json.loads(ws.recv())
            if m.get("id")==i[0]: return m
    cmd("Page.enable"); cmd("Runtime.enable")
    # iPhone-ish viewport
    cmd("Emulation.setDeviceMetricsOverride",
        {"width":390,"height":844,"deviceScaleFactor":2,"mobile":True})
    cmd("Page.navigate", {"url": BASE + "/"})
    time.sleep(3.0)
    def shot(name):
        r=cmd("Page.captureScreenshot",{"format":"jpeg","quality":82})
        d=r.get("result",{}).get("data")
        if d:
            open(f"/tmp/mob-{name}.jpg","wb").write(base64.b64decode(d))
            print("OK", name)
        else:
            print("FAIL", name, r)
    shot("closed")
    # click the hamburger toggle
    cmd("Runtime.evaluate",
        {"expression":"document.querySelector('.nav-toggle').click()"})
    time.sleep(0.8)
    shot("open")
    # read state for assertion
    st=cmd("Runtime.evaluate",{"expression":
        "JSON.stringify({open:document.querySelector('nav.nav').classList.contains('open'),"
        "exp:document.querySelector('.nav-toggle').getAttribute('aria-expanded'),"
        "bodyNavOpen:document.body.classList.contains('nav-open')})",
        "returnByValue":True})
    print("STATE", st.get("result",{}).get("result",{}).get("value"))
    ws.close()

t=new_tab()
try: run(t["webSocketDebuggerUrl"])
finally: close_tab(t["id"])
print("done")
