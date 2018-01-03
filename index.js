'use strict';

var butter = function (ref) {
  if ( ref === void 0 ) ref = {};
  var threshold = ref.threshold; if ( threshold === void 0 ) threshold = '5e7689';
  var flip = ref.flip; if ( flip === void 0 ) flip = false;

  // Over or under, black or white
  var phase = flip ? -1 : 1;

  // Parse threshold, pad if need be
  var limit = phase * parseInt((("ffffffff" + threshold)).slice(-8), 16);

  // Accepts and returns an `ImageData` like object
  return function (target) {
    if ( target === void 0 ) target = { data: [], width: 0, height: 0 };

    var bitmap = new Uint32Array(target.data.buffer);

    // Extract dimensions
    var h = target.height;
    var w = target.width;

    // Scan through vertically, line by line
    for (var y = 0; y < h; y += 1) {
      // Chunk start
      var a = y * w;

      // Chunk stop
      var b = a + w;

      // Slice up
      var chunk = bitmap.subarray(a, b);

      // Go through each line horizontally, sort past the pixels matching color stop
      for (var x = 0, start = 0; x < w; x += 1) {
        var color = phase * chunk[x];

        // Go ahead
        if (color > limit && start === 0) {
          start = x;
        }

        // Time's up
        if (color < limit && start !== 0) {
          chunk.subarray(start, x).sort();

          // Start again
          start = 0;
        }
      }
    }

    return target
  }
};

module.exports = butter;

