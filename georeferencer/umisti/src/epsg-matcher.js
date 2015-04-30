goog.provide('georeferencer.umisti.EpsgMatcher');

goog.require('goog.array');
goog.require('goog.net.XhrIo');

/**
 * @constructor
 */
georeferencer.umisti.EpsgMatcher = function() {

};

/**
 * Function used to pass matches to the autocomplete.
 * @param {string} token Token to match.
 * @param {number} maxMatches Max number of matches to return.
 * @param {Function} matchHandler callback to execute after matching.
 */
georeferencer.umisti.EpsgMatcher.prototype.requestMatchingRows =
    function(token, maxMatches, matchHandler) {
  var url = "http://epsg.io?q=" + token + "&format=json";
  goog.net.XhrIo.send(url, function(e) {
    var xhr = e.target;
    var response = xhr.getResponseJson();
    var results = response['results'];
    var rows = [];
    goog.array.forEach(results, function(el, i, a) {
      var row = el['code'] + ': ' + el['name'] + ', ' + el['area'];
      rows.push(row);
    });
    matchHandler(token, rows);
  });
}
