"""Musique ambiante du motion SignsPath « Morning affirmations » (même nappe que « night », calée sur 40,4 s)."""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_signspath_night as night  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "signspath", "morning")
DUR = 40.4  # doit matcher remotion/signspath9/timing.ts

if __name__ == "__main__":
    # une cloche douce pendant chaque pause de répétition
    g.save("music", night.music(DUR, bells=(3.8, 9.4, 15.4, 21.6, 27.9, 33.9)))
