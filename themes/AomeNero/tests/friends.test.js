import { describe, expect, it } from 'vitest';
const { buildFriendCards, findFriendProblems } = require('../scripts/helpers/friends');

const card = (overrides = {}) => ({
  avatar: '/images/friends/a.png',
  href: 'https://example.com',
  title: '示例',
  description: '示例站点',
  ...overrides,
});

describe('friends.buildFriendCards', () => {
  it('输出与手写时代的 data-* 结构一致', () => {
    const html = buildFriendCards([card()]);
    expect(html).toBe(
      '<div class="friend-link" data-avatar="/images/friends/a.png" data-href="https://example.com" data-title="示例" data-description="示例站点"></div>',
    );
  });

  it('属性值中的 HTML 特殊字符被转义', () => {
    const html = buildFriendCards([card({ title: 'a"&<b>', description: 'x&y' })]);
    expect(html).toContain('data-title="a&quot;&amp;&lt;b&gt;"');
    expect(html).toContain('data-description="x&amp;y"');
    expect(html).not.toContain('a"&<b>');
  });

  it('多张卡片逐行输出', () => {
    const html = buildFriendCards([card(), card({ title: 'B' })]);
    expect(html.split('\n')).toHaveLength(2);
  });
});

describe('friends.findFriendProblems', () => {
  it('约定路径且文件存在 → 无问题', () => {
    expect(findFriendProblems([card()], () => true)).toEqual([]);
  });

  it('文件缺失 → 报缺失', () => {
    const problems = findFriendProblems([card()], () => false);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('头像文件缺失');
  });

  it('未按约定存放(含空 avatar)→ 报约定问题', () => {
    const problems = findFriendProblems([card({ avatar: 'logo.png', title: 'X' }), card({ avatar: '', title: 'Y' })], () => true);
    expect(problems).toHaveLength(2);
    expect(problems[0]).toContain('未按 /images/friends/ 约定');
    expect(problems[0]).toContain('X');
    expect(problems[1]).toContain('Y');
  });
});
