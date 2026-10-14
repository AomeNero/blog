interface ValineConfig {
  enable: boolean;
  notify?: boolean;
  verify?: boolean;
  appid: string;
  appkey: string;
  placeholder: string;
  serverURLs: string[];
  visitor: boolean;
  recordIP: boolean;
  avatar: string;
}

interface GitalkConfig {
  enable: boolean;
  owner: string;
  repo: string;
  client_id: string;
  client_secret: string;
  id: string;
}

interface GiscusConfig {
  enable: boolean;
  repo: string;
  repo_id: string;
  category: string;
  category_id: string;
  mapping?: string;
  reactions_enabled?: number;
  input_position?: string;
  theme?: string;
  light_theme?: string;
  dark_theme?: string;
  lang?: string;
}

export interface CommentConfig {
  valine?: ValineConfig;
  gitalk?: GitalkConfig;
  giscus?: GiscusConfig;
  asset_version?: string | number; // bundle 内容哈希(comments.pug 经 asset_version helper 注入),用于 giscus 自定义 CSS 破缓存
}
