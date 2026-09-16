/**
 * 気象庁キキクルのデータ取得モジュール。
 * 表示処理とは分離する。取得方式が変わってもここだけ直せばよい。
 *
 * 現行（2026年確認）:
 *   GET https://www.jma.go.jp/bosai/jmatile/data/risk/targetTimes.json
 *   タイル https://www.jma.go.jp/bosai/jmatile/data/risk/{basetime}/{member}/{validtime}/surf/{element}/{z}/{x}/{y}.png
 *
 * 要素は targetTimes.elements を見て解決する。古い landslide/inundation 名には決め打ちしない。
 */
(function (global) {
  "use strict";

  var lastGood = {};
  var inflight = {};

  function config() {
    return global.DangerConfig.CONFIG;
  }

  function contentType(typeId) {
    return global.DangerConfig.getContentType(typeId);
  }

  function cacheKey(typeId) {
    return config().cachePrefix + global.DangerConfig.normalizeType(typeId);
  }

  function readCache(typeId) {
    try {
      var raw = global.localStorage.getItem(cacheKey(typeId));
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function writeCache(typeId, snapshot) {
    try {
      global.localStorage.setItem(cacheKey(typeId), JSON.stringify(snapshot));
    } catch (err) {
      /* サイネージ端末で private mode でも表示は継続 */
    }
    lastGood[global.DangerConfig.normalizeType(typeId)] = snapshot;
  }

  function getLastGood(typeId) {
    var key = global.DangerConfig.normalizeType(typeId);
    return lastGood[key] || readCache(key);
  }

  function pickElement(elements, preferred) {
    var list = elements || [];
    var i;
    for (i = 0; i < preferred.length; i += 1) {
      if (list.indexOf(preferred[i]) !== -1) return preferred[i];
    }
    return preferred[0];
  }

  function resolveElement(typeId, elements) {
    var type = contentType(typeId);
    var preferred = [type.jmaElement];
    if (type.id === "land") preferred.push("landslide", "land");
    if (type.id === "inundation") preferred.push("inundation", "inund");
    if (type.id === "flood") preferred.push("flood_mesh", "flood");
    return pickElement(elements, preferred);
  }

  function pickLatestTarget(rows, typeId) {
    if (!rows || !rows.length) return null;
    var type = contentType(typeId);
    var usable = [];
    var i;
    var row;
    var elements;

    for (i = 0; i < rows.length; i += 1) {
      row = rows[i];
      elements = row.elements || [];
      if (!elements.length || elements.indexOf(type.jmaElement) !== -1 ||
          elements.indexOf("land") !== -1 || elements.indexOf("inund") !== -1 ||
          elements.indexOf("flood_mesh") !== -1 || elements.indexOf("landslide") !== -1) {
        usable.push(row);
      }
    }
    if (!usable.length) usable = rows.slice();

    usable.sort(function (a, b) {
      return String(b.basetime || "").localeCompare(String(a.basetime || ""));
    });

    var latestTime = usable[0].basetime;
    var same = usable.filter(function (item) {
      return item.basetime === latestTime;
    });

    for (i = 0; i < same.length; i += 1) {
      if (String(same[i].member || "").indexOf("immed") === 0) return same[i];
    }
    return same[0];
  }

  function formatJst(basetime) {
    if (!basetime || String(basetime).length < 12) return "";
    var y = basetime.slice(0, 4);
    var m = basetime.slice(4, 6);
    var d = basetime.slice(6, 8);
    var hh = basetime.slice(8, 10);
    var mm = basetime.slice(10, 12);
    var utc = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm)));
    var jst = new Date(utc.getTime() + 9 * 60 * 60 * 1000);
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return jst.getUTCFullYear() + "/" + pad(jst.getUTCMonth() + 1) + "/" + pad(jst.getUTCDate()) +
      " " + pad(jst.getUTCHours()) + ":" + pad(jst.getUTCMinutes());
  }

  function toSnapshot(row, typeId) {
    var type = contentType(typeId);
    var element = resolveElement(typeId, row.elements);
    var member = row.member || "none";
    var base = config().jmaRiskBase.replace(/\/$/, "");
    return {
      type: type.id,
      name: type.name,
      element: element,
      basetime: row.basetime,
      validtime: row.validtime || row.basetime,
      member: member,
      updatedLabel: formatJst(row.validtime || row.basetime),
      fetchedAt: Date.now(),
      tileUrl: base + "/" + row.basetime + "/" + member + "/" + (row.validtime || row.basetime) +
        "/surf/" + element + "/{z}/{x}/{y}.png"
    };
  }

  function sameSnapshot(a, b) {
    if (!a || !b) return false;
    return a.basetime === b.basetime && a.validtime === b.validtime &&
      a.member === b.member && a.element === b.element;
  }

  function fetchTargetTimes() {
    var url = config().jmaRiskBase.replace(/\/$/, "") + "/" + config().jmaTargetTimesPath +
      "?_=" + Date.now();
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("JMA targetTimes HTTP " + res.status);
      return res.json();
    });
  }

  function fetchLatest(typeId) {
    var type = contentType(typeId);
    var key = type.id;
    if (inflight[key]) return inflight[key];

    inflight[key] = fetchTargetTimes().then(function (rows) {
      var row = pickLatestTarget(rows, key);
      if (!row) throw new Error("JMA targetTimes empty");
      var snapshot = toSnapshot(row, key);
      writeCache(key, snapshot);
      return snapshot;
    }).then(function (snapshot) {
      inflight[key] = null;
      return snapshot;
    }, function (err) {
      inflight[key] = null;
      throw err;
    });

    return inflight[key];
  }

  global.KikikuruApi = {
    fetchLatest: fetchLatest,
    getLastGood: getLastGood,
    sameSnapshot: sameSnapshot,
    formatJst: formatJst
  };
})(window);
