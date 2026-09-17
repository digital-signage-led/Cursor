# WBGT 顔イラスト・アニメーション プロンプト

新しいチャットの先頭にそのまま貼って使う。
対象: `index.html` の `.wbgt-face img`（右の丸顔）

関連: `assets/faces/*.png` / `W_LEVELS[].anim` / `@keyframes face-*`

---

## フル版（コピペ用）

```text
あなたは wbgt_2D_project の WBGT 顔イラスト・アニメーションを保守する。
現行 LAYOUT_VER を壊さず、比率を変えても見出し文字と顔が被らないこと。

【対象】
右上の丸い顔（#wFace / .wbgt-face img）。
アセット（assets/faces/*.png）の中身は書き換えない。動きは CSS animation（keyframes）のみ。

【5段階の対応（勝手に入れ替えない）】
ほぼ安全 | face:safe.png | class:anim-safe | keyframes:face-safe
  → 呼吸：ゆっくり上下（落ち着き・安定）／約3.2s ease-in-out infinite
注意 | caution.png | anim-caution | face-caution
  → 左右確認：見渡し（左右に少し傾けて移動）／約4s ease-in-out infinite
警戒 | warning.png | anim-severe | face-severe
  → 警告パルス：ゆっくり1回上下＋淡いオレンジの光／約3s ease-in-out infinite
厳重警戒 | severe.png | anim-warning | face-warning
  → 心拍：ドキドキ2回→休止／約2.4s ease-out infinite
危険 | danger.png | anim-danger | face-danger
  → 横揺れ＋傾き（不安定・危険感）／約1.45s ease-in-out infinite

※重要: W_LEVELS では「警戒＝anim-severe」「厳重警戒＝anim-warning」。
名前と動きがクロスしている。理由なく入れ替えない。

【技術制約（破るとレイアウトが壊れる）】
1. 使えるプロパティは translate / rotate / filter のみ。
2. transform: scale() は禁止（--face-w・--face-img-scale と競合する）。
3. 顔の大きさ・位置は calcSignageFaceLayout / --face-w / --face-text-pad 側。animationでサイズ変更しない。
4. 移動量は控えめ: 上下おおよそ5%、左右おおよそ7〜9%、傾きおおよそ±6〜7deg。
5. ほぼ安全は --face-img-scale:0.94 を維持（注意と同じ見た目サイズ）。
6. will-change: translate, rotate, filter を維持。
7. 大雨画面の .rain-face は別系統。WBGT顔アニメを共有しない。

【デザインの意味】
安全＝落ち着き、注意＝周囲確認、警戒＝異変の警告、厳重警戒＝緊張・心拍、危険＝不安定。
遊びすぎ・派手すぎ・画面全体を揺らす動きはNG。

【変更手順】
- 該当の @keyframes face-* と .anim-* だけ最小差分で直す。
- signage / 非signage で二重定義しない（既存の共通CSSを使う）。
- LAYOUT_VER を上げ、setup.html と preview/wbgt-levels-preview.html の v= を同期。
- 確認: demo で level=0〜4 を切替。横長・3:2でも「ほぼ安全」「厳重警戒」と顔が被らないこと。

確認URL:
  index.html?demo=1&level=0&fit=0&pitch=P3.47&inch=100&v=（最新） … 呼吸
  index.html?demo=1&level=1&... … 左右確認
  index.html?demo=1&level=2&... … 警戒＝警告パルス
  index.html?demo=1&level=3&... … 厳重警戒＝心拍
  index.html?demo=1&level=4&... … 危険＝揺れ
```

---

## 短い版

```text
WBGT顔アニメは .wbgt-face img の CSS keyframes のみ。translate/rotate/filter だけ使い scale 禁止。
割当維持: ほぼ安全=呼吸(safe)、注意=左右確認(caution)、警戒=警告パルス(severe)、厳重警戒=心拍(warning)、危険=横揺れ(danger)。警戒↔厳重警戒の class クロスは入れ替えない。
移動量小さく（上下~5%/左右~9%/傾き~±7deg）。ほぼ安全 face-img-scale 0.94。比率変更でも見出しと被らない。LAYOUT_VER同期。level0〜4で確認。
```

---

## 指示テンプレ（用途別）

動きを調整したいとき:

```text
【警戒】の動きをもっと警告感が出るように調整して。
条件: scale禁止 / 移動量大にしすぎない / anim-severe と anim-warning の割当は維持 / 他レベルを壊さない / LAYOUT_VER更新。
完了後 level=2 と level=3 を見比べて報告。
```

新しい動きを追加したいとき:

```text
危険レベル（anim-danger）の揺れを少し速くして緊迫感を出して。
translate/rotate/filter のみ。scale禁止。見出しとの被りが出ない範囲で。LAYOUT_VER同期。level=4で確認。
```
