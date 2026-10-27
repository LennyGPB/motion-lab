"""Musique + effets légers de la pub Stride (numpy uniquement).

Usage : python3 scripts/generate_sfx_stride.py  ->  public/stride/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "stride", "sfx")
SR = g.SR
rng = np.random.default_rng(31)

BPM = 128
BEAT = 60 / BPM
DUR = 36 * BEAT + 0.6  # doit matcher remotion/stride/timing.ts
OUTRO = 30 * BEAT  # arrivée du logo


def t(d):
    return np.arange(int(SR * d)) / SR


def pluck(freq, d=0.35):
    tt = t(d)
    x = (np.sign(np.sin(2 * np.pi * freq * tt)) * 0.3 + np.sin(2 * np.pi * freq * 2 * tt) * 0.4) * np.exp(-tt * 14)
    return g.lowpass(x, 4500)


def music():
    buf = np.zeros(int(DUR * SR))
    prog = [(110.0, 220.0, 261.63, 329.63), (87.31, 174.61, 220.0, 261.63), (130.81, 196.0, 261.63, 329.63), (98.0, 196.0, 246.94, 293.66)]
    n_beats = 36
    for b in range(n_beats):
        tb = b * BEAT
        chord = prog[(b // 4) % 4]
        last = b >= 30  # outro : plus de kick, juste un accord final
        if not last:
            vz.add(buf, vz.kick(0.4, punch=0.6), tb, 0.6)
            vz.add(buf, vz.hat(), tb + BEAT / 2, 0.16)
            vz.add(buf, vz.hat(), tb + BEAT * 0.75, 0.07)
            if b % 2 == 1:
                vz.add(buf, vz.clap(), tb, 0.22)
            # basse sur le contretemps
            bt = t(BEAT * 0.45)
            bass = np.sin(2 * np.pi * chord[0] / 2 * bt) * g.env(len(bt), 0.005, 0.08)
            vz.add(buf, np.tanh(bass * 1.5), tb + BEAT / 2, 0.32)
            # arpège
            for s in range(2):
                vz.add(buf, pluck(chord[1 + (b * 2 + s) % 3] * 2), tb + s * BEAT / 2, 0.09)
    # accord final + sub sur le logo
    ft = t(DUR - OUTRO)
    fin = sum(np.sin(2 * np.pi * f * ft) for f in (110.0, 220.0, 277.18, 329.63, 440.0)) * 0.12 * np.exp(-ft * 0.9)
    vz.add(buf, fin, OUTRO, 1)
    vz.add(buf, vz.kick(1.2, punch=1.2), OUTRO, 0.8)
    fade = int(0.5 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade)
    return np.stack([buf, np.roll(buf, 200) * 0.85 + buf * 0.15], axis=1)


def tick():
    tt = t(0.06)
    return np.sin(2 * np.pi * 2600 * tt) * np.exp(-tt * 120)


def ding():
    return g.chime(1318.5, 1.8)


def sparkle():
    return g.shimmer(1.6)


def swish():
    return g.whoosh(0.35, 1200, 7000)


def thump():
    tt = t(0.4)
    return np.sin(2 * np.pi * np.cumsum(60 + 80 * np.exp(-tt * 30)) / SR) * np.exp(-tt * 10)


if __name__ == "__main__":
    g.save("music", music())
    g.save("tick", tick())
    g.save("ding", ding())
    g.save("sparkle", sparkle())
    g.save("swish", swish())
    g.save("thump", thump())
    print("ok")
