import numpy as np
from PIL import Image
import scipy.ndimage as ndimage
import potrace

def extract_full_luxury_logo():
    diff_img = Image.open('color_diff.png')
    w, h = diff_img.size
    scale = 8
    diff_up = diff_img.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    arr = np.array(diff_up)
    
    # Base mask
    mask = arr > 48

    # Separate monogram area and text area
    top_limit = int(175 * scale)
    mono = mask[:top_limit, :]
    mono = ndimage.binary_fill_holes(mono)

    # Disk filter on monogram
    y, x = np.ogrid[-4:5, -4:5]
    disk = x*x + y*y <= 16
    mono_smooth = ndimage.binary_opening(mono, structure=disk)
    mono_smooth = ndimage.binary_closing(mono_smooth, structure=disk)

    dist_in_m = ndimage.distance_transform_edt(mono_smooth)
    dist_out_m = ndimage.distance_transform_edt(np.logical_not(mono_smooth))
    sdf_m = np.asarray(dist_in_m, dtype=np.float32) - np.asarray(dist_out_m, dtype=np.float32)
    sdf_m_blur = ndimage.gaussian_filter(sdf_m, sigma=3.6)
    mono_vector = sdf_m_blur > 0.0

    # Text area (KAVEL and FRAGRANCE)
    text_area = mask[top_limit:, :]
    # Disk filter for text (slightly smaller radius to preserve sharp serifs)
    y_t, x_t = np.ogrid[-2:3, -2:3]
    disk_t = x_t*x_t + y_t*y_t <= 4
    text_smooth = ndimage.binary_opening(text_area, structure=disk_t)
    text_smooth = ndimage.binary_closing(text_smooth, structure=disk_t)

    dist_in_t = ndimage.distance_transform_edt(text_smooth)
    dist_out_t = ndimage.distance_transform_edt(np.logical_not(text_smooth))
    sdf_t = np.asarray(dist_in_t, dtype=np.float32) - np.asarray(dist_out_t, dtype=np.float32)
    sdf_t_blur = ndimage.gaussian_filter(sdf_t, sigma=2.2) # crisp serifs!
    text_vector = sdf_t_blur > 0.0

    # Combine full mask
    full_vector = np.zeros((h * scale, w * scale), dtype=bool)
    full_vector[:top_limit, :] = mono_vector
    full_vector[top_limit:, :] = text_vector

    # Filter out tiny speckles
    labeled, num_features = ndimage.label(full_vector)
    sizes = ndimage.sum(full_vector, labeled, list(range(num_features + 1)))
    for i, s in enumerate(sizes):
        if s < 25 * (scale ** 2):
            full_vector[labeled == i] = False

    bm = potrace.Bitmap(full_vector)
    path = bm.trace(
        turdsize=int(25 * scale),
        alphamax=0.70,
        opttolerance=0.15,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY
    )

    valid_curves = []
    all_pts = []
    for c in path.curves:
        pts = [c.start_point] + [s.end_point for s in c.segments]
        xs = [p.x / scale for p in pts]
        ys = [p.y / scale for p in pts]
        if min(xs) <= 0.5 and max(xs) >= (w - 1.5):
            continue
        valid_curves.append(c)
        all_pts.extend(pts)

    print(f'Total curves in full logo: {len(valid_curves)}')

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

    min_x = min(p.x / scale for p in all_pts)
    max_x = max(p.x / scale for p in all_pts)
    min_y = min(p.y / scale for p in all_pts)
    max_y = max(p.y / scale for p in all_pts)

    pad = 12
    vb_x = min_x - pad
    vb_y = min_y - pad
    vb_w = (max_x - min_x) + 2 * pad
    vb_h = (max_y - min_y) + 2 * pad

    full_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb_x:.2f} {vb_y:.2f} {vb_w:.2f} {vb_h:.2f}" width="100%" height="100%" shape-rendering="geometricPrecision">
  <path fill="#ba997a" fill-rule="evenodd" d="{' '.join(svg_paths)}" />
</svg>'''

    with open('public/kavel-logo-full-master.svg', 'w', encoding='utf-8') as f:
        f.write(full_svg)
    print(f'Master full logo written to public/kavel-logo-full-master.svg! Bounds: {vb_w:.1f}x{vb_h:.1f}')

if __name__ == '__main__':
    extract_full_luxury_logo()
