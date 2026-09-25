import os
import sys
import numpy as np
from PIL import Image, ImageFilter
import scipy.ndimage as ndimage
import potrace

def trace():
    diff_img = Image.open('color_diff.png')
    w, h = diff_img.size
    scale = 4
    diff_up = diff_img.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    blurred = diff_up.filter(ImageFilter.GaussianBlur(radius=2.0))
    b_arr = np.array(blurred)

    # Foreground threshold
    mask = (b_arr > 55).astype(np.uint8)
    
    # Fill any reflection holes in the top monogram region (y < 175*scale)
    top_limit = int(175 * scale)
    mask_top = mask[:top_limit, :].copy()
    mask_top_filled = np.array(ndimage.binary_fill_holes(mask_top), dtype=np.uint8)
    mask[:top_limit, :] = mask_top_filled

    # Border clear
    mask[:8, :] = 0
    mask[-8:, :] = 0
    mask[:, :8] = 0
    mask[:, -8:] = 0

    # Filter out tiny connected components
    labeled, num_features = ndimage.label(mask)
    sizes = ndimage.sum(mask, labeled, list(range(num_features + 1)))
    for i, s in enumerate(sizes):
        if s < 12 * (scale ** 2):
            mask[labeled == i] = 0

    bool_mask = mask.astype(bool)
    bm = potrace.Bitmap(bool_mask)
    path = bm.trace(
        turdsize=int(4 * scale),
        alphamax=0.55,
        opttolerance=0.1,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY
    )

    print('Filtered curves count:', len(path.curves))
    svg_paths = []
    for curve in path.curves:
        pts = [curve.start_point] + [s.end_point for s in curve.segments]
        xs = [p.x / scale for p in pts]
        ys = [p.y / scale for p in pts]
        
        # Skip if canvas edge artifact
        if min(xs) <= 0.5 and max(xs) >= (w - 1.5) and min(ys) <= 0.5 and max(ys) >= (h - 1.5):
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
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="100%" height="100%" shape-rendering="geometricPrecision">
  <path fill="#ba997a" fill-rule="evenodd" d="{path_str}" />
</svg>'''

    with open('public/kavel-logo-potrace.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print('Saved public/kavel-logo-potrace.svg!')

if __name__ == '__main__':
    trace()
