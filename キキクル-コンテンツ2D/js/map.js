/**
 * グレー県境＋青い海。道路地図は使わない。
 * 県切替は地図を作り直し、setView で中心・ズームを必ず動かす。
 */
(function (global) {
  "use strict";

  var map = null;
  var fillLayer = null;
  var strokeLayer = null;
  var riskLayer = null;
  var pendingLayer = null;
  var containerId = "map";
  var currentPref = null;
  var lastTileUrl = "";
  var geojson = null;
  var building = null;
  var TRANSPARENT = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  function cfg() {
    return global.DangerConfig.CONFIG;
  }

  function featurePrefId(feature) {
    return String((feature && feature.properties && feature.properties.id) || "").padStart(2, "0");
  }

  function fillStyle(feature, code) {
    var focus = featurePrefId(feature) === code;
    return {
      stroke: false,
      fillColor: focus ? "#F2E6FF" : "#c4c8cd",
      fillOpacity: focus ? 0.96 : 0.62
    };
  }

  function strokeStyle(feature, code) {
    var focus = featurePrefId(feature) === code;
    return {
      fill: false,
      color: focus ? "#3d424a" : "#7a8088",
      weight: focus ? 3.4 : 1.5,
      opacity: 1,
      lineJoin: "round",
      lineCap: "round"
    };
  }

  function largestRingBounds(feature) {
    var geom = feature && feature.geometry;
    if (!geom) return null;
    var polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
    var best = null;
    var bestArea = -1;
    var i;
    for (i = 0; i < (polys || []).length; i += 1) {
      var ring = polys[i] && polys[i][0];
      if (!ring || ring.length < 4) continue;
      var minX = 180;
      var minY = 90;
      var maxX = -180;
      var maxY = -90;
      var j;
      for (j = 0; j < ring.length; j += 1) {
        var x = ring[j][0];
        var y = ring[j][1];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      var area = (maxX - minX) * (maxY - minY);
      if (area > bestArea) {
        bestArea = area;
        best = global.L.latLngBounds([minY, minX], [maxY, maxX]);
      }
    }
    return best;
  }

  function featureBoundsForPref(pref) {
    if (!fillLayer || !pref) return null;
    var found = null;
    fillLayer.eachLayer(function (layer) {
      if (found || featurePrefId(layer.feature) !== pref.code) return;
      found = largestRingBounds(layer.feature);
    });
    return found;
  }

  function applyPrefView(pref) {
    if (!map || !pref) return;
    var zoom = Math.min(global.DangerPrefectures.prefMaxZoom(pref), Number(pref.zoom) || 8);
    map.setView([pref.lat, pref.lon], zoom, { animate: false });
    var bounds = featureBoundsForPref(pref);
    var b = pref.bounds;
    if (!bounds && b && b.south != null) {
      bounds = global.L.latLngBounds([b.south, b.west], [b.north, b.east]);
    }
    if (bounds) {
      map.fitBounds(bounds, {
        padding: [28, 28],
        maxZoom: global.DangerPrefectures.prefMaxZoom(pref),
        animate: false
      });
    }
  }

  function destroyMap() {
    if (map) {
      try { map.remove(); } catch (err) { /* ignore */ }
    }
    map = null;
    fillLayer = null;
    strokeLayer = null;
    riskLayer = null;
    pendingLayer = null;
    var el = document.getElementById(containerId);
    if (el) {
      el._leaflet_id = null;
      el.innerHTML = "";
    }
  }

  function waitSize(el) {
    return new Promise(function (resolve) {
      var n = 0;
      var tick = function () {
        n += 1;
        if ((el && el.clientWidth >= 80 && el.clientHeight >= 80) || n > 40) {
          resolve();
          return;
        }
        setTimeout(tick, 50);
      };
      tick();
    });
  }

  function disableInteraction() {
    if (!map) return;
    if (map.dragging) map.dragging.disable();
    if (map.touchZoom) map.touchZoom.disable();
    if (map.doubleClickZoom) map.doubleClickZoom.disable();
    if (map.scrollWheelZoom) map.scrollWheelZoom.disable();
    if (map.boxZoom) map.boxZoom.disable();
    if (map.keyboard) map.keyboard.disable();
  }

  function loadGeo() {
    if (geojson) return Promise.resolve(geojson);
    return fetch(cfg().prefGeoUrl).then(function (res) {
      if (!res.ok) throw new Error("県境データを読み込めませんでした");
      return res.json();
    }).then(function (data) {
      geojson = data;
      return data;
    });
  }

  function buildMap(pref) {
    var el = document.getElementById(containerId);
    var job = waitSize(el).then(function () {
      return loadGeo().catch(function () { return null; });
    }).then(function (data) {
      if (building !== job) return map;
      destroyMap();
      var host = document.getElementById(containerId);
      map = global.L.map(host, {
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: false,
        zoomAnimation: false,
        markerZoomAnimation: false,
        inertia: false,
        minZoom: cfg().tileMinZoom,
        maxZoom: cfg().tileMaxZoom,
        zoomSnap: 0.25,
        zoomDelta: 0.25
      });
      map.getContainer().style.background = cfg().seaColor;
      map.createPane("prefFillPane");
      map.getPane("prefFillPane").style.zIndex = 350;
      map.createPane("riskPane");
      map.getPane("riskPane").style.zIndex = 450;
      map.getPane("riskPane").style.pointerEvents = "none";
      map.createPane("prefStrokePane");
      map.getPane("prefStrokePane").style.zIndex = 460;
      map.getPane("prefStrokePane").style.pointerEvents = "none";

      if (data) {
        fillLayer = global.L.geoJSON(data, {
          pane: "prefFillPane",
          interactive: false,
          style: function (feature) { return fillStyle(feature, pref.code); }
        }).addTo(map);
        strokeLayer = global.L.geoJSON(data, {
          pane: "prefStrokePane",
          interactive: false,
          style: function (feature) { return strokeStyle(feature, pref.code); }
        }).addTo(map);
      }

      applyPrefView(pref);
      disableInteraction();
      if (lastTileUrl) {
        var url = lastTileUrl;
        lastTileUrl = "";
        setRiskTiles(url);
      }
      map.whenReady(function () {
        if (!map || currentPref !== pref) return;
        map.invalidateSize(false);
        applyPrefView(pref);
        if (riskLayer) riskLayer.redraw();
      });
      requestAnimationFrame(function () {
        if (!map || currentPref !== pref) return;
        map.invalidateSize(false);
        applyPrefView(pref);
        if (riskLayer) riskLayer.redraw();
      });
      return map;
    });
    building = job;
    return job;
  }

  function create(id, pref) {
    containerId = id || "map";
    currentPref = pref;
    return buildMap(pref);
  }

  function setPrefecture(pref) {
    currentPref = pref;
    return buildMap(pref);
  }

  function activateRiskLayer(next) {
    if (!map || !next) return;
    if (riskLayer && riskLayer !== next) map.removeLayer(riskLayer);
    riskLayer = next;
    pendingLayer = null;
    next.setOpacity(cfg().riskOpacity);
  }

  function setRiskTiles(tileUrl) {
    if (!tileUrl) return;
    lastTileUrl = tileUrl;
    if (!map) return;
    if (riskLayer && riskLayer._url === tileUrl) return;

    var next = global.L.tileLayer(tileUrl, {
      pane: "riskPane",
      minZoom: cfg().tileMinZoom,
      maxZoom: cfg().tileMaxZoom,
      minNativeZoom: cfg().tileMinZoom,
      maxNativeZoom: cfg().tileMaxNativeZoom,
      opacity: riskLayer ? 0.01 : cfg().riskOpacity,
      className: "jma-risk-layer",
      errorTileUrl: TRANSPARENT,
      keepBuffer: 6,
      updateWhenZooming: false,
      crossOrigin: true
    });

    if (pendingLayer && map.hasLayer(pendingLayer)) map.removeLayer(pendingLayer);
    pendingLayer = next;
    next.addTo(map);

    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      activateRiskLayer(next);
    };
    next.once("load", finish);
    setTimeout(finish, cfg().layerSwapTimeoutMs);
  }

  function invalidate() {
    if (!map || !currentPref) return;
    map.invalidateSize({ animate: false });
    applyPrefView(currentPref);
  }

  global.DangerMap = {
    create: create,
    setPrefecture: setPrefecture,
    applyPrefView: applyPrefView,
    setRiskTiles: setRiskTiles,
    invalidate: invalidate,
    getView: function () {
      if (!map || !currentPref) return null;
      var c = map.getCenter();
      return { pref: currentPref.id, lat: c.lat, lon: c.lng, zoom: map.getZoom() };
    }
  };
})(window);
