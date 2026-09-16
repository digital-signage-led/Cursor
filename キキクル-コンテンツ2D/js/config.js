/**
 * 危険度コンテンツの一元設定。
 * HTMLへ都道府県・地図・API・更新間隔を直接書かない。
 */
(function (global) {
  "use strict";

  var RISK_LEVELS = Object.freeze([
    Object.freeze({ id: "info", label: "今後の情報等に留意", color: "#F2E6FF", text: "#333333" }),
    Object.freeze({ id: "advisory", label: "注意", color: "#F2E652", text: "#222222" }),
    Object.freeze({ id: "warning", label: "警戒", color: "#FF2800", text: "#FFFFFF" }),
    Object.freeze({ id: "danger", label: "危険", color: "#AA00AA", text: "#FFFFFF" }),
    Object.freeze({ id: "emergency", label: "災害切迫", color: "#0C000C", text: "#FFFFFF" })
  ]);

  var CONTENT_TYPES = Object.freeze({
    land: Object.freeze({
      id: "land",
      name: "土砂キキクル",
      shortName: "土砂",
      jmaElement: "land"
    }),
    inundation: Object.freeze({
      id: "inundation",
      name: "浸水キキクル",
      shortName: "浸水",
      jmaElement: "inund"
    }),
    flood: Object.freeze({
      id: "flood",
      name: "洪水キキクル",
      shortName: "洪水",
      jmaElement: "flood_mesh"
    })
  });

  var TYPE_ALIASES = Object.freeze({
    land: "land",
    landslide: "land",
    dosha: "land",
    inundation: "inundation",
    inund: "inundation",
    flood: "flood",
    flood_mesh: "flood"
  });

  var CONFIG = Object.freeze({
    genreId: "danger",
    genreName: "③ 危険度",
    stageWidth: 1920,
    stageHeight: 1080,
    defaultPref: "osaka",
    defaultType: "land",
    refreshMs: 60 * 1000,
    layerSwapTimeoutMs: 4000,
    jmaRiskBase: "https://www.jma.go.jp/bosai/jmatile/data/risk",
    jmaTargetTimesPath: "targetTimes.json",
    prefGeoUrl: "data/japan-prefectures.geojson",
    seaColor: "#6e9bb8",
    jmaAttribution: "都道府県界 ／ キキクル © 気象庁",
    tileMinZoom: 4,
    tileMaxZoom: 10.5,
    tileMaxNativeZoom: 6,
    riskOpacity: 0.92,
    cachePrefix: "kikikuru:last:",
    storageKey: "kikikuru:admin:settings:v2",
    displayDefaults: Object.freeze({
      showTitle: true,
      showPrefName: true,
      showLegend: true,
      showUpdated: true,
      showHeader: true,
      showPanel: true
    })
  });

  function normalizeType(value) {
    var key = String(value || "").toLowerCase();
    return TYPE_ALIASES[key] || CONFIG.defaultType;
  }

  function getContentType(value) {
    return CONTENT_TYPES[normalizeType(value)];
  }

  global.DangerConfig = {
    CONFIG: CONFIG,
    RISK_LEVELS: RISK_LEVELS,
    CONTENT_TYPES: CONTENT_TYPES,
    normalizeType: normalizeType,
    getContentType: getContentType
  };
})(window);
