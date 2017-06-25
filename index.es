const Butter = (options) => {
  const settings = Object.assign({ cutoff: 'ff5e7689', flip: false }, options);

  // Over or under (black/white)
  const aspect = settings.flip ? -1 : 1;

  // Calculate threshold
  const cutoff = parseInt(settings.cutoff, 16);

  // Expects and churns out `ImageData`
  return (source) => {
    // Source data dimensions
    const sourceW = source.width;
    const sourceH = source.height;

    // Source colors 32bit
    const sourceView32 = new Uint32Array(source.data.buffer);

    for (let row = 0; row < sourceH; row += 1) {
      const rowStart = row * sourceW;
      const rowWidth = rowStart + sourceW;

      const range = sourceView32.subarray(rowStart, rowWidth);

      let rangeStart = 0;

      for (let colorIndex = 0, total = range.length; colorIndex < total; colorIndex += 1) {
        const color = range[colorIndex];

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

export default Butter;

