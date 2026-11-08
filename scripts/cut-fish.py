"""Cut Media/parallax/fish.png into one sprite per fish, packed into an atlas.

The hero's fish used to be a single flat plate, so they could only slide as
one sheet. This splits it so FishSchool can swim each fish on its own.

    python3 scripts/cut-fish.py

Writes public/parallax/fish-atlas-v3.webp and src/components/fishSprites.ts.
/parallax/* is cached immutably, so bump the -vN suffix if the output changes.
"""
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Media/parallax/fish.png"
ATLAS = ROOT / "public/parallax/fish-atlas-v3.webp"
TS = ROOT / "src/components/fishSprites.ts"

ALPHA_FLOOR = 48  # the plate carries a faint coloured haze around every fish
MIN_AREA = 120    # specks smaller than this are keying debris, not fish
PAD = 3
ATLAS_W = 1024

# Sprites are picked out by their centre in plate px (within MATCH px), so
# these lists survive a change to how components are labelled or ordered.
MATCH = 12

# Fish that face left in the plate. FishSchool swims these right → left, so
# every fish travels head-first.
FACING_LEFT = [
    (309, 90), (347, 206),  # anthias
    (938, 765),  # moorish idol
    (1559, 783),  # clownfish
]

# Sprites that are not a clean single fish: keying debris, motion-blurred
# blobs, and two fish fused into one component.
DROP = [
    (475, 261), (623, 592), (554, 601), (1073, 647),  # debris / blobs
    (1532, 693), (233, 777),  # two fish fused together
    # Out of focus in the photo: a smeared body, washed-out belly, no sharp
    # eye. Swimming across the reef at full size they read as defects.
    (344, 161), (1269, 178), (619, 243), (566, 253), (558, 313), (1360, 310),
    (435, 317), (518, 350), (1456, 350), (1415, 365), (325, 373), (549, 387),
    (478, 409), (195, 412), (177, 451), (623, 471), (987, 486), (628, 511),
    (999, 524), (1086, 523), (590, 529), (674, 529), (383, 547), (55, 625),
    (283, 699), (211, 700), (341, 759), (1260, 794), (659, 798), (1515, 844),
    (650, 850),
]

# Many anthias are photographed nosing up or down; swimming dead level they
# read as sliding sideways. Level any elongated fish to within MAX_TILT deg.
MAX_TILT = 5
MIN_ELONGATION = 1.5  # deep-bodied fish (butterflyfish, idol) have no clear axis


def near(cx, cy, points):
    return any(abs(cx - fx) <= MATCH and abs(cy - fy) <= MATCH for fx, fy in points)


def level(crop):
    """Rotate a sprite so its body axis is (nearly) horizontal."""
    ys, xs = np.nonzero(crop[:, :, 3] > 128)
    if len(xs) < 20:
        return crop
    evals, evecs = np.linalg.eigh(np.cov(np.vstack([xs, ys])))
    if np.sqrt(evals[1] / max(evals[0], 1e-6)) < MIN_ELONGATION:
        return crop
    vx, vy = evecs[:, 1]
    tilt = np.degrees(np.arctan2(vy, vx))
    tilt = (tilt + 90) % 180 - 90  # the axis has no direction: fold to ±90
    turn = tilt - np.clip(tilt, -MAX_TILT, MAX_TILT)
    if abs(turn) < 1:
        return crop
    h, w = crop.shape[:2]
    m = cv2.getRotationMatrix2D((w / 2, h / 2), turn, 1)
    cos, sin = abs(m[0, 0]), abs(m[0, 1])
    nw, nh = int(w * cos + h * sin) + 2, int(w * sin + h * cos) + 2
    m[0, 2] += nw / 2 - w / 2
    m[1, 2] += nh / 2 - h / 2
    out = cv2.warpAffine(crop, m, (nw, nh), flags=cv2.INTER_CUBIC,
                         borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
    ys, xs = np.nonzero(out[:, :, 3] > 0)
    return out[max(ys.min() - PAD, 0) : ys.max() + PAD + 1,
               max(xs.min() - PAD, 0) : xs.max() + PAD + 1]


img = cv2.imread(str(SRC), cv2.IMREAD_UNCHANGED)
if img is None or img.shape[2] != 4:
    sys.exit(f"{SRC} must be an RGBA png")
alpha = img[:, :, 3].copy()
alpha[alpha < ALPHA_FLOOR] = 0
img[:, :, 3] = alpha

# Dilate before labelling so a fin that is only joined by a thin, faint strip
# stays with its own fish instead of becoming a separate sprite.
mask = cv2.dilate((alpha > 0).astype(np.uint8), np.ones((7, 7), np.uint8))
n, labels, stats, _ = cv2.connectedComponentsWithStats(mask)

sprites = []
for i in range(1, n):
    x, y, w, h, area = stats[i]
    if area < MIN_AREA:
        continue
    x0, y0 = max(x - PAD, 0), max(y - PAD, 0)
    x1, y1 = min(x + w + PAD, img.shape[1]), min(y + h + PAD, img.shape[0])
    crop = img[y0:y1, x0:x1].copy()
    # Only this component's pixels: a neighbour poking into the bbox must not
    # ride along with this fish.
    crop[labels[y0:y1, x0:x1] != i, 3] = 0
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    if near(cx, cy, DROP):
        continue
    crop = level(crop)
    h, w = crop.shape[:2]
    # Keep the plate position as the sprite's top-left around the same centre.
    sprites.append([int(cx - w // 2), int(cy - h // 2), crop, near(cx, cy, FACING_LEFT)])

# Shelf-pack, tallest first.
order = sorted(range(len(sprites)), key=lambda k: -sprites[k][2].shape[0])
cx = cy = shelf = 0
placed = {}
for k in order:
    h, w = sprites[k][2].shape[:2]
    if cx + w > ATLAS_W:
        cx, cy, shelf = 0, cy + shelf + 2, 0
    placed[k] = (cx, cy)
    cx += w + 2
    shelf = max(shelf, h)
atlas = np.zeros((cy + shelf, ATLAS_W, 4), np.uint8)
for k, (ax, ay) in placed.items():
    c = sprites[k][2]
    atlas[ay : ay + c.shape[0], ax : ax + c.shape[1]] = c


tmp = ATLAS.with_suffix(".png")
cv2.imwrite(str(tmp), atlas)
subprocess.run(
    ["cwebp", "-quiet", "-q", "90", "-alpha_q", "90", str(tmp), "-o", str(ATLAS)],
    check=True,
)
tmp.unlink()

rows = []
for k, (x, y, c, left) in enumerate(sprites):
    h, w = c.shape[:2]
    ax, ay = placed[k]
    rows.append(f"  [{x}, {y}, {w}, {h}, {ax}, {ay}, {int(left)}],")
TS.write_text(
    "// Generated by scripts/cut-fish.py — do not edit by hand.\n"
    "// [plateX, plateY, w, h, atlasX, atlasY, facesLeft] in source px.\n"
    f"export const PLATE = {{ w: {img.shape[1]}, h: {img.shape[0]} }};\n"
    f"export const ATLAS = {{ src: \"/parallax/{ATLAS.name}\", w: {ATLAS_W}, h: {atlas.shape[0]} }};\n"
    "export const FISH: [number, number, number, number, number, number, number][] = [\n"
    + "\n".join(rows)
    + "\n];\n"
)
print(f"{len(sprites)} sprites -> {ATLAS.relative_to(ROOT)} ({ATLAS_W}x{atlas.shape[0]})")
