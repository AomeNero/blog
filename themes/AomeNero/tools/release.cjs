// 发版打包脚本：构建主题 → 产出含 js_complied 产物的发布 zip（零依赖,纯 Node 实现 store 型 zip）
// 用法：npm run release  →  dist/hexo-theme-AomeNero-<version>.zip
// 发布流程：跑本脚本 → 把 zip 传到 GitHub Release → 用户下载解压到 themes/ 即用,无需 Node 工具链
const fs = require('fs');
const path = require('path');

const ROOT = __dirname + '/..';
const VERSION = require(path.join(ROOT, 'package.json')).version;
const OUT_DIR = path.join(ROOT, 'dist');
const OUT_FILE = path.join(OUT_DIR, `hexo-theme-AomeNero-${VERSION}.zip`);
const PREFIX = 'hexo-theme-AomeNero/';

// 发布包含的路径：模板/语言/Hexo 脚本/source 资产(含构建产物 js_complied)/配置与文档
const INCLUDE = ['layout', 'languages', 'scripts', 'source', '_config.yml', 'package.json', 'README.md', 'LICENSE', 'CHANGELOG.md'];
const EXCLUDE = [/node_modules/, /source[\\/]js[\\/]deprecated/];

// ---- 最小 zip 实现(仅 store,不压缩；主题资产已高度可压缩但体积小,总量 <1MB) ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

function collectFiles() {
  const files = [];
  const walk = (rel) => {
    const abs = path.join(ROOT, rel);
    if (EXCLUDE.some((re) => re.test(rel))) return;
    if (fs.statSync(abs).isDirectory()) {
      for (const name of fs.readdirSync(abs)) walk(path.join(rel, name));
    } else {
      files.push({ name: PREFIX + rel.split(path.sep).join('/'), data: fs.readFileSync(abs) });
    }
  };
  for (const item of INCLUDE) walk(item);
  return files;
}

function writeZip(files) {
  const now = new Date();
  const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
  const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const f of files) {
    const nameBuf = Buffer.from(f.name, 'utf8');
    const crc = crc32(f.data);
    const local = Buffer.alloc(30 + nameBuf.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(0, 8); // method: store
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(f.data.length, 18);
    local.writeUInt32LE(f.data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    nameBuf.copy(local, 30);
    locals.push(local, f.data);
    const central = Buffer.alloc(46 + nameBuf.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(f.data.length, 20);
    central.writeUInt32LE(f.data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    nameBuf.copy(central, 46);
    centrals.push(central);
    offset += local.length + f.data.length;
  }
  const centralBuf = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  fs.writeFileSync(OUT_FILE, Buffer.concat([...locals, centralBuf, eocd]));
}

const files = collectFiles();
fs.mkdirSync(OUT_DIR, { recursive: true });
writeZip(files);
const hasBundle = files.some((f) => f.name.endsWith('js_complied/bundle.js'));
console.log(`${OUT_FILE}`);
console.log(`  ${files.length} 个文件, ${(fs.statSync(OUT_FILE).size / 1024).toFixed(0)} KB`);
if (!hasBundle) {
  console.error('  ✗ 缺少构建产物 js_complied/bundle.js —— 请先执行 pnpm/npm run build');
  process.exit(1);
}
console.log('  ✓ 含构建产物,解压到 themes/ 即用');
