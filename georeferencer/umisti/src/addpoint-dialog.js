goog.provide('georeferencer.umisti.AddPointDialog');

goog.require('goog.dom');
goog.require('goog.ui.Dialog');

/**
 * @constructor
 * @extends {goog.ui.Dialog}
 */
georeferencer.umisti.AddPointDialog = function() {
  goog.ui.Dialog.call(this);
  this.setModal(true);
  this.setTitle('Vložiť bod.');
  this.setContent(this.generateContent_());
}

goog.inherits(georeferencer.umisti.AddPointDialog, goog.ui.Dialog);

/**
 * @protected
 * @return {!string}
 */
georeferencer.umisti.AddPointDialog.prototype.generateContent_ = function() {
  var content = goog.dom.createElement('content');
  var inputLat = goog.dom.createElement('input');
  var inputLon = goog.dom.createElement('input');
  var inputProj = goog.dom.createElement('input');
  var labelLat = goog.dom.createElement('label');
  var labelLon = goog.dom.createElement('label');
  var labelProj = goog.dom.createElement('label');

  inputLat.id = 'input-lat';
  inputLon.id = 'input-lon';
  inputProj.id = 'input-proj';
  labelLat.htmlFor = 'input-lat';
  labelLon.htmlFor = 'input-lon';
  labelProj.htmlFor = 'input-proj';

  goog.dom.appendChild(content, labelLat);
  goog.dom.appendChild(content, labelLon);
  goog.dom.appendChild(content, labelProj);
  goog.dom.appendChild(content, inputLat);
  goog.dom.appendChild(content, inputLon);
  goog.dom.appendChild(content, inputProj);

  return goog.dom.getOuterHtml(content);
}
