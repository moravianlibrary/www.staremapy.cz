if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

function loadScript(url)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    // Fire the loading
    head.appendChild(script);
}

var headerMenu = window.document.getElementById('header-menu');
var activeItem = headerMenu.getElementsByClassName('selected')[0];

if (activeItem.innerHTML.trim() == 'Analyzuj') {
  loadScript('http://staremapy.cz/georeferencer/analyzuj.js');
}
