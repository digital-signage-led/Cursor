/**
 * 47都道府県。雨・レーダーの富山プレビューを正とする。
 * 北海道のズーム感を維持し、小さい県だけ zoomBoost で少しアップ。
 */
(function (global) {
  "use strict";

  var PREFECTURES = Object.freeze({
    hokkaido: Object.freeze({ id: "hokkaido", code: "01", name: "北海道", lat: 43.45, lon: 142.85, zoom: 6.5, zoomBoost: 0, bounds: { north: 45.55, south: 41.35, east: 145.82, west: 139.40 } }),
    aomori: Object.freeze({ id: "aomori", code: "02", name: "青森県", lat: 40.82, lon: 140.74, zoom: 8.2, zoomBoost: 0, bounds: { north: 41.56, south: 40.22, east: 141.68, west: 139.50 } }),
    iwate: Object.freeze({ id: "iwate", code: "03", name: "岩手県", lat: 39.70, lon: 141.15, zoom: 8.0, zoomBoost: 0, bounds: { north: 40.45, south: 38.75, east: 142.07, west: 140.65 } }),
    miyagi: Object.freeze({ id: "miyagi", code: "04", name: "宮城県", lat: 38.27, lon: 140.87, zoom: 8.4, zoomBoost: 0, bounds: { north: 39.00, south: 37.77, east: 141.68, west: 140.27 } }),
    akita: Object.freeze({ id: "akita", code: "05", name: "秋田県", lat: 39.72, lon: 140.10, zoom: 8.1, zoomBoost: 0, bounds: { north: 40.51, south: 38.87, east: 140.98, west: 139.68 } }),
    yamagata: Object.freeze({ id: "yamagata", code: "06", name: "山形県", lat: 38.24, lon: 140.36, zoom: 8.3, zoomBoost: 0, bounds: { north: 39.21, south: 37.73, east: 140.65, west: 139.54 } }),
    fukushima: Object.freeze({ id: "fukushima", code: "07", name: "福島県", lat: 37.45, lon: 140.20, zoom: 8.0, zoomBoost: 0, bounds: { north: 37.98, south: 36.79, east: 141.05, west: 139.16 } }),
    ibaraki: Object.freeze({ id: "ibaraki", code: "08", name: "茨城県", lat: 36.34, lon: 140.45, zoom: 8.5, zoomBoost: 0, bounds: { north: 36.95, south: 35.73, east: 140.85, west: 139.69 } }),
    tochigi: Object.freeze({ id: "tochigi", code: "09", name: "栃木県", lat: 36.57, lon: 139.88, zoom: 9.3, zoomBoost: 0.9, bounds: { north: 37.02, south: 36.32, east: 140.16, west: 139.45 } }),
    gunma: Object.freeze({ id: "gunma", code: "10", name: "群馬県", lat: 36.39, lon: 139.06, zoom: 8.5, zoomBoost: 0, bounds: { north: 37.05, south: 36.04, east: 139.62, west: 138.40 } }),
    saitama: Object.freeze({ id: "saitama", code: "11", name: "埼玉県", lat: 35.98, lon: 139.42, zoom: 8.8, zoomBoost: 0, bounds: { north: 36.28, south: 35.75, east: 139.90, west: 138.71 } }),
    chiba: Object.freeze({ id: "chiba", code: "12", name: "千葉県", lat: 35.50, lon: 140.12, zoom: 8.6, zoomBoost: 0, bounds: { north: 36.10, south: 34.90, east: 140.88, west: 139.74 } }),
    tokyo: Object.freeze({ id: "tokyo", code: "13", name: "東京都", lat: 35.69, lon: 139.69, zoom: 10.0, zoomBoost: 1.5, bounds: { north: 35.90, south: 35.50, east: 139.92, west: 139.00 } }),
    kanagawa: Object.freeze({ id: "kanagawa", code: "14", name: "神奈川県", lat: 35.45, lon: 139.34, zoom: 9.4, zoomBoost: 0.9, bounds: { north: 35.67, south: 35.13, east: 139.84, west: 138.92 } }),
    niigata: Object.freeze({ id: "niigata", code: "15", name: "新潟県", lat: 37.50, lon: 138.85, zoom: 7.6, zoomBoost: 0, bounds: { north: 38.55, south: 36.74, east: 139.89, west: 137.64 } }),
    toyama: Object.freeze({ id: "toyama", code: "16", name: "富山県", lat: 36.65, lon: 137.21, zoom: 9.4, zoomBoost: 0.9, bounds: { north: 36.92, south: 36.35, east: 137.62, west: 136.85 } }),
    ishikawa: Object.freeze({ id: "ishikawa", code: "17", name: "石川県", lat: 36.80, lon: 136.80, zoom: 8.0, zoomBoost: 0, bounds: { north: 37.85, south: 36.07, east: 137.36, west: 136.24 } }),
    fukui: Object.freeze({ id: "fukui", code: "18", name: "福井県", lat: 35.85, lon: 136.22, zoom: 8.4, zoomBoost: 0, bounds: { north: 36.30, south: 35.35, east: 136.83, west: 135.45 } }),
    yamanashi: Object.freeze({ id: "yamanashi", code: "19", name: "山梨県", lat: 35.66, lon: 138.57, zoom: 9.0, zoomBoost: 0.5, bounds: { north: 35.97, south: 35.17, east: 139.14, west: 138.18 } }),
    nagano: Object.freeze({ id: "nagano", code: "20", name: "長野県", lat: 36.15, lon: 138.10, zoom: 7.8, zoomBoost: 0, bounds: { north: 37.02, south: 35.20, east: 138.73, west: 137.32 } }),
    gifu: Object.freeze({ id: "gifu", code: "21", name: "岐阜県", lat: 35.80, lon: 137.03, zoom: 8.0, zoomBoost: 0, bounds: { north: 36.46, south: 35.13, east: 137.66, west: 136.28 } }),
    shizuoka: Object.freeze({ id: "shizuoka", code: "22", name: "静岡県", lat: 35.05, lon: 138.38, zoom: 8.2, zoomBoost: 0, bounds: { north: 35.64, south: 34.57, east: 139.18, west: 137.47 } }),
    aichi: Object.freeze({ id: "aichi", code: "23", name: "愛知県", lat: 35.05, lon: 137.15, zoom: 8.6, zoomBoost: 0, bounds: { north: 35.42, south: 34.57, east: 137.83, west: 136.67 } }),
    mie: Object.freeze({ id: "mie", code: "24", name: "三重県", lat: 34.50, lon: 136.40, zoom: 8.0, zoomBoost: 0, bounds: { north: 35.26, south: 33.72, east: 136.98, west: 135.85 } }),
    shiga: Object.freeze({ id: "shiga", code: "25", name: "滋賀県", lat: 35.20, lon: 136.10, zoom: 9.0, zoomBoost: 0.5, bounds: { north: 35.70, south: 34.79, east: 136.46, west: 135.77 } }),
    kyoto: Object.freeze({ id: "kyoto", code: "26", name: "京都府", lat: 35.25, lon: 135.50, zoom: 8.4, zoomBoost: 0, bounds: { north: 35.78, south: 34.71, east: 135.87, west: 134.85 } }),
    osaka: Object.freeze({ id: "osaka", code: "27", name: "大阪府", lat: 34.69, lon: 135.50, zoom: 10.0, zoomBoost: 1.5, bounds: { north: 35.05, south: 34.27, east: 135.75, west: 135.09 } }),
    hyogo: Object.freeze({ id: "hyogo", code: "28", name: "兵庫県", lat: 35.00, lon: 134.85, zoom: 8.2, zoomBoost: 0, bounds: { north: 35.67, south: 34.16, east: 135.47, west: 134.25 } }),
    nara: Object.freeze({ id: "nara", code: "29", name: "奈良県", lat: 34.30, lon: 135.85, zoom: 8.8, zoomBoost: 0.3, bounds: { north: 34.78, south: 33.86, east: 136.12, west: 135.54 } }),
    wakayama: Object.freeze({ id: "wakayama", code: "30", name: "和歌山県", lat: 33.95, lon: 135.45, zoom: 8.4, zoomBoost: 0, bounds: { north: 34.38, south: 33.45, east: 136.00, west: 135.01 } }),
    tottori: Object.freeze({ id: "tottori", code: "31", name: "鳥取県", lat: 35.35, lon: 134.00, zoom: 8.6, zoomBoost: 0, bounds: { north: 35.62, south: 35.05, east: 134.90, west: 133.14 } }),
    shimane: Object.freeze({ id: "shimane", code: "32", name: "島根県", lat: 35.10, lon: 132.55, zoom: 7.8, zoomBoost: 0, bounds: { north: 36.37, south: 34.31, east: 133.43, west: 131.67 } }),
    okayama: Object.freeze({ id: "okayama", code: "33", name: "岡山県", lat: 34.85, lon: 133.85, zoom: 8.5, zoomBoost: 0, bounds: { north: 35.35, south: 34.29, east: 134.42, west: 133.27 } }),
    hiroshima: Object.freeze({ id: "hiroshima", code: "34", name: "広島県", lat: 34.55, lon: 132.65, zoom: 8.3, zoomBoost: 0, bounds: { north: 35.10, south: 34.08, east: 133.28, west: 132.03 } }),
    yamaguchi: Object.freeze({ id: "yamaguchi", code: "35", name: "山口県", lat: 34.25, lon: 131.50, zoom: 8.4, zoomBoost: 0, bounds: { north: 34.80, south: 33.72, east: 132.24, west: 130.77 } }),
    tokushima: Object.freeze({ id: "tokushima", code: "36", name: "徳島県", lat: 33.92, lon: 134.25, zoom: 8.8, zoomBoost: 0.3, bounds: { north: 34.25, south: 33.54, east: 134.82, west: 133.66 } }),
    kagawa: Object.freeze({ id: "kagawa", code: "37", name: "香川県", lat: 34.30, lon: 133.95, zoom: 9.4, zoomBoost: 0.9, bounds: { north: 34.56, south: 34.04, east: 134.45, west: 133.45 } }),
    ehime: Object.freeze({ id: "ehime", code: "38", name: "愛媛県", lat: 33.65, lon: 132.85, zoom: 8.2, zoomBoost: 0, bounds: { north: 34.30, south: 32.91, east: 133.69, west: 132.04 } }),
    kochi: Object.freeze({ id: "kochi", code: "39", name: "高知県", lat: 33.45, lon: 133.40, zoom: 8.2, zoomBoost: 0, bounds: { north: 33.88, south: 32.70, east: 134.32, west: 132.48 } }),
    fukuoka: Object.freeze({ id: "fukuoka", code: "40", name: "福岡県", lat: 33.50, lon: 130.60, zoom: 8.6, zoomBoost: 0, bounds: { north: 33.88, south: 33.06, east: 131.19, west: 130.03 } }),
    saga: Object.freeze({ id: "saga", code: "41", name: "佐賀県", lat: 33.25, lon: 130.20, zoom: 9.2, zoomBoost: 0.7, bounds: { north: 33.62, south: 32.95, east: 130.54, west: 129.86 } }),
    nagasaki: Object.freeze({ id: "nagasaki", code: "42", name: "長崎県", lat: 33.10, lon: 129.70, zoom: 8.0, zoomBoost: 0, bounds: { north: 34.70, south: 32.00, east: 130.40, west: 128.10 } }),
    kumamoto: Object.freeze({ id: "kumamoto", code: "43", name: "熊本県", lat: 32.70, lon: 130.70, zoom: 8.4, zoomBoost: 0, bounds: { north: 33.20, south: 32.09, east: 131.13, west: 130.14 } }),
    oita: Object.freeze({ id: "oita", code: "44", name: "大分県", lat: 33.20, lon: 131.50, zoom: 8.5, zoomBoost: 0, bounds: { north: 33.74, south: 32.72, east: 132.00, west: 130.83 } }),
    miyazaki: Object.freeze({ id: "miyazaki", code: "45", name: "宮崎県", lat: 32.10, lon: 131.30, zoom: 8.2, zoomBoost: 0, bounds: { north: 32.83, south: 31.36, east: 131.88, west: 130.70 } }),
    kagoshima: Object.freeze({ id: "kagoshima", code: "46", name: "鹿児島県", lat: 31.56, lon: 130.56, zoom: 8.0, zoomBoost: 0, bounds: { north: 32.30, south: 31.00, east: 131.08, west: 129.80 } }),
    okinawa: Object.freeze({ id: "okinawa", code: "47", name: "沖縄県", lat: 26.33, lon: 127.80, zoom: 8.8, zoomBoost: 0.3, bounds: { north: 26.90, south: 26.05, east: 128.35, west: 127.55 } })
  });

  var PREF_ORDER = Object.freeze([
    "hokkaido", "aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima",
    "ibaraki", "tochigi", "gunma", "saitama", "chiba", "tokyo", "kanagawa",
    "niigata", "toyama", "ishikawa", "fukui", "yamanashi", "nagano",
    "gifu", "shizuoka", "aichi", "mie",
    "shiga", "kyoto", "osaka", "hyogo", "nara", "wakayama",
    "tottori", "shimane", "okayama", "hiroshima", "yamaguchi",
    "tokushima", "kagawa", "ehime", "kochi",
    "fukuoka", "saga", "nagasaki", "kumamoto", "oita", "miyazaki", "kagoshima",
    "okinawa"
  ]);

  function normalizePref(value) {
    var raw = String(value || "").trim().toLowerCase();
    if (PREFECTURES[raw]) return raw;
    var list = listPrefectures();
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (list[i].code === String(value).padStart(2, "0")) return list[i].id;
      if (list[i].name === value || list[i].name.replace(/[都道府県]/g, "") === String(value)) return list[i].id;
    }
    return global.DangerConfig.CONFIG.defaultPref;
  }

  function getPrefecture(value) {
    return PREFECTURES[normalizePref(value)];
  }

  function listPrefectures() {
    var list = [];
    var i;
    for (i = 0; i < PREF_ORDER.length; i += 1) list.push(PREFECTURES[PREF_ORDER[i]]);
    return list;
  }

  function prefMaxZoom(pref) {
    return Math.min(10.5, 8.5 + (Number(pref && pref.zoomBoost) || 0));
  }

  global.DangerPrefectures = {
    PREFECTURES: PREFECTURES,
    PREF_ORDER: PREF_ORDER,
    normalizePref: normalizePref,
    getPrefecture: getPrefecture,
    listPrefectures: listPrefectures,
    prefMaxZoom: prefMaxZoom
  };
})(window);
