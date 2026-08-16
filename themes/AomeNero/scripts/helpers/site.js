/**
 * 与站点属性相关的辅助函数。
 *
 * @example
 *     <%- is_same_link(url_a, url_b) %>
 *     <%- get_domain(url) %>
 *     <%- post_count() %>
 *     <%- category_count() %>
 *     <%- tag_count() %>
 *     <%- duration() %>
 *     <%- word_count(content) %>
 *     <%- md5(data) %>
 */
// 来自 icarus 主题
const URL = require('node:url').URL;
const moment = require('moment');
const crypto = require('node:crypto');

/** @param {import("hexo")} hexo */
module.exports = (hexo) => {
  hexo.extend.helper.register('is_same_link', function (a, b) {
    function santize(url) {
      let paths = url
        .replace(/(^\w+:|^)\/\//, '')
        .split('#')[0]
        .split('/')
        .filter((p) => p.trim() !== '');
      if (paths.length > 0 && paths[paths.length - 1].trim() === 'index.html') {
        paths = paths.slice(0, paths.length - 1);
      }
      return paths.join('/');
    }
    return santize(this.url_for(a)) === santize(this.url_for(b));
  });

  hexo.extend.helper.register('get_domain', (link) => {
    const url = new URL(link);
    return url.hostname;
  });

  hexo.extend.helper.register('post_count', function () {
    return this.site.posts.length;
  });

  hexo.extend.helper.register('category_count', function () {
    return this.site.categories.filter((category) => category.length).length;
  });

  hexo.extend.helper.register('tag_count', function () {
    return this.site.tags.filter((tag) => tag.length).length;
  });

  /**
   * 导出 moment.duration
   */
  hexo.extend.helper.register('duration', (...args) => moment.duration(...args));

  /**
   * 获取一段文字的字数。
   */
  hexo.extend.helper.register('word_count', (content) => {
    const text = content.replace(/<\/?[a-z][^>]*>/gi, '').trim();
    return text ? (text.match(/[\u00ff-\uffff]|[a-zA-Z]+/g) || []).length : 0;
  });

  hexo.extend.helper.register('md5', (data) => crypto.createHash('md5').update(data).digest('hex'));
};
