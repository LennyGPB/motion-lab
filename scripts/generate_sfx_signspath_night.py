"""Musique ambiante calme pour le motion SignsPath « night affirmations » (nappe lente, cloches rares)."""

import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "signspath", "night")
SR = g.SR
rng = np.random.default_rng(7)
DUR = 29.5  # doit matcher remotion/signspath7/timing.ts

# Am9 → Fmaj7 → Cadd9 → Gsus2 (accords longs)
CHORDS = [
    [110.0, 164.81, 196.0, 246.94, 261.63],
    [87.31, 130.81, 174.61, 220.0, 329.63],
    [65.41, 130.81, 196.0, 246.94, 293.66],
    [98.0, 146.83, 196.0, 220.0, 293.66],
]


def t(d):
    return np.arange(int(SR * d)) / SR


def pad_chord(freqs, d):
    tt = t(d)
    x = np.zeros_like(tt)
    for f in freqs:
        for det in (-0.6, 0.6):
            ph = rng.uniform(0, 6)
            x += np.sin(2 * np.pi * (f + det) * tt + ph) * 0.5
            x += np.sin(2 * np.pi * 2 * (f + det) * tt + ph) * 0.08
    x /= len(freqs) * 2
    n = len(tt)
    env = np.minimum(1, np.minimum(tt / 2.5, (d - tt) / 2.5)).clip(0, 1) ** 1.5
    return g.lowpass(x * env, 1400) * (0.85 + 0.15 * np.sin(2 * np.pi * tt / 6.0))


def bell(f, d=4.0):
    tt = t(d)
    x = sum(np.sin(2 * np.pi * f * m * tt) * a * np.exp(-tt * (1.2 + m)) for m, a in ((1, 1), (2.01, 0.35), (3.02, 0.15)))
    return g.reverb(x * 0.2 * g.env(len(tt), 0.01, 1.0), 0.5, 2.5)


def music():
    buf = np.zeros(int(DUR * SR))
    seg = 7.5
    k = 0
    st = 0.0
    while st < DUR:
        d = min(seg + 2.5, DUR - st)
        x = pad_chord(CHORDS[k % 4], d)
        i = int(st * SR)
        buf[i : i + len(x)] += x[: len(buf) - i]
        st += seg
        k += 1
    # souffle doux
    air = g.lowpass(rng.standard_normal(len(buf)), 900) * 0.012
    buf += air
    # cloches rares (pentatonique)
    notes = [880.0, 987.77, 1174.66, 1318.51, 1567.98]
    for j, at in enumerate([3.0, 7.9, 12.6, 17.0, 20.4, 24.6]):
        b = bell(notes[j % len(notes)])
        i = int(at * SR)
        buf[i : i + len(b)] += b[: len(buf) - i] * 0.6
    buf = g.reverb(buf, 0.35, 3.0)[: len(buf)]
    fade = int(3 * SR)
    buf[:int(1.5 * SR)] *= np.linspace(0, 1, int(1.5 * SR))
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    buf /= np.max(np.abs(buf)) + 1e-9
    buf *= 0.5
    return np.stack([buf, np.roll(buf, 480) * 0.92 + buf * 0.08], axis=1)


if __name__ == "__main__":
    g.save("music", music())
