type AomeNeroWatcherFunction<T> = (res: T) => void;

export class AomeNeroRef<T> {
  private _val: T;

  private _watchers: {
    fn: AomeNeroWatcherFunction<T>;
    time: number;
  }[] = [];

  constructor(val: T) {
    this._val = val;
  }
  get value() {
    return this._val;
  }
  set value(val: T) {
    this._val = val;
    for (const watcher of this._watchers) {
      watcher.fn(val);
      watcher.time--;
    }
    this._watchers = this._watchers.filter((w) => w.time > 0);
  }

  watch(fn: AomeNeroWatcherFunction<T>, time = Infinity) {
    this._watchers.push({
      fn,
      time,
    });
  }
  watchOnce(fn: AomeNeroWatcherFunction<T>) {
    this._watchers.push({
      fn,
      time: 1,
    });
  }
  async nextVal() {
    return new Promise((res) => {
      this.watchOnce(() => res(this.value));
    });
  }
  _checkin(vals: T[]) {
    for (const val of vals) {
      if (val == null && this._val == null) return true;
      if (this._val === val) return true;
    }
    return false;
  }
  /** 直到值在 vals 中 */
  async unitl(...vals: T[]) {
    while (!this._checkin(vals)) await this.nextVal();
    return this.value;
  }
  /** 直到值不在 vals 中 */
  async unitlNot(...vals: T[]) {
    while (this._checkin(vals)) await this.nextVal();
    return this.value;
  }
}
