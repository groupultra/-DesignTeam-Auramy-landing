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
- `made.js`：7 个平台截图（TikTok、Close Friends、Snapchat、Discord、Tumblr、Letterboxd、Depop）及其打开的模板区块。

## 必须保留的设计决定（early-web 版本，分支 `claude/auramy-early-web`）

- 视觉从 Logo 出发：LED 蓝屏点阵、蜡笔黄笑脸、奶油塑料、像素光标；界面借用 Windows XP Luna（蓝色标题栏、米色对话框、黄色气泡提示），涂鸦是蓝色圆珠笔线。
- 不要孟菲斯式粗黑描边；边框用 1px，阴影偏蓝且柔和。首页不放大 Logo，Logo 只在导航和页脚小尺寸出现，并保持正方形。
- 早期互联网的高饱和色（粉、荧光绿、青）只做小点缀，不能比内容抢眼；“make it weird” 是唯一的大开关，必须可点、可还原。
- 文案要短：每个区块一个标题、最多一行副标题。人设靠他们网站里的内容区分，不靠解释段落。社媒截图靠界面本身让人认出平台，不写“来自某平台”。
- 结构：Hero 桌面（三个主角窗口 + 其余四人桌面图标）、`#vs`（Maddie）、`#spaces`（单手机随滚动切换 7 个模板，XP 任务栏同步）、`#made`（7 个平台截图）、`#how`（XP 安装向导，Back/Next）、`#play`（四个窗口，正常文档流）、`#notify`、`#aura`、`#claim`。
- 保留暂停与 `prefers-reduced-motion`；glitch 只在 weird 模式里轻微出现，不做闪烁。
- 页面只加载 `early-web.css` 和 `persona-sites.css`；旧 CSS 文件仍在仓库里但首页不再引用。

## 验证与协作

- 执行 `git diff --check` 和 `find site/assets/js -name '*.js' -exec node --check {} \;`。
- 在 320×568、375×667、390×844、1280×720 检查布局和交互，尤其是短屏标题、底部菜单和暂停按钮。
- Claim、点赞、留言、小游戏、通知和 aura 都是前端演示，没有真实账号、域名注册或消息后端。
- 使用 feature branch、相关检查、独立审查和 PR；不要直接改 `main`、强推、重置、删除历史或擅自合并 PR。
