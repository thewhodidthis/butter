'use strict';

var Butter = function (options) {
  // Avoid default params for now
  var config = Object.assign({ cutoff: 'ff5e7689', flip: false }, options);

  // Over or under (black/white)
  var aspect = config.flip ? -1 : 1;

  // Threshold color in hex
  var cutoff = parseInt(config.cutoff, 16);

  // Expects and churns out `ImageData`
  return function (source) {
    var height = source.height;
    var width = source.width;
    var data = source.data;
    var view = new Uint32Array(data.buffer);

    for (var r = 0; r < height; r += 1) {
      var start = r * width;
      var limit = start + width;
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

