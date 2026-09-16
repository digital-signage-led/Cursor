/**
 * 管理画面専用。公開サイネージ画面には読み込まない。
 */
(function (global) {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function bool(el) {
    return !!el.checked;
  }

  function fillPrefSelect() {
    var select = $("pref");
    var list = global.DangerPrefectures.listPrefectures();
    var i;
    select.innerHTML = "";
    for (i = 0; i < list.length; i += 1) {
      var option = document.createElement("option");
      option.value = list[i].id;
      option.textContent = list[i].name;
      select.appendChild(option);
    }
  }

  function applyPrefDefaults(prefId) {
    var pref = global.DangerPrefectures.getPrefecture(prefId);
    $("lat").value = pref.lat;
    $("lon").value = pref.lon;
    $("zoom").value = pref.zoom;
    $("south").value = pref.bounds[0];
    $("west").value = pref.bounds[1];
    $("north").value = pref.bounds[2];
    $("east").value = pref.bounds[3];
  }

  function defaultSettings() {
    var cfg = global.DangerConfig.CONFIG;
    var pref = global.DangerPrefectures.getPrefecture(cfg.defaultPref);
    return {
      pref: pref.id,
      type: cfg.defaultType,
      showTitle: cfg.displayDefaults.showTitle,
      showPrefName: cfg.displayDefaults.showPrefName,
      showLegend: cfg.displayDefaults.showLegend,
      showUpdated: cfg.displayDefaults.showUpdated,
      showHeader: cfg.displayDefaults.showHeader,
      fitBounds: false,
      lat: pref.lat,
      lon: pref.lon,
      zoom: pref.zoom,
      south: pref.bounds[0],
      west: pref.bounds[1],
      north: pref.bounds[2],
      east: pref.bounds[3]
    };
  }

  function readForm() {
    return {
      pref: $("pref").value,
      type: $("type").value,
      showTitle: bool($("showTitle")),
      showPrefName: bool($("showPrefName")),
      showLegend: bool($("showLegend")),
      showUpdated: bool($("showUpdated")),
      showHeader: bool($("showHeader")),
      fitBounds: bool($("fitBounds")),
      lat: Number($("lat").value),
      lon: Number($("lon").value),
      zoom: Number($("zoom").value),
      south: Number($("south").value),
      west: Number($("west").value),
      north: Number($("north").value),
      east: Number($("east").value)
    };
  }

  function writeForm(settings) {
    $("pref").value = settings.pref;
    $("type").value = settings.type;
    $("showTitle").checked = settings.showTitle;
    $("showPrefName").checked = settings.showPrefName;
    $("showLegend").checked = settings.showLegend;
    $("showUpdated").checked = settings.showUpdated;
    $("showHeader").checked = settings.showHeader;
    $("fitBounds").checked = settings.fitBounds;
    $("lat").value = settings.lat;
    $("lon").value = settings.lon;
    $("zoom").value = settings.zoom;
    $("south").value = settings.south;
    $("west").value = settings.west;
    $("north").value = settings.north;
    $("east").value = settings.east;
  }

  function publicUrl(settings) {
    var url = new URL("../index.html", global.location.href);
    url.search = "";
    url.searchParams.set("pref", settings.pref);
    url.searchParams.set("type", settings.type);
    url.searchParams.set("title", settings.showTitle ? "1" : "0");
    url.searchParams.set("prefName", settings.showPrefName ? "1" : "0");
    url.searchParams.set("legend", settings.showLegend ? "1" : "0");
    url.searchParams.set("updated", settings.showUpdated ? "1" : "0");
    url.searchParams.set("header", settings.showHeader ? "1" : "0");
    url.searchParams.set("lat", String(settings.lat));
    url.searchParams.set("lon", String(settings.lon));
    url.searchParams.set("zoom", String(settings.zoom));
    if (settings.fitBounds) {
      url.searchParams.set("fit", "1");
      url.searchParams.set("south", String(settings.south));
      url.searchParams.set("west", String(settings.west));
      url.searchParams.set("north", String(settings.north));
      url.searchParams.set("east", String(settings.east));
    }
    return url.href;
  }

  function previewUrl(settings) {
    var url = new URL(publicUrl(settings));
    url.searchParams.set("edit", "1");
    return url.href;
  }

  function refreshUrl() {
    $("public-url").value = publicUrl(readForm());
  }

  function updatePreview() {
    var settings = readForm();
    $("preview-frame").src = previewUrl(settings);
    refreshUrl();
  }

  function saveSettings() {
    var settings = readForm();
    global.localStorage.setItem(global.DangerConfig.CONFIG.storageKey, JSON.stringify(settings));
    refreshUrl();
  }

  function loadSettings() {
    try {
      var raw = global.localStorage.getItem(global.DangerConfig.CONFIG.storageKey);
      if (!raw) return false;
      writeForm(Object.assign(defaultSettings(), JSON.parse(raw)));
      return true;
    } catch (err) {
      return false;
    }
  }

  function copyUrl() {
    var text = $("public-url").value;
    if (global.navigator.clipboard && global.navigator.clipboard.writeText) {
      global.navigator.clipboard.writeText(text);
      return;
    }
    $("public-url").select();
    document.execCommand("copy");
  }

  function boot() {
    fillPrefSelect();
    if (!loadSettings()) writeForm(defaultSettings());
    refreshUrl();
    updatePreview();

    $("pref").addEventListener("change", function () {
      applyPrefDefaults($("pref").value);
      updatePreview();
    });
    $("type").addEventListener("change", updatePreview);
    ["showTitle", "showPrefName", "showLegend", "showUpdated", "showHeader", "fitBounds"]
      .forEach(function (id) {
        $(id).addEventListener("change", updatePreview);
      });
    ["lat", "lon", "zoom", "south", "west", "north", "east"].forEach(function (id) {
      $(id).addEventListener("change", function () {
        refreshUrl();
        var view = {
          lat: Number($("lat").value),
          lon: Number($("lon").value),
          zoom: Number($("zoom").value)
        };
        var frame = $("preview-frame").contentWindow;
        if (frame) {
          frame.postMessage({ source: "kikikuru-admin", view: view }, global.location.origin);
        }
      });
    });

    $("preview").addEventListener("click", updatePreview);
    $("copy-url").addEventListener("click", copyUrl);
    $("save").addEventListener("click", saveSettings);
    $("load").addEventListener("click", function () {
      loadSettings();
      updatePreview();
    });
    $("reset").addEventListener("click", function () {
      writeForm(defaultSettings());
      updatePreview();
    });

    global.addEventListener("message", function (event) {
      if (event.origin !== global.location.origin) return;
      if (!event.data || event.data.source !== "kikikuru-display" || !event.data.view) return;
      $("lat").value = event.data.view.lat;
      $("lon").value = event.data.view.lon;
      $("zoom").value = event.data.view.zoom;
      if (event.data.view.bounds) {
        $("south").value = event.data.view.bounds[0];
        $("west").value = event.data.view.bounds[1];
        $("north").value = event.data.view.bounds[2];
        $("east").value = event.data.view.bounds[3];
      }
      refreshUrl();
    });
  }

  document.addEventListener("DOMContentLoaded", boot);
})(window);
