"""Musique + effets "corporate" du motion ViewZ partenaires (numpy uniquement).

Usage : python3 scripts/generate_sfx_viewz_b2b.py  ->  public/viewz/sfx/b2b_*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "viewz", "sfx")
SR = g.SR
rng = np.random.default_rng(23)

VO = 0.3  # doit matcher remotion/viewz-b2b/timing.ts
DUR = 32.0
BPM = 100
BEAT = 60 / BPM
START = 3.24 + VO  # la rythmique entre avec "On recherche"
DIP0, DIP1 = 21.6 + VO, 25.6 + VO  # rythmique en retrait pendant "En échange"
END = 30.3


def t(d):
    return np.arange(int(SR * d)) / SR


def pluck(freq, d=0.5):
    tt = t(d)
    x = sum(np.sin(2 * np.pi * freq * k * tt) / k for k in (1, 2, 3, 4)) * np.exp(-tt * 9)
    return g.lowpass(x, 3500) * g.env(len(tt), 0.003, 0.1)


def soft_kick():
    return vz.kick(0.45, punch=0.4) * 0.8


def music():
    buf = np.zeros(int(DUR * SR))
    tt = t(DUR)
    # nappe : accords Fa mineur 9 / Ré bémol maj 7 / Mi bémol / Do mineur (4 temps chacun)
    chords = [
        (87.31, 174.61, 207.65, 261.63, 392.0),
        (69.30, 138.59, 174.61, 261.63, 349.23),
        (77.78, 155.56, 196.0, 233.08, 311.13),
        (65.41, 130.81, 196.0, 233.08, 311.13),
    ]
    bar = BEAT * 4
    pad = np.zeros_like(tt)
    for bi in range(int(DUR / bar) + 1):
        notes = chords[bi % 4]
        s0 = int(bi * bar * SR)
        n = int(bar * SR) + int(0.4 * SR)
        seg = t(n / SR)
        x = sum(np.sin(2 * np.pi * f * seg + rng.uniform(0, 6)) * (0.5 if f < 100 else 0.22) for f in notes)
        x *= g.env(n, 0.35, 0.45, 1.5)
        e = min(len(pad), s0 + n)
        pad[s0:e] += x[: e - s0]
    pad = g.lowpass(pad, 1400) * 0.5
    pad *= np.clip(tt / 2.5, 0, 1)
    vz.add(buf, pad, 0, 1)
    # arpège + rythmique
    k = 0
    while START + k * BEAT / 2 < END:
        tb = START + k * BEAT / 2  # croches
        dip = DIP0 <= tb < DIP1
        beat_i = k // 2
        notes = chords[int(tb / bar) % 4]
        f = notes[1 + (k % 4)] * 2
        vz.add(buf, pluck(f), tb, 0.10 if dip else 0.16)
        if not dip:
            if k % 2 == 0:
                vz.add(buf, soft_kick(), tb, 0.55)
            else:
                vz.add(buf, vz.hat(), tb, 0.10)
            if k % 4 == 2:
                vz.add(buf, vz.clap(), tb, 0.18)
            if k % 8 == 0:
                vz.add(buf, vz.bass808(notes[0], BEAT * 1.6), tb, 0.35)
        k += 1
    fade = int(1.8 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 300) * 0.85 + buf * 0.15], axis=1)


def ui_click():
    tt = t(0.12)
    x = np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 90) + g.lowpass(rng.standard_normal(len(tt)), 5000) * np.exp(-tt * 200) * 0.3
    return x


def soft_whoosh():
    return g.whoosh(0.7, 300, 2500)


def confirm():
    """Petit son de validation (deux notes)."""
    tt = t(0.6)
    a = np.sin(2 * np.pi * 1046.5 * tt) * np.exp(-tt * 10)
    b = np.sin(2 * np.pi * 1568 * tt) * np.exp(-np.maximum(0, tt - 0.09) * 9) * (tt >= 0.09)
    return g.reverb((a + b) * g.env(len(tt), 0.003, 0.2), 0.3, 0.8)


def logo_hit():
    tt = t(2.5)
    sub = np.sin(2 * np.pi * np.cumsum(40 + 50 * np.exp(-tt * 8)) / SR) * np.exp(-tt * 2.2)
    bell = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, d in ((523.25, 2), (784, 2.5), (1046.5, 3))) * 0.25
    return g.reverb(sub * 0.8 + bell, 0.45, 2.2)


if __name__ == "__main__":
    g.save("b2b_music", music())
    g.save("b2b_click", ui_click())
    g.save("b2b_whoosh", soft_whoosh())
    g.save("b2b_confirm", confirm())
    g.save("b2b_logo", logo_hit())
    print("ok")
