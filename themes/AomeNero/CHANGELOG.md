# Changelog

本文件记录 hexo-theme-AomeNero 的版本变更，格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循语义化版本（SemVer）。

## [2.1.0] - 未发布

### 新增

- 侧栏 LaoA GrokBot 动态头像（25 套表情、眨眼、果冻动作，兼容 Ajax 换页重挂载）
- 文章 banner：front-matter `banner:` 字段在标题上方渲染横幅
- banner 圆角配置化：`banner_radius`（默认 `10px`，设 `0` 恢复直角）
- 字体配置化：`_config.yml` 的 `font` 块（全局/标题/导航/文章/代码），渲染时注入 CSS 变量，`enable: false` 回落内置方案
- `asset_version` 配置：bundle 引用带版本参数，强制浏览器刷新缓存
- `tools/release.cjs` 发版打包（`npm run release` 产出含构建产物的 zip）
- CI 兼容矩阵：Hexo 6/7/8 × Node 18/20/22

### 变更

- 分享化整改：主题默认配置移除全部个人信息（备案号/社交/署名迁至站点级 `_config.AomeNero.yml` 覆盖）
- 构建钩子：改挂 `before_generate`、`hexo.theme_dir` 动态定位、`npx` 调用（不绑包管理器）、新增 `build_on_generate` 开关（默认关闭）
- package.json 规范化：构建工具移入 devDependencies、移除 `hexo-renderer-pug`（站点侧安装）、补 `engines`/`files`
- 评论系统默认全部关闭（原 valine `enable: true` + 空凭据会渲染不可用评论框）
- 页脚备案号分隔符仅在 ICP 与公安备案同时存在时显示

### 修复

- 移动端正文左溢出（右侧留白 15% 未在移动断点清零）
- 构建钩子在 Hexo 插件加载期执行、读不到主题配置的时序问题

## [2.0.0] - 2026-08-15

### 初始版本

- 由 Lhcfl 的 [Anatolo](https://github.com/Lhcfl/hexo-theme-anatolo)（MIT）fork：重命名、品牌替换、注释汉化
- Open Sans 字体本地自托管，移除 Google Fonts 外链
