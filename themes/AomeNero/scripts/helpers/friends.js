/**
 * {% friends %} 标签:渲染友链卡片容器(数据来自 source/_data/friends.yml)。
 *
 * 服务端输出与旧版手写 HTML 相同的 .friend-link data-* 结构,
 * 客户端 friend-link.tsx 据此增强渲染,契约不变。
 */
const fs = require('node:fs');
const path = require('node:path');

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** @param {import("hexo")} hexo */
module.exports = (hexo) => {
  hexo.extend.tag.register('friends', function () {
    
    const data = hexo.locals.get('data');
        const friends = (data && data.friends) || [];
    if (!friends.length) {
      hexo.log.warn('{% friends %}:source/_data/friends.yml 为空或不存在');
      return '';
    }
    // 头像缺失只会在页面上静默空白,生成期就提醒;约定路径为 /images/friends/ 下
    return friends
      .map((f) => {
        const avatar = String(f.avatar || '');
        const file = path.join(hexo.source_dir, avatar.replace(/^\//, ''));
        if (!avatar.startsWith('/images/friends/')) {
          hexo.log.warn(`友链「${f.title}」头像未按 /images/friends/ 约定存放:${avatar || '(空)'}`);
        } else if (!fs.existsSync(file)) {
          hexo.log.warn(`友链「${f.title}」头像文件缺失:${avatar}`);
        }
        return `<div class="friend-link" data-avatar="${esc(avatar)}" data-href="${esc(f.href)}" data-title="${esc(f.title)}" data-description="${esc(f.description)}"></div>`;
      })
      .join('\n');
  });
};
