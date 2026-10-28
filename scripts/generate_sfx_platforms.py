"""Musique + effets du motion "Toutes les plateformes" (numpy uniquement). Pop électro lumineuse, 118 BPM.

Usage : python3 scripts/generate_sfx_platforms.py  ->  public/platforms/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402
import generate_sfx_webbuild as wb  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "platforms", "sfx")
SR = g.SR
rng = np.random.default_rng(127)

DUR = 20.0  # doit matcher remotion/platforms/timing.ts
BEAT = 60 / 118
START = 1.3  # la rythmique entre avec le laptop
END = 15.67  # carte de fin (frame 470)


def t(d):
    return np.arange(int(SR * d)) / SR


def pluck(freq, d=0.4):
    tt = t(d)
    x = (np.sin(2 * np.pi * freq * tt) + 0.4 * np.sin(2 * np.pi * freq * 2 * tt) + 0.15 * np.sin(2 * np.pi * freq * 3 * tt)) * np.exp(-tt * 9)
    return x * g.env(len(tt), 0.002, 0.06)


def music():
    buf = np.zeros(int(DUR * SR))
    chords = [(146.83, 293.66, 369.99, 440.0), (123.47, 246.94, 293.66, 369.99), (98.0, 196.0, 246.94, 293.66), (110.0, 220.0, 277.18, 329.63)]
    bar = BEAT * 4
    tt = t(DUR)
    pad = np.zeros_like(tt)
    for i in range(int(DUR / bar) + 1):
        notes = chords[i % 4]
        s0 = int(i * bar * SR)
        n = int((bar + 0.4) * SR)
        x = sum(np.sin(2 * np.pi * f * (np.arange(n) / SR) + rng.uniform(0, 6)) * (0.3 if f < 150 else 0.12) for f in notes) * g.env(n, 0.3, 0.4, 1.5)
        e = min(len(pad), s0 + n)
        pad[s0:e] += x[: e - s0]
    vz.add(buf, g.lowpass(pad, 2600) * 0.4 * np.clip(tt / 1.2, 0, 1), 0, 1)
    k = 0
    while k * BEAT / 2 < END:
        tb = k * BEAT / 2
        notes = chords[int(tb / bar) % 4]
        vz.add(buf, pluck(notes[1 + k % 3] * 2), tb, 0.09)
        if tb >= START:
            if k % 2 == 0:
                vz.add(buf, vz.kick(0.4, punch=0.7), tb, 0.55)
            else:
                vz.add(buf, vz.hat(), tb, 0.13)
            if k % 4 == 2:
                vz.add(buf, vz.clap(), tb, 0.22)
            if k % 8 == 0:
                vz.add(buf, vz.bass808(notes[0] / 2, BEAT * 1.8), tb, 0.35)
        k += 1
    vz.add(buf, g.riser(1.4) * 0.45, END - 1.4, 0.45)
    vz.add(buf, vz.kick(1.3, punch=1.2), END, 0.7)
    ft = t(DUR - END)
    fin = sum(np.sin(2 * np.pi * f * ft) for f in (146.83, 293.66, 369.99, 440.0, 587.33)) * 0.1 * np.exp(-ft * 0.6)
    vz.add(buf, g.lowpass(fin, 3000), END, 1)
    fade = int(1.2 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 230) * 0.85 + buf * 0.15], axis=1)


def land(pitch=1.0):
    """Arrivée d'un appareil : petit choc sourd + scintillement."""
    tt = t(1.0)
    thud = np.sin(2 * np.pi * np.cumsum(70 * pitch + 90 * pitch * np.exp(-tt * 25)) / SR) * np.exp(-tt * 12)
    bell = np.sin(2 * np.pi * 1046.5 * pitch * tt) * np.exp(-tt * 5) * 0.25
    return g.reverb(thud * 0.8 + bell, 0.3, 0.8)


def lid():
    """Ouverture de l'écran : souffle doux + petite montée."""
    tt = t(0.9)
    n = len(tt)
    return g.bandpass(rng.standard_normal(n), np.geomspace(300, 2500, n)) * np.sin(np.linspace(0, np.pi, n)) * 0.5


if __name__ == "__main__":
    g.save("music", music())
    g.save("land1", land(1.0))
    g.save("land2", land(1.19))
    g.save("land3", land(1.5))
    g.save("lid", lid())
    g.save("whoosh", g.whoosh(0.7, 300, 5000))
    g.save("sync", g.shimmer(1.6))
    g.save("pop", vz.pop(800))
    g.save("impact", vz.drop_hit())
    g.save("success", wb.success())
    print("ok")
