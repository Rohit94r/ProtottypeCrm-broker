import os
import re
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

out_dir = r'c:\Users\Vipul Naik\Downloads\ProtottypeCrm-broker-main\ProtottypeCrm-broker-main\assets\images\projects'
os.makedirs(out_dir, exist_ok=True)

def download(url, filename):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
            data = resp.read()
            filepath = os.path.join(out_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(data)
            print(f"Downloaded {filename} ({len(data)} bytes)")
            return True
    except Exception as e:
        print(f"Failed {filename}: {e}")
        return False

# Scrape surakshasmartcity.com
try:
    req = urllib.request.Request('https://surakshasmartcity.com/', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'(https?://[^\s"\'<>]+\.(?:jpg|png|webp|jpeg))', html, re.I)
        print("Matches from surakshasmartcity:", len(matches))
        for m in matches:
            if 'logo' not in m.lower() and ('gallery' in m.lower() or 'banner' in m.lower() or 'elevation' in m.lower() or 'slider' in m.lower() or 'amenities' in m.lower()):
                print("Found match:", m)
        if not os.path.exists(os.path.join(out_dir, 'suraksha_smart_city.jpg')) and matches:
            for m in matches:
                if 'logo' not in m.lower() and 'icon' not in m.lower():
                    download(m, 'suraksha_smart_city.jpg')
                    break
except Exception as e:
    print("Suraksha site error:", e)

# 2. Rustomjee Global City Virar
download('https://www.rustomjee.com/publicupload/GLOBAL_CITY_5ca4b4b123.webp', 'rustomjee_global_city.jpg')


# 3. Check and scrape Ruparel XL Kandivali
try:
    req = urllib.request.Request('https://rupareldevelopers.in/ruparel-mumbai-xl/', headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'(https?://[^\s"\'<>]+\.(?:jpg|png|webp|jpeg))', html, re.I)
        for m in matches:
            if 'banner' in m.lower() or 'elevation' in m.lower() or 'xl' in m.lower():
                download(m, 'xl_mumbai_hd.jpg')
                break
except Exception as e:
    print("Ruparel scrape:", e)



