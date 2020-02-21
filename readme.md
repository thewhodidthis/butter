## Butter
> For pixel sorting

### Setup
```sh
# Fetch latest from github
npm i thewhodidthis/butter
```

### Usage
```js
import bender from '@thewhodidthis/butter'

const source = document.createElement('img')
const target = document.createElement('img')
const master = document.createElement('canvas').getContext('2d')

const canvas = Object.assign(master.canvas, { width: 180, height: 180 })
const buffer = canvas.cloneNode().getContext('2d')

const filter = bender()
const upward = 0.5 * Math.PI

source.addEventListener('load', () => {
  buffer.rotate(upward)
  buffer.drawImage(source, 0, -canvas.height)

  const pixels = buffer.getImageData(0, 0, canvas.width, canvas.height)
  const result = filter(pixels)

  buffer.putImageData(result, 0, 0)

  master.translate(0, canvas.height)
  master.rotate(-upward)
  master.drawImage(buffer.canvas, 0, 0)

  const output = canvas.toDataURL('image/jpeg')

  target.setAttribute('src', output)
})

source.setAttribute('crossOrigin', 'anonymous')
source.setAttribute('src', `//source.unsplash.com/random/${canvas.width}x${canvas.height}`)
```

### More
- [butter.js](https://github.com/brandly/butter.js "Original butter.js")
- [ASDFPixelSort](https://github.com/kimasendorf/ASDFPixelSort "Kim Asendorf's processing code")
