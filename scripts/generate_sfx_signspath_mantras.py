"""Musiques ambiantes des mantras SignsPath « money » et « skill » (même nappe que « night »)."""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_signspath_night as night  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "signspath")
# durées : doivent matcher remotion/signspath10/config.ts ; une cloche douce dans chaque pause
TRACKS = {
    "money": (39.2, (4.9, 11.8, 18.6, 25.5, 32.3)),
    "skill": (36.3, (4.4, 10.7, 16.9, 23.1, 29.4)),
}

if __name__ == "__main__":
    for name, (dur, bells) in TRACKS.items():
        g.OUT = os.path.join(ROOT, name)
        g.save("music", night.music(dur, bells=bells))
