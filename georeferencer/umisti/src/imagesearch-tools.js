goog.provide('georeferencer.imagesearch.tools');

georeferencer.imagesearch.tools.showLoading = function() {
  var loader = goog.dom.getElement('imagesearch-loader');
  if (loader) {
    loader.style.display = 'block';
  } else {
    loader = goog.dom.createElement('DIV');
    loader.id = 'imagesearch-loader';
    goog.dom.appendChild(document.body, loader);
  }
}

georeferencer.imagesearch.tools.hideLoading = function() {
  var loader = goog.dom.getElement('imagesearch-loader');
  loader.style.display = 'none'
}

georeferencer.imagesearch.tools.post = function(url, params) {
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
