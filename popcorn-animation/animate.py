"""Animate popcorn.png: kernels burst out of the bucket in a seamless loop.

Usage: python3 animate.py   (needs pillow, numpy, scipy, imageio-ffmpeg)
Outputs popcorn.mp4, popcorn.gif and popcorn-transparent.webm next to this file.
"""
import math
import os
import random
import subprocess

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
SIZE = 1080
FPS = 30
LOOP = 120  # frames; the animation loops seamlessly every 4 seconds
OFFSET = (40, 110)  # where the 1000x1000 source sits on the canvas
GRAVITY = 0.55

src = np.array(Image.open(os.path.join(HERE, "popcorn.png")).convert("RGBA"))
labels, _ = ndimage.label(src[..., 3] > 20)
sizes = ndimage.sum(np.ones_like(labels), labels, range(labels.max() + 1))
bucket_label = int(np.argmax(sizes[1:]) + 1)

# The bucket (with its heap of popcorn) is the big blob; every small blob is a loose kernel.
bucket_arr = src.copy()
bucket_arr[labels != bucket_label] = 0
bucket = Image.fromarray(bucket_arr)
kernels = []
for i, sl in enumerate(ndimage.find_objects(labels), 1):
    if i == bucket_label or (labels[sl] == i).sum() < 200:
        continue
    k = src[sl].copy()
    k[labels[sl] != i] = 0
    kernels.append(Image.fromarray(k))

# Pivot for the bucket's squash/wobble: bottom centre of the bucket.
PIVOT = (OFFSET[0] + 470, OFFSET[1] + 890)

rng = random.Random(7)
particles = []
BURSTS = [0, 30, 60, 90]
for b in BURSTS:
    for _ in range(11):
        particles.append(b + rng.uniform(0, 8))
for _ in range(14):
    particles.append(rng.uniform(0, LOOP))
particles = [
    dict(
        birth=t,
        x=rng.uniform(340, 700),
        y=rng.uniform(300, 340),
        vx=rng.uniform(-3.5, 7.0),
        vy=-rng.uniform(13, 21),
        spin=rng.uniform(-9, 9),
        rot=rng.uniform(0, 360),
        scale=rng.uniform(0.75, 1.2),
        sprite=rng.randrange(len(kernels)),
    )
    for t in particles
]


def burst_strength(f):
    """0..1 kick that peaks right as a burst fires, then decays."""
    s = 0.0
    for b in BURSTS:
        d = (f - b) % LOOP
        s = max(s, math.exp(-d / 5.0) if d < 25 else 0.0)
    return s


def render_bucket(frame, f):
    k = burst_strength(f)
    sy = 1 - 0.035 * k * math.cos(k * math.pi)  # squash then rebound
    sx = 1 + 0.02 * k
    ang = 1.8 * k * math.sin(f * 0.9) + 0.6 * math.sin(2 * math.pi * f / LOOP)
    w, h = bucket.size
    img = bucket.resize((round(w * sx), round(h * sy)), Image.LANCZOS)
    px = PIVOT[0] - OFFSET[0]
    py = PIVOT[1] - OFFSET[1]
    pos = (round(PIVOT[0] - px * sx), round(PIVOT[1] - py * sy))
    layer = Image.new("RGBA", (SIZE, SIZE))
    layer.alpha_composite(img, pos)
    layer = layer.rotate(ang, resample=Image.BICUBIC, center=PIVOT)
    frame.alpha_composite(layer)


def render_particles(frame, f):
    for p in particles:
        age = (f - p["birth"]) % LOOP
        x = OFFSET[0] + p["x"] + p["vx"] * age
        y = OFFSET[1] + p["y"] + p["vy"] * age + 0.5 * GRAVITY * age * age
        if y > SIZE + 80 or x < -80 or x > SIZE + 80:
            continue
        pop = min(1.0, age / 5.0)  # kernels "pop" in from small
        s = p["scale"] * (0.35 + 0.65 * pop)
        spr = kernels[p["sprite"]]
        spr = spr.resize((max(1, round(spr.width * s)), max(1, round(spr.height * s))), Image.LANCZOS)
        spr = spr.rotate(p["rot"] + p["spin"] * age, resample=Image.BICUBIC, expand=True)
        if pop < 1:
            a = np.array(spr)
            a[..., 3] = (a[..., 3] * pop).astype(np.uint8)
            spr = Image.fromarray(a)
        frame.alpha_composite(spr, (round(x - spr.width / 2), round(y - spr.height / 2)))


def background():
    yy, xx = np.mgrid[0:SIZE, 0:SIZE]
    d = np.hypot(xx - SIZE / 2, yy - SIZE * 0.45) / (SIZE * 0.75)
    inner, outer = np.array([255, 246, 232]), np.array([246, 214, 190])
    rgb = inner + (outer - inner) * np.clip(d, 0, 1)[..., None]
    bg = Image.fromarray(np.dstack([rgb, np.full((SIZE, SIZE), 255)]).astype(np.uint8), "RGBA")
    shadow = Image.new("RGBA", (SIZE, SIZE))
    ImageDraw.Draw(shadow).ellipse((330, 985, 740, 1035), fill=(120, 40, 30, 90))
    bg.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(18)))
    return bg


def ffmpeg(args):
    return subprocess.Popen(
        [imageio_ffmpeg.get_ffmpeg_exe(), "-y", "-loglevel", "error", "-f", "rawvideo",
         "-pix_fmt", "rgba", "-s", f"{SIZE}x{SIZE}", "-r", str(FPS), "-i", "-"] + args,
        stdin=subprocess.PIPE,
    )


def main():
    bg = background()
    mp4 = ffmpeg(["-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
                  "-movflags", "+faststart", os.path.join(HERE, "popcorn.mp4")])
    webm = ffmpeg(["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "30",
                   "-auto-alt-ref", "0", os.path.join(HERE, "popcorn-transparent.webm")])
    gif_frames = []
    for f in range(LOOP * 2):  # two loops per file
        fg = Image.new("RGBA", (SIZE, SIZE))
        render_bucket(fg, f)
        render_particles(fg, f)
        full = bg.copy()
        full.alpha_composite(fg)
        mp4.stdin.write(full.tobytes())
        webm.stdin.write(fg.tobytes())
        if f < LOOP and f % 2 == 0:
            gif_frames.append(full.convert("RGB").resize((540, 540), Image.LANCZOS))
    for p in (mp4, webm):
        p.stdin.close()
        p.wait()
    gif_frames[0].save(os.path.join(HERE, "popcorn.gif"), save_all=True,
                       append_images=gif_frames[1:], duration=1000 * 2 // FPS, loop=0)


if __name__ == "__main__":
    main()
