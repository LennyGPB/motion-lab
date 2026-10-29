"""Musique du motion « Kinetik tuto partie 2 » (les effets sont ceux de la partie 1, public/kinetik3/sfx)."""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_kinetik3 as k3  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "kinetik4", "sfx")
k3.DUR = 33.7  # doit matcher remotion/kinetik4/timing.ts
k3.START = 3.86 + k3.VO  # la rythmique entre sur « Easy. »
k3.BRK0 = 28.6 + k3.VO  # break avant « In MP4 »
k3.DROP = 28.94 + k3.VO
k3.END = 32.6

if __name__ == "__main__":
    g.save("music", k3.music())
