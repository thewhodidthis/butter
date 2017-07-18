const images = document.querySelectorAll('li > img')
const boards = document.querySelectorAll('canvas')

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe')
}

const params = [
  { cutoff: '332200', up: true },
  { cutoff: '77838c' },
  { cutoff: '81aeb6', up: true, flip: true }
]

Array.from(images).map(img => img.src).forEach((file, i) => {
  const config = params[i]
  const canvas = boards[i]
  const master = canvas.getContext('2d')
  const buffer = canvas.cloneNode().getContext('2d')

  const source = document.createElement('img')
  const output = master.getImageData(0, 0, canvas.height, canvas.width)
  const worker = new Worker('worker.js')

  worker.addEventListener('message', (e) => {
    output.data.set(e.data.result.data)
    buffer.putImageData(output, 0, 0)

    master.save()

    if (config.up) {
      master.translate(0, canvas.height)
      master.rotate(-Math.PI * 0.5)
    }

    master.drawImage(buffer.canvas, 0, 0)
    master.restore()
  })

  source.addEventListener('load', () => {
    const angle = config.up ? Math.PI * 0.5 : 0
    const shift = config.up ? -1 * canvas.height : 0

    buffer.rotate(angle)
    buffer.drawImage(source, 0, shift)

    worker.postMessage({
      config,
      source: buffer.getImageData(0, 0, canvas.height, canvas.width)
    })
  })

  source.setAttribute('src', file)
})
