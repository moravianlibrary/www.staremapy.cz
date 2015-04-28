goog.provide('georeferencer.umisti.main');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.ui.ToggleButton');
goog.require('goog.ui.FlatButtonRenderer');

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

  var addPointCnt = goog.dom.createElement('span');
  goog.dom.classes.add(addPointCnt, 'icon-map-marker');

  var addPointBttn = new goog.ui.ToggleButton(addPointCnt, goog.ui.FlatButtonRenderer.getInstance());
  addPointBttn.addClassName('addpoint');
  goog.events.listen(addPointBttn, goog.ui.Component.EventType.ACTION, function(e) {
    e.stopPropagation();
  });

  addPointBttn.render(zoomPanel);
};

goog.exportSymbol('georeferencer.umisti.main', georeferencer.umisti.main);
