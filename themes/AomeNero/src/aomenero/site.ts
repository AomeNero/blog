import type { Site, WebPage } from '@/types/site';
import { AomeNeroDynamicResource } from './dynamic-resource';
import { SiteStatic } from './site-static';

const urlMap = new Map<string, WebPage>();
const siteData = new AomeNeroDynamicResource<Site>('site.json');

siteData.data().then((data) => {
  for (const key of ['pages', 'posts', 'tags', 'categories'] as const) {
    for (const page of data[key] ?? []) {
      const prettyPath = page.path?.replaceAll('index.html', '') || '';
      urlMap.set(prettyPath, page);
    }
  }
});

export const site = {
  ...SiteStatic,

  data() {
    return siteData.data();
  },

  thisPageUrl() {
    let path = window.location.pathname;
    if (path.startsWith('/')) path = path.slice(1);
    if (path.slice(-1) !== '/') path += '/';
    path = decodeURI(path);
    return path;
  },

  async thisPage() {
    await site.data();
    return urlMap.get(site.thisPageUrl());
  },
};

/** 当前页标题:优先取 site.json 里的,退回 <title>。供评论与分享使用(comment 无需依赖 facade)。 */
export async function getPageTitle() {
  return (await site.thisPage())?.title ?? document.querySelector('title')?.textContent ?? '';
}
