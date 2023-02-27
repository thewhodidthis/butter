importScripts("./butter.js")

self.addEventListener("message", ({ data }) => {
  const filter = butter(data.config)

  self.postMessage({ result: filter(data.source) })
})
