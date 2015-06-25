if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    if (callback) {
      script.onreadystatechange = callback;
      script.onload = callback;
    }
    // Fire the loading
    head.appendChild(script);
}

function loadCss(url)
{
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  head.appendChild(link);
}

var headerMenu = window.document.getElementById('header-menu');
var activeItem = headerMenu.getElementsByClassName('selected')[0];

if (activeItem.innerHTML.trim() == 'Umísti') {
  loadScript('http://staremapy.cz/georeferencer/umisti/main-compiled.js', function() {
    georeferencer.umisti.main();
  });
} else if (activeItem.innerHTML.trim() == 'Analyzuj') {
  loadScript('http://staremapy.cz/georeferencer/analyzuj.js');
}

if (document.getElementById('review-form')) {
  loadScript('http://staremapy.cz/georeferencer/review.js');
}
