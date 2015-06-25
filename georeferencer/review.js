var georeferencer = georeferencer || {};
georeferencer.review = georeferencer.review || {};

georeferencer.review.labelMap = function(bttn, author, id, value) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      response = JSON.parse(xmlhttp.responseText);
      console.log(response);
    }
  }
  author = encodeURI(author);
  id = encodeURI(id);
  value = encodeURI(value);
  var token = 'cab08dc4-e7c6-4ca1-b2ad-393ec198c31d';
  var requestParams = '?author=' + author '&key=' + id + '&value=' + value + '&token=' + token;
  var url = 'http://195.113.155.123/cgi-bin/addlabeltomap.py' + requestParams;
  xmlhttp.open(url, 'GET', true);
  xmlhttp.send();
};

georeferencer.review.createButton = function(label, author, id, value) {
  var button = document.createElement('BUTTON');
  button.innerHTML = label;
  button.onclick = function() { georeferencer.review.labelMap(author, id, value); return false; };
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
