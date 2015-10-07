var georeferencer = georeferencer || {};
georeferencer.review = georeferencer.review || {};

georeferencer.review.enableButtons = function(buttons, activeBttn, value) {
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    if (button != activeBttn) {
      button.disabled = !value;
    }
  }
};

georeferencer.review.actionBttn = function(bttn, author, id, institution, value) {
  if (bttn.className == 'active') {
    georeferencer.review.unlabelMap(bttn, id, institution);
  } else {
    georeferencer.review.labelMap(bttn, author, id, institution, value);
  }
};

georeferencer.review.labelMap = function(bttn, author, id, institution, value) {
  var img = bttn.getElementsByTagName('img')[0];
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var response = JSON.parse(xmlhttp.responseText);
      if (response.status == 'ok') {
        bttn.className = 'active';
        img.src = 'http://www.staremapy.cz/img/success.png';
        var form = document.getElementById('review-form');
        georeferencer.review.enableButtons(form.getElementsByTagName('BUTTON'), bttn, false);
      } else {
        img.src = 'http://www.staremapy.cz/img/error.png';
      }

    }
  };
  var authorParam = encodeURIComponent(author);
  var idParam = encodeURIComponent(id);
  var institutionParam = encodeURIComponent(institution);
  var valueParam = encodeURIComponent(value);
  var token = 'cab08dc4-e7c6-4ca1-b2ad-393ec198c31d';
  var requestParams = '?author=' + authorParam + '&key=' + idParam + '&value=' + valueParam + '&institution=' + institution + '&token=' + token + '&action=put';
  var url = 'http://195.113.155.123/cgi-bin/addlabeltomap.py' + requestParams;
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
  img.src = 'http://www.staremapy.cz/img/ajax-loader-mini.gif';
};

georeferencer.review.unlabelMap = function(bttn, id, institution) {
  var img = bttn.getElementsByTagName('img')[0];
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var response = JSON.parse(xmlhttp.responseText);
      if (response.status == 'ok') {
        bttn.className = '';
        img.removeAttribute('src');
        var form = document.getElementById('review-form');
        georeferencer.review.enableButtons(form.getElementsByTagName('BUTTON'), null, true);
      } else {
        img.src = 'http://www.staremapy.cz/img/error.png';
      }

    }
  };
  var idParam = encodeURIComponent(id);
  var institutionParam = encodeURIComponent(institution);
  var token = 'cab08dc4-e7c6-4ca1-b2ad-393ec198c31d';
  var requestParams = '?key=' + idParam + '&institution=' + institution + '&token=' + token + '&action=delete';
  var url = 'http://195.113.155.123/cgi-bin/addlabeltomap.py' + requestParams;
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
  img.src = 'http://www.staremapy.cz/img/ajax-loader-mini.gif';
}

georeferencer.review.getLabels = function(callback, error) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var response = JSON.parse(xmlhttp.responseText);
      if (response.status == 'ok') {
        callback(response.data.values);
        return;
      }
    }
    error();
  };
  var idParam = encodeURIComponent(id);
  var token = 'cab08dc4-e7c6-4ca1-b2ad-393ec198c31d';
  var requestParams = '?key=' + idParam + '&token=' + token + '&action=get';
  var url = 'http://195.113.155.123/cgi-bin/addlabeltomap.py' + requestParams;
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
}

georeferencer.review.createButton = function(label, author, id, institution, value) {
  var button = document.createElement('BUTTON');
  button.innerHTML = label + ' <img>';
  button.className = 'passive';
  button.onclick = function() { georeferencer.review.actionBttn(this, author, id, institution, value); return false; };
  return button;
};

georeferencer.review.main = function() {
  var form = document.getElementById('review-form');
  var buttons = form.getElementsByClassName('buttons')[0];
  var author = document.getElementById('header-userinfo-name').innerHTML;
  var id = /^.*\/map\/([^\/]+\/[^\/]+).*$/.exec(location.href)[1];
  var institution = /^(\w+)\..*\..*$/.exec(location.hostname)[1];

  var bInstances = {};
  bInstances['vicemap'] = georeferencer.review.createButton('Více map', author, id, institution, 'vicemap');
  bInstances['rozrezana'] = georeferencer.review.createButton('Rozřezaná', author, id, institution, 'rozrezana');
  bInstances['nelzeumistit'] = georeferencer.review.createButton('Nelze umístit', author, id, institution, 'nelzeumistit');

  buttons.appendChild(bInstances['vicemap']);
  buttons.appendChild(bInstances['rozrezana']);
  buttons.appendChild(bInstances['nelzeumistit']);

  var ok = function(labels) {
    labels.forEach(function(label) {
      var button = bInstances[label];
      button.className = 'active';
    });
  }

  var error = function() {
    Object.keys(bInstances).forEach(function(button) {
      button.className = 'error';
    });
  }

  georeferencer.review.getLabels(ok, error);
};

georeferencer.review.main();
