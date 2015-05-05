goog.provide('georeferencer.umisti.AddPointDialog');
goog.provide('georeferencer.umisti.AddPointDialog.EventType');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.math');
goog.require('goog.string');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.ac.AutoComplete');
goog.require('goog.ui.ac.Renderer');
goog.require('goog.ui.ac.InputHandler');

goog.require('georeferencer.umisti.EpsgMatcher');

/**
 * @constructor
 * @extends {goog.ui.Dialog}
 * @param {Element} parentElement
 */
georeferencer.umisti.AddPointDialog = function(parentElement) {
  goog.ui.Dialog.call(this);
  /**
   * @type {Element}
   * @private
   */
  this.parentElement_ = parentElement;
  /**
   * @type {goog.ui.ac.AutoComplete}
   * @private
   */
  this.ac_ = null;
  /**
   * @type {goog.ui.ac.InputHandler}
   * @private
   */
  this.inputHandler_ = null;
  this.setModal(true);
  this.setTitle('Zadat vlicovací bod pomocí číselných souřadnic.');
  this.setContent(this.generateContent_());

  goog.events.listen(this, goog.ui.Dialog.EventType.SELECT, function(e) {
    if (e.key == goog.ui.Dialog.DefaultButtonKeys.OK) {
      if (!this.validate()) {
        e.stopPropagation();
        return false;
      }
      var projParser = new RegExp(/^(\d+).*/);
      var latGrad = goog.string.toNumber(goog.dom.getElement('input-lat-grad').value);
      var latMin = goog.string.toNumber(goog.dom.getElement('input-lat-min').value);
      var latSec = goog.string.toNumber(goog.dom.getElement('input-lat-sec').value);
      var lonGrad = goog.string.toNumber(goog.dom.getElement('input-lon-grad').value);
      var lonMin = goog.string.toNumber(goog.dom.getElement('input-lon-min').value);
      var lonSec = goog.string.toNumber(goog.dom.getElement('input-lon-sec').value);
      window.console.log(latGrad);
      window.console.log(latMin);
      window.console.log(latSec);
      window.console.log(lonGrad);
      window.console.log(lonMin);
      window.console.log(lonSec);
      var lat = latGrad + latMin / 60.0 + latSec / 3600.0;
      var lon = lonGrad + lonMin / 60.0 + lonSec / 3600.0;
      var proj = projParser.exec(goog.dom.getElement('input-proj').value)[1];
      var event = {};
      event.type = georeferencer.umisti.AddPointDialog.EventType.SELECT;
      event['lat'] = lat.toString();
      event['lon'] = lon.toString();
      event['proj'] = proj;
      this.dispatchEvent(event);
    }
    return true;
  });
}

goog.inherits(georeferencer.umisti.AddPointDialog, goog.ui.Dialog);

/**
 * @override
 */
georeferencer.umisti.AddPointDialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.inputHandler_ = new goog.ui.ac.InputHandler(null, null, false);
  this.ac_ = new goog.ui.ac.AutoComplete(
    new georeferencer.umisti.EpsgMatcher(),
    new goog.ui.ac.Renderer(),
    this.inputHandler_);
  this.inputHandler_.attachAutoComplete(this.ac_);
  this.inputHandler_.attachInputs(goog.dom.getElement('input-proj'));
};

/**
 * @override
 */
georeferencer.umisti.AddPointDialog.prototype.exitDocument = function() {
  this.inputHandler_.detachInput(goog.dom.getElement('input-proj'));
  this.ac_ = null;
  this.inputHandler_ = null;
  goog.base(this, 'exitDocument');
};

/**
 * @override
 */
georeferencer.umisti.AddPointDialog.prototype.render = function(parentElement) {
  if (parentElement) {
    goog.base(this, 'render', parentElement);
  } else {
    goog.base(this, 'render', this.parentElement_);
  }
}

/**
 * @override
 */
georeferencer.umisti.AddPointDialog.prototype.reposition = function() {
  var doc = this.getDomHelper().getDocument();
  var win = goog.dom.getWindow(doc) || window;
  if (goog.style.getComputedPosition(this.getElement()) == 'fixed') {
    var x = 0;
    var y = 0;
  } else {
    var scroll = this.getDomHelper().getDocumentScroll();
    var x = scroll.x;
    var y = scroll.y;
  }

  var popupSize = goog.style.getSize(this.getElement());
  var viewSize;
  if (this.parentElement_) {
    viewSize = new goog.math.Size(
      this.parentElement_.offsetWidth, this.parentElement_.offsetHeight);
  } else {
    viewSize = goog.dom.getViewportSize(win);
  }

  // Make sure left and top are non-negatives.
  var left = Math.max(x + viewSize.width / 2 - popupSize.width / 2, 0);
  var top = Math.max(y + viewSize.height / 2 - popupSize.height / 2, 0);
  goog.style.setPosition(this.getElement(), left, top);

  // We place the tab catcher at the same position as the dialog to
  // prevent IE from scrolling when users try to tab out of the dialog.
  goog.style.setPosition(this.tabCatcherElement_, left, top);
}

/**
 * @override
 */
georeferencer.umisti.AddPointDialog.prototype.onShow = function() {
  goog.base(this, 'onShow');
  var inputLatGrad = goog.dom.getElement('input-lat-grad');
  var inputLatMin = goog.dom.getElement('input-lat-min');
  var inputLatSec = goog.dom.getElement('input-lat-sec');
  var inputLonGrad = goog.dom.getElement('input-lon-grad');
  var inputLonMin = goog.dom.getElement('input-lon-min');
  var inputLonSec = goog.dom.getElement('input-lon-sec');
  var inputProj = goog.dom.getElement('input-proj');
  inputLatGrad.value = '';
  inputLatMin.value = '';
  inputLatSec.value = '';
  inputLonGrad.value = '';
  inputLonMin.value = '';
  inputLonSec.value = '';
  goog.dom.classes.remove(inputLatGrad, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputLatMin, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputLatSec, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputLonGrad, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputLonMin, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputLonSec, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputProj, 'goog-error-empty', 'goog-error-format');
}

georeferencer.umisti.AddPointDialog.prototype.validate = function() {
  var inputLatGrad = goog.dom.getElement('input-lat-grad');
  var inputLatMin = goog.dom.getElement('input-lat-min');
  var inputLatSec = goog.dom.getElement('input-lat-sec');
  var inputLonGrad = goog.dom.getElement('input-lon-grad');
  var inputLonMin = goog.dom.getElement('input-lon-min');
  var inputLonSec = goog.dom.getElement('input-lon-sec');
  var inputProj = goog.dom.getElement('input-proj');
  var valid = true;
  var decimalNumFormat = new RegExp(/^\d+([.,]\d+)?$/);
  var projFormat = new RegExp(/^\d+/);

  goog.dom.classes.remove(inputLatGrad, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputLatMin, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputLatSec, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputLonGrad, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputLonMin, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputLonSec, 'goog-error-empty', 'goog-error-format');
  goog.dom.classes.remove(inputProj, 'goog-error-empty', 'goog-error-format');

  if (goog.string.isEmptySafe(inputLatGrad.value)) {
    valid = false;
    goog.dom.classes.add(inputLatGrad, 'goog-error-empty');
  }
  if (goog.string.isEmptySafe(inputLonGrad.value)) {
    valid = false;
    goog.dom.classes.add(inputLonGrad, 'goog-error-empty');
  }
  if (goog.string.isEmptySafe(inputProj.value)) {
    valid = false;
    goog.dom.classes.add(inputProj, 'goog-error-empty');
  }
  if (!goog.string.isEmptySafe(inputLatGrad.value)
      && !decimalNumFormat.test(inputLatGrad.value)) {
    valid = false;
    goog.dom.classes.add(inputLatGrad, 'goog-error-format');
  }
  if (!goog.string.isEmptySafe(inputLatMin.value)
      && !goog.string.isNumeric(inputLatMin.value)) {
    valid = false;
    goog.dom.classes.add(inputLatMin, 'goog-error-format');
  }
  if (!goog.string.isEmptySafe(inputLatSec.value)
      && !goog.string.isNumeric(inputLatSec.value)) {
    valid = false;
    goog.dom.classes.add(inputLatSec, 'goog-error-format');
  }
  if (!goog.string.isEmptySafe(inputLonGrad.value)
      && !decimalNumFormat.test(inputLonGrad.value)) {
    valid = false;
    goog.dom.classes.add(inputLonGrad, 'goog-error-format');
  }
  if (!goog.string.isEmptySafe(inputLonMin.value)
      && !goog.string.isNumeric(inputLonMin.value)) {
    valid = false;
    goog.dom.classes.add(inputLonMin, 'goog-error-format');
  }
  if (!goog.string.isEmptySafe(inputLonSec.value)
      && !goog.string.isNumeric(inputLonSec.value)) {
    valid = false;
    goog.dom.classes.add(inputLonSec, 'goog-error-format');
  }
  if (!goog.string.isEmptySafe(inputProj.value)
      && !projFormat.test(inputProj.value)) {
    valid = false;
    goog.dom.classes.add(inputProj, 'goog-error-format');
  }

  return valid;
};

/**
 * @protected
 * @return {!string}
 */
georeferencer.umisti.AddPointDialog.prototype.generateContent_ = function() {
  var table = goog.dom.createElement('table');
  var trLat = goog.dom.createElement('tr');
  var thLat = goog.dom.createElement('th');
  var tdLat = goog.dom.createElement('td');
  var inputLatGrad = goog.dom.createElement('input');
  var inputLatMin = goog.dom.createElement('input');
  var inputLatSec = goog.dom.createElement('input');
  var inputLatGradUnit = goog.dom.createElement('span');
  var inputLatMinUnit = goog.dom.createElement('span');
  var inputLatSecUnit = goog.dom.createElement('span');
  var trLon = goog.dom.createElement('tr');
  var thLon = goog.dom.createElement('th');
  var tdLon = goog.dom.createElement('td');
  var inputLonGrad = goog.dom.createElement('input');
  var inputLonMin = goog.dom.createElement('input');
  var inputLonSec = goog.dom.createElement('input');
  var inputLonGradUnit = goog.dom.createElement('span');
  var inputLonMinUnit = goog.dom.createElement('span');
  var inputLonSecUnit = goog.dom.createElement('span');
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

  goog.dom.setTextContent(thLat, 'Sever:');
  goog.dom.setTextContent(thLon, 'Východ:');
  goog.dom.setTextContent(thProj, 'Souřadnicový systém:');

  goog.dom.appendChild(tdLat, inputLatGrad);
  goog.dom.appendChild(tdLat, inputLatGradUnit);
  goog.dom.appendChild(tdLat, inputLatMin);
  goog.dom.appendChild(tdLat, inputLatMinUnit);
  goog.dom.appendChild(tdLat, inputLatSec);
  goog.dom.appendChild(tdLat, inputLatSecUnit);
  goog.dom.appendChild(tdLon, inputLonGrad);
  goog.dom.appendChild(tdLon, inputLonGradUnit);
  goog.dom.appendChild(tdLon, inputLonMin);
  goog.dom.appendChild(tdLon, inputLonMinUnit);
  goog.dom.appendChild(tdLon, inputLonSec);
  goog.dom.appendChild(tdLon, inputLonSecUnit);
  goog.dom.appendChild(tdProj, inputProj);

  inputLatGrad.id = 'input-lat-grad';
  inputLatMin.id = 'input-lat-min';
  inputLatSec.id = 'input-lat-sec';
  inputLonGrad.id = 'input-lon-grad';
  inputLonMin.id = 'input-lon-min';
  inputLonSec.id = 'input-lon-sec';
  inputProj.id = 'input-proj';

  goog.dom.setTextContent(inputLatGradUnit, '°');
  goog.dom.setTextContent(inputLatMinUnit, "'");
  goog.dom.setTextContent(inputLatSecUnit, '"');
  goog.dom.setTextContent(inputLonGradUnit, '°');
  goog.dom.setTextContent(inputLonMinUnit, "'");
  goog.dom.setTextContent(inputLonSecUnit, '"');


  return goog.dom.getOuterHtml(table);
}

/**
 * Events dispatched by dialog.
 * @enum {string}
 */
georeferencer.umisti.AddPointDialog.EventType = {
  SELECT: 'georeferencer.umisti.AddPointDialog.EventType.SELECT'
};
