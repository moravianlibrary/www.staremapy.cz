goog.provide('georeferencer.umisti.main');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Button');
goog.require('goog.ui.FlatButtonRenderer');

goog.require('georeferencer.umisti.AddPointDialog');
goog.require('georeferencer.umisti.AddPointDialog.EventType');

georeferencer.umisti.main = function() {
  var rightPanel = goog.dom.getElement('main-right');
  goog.asserts.assertObject(rightPanel);

  var addPointDialog = new georeferencer.umisti.AddPointDialog(goog.dom.getElement('map'));

  var addPointCnt = goog.dom.createElement('span');
  goog.dom.classlist.add(addPointCnt, 'icon-target');

  var addPointBttn = new goog.ui.Button(addPointCnt, goog.ui.FlatButtonRenderer.getInstance());
  addPointBttn.addClassName('addpoint');
  goog.events.listen(addPointBttn, goog.ui.Component.EventType.ACTION, function(e) {
    addPointDialog.setVisible(true);
    e.stopPropagation();
  });
  goog.events.listen(addPointDialog, georeferencer.umisti.AddPointDialog.EventType.SELECT, function (e) {
    georeferencer.umisti.transform(e['east'], e['north'], e['proj'], function(data) {
      window.alert('X: ' + data['x'] + ', Y: ' + data['y']);
      addPoint(data['y'], data['x']);
    });
  });

  addPointBttn.render(rightPanel);
};

georeferencer.umisti.loadCss = function(url) {
  var head = goog.dom.getDocument().getElementsByTagName('head')[0];
  var link =  goog.dom.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  goog.dom.append(head, link);
};

georeferencer.umisti.transform = function(x, y, proj, callback) {
  var url = "http://epsg.io/trans?x=" + x + "&y=" + y + "&s_srs=" + proj + "&t_srs=4326";
  goog.net.XhrIo.send(url, function(e) {
    var xhr = e.target;
    if (xhr.getStatus() != 200) {
      window.alert('Služba epsg.io neodpovídá. Skuste to později.');
      return;
    }
    var response = xhr.getResponseJson();
    if (response['status'] == 'error') {
      window.alert('Zadali jste nesprávné vstupní data.');
      return;
    }
    var data = {};
    data['x'] = response['x'];
    data['y'] = response['y'];
    callback(data);
  });
}

goog.exportSymbol('georeferencer.umisti.main', georeferencer.umisti.main);
