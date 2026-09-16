/**
 * 管理画面専用。操作とURL一覧は上、プレビューは下全面。
 */
(function (global) {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function toast(text) {
    var el = $("toast");
    el.textContent = text;
    el.hidden = false;
    setTimeout(function () { el.hidden = true; }, 1600);
  }

  function fillPrefSelect() {
    var select = $("pref");
    var list = global.DangerPrefectures.listPrefectures();
    select.innerHTML = "";
    list.forEach(function (pref) {
      var option = document.createElement("option");
      option.value = pref.id;
      option.textContent = pref.name;
      select.appendChild(option);
    });
  }

  function defaultSettings() {
    var cfg = global.DangerConfig.CONFIG;
    return {
      pref: cfg.defaultPref,
      type: cfg.defaultType,
      showTitle: true,
      showPrefName: true,
      showLegend: true,
      showUpdated: true,
      showHeader: true,
      showPanel: true
    };
  }

  function readForm() {
    return {
      pref: $("pref").value,
      type: $("type").value,
      showTitle: $("showTitle").checked,
      showPrefName: $("showPrefName").checked,
      showLegend: $("showLegend").checked,
      showUpdated: $("showUpdated").checked,
      showHeader: $("showHeader").checked,
      showPanel: $("showPanel").checked
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
    $("showPanel").checked = settings.showPanel !== false;
  }

  function displayUrl(settings) {
    var url = new URL("../", global.location.href);
    url.search = "";
    url.searchParams.set("pref", settings.pref);
    url.searchParams.set("type", settings.type);
    url.searchParams.set("title", settings.showTitle ? "1" : "0");
    url.searchParams.set("prefName", settings.showPrefName ? "1" : "0");
    url.searchParams.set("legend", settings.showLegend ? "1" : "0");
    url.searchParams.set("updated", settings.showUpdated ? "1" : "0");
    url.searchParams.set("header", settings.showHeader ? "1" : "0");
    url.searchParams.set("panel", settings.showPanel ? "1" : "0");
    return url.href;
  }

  function copyText(text) {
    if (global.navigator.clipboard && global.navigator.clipboard.writeText) {
      global.navigator.clipboard.writeText(text);
      return;
    }
    var area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
  }

  function renderUrlTable() {
    var settings = readForm();
    var q = ($("url-pref").value || "").trim();
    var rows = global.DangerPrefectures.listPrefectures().filter(function (pref) {
      return !q || pref.name.indexOf(q) !== -1 || pref.id.indexOf(q.toLowerCase()) !== -1;
    });
    var types = ["land", "inundation", "flood"].map(function (id) {
      return global.DangerConfig.getContentType(id);
    });
    var html = "";
    var total = 0;
    rows.forEach(function (pref) {
      types.forEach(function (type) {
        var item = Object.assign({}, settings, { pref: pref.id, type: type.id });
        var href = displayUrl(item);
        total += 1;
        html += '<tr data-pref="' + pref.id + '"><td>' + pref.name + "</td><td>" + type.name +
          '</td><td class="url-cell"><code>' + href + "</code></td><td>" +
          '<button type="button" class="ghost js-copy" data-url="' + href + '">コピー</button></td></tr>';
      });
    });
    $("url-table").innerHTML = html;
    $("url-count").textContent = total + " / 141";
  }

  function fitPreviewFrame(frame) {
    var host = document.querySelector(".admin-preview");
    var el = frame || $("preview-frame");
    if (!host || !el) return;
    var scale = Math.min(host.clientWidth / 1920, host.clientHeight / 1080);
    var x = (host.clientWidth - 1920 * scale) / 2;
    var y = (host.clientHeight - 1080 * scale) / 2;
    el.style.position = "absolute";
    el.style.width = "1920px";
    el.style.height = "1080px";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.border = "0";
    el.style.transformOrigin = "0 0";
    el.style.transform = "scale(" + scale + ")";
  }

  function bindPreviewLoad(frame) {
    frame.addEventListener("load", function () {
      var settings = readForm();
      var win = frame.contentWindow;
      if (!win || win.location.href === "about:blank") return;
      try {
        win.postMessage({
          source: "kikikuru-admin",
          pref: settings.pref,
          type: settings.type
        }, global.location.origin);
      } catch (err) {
        /* ignore */
      }
    });
  }

  function updatePreview() {
    var settings = readForm();
    var url = displayUrl(settings);
    var next = url + (url.indexOf("?") === -1 ? "?" : "&") + "_=" + Date.now();
    var old = $("preview-frame");
    var frame = document.createElement("iframe");
    frame.id = "preview-frame";
    frame.title = "キキクルプレビュー";
    old.parentNode.replaceChild(frame, old);
    fitPreviewFrame(frame);
    bindPreviewLoad(frame);
    frame.src = next;
    renderUrlTable();
  }

  function boot() {
    fillPrefSelect();
    var saved = null;
    try {
      saved = JSON.parse(global.localStorage.getItem(global.DangerConfig.CONFIG.storageKey) || "null");
    } catch (err) {
      saved = null;
    }
    writeForm(Object.assign(defaultSettings(), saved || {}));
    updatePreview();

    ["pref", "type", "showTitle", "showPrefName", "showLegend", "showUpdated", "showHeader", "showPanel"]
      .forEach(function (id) {
        $(id).addEventListener("change", updatePreview);
      });
    $("url-pref").addEventListener("input", renderUrlTable);
    $("preview").addEventListener("click", updatePreview);
    $("copy-url").addEventListener("click", function () {
      copyText(displayUrl(readForm()));
      toast("公開URLをコピーしました");
    });
    $("save").addEventListener("click", function () {
      global.localStorage.setItem(global.DangerConfig.CONFIG.storageKey, JSON.stringify(readForm()));
      toast("保存しました");
    });
    $("load").addEventListener("click", function () {
      try {
        var raw = global.localStorage.getItem(global.DangerConfig.CONFIG.storageKey);
        if (!raw) return toast("保存データがありません");
        writeForm(Object.assign(defaultSettings(), JSON.parse(raw)));
        updatePreview();
        toast("読み込みました");
      } catch (err) {
        toast("読み込みに失敗しました");
      }
    });
    $("reset").addEventListener("click", function () {
      writeForm(defaultSettings());
      updatePreview();
    });
    $("open-url").addEventListener("click", function () {
      global.open(displayUrl(readForm()), "_blank");
    });
    $("url-table").addEventListener("click", function (event) {
      var btn = event.target.closest(".js-copy");
      if (btn) {
        copyText(btn.getAttribute("data-url"));
        toast("コピーしました");
        return;
      }
      var row = event.target.closest("tr[data-pref]");
      if (!row) return;
      $("pref").value = row.getAttribute("data-pref");
      updatePreview();
    });
    global.addEventListener("resize", function () {
      fitPreviewFrame();
    });
  }

  document.addEventListener("DOMContentLoaded", boot);
})(window);
