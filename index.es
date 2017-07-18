
const Butter = (options) => {
  // Avoid default params for now
  const config = Object.assign({ cutoff: '5e7689', flip: false }, options)

  // Over or under (black/white)
  const aspect = config.flip ? -1 : 1

  // Pad threshold color if need be
  const cutoff = parseInt((`ffffffff${config.cutoff}`).slice(-8), 16)

  // Expects and returns out `ImageData`
  return (source) => {
    const { height: h, width: w, data } = source
    const view = new Uint32Array(data.buffer)

    for (let r = 0; r < h; r += 1) {
      const start = r * w
      const limit = start + w
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
