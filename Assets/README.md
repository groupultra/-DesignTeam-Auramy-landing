# Auramy 素材包

本文件夹按页面中的虚拟 persona 和共享场景整理，便于在 Finder 中浏览与交接。所有 JPEG 与 `album-sources.json` 都是从站点或用户提供文件的**逐字节副本**；仅交付文件名为了辨识而调整，未重新导出、裁切、压缩或生成图像。具体来源、字节数与 SHA-256 在 [MANIFEST.md](MANIFEST.md) 中。

## 文件夹说明

- `Mia_PersonalWorld`：Mia 的编辑肖像与个人世界中使用的自拍、镜像、朋友照片。
- `Lu_CatDiary`、`Noah_SkateCrew`、`Jay_ArtAndOC`、`Ava_OutdoorClub`、`Zara_ReadingCorner`、`Eli_FilmDiary`：每位 persona 的站内肖像、头像及社交／世界场景图；Jay 另含 Sora 原创角色图。
- `Miso_DogWorld`：Miso 宠物页面图。
- `Brand`：用户本次提供的原始 JPG logo 副本；没有收录旧版应用图标或其他旧品牌图标。
- `Shared_Albums`：三张实际音乐专辑封面，以及站点随附的 `album-sources.json` 来源记录。
- `Shared_Visitors`：访客浏览个人网站的三张轮播图。

## 实用来源说明

- `Brand/auramy-logo-supplied-original.jpg` 是本次用户提供 JPG 的原样副本。
- 各 persona、Mia、Miso、访客与 Sora 图片均为站点当前使用的现有示例素材；对应生成记录在 `../Image_Provenance/` 的六份 JSON 中。
- `Shared_Albums` 是三张实际音乐专辑封面；原站点的标题、艺人和来源链接保存在 `album-sources.json`。

运行时只使用 `site/assets/img/`。本目录和 `Image_Provenance/` 是版本化的交接资料，不是构建输入，也不依赖任何本机生成目录。
