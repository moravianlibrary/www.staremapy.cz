var accuracy = document.getElementById('accuracy');

var checkboxContainer = null;
var map = null;
var timer = null;

for (var i = 0; i < accuracy.children.length; i++) {
  var child = accuracy.children[i];
  if (child.innerHTML.indexOf('Dostupné vizualizace') > -1) {
    checkboxContainer = accuracy.children[i + 1];
    break;
  }
}

var detectprojBttn = document.createElement('input');
detectprojBttn.type = 'checkbox';
detectprojBttn.id = 'detectproj-overlay';

var detectprojLabel = document.createElement('span');
detectprojLabel.innerHTML = 'Detekce projekce'

checkboxContainer.appendChild(detectprojBttn);
checkboxContainer.appendChild(detectprojLabel);

var detectprojBttnOnClick = function() {
  var scan = document.getElementById('scan');
  if (this.checked) {
    for (var i = 0; i < checkboxContainer.children.length; i++) {
      var child = checkboxContainer.children[i];
      if (child.tagName == 'INPUT' && child.id != 'detectproj-overlay') {
        child.checked = false;
      }
    }
    scan.style.display = 'none';
    if (map == null) {
      var mapDiv = document.createElement('div');
      mapDiv.id = 'detectproj-map';
      mapDiv.style.height = "100%";
      mapDiv.style.backgroundColor = "rgb(241,238,224)";
      scan.parentNode.insertBefore(mapDiv, scan);
      map = createDetectprojMap();
      var loadingDiv = createLoadingDiv();
      scan.parentNode.appendChild(loadingDiv);
    } else {
      document.getElementById('detectproj-map').style.display = 'block';
      document.getElementById('detectproj-loading').style.display = 'block';
    }
    var this_ = this;
    var showDetectproj = function(callback) {
      var postData =  {};
      postData['name'] = window.georef.name;
      postData['version'] = window.georef.version;
      postData['control_points'] = window.georef.control_points;
      getDetectProjJSON(JSON.stringify(postData), function(data) {
        if (data.status == 'Done') {
          document.getElementById('detectproj-loading').style.display = 'none';
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          var geojsonFormat = new OpenLayers.Format.GeoJSON();
          var style = new OpenLayers.Style(
            {
              strokeColor: "#000000",
              strokeWidth: 1.5,
              label: '${getLabel}',
              fontColor: 'blue',
              fontSize: 20
            }, {
              context: {
                getLabel: function(a) {
                  if (a.attributes.label) {
                    return a.attributes.label;
                  } else {
                    return "";
                  }
                }
              }
            });
          var layer = new OpenLayers.Layer.Vector("projection", {
            styleMap: new OpenLayers.StyleMap({default: style}),
            preFeatureInsert: function(feature) {
              return feature.geometry.transform(
                new OpenLayers.Projection("EPSG:4326"),
                new OpenLayers.Projection("RASTER")
              );
            }
          });
          layer.addFeatures(geojsonFormat.read(data.projections[0].geojson));
          map.addLayer(layer);
        } else if (data.status == 'Processed') {
          if (callback) {
            callback();
          }
        } else if (data.status == 'DetectprojError') {
          alert('Pro tuto mapu nie je možné spočítať projekciu.');
          console.log(data.message);
          document.getElementById('detectproj-loading').style.display = 'none';
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          this_.checked = false;
          detectprojBttnOnClick.call(this_);
        } else {
          alert('Někde se stala chyba. Kontaktujte nás, prosím, na mapy@mzk.cz.');
          console.error(data);
          document.getElementById('detectproj-loading').style.display = 'none';
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          this_.checked = false;
          detectprojBttnOnClick.call(this_);
        }
      });
    };
    showDetectproj(function() {
      if (timer == null) {
        timer = setInterval(showDetectproj, 15000);
      }
    });
  } else {
    if (timer) {
      document.getElementById('detectproj-loading').style.display = 'none';
      clearInterval(timer);
      timer = null;
    }
    for (var i = 0, j = 0; i < checkboxContainer.children.length && j < 3; i++) {
      var child = checkboxContainer.children[i];
      if (child.tagName == 'INPUT' && child.id != 'detectproj-overlay') {
        child.checked = true;
        j++;
      }
    }
    scan.style.display = 'block';
    document.getElementById('detectproj-map').style.display = 'none';
  }
}

detectprojBttn.onclick = detectprojBttnOnClick;

function createDetectprojMap() {
  var pyramid = window.georef.pyramid;

  var zoomify = new OpenLayers.Layer.Zoomify("Zoomify" , pyramid.url,
        new OpenLayers.Size(pyramid.width, pyramid.height));
  if (pyramid.format == "Aware") {
    zoomify.getURL = getURLcustom;
  }

  var options = {
      controls: [],
      maxExtent: new OpenLayers.Bounds(0, 0, pyramid.width, pyramid.height),
      maxResolution: Math.pow(2, pyramid.n_tiers - 1),
      numZoomLevels: pyramid.n_tiers,
      units: 'pixels'
  };
  var map = new OpenLayers.Map("detectproj-map", options);
  map.addControl(new OpenLayers.Control.Navigation);
  map.addControl(new OpenLayers.Control.ZoomPanel);
  map.addControl(new OpenLayers.Control.Attribution);

  var forwardTransform = function(point) {
          point.y = point.y - pyramid.height;
          return point;
  }
  var backwardTransform = function(point) {
          point.y = point.y + pyramid.height;
          return point;
  }
  OpenLayers.Projection.addTransform("RASTER", "EPSG:4326", forwardTransform);
  OpenLayers.Projection.addTransform("EPSG:4326", "RASTER", backwardTransform);

  map.addLayer(zoomify)
  map.setBaseLayer(zoomify);
  map.zoomToMaxExtent();
  return map;
}

function createLoadingDiv() {
  var div = document.createElement('div');
  div.id = 'detectproj-loading';
  div.style.position = 'absolute';
  div.style.left = '0px';
  div.style.right = '0px';
  div.style.top = '0px';
  div.style.bottom = '0px';
  div.style.zIndex = '1000';
  div.style.backgroundImage = 'url(http://staremapy.cz/img/ajax-loader.gif)';
  div.style.backgroundRepeat = 'no-repeat';
  div.style.backgroundPosition = 'center';
  div.style.backgroundColor = 'white';
  div.style.opacity = '0.7';
  div.style.filter = 'alpha(opacity=70)';
  return div;
}

function getURLcustom (bounds) {
  bounds = this.adjustBounds(bounds);
  var res = this.map.getResolution();
  var size = this.getImageSize(bounds);
  var x = bounds.left;
  var y = this.maxExtent.top - bounds.top;
  var z = this.numZoomLevels - this.map.getZoom();
  return this.url+"&res="+z+"&viewwidth="+size.w+"&viewheight="+size.h+"&x="+x+"&y="+y;
  var url = this.url;
  if (url instanceof Array) {
      url = this.selectUrl(path, url);
  }
  return url + path;
};

function getDetectProjJSON(postData, callback) {
  var url = "http://detectproj.mzk.cz/v1";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var json = JSON.parse(xmlhttp.responseText);
      callback(json);
    }
  };
  xmlhttp.open("POST", url, true);
  xmlhttp.send(postData);
}
