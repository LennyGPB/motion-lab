"""Sons du motion « Kinetik tuto — motion design en 2 secondes » (musique + effets)."""

import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_kinetik2 as k2  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "kinetik3", "sfx")
SR = g.SR
rng = np.random.default_rng(33)

DUR = 26.2  # doit matcher remotion/kinetik3/timing.ts
VO = 0.1
BEAT = 60 / 124
START = 4.31 + VO  # la rythmique entre avec la première étape
BRK0 = 17.6 + VO  # break avant « DONE »
DROP = 18.14 + VO  # « DONE! »
END = 25.2


def t(d):
    return np.arange(int(SR * d)) / SR


def music():
    buf = np.zeros(int(DUR * SR))
    # intro (accroche) : sub + nappe filtrée qui monte
    tt = t(START)
    drone = (np.sin(2 * np.pi * 41.2 * tt) + 0.5 * np.sin(2 * np.pi * 82.4 * tt)) * 0.18
    air = g.lowpass(rng.standard_normal(len(tt)), 2200) * 0.04 * np.linspace(0.3, 1, len(tt))
    vz.add(buf, drone + air, 0)
    notes = [41.2, 41.2, 49.0, 36.7]

    def bars(t0, t1, kk=0):
        k = kk
        bt = t0
        while bt < t1:
            p = k % 4
            if p in (0, 2):
                vz.add(buf, vz.kick(), bt, 0.8)
            if p == 3:
                vz.add(buf, vz.kick(punch=0.5), bt + BEAT * 0.5, 0.4)
            if p in (1, 3):
                vz.add(buf, vz.clap(), bt, 0.45)
            n = 4 if p == 3 and (k // 4) % 2 else 2
            for s in range(n):
                vz.add(buf, vz.hat(), bt + s * BEAT / n, 0.18 if s % 2 == 0 else 0.1)
            if p == 0:
                vz.add(buf, vz.bass808(notes[(k // 4) % 4], BEAT * 1.9), bt, 0.6)
            k += 1
            bt = t0 + (k - kk) * BEAT

    bars(START, BRK0)
    bars(DROP, END)
    # nappe d'accords
    for a, b in ((START, BRK0), (DROP, END)):
        pt = t(b - a)
        pad = sum(np.sin(2 * np.pi * f * pt + rng.uniform(0, 6)) for f in (164.8, 196.0, 246.9, 293.7)) * 0.04
        pad *= 0.55 + 0.45 * np.sin(2 * np.pi * pt / (BEAT * 2)) ** 2
        vz.add(buf, g.lowpass(pad, 1400), a)
    # queue
    qt = t(DUR - END)
    tail = sum(np.sin(2 * np.pi * f * qt) for f in (82.4, 164.8, 246.9, 329.6)) * 0.05 * np.exp(-qt * 1.2)
    vz.add(buf, g.lowpass(tail, 1800), END)
    fade = int(0.6 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 240) * 0.9 + buf * 0.1], axis=1)


def click():
    tt = t(0.08)
    x = np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 90) + g.lowpass(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 200) * 0.5
    return x * 0.7


def key():
    tt = t(0.05)
    return (g.lowpass(rng.standard_normal(len(tt)), 5000) * np.exp(-tt * 160) + np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt * 140) * 0.3) * 0.6


if __name__ == "__main__":
    g.save("music", music())
    g.save("impact", vz.slam())
    g.save("drop", vz.drop_hit())
    g.save("glitch", vz.glitch())
    g.save("whoosh", g.whoosh(0.5, 600, 6000))
    g.save("scan", vz.scan())
    g.save("tick", k2.tick())
    g.save("shimmer", k2.shimmer())
    g.save("riser", k2.riser(1.2))
    g.save("pop", vz.pop(700))
    g.save("click", click())
    g.save("key", key())
