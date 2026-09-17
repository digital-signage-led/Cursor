# WBGT レイアウト維持プロンプト（比率変更でも被らない / CSS崩れ防止）

新しいチャットの先頭にそのまま貼って使う。
基準: `index.html` の現行 LAYOUT_VER（コメント先頭）。見た目はこのバージョンを壊さない。

---

```text
あなたは wbgt_2D_project のサイネージUI（index.html）を保守する。
現行 LAYOUT_VER を唯一の見た目ベースとする。CSSを崩さず、比率を変えても要素が被らないようにだけ変更すること。

【最重要：比率変更でも被らない】
- ウィンドウ比率 / 3:2 / viewport=stretch を変えても、「ほぼ安全」「厳重警戒」などの見出しと右の顔イラストが重ならないこと。
- `--face-text-pad`（文字の右余白）は「顔幅 + 右余白 + 隙間」で確保する。足りないときは余白を削らず、顔を縮める。
- 禁止: `faceTextPad = min(pad, 幅*0.44)` のような顔余白の頭打ち（これだと文字が顔に食い込む）。
- 文字幅 `--sg-status-text-w` は実空き幅で計算する。禁止: `max(幅*0.5, …)` で文字を過大フィットさせること。
- 4文字タイトル（ほぼ安全・厳重警戒）は `text-w / 4.2` でフィットする。
- `statusBlockOverflows()` でタイトル／メッセージと顔の交差を検知し、先に文字（--sg-status-fit-k）→足りなければ顔も段階縮小。
- 顔 z-index:1、文言側 .left z-index:2（重なった場合も文字優先）。
- 確認レベル: level=0（ほぼ安全）と level=3（厳重警戒）必須。2文字（注意など）も確認。

【下段バー（5段階：ほぼ安全／注意／警戒／厳重警戒／危険）】
このバーは「隣セグメントへ負marginで重ねて角丸を見せる」構造。ここを壊すと角丸が欠けたり文字が潰れる。

構造を維持:
- .wbgt-bar: display:flex / gap:0 / overflow:visible
- .wbar: flex:1 / min-width:0 / container-type:inline-size
- 左角丸: data-idx 0〜3 は `border-radius: var(--card-r) 0 0 var(--card-r)`
- idx 1〜4 は `margin-left: calc(var(--card-r) * -1)` で重ねる（gapを入れない）
- z-index: idx0=1, 1=2, 2=3, 3=4, 4=5 / .active は z-index:6
- 黒い▼ポインタ (.wbgt-bar-pointer) は z-index:8、バー上余白 (--sg-wbar-tri-*) を維持

角丸の露出（必須ロジック・削除禁止）:
隣が z-index:6 で覆うと次カードの左角丸が消えるため、アクティブ側の右端を clip する。
| アクティブ | clip | 露出する隣の左角丸 |
| ほぼ安全(0) | inset(0 var(--card-r) 0 0) | 注意 |
| 注意(1) | 同上 | 警戒 |
| 警戒(2) | 同上 | 厳重警戒 |
| 厳重警戒(3) | 同上 | 危険 |
signage / 非signage / tune-active の3箇所すべてに同じルールがある。片方だけ直さない。

文字・被り防止:
- .n（ラベル）と .rg（範囲）は nowrap。長い「ほぼ安全」「厳重警戒」は注意より小さく（例: .n * 0.78）
- cqi 上限を維持（例: .n max 19.4cqi、長いラベルは 16.2cqi）
- 文字が隣バーや角丸に食い込まないこと。比率を変えても5セグメントが潰れないよう min-width:0 + フォント上限を守る
- gap を付けて角丸重ねを壊さない。枠線(box-shadow/outline)を勝手に足さない（右端が二重線に見える）

確認:
- level=0〜4 を切り替えて、アクティブ隣の左角丸が見えること
- ▼が現レベルの上に正しく乗ること
- 「ほぼ安全」「厳重警戒」の文字が枠内に収まること
- ウィンドウを横長にしても5欄が破綻しないこと

【白カード（温度・湿度・WBGT・更新時刻）】
構造を維持:
  .wcard → overflow:hidden / paddingは4枚共通
  .wcard-in → grid 40fr / 60fr + loupe scale + overflow:hidden
  .lbl / .wbgt-badge → 上段、.val → 下段（margin:0 / align-self:center）
絶対禁止:
  - 負の margin で数値を上下させない
  - 温度カードだけ別 padding / align-items:flex-end にしない（数値の縦位置が他とズレる）
  - .wcard 全体を overflow:visible にしない
  - loupe（--sg-card-loupe）を上げすぎない（はみ出し時は guardSignageCardFit に任せる）
アイコン:
  .ic-thermo / .ic-humid / .ic-time は z-index:10 で最前面
  傾きは控えめ。切れ防止はカード全体をずらさず、アイコン側の微調整のみ
  ほぼ安全の顔は --face-img-scale:0.94 を維持（注意と揃える）

【共通手順】
1. 推測で大きく書き換えない。該当セレクタを読んでから最小差分で直す。
2. signage CSS と非signage CSS を同じ意図で直す。
3. LAYOUT_VER を上げ、setup.html と preview/wbgt-levels-preview.html の v= を同期する。
4. 変更後に目視チェック:
   - 4白カードで文字・アイコンが枠内、ラベルと数値が非重なり
   - 温度の数値高さが他カードと一致、温度計の上が切れない
   - ウィンドウを横長／縦長に変えても見出しと顔が被らない
   - 下段バー level 0〜4 で角丸露出・文字非被り・▼位置が正しい
確認URL例:
  index.html?demo=1&level=3&fit=0&pitch=P3.47&inch=100&v=（最新LAYOUT_VER）
  index.html?demo=1&level=0&fit=0&pitch=P3.47&inch=100&v=（最新LAYOUT_VER）
  （3:2）index.html?demo=1&level=3&viewport=stretch&v=（最新LAYOUT_VER）
```

---

短い版（1段落で済ませるとき）:

```text
wbgt_2D_project の index.html は現行 LAYOUT_VER を見た目ベースに保つ。
比率（3:2等）を変えても見出しと右の顔が被らないこと：face-text-pad は削らず足りなければ顔を縮小、文字幅の 50% 固定フィット禁止、4文字は text-w/4.2、重なりは statusBlockOverflows で文字→顔の順に縮小。
下段5段階バーは gap:0・負margin重ね・z-index段階・active時 clip-path:inset(0 var(--card-r) 0 0) で隣の左角丸を露出（削除禁止）。長い「ほぼ安全」「厳重警戒」は縮小フォント＋cqi上限。signage/通常/tune の3箇所を揃える。
白カードは 40/60 グリッド・共通padding・負margin禁止・温度カードだけ別上下合わせ禁止・loupe過大禁止・アイコンは z-index:10。
signage/非signage 両方直し、LAYOUT_VER とプレビュー v= を同期。level=0〜4 とウィンドウリサイズで非重なり・角丸露出を確認してから完了。
```

---

下段バーだけ抜き出した注意プロンプト:

```text
【下段WBGTバーの注意点】
5セグメント（ほぼ安全/注意/警戒/厳重警戒/危険）は隣同士を負の margin-left（--card-r分）で重ね、左角丸を見せる構造。gapを入れない。
z-index は左から 1→5、.active は 6。アクティブ時は右端を clip-path:inset(0 var(--card-r) 0 0) して、隣カードの左角丸を露出する（ほぼ安全→注意、注意→警戒、警戒→厳重警戒、厳重警戒→危険）。
この clip-path / 負margin / z-index を壊すと角丸が欠けて平らに見える。
長いラベル「ほぼ安全」「厳重警戒」は注意基準より小さくし、nowrap + cqi上限で隣・角丸への被りを防ぐ。
▼ポインタはバー上の専用余白内。signage・通常・tune-active の3系統を同時に直すこと。
level=0〜4 を切り替えて角丸露出と文字収まりを必ず確認する。
```
