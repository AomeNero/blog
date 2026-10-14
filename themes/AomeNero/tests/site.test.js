import { describe, expect, it } from 'vitest';
const { wordCount, computeVersionHash } = require('../scripts/helpers/site');

describe('site.wordCount', () => {
  it('中文按字计数', () => {
    expect(wordCount('你好世界')).toBe(4);
  });

  it('英文按词计数', () => {
    expect(wordCount('hello world foo')).toBe(3);
  });

  it('中英混排', () => {
    expect(wordCount('你好 world')).toBe(3);
  });

  it('HTML 标签不计入', () => {
    expect(wordCount('<p>你好</p><a href="x">world</a>')).toBe(3);
  });

  it('空内容为 0', () => {
    expect(wordCount('')).toBe(0);
    expect(wordCount('<div></div>')).toBe(0);
  });
});

describe('site.computeVersionHash', () => {
  it('输出 10 位十六进制', () => {
    const hash = computeVersionHash([Buffer.from('a'), Buffer.from('b')]);
    expect(hash).toMatch(/^[0-9a-f]{10}$/);
  });

  it('内容顺序敏感', () => {
    expect(computeVersionHash([Buffer.from('a'), Buffer.from('b')])).not.toBe(
      computeVersionHash([Buffer.from('b'), Buffer.from('a')]),
    );
  });

  it('相同内容结果稳定', () => {
    const input = [Buffer.from('bundle'), Buffer.from('css')];
    expect(computeVersionHash(input)).toBe(computeVersionHash(input));
  });
});
