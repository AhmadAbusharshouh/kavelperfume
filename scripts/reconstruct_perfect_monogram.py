import numpy as np
from PIL import Image
import scipy.ndimage as ndimage
import potrace

def reconstruct():
    # Let's read the crop_all image
    crop_img = Image.open('crop_all.png')
    
    # Let's perform contour tracing with fine curve fitting
    # We will use high resolution (scale=16 for extreme precision)
    scale = 16
    diff_img = Image.open('color_diff.png')
    w, h = diff_img.size
    diff_up = diff_img.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    arr = np.array(diff_up)

    top_limit = int(175 * scale)
    mono_raw = (arr[:top_limit, :] > 46).astype(np.uint8)
    mono_filled = np.array(ndimage.binary_fill_holes(mono_raw), dtype=np.uint8)

    # Smooth the binary image with a Gaussian kernel in float space, then threshold at 0.5
    # This creates perfectly smooth subpixel contours without any stepped pixels!
    smooth_mono = ndimage.gaussian_filter(mono_filled.astype(np.float32), sigma=scale * 0.45)
    binary_smooth = smooth_mono >= 0.5

    bm = potrace.Bitmap(binary_smooth)
    path = bm.trace(
        turdsize=int(50 * scale),
        alphamax=0.65,
        opttolerance=0.12,
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

    print(f"Monogram valid curves at 16x scale: {len(valid_curves)}")

    # Extract SVG paths for monogram
    svg_paths = []
    for curve in valid_curves:
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
        svg_paths.append(' '.join(d))

    mono_d = ' '.join(svg_paths)

    # Let's do the same 16x Gaussian level-set for the Wordmark "K A V E L" and "F R A G R A N C E"
    text_raw = (arr[top_limit:, :] > 48).astype(np.uint8)
    smooth_text = ndimage.gaussian_filter(text_raw.astype(np.float32), sigma=scale * 0.28)
    binary_text = smooth_text >= 0.5

    # Filter speckles
    labeled, num_features = ndimage.label(binary_text)
    feature_indices = list(range(num_features + 1))
    sizes = ndimage.sum(binary_text, labeled, feature_indices)
    for i, s in enumerate(sizes):
        if s < 30 * (scale ** 2):
            binary_text[labeled == i] = False

    bm_t = potrace.Bitmap(binary_text)
    path_t = bm_t.trace(
        turdsize=int(20 * scale),
        alphamax=0.55, # keeps serif corners crisp!
        opttolerance=0.10,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY
    )

    valid_text_curves = []
    for c in path_t.curves:
        pts = [c.start_point] + [s.end_point for s in c.segments]
        xs = [p.x / scale for p in pts]
        ys = [(p.y + top_limit) / scale for p in pts]
        if min(xs) <= 0.5 and max(xs) >= (w - 1.5):
            continue
        valid_text_curves.append(c)

    print(f"Text valid curves at 16x scale: {len(valid_text_curves)}")

    text_paths = []
    for curve in valid_text_curves:
        start = curve.start_point
        d = [f'M {start.x / scale:.3f} {(start.y + top_limit) / scale:.3f}']
        for seg in curve.segments:
            if seg.is_corner:
                c = seg.c
                end = seg.end_point
                d.append(f'L {c.x / scale:.3f} {(c.y + top_limit) / scale:.3f} L {end.x / scale:.3f} {(end.y + top_limit) / scale:.3f}')
            else:
                c1, c2 = seg.c1, seg.c2
                end = seg.end_point
                d.append(f'C {c1.x / scale:.3f} {(c1.y + top_limit) / scale:.3f}, {c2.x / scale:.3f} {(c2.y + top_limit) / scale:.3f}, {end.x / scale:.3f} {(end.y + top_limit) / scale:.3f}')
        d.append('Z')
        text_paths.append(' '.join(d))

    text_d = ' '.join(text_paths)

    # Monogram ViewBox:
    # Monogram is centered around x=207.5, width ≈ 140 (x: 137.5 .. 277.5), height ≈ 138 (y: 21.8 .. 160.0)
    # Total combined height: y: 21.8 .. 279.2
    
    full_d = mono_d + ' ' + text_d

    # Full Master Stacked Logo SVG:
    # viewBox: 40 15 320 270
    full_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 15 320 270" width="100%" height="100%" fill="none" shape-rendering="geometricPrecision">
  <path fill="#ba997a" fill-rule="evenodd" d="{full_d}" />
</svg>'''

    with open('public/kavel-logo-master-16x.svg', 'w', encoding='utf-8') as f:
        f.write(full_svg)

    # Monogram-only SVG:
    mono_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="134 18 148 146" width="100%" height="100%" fill="none" shape-rendering="geometricPrecision">
  <path fill="#ba997a" fill-rule="evenodd" d="{mono_d}" />
</svg>'''

    with open('public/kavel-monogram-master-16x.svg', 'w', encoding='utf-8') as f:
        f.write(mono_svg)

    # Also save with currentColor for dynamic theme styling:
    full_svg_cc = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 15 320 270" width="100%" height="100%" fill="none" shape-rendering="geometricPrecision">
  <path fill="currentColor" fill-rule="evenodd" d="{full_d}" />
</svg>'''
    with open('public/kavel-logo-cc.svg', 'w', encoding='utf-8') as f:
        f.write(full_svg_cc)

    print("Successfully generated 16x Master SVGs!")

if __name__ == '__main__':
    reconstruct()
