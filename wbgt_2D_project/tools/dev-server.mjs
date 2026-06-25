/**
 * ローカル開発用: index.html 配信 + 環境省WBGTプロキシ (/api/wbgt)
 * 使い方: node tools/dev-server.mjs
 * ブラウザ: http://127.0.0.1:3006/
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function wbgtApiNo(point) {
  const n = parseInt(String(point).replace(/\D/g, ''), 10);
  if (!isFinite(n)) return NaN;
  return n >= 100000 ? Math.floor(n / 10) : n;
}

function calcWbgt(row) {
  const direct = parseFloat(row.wbgt_WBGT || row.wbgt || row.WBGT);
  if (isFinite(direct) && direct >= 10) return direct;
  const tw = parseFloat(row.wbgt_Tw);
  const tg = parseFloat(row.wbgt_Tg);
  const ta = parseFloat(row.wbgt_WO || row.wbgt_Ta);
  if (isFinite(tw) && isFinite(tg) && isFinite(ta)) {
    return Math.round((0.7 * tw + 0.2 * tg + 0.1 * ta) * 10) / 10;
  }
  return NaN;
}

function fmtTime(s) {
  const m = String(s || '').match(/(\d{1,2}):(\d{2})/);
  return m ? String(m[1]).padStart(2, '0') + ':' + m[2] : '';
}

function dateRange() {
  const pad = (n) => String(n).padStart(2, '0');
  const now = new Date();
  const to = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const y = new Date(now.getTime() - 86400000);
  const from = `${y.getFullYear()}${pad(y.getMonth() + 1)}${pad(y.getDate())}${pad(y.getHours())}${pad(y.getMinutes())}${pad(y.getSeconds())}`;
  return { from, to };
}

async function fetchSurvey(wbgtNo) {
  const { from, to } = dateRange();
  for (const dt of [1, 0]) {
    const url = `https://www.wbgt.env.go.jp/api/v1/getSurveyData?data_type=${dt}&location_type=1&wbgt_nos=${wbgtNo}&date_from=${from}&date_to=${to}`;
    const res = await fetch(url);
    if (!res.ok) continue;
    const raw = await res.json();
    const rows = raw.data || [];
    let latest = null;
    let latestTs = -1;
    for (const row of rows) {
      const w = calcWbgt(row);
      if (!isFinite(w)) continue;
      const m = String(row.wbgt_date || '').match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\s+(\d{1,2}):(\d{2})/);
      const ts = m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime() : 0;
      if (ts >= latestTs) {
        latestTs = ts;
        latest = { row, w, source: dt === 1 ? 'measured' : 'estimate' };
      }
    }
    if (!latest) continue;
    const temp = parseFloat(latest.row.wbgt_WO || latest.row.wbgt_Ta);
    const tw = parseFloat(latest.row.wbgt_Tw);
    let humidity = null;
    if (isFinite(tw) && isFinite(temp) && temp > tw) {
      humidity = Math.max(0, Math.min(100, Math.round(100 - (temp - tw) * 5)));
    }
    return {
      wbgt: latest.w,
      temp: isFinite(temp) ? temp : null,
      humidity,
      time: fmtTime(latest.row.wbgt_date),
      source: latest.source,
    };
  }
  throw new Error('survey empty');
}

async function fetchCsv(wbgtNo) {
  const pad = (n) => String(n).padStart(2, '0');
  const now = new Date();
  const yymm = `${now.getFullYear()}${pad(now.getMonth() + 1)}`;
  const url = `https://www.wbgt.env.go.jp/est15WG/dl/wbgt_${wbgtNo}_${yymm}.csv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('csv http');
  const lines = (await res.text()).replace(/^\uFEFF/, '').split(/\r?\n/);
  for (let i = lines.length - 1; i >= 1; i--) {
    const parts = lines[i].trim().split(',');
    if (parts.length < 3) continue;
    const w = parseFloat(parts[2]);
    if (!isFinite(w) || w <= 0) continue;
    return { wbgt: w, temp: null, humidity: null, time: fmtTime(parts[1]), source: 'estimate' };
  }
  throw new Error('csv empty');
}

async function fetchWbgt(point) {
  const no = wbgtApiNo(point);
  if (!isFinite(no)) throw new Error('invalid point');
  try {
    return await fetchSurvey(no);
  } catch (e1) {
    try {
      return await fetchCsv(no);
    } catch (e2) {
      throw new Error(`${e1} / ${e2}`);
    }
  }
}

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
  })[ext] || 'application/octet-stream';
}

const PREFERRED = Number(process.env.PORT || 3007);

const server = http.createServer(async (req, res) => {
  const port = server.address()?.port || PREFERRED;
  try {
    const u = new URL(req.url, `http://127.0.0.1:${port}`);
    if (u.pathname === '/api/wbgt') {
      const point = u.searchParams.get('point') || '620780';
      const data = await fetchWbgt(point);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(data));
      return;
    }
    let filePath = path.join(ROOT, decodeURIComponent(u.pathname === '/' ? '/index.html' : u.pathname));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType(filePath) });
    fs.createReadStream(filePath).pipe(res);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: String(e.message || e) }));
  }
});

function listen(port) {
  server.listen(port, '127.0.0.1', () => {
    const p = server.address().port;
    console.log(`WBGT dev server: http://127.0.0.1:${p}/`);
    console.log(`WBGT API test: http://127.0.0.1:${p}/api/wbgt?point=620780`);
  }).on('error', (e) => {
    if (e.code === 'EADDRINUSE' && port !== 0) listen(0);
    else throw e;
  });
}
listen(PREFERRED);
