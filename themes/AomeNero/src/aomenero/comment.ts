import { CommentConfig } from '@/types/comment';
import { AomeNero } from './aomenero';
import { router } from './router';

let config: CommentConfig | null = null;

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
}

router.onPageChange(() => load().catch(() => {}));

export function setConfig(conf: CommentConfig) {
  config = conf;
}
