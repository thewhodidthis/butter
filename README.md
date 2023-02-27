## about

For pixel sorting, a rewrite of [butter.js](https://github.com/brandly/butter.js) based on [Kim Asendorf's ASDFPixelSort](https://github.com/kimasendorf/ASDFPixelSort) original processing script.

## setup

Load via script tag:

```html
<!-- Just an IIFE namespaced `butter` -->
<script src="https://thewhodidthis.github.io/butter/butter.js"></script>
```

Source from an import map:

```json
{
  "imports": {
    "@thewhodidthis/butter": "https://thewhodidthis.github.io/butter/main.js"
  }
}
```

Download from GitHub directly if using a package manager:

```sh
# Add to package.json
npm install thewhodidthis/butter
```

## usage

The default and only export is an anonymous function that accepts a settings object and returns another function expecting [`ImageData`](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) type input. For example,

```js
import bender from "https://thewhodidthis.github.io/butter/main.js"

const source = document.createElement("img")
const target = document.createElement("img")
const master = document.createElement("canvas").getContext("2d")

const canvas = Object.assign(master.canvas, { width: 180, height: 180 })
const buffer = canvas.cloneNode().getContext("2d")

const filter = bender()
const upward = 0.5 * Math.PI

source.addEventListener("load", () => {
  buffer.rotate(upward)
  buffer.drawImage(source, 0, -canvas.height)

  const pixels = buffer.getImageData(0, 0, canvas.width, canvas.height)
  const result = filter(pixels)

  buffer.putImageData(result, 0, 0)

  master.translate(0, canvas.height)
  master.rotate(-upward)
  master.drawImage(buffer.canvas, 0, 0)

  const output = canvas.toDataURL("image/jpeg")

  target.setAttribute("src", output)
})

source.setAttribute("crossOrigin", "anonymous")
source.setAttribute(
  "src",
  `//source.unsplash.com/random/${canvas.width}x${canvas.height}`,
)
```

## see also

- [Pixel bending with butter and crook](https://thewhodidthis.com/pixel-bending-with-butter-and-crook/)
