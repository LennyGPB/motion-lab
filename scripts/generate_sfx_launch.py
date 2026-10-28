"""Musique + effets du template "Lancement" (numpy uniquement). 120 BPM.

Usage : python3 scripts/generate_sfx_launch.py  ->  public/launch/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "launch", "sfx")
SR = g.SR
rng = np.random.default_rng(61)

BEAT = 0.5  # 120 BPM — doit matcher remotion/launch/timing.ts
DUR = 16.0
DROP = 4 * BEAT  # apparition du logo
END = 25 * BEAT  # arrivée de la fin (stores)


def t(d):
    return np.arange(int(SR * d)) / SR


def count_hit(pitch=1.0):
    """Coup du compte à rebours : grosse caisse + tom + souffle."""
    tt = t(0.9)
    tom = np.sin(2 * np.pi * np.cumsum(110 * pitch + 140 * pitch * np.exp(-tt * 18)) / SR) * np.exp(-tt * 6)
    noise = g.lowpass(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 25) * 0.5
    return g.reverb(np.tanh((vz.kick(0.9, punch=1.2) + tom * 0.8 + noise) * 1.2), 0.3, 1.0)


def stab(chord, d=0.25):
    st = t(d)
    x = sum(2 * ((f * 2 * st) % 1) - 1 for f in chord) * np.exp(-st * 10)
    return g.lowpass(x, 3500) * 0.25


def music():
    buf = np.zeros(int(DUR * SR))
    chords = [(110.0, 130.81, 164.81), (87.31, 110.0, 130.81), (98.0, 123.47, 146.83), (82.41, 103.83, 123.47)]
    # compte à rebours : tic-tac sur les doubles croches + montée
    for k in range(int(DROP / (BEAT / 4))):
        vz.add(buf, vz.hat(0.04), k * BEAT / 4, 0.06 + 0.05 * (k / 16))
    vz.add(buf, g.riser(1.5) * 0.6, DROP - 1.5, 0.6)
    # drop : rythmique pleine
    k = 0
    while DROP + k * BEAT < END:
        tb = DROP + k * BEAT
        chord = chords[(k // 4) % 4]
        vz.add(buf, vz.kick(0.45, punch=0.9), tb, 0.7)
        vz.add(buf, vz.hat(), tb + BEAT / 2, 0.18)
        vz.add(buf, vz.hat(0.05), tb + BEAT * 0.75, 0.08)
        if k % 2 == 1:
            vz.add(buf, vz.clap(), tb, 0.3)
        if k % 4 == 0:
            vz.add(buf, vz.bass808(chord[0] / 2, BEAT * 1.8), tb, 0.45)
        vz.add(buf, stab(chord), tb + BEAT * 0.5, 0.18)
        k += 1
    # fin : impact + accord tenu
    vz.add(buf, vz.kick(1.4, punch=1.4), END, 0.85)
    ft = t(DUR - END)
    fin = sum(np.sin(2 * np.pi * f * ft) for f in (110.0, 220.0, 261.63, 329.63, 440.0)) * 0.1 * np.exp(-ft * 0.7)
    vz.add(buf, g.lowpass(fin, 3000), END, 1)
    fade = int(1.0 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 220) * 0.85 + buf * 0.15], axis=1)


if __name__ == "__main__":
    g.save("music", music())
    g.save("count3", count_hit(1.0))
    g.save("count2", count_hit(1.12))
    g.save("count1", count_hit(1.26))
    g.save("drop", vz.drop_hit())
    g.save("whoosh", g.whoosh(0.6, 400, 6000))
    g.save("swipe", vz.swipe())
    g.save("glitch", vz.glitch())
    g.save("tape", g.whoosh(1.2, 300, 3000))
    g.save("pop", vz.pop(800))
    g.save("shimmer", g.shimmer(2.0))
    print("ok")
