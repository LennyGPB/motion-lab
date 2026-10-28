"""Musique + effets du motion "Démo produit au curseur" (numpy uniquement).

Usage : python3 scripts/generate_sfx_demo.py  ->  public/demo/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402
import generate_sfx_webbuild as wb  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "demo", "sfx")
SR = g.SR
rng = np.random.default_rng(101)

DUR = 16.0  # doit matcher remotion/demo/timing.ts
BEAT = 60 / 100
END = 12.0


def t(d):
    return np.arange(int(SR * d)) / SR


def keys(freq, d=0.6):
    tt = t(d)
    x = sum(a * np.sin(2 * np.pi * freq * k * tt) * np.exp(-tt * dec) for k, a, dec in ((1, 1, 5), (2, 0.3, 8), (3, 0.1, 12)))
    return g.lowpass(x * g.env(len(tt), 0.003, 0.1), 4000)


def music():
    buf = np.zeros(int(DUR * SR))
    chords = [(130.81, 196.0, 246.94, 329.63), (110.0, 164.81, 220.0, 293.66), (146.83, 220.0, 261.63, 349.23), (98.0, 146.83, 196.0, 293.66)]
    bar = BEAT * 4
    tt = t(DUR)
    pad = np.zeros_like(tt)
    for i in range(int(DUR / bar) + 1):
        notes = chords[i % 4]
        s0 = int(i * bar * SR)
        n = int((bar + 0.4) * SR)
        x = sum(np.sin(2 * np.pi * f * (np.arange(n) / SR) + rng.uniform(0, 6)) * (0.3 if f < 140 else 0.12) for f in notes) * g.env(n, 0.4, 0.5, 1.5)
        e = min(len(pad), s0 + n)
        pad[s0:e] += x[: e - s0]
    vz.add(buf, g.lowpass(pad, 2000) * 0.42 * np.clip(tt / 1.5, 0, 1), 0, 1)
    k = 0
    while k * BEAT / 2 < END:
        tb = k * BEAT / 2
        notes = chords[int(tb / bar) % 4]
        if k % 3 != 2:
            vz.add(buf, keys(notes[1 + k % 3] * 2), tb, 0.07)
        if k % 2 == 0:
            vz.add(buf, vz.kick(0.35, punch=0.3), tb, 0.35)
        else:
            vz.add(buf, vz.hat(0.04), tb, 0.08)
        if k % 4 == 2:
            vz.add(buf, vz.clap(), tb, 0.12)
        k += 1
    vz.add(buf, vz.kick(1.2, punch=0.9), END, 0.5)
    ft = t(DUR - END)
    fin = sum(np.sin(2 * np.pi * f * ft) for f in (130.81, 261.63, 329.63, 392.0, 493.88)) * 0.1 * np.exp(-ft * 0.6)
    vz.add(buf, g.lowpass(fin, 3000), END, 1)
    fade = int(1.2 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 230) * 0.85 + buf * 0.15], axis=1)


def zoom():
    """Zoom caméra : souffle doux."""
    return g.whoosh(0.55, 250, 2200) * 0.7


def tick():
    tt = t(0.05)
    return np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 150)


if __name__ == "__main__":
    g.save("music", music())
    g.save("click", wb.mouse_click())
    g.save("zoom", zoom())
    g.save("pop", vz.pop(750))
    g.save("tick", tick())
    g.save("success", wb.success())
    g.save("whoosh", g.whoosh(0.7, 300, 5000))
    print("ok")
