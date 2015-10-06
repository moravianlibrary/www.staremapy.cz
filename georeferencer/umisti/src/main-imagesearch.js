goog.provide('georeferencer.imagesearch.main');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.net.cookies');
goog.require('goog.net.XhrIo');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Css3ButtonRenderer');

goog.require('georeferencer.imagesearch.Dialog');

georeferencer.imagesearch.main = function() {
  var searchSimilarBttn = new goog.ui.Button('NAJDI PODOBNÉ', goog.ui.Css3ButtonRenderer.getInstance());
  var dialog = null;

  searchSimilarBttn.render(goog.dom.getElement('main-left'));
  searchSimilarBttn.getElement().id = 'georeferencer-imagesearch-find-similar';

  if (goog.net.cookies.get("georeferencer.imagesearch.cancel", "false") == "true") {
    var cancelBttn = new goog.ui.Button('ZRUŠIT', goog.ui.Css3ButtonRenderer.getInstance());
    cancelBttn.render(goog.dom.getElement('main-left'));
    cancelBttn.getElement().id = 'georeferencer-imagesearch-cancel';
    goog.net.cookies.set("georeferencer.imagesearch.cancel", "false", -1, "/");
  }

  goog.events.listen(searchSimilarBttn, goog.ui.Component.EventType.ACTION, function(e) {

    if (dialog) {
      dialog.setVisible(true);
    } else {
      georeferencer.imagesearch.showLoading();
      var url = 'http://imagesearch.mzk.cz/v1/searchSimilar?count=30&url=' + window['georef']['thumbnail_url'];
      goog.net.XhrIo.send(url, function(e) {
        var xhr = e.target;
        var json = xhr.getResponseJson();
        dialog = new georeferencer.imagesearch.Dialog(json['data']);
        dialog.setVisible(true);
        dialog.getElement().id = 'imagesearch-dialog';
        dialog.reposition();
        georeferencer.imagesearch.hideLoading();
      });
    }

  });
}

georeferencer.imagesearch.showLoading = function() {
  var loader = goog.dom.getElement('imagesearch-loader');
  if (loader) {
    loader.style.display = 'block';
  } else {
    loader = goog.dom.createElement('DIV');
    loader.id = 'imagesearch-loader';
    goog.dom.appendChild(document.body, loader);
  }
}

georeferencer.imagesearch.hideLoading = function() {
  var loader = goog.dom.getElement('imagesearch-loader');
  loader.style.display = 'none'
}

goog.exportSymbol('georeferencer.imagesearch.main', georeferencer.imagesearch.main);
