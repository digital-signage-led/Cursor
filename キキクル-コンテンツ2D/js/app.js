/**
 * 公開サイネージ画面。管理コードは読み込まない。
 */
(function (global) {
  "use strict";

  var state = {
    settings: null,
    snapshot: null,
    timer: null,
    fetching: false
  };

  function $(id) {
    return document.getElementById(id);
  }

  function flag(params, key, fallback) {
    if (!params.has(key)) return fallback;
    var value = params.get(key);
    return value !== "0" && value !== "false" && value !== "off";
  }

  function readSettings() {
    var params = new URLSearchParams(global.location.search);
    if (params.get("studio") === "1") {
      var adminUrl = new URL("admin/", global.location.href);
      params.delete("studio");
      adminUrl.search = params.toString();
      global.location.replace(adminUrl.toString());
      return null;
    }

    var cfg = global.DangerConfig.CONFIG;
    var defaults = cfg.displayDefaults;
    var pref = global.DangerPrefectures.getPrefecture(params.get("pref") || params.get("prefecture") || cfg.defaultPref);
    var type = global.DangerConfig.getContentType(params.get("type") || cfg.defaultType);

    return {
      pref: pref,
      type: type,
      showTitle: flag(params, "title", defaults.showTitle),
      showPrefName: flag(params, "prefName", defaults.showPrefName),
      showLegend: flag(params, "legend", defaults.showLegend),
      showUpdated: flag(params, "updated", defaults.showUpdated),
      showHeader: flag(params, "header", defaults.showHeader),
      showPanel: flag(params, "panel", true)
    };
  }

  function fitStage() {
    var stage = $("stage");
    if (!stage) return;
    var cfg = global.DangerConfig.CONFIG;
    var scale = Math.min(global.innerWidth / cfg.stageWidth, global.innerHeight / cfg.stageHeight);
    var x = (global.innerWidth - cfg.stageWidth * scale) / 2;
    var y = (global.innerHeight - cfg.stageHeight * scale) / 2;
    stage.style.position = "absolute";
    stage.style.left = "0";
    stage.style.top = "0";
    stage.style.transformOrigin = "0 0";
    if (Math.abs(scale - 1) < 0.002 && Math.abs(x) < 1 && Math.abs(y) < 1) {
      stage.style.transform = "none";
    } else {
      stage.style.transform = "translate(" + x + "px," + y + "px) scale(" + scale + ")";
    }
  }

  function renderLegend() {
    var box = $("legend");
    if (!box) return;
    var html = "";
    var levels = global.DangerConfig.RISK_LEVELS;
    var i;
    for (i = 0; i < levels.length; i += 1) {
      html += '<div class="legend-step"><i style="background:' + levels[i].color + '"></i>' +
        levels[i].label + "</div>";
    }
    box.innerHTML = html;
  }

  function applyChrome(settings) {
    var screen = $("stage");
    screen.classList.toggle("is-header-off", !settings.showHeader);
    screen.classList.toggle("is-title-off", !settings.showTitle);
    screen.classList.toggle("is-pref-off", !settings.showPrefName);
    screen.classList.toggle("is-legend-off", !settings.showLegend);
    screen.classList.toggle("is-updated-off", !settings.showUpdated);
    screen.classList.toggle("is-panel-off", !settings.showPanel);
    $("info-panel").hidden = !settings.showPanel;
    $("content-title").textContent = settings.pref.name + "｜" + settings.type.name;
    $("pref-name").textContent = settings.pref.name;
    $("panel-area").textContent = settings.pref.name;
    $("panel-hint").textContent = settings.type.name;
    $("panel-pref").textContent = settings.pref.name;
    document.title = settings.type.name + "｜" + settings.pref.name;
  }

  function setStatus(kind, text) {
    var el = $("status");
    if (!el) return;
    el.className = "status is-" + kind;
    el.textContent = text;
  }

  function applySnapshot(snapshot) {
    if (!snapshot) return;
    state.snapshot = snapshot;
    var label = snapshot.updatedLabel || "—";
    if ($("updated-time")) $("updated-time").textContent = label === "—" ? "—" : label + "更新";
    if ($("panel-updated")) $("panel-updated").textContent = label;
    if (!global.KikikuruApi.sameSnapshot(state.shownSnapshot, snapshot)) {
      global.DangerMap.setRiskTiles(snapshot.tileUrl);
      state.shownSnapshot = snapshot;
    }
  }

  function refresh(reason) {
    if (state.fetching) return;
    state.fetching = true;
    if (reason === "auto") setStatus("sync", "更新確認中");

    global.KikikuruApi.fetchLatest(state.settings.type.id).then(function (snapshot) {
      applySnapshot(snapshot);
      setStatus("ok", "最新");
      state.fetching = false;
    }, function () {
      var cached = global.KikikuruApi.getLastGood(state.settings.type.id);
      if (cached) applySnapshot(cached);
      setStatus("error", "最新データ取得に失敗しました");
      state.fetching = false;
    });
  }

  function boot() {
    var settings = readSettings();
    if (!settings) return;
    state.settings = settings;

    fitStage();
    renderLegend();
    applyChrome(settings);

    global.DangerMap.create("map", settings.pref).then(function () {
      var cached = global.KikikuruApi.getLastGood(settings.type.id);
      if (cached) applySnapshot(cached);
      setStatus("sync", "更新確認中");
      refresh("boot");
      global.DangerMap.invalidate();
    });

    global.addEventListener("message", function (event) {
      if (event.origin !== global.location.origin) return;
      if (!event.data || event.data.source !== "kikikuru-admin") return;
      if (event.data.pref) {
        var next = global.DangerPrefectures.getPrefecture(event.data.pref);
        state.settings.pref = next;
        applyChrome(state.settings);
        global.DangerMap.setPrefecture(next).then(function () {
          if (state.snapshot) global.DangerMap.setRiskTiles(state.snapshot.tileUrl);
        });
      }
      if (event.data.type) {
        state.settings.type = global.DangerConfig.getContentType(event.data.type);
        applyChrome(state.settings);
        state.shownSnapshot = null;
        refresh("boot");
      }
    });

    state.timer = setInterval(function () { refresh("auto"); }, global.DangerConfig.CONFIG.refreshMs);

    global.addEventListener("resize", function () {
      fitStage();
      global.DangerMap.invalidate();
    });
    document.documentElement.classList.remove("is-boot");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
