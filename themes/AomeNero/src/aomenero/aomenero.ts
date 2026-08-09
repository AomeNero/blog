import { AomeNeroSearch } from '../components/search';
import * as comment from './comment';
import { darkLightToggle } from './dark-light-toggle';
import { site } from './site';

async function getPageTitle() {
  return (await site.thisPage())?.title ?? document.querySelector('title')?.textContent ?? '';
}

// 用于与静态 HTML 中元素交互的类
export const AomeNero = {
  comment,
  site,
  search: new AomeNeroSearch(),
  getPageTitle,
  share: {
    native: async () => {
      window.navigator.share({
        url: window.location.href,
        text: await getPageTitle(),
        title: await getPageTitle(),
      });
    },
  },
  darkLightToggle,
};
