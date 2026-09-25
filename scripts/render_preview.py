import os
from playwright.sync_api import sync_playwright

def render(svg_path='public/kavel-logo-potrace.svg', out_path='test_render.png'):
    abs_svg = os.path.abspath(svg_path).replace('\\', '/')
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <style>
    body {{
      margin: 0;
      padding: 30px;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: #e2e8f0;
    }}
    .preview-row {{
      display: flex;
      gap: 20px;
      justify-content: center;
    }}
    .box {{
      width: 340px;
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      padding: 24px;
      box-sizing: border-box;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }}
    .light {{ background: #ffffff; border: 1px solid #cbd5e1; }}
    .dark {{ background: #3f2911; }}
    .black {{ background: #0e0e0e; }}
    .cream {{ background: #faf7f2; border: 1px solid #e7dac9; }}
    img {{ width: 100%; height: auto; max-height: 100%; object-fit: contain; }}
  </style>
</head>
<body>
  <div class="preview-row">
    <div class="box light">
      <img src="file:///{abs_svg}" />
    </div>
    <div class="box dark">
      <img src="file:///{abs_svg}" />
    </div>
  </div>
  <div class="preview-row">
    <div class="box black">
      <img src="file:///{abs_svg}" />
    </div>
    <div class="box cream">
      <img src="file:///{abs_svg}" />
    </div>
  </div>
</body>
</html>"""

    with open('preview.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 780, 'height': 640})
        page.goto('file:///' + os.path.abspath('preview.html').replace('\\', '/'))
        page.screenshot(path=out_path)
        browser.close()

    print(f'Preview rendered to {out_path}')

if __name__ == '__main__':
    render()
