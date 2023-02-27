// # Butter
// Helps with pixel sorting

export default function butter({
  // Specify color stop in hex including opacity, ends up getting reversed
  // when running comparisons, so just feed in ABGR order for use with big endian systems.
  threshold = "00000000",

  // Use this switch to decide color matching above or below threshold.
  flip = false,
} = {}) {
  // For multiplying color values, normally and by default white ranks
  // higher than black in numeric terms. If the flip switch is set,
  // minus white turns up lower than black.
  const phase = flip ? -1 : 1

  // Process threshold, reverse input string, get integer representation (0 - 4294967295).
  const limit = phase * parseInt(threshold.match(/.{1,2}/g).reverse().join(""), 16)

  // Accepts and returns an `ImageData` like object.
  return function filter(target = { data: [], width: 0, height: 0 }) {
    const bitmap = new Uint32Array(target.data.buffer)

    // Extract dimensions.
    const { height: h, width: w } = target

    // Scan through vertically, line by line.
    for (let y = 0; y < h; y += 1) {
      // Calculate row bounds.
      const a = y * w
      const b = a + w

      // Get current row.
      const strip = bitmap.subarray(a, b)

      // Iterate horizontally upto and including row width (extra step).
      for (let x = 0, start = 0; x <= w; x += 1) {
        // Is `NaN` when index hits row width.
        const color = phase * strip[x]

        // Check if current color is past threshold reference, ie. sorting approved.
        const above = color > limit

        // First match, take note of color index.
        if (!start && above) {
          start = x
        }

        // Time's up, either a match was found or index hit row width.
        if (!above && start) {
          // The upper bound is exclusive, explains the extra step.
          strip.subarray(start, x).sort()

          // All set for next pass.
          start = 0
        }
      }
    }

    return target
  }
}
