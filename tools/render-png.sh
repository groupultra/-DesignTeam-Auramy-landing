#!/bin/bash
# 重新导出 PNG：两张分享卡片（og.png / og-brand.png，1200×630）和 App 图标（1024 / 512 / 180）。
# 先在另一个终端运行：node devserver.mjs（端口 5178）。需要本机装有 Google Chrome。
# 卡片的版式在 site/_render/og.html、og-brand.html 里改；图标来自 site/assets/logo/auramy-app-icon.svg。
set -e
cd "$(dirname "$0")/../site"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
shot() { "$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size="$1" --virtual-time-budget=4000 --screenshot="$2" "http://localhost:5178/_render/$3" 2>/dev/null; }

shot 1200,630 assets/img/og.png og.html
shot 1200,630 assets/img/og-brand.png og-brand.html
shot 1024,1024 assets/img/app-icon-1024.png icon.html
sips -Z 512 assets/img/app-icon-1024.png --out assets/img/app-icon-512.png >/dev/null
sips -Z 180 assets/img/app-icon-1024.png --out assets/img/app-icon-180.png >/dev/null
ls -la assets/img/*.png
