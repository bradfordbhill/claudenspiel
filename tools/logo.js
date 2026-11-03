// Draws Claudenspiel's Fraktur logo (assets/logo.png) and its icon (assets/icon-64.png, icon-192.png) as pixel art.
// Same method as Kartenspiel's tools/art.js (UnifrakturMaguntia, hard edges, scaled up pixel for pixel by the page),
// but in verdigris and copper. Needs Playwright with Chromium and a network connection for the font.
// Run: node tools/logo.js   (then ./build.sh)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'assets', 'logo.png');
const PAGE = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=block" rel="stylesheet"></head>
<body><span style="font-family:UnifrakturMaguntia">C</span><script>
const INK = '#16110c';
// verdigris on top, copper below: weathered bronze
function patina(g, y0, y1) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, '#c9f2dc'); gr.addColorStop(.42, '#4fb38f'); gr.addColorStop(.55, '#a8562a'); gr.addColorStop(1, '#f0a86a'); return gr; }
function logo() {
  const w = 280, h = 42, c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.font = '30px UnifrakturMaguntia'; const tw = g.measureText('Claudenspiel').width, x = Math.round((w - tw) / 2) - 1, y = 33;
  g.fillStyle = INK; for (const [dx, dy] of [[1, 1], [2, 2], [-1, 0], [1, 0], [0, -1], [0, 1]]) g.fillText('Claudenspiel', x + dx, y + dy);
  g.fillStyle = patina(g, y - 22, y); g.fillText('Claudenspiel', x, y);
  const d = g.getImageData(0, 0, w, h); for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 110 ? 255 : 0; g.putImageData(d, 0, 0);
  let x0 = w, y0 = h, x1 = 0, y1 = 0; for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (d.data[(yy * w + xx) * 4 + 3]) { x0 = Math.min(x0, xx); x1 = Math.max(x1, xx); y0 = Math.min(y0, yy); y1 = Math.max(y1, yy); }
  const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1; o.getContext('2d').drawImage(c, -x0, -y0);
  return { url: o.toDataURL('image/png'), w: o.width, h: o.height };
}
// The icon: a parchment card on a dusk-violet ground with an oxblood title strip and a verdigris C, scaled up pixel for pixel.
function icon(size) {
  const n = 64, c = document.createElement('canvas'); c.width = c.height = n; const g = c.getContext('2d'), px = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  px(0, 0, n, n, '#3d3350'); px(18, 8, 40, 54, '#221b2e'); px(14, 4, 40, 54, '#16110c'); px(16, 6, 36, 50, '#f6efd8'); px(16, 6, 36, 8, '#5a1020'); px(18, 8, 18, 2, '#f0a86a');
  const k = document.createElement('canvas'); k.width = k.height = n; const kg = k.getContext('2d'); kg.font = '40px UnifrakturMaguntia'; const kw = kg.measureText('C').width, x = Math.round(33 - kw / 2), y = 50;
  kg.fillStyle = INK; for (const [dx, dy] of [[1, 1], [2, 2], [-1, 0], [1, 0], [0, -1], [0, 1]]) kg.fillText('C', x + dx, y + dy);
  kg.fillStyle = patina(kg, y - 30, y); kg.fillText('C', x, y);
  const d = kg.getImageData(0, 0, n, n); for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 110 ? 255 : 0; kg.putImageData(d, 0, 0); g.drawImage(k, 0, 0);
  const o = document.createElement('canvas'); o.width = o.height = size; const og = o.getContext('2d'); og.imageSmoothingEnabled = false; og.drawImage(c, 0, 0, size, size); return o.toDataURL('image/png');
}
</script></body></html>`;
(async () => {
  const b = await chromium.launch(), p = await b.newPage(); await p.setContent(PAGE); await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => document.fonts.check('30px UnifrakturMaguntia'));
  const r = await p.evaluate(() => logo()); fs.writeFileSync(OUT, Buffer.from(r.url.split(',')[1], 'base64'));
  const ic = await p.evaluate(() => ({ fav: icon(64), touch: icon(192) }));
  fs.writeFileSync(path.join(path.dirname(OUT), 'icon-64.png'), Buffer.from(ic.fav.split(',')[1], 'base64'));
  fs.writeFileSync(path.join(path.dirname(OUT), 'icon-192.png'), Buffer.from(ic.touch.split(',')[1], 'base64'));
  console.log('saved assets/logo.png', r.w + '×' + r.h, 'and assets/icon-64.png, icon-192.png'); await b.close();
})();
