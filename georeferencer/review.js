var georeferencer = georeferencer || {};
georeferencer.review = georeferencer.review || {};

georeferencer.review.labelMap = function(id, value) {
  alert(author + ': ' + id + ': ' + value);
};

georeferencer.review.createButton = function(label, id, value) {
  var button = document.createElement('BUTTON');
  button.innerHTML = label;
  button.onclick = function() { georeferencer.review.labelMap(id, value); return false; };
  return button;
};

georeferencer.review.main = function() {
  var form = document.getElementById('review-form');
  var buttons = null;
  for (var i = 0; i < form.childNodes.length; i++) {
    var element = form.childNodes[i];
    if (element.className == 'buttons') {
      buttons = element;
      break;
    }
  }
  var author = document.getElementById('header-userinfo-name').innerHTML;
  var id = georef.name + '/' + georef.version;

  buttons.appendChild(georeferencer.review.createButton('Více map', author, id, 'vicemap'));
  buttons.appendChild(georeferencer.review.createButton('Rozřezaná', author, id, 'rozrezana'));
  buttons.appendChild(georeferencer.review.createButton('Nelze umístit', author, id, 'nelzeumistit'));
};

georeferencer.review.main();
