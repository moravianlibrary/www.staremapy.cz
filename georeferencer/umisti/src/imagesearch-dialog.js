goog.provide('georeferencer.imagesearch.Dialog');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.html.SafeHtml');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Dialog');
goog.require('goog.html.legacyconversions');

/**
 * @constructor
 * @extends {goog.ui.Dialog}
 */
georeferencer.imagesearch.Dialog = function() {
  goog.ui.Dialog.call(this);

  /**
   * @type {goog.ui.Checkbox}
   * @private
   */
  this.georeferencedFilter_ = null;

  var content = this.generateContent_();
  //goog.html.SafeHtml.unwrap(goog.html.legacyconversions.safeHtmlFromString(content));

  this.setModal(true);
  this.setTitle('Najít podobnou mapu.');
  this.setContent(content);
}

goog.inherits(georeferencer.imagesearch.Dialog, goog.ui.Dialog);

/**
 * @override
 */
georeferencer.imagesearch.Dialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.georeferencedFilter_ = new goog.ui.Checkbox();
  this.georeferencedFilter_.decorate(goog.dom.getElement('imagesearch-dialog-georeferenced'));
};

/**
 * @return {string}
 */
georeferencer.imagesearch.Dialog.prototype.generateContent_ = function() {
  var dialogContent = goog.dom.createElement('DIV');

  var header = goog.dom.createElement('DIV');
  var georeferencedFilter = goog.dom.createElement('SPAN');
  georeferencedFilter.id = 'imagesearch-dialog-georeferenced';
  goog.dom.classlist.add(georeferencedFilter, 'goog-checkbox');
  var georeferencedFilterLabel = goog.dom.createElement('SPAN');
  goog.dom.setTextContent(georeferencedFilterLabel, 'Georeferencované');

  var container = goog.dom.createElement('DIV');
  container.id = 'imagesearch-dialog-container';

  goog.dom.appendChild(dialogContent, header);
  goog.dom.appendChild(dialogContent, container);
  goog.dom.appendChild(header, georeferencedFilter);
  goog.dom.appendChild(header, georeferencedFilterLabel);

  return goog.dom.getOuterHtml(dialogContent);
}
