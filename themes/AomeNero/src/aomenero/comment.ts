import { CommentConfig } from '@/types/comment';
import { AomeNero } from './aomenero';
import { router } from './router';

let config: CommentConfig | null = null;

// giscus 主题跟随:站点明暗状态存于 <html theme="..."> 属性(dark-light-toggle 维护)
function resolveGiscusTheme(): string {
  const attr = document.querySelector('html')?.getAttribute('theme') ?? 'default';
  if (attr === 'dark') return 'dark';
  if (attr === 'light') return 'light';
  return 'preferred_color_scheme';
}

let siteThemeObserver: MutationObserver | null = null;

// giscus 配置 theme 留空时,监听站点明暗切换并 postMessage 热更新 iframe 主题
function observeSiteTheme() {
  if (siteThemeObserver) return;
  siteThemeObserver = new MutationObserver(() => {
    const frame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    frame?.contentWindow?.postMessage({ giscus: { setConfig: { theme: resolveGiscusTheme() } } }, 'https://giscus.app');
  });
  siteThemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['theme'] });
}

export async function load(retry = 3) {
  if (!config) return;
  const id = (await AomeNero.getPageTitle()).slice(0, 50);
  if (!id) return;
  if (config.valine?.enable && (window as any).Valine) {
    new (window as any).Valine({
      el: '#vcomments',
      notify: config.valine.notify || false,
      verify: config.valine.verify || false,
      app_id: config.valine.appid,
      app_key: config.valine.appkey,
      placeholder: config.valine.placeholder,
      path: window.location.pathname,
      serverURLs: config.valine.serverURLs,
      visitor: true,
      recordIP: true,
      avatar: config.valine.avatar,
    });
  }
  if (config.gitment?.enable && (window as any).Gitment) {
    var git_ment = {
      id,
      owner: config.gitment.owner,
      repo: config.gitment.repo,
      oauth: {
        client_id: config.gitment.client_id,
        client_secret: config.gitment.client_secret,
      },
    };
    if (config.gitment.id != '') git_ment.id = config.gitment.id;
    var gitment = new (window as any).Gitment(git_ment);
    gitment.render('gitment_container');
  }
  if (config.gitalk?.enable && (window as any).Gitalk) {
    const gitalk = new (window as any).Gitalk({
      clientID: config.gitalk.client_id,
      clientSecret: config.gitalk.client_secret,
      repo: config.gitalk.repo, // 用于存储评论的仓库,
      owner: config.gitalk.owner,
      admin: [config.gitalk.owner],
      id, // 保证唯一性且长度小于 50
      distractionFreeMode: false, // 类似 Facebook 的免打扰模式
    });
    gitalk.render('gitalk_container');
  }
  if (config.giscus?.enable) {
    // giscus 无 SDK render() 接口,嵌入方式就是往容器塞带 data-* 的 script,由其自替换为 iframe
    // Ajax 换页/缓存回退时容器是全新的,每次挂载前清空重建即可
    const container = document.querySelector('.giscus-container');
    if (container) {
      container.innerHTML = '';
      const g = config.giscus;
      const s = document.createElement('script');
      s.src = 'https://giscus.app/client.js';
      s.async = true;
      s.crossOrigin = 'anonymous';
      const attrs: Record<string, string> = {
        'data-repo': g.repo,
        'data-repo-id': g.repo_id,
        'data-category': g.category,
        'data-category-id': g.category_id,
        'data-mapping': g.mapping || 'pathname',
        'data-strict': '0',
        'data-reactions-enabled': String(g.reactions_enabled ?? 1),
        'data-emit-metadata': '0',
        'data-input-position': g.input_position || 'bottom',
        // 配置 theme 留空则跟随站点明暗(含切换时 postMessage 热更新),填值则固定
        'data-theme': g.theme || resolveGiscusTheme(),
        'data-lang': g.lang || 'zh-CN',
      };
      for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
      container.appendChild(s);
      if (!g.theme) observeSiteTheme();
    }
  }
}

router.onPageChange(() => load().catch(() => {}));

export function setConfig(conf: CommentConfig) {
  config = conf;
}
