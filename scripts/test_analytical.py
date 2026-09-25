import os
from playwright.sync_api import sync_playwright

def test_analytical_svg():
    # Let's test analytical monogram definition in 0 0 200 200
    # and compare it with the authentic crop!
    
    # We will refine the exact control points
    svg_mono_analytical = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4b38a" />
      <stop offset="50%" stop-color="#ba997a" />
      <stop offset="100%" stop-color="#96734e" />
    </linearGradient>
  </defs>
  <!-- Piece 1: Upper Stem -->
  <path fill="#ba997a" d="
    M 54 22 
    L 94 22 
    C 87 23, 82 28, 82 36 
    L 82 92 
    L 64 109 
    L 64 36 
    C 64 28, 59 23, 54 22 Z
  " />
  <!-- Piece 2: Lower Stem, Knife Slice, Upper Arm & Lower Leg -->
  <path fill="#ba997a" d="
    M 40 131 
    L 64 109 
    L 156 22 
    L 161 22 
    C 142 32, 106 66, 92 102 
    C 108 126, 138 152, 174 158 
    C 178 158.8, 180 159.2, 182 159.5 
    C 174 162.5, 154 163, 138 155 
    C 112 141, 92 128, 82 119 
    L 82 148 
    C 82 154, 86 160, 92 160 
    L 56 160 
    C 62 160, 64 154, 64 148 
    L 64 116 
    L 40 131 Z
  " />
</svg>"""

    with open('public/kavel-analytical-test.svg', 'w', encoding='utf-8') as f:
        f.write(svg_mono_analytical)

    import sys
    sys.path.insert(0, os.path.dirname(__file__))
    from render_preview import render
    render('public/kavel-analytical-test.svg', 'analytical_preview.png')

if __name__ == '__main__':
    test_analytical_svg()
