# Auramy 项目上下文

先读同目录 `HANDOFF.md`，再完成用户提出的改动。与用户用中文沟通。

## 当前 GitHub 基线

- 最新已验证页面代码为提交 `a604db9f1c2eed074cbae6cf61da76ae0b2fb768`（v8）。本交接分支在此基础上额外提交说明、素材副本和来源记录。
- GitHub 交接分支：`codex/auramy-claude-handoff`。在交接 PR 合并前，`main` 仍是旧版本；继续工作应从这个分支或已合并后的 `main` 创建 feature branch。
- 线上稳定地址：`https://auramy-flax.vercel.app/?v=materials-8`。Git 推送不代表自动部署；只有用户明确要求时才发布。
- `Assets/` 是便于交接的副本，`Image_Provenance/` 是历史来源记录。页面运行时只引用 `site/assets/img/`。

## 开发命令

- `node devserver.mjs` → `http://127.0.0.1:5178`。
- 端口被占用时：`PORT=5180 node devserver.mjs`。
- 这是静态 HTML/CSS/JS 网站；根目录不需要 `npm install`、构建、数据库或 API key。
- `tools/` 是可选字标与图片生成工具；只有维护这些工具时才运行 `cd tools && npm ci`。

## 主要入口

- `site/index.html`：首页结构与 CSS 加载顺序。
- `site/assets/css/material-v8.css`：最后加载的材质样式层。
- `site/assets/css/last-calm.css`：此前的可读性与手机调整。
- `site/assets/js/landing.js`：初始化和主交互。
- `worlds-scroll.js`、`how-scroll.js`、`ending-scenes.js`：世界滚动切换、步骤演示、访客轮播和通知。
- `made.js`、`for-previews.js`：社交资料卡和资料卡打开的示例网站。虽已删除 `#for` 区块，`for-previews.js` 仍被复用。

## 必须保留的设计决定

- Logo 是奶油色拟物电脑外壳、蓝色 LED 屏、手绘黄色笑脸和像素鼠标手；运行文件为 `site/assets/img/brand/auramy-monitor.jpg`，必须保持正方形比例。
- 页面融合奶油塑料、纸张、金属与唱片等材质，正文和大标题仍须易读；保留真人、宠物、OC、表格和不同人设网站的多样性。
- 已删除 “Come on in” (`#safe`) 和 “One for you / your best friend” (`#for`)；不要恢复。
- Play 是四张连续普通卡片；不要改回 TikTok 式嵌套滚动。
- Worlds 是一部手机随页面滚动切换五种内容，底部菜单同步；不要改回横向手机 carousel。
- 步骤区是一部手机，通过 Next/Back 切换；不要加回大手或手指。
- 通知区保持生活照片轮播，右下为 iOS 锁屏手机和持续通知。
- 避免闪烁碎片、强 glitch 和过多小号手写字；保留暂停与 `prefers-reduced-motion` 支持。
- 改 CSS 时检查 `.calm-page.raw-page` 等旧高优先级规则。旧层叠曾造成图片拉伸、伪元素失效和文字对比度问题。

## 验证与协作

- 执行 `git diff --check` 和 `find site/assets/js -name '*.js' -exec node --check {} \;`。
- 在 320×568、375×667、390×844、1280×720 检查布局和交互，尤其是短屏标题、底部菜单和暂停按钮。
- Claim、点赞、留言、小游戏、通知和 aura 都是前端演示，没有真实账号、域名注册或消息后端。
- 使用 feature branch、相关检查、独立审查和 PR；不要直接改 `main`、强推、重置、删除历史或擅自合并 PR。
