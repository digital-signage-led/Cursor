import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const c = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/sites.js'), 'utf8'), c);

const BASE = 'https://digital-signage-led.github.io/Cursor/wbgt_2D_project';
const V = 132;
const regions = [
  ['北海道', ['sapporo']],
  ['東北', ['aomori', 'morioka', 'sendai', 'akita', 'yamagata', 'fukushima']],
  ['関東', ['mito', 'utsunomiya', 'maebashi', 'saitama', 'chiba', 'tokyo', 'yokohama']],
  ['中部', ['niigata', 'toyama', 'kanazawa', 'fukui', 'kofu', 'nagano', 'gifu', 'shizuoka', 'nagoya']],
  ['近畿', ['tsu', 'otsu', 'kyoto', 'osaka', 'kobe', 'nara', 'wakayama']],
  ['中国', ['tottori', 'matsue', 'okayama', 'hiroshima', 'yamaguchi']],
  ['四国', ['tokushima', 'takamatsu', 'matsuyama', 'kochi']],
  ['九州・沖縄', ['fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'naha']],
];

function url(id) {
  const p = new URLSearchParams({
    site_id: id,
    pitch: 'P3.47',
    inch: '100',
    fit: '0',
    viewport: '0',
    embed: '1',
    v: String(V),
  });
  return `${BASE}/index.html?${p.toString()}`;
}

let n = 0;
let rows = '';
for (const [region, ids] of regions) {
  rows += `<tr class="region"><td colspan="5">${region}</td></tr>\n`;
  for (const id of ids) {
    n += 1;
    const s = c.window.WBGT_SITE_BY_ID[id];
    const u = url(id);
    rows += `<tr><td>${n}</td><td>${s.pref}</td><td>${s.site}</td><td>${id}</td><td><a href="${u}" target="_blank" rel="noopener">${u}</a></td></tr>\n`;
  }
}

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WBGT / 大雨 公開URL一覧（全国47）</title>
<style>
body{font-family:'Yu Gothic UI','Noto Sans JP',sans-serif;margin:24px;color:#222;background:#fff;}
h1{font-size:22px;font-weight:800;margin:0 0 16px;}
table{border-collapse:collapse;width:100%;max-width:1400px;}
th,td{border:1px solid #c5c5c5;padding:6px 10px;text-align:left;font-size:13px;}
th{background:#1f1f1f;color:#fff;}
.meta td:first-child{width:140px;font-weight:700;}
.common{background:#e8f4ff;}
.admin{background:#fff4d6;}
.note{background:#f7f7f7;}
.region td{background:#333;color:#fff;font-weight:800;}
tr:nth-child(even):not(.region) td{background:#f7fbff;}
a{color:#1a73e8;word-break:break-all;}
</style>
</head>
<body>
<h1>WBGT / 大雨 公開URL一覧（全国47都道府県庁所在地）</h1>
<table>
<tr class="meta common"><td>共通ベース</td><td colspan="4"><a href="${BASE}/">${BASE}/</a></td></tr>
<tr class="meta admin"><td>会場テンプレート</td><td colspan="4"><a href="${BASE}/setup.html">${BASE}/setup.html</a></td></tr>
<tr class="meta note"><td>プレビュー一覧</td><td colspan="4"><a href="${BASE}/preview/">${BASE}/preview/</a></td></tr>
<tr class="meta note"><td>公開URL一覧</td><td colspan="4"><a href="${BASE}/%E5%85%AC%E9%96%8BURL%E4%B8%80%E8%A6%A7.html">${BASE}/公開URL一覧.html</a></td></tr>
<tr class="meta note"><td>件数</td><td colspan="4">47件（1都道府県＝1URL。デザイン共通・会場のみ差替）</td></tr>
<tr class="meta note"><td>パラメータ</td><td colspan="4">site_id · pitch=P3.47 · inch=100 · fit=0 · viewport=0 · embed=1 · v=${V}</td></tr>
<tr class="meta note"><td>1920×1080</td><td colspan="4">末尾に &amp;w=1920&amp;h=1080&amp;ledcloud=1 を追加</td></tr>
</table>
<br>
<table>
<thead><tr><th>No.</th><th>都道府県</th><th>会場</th><th>site_id</th><th>公開URL</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
</body>
</html>
`;

fs.writeFileSync(path.join(root, '公開URL一覧.html'), html, 'utf8');
console.log('wrote', n, 'urls');
