"""Musique + effets du template "Problème → Solution" (numpy uniquement).

Problème : drone sombre + tic-tac. Bascule (5 s) : montée puis passage en majeur, rythmique légère.
Usage : python3 scripts/generate_sfx_probsol.py  ->  public/probsol/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "probsol", "sfx")
SR = g.SR
rng = np.random.default_rng(71)

DUR = 19.0  # doit matcher remotion/probsol/timing.ts
SWITCH = 5.0  # bascule couleur
BEAT = 60 / 110
END = 15.0  # fin (logo)


def t(d):
    return np.arange(int(SR * d)) / SR


def pluck(freq, d=0.45):
    tt = t(d)
    x = (np.sin(2 * np.pi * freq * tt) + 0.4 * np.sin(2 * np.pi * freq * 2 * tt) + 0.15 * np.sin(2 * np.pi * freq * 3 * tt)) * np.exp(-tt * 9)
    return x * g.env(len(tt), 0.003, 0.08)


def music():
    buf = np.zeros(int(DUR * SR))
    # --- problème : drone mineur, trémolo, sub qui pulse ---
    tt = t(SWITCH + 0.3)
    drone = sum(np.sin(2 * np.pi * f * tt) for f in (55.0, 65.41, 82.41, 103.83)) * 0.2
    drone *= 0.6 + 0.4 * np.sin(2 * np.pi * 5.5 * tt) ** 2
    drone = g.lowpass(drone + g.lowpass(rng.standard_normal(len(tt)), 400) * 0.08, 900)
    drone *= np.clip(tt / 1.0, 0, 1) * np.clip((SWITCH + 0.3 - tt) / 0.3, 0, 1)
    vz.add(buf, drone, 0, 0.9)
    for k in range(int(SWITCH / 0.5)):
        vz.add(buf, vz.hat(0.03) * 0.8, k * 0.5, 0.12)  # tic
        vz.add(buf, vz.hat(0.03) * 0.5, k * 0.5 + 0.25, 0.06)  # tac
    vz.add(buf, g.riser(1.4) * 0.6, SWITCH - 1.4, 0.55)
    # --- solution : majeur lumineux ---
    chords = [(130.81, 261.63, 329.63, 392.0), (196.0, 246.94, 293.66, 392.0), (220.0, 261.63, 329.63, 440.0), (174.61, 220.0, 261.63, 349.23)]
    bar = BEAT * 4
    st = t(DUR - SWITCH)
    pad = np.zeros_like(st)
    for i in range(int((DUR - SWITCH) / bar) + 1):
        notes = chords[i % 4]
        s0 = int(i * bar * SR)
        n = int((bar + 0.5) * SR)
        x = sum(np.sin(2 * np.pi * f * t(n / SR) + rng.uniform(0, 6)) * (0.35 if f < 140 else 0.14) for f in notes) * g.env(n, 0.3, 0.6, 1.5)
        e = min(len(pad), s0 + n)
        pad[s0:e] += x[: e - s0]
    vz.add(buf, g.lowpass(pad, 2500) * 0.45, SWITCH, 1)
    k = 0
    while SWITCH + k * BEAT < END:
        tb = SWITCH + k * BEAT
        notes = chords[(k // 4) % 4]
        vz.add(buf, vz.kick(0.4, punch=0.6), tb, 0.5)
        vz.add(buf, vz.hat(), tb + BEAT / 2, 0.13)
        if k % 2 == 1:
            vz.add(buf, vz.clap(), tb, 0.22)
        for s in range(2):
            vz.add(buf, pluck(notes[1 + (k * 2 + s) % 3] * 2), tb + s * BEAT / 2, 0.12)
        k += 1
    ft = t(DUR - END)
    fin = sum(np.sin(2 * np.pi * f * ft) for f in (130.81, 261.63, 329.63, 392.0, 523.25)) * 0.1 * np.exp(-ft * 0.6)
    vz.add(buf, g.lowpass(fin, 3000), END, 1)
    vz.add(buf, vz.kick(1.2, punch=1.0), END, 0.6)
    fade = int(1.2 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 240) * 0.85 + buf * 0.15], axis=1)


def buzz():
    """Vibration de notification (problème)."""
    tt = t(0.45)
    x = np.sign(np.sin(2 * np.pi * 150 * tt)) * (np.sin(2 * np.pi * 24 * tt) > 0) * np.exp(-tt * 3)
    return g.lowpass(x, 1200) * 0.6


def bloom():
    """Bascule : souffle + accord lumineux."""
    tt = t(2.2)
    n = len(tt)
    air = g.bandpass(rng.standard_normal(n), np.geomspace(3000, 400, n)) * np.exp(-tt * 2) * 0.5
    chord = sum(np.sin(2 * np.pi * f * tt) for f in (523.25, 659.25, 783.99, 1046.5)) * np.exp(-tt * 1.8) * 0.25
    return g.reverb(air + chord, 0.45, 2.0)


if __name__ == "__main__":
    g.save("music", music())
    g.save("buzz", buzz())
    g.save("glitch", vz.glitch())
    g.save("bloom", bloom())
    g.save("whoosh", g.whoosh(0.7, 300, 5000))
    g.save("pop", vz.pop(700))
    g.save("ping", g.chime(1318.5, 1.4))
    g.save("impact", vz.drop_hit())
    print("ok")
