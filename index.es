const Butter = (options) => {
  // Avoid default params for now
  const config = Object.assign({ cutoff: 'ff5e7689', flip: false }, options)

  // Over or under (black/white)
  const aspect = config.flip ? -1 : 1

  // Threshold color in hex
  const cutoff = parseInt(config.cutoff, 16)

  // Expects and churns out `ImageData`
  return (source) => {
    const { height, width, data } = source
    const view = new Uint32Array(data.buffer)

    for (let r = 0; r < height; r += 1) {
      const start = r * width
      const limit = start + width
      const range = view.subarray(start, limit)
      const scope = { start: 0, limit: range.length }

      for (let i = 0; i < scope.limit; i += 1) {
        const color = aspect * range[i]
        const brink = aspect * cutoff

        if (color > brink && scope.start === 0) {
          scope.start = i
        }

        if (color < brink && scope.start !== 0) {
          range.subarray(scope.start, i).sort()

          // Start again
          scope.start = 0
        }
      }
    }

    return source
  }
}

export default Butter
