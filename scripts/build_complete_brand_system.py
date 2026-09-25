import os

def generate_brand_system():
    # Monogram Path (piece 1 + piece 2)
    p1 = "M 62 25 L 98 25 C 91 26, 85 30, 85 37 L 85 85 L 67 103 L 67 37 C 67 30, 61 26, 62 25 Z"
    p2 = "M 40 131 L 67 104 L 152 24 C 154 22, 157 23, 158 25 C 140 38, 108 72, 94 99 C 108 120, 138 148, 175 160 C 181 161.8, 185 162.2, 188 162.5 C 179 167.2, 155 167.8, 137 157.5 C 114 143.5, 96 131.5, 85 121.5 L 85 153 C 85 160, 91 165, 98 165 L 62 165 C 68 165, 67 160, 67 153 L 67 110 L 40 131 Z"
    
    # 1. Full Stacked Logo (ViewBox: 0 0 240 220)
    # Monogram centered at x=120, top=10, size=110
    # KAVEL text centered at x=120, y=168, font-size=34
    # FRAGRANCE text centered at x=120, y=198, font-size=12
    stacked_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 220" width="100%" height="100%" fill="none" shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="kavelGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4b38a" />
      <stop offset="50%" stop-color="#ba997a" />
      <stop offset="100%" stop-color="#9a764f" />
    </linearGradient>
  </defs>
  <!-- Monogram Mark -->
  <g transform="translate(42, 6) scale(0.78)">
    <path fill="url(#kavelGold)" fill-rule="evenodd" d="{p1} {p2}" />
  </g>
  <!-- KAVEL Logotype -->
  <text 
    x="120" 
    y="166" 
    text-anchor="middle" 
    fill="url(#kavelGold)" 
    font-family="'Alexandria', 'Cinzel', 'Playfair Display', 'Didot', 'Georgia', serif" 
    font-size="34" 
    font-weight="700" 
    letter-spacing="0.26em"
  >KAVEL</text>
  <!-- FRAGRANCE Descriptor -->
  <text 
    x="121" 
    y="196" 
    text-anchor="middle" 
    fill="url(#kavelGold)" 
    font-family="'Alexandria', 'Montserrat', 'Plus Jakarta Sans', sans-serif" 
    font-size="11" 
    font-weight="600" 
    letter-spacing="0.38em" 
    opacity="0.9"
  >FRAGRANCE</text>
</svg>'''

    with open('public/logo.svg', 'w', encoding='utf-8') as f:
        f.write(stacked_svg)

    # 2. Horizontal Wide Logo (ViewBox: 0 0 320 80)
    # Monogram at left x=8, y=4, height=72
    # KAVEL text at x=100, y=48, font-size=34
    # FRAGRANCE text at x=102, y=68, font-size=11
    horizontal_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="100%" height="100%" fill="none" shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="kavelGoldH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4b38a" />
      <stop offset="50%" stop-color="#ba997a" />
      <stop offset="100%" stop-color="#9a764f" />
    </linearGradient>
  </defs>
  <!-- Monogram Mark -->
  <g transform="translate(6, 2) scale(0.48)">
    <path fill="url(#kavelGoldH)" fill-rule="evenodd" d="{p1} {p2}" />
  </g>
  <!-- Wordmark Container -->
  <text 
    x="98" 
    y="44" 
    fill="url(#kavelGoldH)" 
    font-family="'Alexandria', 'Cinzel', 'Playfair Display', 'Didot', 'Georgia', serif" 
    font-size="32" 
    font-weight="700" 
    letter-spacing="0.22em"
  >KAVEL</text>
  <text 
    x="99" 
    y="66" 
    fill="url(#kavelGoldH)" 
    font-family="'Alexandria', 'Montserrat', 'Plus Jakarta Sans', sans-serif" 
    font-size="10.5" 
    font-weight="600" 
    letter-spacing="0.34em" 
    opacity="0.9"
  >FRAGRANCE</text>
</svg>'''

    with open('public/logo-horizontal.svg', 'w', encoding='utf-8') as f:
        f.write(horizontal_svg)

    # 3. Monogram-only (ViewBox: 32 18 162 152)
    mono_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="32 18 162 152" fill="none" shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="kavelGoldM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4b38a" />
      <stop offset="50%" stop-color="#ba997a" />
      <stop offset="100%" stop-color="#9a764f" />
    </linearGradient>
  </defs>
  <path fill="url(#kavelGoldM)" fill-rule="evenodd" d="{p1} {p2}" />
</svg>'''

    with open('public/logo-monogram.svg', 'w', encoding='utf-8') as f:
        f.write(mono_svg)

    # 4. Favicon (64x64)
    favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="16" fill="#3f2911" />
  <g transform="translate(6, 6) scale(0.26)">
    <path fill="#ba997a" fill-rule="evenodd" d="{p1} {p2}" />
  </g>
</svg>'''

    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(favicon_svg)

    print("Complete brand system SVG assets written!")

if __name__ == '__main__':
    generate_brand_system()
