# Draws the wallpaper SVGs in this folder (original line art in the spirit of
# the house's own walls). Run from this folder: python3 make-walls.py
# The seamless-repeat copies at the tile edges are added afterwards by
# wrap() at the bottom of this file.
import math, random
R = random.Random(7)
f = lambda v: f"{v:.1f}".rstrip('0').rstrip('.')

# ---------- 1. Chinoiserie mural band (bottom of hero): reeds, herons, blossom, pond ----------
W, H = 1200, 420
parts = []
def blade(x0, y0, ang, length, width):
    # thin lens-shaped leaf from (x0,y0) pointing at angle ang (deg, 0 = up)
    a = math.radians(ang)
    dx, dy = math.sin(a), -math.cos(a)
    nx, ny = -dy, dx
    x2, y2 = x0 + dx*length, y0 + dy*length
    mx, my = x0 + dx*length*0.45, y0 + dy*length*0.45
    c1 = (mx + nx*width, my + ny*width); c2 = (mx - nx*width*0.4, my - ny*width*0.4)
    return f"M{f(x0)} {f(y0)}Q{f(c1[0])} {f(c1[1])} {f(x2)} {f(y2)}Q{f(c2[0])} {f(c2[1])} {f(x0)} {f(y0)}Z"
reeds = []
for i in range(26):
    x = R.uniform(0, W)
    h = R.uniform(120, 330)
    lean = R.uniform(-40, 40)
    reeds.append(f"M{f(x)} {H}Q{f(x+lean*0.3)} {f(H-h*0.55)} {f(x+lean)} {f(H-h)}")
    for k in range(R.randint(2, 4)):
        t = R.uniform(0.25, 0.85)
        bx = x + lean*0.3*t*1.6 if t < 0.55 else x + lean*t
        by = H - h*t
        side = R.choice([-1, 1])
        parts.append(blade(bx, by, side*R.uniform(20, 55) + lean*0.3, R.uniform(40, 90), R.uniform(5, 9)))
reed_path = "".join(reeds)
# blossom sprigs: stem + clusters of small dots
dots = []
stems = []
for i in range(9):
    x = R.uniform(20, W-20); base = H - R.uniform(0, 20)
    top = H - R.uniform(110, 220)
    bend = R.uniform(-30, 30)
    stems.append(f"M{f(x)} {f(base)}Q{f(x+bend)} {f((base+top)/2)} {f(x+bend*0.4)} {f(top)}")
    for c in range(R.randint(2, 4)):
        cx = x + bend*0.4 + R.uniform(-22, 22); cy = top + R.uniform(-10, 40)
        for p in range(5):
            a = p*2*math.pi/5 + R.uniform(0, 1)
            dots.append((cx + math.cos(a)*4.6, cy + math.sin(a)*4.6, 2.1))
        dots.append((cx, cy, 1.4))
# pond dashes
pond = "".join(f"M{f(x)} {f(y)}h{f(R.uniform(12, 40))}" for x, y in [(R.uniform(0, W), R.uniform(H-34, H-6)) for _ in range(30)])
# heron (facing left), drawn in local coords, ~130 x 200
heron = ("M46 90C60 78 94 84 116 106C123 114 129 126 134 140C120 134 106 128 88 124C66 120 48 110 46 90Z")
heron_neck = "M51 90C37 79 55 58 43 44C37 37 34 33 36 26"
heron_head = "M29 25a7.5 5 0 1 0 15 0a7.5 5 0 1 0 -15 0ZM31 22.5L-10 27.5L31 27Z"
heron_crest = "M42 21L62 15M58 104C76 100 98 104 116 116"
heron_legs = "M84 122L80 162L77 200M95 124L98 162L99 200M77 200h-10M77 200l-6 5M99 200h10"
def heron_g(x, y, s, flip):
    t = f"translate({x} {y}) scale({-s if flip else s} {s})"
    return (f'<g transform="{t}"><path d="{heron}{heron_head}"/>'
            f'<path d="{heron_neck}" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/>'
            f'<path d="{heron_crest}{heron_legs}" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round"/></g>')
birds = "".join(f'<path d="M{x} {y}q7 -6 14 0q7 -6 14 0" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round"/>' for x, y in [(330, 70), (360, 52), (860, 90)])
mural = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
         f'<path d="{reed_path}{"".join(stems)}{pond}" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round"/>'
         f'<path d="{"".join(parts)}"/>'
         + "".join(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}"/>' for x, y, r in dots)
         + heron_g(470, 170, 1.15, False) + heron_g(745, 205, 0.95, True) + heron_g(150, 238, 0.8, False)
         + birds + '</svg>')
open('mural.svg', 'w').write(mural)

# ---------- 2. Wisteria fringe (top of hero) ----------
W2, H2 = 600, 170
vine = "M-10 14C90 34 160 4 260 18S440 30 610 10"
clusters = []
leaves = []
for i in range(11):
    x = 10 + i*55 + R.uniform(-12, 12)
    y0 = 14 + 10*math.sin(x/90)
    L = R.uniform(60, 140)
    n = int(L/9)
    for k in range(n):
        t = k/(n-1)
        w = 11*(1-t*0.8)
        for j in range(2 if k < n-2 else 1):
            dx = (j-0.5)*w if k < n-2 else 0
            clusters.append((x + dx + R.uniform(-1.5, 1.5) + 4*math.sin(t*3), y0 + 10 + t*L, 3.0*(1-t*0.55)))
    for s in (-1, 1):
        leaves.append(blade(x, y0+4, s*R.uniform(115, 150), R.uniform(26, 38), 3.4))
wis = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W2}" height="{H2}" viewBox="0 0 {W2} {H2}">'
       f'<path d="{vine}" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round"/>'
       f'<path d="{"".join(leaves)}"/>'
       + "".join(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}"/>' for x, y, r in clusters) + '</svg>')
open('wisteria.svg', 'w').write(wis)

# ---------- 3. Palm fronds (enquiry section), tiled 360 ----------
def frond(x0, y0, x1, y1, cx, cy, n=22, maxlen=70):
    out = [f"M{f(x0)} {f(y0)}Q{f(cx)} {f(cy)} {f(x1)} {f(y1)}"]
    fill = []
    for i in range(2, n):
        t = i/n
        px = (1-t)**2*x0 + 2*(1-t)*t*cx + t*t*x1
        py = (1-t)**2*y0 + 2*(1-t)*t*cy + t*t*y1
        tx = 2*(1-t)*(cx-x0) + 2*t*(x1-cx); ty = 2*(1-t)*(cy-y0) + 2*t*(y1-cy)
        ang = math.degrees(math.atan2(tx, -ty))
        ln = maxlen*math.sin(math.pi*min(1, t*1.15))*0.95 + 8
        for s in (-1, 1):
            fill.append(blade(px, py, ang + s*48, ln, 3.2))
    return out, fill
stroke, fill = [], []
for args in [(20, 340, 230, 60, 70, 150), (250, 360, 340, 170, 330, 300), (120, 20, 300, -30, 210, 40)]:
    a, b = frond(*args); stroke += a; fill += b
palm = (f'<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360">'
        f'<path d="{"".join(stroke)}" fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round"/>'
        f'<path d="{"".join(fill)}"/></svg>')
open('palm.svg', 'w').write(palm)

# ---------- 4. Star-and-cross tile (details section), 80 ----------
def octagram(cx, cy, Ro):
    ri = Ro*math.cos(math.pi/4)/math.cos(math.pi/8)
    pts = []
    for k in range(16):
        r = Ro if k % 2 == 0 else ri
        a = k*math.pi/8
        pts.append(f"{f(cx + r*math.cos(a))} {f(cy + r*math.sin(a))}")
    return "M" + "L".join(pts) + "Z"
star = (f'<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#000" stroke-width="1.2" stroke-linejoin="round">'
        f'<path d="{octagram(40, 40, 40)}{octagram(40, 40, 22)}"/>'
        f'<path d="{octagram(0, 0, 40)}{octagram(80, 0, 40)}{octagram(0, 80, 40)}{octagram(80, 80, 40)}"/>'
        '</svg>')
open('stars.svg', 'w').write(star)


# Repeat each drawing at +/- one tile, so whatever crosses an edge carries
# on into the next tile and the pattern has no seams.
def wrap(fn, xy):
    t = open(fn).read()
    head = t[:t.index('>') + 1]; body = t[t.index('>') + 1:t.rindex('</svg>')]
    open(fn, 'w').write(head + "".join(body if (dx, dy) == (0, 0) else f'<g transform="translate({dx} {dy})">{body}</g>' for dx, dy in xy) + '</svg>')
wrap('mural.svg', [(-1200, 0), (0, 0), (1200, 0)])
wrap('wisteria.svg', [(-600, 0), (0, 0), (600, 0)])
wrap('palm.svg', [(dx, dy) for dx in (-360, 0, 360) for dy in (-360, 0, 360)])
