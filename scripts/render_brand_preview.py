import os
from playwright.sync_api import sync_playwright

def render_brand_showcase():
    abs_stacked = os.path.abspath('public/logo.svg').replace('\\', '/')
    abs_horizontal = os.path.abspath('public/logo-horizontal.svg').replace('\\', '/')
    abs_monogram = os.path.abspath('public/logo-monogram.svg').replace('\\', '/')

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800&family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');
    body {{
      margin: 0;
      padding: 30px;
      font-family: 'Alexandria', sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      gap: 24px;
      align-items: center;
    }}
    h1 {{
      font-size: 20px;
      font-weight: 800;
      margin: 0 0 10px 0;
      color: #3f2911;
      text-align: center;
    }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      width: 100%;
      max-width: 900px;
    }}
    .card {{
      border-radius: 20px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06);
    }}
    .light-card {{
      background: #ffffff;
      border: 1px solid #e2e8f0;
    }}
    .dark-card {{
      background: #3f2911;
      border: 1px solid #5a3d1b;
    }}
    .black-card {{
      background: #0d0d0d;
      border: 1px solid #222;
    }}
    .cream-card {{
      background: #faf7f2;
      border: 1px solid #eedecf;
    }}
    .stacked-img {{
      height: 140px;
      width: auto;
    }}
    .horizontal-img {{
      height: 48px;
      width: auto;
    }}
    .label {{
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      opacity: 0.6;
    }}
    .light-card .label, .cream-card .label {{ color: #64748b; }}
    .dark-card .label, .black-card .label {{ color: #cbd5e1; }}
  </style>
</head>
<body>
  <h1>KAVEL Brand Identity System - Vector Verification</h1>
  <div class="grid">
    <!-- Light Theme -->
    <div class="card light-card">
      <span class="label">LIGHT THEME (STACKED)</span>
      <img src="file:///{abs_stacked}" class="stacked-img" />
      <span class="label">HORIZONTAL HEADER</span>
      <img src="file:///{abs_horizontal}" class="horizontal-img" />
    </div>

    <!-- Luxury Dark Theme -->
    <div class="card dark-card">
      <span class="label">LUXURY BROWN (#3f2911)</span>
      <img src="file:///{abs_stacked}" class="stacked-img" />
      <span class="label">HORIZONTAL HEADER</span>
      <img src="file:///{abs_horizontal}" class="horizontal-img" />
    </div>

    <!-- Black Velvet Theme -->
    <div class="card black-card">
      <span class="label">MIDNIGHT BLACK (#0d0d0d)</span>
      <img src="file:///{abs_stacked}" class="stacked-img" />
      <span class="label">HORIZONTAL HEADER</span>
      <img src="file:///{abs_horizontal}" class="horizontal-img" />
    </div>

    <!-- Warm Kraft / Cream Theme -->
    <div class="card cream-card">
      <span class="label">SIGNATURE KRAFT / CREAM (#faf7f2)</span>
      <img src="file:///{abs_stacked}" class="stacked-img" />
      <span class="label">HORIZONTAL HEADER</span>
      <img src="file:///{abs_horizontal}" class="horizontal-img" />
    </div>
  </div>
</body>
</html>"""

    with open('brand_showcase.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 960, 'height': 820})
        page.goto('file:///' + os.path.abspath('brand_showcase.html').replace('\\', '/'))
        page.screenshot(path='brand_showcase_preview.png')
        browser.close()

    print("Brand showcase rendered to brand_showcase_preview.png")

if __name__ == '__main__':
    render_brand_showcase()
