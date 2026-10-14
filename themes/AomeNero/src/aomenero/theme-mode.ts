/**
 * 站点明暗主题的单一权威 module。
 *
 * html[theme] 属性永远是二值 'light' | 'dark';
 * 用户偏好存 localStorage['theme']:'system' | 'light' | 'dark'(缺省 system = 跟随系统)。
 *
 * 启动临界路径:layout/partial/head.pug 头部的内联脚本在 CSS 应用前按同一套
 * resolve 规则先行设置属性(不能等 bundle 加载),改动解析语义时两处必须同步。
 */
export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const PREF_KEY = 'theme'; // 沿用旧键名:老版本写入的 'light'/'dark' 恰为合法显式偏好,天然迁移

export function readPreference(): ThemePreference {
  try {
    const v = localStorage.getItem(PREF_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* localStorage 不可用(隐私模式等)时按 system */
  }
  return 'system';
}

export function writePreference(p: ThemePreference): void {
  try {
    localStorage.setItem(PREF_KEY, p);
  } catch {
    /* 写失败则偏好不持久,本次会话仍可用,不致命 */
  }
}

/** 「system = 跟随 prefers-color-scheme」的唯一编码 */
export function resolve(pref: ThemePreference, prefersDark: boolean): ResolvedTheme {
  if (pref === 'system') return prefersDark ? 'dark' : 'light';
  return pref;
}

/** 读当前生效主题;属性由内联启动脚本保证恒为二值 */
export function currentTheme(): ResolvedTheme {
  return document.documentElement.getAttribute('theme') === 'dark' ? 'dark' : 'light';
}

export function applyTheme(): void {
  document.documentElement.setAttribute('theme', resolve(readPreference(), window.matchMedia('(prefers-color-scheme: dark)').matches));
}

/** 偏好为 system 时跟随系统明暗变化;返回解绑函数 */
export function followSystem(): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => {
    if (readPreference() === 'system') applyTheme();
  };
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
