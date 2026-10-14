# CONTEXT.md — 领域词汇表

本仓库的领域概念与一致用法。工程技能探索代码库前先读这里；产出中命名领域概念时使用这里的术语，不要发明同义词。

## 词汇

- **友链卡片**：友链页的一张卡片。数据唯一来源是 `source/_data/friends.yml`，由 `{% friends %}` 标签在服务端渲染出 `.friend-link[data-*]` 结构，客户端 `friend-link.tsx` 将其增强为完整卡片。头像约定路径 `/images/friends/`，生成期校验缺失并告警。
- **主题偏好**：用户对明暗的选择，存 `localStorage['theme']`，取值 `system | light | dark`。权威逻辑在 `themes/AomeNero/src/aomenero/theme-mode.ts`（见 ADR-0002）。
- **生效主题**：偏好解析后的二值结果，恒为 `html[theme]` 属性上的 `light | dark`。「跟随系统」在 CSS 层不存在。
- **资产版本**：前端 bundle 的内容哈希（`asset_version` helper，sha256 前 10 位），用作 `?v=` 缓存参数。没有手动版本号（见 `themes/AomeNero/scripts/helpers/site.js`）。
- **评论系统**：支持 giscus / gitalk / valine / disqus 四套。配置经 `comments.pug` 注入客户端，键集与 `src/types/comment.d.ts` 严格一致。
- **个人覆盖**：`_config.AomeNero.yml`（站点根，不入库）对主题默认值的同名键覆盖，是个人信息的唯一存放处（见 ADR-0001）。

## 布局约定

- 领域决策记录在 `docs/adr/`；issue 与规格见 `docs/agents/issue-tracker.md`。
