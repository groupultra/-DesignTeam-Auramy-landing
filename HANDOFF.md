# Auramy v8 — GitHub / Claude 交接

交接日期：2026-10-07。

## 从 GitHub 开始

仓库：<https://github.com/groupultra/-DesignTeam-Auramy-landing>

本次交接的最新分支是 `codex/auramy-claude-handoff`，以 v8 页面提交 `a604db9f1c2eed074cbae6cf61da76ae0b2fb768` 为基础，并在其上加入本说明、素材副本和来源记录。交接 PR 合并前，`main` 仍是旧版本；请从交接分支继续，或在合并后从 `main` 创建新的 feature branch。

```sh
git clone --branch codex/auramy-claude-handoff https://github.com/groupultra/-DesignTeam-Auramy-landing.git auramy
cd auramy
node devserver.mjs
```

浏览器打开 `http://127.0.0.1:5178`。端口被占用时使用 `PORT=5180 node devserver.mjs`。这是纯静态站点：根目录没有应用依赖、构建步骤、数据库、环境变量或模型 API。已用 Node 22.14.0 验证；不要求固定该版本。`tools/` 仅供维护旧字标和 PNG 工具时使用；需要时在 `tools/` 内运行 `npm ci`。

给 Claude 的起始提示：

> 阅读 `CLAUDE.md` 和 `HANDOFF.md`，在新的 feature branch 上完成我提出的 Auramy 改动。保留 v8 的页面结构和设计决定；先运行相关检查，再让独立 reviewer 审查完整 diff，最后提交、推送并通过 PR 交付。不要直接改 main、强推、重置或部署，除非我明确要求。

## 页面和代码地图

| 文件/区块 | 用途 |
| --- | --- |
| `site/index.html` | 首页、SEO 元数据、资源加载顺序 |
| `site/assets/css/tokens.css` | 基础颜色、字体与布局变量 |
| `site/assets/css/material-v8.css` | v8 奶油机壳、蓝屏、纸张/金属等材质；最后加载 |
| `site/assets/css/last-calm.css` | v7 手机交互和可读性调整 |
| `site/assets/js/landing.js` | 初始化、名字同步、claim 演示、留言、小游戏和 aura |
| `site/assets/js/worlds-scroll.js` | `#spaces` 单部手机、五种世界、滚动与底部菜单同步 |
| `site/assets/js/how-scroll.js` | `#how` 单部手机、四步 Next/Back 演示 |
| `site/assets/js/made.js` / `for-previews.js` | 社交资料及其打开的个性网站预览 |
| `site/assets/js/ending-scenes.js` | `#notify` 访客照片、持续 iOS 通知和动效状态 |
| `site/brand/index.html` | 既有品牌资料页，不是 v8 首页入口 |

更改页面前先检查实际 DOM 与 `index.html` 的资源顺序。不要因为旧模块名称提到已删除区块就删文件：例如 `made.js` 仍调用 `for-previews.js`。

## 设计方向

Logo 原图副本在 `Assets/Brand/auramy-logo-supplied-original.jpg`，运行时使用同内容的 `site/assets/img/brand/auramy-monitor.jpg`。保持其正方形比例。

视觉从 Logo 提取奶油塑料、蓝色 LED、手绘笑脸和像素 UI，并让纸张、金属、唱片等材质共存。网站应当有 quirky 的个人互联网气质，不能变成公司官网或 SaaS 模板；同时要保持页面可读、可触控，避免密集小字、闪烁和过强动效。

- 保留真人、宠物、OC 画手和表格等不同类型的个人网站，不要让每个示例使用同一张人物图。
- 不要恢复已删除的 `#safe` 或 `#for`。
- `#how` 保持一部手机内切步骤；不要加回具象手或 SVG 手指。
- `#spaces` 保持单手机随页面滚动换内容，底部菜单跟随；不要改回横向多手机轮播。
- `#play` 保持四张正常文档流卡片；不要改回内部上下刷容器。
- `#made` 保留 Instagram、Snapchat 和链接页的多样性，强调从社交主页链接进入个人世界。
- `#notify` 保留照片背景、右下拟真锁屏手机和 iOS 风格通知。
- 保留减少动态效果和暂停控制；不要重建闪烁碎片、满屏弹跳或小字注释墙。

## Early-web 版本（`claude/auramy-early-web`）

2026-10-10 在七人设版本上重做视觉和文案：风格改为 Logo 衍生的早期互联网 + Windows XP + 手绘涂鸦，去掉孟菲斯粗描边和首页大 Logo，文案砍掉六成左右。

| 文件 | 用途 |
| --- | --- |
| `site/assets/css/early-web.css` | 整页视觉系统：XP 窗口、按钮、地址栏、涂鸦、各区块与响应式；首页只加载它和 `persona-sites.css` |
| `site/assets/js/hero-desktop.js` | Hero 桌面：窗口拖动、聚焦、最小化到任务栏、桌面图标与开始菜单；`initWeird` 是 “make it weird” 开关 |
| `site/assets/js/setup-wizard.js` | `#how` 的 XP 安装向导（取名、用途、外观、发送） |
| `site/assets/js/doodles.js` | 圆珠笔涂鸦 SVG sprite |
| `site/assets/js/made.js` | 7 个平台截图，界面本身即平台识别 |

- 人设各自的“目的”在他们的网站里体现：Maddie 的页面可切换 close friends / anyone；Marcus 有 ME / TEAM / SCOUTS；Jayden 的页面以梗图为主。
- 平台截图只模仿界面布局与配色，不使用任何平台 Logo；图标来自 Phosphor（jsDelivr，版本固定 2.1.1）。
- 字体：页面用 Shantell Sans（手写）、Pixelify Sans（像素标签）、Tahoma/Verdana（XP 界面）；人设网站沿用各自字体。

## 七人设版本（`claude/auramy-seven-personas`）

2026-10-10 在 v8 结构上换成 7 个目标用户人设（Camila、Maddie、Marcus 优先，其后 Jayden、River、Theo、Aaliyah）。人设定位来自 Lark《Auramy 目标用户分类》，示例网站是各自模板（`auramy-<name>.vercel.app`）的简化版。

| 文件 | 用途 |
| --- | --- |
| `site/assets/js/personas.js` | 7 个人设的数据：定位、矛盾、价值主张、常用社媒、引语、照片路径 |
| `site/assets/js/persona-sites.js` + `css/persona-sites.css` | 7 个模板的简化首页（cqw 尺寸，可放进手机、Hero 卡片）和资料卡打开的“招牌区块” |
| `site/assets/js/people-stories.js` | 新增 `#people`：Camila / Maddie / Marcus 三段故事与小互动 |
| `site/assets/css/personas.css` | Hero 三张卡、`#people`、7 种社媒资料卡、7 个世界的手机布局；在 material-v8 之后加载 |

- Hero 是三人的模板卡片；`#vs` 揭开的是 Maddie 的 close friends 页；`#spaces` 一部手机切换 7 个模板；`#made` 是 7 种平台（IG、Close Friends、Snapchat、Discord、carrd、Letterboxd 风格、Depop）。
- 照片来自 `Persona Photos` 文件夹，压缩为 960px JPEG 放在 `site/assets/img/personas/<name>/`；头像裁成 200px 放在 `site/assets/img/av/<name>.jpg`。各文件夹里 `artifact-*`（专辑、电影海报等）标明不得对外发布，未使用。
- 模板与人设档案有出入时（例如朋友名字），文案跟随模板，照片跟随人设档案；Maddie 的 UC Irvine 卫衣照（C02）因与模板 16 岁设定冲突未使用。

## 素材和来源

`site/assets/img/` 是网页实际引用的运行时素材。`Assets/` 是按人设整理的交接副本，便于浏览和替换；它不是运行时路径。`Assets/MANIFEST.md` 列出每份副本、对应的仓库相对来源、大小和 SHA-256。

`Image_Provenance/` 包含六份生成提示和专辑来源记录。这里的 `savedPath` 是当前仓库内的相对路径，目的是定位现有文件；它们不是构建步骤或外部文件依赖。生成图是在开发期间生成的静态文件，页面运行时不会调用 GPT 或下载生成素材。专辑封面有各自的来源说明和版权归属。

替换图片时，同步更新 `site/assets/img/` 和需要保留的交接副本，并更新 manifest 的字节数与 SHA-256。无需复制历史临时生成目录。

## 已知功能边界

- 这是 landing page 与前端交互 demo，不是完整 Auramy 应用。
- Claim 输入同步名字预览，提交显示 coming-soon；没有真实域名抢注、注册、登录或付款。
- 留言、aura、点赞、小游戏和通知是浏览器内演示；部分状态写入 localStorage/sessionStorage，没有实时多用户后端。
- 模拟的 Instagram、Snapchat 和链接页不会替用户登录或发布到这些平台。

## 验证和发布

基础检查：

```sh
git diff --check
find site/assets/js -name '*.js' -exec node --check {} \;
```

没有已配置的端到端测试套件。发布前在 320×568、375×667、390×844、1280×720 检查：步骤切换、Worlds 滚动/菜单、社交卡打开预览、四个互动示例、通知、输入框同步、动效暂停、图片加载、横向溢出和 console error。375×667 的短屏尤其要确认 Worlds 标题、手机、菜单和右下暂停按钮不会互挡。

稳定线上地址是 <https://auramy-flax.vercel.app/?v=materials-8>。当前通过 CLI 手动发布，既有 Vercel 项目为 `intent9/auramy`，部署根目录为 `site/`。`.vercel/` 和登录态不在仓库；新环境在用户明确要求发布时，先绑定既有项目，再部署：

```sh
cd site
npx vercel link --yes --project auramy --scope intent9
npx vercel deploy --prod --yes --scope intent9
```

若以后启用 Vercel Git 集成，则以该环境中的实际配置为准，且 Root Directory 应为 `site`。没有用户明确授权时，不执行部署。

后续改动使用 feature branch、检查、独立审查与 PR。不要直接改 `main`、强推、重置、删除历史或自行合并 PR。
