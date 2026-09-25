import os
import sys
import numpy as np
from PIL import Image, ImageFilter, ImageOps
import scipy.ndimage as ndimage
import potrace

def run():
    img = Image.open('crop_all.png').convert('RGB')
    arr = np.array(img, dtype=np.float32)
    
    # Calculate background color from edges
    bg_color = np.array([177.2, 145.4, 112.4])
    diff = np.sqrt(np.sum((arr - bg_color)**2, axis=2))
    
    # Upscale 4x with Lanczos for subpixel curve fitting
    w, h = img.size
    scale = 4
    diff_im = Image.fromarray((np.clip(diff / np.percentile(diff, 98) * 255, 0, 255)).astype(np.uint8))
    diff_up = diff_im.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    
    # Gentle smoothing for clean spline edges
    blurred = diff_up.filter(ImageFilter.GaussianBlur(radius=1.8))
    b_arr = np.array(blurred)
    
    mask = (b_arr > 50).astype(np.uint8)
    
    # Fill holes in the top monogram region
    top_limit = int(175 * scale)
    mask_top = mask[:top_limit, :].copy()
    mask_top_filled = np.array(ndimage.binary_fill_holes(mask_top), dtype=np.uint8)
    mask[:top_limit, :] = mask_top_filled
    
    # Label and filter small speckles
    labeled, num_features = ndimage.label(mask)
    sizes = ndimage.sum(mask, labeled, list(range(num_features + 1)))
    for i, s in enumerate(sizes):
        if s < 10 * (scale ** 2):
            mask[labeled == i] = 0
            
    # Trace with Potrace
    bm = potrace.Bitmap(mask)
    path = bm.trace(
        turdsize=int(4 * scale),
        alphamax=0.55,
        opttolerance=0.1,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY
    )
    
    svg_paths = []
    for curve in path.curves:
        pts = [curve.start_point] + [s.end_point for s in curve.segments]
        xs = [p.x / scale for p in pts]
        ys = [p.y / scale for p in pts]
        
        if min(xs) == 0.0 and max(xs) >= (w - 1.0) and min(ys) == 0.0 and max(ys) >= (h - 1.0):
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
        
    svg_code = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="100%" height="100%" shape-rendering="geometricPrecision">
  <path fill="#ba997a" fill-rule="evenodd" d="{' '.join(svg_paths)}" />
</svg>'''

    with open('public/kavel-logo-traced.svg', 'w', encoding='utf-8') as f:
        f.write(svg_code)
    print('Traced SVG saved to public/kavel-logo-traced.svg')

if __name__ == '__main__':
    run()
