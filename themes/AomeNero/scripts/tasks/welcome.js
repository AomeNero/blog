const c0 = '\x1b[0m';

const CharA = `
 █████╗
██╔══██╗
███████║
██╔══██║
██║  ██║
╚═╝  ╚═╝`;
const CharO = `
 ██████╗
██╔═══██╗
██║   ██║
██║   ██║
╚██████╔╝
 ╚═════╝ `;
const CharM = `
██╗     ██╗
███╗   ███║
████╗ ████║
██╔████╔██║
██║╚██╔╝██║
╚═╝ ╚═╝ ╚═╝`;
const CharE = `
███████╗
██╔════╝
█████╗
██╔══╝
███████╗
╚══════╝`;
const CharN = `
███╗   ██╗
████╗  ██║
██╔██╗ ██║
██║╚██╗██║
██║ ╚████║
╚═╝  ╚═══╝`;
const CharR = `
██████╗
██╔══██╗
██████╔╝
██╔══██╗
██║  ██║
╚═╝  ╚═╝`;

function renderColor(txt, color) {
  const lines = txt.split('\n').filter((x) => x);
  const w = Math.max(0, ...lines.map((l) => l.length));
  return lines.map((l) => {
    const padded = l.padEnd(w);
    return (color + padded.replaceAll('█', `${c0}█${color}`) + c0).replaceAll(`${color}${c0}`, '');
  });
}

function renderText(...txtarr) {
  return txtarr
    .reduce((a, b) => {
      for (const i in a) {
        a[i] += b[i];
      }
      return a;
    })
    .join('\n');
}

module.exports = (hexo) => {
  if (hexo.env?.cmd?.startsWith('n')) return;
  hexo.log.info(`
============================================================
${renderText(
  renderColor(CharA, '\x1b[91m'),
  renderColor(CharO, '\x1b[38;5;208m'),
  renderColor(CharM, '\x1b[33m'),
  renderColor(CharE, '\x1b[32m'),
  renderColor(CharN, '\x1b[36m'),
  renderColor(CharE, '\x1b[34m'),
  renderColor(CharR, '\x1b[35m'),
  renderColor(CharO, '\x1b[91m'),
)}
============================================================`);
};
