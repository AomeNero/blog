# AomeNero's Blog

> AomeNero 的个人博客 —— 基于 Hexo + 自用 AomeNero 主题。

## 简介

本仓库是 AomeNero 的个人博客站点源码。静态站点由 [Hexo](https://hexo.io/) 生成,包管理器使用 **pnpm**,前端使用自用的 **AomeNero** 主题。该主题由 Lhcfl 的 [Anatolo](https://github.com/Lhcfl/hexo-theme-anatolo)(MIT)fork 而来,经重命名、品牌替换、注释汉化后自用。

线上地址:<https://www.aomenero.com>

## 技术栈

| 层 | 选型 |
|----|------|
| 站点生成 | Hexo 8 |
| 包管理 | pnpm(`hexo init` 自动选用,**勿用 npm**) |
| 主题 | AomeNero(`themes/AomeNero`,vendored) |
| 模板 | Pug |
| 样式 | SCSS |
| 前端脚本 | TypeScript + TSX,由 Rollup 打包 |
| 搜索 | Fuse.js |
| 部署 | 阿里云 ECS + Nginx 静态托管 + HTTPS(见 [部署教程.md](./部署教程.md)) |

## 目录结构

```
blog/
├── _config.yml              # 站点配置(title / url / language / theme 等)
├── source/                  # 站点内容
│   ├── _posts/              # 文章
│   ├── about/index.md       # 关于页
│   └── links/index.md       # 友链页
├── themes/AomeNero/         # 主题(vendored 在仓库内)
│   ├── _config.yml          # 主题配置
│   ├── layout/              # Pug 模板
│   ├── src/                 # TS / TSX / SCSS 源码(需构建)
│   ├── source/              # 静态资源(含构建产物 js_complied/,不入库)
│   ├── includes/            # Hexo 脚本(generators / helpers / tasks)
│   └── languages/           # i18n(zh-cn 为中文)
├── scaffolds/               # hexo new 模板
├── 部署教程.md
└── README.md
```

## 本地运行

```bash
# 1. 安装站点依赖
pnpm install

# 2. 构建主题(首次克隆或修改了主题源码后必须执行)
pnpm --dir themes/AomeNero --ignore-workspace install
pnpm --dir themes/AomeNero --ignore-workspace build

# 3. 启动本地预览
hexo generate 
hexo server          # → http://localhost:4000
```

> ⚠️ 主题的 `source/js_complied/bundle.{js,css}` 是构建产物且被 gitignore,**克隆后必须先跑上面的 build**,否则页面没样式/脚本。

## 写作

| 操作 | 命令 / 做法 |
|------|-------------|
| 新建文章 | `hexo new "标题"`,然后编辑 `source/_posts/标题.md` |
| 生成静态文件 | `pnpm run build`(等价 `hexo generate`) |
| 自定义页面 | 在 `source/<名字>/index.md` 新建,front-matter 至少写 `title` |
| 文章 banner | 图片放 `source/images/`,front-matter 写 `banner: /images/文件名`,文章页标题上方自动渲染 |

页面(如关于、友链)用 `page` 布局;归档 / 标签 / 分类由 Hexo 插件自动生成,无需手建。友链卡片:在友链页正文写 `<div class="friend-link" data-avatar="..." data-href="..." data-title="..." data-description="..."></div>`,前端 JS 会渲染成卡片。

## Hexo 常用命令

本项目用 pnpm 管理,Hexo 命令通过 `pnpm exec hexo ...` 运行(也可用 `npx hexo ...`)。`package.json` 里还预置了几个快捷脚本(用 `pnpm <脚本名>` 调用):

| 操作 | 命令 |
|------|------|
| 新建文章 | `pnpm exec hexo new "标题"` |
| 新建页面 | `pnpm exec hexo new page about` |
| 新建草稿 | `pnpm exec hexo new draft "标题"` |
| 把草稿发布为文章 | `pnpm exec hexo publish "标题"` |
| 生成静态文件 | `pnpm run build`(等价 `hexo generate` / `hexo g`) |
| 本地预览 | `pnpm server`(等价 `hexo server` / `hexo s`,→ http://localhost:4000,自动监听改动并刷新) |
| 清理生成物与缓存 | `pnpm run clean`(等价 `hexo clean`) |
| 部署 | `pnpm run deploy`(等价 `hexo deploy` / `hexo d`) |
| 查看 Hexo 版本 | `pnpm exec hexo version` |

> **日常写作流程**:写/改文章 → `pnpm server` 预览(自动刷新)→ 满意后 `pnpm run build` 生成。
> 若出现样式/脚本异常或缓存怪问题,先 `pnpm run clean` 再 `pnpm run build`。
> 改了主题前端源码(`themes/AomeNero/src/`)需另外 `pnpm --dir themes/AomeNero --ignore-workspace build` 重新打包。

## 主题说明(AomeNero)

主要特性:明暗模式切换、Ajax 无刷新切页、模糊搜索框、文章目录(TOC)、Gitalk 评论、标签云、多语言、友链卡片、移动端适配等。主题源码注释已汉化(技术术语保留英文)。

修改主题前端(`themes/AomeNero/src/`)后,需在主题目录重新构建:

```bash
pnpm --dir themes/AomeNero --ignore-workspace build
```

## 部署

详见 [部署教程.md](./部署教程.md):阿里云 ECS + Nginx 静态托管 + 域名解析 + HTTPS。

## 许可

- 站点内容(文章等):CC-BY-SA-3.0
- AomeNero 主题:MIT(基于 Lhcfl 的 Anatolo,详见 `themes/AomeNero/LICENSE`)

---

Author: **AomeNero** · <yotianya@foxmail.com> · <https://github.com/AomeNero/blog>
