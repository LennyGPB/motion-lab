"""Sons du motion « Kinetik challenge — Day 2 » (musique + effets)."""

import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "kinetik2", "sfx")
SR = g.SR
rng = np.random.default_rng(22)

DUR = 8.0  # doit matcher remotion/kinetik2/timing.ts
VO = 0.1  # décalage de la voix
BEAT = 60 / 140
START = 1.09 + VO  # la rythmique entre sur « I'm »
END = 6.4 + VO  # break avant la révélation


def t(d):
    return np.arange(int(SR * d)) / SR


def music():
    buf = np.zeros(int(DUR * SR))
    # intro : sub tenu + souffle filtré qui monte
    tt = t(START)
    drone = (np.sin(2 * np.pi * 36.7 * tt) + 0.5 * np.sin(2 * np.pi * 73.4 * tt)) * 0.22
    air = g.lowpass(rng.standard_normal(len(tt)), 2500) * 0.05 * np.linspace(0.2, 1, len(tt))
    vz.add(buf, drone + air, 0)
    notes = [36.7, 36.7, 43.65, 32.7]
    k = 0
    bt = START
    while bt < END:
        p = k % 4
        if p in (0, 2):
            vz.add(buf, vz.kick(), bt, 0.85)
        if p == 3:
            vz.add(buf, vz.kick(punch=0.5), bt + BEAT * 0.5, 0.45)
        if p in (1, 3):
            vz.add(buf, vz.clap(), bt, 0.5)
        for s in range(4 if p == 3 else 2):
            n = 4 if p == 3 else 2
            vz.add(buf, vz.hat(), bt + s * BEAT / n, 0.2 if s % 2 == 0 else 0.12)
        if p == 0:
            vz.add(buf, vz.bass808(notes[(k // 4) % 4], BEAT * 1.9), bt, 0.65)
        k += 1
        bt = START + k * BEAT
    # nappe synthwave
    pt = t(END - START)
    pad = sum(np.sin(2 * np.pi * f * pt + rng.uniform(0, 6)) for f in (146.8, 174.6, 220.0, 261.6)) * 0.045
    pad *= 0.55 + 0.45 * np.sin(2 * np.pi * pt / (BEAT * 2)) ** 2
    vz.add(buf, g.lowpass(pad, 1400), START)
    # queue : accord tenu jusqu'à la fin
    qt = t(DUR - END)
    tail = sum(np.sin(2 * np.pi * f * qt) for f in (73.4, 146.8, 220.0, 293.7)) * 0.06 * np.exp(-qt * 0.9)
    vz.add(buf, g.lowpass(tail, 1800), END)
    fade = int(0.5 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 240) * 0.9 + buf * 0.1], axis=1)


def tick():
    tt = t(0.05)
    return np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 120) * 0.6


def shimmer():
    tt = t(1.4)
    x = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * (2 + i)) for i, f in enumerate((1318.5, 1760, 2217.5, 2637)))
    return g.reverb(x * 0.25 * g.env(len(tt), 0.01, 0.4), 0.4, 1.2)


def riser(d=1.0):
    tt = t(d)
    n = len(tt)
    x = g.bandpass(rng.standard_normal(n), np.geomspace(400, 6000, n)) * 0.6
    x += np.sin(2 * np.pi * np.cumsum(np.geomspace(120, 1200, n)) / SR) * 0.2
    return x * np.linspace(0, 1, n) ** 2


if __name__ == "__main__":
    g.save("music", music())
    g.save("impact", vz.slam())
    g.save("drop", vz.drop_hit())
    g.save("glitch", vz.glitch())
    g.save("whoosh", g.whoosh(0.5, 600, 6000))
    g.save("scan", vz.scan())
    g.save("tick", tick())
    g.save("shimmer", shimmer())
    g.save("riser", riser())
    g.save("pop", vz.pop(700))
