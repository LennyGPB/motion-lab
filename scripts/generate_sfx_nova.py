"""Musique + effets de la pub Nova (numpy uniquement).

Lent et élégant jusqu'au drop (9 s), puis rythmique 120 BPM, puis fin posée.
Usage : python3 scripts/generate_sfx_nova.py  ->  public/nova/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "nova", "sfx")
SR = g.SR
rng = np.random.default_rng(41)

DUR = 22.0  # doit matcher remotion/nova/timing.ts
DROP = 9.0
END = 17.5  # arrivée de la fin
BEAT = 0.5  # 120 BPM


def t(d):
    return np.arange(int(SR * d)) / SR


def bell(freq, d=2.5):
    tt = t(d)
    x = sum(a * np.sin(2 * np.pi * freq * k * tt) * np.exp(-tt * dec) for k, a, dec in ((1, 1, 1.6), (2, 0.35, 3), (3.01, 0.12, 5)))
    return x * g.env(len(tt), 0.004, 0.4)


def music():
    buf = np.zeros(int(DUR * SR))
    tt = t(DUR)
    # nappe : Ré maj9 → Si min9 (lente), filtrée, toute la durée
    chords = [(73.42, 146.83, 220.0, 277.18, 329.63), (61.74, 123.47, 185.0, 220.0, 277.18), (65.41, 130.81, 196.0, 246.94, 329.63), (55.0, 110.0, 164.81, 220.0, 277.18)]
    pad = np.zeros_like(tt)
    seg = 4.0
    for i in range(int(DUR / seg) + 1):
        notes = chords[i % 4]
        s0 = int(i * seg * SR)
        n = int((seg + 0.8) * SR)
        st = t(n / SR)
        x = sum(np.sin(2 * np.pi * f * st + rng.uniform(0, 6)) * (0.45 if f < 100 else 0.18) for f in notes)
        x *= g.env(n, 0.9, 1.0, 1.5)
        e = min(len(pad), s0 + n)
        pad[s0:e] += x[: e - s0]
    pad = g.lowpass(pad, 1600) * 0.55
    pad *= np.clip(tt / 2.0, 0, 1)
    vz.add(buf, pad, 0, 1)
    # cloches lentes (partie élégante)
    for k, (at, f) in enumerate([(0.6, 880.0), (2.1, 659.25), (3.6, 739.99), (5.1, 554.37), (6.6, 659.25), (8.1, 880.0)]):
        vz.add(buf, bell(f), at, 0.12)
    # montée avant le drop
    vz.add(buf, g.riser(1.5) * 0.5, DROP - 1.5, 0.5)
    # rythmique après le drop
    k = 0
    while DROP + k * BEAT < END:
        tb = DROP + k * BEAT
        vz.add(buf, vz.kick(0.45, punch=0.7), tb, 0.6)
        vz.add(buf, vz.hat(), tb + BEAT / 2, 0.14)
        if k % 2 == 1:
            vz.add(buf, vz.clap(), tb, 0.18)
        notes = chords[(k // 4) % 4]
        bt = t(BEAT * 0.4)
        bass = np.tanh(np.sin(2 * np.pi * notes[0] * bt) * 1.8) * g.env(len(bt), 0.005, 0.1)
        vz.add(buf, bass, tb + BEAT / 2, 0.3)
        if k % 4 == 0:
            st = t(0.35)
            stab = sum(np.sin(2 * np.pi * f * 2 * st) for f in notes[1:]) * np.exp(-st * 9)
            vz.add(buf, g.lowpass(stab, 3000), tb, 0.08)
        k += 1
    # impact final + accord tenu
    vz.add(buf, vz.kick(1.4, punch=1.3), END, 0.75)
    ft = t(DUR - END)
    fin = sum(np.sin(2 * np.pi * f * ft) for f in (73.42, 146.83, 220.0, 277.18, 369.99, 440.0)) * 0.1 * np.exp(-ft * 0.6)
    vz.add(buf, g.lowpass(fin, 2500), END, 1)
    vz.add(buf, bell(1174.66, 3.5), END + 0.05, 0.12)
    fade = int(1.2 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 260) * 0.85 + buf * 0.15], axis=1)


def notif():
    """Notification : verre, deux notes douces."""
    tt = t(0.7)
    a = np.sin(2 * np.pi * 1318.5 * tt) * np.exp(-tt * 9)
    b = np.sin(2 * np.pi * 1975.5 * tt) * np.exp(-np.maximum(0, tt - 0.07) * 8) * (tt >= 0.07)
    return g.reverb((a + 0.7 * b) * g.env(len(tt), 0.002, 0.2), 0.35, 0.9)


def sheen():
    """Reflet métallique sur la carte."""
    tt = t(1.6)
    n = len(tt)
    x = g.bandpass(rng.standard_normal(n), np.geomspace(2500, 9000, n)) * np.sin(np.linspace(0, np.pi, n)) ** 2
    return g.reverb(x * 0.6 + g.shimmer(1.6)[:n] * 0.4, 0.4, 1.5)


def soft_whoosh():
    return g.whoosh(0.9, 200, 2200)


def swipe():
    return g.whoosh(0.4, 1000, 6000)


def impact():
    tt = t(2.0)
    sub = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-tt * 9)) / SR) * np.exp(-tt * 2)
    return g.reverb(np.tanh(sub * 1.5), 0.4, 2.0)


def click():
    tt = t(0.08)
    return np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt * 110)


if __name__ == "__main__":
    g.save("music", music())
    g.save("notif", notif())
    g.save("sheen", sheen())
    g.save("whoosh", soft_whoosh())
    g.save("swipe", swipe())
    g.save("impact", impact())
    g.save("click", click())
    print("ok")
