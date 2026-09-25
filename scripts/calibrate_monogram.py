import numpy as np
from PIL import Image, ImageDraw
import matplotlib.pyplot as plt
import os

# Let's inspect the original image coordinates and stroke widths
def calibrate():
    orig = Image.open('crop_all.png').convert('RGBA')
    w, h = orig.size
    
    # In crop_all.png:
    # Stem top serif: y ≈ 22..35, x ≈ 147..180
    # Stem vertical trunk: left x ≈ 155, right x ≈ 173 (width ≈ 18px)
    # Cut: passes through (138, 136) to (185, 90) -> slope dx/dy ≈ 47/-46 ≈ -1 (angle ≈ 45 deg)
    # Upper arm top-right tip: (x ≈ 250, y ≈ 24)
    # Upper arm width at mid (y ≈ 55): x goes from 195 to 216 (width ≈ 21px)
    # Lower leg foot tip: (x ≈ 276, y ≈ 160)
    # Lower leg width at mid (y ≈ 130): x goes from 208 to 232 (width ≈ 24px)
    # Stem base: y ≈ 160, left x ≈ 147, right x ≈ 173
    
    print(f"Original image dimensions: {w} x {h}")

if __name__ == '__main__':
    calibrate()
