"""Musiques des pubs Kinetik (même prod dynamique que « What can Kinetik do? », recalée sur chaque voix)."""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_kinetik5 as k5  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
# (dossier, durée, 1er drop, début de la montée, 2e drop « Kinetik », fin) — durées : remotion/kinetik6/timing.ts et remotion/kinetik8…14/timing.ts
PROMOS = [
    ("kinetik6", 20.2, 3.35, 6.75, 7.31, 18.7),
    ("kinetik7", 20.8, 3.99, 5.95, 6.52, 19.3),
    ("kinetik8", 16.4, 4.91, 11.7, 12.41, 15.3),
    ("kinetik9", 18.9, 3.5, 14.3, 15.16, 17.5),
    ("kinetik10", 18.4, 2.86, 6.45, 7.03, 17.0),
    ("kinetik11", 15.6, 2.12, 5.6, 6.17, 14.3),
    ("kinetik12", 17.9, 2.73, 8.45, 9.12, 16.6),
    ("kinetik13", 19.7, 3.51, 5.3, 5.86, 18.4),
    ("kinetik14", 35.4, 2.0, 25.35, 25.89, 34.1),
    ("kinetik15", 38.3, 2.0, 26.75, 27.34, 36.4),
    ("kinetik16", 21.8, 5.2, 15.4, 16.08, 21.0),
]

if __name__ == "__main__":
    for folder, dur, d1, brk, d2, end in PROMOS:
        k5.DUR, k5.DROP1, k5.BRK, k5.DROP2, k5.END = dur, d1, brk, d2, end
        g.OUT = os.path.join(ROOT, folder, "sfx")
        g.save("music", k5.music())
