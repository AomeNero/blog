# 0002 - html[theme] 属性二值化

日期：2026-10-14 · 状态：已接受

## 背景

明暗主题的三态值域 `default | light | dark`（`default` = 跟随系统）曾分散编码于三处：SCSS 选择器 + 媒体查询、`dark-light-toggle.ts`（内含 `'true'` 笔误）、`comment.ts` 的 giscus 主题映射。「跟随系统」语义靠两侧各自的 `matchMedia`/`@media` 重复实现。

## 决定

**删除三态概念本身**，`html[theme]` 属性永远是二值 `light | dark`：

- 用户偏好存 `localStorage['theme']`：`system | light | dark`（缺省 `system`；旧版写入的 `light`/`dark` 恰为合法显式偏好，天然迁移）
- `src/aomenero/theme-mode.ts` 是「system = 跟随 prefers-color-scheme」的唯一权威编码
- `head.pug` 头部内联脚本在样式表应用前按同一 resolve 规则先行设置属性（防闪烁，不能等 bundle）——与 `theme-mode.ts` 的 `resolve()` **必须成对修改**
- 偏好为 system 时由 `followSystem()` 监听系统变化并重设属性
- SCSS 只有 `html[theme='dark']` / `html[theme='light']` 两个选择器

## 后果

- 禁用 JS 的访客失去暗色跟随：服务端按 `defaultTheme` 给出二值猜测（`default`/`light` → light，`dark` → dark）。本主题搜索/评论强依赖 JS，该取舍可接受（**load-bearing**：不要为 no-JS 恢复 CSS 层三态）
- 改 resolve 语义时，`head.pug` 内联脚本与 `theme-mode.ts` 两处同步——这是有意接受的少量重复，换取消灭 CSS 层的 `default` 状态
- 下游用户写自定义配色只需两个选择器，无需理解媒体查询叠加
