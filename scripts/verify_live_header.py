import subprocess
import time
import urllib.request
import os
from playwright.sync_api import sync_playwright

def verify():
    print("Starting Next.js dev server on port 3001...")
    proc = subprocess.Popen(
        ['npx.cmd', 'next', 'dev', '-p', '3001'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    server_ready = False
    for i in range(25):
        try:
            res = urllib.request.urlopen('http://localhost:3001', timeout=3)
            if res.status == 200:
                print(f"Dev server is ready (status {res.status})!")
                server_ready = True
                break
        except Exception as e:
            print(f"Waiting for server... ({i+1})")
            time.sleep(1.5)

    if not server_ready:
        print("Server did not become ready in time.")
        proc.terminate()
        return

    print("Launching Playwright to visually verify header and logo...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        
        # 1. Desktop Viewport (1280x800)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto('http://localhost:3001', wait_until='networkidle')
        page.wait_for_timeout(2000)
        
        # Capture header screenshot
        header_el = page.locator('header')
        header_el.screenshot(path='header_desktop_live.png')
        
        # Full hero screenshot
        page.screenshot(path='page_desktop_live.png')
        print("Desktop screenshot captured: header_desktop_live.png and page_desktop_live.png")

        # 2. Mobile Viewport (390x844 - iPhone 14 Pro)
        page_mobile = browser.new_page(viewport={'width': 390, 'height': 844})
        page_mobile.goto('http://localhost:3001', wait_until='networkidle')
        page_mobile.wait_for_timeout(2000)
        
        header_mobile_el = page_mobile.locator('header')
        header_mobile_el.screenshot(path='header_mobile_live.png')
        page_mobile.screenshot(path='page_mobile_live.png')
        print("Mobile screenshot captured: header_mobile_live.png and page_mobile_live.png")

        browser.close()

    proc.terminate()
    print("Verification complete!")

if __name__ == '__main__':
    verify()
