# Auramy 网站

正式网站：[auramy-flax.vercel.app](https://auramy-flax.vercel.app)，品牌页在 [/brand](https://auramy-flax.vercel.app/brand)。完整交接、设计约束和 Claude 起始提示见 [HANDOFF.md](HANDOFF.md)；协作上下文见 [CLAUDE.md](CLAUDE.md)。

## GitHub 交接

当前 v8 交接分支是 `codex/auramy-claude-handoff`。在交接 PR 合并前，GitHub 的 `main` 仍是旧版本；请从该分支继续开发，或在合并后从 `main` 创建 feature branch。

```sh
git clone --branch codex/auramy-claude-handoff https://github.com/groupultra/-DesignTeam-Auramy-landing.git auramy
cd auramy
```

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

## 发布

当前通过 CLI 手动发布站点；若以后启用 Vercel Git 集成，则以该环境中的实际配置为准。只有在用户明确要求发布时，才使用已有 Vercel 配置部署 `site/`；Git 集成的 Root Directory 应为 `site`。
