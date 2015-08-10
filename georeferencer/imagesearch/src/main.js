goog.provide('georeferencer.imagesearch.main');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Css3ButtonRenderer');

goog.require('georeferencer.imagesearch.Dialog');

georeferencer.imagesearch.main = function() {
  var dialog = new georeferencer.imagesearch.Dialog();
  var searchSimilarBttn = new goog.ui.Button('Nájdi podobné', goog.ui.Css3ButtonRenderer.getInstance());

  searchSimilarBttn.render(goog.dom.getElement('main-left'));
  searchSimilarBttn.getElement().id = 'georeferencer-imagesearch-find-similar';

  goog.events.listen(searchSimilarBttn, goog.ui.Component.EventType.ACTION, function(e) {
    dialog.setVisible(true);
  });
}

goog.exportSymbol('georeferencer.imagesearch.main', georeferencer.imagesearch.main);