const Butter = ({ threshold = '5e7689', flip = false } = {}) => {
  // Over or under, black or white
  const aspect = flip ? -1 : 1

  // Pad threshold if need be
  const cutoff = parseInt((`ffffffff${threshold}`).slice(-8), 16)

  // Expects and returns out `ImageData`
  return ({ height: h = 1, width: w = 1, data = new Uint8ClampedArray(4) } = {}) => {
    const result = new ImageData(data, w, h)
    const view32 = new Uint32Array(data.buffer)

    for (let y = 0; y < h; y += 1) {
      const start = y * w
      const limit = start + w
      const range = view32.subarray(start, limit)
      const scope = { start: 0, limit: range.length }

      for (let x = 0; x < scope.limit; x += 1) {
        const color = aspect * range[x]
        const brink = aspect * cutoff

        if (color > brink && scope.start === 0) {
          scope.start = x
        }

        if (color < brink && scope.start !== 0) {
          range.subarray(scope.start, x).sort()

          // Start again
          scope.start = 0
        }
      }
    }

    return result
  }
}

export default Butter
