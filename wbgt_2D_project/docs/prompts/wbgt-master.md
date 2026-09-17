# WBGT マスタープロンプト（まとめた版）

新しいチャットの**先頭にそのまま貼る**用。
基準: `index.html` 先頭の現行 **LAYOUT_VER**（いま `104`）。見た目はこのバージョンを壊さない。

詳細の個別ファイル:
- `PROMPTS/wbgt-layout-base.md` … レイアウト・白カード・下段バー・比率
- `PROMPTS/wbgt-face-animation.md` … 顔アニメ

---

## フル版（推奨）

```text
あなたは wbgt_2D_project（防災モニタリング / WBGT・大雨サイネージ）の index.html を保守する。
現行 LAYOUT_VER を唯一の見た目ベースとする。CSSを崩さず、要素が被らない・はみ出さない変更だけ行う。
signage CSS と非signage CSS は同じ意図で直す。LAYOUT_VER を上げ、setup.html と preview/wbgt-levels-preview.html の v= を同期する。

■ 全体原則
1. まず「収める」。大きくする・動かす前に枠内に収まるかを優先。
2. 推測で大規模書き換えしない。該当セレクタを読んで最小差分。
3. LED基準は 4:3（P3.47/P2.87 解像度テーブル）。3:2・横長・viewport=stretch でも破綻させない。
4. 確認は level=0〜4 切替＋ウィンドウリサイズ（横長/縦長）必須。

■ 見出し × 顔イラスト（比率変更で被りやすい）
- 「ほぼ安全」「厳重警戒」などと右の顔が重ならないこと。
- --face-text-pad = 顔幅+右余白+隙間。足りなければ余白を削らず顔を縮める。
- 禁止: faceTextPad を幅*0.44 で頭打ちする／文字幅を max(幅*0.5,…) 固定する。
- 文字幅は実空き幅。4文字タイトルは text-w / 4.2 でフィット。
- statusBlockOverflows で交差検知 → 文字(--sg-status-fit-k) → 顔の順で縮小。
- 顔 z-index:1、文言 .left z-index:2。
- ほぼ安全の顔は --face-img-scale:0.94（注意と同じ見え方）。

■ 顔アニメーション（.wbgt-face img）
- PNGは動かさず CSS keyframes のみ。translate / rotate / filter のみ。transform:scale() 禁止。
- 移動量控えめ（上下~5% / 左右~7–9% / 傾き~±7deg）。大きく動かすと文字と被る。
- 割当（理由なく入れ替えない）:
  ほぼ安全=anim-safe 呼吸 / 注意=anim-caution 左右確認 /
  警戒=anim-severe 警告パルス / 厳重警戒=anim-warning 心拍 /
  危険=anim-danger 横揺れ※警戒↔厳重警戒は class クロス済。
- 大雨の .rain-face とは別系統。

■ 白カード（温度・湿度・WBGT・更新時刻）
構造維持:
  .wcard overflow:hidden・paddingは4枚共通
  .wcard-in grid 40fr/60fr + loupe scale + overflow:hidden
  .lbl/.wbgt-badge=上段、.val=下段（margin:0 / align-self:center）
禁止:
  負の margin で数値上下／温度カードだけ別 padding・flex-end／
  .wcard 全体 overflow:visible／loupe(--sg-card-loupe)上げすぎ
文字: cqh と cqw 両方で上限。4枚の数値の縦位置を揃える。
アイコン: .ic-thermo/.ic-humid/.ic-time は z-index:10。傾き控えめ。切れ防止はアイコン側の微調整のみ。

■ 下段バー（ほぼ安全／注意／警戒／厳重警戒／危険）
- flex / gap:0 / 隣へ margin-left: calc(var(--card-r)*-1) で重ねて左角丸を見せる。
- z-index 左から1→5、.active=6、▼ポインタ=8。
- アクティブ右端 clip-path:inset(0 var(--card-r) 0 0) で隣の左角丸を露出（0→注意,1→警戒,2→厳重警戒,3→危険）。削除禁止。
- 「ほぼ安全」「厳重警戒」は注意より小さく、nowrap+cqi上限。枠線・box-shadowを勝手に足さない。
- signage / 通常 / tune-active の3系統を同時に直す。

■ 完了チェック
□ 見出し×顔が横長比率でも非重なり（level=0と3）
□ 白カード内に文字・アイコンが収まる／温度数値の高さが他と一致／温度計の上が切れない
□ 下段バー level0〜4 で角丸露出・長いラベル収まり・▼位置OK
□ LAYOUT_VER とプレビュー v= 更新
確認URL:
  index.html?demo=1&level=3&fit=0&pitch=P3.47&inch=100&v=（最新LAYOUT_VER）
  index.html?demo=1&level=0&fit=0&pitch=P3.47&inch=100&v=（最新LAYOUT_VER）
  index.html?demo=1&level=3&viewport=stretch&v=（最新LAYOUT_VER）
```

---

## 短い版

```text
wbgt_2D_project の index.html は現行 LAYOUT_VER を見た目ベースに保つ。CSS崩れ・被り・はみ出しを出さない。
比率変更でも見出し×顔が被らない：face-text-padは削らず顔を縮小、文字幅50%固定禁止、4文字は/4.2、statusBlockOverflowsで文字→顔。
顔アニメは translate/rotate/filterのみ・scale禁止。割当維持（警戒=severeパルス／厳重警戒=warning心拍がクロス）。ほぼ安全 face-img-scale 0.94。
白カードは40/60・共通padding・負margin禁止・温度だけ別揃え禁止・loupe過大禁止・アイコンz-index10。
下段バーはgap:0・負margin重ね・active時clip-pathで隣の左角丸露出（削除禁止）・長いラベル縮小・signage/通常/tuneの3系統同期。
LAYOUT_VERとv=を更新。level0〜4＋リサイズで非重なり・角丸・収まりを確認して完了。
```
