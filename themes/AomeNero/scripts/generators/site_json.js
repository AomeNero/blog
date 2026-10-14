/**
 * 站点 JSON 页面生成器（供 site.ts 拉取全站索引）。
 */

function secondaryPostMapper(post) {
  if (!post) return null;
  return {
    title: post.title,
    date: post.date,
    summary: post.summary,
    slug: post.slug,
    published: post.published,
    updated: post.updated,
    _id: post._id,
    layout: post.layout,
    photos: post.photos,
    thumbnail: post.thumbnail,
    link: post.link,
    excerpt: post.excerpt,
    path: post.path,
    permalink: post.permalink,
    __post: post.__post,
  };
}
function tagOrCategoryMapper(tag) {
  return {
    name: tag.name,
    _id: tag._id,
    slug: tag.slug,
    path: tag.path,
    permalink: tag.permalink,
    posts: tag.posts?.map(secondaryPostMapper),
    length: tag.length,
  };
}

/** @param {import("hexo")} hexo */
module.exports = (hexo) => {
  hexo.extend.generator.register('site_JSON', (locals) => {
    const site = {
      pages: locals.pages.map(secondaryPostMapper),
      posts: locals.posts.map(secondaryPostMapper),
      tags: locals.tags.map(tagOrCategoryMapper),
      categories: locals.categories.map(tagOrCategoryMapper),
    };
    return {
      path: '/site.json',
      data: JSON.stringify(site),
    };
  });
};
