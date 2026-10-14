/**
 * 导航失败的结构化错误,router 依据错误类型与状态码决定整页跳转或就地提示
 */

/** 目标页响应非 2xx */
export class HttpError extends Error {
  status: number;
  url: string;
  constructor(status: number, url: string) {
    super(`HTTP ${status}`);
    this.status = status;
    this.url = url;
  }
}

/** 目标页响应不是 HTML(如 JSON),无法作为页面替换 */
export class NotHTMLError extends Error {
  url: string;
  constructor(url: string) {
    super();
    this.url = url;
  }
}

/** 404/500 整页跳转真实错误页(dd659a3);其余状态留在当前页提示 */
export function shouldJumpToErrorPage(status: number) {
  return status === 404 || status === 500;
}
