import numpy as np
from PIL import Image
import scipy.ndimage as ndimage

def print_landmarks():
    diff_img = Image.open('color_diff.png')
    w, h = diff_img.size
    # Let's inspect where the main edges and features are in the 400x310 coordinate space
    # Monogram region: x in [135, 280], y in [20, 162]
    # Let's find:
    # 1. Top serif: y_min, x_min, x_max
    # 2. Vertical stem: left x, right x
    # 3. Cut line: start (x,y), end (x,y)
    # 4. Upper arm tip: (x,y)
    # 5. Lower leg foot tip: (x,y)
    # 6. Bottom stem flare: y_max, x_min, x_max

    arr = np.array(diff_img)
    mask = arr > 50

    # Top serif
    top_rows = np.where(mask[:30, 135:280])
    print('Top region y range:', top_rows[0].min(), top_rows[0].max())
    print('Top region x range:', 135 + top_rows[1].min(), 135 + top_rows[1].max())

    # Rightmost tip of upper arm (around y=20..40, x=230..280)
    arm_pts = np.where(mask[15:45, 220:280])
    max_arm_x_idx = np.argmax(arm_pts[1])
    print('Upper arm tip:', (220 + arm_pts[1][max_arm_x_idx], 15 + arm_pts[0][max_arm_x_idx]))

    # Rightmost tip of lower leg (around y=140..165, x=240..285)
    leg_pts = np.where(mask[140:165, 240:285])
    max_leg_x_idx = np.argmax(leg_pts[1])
    print('Lower leg foot tip:', (240 + leg_pts[1][max_leg_x_idx], 140 + leg_pts[0][max_leg_x_idx]))

    # Leftmost tip of blade (around y=120..145, x=130..150)
    blade_pts = np.where(mask[120:145, 130:150])
    min_blade_x_idx = np.argmin(blade_pts[1])
    print('Blade tip:', (130 + blade_pts[1][min_blade_x_idx], 120 + blade_pts[0][min_blade_x_idx]))

    # Stem x coordinates around y=60
    stem_row = np.where(mask[60, :])[0]
    print('Stem at y=60 x range:', stem_row.min(), stem_row.max(), 'width:', stem_row.max() - stem_row.min())

    # Stem at y=150
    stem_base = np.where(mask[150, 130:180])[0]
    print('Stem base at y=150 x range:', 130 + stem_base.min(), 130 + stem_base.max())

if __name__ == '__main__':
    print_landmarks()
