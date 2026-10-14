import { describe, expect, it } from 'vitest';
import { HttpError, NotHTMLError, shouldJumpToErrorPage } from '../src/aomenero/router-errors';

// dd659a3 spec:「404/500 带状态码抛出并整页跳转真实错误页」
describe('shouldJumpToErrorPage', () => {
  it('404/500 整页跳转真实错误页', () => {
    expect(shouldJumpToErrorPage(404)).toBe(true);
    expect(shouldJumpToErrorPage(500)).toBe(true);
  });

  it('其余状态留在当前页提示,不跳转', () => {
    expect(shouldJumpToErrorPage(403)).toBe(false);
    expect(shouldJumpToErrorPage(502)).toBe(false);
    expect(shouldJumpToErrorPage(200)).toBe(false);
  });
});

describe('导航错误类型', () => {
  it('HttpError 携带状态码与目标 URL', () => {
    const err = new HttpError(500, '/some/page/');
    expect(err.status).toBe(500);
    expect(err.url).toBe('/some/page/');
    expect(err.message).toBe('HTTP 500');
    expect(err instanceof Error).toBe(true);
  });

  it('NotHTMLError 携带目标 URL', () => {
    const err = new NotHTMLError('/some/page/');
    expect(err.url).toBe('/some/page/');
    expect(err instanceof Error).toBe(true);
  });
});
