var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
closer.onclick = function() {
  container.style.display = 'none';
  closer.blur();
  return false;
};
var overlayPopup = new ol.Overlay({
  element: container
});

var view = new ol.View({
    @VIEW@
});

var pointZoom = @POINTZOOM@;

var map = new ol.Map({
  controls: [
    @CONTROLS@
  ],
  target: document.getElementById('map'),
  renderer: 'canvas',
  overlays: [overlayPopup],
  layers: layersList,
  view: view
});

var originalExtent = @BOUNDS@;
map.getView().fitExtent(originalExtent, map.getSize());

var currentInteraction;

@CESIUM@

@POPUPLAYERS@

var highlightOverlay = new ol.FeatureOverlay({
  map: map,
  style: [@HIGHLIGHTSTYLE@]
});

var doHighlight = @DOHIGHLIGHT@;
var doHover = @ONHOVER@;

var highlight;
var onPointerMove = function(evt) {
    if (!doHover && !doHighlight) {
        return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var popupText = "";
    var currentFeature;
    var toAdd = [];
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        feature = decluster(feature);
        if (feature) {
            currentFeature = feature;
            if (popupText == "") {
                popupText = popupLayers[getAllNonBaseLayers().indexOf(layer)];
                if (popupText) {
                    var currentFeatureKeys = currentFeature.getKeys();
                    for (var i = 0; i < currentFeatureKeys.length; i++) {
                        if (currentFeatureKeys[i] != 'geometry') {
                            var value = currentFeature.get(currentFeatureKeys[i]);
                            if (value) {
                                popupText = popupText.replace("[" + currentFeatureKeys[i] + "]",
                                    String(currentFeature.get(currentFeatureKeys[i])))
                            }
                            else{
                                popupText = popupText.split("[" + currentFeatureKeys[i] + "]").join("NULL")
                            }
                        }
                    }
                }
            }
        }
    });

    if (doHighlight) {
        if (currentFeature !== highlight) {
            if (highlight) {
                highlightOverlay.removeFeature(highlight);
            }
            if (currentFeature) {
                highlightOverlay.addFeature(currentFeature);
            }
            highlight = currentFeature;
        }
    }

    if (doHover) {
        if (popupText) {
            overlayPopup.setPosition(coord);
            content.innerHTML = popupText;
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
            closer.blur();
        }
    }
};

var onSingleClick = function(evt) {
    if (doHover) {
        return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var popupText = "";
    var currentFeature;
    var toAdd = [];
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        feature = decluster(feature);
        if (feature) {
            currentFeature = feature;
            if (popupText == "") {
                popupText = popupLayers[getAllNonBaseLayers().indexOf(layer)];
                if (popupText) {
                    var currentFeatureKeys = currentFeature.getKeys();
                    for (var i = 0; i < currentFeatureKeys.length; i++) {
                        if (currentFeatureKeys[i] != 'geometry') {
                            var value = currentFeature.get(currentFeatureKeys[i]);
                            if (value) {
                                popupText = popupText.split("[" + currentFeatureKeys[i] + "]").join(
                                    String(currentFeature.get(currentFeatureKeys[i])))
                            }
                            else{
                                popupText = popupText.split("[" + currentFeatureKeys[i] + "]").join("NULL")
                            }
                        }
                    }
                }
            }

        }
    });
    if (popupText) {
        overlayPopup.setPosition(coord);
        content.innerHTML = popupText;
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        closer.blur();
    }
};
map.on('pointermove', function(evt) {
  onPointerMove(evt);
});
map.on('singleclick', function(evt) {
  onSingleClick(evt);
});
