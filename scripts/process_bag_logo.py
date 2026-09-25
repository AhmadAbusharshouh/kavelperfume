import numpy as np
from PIL import Image, ImageFilter
import scipy.ndimage as ndimage
import potrace
import os

def process_bag_crop():
    img = Image.open('crop_full_bag.png').convert('RGB')
    arr = np.array(img, dtype=np.float32)
    
    # Calculate background color from the 4 corners of crop_full_bag.png
    bg_corners = [arr[:30, :30], arr[:30, -30:], arr[-30:, :30], arr[-30:, -30:]]
    bg_color = np.mean([np.mean(c, axis=(0,1)) for c in bg_corners], axis=0)
    print("Background color on bag:", bg_color)
    
    # Euclidean color difference
    diff = np.sqrt(np.sum((arr - bg_color)**2, axis=2))
    
    # Scale 8x with Lanczos for subpixel accuracy
    w, h = img.size
    scale = 8
    diff_norm = np.clip(diff / np.percentile(diff, 98) * 255, 0, 255).astype(np.uint8)
    diff_im = Image.fromarray(diff_norm)
    diff_up = diff_im.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    arr_up = np.array(diff_up)
    
    # Monogram is in upper region (y: 0 .. 230 * scale)
    top_limit = int(230 * scale)
    mono_raw = arr_up[:top_limit, :] > 48
    mono_filled = ndimage.binary_fill_holes(mono_raw)
    
    # Disk opening/closing for monogram
    y, x = np.ogrid[-4:5, -4:5]
    disk = x*x + y*y <= 16
    m_clean = ndimage.binary_opening(mono_filled, structure=disk)
    m_clean = ndimage.binary_closing(m_clean, structure=disk)
    
    dist_in_m = ndimage.distance_transform_edt(m_clean)
    dist_out_m = ndimage.distance_transform_edt(np.logical_not(m_clean))
    sdf_m = np.asarray(dist_in_m, dtype=np.float32) - np.asarray(dist_out_m, dtype=np.float32)
    sdf_m_blur = ndimage.gaussian_filter(sdf_m, sigma=3.2)
    mono_vector = sdf_m_blur > 0.0
    
    # Text region (y: 230 * scale .. 340 * scale) (KAVEL + FRAGRANCE, excluding lower "KAVEL SIGNATURE...")
    bottom_limit = int(340 * scale)
    text_raw = arr_up[top_limit:bottom_limit, :] > 52
    
    y_t, x_t = np.ogrid[-2:3, -2:3]
    disk_t = x_t*x_t + y_t*y_t <= 4
    t_clean = ndimage.binary_opening(text_raw, structure=disk_t)
    t_clean = ndimage.binary_closing(t_clean, structure=disk_t)
    
    dist_in_t = ndimage.distance_transform_edt(t_clean)
    dist_out_t = ndimage.distance_transform_edt(np.logical_not(t_clean))
    sdf_t = np.asarray(dist_in_t, dtype=np.float32) - np.asarray(dist_out_t, dtype=np.float32)
    sdf_t_blur = ndimage.gaussian_filter(sdf_t, sigma=2.0)
    text_vector = sdf_t_blur > 0.0
    
    # Combine full logo mask
    full_mask = np.zeros((h * scale, w * scale), dtype=bool)
    full_mask[:top_limit, :] = mono_vector
    full_mask[top_limit:bottom_limit, :] = text_vector
    
    # Filter tiny speckles
    labeled, num_features = ndimage.label(full_mask)
    feature_indices = list(range(num_features + 1))
    sizes = ndimage.sum(full_mask, labeled, feature_indices)
    for i, s in enumerate(sizes):
        if s < 30 * (scale ** 2):
            full_mask[labeled == i] = False

    bm = potrace.Bitmap(full_mask)
    path = bm.trace(
        turdsize=int(20 * scale),
        alphamax=0.62,
        opttolerance=0.12,
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

    print(f"Bag logo extracted curves: {len(valid_curves)}")
    
    svg_paths = []
    mono_paths = []
    text_paths = []
    
    for curve in valid_curves:
        pts = [curve.start_point] + [s.end_point for s in curve.segments]
        ys = [p.y / scale for p in pts]
        
        start = curve.start_point
        d = [f'M {start.x / scale:.3f} {start.y / scale:.3f}']
        for seg in curve.segments:
            if seg.is_corner:
                c = seg.c
                end = seg.end_point
                d.append(f'L {c.x / scale:.3f} {c.y / scale:.3f} L {end.x / scale:.3f} {end.y / scale:.3f}')
            else:
                c1, c2 = seg.c1, seg.c2
                end = seg.end_point
                d.append(f'C {c1.x / scale:.3f} {c1.y / scale:.3f}, {c2.x / scale:.3f} {c2.y / scale:.3f}, {end.x / scale:.3f} {end.y / scale:.3f}')
        d.append('Z')
        d_str = ' '.join(d)
        svg_paths.append(d_str)
        if max(ys) <= (top_limit / scale):
            mono_paths.append(d_str)
        else:
            text_paths.append(d_str)

    min_x = min(p.x / scale for p in all_pts)
    max_x = max(p.x / scale for p in all_pts)
    min_y = min(p.y / scale for p in all_pts)
    max_y = max(p.y / scale for p in all_pts)

    pad = 8
    vb_x = min_x - pad
    vb_y = min_y - pad
    vb_w = (max_x - min_x) + 2 * pad
    vb_h = (max_y - min_y) + 2 * pad

    full_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb_x:.2f} {vb_y:.2f} {vb_w:.2f} {vb_h:.2f}" width="100%" height="100%" fill="none" shape-rendering="geometricPrecision">
  <path fill="#ba997a" fill-rule="evenodd" d="{' '.join(svg_paths)}" />
</svg>'''

    with open('public/kavel-logo-bag-master.svg', 'w', encoding='utf-8') as f:
        f.write(full_svg)

    # Monogram bounds
    all_m_pts = []
    for c in valid_curves:
        pts = [c.start_point] + [s.end_point for s in c.segments]
        ys = [p.y / scale for p in pts]
        if max(ys) <= (top_limit / scale):
            all_m_pts.extend(pts)
    
    m_min_x = min(p.x / scale for p in all_m_pts)
    m_max_x = max(p.x / scale for p in all_m_pts)
    m_min_y = min(p.y / scale for p in all_m_pts)
    m_max_y = max(p.y / scale for p in all_m_pts)
    
    m_pad = 6
    m_vb_x = m_min_x - m_pad
    m_vb_y = m_min_y - m_pad
    m_vb_w = (m_max_x - m_min_x) + 2 * m_pad
    m_vb_h = (m_max_y - m_min_y) + 2 * m_pad
    
    mono_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{m_vb_x:.2f} {m_vb_y:.2f} {m_vb_w:.2f} {m_vb_h:.2f}" width="100%" height="100%" fill="none" shape-rendering="geometricPrecision">
  <path fill="#ba997a" fill-rule="evenodd" d="{' '.join(mono_paths)}" />
</svg>'''

    with open('public/kavel-monogram-bag-master.svg', 'w', encoding='utf-8') as f:
        f.write(mono_svg)

    print(f"Master bag SVGs generated! Full logo bounds: {vb_w:.1f}x{vb_h:.1f}, Monogram bounds: {m_vb_w:.1f}x{m_vb_h:.1f}")

if __name__ == '__main__':
    process_bag_crop()
