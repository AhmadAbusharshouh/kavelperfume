import numpy as np
from PIL import Image
import scipy.ndimage as ndimage
import potrace

def build_vector_paths():
    # Load and prepare high-res mask
    diff_img = Image.open('color_diff.png')
    w, h = diff_img.size
    scale = 8
    diff_up = diff_img.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    arr = np.array(diff_up)

    # Let's clean the mask with targeted multi-pass filtering
    top_limit = int(175 * scale)
    
    # 1. Monogram mask
    mono_raw = (arr[:top_limit, :] > 46).astype(np.uint8)
    mono_filled = np.array(ndimage.binary_fill_holes(mono_raw), dtype=np.uint8)
    
    # Smooth monogram with Gaussian SDF
    y, x = np.ogrid[-5:6, -5:6]
    disk = x*x + y*y <= 25
    m_clean = ndimage.binary_opening(mono_filled, structure=disk)
    m_clean = ndimage.binary_closing(m_clean, structure=disk)
    
    dist_in = ndimage.distance_transform_edt(m_clean)
    dist_out = ndimage.distance_transform_edt(np.logical_not(m_clean))
    sdf = np.asarray(dist_in, dtype=np.float32) - np.asarray(dist_out, dtype=np.float32)
    sdf_blur = ndimage.gaussian_filter(sdf, sigma=4.2)
    mono_vector = sdf_blur > 0.0

    # 2. Text mask
    text_raw = (arr[top_limit:, :] > 48).astype(np.uint8)
    y_t, x_t = np.ogrid[-2:3, -2:3]
    disk_t = x_t*x_t + y_t*y_t <= 4
    t_clean = ndimage.binary_opening(text_raw, structure=disk_t)
    t_clean = ndimage.binary_closing(t_clean, structure=disk_t)
    
    dist_in_t = ndimage.distance_transform_edt(t_clean)
    dist_out_t = ndimage.distance_transform_edt(np.logical_not(t_clean))
    sdf_t = np.asarray(dist_in_t, dtype=np.float32) - np.asarray(dist_out_t, dtype=np.float32)
    sdf_t_blur = ndimage.gaussian_filter(sdf_t, sigma=2.0)
    text_vector = sdf_t_blur > 0.0

    # Combine
    full_mask = np.zeros((h * scale, w * scale), dtype=bool)
    full_mask[:top_limit, :] = mono_vector
    full_mask[top_limit:, :] = text_vector

    # Remove edge padding
    full_mask[:16, :] = False
    full_mask[-16:, :] = False
    full_mask[:, :16] = False
    full_mask[:, -16:] = False

    # Filter tiny speckles
    labeled, num_features = ndimage.label(full_mask)
    sizes = ndimage.sum(full_mask, labeled, list(range(num_features + 1)))
    for i, s in enumerate(sizes):
        if s < 30 * (scale ** 2):
            full_mask[labeled == i] = False

    bm = potrace.Bitmap(full_mask)
    path = bm.trace(
        turdsize=int(25 * scale),
        alphamax=0.75,
        opttolerance=0.18,
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

    # Center in standard aspect ratio
    content_w = max_x - min_x
    content_h = max_y - min_y
    center_x = (min_x + max_x) / 2
    center_y = (min_y + max_y) / 2

    # Provide generous balanced padding
    pad_x = 10
    pad_y = 10
    vb_w = content_w + 2 * pad_x
    vb_h = content_h + 2 * pad_y
    vb_x = center_x - vb_w / 2
    vb_y = center_y - vb_h / 2

    # We also produce:
    # 1. Full Stacked Logo (Monogram + KAVEL + FRAGRANCE)
    # 2. Icon-only (Monogram K)
    # 3. Horizontal Wide Lockup (Monogram on left, KAVEL & FRAGRANCE on right)
    
    path_d = ' '.join(svg_paths)
    
    full_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb_x:.2f} {vb_y:.2f} {vb_w:.2f} {vb_h:.2f}" width="100%" height="100%" fill="currentColor" shape-rendering="geometricPrecision">
  <path fill-rule="evenodd" d="{path_d}" />
</svg>'''

    with open('public/kavel-logo-luxury.svg', 'w', encoding='utf-8') as f:
        f.write(full_svg)
    print(f'Saved public/kavel-logo-luxury.svg (ViewBox: {vb_x:.2f} {vb_y:.2f} {vb_w:.2f} {vb_h:.2f})')

if __name__ == '__main__':
    build_vector_paths()
