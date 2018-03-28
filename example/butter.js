(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.butter = factory());
}(this, (function () { 'use strict';

  const butter = ({ threshold = '5e7689', flip = false } = {}) => {
    // Over or under, black or white
    const phase = flip ? -1 : 1;

    // Parse threshold, pad if need be
    const limit = phase * parseInt((`ffffffff${threshold}`).slice(-8), 16);

    // Accepts and returns an `ImageData` like object
    return (target = { data: [], width: 0, height: 0 }) => {
      const bitmap = new Uint32Array(target.data.buffer);

      // Extract dimensions
      const { height: h, width: w } = target;

      // Scan through vertically, line by line
      for (let y = 0; y < h; y += 1) {
        // Chunk start
        const a = y * w;

        // Chunk stop
        const b = a + w;

        // Slice up
        const chunk = bitmap.subarray(a, b);

        // Go through each line horizontally, sort past the pixels matching color stop
        for (let x = 0, start = 0; x < w; x += 1) {
          const color = phase * chunk[x];

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

  return butter;

})));
