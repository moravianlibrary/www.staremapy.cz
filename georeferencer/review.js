var georeferencer = georeferencer || {};
georeferencer.review = georeferencer.review || {};

georeferencer.review.labelMap = function(bttn, author, id, value) {
  var img = bttn.getElementsByTagName('img')[0];
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var response = JSON.parse(xmlhttp.responseText);
      if (response.status == 'ok') {
        img.src = 'http://www.staremapy.cz/img/success.png';
        var form = document.getElementById('review-form');
        var buttons = form.getElementsByClassName('addLabelBttn');
        for (var i = 0; i < buttons.length; i++) {
          var button = buttons[i];
          if (button != bttn) {
            button.disabled = true;
          }
        }
      } else {
        img.src = 'http://www.staremapy.cz/img/error.png';
      }

    }
  };
  var authorParam = encodeURIComponent(author);
  var idParam = encodeURIComponent(id);
  var valueParam = encodeURIComponent(value);
  var token = 'cab08dc4-e7c6-4ca1-b2ad-393ec198c31d0';
  var requestParams = '?author=' + authorParam + '&key=' + idParam + '&value=' + valueParam + '&token=' + token;
  var url = 'http://195.113.155.123/cgi-bin/addlabeltomap.py' + requestParams;
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
  img.src = 'http://www.staremapy.cz/img/ajax-loader-mini.gif';
};

georeferencer.review.createButton = function(label, author, id, value) {
  var button = document.createElement('BUTTON');
  button.className = 'addLabelBttn';
  button.innerHTML = label + ' <img>';
  button.onclick = function() { georeferencer.review.labelMap(this, author, id, value); return false; };
  return button;
};

georeferencer.review.main = function() {
  var form = document.getElementById('review-form');
  var buttons = form.getElementsByClassName('buttons')[0];
  var author = document.getElementById('header-userinfo-name').innerHTML;
  var id = georef.name + '/' + georef.version;

  buttons.appendChild(georeferencer.review.createButton('Více map', author, id, 'vicemap'));
  buttons.appendChild(georeferencer.review.createButton('Rozřezaná', author, id, 'rozrezana'));
  buttons.appendChild(georeferencer.review.createButton('Nelze umístit', author, id, 'nelzeumistit'));
};

georeferencer.review.main();
