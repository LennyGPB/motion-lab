"""Musique + effets du template "Social proof" (numpy uniquement). 120 BPM, positif.

Usage : python3 scripts/generate_sfx_proof.py  ->  public/proof/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "proof", "sfx")
SR = g.SR
rng = np.random.default_rng(83)

BEAT = 0.5  # doit matcher remotion/proof/timing.ts
DUR = 18.0
START = 1.5  # la rythmique entre avec les chiffres
END = 14.0  # fin (logo)


def t(d):
    return np.arange(int(SR * d)) / SR


def pluck(freq, d=0.4):
    tt = t(d)
    x = (np.sin(2 * np.pi * freq * tt) + 0.5 * np.sin(2 * np.pi * freq * 2 * tt) + 0.2 * np.sin(2 * np.pi * freq * 3 * tt)) * np.exp(-tt * 10)
    return x * g.env(len(tt), 0.002, 0.06)


def music():
    buf = np.zeros(int(DUR * SR))
    chords = [(130.81, 261.63, 329.63, 392.0), (110.0, 220.0, 261.63, 329.63), (87.31, 174.61, 220.0, 261.63), (98.0, 196.0, 246.94, 293.66)]
    bar = BEAT * 4
    tt = t(DUR)
    pad = np.zeros_like(tt)
    for i in range(int(DUR / bar) + 1):
        notes = chords[i % 4]
        s0 = int(i * bar * SR)
        n = int((bar + 0.4) * SR)
        x = sum(np.sin(2 * np.pi * f * t(n / SR) + rng.uniform(0, 6)) * (0.35 if f < 140 else 0.13) for f in notes) * g.env(n, 0.2, 0.4, 1.5)
        e = min(len(pad), s0 + n)
        pad[s0:e] += x[: e - s0]
    vz.add(buf, g.lowpass(pad, 2600) * 0.4 * np.clip(tt / 1.5, 0, 1), 0, 1)
    # arpège dès le début, rythmique à partir de START
    k = 0
    while k * BEAT / 2 < END:
        tb = k * BEAT / 2
        notes = chords[int(tb / bar) % 4]
        vz.add(buf, pluck(notes[1 + k % 3] * 2), tb, 0.1)
        if tb >= START:
            if k % 2 == 0:
                vz.add(buf, vz.kick(0.4, punch=0.6), tb, 0.55)
            else:
                vz.add(buf, vz.hat(), tb, 0.14)
            if k % 4 == 2:
                vz.add(buf, vz.clap(), tb, 0.25)
            if k % 8 == 0:
                vz.add(buf, vz.bass808(notes[0] / 2, BEAT * 1.8), tb, 0.35)
        k += 1
    vz.add(buf, vz.kick(1.2, punch=1.2), END, 0.7)
    ft = t(DUR - END)
    fin = sum(np.sin(2 * np.pi * f * ft) for f in (130.81, 261.63, 329.63, 392.0, 523.25)) * 0.1 * np.exp(-ft * 0.7)
    vz.add(buf, g.lowpass(fin, 3000), END, 1)
    fade = int(1.0 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 230) * 0.85 + buf * 0.15], axis=1)


def star(i):
    """Étoile i (0..4) : note qui monte."""
    f = [880.0, 987.77, 1108.73, 1318.51, 1479.98][i]
    tt = t(0.6)
    x = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt)) * np.exp(-tt * 8)
    return g.reverb(x * g.env(len(tt), 0.002, 0.1), 0.3, 0.7)


def counter():
    """Compteur qui monte : roulement de clics accéléré + montée."""
    tt = t(0.6)
    x = np.zeros_like(tt)
    times = np.cumsum(np.linspace(0.06, 0.02, 16))
    for i, o in enumerate(times):
        if o >= 0.6:
            break
        m = tt >= o
        x[m] += np.sin(2 * np.pi * (1500 + i * 60) * (tt[m] - o)) * np.exp(-(tt[m] - o) * 90) * 0.6
    return x


if __name__ == "__main__":
    g.save("music", music())
    for i in range(5):
        g.save(f"star{i}", star(i))
    g.save("counter", counter())
    g.save("hit", vz.slam())
    g.save("whoosh", g.whoosh(0.6, 400, 5000))
    g.save("card", g.whoosh(0.4, 900, 4000))
    g.save("chime", g.chime(1046.5, 2.0))
    g.save("shimmer", g.shimmer(2.0))
    print("ok")
