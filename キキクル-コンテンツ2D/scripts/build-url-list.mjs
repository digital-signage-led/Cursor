import { writeFileSync } from "node:fs";

const prefs = [
  ["hokkaido", "北海道"], ["aomori", "青森県"], ["iwate", "岩手県"], ["miyagi", "宮城県"],
  ["akita", "秋田県"], ["yamagata", "山形県"], ["fukushima", "福島県"],
  ["ibaraki", "茨城県"], ["tochigi", "栃木県"], ["gunma", "群馬県"], ["saitama", "埼玉県"],
  ["chiba", "千葉県"], ["tokyo", "東京都"], ["kanagawa", "神奈川県"],
  ["niigata", "新潟県"], ["toyama", "富山県"], ["ishikawa", "石川県"], ["fukui", "福井県"],
  ["yamanashi", "山梨県"], ["nagano", "長野県"],
  ["gifu", "岐阜県"], ["shizuoka", "静岡県"], ["aichi", "愛知県"], ["mie", "三重県"],
  ["shiga", "滋賀県"], ["kyoto", "京都府"], ["osaka", "大阪府"], ["hyogo", "兵庫県"],
  ["nara", "奈良県"], ["wakayama", "和歌山県"],
  ["tottori", "鳥取県"], ["shimane", "島根県"], ["okayama", "岡山県"], ["hiroshima", "広島県"],
  ["yamaguchi", "山口県"],
  ["tokushima", "徳島県"], ["kagawa", "香川県"], ["ehime", "愛媛県"], ["kochi", "高知県"],
  ["fukuoka", "福岡県"], ["saga", "佐賀県"], ["nagasaki", "長崎県"], ["kumamoto", "熊本県"],
  ["oita", "大分県"], ["miyazaki", "宮崎県"], ["kagoshima", "鹿児島県"],
  ["okinawa", "沖縄県"]
];

const types = [
  ["land", "土砂キキクル"],
  ["inundation", "浸水キキクル"],
  ["flood", "洪水キキクル"]
];

const base = "https://digital-signage-led.github.io/Cursor/キキクル-コンテンツ2D/";
const admin = base + "admin/";

function href(pref, type) {
  return base + "?pref=" + pref + "&type=" + type;
}

function esc(value) {
  return String(value).replace(/&/g, "&amp;");
}

const rows = [];
let n = 1;
for (const [typeId, typeName] of types) {
  for (const [prefId, prefName] of prefs) {
    const url = href(prefId, typeId);
    rows.push(
      "<tr><td>" + n + "</td><td>" + prefName + "</td><td>" + prefId +
      "</td><td>" + typeName + "</td><td>" + typeId +
      "</td><td><a href=\"" + esc(url) + "\">" + esc(url) + "</a></td></tr>"
    );
    n += 1;
  }
}

const html = [
  "<!DOCTYPE html>",
  "<html lang=\"ja\">",
  "<head>",
  "  <meta charset=\"UTF-8\">",
  "  <title>③ 危険度 公開URL一覧</title>",
  "  <style>",
  "    body { font-family: \"Yu Gothic UI\", \"Noto Sans JP\", sans-serif; margin: 24px; color: #222; }",
  "    h1 { font-size: 22px; font-weight: 800; margin: 0 0 16px; }",
  "    table { border-collapse: collapse; width: 100%; max-width: 1600px; }",
  "    th, td { border: 1px solid #c5c5c5; padding: 6px 10px; text-align: left; font-size: 14px; }",
  "    th { background: #f3f3f3; font-weight: 800; }",
  "    .meta td:first-child { width: 140px; font-weight: 700; }",
  "    .common { background: #e8f4ff; }",
  "    .admin { background: #fff4d6; }",
  "    .note { background: #fff; }",
  "    .head { background: #1f1f1f; color: #fff; }",
  "    tr:nth-child(even) td { background: #f7fbff; }",
  "    a { color: #1a73e8; word-break: break-all; }",
  "  </style>",
  "</head>",
  "<body>",
  "  <h1>③ 危険度 公開URL一覧（47都道府県 × 土砂 / 浸水 / 洪水）</h1>",
  "  <table>",
  "    <tr class=\"meta common\"><td>共通URL</td><td colspan=\"5\"><a href=\"" + esc(base) + "\">" + esc(base) + "</a></td></tr>",
  "    <tr class=\"meta admin\"><td>管理画面</td><td colspan=\"5\"><a href=\"" + esc(admin) + "\">" + esc(admin) + "</a></td></tr>",
  "    <tr class=\"meta note\"><td>件数</td><td colspan=\"5\">141件（47都道府県 × 3コンテンツ）</td></tr>",
  "    <tr class=\"meta note\"><td>パラメータ</td><td colspan=\"5\">pref = 都道府県ID ／ type = land（土砂） | inundation（浸水） | flood（洪水）</td></tr>",
  "  </table>",
  "  <br>",
  "  <table>",
  "    <thead>",
  "      <tr class=\"head\">",
  "        <th>No.</th>",
  "        <th>都道府県</th>",
  "        <th>pref値</th>",
  "        <th>表示内容</th>",
  "        <th>type値</th>",
  "        <th>公開URL</th>",
  "      </tr>",
  "    </thead>",
  "    <tbody>",
  "      " + rows.join("\n      "),
  "    </tbody>",
  "  </table>",
  "</body>",
  "</html>",
  ""
].join("\n");

writeFileSync(new URL("../公開URL一覧.html", import.meta.url), html, "utf8");
console.log("wrote", rows.length, "urls");
