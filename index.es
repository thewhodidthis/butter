function Butter(threshold, flip) {
  this.threshold = this.getColor(threshold || 'ff5e7689');
  this.flip = flip ? -1 : 1;
}

Butter.prototype = {
  constructor: Butter,

  run(sourceData) {
    // Source data width
    const sourceW = sourceData.width;

    // Source data height
    const sourceH = sourceData.height;

    // Source colors rgba
    const sourcePixels = sourceData.data;

    // Source colors 32bit
    const sourceView32 = new Uint32Array(sourcePixels.buffer);

    // Threshold color
    const thresh = this.threshold;

    // Over or under (black/white)
    const flip = this.flip;

    for (let row = 0; row < sourceH; row += 1) {
      const rowStart = row * sourceW;
      const rowWidth = rowStart + sourceW;

      const range = sourceView32.subarray(rowStart, rowWidth);
      let rangeStart = 0;

      for (let colorIndex = 0; colorIndex < range.length; colorIndex += 1) {
        const color = range[colorIndex];

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

  that(source) {
    // TODO: Check type of args, allow images?
    const sourceData = source.getImageData(0, 0, source.canvas.width, source.canvas.height);

    return this.run(sourceData);
  },

  getColor(color) {
    return parseInt(color, 16);
  }
};

export default Butter;
