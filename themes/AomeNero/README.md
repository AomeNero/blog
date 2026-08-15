# hexo-theme-AomeNero

A type-safe, lightweight, modern Hexo theme.

AomeNero 的个人博客主题。前端 JS 打包后仅约 40KB，加载极快。

## 特性

- 现代化前端打包（Rollup + TypeScript + TSX）
- 暗黑模式 / 明暗切换
- 文章概要、文章目录（TOC）支持
- 多语言（I18n）支持
- 可选搜索框（基于 Fuse.js 模糊搜索）
- 可选标签云
- 评论系统支持（Valine / Gitalk / Gitment 等，见 `_config.yml`）
- Ajax 无刷新切换页面，减少视觉噪音
- 移动端适配
- 文章版权声明、字数统计、社交账号、备案号、百度统计
- 侧栏动态头像（LaoA GrokBot 表情）
- 文章 banner（front-matter `banner:` 字段）
- 字体配置化（`_config.yml` 的 `font` 块，渲染时注入 CSS 变量）

## 安装

将主题放入 Hexo 博客的 `themes/AomeNero` 目录并安装依赖：

```bash
cd themes/AomeNero
pnpm i
```

在 Hexo 博客根目录安装 pug 渲染器：

```bash
pnpm add hexo-renderer-pug
```

## 配置

复制 `_config.example.yml` 为 `_config.yml`，并在 Hexo 根目录的 `_config.yml` 中设置：

```yaml
theme: AomeNero
```

## 开发

进入主题目录，安装依赖后即可构建：

```bash
pnpm i
pnpm build      # 编译 src -> source/js_complied/bundle.{js,css}
pnpm watch      # 监听 src 自动重新编译
pnpm format     # 格式化代码
```

> 构建 bundle 后记得把 `_config.yml` 的 `asset_version` 加一，
> 强制浏览器放弃旧缓存（`head.pug` 以 `?v=` 引用 bundle）。

字体配置：`_config.yml` 的 `font` 块在渲染时由 `head.pug` 注入为
`:root` CSS 变量（`--font-*`），SCSS 侧以 `var(--font-*, 内置默认值)` 消费；
`enable: false` 时全部回落内置 Open Sans 方案。

## 目录结构

- `includes` / `scripts`：主题内置的 Hexo 脚本
- `languages`：I18n 文件
- `layout`：模板，在 `hexo g` 时渲染成 HTML
- `source`：HTML 资产（含编译产物 `js_complied/`）
- `src`：前端 TypeScript 源码，由 rollup 打包为 `js_complied/bundle.js`

---

Author: **AomeNero** &lt;yotianya@foxmail.com&gt;  
License: MIT

## 致谢

- 侧栏动态头像基于 [LaoA-GrokBot](https://github.com/zhulin025/LaoA-GrokBot) 的表情数据制作（MIT License）
