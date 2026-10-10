# Draws the dusk scene for the plum Garrison section (original line art):
#   dusk-back.svg  a second, taller row of rooftops and trees, behind the
#                  front skyline, for depth
#   dusk-sky.svg   a scattering of tiny stars
#   dusk-moon.svg  a crescent moon
# Run from this folder: python3 make-dusk.py
import math, random
R = random.Random(11)
f = lambda v: f"{v:.1f}".rstrip('0').rstrip('.')

# back row: buildings across exactly 640px so the repeat has no seam
W, H = 640, 150
x, shapes = 0, []
while x < W:
    w = min(R.choice([46, 54, 62, 70, 84, 96]), W - x)
    if W - x - w < 40: w = W - x
    kind = R.choice(["gable", "gable", "terrace", "hip", "tree"]) if w < 100 else "terrace"
    top = H - R.uniform(96, 142)
    if kind == "gable":
        eave = top + w * 0.42
        shapes.append(f"M{f(x)} {H}V{f(eave)}L{f(x + w/2)} {f(top)}L{f(x + w)} {f(eave)}V{H}Z")
        cx = x + w * 0.72
        shapes.append(f"M{f(cx)} {f(eave - w*0.18)}V{f(top + w*0.12)}h7V{f(eave - w*0.05)}Z")
    elif kind == "hip":
        eave = top + 22
        shapes.append(f"M{f(x)} {H}V{f(eave)}L{f(x + 16)} {f(top)}H{f(x + w - 16)}L{f(x + w)} {f(eave)}V{H}Z")
    elif kind == "tree":
        cx = x + w/2; r = w * 0.36
        shapes.append(f"M{f(cx - 2)} {H}V{f(top + r*1.6)}h4V{H}Z")
        for dx, dy, rr in [(0, 0, 1), (-0.55, 0.5, 0.8), (0.55, 0.5, 0.8), (0, 0.8, 0.9)]:
            shapes.append(f"M{f(cx + dx*r - rr*r)} {f(top + r + dy*r)}a{f(rr*r)} {f(rr*r)} 0 1 0 {f(2*rr*r)} 0a{f(rr*r)} {f(rr*r)} 0 1 0 {f(-2*rr*r)} 0Z")
    else:
        shapes.append(f"M{f(x)} {H}V{f(top + 10)}H{f(x + w)}V{H}Z")
        for k in range(1, int(w // 26) + 1):
            sx = x + k * w / (int(w // 26) + 1)
            shapes.append(f"M{f(sx - 4)} {f(top + 10)}V{f(top)}h8V{f(top + 10)}Z")
    x += w
open("dusk-back.svg", "w").write(
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
    f'<path d="{"".join(shapes)}"/></svg>')

# stars: a sparse scatter, thinning out towards the rooftops
SW, SH = 1200, 460
stars = []
for i in range(70):
    sx, sy = R.uniform(0, SW), SH * R.random() ** 1.6
    r = R.choice([0.9, 1.0, 1.2, 1.4, 1.6, 1.9])
    stars.append(f'<circle cx="{f(sx)}" cy="{f(sy)}" r="{r}"/>')
for sx, sy in [(260, 70), (930, 140), (610, 40)]:   # a few four-point twinkles
    stars.append(f'<path d="M{sx} {sy-6}L{sx+1.2} {sy-1.2}L{sx+6} {sy}L{sx+1.2} {sy+1.2}L{sx} {sy+6}L{sx-1.2} {sy+1.2}L{sx-6} {sy}L{sx-1.2} {sy-1.2}Z"/>')
open("dusk-sky.svg", "w").write(
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{SW}" height="{SH}" viewBox="0 0 {SW} {SH}">{"".join(stars)}</svg>')

# crescent moon
open("dusk-moon.svg", "w").write(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">'
    '<path d="M36 6A26 26 0 1 0 36 58A21 26 0 1 1 36 6Z"/></svg>')
