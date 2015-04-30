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
  var table = goog.dom.createElement('table');
  var trLat = goog.dom.createElement('tr');
  var thLat = goog.dom.createElement('th');
  var tdLat = goog.dom.createElement('td');
  var inputLat = goog.dom.createElement('input');
  var trLon = goog.dom.createElement('tr');
  var thLon = goog.dom.createElement('th');
  var tdLon = goog.dom.createElement('td');
  var inputLon = goog.dom.createElement('input');
  var trProj = goog.dom.createElement('tr');
  var thProj = goog.dom.createElement('th');
  var tdProj = goog.dom.createElement('td');
  var inputProj = goog.dom.createElement('input');

  goog.dom.appendChild(table, trLat);
  goog.dom.appendChild(table, trLon);
  goog.dom.appendChild(table, trProj);

  goog.dom.appendChild(trLat, thLat);
  goog.dom.appendChild(trLat, tdLat);
  goog.dom.appendChild(trLon, thLon);
  goog.dom.appendChild(trLon, tdLon);
  goog.dom.appendChild(trProj, thProj);
  goog.dom.appendChild(trProj, tdProj);

  goog.dom.setTextContent(thLat, 'Zeměpisná šířka:');
  goog.dom.setTextContent(thLon, 'Zeměpisná délka:');
  goog.dom.setTextContent(thProj, 'Kartografická projekce:');

  goog.dom.appendChild(tdLat, inputLat);
  goog.dom.appendChild(tdLon, inputLon);
  goog.dom.appendChild(tdProj, inputProj);

  inputLat.id = 'input-lat';
  inputLon.id = 'input-lon';
  inputProj.id = 'input-proj';

  return goog.dom.getOuterHtml(table);
}
