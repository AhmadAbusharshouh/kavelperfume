import os
import sys
import numpy as np
from PIL import Image, ImageFilter
import scipy.ndimage as ndimage
import potrace

def trace_mono():
    diff_img = Image.open('color_diff.png')
    w, h = diff_img.size
    scale = 8
    diff_up = diff_img.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    blurred = diff_up.filter(ImageFilter.GaussianBlur(radius=2.5))
    b_arr = np.array(blurred)

    mask = (b_arr > 55).astype(np.uint8)
    top_limit = int(175 * scale)
    mask_top = mask[:top_limit, :].copy()
    mask_top_filled = np.array(ndimage.binary_fill_holes(mask_top), dtype=np.uint8)
    mask[:top_limit, :] = mask_top_filled

    mono_mask = np.zeros_like(mask, dtype=bool)
    mono_mask[:top_limit, :] = mask[:top_limit, :] > 0

    bm = potrace.Bitmap(mono_mask)
    path = bm.trace(
        turdsize=int(4 * scale),
        alphamax=0.55,
        opttolerance=0.08,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY
    )

    print('Monogram curves count:', len(path.curves))
    svg_paths = []
    for curve in path.curves:
        pts = [curve.start_point] + [s.end_point for s in curve.segments]
        xs = [p.x / scale for p in pts]
        ys = [p.y / scale for p in pts]
        if min(xs) <= 0.5 and max(xs) >= (w - 1.5):
            continue
        start = curve.start_point
        d = [f'M {start.x / scale:.2f} {start.y / scale:.2f}']
        for seg in curve.segments:
            if seg.is_corner:
                c = seg.c
                end = seg.end_point
                d.append(f'L {c.x / scale:.2f} {c.y / scale:.2f} L {end.x / scale:.2f} {end.y / scale:.2f}')
            else:
                c1, c2 = seg.c1, seg.c2
                end = seg.end_point
                d.append(f'C {c1.x / scale:.2f} {c1.y / scale:.2f}, {c2.x / scale:.2f} {c2.y / scale:.2f}, {end.x / scale:.2f} {end.y / scale:.2f}')
        d.append('Z')
        svg_paths.append(' '.join(d))

    path_str = ' '.join(svg_paths)
    mono_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="130 15 155 150" width="300" height="300" shape-rendering="geometricPrecision">
  <path fill="#ba997a" fill-rule="evenodd" d="{path_str}" />
</svg>'''

    with open('public/kavel-monogram.svg', 'w', encoding='utf-8') as f:
        f.write(mono_svg)
    print('Monogram saved to public/kavel-monogram.svg!')

if __name__ == '__main__':
    trace_mono()
