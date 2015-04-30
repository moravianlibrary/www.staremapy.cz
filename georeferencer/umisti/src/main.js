goog.provide('georeferencer.umisti.main');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.ui.Button');
goog.require('goog.ui.FlatButtonRenderer');

goog.require('georeferencer.umisti.AddPointDialog');

georeferencer.umisti.main = function() {
  georeferencer.umisti.loadCss('http://staremapy.cz/css/fonts.css');
  georeferencer.umisti.loadCss('http://staremapy.cz/georeferencer/umisti/css/main.css');
  georeferencer.umisti.loadCss('http://staremapy.cz/georeferencer/umisti/css/dialog.css');

  var scan = goog.dom.getElement('main-right');
  goog.asserts.assertObject(scan);

  var addPointCnt = goog.dom.createElement('span');
  goog.dom.classes.add(addPointCnt, 'icon-target');

  var addPointBttn = new goog.ui.Button(addPointCnt, goog.ui.FlatButtonRenderer.getInstance());
  addPointBttn.addClassName('addpoint');
  goog.events.listen(addPointBttn, goog.ui.Component.EventType.ACTION, function(e) {
    var dialog = new georeferencer.umisti.AddPointDialog();
    dialog.setVisible(true);
    e.stopPropagation();
  });

  addPointBttn.render(scan);
};

georeferencer.umisti.loadCss = function(url) {
  var head = goog.dom.getDocument().getElementsByTagName('head')[0];
  var link =  goog.dom.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  goog.dom.append(head, link);
};

goog.exportSymbol('georeferencer.umisti.main', georeferencer.umisti.main);
