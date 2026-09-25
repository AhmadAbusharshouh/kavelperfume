import os
import numpy as np

def create_master_monogram_svg():
    # In a 200 x 200 coordinate grid (Center at (100, 100))
    # Let's define the two pieces of the Monogram with pristine precision:
    
    # Piece 1: Upper Stem
    # Top serif: extends from x=60 to x=98 at y=26.
    # Left flare: curves from (60, 26) to (68, 38).
    # Left edge: straight vertical x=68 from y=38 down to y=102.
    # Knife cut: straight line from (68, 102) up-right to (84, 86).
    # Right edge: straight vertical x=84 from y=86 up to y=38.
    # Right flare: curves from (84, 38) to (98, 26).
    # Flat top: horizontal line from (98, 26) to (60, 26).
    p1 = """
      M 60 26 
      L 98 26 
      C 90 27, 84 31, 84 38 
      L 84 86 
      L 68 102 
      L 68 38 
      C 68 31, 62 27, 60 26 Z
    """

    # Piece 2: Lower Stem, Knife Slice Blade, Upper Arm & Lower Leg
    # Knife Blade Tip: starts at (44, 126).
    # Cutting edge: straight 45-deg line from (44, 126) passing through (68, 102) up to (154, 26).
    # Upper Arm Tip: (158 26).
    # Upper Arm inner curve: graceful concave sweep from (158, 26) down to the junction at (92, 98):
    #   C 142 38, 110 68, 92 98
    # Lower Leg outer curve: graceful sweeping S-curve from (92, 98) out to the foot at (176, 166):
    #   C 106 122, 138 152, 176 166
    # Foot terminal flick:
    #   C 180 167, 184 167.5, 187 168
    # Foot bottom arc:
    #   C 178 171, 154 171, 136 161
    # Lower Leg inner curve: concave sweep back to stem at (84, 124):
    #   C 112 146, 94 134, 84 124
    # Lower stem right edge: vertical down from (84, 124) to (84, 154).
    # Base serif right flare: curves from (84, 154) to (96, 166).
    # Base bottom horizontal edge: line from (96, 166) to (62, 166).
    # Base serif left flare: curves from (62, 166) to (68, 154).
    # Lower stem left edge: vertical up from (68, 154) to (68, 108).
    # Knife blade outer back-edge: line from (68, 108) down to blade tip at (44, 126).
    p2 = """
      M 44 126 
      L 68 102 
      L 154 26 
      L 158 26 
      C 142 38, 110 68, 92 98 
      C 108 122, 138 152, 176 166 
      C 180 167.2, 184 167.6, 187 168 
      C 178 171.5, 154 171.5, 136 161 
      C 112 145, 94 133, 84 124 
      L 84 154 
      C 84 161, 90 166, 96 166 
      L 62 166 
      C 67 166, 68 161, 68 154 
      L 68 108 
      L 44 126 Z
    """

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="35 15 160 165" width="100%" height="100%" shape-rendering="geometricPrecision">
  <path fill="#ba997a" fill-rule="evenodd" d="{p1} {p2}" />
</svg>"""

    with open('public/kavel-master-vector-mono.svg', 'w', encoding='utf-8') as f:
        f.write(svg)

    import sys
    sys.path.insert(0, os.path.dirname(__file__))
    from render_preview import render
    render('public/kavel-master-vector-mono.svg', 'master_vector_mono_preview.png')
    print("Master vector monogram rendered!")

if __name__ == '__main__':
    create_master_monogram_svg()
