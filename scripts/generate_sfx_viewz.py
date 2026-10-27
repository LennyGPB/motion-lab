"""Musique + effets sonores du motion ViewZ (numpy uniquement).

Usage : python3 scripts/generate_sfx_viewz.py  ->  public/viewz/sfx/*.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import generate_sfx as g  # noqa: E402  (réutilise les briques de synthèse)

g.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "viewz", "sfx")
SR = g.SR
rng = np.random.default_rng(11)

VO = 0.3  # décalage de la voix dans la vidéo (doit matcher remotion/viewz/timing.ts)
DUR = 17.5
BPM = 112
BEAT = 60 / BPM


def t(d):
    return np.arange(int(SR * d)) / SR


# ---------- briques batterie ----------
def kick(d=0.5, punch=1.0):
    tt = t(d)
    f = 45 + 160 * np.exp(-tt * 28)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7)
    x += g.lowpass(rng.standard_normal(len(tt)), 4000) * np.exp(-tt * 120) * 0.35 * punch
    return np.tanh(x * 1.6)


def clap(d=0.4):
    tt = t(d)
    n = rng.standard_normal(len(tt))
    env = np.zeros_like(tt)
    for o in (0, 0.011, 0.022):
        m = tt >= o
        env[m] += np.exp(-(tt[m] - o) * (60 if o < 0.02 else 18))
    return g.bandpass(n, 1500) * env * 1.4


def hat(d=0.08, open_=False):
    tt = t(0.3 if open_ else d)
    n = rng.standard_normal(len(tt))
    hp = n - g.lowpass(n, 7000)
    return hp * np.exp(-tt * (12 if open_ else 70))


def bass808(freq, d=0.6):
    tt = t(d)
    f = freq * (1 + 0.5 * np.exp(-tt * 40))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.5) * g.env(len(tt), 0.004, 0.08)
    return np.tanh(x * 2.2) * 0.8


def add(buf, x, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i] * gain


def music():
    buf = np.zeros(int(DUR * SR))
    start = 1.25 + VO  # "On a créé l'app" : la prod démarre
    brk0, brk1 = 10.25 + VO, 11.2 + VO  # break autour du logo
    end = 16.3
    # intro : nappe sombre + charley filtré
    tt = t(start)
    drone = sum(np.sin(2 * np.pi * f * tt) for f in (43.65, 87.3, 130.8)) * 0.15
    drone *= np.linspace(0, 1, len(tt)) ** 2
    add(buf, drone, 0, 1)
    # motif basse (Fa mineur) par mesure de 4 temps
    notes = [43.65, 43.65, 51.91, 38.89]
    beat_t = start
    k = 0
    while beat_t < end:
        in_break = brk0 <= beat_t < brk1
        bar_pos = k % 4
        if not in_break:
            if bar_pos in (0, 2):
                add(buf, kick(), beat_t, 0.9)
            if bar_pos == 2:
                add(buf, kick(punch=0.5), beat_t + BEAT * 0.75, 0.55)
            if bar_pos in (1, 3):
                add(buf, clap(), beat_t, 0.55)
            # charleston en croches, roulement en doubles sur le 4e temps
            subs = 4 if bar_pos == 3 and (k // 4) % 2 == 1 else 2
            for s in range(subs):
                add(buf, hat(), beat_t + s * BEAT / subs, 0.22 if s % 2 == 0 else 0.14)
            if bar_pos == 0:
                add(buf, bass808(notes[(k // 4) % 4], BEAT * 1.8), beat_t, 0.7)
        k += 1
        beat_t = start + k * BEAT
    # accords en nappe (douce) pendant la prod
    pt = t(end - start)
    chord = sum(np.sin(2 * np.pi * f * pt + rng.uniform(0, 6)) for f in (174.6, 207.7, 261.6, 311.1)) * 0.05
    chord *= 0.6 + 0.4 * np.sin(2 * np.pi * pt / (BEAT * 2)) ** 2
    chord = g.lowpass(chord, 1200)
    gate = np.ones_like(pt)
    gate[int((brk0 - start) * SR) : int((brk1 - start) * SR)] = 0.25
    add(buf, chord * gate, start, 1)
    # fondu de fin
    fade = int(1.4 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade) ** 2
    st = np.stack([buf, np.roll(buf, 240) * 0.9 + buf * 0.1], axis=1)
    return st


# ---------- effets ----------
def slam():
    tt = t(1.6)
    body = kick(1.6, punch=1.5)
    noise = g.lowpass(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 9) * 0.6
    return g.reverb(body + noise, 0.35, 1.4)


def glitch():
    tt = t(0.45)
    x = np.zeros_like(tt)
    seg = int(0.025 * SR)
    for i in range(0, len(tt), seg):
        f = rng.choice([220, 440, 880, 1760, 3520])
        kind = rng.integers(0, 3)
        s = tt[i : i + seg]
        if kind == 0:
            x[i : i + seg] = np.sign(np.sin(2 * np.pi * f * s)) * 0.5
        elif kind == 1:
            x[i : i + seg] = rng.standard_normal(len(s)) * 0.6
        # kind 2 : silence
    return g.lowpass(x, 9000) * g.env(len(tt), 0.002, 0.05)


def swipe():
    return g.whoosh(0.45, 900, 6000)


def pop(f0=600):
    tt = t(0.25)
    f = f0 * (1 + 1.2 * (1 - np.exp(-tt * 40)))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 22)
    return g.reverb(x, 0.2, 0.4)


def bubble():
    tt = t(0.35)
    x = np.sin(2 * np.pi * 880 * tt) * np.exp(-tt * 18) * (tt < 0.09)
    x2 = np.sin(2 * np.pi * 1320 * tt) * np.exp(-(tt - 0.08) * 16) * (tt >= 0.08)
    return g.reverb(x + x2, 0.25, 0.5)


def scan():
    tt = t(1.4)
    n = len(tt)
    x = g.bandpass(rng.standard_normal(n), np.geomspace(300, 3000, n)) * 0.6
    x += np.sin(2 * np.pi * np.cumsum(np.geomspace(200, 900, n)) / SR) * 0.25
    return x * np.sin(np.linspace(0, np.pi, n)) ** 1.5


def drop_hit():
    """Gros impact du logo : sub + crash filtré + reverb longue."""
    tt = t(3.0)
    sub = np.sin(2 * np.pi * np.cumsum(30 + 90 * np.exp(-tt * 6)) / SR) * np.exp(-tt * 1.3)
    crash = (rng.standard_normal(len(tt)) - g.lowpass(rng.standard_normal(len(tt)), 3000)) * np.exp(-tt * 2.5) * 0.4
    return g.reverb(np.tanh((sub + crash) * 1.5), 0.4, 2.5)


def tape_stop():
    tt = t(0.6)
    f = 300 * np.exp(-tt * 6)
    saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    return g.lowpass(saw, 1500) * np.exp(-tt * 3)


if __name__ == "__main__":
    g.save("music", music())
    g.save("slam", slam())
    g.save("glitch", glitch())
    g.save("swipe", swipe())
    g.save("whoosh", g.whoosh(0.8, 250, 5000))
    g.save("riser", g.riser(1.6))
    g.save("pop", pop())
    g.save("pop_hi", pop(900))
    g.save("bubble", bubble())
    g.save("ping", g.chime(1568, 1.6))
    g.save("scan", scan())
    g.save("drop", drop_hit())
    g.save("tape_stop", tape_stop())
    g.save("shimmer", g.shimmer(2.0))
    print("ok")
