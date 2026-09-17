# WBGT / 大雨 デジタルサイネージ（2D）

熱中症(WBGT)モニタリングと大雨情報のLEDサイネージ用コンテンツです。  
デザインは全国共通テンプレート。会場（都道府県）だけ差し替えます。

## 本番

| ファイル | 用途 |
|---|---|
| `index.html` | 本番表示（WBGT / 大雨） |
| `setup.html` | **全国会場テンプレート**からURL発行 |
| `data/sites.js` | 47都道府県庁所在地テンプレート |
| `gas/api.gs` | Google Apps Script（データ取得） |
| `assets/` | 顔イラスト・ロゴなど固定素材 |

### 会場の切り替え

1. `setup.html` で都道府県・都市を選ぶ  
2. 発行されたURLをサイネージプレイヤーに登録  

例（東京）: `index.html?site_id=tokyo&pitch=P3.47&inch=100&fit=0&embed=1&v=132`  
例（大阪）: `index.html?site_id=osaka&...`  
例（名古屋）: `index.html?site_id=nagoya&...`

一覧にない市町村は `setup.html` で point / area を手入力。`data/sites.js` に追記してもOKです。

## プレビュー

`preview/index.html` から各確認画面へ入れます。

ローカル起動: `node tools/dev-server.mjs` → http://127.0.0.1:3006/

