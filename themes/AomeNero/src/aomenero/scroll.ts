/**
 * 滚动策略:版式相关的滚动知识集中于此,router 只负责导航。
 * 三个常量与 .sidebar / 960px 断点的版式耦合,调整版式时同步这里。
 */
import { site } from './site';

const HEADER_OFFSET = 80; // 锚点定位时给固定导航栏预留的高度
const DESKTOP_BREAKPOINT = 960; // 桌面/移动版式分界
const SIDEBAR_MARGIN = 40; // 移动版式下滚动恢复时侧栏折叠后预留的可见高度

export function scrollToHash(hash?: string) {
  if (hash == null) hash = window.location.hash;
  if (!hash) return; // 不需要
  const sid = decodeURI(hash).slice(1);
  const go = document.getElementById(sid);
  if (go) {
    window.scrollTo({
      left: 0,
      top: go.offsetTop + ((go.offsetParent as HTMLElement)?.offsetTop || 0) - HEADER_OFFSET,
      behavior: 'smooth',
    });
  }
}

export function recoverScroll(scrollY?: number) {
  const sidebarheight = document.getElementsByClassName('sidebar')[0].clientHeight - SIDEBAR_MARGIN;
  if (!scrollY) {
    if (window.innerWidth > DESKTOP_BREAKPOINT) {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
      });
    } else {
      if (window.location.href === site.url_for('/') || window.location.href.slice(0, -1) === site.url_for('/')) {
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: 'smooth',
        });
      } else {
        window.scrollTo({
          left: 0,
          top: sidebarheight,
        });
      }
    }
  } else {
    window.scrollTo({
      left: 0,
      top: scrollY,
    });
  }
}
