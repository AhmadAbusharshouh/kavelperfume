import os

def refine_optical_brand():
    p1 = "M 62 25 L 98 25 C 91 26, 85 30, 85 37 L 85 85 L 67 103 L 67 37 C 67 30, 61 26, 62 25 Z"
    p2 = "M 40 131 L 67 104 L 152 24 C 154 22, 157 23, 158 25 C 140 38, 108 72, 94 99 C 108 120, 138 148, 175 160 C 181 161.8, 185 162.2, 188 162.5 C 179 167.2, 155 167.8, 137 157.5 C 114 143.5, 96 131.5, 85 121.5 L 85 153 C 85 160, 91 165, 98 165 L 62 165 C 68 165, 67 160, 67 153 L 67 110 L 40 131 Z"
    mono_path = f"{p1} {p2}"

    # 1. Compact & Bold Stacked Logo (viewBox: 0 0 220 185)
    # Monogram: scale 0.74, centered at x=110
    # KAVEL: font-size 38, bold, x=110, y=148
    # FRAGRANCE: font-size 12.5, tracking 0.38em, x=110, y=172
    stacked_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 185" width="100%" height="100%" fill="none" shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="kavelGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dfc29f" />
      <stop offset="50%" stop-color="#ba997a" />
      <stop offset="100%" stop-color="#936d44" />
    </linearGradient>
  </defs>
  <!-- Monogram Mark -->
  <g transform="translate(37, 2) scale(0.72)">
    <path fill="url(#kavelGold)" fill-rule="evenodd" d="{mono_path}" />
  </g>
  <!-- KAVEL Wordmark -->
  <text 
    x="110" 
    y="146" 
    text-anchor="middle" 
    fill="url(#kavelGold)" 
    font-family="'Alexandria', 'Cinzel', 'Playfair Display', 'Didot', 'Georgia', serif" 
    font-size="38" 
    font-weight="800" 
    letter-spacing="0.22em"
  >KAVEL</text>
  <!-- FRAGRANCE Subtitle -->
  <text 
    x="110" 
    y="172" 
    text-anchor="middle" 
    fill="url(#kavelGold)" 
    font-family="'Alexandria', 'Montserrat', 'Plus Jakarta Sans', sans-serif" 
    font-size="12" 
    font-weight="700" 
    letter-spacing="0.36em" 
    opacity="0.95"
  >FRAGRANCE</text>
</svg>'''

    with open('public/logo.svg', 'w', encoding='utf-8') as f:
        f.write(stacked_svg)

    # 2. Perfect Horizontal Logo (viewBox: 0 0 280 72)
    # Monogram: scale 0.44 at x=2, y=0
    # KAVEL: font-size 32, bold, x=88, y=42
    # FRAGRANCE: font-size 10.5, x=89, y=62
    horizontal_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 72" width="100%" height="100%" fill="none" shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="kavelGoldH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dfc29f" />
      <stop offset="50%" stop-color="#ba997a" />
      <stop offset="100%" stop-color="#936d44" />
    </linearGradient>
  </defs>
  <!-- Monogram Mark -->
  <g transform="translate(2, 0) scale(0.44)">
    <path fill="url(#kavelGoldH)" fill-rule="evenodd" d="{mono_path}" />
  </g>
  <!-- Wordmark Container -->
  <text 
    x="88" 
    y="40" 
    fill="url(#kavelGoldH)" 
    font-family="'Alexandria', 'Cinzel', 'Playfair Display', 'Didot', 'Georgia', serif" 
    font-size="32" 
    font-weight="800" 
    letter-spacing="0.22em"
  >KAVEL</text>
  <text 
    x="89" 
    y="61" 
    fill="url(#kavelGoldH)" 
    font-family="'Alexandria', 'Montserrat', 'Plus Jakarta Sans', sans-serif" 
    font-size="10.5" 
    font-weight="700" 
    letter-spacing="0.32em" 
    opacity="0.95"
  >FRAGRANCE</text>
</svg>'''

    with open('public/logo-horizontal.svg', 'w', encoding='utf-8') as f:
        f.write(horizontal_svg)

    print("Refined optical SVGs generated successfully!")

if __name__ == '__main__':
    refine_optical_brand()
