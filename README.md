# AomeNero's Blog

> AomeNero 的个人博客 —— 基于 Hexo + 自用 AomeNero 主题。

## 简介

本仓库是 AomeNero 的个人博客站点源码。静态站点由 [Hexo](https://hexo.io/) 生成,包管理器使用 **pnpm**,前端使用自用的 **AomeNero** 主题(vendored 在仓库内,含完整源码与构建脚本)。

线上地址:<https://www.aomenero.com>

## 环境要求

| 依赖 | 版本 | 说明 |
|------|------|------|
| Node.js | ≥ 20.19 | Hexo 8 的硬性要求(以 `node -v` 确认) |
| pnpm | 较新版本即可 | `npm i -g pnpm` 安装;本项目**勿用 npm**,`hexo init` 时自动选用了 pnpm |

## 技术栈

| 层 | 选型 |
|----|------|
| 站点生成 | Hexo 8(实测 8.1.2) |
| 包管理 | pnpm |
| 主题 | AomeNero(`themes/AomeNero`,v2.1.0,vendored) |
| 模板 | Pug |
| 样式 | SCSS |
| 前端脚本 | TypeScript + TSX,由 Rollup + SWC 打包 |
| 搜索 | Fuse.js(本地模糊搜索) |
| 评论 | Giscus(主题另支持 Valine / Gitalk 等) |
| 部署 | hexo-deployer-ftpsync(FTP 全量上传)→ 阿里云 ECS + Nginx 静态托管 + HTTPS |

## 目录结构

```
blog/
├── _config.yml              # 站点配置(不入库!含部署凭据,首次需从 example 复制)
├── _config.example.yml      # 站点配置脱敏模板(入库,克隆后复制为 _config.yml)
├── source/                  # 站点内容
│   ├── _posts/              # 文章(Markdown)
│   ├── about/index.md       # 关于页(page 布局)
│   ├── links/index.md       # 友链页(page 布局)
│   ├── images/              # 图片资源(banner-1~20.webp 为现成文章 banner 图库)
│   └── 403/404/502.html     # 自包含错误页(skip_render 原样输出,不套主题布局)
├── themes/AomeNero/         # 主题(vendored 在仓库内)
│   ├── _config.yml          # 主题配置(入库)
│   ├── layout/              # Pug 模板
│   ├── src/                 # TS / TSX / SCSS 源码(需构建)
│   ├── source/              # 静态资源(js_complied/ 为构建产物,不入库)
│   ├── includes/            # Hexo 脚本(generators / helpers / tasks)
│   ├── languages/           # i18n(zh-cn 为中文)
│   ├── README.md            # 主题文档(特性 / 安装 / 配置 / 开发 / 发版)
│   └── CHANGELOG.md         # 主题变更记录
├── scaffolds/               # hexo new 模板(post / draft / page)
├── 部署教程.md              # 服务器首次搭建全流程(Nginx / 域名 / HTTPS)
└── README.md
```

## 首次搭建(新机器克隆后)

```bash
# 0. 复制站点配置(_config.yml 不入库,缺了跑不起来)
cp _config.example.yml _config.yml
#    → 按需修改 title / url / language,deploy 段填真实 FTP 信息

# 1. 安装站点依赖
pnpm install

# 2. 安装并构建主题(必须!主题 bundle 是构建产物且不入库)
pnpm --dir themes/AomeNero --ignore-workspace install
pnpm --dir themes/AomeNero --ignore-workspace build

# 3. 生成并启动本地预览
hexo generate
hexo server            # → http://localhost:4000
```

> ⚠️ 跳过第 2 步页面会没有样式/脚本(`js_complied/bundle.{js,css}` 被 gitignore);跳过第 0 步 `hexo` 直接报错。

## 配置文件

配置分两层,职责不同:

| 文件 | 是否入库 | 职责 |
|------|----------|------|
| `_config.yml`(站点根) | ❌ gitignore | 站点级配置 + **部署凭据**(deploy 段含 FTP 明文密码,这是不入库的原因) |
| `_config.example.yml` | ✅ | 上一行的脱敏模板,deploy 段为 `<占位符>`,克隆后复制改名为 `_config.yml` |
| `themes/AomeNero/_config.yml` | ✅ | 主题全部配置(menu / social / font / 评论 / toc 等,每项有中文注释) |
| `_config.AomeNero.yml`(站点根,可选) | ❌ gitignore | 主题配置的站点级覆盖:把主题配置项写到这里可免改主题文件(便于主题升级时保留自定义) |

> 改动 `themes/AomeNero/_config.yml` 只影响模板渲染,改完 `hexo generate/server` 即生效;**不需要**重新构建主题前端。只有改 `themes/AomeNero/src/`(TS/TSX/SCSS 源码)才需要重新 build。

## 写作

### 新建文章

```bash
pnpm exec hexo new "文章标题"     # 生成 source/_posts/文章标题.md
```

front-matter 常用字段(以实际文章为例):

```yaml
---
title: 起始页          # 标题
date: 2026-08-09       # 日期(hexo new 自动填)
tags: 随笔             # 标签,可多个(YAML 列表)
categories: 技术       # 分类,可多个
banner: /images/banner-2.webp   # 文章 banner,标题上方渲染;省略则无 banner
comments: false        # 关闭本页评论(默认开启)
desc: 一句话描述        # 用于 about / links 等页面的描述行
---
```

`source/images/banner-1.webp` ~ `banner-20.webp` 是 20 张现成 banner 图,直接写 `banner: /images/banner-N.webp` 即可复用;也可放自己的图进 `source/images/`。

### 草稿流程

| 操作 | 命令 |
|------|------|
| 新建草稿 | `pnpm exec hexo new draft "标题"`(存到 `source/_drafts/`,不会发布) |
| 预览草稿 | `hexo server --draft` |
| 发布为正式文章 | `pnpm exec hexo publish "标题"` |

### 自定义页面

在 `source/<名字>/index.md` 新建(front-matter 至少写 `title`,布局用 `page`),如 `about`、`links`。归档 / 标签 / 分类页由 Hexo 插件自动生成,无需手建。

友链卡片:在友链页正文写如下 div(每张卡一个),前端 JS 自动渲染:

```html
<div class="friend-link"
     data-avatar="头像URL"
     data-href="主页URL"
     data-title="站点名"
     data-description="一句话介绍"></div>
```

## Hexo 常用命令

本项目用 pnpm 管理,Hexo 命令通过 `pnpm exec hexo ...` 运行(也可用 `npx hexo ...`)。`package.json` 里预置了几个快捷脚本(用 `pnpm <脚本名>` 调用):

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

> **日常写作流程**:写/改文章 → `pnpm server` 预览(自动刷新)→ 满意后 `pnpm run build` 生成 → `pnpm run deploy` 发布(见下文「部署」)。

## 主题说明(AomeNero)

主要特性:明暗模式切换、Ajax 无刷新切页、模糊搜索框、文章目录(TOC)、评论系统(Giscus / Valine / Gitalk 等)、标签云、多语言、友链卡片、移动端适配、侧栏动态头像、文章 banner、字体配置化等。主题源码注释已汉化(技术术语保留英文)。更多细节见 [themes/AomeNero/README.md](./themes/AomeNero/README.md) 与 [CHANGELOG.md](./themes/AomeNero/CHANGELOG.md)。

几个实用配置项(均在主题 `_config.yml`):

- `build_on_generate: false` — 设 `true` 后 `hexo generate/server` 会自动编译主题前端(需先在主题目录装依赖),改主题源码时省去手动 build;日常写作保持 `false`
- `asset_version: 18` — **修改主题前端并重新 build 后必须 +1**,强制访客浏览器拉取新 bundle,否则可能看到旧样式
- `tocMaxDepth: 6` — 文章目录层级,设 `0` 关闭目录
- `useSummary: false` — 开启后预览摘要改为自动生成,而非正文的 `<!-- more -->` 截断
- `font` 块 — 全局/标题/导航/文章/代码字体,`enable: false` 回落内置方案

修改主题前端(`themes/AomeNero/src/`)后的标准动作:

```bash
pnpm --dir themes/AomeNero --ignore-workspace build
# 然后把主题 _config.yml 的 asset_version 加一
```

## 错误页

`source/403.html`、`404.html`、`502.html` 是三个自包含错误页(单文件内联 CSS/SVG/JS,基于侧栏同款表情角色,视线跟随鼠标/自动游走/点击换表情,明暗跟随博客主题):

- 本地预览:`hexo s` 后直接访问 `http://localhost:4000/404.html`(Hexo 本身不产生这些状态码,要看真实触发效果直接开文件即可)
- 线上生效:需 Nginx `error_page` 配置,见 [部署教程.md](./部署教程.md)
- 站点 `_config.yml` 的 `skip_render` 已排除这三个文件,保证原样输出不套主题布局

## 部署

### 日常发布(服务器已搭好)

```bash
pnpm run clean       # 清理旧产物与缓存,防已删页面残留
pnpm run generate    # 生成静态文件到 public/
pnpm run deploy      # hexo-deployer-ftpsync 通过 FTP 全量上传 public/ 到 ECS
```

- 部署目标在站点 `_config.yml` 的 `deploy` 段(ftpsync:主机 / 用户 / 密码 / 端口 / 远程目录),**不入库**,脱敏模板见 [`_config.example.yml`](./_config.example.yml)
- ⚠️ `clear: true` 会在上传前**清空远程目录全部文件**,当前刻意保持开启(FTP 根目录只放博客),勿随意改动
- git 提交/推送与发布是两回事,按需单独进行

### 首次服务器搭建

从零配置 ECS(Nginx 安装与配置、安全组、`public/` 手动上传、域名解析、HTTPS 证书)的完整教程见 [部署教程.md](./部署教程.md)。

## 常见问题

| 现象 | 原因与解法 |
|------|-----------|
| 克隆后 `hexo` 报错跑不起来 | 没复制 `_config.yml` → 见「首次搭建」第 0 步 |
| 页面没样式/脚本 | 主题没构建 → 跑 `pnpm --dir themes/AomeNero --ignore-workspace build` |
| 改了主题源码不生效 | 重新 build **并把 `asset_version` 加一** |
| 出现缓存怪问题 / 删掉的页面还在 | 先 `pnpm run clean` 再 generate |
| `hexo: command not found` | 用 `pnpm exec hexo ...` 而非裸 `hexo` |
| 部署后线上还是旧内容 | 确认走了 clean → generate → deploy 全流程;浏览器侧 Ctrl+F5 |

## 许可

- 站点内容(文章等):CC-BY-SA-3.0
- AomeNero 主题:MIT(详见 `themes/AomeNero/LICENSE`)

---

Author: **AomeNero** · <yotianya@foxmail.com> · <https://github.com/AomeNero/blog>
