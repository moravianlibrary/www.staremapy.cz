goog.provide('georeferencer.umisti.main');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classes');

georeferencer.umisti.loadCss = function(url) {
  var head = goog.dom.getDocument().getElementsByTagName('head')[0];
  var link =  goog.dom.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  goog.dom.append(head, link);
};

georeferencer.umisti.main = function() {
  georeferencer.umisti.loadCss('http://staremapy.cz/css/fonts.css');
  georeferencer.umisti.loadCss('http://staremapy.cz/georeferencer/umisti/main.css');

  var zoomPanel = document.querySelector('#main-left .olControlZoomPanel');
  goog.asserts.assertObject(zoomPanel);

  var addPointBttn = goog.dom.createElement('div');
  addPointBttn.id = 'addpoint';
  goog.dom.classes.add(addPointBttn, 'icon-map-marker');

  goog.dom.append(zoomPanel, addPointBttn);
};

goog.exportSymbol('georeferencer.umisti.main', georeferencer.umisti.main);
