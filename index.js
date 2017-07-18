'use strict';

var Butter = function (options) {
  // Avoid default params for now
  var config = Object.assign({ cutoff: '5e7689', flip: false }, options);

  // Over or under (black/white)
  var aspect = config.flip ? -1 : 1;

  // Pad threshold color if need be
  var cutoff = parseInt((("ffffffff" + (config.cutoff))).slice(-8), 16);

  // Expects and returns out `ImageData`
  return function (source) {
    var h = source.height;
    var w = source.width;
    var data = source.data;
    var view = new Uint32Array(data.buffer);

    for (var r = 0; r < h; r += 1) {
      var start = r * w;
      var limit = start + w;
      var range = view.subarray(start, limit);
      var scope = { start: 0, limit: range.length };

      for (var i = 0; i < scope.limit; i += 1) {
        var color = aspect * range[i];
        var brink = aspect * cutoff;

        if (color > brink && scope.start === 0) {
          scope.start = i;
        }

        if (color < brink && scope.start !== 0) {
          range.subarray(scope.start, i).sort();

          // Start again
          scope.start = 0;
        }
      }
    }

    return source
  }
};

module.exports = Butter;

