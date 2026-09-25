import numpy as np
from PIL import Image
import scipy.ndimage as ndimage
from scipy.interpolate import splprep, splev
import potrace

def generate_super_smooth_monogram():
    diff_img = Image.open('color_diff.png')
    w, h = diff_img.size
    scale = 8
    diff_up = diff_img.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    arr = np.array(diff_up)
    mask = arr > 50
    top_limit = int(175 * scale)
    mono = mask[:top_limit, :]
    mono = ndimage.binary_fill_holes(mono)

    # Disk morphological filter
    y, x = np.ogrid[-4:5, -4:5]
    disk = x*x + y*y <= 16
    mono_smooth = ndimage.binary_opening(mono, structure=disk)
    mono_smooth = ndimage.binary_closing(mono_smooth, structure=disk)

    dist_in = ndimage.distance_transform_edt(mono_smooth)
    dist_out = ndimage.distance_transform_edt(~mono_smooth)
    sdf = dist_in - dist_out
    sdf_blur = ndimage.gaussian_filter(sdf, sigma=3.8)
    mono_vector_ready = sdf_blur > 0.0

    bm = potrace.Bitmap(mono_vector_ready)
    path = bm.trace(
        turdsize=int(40 * scale),
        alphamax=0.8,
        opttolerance=0.25,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY
    )

    valid_curves = []
    for c in path.curves:
        pts = [c.start_point] + [s.end_point for s in c.segments]
        xs = [p.x / scale for p in pts]
        ys = [p.y / scale for p in pts]
        if min(xs) <= 0.5 and max(xs) >= (w - 1.5):
            continue
        if (max(xs) - min(xs)) > 20 and (max(ys) - min(ys)) > 40:
            valid_curves.append(c)

    svg_paths = []
    for curve in valid_curves:
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
    all_pts = []
    for c in valid_curves:
        all_pts.extend([c.start_point] + [s.end_point for s in c.segments])
    min_x = min(p.x / scale for p in all_pts)
    max_x = max(p.x / scale for p in all_pts)
    min_y = min(p.y / scale for p in all_pts)
    max_y = max(p.y / scale for p in all_pts)

    # Let's create an elegant normalized viewBox: 0 0 160 160
    # and center the monogram inside it
    pad = 8
    vb_x = min_x - pad
    vb_y = min_y - pad
    vb_w = (max_x - min_x) + 2 * pad
    vb_h = (max_y - min_y) + 2 * pad

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb_x:.2f} {vb_y:.2f} {vb_w:.2f} {vb_h:.2f}" width="100%" height="100%" shape-rendering="geometricPrecision">
  <path fill="currentColor" fill-rule="evenodd" d="{path_str}" />
</svg>'''

    with open('public/kavel-monogram-smooth.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f'Smooth monogram written to public/kavel-monogram-smooth.svg! Bounds: ({vb_w:.1f}x{vb_h:.1f})')

if __name__ == '__main__':
    generate_super_smooth_monogram()
