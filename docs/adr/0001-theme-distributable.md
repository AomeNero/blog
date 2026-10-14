# 0001 - 主题定位：可分发

日期：2026-10-14 · 状态：已接受

## 背景

`themes/AomeNero`（源自 Anatolo）深度个人化后被再次用于分享给他人。架构评审需决定按「纯个人自用」还是「可分发主题」演进。

## 决定

按**可分发主题**演进，同时保留站点的个人覆盖层：

- `themes/AomeNero/_config.yml` 是唯一模板：全部配置项 + 干净默认值，**不含任何个人信息**
- 个人信息只写在站点根目录 `_config.AomeNero.yml`（Hexo 5+ 覆盖机制，不入库），升级主题时零冲突
- 不维护 `_config.example.yml`——两份 90% 相同的文件必然漂移（已删除）
- 评论系统只保留活跃方案：giscus / gitalk / valine / disqus（duoshuo / gentie / youyan / gitment 已删）

## 后果

- 分发前检查清单：主题 `_config.yml` 不含个人信息、`git log` 无敏感键
- 面向「其他用户」的功能决策以活跃服务为准，不为死服务保留兼容代码
- 未来架构评审按可分发假设进行，不再重新讨论本定位
