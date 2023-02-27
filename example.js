const settings = [
  { threshold: "207030ff", up: 1 },
  { threshold: "808077ff" },
  { threshold: "bb2277ff", up: 1, flip: 1 },
]

const boards = document.querySelectorAll("canvas")

Array.from(boards).forEach((canvas, i) => {
  const target = canvas.getContext("2d")
  const config = settings[i]

  const a = config.up ? Math.PI * 0.5 : 0
  const y = config.up ? canvas.height : 0

  const buffer = canvas.cloneNode().getContext("2d")

  buffer.rotate(a)

  const master = document.createElement("img")
  const worker = new Worker("worker.js")

  master.addEventListener("load", () => {
    buffer.drawImage(master, 0, -y)

    const source = buffer.getImageData(0, 0, canvas.height, canvas.width)

    worker.postMessage({ config, source })
  })

  worker.addEventListener("message", ({ data }) => {
    buffer.putImageData(data.result, 0, 0)
    target.save()

    if (config.up) {
      target.translate(0, y)
      target.rotate(-a)
    }

    target.drawImage(buffer.canvas, 0, 0)
    target.restore()
  })

  master.setAttribute("src", canvas.dataset.src)
})
