import numpy as np
from PIL import Image
import scipy.ndimage as ndimage
import potrace

def inspect_segments():
    diff_img = Image.open('color_diff.png')
    w, h = diff_img.size
    scale = 8
    diff_up = diff_img.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    arr = np.array(diff_up)
    mask = arr > 50
    top_limit = int(175 * scale)
    mono = mask[:top_limit, :]
    mono = ndimage.binary_fill_holes(mono)

    y, x = np.ogrid[-4:5, -4:5]
    disk = x*x + y*y <= 16
    mono_smooth = ndimage.binary_opening(mono, structure=disk)
    mono_smooth = ndimage.binary_closing(mono_smooth, structure=disk)

    dist_in = ndimage.distance_transform_edt(mono_smooth)
    dist_out = ndimage.distance_transform_edt(np.logical_not(mono_smooth))
    sdf = np.asarray(dist_in, dtype=np.float32) - np.asarray(dist_out, dtype=np.float32)
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

    for idx, c in enumerate(valid_curves):
        pts = [c.start_point] + [s.end_point for s in c.segments]
        xs = [p.x / scale for p in pts]
        ys = [p.y / scale for p in pts]
        print(f"=== Curve {idx} (total {len(c.segments)} segs) bounds: x=[{min(xs):.1f}, {max(xs):.1f}], y=[{min(ys):.1f}, {max(ys):.1f}] ===")

if __name__ == '__main__':
    inspect_segments()
