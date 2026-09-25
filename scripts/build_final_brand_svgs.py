import os
import sys

def build_svgs():
    # 1. Authentic Sliced Monogram "K" in normalized coordinates (0 0 200 200)
    # Piece 1: Upper Stem
    # Piece 2: Knife Slice, Upper Arm, Lower Leg, Lower Stem
    
    # Exact geometric coordinates aligned with guide_mono.png:
    p1 = """
      M 62 25 
      L 98 25 
      C 91 26, 85 30, 85 37 
      L 85 85 
      L 67 103 
      L 67 37 
      C 67 30, 61 26, 62 25 Z
    """

    p2 = """
      M 40 131 
      L 67 104 
      L 152 24 
      C 154 22, 157 23, 158 25 
      C 140 38, 108 72, 94 99 
      C 108 120, 138 148, 175 160 
      C 181 161.8, 185 162.2, 188 162.5 
      C 179 167.2, 155 167.8, 137 157.5 
      C 114 143.5, 96 131.5, 85 121.5 
      L 85 153 
      C 85 160, 91 165, 98 165 
      L 62 165 
      C 68 165, 67 160, 67 153 
      L 67 110 
      L 40 131 Z
    """

    # Combined monogram path:
    monogram_path = f"{p1.strip()} {p2.strip()}"

    # Standalone Monogram SVG (viewBox="30 15 165 160")
    mono_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="32 18 162 152" fill="none" shape-rendering="geometricPrecision">
  <path fill="currentColor" fill-rule="evenodd" d="{monogram_path}" />
</svg>'''

    with open('public/logo-monogram.svg', 'w', encoding='utf-8') as f:
        f.write(mono_svg)

    # Standalone Favicon SVG (64x64 rounded icon)
    favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="16" fill="#3f2911" />
  <g transform="translate(6, 6) scale(0.26)">
    <path fill="#ba997a" fill-rule="evenodd" d="{monogram_path}" />
  </g>
</svg>'''

    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(favicon_svg)

    print("Generated public/logo-monogram.svg and public/favicon.svg")

if __name__ == '__main__':
    build_svgs()
