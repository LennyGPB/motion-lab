"""Musique + effets du motion "Le site qui se construit" (numpy uniquement).

Usage : python3 scripts/generate_sfx_webbuild.py  ->  public/webbuild/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402
import generate_sfx_viewz as vz  # noqa: E402

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "webbuild", "sfx")
SR = g.SR
rng = np.random.default_rng(97)

DUR = 17.0  # doit matcher remotion/webbuild/timing.ts
BEAT = 60 / 110
CLICK = 10.0  # clic sur "Get started"
END = 12.0  # carte de fin


def t(d):
    return np.arange(int(SR * d)) / SR


def key(pitch=1.0):
    tt = t(0.06)
    x = g.lowpass(rng.standard_normal(len(tt)), 6000 * pitch) * np.exp(-tt * 140)
    x += np.sin(2 * np.pi * 1800 * pitch * tt) * np.exp(-tt * 200) * 0.3
    return x


def typing(d=4.0):
    """Frappe clavier continue (irrégulière)."""
    buf = np.zeros(int(d * SR))
    tt = 0.0
    while tt < d - 0.1:
        k = key(rng.uniform(0.8, 1.25)) * rng.uniform(0.5, 1.0)
        i = int(tt * SR)
        buf[i : i + len(k)] += k[: len(buf) - i]
        tt += rng.uniform(0.045, 0.11)
    return buf * 0.8


def pluck(freq, d=0.4):
    tt = t(d)
    x = (np.sin(2 * np.pi * freq * tt) + 0.35 * np.sin(2 * np.pi * freq * 2 * tt)) * np.exp(-tt * 9)
    return g.lowpass(x * g.env(len(tt), 0.003, 0.08), 4000)


def music():
    buf = np.zeros(int(DUR * SR))
    chords = [(146.83, 220.0, 293.66, 369.99), (123.47, 196.0, 246.94, 293.66), (110.0, 164.81, 220.0, 277.18), (130.81, 196.0, 261.63, 329.63)]
    bar = BEAT * 4
    tt = t(DUR)
    pad = np.zeros_like(tt)
    for i in range(int(DUR / bar) + 1):
        notes = chords[i % 4]
        s0 = int(i * bar * SR)
        n = int((bar + 0.4) * SR)
        x = sum(np.sin(2 * np.pi * f * (np.arange(n) / SR) + rng.uniform(0, 6)) * (0.3 if f < 150 else 0.12) for f in notes) * g.env(n, 0.3, 0.4, 1.5)
        e = min(len(pad), s0 + n)
        pad[s0:e] += x[: e - s0]
    vz.add(buf, g.lowpass(pad, 2200) * 0.4 * np.clip(tt / 1.0, 0, 1), 0, 1)
    k = 0
    while k * BEAT / 2 < END:
        tb = k * BEAT / 2
        notes = chords[int(tb / bar) % 4]
        vz.add(buf, pluck(notes[1 + k % 3] * 2), tb, 0.08)
        if k % 2 == 0:
            vz.add(buf, vz.kick(0.35, punch=0.4), tb, 0.42)
        else:
            vz.add(buf, vz.hat(0.05), tb, 0.1)
        if k % 4 == 2:
            vz.add(buf, vz.clap(), tb, 0.16)
        k += 1
    vz.add(buf, g.riser(1.2) * 0.4, CLICK - 1.2, 0.4)
    vz.add(buf, vz.kick(1.2, punch=1.1), END, 0.6)
    ft = t(DUR - END)
    fin = sum(np.sin(2 * np.pi * f * ft) for f in (146.83, 293.66, 369.99, 440.0, 587.33)) * 0.1 * np.exp(-ft * 0.6)
    vz.add(buf, g.lowpass(fin, 3000), END, 1)
    fade = int(1.2 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    return np.stack([buf, np.roll(buf, 230) * 0.85 + buf * 0.15], axis=1)


def mouse_click():
    tt = t(0.12)
    a = g.lowpass(rng.standard_normal(len(tt)), 5000) * np.exp(-tt * 260)
    b = np.zeros_like(tt)
    m = tt >= 0.05
    b[m] = g.lowpass(rng.standard_normal(m.sum()), 4000) * np.exp(-(tt[m] - 0.05) * 300) * 0.7
    return a + b


def success():
    tt = t(1.4)
    x = np.zeros_like(tt)
    for i, f in enumerate((659.25, 830.61, 987.77, 1318.51)):
        o = i * 0.06
        m = tt >= o
        x[m] += np.sin(2 * np.pi * f * (tt[m] - o)) * np.exp(-(tt[m] - o) * 5)
    return g.reverb(x * g.env(len(tt), 0.002, 0.3), 0.35, 1.2)


if __name__ == "__main__":
    g.save("music", music())
    g.save("typing", typing())
    g.save("pop", vz.pop(650))
    g.save("click", mouse_click())
    g.save("success", success())
    g.save("whoosh", g.whoosh(0.7, 300, 5000))
    g.save("swish", g.whoosh(0.4, 900, 6000))
    print("ok")
