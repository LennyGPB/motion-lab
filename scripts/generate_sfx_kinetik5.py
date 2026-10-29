"""Musique du motion « What can Kinetik do? » : prod électro plus dynamique (128 BPM, 4/4, arpège, montées).
Les effets sonores réutilisent public/kinetik3/sfx."""

import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_platforms as pl  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "kinetik5", "sfx")
SR = g.SR
rng = np.random.default_rng(55)

DUR = 36.8  # doit matcher remotion/kinetik5/timing.ts
VO = 0.1
BEAT = 60 / 128
DROP1 = 1.79 + VO  # « With Kinetik » : la prod démarre
BRK = 28.2 + VO  # montée avant « New templates drop »
DROP2 = 28.97 + VO
END = 35.6


def t(d):
    return np.arange(int(SR * d)) / SR


def open_hat():
    return vz.hat(open_=True)


def music():
    buf = np.zeros(int(DUR * SR))
    # intro filtrée + montée vers le premier drop
    tt = t(DROP1)
    n = len(tt)
    vz.add(buf, g.bandpass(rng.standard_normal(n), np.geomspace(300, 5000, n)) * 0.35 * np.linspace(0, 1, n) ** 2, 0)
    vz.add(buf, np.sin(2 * np.pi * 55 * tt) * 0.15 * np.linspace(0.3, 1, n), 0)
    for k in range(8):
        vz.add(buf, vz.kick(punch=0.4), DROP1 - BEAT * (8 - k) / 2, 0.15 + 0.05 * k)

    roots = [55.0, 55.0, 65.41, 49.0]  # La, La, Do, Sol
    arp = [1, 1.5, 2, 3, 2, 1.5, 2.25, 3]

    def section(t0, t1):
        k = 0
        bt = t0
        while bt < t1 - 0.01:
            bar = (k // 4) % 4
            root = roots[bar]
            vz.add(buf, vz.kick(), bt, 0.85)  # 4 temps au sol
            if k % 2 == 1:
                vz.add(buf, vz.clap(), bt, 0.5)
            for s in range(4):  # charleston en doubles croches
                vz.add(buf, vz.hat(), bt + s * BEAT / 4, 0.16 if s % 2 == 0 else 0.08)
            vz.add(buf, open_hat(), bt + BEAT / 2, 0.12)
            # basse sur le contretemps
            vz.add(buf, vz.bass808(root, BEAT * 0.45), bt + BEAT / 2, 0.5)
            # arpège
            for s in range(2):
                vz.add(buf, pl.pluck(root * 4 * arp[(k * 2 + s) % len(arp)], 0.25), bt + s * BEAT / 2, 0.07)
            k += 1
            bt = t0 + k * BEAT

    section(DROP1, BRK)
    # montée (snare roll + bruit)
    rt = t(DROP2 - BRK)
    m = len(rt)
    vz.add(buf, g.bandpass(rng.standard_normal(m), np.geomspace(500, 8000, m)) * 0.4 * np.linspace(0, 1, m) ** 2, BRK)
    nroll = 12
    for i in range(nroll):
        vz.add(buf, vz.clap(), BRK + (DROP2 - BRK) * i / nroll, 0.15 + 0.25 * i / nroll)
    vz.add(buf, vz.drop_hit(), DROP2, 0.35)
    section(DROP2, END)
    # pompe façon sidechain sur la nappe
    pt = t(END - DROP1)
    pad = sum(np.sin(2 * np.pi * f * pt + rng.uniform(0, 6)) for f in (220.0, 261.6, 329.6, 392.0)) * 0.035
    pump = 0.35 + 0.65 * ((pt % BEAT) / BEAT) ** 0.6
    vz.add(buf, g.lowpass(pad * pump, 1800), DROP1)
    # queue
    qt = t(DUR - END)
    tail = sum(np.sin(2 * np.pi * f * qt) for f in (110.0, 220.0, 329.6, 440.0)) * 0.05 * np.exp(-qt * 1.4)
    vz.add(buf, g.lowpass(tail, 2000), END)
    fade = int(0.6 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 240) * 0.9 + buf * 0.1], axis=1)


if __name__ == "__main__":
    g.save("music", music())
