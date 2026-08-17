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

interface GitmentConfig {
  enable: boolean;
  owner: string;
  repo: string;
  client_id: string;
  client_secret: string;
  id: string;
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
  lang?: string;
}

export interface CommentConfig {
  valine?: ValineConfig;
  gitment?: GitmentConfig;
  gitalk?: GitalkConfig;
  giscus?: GiscusConfig;
}
