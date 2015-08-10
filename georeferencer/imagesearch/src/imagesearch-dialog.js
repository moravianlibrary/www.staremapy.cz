goog.provide('georeferencer.imagesearch.Dialog');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Dialog');

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

  this.setModal(true);
  this.setTitle('Najít podobnou mapu.');
  this.setContent(this.generateContent_());
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

georeferencer.imagesearch.Dialog.prototype.generateContent_ = function() {
  var dialogContent = goog.dom.createElement('DIV');

  var header = goog.dom.createElement('DIV');
  var georeferencedFilter = goog.dom.createElement('SPAN');
  georeferencedFilter.id = 'imagesearch-dialog-georeferenced';
  goog.dom.classlist.add(georeferencedFilter, 'goog-checkbox-undetermined');
  var georeferencedFilterLabel = goog.dom.createElement('SPAN');
  georeferencedFilterLabel.innerHtml = 'Georeferencované';

  var container = goog.dom.createElement('DIV');
  container.id = 'imagesearch-dialog-container';

  goog.dom.appendChild(dialogContent, header);
  goog.dom.appendChild(dialogContent, container);
  goog.dom.appendChild(header, georeferencedFilter);
  goog.dom.appendChild(header, georeferencedFilterLabel);

  return dialogContent;
}
