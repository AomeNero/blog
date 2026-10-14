import { describe, expect, it } from 'vitest';
import { resolve } from '../src/aomenero/theme-mode';

// ADR-0002 的权威语义:「system = 跟随 prefers-color-scheme」,显式偏好原样生效
describe('theme-mode.resolve', () => {
  it('system 偏好跟随系统明暗', () => {
    expect(resolve('system', true)).toBe('dark');
    expect(resolve('system', false)).toBe('light');
  });

  it('显式偏好不受系统影响', () => {
    expect(resolve('light', true)).toBe('light');
    expect(resolve('light', false)).toBe('light');
    expect(resolve('dark', true)).toBe('dark');
    expect(resolve('dark', false)).toBe('dark');
  });
});
