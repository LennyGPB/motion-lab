"""Synthèse des effets sonores du motion SignsPath (numpy uniquement).

Usage : python3 scripts/generate_sfx.py  ->  public/signspath/sfx/*.wav
"""
import os, wave
import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "signspath", "sfx")
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def env(n, a, r, curve=3.0):
    """Enveloppe attaque/relâche (en secondes)."""
    x = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        x[:na] = np.linspace(0, 1, na) ** 2
    if nr:
        x[-nr:] *= np.linspace(1, 0, nr) ** curve
    return x


def lowpass(x, cutoff):
    """Passe-bas 1 pôle, cutoff fixe ou tableau (Hz)."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def bandpass(x, f):
    return lowpass(x, f * 1.6) - lowpass(x, f * 0.6)


def reverb(x, mix=0.3, decay=1.6):
    n = int(decay * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lowpass(ir, 5000)
    wet = np.convolve(x, ir)
    wet = np.concatenate([wet, np.zeros(len(x) + n - len(wet))])
    wet /= np.max(np.abs(wet)) + 1e-9
    dry = np.concatenate([x, np.zeros(n)])
    return dry * (1 - mix) + wet * mix * np.max(np.abs(x))


def stereo(x, width=0.0):
    """Petit élargissement stéréo par décalage."""
    d = int(0.012 * SR * width)
    l = x
    r = np.concatenate([np.zeros(d), x[: len(x) - d]]) if d else x
    return np.stack([l, r], axis=1)


def save(name, x):
    if x.ndim == 1:
        x = stereo(x)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def whoosh(d=0.9, f0=300, f1=4000, rev=False):
    n = len(t(d))
    noise = rng.standard_normal(n)
    sweep = np.geomspace(f0, f1, n)
    if rev:
        sweep = sweep[::-1]
    x = bandpass(noise, sweep)
    shape = np.sin(np.linspace(0, np.pi, n)) ** 2.5
    return reverb(x * shape, 0.25, 0.8)


def impact(d=2.2):
    tt = t(d)
    f = 38 + 70 * np.exp(-tt * 9)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.2)
    click = lowpass(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 40) * 0.6
    air = lowpass(rng.standard_normal(len(tt)), 900) * np.exp(-tt * 4) * 0.25
    return reverb(body + click + air, 0.35, 2.0)


def chime(freq, d=2.4):
    tt = t(d)
    x = np.zeros_like(tt)
    for k, amp, dec in [(1, 1, 2.5), (2.76, 0.45, 4), (5.4, 0.25, 6), (8.9, 0.1, 9)]:
        x += amp * np.sin(2 * np.pi * freq * k * tt) * np.exp(-tt * dec)
    x *= env(len(tt), 0.003, 0.3)
    return reverb(x, 0.4, 2.2)


def tick(freq=2200, d=0.25):
    tt = t(d)
    x = np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 60)
    x += lowpass(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 120) * 0.4
    return reverb(x, 0.2, 0.5)


def riser(d=2.0):
    tt = t(d)
    n = len(tt)
    noise = bandpass(rng.standard_normal(n), np.geomspace(400, 7000, n))
    tone = sum(np.sin(2 * np.pi * np.cumsum(np.geomspace(f, f * 2, n)) / SR) for f in (220, 330, 440)) * 0.15
    shape = np.linspace(0, 1, n) ** 3
    x = (noise + tone) * shape
    x[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
    return x


def shimmer(d=2.5):
    tt = t(d)
    x = np.zeros_like(tt)
    for _ in range(40):
        st = rng.uniform(0, d * 0.6)
        f = rng.choice([1760, 2093, 2349, 2637, 3136, 3520])
        seg = tt >= st
        tl = tt[seg] - st
        x[seg] += np.sin(2 * np.pi * f * tl) * np.exp(-tl * 5) * rng.uniform(0.2, 0.6)
    x *= env(len(tt), 0.2, 1.0)
    return reverb(x, 0.5, 2.5)


def freeze(d=1.6):
    """'Tout s'arrête' : glitch + chute de hauteur, comme une bande qui s'arrête."""
    tt = t(d)
    f = 520 * np.exp(-tt * 2.8) + 30
    saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    x = lowpass(saw, 1800 * np.exp(-tt * 2) + 100) * np.exp(-tt * 1.8)
    glitch = (rng.standard_normal(len(tt)) * (np.sin(2 * np.pi * 18 * tt) > 0.6)) * np.exp(-tt * 6) * 0.3
    return reverb(x + glitch, 0.3, 1.2)


def chaos(d=4.4):
    """Brouhaha nerveux pour 'change everything at once'."""
    tt = t(d)
    x = np.zeros_like(tt)
    for _ in range(26):
        st = rng.uniform(0, d - 0.4)
        f = rng.uniform(300, 1400)
        seg = (tt >= st) & (tt < st + 0.35)
        tl = tt[seg] - st
        x[seg] += np.sin(2 * np.pi * (f + 400 * tl) * tl) * np.exp(-tl * 12) * 0.5
    x += bandpass(rng.standard_normal(len(tt)), 900) * 0.3 * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * tt))
    return reverb(x * env(len(tt), 0.4, 0.15), 0.3, 1.0)


def pad(d):
    """Nappe d'ambiance (accord Ré mineur 9 aéré) avec filtre qui respire."""
    tt = t(d)
    notes = [73.42, 110.0, 146.83, 174.61, 220.0, 329.63]
    x = np.zeros_like(tt)
    for i, f in enumerate(notes):
        for det in (-0.12, 0.0, 0.12):
            ph = rng.uniform(0, 2 * np.pi)
            x += np.sin(2 * np.pi * f * (1 + det / 100) * tt + ph) * (0.5 if i < 2 else 0.3)
    lfo = 0.6 + 0.4 * np.sin(2 * np.pi * 0.08 * tt)
    air = lowpass(rng.standard_normal(len(tt)), 2500) * 0.05
    x = x * lfo + air
    x *= env(len(tt), 2.5, 3.0, 1.5)
    return np.stack([x, np.roll(x, 600)], axis=1)


def sub_pulse(d=1.2):
    tt = t(d)
    x = np.sin(2 * np.pi * 55 * tt) * np.exp(-tt * 3.5) * env(len(tt), 0.01, 0.3)
    return x


if __name__ == "__main__":
    save("whoosh", whoosh())
    save("whoosh_soft", whoosh(0.7, 500, 2500))
    save("whoosh_rev", whoosh(1.1, 300, 5000, rev=True))
    save("impact", impact())
    save("riser", riser())
    save("shimmer", shimmer())
    save("freeze", freeze())
    save("chaos", chaos())
    save("tick", tick())
    save("tick_low", tick(1300))
    save("sub", sub_pulse())
    # 8 cloches sur une gamme pentatonique (une par domaine de vie)
    for i, f in enumerate([523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.5]):
        save(f"chime{i}", chime(f))
    save("pad", pad(30))
    print("ok")
