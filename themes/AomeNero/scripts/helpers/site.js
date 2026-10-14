/**
 * 与站点属性相关的辅助函数。
 *
 * @example
 *     <%- duration() %>
 *     <%- word_count(content) %>
 */
// 来自 icarus 主题
const moment = require('moment');

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
};
