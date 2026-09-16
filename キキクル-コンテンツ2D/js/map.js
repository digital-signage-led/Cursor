/**
 * 地図表示。ベース地図は維持し、キキクルタイルだけ差し替える。
 */
(function (global) {
  "use strict";

  var map = null;
  var baseLayer = null;
  var riskLayer = null;
  var pendingLayer = null;
  var created = false;

  function cfg() {
    return global.DangerConfig.CONFIG;
  }

  function disableInteraction(target) {
    if (!target) return;
    if (target.dragging) target.dragging.disable();
    if (target.touchZoom) target.touchZoom.disable();
    if (target.doubleClickZoom) target.doubleClickZoom.disable();
    if (target.scrollWheelZoom) target.scrollWheelZoom.disable();
    if (target.boxZoom) target.boxZoom.disable();
    if (target.keyboard) target.keyboard.disable();
    if (target.tap) target.tap.disable();
  }

  function applyView(view, fitBounds) {
    if (!map || !view) return;
    if (fitBounds && view.bounds && view.bounds.length === 4) {
      map.fitBounds(
        [[view.bounds[0], view.bounds[1]], [view.bounds[2], view.bounds[3]]],
        { animate: false, padding: [24, 24] }
      );
      return;
    }
    map.setView([view.lat, view.lon], view.zoom, { animate: false });
  }

  function create(containerId, view) {
    if (created && map) {
      applyView(view, false);
      map.invalidateSize({ animate: false });
      return map;
    }

    map = global.L.map(containerId, {
      zoomControl: false,
      attributionControl: true,
      fadeAnimation: false,
      zoomAnimation: false,
      markerZoomAnimation: false,
      inertia: false
    });

    map.attributionControl.setPrefix("");
    applyView(view, false);

    baseLayer = global.L.tileLayer(cfg().gsiTileUrl, {
      minZoom: cfg().tileMinZoom,
      maxZoom: cfg().tileMaxZoom,
      maxNativeZoom: 18,
      attribution: cfg().gsiAttribution + " / " + cfg().jmaAttribution
    });
    baseLayer.addTo(map);
    baseLayer.once("tileerror", function () {
      if (!map || !cfg().fallbackTileUrl) return;
      var fallback = global.L.tileLayer(cfg().fallbackTileUrl, {
        minZoom: cfg().tileMinZoom,
        maxZoom: cfg().tileMaxZoom,
        attribution: cfg().jmaAttribution
      });
      fallback.addTo(map);
      fallback.bringToBack();
    });
    disableInteraction(map);
    created = true;
    return map;
  }

  function activateRiskLayer(next) {
    if (!map || !next) return;
    if (riskLayer && riskLayer !== next) {
      map.removeLayer(riskLayer);
    }
    if (pendingLayer && pendingLayer !== next && map.hasLayer(pendingLayer)) {
      /* pending is now current */
    }
    riskLayer = next;
    pendingLayer = null;
    next.setOpacity(cfg().riskOpacity);
  }

  function setRiskTiles(tileUrl) {
    if (!map || !tileUrl) return;
    if (riskLayer && riskLayer._url === tileUrl) return;

    var next = global.L.tileLayer(tileUrl, {
      minZoom: cfg().tileMinZoom,
      maxZoom: cfg().tileMaxZoom,
      maxNativeZoom: cfg().tileMaxNativeZoom,
      opacity: riskLayer ? 0.01 : cfg().riskOpacity,
      className: "jma-risk-layer",
      errorTileUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
    });

    if (pendingLayer && map.hasLayer(pendingLayer)) {
      map.removeLayer(pendingLayer);
    }
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

  function setInteractive(enabled) {
    if (!map) return;
    if (enabled) {
      if (map.dragging) map.dragging.enable();
      if (map.scrollWheelZoom) map.scrollWheelZoom.enable();
      if (map.doubleClickZoom) map.doubleClickZoom.enable();
      if (map.touchZoom) map.touchZoom.enable();
    } else {
      disableInteraction(map);
    }
  }

  function getView() {
    if (!map) return null;
    var center = map.getCenter();
    var bounds = map.getBounds();
    return {
      lat: Number(center.lat.toFixed(5)),
      lon: Number(center.lng.toFixed(5)),
      zoom: map.getZoom(),
      bounds: [
        Number(bounds.getSouth().toFixed(5)),
        Number(bounds.getWest().toFixed(5)),
        Number(bounds.getNorth().toFixed(5)),
        Number(bounds.getEast().toFixed(5))
      ]
    };
  }

  function invalidate() {
    if (map) map.invalidateSize({ animate: false });
  }

  function onMove(handler) {
    if (!map || !handler) return;
    map.on("moveend", function () {
      handler(getView());
    });
  }

  global.DangerMap = {
    create: create,
    applyView: applyView,
    setRiskTiles: setRiskTiles,
    setInteractive: setInteractive,
    getView: getView,
    invalidate: invalidate,
    onMove: onMove
  };
})(window);
