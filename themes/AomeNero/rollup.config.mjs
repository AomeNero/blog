import resolve from '@rollup/plugin-node-resolve';
import sass from 'rollup-plugin-sass';
import { defineConfig } from 'rollup';
import swc from 'unplugin-swc';

export default defineConfig([
  // 面向浏览器的 UMD 构建
  {
    input: 'src/main.ts',
    output: {
      name: 'main.js',
      file: 'source/js_complied/bundle.js',
      // format: 'umd',
      format: 'umd',
    },
    plugins: [
      resolve(), // 以便 Rollup 能找到 `ms`
      swc.rollup({
        minify: true,
        jsc: {
          baseUrl: import.meta.dirname || '.',
          paths: {
            '@/*': ['./src/*'],
          },
        },
      }),
      sass({
        output: true,
      }),
    ],
  },
]);
