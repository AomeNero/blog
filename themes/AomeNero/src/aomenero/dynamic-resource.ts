import { AomeNeroRef } from './ref';
import { SiteStatic } from './site-static';

export class AomeNeroDynamicResource<T> {
  private loaded = new AomeNeroRef(false);
  private failed: Error | null = null;
  private __data: T | null = null;
  constructor(src: Promise<T> | string, transform = (x: any) => x) {
    const label = typeof src === 'string' ? src : '(promise)';
    const promise = typeof src === 'string' ? fetch(SiteStatic.url_for(src)).then((body) => body.json()) : src;

    promise
      .then((res) => {
        this.__data = transform(res);
        this.loaded.value = true;
      })
      .catch((err) => {
        // 失败可见:记录标志、报错,并放开等待门让 data() 抛错而不是永久挂起
        this.failed = err instanceof Error ? err : new Error(String(err));
        console.error(`[AomeNero] 资源加载失败: ${label}`, err);
        this.loaded.value = true;
      });
  }
  async data() {
    await this.loaded.unitl(true);
    if (this.failed) throw new Error(`资源加载失败: ${this.failed.message}`, { cause: this.failed });
    return this.__data as T;
  }
}
