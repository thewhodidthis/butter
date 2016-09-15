'use strict';

function Butter(threshold, flip) {
  this.threshold = this.getColor(threshold || 'ff5e7689');

  this.flip = flip ? -1 : 1;
}

Butter.prototype = {
  constructor: Butter,

  _run: function _run(sourceData) {

    // Source data width
    var sourceW = sourceData.width;

    // Source data height
    var sourceH = sourceData.height;

    // Source colors rgba
    var sourcePixels = sourceData.data;

    // Source colors 32bit
    var sourceView32 = new Uint32Array(sourcePixels.buffer);

    // Threshold color
    var thresh = this.threshold;

    // Over or under (black/white)
    var flip = this.flip;

    for (var row = 0; row < sourceH; row += 1) {
      var rowStart = row * sourceW;
      var rowWidth = rowStart + sourceW;

      var rangeStart = 0;
      var range = sourceView32.subarray(rowStart, rowWidth);

      for (var colorIndex = 0; colorIndex < range.length; colorIndex += 1) {
        var color = range[colorIndex];

        if (flip * color > flip * thresh && rangeStart === 0) {
          rangeStart = colorIndex;
        }

        if (flip * color < flip * thresh && rangeStart !== 0) {
          range.subarray(rangeStart, colorIndex).sort();

          // Start again
          rangeStart = 0;
        }
      }
    }

    return sourceData;
  },

  that: function that(source) {

    // TODO: Check type of args, allow images?
    var sourceData = source.getImageData(0, 0, source.canvas.width, source.canvas.height);

    return this._run(sourceData);
  },

  getColor: function getColor(color) {
    return parseInt(color, 16);
  }
};

module.exports = Butter;
