# Auramy 网站

正式网站：[auramy-flax.vercel.app](https://auramy-flax.vercel.app)，品牌页在 [/brand](https://auramy-flax.vercel.app/brand)。

## 本地预览

项目不需要构建，也不要在仓库根目录运行 `npm install`。直接运行：

```sh
node devserver.mjs
```

服务默认只监听 `127.0.0.1:5178`。如需改端口，使用 `PORT=5180 node devserver.mjs`。

## 文件说明

- `site/`：可部署的静态网站；其中 `site/_render/` 保留分享图的渲染源，受 `.vercelignore` 排除，不会部署。
- `devserver.mjs`：本地静态预览服务。
- `tools/`：字标与 PNG 素材的生成工具。进入该目录后运行 `npm ci`，再按需运行 `node logos.cjs` 生成 SVG，或在项目根目录启动本地服务后运行 `tools/render-png.sh` 生成 PNG。`tools/OFL.txt` 是随附 `unbounded800.ttf` 的 SIL Open Font License 1.1。

## 部署

新克隆仓库首次手动部署时，先从 `site/` 目录绑定既有 Vercel 项目 `auramy`：

```sh
cd site
npx vercel link --yes --project auramy --scope intent9
```

之后部署：

```sh
npx vercel --prod --scope intent9
```

也可在部署命令中显式传入 `--project auramy`。若日后启用 Vercel 的 Git 集成，请将项目的 **Root Directory** 设为 `site`；当前尚未配置 Git 自动部署。
