/**
 * 与站点属性相关的辅助函数。
 *
 * @example
 *     <%- duration() %>
 *     <%- word_count(content) %>
 *     <%- asset_version() %>
 */
// 来自 icarus 主题
const moment = require('moment');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

/** @param {import("hexo")} hexo */
module.exports = (hexo) => {
  /**
   * 导出 moment.duration
   */
  hexo.extend.helper.register('duration', (...args) => moment.duration(...args));

  /**
   * 获取一段文字的字数。
   */
  hexo.extend.helper.register('word_count', (content) => {
    const text = content.replace(/<\/?[a-z][^>]*>/gi, '').trim();
    return text ? (text.match(/[ÿ-￿]|[a-zA-Z]+/g) || []).length : 0;
  });

  // bundle 内容哈希缓存,键为两个 bundle 文件的最大 mtime(watch 模式下重编译自动失效)
  let versionCache = { key: 0, value: '' };

  /**
   * 前端 bundle 的内容哈希(sha256 前 10 位),用作静态资源版本号。
   * 重新编译 bundle 后自动变化,无需手动维护版本常量。
   */
  hexo.extend.helper.register('asset_version', () => {
    const dir = path.join(hexo.theme_dir, 'source', 'js_complied');
    const bundles = ['bundle.js', 'bundle.css'];
    const key = Math.max(...bundles.map((f) => fs.statSync(path.join(dir, f)).mtimeMs));
    if (versionCache.key === key) return versionCache.value;
    const hash = bundles.reduce((h, f) => h.update(fs.readFileSync(path.join(dir, f))), crypto.createHash('sha256'));
    versionCache = { key, value: hash.digest('hex').slice(0, 10) };
    return versionCache.value;
  });
};
