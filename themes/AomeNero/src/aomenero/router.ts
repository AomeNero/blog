import { AomeNeroRef } from './ref';
import { site } from './site';
import { recoverScroll, scrollToHash } from './scroll';
import { loadScript } from '@/utils/load-script';
import { HttpError, NotHTMLError, shouldJumpToErrorPage } from './router-errors';

type PageCache = { url: string; body: string; title: string; scrollY?: number };

const pageChangeFns: (() => void)[] = [];
const PAGE_CACHE_LIMIT = 30;
const pageCaches = new Map<string, PageCache>();
const animating = new AomeNeroRef(false);
const loading = new AomeNeroRef(false);

function initialize() {
  window.history.scrollRestoration = 'manual';
  window.addEventListener('DOMContentLoaded', () => {
    handlePage();
  });
  window.addEventListener(
    'popstate',
    (event) => {
      event.preventDefault();
      routeTo(window.location.href, false);
    },
    false,
  );
  makeLink();
}

function isThisSite(url?: string) {
  if (!url) return false;
  url += '/';
  return url.startsWith(site.root.href) || url.startsWith(site.base);
}

function getThisPageCache() {
  return {
    url: document.location.href,
    body: document.getElementsByTagName('main-outlet')[0].innerHTML,
    title: document.title,
    scrollY: window.scrollY,
  };
}

function setPageCache(url: string, cache: PageCache) {
  pageCaches.set(url, cache);
  // 有界缓存:超出上限淘汰最早写入的条目,长会话内存不再无界
  while (pageCaches.size > PAGE_CACHE_LIMIT) {
    const oldest = pageCaches.keys().next().value;
    if (oldest === undefined) break;
    pageCaches.delete(oldest);
  }
}

function cacheThisPage() {
  setPageCache(document.location.href, getThisPageCache());
}

function updatePageCache(state: PageCache) {
  const had = pageCaches.get(state.url);
  if (had) {
    Object.assign(had, state);
  } else {
    setPageCache(state.url, state);
  }
}

function showLoadingAnimation() {
  animating.value = true;
  setTimeout(() => {
    animating.value = false;
  }, 250);
}

async function withLoading(handler: () => Promise<void>) {
  loading.value = true;
  showLoadingAnimation();
  const mainEl = document.querySelector('.main.animated');
  mainEl?.classList.add('fadeOutDown');
  mainEl?.classList.remove('fadeInDown');

  await handler();

  const mainEl2 = document.querySelector('.main.animated');
  mainEl2?.classList.remove('fadeOutDown');
  mainEl2?.classList.add('fadeInDown');
  loading.value = false;
}

async function queryPageData(link: string) {
  const cached = pageCaches.get(link);
  if (cached) return cached;
  const res = await fetch(link);
  if (!res.ok) {
    // 非 2xx 带上状态码抛出,routeTo 据此决定整页跳转或就地提示
    throw new HttpError(res.status, link);
  }
  const text = await res.text();
  const body = text.match(/<main-outlet>([\s\S]*)<\/main-outlet>/)?.[1];
  if (!body) {
    throw new NotHTMLError(link);
  }
  const head = text.match(/<head>([\s\S]*)<\/head>/)?.[1];
  let title = head?.match(/<title>([\s\S]*)<\/title>/)?.[1];
  title ??= document.title;
  return { url: link, body, title };
}

/**
 * 切换页面
 */
async function replacePageContent({ body, title, url, scrollY }: PageCache, pushState = true) {
  cacheThisPage();

  await animating.until(false);

  if (pushState) {
    history.pushState({ time: new Date(), url: url }, '', url);
  }

  document.querySelector('main-outlet')!.innerHTML = body;
  document.title = title;

  updatePageCache({
    url: document.location.href,
    body,
    title,
  });

  handlePage();

  recoverScroll(scrollY);
}

async function routeToNewPage(url: URL, pushState: boolean) {
  await withLoading(async () => {
    if (pushState) {
      cacheThisPage();
    }
    const res = await queryPageData(url.href);
    await replacePageContent(res, pushState);
  });
}

function handlePage() {
  scrollToHash();
  reloadScript();
  pageChangeFns.forEach((fn) => {
    try {
      fn();
    } catch (error) {
      console.error(error);
    }
  });
}

function makeLink() {
  document.addEventListener('click', (ev) => {
    // 修饰键/非左键交还浏览器默认行为(新标签打开、下载等)
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
    let target = ev.target as HTMLAnchorElement;
    while (target) {
      if (target.onclick) return;
      if (isThisSite(target.href)) {
        ev.preventDefault();
        ev.stopPropagation();
        routeTo(target.href, true);
      }
      target = target.parentNode as HTMLAnchorElement;
    }
  });
}

function onPageChange(fn: () => void) {
  pageChangeFns.push(fn);
}

function reloadScript() {
  const body_scripts = document.querySelector('main-outlet')?.getElementsByTagName('script');
  for (const script of body_scripts ?? []) {
    loadScript({
      url: script.src,
      script: script.textContent,
    });
  }
}

async function routeTo(link: string, pushState = true) {
  if (!link) return;
  if (isThisSite(link)) {
    const url = new URL(link, window.location.origin);
    if (pushState && url.pathname === window.location.pathname) {
      history.replaceState({ time: new Date() }, document.title, link);
      scrollToHash(url.hash);
    } else {
      routeToNewPage(url, pushState).catch((err: unknown) => {
        // 404/500 与非 HTML 响应整页跳转真实错误页(dd659a3);其余错误留在当前页提示
        if (err instanceof NotHTMLError || (err instanceof HttpError && shouldJumpToErrorPage(err.status))) {
          window.location.href = err.url;
          return;
        }
        console.error(err);
        alert(err);
        replacePageContent(getThisPageCache(), false);
      });
    }
  } else {
    window.location.href = link;
  }
}

initialize();

export const router = {
  onPageChange,
  routeTo,
};

