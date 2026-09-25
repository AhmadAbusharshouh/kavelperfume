import os
from playwright.sync_api import sync_playwright

def run_full_verification():
    # Read the actual SVG files
    with open('public/logo.svg', 'r', encoding='utf-8') as f:
        stacked_svg = f.read()
    
    with open('public/logo-horizontal.svg', 'r', encoding='utf-8') as f:
        horizontal_svg = f.read()

    with open('public/logo-monogram.svg', 'r', encoding='utf-8') as f:
        monogram_svg = f.read()

    abs_orig_crop = os.path.abspath('crop_k_bag.png').replace('\\', '/')
    abs_box_crop = os.path.abspath('temp_logo_crop.png').replace('\\', '/')

    html_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>Kavel Perfume - Header & Logo Visual Verification</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      font-family: 'Alexandria', sans-serif;
      background: #f8fafc;
      color: #0f172a;
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 32px;
      align-items: center;
    }}
    .container {{
      width: 100%;
      max-width: 1100px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }}
    .section-title {{
      font-size: 18px;
      font-weight: 800;
      color: #3f2911;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 2px solid #ba997a;
      padding-bottom: 8px;
    }}
    
    /* Live Desktop Header Mockup */
    .header-desktop {{
      width: 100%;
      height: 88px;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 20px;
      padding: 0 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.05);
    }}
    .nav-links {{
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 1;
      justify-content: flex-start;
    }}
    .nav-link {{
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      text-decoration: none;
      transition: color 0.2s;
    }}
    .nav-link:hover {{
      color: #ba997a;
    }}
    .header-center-logo {{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }}
    .header-center-logo svg {{
      height: 72px;
      width: auto;
      filter: drop-shadow(0 2px 8px rgba(186, 153, 122, 0.15));
    }}
    .header-actions {{
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      justify-content: flex-end;
    }}
    .action-btn {{
      padding: 9px 14px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      border: none;
    }}
    .btn-search {{
      background: #f1f5f9;
      color: #334155;
    }}
    .btn-cart {{
      background: #3f2911;
      color: #ffffff;
    }}
    .btn-phone {{
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
    }}

    /* Live Mobile Header Mockup */
    .mobile-wrapper {{
      display: flex;
      gap: 30px;
      justify-content: center;
      flex-wrap: wrap;
    }}
    .mobile-frame {{
      width: 380px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 16px 36px -8px rgba(0,0,0,0.1);
    }}
    .mobile-header {{
      height: 70px;
      background: rgba(255, 255, 255, 0.98);
      border-bottom: 1px solid #e2e8f0;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}
    .mobile-header .logo-container svg {{
      height: 52px;
      width: auto;
    }}
    .mobile-body {{
      padding: 24px 16px;
      background: #fafaf9;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      text-align: center;
    }}
    .mobile-banner {{
      width: 100%;
      background: linear-gradient(135deg, #3f2911, #1e1308);
      color: white;
      padding: 20px;
      border-radius: 16px;
    }}

    /* Side-by-side Fidelity Comparison */
    .compare-grid {{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }}
    .compare-card {{
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      text-align: center;
    }}
    .compare-card img, .compare-card .svg-holder {{
      height: 180px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      object-fit: contain;
    }}
    .compare-card .svg-holder svg {{
      max-height: 100%;
      max-width: 100%;
    }}
    .badge {{
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 20px;
    }}
    .badge-orig {{ background: #fef3c7; color: #92400e; }}
    .badge-svg {{ background: #ecfdf5; color: #065f46; }}

    /* Footer Mockup */
    .footer-mockup {{
      background: #3f2911;
      color: #faf7f2;
      border-radius: 20px;
      padding: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}
    .footer-mockup svg {{
      height: 60px;
      width: auto;
    }}
  </style>
</head>
<body>
  <div class="container">
    
    <!-- 1. Live Desktop Header Mockup -->
    <div>
      <div class="section-title">
        <span>1. معاينة الهيدر المكتبي (Desktop Header - 100% Dead Center)</span>
      </div>
      <div style="margin-top: 14px;">
        <div class="header-desktop">
          <div class="nav-links">
            <span class="nav-link">الرئيسية</span>
            <span class="nav-link">جميع العطور</span>
            <span class="nav-link">العروض والبكجات</span>
            <span class="nav-link">تغليف كافيل</span>
          </div>

          <div class="header-center-logo">
            {stacked_svg}
          </div>

          <div class="header-actions">
            <span class="action-btn btn-search">🔍 بحث</span>
            <span class="action-btn btn-phone">📞 0782347865</span>
            <span class="action-btn btn-cart">🛍️ السلة (3)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Live Mobile Header & Responsive View -->
    <div>
      <div class="section-title">
        <span>2. معاينة الهيدر على الموبايل (Mobile Responsive - iPhone Viewport)</span>
      </div>
      <div class="mobile-wrapper" style="margin-top: 14px;">
        
        <!-- Mobile View Stacked -->
        <div class="mobile-frame">
          <div class="mobile-header">
            <span style="font-size: 18px; cursor: pointer;">☰</span>
            <div class="logo-container">
              {stacked_svg}
            </div>
            <span style="font-size: 18px; cursor: pointer;">🛍️</span>
          </div>
          <div class="mobile-body">
            <div class="mobile-banner">
              <h3 style="font-size: 15px; font-weight: 800; color: #ba997a; margin-bottom: 6px;">كافيل بيرفيوم</h3>
              <p style="font-size: 11px; opacity: 0.85;">عطور مستوحاة بثبات استثنائي 30%+ بأيدٍ أردنية</p>
            </div>
          </div>
        </div>

        <!-- Mobile View Horizontal -->
        <div class="mobile-frame">
          <div class="mobile-header">
            <span style="font-size: 18px; cursor: pointer;">☰</span>
            <div class="logo-container" style="max-height: 40px; display: flex; align-items: center;">
              {horizontal_svg}
            </div>
            <span style="font-size: 18px; cursor: pointer;">🛍️</span>
          </div>
          <div class="mobile-body">
            <div class="mobile-banner">
              <h3 style="font-size: 15px; font-weight: 800; color: #ba997a; margin-bottom: 6px;">عرض البكج التوفيري</h3>
              <p style="font-size: 11px; opacity: 0.85;">اختر 3 عطور واحصل على الرابع مجاناً + شحن مجاني</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Authentic Source vs Vector Match -->
    <div>
      <div class="section-title">
        <span>3. مطابقة الشعار الجديد مع الأصل (Original Packaging vs Pristine SVG)</span>
      </div>
      <div class="compare-grid" style="margin-top: 14px;">
        <div class="compare-card">
          <span class="badge badge-orig">صورة التغليف الأصلية (مع الخلفية والتأثيرات)</span>
          <img src="file:///{abs_box_crop}" />
          <p style="font-size: 11px; color: #64748b;">الصورة الأصلية مع قماش الكرافت والتظليل</p>
        </div>
        <div class="compare-card">
          <span class="badge badge-svg">شعار SVG النقي المفرغ (بدون خلفية وفائق الدقة)</span>
          <div class="svg-holder">
            {stacked_svg}
          </div>
          <p style="font-size: 11px; color: #047857; font-weight: 700;">فيكتور نقي 100%، متدرج ذهبي، قابل للتكبير دون بكسلة</p>
        </div>
      </div>
    </div>

    <!-- 4. Footer Integration -->
    <div>
      <div class="section-title">
        <span>4. معاينة الشعار في الفوتر الداكن (Dark Footer Luxury Surface)</span>
      </div>
      <div class="footer-mockup" style="margin-top: 14px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          {stacked_svg}
          <div>
            <h4 style="font-size: 14px; font-weight: 800; color: #ba997a;">كافيل بيرفيوم (Kavel Perfume)</h4>
            <p style="font-size: 11px; opacity: 0.7; max-width: 450px; margin-top: 4px;">دار العطور الأردنية الرائدة في تركيب أرقى العطور المستوحاة بتركيز فائق وزيوت نقية.</p>
          </div>
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #ba997a;">
          المملكة الأردنية الهاشمية 🇯🇴
        </div>
      </div>
    </div>

  </div>
</body>
</html>"""

    with open('full_verification_page.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1160, 'height': 1480})
        page.goto('file:///' + os.path.abspath('full_verification_page.html').replace('\\', '/'))
        page.wait_for_timeout(1000)
        page.screenshot(path='header_e2e_verification.png', full_page=True)
        browser.close()

    print("Full E2E verification screenshot saved to header_e2e_verification.png!")

if __name__ == '__main__':
    run_full_verification()
