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

  function num(params, key, fallback) {
    if (!params.has(key)) return fallback;
    var value = Number(params.get(key));
    return isFinite(value) ? value : fallback;
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
    var pref = global.DangerPrefectures.getPrefecture(params.get("pref") || cfg.defaultPref);
    var type = global.DangerConfig.getContentType(params.get("type") || cfg.defaultType);
    var view = {
      lat: num(params, "lat", pref.lat),
      lon: num(params, "lon", pref.lon),
      zoom: num(params, "zoom", pref.zoom),
      bounds: pref.bounds
    };

    if (params.get("south") && params.get("west") && params.get("north") && params.get("east")) {
      view.bounds = [
        Number(params.get("south")),
        Number(params.get("west")),
        Number(params.get("north")),
        Number(params.get("east"))
      ];
    }

    return {
      pref: pref,
      type: type,
      view: view,
      fitBounds: params.get("fit") === "1",
      showTitle: flag(params, "title", defaults.showTitle),
      showPrefName: flag(params, "prefName", defaults.showPrefName),
      showLegend: flag(params, "legend", defaults.showLegend),
      showUpdated: flag(params, "updated", defaults.showUpdated),
      showHeader: flag(params, "header", defaults.showHeader),
      interactive: params.get("edit") === "1"
    };
  }

  function fitStage() {
    var stage = $("stage");
    if (!stage) return;
    var cfg = global.DangerConfig.CONFIG;
    var scale = Math.min(global.innerWidth / cfg.stageWidth, global.innerHeight / cfg.stageHeight);
    var x = (global.innerWidth - cfg.stageWidth * scale) / 2;
    var y = (global.innerHeight - cfg.stageHeight * scale) / 2;
    stage.style.transform = "translate(" + x + "px," + y + "px) scale(" + scale + ")";
  }

  function renderLegend() {
    var box = $("legend");
    if (!box) return;
    var html = "";
    var levels = global.DangerConfig.RISK_LEVELS;
    var i;
    for (i = 0; i < levels.length; i += 1) {
      html += '<div class="legend-item">' +
        '<span class="legend-swatch" style="background:' + levels[i].color + '"></span>' +
        '<span class="legend-label">' + levels[i].label + "</span></div>";
    }
    box.innerHTML = html;
  }

  function applyChrome(settings) {
    document.body.classList.toggle("hide-header", !settings.showHeader);
    document.body.classList.toggle("hide-title", !settings.showTitle);
    document.body.classList.toggle("hide-pref", !settings.showPrefName);
    document.body.classList.toggle("hide-legend", !settings.showLegend);
    document.body.classList.toggle("hide-updated", !settings.showUpdated);
    $("content-title").textContent = settings.type.name;
    $("pref-name").textContent = settings.pref.name;
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
    if ($("updated-time")) {
      $("updated-time").textContent = snapshot.updatedLabel ? snapshot.updatedLabel + " 現在" : "—";
    }
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

  function startLoop() {
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(function () {
      refresh("auto");
    }, global.DangerConfig.CONFIG.refreshMs);
  }

  function onStudioMessage(event) {
    if (event.origin !== global.location.origin) return;
    if (!event.data || event.data.source !== "kikikuru-admin") return;
    if (event.data.view) {
      global.DangerMap.applyView(event.data.view, false);
    }
    if (event.data.requestView) {
      global.parent.postMessage({
        source: "kikikuru-display",
        view: global.DangerMap.getView()
      }, global.location.origin);
    }
  }

  function boot() {
    var settings = readSettings();
    if (!settings) return;
    state.settings = settings;

    fitStage();
    renderLegend();
    applyChrome(settings);
    global.DangerMap.create("map", settings.view);
    if (settings.fitBounds) {
      global.DangerMap.applyView(settings.view, true);
    }
    global.DangerMap.setInteractive(settings.interactive);
    if (settings.interactive && global.DangerMap.onMove) {
      global.DangerMap.onMove(function (view) {
        if (global.parent && global.parent !== global) {
          global.parent.postMessage({
            source: "kikikuru-display",
            view: view
          }, global.location.origin);
        }
      });
    }

    var cached = global.KikikuruApi.getLastGood(settings.type.id);
    if (cached) {
      applySnapshot(cached);
      setStatus("sync", "更新確認中");
    } else {
      setStatus("sync", "更新確認中");
    }

    refresh("boot");
    startLoop();

    global.addEventListener("resize", function () {
      fitStage();
      global.DangerMap.invalidate();
    });
    global.addEventListener("message", onStudioMessage);
    document.documentElement.classList.remove("is-boot");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
