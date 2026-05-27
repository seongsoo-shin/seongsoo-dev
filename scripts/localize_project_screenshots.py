#!/usr/bin/env python3
"""Split project screenshot assets into English/Korean folders and update project galleries.

Conservative mode: copies the original pixels into both locale folders when no editable
source layers are available. This preserves logos, drawings, and symbols exactly.
"""
from __future__ import annotations

import re
import shutil
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "projects"
PAGES = ROOT / "projects"

PROJECTS = {
    "bullida": ["ss-1.png", "ss-2.png"],
    "dabatruck": ["ss-2.png", "ss-3.png", "ss-4.png", "ss-5.png", "ss-1.jpg", "ss-6.jpg"],
    "d-hub": ["ss-1.png", "ss-2.png", "ss-3.png", "ss-4.png", "ss-5.png", "ss-6.png"],
    "unibook": ["ss-1.png", "ss-2.png", "ss-3.png", "ss-4.png", "ss-5.jpeg", "ss-6.jpeg"],
    "bexco": ["ss-1.png", "ss-2.png", "ss-3.png", "ss-4.png"],
    "cashbin": ["ss-1.png", "ss-2.png", "ss-3.png"],
    "gem-platform": ["ss-1.png", "ss-2.png", "ss-3.png", "ss-4.png"],
    "ranking-gg": ["ss-1.png", "ss-2.png", "ss-3.png", "ss-4.png", "ss-5.png", "ss-6.png"],
    "s-team": ["ss-1.png", "ss-2.png", "ss-3.png", "ss-4.png", "ss-5.png", "ss-6.png"],
    "neurodio": ["ss-1.png", "ss-2.png", "ss-3.png", "ss-4.png", "ss-5.png", "ss-6.png"],
    "nmodelin-onelook": ["onelook-ss-1.jpg", "onelook-ss-2.jpg", "onelook-ss-3.jpg"],
}

PAGE_PROJECTS = [p for p in PROJECTS if p not in {"neurodio", "nmodelin-onelook"}]

ALT_LABELS = {
    "d-hub": "D-HUB",
    "s-team": "S-TEAM",
    "ranking-gg": "Ranking GG",
    "gem-platform": "GEM Platform",
    "bexco": "BEXCO MICE CRM",
    "dabatruck": "Dabatruck",
    "bullida": "Bullida",
    "cashbin": "Cashbin",
    "unibook": "Unibook",
    "nmodelin-onelook": "Onelook app",
}


def copy_locale_assets(project: str, delay: float = 0.35) -> None:
    src_project = "nmodelin" if project == "nmodelin-onelook" else project
    base = ASSETS / src_project
    for lang in ("en", "ko"):
        (base / lang).mkdir(exist_ok=True)
    for name in PROJECTS[project]:
        src = base / name
        if not src.exists():
            raise FileNotFoundError(src)
        for lang in ("en", "ko"):
            dst = base / lang / name
            shutil.copy2(src, dst)
        time.sleep(delay)


def gallery_html(project: str, files: list[str], extra_classes: str = "", item_class_extra: str = "") -> str:
    src_project = "nmodelin" if project == "nmodelin-onelook" else project
    label = ALT_LABELS.get(project, project)
    classes = "gallery localized-gallery localized-{lang}" + extra_classes
    chunks = []
    for lang, lang_label in (("en", "English"), ("ko", "Korean")):
        chunks.append(f' <div class="{classes.format(lang=lang)}">')
        for i, name in enumerate(files):
            rel = f"../assets/projects/{src_project}/{lang}/{name}"
            item_class = f"shot{item_class_extra}"
            chunks.append(
                f' <a href="{rel}" class="{item_class}" data-gal="{project}-{lang}" data-i="{i}"><img src="{rel}" alt="{label} {lang_label} screenshot {i+1}"/></a>'
            )
        chunks.append(" </div>")
    return "\n".join(chunks)


def localize_standard_page(project: str) -> None:
    page = PAGES / f"{project}.html"
    text = page.read_text(encoding="utf-8")
    if "localized-gallery" in text:
        return
    m = re.search(r' <div class="gallery(?P<extra>[^"]*)">\n(?P<body>(?: <a href="\.\./assets/projects/' + re.escape(project) + r'/[^\n]+\n)+) </div>', text)
    if not m:
        raise RuntimeError(f"Gallery block not found in {page}")
    body = m.group("body")
    extra = m.group("extra")
    item_extra = ""
    item_match = re.search(r'class="shot(?P<extra>[^"]*)"', body)
    if item_match:
        item_extra = item_match.group("extra")
    new = gallery_html(project, PROJECTS[project], extra_classes=extra, item_class_extra=item_extra)
    page.write_text(text[:m.start()] + new + text[m.end():], encoding="utf-8")


def localize_nmodelin_onelook() -> None:
    page = PAGES / "nmodelin.html"
    text = page.read_text(encoding="utf-8")
    if "nmodelin-onelook-en" in text:
        return
    old = ''' <div class="gallery">
 <a href="../assets/projects/nmodelin/onelook-ss-1.jpg" class="shot phone-portrait" data-gal="nmodelin" data-i="3"><img src="../assets/projects/nmodelin/onelook-ss-1.jpg" alt="Onelook app screenshot 1"/></a>
 <a href="../assets/projects/nmodelin/onelook-ss-2.jpg" class="shot phone-portrait" data-gal="nmodelin" data-i="4"><img src="../assets/projects/nmodelin/onelook-ss-2.jpg" alt="Onelook app screenshot 2"/></a>
 <a href="../assets/projects/nmodelin/onelook-ss-3.jpg" class="shot phone-portrait" data-gal="nmodelin" data-i="5"><img src="../assets/projects/nmodelin/onelook-ss-3.jpg" alt="Onelook app screenshot 3"/></a>
 </div>'''
    new = gallery_html("nmodelin-onelook", PROJECTS["nmodelin-onelook"], item_class_extra=" phone-portrait")
    if old not in text:
        raise RuntimeError("Nmodelin Onelook gallery block not found")
    page.write_text(text.replace(old, new), encoding="utf-8")


def update_manifest() -> None:
    js = ROOT / "assets" / "js" / "site.js"
    text = js.read_text(encoding="utf-8")
    start = text.index("  window.GALLERIES = {")
    end = text.index("  };", start) + len("  };")

    entries = []

    def arr(paths: list[str]) -> str:
        return "[" + ",".join(repr(p) for p in paths) + "]"

    for project in ["ranking-gg", "s-team", "neurodio", "d-hub", "unibook", "bullida", "bexco", "cashbin", "gem-platform", "dabatruck"]:
        files = PROJECTS[project]
        base = f"../assets/projects/{project}"
        if project == "neurodio":
            entries.append(f"    'neurodio':     {arr([base + '/' + f for f in files])},")
        for lang in ("en", "ko"):
            entries.append(f"    '{project}-{lang}': {arr([base + '/' + lang + '/' + f for f in files])},")
    entries.append("    'nmodelin':     ['../assets/projects/nmodelin/onelook-official-1.png','../assets/projects/nmodelin/onelook-official-3.png','../assets/projects/nmodelin/onelook-official-2.png','../assets/projects/nmodelin/onelook-ss-1.jpg','../assets/projects/nmodelin/onelook-ss-2.jpg','../assets/projects/nmodelin/onelook-ss-3.jpg','../assets/teams/nmodelin/derived/20241130_131411-team.jpg','../assets/teams/nmodelin/derived/20241130_131520-team.jpg','../assets/teams/nmodelin/derived/img-2182-team.jpg','../assets/teams/nmodelin/derived/img-2141-team.jpg'],")
    for lang in ("en", "ko"):
        files = PROJECTS["nmodelin-onelook"]
        entries.append(f"    'nmodelin-onelook-{lang}': {arr(['../assets/projects/nmodelin/' + lang + '/' + f for f in files])},")

    block = "  window.GALLERIES = {\n" + "\n".join(entries) + "\n  };"
    js.write_text(text[:start] + block + text[end:], encoding="utf-8")


def main() -> None:
    for project in PROJECTS:
        # Neurodio already has hand-localized en/ko image assets; do not overwrite them.
        if project == "neurodio":
            continue
        copy_locale_assets(project)
    for project in PAGE_PROJECTS:
        localize_standard_page(project)
    localize_nmodelin_onelook()
    update_manifest()
    print("Localized gallery assets and page wiring complete.")


if __name__ == "__main__":
    main()
