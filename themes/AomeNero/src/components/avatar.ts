import { router } from '@/aomenero/router';
// LaoA GrokBot 动态头像：每 5 秒随机切换表情，随机眨眼与果冻动作，圆形裁切。
// 注入到 sidebar 的 .logo-avatar 占位容器中，并移除静态回退 <img>。
// pjax 路由换页会整体替换 main-outlet（含 sidebar），因此除首次加载外，
// 还需在 router.onPageChange 时重新挂载；从路由缓存恢复的页面自带 .la-avatar 标记，重绑即可。
import { EXPR } from './avatar-data';

const BODY_D =
  'M228.541 114.228C228.541 130.133 225.184 145.994 218.738 160.534C212.674 174.217 203.904 186.669 193.065 196.988C155.933 232.34 99.497 238.596 55.5255 212.24C45.097 205.99 35.6851 198.072 27.7451 188.866C19.1926 178.953 12.3686 167.569 7.65781 155.351C2.60712 142.264 0 128.257 0 114.228C0 98.3219 3.35751 82.4611 9.80315 67.9215C15.8672 54.2382 24.6377 41.7862 35.4767 31.4668C72.6081 -3.88483 129.044 -10.1413 173.016 16.2153C183.444 22.4653 192.856 30.3829 200.796 39.5896C209.349 49.5018 216.173 60.8859 220.883 73.1037C225.934 86.1906 228.541 100.198 228.541 114.228Z';

const SVG_MARKUP = `
<svg viewBox="-28 -28 285 285" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="la-avatar-clip"><path d="${BODY_D}"/></clipPath>
  </defs>
  <g class="la-breath">
    <g class="la-actor" clip-path="url(#la-avatar-clip)">
      <path class="la-body" d="${BODY_D}"/>
      <path class="la-eye la-eye-0"/>
      <path class="la-eye la-eye-1"/>
    </g>
  </g>
</svg>`;

const ACTS = ['la-act-bounce', 'la-act-shake', 'la-act-squish'];
const EXPR_INTERVAL = 5000;
const ACTION_PROBABILITY = 0.25;

type Point = [number, number];
type Ring = Point[];
type Expression = [Ring, Ring];

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const centroid = (ring: Ring): Point => {
  let x = 0;
  let y = 0;
  for (const [px, py] of ring) {
    x += px / ring.length;
    y += py / ring.length;
  }
  return [x, y];
};
const toPath = (ring: Ring) => {
  let s = 'M';
  for (let i = 0; i < ring.length; i++) s += `${i ? 'L' : ''}${ring[i][0]} ${ring[i][1]}`;
  return `${s}Z`;
};

export default class Avatar {
  private root: HTMLElement | null = null;
  private actor: HTMLElement | null = null;
  private eyeEls: SVGPathElement[] = [];
  private expression = 0;
  private current = [] as Expression;
  private target = [] as Expression;
  private morph = 1;
  private velocity = 0;
  private last = 0;
  private blinkStart = 0;
  private rafId = 0;
  private exprTimer = 0;
  private blinkTimer = 0;
  private actTimer = 0;

  constructor() {
    document.addEventListener('DOMContentLoaded', () => this.mount(), { once: true });
    router.onPageChange(() => this.mount());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
        clearTimeout(this.exprTimer);
        clearTimeout(this.blinkTimer);
      } else if (this.root?.isConnected) {
        this.last = performance.now();
        this.rafId = requestAnimationFrame(this.frame);
        this.scheduleExpr();
        this.scheduleBlink();
      }
    });
  }

  /** 幂等挂载：首次注入 SVG；pjax 换页后重新注入或重绑缓存恢复的节点 */
  private mount() {
    const slot = document.querySelector('.logo-avatar');
    if (!slot) return;
    if (this.root?.isConnected && slot.contains(this.root)) return;

    this.stop();
    this.root = slot.querySelector('.la-avatar');
    if (!this.root) {
      slot.querySelector('img')?.remove();
      this.root = document.createElement('div');
      this.root.className = 'la-avatar';
      this.root.setAttribute('role', 'img');
      this.root.setAttribute('aria-label', 'GrokBot 动态头像');
      this.root.innerHTML = SVG_MARKUP;
      slot.appendChild(this.root);
    }
    this.actor = this.root.querySelector('.la-actor');
    this.eyeEls = [this.root.querySelector('.la-eye-0'), this.root.querySelector('.la-eye-1')].filter(
      (el): el is SVGPathElement => el !== null,
    );
    if (!this.actor || this.eyeEls.length !== 2) {
      this.root = null;
      return;
    }

    this.expression = Math.floor(Math.random() * EXPR.length);
    this.current = EXPR[this.expression].map((ring) => ring.map(([x, y]) => [x, y] as Point)) as Expression;
    this.target = EXPR[this.expression] as Expression;
    this.morph = 1;
    this.velocity = 0;
    this.last = performance.now();
    this.blinkStart = 0;

    this.rafId = requestAnimationFrame(this.frame);
    this.scheduleExpr();
    this.scheduleBlink();
  }

  private stop() {
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    clearTimeout(this.exprTimer);
    clearTimeout(this.blinkTimer);
    clearTimeout(this.actTimer);
  }

  private rings(): Ring[] {
    const m = clamp(this.morph, 0, 1);
    return this.current.map(
      (ring, e) =>
        ring.map(([x, y], i) => [x + (this.target[e][i][0] - x) * m, y + (this.target[e][i][1] - y) * m]) as Ring,
    );
  }

  private chooseNext() {
    let next = 0;
    do {
      next = Math.floor(Math.random() * EXPR.length);
    } while (next === this.expression && EXPR.length > 1);
    this.current = this.rings() as Expression;
    this.target = EXPR[next] as Expression;
    this.expression = next;
    this.morph = 0;
    this.velocity = 0;
    if (Math.random() < ACTION_PROBABILITY) this.playAction();
  }

  private playAction() {
    clearTimeout(this.actTimer);
    for (const c of ACTS) this.actor?.classList.remove(c);
    this.actor?.getBoundingClientRect();
    const cls = ACTS[Math.floor(Math.random() * ACTS.length)];
    this.actor?.classList.add(cls);
    this.actTimer = window.setTimeout(() => this.actor?.classList.remove(cls), 950);
  }

  private blinkScale(now: number) {
    if (!this.blinkStart) return 1;
    const t = (now - this.blinkStart) / 320;
    if (t >= 1) {
      this.blinkStart = 0;
      return 1;
    }
    return Math.max(t < 0.42 ? 1 - t / 0.42 : (t - 0.42) / 0.58, 0.04);
  }

  private frame = (now: number) => {
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;
    this.velocity += (-14 * this.velocity - 49 * (this.morph - 1)) * dt;
    this.morph += this.velocity * dt;
    if (!Number.isFinite(this.morph)) {
      this.morph = 1;
      this.velocity = 0;
    }
    const shown = this.rings();
    const bs = this.blinkScale(now);
    for (let i = 0; i < shown.length; i++) {
      const [cx, cy] = centroid(shown[i]);
      this.eyeEls[i].setAttribute('d', toPath(shown[i]));
      this.eyeEls[i].setAttribute('transform', `translate(0 ${cy}) scale(1 ${bs}) translate(0 ${-cy})`);
    }
    this.rafId = requestAnimationFrame(this.frame);
  };

  private scheduleExpr() {
    clearTimeout(this.exprTimer);
    this.exprTimer = window.setTimeout(() => {
      this.chooseNext();
      this.scheduleExpr();
    }, EXPR_INTERVAL);
  }

  private scheduleBlink() {
    clearTimeout(this.blinkTimer);
    this.blinkTimer = window.setTimeout(
      () => {
        if (!document.hidden) this.blinkStart = performance.now();
        this.scheduleBlink();
      },
      3000 + Math.random() * 3000,
    );
  }
}
