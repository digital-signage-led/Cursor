/**
 * 47都道府県の表示設定。県ごとのHTMLは作らない。
 * lat/lon/zoom は県全体が見える初期値。管理画面で微調整可能。
 */
(function (global) {
  "use strict";

  var PREFECTURES = Object.freeze({
    hokkaido: Object.freeze({ id: "hokkaido", name: "北海道", lat: 43.45, lon: 142.80, zoom: 7, bounds: [41.35, 139.40, 45.55, 145.82] }),
    aomori: Object.freeze({ id: "aomori", name: "青森県", lat: 40.78, lon: 140.78, zoom: 8, bounds: [40.22, 139.50, 41.56, 141.68] }),
    iwate: Object.freeze({ id: "iwate", name: "岩手県", lat: 39.60, lon: 141.35, zoom: 8, bounds: [38.75, 140.65, 40.45, 142.07] }),
    miyagi: Object.freeze({ id: "miyagi", name: "宮城県", lat: 38.45, lon: 140.92, zoom: 8, bounds: [37.77, 140.27, 39.00, 141.68] }),
    akita: Object.freeze({ id: "akita", name: "秋田県", lat: 39.72, lon: 140.22, zoom: 8, bounds: [38.87, 139.68, 40.51, 140.98] }),
    yamagata: Object.freeze({ id: "yamagata", name: "山形県", lat: 38.45, lon: 140.10, zoom: 8, bounds: [37.73, 139.54, 39.21, 140.65] }),
    fukushima: Object.freeze({ id: "fukushima", name: "福島県", lat: 37.40, lon: 140.20, zoom: 8, bounds: [36.79, 139.16, 37.98, 141.05] }),
    ibaraki: Object.freeze({ id: "ibaraki", name: "茨城県", lat: 36.24, lon: 140.28, zoom: 9, bounds: [35.73, 139.69, 36.95, 140.85] }),
    tochigi: Object.freeze({ id: "tochigi", name: "栃木県", lat: 36.68, lon: 139.82, zoom: 9, bounds: [36.20, 139.33, 37.15, 140.29] }),
    gunma: Object.freeze({ id: "gunma", name: "群馬県", lat: 36.50, lon: 139.00, zoom: 9, bounds: [36.04, 138.40, 37.05, 139.62] }),
    saitama: Object.freeze({ id: "saitama", name: "埼玉県", lat: 35.99, lon: 139.40, zoom: 9, bounds: [35.75, 138.71, 36.28, 139.90] }),
    chiba: Object.freeze({ id: "chiba", name: "千葉県", lat: 35.50, lon: 140.12, zoom: 9, bounds: [34.90, 139.74, 36.10, 140.88] }),
    tokyo: Object.freeze({ id: "tokyo", name: "東京都", lat: 35.69, lon: 139.40, zoom: 9, bounds: [35.50, 139.00, 35.90, 139.92] }),
    kanagawa: Object.freeze({ id: "kanagawa", name: "神奈川県", lat: 35.42, lon: 139.34, zoom: 9, bounds: [35.13, 138.92, 35.67, 139.84] }),
    niigata: Object.freeze({ id: "niigata", name: "新潟県", lat: 37.54, lon: 138.85, zoom: 8, bounds: [36.74, 137.64, 38.55, 139.89] }),
    toyama: Object.freeze({ id: "toyama", name: "富山県", lat: 36.65, lon: 137.26, zoom: 9, bounds: [36.27, 136.77, 36.98, 137.76] }),
    ishikawa: Object.freeze({ id: "ishikawa", name: "石川県", lat: 36.77, lon: 136.77, zoom: 8, bounds: [36.07, 136.24, 37.85, 137.36] }),
    fukui: Object.freeze({ id: "fukui", name: "福井県", lat: 35.85, lon: 136.22, zoom: 8, bounds: [35.35, 135.45, 36.30, 136.83] }),
    yamanashi: Object.freeze({ id: "yamanashi", name: "山梨県", lat: 35.61, lon: 138.61, zoom: 9, bounds: [35.17, 138.18, 35.97, 139.14] }),
    nagano: Object.freeze({ id: "nagano", name: "長野県", lat: 36.15, lon: 138.05, zoom: 8, bounds: [35.20, 137.32, 37.02, 138.73] }),
    gifu: Object.freeze({ id: "gifu", name: "岐阜県", lat: 35.78, lon: 137.05, zoom: 8, bounds: [35.13, 136.28, 36.46, 137.66] }),
    shizuoka: Object.freeze({ id: "shizuoka", name: "静岡県", lat: 35.05, lon: 138.32, zoom: 8, bounds: [34.57, 137.47, 35.64, 139.18] }),
    aichi: Object.freeze({ id: "aichi", name: "愛知県", lat: 35.05, lon: 137.10, zoom: 9, bounds: [34.57, 136.67, 35.42, 137.83] }),
    mie: Object.freeze({ id: "mie", name: "三重県", lat: 34.51, lon: 136.38, zoom: 8, bounds: [33.72, 135.85, 35.26, 136.98] }),
    shiga: Object.freeze({ id: "shiga", name: "滋賀県", lat: 35.22, lon: 136.14, zoom: 9, bounds: [34.79, 135.77, 35.70, 136.46] }),
    kyoto: Object.freeze({ id: "kyoto", name: "京都府", lat: 35.25, lon: 135.45, zoom: 8, bounds: [34.71, 134.85, 35.78, 135.87] }),
    osaka: Object.freeze({ id: "osaka", name: "大阪府", lat: 34.62, lon: 135.51, zoom: 9, bounds: [34.27, 135.09, 35.05, 135.75] }),
    hyogo: Object.freeze({ id: "hyogo", name: "兵庫県", lat: 35.04, lon: 134.86, zoom: 8, bounds: [34.16, 134.25, 35.67, 135.47] }),
    nara: Object.freeze({ id: "nara", name: "奈良県", lat: 34.30, lon: 135.87, zoom: 9, bounds: [33.86, 135.54, 34.78, 136.12] }),
    wakayama: Object.freeze({ id: "wakayama", name: "和歌山県", lat: 33.91, lon: 135.43, zoom: 8, bounds: [33.45, 135.01, 34.38, 136.00] }),
    tottori: Object.freeze({ id: "tottori", name: "鳥取県", lat: 35.36, lon: 133.85, zoom: 8, bounds: [35.05, 133.14, 35.62, 134.90] }),
    shimane: Object.freeze({ id: "shimane", name: "島根県", lat: 35.07, lon: 132.55, zoom: 8, bounds: [34.31, 131.67, 36.37, 133.43] }),
    okayama: Object.freeze({ id: "okayama", name: "岡山県", lat: 34.86, lon: 133.82, zoom: 9, bounds: [34.29, 133.27, 35.35, 134.42] }),
    hiroshima: Object.freeze({ id: "hiroshima", name: "広島県", lat: 34.60, lon: 132.75, zoom: 8, bounds: [34.08, 132.03, 35.10, 133.28] }),
    yamaguchi: Object.freeze({ id: "yamaguchi", name: "山口県", lat: 34.23, lon: 131.57, zoom: 8, bounds: [33.72, 130.77, 34.80, 132.24] }),
    tokushima: Object.freeze({ id: "tokushima", name: "徳島県", lat: 33.92, lon: 134.32, zoom: 9, bounds: [33.54, 133.66, 34.25, 134.82] }),
    kagawa: Object.freeze({ id: "kagawa", name: "香川県", lat: 34.24, lon: 133.97, zoom: 9, bounds: [34.04, 133.45, 34.56, 134.45] }),
    ehime: Object.freeze({ id: "ehime", name: "愛媛県", lat: 33.62, lon: 132.85, zoom: 8, bounds: [32.91, 132.04, 34.30, 133.69] }),
    kochi: Object.freeze({ id: "kochi", name: "高知県", lat: 33.43, lon: 133.37, zoom: 8, bounds: [32.70, 132.48, 33.88, 134.32] }),
    fukuoka: Object.freeze({ id: "fukuoka", name: "福岡県", lat: 33.52, lon: 130.64, zoom: 9, bounds: [33.06, 130.03, 33.88, 131.19] }),
    saga: Object.freeze({ id: "saga", name: "佐賀県", lat: 33.26, lon: 130.10, zoom: 9, bounds: [32.95, 129.86, 33.62, 130.54] }),
    nagasaki: Object.freeze({ id: "nagasaki", name: "長崎県", lat: 33.10, lon: 129.75, zoom: 8, bounds: [32.00, 128.10, 34.70, 130.40] }),
    kumamoto: Object.freeze({ id: "kumamoto", name: "熊本県", lat: 32.65, lon: 130.75, zoom: 8, bounds: [32.09, 130.14, 33.20, 131.13] }),
    oita: Object.freeze({ id: "oita", name: "大分県", lat: 33.20, lon: 131.43, zoom: 8, bounds: [32.72, 130.83, 33.74, 132.00] }),
    miyazaki: Object.freeze({ id: "miyazaki", name: "宮崎県", lat: 32.10, lon: 131.30, zoom: 8, bounds: [31.36, 130.70, 32.83, 131.88] }),
    kagoshima: Object.freeze({ id: "kagoshima", name: "鹿児島県", lat: 31.56, lon: 130.55, zoom: 8, bounds: [30.20, 129.40, 32.30, 131.08] }),
    okinawa: Object.freeze({ id: "okinawa", name: "沖縄県", lat: 26.50, lon: 127.90, zoom: 8, bounds: [24.04, 122.93, 27.90, 131.33] })
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

  var NAME_ALIASES = Object.freeze({
    "北海道": "hokkaido",
    "青森": "aomori",
    "青森県": "aomori",
    "岩手": "iwate",
    "岩手県": "iwate",
    "宮城": "miyagi",
    "宮城県": "miyagi",
    "秋田": "akita",
    "秋田県": "akita",
    "山形": "yamagata",
    "山形県": "yamagata",
    "福島": "fukushima",
    "福島県": "fukushima",
    "茨城": "ibaraki",
    "茨城県": "ibaraki",
    "栃木": "tochigi",
    "栃木県": "tochigi",
    "群馬": "gunma",
    "群馬県": "gunma",
    "埼玉": "saitama",
    "埼玉県": "saitama",
    "千葉": "chiba",
    "千葉県": "chiba",
    "東京": "tokyo",
    "東京都": "tokyo",
    "神奈川": "kanagawa",
    "神奈川県": "kanagawa",
    "新潟": "niigata",
    "新潟県": "niigata",
    "富山": "toyama",
    "富山県": "toyama",
    "石川": "ishikawa",
    "石川県": "ishikawa",
    "福井": "fukui",
    "福井県": "fukui",
    "山梨": "yamanashi",
    "山梨県": "yamanashi",
    "長野": "nagano",
    "長野県": "nagano",
    "岐阜": "gifu",
    "岐阜県": "gifu",
    "静岡": "shizuoka",
    "静岡県": "shizuoka",
    "愛知": "aichi",
    "愛知県": "aichi",
    "三重": "mie",
    "三重県": "mie",
    "滋賀": "shiga",
    "滋賀県": "shiga",
    "京都": "kyoto",
    "京都府": "kyoto",
    "大阪": "osaka",
    "大阪府": "osaka",
    "兵庫": "hyogo",
    "兵庫県": "hyogo",
    "奈良": "nara",
    "奈良県": "nara",
    "和歌山": "wakayama",
    "和歌山県": "wakayama",
    "鳥取": "tottori",
    "鳥取県": "tottori",
    "島根": "shimane",
    "島根県": "shimane",
    "岡山": "okayama",
    "岡山県": "okayama",
    "広島": "hiroshima",
    "広島県": "hiroshima",
    "山口": "yamaguchi",
    "山口県": "yamaguchi",
    "徳島": "tokushima",
    "徳島県": "tokushima",
    "香川": "kagawa",
    "香川県": "kagawa",
    "愛媛": "ehime",
    "愛媛県": "ehime",
    "高知": "kochi",
    "高知県": "kochi",
    "福岡": "fukuoka",
    "福岡県": "fukuoka",
    "佐賀": "saga",
    "佐賀県": "saga",
    "長崎": "nagasaki",
    "長崎県": "nagasaki",
    "熊本": "kumamoto",
    "熊本県": "kumamoto",
    "大分": "oita",
    "大分県": "oita",
    "宮崎": "miyazaki",
    "宮崎県": "miyazaki",
    "鹿児島": "kagoshima",
    "鹿児島県": "kagoshima",
    "沖縄": "okinawa",
    "沖縄県": "okinawa"
  });

  function normalizePref(value) {
    var raw = String(value || "").trim();
    if (!raw) return global.DangerConfig.CONFIG.defaultPref;
    var lower = raw.toLowerCase();
    if (PREFECTURES[lower]) return lower;
    if (NAME_ALIASES[raw]) return NAME_ALIASES[raw];
    return global.DangerConfig.CONFIG.defaultPref;
  }

  function getPrefecture(value) {
    return PREFECTURES[normalizePref(value)];
  }

  function listPrefectures() {
    var list = [];
    for (var i = 0; i < PREF_ORDER.length; i += 1) {
      list.push(PREFECTURES[PREF_ORDER[i]]);
    }
    return list;
  }

  global.DangerPrefectures = {
    PREFECTURES: PREFECTURES,
    PREF_ORDER: PREF_ORDER,
    normalizePref: normalizePref,
    getPrefecture: getPrefecture,
    listPrefectures: listPrefectures
  };
})(window);
