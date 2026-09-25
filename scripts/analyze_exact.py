import numpy as np
from PIL import Image, ImageDraw
import os

# Let's inspect the exact pixel bounds of the Monogram in crop_all.png
# and crop_k_bag.png
def analyze_exact_geometry():
    img = Image.open('crop_all.png').convert('RGB')
    arr = np.array(img, dtype=np.float32)
    bg_color = np.array([177.2, 145.4, 112.4])
    diff = np.sqrt(np.sum((arr - bg_color)**2, axis=2))
    
    # Save a high-contrast guide image
    guide = np.clip(diff * 3.5, 0, 255).astype(np.uint8)
    Image.fromarray(guide).save('guide_mono.png')
    print("Guide saved to guide_mono.png")

if __name__ == '__main__':
    analyze_exact_geometry()
