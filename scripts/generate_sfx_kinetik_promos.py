"""Musiques des pubs Kinetik (même prod dynamique que « What can Kinetik do? », recalée sur chaque voix)."""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_kinetik5 as k5  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
# (dossier, durée, 1er drop, début de la montée, 2e drop « Kinetik », fin) — durées : remotion/kinetik6/timing.ts et remotion/kinetik8|9/timing.ts
PROMOS = [
    ("kinetik6", 20.2, 3.35, 6.75, 7.31, 18.7),
    ("kinetik7", 20.8, 3.99, 5.95, 6.52, 19.3),
    ("kinetik8", 16.4, 4.91, 11.7, 12.41, 15.3),
    ("kinetik9", 18.9, 3.5, 14.3, 15.16, 17.5),
]

if __name__ == "__main__":
    for folder, dur, d1, brk, d2, end in PROMOS:
        k5.DUR, k5.DROP1, k5.BRK, k5.DROP2, k5.END = dur, d1, brk, d2, end
        g.OUT = os.path.join(ROOT, folder, "sfx")
        g.save("music", k5.music())
