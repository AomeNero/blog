/**
 * {% friends %} 标签:渲染友链卡片容器(数据来自 source/_data/friends.yml)。
 *
 * 服务端输出与旧版手写 HTML 相同的 .friend-link data-* 结构,
 * 客户端 friend-link.tsx 据此增强渲染,契约不变。
 *
 * 纯函数(buildFriendCards / findFriendProblems)导出供测试。
 */
const fs = require('node:fs');
const path = require('node:path');

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** 生成友链卡片 HTML(纯函数;fileExists 注入便于测试) */
function buildFriendCards(friends) {
  return friends
    .map(
      (f) =>
        `<div class="friend-link" data-avatar="${esc(f.avatar)}" data-href="${esc(f.href)}" data-title="${esc(f.title)}" data-description="${esc(f.description)}"></div>`,
    )
    .join('\n');
}

/** 约定校验:返回问题描述列表(空数组即通过);fileExists 注入便于测试 */
function findFriendProblems(friends, fileExists = () => true) {
  const problems = [];
  for (const f of friends) {
    const avatar = String(f.avatar || '');
    if (!avatar.startsWith('/images/friends/')) {
      problems.push(`友链「${f.title}」头像未按 /images/friends/ 约定存放:${avatar || '(空)'}`);
    } else if (!fileExists(avatar)) {
      problems.push(`友链「${f.title}」头像文件缺失:${avatar}`);
    }
  }
  return problems;
}

/** @param {import("hexo")} hexo */
module.exports = (hexo) => {
  hexo.extend.tag.register('friends', function () {
    const data = hexo.locals.get('data');
    const friends = (data && data.friends) || [];
    if (!friends.length) {
      hexo.log.warn('{% friends %}:source/_data/friends.yml 为空或不存在');
      return '';
    }
    // 头像缺失只会在页面上静默空白,生成期就提醒
    const fileExists = (avatar) => fs.existsSync(path.join(hexo.source_dir, avatar.replace(/^\//, '')));
    for (const problem of findFriendProblems(friends, fileExists)) hexo.log.warn(problem);
    return buildFriendCards(friends);
  });
};

module.exports.buildFriendCards = buildFriendCards;
module.exports.findFriendProblems = findFriendProblems;
