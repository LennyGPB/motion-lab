"""Musique ambiante du motion SignsPath « Repeat after me » (même nappe que « night », calée sur 35,8 s)."""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_signspath_night as night  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "signspath", "repeat")
DUR = 35.8  # doit matcher remotion/signspath8/timing.ts

if __name__ == "__main__":
    # une cloche douce pendant chaque pause de répétition
    g.save("music", night.music(DUR, bells=(7.2, 12.4, 18.3, 23.5, 28.6)))
