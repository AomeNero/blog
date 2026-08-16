const cp = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

/** @param {import("hexo")} hexo */
module.exports = (hexo) => {
  let watcherStarted = false;
  // 主题配置在 hexo.load() 之后才就绪,须挂 before_generate filter(hexo g / hexo s 生成前必经)
  hexo.extend.filter.register('before_generate', () => {
    // 主题目录用官方 API 定位,兼容 themes/ 目录与 npm 安装(node_modules/hexo-theme-*)两种方式
    const themeDir = hexo.theme_dir;
    if (!themeDir) return;
    // 默认不自动构建(克隆发布包的用户开箱即用);开发者如需 hexo g/s 时自动编译,设 build_on_generate: true
    if (!hexo.theme.config?.build_on_generate) return;
    // 依赖未安装时降级为提示,不阻断生成(发布包已附带构建产物)
    if (!fs.existsSync(path.join(themeDir, 'node_modules', 'rollup'))) {
      hexo.log.info(`Theme build skipped: dependencies not installed. Run \`npm i\` inside ${themeDir} to enable.`);
      return;
    }
    // 通过 npx 调用本地 rollup,不绑定任何包管理器(Windows 下需 npx.cmd)
    const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    if (hexo.env?.cmd === 's' || hexo.env?.cmd === 'server') {
      if (watcherStarted) return; // watch 模式重复生成时不再拉起第二个 watcher
      watcherStarted = true;
      hexo.log.info('Starting js watch changer...');
      cp.exec(`${npx} rollup -w -c ./rollup.config.mjs`, { cwd: themeDir, stdio: 'inherit' });
    } else {
      hexo.log.info('Building js...');
      cp.execSync(`${npx} rollup -c ./rollup.config.mjs`, { cwd: themeDir, stdio: 'inherit' });
      hexo.log.info('Build successful!');
    }
  });
};
