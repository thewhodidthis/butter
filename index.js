'use strict';

var Butter = function (ref) {
  if ( ref === void 0 ) ref = {};
  var threshold = ref.threshold; if ( threshold === void 0 ) threshold = '5e7689';
  var flip = ref.flip; if ( flip === void 0 ) flip = false;

  // Over or under (black/white)
  var aspect = flip ? -1 : 1;

  // Pad cutoff if need be
  var cutoff = parseInt((("ffffffff" + threshold)).slice(-8), 16);

  // Expects and returns out `ImageData`
  return function (ref) {
    if ( ref === void 0 ) ref = {};
    var h = ref.height; if ( h === void 0 ) h = 1;
    var w = ref.width; if ( w === void 0 ) w = 1;
    var data = ref.data; if ( data === void 0 ) data = new Uint8ClampedArray(4);

    var result = new ImageData(data, w, h);
    var view32 = new Uint32Array(data.buffer);

    for (var y = 0; y < h; y += 1) {
      var start = y * w;
      var limit = start + w;
      var range = view32.subarray(start, limit);
      var scope = { start: 0, limit: range.length };

      for (var x = 0; x < scope.limit; x += 1) {
        var color = aspect * range[x];
        var brink = aspect * cutoff;

        if (color > brink && scope.start === 0) {
          scope.start = x;
        }

        if (color < brink && scope.start !== 0) {
          range.subarray(scope.start, x).sort();

          // Start again
          scope.start = 0;
        }
      }
    }

    return result
  }
};

module.exports = Butter;

