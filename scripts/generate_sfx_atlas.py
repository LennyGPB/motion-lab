"""Musique + effets de la pub Atlas (numpy uniquement). Cinématique et chaleureux.

Usage : python3 scripts/generate_sfx_atlas.py  ->  public/atlas/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "atlas", "sfx")
SR = g.SR
rng = np.random.default_rng(53)

DUR = 24.0  # doit matcher remotion/atlas/timing.ts
BEAT = 60 / 90
PERC_IN = 4.5  # la percussion douce entre avec l'arc d'avion
BOOK = 18.0  # "Réservé"
END = 19.83  # fin (logo)


def t(d):
    return np.arange(int(SR * d)) / SR


def piano(freq, d=2.2):
    tt = t(d)
    x = sum(a * np.sin(2 * np.pi * freq * k * tt) * np.exp(-tt * dec) for k, a, dec in ((1, 1, 2.2), (2, 0.4, 3.5), (3, 0.15, 5), (4, 0.06, 7)))
    return g.lowpass(x * g.env(len(tt), 0.004, 0.5), 5000)


def music():
    buf = np.zeros(int(DUR * SR))
    tt = t(DUR)
    # Fa maj7 → La min7 → Ré min9 → Si♭ maj7 (6 s chacun… 4 temps à 90 BPM = 2,67 s)
    chords = [(87.31, 174.61, 220.0, 261.63, 329.63), (110.0, 164.81, 220.0, 261.63, 392.0), (73.42, 146.83, 220.0, 261.63, 329.63), (58.27, 116.54, 174.61, 220.0, 293.66)]
    bar = BEAT * 4
    pad = np.zeros_like(tt)
    for i in range(int(DUR / bar) + 1):
        notes = chords[i % 4]
        s0 = int(i * bar * SR)
        n = int((bar + 0.8) * SR)
        st = t(n / SR)
        x = sum(np.sin(2 * np.pi * f * st + rng.uniform(0, 6)) * (0.45 if f < 120 else 0.17) for f in notes)
        x += sum(np.sin(2 * np.pi * f * 1.003 * st) * 0.08 for f in notes[2:])  # léger chorus
        x *= g.env(n, 0.8, 0.9, 1.5)
        e = min(len(pad), s0 + n)
        pad[s0:e] += x[: e - s0]
    pad = g.lowpass(pad, 1800) * 0.5 * np.clip(tt / 3.0, 0, 1)
    vz.add(buf, pad, 0, 1)
    # arpège de piano (croches à 90 BPM)
    k = 0
    while k * BEAT / 2 < END:
        tb = k * BEAT / 2
        notes = chords[int(tb / bar) % 4]
        f = notes[1 + (k % 4)] * 2
        gain = 0.07 if tb < PERC_IN else 0.1
        vz.add(buf, piano(f), tb + 0.3, gain)
        k += 1
    # percussions douces (shaker + kick feutré)
    k = 0
    while PERC_IN + k * BEAT < END - 0.1:
        tb = PERC_IN + k * BEAT
        swell = min(1, (tb - PERC_IN) / 6 + 0.4)
        vz.add(buf, vz.kick(0.4, punch=0.3), tb, 0.38 * swell)
        for s in range(2):
            vz.add(buf, vz.hat(0.05) * 0.6, tb + s * BEAT / 2 + BEAT / 4, 0.08 * swell)
        k += 1
    # montée vers "Réservé" puis accord final
    vz.add(buf, g.riser(1.6) * 0.4, BOOK - 1.6, 0.4)
    ft = t(DUR - END)
    fin = sum(np.sin(2 * np.pi * f * ft) for f in (87.31, 174.61, 261.63, 329.63, 440.0, 523.25)) * 0.09 * np.exp(-ft * 0.45)
    vz.add(buf, g.lowpass(fin, 3000), END, 1)
    for i, f in enumerate((523.25, 659.25, 783.99, 1046.5)):
        vz.add(buf, piano(f, 3.0), END + 0.1 + i * 0.12, 0.08)
    fade = int(1.5 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 280) * 0.85 + buf * 0.15], axis=1)


def flyby():
    """Passage d'avion : souffle filtré + ton qui descend (effet Doppler)."""
    tt = t(3.0)
    n = len(tt)
    env = np.exp(-((tt - 1.4) ** 2) / 0.5)
    noise = g.bandpass(rng.standard_normal(n), 600 + 900 * env)
    tone = np.sin(2 * np.pi * np.cumsum(260 - 80 * np.tanh((tt - 1.4) * 3)) / SR) * 0.15
    x = (noise + tone) * env
    st = np.stack([x * (1 - np.clip(tt / 3, 0, 1) * 0.6), x * (0.4 + np.clip(tt / 3, 0, 1) * 0.6)], axis=1)
    return st


def success():
    """Validation : arpège majeur cristallin."""
    tt = t(1.6)
    x = np.zeros_like(tt)
    for i, f in enumerate((783.99, 987.77, 1174.66, 1567.98)):
        o = i * 0.07
        m = tt >= o
        x[m] += np.sin(2 * np.pi * f * (tt[m] - o)) * np.exp(-(tt[m] - o) * 4)
    return g.reverb(x * g.env(len(tt), 0.002, 0.3), 0.4, 1.4)


def tap():
    tt = t(0.1)
    return np.sin(2 * np.pi * 900 * tt) * np.exp(-tt * 60) + g.lowpass(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 150) * 0.3


def paper():
    tt = t(0.6)
    n = len(tt)
    return g.bandpass(rng.standard_normal(n), np.linspace(2500, 5000, n)) * np.sin(np.linspace(0, np.pi, n)) * 0.6


if __name__ == "__main__":
    g.save("music", music())
    g.save("flyby", flyby())
    g.save("whoosh", g.whoosh(0.9, 250, 3000))
    g.save("swish", g.whoosh(0.5, 900, 5000))
    g.save("success", success())
    g.save("tap", tap())
    g.save("paper", paper())
    g.save("shimmer", g.shimmer(2.0))
    print("ok")
