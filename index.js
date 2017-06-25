'use strict';

var Butter = function Butter(options) {
  var settings = Object.assign({ cutoff: 'ff5e7689', flip: false }, options);

  // Over or under (black/white)
  var aspect = settings.flip ? -1 : 1;

  // Calculate threshold
  var cutoff = parseInt(settings.cutoff, 16);

  // Expects and churns out `ImageData`
  return function (source) {
    // Source data dimensions
    var sourceW = source.width;
    var sourceH = source.height;

    // Source colors 32bit
    var sourceView32 = new Uint32Array(source.data.buffer);

    for (var row = 0; row < sourceH; row += 1) {
      var rowStart = row * sourceW;
      var rowWidth = rowStart + sourceW;

      var range = sourceView32.subarray(rowStart, rowWidth);

      var rangeStart = 0;

      for (var colorIndex = 0, total = range.length; colorIndex < total; colorIndex += 1) {
        var color = range[colorIndex];

        if (aspect * color > aspect * cutoff && rangeStart === 0) {
          rangeStart = colorIndex;
        }

        if (aspect * color < aspect * cutoff && rangeStart !== 0) {
          range.subarray(rangeStart, colorIndex).sort();

          // Start again
          rangeStart = 0;
        }
      }
    }

    return source;
  };
};

module.exports = Butter;
