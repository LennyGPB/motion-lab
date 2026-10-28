"""Musique + effets du motion "Le terminal" (numpy uniquement). Ambiance dev, techno minimale.

Usage : python3 scripts/generate_sfx_terminal.py  ->  public/terminal/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402
import generate_sfx_webbuild as wb  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "terminal", "sfx")
SR = g.SR
rng = np.random.default_rng(113)

DUR = 19.0  # doit matcher remotion/terminal/timing.ts
BEAT = 0.5  # 120 BPM
WARP = 5.8  # transition terminal → fenêtre
END = 15.0  # carte de fin


def t(d):
    return np.arange(int(SR * d)) / SR


def acid(freq, d=0.22, cutoff=900):
    tt = t(d)
    saw = 2 * ((freq * tt) % 1) - 1
    return g.lowpass(saw, cutoff + 1800 * np.exp(-tt * 18)) * np.exp(-tt * 6)


def music():
    buf = np.zeros(int(DUR * SR))
    tt = t(DUR)
    # drone sombre tout du long
    drone = sum(np.sin(2 * np.pi * f * tt) for f in (55.0, 82.41, 110.0)) * 0.12
    drone = g.lowpass(drone + g.lowpass(rng.standard_normal(len(tt)), 300) * 0.05, 700)
    drone *= np.clip(tt / 1.5, 0, 1)
    vz.add(buf, drone, 0, 1)
    # avant le warp : pulse de basse + hats feutrés
    k = 0
    while k * BEAT / 2 < WARP - 0.3:
        tb = k * BEAT / 2
        if k % 2 == 0:
            vz.add(buf, acid(55.0, cutoff=400), tb, 0.25)
        vz.add(buf, vz.hat(0.03), tb + BEAT / 4, 0.05)
        k += 1
    vz.add(buf, g.riser(1.4) * 0.6, WARP - 1.4, 0.5)
    # après le warp : techno minimale
    seq = [55.0, 55.0, 65.41, 55.0, 73.42, 55.0, 65.41, 82.41]
    k = 0
    while WARP + k * BEAT / 2 < END:
        tb = WARP + k * BEAT / 2
        if k % 2 == 0:
            vz.add(buf, vz.kick(0.4, punch=0.9), tb, 0.6)
        else:
            vz.add(buf, vz.hat(), tb, 0.14)
        if k % 4 == 2:
            vz.add(buf, vz.clap(), tb, 0.18)
        vz.add(buf, acid(seq[k % 8] * 2, cutoff=700 + 400 * np.sin(k / 5)), tb, 0.16)
        k += 1
    vz.add(buf, vz.kick(1.4, punch=1.2), END, 0.7)
    ft = t(DUR - END)
    fin = sum(np.sin(2 * np.pi * f * ft) for f in (55.0, 110.0, 164.81, 220.0, 329.63)) * 0.11 * np.exp(-ft * 0.6)
    vz.add(buf, g.lowpass(fin, 2500), END, 1)
    fade = int(1.2 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 210) * 0.85 + buf * 0.15], axis=1)


def beep():
    tt = t(0.07)
    return np.sign(np.sin(2 * np.pi * 1760 * tt)) * np.exp(-tt * 50) * 0.3


def boot():
    """Allumage : bourdonnement CRT qui monte + clic."""
    tt = t(1.0)
    hum = np.sin(2 * np.pi * np.cumsum(50 + 900 * tt**2) / SR) * 0.3 * np.clip(tt * 3, 0, 1) * np.exp(-tt * 1.5)
    click = g.lowpass(rng.standard_normal(len(tt)), 4000) * np.exp(-tt * 200)
    return hum + click


if __name__ == "__main__":
    g.save("music", music())
    g.save("typing", wb.typing())
    g.save("beep", beep())
    g.save("boot", boot())
    g.save("warp", g.whoosh(1.4, 150, 7000))
    g.save("impact", vz.drop_hit())
    g.save("glitch", vz.glitch())
    g.save("success", wb.success())
    g.save("swish", g.whoosh(0.5, 900, 6000))
    print("ok")
