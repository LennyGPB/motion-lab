"""Musique + effets du motion "Navigateur en perspective" (numpy uniquement). 112 BPM, élégant.

Usage : python3 scripts/generate_sfx_browsertour.py  ->  public/browsertour/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402
import generate_sfx_platforms as pl  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "browsertour", "sfx")
SR = g.SR
rng = np.random.default_rng(131)

DUR = 20.0  # doit matcher remotion/browsertour/timing.ts
BEAT = 60 / 112
START = 1.33
END = 16.0


def t(d):
    return np.arange(int(SR * d)) / SR


def music():
    buf = np.zeros(int(DUR * SR))
    chords = [(110.0, 220.0, 277.18, 329.63), (87.31, 174.61, 220.0, 261.63), (130.81, 261.63, 329.63, 392.0), (98.0, 196.0, 246.94, 293.66)]
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
    vz.add(buf, g.lowpass(pad, 2400) * 0.42 * np.clip(tt / 1.2, 0, 1), 0, 1)
    k = 0
    while k * BEAT / 2 < END:
        tb = k * BEAT / 2
        notes = chords[int(tb / bar) % 4]
        vz.add(buf, pl.pluck(notes[1 + k % 3] * 2), tb, 0.08)
        if tb >= START:
            if k % 2 == 0:
                vz.add(buf, vz.kick(0.4, punch=0.6), tb, 0.5)
            else:
                vz.add(buf, vz.hat(), tb, 0.12)
            if k % 4 == 2:
                vz.add(buf, vz.clap(), tb, 0.2)
            if k % 8 == 0:
                vz.add(buf, vz.bass808(notes[0] / 2, BEAT * 1.8), tb, 0.32)
        k += 1
    vz.add(buf, vz.kick(1.3, punch=1.1), END, 0.65)
    ft = t(DUR - END)
    fin = sum(np.sin(2 * np.pi * f * ft) for f in (110.0, 220.0, 277.18, 329.63, 440.0)) * 0.1 * np.exp(-ft * 0.6)
    vz.add(buf, g.lowpass(fin, 3000), END, 1)
    fade = int(1.2 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 230) * 0.85 + buf * 0.15], axis=1)


def scroll(d=2.4):
    """Défilement : léger souffle continu + crans de molette."""
    tt = t(d)
    n = len(tt)
    x = g.bandpass(rng.standard_normal(n), 1800) * 0.25 * np.sin(np.linspace(0, np.pi, n)) ** 0.8
    for o in np.arange(0.1, d - 0.2, 0.09):
        i = int(o * SR)
        k = np.sin(2 * np.pi * 2600 * tt[: int(0.02 * SR)]) * np.exp(-tt[: int(0.02 * SR)] * 300) * 0.25
        x[i : i + len(k)] += k
    return x


if __name__ == "__main__":
    g.save("music", music())
    g.save("scroll", scroll())
    g.save("swipe", g.whoosh(0.6, 400, 5000))
    g.save("pop", vz.pop(800))
    g.save("impact", vz.drop_hit())
    g.save("shimmer", g.shimmer(1.8))
    print("ok")
