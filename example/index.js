const images = document.querySelectorAll('canvas img')
const boards = document.querySelectorAll('canvas')

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe')
}

const upward = Math.PI * 0.5
const params = [
  { threshold: '207030ff', up: 1 },
  { threshold: '808077ff' },
  { threshold: 'bb2277ff', up: 1, flip: 1 }
]

Array.from(images).map(img => img.alt).forEach((src, i) => {
  const config = params[i]
  const canvas = boards[i]
  const target = canvas.getContext('2d')

  const a = config.up ? upward : 0
  const y = config.up ? canvas.height : 0

  const buffer = canvas.cloneNode().getContext('2d')

  buffer.rotate(a)

  const worker = new Worker('worker.js')

  worker.addEventListener('message', (e) => {
    buffer.putImageData(e.data.result, 0, 0)

    target.save()

    if (config.up) {
      target.translate(0, y)
      target.rotate(-a)
    }

    target.drawImage(buffer.canvas, 0, 0)
    target.restore()
  })

  const master = document.createElement('img')

  master.addEventListener('load', () => {
    buffer.drawImage(master, 0, -y)

    const source = buffer.getImageData(0, 0, canvas.height, canvas.width)

    worker.postMessage({ config, source })
  })

  master.setAttribute('src', src)
})
