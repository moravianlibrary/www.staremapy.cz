goog.provide('georeferencer.imagesearch.Dialog');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.html.SafeHtml');
goog.require('goog.json');
goog.require('goog.net.cookies');
goog.require('goog.net.XhrIo');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Dialog');
goog.require('goog.html.legacyconversions');

/**
 * @constructor
 * @extends {goog.ui.Dialog}
 * @param {!Array<Object>} data
 */
georeferencer.imagesearch.Dialog = function(data) {
  goog.ui.Dialog.call(this);

  /**
   * @type {goog.ui.Checkbox}
   * @private
   */
  this.georeferencedFilter_ = null;

  this.setButtonSet(null);
  this.setModal(true);
  this.setTitle('Najít podobnou mapu.');
  this.setContent(this.generateContent_(data));
}

goog.inherits(georeferencer.imagesearch.Dialog, goog.ui.Dialog);

/**
 * @override
 */
georeferencer.imagesearch.Dialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  window.console.log('enterDocument');

  this.georeferencedFilter_ = new goog.ui.Checkbox();
  this.georeferencedFilter_.decorate(goog.dom.getElement('imagesearch-dialog-georeferenced'));

  goog.events.listen(this.georeferencedFilter_, goog.ui.Component.EventType.ACTION, function(e) {
    var checkbox = e.target;
    if (!checkbox.getChecked()) {
      var elements = goog.dom.getElementsByClass('imagesearch-result-nongeoreferenced');
      goog.array.forEach(elements, function(item, i, arr) {
        item.style.display = 'none';
      });
    } else {
      var elements = goog.dom.getElementsByClass('imagesearch-result-nongeoreferenced');
      goog.array.forEach(elements, function(item, i, arr) {
        item.style.display = 'inline-block';
      });
    }
  });
  this.georeferencedFilter_.setChecked(true);

  goog.array.forEach(goog.dom.getElementsByClass('imagesearch-result-overlay-autogeoref'), function(element, i, a) {
    var this_ = this;
    goog.events.listen(element, 'click', function(e) {
      var wrapper = this.parentElement.parentElement;
      var georeferenced = wrapper.getAttribute('data-georefid');
      var similar = window['georef']['name'] + '/' + window['georef']['version'];
      var url = "http://autogeoreference.mzk.cz/v1/autogeoreference?georeferenced=" + georeferenced + "&similar=" + similar;

      this_.showLoading_();

      goog.net.XhrIo.send(url, function(e) {
        var xhr = e.target;
        var json = xhr.getResponseJson();
        if (json['status'] == 'ok') {
          goog.net.cookies.set("georeferencer.imagesearch.cancel", "true", -1, "/");
          this_.post_('', {'control_points': goog.json.serialize(json['control_points']), 'cutline': goog.json.serialize(window['georef']['cutline'])});
        } else {
          window.alert(json['message']);
        }
      });
    });
  });

};

/**
 * @override
 */
georeferencer.imagesearch.Dialog.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  window.console.log('exitDocument');

  goog.events.removeAll(this.georeferencedFilter_, goog.ui.Component.EventType.ACTION);
}

/**
 * @param {!Array<Object>} data
 * @return {string}
 */
georeferencer.imagesearch.Dialog.prototype.generateContent_ = function(data) {
  var dialogContent = goog.dom.createElement('DIV');

  var header = goog.dom.createElement('DIV');
  goog.dom.classlist.add(header, 'imagesearch-dialog-header');
  var georeferencedFilterContainer = goog.dom.createElement('DIV');
  goog.dom.classlist.add(georeferencedFilterContainer, 'imagesearch-dialog-georeferenced-container');
  var georeferencedFilterButton = goog.dom.createElement('SPAN');
  georeferencedFilterButton.id = 'imagesearch-dialog-georeferenced';
  goog.dom.classlist.add(georeferencedFilterButton, 'goog-checkbox');
  goog.dom.classlist.add(georeferencedFilterButton, 'imagesearch-dialog-georeferenced-button');
  var georeferencedFilterLabel = goog.dom.createElement('SPAN');
  goog.dom.classlist.add(georeferencedFilterLabel, 'imagesearch-dialog-georeferenced-label');
  goog.dom.setTextContent(georeferencedFilterLabel, 'Pouze georeferencované');

  var container = this.generateResult_(data);
  container.id = 'imagesearch-dialog-container';

  goog.dom.appendChild(georeferencedFilterContainer, georeferencedFilterButton);
  goog.dom.appendChild(georeferencedFilterContainer, georeferencedFilterLabel);
  goog.dom.appendChild(dialogContent, header);
  goog.dom.appendChild(dialogContent, container);
  goog.dom.appendChild(header, georeferencedFilterContainer);

  return goog.dom.getOuterHtml(dialogContent);
}

/**
 * @param {!Array<Object>} data
 * @return {!Element}
 */
 georeferencer.imagesearch.Dialog.prototype.generateResult_ = function(data) {
   var result = goog.dom.createElement('DIV');

   goog.array.forEach(data, function(item, i, arr) {
     var wrapper = goog.dom.createElement('DIV');
     goog.dom.classlist.add(wrapper, 'imagesearch-result-wrapper');
     wrapper.setAttribute('data-georefid', item['record']['id']);
     var overlay = goog.dom.createElement('DIV');
     goog.dom.classlist.add(overlay, 'imagesearch-result-overlay');

     var overlayOpenContainer = goog.dom.createElement('A');
     overlayOpenContainer.href = 'http://staremapy.georeferencer.cz/map/' + item['record']['id'];
     goog.dom.classlist.add(overlayOpenContainer, 'imagesearch-result-overlay-open');
     var overlayOpenIcon = goog.dom.createElement('DIV');
     goog.dom.classlist.add(overlayOpenIcon, 'imagesearch-result-overlay-open-icon');
     var overlayOpenText = goog.dom.createElement('DIV');
     overlayOpenText.innerHTML = 'ZOBRAZIT';
     goog.dom.classlist.add(overlayOpenText, 'imagesearch-result-overlay-open-text');

     goog.dom.appendChild(overlayOpenContainer, overlayOpenIcon);
     goog.dom.appendChild(overlayOpenContainer, overlayOpenText);
     goog.dom.appendChild(overlay, overlayOpenContainer);

     if (item['record']['metadata']['georeferenced']) {
       var overlayAutogeorefContainer = goog.dom.createElement('SPAN');
       goog.dom.classlist.add(overlayAutogeorefContainer, 'imagesearch-result-overlay-autogeoref');
       var overlayAutogeorefIcon = goog.dom.createElement('DIV');
       goog.dom.classlist.add(overlayAutogeorefIcon, 'imagesearch-result-overlay-autogeoref-icon');
       var overlayAutogeorefText = goog.dom.createElement('DIV');
       overlayAutogeorefText.innerHTML = 'PŘEVZÍT BODY';
       goog.dom.classlist.add(overlayAutogeorefText, 'imagesearch-result-overlay-autogeoref-text');

       goog.dom.appendChild(overlayAutogeorefContainer, overlayAutogeorefIcon);
       goog.dom.appendChild(overlayAutogeorefContainer, overlayAutogeorefText);
       goog.dom.appendChild(overlay, overlayAutogeorefContainer);
     }

     var img = goog.dom.createElement('IMG');
     img.src = item['record']['thumbnail'];
     if (!item['record']['metadata']['georeferenced']) {
       goog.dom.classlist.add(wrapper, 'imagesearch-result-nongeoreferenced');
     }
     goog.dom.appendChild(result, wrapper);
     goog.dom.appendChild(wrapper, overlay);
     goog.dom.appendChild(wrapper, img);
   });
   return result;
 }

georeferencer.imagesearch.Dialog.prototype.showLoading_ = function() {
  var loader = goog.dom.getElement('imagesearch-loader');
  if (loader) {
    loader.style.display = 'block';
  } else {
    loader = goog.dom.createElement('DIV');
    loader.id = 'imagesearch-loader';
    goog.dom.appendChild(document.body, loader);
  }
}

georeferencer.imagesearch.Dialog.prototype.hideLoading_ = function() {
  var loader = goog.dom.getElement('imagesearch-loader');
  loader.style.display = 'none'
}

georeferencer.imagesearch.Dialog.prototype.post_ = function(url, params) {
  var form = document.createElement("form");
  form.setAttribute("method", 'post');
  form.setAttribute("action", url);

  for(var key in params) {
      if(params.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", params[key]);

          form.appendChild(hiddenField);
       }
  }

  document.body.appendChild(form);
  form.submit();
}
